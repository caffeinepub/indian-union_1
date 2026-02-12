import { useState } from 'react';
import { useGetMeetings, useCreateMeeting, useIsCallerAdmin } from '../hooks/useQueries';
import { Calendar, Clock, User, Plus, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function MeetingsPage() {
  const { data: meetings, isLoading, error } = useGetMeetings();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const createMeeting = useCreateMeeting();

  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    // Combine date/time, location, and notes into description
    let description = '';
    if (dateTime) {
      description += `Date & Time: ${new Date(dateTime).toLocaleString()}\n`;
    }
    if (location) {
      description += `Location: ${location}\n`;
    }
    if (additionalNotes) {
      description += `\nNotes:\n${additionalNotes}`;
    }

    try {
      await createMeeting.mutateAsync({ title, description: description || 'No additional details provided.' });
      setTitle('');
      setDateTime('');
      setLocation('');
      setAdditionalNotes('');
    } catch (err: any) {
      console.error('Failed to create meeting:', err);
    }
  };

  if (isLoading || isAdminLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12">
        <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl p-8 text-center">
          <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-foreground/70">Loading meetings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load meetings';
    const isAuthError = errorMessage.includes('Unauthorized') || errorMessage.includes('permission');
    
    return (
      <div className="max-w-6xl mx-auto py-12">
        <div className="bg-card/50 backdrop-blur-sm border border-destructive/30 rounded-xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <h2 className="text-2xl font-bold text-destructive">
              {isAuthError ? 'Access Denied' : 'Error Loading Meetings'}
            </h2>
          </div>
          <p className="text-foreground/70">
            {isAuthError 
              ? 'You do not have permission to access meetings. Please ensure you are signed in with a registered account.'
              : errorMessage}
          </p>
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
            <Calendar className="w-8 h-8 text-carbon" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gold">Meetings</h1>
            <p className="text-foreground/60 text-lg mt-1">Schedule and manage your meetings</p>
          </div>
        </div>
      </div>

      {/* Create Meeting Form - Only for Admin */}
      {isAdmin ? (
        <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/20 p-6">
            <h2 className="text-2xl font-bold text-gold flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Create New Meeting
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <Label htmlFor="title" className="text-foreground/80">Meeting Title *</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter meeting title"
                required
                className="mt-2 bg-carbon-dark/50 border-gold/20 text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="dateTime" className="text-foreground/80">Date & Time</Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="mt-2 bg-carbon-dark/50 border-gold/20 text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-foreground/80">Location</Label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Meeting location or video link"
                className="mt-2 bg-carbon-dark/50 border-gold/20 text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-foreground/80">Additional Notes</Label>
              <Textarea
                id="notes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Agenda, participants, or other details..."
                rows={4}
                className="mt-2 bg-carbon-dark/50 border-gold/20 text-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={createMeeting.isPending || !title.trim()}
              className="w-full bg-gold hover:bg-gold-light text-carbon font-semibold"
            >
              {createMeeting.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Meeting
                </>
              )}
            </Button>

            {createMeeting.isError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
                {createMeeting.error instanceof Error && createMeeting.error.message.includes('Unauthorized')
                  ? 'You do not have permission to create meetings. Only the admin can create meetings.'
                  : 'Failed to create meeting. Please try again.'}
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/20 p-6">
            <h2 className="text-2xl font-bold text-gold flex items-center gap-2">
              <ShieldAlert className="w-6 h-6" />
              Admin Only
            </h2>
          </div>
          <div className="p-6">
            <div className="bg-carbon-dark/50 border border-gold/20 rounded-lg p-6 text-center">
              <ShieldAlert className="w-12 h-12 text-gold/50 mx-auto mb-3" />
              <p className="text-foreground/70 text-lg mb-2">Meeting Creation Restricted</p>
              <p className="text-foreground/50 text-sm">
                Only the site administrator can create new meetings. You can view all scheduled meetings below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Meetings List */}
      <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/20 p-6">
          <h2 className="text-2xl font-bold text-gold">All Meetings</h2>
          <p className="text-foreground/60 text-sm mt-1">
            {meetings?.length || 0} meeting{meetings?.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>

        <div className="p-6">
          {!meetings || meetings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gold/30 mx-auto mb-4" />
              <p className="text-foreground/60 text-lg">No meetings scheduled yet</p>
              <p className="text-foreground/40 text-sm mt-2">
                {isAdmin ? 'Create your first meeting above' : 'Check back later for scheduled meetings'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id.toString()}
                  className="bg-carbon-dark/50 border border-gold/20 rounded-lg p-6 hover:border-gold/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gold mb-2">{meeting.title}</h3>
                      <div className="text-foreground/70 text-sm whitespace-pre-wrap mb-3">
                        {meeting.description}
                      </div>
                      <div className="flex items-center gap-2 text-foreground/50 text-xs">
                        <User className="w-4 h-4" />
                        <span className="font-mono">{meeting.owner.toString().slice(0, 20)}...</span>
                      </div>
                    </div>
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
