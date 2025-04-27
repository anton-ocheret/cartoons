'use client';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import Hls from 'hls.js/dist/hls.light';

interface Props extends React.HTMLProps<HTMLVideoElement> {
  videoUrl: string;
}

const HLSPlayer = forwardRef<HTMLVideoElement, Props>(
  ({ videoUrl, ...props }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(ref, () => videoRef.current!); // Expose internal ref to forwardedRef. (Allows for callback & regular useRef)

    useEffect(() => {
      if (!videoRef.current) return;

      let hls: Hls | null;
      if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) { // Safari
        videoRef.current.src = videoUrl;
      } else if (Hls.isSupported()) {
        const hls = new Hls();

        hls.loadSource(videoUrl);
        hls.attachMedia(videoRef.current);
      }

      return () => {
        if (hls) {
          hls.destroy();
          hls = null;
        }
      };
    }, [videoUrl]);

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

// Hls.Events.MEDIA_ENDED

export default HLSPlayer;