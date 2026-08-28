import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  DollarSign,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Phone,
  ArrowRight,
  User,
  XCircle,
  RotateCcw,
  Edit3,
  Check,
  Tag
} from 'lucide-react';
import { WatchInquiry, FormalOffer, Watch } from '../types';
import { CounterOfferModal } from './CounterOfferModal';

interface InquiriesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inquiries: WatchInquiry[];
  formalOffers: FormalOffer[];
  onOpenChatWithWatch: (watch: Watch) => void;
  onUpdateOffer?: (updatedOffer: FormalOffer) => void;
}

export const InquiriesDrawer: React.FC<InquiriesDrawerProps> = ({
  isOpen,
  onClose,
  inquiries = [],
  formalOffers = [],
  onOpenChatWithWatch,
  onUpdateOffer,
}) => {
  const [activeTab, setActiveTab] = useState<'offers' | 'messages'>('offers');
  const [selectedOfferForCounter, setSelectedOfferForCounter] = useState<FormalOffer | null>(null);

  if (!isOpen) return null;

  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];
  const safeOffers = Array.isArray(formalOffers) ? formalOffers : [];
  const totalItems = safeInquiries.length + safeOffers.length;

  const handleDeclineOffer = (offer: FormalOffer) => {
    if (onUpdateOffer) {
      onUpdateOffer({
        ...offer,
        status: 'declined',
      });
    }
  };

  const handleAcceptOffer = (offer: FormalOffer) => {
    if (onUpdateOffer) {
      onUpdateOffer({
        ...offer,
        status: 'accepted',
        sellerContactRevealed: true,
      });
    }
  };

  const handleCounterOfferSubmit = (counterPrice: number, comments?: string) => {
    if (selectedOfferForCounter && onUpdateOffer) {
      onUpdateOffer({
        ...selectedOfferForCounter,
        status: 'countered',
        counterPrice,
        sellerComment: comments,
        counteredAt: new Date().toISOString(),
      });
    }
    setSelectedOfferForCounter(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <div className="w-screen max-w-xl bg-[#fafaf5] border-l border-[#c4c7c7] flex flex-col justify-between shadow-2xl p-5 sm:p-8">
            {/* Header */}
            <div className="border-b border-[#c4c7c7] pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-caps text-xs text-[#735c00] tracking-widest block mb-1">
                    Communication &amp; Negotiations
                  </span>
                  <h3 className="font-headline-md text-2xl text-black">
                    Inquiries &amp; Offers ({totalItems})
                  </h3>
                </div>
                <button
                  id="btn-close-inquiries-drawer"
                  onClick={onClose}
                  className="text-black hover:text-[#735c00] p-1.5 cursor-pointer hover:bg-[#eeeee9]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sub Tabs */}
              <div className="flex gap-2 mt-4">
                <button
                  id="tab-offers-list"
                  onClick={() => setActiveTab('offers')}
                  className={`flex-1 py-2 font-label-caps text-xs text-center border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'offers'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-[#444748] border-[#c4c7c7] hover:border-black'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Formal Offers ({formalOffers.length})
                </button>
                <button
                  id="tab-messages-list"
                  onClick={() => setActiveTab('messages')}
                  className={`flex-1 py-2 font-label-caps text-xs text-center border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'messages'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-[#444748] border-[#c4c7c7] hover:border-black'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Direct Messages ({inquiries.length})
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="my-4 flex-1 overflow-y-auto space-y-4 pr-1">
              {activeTab === 'offers' ? (
                formalOffers.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <DollarSign className="w-12 h-12 text-[#c4c7c7] mx-auto" />
                    <p className="font-headline-md text-xl text-black">No Offers Submitted Yet</p>
                    <p className="text-xs text-[#747878] max-w-xs mx-auto">
                      Submit formal price offers directly from any watch page. When received, sellers can decline, accept, or submit counter offers with or without comments.
                    </p>
                  </div>
                ) : (
                  formalOffers.map((offer) => {
                    const discount = Math.round(
                      ((offer.watch.price - offer.offerAmount) / offer.watch.price) * 100
                    );

                    return (
                      <div
                        key={offer.id}
                        className={`bg-white border p-4 sm:p-5 space-y-3.5 shadow-sm transition-all ${
                          offer.status === 'countered'
                            ? 'border-[#735c00]'
                            : offer.status === 'accepted'
                            ? 'border-emerald-600'
                            : offer.status === 'declined'
                            ? 'border-[#c4c7c7] opacity-80'
                            : 'border-black'
                        }`}
                      >
                        {/* Top Timepiece Info & Status Badge */}
                        <div className="flex gap-3 items-start">
                          <img
                            src={offer.watch.imageUrl}
                            alt={offer.watch.model}
                            className="w-16 h-16 object-cover border border-[#e8e8e3] shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap justify-between items-start gap-1">
                              <span className="font-label-caps text-[10px] text-[#747878]">
                                {offer.watch.brand}
                              </span>

                              {/* Status Badges */}
                              {offer.status === 'pending' && (
                                <span className="bg-[#efe3aa] text-[#474016] border border-[#d8c87e] font-label-caps text-[9px] px-2 py-0.5 font-bold">
                                  Pending Seller Action
                                </span>
                              )}
                              {offer.status === 'countered' && (
                                <span className="bg-[#1c1b1b] text-[#efe3aa] font-label-caps text-[9px] px-2 py-0.5 font-bold">
                                  Counter Offer Sent (${offer.counterPrice?.toLocaleString()})
                                </span>
                              )}
                              {offer.status === 'accepted' && (
                                <span className="bg-emerald-100 text-emerald-900 font-label-caps text-[9px] px-2 py-0.5 font-bold">
                                  Accepted • Contact Revealed
                                </span>
                              )}
                              {offer.status === 'declined' && (
                                <span className="bg-neutral-100 text-neutral-700 border border-neutral-300 font-label-caps text-[9px] px-2 py-0.5 font-bold">
                                  Offer Declined
                                </span>
                              )}
                            </div>

                            <h4 className="font-headline-sm text-sm text-black font-semibold truncate mt-0.5">
                              {offer.watch.model}
                            </h4>

                            <div className="flex flex-wrap items-center justify-between gap-1 mt-1 text-xs">
                              <span className="text-[#747878]">
                                Asking: ${offer.watch.price.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-headline-md text-sm text-black font-bold">
                                  Offer: ${offer.offerAmount.toLocaleString()}
                                </span>
                                {discount > 0 && (
                                  <span className="text-[10px] text-[#735c00] font-medium">
                                    (-{discount}%)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Buyer Information Section */}
                        <div className="p-3 bg-[#fafaf5] border border-[#eeeee9] space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-label-caps text-[10px] text-[#735c00] font-bold">
                              Buyer Details
                            </span>
                            <span className="text-[10px] text-[#747878]">
                              {new Date(offer.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[#1a1c19]">
                            <div className="flex items-center gap-1.5 truncate">
                              <User className="w-3.5 h-3.5 text-[#747878] shrink-0" />
                              <strong className="truncate">{offer.buyerName}</strong>
                            </div>
                            <div className="flex items-center gap-1.5 truncate">
                              <Mail className="w-3.5 h-3.5 text-[#747878] shrink-0" />
                              <span className="truncate">{offer.buyerEmail}</span>
                            </div>
                          </div>

                          {offer.buyerPhone && (
                            <div className="flex items-center gap-1.5 text-[#1a1c19]">
                              <Phone className="w-3.5 h-3.5 text-[#747878] shrink-0" />
                              <span>{offer.buyerPhone}</span>
                            </div>
                          )}

                          {offer.note && (
                            <div className="pt-1.5 border-t border-[#eeeee9] text-[#444748] italic">
                              "{offer.note}"
                            </div>
                          )}
                        </div>

                        {/* Counter Offer Details Display if active */}
                        {offer.status === 'countered' && (
                          <div className="p-3 bg-[#f7f5ed] border border-[#d2c790] space-y-1.5 text-xs">
                            <div className="flex items-center justify-between font-label-caps text-[10px] text-[#735c00] font-bold">
                              <span className="flex items-center gap-1">
                                <Tag className="w-3.5 h-3.5" />
                                Your Active Counter Offer
                              </span>
                              <span className="font-headline-md text-sm text-black font-bold">
                                ${offer.counterPrice?.toLocaleString()} USD
                              </span>
                            </div>
                            {offer.sellerComment ? (
                              <div className="text-[#444748] pt-1 border-t border-[#e8e4d2]">
                                <span className="font-semibold text-black text-[11px] block">
                                  Your Comment to Buyer:
                                </span>
                                <p className="italic">"{offer.sellerComment}"</p>
                              </div>
                            ) : (
                              <p className="text-[11px] text-[#747878] italic pt-0.5">
                                Submitted without written comments.
                              </p>
                            )}
                          </div>
                        )}

                        {/* Seller Action Controls (Decline / Counter Offer / Accept) */}
                        <div className="pt-2 border-t border-[#eeeee9] space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-[#444748] font-label-caps font-semibold">
                            <span>Seller Response Selection:</span>
                            {offer.status !== 'pending' && (
                              <span className="text-[10px] text-[#747878]">
                                Status: <span className="capitalize text-black">{offer.status}</span>
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {/* Counter Offer Checkbox/Button */}
                            <button
                              type="button"
                              id={`btn-counter-offer-${offer.id}`}
                              onClick={() => setSelectedOfferForCounter(offer)}
                              className={`p-2.5 border text-xs font-label-caps flex items-center justify-between transition-all cursor-pointer ${
                                offer.status === 'countered'
                                  ? 'bg-[#efe3aa] text-[#474016] border-[#d8c87e] font-bold'
                                  : 'bg-white text-black border-black hover:bg-[#fafaf5]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={offer.status === 'countered'}
                                  readOnly
                                  className="w-3.5 h-3.5 accent-[#735c00] cursor-pointer"
                                />
                                <span className="text-left leading-tight">
                                  {offer.status === 'countered' ? 'Modify Counter Offer' : 'Counter Offer'}
                                  <span className="block text-[9px] font-normal text-[#747878] normal-case">
                                    With or without comments
                                  </span>
                                </span>
                              </div>
                              <Edit3 className="w-3.5 h-3.5 shrink-0 text-[#735c00]" />
                            </button>

                            {/* Decline Offer Option */}
                            <button
                              type="button"
                              id={`btn-decline-offer-${offer.id}`}
                              onClick={() => handleDeclineOffer(offer)}
                              disabled={offer.status === 'declined'}
                              className={`p-2.5 border text-xs font-label-caps flex items-center justify-between transition-all cursor-pointer ${
                                offer.status === 'declined'
                                  ? 'bg-neutral-100 text-neutral-500 border-neutral-300 opacity-70 cursor-not-allowed'
                                  : 'bg-white text-red-700 border-[#c4c7c7] hover:border-red-600 hover:bg-red-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <XCircle className="w-4 h-4 text-red-700 shrink-0" />
                                <span>{offer.status === 'declined' ? 'Offer Declined' : 'Decline Offer'}</span>
                              </div>
                            </button>
                          </div>

                          {/* Accept Offer Action */}
                          {offer.status !== 'accepted' && (
                            <button
                              type="button"
                              id={`btn-accept-offer-${offer.id}`}
                              onClick={() => handleAcceptOffer(offer)}
                              className="w-full py-2.5 bg-black text-white font-label-caps text-xs flex items-center justify-center gap-1.5 hover:bg-[#2f312e] transition-colors cursor-pointer"
                            >
                              <Check className="w-4 h-4 text-emerald-400" />
                              Accept Offer of ${offer.offerAmount.toLocaleString()} &amp; Reveal Dossier
                            </button>
                          )}
                        </div>

                        {/* Revealed Contact Section when Accepted */}
                        {offer.sellerContactRevealed && offer.sellerDetails && (
                          <div className="bg-[#fafaf5] p-3.5 border border-[#d2c790] space-y-2 text-xs">
                            <span className="font-label-caps text-[10px] text-[#735c00] font-bold block">
                              Verified Outside Settlement Dossier
                            </span>
                            <div className="space-y-1 text-[#1a1c19]">
                              <div className="flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-[#735c00]" />
                                <span className="font-semibold">{offer.sellerDetails.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-[#735c00]" />
                                <a href={`mailto:${offer.sellerDetails.email}`} className="hover:underline">
                                  {offer.sellerDetails.email}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-[#735c00]" />
                                <a href={`tel:${offer.sellerDetails.phone}`} className="hover:underline">
                                  {offer.sellerDetails.phone}
                                </a>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-[#e8e8e3] flex justify-between items-center">
                              <span className="text-[10px] text-[#747878]">Direct outside wire / escrow</span>
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onOpenChatWithWatch(offer.watch);
                                }}
                                className="font-label-caps text-[11px] text-[#735c00] hover:text-black font-bold flex items-center gap-1 cursor-pointer"
                              >
                                Open Chat <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )
              ) : inquiries.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <MessageSquare className="w-12 h-12 text-[#c4c7c7] mx-auto" />
                  <p className="font-headline-md text-xl text-black">No Messages Sent</p>
                  <p className="text-xs text-[#747878] max-w-xs mx-auto">
                    Send secure inquiries or start live direct chats with verified watch owners to negotiate terms and outside payments.
                  </p>
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-white border border-[#c4c7c7] p-4 space-y-2.5 shadow-sm"
                  >
                    <div className="flex gap-3 items-center">
                      <img
                        src={inq.watch.imageUrl}
                        alt={inq.watch.model}
                        className="w-12 h-12 object-cover border border-[#e8e8e3] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-label-caps text-[10px] text-[#747878]">{inq.watch.brand}</span>
                        <h4 className="font-headline-sm text-sm text-black font-semibold truncate">
                          {inq.watch.model}
                        </h4>
                        <p className="text-xs text-[#444748]">${inq.watch.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="bg-[#fafaf5] p-2.5 border border-[#eeeee9] text-xs text-[#444748]">
                      <span className="font-semibold text-black block mb-0.5">Initial Message:</span>
                      <p className="italic line-clamp-2">"{inq.initialMessage}"</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenChatWithWatch(inq.watch);
                      }}
                      className="w-full py-2 bg-black text-white font-label-caps text-xs flex items-center justify-center gap-1.5 hover:bg-[#2f312e] transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Open Live Conversation
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Notice */}
            <div className="border-t border-[#c4c7c7] pt-4 space-y-3 text-xs text-[#444748]">
              <div className="flex items-start gap-2 bg-[#f4f3ec] p-3 border border-[#c4c7c7]">
                <ShieldCheck className="w-4 h-4 text-[#735c00] shrink-0 mt-0.5" />
                <span>
                  Swapping Time is an independent connection venue. Buyers and sellers coordinate outside wire transfer, escrow, or in-person handover directly.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Counter Offer Modal Window */}
      {selectedOfferForCounter && (
        <CounterOfferModal
          offer={selectedOfferForCounter}
          isOpen={!!selectedOfferForCounter}
          onClose={() => setSelectedOfferForCounter(null)}
          onSubmitCounter={handleCounterOfferSubmit}
        />
      )}
    </>
  );
};
