import { Crown, Shield, Users, Award } from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: 'signin' | 'signup') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="inline-flex items-center justify-center bg-gradient-to-br from-gold to-gold-dark p-4 rounded-2xl shadow-2xl mb-8">
          <Crown className="w-16 h-16 text-carbon" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
          Welcome to Indian Union
        </h1>
        <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
          A secure platform for managing member records and building a strong community together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('signup')}
            className="px-8 py-4 bg-gold hover:bg-gold-light text-carbon font-bold rounded-lg transition-colors shadow-lg hover:shadow-gold/50 text-lg"
          >
            Join Now
          </button>
          <button
            onClick={() => onNavigate('signin')}
            className="px-8 py-4 bg-foreground/10 hover:bg-foreground/20 text-foreground border border-gold/30 font-semibold rounded-lg transition-colors text-lg"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 py-12">
        <div className="bg-card/30 backdrop-blur-sm border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-colors">
          <div className="bg-gold/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-xl font-bold text-gold mb-2">Secure Authentication</h3>
          <p className="text-foreground/70">
            Your data is protected with Internet Identity, ensuring privacy and security.
          </p>
        </div>

        <div className="bg-card/30 backdrop-blur-sm border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-colors">
          <div className="bg-gold/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-xl font-bold text-gold mb-2">Member Management</h3>
          <p className="text-foreground/70">
            Easily manage your profile and stay connected with the community.
          </p>
        </div>

        <div className="bg-card/30 backdrop-blur-sm border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-colors">
          <div className="bg-gold/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-gold" />
          </div>
          <h3 className="text-xl font-bold text-gold mb-2">Trusted Platform</h3>
          <p className="text-foreground/70">
            Built on blockchain technology for transparency and reliability.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 rounded-2xl border border-gold/20 mt-12">
        <h2 className="text-3xl font-bold text-gold mb-4">Ready to Get Started?</h2>
        <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
          Join our community today and experience secure, decentralized member management.
        </p>
        <button
          onClick={() => onNavigate('signup')}
          className="px-8 py-3 bg-gold hover:bg-gold-light text-carbon font-bold rounded-lg transition-colors shadow-lg hover:shadow-gold/50"
        >
          Create Your Account
        </button>
      </section>
    </div>
  );
}
