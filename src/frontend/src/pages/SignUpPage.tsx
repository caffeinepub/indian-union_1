import { useState } from 'react';
import { useRegister } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { UserPlus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SignUpPageProps {
  onNavigate: (view: 'signin' | 'member') => void;
}

export default function SignUpPage({ onNavigate }: SignUpPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { identity, login, loginStatus } = useInternetIdentity();
  const registerMutation = useRegister();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isAuthenticated) {
      setError('Please authenticate first using Internet Identity');
      return;
    }

    try {
      await registerMutation.mutateAsync({ name: name.trim(), email: email.trim() });
      setSuccess(true);
      setTimeout(() => {
        onNavigate('member');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const handleAuthenticate = async () => {
    try {
      await login();
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center bg-gold/20 p-4 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-gold" />
          </div>
          <h2 className="text-2xl font-bold text-gold mb-4">Registration Successful!</h2>
          <p className="text-foreground/70 mb-6">
            Welcome to Indian Union. Redirecting to your member area...
          </p>
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 text-gold animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gold/20 p-3 rounded-xl mb-4">
            <UserPlus className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-3xl font-bold text-gold mb-2">Join Indian Union</h2>
          <p className="text-foreground/70">
            Create your member account in two simple steps
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="space-y-4">
            <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
              <p className="text-sm text-foreground/80 mb-4">
                <strong className="text-gold">Step 1:</strong> First, authenticate with Internet Identity to secure your account.
              </p>
              <button
                onClick={handleAuthenticate}
                disabled={isLoggingIn}
                className="w-full px-6 py-3 bg-gold hover:bg-gold-light text-carbon font-bold rounded-lg transition-colors shadow-lg hover:shadow-gold/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Authenticate with Internet Identity'
                )}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gold/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-foreground/60">Already have an account?</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('signin')}
              className="w-full px-6 py-3 bg-foreground/10 hover:bg-foreground/20 text-foreground border border-gold/30 font-semibold rounded-lg transition-colors"
            >
              Sign In Instead
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gold/10 border border-gold/30 rounded-lg p-3 mb-6">
              <p className="text-sm text-foreground/80">
                <strong className="text-gold">Step 2:</strong> Complete your profile information
              </p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-2">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-carbon-dark border border-gold/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-carbon-dark border border-gold/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full px-6 py-4 bg-gold hover:bg-gold-light text-carbon font-bold rounded-lg transition-colors shadow-lg hover:shadow-gold/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Complete Registration
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
