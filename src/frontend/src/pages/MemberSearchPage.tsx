import { useState } from 'react';
import { useGetAllUsernames } from '../hooks/useQueries';
import { filterBySearch } from '../utils/textSearch';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, User, AlertCircle, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface MemberSearchPageProps {
  onNavigate: (view: string) => void;
}

export default function MemberSearchPage({ onNavigate }: MemberSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: usernames, isLoading, error } = useGetAllUsernames();

  // Filter usernames using shared utility
  const filteredUsernames = usernames
    ? filterBySearch(usernames, searchQuery, (username: string) => [username])
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-gold" />
          <h1 className="text-4xl font-bold text-gold">Search Members</h1>
        </div>
        <p className="text-foreground/70">Find members by username</p>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/50" />
          <Input
            type="text"
            placeholder="Search members by username..."
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
          <p className="mt-4 text-foreground/70">Loading members...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load members. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {/* No Members State */}
      {!isLoading && !error && usernames && usernames.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-lg p-8 max-w-md mx-auto">
            <Users className="w-12 h-12 text-gold/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Members Yet</h3>
            <p className="text-foreground/70">
              There are no registered members in the system yet.
            </p>
          </div>
        </div>
      )}

      {/* No Search Results State */}
      {!isLoading && !error && usernames && usernames.length > 0 && filteredUsernames.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-lg p-8 max-w-md mx-auto">
            <Search className="w-12 h-12 text-gold/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Results Found</h3>
            <p className="text-foreground/70">
              No members match your search query "{searchQuery}". Try different keywords.
            </p>
          </div>
        </div>
      )}

      {/* Members List */}
      {!isLoading && !error && filteredUsernames.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-foreground/60">
              Showing {filteredUsernames.length} of {usernames?.length || 0} members
            </p>
            <Badge variant="outline" className="border-gold/30 text-gold">
              {usernames?.length || 0} Total Members
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsernames.map((username, index) => (
              <Card 
                key={`${username}-${index}`} 
                className="bg-card/50 backdrop-blur-sm border-gold/20 hover:border-gold/40 transition-colors"
              >
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {username}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-foreground/60">
                    Member of Indian Union
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
