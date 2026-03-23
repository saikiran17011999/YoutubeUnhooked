/**
 * VideoPage
 * Individual video view with player and notes
 */

import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ExternalLink,
  Sparkles,
  Tag,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageLoader, Button } from '../components/common';
import { VideoPlayer, StatusToggle } from '../components/video';
import { NotesPanel } from '../components/notes';
import { videoService, llmService } from '../services';

export function VideoPage() {
  const { id } = useParams();
  const [currentTime, setCurrentTime] = useState(0);
  const queryClient = useQueryClient();

  // Fetch video details
  const { data, isLoading, error } = useQuery({
    queryKey: ['video', id],
    queryFn: () => videoService.getById(id),
  });

  const video = data?.data;
  const notes = video?.notes || [];

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (status) => videoService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video', id] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  // Summarize video mutation
  const summarizeMutation = useMutation({
    mutationFn: () => llmService.summarizeVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video', id] });
      toast.success('Video summarized!');
    },
  });

  const handleProgress = useCallback((state) => {
    setCurrentTime(Math.floor(state.playedSeconds));
  }, []);

  if (isLoading) return <PageLoader />;

  if (error || !video) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-medium mb-2">Video not found</h2>
        <Link to="/" className="text-yt-blue hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <VideoPlayer videoId={video.youtubeId} onProgress={handleProgress} />

          {/* Video Info */}
          <div className="space-y-4">
            {/* Title */}
            <h1 className="text-xl font-bold">{video.title}</h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-yt-text-secondary">
              {/* Channel */}
              <span>{video.channelTitle}</span>

              {/* Category */}
              {video.category && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <Link
                    to={`/category/${video.category.slug}`}
                    className="hover:text-yt-text"
                    style={{ color: video.category.color }}
                  >
                    {video.category.name}
                  </Link>
                </>
              )}

              {/* Duration */}
              <span>{video.durationFormatted}</span>

              {/* External link */}
              <a
                href={`https://youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-yt-blue"
              >
                <ExternalLink className="w-4 h-4" />
                Watch on YouTube
              </a>
            </div>

            {/* Status Toggles */}
            <StatusToggle
              status={video.status}
              onChange={(status) => updateStatusMutation.mutate(status)}
              disabled={updateStatusMutation.isPending}
            />

            {/* AI Summary Section */}
            <div className="bg-yt-dark rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yt-blue" />
                  AI Summary
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => summarizeMutation.mutate()}
                  loading={summarizeMutation.isPending}
                >
                  {video.summary ? 'Regenerate' : 'Generate Summary'}
                </Button>
              </div>

              {video.summary ? (
                <div className="space-y-3">
                  <p className="text-sm text-yt-text-secondary">
                    {video.summary}
                  </p>

                  {video.keyPoints?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Points:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {video.keyPoints.map((point, i) => (
                          <li key={i} className="text-sm text-yt-text-secondary">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {video.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {video.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-yt-lighter rounded-full text-xs"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-yt-text-secondary">
                  No summary yet. Click "Generate Summary" to create one using AI.
                </p>
              )}
            </div>

            {/* Description */}
            {video.description && (
              <div className="bg-yt-dark rounded-xl p-4">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-yt-text-secondary whitespace-pre-wrap text-ellipsis-3">
                  {video.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {(video.tags?.length > 0 || video.userTags?.length > 0) && (
              <div className="flex flex-wrap gap-2">
                <Tag className="w-4 h-4 text-yt-text-secondary" />
                {[...(video.tags || []), ...(video.userTags || [])].map(
                  (tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-yt-lighter rounded text-xs"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Notes */}
        <div className="lg:col-span-1">
          <NotesPanel videoId={id} notes={notes} currentTime={currentTime} />
        </div>
      </div>
    </div>
  );
}

export default VideoPage;
