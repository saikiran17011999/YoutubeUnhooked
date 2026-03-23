/**
 * AddVideoPage
 * Standalone page for adding videos
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link2, ListVideo, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input } from '../components/common';
import { videoService, categoryService } from '../services';

export function AddVideoPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isPlaylist, setIsPlaylist] = useState(false);
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const categories = categoriesData?.data || [];

  // Add video mutation
  const addMutation = useMutation({
    mutationFn: ({ url, categoryId }) => {
      if (isPlaylist) {
        return videoService.addPlaylist(url, categoryId || null);
      }
      return videoService.add(url, categoryId || null);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });

      if (isPlaylist) {
        toast.success(`Imported ${data.data.imported} videos from playlist`);
        navigate('/');
      } else {
        toast.success('Video added successfully');
        navigate(`/video/${data.data._id}`);
      }
    },
  });

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    setIsPlaylist(value.includes('playlist?list=') || value.includes('&list='));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    addMutation.mutate({ url: url.trim(), categoryId: categoryId || null });
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-yt-text-secondary hover:text-yt-text mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Form Card */}
      <div className="bg-yt-dark rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6">Add Video</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div>
            <Input
              label="YouTube URL"
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            {isPlaylist && (
              <p className="mt-2 text-sm text-yt-blue flex items-center gap-2">
                <ListVideo className="w-4 h-4" />
                Playlist detected - all videos will be imported
              </p>
            )}
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-yt-text-secondary mb-2">
              Category (optional)
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name} ({cat.videoCount} videos)
                </option>
              ))}
            </select>
          </div>

          {/* Supported formats info */}
          <div className="p-4 bg-yt-darker rounded-lg">
            <h3 className="font-medium mb-2">Supported URLs:</h3>
            <ul className="text-sm text-yt-text-secondary space-y-1">
              <li>• youtube.com/watch?v=...</li>
              <li>• youtu.be/...</li>
              <li>• youtube.com/playlist?list=...</li>
              <li>• youtube.com/shorts/...</li>
            </ul>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            loading={addMutation.isPending}
            disabled={!url.trim()}
          >
            <Link2 className="w-4 h-4 mr-2" />
            {isPlaylist ? 'Import Playlist' : 'Add Video'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddVideoPage;
