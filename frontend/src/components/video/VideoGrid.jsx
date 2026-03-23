/**
 * VideoGrid Component
 * Grid layout for video cards
 */

import { VideoCard } from './VideoCard';
import { VideoGridSkeleton } from '../common';

export function VideoGrid({
  videos,
  loading,
  onStatusChange,
  onDelete,
  emptyMessage = 'No videos found',
}) {
  if (loading) {
    return <VideoGridSkeleton count={8} />;
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-yt-text-secondary">
        <svg
          className="w-24 h-24 mb-4 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard
          key={video._id}
          video={video}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default VideoGrid;
