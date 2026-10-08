import { useCallback, useEffect, useRef, useState } from "react";

/** One shared music player continues across routes and starts on user request. */
export function useAmbientSound() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const requested = useRef(false);
  const frame = useRef<number | null>(null);

  const cancelFade = useCallback(() => {
    if (frame.current !== null) window.clearTimeout(frame.current);
    frame.current = null;
  }, []);

  const fadeTo = useCallback(
    (target: number, done?: () => void) => {
      cancelFade();
      const audio = audioRef.current;
      if (!audio) return;
      const startVolume = audio.volume;
      const started = performance.now();
      const tick = (time: number) => {
        const progress = Math.min((time - started) / 1200, 1);
        audio.volume = startVolume + (target - startVolume) * progress;
        if (progress < 1) frame.current = window.setTimeout(() => tick(performance.now()), 50);
        else {
          frame.current = null;
          done?.();
        }
      };
      frame.current = window.setTimeout(() => tick(performance.now()), 50);
    },
    [cancelFade],
  );

  const stopOnError = useCallback(() => {
    requested.current = false;
    cancelFade();
    audioRef.current?.pause();
    setEnabled(false);
  }, [cancelFade]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    void audio
      .play()
      .then(() => {
        if (!requested.current) return;
        setEnabled(true);
        fadeTo(0.18);
      })
      .catch(stopOnError);
  }, [fadeTo, stopOnError]);

  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || requested.current) return;
    requested.current = true;
    // Call play during the CTA's click gesture, before the entrance animation.
    cancelFade();
    audio.volume = 0;
    play();
  }, [cancelFade, play]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!requested.current) start();
    else {
      requested.current = false;
      setEnabled(false);
      fadeTo(0, () => audio.pause());
    }
  }, [fadeTo, start]);

  useEffect(() => {
    const audio = audioRef.current;
    const visibility = () => {
      cancelFade();
      if (document.hidden) audio?.pause();
      else if (requested.current) {
        if (audio) audio.volume = 0;
        play();
      }
    };
    audio?.addEventListener("error", stopOnError);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      requested.current = false;
      cancelFade();
      audio?.pause();
      audio?.removeEventListener("error", stopOnError);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [cancelFade, play, stopOnError]);

  return { audioRef, enabled, start, toggle };
}
