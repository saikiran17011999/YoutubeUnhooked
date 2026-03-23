/**
 * VideoPlayer Component
 * YouTube embedded video player
 */

import { useState, useRef, useCallback } from 'react';
import ReactPlayer from 'react-player/youtube';

export function VideoPlayer({ videoId, onProgress, onReady }) {
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const playerRef = useRef(null);

  const handleProgress = useCallback(
    (state) => {
      setPlayed(state.played);
      if (onProgress) {
        onProgress(state);
      }
    },
    [onProgress]
  );

  const handleReady = useCallback(() => {
    if (onReady && playerRef.current) {
      onReady(playerRef.current);
    }
  }, [onReady]);

  const seekTo = useCallback((seconds) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, 'seconds');
    }
  }, []);

  const getCurrentTime = useCallback(() => {
    if (playerRef.current) {
      return Math.floor(playerRef.current.getCurrentTime());
    }
    return 0;
  }, []);

  return (
    <div className="aspect-video bg-black rounded-xl overflow-hidden">
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${videoId}`}
        width="100%"
        height="100%"
        playing={playing}
        controls
        onProgress={handleProgress}
        onReady={handleReady}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
            },
          },
        }}
      />
    </div>
  );
}

export default VideoPlayer;
