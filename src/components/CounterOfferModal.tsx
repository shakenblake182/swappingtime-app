import React, { useState } from 'react';
import { X, DollarSign, ArrowRight, MessageSquare, ShieldCheck, Tag } from 'lucide-react';
import { FormalOffer } from '../types';

interface CounterOfferModalProps {
  offer: FormalOffer;
  isOpen: boolean;
  onClose: () => void;
  onSubmitCounter: (counterPrice: number, comments?: string) => void;
}

export const CounterOfferModal: React.FC<CounterOfferModalProps> = ({
  offer,
  isOpen,
  onClose,
  onSubmitCounter,
}) => {
  // Default counter price is either existing counter or midpoint between offer and asking
  const defaultCounter = offer.counterPrice || Math.round((offer.watch.price + offer.offerAmount) / 2);
  const [counterPrice, setCounterPrice] = useState<number>(defaultCounter);
  const [withComments, setWithComments] = useState<boolean>(!!offer.sellerComment);
  const [comments, setComments] = useState<string>(offer.sellerComment || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterPrice || counterPrice <= 0) {
      setError('Please enter a valid counter price.');
      return;
    }
    setError(null);
    onSubmitCounter(counterPrice, withComments && comments.trim() ? comments.trim() : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#fafaf5] border border-black shadow-2xl p-6 sm:p-8 my-8">
        {/* Close Button */}
        <button
          id="btn-close-counter-modal"
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#444748] hover:text-black hover:bg-[#e4e3dc] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 border-b border-[#c4c7c7] pb-4">
          <span className="font-label-caps text-xs text-[#735c00] tracking-widest block mb-1">
            Seller Negotiation Desk
          </span>
          <h2 className="font-headline-lg text-2xl text-black">
            Submit Counter Offer
          </h2>
          <p className="text-xs text-[#444748] mt-1">
            Propose an updated price to <strong className="text-black">{offer.buyerName}</strong> for this timepiece.
          </p>

          {/* Timepiece & Offer Comparison Card */}
          <div className="mt-4 p-3 bg-white border border-[#e4e3dc] flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={offer.watch.imageUrl}
                alt={offer.watch.model}
                className="w-12 h-12 object-cover border border-[#c4c7c7] shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <span className="font-label-caps text-[10px] text-[#747878]">{offer.watch.brand}</span>
                <p className="font-headline-sm text-sm text-black font-semibold truncate">{offer.watch.model}</p>
                <span className="text-xs text-[#444748]">Original Asking: ${offer.watch.price.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-label-caps text-[#747878] block">Buyer's Offer</span>
              <span className="font-headline-md text-base text-[#735c00] font-bold">
                ${offer.offerAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Updated Price Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-counter-price" className="font-label-caps text-xs text-black font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#735c00]" />
                Your Counter Price ($ USD) *
              </label>
              {counterPrice > 0 && (
                <span className="text-[11px] font-medium text-[#444748]">
                  {counterPrice > offer.offerAmount
                    ? `+$${(counterPrice - offer.offerAmount).toLocaleString()} over buyer offer`
                    : counterPrice === offer.offerAmount
                    ? 'Matches buyer offer'
                    : `-$${(offer.offerAmount - counterPrice).toLocaleString()} under buyer offer`}
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black font-headline-md text-xl">
                $
              </span>
              <input
                id="input-counter-price"
                type="number"
                required
                min={100}
                value={counterPrice}
                onChange={(e) => setCounterPrice(Number(e.target.value))}
                placeholder="Enter counter price"
                className="form-input-luxury w-full pl-8 text-black font-headline-md text-xl font-semibold"
              />
            </div>

            {/* Quick Adjustment Helpers */}
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                type="button"
                onClick={() => setCounterPrice(Math.round((offer.watch.price + offer.offerAmount) / 2))}
                className="text-[10px] font-label-caps px-2.5 py-1 bg-white border border-[#c4c7c7] hover:border-black text-[#444748] cursor-pointer"
              >
                Split Difference (${Math.round((offer.watch.price + offer.offerAmount) / 2).toLocaleString()})
              </button>
              <button
                type="button"
                onClick={() => setCounterPrice(Math.round(offer.watch.price * 0.95))}
                className="text-[10px] font-label-caps px-2.5 py-1 bg-white border border-[#c4c7c7] hover:border-black text-[#444748] cursor-pointer"
              >
                -5% Off Asking (${Math.round(offer.watch.price * 0.95).toLocaleString()})
              </button>
              <button
                type="button"
                onClick={() => setCounterPrice(offer.watch.price)}
                className="text-[10px] font-label-caps px-2.5 py-1 bg-white border border-[#c4c7c7] hover:border-black text-[#444748] cursor-pointer"
              >
                Full Asking (${offer.watch.price.toLocaleString()})
              </button>
            </div>
          </div>

          {/* With / Without Comments Selection Checkbox */}
          <div className="pt-2 border-t border-[#eeeee9]">
            <label
              htmlFor="chk-with-comments"
              className="flex items-center gap-2.5 cursor-pointer select-none mb-2"
            >
              <input
                type="checkbox"
                id="chk-with-comments"
                checked={withComments}
                onChange={(e) => setWithComments(e.target.checked)}
                className="w-4 h-4 accent-[#735c00] cursor-pointer rounded-none"
              />
              <span className="font-label-caps text-xs text-black font-semibold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#735c00]" />
                Include comments / message with counter offer
              </span>
            </label>

            {withComments ? (
              <div className="mt-2 space-y-1 animate-in fade-in duration-150">
                <div className="flex justify-between items-center text-[10px] text-[#747878] font-label-caps">
                  <span>Seller Comments (Optional)</span>
                  <span>Visible to buyer</span>
                </div>
                <textarea
                  id="textarea-counter-comments"
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="e.g. I can meet you at this price if payment is wired within 24 hours. Includes overnight insured FedEx."
                  className="form-input-luxury w-full text-xs text-black"
                />
              </div>
            ) : (
              <p className="text-[11px] text-[#747878] italic">
                Counter offer will be submitted as a direct numerical price revision without additional written comments.
              </p>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-700 bg-red-50 p-2 border border-red-200">
              {error}
            </p>
          )}

          {/* Security / Protocol Note */}
          <div className="p-3 bg-[#f4f3ec] border border-[#c4c7c7] text-[11px] text-[#444748] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#735c00] shrink-0 mt-0.5" />
            <span>
              Once submitted, the buyer will be presented with your counter offer of <strong>${counterPrice.toLocaleString()} USD</strong>. If accepted, mutual outside settlement details will be finalized.
            </span>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 border-t border-[#c4c7c7] flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 border border-[#c4c7c7] text-black font-label-caps text-xs hover:bg-[#e4e3dc] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="btn-submit-counter-offer"
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-black text-white font-label-caps text-xs flex items-center justify-center gap-2 hover:bg-[#2f312e] transition-colors cursor-pointer font-bold"
            >
              Submit Counter Offer
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
