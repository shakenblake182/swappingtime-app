import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle2, MessageSquare, Phone, Mail, User, DollarSign } from 'lucide-react';
import { Watch, WatchInquiry } from '../types';

interface ContactSellerModalProps {
  watch: Watch;
  onClose: () => void;
  onSubmitInquiry: (inquiry: WatchInquiry) => void;
  onOpenChat: (watch: Watch) => void;
}

export const ContactSellerModal: React.FC<ContactSellerModalProps> = ({
  watch,
  onClose,
  onSubmitInquiry,
  onOpenChat,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [offer, setOffer] = useState<string>('');
  const [message, setMessage] = useState(
    `Hello, I am interested in purchasing your ${watch.brand} ${watch.model} (${watch.reference}). Is this timepiece currently available for inspection and what outside payment method (wire/escrow) do you prefer?`
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    const newInquiry: WatchInquiry = {
      id: `inq-${Date.now()}`,
      watch,
      buyerName: name.trim(),
      buyerEmail: email.trim(),
      buyerPhone: phone.trim() || undefined,
      offerAmount: offer ? Number(offer) : undefined,
      initialMessage: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'active',
      messages: [
        {
          id: `msg-1-${Date.now()}`,
          sender: 'buyer',
          text: message.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    onSubmitInquiry(newInquiry);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#fafaf5] border border-black shadow-2xl p-6 sm:p-8 my-8">
        {/* Close Button */}
        <button
          id="btn-close-contact-modal"
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#444748] hover:text-black hover:bg-[#e4e3dc] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-5">
            <div className="w-14 h-14 bg-[#735c00]/10 text-[#735c00] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="font-label-caps text-xs text-[#735c00] tracking-widest block mb-1">
                Inquiry Transmitted
              </span>
              <h3 className="font-headline-lg text-2xl text-black">
                Message Sent to Verified Seller
              </h3>
              <p className="text-xs text-[#444748] max-w-md mx-auto mt-2 leading-relaxed">
                Your message regarding the <strong className="text-black">{watch.brand} {watch.model}</strong> has been delivered directly to the seller's secure inbox and on-site communication portal.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#c4c7c7] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#747878]">Seller Reference:</span>
                <span className="font-medium text-black">{watch.sellerName || 'Verified Vault Consignor'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#747878]">Timepiece:</span>
                <span className="font-medium text-black">{watch.brand} {watch.model}</span>
              </div>
              {offer && (
                <div className="flex justify-between">
                  <span className="text-[#747878]">Proposed Offer:</span>
                  <span className="font-bold text-black">${Number(offer).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="btn-open-chat-now"
                type="button"
                onClick={() => {
                  onClose();
                  onOpenChat(watch);
                }}
                className="flex-1 py-3.5 bg-black text-white font-label-caps text-xs flex items-center justify-center gap-2 hover:bg-[#2f312e] transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Open Live On-Site Chat
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3.5 border border-[#c4c7c7] text-black font-label-caps text-xs hover:bg-[#e4e3dc] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6 border-b border-[#c4c7c7] pb-4">
              <span className="font-label-caps text-xs text-[#735c00] tracking-widest block mb-1">
                Direct Seller Contact Form
              </span>
              <h2 className="font-headline-lg text-2xl text-black">
                Contact Timepiece Seller
              </h2>
              <div className="flex items-center gap-3 mt-3 p-3 bg-white border border-[#e4e3dc]">
                <img
                  src={watch.imageUrl}
                  alt={watch.model}
                  className="w-12 h-12 object-cover border border-[#c4c7c7]"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <p className="font-label-caps text-[10px] text-[#747878]">{watch.brand}</p>
                  <p className="font-headline-sm text-sm text-black font-semibold truncate">{watch.model}</p>
                  <p className="text-xs text-[#444748]">${watch.price.toLocaleString()} • {watch.reference}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-[11px] text-[#444748] block mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-[#735c00]" /> Your Full Name *
                  </label>
                  <input
                    id="contact-buyer-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jonathan Sterling"
                    className="form-input-luxury w-full text-xs text-black"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-[11px] text-[#444748] block mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#735c00]" /> Email Address *
                  </label>
                  <input
                    id="contact-buyer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jonathan@domain.com"
                    className="form-input-luxury w-full text-xs text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-[11px] text-[#444748] block mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#735c00]" /> Phone Number (Optional)
                  </label>
                  <input
                    id="contact-buyer-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="form-input-luxury w-full text-xs text-black"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-[11px] text-[#444748] block mb-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-[#735c00]" /> Proposed Offer (Optional)
                  </label>
                  <input
                    id="contact-buyer-offer"
                    type="number"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    placeholder={`Asking: $${watch.price.toLocaleString()}`}
                    className="form-input-luxury w-full text-xs text-black"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-caps text-[11px] text-[#444748] block mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-[#735c00]" /> Message / Questions for Seller *
                </label>
                <textarea
                  id="contact-buyer-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Inquire about condition, service history, box accessories, or outside payment arrangements..."
                  className="form-input-luxury w-full text-xs text-black"
                />
              </div>

              <div className="bg-[#f4f3ec] p-3 border border-[#c4c7c7] text-[11px] text-[#444748] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#735c00] shrink-0 mt-0.5" />
                <span>
                  This platform facilitates direct communication and negotiations. Both parties coordinate their preferred outside settlement (e.g. Escrow, Bank Wire, or Cash in Person) independently.
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
                  id="btn-submit-contact-seller"
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-black text-white font-label-caps text-xs flex items-center justify-center gap-2 hover:bg-[#2f312e] transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Message to Seller
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
