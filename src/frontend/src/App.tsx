import { useState, useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import SiteHeader from './components/SiteHeader';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import MemberAreaPage from './pages/MemberAreaPage';
import DashboardPage from './pages/DashboardPage';
import MeetingsPage from './pages/MeetingsPage';
import MessagesPage from './pages/MessagesPage';
import DocumentVaultPage from './pages/DocumentVaultPage';
import MembersPage from './pages/MembersPage';
import NoticeBoardPage from './pages/NoticeBoardPage';
import MeetingHistoryPage from './pages/MeetingHistoryPage';
import RecentMeetingsPage from './pages/RecentMeetingsPage';
import MemberSearchPage from './pages/MemberSearchPage';
import ProfileSetupModal from './components/ProfileSetupModal';

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

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  // Show profile setup modal if authenticated but no profile exists
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Navigate to dashboard after successful login if profile exists
  useEffect(() => {
    if (isAuthenticated && userProfile && currentView === 'signin') {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, userProfile, currentView]);

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  const handleLogout = () => {
    setCurrentView('home');
  };

  const handleProfileSetupComplete = () => {
    setCurrentView('dashboard');
  };

  const renderAuthenticatedView = (view: View, Component: React.ComponentType<any>) => {
    if (isAuthenticated) {
      return <Component onNavigate={handleNavigate} />;
    }
    return (
      <div className="text-center py-20">
        <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gold mb-4">Access Denied</h2>
          <p className="text-foreground/80 mb-6">
            You must be signed in to access this area.
          </p>
          <button
            onClick={() => handleNavigate('signin')}
            className="px-6 py-3 bg-gold hover:bg-gold-light text-carbon font-semibold rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-carbon via-carbon-dark to-carbon-darker">
      <SiteHeader
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentView === 'signin' && <SignInPage onNavigate={handleNavigate} />}
        {currentView === 'signup' && <SignUpPage onNavigate={handleNavigate} />}
        {currentView === 'dashboard' && renderAuthenticatedView('dashboard', DashboardPage)}
        {currentView === 'member' && renderAuthenticatedView('member', MemberAreaPage)}
        {currentView === 'meetings' && renderAuthenticatedView('meetings', MeetingsPage)}
        {currentView === 'messages' && renderAuthenticatedView('messages', MessagesPage)}
        {currentView === 'vault' && renderAuthenticatedView('vault', DocumentVaultPage)}
        {currentView === 'members' && renderAuthenticatedView('members', MembersPage)}
        {currentView === 'noticeboard' && renderAuthenticatedView('noticeboard', NoticeBoardPage)}
        {currentView === 'meeting-history' && renderAuthenticatedView('meeting-history', MeetingHistoryPage)}
        {currentView === 'recent-meetings' && renderAuthenticatedView('recent-meetings', RecentMeetingsPage)}
        {currentView === 'member-search' && renderAuthenticatedView('member-search', MemberSearchPage)}
      </main>

      {showProfileSetup && (
        <ProfileSetupModal onComplete={handleProfileSetupComplete} />
      )}

      <footer className="mt-20 border-t border-gold/20 bg-carbon-darker/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-foreground/60 text-sm">
            <p>
              © {new Date().getFullYear()} Indian Union. Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
