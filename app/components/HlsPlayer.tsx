'use client';

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import Hls from 'hls.js/dist/hls.light';
import { useParams, useRouter } from 'next/navigation';

interface Props extends React.HTMLProps<HTMLVideoElement> {
  videoUrl: string;
  hasNextEpisode: boolean;
  hasNextSeason: boolean;
}

const HLSPlayer = forwardRef<HTMLVideoElement, Props>(
  ({ videoUrl, hasNextEpisode, hasNextSeason, ...props }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();
    const params = useParams();
    const hasPlayedRef = useRef(false);

    useImperativeHandle(ref, () => ({
      ...videoRef.current!,
      seekToTime: () => {
        if (videoRef.current) {
          videoRef.current.currentTime = 80; // 1:20 in seconds
        }
      }
    }));

    useEffect(() => {
      if (!videoRef.current) return;

      let hls: Hls | null;
      if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) { // Safari
        videoRef.current.src = videoUrl;
      } else if (Hls.isSupported()) {
        const hls = new Hls();

        hls.loadSource(videoUrl);
        hls.attachMedia(videoRef.current);
        
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          videoRef.current?.addEventListener('play', () => {
            console.dir(videoRef.current);
            if (videoRef.current && !hasPlayedRef.current) {
              videoRef.current.currentTime = 50;
              hasPlayedRef.current = true;
            }
          });
        });

        hls.on((Hls.Events as any).MEDIA_ENDED, () => {
          if (hasNextEpisode) {
            router.push(`/simpsons/${params.season}/episode/${Number(params.episode) + 1}`);
            return;
          } else if (hasNextSeason) {
            router.push(`/simpsons/${Number(params.season) + 1}/episode/1`);
          }
        });
      }

      return () => {
        if (hls) {
          hls.destroy();
          hls = null;
        }
      };
    }, [videoUrl, router, params, hasNextEpisode, hasNextSeason]);

    return (
      <video
        className='w-full'
        {...props}
        ref={videoRef}
        controls
        playsInline
        preload='auto'
        loop={false}
      />
    );
  }
);

HLSPlayer.displayName = 'HLSPlayer';

export default HLSPlayer;