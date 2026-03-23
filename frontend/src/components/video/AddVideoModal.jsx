/**
 * AddVideoModal Component
 * Modal for adding videos from URL
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link2, ListVideo } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Button, Input } from '../common';
import { videoService, categoryService } from '../../services';

export function AddVideoModal({ isOpen, onClose }) {
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
  const addVideoMutation = useMutation({
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
      } else {
        toast.success('Video added successfully');
      }

      handleClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    addVideoMutation.mutate({ url: url.trim(), categoryId: categoryId || null });
  };

  const handleClose = () => {
    setUrl('');
    setCategoryId('');
    setIsPlaylist(false);
    onClose();
  };

  // Detect if URL is a playlist
  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    setIsPlaylist(value.includes('playlist?list=') || value.includes('&list='));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Video" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <p className="mt-1 text-sm text-yt-blue flex items-center gap-1">
              <ListVideo className="w-4 h-4" />
              Playlist detected - all videos will be imported
            </p>
          )}
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium text-yt-text-secondary mb-1">
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
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={addVideoMutation.isPending}
            disabled={!url.trim()}
          >
            <Link2 className="w-4 h-4 mr-2" />
            {isPlaylist ? 'Import Playlist' : 'Add Video'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddVideoModal;
