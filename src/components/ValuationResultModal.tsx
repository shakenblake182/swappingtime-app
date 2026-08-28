import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { ConsignmentForm, ValuationResult } from '../types';

interface ValuationResultModalProps {
  form: ConsignmentForm;
  valuation: ValuationResult;
  onClose: () => void;
  onConfirmConsignment: () => void;
}

export const ValuationResultModal: React.FC<ValuationResultModalProps> = ({
  form,
  valuation,
  onClose,
  onConfirmConsignment,
}) => {
  const [authSelection, setAuthSelection] = useState<'guaranteed_authentic' | 'mod_unauthenticated'>('guaranteed_authentic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!authSelection) return;
    setIsSubmitting(true);
    setTimeout(() => {
      form.authenticityDeclaration = authSelection;
      if (authSelection === 'mod_unauthenticated') {
        form.condition = form.condition.includes('Mod') ? form.condition : `${form.condition} (Mod / Uncertified)`;
        form.isFlaggedFake = false;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        onConfirmConsignment();
      }, 1400);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fafaf5] border border-[#c4c7c7] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-[#735c00] p-2 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-[#fafaf5] border-2 border-[#735c00] rounded-full flex items-center justify-center mx-auto text-[#735c00]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-headline-lg text-3xl text-black">
              Consignment Initiated
            </h3>
            <p className="font-body-md text-[#444748] max-w-md mx-auto">
              Your timepiece <span className="font-semibold text-black">{form.brand} {form.model}</span> has been provisionally registered in your <span className="font-semibold text-black">Collector Vault</span>.
            </p>
            <p className="font-label-caps text-xs text-[#735c00]">
              Redirecting to Vault...
            </p>
          </div>
        ) : (
          <div className="p-6 md:p-10 space-y-8">
            <div>
              <span className="font-label-caps text-xs text-[#735c00] block mb-1">
                Step 2
              </span>
              <h3 className="font-headline-lg text-2xl md:text-3xl text-black">
                Watch Authenticity
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="font-body-md text-sm text-[#444748]">
                  {form.brand} • {form.model} ({form.year || 'Modern'}) — {form.condition}
                </p>
                {form.askingPrice && (
                  <span className="text-xs font-semibold text-black bg-[#eeeee9] px-2 py-0.5 border border-[#c4c7c7]">
                    ${form.askingPrice.toLocaleString()} ({form.priceType === 'firm' ? 'FIRM' : 'OBO'})
                  </span>
                )}
              </div>
            </div>

            {/* Authenticity declaration selection */}
            <div className="space-y-3 pt-2">
              <label className="font-label-caps text-xs text-black block mb-2">
                Authenticity &amp; Provenance Declaration
              </label>
              
              <div
                onClick={() => setAuthSelection('guaranteed_authentic')}
                className={`p-4 border cursor-pointer transition-colors flex items-start gap-3 bg-white ${
                  authSelection === 'guaranteed_authentic'
                    ? 'border-[#735c00] ring-1 ring-[#735c00] bg-[#fafaf5]'
                    : 'border-[#c4c7c7] hover:border-black'
                }`}
              >
                <input
                  id="auth-guaranteed"
                  type="radio"
                  name="authenticity"
                  value="guaranteed_authentic"
                  checked={authSelection === 'guaranteed_authentic'}
                  onChange={() => setAuthSelection('guaranteed_authentic')}
                  className="mt-0.5 accent-[#735c00] cursor-pointer"
                />
                <label htmlFor="auth-guaranteed" className="text-xs text-[#1a1c19] cursor-pointer select-none">
                  <strong className="block text-black font-semibold mb-0.5">I guarantee this is authentic and I will include authenticity paperwork</strong>
                  All components, movement, dial, and casing are original factory authentic. Accompanying warranty papers, warranty card, or provenance documentation will be provided.
                </label>
              </div>

              <div
                onClick={() => setAuthSelection('mod_unauthenticated')}
                className={`p-4 border cursor-pointer transition-colors flex items-start gap-3 bg-white ${
                  authSelection === 'mod_unauthenticated'
                    ? 'border-[#735c00] ring-1 ring-[#735c00] bg-[#fafaf5]'
                    : 'border-[#c4c7c7] hover:border-black'
                }`}
              >
                <input
                  id="auth-mod"
                  type="radio"
                  name="authenticity"
                  value="mod_unauthenticated"
                  checked={authSelection === 'mod_unauthenticated'}
                  onChange={() => setAuthSelection('mod_unauthenticated')}
                  className="mt-0.5 accent-[#735c00] cursor-pointer"
                />
                <label htmlFor="auth-mod" className="text-xs text-[#1a1c19] cursor-pointer select-none">
                  <strong className="block text-black font-semibold mb-0.5">This is a mod or hasn't been authenticated by an outside source</strong>
                  Contains aftermarket parts, custom modifications, or has not yet received external third-party authentication.
                </label>
              </div>

              {/* Google AI Authenticity Scanner Notification */}
              {authSelection === 'mod_unauthenticated' ? (
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-300 text-xs text-emerald-950 flex items-start gap-2.5 animate-in fade-in duration-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-label-caps text-[11px] font-bold text-emerald-900 block">
                      Google AI Authenticity Policy: Listing Cleared
                    </span>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Because you have transparently declared this timepiece as a mod or unauthenticated piece, <strong>Google AI will NOT flag this watch</strong>. The listing will proceed without counterfeit penalties or administrative review blocks.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#f6f6f1] border border-[#d8c87e] text-xs text-[#474016] flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#735c00] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-label-caps text-[10px] font-bold text-[#735c00] block">
                      Google AI Optical Inspection Protocol Active
                    </span>
                    <p className="text-[11px] text-[#55502a] leading-relaxed">
                      Uploaded photos and videos will undergo automated dial typography and movement verification for guaranteed authentic classification.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-[#c4c7c7]">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-[#c4c7c7] text-black font-label-caps text-xs hover:bg-[#eeeee9] transition-colors cursor-pointer"
              >
                Modify Details
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!authSelection || isSubmitting}
                className="px-8 py-3.5 bg-black text-white font-label-caps text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer hover:bg-[#2f312e]"
              >
                {isSubmitting ? 'Registering Consignment...' : 'Confirm & Consign Timepiece'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
