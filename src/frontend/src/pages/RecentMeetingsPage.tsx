import { useState, useMemo } from 'react';
import { useGetMeetings } from '../hooks/useQueries';
import { filterBySearch } from '../utils/textSearch';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Calendar, AlertCircle, Inbox, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Meeting } from '../backend';

interface RecentMeetingsPageProps {
  onNavigate: (view: string) => void;
}

export default function RecentMeetingsPage({ onNavigate }: RecentMeetingsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: meetings, isLoading, error } = useGetMeetings();

  // Get recent meetings (latest 10, sorted by ID descending)
  const recentMeetings = useMemo(() => {
    if (!meetings) return [];
    
    // Sort by ID descending and take first 10
    return [...meetings]
      .sort((a, b) => Number(b.id) - Number(a.id))
      .slice(0, 10);
  }, [meetings]);

  // Filter recent meetings by title and description using shared utility
  const filteredMeetings = filterBySearch(
    recentMeetings,
    searchQuery,
    (meeting: Meeting) => [meeting.title, meeting.description]
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-8 h-8 text-gold" />
          <h1 className="text-4xl font-bold text-gold">Recent Meetings</h1>
        </div>
        <p className="text-foreground/70">View the 10 most recent meetings</p>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/50" />
          <Input
            type="text"
            placeholder="Search recent meetings by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50 border-gold/20 focus:border-gold"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
          <p className="mt-4 text-foreground/70">Loading recent meetings...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load meetings. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {/* No Meetings State */}
      {!isLoading && !error && meetings && meetings.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-lg p-8 max-w-md mx-auto">
            <Inbox className="w-12 h-12 text-gold/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Meetings Yet</h3>
            <p className="text-foreground/70">
              There are no meetings in the system. Check back later or contact an administrator.
            </p>
          </div>
        </div>
      )}

      {/* No Search Results State */}
      {!isLoading && !error && recentMeetings.length > 0 && filteredMeetings.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-lg p-8 max-w-md mx-auto">
            <Search className="w-12 h-12 text-gold/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Results Found</h3>
            <p className="text-foreground/70">
              No recent meetings match your search query "{searchQuery}". Try different keywords.
            </p>
          </div>
        </div>
      )}

      {/* Recent Meetings List */}
      {!isLoading && !error && filteredMeetings.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-foreground/60 mb-4">
            Showing {filteredMeetings.length} of {recentMeetings.length} recent meetings
          </p>
          {filteredMeetings.map((meeting) => (
            <Card key={Number(meeting.id)} className="bg-card/50 backdrop-blur-sm border-gold/20 hover:border-gold/40 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-gold flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {meeting.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-foreground/70">
                      {meeting.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-foreground/60">
                  Meeting ID: {Number(meeting.id)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
