import { useState } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { User, Mail, Edit2, Save, X, Loader2, CheckCircle2 } from 'lucide-react';

export default function MemberAreaPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEdit = () => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
      setIsEditing(true);
      setError('');
      setSaveSuccess(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSaveSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaveSuccess(false);

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

    try {
      await saveProfileMutation.mutateAsync({ name: name.trim(), email: email.trim() });
      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setSaveSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl p-8 text-center">
          <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-foreground/70">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl p-8 text-center">
          <p className="text-foreground/70">No profile found.</p>
        </div>
      </div>
    );
  }

  const principalId = identity?.getPrincipal().toString() || '';

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border-b border-gold/30 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gold p-4 rounded-full">
                <User className="w-8 h-8 text-carbon" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gold">Member Profile</h1>
                <p className="text-foreground/60 text-sm mt-1">Manage your account information</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-carbon font-semibold rounded-lg transition-colors shadow-lg hover:shadow-gold/50"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="bg-carbon-dark/50 border border-gold/20 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <User className="w-5 h-5 text-gold mt-1" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground/60 block mb-1">Full Name</label>
                    <p className="text-lg text-foreground font-medium">{userProfile.name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-carbon-dark/50 border border-gold/20 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Mail className="w-5 h-5 text-gold mt-1" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground/60 block mb-1">Email Address</label>
                    <p className="text-lg text-foreground font-medium">{userProfile.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-carbon-dark/50 border border-gold/20 rounded-lg p-6">
                <label className="text-sm font-medium text-foreground/60 block mb-2">Principal ID</label>
                <p className="text-xs text-foreground/50 font-mono break-all bg-carbon-darker p-3 rounded border border-gold/10">
                  {principalId}
                </p>
                <p className="text-xs text-foreground/40 mt-2">
                  Your unique identifier on the Internet Computer
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {saveSuccess && (
                <div className="bg-gold/10 border border-gold/30 text-gold px-4 py-3 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="text-sm font-medium">Profile updated successfully!</p>
                </div>
              )}

              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-foreground/80 mb-2">
                  Full Name *
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-carbon-dark border border-gold/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium text-foreground/80 mb-2">
                  Email Address *
                </label>
                <input
                  id="edit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-carbon-dark border border-gold/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saveProfileMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-carbon font-semibold rounded-lg transition-colors shadow-lg hover:shadow-gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saveProfileMutation.isPending}
                  className="px-6 py-3 bg-foreground/10 hover:bg-foreground/20 text-foreground border border-gold/30 font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
