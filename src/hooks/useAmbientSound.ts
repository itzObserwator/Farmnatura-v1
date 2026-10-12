import { useCallback, useEffect, useRef, useState } from "react";

/** Shared music starts at entry and continues across routes, with gesture fallback. */
export function useAmbientSound(autoStart = false) {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const requested = useRef(false);
  const waitingForGesture = useRef(false);
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
        if (progress < 1)
          frame.current = window.setTimeout(() => tick(performance.now()), 50);
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
        waitingForGesture.current = false;
        setEnabled(true);
        fadeTo(0.18);
      })
      .catch((error: unknown) => {
        if (!(
          error instanceof DOMException && error.name === "NotAllowedError"
        ))
          waitingForGesture.current = false;
        stopOnError();
      });
  }, [fadeTo, stopOnError]);

  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || requested.current) return;
    requested.current = true;
    // Attempt immediately; blocked autoplay is retried during a user gesture.
    cancelFade();
    audio.volume = 0;
    play();
  }, [cancelFade, play]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!requested.current) start();
    else {
      waitingForGesture.current = false;
      requested.current = false;
      setEnabled(false);
      fadeTo(0, () => audio.pause());
    }
  }, [fadeTo, start]);

  useEffect(() => {
    const audio = audioRef.current;
    const unlock = (event: Event) => {
      if (!waitingForGesture.current) return;
      // The sound button handles its own gesture, avoiding a double toggle.
      if (
        event.target instanceof Element &&
        event.target.closest(".sound-toggle")
      )
        return;
      start();
    };
    const visibility = () => {
      cancelFade();
      if (document.hidden) audio?.pause();
      else if (requested.current) {
        if (audio) audio.volume = 0;
        play();
      }
    };
    audio?.addEventListener("error", stopOnError);
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      requested.current = false;
      waitingForGesture.current = false;
      cancelFade();
      audio?.pause();
      audio?.removeEventListener("error", stopOnError);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [cancelFade, play, start, stopOnError]);

  useEffect(() => {
    if (!autoStart) return;
    waitingForGesture.current = true;
    start();
  }, [autoStart, start]);

  return { audioRef, enabled, start, toggle };
}
