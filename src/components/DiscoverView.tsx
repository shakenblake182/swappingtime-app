import React from 'react';
import { ArrowRight, Sparkles, Shield, Award, CheckCircle2, Edit3, Trash2, Crown, Flame, Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import { Watch, SiteContent } from '../types';
import { WatchLoveCartoonStory } from './WatchLoveCartoonStory';

interface DiscoverViewProps {
  watches: Watch[];
  onSelectWatch: (watch: Watch) => void;
  onSelectCategory?: (category: 'vintage' | 'modern' | 'diver' | 'dress') => void;
  onNavigateToSell: () => void;
  onNavigateToSearch: () => void;
  siteContent?: SiteContent;
  isAdmin?: boolean;
  isAdminEditMode?: boolean;
  onOpenPageEdit?: () => void;
  onEditWatch?: (watch: Watch) => void;
  onDeleteWatch?: (watchId: string) => void;
  watchedWatchIds?: string[];
  onToggleWatch?: (watchId: string) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  watches,
  onSelectWatch,
  onSelectCategory,
  onNavigateToSell,
  onNavigateToSearch,
  siteContent,
  isAdmin = false,
  isAdminEditMode = false,
  onOpenPageEdit,
  onEditWatch,
  onDeleteWatch,
  watchedWatchIds = [],
  onToggleWatch,
}) => {
  // Top 5 most viewed watches for Trending Now
  const trendingTop5 = [...watches]
    .filter((w) => !w.isSold)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  const top1 = trendingTop5[0];
  const topRemaining = trendingTop5.slice(1, 5);

  return (
    <div className="w-full max-w-[1280px] mx-auto">
      {/* Super Admin Inline Edit Page Notice */}
      {isAdmin && isAdminEditMode && (
        <div className="mx-4 md:mx-16 mt-4 p-3 bg-[#efe3aa] border border-[#d8c87e] flex items-center justify-between">
          <span className="text-xs font-label-caps text-[#474016] font-bold flex items-center gap-1.5">
            <Crown className="w-4 h-4 fill-[#735c00]" />
            Super Admin: You have live editing authority across this page.
          </span>
          {onOpenPageEdit && (
            <button
              onClick={onOpenPageEdit}
              className="bg-black text-white px-3 py-1 text-xs font-label-caps flex items-center gap-1 hover:bg-[#2f312e] cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Hero &amp; Discover Copy
            </button>
          )}
        </div>
      )}

      {/* TOP SECTION: Recently Added to the Site (At the very top above everything) */}
      <section className="mt-4 md:mt-8 mb-16 md:mb-20 px-4 md:px-16 animate-in fade-in duration-300">
        <div className="border-b border-[#c4c7c7] pb-4 mb-8 flex justify-between items-end">
          <div>
            <span className="font-label-caps text-[11px] text-[#735c00] block mb-1">
              Fresh Listings &amp; New Arrivals
            </span>
            <h3 className="font-headline-lg text-2xl md:text-3xl text-black">
              Recently Added to the Site
            </h3>
          </div>
          <button
            onClick={onNavigateToSearch}
            className="font-label-caps text-xs text-[#735c00] hover:text-black flex items-center gap-1 group cursor-pointer transition-colors"
          >
            View Complete Catalog ({watches.length}) <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {watches.slice(0, 4).map((watch) => (
            <article
              key={watch.id}
              onClick={() => onSelectWatch(watch)}
              className="bg-white p-4 border border-[#c4c7c7] group cursor-pointer hover:border-[#735c00] transition-colors relative shadow-xs hover:shadow-md"
            >
              <div className="aspect-square bg-[#f4f4ef] mb-4 overflow-hidden relative border border-[#e8e8e3]">
                <img
                  src={watch.imageUrl}
                  alt={watch.model}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {watch.badge && (
                  <span className="absolute top-2 left-2 bg-[#fafaf5]/90 text-[10px] font-label-caps px-2 py-1 border border-[#c4c7c7]/40 shadow-xs">
                    {watch.badge}
                  </span>
                )}
                {isAdmin && onEditWatch && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditWatch(watch);
                    }}
                    className="absolute top-2 right-2 bg-black/80 hover:bg-black text-[#efe3aa] p-1 text-[10px] cursor-pointer"
                    title="Edit watch"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="font-label-caps text-[11px] text-[#444748] mb-1">{watch.brand}</p>
              <h4 className="font-headline-md text-base text-black mb-1 line-clamp-1 group-hover:text-[#735c00]">
                {watch.model}
              </h4>
              <p className="text-xs text-[#747878] mb-3">{watch.year} • {watch.caseDiameter}</p>
              <div className="flex justify-between items-center pt-2 border-t border-[#e8e8e3]">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-black">${watch.price.toLocaleString()}</span>
                  <span className={`text-[9px] font-label-caps px-1.5 py-0.5 font-semibold ${
                    watch.priceType === 'firm'
                      ? 'bg-[#1c1b1b] text-white'
                      : 'bg-[#efe3aa] text-[#474016]'
                  }`}>
                    {watch.priceType === 'firm' ? 'FIRM' : 'OBO'}
                  </span>
                </div>
                <span className="text-xs text-[#735c00] font-label-caps group-hover:underline">Details →</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5 Cycling Cartoon GIFs of Someone Buying a Watch and Loving It */}
      <WatchLoveCartoonStory />

      {/* Trending Now: Top 5 Most Viewed Watches on the Site */}
      <section className="mb-20 md:mb-28 px-4 md:px-16">
        <div className="flex items-end justify-between mb-8 border-b border-[#c4c7c7] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-caps text-[11px] text-[#735c00] font-bold">
                Most Viewed by Collectors
              </span>
              <span className="bg-[#efe3aa] text-[#474016] text-[10px] font-label-caps px-2 py-0.5 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#735c00] fill-[#735c00]" />
                Top 5 Trending
              </span>
            </div>
            <h2 className="font-headline-lg text-2xl md:text-4xl text-black">
              Trending Now
            </h2>
          </div>
          <button
            onClick={onNavigateToSearch}
            className="font-label-caps text-xs text-[#444748] hover:text-black slow-transition uppercase flex items-center group cursor-pointer"
          >
            View All ({watches.length})
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Rank #1: The Most Viewed Timepiece on Site */}
          {top1 && (
            <article
              id={`watch-card-${top1.id}`}
              onClick={() => onSelectWatch(top1)}
              className="lg:col-span-6 bg-white p-5 md:p-6 border border-[#c4c7c7] hover:border-[#735c00] group cursor-pointer relative shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-full bg-[#eeeee9] h-[300px] md:h-[380px] mb-5 relative overflow-hidden border border-[#e8e8e3]">
                  <img
                    src={top1.imageUrl}
                    alt={top1.model}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Rank 1 & View Count Overlay Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    <span className="bg-black text-[#efe3aa] font-label-caps text-xs px-2.5 py-1 font-bold flex items-center gap-1.5 shadow-md">
                      <Flame className="w-3.5 h-3.5 fill-[#d2c790] text-[#d2c790]" />
                      #1 MOST VIEWED
                    </span>
                    <span className="bg-white/95 backdrop-blur-xs text-black font-label-caps text-[11px] px-2.5 py-1 border border-[#c4c7c7]/60 shadow-xs flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#735c00]" />
                      {(top1.viewCount || 0).toLocaleString()} views
                    </span>
                  </div>

                  {/* Watch this Watch bookmark toggle */}
                  {onToggleWatch && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatch(top1.id);
                      }}
                      className={`absolute top-3 right-3 p-2 transition-colors cursor-pointer z-20 border shadow-md ${
                        watchedWatchIds.includes(top1.id)
                          ? 'bg-[#efe3aa] text-[#735c00] border-[#d8c87e]'
                          : 'bg-white/90 text-[#444748] hover:text-black border-[#c4c7c7] hover:bg-white'
                      }`}
                      title={watchedWatchIds.includes(top1.id) ? 'Saved in Watching List' : 'Watch this watch'}
                    >
                      {watchedWatchIds.includes(top1.id) ? (
                        <BookmarkCheck className="w-4 h-4 fill-[#735c00]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* Super Admin Quick Controls */}
                  {isAdmin && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-20">
                      {onEditWatch && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditWatch(top1);
                          }}
                          className="bg-black/90 hover:bg-black text-[#efe3aa] px-2 py-0.5 text-[10px] font-label-caps flex items-center gap-1 border border-[#efe3aa]/50 cursor-pointer shadow-md"
                          title="Super Admin Edit"
                        >
                          <Edit3 className="w-3 h-3" /> Admin Edit
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-label-caps text-xs text-[#444748] uppercase tracking-wider mb-1">
                      {top1.brand}
                    </p>
                    <h3 className="font-headline-md text-2xl md:text-3xl text-black group-hover:text-[#735c00] transition-colors line-clamp-1">
                      {top1.model}
                    </h3>
                    <p className="text-xs text-[#747878] mt-0.5">
                      {top1.reference} • {top1.year}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5 mb-0.5">
                      <span className={`text-[9px] font-label-caps px-1.5 py-0.5 font-semibold ${
                        top1.priceType === 'firm'
                          ? 'bg-[#1c1b1b] text-white'
                          : 'bg-[#efe3aa] text-[#474016]'
                      }`}>
                        {top1.priceType === 'firm' ? 'FIRM' : 'OBO'}
                      </span>
                    </div>
                    <p className="font-body-lg text-xl md:text-2xl font-bold text-black">
                      ${top1.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#444748] line-clamp-2 leading-relaxed mb-4">
                  {top1.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#e8e8e3] flex justify-between items-center text-xs">
                <span className="font-label-caps text-[#747878]">
                  {top1.sellerLocation || 'Direct Peer Listing'}
                </span>
                <span className="font-label-caps text-[#735c00] font-semibold group-hover:underline flex items-center gap-1">
                  View Timepiece &amp; Make Offer →
                </span>
              </div>
            </article>
          )}

          {/* Ranks #2 through #5 Grid (Right 6 cols on desktop) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {topRemaining.map((watch, idx) => {
              const rank = idx + 2;
              const isWatched = watchedWatchIds.includes(watch.id);

              return (
                <article
                  key={watch.id}
                  id={`watch-card-${watch.id}`}
                  onClick={() => onSelectWatch(watch)}
                  className="bg-white p-3.5 md:p-4 border border-[#c4c7c7] hover:border-[#735c00] group cursor-pointer relative shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full bg-[#eeeee9] aspect-[4/3] mb-3 relative overflow-hidden border border-[#e8e8e3]">
                      <img
                        src={watch.imageUrl}
                        alt={watch.model}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />

                      {/* Rank & View Badge */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                        <span className="bg-[#1c1b1b] text-[#efe3aa] font-label-caps text-[10px] px-2 py-0.5 font-bold shadow-xs">
                          #{rank} TRENDING
                        </span>
                        <span className="bg-white/95 text-black font-label-caps text-[9px] px-1.5 py-0.5 border border-[#c4c7c7]/50 shadow-xs flex items-center gap-0.5">
                          <Eye className="w-3 h-3 text-[#735c00]" />
                          {(watch.viewCount || 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Watch this Watch bookmark */}
                      {onToggleWatch && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatch(watch.id);
                          }}
                          className={`absolute top-2 right-2 p-1.5 transition-colors cursor-pointer z-20 border shadow-xs ${
                            isWatched
                              ? 'bg-[#efe3aa] text-[#735c00] border-[#d8c87e]'
                              : 'bg-white/90 text-[#444748] hover:text-black border-[#c4c7c7] hover:bg-white'
                          }`}
                          title={isWatched ? 'Saved in Watching List' : 'Watch this watch'}
                        >
                          {isWatched ? (
                            <BookmarkCheck className="w-3.5 h-3.5 fill-[#735c00]" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    <p className="font-label-caps text-[10px] text-[#444748] uppercase tracking-wider mb-0.5">
                      {watch.brand}
                    </p>
                    <h4 className="font-headline-md text-base text-black group-hover:text-[#735c00] transition-colors line-clamp-1 mb-1">
                      {watch.model}
                    </h4>
                    <p className="text-[11px] text-[#747878] mb-2">
                      {watch.year} • {watch.caseDiameter}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#e8e8e3] flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm text-black">
                        ${watch.price.toLocaleString()}
                      </span>
                      <span className={`text-[8px] font-label-caps px-1 py-0.2 font-semibold ${
                        watch.priceType === 'firm'
                          ? 'bg-[#1c1b1b] text-white'
                          : 'bg-[#efe3aa] text-[#474016]'
                      }`}>
                        {watch.priceType === 'firm' ? 'FIRM' : 'OBO'}
                      </span>
                    </div>
                    <span className="text-[11px] font-label-caps text-[#735c00] group-hover:underline">
                      Offer →
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Consignment Banner */}
      <section className="mb-24 px-4 md:px-16">
        <div className="bg-black text-white p-8 md:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 border border-[#2a2a2a]">
          <div className="max-w-3xl space-y-5">
            <div>
              <h3 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mb-2 uppercase">
                YOUR WRIST’S NEXT BEST FRIEND
              </h3>
              <p className="text-[#efe3aa] font-medium text-sm md:text-base leading-relaxed">
                Scroll less, score more. Find totally unique watches from wardrobes around the world.
              </p>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-[#c8c6c5] leading-relaxed pt-1">
              <li className="flex items-start gap-2.5">
                <span className="text-[#efe3aa] font-bold text-base leading-none select-none">—</span>
                <div>
                  <strong className="text-white font-semibold">No boring watches allowed:</strong>{' '}
                  <span>Ditch the standard retail pages and swipe through rare finds, retro throwbacks, and unique styles with real personality.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#efe3aa] font-bold text-base leading-none select-none">—</span>
                <div>
                  <strong className="text-white font-semibold">Straight from one closet to yours:</strong>{' '}
                  <span>Chat directly with the owner, make an offer, and talk watch-to-watch without the corporate filter.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#efe3aa] font-bold text-base leading-none select-none">—</span>
                <div>
                  <strong className="text-white font-semibold">All the fun, none of the fees:</strong>{' '}
                  <span>Enjoy a 100% fee-free zone where you can bargain, swap, and settle up your own way.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="shrink-0 w-full lg:w-auto pt-2 lg:pt-0">
            <button
              id="btn-banner-consign"
              onClick={onNavigateToSell}
              className="w-full lg:w-auto bg-white text-black font-label-caps text-xs md:text-sm px-8 py-4 hover:bg-[#efe3aa] hover:text-black transition-colors whitespace-nowrap cursor-pointer tracking-wider text-center"
            >
              List Your Timepiece →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
