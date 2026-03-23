/**
 * HomePage
 * Main feed showing all videos
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Filter } from 'lucide-react';
import { Button } from '../components/common';
import { VideoGrid, AddVideoModal } from '../components/video';
import { videoService } from '../services';

export function HomePage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    order: 'desc',
  });
  const queryClient = useQueryClient();

  // Fetch videos
  const { data, isLoading } = useQuery({
    queryKey: ['videos', filters],
    queryFn: () => videoService.getAll(filters),
  });

  const videos = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => videoService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => videoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleStatusChange = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Videos</h1>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </div>
      </div>

      {/* Sort options */}
      <div className="flex gap-2 mb-6">
        {['createdAt', 'title'].map((sortOption) => (
          <button
            key={sortOption}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                sortBy: sortOption,
                order:
                  prev.sortBy === sortOption
                    ? prev.order === 'asc'
                      ? 'desc'
                      : 'asc'
                    : 'desc',
              }))
            }
            className={`px-3 py-1.5 rounded-full text-sm ${
              filters.sortBy === sortOption
                ? 'bg-yt-text text-yt-black'
                : 'bg-yt-lighter text-yt-text hover:bg-yt-light'
            }`}
          >
            {sortOption === 'createdAt' ? 'Recently Added' : 'Title'}
            {filters.sortBy === sortOption && (
              <span className="ml-1">{filters.order === 'asc' ? '↑' : '↓'}</span>
            )}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <VideoGrid
        videos={videos}
        loading={isLoading}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        emptyMessage="No videos yet. Add your first video!"
      />

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="secondary"
            disabled={pagination.page <= 1}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-yt-text-secondary">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="secondary"
            disabled={pagination.page >= pagination.pages}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            Next
          </Button>
        </div>
      )}

      {/* Add Video Modal */}
      <AddVideoModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}

export default HomePage;
