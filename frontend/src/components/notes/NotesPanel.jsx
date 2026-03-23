/**
 * NotesPanel Component
 * Panel for displaying and managing video notes
 */

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Edit2,
  Trash2,
  Pin,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { Button } from '../common';
import { noteService, llmService } from '../../services';

function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  const formatTimestamp = (seconds) => {
    if (seconds === null || seconds === undefined) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={clsx(
        'note-card relative group',
        note.isPinned && 'border-yt-blue'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {note.timestamp !== null && (
            <span className="text-xs text-yt-blue flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimestamp(note.timestamp)}
            </span>
          )}
          {note.isPinned && (
            <Pin className="w-3 h-3 text-yt-blue fill-current" />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onTogglePin(note._id)}
            className="p-1 rounded hover:bg-yt-lighter"
            title={note.isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin className={clsx('w-4 h-4', note.isPinned && 'fill-current text-yt-blue')} />
          </button>
          <button
            onClick={() => onEdit(note)}
            className="p-1 rounded hover:bg-yt-lighter"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="p-1 rounded hover:bg-yt-lighter text-red-500"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-yt-text whitespace-pre-wrap">{note.content}</p>

      {/* Metadata */}
      <p className="text-xs text-yt-text-secondary mt-2">
        {new Date(note.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export function NotesPanel({ videoId, notes = [], currentTime = 0 }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [content, setContent] = useState('');
  const [includeTimestamp, setIncludeTimestamp] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const queryClient = useQueryClient();

  // Create note mutation
  const createMutation = useMutation({
    mutationFn: (data) => noteService.create(videoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video', videoId] });
      setContent('');
      setIsAdding(false);
      setIncludeTimestamp(false);
      toast.success('Note added');
    },
  });

  // Update note mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => noteService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video', videoId] });
      setEditingNote(null);
      setContent('');
      toast.success('Note updated');
    },
  });

  // Delete note mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => noteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video', videoId] });
      toast.success('Note deleted');
    },
  });

  // Toggle pin mutation
  const togglePinMutation = useMutation({
    mutationFn: (id) => noteService.togglePin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video', videoId] });
    },
  });

  // Summarize notes mutation
  const summarizeMutation = useMutation({
    mutationFn: () => llmService.summarizeNotes(videoId),
    onSuccess: (data) => {
      toast.success('Notes summarized!');
      // Could display summary in a modal or panel
      console.log('Summary:', data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (editingNote) {
      updateMutation.mutate({
        id: editingNote._id,
        data: { content: content.trim() },
      });
    } else {
      createMutation.mutate({
        content: content.trim(),
        timestamp: includeTimestamp ? currentTime : null,
      });
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setContent(note.content);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this note?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingNote(null);
    setContent('');
    setIncludeTimestamp(false);
  };

  return (
    <div className="bg-yt-dark rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-lg font-medium"
        >
          Notes ({notes.length})
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        <div className="flex gap-2">
          {notes.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => summarizeMutation.mutate()}
              loading={summarizeMutation.isPending}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Summarize
            </Button>
          )}
          <Button variant="secondary" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Note
          </Button>
        </div>
      </div>

      {expanded && (
        <>
          {/* Add/Edit Form */}
          {isAdding && (
            <form onSubmit={handleSubmit} className="mb-4 space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note..."
                className="input min-h-[100px] resize-y"
                autoFocus
              />

              {!editingNote && (
                <label className="flex items-center gap-2 text-sm text-yt-text-secondary">
                  <input
                    type="checkbox"
                    checked={includeTimestamp}
                    onChange={(e) => setIncludeTimestamp(e.target.checked)}
                    className="rounded"
                  />
                  Add timestamp ({Math.floor(currentTime / 60)}:
                  {(currentTime % 60).toString().padStart(2, '0')})
                </label>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={createMutation.isPending || updateMutation.isPending}
                  disabled={!content.trim()}
                >
                  {editingNote ? 'Update' : 'Save'}
                </Button>
              </div>
            </form>
          )}

          {/* Notes List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-center text-yt-text-secondary py-8">
                No notes yet. Add your first note!
              </p>
            ) : (
              notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onTogglePin={(id) => togglePinMutation.mutate(id)}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default NotesPanel;
