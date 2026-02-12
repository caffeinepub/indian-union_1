import { useGetAllMembers, useGetMemberCount, useIsCallerAdmin } from '../hooks/useQueries';
import { Users, Shield, Mail, User, Key } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface MembersPageProps {
  onNavigate: (view: string) => void;
}

export default function MembersPage({ onNavigate }: MembersPageProps) {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: memberCount, isLoading: countLoading } = useGetMemberCount();
  const { data: members, isLoading: membersLoading, error } = useGetAllMembers();

  // Show loading state while checking admin status
  if (adminLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Access denied for non-admins
  if (!isAdmin) {
    return (
      <div className="text-center py-20">
        <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-lg p-8 max-w-md mx-auto">
          <Shield className="w-16 h-16 text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gold mb-4">Access Denied</h2>
          <p className="text-foreground/80 mb-6">
            This area is restricted to administrators only.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 bg-gold hover:bg-gold-light text-carbon font-semibold rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-gold to-gold-dark p-3 rounded-lg shadow-lg">
          <Users className="w-8 h-8 text-carbon" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gold">Members Directory</h1>
          <p className="text-foreground/70">View all registered members</p>
        </div>
      </div>

      {/* Member Count Card */}
      <Card className="bg-card/50 backdrop-blur-sm border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Total Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {countLoading ? (
            <Skeleton className="h-12 w-24" />
          ) : (
            <div className="text-4xl font-bold text-foreground">
              {memberCount?.toString() || '0'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Members List */}
      <Card className="bg-card/50 backdrop-blur-sm border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold">Registered Members</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Failed to load members: {error instanceof Error ? error.message : 'Unknown error'}
              </AlertDescription>
            </Alert>
          )}

          {membersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : members && members.length > 0 ? (
            <div className="rounded-lg border border-gold/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-carbon-dark/50 hover:bg-carbon-dark/50 border-gold/20">
                    <TableHead className="text-gold font-semibold">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Name
                      </div>
                    </TableHead>
                    <TableHead className="text-gold font-semibold">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </div>
                    </TableHead>
                    <TableHead className="text-gold font-semibold">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        Principal ID
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map(([principal, profile]) => (
                    <TableRow
                      key={principal.toString()}
                      className="border-gold/10 hover:bg-gold/5 transition-colors"
                    >
                      <TableCell className="font-medium text-foreground">
                        {profile.name}
                      </TableCell>
                      <TableCell className="text-foreground/80">
                        {profile.email}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-foreground/60">
                        <div className="max-w-xs truncate" title={principal.toString()}>
                          {principal.toString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-foreground/60">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No members found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
