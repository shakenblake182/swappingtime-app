import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  UserPlus,
  Edit3,
  LogIn,
  Check,
  Search,
  Sliders,
  Phone,
  Mail,
  AlertTriangle,
  Crown,
  Camera,
  Bookmark,
  BookmarkCheck,
  Eye,
  ArrowRight
} from 'lucide-react';
import { UserAccount, SiteContent, Watch, TabType } from '../types';

interface AccountMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onSwitchUser: (user: UserAccount) => void;
  onUpdateUser: (user: UserAccount) => void;
  onDeleteUser: (userId: string) => void;
  onAddUser: (newUser: Omit<UserAccount, 'id' | 'memberSince'>) => void;
  onToggleSuperAdminRole: (userId: string) => void;
  siteContent: SiteContent;
  onUpdateSiteContent: (newContent: SiteContent) => void;
  isAdminEditMode?: boolean;
  setIsAdminEditMode?: (val: boolean) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  watches: Watch[];
  onEditWatch: (watch: Watch) => void;
  onDeleteWatch: (watchId: string) => void;
  onUpdateWatch?: (watch: Watch) => void;
  onSelectWatch?: (watch: Watch) => void;
  onToggleWatch?: (watchId: string) => void;
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

export const AccountMenuDrawer: React.FC<AccountMenuDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers = [],
  onSwitchUser,
  onUpdateUser,
  onDeleteUser,
  onAddUser,
  onToggleSuperAdminRole,
  siteContent,
  onUpdateSiteContent,
  isAdminEditMode = true,
  setIsAdminEditMode = (_val: boolean) => {},
  activeTab: _activeTab,
  setActiveTab,
  watches = [],
  onEditWatch = (_watch: Watch) => {},
  onDeleteWatch = (_watchId: string) => {},
  onUpdateWatch,
  onSelectWatch,
  onToggleWatch,
}) => {
  const [activeMenuTab, setActiveMenuTab] = useState<'profile' | 'watched' | 'users' | 'pages' | 'listings' | 'ai_flags' | 'switch'>('profile');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);

  // New user form state
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'super_admin' | 'user'>('user');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserLocation, setNewUserLocation] = useState('');

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editLocation, setEditLocation] = useState(currentUser?.location || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser?.avatarUrl || LUXURY_AVATARS[0].url);
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  // Site content edit form state
  const [tempSiteContent, setTempSiteContent] = useState<SiteContent>(siteContent);
  const [contentSaveSuccess, setContentSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const safeUsers = Array.isArray(allUsers) ? allUsers : [];
  const safeWatches = Array.isArray(watches) ? watches : [];

  // Active Watched Watches for current user (auto-removes watches that have sold)
  const watchedWatchIds = currentUser?.watchedWatchIds || [];
  const activeWatchedWatches = safeWatches.filter(
    (w) => watchedWatchIds.includes(w.id) && !w.isSold
  );

  // Flagged watches for Super Admin review
  const flaggedWatches = safeWatches.filter(
    (w) => w.isFlaggedFake || w.aiAuthenticityReport?.status === 'counterfeit_flagged' || (w.aiAuthenticityReport?.counterfeitRiskScore && w.aiAuthenticityReport.counterfeitRiskScore > 20)
  );

  const filteredUsers = safeUsers.filter((u) =>
    u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.location?.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setEditAvatarUrl(event.target.result);
          setCustomAvatarInput('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAvatar = customAvatarInput.trim() || editAvatarUrl;
    onUpdateUser({
      ...currentUser,
      name: editName,
      email: editEmail,
      phone: editPhone,
      location: editLocation,
      bio: editBio,
      avatarUrl: finalAvatar,
    });
    setIsEditingProfile(false);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    onAddUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      phone: newUserPhone.trim() || undefined,
      location: newUserLocation.trim() || 'Geneva, Switzerland',
      bio: `${newUserRole === 'super_admin' ? 'Super Administrator' : 'Verified Watch Collector & Enthusiast'}.`,
      totalListings: 0,
      avatarUrl: LUXURY_AVATARS[0].url,
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserLocation('');
    setNewUserRole('user');
    setIsAddingUser(false);
  };

  const handleSaveSiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteContent(tempSiteContent);
    setContentSaveSuccess(true);
    setTimeout(() => setContentSaveSuccess(false), 2500);
  };

  // Super Admin Action: Override AI Flag & mark as Authentic
  const handleApproveWatch = (watch: Watch) => {
    if (onUpdateWatch) {
      onUpdateWatch({
        ...watch,
        isFlaggedFake: false,
        aiAuthenticityReport: {
          ...watch.aiAuthenticityReport,
          status: 'authentic',
          confidenceScore: 98,
          counterfeitRiskScore: 2,
          notes: 'Super Admin Blake verified provenance and cleared listing.',
          timestamp: new Date().toISOString(),
          opticalInspection: {
            dialTypography: 'Verified genuine typography and serifs',
            logoAlignment: 'Coronet depth and positioning match authentic baseline',
            handsAndMarkers: 'Diamond-polished edges consistent with manufacturer',
            bezelEngraving: 'Platinum-dust filled ceramic engraving authentic',
            cyclopsMagnification: 'Exact 2.5x magnification with anti-reflective coating',
            videoMovementAnalysis: 'Smooth mechanical sweep verified',
          },
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-4 sm:pr-10">
        <div className="w-screen max-w-2xl bg-[#fafaf5] border-r border-[#c4c7c7] flex flex-col justify-between shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-black text-white flex items-center justify-between border-b border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="relative group">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#d2c790]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#2a2a2a] text-[#efe3aa] flex items-center justify-center font-headline-md text-lg">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                {isSuperAdmin && (
                  <div className="absolute -bottom-1 -right-1 bg-[#efe3aa] text-black p-0.5 rounded-full border border-black" title="Super Admin Account">
                    <Crown className="w-3.5 h-3.5 fill-[#735c00] text-[#735c00]" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline-md text-lg sm:text-xl font-bold text-white tracking-wide">
                    {currentUser.name}
                  </h2>
                  {isSuperAdmin && (
                    <span className="bg-[#efe3aa] text-[#474016] text-[9px] font-label-caps px-2 py-0.5 font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3 fill-[#735c00]" /> SUPER ADMIN
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#a0a09c] flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {currentUser.email}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-[#a0a09c] hover:text-white p-2 border border-[#444] hover:border-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Super Admin Top Control Toggle */}
          {isSuperAdmin && (
            <div className="bg-[#efe3aa] border-b border-[#d8c87e] px-5 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#735c00]" />
                <span className="font-label-caps text-xs text-[#474016] font-bold">
                  Live Admin Controls &amp; In-Place Editor
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-label-caps text-xs text-[#474016] font-semibold">
                <span>Edit Mode</span>
                <input
                  type="checkbox"
                  checked={isAdminEditMode}
                  onChange={(e) => setIsAdminEditMode(e.target.checked)}
                  className="w-4 h-4 accent-[#735c00] cursor-pointer"
                />
                <span className={`px-2 py-0.5 text-[10px] ${isAdminEditMode ? 'bg-black text-white' : 'bg-white text-black border border-[#c4c7c7]'}`}>
                  {isAdminEditMode ? 'ON' : 'OFF'}
                </span>
              </label>
            </div>
          )}

          {/* Navigation Bar / Tabs inside drawer */}
          <div className="flex border-b border-[#c4c7c7] bg-white overflow-x-auto">
            <button
              id="tab-account-profile"
              onClick={() => setActiveMenuTab('profile')}
              className={`px-4 py-3 font-label-caps text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeMenuTab === 'profile'
                  ? 'border-black text-black font-bold bg-[#fafaf5]'
                  : 'border-transparent text-[#747878] hover:text-black'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              My Account / Avatar
            </button>

            <button
              id="tab-account-watched"
              onClick={() => setActiveMenuTab('watched')}
              className={`px-4 py-3 font-label-caps text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeMenuTab === 'watched'
                  ? 'border-black text-black font-bold bg-[#fafaf5]'
                  : 'border-transparent text-[#747878] hover:text-black'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-[#735c00]" />
              Watched Watches
              {activeWatchedWatches.length > 0 && (
                <span className="bg-[#efe3aa] text-[#474016] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {activeWatchedWatches.length}
                </span>
              )}
            </button>

            {isSuperAdmin && (
              <>
                <button
                  id="tab-account-ai-flags"
                  onClick={() => setActiveMenuTab('ai_flags')}
                  className={`px-4 py-3 font-label-caps text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                    activeMenuTab === 'ai_flags'
                      ? 'border-black text-black font-bold bg-[#fafaf5]'
                      : 'border-transparent text-[#747878] hover:text-black'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  AI Fake Scans
                  {flaggedWatches.length > 0 && (
                    <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                      {flaggedWatches.length}
                    </span>
                  )}
                </button>

                <button
                  id="tab-account-users"
                  onClick={() => setActiveMenuTab('users')}
                  className={`px-4 py-3 font-label-caps text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                    activeMenuTab === 'users'
                      ? 'border-black text-black font-bold bg-[#fafaf5]'
                      : 'border-transparent text-[#747878] hover:text-black'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-[#735c00]" />
                  User Governance ({safeUsers.length})
                </button>

                <button
                  id="tab-account-pages"
                  onClick={() => setActiveMenuTab('pages')}
                  className={`px-4 py-3 font-label-caps text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                    activeMenuTab === 'pages'
                      ? 'border-black text-black font-bold bg-[#fafaf5]'
                      : 'border-transparent text-[#747878] hover:text-black'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#735c00]" />
                  Edit Copy
                </button>

                <button
                  id="tab-account-listings"
                  onClick={() => setActiveMenuTab('listings')}
                  className={`px-4 py-3 font-label-caps text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                    activeMenuTab === 'listings'
                      ? 'border-black text-black font-bold bg-[#fafaf5]'
                      : 'border-transparent text-[#747878] hover:text-black'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-[#735c00]" />
                  Catalog ({safeWatches.length})
                </button>
              </>
            )}

            <button
              id="tab-account-switch"
              onClick={() => setActiveMenuTab('switch')}
              className={`px-4 py-3 font-label-caps text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeMenuTab === 'switch'
                  ? 'border-black text-black font-bold bg-[#fafaf5]'
                  : 'border-transparent text-[#747878] hover:text-black'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Switch Account
            </button>
          </div>

          {/* Drawer Body Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

            {/* TAB 1: PROFILE / ACCOUNT MANAGEMENT & AVATAR EDITING */}
            {activeMenuTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex justify-between items-center border-b border-[#eeeee9] pb-3">
                  <div>
                    <h3 className="font-headline-md text-xl text-black">Collector Profile &amp; Picture</h3>
                    <p className="text-xs text-[#747878]">Manage your credentials, custom profile photo, and dossier.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(!isEditingProfile);
                      setEditAvatarUrl(currentUser?.avatarUrl || LUXURY_AVATARS[0].url);
                    }}
                    className="font-label-caps text-xs px-3 py-1.5 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    {isEditingProfile ? 'Cancel' : 'Change Photo / Details'}
                  </button>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4 bg-white p-5 border border-[#c4c7c7]">
                    {/* Photo upload and selector */}
                    <div className="p-4 bg-[#fafaf5] border border-[#c4c7c7] space-y-3">
                      <label className="font-label-caps text-xs text-black font-bold block">
                        Customize Profile Picture
                      </label>
                      <div className="flex items-center gap-4">
                        <img
                          src={customAvatarInput.trim() || editAvatarUrl}
                          alt="Avatar Preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-black shrink-0 shadow-sm"
                        />
                        <div className="space-y-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white hover:bg-[#2f312e] text-xs font-label-caps cursor-pointer shadow-xs">
                            <Camera className="w-3.5 h-3.5" />
                            Upload from Device
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarFileUpload}
                              className="hidden"
                            />
                          </label>
                          <p className="text-[10px] text-[#747878]">
                            Upload any PNG/JPG photo or enter an image link below.
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-label-caps text-[#747878] block mb-1">
                          Direct Photo URL:
                        </span>
                        <input
                          type="url"
                          value={customAvatarInput}
                          onChange={(e) => setCustomAvatarInput(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white border border-[#c4c7c7] px-3 py-1.5 text-xs text-black outline-none focus:border-[#735c00]"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-label-caps text-[#747878] block mb-1.5">
                          Or Choose from Horological Curator Presets:
                        </span>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {LUXURY_AVATARS.map((av, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setEditAvatarUrl(av.url);
                                setCustomAvatarInput('');
                              }}
                              className={`w-10 h-10 rounded-full overflow-hidden border-2 shrink-0 transition-transform cursor-pointer ${
                                !customAvatarInput && editAvatarUrl === av.url
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

                    <div>
                      <label className="font-label-caps text-[11px] text-[#444748] block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-white border border-[#c4c7c7] px-3 py-2 text-xs text-black outline-none focus:border-[#735c00]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-label-caps text-[11px] text-[#444748] block mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full bg-white border border-[#c4c7c7] px-3 py-2 text-xs text-black outline-none focus:border-[#735c00]"
                        />
                      </div>
                      <div>
                        <label className="font-label-caps text-[11px] text-[#444748] block mb-1">Phone / Signal</label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-white border border-[#c4c7c7] px-3 py-2 text-xs text-black outline-none focus:border-[#735c00]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-label-caps text-[11px] text-[#444748] block mb-1">Location / Vault City</label>
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        placeholder="e.g. Geneva, New York, London"
                        className="w-full bg-white border border-[#c4c7c7] px-3 py-2 text-xs text-black outline-none focus:border-[#735c00]"
                      />
                    </div>

                    <div>
                      <label className="font-label-caps text-[11px] text-[#444748] block mb-1">Collector Bio</label>
                      <textarea
                        rows={3}
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        className="w-full bg-white border border-[#c4c7c7] px-3 py-2 text-xs text-black outline-none focus:border-[#735c00]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2 border border-[#c4c7c7] text-xs font-label-caps cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-black text-white text-xs font-label-caps cursor-pointer hover:bg-[#2f312e] font-bold"
                      >
                        Save Profile &amp; Photo
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-white p-5 border border-[#c4c7c7] space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-[#eeeee9]">
                      <img
                        src={currentUser.avatarUrl || LUXURY_AVATARS[0].url}
                        alt={currentUser.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-black"
                      />
                      <div>
                        <h4 className="font-headline-sm text-base font-bold text-black">{currentUser.name}</h4>
                        <p className="text-xs text-[#747878]">{currentUser.location || 'Global Collector'}</p>
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(true)}
                          className="text-[11px] text-[#735c00] font-label-caps hover:underline mt-1 block cursor-pointer"
                        >
                          Change Profile Photo →
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-label-caps text-[10px] text-[#747878] block">Role Status</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isSuperAdmin ? (
                            <span className="bg-[#efe3aa] text-[#474016] font-bold px-2 py-0.5 text-[10px]">
                              Super Administrator (Full System Authority)
                            </span>
                          ) : (
                            <span className="bg-[#eeeee9] text-[#1a1c19] font-medium px-2 py-0.5 text-[10px]">
                              Verified Independent Collector
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="font-label-caps text-[10px] text-[#747878] block">Member Since</span>
                        <p className="font-medium text-black mt-0.5">{currentUser.memberSince}</p>
                      </div>

                      <div>
                        <span className="font-label-caps text-[10px] text-[#747878] block">Direct Email</span>
                        <p className="font-medium text-black mt-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#747878]" />
                          {currentUser.email}
                        </p>
                      </div>

                      <div>
                        <span className="font-label-caps text-[10px] text-[#747878] block">Phone / Signal</span>
                        <p className="font-medium text-black mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#747878]" />
                          {currentUser.phone || 'Not configured'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="font-label-caps text-[10px] text-[#747878] block mb-1">Collector Bio / Focus</span>
                      <p className="text-xs text-[#444748] bg-[#fafaf5] p-3 border border-[#eeeee9] leading-relaxed">
                        {currentUser.bio || 'Independent watch collector active on Swapping Time.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: WATCHED WATCHES (SAVED WATCHES WITH AUTO-DELETION ON SALE) */}
            {activeMenuTab === 'watched' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex justify-between items-center border-b border-[#eeeee9] pb-3">
                  <div>
                    <h3 className="font-headline-md text-xl text-black flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-[#735c00]" />
                      Watched Watches ({activeWatchedWatches.length})
                    </h3>
                    <p className="text-xs text-[#747878]">
                      Timepieces you have saved and are watching in real time.
                    </p>
                  </div>
                  {activeWatchedWatches.length > 0 && (
                    <span className="bg-[#efe3aa] text-[#474016] font-label-caps text-[11px] px-2.5 py-1 font-bold">
                      {activeWatchedWatches.length} Available
                    </span>
                  )}
                </div>

                {/* Auto-Deletion Rule Notice */}
                <div className="p-3.5 bg-[#fafaf5] border border-[#c4c7c7] flex items-start gap-3">
                  <div className="p-1.5 bg-black text-[#efe3aa] mt-0.5 shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-label-caps text-xs font-bold text-black">
                      Automatic Sold-Timepiece Cleanup
                    </h4>
                    <p className="text-xs text-[#444748] leading-relaxed">
                      Whenever a watch you are watching sells or is removed from active consignment, it is automatically removed from this saved page.
                    </p>
                  </div>
                </div>

                {activeWatchedWatches.length === 0 ? (
                  <div className="bg-white border border-[#c4c7c7] p-10 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#fafaf5] border border-[#c4c7c7] flex items-center justify-center text-[#747878]">
                      <Bookmark className="w-7 h-7 text-[#735c00]" />
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                      <h4 className="font-headline-md text-lg text-black font-bold">
                        No Watched Watches Yet
                      </h4>
                      <p className="text-xs text-[#747878] leading-relaxed">
                        Click the <strong className="text-black">"Watch this watch"</strong> button on any timepiece in the marketplace or Discover page to track price updates and direct offer statuses here.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveTab('search');
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white hover:bg-[#2f312e] text-xs font-label-caps uppercase tracking-wider font-semibold cursor-pointer shadow-sm transition-all"
                    >
                      Browse Marketplace Catalog
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeWatchedWatches.map((w) => (
                      <article
                        key={w.id}
                        id={`watched-watch-item-${w.id}`}
                        className="bg-white p-4 border border-[#c4c7c7] hover:border-[#735c00] transition-colors space-y-3 shadow-2xs"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={w.imageUrl}
                            alt={w.model}
                            onClick={() => {
                              if (onSelectWatch) {
                                onClose();
                                onSelectWatch(w);
                              }
                            }}
                            className="w-24 h-24 object-cover object-center border border-[#c4c7c7] cursor-pointer shrink-0 hover:opacity-90 transition-opacity"
                            referrerPolicy="no-referrer"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                              <span className="font-label-caps text-[10px] text-[#735c00] uppercase font-bold tracking-wider">
                                {w.brand}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="bg-[#fafaf5] text-black font-label-caps text-[9px] px-1.5 py-0.5 border border-[#c4c7c7] flex items-center gap-1">
                                  <Eye className="w-3 h-3 text-[#735c00]" />
                                  {(w.viewCount || 0).toLocaleString()} views
                                </span>
                                <span className={`text-[9px] font-label-caps px-1.5 py-0.5 font-bold ${
                                  w.priceType === 'firm'
                                    ? 'bg-[#1c1b1b] text-white'
                                    : 'bg-[#efe3aa] text-[#474016]'
                                }`}>
                                  {w.priceType === 'firm' ? 'FIRM' : 'OBO'}
                                </span>
                              </div>
                            </div>

                            <h4
                              onClick={() => {
                                if (onSelectWatch) {
                                  onClose();
                                  onSelectWatch(w);
                                }
                              }}
                              className="font-headline-md text-base text-black font-bold hover:text-[#735c00] cursor-pointer truncate"
                            >
                              {w.model}
                            </h4>

                            <p className="text-xs text-[#747878] mt-0.5">
                              Ref: {w.reference} • {w.year} • {w.caseDiameter}
                            </p>

                            <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-[#f0f0eb]">
                              <div>
                                <span className="text-[10px] font-label-caps text-[#747878] block">Listing Price</span>
                                <span className="font-headline-sm text-base font-bold text-black">
                                  ${w.price.toLocaleString()} USD
                                </span>
                              </div>
                              <span className="text-[10px] font-label-caps text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                                Available Now
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#eeeee9]">
                          <button
                            type="button"
                            onClick={() => {
                              if (onToggleWatch) {
                                onToggleWatch(w.id);
                              }
                            }}
                            className="text-[11px] font-label-caps text-red-700 hover:text-red-900 flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove from Watchlist
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (onSelectWatch) {
                                onClose();
                                onSelectWatch(w);
                              }
                            }}
                            className="px-3.5 py-1.5 bg-black text-white hover:bg-[#2f312e] text-xs font-label-caps uppercase tracking-wider font-semibold cursor-pointer shadow-2xs flex items-center gap-1.5"
                          >
                            View Timepiece Details
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SUPER ADMIN AI AUTHENTICITY & COUNTERFEIT FLAGS */}
            {activeMenuTab === 'ai_flags' && isSuperAdmin && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex justify-between items-center border-b border-[#eeeee9] pb-3">
                  <div>
                    <h3 className="font-headline-md text-xl text-black flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-red-600" />
                      Google AI Authenticity Queue
                    </h3>
                    <p className="text-xs text-[#747878]">
                      Automated high-resolution optical inspection of listed dials, hands, bezels, cyclops magnification, and movement sweep videos.
                    </p>
                  </div>
                </div>

                {flaggedWatches.length === 0 ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-8 text-center text-xs text-emerald-900 space-y-2">
                    <ShieldCheck className="w-8 h-8 mx-auto text-emerald-600" />
                    <p className="font-bold text-sm">All Active Listings Scanned &amp; Cleared</p>
                    <p className="text-[#555]">
                      No counterfeit flags currently active. New listings uploaded with pictures and videos are automatically analyzed by Google AI.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {flaggedWatches.map((w) => {
                      const report = w.aiAuthenticityReport;
                      return (
                        <div
                          key={w.id}
                          className="bg-white border-2 border-red-300 p-5 space-y-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={w.imageUrl}
                                alt={w.model}
                                className="w-16 h-16 object-cover border border-[#c4c7c7]"
                              />
                              <div>
                                <span className="bg-red-800 text-white font-label-caps text-[9px] px-2 py-0.5 font-bold inline-flex items-center gap-1 mb-1">
                                  <ShieldAlert className="w-3 h-3" /> AI Counterfeit Flagged
                                </span>
                                <h4 className="font-headline-md text-base text-black font-bold">
                                  {w.brand} {w.model}
                                </h4>
                                <p className="text-xs text-[#747878]">
                                  Ref: {w.reference} • ${w.price.toLocaleString()} USD
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] font-label-caps text-red-700 block font-bold">
                                Risk Score
                              </span>
                              <span className="font-headline-lg text-2xl font-bold text-red-700">
                                {report?.counterfeitRiskScore || 85}%
                              </span>
                            </div>
                          </div>

                          {/* Optical Inspection Breakdown */}
                          {report?.opticalInspection && (
                            <div className="bg-red-50/60 border border-red-200 p-3 text-xs space-y-2">
                              <span className="font-label-caps text-[10px] font-bold text-red-900 block">
                                Optical Inspection Details:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                {report.opticalInspection.dialTypography && (
                                  <div>
                                    <strong className="text-red-950">Dial Typography:</strong>{' '}
                                    <span className="text-red-800">{report.opticalInspection.dialTypography}</span>
                                  </div>
                                )}
                                {report.opticalInspection.logoAlignment && (
                                  <div>
                                    <strong className="text-red-950">Logo Alignment:</strong>{' '}
                                    <span className="text-red-800">{report.opticalInspection.logoAlignment}</span>
                                  </div>
                                )}
                                {report.opticalInspection.handsAndMarkers && (
                                  <div>
                                    <strong className="text-red-950">Hands &amp; Indices:</strong>{' '}
                                    <span className="text-red-800">{report.opticalInspection.handsAndMarkers}</span>
                                  </div>
                                )}
                                {report.opticalInspection.bezelEngraving && (
                                  <div>
                                    <strong className="text-red-950">Bezel Fonts:</strong>{' '}
                                    <span className="text-red-800">{report.opticalInspection.bezelEngraving}</span>
                                  </div>
                                )}
                                {report.opticalInspection.cyclopsMagnification && (
                                  <div>
                                    <strong className="text-red-950">Cyclops Lens:</strong>{' '}
                                    <span className="text-red-800">{report.opticalInspection.cyclopsMagnification}</span>
                                  </div>
                                )}
                                {report.opticalInspection.videoMovementAnalysis && (
                                  <div>
                                    <strong className="text-red-950">Video Motion:</strong>{' '}
                                    <span className="text-red-800">{report.opticalInspection.videoMovementAnalysis}</span>
                                  </div>
                                )}
                              </div>
                              {report.notes && (
                                <p className="text-[11px] text-red-900 pt-1 border-t border-red-200">
                                  <strong>AI Findings:</strong> {report.notes}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Super Admin Action Controls */}
                          <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#e8e8e3]">
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Super Admin: Ban and remove counterfeit listing for ${w.brand} ${w.model}?`)) {
                                  onDeleteWatch(w.id);
                                }
                              }}
                              className="bg-red-800 hover:bg-red-900 text-white font-label-caps text-xs px-3.5 py-1.5 flex items-center gap-1.5 cursor-pointer font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Ban &amp; Delete Counterfeit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleApproveWatch(w)}
                              className="bg-emerald-800 hover:bg-emerald-900 text-white font-label-caps text-xs px-3.5 py-1.5 flex items-center gap-1.5 cursor-pointer font-bold"
                            >
                              <Check className="w-3.5 h-3.5" /> Super Admin Override (Mark Authentic)
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: USER GOVERNANCE (Super Admin Only) */}
            {activeMenuTab === 'users' && isSuperAdmin && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eeeee9] pb-3">
                  <div>
                    <h3 className="font-headline-md text-xl text-black">Member &amp; User Accounts</h3>
                    <p className="text-xs text-[#747878]">Manage roles, grant super admin privileges, or add verified users.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingUser(!isAddingUser)}
                    className="font-label-caps text-xs px-3 py-1.5 bg-black text-white hover:bg-[#2f312e] transition-colors cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    {isAddingUser ? 'Cancel' : 'Add New Member'}
                  </button>
                </div>

                {isAddingUser && (
                  <form onSubmit={handleCreateUser} className="space-y-4 bg-white p-5 border border-black shadow-md">
                    <h4 className="font-label-caps text-xs text-black font-bold">Register New Account</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-label-caps text-[11px] text-[#444748] block mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="e.g. Blake Golf"
                          className="w-full bg-white border border-[#c4c7c7] px-3 py-1.5 text-xs text-black outline-none focus:border-[#735c00]"
                        />
                      </div>
                      <div>
                        <label className="font-label-caps text-[11px] text-[#444748] block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="blake_golf21@yahoo.com"
                          className="w-full bg-white border border-[#c4c7c7] px-3 py-1.5 text-xs text-black outline-none focus:border-[#735c00]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-label-caps text-[11px] text-[#444748] block mb-1">Account Role</label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value as any)}
                          className="w-full bg-white border border-[#c4c7c7] px-2.5 py-1.5 text-xs text-black outline-none cursor-pointer"
                        >
                          <option value="user">Verified Collector</option>
                          <option value="super_admin">Super Administrator</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-label-caps text-[11px] text-[#444748] block mb-1">Phone (Optional)</label>
                        <input
                          type="text"
                          value={newUserPhone}
                          onChange={(e) => setNewUserPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-white border border-[#c4c7c7] px-3 py-1.5 text-xs text-black outline-none focus:border-[#735c00]"
                        />
                      </div>
                      <div>
                        <label className="font-label-caps text-[11px] text-[#444748] block mb-1">Location</label>
                        <input
                          type="text"
                          value={newUserLocation}
                          onChange={(e) => setNewUserLocation(e.target.value)}
                          placeholder="Geneva, Switzerland"
                          className="w-full bg-white border border-[#c4c7c7] px-3 py-1.5 text-xs text-black outline-none focus:border-[#735c00]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingUser(false)}
                        className="px-4 py-2 border border-[#c4c7c7] text-xs font-label-caps cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-black text-white text-xs font-label-caps cursor-pointer hover:bg-[#2f312e]"
                      >
                        Create User
                      </button>
                    </div>
                  </form>
                )}

                {/* Search users */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#747878] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search members by name, email, or city..."
                    className="w-full bg-white border border-[#c4c7c7] pl-9 pr-3 py-2 text-xs text-black outline-none focus:border-[#735c00]"
                  />
                </div>

                {/* Users List */}
                <div className="space-y-3">
                  {filteredUsers.map((user) => {
                    const isSelf = user.id === currentUser.id;
                    const isUserSuperAdmin = user.role === 'super_admin';

                    return (
                      <div
                        key={user.id}
                        className="bg-white border border-[#c4c7c7] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-black transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border border-[#c4c7c7]"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] text-[#efe3aa] flex items-center justify-center font-headline-md text-sm">
                                {user.name.charAt(0)}
                              </div>
                            )}
                            {isUserSuperAdmin && (
                              <div className="absolute -bottom-1 -right-1 bg-[#efe3aa] p-0.5 rounded-full border border-black" title="Super Admin">
                                <Crown className="w-3 h-3 fill-[#735c00] text-[#735c00]" />
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-headline-sm text-sm font-semibold text-black">{user.name}</span>
                              {isSelf && (
                                <span className="bg-black text-white text-[9px] font-label-caps px-1.5 py-0.2">
                                  Current User
                                </span>
                              )}
                              <span className={`text-[9px] font-label-caps px-1.5 py-0.2 font-bold ${
                                isUserSuperAdmin ? 'bg-[#efe3aa] text-[#474016]' : 'bg-[#eeeee9] text-[#747878]'
                              }`}>
                                {isUserSuperAdmin ? 'SUPER ADMIN' : 'COLLECTOR'}
                              </span>
                            </div>
                            <p className="text-xs text-[#747878]">{user.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {/* Toggle Super Admin Role */}
                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => onToggleSuperAdminRole(user.id)}
                              className={`px-2.5 py-1 text-[10px] font-label-caps flex items-center gap-1 border transition-colors cursor-pointer ${
                                isUserSuperAdmin
                                  ? 'bg-[#eeeee9] text-black border-[#c4c7c7] hover:bg-black hover:text-white'
                                  : 'bg-[#efe3aa] text-[#474016] border-[#d8c87e] hover:bg-[#d8c87e]'
                              }`}
                              title={isUserSuperAdmin ? 'Demote to Collector' : 'Promote to Super Admin'}
                            >
                              <Crown className="w-3 h-3 fill-current" />
                              {isUserSuperAdmin ? 'Revoke Super Admin' : 'Make Super Admin'}
                            </button>
                          )}

                          {/* Switch to this user */}
                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => {
                                onSwitchUser(user);
                                onClose();
                              }}
                              className="px-2.5 py-1 text-[10px] font-label-caps border border-[#c4c7c7] hover:border-black text-black cursor-pointer"
                              title="Switch Session"
                            >
                              Switch
                            </button>
                          )}

                          {/* Delete user */}
                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => setUserToDelete(user)}
                              className="p-1.5 text-[#747878] hover:text-red-700 transition-colors cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: PAGES CONTENT CMS (Super Admin Only) */}
            {activeMenuTab === 'pages' && isSuperAdmin && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex justify-between items-center border-b border-[#eeeee9] pb-3">
                  <div>
                    <h3 className="font-headline-md text-xl text-black">Website Header &amp; Page Copy</h3>
                    <p className="text-xs text-[#747878]">Edit the live titles, subheaders, and announcement bar texts across the site.</p>
                  </div>
                  {contentSaveSuccess && (
                    <span className="text-xs font-label-caps text-emerald-700 bg-emerald-50 px-2 py-1 flex items-center gap-1 border border-emerald-200">
                      <Check className="w-3.5 h-3.5" /> Changes Published Live
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveSiteContent} className="space-y-6">
                  {/* Announcement Bar */}
                  <div className="bg-white p-4 border border-[#c4c7c7] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-xs text-black font-bold">Top Announcement Bar</span>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempSiteContent.announcementBar.enabled}
                          onChange={(e) =>
                            setTempSiteContent({
                              ...tempSiteContent,
                              announcementBar: { ...tempSiteContent.announcementBar, enabled: e.target.checked },
                            })
                          }
                          className="accent-[#735c00]"
                        />
                        <span className="font-label-caps text-[10px]">Show Bar</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="font-label-caps text-[10px] text-[#747878] block mb-1">Badge Tag</label>
                        <input
                          type="text"
                          value={tempSiteContent.announcementBar.badge}
                          onChange={(e) =>
                            setTempSiteContent({
                              ...tempSiteContent,
                              announcementBar: { ...tempSiteContent.announcementBar, badge: e.target.value },
                            })
                          }
                          className="w-full bg-white border border-[#c4c7c7] px-2.5 py-1 text-xs text-black outline-none focus:border-[#735c00]"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="font-label-caps text-[10px] text-[#747878] block mb-1">Announcement Message</label>
                        <input
                          type="text"
                          value={tempSiteContent.announcementBar.text}
                          onChange={(e) =>
                            setTempSiteContent({
                              ...tempSiteContent,
                              announcementBar: { ...tempSiteContent.announcementBar, text: e.target.value },
                            })
                          }
                          className="w-full bg-white border border-[#c4c7c7] px-2.5 py-1 text-xs text-black outline-none focus:border-[#735c00]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Search Page Header */}
                  <div className="bg-white p-4 border border-[#c4c7c7] space-y-3">
                    <span className="font-label-caps text-xs text-black font-bold block">Watches for Sale (Search Page)</span>
                    <div>
                      <label className="font-label-caps text-[10px] text-[#747878] block mb-1">Page Title</label>
                      <input
                        type="text"
                        value={tempSiteContent.searchPage.title}
                        onChange={(e) =>
                          setTempSiteContent({
                            ...tempSiteContent,
                            searchPage: { ...tempSiteContent.searchPage, title: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#c4c7c7] px-2.5 py-1 text-xs text-black outline-none focus:border-[#735c00]"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[10px] text-[#747878] block mb-1">Page Subtitle</label>
                      <input
                        type="text"
                        value={tempSiteContent.searchPage.subtitle}
                        onChange={(e) =>
                          setTempSiteContent({
                            ...tempSiteContent,
                            searchPage: { ...tempSiteContent.searchPage, subtitle: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#c4c7c7] px-2.5 py-1 text-xs text-black outline-none focus:border-[#735c00]"
                      />
                    </div>
                  </div>

                  {/* Sell Page Header */}
                  <div className="bg-white p-4 border border-[#c4c7c7] space-y-3">
                    <span className="font-label-caps text-xs text-black font-bold block">Sell &amp; Consign Page</span>
                    <div>
                      <label className="font-label-caps text-[10px] text-[#747878] block mb-1">Page Title</label>
                      <input
                        type="text"
                        value={tempSiteContent.sellPage.title}
                        onChange={(e) =>
                          setTempSiteContent({
                            ...tempSiteContent,
                            sellPage: { ...tempSiteContent.sellPage, title: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#c4c7c7] px-2.5 py-1 text-xs text-black outline-none focus:border-[#735c00]"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[10px] text-[#747878] block mb-1">Page Subtitle</label>
                      <input
                        type="text"
                        value={tempSiteContent.sellPage.subtitle}
                        onChange={(e) =>
                          setTempSiteContent({
                            ...tempSiteContent,
                            sellPage: { ...tempSiteContent.sellPage, subtitle: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#c4c7c7] px-2.5 py-1 text-xs text-black outline-none focus:border-[#735c00]"
                      />
                    </div>
                  </div>

                  {/* Vault Page Header */}
                  <div className="bg-white p-4 border border-[#c4c7c7] space-y-3">
                    <span className="font-label-caps text-xs text-black font-bold block">Vault &amp; Portfolio Page</span>
                    <div>
                      <label className="font-label-caps text-[10px] text-[#747878] block mb-1">Page Title</label>
                      <input
                        type="text"
                        value={tempSiteContent.vaultPage.title}
                        onChange={(e) =>
                          setTempSiteContent({
                            ...tempSiteContent,
                            vaultPage: { ...tempSiteContent.vaultPage, title: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#c4c7c7] px-2.5 py-1 text-xs text-black outline-none focus:border-[#735c00]"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[10px] text-[#747878] block mb-1">Page Subtitle</label>
                      <input
                        type="text"
                        value={tempSiteContent.vaultPage.subtitle}
                        onChange={(e) =>
                          setTempSiteContent({
                            ...tempSiteContent,
                            vaultPage: { ...tempSiteContent.vaultPage, subtitle: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#c4c7c7] px-2.5 py-1 text-xs text-black outline-none focus:border-[#735c00]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-black text-white text-xs font-label-caps cursor-pointer hover:bg-[#2f312e] font-bold shadow-sm"
                    >
                      Publish Live Content Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 4: ALL WATCHES CATALOG (Super Admin Only) */}
            {activeMenuTab === 'listings' && isSuperAdmin && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex justify-between items-center border-b border-[#eeeee9] pb-3">
                  <div>
                    <h3 className="font-headline-md text-xl text-black">Watch Catalog Management</h3>
                    <p className="text-xs text-[#747878]">Total active pieces in registry: {safeWatches.length}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('sell');
                      onClose();
                    }}
                    className="font-label-caps text-xs px-3 py-1.5 bg-black text-white hover:bg-[#2f312e] transition-colors cursor-pointer"
                  >
                    + Add New Watch
                  </button>
                </div>

                <div className="space-y-3">
                  {safeWatches.map((w) => (
                    <div
                      key={w.id}
                      className="bg-white border border-[#c4c7c7] p-3 flex items-center justify-between gap-3 hover:border-black transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={w.imageUrl}
                          alt={w.model}
                          className="w-12 h-12 object-cover border border-[#c4c7c7] shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-label-caps text-[10px] text-[#747878] block truncate">{w.brand}</span>
                          <h4 className="font-headline-sm text-sm font-semibold text-black truncate">{w.model}</h4>
                          <p className="text-xs text-[#747878]">Ref: {w.reference} • ${w.price.toLocaleString()} USD</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onEditWatch(w);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-[10px] font-label-caps border border-[#c4c7c7] hover:border-black text-black cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Super Admin: Delete ${w.brand} ${w.model}?`)) {
                              onDeleteWatch(w.id);
                            }
                          }}
                          className="p-1.5 text-[#747878] hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: SWITCH ACCOUNT */}
            {activeMenuTab === 'switch' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-[#eeeee9] pb-3">
                  <h3 className="font-headline-md text-xl text-black">Switch Active Account</h3>
                  <p className="text-xs text-[#747878]">Test the application from any registered collector or administrator viewpoint.</p>
                </div>

                <div className="space-y-3">
                  {safeUsers.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    const isSuper = user.role === 'super_admin';

                    return (
                      <div
                        key={user.id}
                        onClick={() => {
                          onSwitchUser(user);
                          onClose();
                        }}
                        className={`p-4 border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-black text-white border-black shadow-md'
                            : 'bg-white text-black border-[#c4c7c7] hover:border-black'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className={`w-10 h-10 rounded-full object-cover border ${isSelected ? 'border-[#efe3aa]' : 'border-[#c4c7c7]'}`}
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-headline-md text-sm ${isSelected ? 'bg-[#2a2a2a] text-[#efe3aa]' : 'bg-[#eeeee9] text-black'}`}>
                              {user.name.charAt(0)}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-headline-sm text-sm font-semibold truncate">{user.name}</span>
                              <span className={`text-[9px] font-label-caps px-1.5 py-0.2 font-bold ${
                                isSuper
                                  ? 'bg-[#efe3aa] text-[#474016]'
                                  : isSelected
                                  ? 'bg-[#2a2a2a] text-[#c8c6c5]'
                                  : 'bg-[#eeeee9] text-[#747878]'
                              }`}>
                                {isSuper ? 'SUPER ADMIN' : 'COLLECTOR'}
                              </span>
                            </div>
                            <p className={`text-xs truncate ${isSelected ? 'text-[#a0a09c]' : 'text-[#747878]'}`}>
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="flex items-center gap-1 text-[#efe3aa] text-xs font-label-caps font-semibold">
                            <Check className="w-4 h-4" />
                            Active
                          </div>
                        ) : (
                          <span className="text-xs font-label-caps text-[#747878]">Switch →</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Area */}
          <div className="p-4 bg-white border-t border-[#c4c7c7] flex justify-between items-center text-xs text-[#747878]">
            <span>Swapping Time Security Layer</span>
            <span>Logged in as: <strong className="text-black">{currentUser.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Delete User */}
      {userToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#fafaf5] border border-black p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-headline-md text-lg text-black">Confirm User Account Deletion</h3>
            </div>
            
            <p className="text-xs text-[#444748] leading-relaxed">
              Are you sure you want to permanently delete user <strong className="text-black">{userToDelete.name}</strong> ({userToDelete.email})? This action is irrevocable and immediately removes all permissions and active session data.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#c4c7c7]">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 border border-[#c4c7c7] text-xs font-label-caps cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-delete-user"
                onClick={() => {
                  onDeleteUser(userToDelete.id);
                  setUserToDelete(null);
                }}
                className="px-5 py-2 bg-red-700 text-white text-xs font-label-caps hover:bg-red-800 transition-colors cursor-pointer font-bold"
              >
                Permanently Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
