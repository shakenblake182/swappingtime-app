import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, X, ArrowUpDown, Film, Edit3, Trash2, Crown, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Watch, SiteContent } from '../types';

interface SearchViewProps {
  watches: Watch[];
  initialCategory?: string;
  onSelectWatch: (watch: Watch) => void;
  siteContent?: SiteContent;
  isAdmin?: boolean;
  isAdminEditMode?: boolean;
  onOpenPageEdit?: () => void;
  onEditWatch?: (watch: Watch) => void;
  onDeleteWatch?: (watchId: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  watches,
  onSelectWatch,
  siteContent,
  isAdmin = false,
  isAdminEditMode = false,
  onOpenPageEdit,
  onEditWatch,
  onDeleteWatch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'year-desc'>('featured');
  const [priceRange, setPriceRange] = useState<'all' | 'under-15k' | '15k-40k' | '40k-plus'>('all');
  const [partsProjectsOnly, setPartsProjectsOnly] = useState<boolean>(false);

  const pageTitle = siteContent?.searchPage?.title || 'Watches for Sale';
  const pageSubtitle = siteContent?.searchPage?.subtitle || 'Explore authenticated luxury watches, vintage rarities, and peer-to-peer listings.';

  // Unique list of brands in watches
  const brands = useMemo(() => {
    const set = new Set(watches.map((w) => w.brand));
    return Array.from(set);
  }, [watches]);

  // Filtered & sorted watches
  const filteredWatches = useMemo(() => {
    return watches
      .filter((w) => {
        // Query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchBrand = w.brand.toLowerCase().includes(q);
          const matchModel = w.model.toLowerCase().includes(q);
          const matchRef = w.reference.toLowerCase().includes(q);
          const matchDesc = w.description.toLowerCase().includes(q);
          if (!matchBrand && !matchModel && !matchRef && !matchDesc) return false;
        }

        // Brand match
        if (selectedBrand !== 'all' && w.brand !== selectedBrand) {
          return false;
        }

        // Price match
        if (priceRange === 'under-15k' && w.price >= 15000) return false;
        if (priceRange === '15k-40k' && (w.price < 15000 || w.price > 40000)) return false;
        if (priceRange === '40k-plus' && w.price <= 40000) return false;

        // Parts / Projects filter
        if (partsProjectsOnly) {
          const cond = (w.condition || '').toLowerCase();
          const isPartsOrProject =
            cond.includes('parts only') ||
            cond.includes('needs service') ||
            cond.includes('project');
          if (!isPartsOrProject) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'year-desc') {
          const yA = typeof a.year === 'number' ? a.year : parseInt(String(a.year)) || 0;
          const yB = typeof b.year === 'number' ? b.year : parseInt(String(b.year)) || 0;
          return yB - yA;
        }
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [watches, searchQuery, selectedBrand, priceRange, partsProjectsOnly, sortBy]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-10 md:py-16 animate-in fade-in duration-300">
      {/* Super Admin Notice */}
      {isAdmin && isAdminEditMode && (
        <div className="mb-6 p-3 bg-[#efe3aa] border border-[#d8c87e] flex items-center justify-between">
          <span className="text-xs font-label-caps text-[#474016] font-bold flex items-center gap-1.5">
            <Crown className="w-4 h-4 fill-[#735c00]" />
            Super Admin: Live Catalog &amp; Header Controls Active
          </span>
          {onOpenPageEdit && (
            <button
              onClick={onOpenPageEdit}
              className="bg-black text-white px-3 py-1 text-xs font-label-caps flex items-center gap-1 hover:bg-[#2f312e] cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Search Title &amp; Subtitle
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#c4c7c7] pb-6">
        <div>
          <h2 className="font-headline-lg text-3xl md:text-4xl text-black mb-2">
            {pageTitle}
          </h2>
          <p className="font-body-md text-[#444748] max-w-2xl">
            {pageSubtitle}
          </p>
        </div>

        {isAdmin && onOpenPageEdit && (
          <button
            onClick={onOpenPageEdit}
            className="font-label-caps text-xs px-3 py-1.5 border border-black hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Search Copy
          </button>
        )}
      </div>

      {/* Search Bar Input */}
      <div className="relative mb-8">
        <div className="flex items-center bg-white border border-[#c4c7c7] px-4 py-3 focus-within:border-[#735c00] transition-colors">
          <SearchIcon className="w-5 h-5 text-[#747878] mr-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by brand, reference (e.g. 116500LN), model, or complication..."
            className="w-full bg-transparent text-black text-sm md:text-base outline-none placeholder:text-[#747878]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#747878] hover:text-black p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Row: Brands & Price & Sorting (Category Selection Boxes Removed per user request) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Brand chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-label-caps text-xs text-[#747878] mr-2">Brand:</span>
          <button
            onClick={() => setSelectedBrand('all')}
            className={`text-xs px-3 py-1 border font-medium cursor-pointer transition-colors ${
              selectedBrand === 'all'
                ? 'border-[#735c00] bg-[#fafaf5] text-[#735c00]'
                : 'border-[#e8e8e3] bg-white text-[#444748] hover:border-[#c4c7c7]'
            }`}
          >
            All Brands
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`text-xs px-3 py-1 border font-medium cursor-pointer transition-colors ${
                selectedBrand === b
                  ? 'border-[#735c00] bg-[#fafaf5] text-[#735c00]'
                  : 'border-[#e8e8e3] bg-white text-[#444748] hover:border-[#c4c7c7]'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Price & Sort Controls with parts/projects selection box under Sort */}
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-xs text-[#747878]">Price:</span>
            <select
              id="select-price-range"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as any)}
              className="bg-white border border-[#c4c7c7] px-2.5 py-1.5 text-xs text-black outline-none font-medium cursor-pointer"
            >
              <option value="all">All Values</option>
              <option value="under-15k">&lt; $15,000 USD</option>
              <option value="15k-40k">$15,000 - $40,000</option>
              <option value="40k-plus">&gt; $40,000 USD</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-label-caps text-xs text-[#747878]">Sort:</span>
              <select
                id="select-sort-order"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#c4c7c7] px-2.5 py-1.5 text-xs text-black outline-none font-medium cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Year: Newest First</option>
              </select>
            </div>

            {/* Selection box: parts/projects under sort */}
            <label
              htmlFor="filter-parts-projects"
              id="selection-box-parts-projects"
              className={`flex items-center gap-2 px-2.5 py-1.5 border text-xs cursor-pointer select-none transition-all ${
                partsProjectsOnly
                  ? 'border-[#735c00] bg-[#efe3aa] text-[#474016] font-semibold ring-1 ring-[#735c00]'
                  : 'border-[#c4c7c7] bg-white text-black hover:border-black'
              }`}
              title="Show only watches with condition: parts only, or needs service/project"
            >
              <input
                type="checkbox"
                id="filter-parts-projects"
                name="parts-projects"
                checked={partsProjectsOnly}
                onChange={(e) => setPartsProjectsOnly(e.target.checked)}
                className="w-4 h-4 accent-[#735c00] cursor-pointer rounded-none"
              />
              <span className="font-label-caps text-xs tracking-wider">parts/projects</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Count & Reset */}
      <div className="flex items-center justify-between text-xs text-[#747878] mb-6">
        <div className="flex items-center gap-2">
          <span>Showing {filteredWatches.length} of {watches.length} timepieces</span>
          {partsProjectsOnly && (
            <span className="bg-[#efe3aa] text-[#474016] text-[10px] font-label-caps px-2 py-0.5 border border-[#d8c87e]">
              Filtered: parts/projects
            </span>
          )}
        </div>
        {(searchQuery || selectedBrand !== 'all' || priceRange !== 'all' || partsProjectsOnly) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedBrand('all');
              setPriceRange('all');
              setPartsProjectsOnly(false);
            }}
            className="text-[#735c00] hover:underline font-label-caps cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Watches */}
      {filteredWatches.length === 0 ? (
        <div className="bg-white p-12 text-center border border-[#c4c7c7] my-8">
          <p className="font-headline-md text-xl text-black mb-2">No Timepieces Found</p>
          <p className="text-sm text-[#444748] mb-6">
            {partsProjectsOnly
              ? 'No watches currently listed under condition rating "Parts Only" or "Needs Service / Project".'
              : 'Try adjusting your search criteria or consign a watch matching these specifications.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedBrand('all');
              setPriceRange('all');
              setPartsProjectsOnly(false);
            }}
            className="bg-black text-white font-label-caps text-xs px-6 py-3 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWatches.map((watch) => {
            const isFlagged = watch.isFlaggedFake || watch.aiAuthenticityReport?.status === 'counterfeit_flagged';
            const isVerifiedAuthentic = watch.aiAuthenticityReport?.status === 'authentic';

            return (
              <article
                key={watch.id}
                onClick={() => onSelectWatch(watch)}
                className={`bg-white border p-5 group cursor-pointer transition-all flex flex-col justify-between relative ${
                  isFlagged
                    ? 'border-red-400 hover:border-red-600 bg-red-50/10'
                    : 'border-[#c4c7c7] hover:border-[#735c00]'
                }`}
              >
                <div>
                  <div className="aspect-[4/3] bg-[#eeeee9] mb-4 overflow-hidden relative border border-[#e8e8e3]">
                    <img
                      src={watch.imageUrl}
                      alt={watch.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />

                    {/* AI Authenticity or Custom Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                      {isFlagged ? (
                        <span className="bg-red-900/95 text-white font-label-caps text-[9px] px-2 py-0.5 flex items-center gap-1 shadow-sm font-bold">
                          <ShieldAlert className="w-3 h-3 text-red-300" />
                          AI Flagged: Counterfeit Concern
                        </span>
                      ) : isVerifiedAuthentic ? (
                        <span className="bg-[#1c1b1b]/90 text-[#efe3aa] font-label-caps text-[9px] px-2 py-0.5 flex items-center gap-1 shadow-sm font-bold">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          Google AI Scanned
                        </span>
                      ) : watch.badge ? (
                        <span className="bg-white/90 backdrop-blur-xs font-label-caps text-[10px] px-2.5 py-1 text-black border border-[#c4c7c7]/30">
                          {watch.badge}
                        </span>
                      ) : null}
                    </div>

                    {watch.videoUrl && (
                      <span className="absolute top-3 right-3 bg-black/80 text-white font-label-caps text-[9px] px-2 py-0.5 flex items-center gap-1">
                        <Film className="w-2.5 h-2.5 text-[#efe3aa]" />
                        Video
                      </span>
                    )}

                    {/* Super Admin Quick Actions */}
                    {isAdmin && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 z-10">
                        {onEditWatch && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditWatch(watch);
                            }}
                            className="bg-black/90 hover:bg-black text-[#efe3aa] px-2 py-1 text-[10px] font-label-caps flex items-center gap-1 border border-[#efe3aa]/50 cursor-pointer shadow-sm"
                            title="Super Admin Edit"
                          >
                            <Edit3 className="w-3 h-3" /> Admin Edit
                          </button>
                        )}
                        {onDeleteWatch && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Super Admin: Permanently delete ${watch.brand} ${watch.model}?`)) {
                                onDeleteWatch(watch.id);
                              }
                            }}
                            className="bg-red-700 hover:bg-red-800 text-white p-1 text-[10px] cursor-pointer shadow-sm"
                            title="Super Admin Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="font-label-caps text-xs text-[#444748] mb-1">{watch.brand}</p>
                  <h3 className="font-headline-md text-xl text-black mb-1 group-hover:text-[#735c00] transition-colors">
                    {watch.model}
                  </h3>
                  <p className="font-body-md text-xs text-[#747878] mb-2">
                    {watch.reference}
                  </p>
                  {watch.condition && (watch.condition.toLowerCase().includes('parts') || watch.condition.toLowerCase().includes('project') || watch.condition.toLowerCase().includes('service')) && (
                    <div className="mb-3">
                      <span className="inline-block font-label-caps text-[10px] text-[#735c00] bg-[#fafaf5] px-2 py-0.5 border border-[#d8c87e] font-semibold">
                        Condition: {watch.condition}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#e8e8e3] flex justify-between items-end">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-label-caps text-[#747878]">Asking Price</span>
                      <span className={`text-[9px] font-label-caps px-1.5 py-0.2 font-semibold ${
                        watch.priceType === 'firm'
                          ? 'bg-[#1c1b1b] text-white'
                          : 'bg-[#efe3aa] text-[#474016]'
                      }`}>
                        {watch.priceType === 'firm' ? 'FIRM' : 'OBO'}
                      </span>
                    </div>
                    <span className="font-headline-md text-xl font-semibold text-black">
                      ${watch.price.toLocaleString()}
                    </span>
                  </div>
                  <button className="font-label-caps text-xs text-black group-hover:text-[#735c00] flex items-center gap-1 cursor-pointer">
                    Inspect →
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
