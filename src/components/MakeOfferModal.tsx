import React, { useState } from 'react';
import { X, DollarSign, CheckCircle2, ShieldCheck, Mail, Phone, MapPin, CreditCard, ArrowRight, User, AlertCircle } from 'lucide-react';
import { Watch, FormalOffer } from '../types';

interface MakeOfferModalProps {
  watch: Watch;
  onClose: () => void;
  onSubmitOffer: (offer: FormalOffer) => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  watch,
  onClose,
  onSubmitOffer,
}) => {
  const [offerAmount, setOfferAmount] = useState<number>(Math.round(watch.price * 0.95));
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [expiryHours, setExpiryHours] = useState<'24' | '48' | '72'>('48');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sellerAccepted, setSellerAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fallback seller contact details for verified seller
  const sellerInfo = {
    name: watch.sellerName || `${watch.brand} Certified Vault Consignor`,
    email: watch.sellerEmail || `consignment-desk.${watch.id}@swappingtime.vault`,
    phone: watch.sellerPhone || '+1 (212) 555-0188',
    location: watch.sellerLocation || 'Geneva / New York Vault Repository',
    preferredPayment: ['Bank Wire Transfer (SWIFT/Fedwire)', 'Verified Escrow.com', 'Private Vault Handover'],
  };

  const discountPercent = Math.round(((watch.price - offerAmount) / watch.price) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerEmail.trim() || !offerAmount) return;

    setIsProcessing(true);

    const newOffer: FormalOffer = {
      id: `offer-${Date.now()}`,
      watch,
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim(),
      buyerPhone: buyerPhone.trim() || undefined,
      offerAmount,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
      status: 'pending',
      sellerContactRevealed: false,
      sellerDetails: sellerInfo,
    };

    setTimeout(() => {
      setIsProcessing(false);
      setIsSubmitted(true);
      setSellerAccepted(true);
      onSubmitOffer(newOffer);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#fafaf5] border border-black shadow-2xl p-6 sm:p-8 my-8">
        {/* Close Button */}
        <button
          id="btn-close-offer-modal"
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#444748] hover:text-black hover:bg-[#e4e3dc] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted && sellerAccepted ? (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-[#c4c7c7]">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="font-label-caps text-xs text-emerald-800 font-bold tracking-widest block mb-1">
                Formal Offer Accepted
              </span>
              <h3 className="font-headline-lg text-2xl sm:text-3xl text-black">
                Seller Contact Information Revealed
              </h3>
              <p className="text-xs text-[#444748] mt-1 max-w-md mx-auto">
                The seller has agreed to your formal offer of <strong className="text-black font-bold">${offerAmount.toLocaleString()} USD</strong>. Connect directly to arrange your outside payment and handover.
              </p>
            </div>

            {/* Revealed Contact Details Card */}
            <div className="bg-white border-2 border-[#735c00] p-5 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#eeeee9] pb-2">
                <span className="font-label-caps text-xs text-[#735c00] font-bold">
                  Verified Seller Dossier
                </span>
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-label-caps px-2 py-0.5 rounded">
                  Identity Verified
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#735c00] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#747878] block">Seller Name / Entity</span>
                    <strong className="text-black font-semibold text-sm">{sellerInfo.name}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#735c00] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#747878] block">Direct Email</span>
                    <a href={`mailto:${sellerInfo.email}`} className="text-black font-semibold hover:underline">
                      {sellerInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#735c00] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#747878] block">Direct Phone / Signal / WhatsApp</span>
                    <a href={`tel:${sellerInfo.phone}`} className="text-black font-semibold hover:underline">
                      {sellerInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#735c00] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#747878] block">Vault Location</span>
                    <span className="text-black font-medium">{sellerInfo.location}</span>
                  </div>
                </div>
              </div>

              {/* Outside Settlement Recommendations */}
              <div className="mt-3 pt-3 border-t border-[#eeeee9]">
                <span className="text-[11px] font-label-caps text-[#444748] block mb-1 font-bold flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-[#735c00]" />
                  Seller's Accepted Outside Payment Methods:
                </span>
                <ul className="text-xs text-[#1a1c19] space-y-1 list-disc list-inside">
                  {sellerInfo.preferredPayment.map((method, idx) => (
                    <li key={idx}>{method}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 bg-[#f4f3ec] border border-[#c4c7c7] text-[11px] text-[#444748] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#735c00] shrink-0 mt-0.5" />
              <span>
                A copy of these contact credentials has been logged to your Inquiries drawer. Please contact the seller directly to coordinate your wire transfer or escrow setup.
              </span>
            </div>

            <button
              id="btn-finish-offer-review"
              type="button"
              onClick={onClose}
              className="w-full py-3.5 bg-black text-white font-label-caps text-xs hover:bg-[#2f312e] transition-colors cursor-pointer"
            >
              Close &amp; Keep Contact Dossier
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6 border-b border-[#c4c7c7] pb-4">
              <span className="font-label-caps text-xs text-[#735c00] tracking-widest block mb-1">
                Formal Negotiation
              </span>
              <h2 className="font-headline-lg text-2xl text-black">
                Make an Offer
              </h2>
              <div className="flex items-center justify-between mt-3 p-3 bg-white border border-[#e4e3dc]">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={watch.imageUrl}
                    alt={watch.model}
                    className="w-12 h-12 object-cover border border-[#c4c7c7]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="font-label-caps text-[10px] text-[#747878]">{watch.brand}</p>
                    <p className="font-headline-sm text-sm text-black font-semibold truncate">{watch.model}</p>
                    <p className="text-xs text-[#444748]">{watch.reference}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-label-caps text-[#747878] block">Asking Price</span>
                  <span className="font-headline-md text-base text-black font-semibold">
                    ${watch.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Offer Amount Input */}
              <div>
                <label className="font-label-caps text-xs text-black font-bold block mb-1 flex items-center justify-between">
                  <span>Your Proposed Price ($ USD) *</span>
                  {discountPercent > 0 && (
                    <span className="text-[11px] font-normal text-[#735c00]">
                      {discountPercent}% below asking
                    </span>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black font-headline-md text-lg">
                    $
                  </span>
                  <input
                    id="input-offer-amount"
                    type="number"
                    required
                    min={100}
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(Number(e.target.value))}
                    className="form-input-luxury w-full pl-8 text-black font-headline-md text-lg"
                  />
                </div>

                {/* Quick Offer Presets */}
                <div className="flex gap-2 mt-2">
                  {[
                    { label: '-5%', val: Math.round(watch.price * 0.95) },
                    { label: '-10%', val: Math.round(watch.price * 0.90) },
                    { label: '-15%', val: Math.round(watch.price * 0.85) },
                    { label: 'Full Asking', val: watch.price },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setOfferAmount(preset.val)}
                      className={`text-[11px] font-label-caps py-1 px-2.5 border transition-colors cursor-pointer ${
                        offerAmount === preset.val
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-[#444748] border-[#c4c7c7] hover:border-black'
                      }`}
                    >
                      {preset.label} (${preset.val.toLocaleString()})
                    </button>
                  ))}
                </div>
              </div>

              {/* Buyer Contact details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    id="offer-buyer-name"
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="form-input-luxury w-full text-xs text-black"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                    Your Email Address *
                  </label>
                  <input
                    id="offer-buyer-email"
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="marcus@domain.com"
                    className="form-input-luxury w-full text-xs text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                    Phone / Signal (Optional)
                  </label>
                  <input
                    id="offer-buyer-phone"
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678 (Optional)"
                    className="form-input-luxury w-full text-xs text-black"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                    Offer Expiration Window
                  </label>
                  <select
                    value={expiryHours}
                    onChange={(e) => setExpiryHours(e.target.value as any)}
                    className="form-input-luxury w-full text-xs text-black cursor-pointer"
                  >
                    <option value="24">24 Hours</option>
                    <option value="48">48 Hours (Standard)</option>
                    <option value="72">72 Hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-label-caps text-[11px] text-[#444748] block mb-1">
                  Optional Note to Seller
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Ready for wire transfer immediate clearance once accepted..."
                  className="form-input-luxury w-full text-xs text-black"
                />
              </div>

              <div className="bg-[#f4f3ec] p-3 border border-[#c4c7c7] text-[11px] text-[#444748] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#735c00] shrink-0 mt-0.5" />
                <span>
                  Once accepted, our system immediately reveals the seller's direct phone number, email, and outside payment credentials (wire / escrow / handover) so you can finalize independently.
                </span>
              </div>

              <div className="pt-3 border-t border-[#c4c7c7] flex flex-col sm:flex-row justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 border border-[#c4c7c7] text-black font-label-caps text-xs hover:bg-[#e4e3dc] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  id="btn-submit-formal-offer"
                  type="submit"
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-8 py-3.5 bg-black text-white font-label-caps text-xs flex items-center justify-center gap-2 hover:bg-[#2f312e] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'Submitting to Seller...' : 'Submit Formal Offer'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
