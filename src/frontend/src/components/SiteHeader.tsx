import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Crown, LogOut, Home, UserPlus, LogIn, Users, LayoutDashboard, Calendar, MessageSquare, FolderLock, UsersRound, Bell, History, Clock, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type View = 
  | 'home' 
  | 'signin' 
  | 'signup' 
  | 'member' 
  | 'dashboard' 
  | 'meetings' 
  | 'messages' 
  | 'vault' 
  | 'members' 
  | 'noticeboard'
  | 'meeting-history'
  | 'recent-meetings'
  | 'member-search';

interface SiteHeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}

export default function SiteHeader({ currentView, onNavigate, onLogout, isAuthenticated }: SiteHeaderProps) {
  const { clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin } = useIsCallerAdmin();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    onLogout();
  };

  const isLoggingOut = loginStatus === 'logging-in';

  return (
    <header className="border-b border-gold/20 bg-carbon-darker/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group"
          >
            <div className="bg-gradient-to-br from-gold to-gold-dark p-2 rounded-lg shadow-lg group-hover:shadow-gold/50 transition-shadow">
              <Crown className="w-6 h-6 text-carbon" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Indian Union
            </h1>
          </button>

          <nav className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => onNavigate('home')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'home'
                      ? 'bg-gold/20 text-gold'
                      : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </button>
                <button
                  onClick={() => onNavigate('signin')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'signin'
                      ? 'bg-gold/20 text-gold'
                      : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-carbon font-semibold rounded-lg transition-colors shadow-lg hover:shadow-gold/50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-gold/20 text-gold'
                      : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                <button
                  onClick={() => onNavigate('noticeboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'noticeboard'
                      ? 'bg-gold/20 text-gold'
                      : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">Notices</span>
                </button>
                
                {/* Meetings Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        currentView === 'meetings' || currentView === 'meeting-history' || currentView === 'recent-meetings'
                          ? 'bg-gold/20 text-gold'
                          : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      <span className="hidden sm:inline">Meetings</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-carbon-dark border-gold/20">
                    <DropdownMenuItem
                      onClick={() => onNavigate('meetings')}
                      className="cursor-pointer hover:bg-gold/10 focus:bg-gold/10"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      All Meetings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onNavigate('recent-meetings')}
                      className="cursor-pointer hover:bg-gold/10 focus:bg-gold/10"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Recent Meetings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onNavigate('meeting-history')}
                      className="cursor-pointer hover:bg-gold/10 focus:bg-gold/10"
                    >
                      <History className="w-4 h-4 mr-2" />
                      Meeting History
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={() => onNavigate('messages')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'messages'
                      ? 'bg-gold/20 text-gold'
                      : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Messages</span>
                </button>
                <button
                  onClick={() => onNavigate('vault')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'vault'
                      ? 'bg-gold/20 text-gold'
                      : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                  }`}
                >
                  <FolderLock className="w-4 h-4" />
                  <span className="hidden sm:inline">Vault</span>
                </button>
                
                {/* Members Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        currentView === 'members' || currentView === 'member-search'
                          ? 'bg-gold/20 text-gold'
                          : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                      }`}
                    >
                      <UsersRound className="w-4 h-4" />
                      <span className="hidden sm:inline">Members</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-carbon-dark border-gold/20">
                    <DropdownMenuItem
                      onClick={() => onNavigate('member-search')}
                      className="cursor-pointer hover:bg-gold/10 focus:bg-gold/10"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search Members
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator className="bg-gold/20" />
                        <DropdownMenuItem
                          onClick={() => onNavigate('members')}
                          className="cursor-pointer hover:bg-gold/10 focus:bg-gold/10"
                        >
                          <UsersRound className="w-4 h-4 mr-2" />
                          All Members (Admin)
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={() => onNavigate('member')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'member'
                      ? 'bg-gold/20 text-gold'
                      : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 px-4 py-2 bg-foreground/10 hover:bg-foreground/20 text-foreground/70 hover:text-foreground rounded-lg transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {isLoggingOut ? 'Logging out...' : 'Sign Out'}
                  </span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
