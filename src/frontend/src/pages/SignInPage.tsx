import { useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';

interface SignInPageProps {
  onNavigate: (view: 'home' | 'signup') => void;
}

export default function SignInPage({ onNavigate }: SignInPageProps) {
  const { login, loginStatus, loginError, identity } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';
  const isError = loginStatus === 'loginError';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gold/20 p-3 rounded-xl mb-4">
            <LogIn className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-3xl font-bold text-gold mb-2">Sign In</h2>
          <p className="text-foreground/70">
            Access your member account securely
          </p>
        </div>

        {isError && loginError && (
          <div className="mb-6 bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Authentication Failed</p>
              <p>{loginError.message}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full px-6 py-4 bg-gold hover:bg-gold-light text-carbon font-bold rounded-lg transition-colors shadow-lg hover:shadow-gold/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In with Internet Identity
              </>
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gold/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-foreground/60">New to Indian Union?</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('signup')}
            className="w-full px-6 py-3 bg-foreground/10 hover:bg-foreground/20 text-foreground border border-gold/30 font-semibold rounded-lg transition-colors"
          >
            Create an Account
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gold/20">
          <p className="text-sm text-foreground/60 text-center">
            Internet Identity provides secure, anonymous authentication without passwords.
          </p>
        </div>
      </div>
    </div>
  );
}
