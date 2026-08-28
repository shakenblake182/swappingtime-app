import React from 'react';
import { Menu, MessageSquare, X, Shield, Crown, User, Edit3, Globe, Sparkles, LogOut } from 'lucide-react';
import { TabType, UserAccount, SiteContent } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  inquiryCount: number;
  openInquiries: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  currentUser: UserAccount;
  siteContent: SiteContent;
  isAdminEditMode: boolean;
  setIsAdminEditMode: (val: boolean) => void;
  onOpenPageEdit: (page: TabType) => void;
  onSignOut?: () => void;
  onOpenProfilePhoto?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  inquiryCount,
  openInquiries,
  isMenuOpen,
  setIsMenuOpen,
  currentUser,
  siteContent,
  isAdminEditMode,
  setIsAdminEditMode,
  onOpenPageEdit,
  onSignOut,
  onOpenProfilePhoto,
}) => {
  const isSuperAdmin = currentUser.role === 'super_admin';

  return (
    <header className="bg-[#fafaf5] border-b border-[#c4c7c7] sticky top-0 z-40 w-full transition-colors duration-300">
      {/* Top Announcement Bar if enabled */}
      {siteContent.announcementBar.enabled && (
        <div className="bg-[#1c1b1b] text-white px-4 py-1.5 text-[10px] md:text-[11px] font-label-caps tracking-widest flex items-center justify-between border-b border-[#333]">
          <div className="flex items-center gap-2 mx-auto truncate">
            {siteContent.announcementBar.badge && (
              <span className="bg-[#efe3aa] text-[#474016] font-bold px-1.5 py-0.2 text-[9px]">
                {siteContent.announcementBar.badge}
              </span>
            )}
            <span className="truncate">{siteContent.announcementBar.text}</span>
          </div>

          {isSuperAdmin && isAdminEditMode && (
            <button
              onClick={() => onOpenPageEdit(activeTab)}
              className="text-[#efe3aa] hover:underline text-[9px] flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Edit Bar
            </button>
          )}
        </div>
      )}

      {/* Main Header Bar */}
      <div className="flex justify-between items-center px-4 md:px-8 h-20 w-full max-w-[1280px] mx-auto gap-2">
        {/* Left: Hamburger Button & User Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            id="btn-header-menu"
            aria-label="User Account and Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black hover:text-[#735c00] transition-colors duration-300 p-2 cursor-pointer flex items-center gap-2 hover:bg-[#eeeee9] border border-transparent hover:border-[#c4c7c7]"
            title="User Sign In, Account Management & Super Admin Tools"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <div className="flex flex-col justify-center gap-1.2 w-6 h-6">
                <span className="block h-0.5 w-6 bg-black"></span>
                <span className="block h-0.5 w-6 bg-black"></span>
                <span className="block h-0.5 w-6 bg-black"></span>
              </div>
            )}
            <span className="hidden sm:inline font-label-caps text-xs font-semibold text-black">
              Menu / Account
            </span>
          </button>

          {/* User Status Chip & Avatar */}
          <div
            onClick={() => setIsMenuOpen(true)}
            className="cursor-pointer hidden sm:flex items-center gap-2 px-2.5 py-1 bg-white border border-[#c4c7c7] hover:border-black transition-colors"
            title="Click to view collector profile & switch account"
          >
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-[#c4c7c7]"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-[#1c1b1b] text-white text-[10px] flex items-center justify-center font-bold">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <span className="text-[11px] font-medium text-black max-w-[100px] truncate">
              {currentUser.name}
            </span>
            {isSuperAdmin && (
              <span className="bg-[#efe3aa] text-[#474016] text-[8px] font-label-caps px-1 py-0.2 font-bold flex items-center gap-0.5">
                <Crown className="w-2.5 h-2.5 fill-[#735c00]" /> ADMIN
              </span>
            )}
          </div>
        </div>

        {/* Center: Brand Logo */}
        <h1
          id="logo-swapping-time"
          onClick={() => setActiveTab('discover')}
          className="font-display-lg text-xl sm:text-2xl md:text-3xl tracking-[0.2em] text-black m-0 text-center flex-1 cursor-pointer select-none truncate"
        >
          Swapping Time
        </h1>

        {/* Right: Negotiations & Sign Out Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-header-inquiries"
            aria-label="Inquiries & Offers"
            onClick={openInquiries}
            className="text-black hover:text-[#735c00] transition-colors duration-300 p-2 relative cursor-pointer flex items-center gap-1.5 hover:bg-[#eeeee9] border border-transparent hover:border-[#c4c7c7]"
            title="Inquiries & Offers"
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden lg:inline font-label-caps text-xs font-semibold">
              Negotiations
            </span>
            {inquiryCount > 0 && (
              <span className="bg-[#735c00] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {inquiryCount}
              </span>
            )}
          </button>

          {/* User Signout Button */}
          {onSignOut && (
            <button
              id="btn-header-signout"
              onClick={onSignOut}
              className="bg-white hover:bg-[#1c1b1b] text-black hover:text-white border border-[#c4c7c7] hover:border-black px-2.5 py-1.5 font-label-caps text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Sign Out of your account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Navigation Cluster */}
      <nav className="hidden md:flex justify-center items-center py-3 space-x-12 bg-white border-t border-[#c4c7c7]">
        <button
          id="nav-link-discover"
          onClick={() => setActiveTab('discover')}
          className={`font-label-caps text-xs pb-1 transition-colors duration-300 cursor-pointer ${
            activeTab === 'discover'
              ? 'text-black border-b-2 border-black font-bold'
              : 'text-[#444748] hover:text-[#735c00] border-b-2 border-transparent hover:border-[#735c00]'
          }`}
        >
          Discover
        </button>
        <button
          id="nav-link-search"
          onClick={() => setActiveTab('search')}
          className={`font-label-caps text-xs pb-1 transition-colors duration-300 cursor-pointer ${
            activeTab === 'search'
              ? 'text-black border-b-2 border-black font-bold'
              : 'text-[#444748] hover:text-[#735c00] border-b-2 border-transparent hover:border-[#735c00]'
          }`}
        >
          Search
        </button>
        <button
          id="nav-link-sell"
          onClick={() => setActiveTab('sell')}
          className={`font-label-caps text-xs pb-1 transition-colors duration-300 cursor-pointer ${
            activeTab === 'sell'
              ? 'text-black border-b-2 border-black font-bold'
              : 'text-[#444748] hover:text-[#735c00] border-b-2 border-transparent hover:border-[#735c00]'
          }`}
        >
          Sell
        </button>
        <button
          id="nav-link-vault"
          onClick={() => setActiveTab('vault')}
          className={`font-label-caps text-xs pb-1 transition-colors duration-300 cursor-pointer ${
            activeTab === 'vault'
              ? 'text-black border-b-2 border-black font-bold'
              : 'text-[#444748] hover:text-[#735c00] border-b-2 border-transparent hover:border-[#735c00]'
          }`}
        >
          Vault
        </button>
      </nav>

      {/* Super Admin Live Page Edit Toolbar */}
      {isSuperAdmin && (
        <div className="bg-[#efe3aa] text-[#474016] border-t border-[#d8c87e] px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Crown className="w-3.5 h-3.5 fill-[#735c00] text-[#735c00]" />
            <span className="font-label-caps text-[11px] font-bold">
              Super Admin Mode: <span className="text-black capitalize">{activeTab} Page</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              id={`btn-edit-page-${activeTab}`}
              onClick={() => onOpenPageEdit(activeTab)}
              className="bg-black text-white hover:bg-[#2f312e] px-2.5 py-0.5 font-label-caps text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Edit3 className="w-3 h-3" /> Edit This Page
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-[#474016] hover:underline font-label-caps text-[10px] font-semibold cursor-pointer"
            >
              Manage Users &amp; Permissions →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
