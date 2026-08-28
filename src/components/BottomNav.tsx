import React from 'react';
import { Compass, Search, Tag, ShieldCheck } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2.5 bg-[#fafaf5] border-t border-[#c4c7c7] shadow-sm">
      {/* Tab 1: Discover */}
      <button
        id="bottom-tab-discover"
        onClick={() => setActiveTab('discover')}
        className={`flex flex-col items-center justify-center transition-all duration-300 w-16 py-1 cursor-pointer ${
          activeTab === 'discover'
            ? 'text-black scale-105 font-bold'
            : 'text-[#444748] hover:text-[#735c00]'
        }`}
      >
        <Compass className={`w-5 h-5 mb-1 ${activeTab === 'discover' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="font-label-caps text-[10px] leading-none text-center tracking-widest">
          Discover
        </span>
      </button>

      {/* Tab 2: Search */}
      <button
        id="bottom-tab-search"
        onClick={() => setActiveTab('search')}
        className={`flex flex-col items-center justify-center transition-all duration-300 w-16 py-1 cursor-pointer ${
          activeTab === 'search'
            ? 'text-black scale-105 font-bold'
            : 'text-[#444748] hover:text-[#735c00]'
        }`}
      >
        <Search className={`w-5 h-5 mb-1 ${activeTab === 'search' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="font-label-caps text-[10px] leading-none text-center tracking-widest">
          Search
        </span>
      </button>

      {/* Tab 3: Sell */}
      <button
        id="bottom-tab-sell"
        onClick={() => setActiveTab('sell')}
        className={`flex flex-col items-center justify-center transition-all duration-300 w-16 py-1 cursor-pointer ${
          activeTab === 'sell'
            ? 'text-[#735c00] scale-105 font-bold'
            : 'text-[#444748] hover:text-[#735c00]'
        }`}
      >
        <Tag className={`w-5 h-5 mb-1 ${activeTab === 'sell' ? 'fill-[#735c00] stroke-[2]' : 'stroke-[1.75]'}`} />
        <span className="font-label-caps text-[10px] leading-none text-center tracking-widest">
          Sell
        </span>
      </button>

      {/* Tab 4: Vault */}
      <button
        id="bottom-tab-vault"
        onClick={() => setActiveTab('vault')}
        className={`flex flex-col items-center justify-center transition-all duration-300 w-16 py-1 cursor-pointer ${
          activeTab === 'vault'
            ? 'text-black scale-105 font-bold'
            : 'text-[#444748] hover:text-[#735c00]'
        }`}
      >
        <ShieldCheck className={`w-5 h-5 mb-1 ${activeTab === 'vault' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="font-label-caps text-[10px] leading-none text-center tracking-widest">
          Vault
        </span>
      </button>
    </nav>
  );
};
