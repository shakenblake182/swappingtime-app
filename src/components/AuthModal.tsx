import React, { useState } from 'react';
import {
  Shield,
  Crown,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Camera,
  Check,
  Sparkles,
  MapPin,
  Phone,
  AlertCircle
} from 'lucide-react';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: UserAccount) => void;
  allUsers: UserAccount[];
  onRegisterUser: (newUser: Omit<UserAccount, 'id' | 'memberSince'> & { password?: string }) => void;
}

const LUXURY_AVATARS = [
  {
    label: 'Geneva Curator',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  },
  {
    label: 'Vintage Archivist',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  },
  {
    label: 'High Complication Collector',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
  },
  {
    label: 'Independent Watchmaker',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  },
  {
    label: 'Chronograph Connoisseur',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onLoginSuccess,
  allUsers,
  onRegisterUser,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpLocation, setSignUpLocation] = useState('');
  const [signUpBio, setSignUpBio] = useState('');
  const [signUpAvatar, setSignUpAvatar] = useState(LUXURY_AVATARS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isSuperAdminApplicant, setIsSuperAdminApplicant] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetEmail = signInEmail.trim().toLowerCase();
    const user = allUsers.find((u) => u.email.toLowerCase() === targetEmail);

    if (!user) {
      setErrorMsg('No registered collector account found with this email address. Please sign up below.');
      return;
    }

    // If user has a password set, verify it
    if (user.password && user.password !== signInPassword) {
      setErrorMsg('Invalid password. For Super Admin Blake, enter: FLYers1485!@#$');
      return;
    }

    onLoginSuccess(user);
  };

  const handleQuickFillSuperAdmin = () => {
    setSignInEmail('blake_golf21@yahoo.com');
    setSignInPassword('FLYers1485!@#$');
    setErrorMsg('');
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setSignUpAvatar(event.target.result);
          setCustomAvatarUrl('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!signUpName.trim()) {
      setErrorMsg('Please enter your full name or collector alias.');
      return;
    }

    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!signUpPassword || signUpPassword.length < 6) {
      setErrorMsg('Password must contain at least 6 characters.');
      return;
    }

    // Check if email already exists
    const existing = allUsers.find(
      (u) => u.email.toLowerCase() === signUpEmail.trim().toLowerCase()
    );
    if (existing) {
      setErrorMsg('An account with this email already exists. Please sign in instead.');
      return;
    }

    const finalAvatar = customAvatarUrl.trim() || signUpAvatar;

    const newUserPayload = {
      name: signUpName.trim(),
      email: signUpEmail.trim().toLowerCase(),
      role: isSuperAdminApplicant ? ('super_admin' as const) : ('user' as const),
      password: signUpPassword,
      avatarUrl: finalAvatar,
      phone: signUpPhone.trim() || undefined,
      location: signUpLocation.trim() || 'Global Collector',
      bio: signUpBio.trim() || 'Horological connoisseur & active collector on Swapping Time.',
      totalListings: 0,
    };

    onRegisterUser(newUserPayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#fafaf5] border border-[#c4c7c7] max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Branding Banner */}
        <div className="bg-[#1c1b1b] text-white p-6 text-center border-b border-[#333]">
          <span className="font-label-caps text-[10px] tracking-[0.25em] text-[#efe3aa] block mb-1">
            MEMBER AUTHENTICATION GATEWAY
          </span>
          <h2 className="font-display-lg text-2xl tracking-widest text-white">
            Swapping Time
          </h2>
          <p className="font-body-md text-xs text-[#c4c7c7] mt-1 max-w-sm mx-auto">
            Please sign in or create a verified collector account to access the private archive, vault ledger, and direct peer negotiations.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#c4c7c7] bg-white">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-xs font-label-caps font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              authMode === 'signin'
                ? 'bg-[#fafaf5] text-black border-b-2 border-black'
                : 'text-[#747878] hover:text-black hover:bg-neutral-50'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Sign In to Archive
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-xs font-label-caps font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              authMode === 'signup'
                ? 'bg-[#fafaf5] text-black border-b-2 border-black'
                : 'text-[#747878] hover:text-black hover:bg-neutral-50'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            New Collector Sign Up
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {authMode === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-label-caps text-[#444748] mb-1">
                  Email Address / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#747878] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g. blake_golf21@yahoo.com"
                    className="w-full bg-white border border-[#c4c7c7] pl-9 pr-3 py-2.5 text-sm text-black outline-none focus:border-[#735c00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-caps text-[#444748] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#747878] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full bg-white border border-[#c4c7c7] pl-9 pr-10 py-2.5 text-sm text-black outline-none focus:border-[#735c00]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#747878] hover:text-black cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-[#2f312e] text-white py-3 font-label-caps text-xs tracking-wider transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2 font-bold"
              >
                <LogIn className="w-4 h-4" /> Access Collector Portal
              </button>

              {/* Quick Fill Super Admin Shortcut */}
              <div className="pt-3 border-t border-[#e8e8e3] space-y-2">
                <p className="text-[11px] font-label-caps text-[#747878] text-center">
                  Super Admin Quick Fill:
                </p>
                <button
                  type="button"
                  onClick={handleQuickFillSuperAdmin}
                  className="w-full py-2 bg-[#efe3aa] hover:bg-[#e4d593] text-[#474016] border border-[#d8c87e] text-xs font-label-caps font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 fill-[#735c00]" />
                  Fill Super User (Blake: blake_golf21@yahoo.com)
                </button>
              </div>

              {/* Quick Switch to other existing demo accounts */}
              <div className="pt-2">
                <span className="text-[10px] font-label-caps text-[#747878] block mb-1.5 text-center">
                  Or select demo collector profile:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {allUsers
                    .filter((u) => u.email !== 'blake_golf21@yahoo.com')
                    .slice(0, 4)
                    .map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setSignInEmail(user.email);
                          setSignInPassword(user.password || 'password123');
                        }}
                        className="p-1.5 bg-white border border-[#e8e8e3] hover:border-black text-left text-[10px] truncate cursor-pointer transition-colors"
                      >
                        <span className="font-semibold block truncate text-black">{user.name}</span>
                        <span className="text-[#747878] text-[9px] block truncate">{user.email}</span>
                      </button>
                    ))}
                </div>
              </div>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-label-caps text-[#444748] mb-1">
                  Full Name / Collector Alias *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#747878] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Sterling Chrono / Jane Doe"
                    className="w-full bg-white border border-[#c4c7c7] pl-9 pr-3 py-2 text-sm text-black outline-none focus:border-[#735c00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-caps text-[#444748] mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#747878] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="collector@example.com"
                    className="w-full bg-white border border-[#c4c7c7] pl-9 pr-3 py-2 text-sm text-black outline-none focus:border-[#735c00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-caps text-[#444748] mb-1">
                  Create Password (min. 6 characters) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#747878] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Enter secure password"
                    className="w-full bg-white border border-[#c4c7c7] pl-9 pr-10 py-2 text-sm text-black outline-none focus:border-[#735c00]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#747878] hover:text-black cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Profile Picture Customization Section */}
              <div className="p-3.5 bg-white border border-[#c4c7c7] space-y-3">
                <label className="block text-xs font-label-caps text-black font-bold">
                  Collector Profile Picture
                </label>

                {/* Preview Selected Avatar */}
                <div className="flex items-center gap-3">
                  <img
                    src={customAvatarUrl.trim() || signUpAvatar}
                    alt="Avatar Preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-black shrink-0 shadow-sm"
                  />
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-black block">
                      Custom Avatar Active
                    </span>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1c1b1b] text-white hover:bg-black text-[11px] font-label-caps cursor-pointer">
                      <Camera className="w-3.5 h-3.5" />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Custom URL Input */}
                <div>
                  <span className="text-[10px] font-label-caps text-[#747878] block mb-1">
                    Or Enter Direct Image URL:
                  </span>
                  <input
                    type="url"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#fafaf5] border border-[#e8e8e3] px-2.5 py-1.5 text-xs text-black outline-none focus:border-[#735c00]"
                  />
                </div>

                {/* Preset Avatar Selection */}
                <div>
                  <span className="text-[10px] font-label-caps text-[#747878] block mb-1.5">
                    Or Choose Horological Curator Preset:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {LUXURY_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSignUpAvatar(av.url);
                          setCustomAvatarUrl('');
                        }}
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 shrink-0 transition-transform cursor-pointer ${
                          !customAvatarUrl && signUpAvatar === av.url
                            ? 'border-[#735c00] scale-110'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        title={av.label}
                      >
                        <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location & Phone Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-label-caps text-[#444748] mb-1">
                    Location (City / Country)
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-[#747878] absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={signUpLocation}
                      onChange={(e) => setSignUpLocation(e.target.value)}
                      placeholder="Geneva, Switzerland"
                      className="w-full bg-white border border-[#c4c7c7] pl-8 pr-2.5 py-1.5 text-xs text-black outline-none focus:border-[#735c00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-label-caps text-[#444748] mb-1">
                    Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#747878] absolute left-2.5 top-2.5" />
                    <input
                      type="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border border-[#c4c7c7] pl-8 pr-2.5 py-1.5 text-xs text-black outline-none focus:border-[#735c00]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-caps text-[#444748] mb-1">
                  Collector Bio / Horological Focus
                </label>
                <textarea
                  rows={2}
                  value={signUpBio}
                  onChange={(e) => setSignUpBio(e.target.value)}
                  placeholder="e.g. Focus on vintage Rolex sport chronographs and Patek complications..."
                  className="w-full bg-white border border-[#c4c7c7] px-3 py-1.5 text-xs text-black outline-none focus:border-[#735c00]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-[#2f312e] text-white py-3 font-label-caps text-xs tracking-wider transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2 font-bold"
              >
                <UserPlus className="w-4 h-4" /> Create Account &amp; Enter Platform
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
