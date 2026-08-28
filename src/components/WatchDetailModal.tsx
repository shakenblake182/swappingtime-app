import React, { useState } from 'react';
import { X, ShieldCheck, Truck, RotateCcw, MessageSquare, DollarSign, Send, ArrowRight, Phone, Mail, Play, Video, Film, Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import { Watch } from '../types';

interface WatchDetailModalProps {
  watch: Watch;
  onClose: () => void;
  onOpenContactSeller: (watch: Watch) => void;
  onOpenMakeOffer: (watch: Watch) => void;
  onOpenDirectChat: (watch: Watch) => void;
  onConsignSimilar: (watch: Watch) => void;
  isWatched?: boolean;
  onToggleWatch?: (watchId: string) => void;
}

export const WatchDetailModal: React.FC<WatchDetailModalProps> = ({
  watch,
  onClose,
  onOpenContactSeller,
  onOpenMakeOffer,
  onOpenDirectChat,
  onConsignSimilar,
  isWatched = false,
  onToggleWatch,
}) => {
  const [activeImage, setActiveImage] = useState<string>(watch.imageUrl);
  const [showVideoMode, setShowVideoMode] = useState<boolean>(false);

  const allImages = [watch.imageUrl, ...(watch.secondaryImages || [])];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fafaf5] border border-[#c4c7c7] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Close button */}
        <button
          id="btn-close-watch-modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-[#735c00] p-2 cursor-pointer z-10 bg-white/80"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10">
          {/* Left: Gallery (md:col-span-6) */}
          <div className="md:col-span-6 space-y-4">
            <div className="aspect-[4/3] bg-[#eeeee9] border border-[#c4c7c7] overflow-hidden relative">
              {showVideoMode && watch.videoUrl ? (
                <video
                  src={watch.videoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <img
                  src={activeImage}
                  alt={watch.model}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
              {watch.badge && (
                <span className="absolute top-3 left-3 bg-white/90 font-label-caps text-xs px-3 py-1 text-black border border-[#c4c7c7] z-10">
                  {watch.badge}
                </span>
              )}
              {watch.videoUrl && !showVideoMode && (
                <button
                  type="button"
                  onClick={() => setShowVideoMode(true)}
                  className="absolute bottom-3 right-3 bg-black/80 hover:bg-black text-white text-[11px] font-label-caps px-3 py-1.5 flex items-center gap-1.5 transition-all shadow-md z-10 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Watch Movement Video
                </button>
              )}
            </div>

            {/* Gallery thumbnails including running video tab */}
            <div className="flex flex-wrap gap-3">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveImage(img);
                    setShowVideoMode(false);
                  }}
                  className={`w-20 h-20 bg-[#eeeee9] border overflow-hidden cursor-pointer ${
                    activeImage === img && !showVideoMode ? 'border-[#735c00] ring-1 ring-[#735c00]' : 'border-[#c4c7c7]'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Angle ${i + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}

              {watch.videoUrl && (
                <button
                  type="button"
                  onClick={() => setShowVideoMode(true)}
                  className={`w-20 h-20 bg-[#1c1b1b] text-white border flex flex-col items-center justify-center p-1 text-center cursor-pointer transition-colors ${
                    showVideoMode ? 'border-[#735c00] ring-2 ring-[#735c00]' : 'border-black hover:bg-black'
                  }`}
                  title="Play running movement video clip"
                >
                  <Video className="w-5 h-5 mb-1 text-[#efe3aa]" />
                  <span className="text-[9px] font-label-caps text-[#efe3aa] leading-tight">
                    Running Video
                  </span>
                </button>
              )}
            </div>

            {/* Direct Communication Info */}
            <div className="bg-white p-4 border border-[#c4c7c7] space-y-3 text-xs text-[#444748]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#735c00] shrink-0" />
                <span>Direct Seller Inquiry &amp; Peer Negotiation System</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#735c00] shrink-0" />
                <span>Arrange Outside Wire Transfer, Escrow, or In-Person Handover</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#735c00] shrink-0" />
                <span>Instant on-site direct chat with verified watch consignor</span>
              </div>
            </div>
          </div>

          {/* Right: Specifications & Communication CTAs (md:col-span-6) */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <p className="font-label-caps text-xs text-[#444748] mb-1">{watch.brand}</p>
              <h2 className="font-headline-lg text-2xl md:text-3xl text-black mb-2">
                {watch.model}
              </h2>
              <p className="font-body-md text-sm text-[#747878] mb-4">
                {watch.reference}
              </p>

              <div className="mb-6 pb-6 border-b border-[#c4c7c7] flex justify-between items-end">
                <div>
                  <span className="font-label-caps text-xs text-[#747878] block mb-1">
                    Asking Price
                  </span>
                  <span className="font-headline-md text-3xl md:text-4xl text-black font-semibold">
                    ${watch.price.toLocaleString()}
                  </span>
                  {typeof watch.viewCount === 'number' && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-[#735c00] font-label-caps font-medium">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{watch.viewCount.toLocaleString()} views on this timepiece</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-label-caps font-semibold px-3 py-1 ${
                    watch.priceType === 'firm'
                      ? 'bg-[#1c1b1b] text-white'
                      : 'bg-[#efe3aa] text-[#474016] border border-[#d8c87e]'
                  }`}>
                    {watch.priceType === 'firm' ? 'FIRM' : 'OBO'}
                  </span>
                  <span className="text-[10px] text-[#747878] mt-1 font-label-caps">
                    {watch.priceType === 'firm' ? 'Price is firm' : 'Or best offer'}
                  </span>
                </div>
              </div>

              {/* Watch this Watch Button */}
              {onToggleWatch && (
                <div className="mb-6">
                  <button
                    id="btn-watch-this-watch"
                    onClick={() => onToggleWatch(watch.id)}
                    className={`w-full py-3 px-4 font-label-caps text-xs flex items-center justify-center gap-2 slow-transition cursor-pointer border ${
                      isWatched
                        ? 'bg-[#efe3aa] text-[#474016] border-[#d8c87e] hover:bg-[#e2d596] font-bold shadow-xs'
                        : 'bg-white text-black border-[#c4c7c7] hover:border-black hover:bg-[#f4f3ec]'
                    }`}
                  >
                    {isWatched ? (
                      <>
                        <BookmarkCheck className="w-4 h-4 fill-[#735c00] text-[#735c00]" />
                        <span>Watching this Watch (Saved to Your Account)</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4 text-[#735c00]" />
                        <span>Watch this Watch</span>
                      </>
                    )}
                  </button>
                  {isWatched && (
                    <p className="text-[11px] text-[#747878] text-center mt-1.5 font-label-caps">
                      Saved in your account. Automatically removed if sold.
                    </p>
                  )}
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-[#444748] leading-relaxed mb-6">
                {watch.description}
              </p>

              {/* Technical Spec List */}
              <div className="space-y-2.5 text-xs bg-white p-4 border border-[#c4c7c7] mb-6">
                <div className="flex justify-between py-1 border-b border-[#eeeee9]">
                  <span className="text-[#747878]">Case Diameter:</span>
                  <span className="font-medium text-black">{watch.caseDiameter}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#eeeee9]">
                  <span className="text-[#747878]">Case Material:</span>
                  <span className="font-medium text-black">{watch.caseMaterial}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#eeeee9]">
                  <span className="text-[#747878]">Dial:</span>
                  <span className="font-medium text-black">{watch.dialColor}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#eeeee9]">
                  <span className="text-[#747878]">Movement:</span>
                  <span className="font-medium text-black">{watch.movement}</span>
                </div>
                {watch.powerReserve && (
                  <div className="flex justify-between py-1 border-b border-[#eeeee9]">
                    <span className="text-[#747878]">Power Reserve:</span>
                    <span className="font-medium text-black">{watch.powerReserve}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-[#eeeee9]">
                  <span className="text-[#747878]">Condition:</span>
                  <span className="font-medium text-black">{watch.condition}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#747878]">Box &amp; Papers:</span>
                  <span className="font-medium text-black">{watch.boxAndPapers}</span>
                </div>
              </div>
            </div>

            {/* Communication & Lead Generation Action Buttons (Replaces Checkout) */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Make an Offer */}
                <button
                  id="btn-make-an-offer"
                  onClick={() => onOpenMakeOffer(watch)}
                  className="py-3.5 bg-black text-white font-label-caps text-xs flex items-center justify-center gap-2 hover:bg-[#2f312e] transition-colors cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" />
                  Make an Offer
                </button>

                {/* 2. Contact Seller */}
                <button
                  id="btn-contact-seller"
                  onClick={() => onOpenContactSeller(watch)}
                  className="py-3.5 bg-[#735c00] text-white font-label-caps text-xs flex items-center justify-center gap-2 hover:bg-[#5a4800] transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Contact Seller
                </button>
              </div>

              {/* 3. On-site Direct Messaging (Chat) */}
              <button
                id="btn-direct-chat"
                onClick={() => onOpenDirectChat(watch)}
                className="w-full py-3.5 border-2 border-black text-black font-label-caps text-xs hover:bg-[#f4f3ec] transition-colors flex items-center justify-center gap-2 cursor-pointer bg-white"
              >
                <MessageSquare className="w-4 h-4" />
                Live Chat with Seller
              </button>

              {/* Consign similar */}
              <button
                id="btn-consign-similar"
                onClick={() => {
                  onClose();
                  onConsignSimilar(watch);
                }}
                className="w-full py-2.5 text-[#747878] hover:text-black font-label-caps text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Have a similar timepiece? Consign with us
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
