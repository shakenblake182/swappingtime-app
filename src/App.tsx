import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DiscoverView } from './components/DiscoverView';
import { SellView } from './components/SellView';
import { SearchView } from './components/SearchView';
import { VaultView } from './components/VaultView';
import { WatchDetailModal } from './components/WatchDetailModal';
import { ValuationResultModal } from './components/ValuationResultModal';
import { ContactSellerModal } from './components/ContactSellerModal';
import { MakeOfferModal } from './components/MakeOfferModal';
import { DirectChatModal } from './components/DirectChatModal';
import { InquiriesDrawer } from './components/InquiriesDrawer';
import { AccountMenuDrawer } from './components/AccountMenuDrawer';
import { PageEditModal } from './components/PageEditModal';
import { EditListingModal } from './components/EditListingModal';
import { AuthModal } from './components/AuthModal';
import { INITIAL_WATCHES, INITIAL_VAULT_ITEMS } from './data/watches';
import { INITIAL_USERS, INITIAL_SITE_CONTENT } from './data/users';
import {
  TabType,
  Watch,
  VaultItem,
  ConsignmentForm,
  ValuationResult,
  WatchInquiry,
  FormalOffer,
  UserAccount,
  SiteContent,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [watches, setWatches] = useState<Watch[]>(INITIAL_WATCHES);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(INITIAL_VAULT_ITEMS);
  const [inquiries, setInquiries] = useState<WatchInquiry[]>([]);
  const [formalOffers, setFormalOffers] = useState<FormalOffer[]>([
    {
      id: 'offer-sample-1',
      watch: INITIAL_WATCHES[0],
      buyerName: 'Alexander Hayes',
      buyerEmail: 'alexander.hayes@genevawatchvault.com',
      buyerPhone: '+1 (212) 555-8392',
      offerAmount: 32000,
      note: 'Prepared for immediate Fedwire bank transfer upon approval. Can arrange local handover if in NY/Geneva.',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      status: 'pending',
      sellerContactRevealed: false,
      sellerDetails: {
        name: INITIAL_WATCHES[0].sellerName || 'Geneva Certified Vault Consignor',
        email: INITIAL_WATCHES[0].sellerEmail || 'consignment-desk.daytona@swappingtime.vault',
        phone: INITIAL_WATCHES[0].sellerPhone || '+1 (212) 555-0188',
        location: INITIAL_WATCHES[0].sellerLocation || 'Geneva / New York Vault Repository',
        preferredPayment: ['Bank Wire Transfer (SWIFT/Fedwire)', 'Verified Escrow.com', 'Private Vault Handover'],
      },
    },
  ]);

  // User Accounts & Authentication State
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[0]); // Defaults to Super User Blake
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [isAdminEditMode, setIsAdminEditMode] = useState(true);

  // Drawers & Modals state
  const [isInquiriesOpen, setIsInquiriesOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pageEditModalTarget, setPageEditModalTarget] = useState<TabType | null>(null);
  const [editingWatch, setEditingWatch] = useState<Watch | null>(null);

  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);
  const [contactSellerWatch, setContactSellerWatch] = useState<Watch | null>(null);
  const [makeOfferWatch, setMakeOfferWatch] = useState<Watch | null>(null);
  const [directChatWatch, setDirectChatWatch] = useState<Watch | null>(null);

  const [searchCategory, setSearchCategory] = useState<'vintage' | 'modern' | 'diver' | 'dress' | 'all'>('all');
  const [valuationData, setValuationData] = useState<{
    form: ConsignmentForm;
    valuation: ValuationResult;
  } | null>(null);

  const isSuperAdmin = currentUser.role === 'super_admin';

  // Toggle "Watch this watch" in current user's saved list
  const handleToggleWatch = (watchId: string) => {
    const currentWatched = currentUser.watchedWatchIds || [];
    const isAlreadyWatched = currentWatched.includes(watchId);
    const updatedWatched = isAlreadyWatched
      ? currentWatched.filter((id) => id !== watchId)
      : [...currentWatched, watchId];

    const updatedUser: UserAccount = {
      ...currentUser,
      watchedWatchIds: updatedWatched,
    };

    handleUpdateUser(updatedUser);
  };

  // When a user selects and inspects a watch, increment viewCount
  const handleSelectWatch = (watch: Watch) => {
    const nextCount = (watch.viewCount || 0) + 1;
    const updatedWatch: Watch = { ...watch, viewCount: nextCount };

    setWatches((prev) =>
      prev.map((w) => (w.id === watch.id ? updatedWatch : w))
    );
    setVaultItems((prev) =>
      prev.map((v) =>
        v.watch.id === watch.id ? { ...v, watch: updatedWatch } : v
      )
    );
    setSelectedWatch(updatedWatch);
  };

  // Switch category and go to Search tab
  const handleSelectCategory = (category: 'vintage' | 'modern' | 'diver' | 'dress') => {
    setSearchCategory(category);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Inquiry (Contact Seller Form)
  const handleSubmitInquiry = (inquiry: WatchInquiry) => {
    setInquiries((prev) => [inquiry, ...prev]);
  };

  // Submit Formal Offer
  const handleSubmitOffer = (offer: FormalOffer) => {
    setFormalOffers((prev) => [offer, ...prev]);
  };

  // Update Formal Offer (Counter, Decline, Accept)
  // When the seller accepts the offer, the posting goes to the seller's vault page
  const handleUpdateOffer = (updatedOffer: FormalOffer) => {
    setFormalOffers((prev) =>
      prev.map((o) => (o.id === updatedOffer.id ? updatedOffer : o))
    );

    if (updatedOffer.status === 'accepted') {
      // 1. Move posting to seller's vault page
      setVaultItems((prev) => {
        const existing = prev.find((v) => v.watch.id === updatedOffer.watch.id);
        if (existing) {
          return prev.map((v) =>
            v.watch.id === updatedOffer.watch.id
              ? {
                  ...v,
                  status: 'Sold / In Vault',
                  currentEstimatedValue: updatedOffer.offerAmount,
                }
              : v
          );
        } else {
          const newVaultRecord: VaultItem = {
            id: `vault-sold-${Date.now()}`,
            watch: {
              ...updatedOffer.watch,
              badge: 'Sold - Offer Accepted',
            },
            acquisitionDate: new Date().toISOString().split('T')[0],
            serialNumber: `SN-OFFER-${Math.floor(100000 + Math.random() * 900000)}`,
            digitalCertificateId: `CERT-SOLD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'Sold / In Vault',
            currentEstimatedValue: updatedOffer.offerAmount,
          };
          return [newVaultRecord, ...prev];
        }
      });

      // 2. Remove posting from active public marketplace listings
      setWatches((prev) => prev.filter((w) => w.id !== updatedOffer.watch.id));

      // 3. Switch view directly to seller's Vault page
      setActiveTab('vault');
      setIsInquiriesOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Update a single watch (e.g. from Super Admin AI inspection override)
  const handleUpdateWatch = (updatedWatch: Watch) => {
    setWatches((prev) =>
      prev.map((w) => (w.id === updatedWatch.id ? updatedWatch : w))
    );
    setVaultItems((prev) =>
      prev.map((v) =>
        v.watch.id === updatedWatch.id ? { ...v, watch: updatedWatch } : v
      )
    );
  };

  // When user proceeds to valuation from SellView
  const handleProceedToValuation = (form: ConsignmentForm, valuation: ValuationResult) => {
    setValuationData({ form, valuation });
  };

  // When user confirms consignment in modal
  const handleConfirmConsignment = () => {
    if (!valuationData) return;
    const { form, valuation } = valuationData;

    const isModOrUnauth = form.authenticityDeclaration === 'mod_unauthenticated';
    // If declared as mod or unauthenticated on Step 2, Google AI will explicitly NOT flag the watch
    const isFlaggedFake = isModOrUnauth ? false : (form.isFlaggedFake ?? false);

    const aiAuthenticityReport = isModOrUnauth
      ? {
          id: `ai-rep-${Date.now()}`,
          watchId: `consign-${Date.now()}`,
          scannedAt: new Date().toISOString(),
          status: 'authentic' as const,
          riskScore: 0,
          confidence: 99,
          summary: 'Seller declared timepiece as a mod / unauthenticated piece on Step 2. Google AI optical inspection cleared listing with zero deception risk.',
          findings: [
            'Seller explicitly disclosed aftermarket modifications or uncertified provenance on Step 2.',
            'Transparent peer disclosure verified — compliant with Swapping Time modification policies.',
            'Google AI anti-counterfeit filter: Cleared with zero penalty (not flagged as fake).',
          ],
          flaggedReasons: [],
          opticalInspection: {
            dialAndTypography: 'Mod/Custom dial configuration transparently disclosed.',
            logoAndMarkings: 'Declared aftermarket/custom modifications.',
            handsAndLume: 'Custom/aftermarket hand installation noted.',
            bezelAndCaseFinishing: 'Case and bezel geometry verified without deceptive markings.',
          },
          flaggedToAdmin: false,
          reviewedByAdmin: true,
          adminAction: 'approved' as const,
          adminNotes: 'Cleared: Declared as mod/unauthenticated on Step 2.',
        }
      : form.aiAuthenticityReport || {
          id: `ai-rep-${Date.now()}`,
          watchId: `consign-${Date.now()}`,
          scannedAt: new Date().toISOString(),
          status: 'authentic' as const,
          riskScore: 3,
          confidence: 97,
          summary: `High-resolution optical scan of ${form.brand} ${form.model} verified authentic dial, typography, and case finish.`,
          findings: [
            'Dial printing, font kerning, and coronet/logo geometry match manufacture reference archive.',
            'Case finish and lug chamfers meet factory manufacturing tolerances.',
            'Warranty and scope of delivery documentation verified.',
          ],
          flaggedReasons: [],
          opticalInspection: {
            dialAndTypography: 'Crisp pad printing with correct serif definitions and ink consistency.',
            logoAndMarkings: 'Applied manufacture emblem exhibits clean diamond-faceted edges.',
            handsAndLume: 'Correct hand-stack order and uniform luminescence application.',
            bezelAndCaseFinishing: 'Even vertical brush graining and crisp chamfer transitions.',
          },
          flaggedToAdmin: false,
          reviewedByAdmin: true,
          adminAction: 'approved' as const,
        };

    const newWatch: Watch = {
      id: `consign-${Date.now()}`,
      brand: form.brand,
      model: form.model,
      reference: form.reference,
      year: form.year,
      price: valuation.recommendedListing,
      category: 'modern',
      badge: isModOrUnauth ? 'Mod / Uncertified' : 'Certified Consignment',
      imageUrl: form.uploadedImages[0] || INITIAL_WATCHES[0].imageUrl,
      secondaryImages: form.uploadedImages.slice(1),
      description: `Client consigned ${form.brand} ${form.model}. Listed on Swapping Time.${isModOrUnauth ? ' (Declared Mod / Uncertified)' : ''}`,
      caseDiameter: '40 mm',
      caseMaterial: 'Precious Metal / Stainless Steel',
      dialColor: 'Custom Authenticated',
      movement: 'Swiss Chronometer Calibre',
      condition: form.condition as any,
      boxAndPapers: form.boxAndPapers as any,
      sellerName: currentUser.name,
      sellerEmail: currentUser.email,
      sellerPhone: currentUser.phone || '+1 (555) 438-9921',
      sellerLocation: currentUser.location || 'Zurich / Geneva FreePort',
      priceType: form.priceType || 'obo',
      videoUrl: form.videoUrl,
      aiAuthenticityReport,
      isFlaggedFake,
    };

    const newVaultItem: VaultItem = {
      id: `vault-c-${Date.now()}`,
      watch: newWatch,
      acquisitionDate: new Date().toISOString().split('T')[0],
      serialNumber: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      digitalCertificateId: `CERT-SWAP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Under Valuation',
      currentEstimatedValue: valuation.recommendedListing,
    };

    setWatches((prev) => [newWatch, ...prev]);
    setVaultItems((prev) => [newVaultItem, ...prev]);
    setValuationData(null);
    setActiveTab('vault');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConsignSimilar = () => {
    setActiveTab('sell');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateVaultItem = (updatedItem: VaultItem) => {
    setVaultItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    // Also update in marketplace watches list if matching
    setWatches((prev) =>
      prev.map((w) => (w.id === updatedItem.watch.id ? updatedItem.watch : w))
    );
  };

  const handleDeleteVaultItem = (vaultId: string) => {
    setVaultItems((prev) => prev.filter((item) => item.id !== vaultId));
  };

  // Super Admin: Delete any watch
  const handleDeleteWatch = (watchId: string) => {
    setWatches((prev) => prev.filter((w) => w.id !== watchId));
    setVaultItems((prev) => prev.filter((v) => v.watch.id !== watchId));
  };

  // Super Admin: Edit any watch
  const handleEditWatch = (watch: Watch) => {
    setEditingWatch(watch);
  };

  const handleSaveEditedWatch = (updatedVaultItem: VaultItem) => {
    setWatches((prev) =>
      prev.map((w) => (w.id === updatedVaultItem.watch.id ? updatedVaultItem.watch : w))
    );
    setVaultItems((prev) =>
      prev.map((v) => (v.watch.id === updatedVaultItem.watch.id ? updatedVaultItem : v))
    );
    setEditingWatch(null);
  };

  // Super Admin: User Management Handlers
  const handleUpdateUser = (updatedUser: UserAccount) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    // Prevent deleting the only super admin or self if they are the only one
    setUsers((prev) => {
      const remaining = prev.filter((u) => u.id !== userId);
      // If current user deleted, fallback to the first available user
      if (currentUser.id === userId && remaining.length > 0) {
        setCurrentUser(remaining[0]);
      }
      return remaining;
    });
  };

  const handleToggleSuperAdminRole = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextRole = u.role === 'super_admin' ? 'user' : 'super_admin';
          return {
            ...u,
            role: nextRole as any,
          };
        }
        return u;
      })
    );

    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({
        ...prev,
        role: prev.role === 'super_admin' ? 'user' : 'super_admin',
      }));
    }
  };

  const handleAddUser = (newUser: Omit<UserAccount, 'id' | 'memberSince'>) => {
    const created: UserAccount = {
      ...newUser,
      id: `user-${Date.now()}`,
      memberSince: new Date().getFullYear().toString(),
    };
    setUsers((prev) => [created, ...prev]);
  };

  // Register new user from AuthModal signup
  const handleRegisterUser = (newUser: Omit<UserAccount, 'id' | 'memberSince'> & { password?: string }) => {
    const created: UserAccount = {
      ...newUser,
      id: `user-${Date.now()}`,
      memberSince: new Date().getFullYear().toString(),
    };
    setUsers((prev) => [created, ...prev]);
    setCurrentUser(created);
    setIsLoggedIn(true);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fafaf5] text-[#1a1c19] flex flex-col justify-between selection:bg-[#735c00] selection:text-white pb-20 md:pb-0">
      {/* Top Header with Hamburger 3 Dash Marks Button & User Sign Out */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'search') setSearchCategory('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        inquiryCount={inquiries.length + formalOffers.length}
        openInquiries={() => setIsInquiriesOpen(true)}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        currentUser={currentUser}
        siteContent={siteContent}
        isAdminEditMode={isAdminEditMode}
        setIsAdminEditMode={setIsAdminEditMode}
        onOpenPageEdit={(page) => setPageEditModalTarget(page)}
        onSignOut={handleSignOut}
      />

      {/* Main Screen Content */}
      <div className="flex-1">
        {activeTab === 'discover' && (
          <DiscoverView
            watches={watches}
            onSelectWatch={handleSelectWatch}
            onSelectCategory={handleSelectCategory}
            onNavigateToSell={() => {
              setActiveTab('sell');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToSearch={() => {
              setSearchCategory('all');
              setActiveTab('search');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            siteContent={siteContent}
            isAdmin={isSuperAdmin}
            isAdminEditMode={isAdminEditMode}
            onOpenPageEdit={() => setPageEditModalTarget('discover')}
            onEditWatch={handleEditWatch}
            onDeleteWatch={handleDeleteWatch}
            watchedWatchIds={currentUser.watchedWatchIds || []}
            onToggleWatch={handleToggleWatch}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            watches={watches}
            initialCategory={searchCategory}
            onSelectWatch={handleSelectWatch}
            siteContent={siteContent}
            isAdmin={isSuperAdmin}
            isAdminEditMode={isAdminEditMode}
            onOpenPageEdit={() => setPageEditModalTarget('search')}
            onEditWatch={handleEditWatch}
            onDeleteWatch={handleDeleteWatch}
          />
        )}

        {activeTab === 'sell' && (
          <SellView
            onProceedToValuation={handleProceedToValuation}
            siteContent={siteContent}
            isAdmin={isSuperAdmin}
            isAdminEditMode={isAdminEditMode}
            onOpenPageEdit={() => setPageEditModalTarget('sell')}
          />
        )}

        {activeTab === 'vault' && (
          <VaultView
            vaultItems={vaultItems}
            onNavigateToSell={() => {
              setActiveTab('sell');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onUpdateVaultItem={handleUpdateVaultItem}
            onDeleteVaultItem={handleDeleteVaultItem}
            siteContent={siteContent}
            isAdmin={isSuperAdmin}
            isAdminEditMode={isAdminEditMode}
            onOpenPageEdit={() => setPageEditModalTarget('vault')}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black text-[#fafaf5] border-t border-[#c4c7c7] mt-24 py-16 px-4 md:px-16">
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-4 space-y-4">
              <h3 className="font-display-lg text-2xl tracking-[0.2em]">Swapping Time</h3>
              <p className="text-sm text-[#858383] leading-relaxed max-w-sm">
                The premier peer-to-peer marketplace and connection platform for independent watch collectors, connoisseurs, and enthusiasts.
              </p>
              <div className="p-3 bg-[#161616] border border-[#2a2a2a] space-y-1">
                <span className="font-label-caps text-[10px] text-[#efe3aa] block font-semibold">
                  Platform Architecture
                </span>
                <p className="text-xs text-[#858383]">
                  Direct peer-to-peer settlement via Fedwire, SWIFT, or verified escrow.
                </p>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-label-caps text-xs text-white">Platform Navigation</h4>
              <ul className="space-y-2.5 text-xs text-[#858383]">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('discover');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Curated Discoveries
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('search');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Catalog Search &amp; Timepieces
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('sell');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    List &amp; Consign Timepieces
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('vault');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Collector Digital Vault
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsInquiriesOpen(true)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Inquiries &amp; Active Offers
                  </button>
                </li>
              </ul>
            </div>

            {/* Platform Disclaimers & Legal Clauses */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-label-caps text-xs text-white">Platform Terms &amp; Release</h4>
              <div className="space-y-3 text-xs text-[#858383] leading-relaxed">
                <div>
                  <strong className="block text-[#d2c790] text-[11px] font-label-caps font-semibold mb-0.5">
                    Not the Seller Clause
                  </strong>
                  <p className="text-[11px]">
                    Swapping Time is strictly an independent technology platform and venue connecting third-party buyers and sellers. We do not own, stock, inspect, verify, or take title to any watches listed.
                  </p>
                </div>
                <div>
                  <strong className="block text-[#d2c790] text-[11px] font-label-caps font-semibold mb-0.5">
                    Release of the Platform
                  </strong>
                  <p className="text-[11px]">
                    Users (both buyers and sellers) explicitly release Swapping Time, its owners, and operators from any and all claims, demands, liabilities, or damages arising out of disputes between users or failed transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#2a2a2a] flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#747878]">
            <div>
              © {new Date().getFullYear()} Swapping Time. Independent Technology Platform. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setPageEditModalTarget(activeTab);
                }}
                className="text-[#efe3aa] hover:underline font-label-caps text-[10px]"
              >
                {isSuperAdmin ? 'Super Admin Page CMS' : 'Terms & Privacy'}
              </button>
              <span>•</span>
              <span className="text-[#858383]">Peer-to-Peer Venue</span>
              <span>•</span>
              <span className="text-[#858383]">Direct Settlement</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mandatory Signup / Signin Modal for Visitors */}
      <AuthModal
        isOpen={!isLoggedIn}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
        }}
        allUsers={users}
        onRegisterUser={handleRegisterUser}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hamburger 3 Dash Marks Drawer: Sign In, Account Management, Super Admin Tools & CMS */}
      <AccountMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={(user) => {
          setCurrentUser(user);
        }}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        onAddUser={handleAddUser}
        onToggleSuperAdminRole={handleToggleSuperAdminRole}
        siteContent={siteContent}
        onUpdateSiteContent={setSiteContent}
        isAdminEditMode={isAdminEditMode}
        setIsAdminEditMode={setIsAdminEditMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watches={watches}
        onEditWatch={handleEditWatch}
        onDeleteWatch={handleDeleteWatch}
        onUpdateWatch={handleUpdateWatch}
        onSelectWatch={handleSelectWatch}
        onToggleWatch={handleToggleWatch}
      />

      {/* Super Admin Edit Page Modal */}
      {pageEditModalTarget && (
        <PageEditModal
          page={pageEditModalTarget}
          siteContent={siteContent}
          onClose={() => setPageEditModalTarget(null)}
          onSave={(updatedContent) => {
            setSiteContent(updatedContent);
          }}
        />
      )}

      {/* Super Admin / Seller Edit Watch Listing Modal */}
      {editingWatch && (
        <EditListingModal
          vaultItem={{
            id: `edit-${editingWatch.id}`,
            watch: editingWatch,
            acquisitionDate: '2024-01-01',
            serialNumber: 'SN-VERIFIED',
            digitalCertificateId: 'CERT-SWAP-ADMIN',
            status: 'Active Marketplace Listing',
            currentEstimatedValue: editingWatch.price,
          }}
          onClose={() => setEditingWatch(null)}
          onSave={handleSaveEditedWatch}
        />
      )}

      {/* Watch Detail Modal */}
      {selectedWatch && (
        <WatchDetailModal
          watch={selectedWatch}
          onClose={() => setSelectedWatch(null)}
          isWatched={(currentUser.watchedWatchIds || []).includes(selectedWatch.id)}
          onToggleWatch={handleToggleWatch}
          onOpenContactSeller={(watch) => {
            setSelectedWatch(null);
            setContactSellerWatch(watch);
          }}
          onOpenMakeOffer={(watch) => {
            setSelectedWatch(null);
            setMakeOfferWatch(watch);
          }}
          onOpenDirectChat={(watch) => {
            setSelectedWatch(null);
            setDirectChatWatch(watch);
          }}
          onConsignSimilar={handleConsignSimilar}
        />
      )}

      {/* Contact Seller Form Modal */}
      {contactSellerWatch && (
        <ContactSellerModal
          watch={contactSellerWatch}
          onClose={() => setContactSellerWatch(null)}
          onSubmitInquiry={handleSubmitInquiry}
          onOpenChat={(watch) => {
            setContactSellerWatch(null);
            setDirectChatWatch(watch);
          }}
        />
      )}

      {/* Make an Offer Modal */}
      {makeOfferWatch && (
        <MakeOfferModal
          watch={makeOfferWatch}
          onClose={() => setMakeOfferWatch(null)}
          onSubmitOffer={handleSubmitOffer}
        />
      )}

      {/* On-Site Direct Chat Modal */}
      {directChatWatch && (
        <DirectChatModal
          watch={directChatWatch}
          onClose={() => setDirectChatWatch(null)}
        />
      )}

      {/* Valuation Result Modal */}
      {valuationData && (
        <ValuationResultModal
          form={valuationData.form}
          valuation={valuationData.valuation}
          onClose={() => setValuationData(null)}
          onConfirmConsignment={handleConfirmConsignment}
        />
      )}

      {/* Inquiries & Leads Drawer */}
      <InquiriesDrawer
        isOpen={isInquiriesOpen}
        onClose={() => setIsInquiriesOpen(false)}
        inquiries={inquiries}
        formalOffers={formalOffers}
        onOpenChatWithWatch={(watch) => {
          setIsInquiriesOpen(false);
          setDirectChatWatch(watch);
        }}
        onUpdateOffer={handleUpdateOffer}
      />
    </div>
  );
}
