/**
 * CategoryPage
 * Shows videos filtered by category
 */

import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLoader } from '../components/common';
import { VideoGrid } from '../components/video';
import { videoService, categoryService } from '../services';

export function CategoryPage() {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  // Fetch categories to find the current one
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const categories = categoriesData?.data || [];
  const category = categories.find((c) => c.slug === slug);

  // Fetch videos for this category
  const { data: videosData, isLoading } = useQuery({
    queryKey: ['videos', { category: category?._id }],
    queryFn: () => videoService.getAll({ category: category?._id }),
    enabled: !!category,
  });

  const videos = videosData?.data?.items || [];

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

  if (!category) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-medium">Category not found</h2>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: category.color + '30' }}
          >
            <span style={{ color: category.color }}>●</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="text-yt-text-secondary">
              {category.videoCount} videos
            </p>
          </div>
        </div>
      </div>

      {/* Videos */}
      <VideoGrid
        videos={videos}
        loading={isLoading}
        onStatusChange={(id, status) =>
          updateStatusMutation.mutate({ id, status })
        }
        onDelete={(id) => deleteMutation.mutate(id)}
        emptyMessage={`No videos in ${category.name} yet`}
      />
    </div>
  );
}

export default CategoryPage;
