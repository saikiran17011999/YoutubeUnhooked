/**
 * VideoCard Component
 * YouTube-style video thumbnail card
 */

import { Link } from 'react-router-dom';
import { Heart, Eye, RefreshCw, MoreVertical, Trash2, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export function VideoCard({ video, onStatusChange, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleStatusToggle = (status) => {
    if (onStatusChange) {
      onStatusChange(video._id, {
        ...video.status,
        [status]: !video.status[status],
      });
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Delete this video?')) {
      onDelete(video._id);
    }
    setShowMenu(false);
  };

  return (
    <div className="group relative">
      {/* Thumbnail */}
      <Link to={`/video/${video._id}`}>
        <div className="thumbnail group-hover:rounded-none transition-all duration-200">
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
          />
          {/* Duration badge */}
          <span className="thumbnail-duration">{video.durationFormatted}</span>

          {/* Status badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {video.status?.watched && (
              <span className="badge badge-watched flex items-center gap-1">
                <Eye className="w-3 h-3" /> Watched
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-3 flex gap-3">
        {/* Category color dot */}
        {video.category && (
          <div
            className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: video.category.color + '20' }}
          >
            <FolderOpen
              className="w-5 h-5"
              style={{ color: video.category.color }}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Title */}
          <Link to={`/video/${video._id}`}>
            <h3 className="font-medium text-yt-text text-ellipsis-2 hover:text-yt-blue transition-colors">
              {video.title}
            </h3>
          </Link>

          {/* Channel & Category */}
          <p className="text-sm text-yt-text-secondary mt-1">
            {video.channelTitle}
          </p>
          {video.category && (
            <Link
              to={`/category/${video.category.slug}`}
              className="text-xs text-yt-text-secondary hover:text-yt-text"
            >
              {video.category.name}
            </Link>
          )}
        </div>

        {/* Menu button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-yt-lighter transition-all"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 w-48 bg-yt-dark rounded-lg shadow-xl z-20 py-2">
                <button
                  onClick={() => {
                    handleStatusToggle('favorite');
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-yt-lighter flex items-center gap-3"
                >
                  <Heart
                    className={clsx(
                      'w-4 h-4',
                      video.status?.favorite && 'fill-red-500 text-red-500'
                    )}
                  />
                  {video.status?.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                <button
                  onClick={() => {
                    handleStatusToggle('watched');
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-yt-lighter flex items-center gap-3"
                >
                  <Eye className="w-4 h-4" />
                  Mark as {video.status?.watched ? 'Unwatched' : 'Watched'}
                </button>
                <button
                  onClick={() => {
                    handleStatusToggle('watchAgain');
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-yt-lighter flex items-center gap-3"
                >
                  <RefreshCw className="w-4 h-4" />
                  {video.status?.watchAgain ? 'Remove from Watch Again' : 'Watch Again'}
                </button>
                <div className="border-t border-yt-lighter my-1" />
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-yt-lighter flex items-center gap-3 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
