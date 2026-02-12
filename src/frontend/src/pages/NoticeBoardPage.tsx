import { useState } from 'react';
import { useGetAllNotices, useCreateNotice, useDeleteNotice, useIsCallerAdmin } from '../hooks/useQueries';
import { Loader2, Bell, Trash2, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

type View = 'home' | 'signin' | 'signup' | 'member' | 'dashboard' | 'meetings' | 'messages' | 'vault' | 'members' | 'noticeboard';

interface NoticeBoardPageProps {
  onNavigate: (view: View) => void;
}

export default function NoticeBoardPage({ onNavigate }: NoticeBoardPageProps) {
  const { data: notices, isLoading: noticesLoading, error: noticesError } = useGetAllNotices();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const createNoticeMutation = useCreateNotice();
  const deleteNoticeMutation = useDeleteNotice();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [formError, setFormError] = useState('');

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (title.length > 200) {
      setFormError('Title must be 200 characters or less');
      return;
    }
    if (!content.trim()) {
      setFormError('Content is required');
      return;
    }
    if (content.length > 2000) {
      setFormError('Content must be 2000 characters or less');
      return;
    }

    try {
      await createNoticeMutation.mutateAsync({ title: title.trim(), content: content.trim() });
      setTitle('');
      setContent('');
    } catch (err: any) {
      // Handle authorization-related errors with clear messaging
      const errorMessage = err.message || '';
      if (
        errorMessage.toLowerCase().includes('unauthorized') ||
        errorMessage.toLowerCase().includes('permission') ||
        errorMessage.toLowerCase().includes('trap')
      ) {
        setFormError('You must be a registered member to post notices. Please ensure you are signed in and have completed your profile.');
      } else {
        setFormError(errorMessage || 'Failed to create notice. Please try again.');
      }
    }
  };

  const handleDeleteNotice = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    try {
      await deleteNoticeMutation.mutateAsync(id);
    } catch (err: any) {
      console.error('Failed to delete notice:', err);
    }
  };

  // Sort notices newest-first (by id, since createdAt is always 0)
  const sortedNotices = notices ? [...notices].sort((a, b) => Number(b.id) - Number(a.id)) : [];

  if (noticesLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12">
        <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl p-8 text-center">
          <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-foreground/70">Loading notice board...</p>
        </div>
      </div>
    );
  }

  if (noticesError) {
    return (
      <div className="max-w-6xl mx-auto py-12">
        <div className="bg-card/50 backdrop-blur-sm border border-destructive/30 rounded-xl shadow-2xl p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load notices. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border border-gold/30 rounded-xl shadow-2xl p-8">
        <div className="flex items-center gap-4">
          <div className="bg-gold p-4 rounded-full">
            <Bell className="w-8 h-8 text-carbon" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gold">Notice Board</h1>
            <p className="text-foreground/60 text-lg mt-1">Important announcements and updates</p>
          </div>
        </div>
      </div>

      {/* Write a Notice Section - Available to all authenticated members */}
      <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/20 p-6">
          <h2 className="text-2xl font-bold text-gold">Write a Notice</h2>
          <p className="text-foreground/60 text-sm mt-1">
            Share an announcement with all members
          </p>
        </div>

        <form onSubmit={handleCreateNotice} className="p-6 space-y-4">
          {/* Form error alert */}
          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notice title"
              maxLength={200}
              className="bg-carbon-dark border-gold/20 focus:border-gold"
              disabled={createNoticeMutation.isPending}
            />
            <p className="text-xs text-foreground/50">{title.length}/200 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-foreground">
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter notice content"
              maxLength={2000}
              rows={6}
              className="bg-carbon-dark border-gold/20 focus:border-gold resize-none"
              disabled={createNoticeMutation.isPending}
            />
            <p className="text-xs text-foreground/50">{content.length}/2000 characters</p>
          </div>

          <Button
            type="submit"
            disabled={createNoticeMutation.isPending}
            className="bg-gold hover:bg-gold-light text-carbon font-semibold disabled:opacity-50"
          >
            {createNoticeMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Notice
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Notices List */}
      <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/20 p-6">
          <h2 className="text-2xl font-bold text-gold">All Notices</h2>
          <p className="text-foreground/60 text-sm mt-1">
            {sortedNotices.length} {sortedNotices.length === 1 ? 'notice' : 'notices'} posted
          </p>
        </div>

        <div className="p-6">
          {sortedNotices.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gold/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground/70 mb-2">No Notices Yet</h3>
              <p className="text-foreground/50">
                Create the first notice to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedNotices.map((notice) => (
                <div
                  key={notice.id.toString()}
                  className="bg-carbon-dark/50 border border-gold/20 rounded-lg p-6 hover:border-gold/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gold mb-2 break-words">
                        {notice.title}
                      </h3>
                      <p className="text-foreground/80 whitespace-pre-wrap break-words">
                        {notice.content}
                      </p>
                    </div>

                    {isAdmin && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteNotice(notice.id)}
                        disabled={deleteNoticeMutation.isPending}
                        className="flex-shrink-0"
                        title="Delete notice (admin only)"
                      >
                        {deleteNoticeMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
