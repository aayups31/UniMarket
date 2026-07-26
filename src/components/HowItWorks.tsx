'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type MotionPreference = 'allow' | 'pending' | 'reduce';
type MotionSceneName = 'access' | 'browse' | 'network';

type MotionScene = {
  caption: string;
  name: MotionSceneName;
  number: string;
};

const motionScenes: MotionScene[] = [
  {
    name: 'access',
    number: '01',
    caption: 'One Waterloo email. Your campus opens.',
  },
  {
    name: 'browse',
    number: '02',
    caption: 'Find what Waterloo already has.',
  },
  {
    name: 'network',
    number: '03',
    caption: 'One university identity brings everyone closer.',
  },
];

export function HowItWorks() {
  return (
    <section
      aria-labelledby="inside-unimarket-heading"
      className="relative scroll-mt-24 overflow-hidden bg-transparent px-4 py-20 text-[#eee9df] sm:px-6 sm:py-28 lg:py-36"
      id="how-it-works"
    >
      <div className="relative mx-auto max-w-um-content">
        <header className="mb-12 flex flex-col gap-5 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-condensed text-xs font-bold uppercase tracking-[0.18em] text-um-gold-400">
              Inside UniMarket
            </p>
            <h2
              className="um-balanced mt-4 max-w-3xl text-[clamp(2.6rem,5vw,5.25rem)] font-bold leading-[0.96] tracking-[-0.038em]"
              id="inside-unimarket-heading"
            >
              Your campus,
              <span className="font-editorial font-normal tracking-[-0.02em] text-um-gold-300">
                {' '}
                already connected.
              </span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-white/46 sm:pb-1 sm:text-right">
            One identity. One marketplace. Only Waterloo.
          </p>
        </header>

        <ol className="grid list-none gap-x-5 gap-y-12 p-0 md:grid-cols-2 xl:grid-cols-[0.96fr_1.08fr_0.96fr] xl:items-start">
          {motionScenes.map((scene, index) => (
            <li
              className={
                index === 2
                  ? 'md:col-span-2 md:mx-auto md:w-[calc(50%-0.625rem)] xl:col-span-1 xl:w-full'
                  : index === 1
                    ? 'xl:-mt-7'
                    : ''
              }
              key={scene.name}
            >
              <MotionStory scene={scene} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function MotionStory({ scene }: { scene: MotionScene }) {
  return (
    <figure
      className={`um-motion-card um-motion-card--${scene.name} group relative min-w-0 overflow-hidden`}
    >
      <MotionFilm scene={scene.name} />

      <figcaption className="um-motion-caption">
        <span
          aria-hidden="true"
          className="font-mono text-[0.58rem] font-semibold tracking-[0.18em] text-um-gold-400/68"
        >
          {scene.number}
        </span>
        <span className="text-[1.03rem] font-semibold leading-6 tracking-[-0.012em] text-[#e9e4d9]">
          {scene.caption}
        </span>
      </figcaption>
    </figure>
  );
}

function MotionFilm({ scene }: { scene: MotionSceneName }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loopIsCoveredRef = useRef(false);
  const loopRevealIsPendingRef = useRef(false);
  const loopRevealFrameRef = useRef<number | null>(null);
  const loopRevealAnimationFrameRef = useRef<number | null>(null);
  const loopRevealVideoRef = useRef<HTMLVideoElement | null>(null);
  const [motionPreference, setMotionPreference] = useState<MotionPreference>('pending');
  const [sourceIsAttached, setSourceIsAttached] = useState(false);
  const [stageIsVisible, setStageIsVisible] = useState(false);
  const [pageIsVisible, setPageIsVisible] = useState(true);
  const [videoHasDecodedFrame, setVideoHasDecodedFrame] = useState(false);
  const [loopIsCovered, setLoopIsCovered] = useState(false);

  const poster = `/motion/${scene}-poster.webp`;
  const video = `/motion/${scene}.webm`;
  const loopCoverIsEnabled = scene === 'browse';

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => {
      if (query.matches) {
        loopIsCoveredRef.current = false;
        loopRevealIsPendingRef.current = false;
        setLoopIsCovered(false);
        setVideoHasDecodedFrame(false);
      }

      setMotionPreference(query.matches ? 'reduce' : 'allow');
    };

    syncPreference();
    query.addEventListener('change', syncPreference);

    return () => query.removeEventListener('change', syncPreference);
  }, []);

  useEffect(() => {
    const syncPageVisibility = () => setPageIsVisible(document.visibilityState === 'visible');

    syncPageVisibility();
    document.addEventListener('visibilitychange', syncPageVisibility);

    return () => document.removeEventListener('visibilitychange', syncPageVisibility);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || motionPreference !== 'allow') return;

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setSourceIsAttached(true);
        preloadObserver.disconnect();
      },
      {
        rootMargin: '480px 0px',
        threshold: 0,
      },
    );

    preloadObserver.observe(stage);

    return () => preloadObserver.disconnect();
  }, [motionPreference]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || motionPreference !== 'allow') {
      setStageIsVisible(false);
      return;
    }

    const playbackObserver = new IntersectionObserver(
      ([entry]) => {
        setStageIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.18);
      },
      {
        threshold: [0, 0.18, 0.5],
      },
    );

    playbackObserver.observe(stage);

    return () => playbackObserver.disconnect();
  }, [motionPreference]);

  useEffect(() => {
    if (!sourceIsAttached || motionPreference !== 'allow') return;

    videoRef.current?.load();
  }, [motionPreference, sourceIsAttached]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    if (!sourceIsAttached || motionPreference !== 'allow' || !stageIsVisible || !pageIsVisible) {
      element.pause();
      return;
    }

    let cancelled = false;
    const play = () => {
      if (cancelled) return;

      void element.play().catch(() => {
        // The poster remains visible if a browser declines programmatic playback.
      });
    };

    if (element.readyState >= 2) {
      play();
    } else {
      element.addEventListener('canplay', play, { once: true });
    }

    return () => {
      cancelled = true;
      element.removeEventListener('canplay', play);
    };
  }, [motionPreference, pageIsVisible, sourceIsAttached, stageIsVisible]);

  useEffect(
    () => () => {
      if (loopRevealAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(loopRevealAnimationFrameRef.current);
      }

      const videoElement = loopRevealVideoRef.current;
      if (videoElement && loopRevealFrameRef.current !== null) {
        videoElement.cancelVideoFrameCallback?.(loopRevealFrameRef.current);
      }
    },
    [],
  );

  const coverLoopBoundary = () => {
    if (loopIsCoveredRef.current) return;

    loopIsCoveredRef.current = true;
    setLoopIsCovered(true);
  };

  const revealLoopStart = (element: HTMLVideoElement) => {
    if (loopRevealIsPendingRef.current) return;

    loopRevealIsPendingRef.current = true;
    loopRevealVideoRef.current = element;

    const reveal = () => {
      loopRevealAnimationFrameRef.current = window.requestAnimationFrame(() => {
        loopRevealAnimationFrameRef.current = null;
        loopRevealFrameRef.current = null;
        loopRevealVideoRef.current = null;
        loopRevealIsPendingRef.current = false;
        loopIsCoveredRef.current = false;
        setLoopIsCovered(false);
      });
    };

    if (typeof element.requestVideoFrameCallback === 'function') {
      loopRevealFrameRef.current = element.requestVideoFrameCallback(reveal);
    } else {
      reveal();
    }
  };

  const handleTimeUpdate = (element: HTMLVideoElement) => {
    if (!loopCoverIsEnabled) return;
    if (!Number.isFinite(element.duration) || element.duration <= 0) return;

    const timeRemaining = element.duration - element.currentTime;

    // Cover the decoder before it reaches the container boundary. Once the
    // native loop has wrapped, wait for a real first frame before revealing it.
    if (!loopIsCoveredRef.current && timeRemaining <= 1.05) {
      coverLoopBoundary();
    } else if (loopIsCoveredRef.current && element.currentTime <= 0.35) {
      revealLoopStart(element);
    }
  };

  return (
    <div className={`um-motion-film-frame um-motion-film-frame--${scene}`} ref={stageRef}>
      <Image
        alt=""
        aria-hidden="true"
        className={`um-motion-film-poster object-cover ${
          videoHasDecodedFrame ? 'um-motion-film-poster--video-ready' : ''
        }`}
        fill
        priority={false}
        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        src={poster}
      />

      {motionPreference === 'allow' ? (
        <video
          aria-hidden="true"
          className={`um-motion-film ${videoHasDecodedFrame ? 'um-motion-film--ready' : ''}`}
          controls={false}
          disablePictureInPicture
          loop
          muted
          onEmptied={() => setVideoHasDecodedFrame(false)}
          onLoadedData={() => setVideoHasDecodedFrame(true)}
          onPlaying={() => setVideoHasDecodedFrame(true)}
          onTimeUpdate={(event) => handleTimeUpdate(event.currentTarget)}
          playsInline
          preload="none"
          ref={videoRef}
          tabIndex={-1}
        >
          {sourceIsAttached ? <source src={video} type="video/webm" /> : null}
        </video>
      ) : null}

      {loopCoverIsEnabled ? (
        <span
          aria-hidden="true"
          className={`um-motion-loop-cover ${loopIsCovered ? 'um-motion-loop-cover--active' : ''}`}
        />
      ) : null}
    </div>
  );
}
