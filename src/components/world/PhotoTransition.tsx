import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useNearViewport } from "../../hooks/useNearViewport";

/** Original curved image wipe rendered in WebGL; the underlying HTML image is the fallback. */
export default function PhotoTransition({ src }: { src: string }) {
  const host = useRef<HTMLDivElement>(null);
  const near = useNearViewport(host);
  const reduced = useReducedMotion();
  const update = useRef<((path: string) => void) | null>(null);
  const latest = useRef(src);
  latest.current = src;
  useEffect(() => {
    update.current?.(src);
  }, [src]);
  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    const node = host.current;
    if (!node || !near) return;
    void import("three")
      .then(async (THREE) => {
        const { default: gsap } = await import("gsap");
        if (cancelled) return;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2", {
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
        });
        if (!context) {
          node.dataset.webgl = "unavailable";
          return;
        }
        const renderer = new THREE.WebGLRenderer({
          canvas,
          context,
          alpha: true,
          antialias: false,
        });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        const scene = new THREE.Scene(),
          camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const textures = new Set<InstanceType<typeof THREE.Texture>>();
        const loader = new THREE.TextureLoader();
        let sequence = 0;
        const values = {
          uFrom: { value: null as InstanceType<typeof THREE.Texture> | null },
          uTo: { value: null as InstanceType<typeof THREE.Texture> | null },
          uFromSize: { value: new THREE.Vector2(1, 1) },
          uToSize: { value: new THREE.Vector2(1, 1) },
          uSize: { value: new THREE.Vector2(1, 1) },
          uProgress: { value: 1 },
        };
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
          uniforms: values,
          depthTest: false,
          depthWrite: false,
          vertexShader:
            "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
          fragmentShader: `
     varying vec2 vUv;
     uniform sampler2D uFrom,uTo;
     uniform vec2 uFromSize,uToSize,uSize;
     uniform float uProgress;
     vec2 cover(vec2 uv,vec2 image){float frame=uSize.x/uSize.y;float ratio=image.x/image.y;vec2 scale=vec2(min(frame/ratio,1.),min(ratio/frame,1.));return (uv-.5)*scale+.5;}
     void main(){
      float arc=sin(vUv.y*3.14159265)*.12*sin(uProgress*3.14159265);
      float edge=uProgress*1.3-.15;
      float blend=1.-smoothstep(edge-.015,edge+.015,vUv.x+arc);
      vec2 bend=vec2(sin(vUv.y*5.)*.018*sin(uProgress*3.14159265),0.);
      gl_FragColor=mix(texture2D(uFrom,cover(vUv+bend,uFromSize)),texture2D(uTo,cover(vUv-bend,uToSize)),blend);
      #include <colorspace_fragment>
     }`,
        });
        scene.add(new THREE.Mesh(geometry, material));
        node.append(canvas);
        const render = () => {
          if (values.uFrom.value && values.uTo.value)
            renderer.render(scene, camera);
        };
        const resize = () => {
          const { width, height } = node.getBoundingClientRect();
          renderer.setSize(width, height, false);
          values.uSize.value.set(width, Math.max(height, 1));
          render();
        };
        const observer = new ResizeObserver(resize);
        observer.observe(node);
        resize();
        const show = async (path: string) => {
          const request = ++sequence;
          try {
            const responsive =
              /^\/images\/(story-farmland|farm-estate|farmhouse|garden-planter|living-fields|sunflowers)\.webp$/.test(
                path,
              )
                ? path.replace(
                    ".webp",
                    `-${node.clientWidth * Math.min(devicePixelRatio, 1.5) > 1280 ? 1920 : 1280}.webp`,
                  )
                : path;
            const texture = await loader.loadAsync(responsive);
            if (cancelled || request !== sequence) {
              texture.dispose();
              return;
            }
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.generateMipmaps = false;
            texture.minFilter = THREE.LinearFilter;
            textures.add(texture);
            gsap.killTweensOf(values.uProgress);
            const previous = values.uTo.value;
            values.uFrom.value = previous ?? texture;
            values.uFromSize.value.copy(values.uToSize.value);
            values.uTo.value = texture;
            values.uToSize.value.set(texture.image.width, texture.image.height);
            if (!previous) values.uFromSize.value.copy(values.uToSize.value);
            values.uProgress.value = previous && !reduced ? 0 : 1;
            node.dataset.webgl = "ready";
            render();
            if (previous && !reduced)
              gsap.to(values.uProgress, {
                value: 1,
                duration: 1,
                ease: "power2.inOut",
                onUpdate: render,
                onComplete: () => {
                  textures.forEach((t) => {
                    if (t !== texture) {
                      t.dispose();
                      textures.delete(t);
                    }
                  });
                  values.uFrom.value = texture;
                  values.uFromSize.value.copy(values.uToSize.value);
                },
              });
            else
              textures.forEach((t) => {
                if (t !== texture) {
                  t.dispose();
                  textures.delete(t);
                }
              });
          } catch {
            if (!cancelled) node.dataset.webgl = "unavailable";
          }
        };
        update.current = show;
        void show(latest.current);
        const lost = (event: Event) => {
          event.preventDefault();
          node.dataset.webgl = "unavailable";
        };
        canvas.addEventListener("webglcontextlost", lost);
        cleanup = () => {
          sequence++;
          update.current = null;
          observer.disconnect();
          canvas.removeEventListener("webglcontextlost", lost);
          gsap.killTweensOf(values.uProgress);
          textures.forEach((t) => t.dispose());
          material.dispose();
          geometry.dispose();
          renderer.dispose();
          canvas.remove();
        };
      })
      .catch(() => {
        if (!cancelled) node.dataset.webgl = "unavailable";
      });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduced, near]);
  return <div ref={host} className="photo-transition" aria-hidden="true" />;
}
