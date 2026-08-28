import React, { useState, useEffect } from 'react';
import { X, Edit3, Check, Globe } from 'lucide-react';
import { SiteContent, TabType } from '../types';

interface PageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPage: TabType;
  siteContent: SiteContent;
  onSave: (updatedContent: SiteContent) => void;
}

export const PageEditModal: React.FC<PageEditModalProps> = ({
  isOpen,
  onClose,
  targetPage,
  siteContent,
  onSave,
}) => {
  const [content, setContent] = useState<SiteContent>(siteContent);

  useEffect(() => {
    setContent(siteContent);
  }, [siteContent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(content);
    onClose();
  };

  const getPageName = () => {
    switch (targetPage) {
      case 'discover':
        return 'Discover (Homepage)';
      case 'search':
        return 'Watches for Sale (Search)';
      case 'sell':
        return 'Sell & Consign';
      case 'vault':
        return 'Collector Vault';
      default:
        return 'Page';
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#fafaf5] border border-black shadow-2xl p-6 sm:p-8 my-8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#444748] hover:text-black hover:bg-[#e4e3dc] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 border-b border-[#c4c7c7] pb-4">
          <span className="font-label-caps text-xs text-[#735c00] tracking-widest block mb-1">
            Super Admin Page Customizer
          </span>
          <h2 className="font-headline-lg text-2xl text-black">
            Edit {getPageName()} Content
          </h2>
          <p className="text-xs text-[#444748] mt-1">
            Updates will be applied live across the platform immediately.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {targetPage === 'discover' && (
            <>
              <div>
                <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                  Hero Eyebrow Tag
                </label>
                <input
                  type="text"
                  required
                  value={content.discoverPage.heroEyebrow}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      discoverPage: {
                        ...content.discoverPage,
                        heroEyebrow: e.target.value,
                      },
                    })
                  }
                  className="form-input-luxury w-full text-xs text-black"
                />
              </div>

              <div>
                <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                  Hero Headline
                </label>
                <input
                  type="text"
                  required
                  value={content.discoverPage.heroTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      discoverPage: {
                        ...content.discoverPage,
                        heroTitle: e.target.value,
                      },
                    })
                  }
                  className="form-input-luxury w-full text-xs text-black font-headline-md text-base"
                />
              </div>

              <div>
                <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                  Hero Subtitle Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={content.discoverPage.heroSubtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      discoverPage: {
                        ...content.discoverPage,
                        heroSubtitle: e.target.value,
                      },
                    })
                  }
                  className="form-input-luxury w-full text-xs text-black"
                />
              </div>

              <div>
                <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                  Spotlight Section Title
                </label>
                <input
                  type="text"
                  required
                  value={content.discoverPage.spotlightTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      discoverPage: {
                        ...content.discoverPage,
                        spotlightTitle: e.target.value,
                      },
                    })
                  }
                  className="form-input-luxury w-full text-xs text-black"
                />
              </div>
            </>
          )}

          {targetPage === 'search' && (
            <>
              <div>
                <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                  Page Header Title (Watches for Sale)
                </label>
                <input
                  type="text"
                  required
                  value={content.searchPage.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      searchPage: {
                        ...content.searchPage,
                        title: e.target.value,
                      },
                    })
                  }
                  className="form-input-luxury w-full text-xs text-black font-headline-md text-base"
                />
              </div>

              <div>
                <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                  Page Subtitle
                </label>
                <textarea
                  rows={2}
                  required
                  value={content.searchPage.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      searchPage: {
                        ...content.searchPage,
                        subtitle: e.target.value,
                      },
                    })
                  }
                  className="form-input-luxury w-full text-xs text-black"
                />
              </div>
            </>
          )}

          {targetPage === 'sell' && (
            <>
              <div>
                <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                  Listing Page Title
                </label>
                <input
                  type="text"
                  required
                  value={content.sellPage.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      sellPage: {
                        ...content.sellPage,
                        title: e.target.value,
                      },
                    })
                  }
                  className="form-input-luxury w-full text-xs text-black font-headline-md text-base"
                />
              </div>

              <div>
                <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                  Listing Subtitle
                </label>
                <textarea
                  rows={2}
                  required
                  value={content.sellPage.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      sellPage: {
                        ...content.sellPage,
                        subtitle: e.target.value,
                      },
                    })
                  }
                  className="form-input-luxury w-full text-xs text-black"
                />
              </div>

              <div>
                <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                  Consignment / Policy Note
                </label>
                <input
                  type="text"
                  value={content.sellPage.guaranteeText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      sellPage: {
                        ...content.sellPage,
                        guaranteeText: e.target.value,
                      },
                    })
                  }
                  className="form-input-luxury w-full text-xs text-black"
                />
              </div>
            </>
          )}

          {targetPage === 'vault' && (
            <>
              <div>
                <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                  Vault Page Title
                </label>
                <input
                  type="text"
                  required
                  value={content.vaultPage.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      vaultPage: {
                        ...content.vaultPage,
                        title: e.target.value,
                      },
                    })
                  }
                  className="form-input-luxury w-full text-xs text-black font-headline-md text-base"
                />
              </div>

              <div>
                <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                  Vault Subtitle
                </label>
                <textarea
                  rows={2}
                  required
                  value={content.vaultPage.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      vaultPage: {
                        ...content.vaultPage,
                        subtitle: e.target.value,
                      },
                    })
                  }
                  className="form-input-luxury w-full text-xs text-black"
                />
              </div>

              <div>
                <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                  Ledger Guarantee Note
                </label>
                <input
                  type="text"
                  value={content.vaultPage.vaultNote}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      vaultPage: {
                        ...content.vaultPage,
                        vaultNote: e.target.value,
                      },
                    })
                  }
                  className="form-input-luxury w-full text-xs text-black"
                />
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-[#c4c7c7]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-[#c4c7c7] text-xs font-label-caps cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-black text-white text-xs font-label-caps flex items-center gap-1.5 cursor-pointer hover:bg-[#2f312e] font-bold"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              Save Live Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
