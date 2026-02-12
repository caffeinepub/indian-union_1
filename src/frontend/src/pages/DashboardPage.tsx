import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { User, Mail, LayoutDashboard, Loader2, ArrowRight, Calendar, MessageSquare, FolderLock, Bell } from 'lucide-react';

type View = 'member' | 'meetings' | 'messages' | 'vault' | 'noticeboard';

interface DashboardPageProps {
  onNavigate: (view: View) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12">
        <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl p-8 text-center">
          <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-foreground/70">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const principalId = identity?.getPrincipal().toString() || '';
  const displayName = userProfile?.name || 'Member';

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border border-gold/30 rounded-xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gold p-4 rounded-full">
            <LayoutDashboard className="w-8 h-8 text-carbon" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gold">Welcome back, {displayName}!</h1>
            <p className="text-foreground/60 text-lg mt-1">Your Indian Union Dashboard</p>
          </div>
        </div>
      </div>

      {/* Account Summary */}
      <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/20 p-6">
          <h2 className="text-2xl font-bold text-gold">Account Summary</h2>
          <p className="text-foreground/60 text-sm mt-1">Your membership information at a glance</p>
        </div>

        <div className="p-6 space-y-4">
          {userProfile && (
            <>
              <div className="bg-carbon-dark/50 border border-gold/20 rounded-lg p-5 flex items-center gap-4">
                <div className="bg-gold/20 p-3 rounded-lg">
                  <User className="w-6 h-6 text-gold" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground/60 block">Full Name</label>
                  <p className="text-lg text-foreground font-medium mt-1">{userProfile.name}</p>
                </div>
              </div>

              <div className="bg-carbon-dark/50 border border-gold/20 rounded-lg p-5 flex items-center gap-4">
                <div className="bg-gold/20 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-gold" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground/60 block">Email Address</label>
                  <p className="text-lg text-foreground font-medium mt-1">{userProfile.email}</p>
                </div>
              </div>
            </>
          )}

          <div className="bg-carbon-dark/50 border border-gold/20 rounded-lg p-5">
            <label className="text-sm font-medium text-foreground/60 block mb-2">Principal ID</label>
            <p className="text-xs text-foreground/50 font-mono break-all bg-carbon-darker p-3 rounded border border-gold/10">
              {principalId}
            </p>
            <p className="text-xs text-foreground/40 mt-2">
              Your unique identifier on the Internet Computer
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/20 p-6">
          <h2 className="text-2xl font-bold text-gold">Quick Actions</h2>
          <p className="text-foreground/60 text-sm mt-1">Access your member features</p>
        </div>

        <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => onNavigate('member')}
            className="group bg-carbon-dark/50 hover:bg-carbon-dark border border-gold/20 hover:border-gold/40 rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-gold/20 text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gold/20 p-3 rounded-lg group-hover:bg-gold/30 transition-colors">
                <User className="w-6 h-6 text-gold" />
              </div>
              <ArrowRight className="w-5 h-5 text-gold/50 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Member Profile</h3>
            <p className="text-sm text-foreground/60">View and edit your profile</p>
          </button>

          <button
            onClick={() => onNavigate('noticeboard')}
            className="group bg-carbon-dark/50 hover:bg-carbon-dark border border-gold/20 hover:border-gold/40 rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-gold/20 text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gold/20 p-3 rounded-lg group-hover:bg-gold/30 transition-colors">
                <Bell className="w-6 h-6 text-gold" />
              </div>
              <ArrowRight className="w-5 h-5 text-gold/50 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Notice Board</h3>
            <p className="text-sm text-foreground/60">View announcements</p>
          </button>

          <button
            onClick={() => onNavigate('meetings')}
            className="group bg-carbon-dark/50 hover:bg-carbon-dark border border-gold/20 hover:border-gold/40 rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-gold/20 text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gold/20 p-3 rounded-lg group-hover:bg-gold/30 transition-colors">
                <Calendar className="w-6 h-6 text-gold" />
              </div>
              <ArrowRight className="w-5 h-5 text-gold/50 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Meetings</h3>
            <p className="text-sm text-foreground/60">Schedule and view meetings</p>
          </button>

          <button
            onClick={() => onNavigate('messages')}
            className="group bg-carbon-dark/50 hover:bg-carbon-dark border border-gold/20 hover:border-gold/40 rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-gold/20 text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gold/20 p-3 rounded-lg group-hover:bg-gold/30 transition-colors">
                <MessageSquare className="w-6 h-6 text-gold" />
              </div>
              <ArrowRight className="w-5 h-5 text-gold/50 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Messages</h3>
            <p className="text-sm text-foreground/60">Send and receive messages</p>
          </button>

          <button
            onClick={() => onNavigate('vault')}
            className="group bg-carbon-dark/50 hover:bg-carbon-dark border border-gold/20 hover:border-gold/40 rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-gold/20 text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gold/20 p-3 rounded-lg group-hover:bg-gold/30 transition-colors">
                <FolderLock className="w-6 h-6 text-gold" />
              </div>
              <ArrowRight className="w-5 h-5 text-gold/50 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Document Vault</h3>
            <p className="text-sm text-foreground/60">Manage your documents</p>
          </button>
        </div>
      </div>
    </div>
  );
}
