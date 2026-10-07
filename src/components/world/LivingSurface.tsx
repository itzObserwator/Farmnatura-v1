import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { naturalFarmingMotion } from "../../animation/naturalFarmingMotion";

/** Original pointer-responsive organic surface. CSS retains the shape without WebGL. */
export default function LivingSurface({
  className,
  color,
}: {
  className: string;
  color: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = host.current;
    if (!node || reduced) return;
    let disposed = false;
    let cleanup = () => {};
    void import("three")
      .then((THREE) => {
        if (disposed) return;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2", {
          alpha: true,
          antialias: true,
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
        });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        const geometry = new THREE.PlaneGeometry(2, 2);
        const uniforms = {
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2(2, 2) },
          uColor: { value: new THREE.Color(color) },
          uStrength: { value: 0 },
        };
        const material = new THREE.ShaderMaterial({
          transparent: true,
          depthTest: false,
          uniforms,
          vertexShader:
            "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.);}",
          fragmentShader: `
          varying vec2 vUv;uniform float uTime,uStrength;uniform vec2 uPointer;uniform vec3 uColor;
          void main(){
            vec2 p=(vUv-.5)*2.;float angle=atan(p.y,p.x);
            float radius=.83+.065*sin(angle*3.+.7)+.035*cos(angle*5.-.8);
            radius+=${naturalFarmingMotion.surfaces.idleStrength}*sin(angle*4.+uTime*.75);
            float nearPointer=exp(-length(vUv-uPointer)*9.);
            radius+=nearPointer*uStrength;
            float alpha=1.-smoothstep(radius-.006,radius+.006,length(p));
            gl_FragColor=vec4(uColor,alpha);
            #include <colorspace_fragment>
          }`,
        });
        const scene = new THREE.Scene();
        scene.add(new THREE.Mesh(geometry, material));
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const target = new THREE.Vector2(2, 2);
        let strength = 0,
          visible = false;
        const resize = () =>
          renderer.setSize(node.clientWidth, node.clientHeight, false);
        const pointer = (event: PointerEvent) => {
          const rect = node.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width;
          const y = 1 - (event.clientY - rect.top) / rect.height;
          target.set(x, y);
          strength =
            x > -0.15 && x < 1.15 && y > -0.15 && y < 1.15
              ? naturalFarmingMotion.surfaces.pointerStrength
              : 0;
        };
        const reset = () => {
          strength = 0;
        };
        const tick = (time: number) => {
          if (!visible || document.hidden) return;
          uniforms.uTime.value = time;
          uniforms.uPointer.value.lerp(
            target,
            naturalFarmingMotion.surfaces.spring,
          );
          uniforms.uStrength.value +=
            (strength - uniforms.uStrength.value) *
            naturalFarmingMotion.surfaces.spring;
          renderer.render(scene, camera);
        };
        const observer = new IntersectionObserver((entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
          if (visible) gsap.ticker.add(tick);
          else gsap.ticker.remove(tick);
        });
        const sizing = new ResizeObserver(resize);
        node.appendChild(canvas);
        resize();
        renderer.render(scene, camera);
        node.dataset.webgl = "ready";
        observer.observe(node);
        sizing.observe(node);
        window.addEventListener("pointermove", pointer, { passive: true });
        window.addEventListener("blur", reset);
        cleanup = () => {
          gsap.ticker.remove(tick);
          observer.disconnect();
          sizing.disconnect();
          window.removeEventListener("pointermove", pointer);
          window.removeEventListener("blur", reset);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          canvas.remove();
          delete node.dataset.webgl;
        };
      })
      .catch(() => {
        if (!disposed) node.dataset.webgl = "unavailable";
      });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [color, reduced]);
  return (
    <div
      ref={host}
      className={`${className} living-surface`}
      aria-hidden="true"
      data-webgl={reduced ? "reduced" : "loading"}
    />
  );
}
