import React, { useState } from 'react';
import { ShieldCheck, ArrowUpRight, Plus, Lock, Edit3, Trash2, Crown } from 'lucide-react';
import { VaultItem, SiteContent } from '../types';
import { EditListingModal } from './EditListingModal';

interface VaultViewProps {
  vaultItems: VaultItem[];
  onNavigateToSell: () => void;
  onUpdateVaultItem?: (updatedItem: VaultItem) => void;
  onDeleteVaultItem?: (id: string) => void;
  siteContent?: SiteContent;
  isAdmin?: boolean;
  isAdminEditMode?: boolean;
  onOpenPageEdit?: () => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  vaultItems,
  onNavigateToSell,
  onUpdateVaultItem,
  onDeleteVaultItem,
  siteContent,
  isAdmin = false,
  isAdminEditMode = false,
  onOpenPageEdit,
}) => {
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);

  const pageTitle = siteContent?.vaultPage?.title || "Collector's Vault";
  const pageSubtitle = siteContent?.vaultPage?.subtitle || 'Insured depository, authenticated blockchain provenance records, and live consignment tracking.';

  const totalVaultValue = vaultItems.reduce((acc, item) => acc + item.currentEstimatedValue, 0);
  const totalPurchasePrice = vaultItems.reduce((acc, item) => acc + (item.purchasePrice || item.currentEstimatedValue), 0);
  const appreciation = totalVaultValue - totalPurchasePrice;
  const appreciationPercent = totalPurchasePrice > 0 ? ((appreciation / totalPurchasePrice) * 100).toFixed(1) : '0.0';

  const handleSaveListing = (updatedItem: VaultItem) => {
    if (onUpdateVaultItem) {
      onUpdateVaultItem(updatedItem);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-10 md:py-16 animate-in fade-in duration-300">
      {/* Super Admin Notice */}
      {isAdmin && isAdminEditMode && (
        <div className="mb-6 p-3 bg-[#efe3aa] border border-[#d8c87e] flex items-center justify-between">
          <span className="text-xs font-label-caps text-[#474016] font-bold flex items-center gap-1.5">
            <Crown className="w-4 h-4 fill-[#735c00]" />
            Super Admin: Vault Management &amp; Content Controls Active
          </span>
          {onOpenPageEdit && (
            <button
              onClick={onOpenPageEdit}
              className="bg-black text-white px-3 py-1 text-xs font-label-caps flex items-center gap-1 hover:bg-[#2f312e] cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Vault Page Copy
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#c4c7c7] pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-[#735c00]" />
            <span className="font-label-caps text-xs text-[#735c00] tracking-widest">
              Digital Horological Vault &amp; Registry
            </span>
          </div>
          <h2 className="font-headline-lg text-3xl md:text-5xl text-black">
            {pageTitle}
          </h2>
          <p className="font-body-md text-sm md:text-base text-[#444748] mt-1 max-w-xl">
            {pageSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && onOpenPageEdit && (
            <button
              onClick={onOpenPageEdit}
              className="border border-black text-black font-label-caps text-xs px-4 py-3.5 hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Page Info
            </button>
          )}
          <button
            onClick={onNavigateToSell}
            className="bg-black text-white font-label-caps text-xs px-6 py-3.5 hover:bg-[#2f312e] transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Consign New Timepiece
          </button>
        </div>
      </div>

      {/* Portfolio Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 border border-[#c4c7c7]">
          <span className="font-label-caps text-xs text-[#747878] block mb-1">
            Total Vault Portfolio Value
          </span>
          <span className="font-headline-md text-2xl md:text-3xl text-black">
            ${totalVaultValue.toLocaleString()}
          </span>
          <span className="text-xs text-[#735c00] font-label-caps block mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +{appreciationPercent}% Overall Growth
          </span>
        </div>

        <div className="bg-white p-6 border border-[#c4c7c7]">
          <span className="font-label-caps text-xs text-[#747878] block mb-1">
            Registered Timepieces
          </span>
          <span className="font-headline-md text-2xl md:text-3xl text-black">
            {vaultItems.length} Watches
          </span>
          <span className="text-xs text-[#444748] block mt-2">
            100% Authenticated &amp; Insured
          </span>
        </div>

        <div className="bg-white p-6 border border-[#c4c7c7]">
          <span className="font-label-caps text-xs text-[#747878] block mb-1">
            Vault Security Status
          </span>
          <span className="font-headline-md text-2xl md:text-3xl text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-700" />
            Protected
          </span>
          <span className="text-xs text-[#444748] block mt-2">
            Dual-custody Swiss vault storage
          </span>
        </div>
      </div>

      {/* Vault Items List */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline-md text-2xl text-black">
            Timepiece Inventory &amp; Provenance
          </h3>
          <span className="font-label-caps text-xs text-[#747878]">
            {vaultItems.length} Registered Records
          </span>
        </div>

        <div className="space-y-4">
          {vaultItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#c4c7c7] p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#735c00] transition-colors"
            >
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-[#eeeee9] shrink-0 border border-[#c4c7c7] overflow-hidden">
                  <img
                    src={item.watch.imageUrl}
                    alt={item.watch.model}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-caps text-xs text-[#444748]">{item.watch.brand}</span>
                    <span className="bg-[#efe3aa] text-[#474016] text-[10px] font-label-caps px-2 py-0.5">
                      {item.status}
                    </span>
                    <span className={`text-[10px] font-label-caps px-1.5 py-0.5 font-semibold ${
                      item.watch.priceType === 'firm'
                        ? 'bg-[#1c1b1b] text-white'
                        : 'bg-[#eeeee9] text-[#444748] border border-[#c4c7c7]'
                    }`}>
                      {item.watch.priceType === 'firm' ? 'FIRM' : 'OBO'}
                    </span>
                  </div>
                  <h4 className="font-headline-md text-xl text-black mt-0.5">
                    {item.watch.model}
                  </h4>
                  <p className="font-body-md text-xs text-[#747878]">
                    {item.watch.reference} • Serial: {item.serialNumber}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end pt-4 md:pt-0 border-t md:border-t-0 border-[#eeeee9]">
                <div>
                  <span className="text-[11px] font-label-caps text-[#747878] block">Estimated Valuation</span>
                  <span className="font-headline-md text-xl font-semibold text-black">
                    ${item.currentEstimatedValue.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-edit-listing-${item.id}`}
                    onClick={() => setEditingItem(item)}
                    className="font-label-caps text-xs border border-[#c4c7c7] px-4 py-2.5 hover:border-black transition-colors flex items-center gap-1.5 cursor-pointer bg-[#fafaf5]"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#735c00]" />
                    Edit Listing
                  </button>

                  {isAdmin && onDeleteVaultItem && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Super Admin: Delete vault record for ${item.watch.brand} ${item.watch.model}?`)) {
                          onDeleteVaultItem(item.id);
                        }
                      }}
                      className="p-2.5 text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                      title="Super Admin: Delete Vault Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Listing Modal */}
      {editingItem && (
        <EditListingModal
          vaultItem={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveListing}
        />
      )}
    </div>
  );
};
