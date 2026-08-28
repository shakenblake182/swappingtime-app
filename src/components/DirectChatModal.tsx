import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ShieldCheck, User, CheckCheck, Clock, Phone, Mail, Building2, Banknote } from 'lucide-react';
import { Watch, DirectMessage } from '../types';

interface DirectChatModalProps {
  watch: Watch;
  onClose: () => void;
}

export const DirectChatModal: React.FC<DirectChatModalProps> = ({
  watch,
  onClose,
}) => {
  const [messages, setMessages] = useState<DirectMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'seller',
      text: `Hello! I am the verified seller of this ${watch.brand} ${watch.model} (${watch.reference}). Feel free to ask any questions regarding condition, service records, or arrange an outside settlement method like Bank Wire or Escrow.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sellerName = watch.sellerName || `${watch.brand} Vault Consignor`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Generate intelligent simulated seller reply after 1.2 seconds
    setIsTyping(true);
    setTimeout(() => {
      let replyText = `Thank you for reaching out regarding the ${watch.model}. `;
      const lower = userText.toLowerCase();

      if (lower.includes('price') || lower.includes('offer') || lower.includes('discount') || lower.includes('$')) {
        replyText += `I am open to reasonable discussions around the listed $${watch.price.toLocaleString()} price. You can also submit a formal price offer on the listing, or we can settle via direct bank wire for a complimentary expedited shipment.`;
      } else if (lower.includes('payment') || lower.includes('wire') || lower.includes('escrow') || lower.includes('cash')) {
        replyText += `For outside payment, I readily accept Fedwire/SWIFT bank wire, Escrow.com (with shared fees), or cash/banker's check in person at a verified bank or vault branch.`;
      } else if (lower.includes('condition') || lower.includes('box') || lower.includes('papers') || lower.includes('service')) {
        replyText += `The timepiece comes with ${watch.boxAndPapers}. Condition rating is certified as "${watch.condition}". The movement is keeping chronometer spec (+2 sec/day).`;
      } else {
        replyText += `I have noted your inquiry. Let me know if you would like high-resolution macro photos of the serials or would like to coordinate wire/escrow settlement instructions!`;
      }

      const sellerMsg: DirectMessage = {
        id: `msg-rep-${Date.now()}`,
        sender: 'seller',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, sellerMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#fafaf5] border border-black shadow-2xl flex flex-col h-[85vh] max-h-[720px]">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b border-[#c4c7c7] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={watch.imageUrl}
              alt={watch.model}
              className="w-11 h-11 object-cover border border-[#c4c7c7] shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-sm sm:text-base text-black font-semibold truncate">
                  {sellerName}
                </h3>
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-label-caps px-2 py-0.5 rounded shrink-0">
                  Verified Seller
                </span>
              </div>
              <p className="text-xs text-[#747878] truncate">
                Listing: {watch.brand} {watch.model} • ${watch.price.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            id="btn-close-chat-modal"
            type="button"
            onClick={onClose}
            className="p-2 text-[#444748] hover:text-black hover:bg-[#e4e3dc] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="bg-[#f4f3ec] px-4 py-2 border-b border-[#c4c7c7] flex items-center justify-between text-[11px] text-[#444748]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#735c00]" />
            <span>Direct on-site negotiation channel. Arrange wire, escrow, or handover safely.</span>
          </div>
          <span className="font-label-caps text-[#735c00] font-semibold hidden sm:inline">Encrypted Chat</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fafaf5]">
          {messages.map((msg) => {
            const isBuyer = msg.sender === 'buyer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] font-label-caps text-[#747878] mb-1 px-1">
                  {isBuyer ? 'You' : sellerName} • {msg.timestamp}
                </span>
                <div
                  className={`max-w-[85%] p-3.5 text-xs leading-relaxed ${
                    isBuyer
                      ? 'bg-black text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg'
                      : 'bg-white text-[#1a1c19] border border-[#c4c7c7] rounded-tl-lg rounded-tr-lg rounded-br-lg shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#747878] p-2 bg-white border border-[#e4e3dc] w-fit rounded">
              <div className="w-2 h-2 bg-[#735c00] rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-[#735c00] rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-[#735c00] rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px]">{sellerName} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Prompts */}
        <div className="p-2.5 bg-white border-t border-[#e4e3dc] flex gap-2 overflow-x-auto text-[11px] shrink-0">
          <button
            type="button"
            onClick={() => handleQuickPrompt("What outside payment method do you prefer (wire, escrow, or in-person)?")}
            className="px-2.5 py-1 bg-[#f4f3ec] hover:bg-[#e4e3dc] border border-[#c4c7c7] text-[#1a1c19] whitespace-nowrap cursor-pointer transition-colors"
          >
            💳 Inquire Payment Method
          </button>
          <button
            type="button"
            onClick={() => handleQuickPrompt("Would you accept a slight price adjustment for immediate bank wire payment?")}
            className="px-2.5 py-1 bg-[#f4f3ec] hover:bg-[#e4e3dc] border border-[#c4c7c7] text-[#1a1c19] whitespace-nowrap cursor-pointer transition-colors"
          >
            💰 Propose Wire Discount
          </button>
          <button
            type="button"
            onClick={() => handleQuickPrompt("Are the original box, guarantee card, and extra links fully included?")}
            className="px-2.5 py-1 bg-[#f4f3ec] hover:bg-[#e4e3dc] border border-[#c4c7c7] text-[#1a1c19] whitespace-nowrap cursor-pointer transition-colors"
          >
            📦 Verify Accessories
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#c4c7c7] flex gap-2">
          <input
            id="input-chat-message"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message, negotiate price, or arrange payment..."
            className="flex-1 form-input-luxury text-xs text-black"
          />
          <button
            id="btn-send-chat-msg"
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-2.5 bg-black text-white font-label-caps text-xs flex items-center gap-1.5 hover:bg-[#2f312e] transition-colors cursor-pointer disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
