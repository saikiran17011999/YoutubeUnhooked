/**
 * StatusToggle Component
 * Toggle buttons for video status (watched, favorite, watch again)
 */

import { Eye, Heart, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

export function StatusToggle({ status, onChange, disabled = false }) {
  const handleToggle = (key) => {
    if (disabled) return;
    onChange({
      ...status,
      [key]: !status[key],
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Watched */}
      <button
        onClick={() => handleToggle('watched')}
        disabled={disabled}
        className={clsx(
          'toggle-btn',
          status?.watched && 'active bg-green-500/20 border-green-500/50 text-green-400'
        )}
      >
        <Eye className="w-4 h-4" />
        <span>{status?.watched ? 'Watched' : 'Mark Watched'}</span>
      </button>

      {/* Favorite */}
      <button
        onClick={() => handleToggle('favorite')}
        disabled={disabled}
        className={clsx(
          'toggle-btn',
          status?.favorite && 'active bg-red-500/20 border-red-500/50 text-red-400'
        )}
      >
        <Heart
          className={clsx('w-4 h-4', status?.favorite && 'fill-current')}
        />
        <span>{status?.favorite ? 'Favorited' : 'Add to Favorites'}</span>
      </button>

      {/* Watch Again */}
      <button
        onClick={() => handleToggle('watchAgain')}
        disabled={disabled}
        className={clsx(
          'toggle-btn',
          status?.watchAgain && 'active bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
        )}
      >
        <RefreshCw className="w-4 h-4" />
        <span>{status?.watchAgain ? 'Watch Again' : 'Add to Watch Again'}</span>
      </button>
    </div>
  );
}

export default StatusToggle;
