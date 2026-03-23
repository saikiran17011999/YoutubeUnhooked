/**
 * FilteredPage
 * Generic page for filtered video views (favorites, watch again, etc.)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, RefreshCw, Clock } from 'lucide-react';
import { VideoGrid } from '../components/video';
import { videoService } from '../services';

const FILTER_CONFIGS = {
  favorites: {
    title: 'Favorites',
    icon: Heart,
    status: 'favorite',
    emptyMessage: 'No favorite videos yet. Mark videos as favorites to see them here.',
    iconClass: 'text-red-500',
  },
  'watch-again': {
    title: 'Watch Again',
    icon: RefreshCw,
    status: 'watchAgain',
    emptyMessage: 'No videos marked for watch again.',
    iconClass: 'text-yellow-500',
  },
  'watch-later': {
    title: 'Watch Later',
    icon: Clock,
    status: 'unwatched',
    emptyMessage: 'All caught up! No unwatched videos.',
    iconClass: 'text-blue-500',
  },
};

export function FilteredPage({ filterType }) {
  const config = FILTER_CONFIGS[filterType];
  const queryClient = useQueryClient();

  // Fetch videos with filter
  const { data, isLoading } = useQuery({
    queryKey: ['videos', { status: config.status }],
    queryFn: () => videoService.getAll({ status: config.status }),
  });

  const videos = data?.data?.items || [];

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => videoService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => videoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const IconComponent = config.icon;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <IconComponent className={`w-8 h-8 ${config.iconClass}`} />
        <h1 className="text-2xl font-bold">{config.title}</h1>
        <span className="text-yt-text-secondary">({videos.length} videos)</span>
      </div>

      {/* Videos */}
      <VideoGrid
        videos={videos}
        loading={isLoading}
        onStatusChange={(id, status) =>
          updateStatusMutation.mutate({ id, status })
        }
        onDelete={(id) => deleteMutation.mutate(id)}
        emptyMessage={config.emptyMessage}
      />
    </div>
  );
}

export default FilteredPage;
