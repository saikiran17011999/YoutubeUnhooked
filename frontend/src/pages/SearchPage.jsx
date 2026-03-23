/**
 * SearchPage
 * Search results page
 */

import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { VideoGrid } from '../components/video';
import { videoService } from '../services';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const queryClient = useQueryClient();

  // Search videos
  const { data, isLoading } = useQuery({
    queryKey: ['videos', { search: query }],
    queryFn: () => videoService.getAll({ search: query }),
    enabled: !!query,
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

  if (!query) {
    return (
      <div className="text-center py-16">
        <Search className="w-16 h-16 mx-auto mb-4 text-yt-text-secondary opacity-50" />
        <h2 className="text-xl font-medium mb-2">Search your videos</h2>
        <p className="text-yt-text-secondary">
          Enter a search term to find videos in your library
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium">
          Search results for "{query}"
        </h1>
        <p className="text-yt-text-secondary">
          {videos.length} videos found
        </p>
      </div>

      {/* Results */}
      <VideoGrid
        videos={videos}
        loading={isLoading}
        onStatusChange={(id, status) =>
          updateStatusMutation.mutate({ id, status })
        }
        onDelete={(id) => deleteMutation.mutate(id)}
        emptyMessage={`No videos found for "${query}"`}
      />
    </div>
  );
}

export default SearchPage;
