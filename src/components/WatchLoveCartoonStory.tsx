import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Play, Pause, ChevronLeft, ChevronRight, CheckCircle2, ShoppingBag, Eye, Gift, Smile } from 'lucide-react';

interface CartoonScene {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  caption: string;
  reaction: string;
}

const SCENES: CartoonScene[] = [
  {
    id: 1,
    title: 'The Love-at-First-Sight Match',
    subtitle: 'Browsing Swapping Time & Spotting The Holy Grail',
    badge: 'SCENE 1 OF 5 • THE DISCOVERY',
    caption: 'Heart races! Eyes turn into giant cartoon hearts as the dream luxury timepiece appears on screen.',
    reaction: '😍 "THAT IS THE ONE! Making an offer RIGHT NOW!"',
  },
  {
    id: 2,
    title: 'Deal Sealed With a Smile',
    subtitle: 'Direct Peer-to-Peer Agreement & Celebration',
    badge: 'SCENE 2 OF 5 • THE DEAL',
    caption: 'Direct chat with the seller, terms agreed with zero fees, celebratory handshake with confetti popping everywhere!',
    reaction: '🤝 "Offer accepted! Fast insured shipment on its way!"',
  },
  {
    id: 3,
    title: 'The Golden Box Unboxing',
    subtitle: 'Opening The Luxury Presentation Package',
    badge: 'SCENE 3 OF 5 • THE UNBOXING',
    caption: 'Untying the ribbon and lifting the luxury lid — a heavenly golden glow radiates across a beaming happy face!',
    reaction: '🎁 "The packaging! The weight! It’s in pristine condition!"',
  },
  {
    id: 4,
    title: 'The Sacred First Wrist-Check',
    subtitle: 'Strapping On The Piece & Watching The Seconds Sweep',
    badge: 'SCENE 4 OF 5 • THE FIRST WEAR',
    caption: 'Clicking the deployant clasp into place, rotating the wrist, and marveling at the diamond-like sparkle on the crystal.',
    reaction: '✨ "Fits like a glove! Just look at that smooth sweeping second hand!"',
  },
  {
    id: 5,
    title: 'Living The Dream & Strutting in Love',
    subtitle: 'Pure Horological Bliss Everywhere You Go',
    badge: 'SCENE 5 OF 5 • PURE WATCH LOVE',
    caption: 'Strutting down the street with cool shades, flashing the wrist with pride, surrounded by floating hearts and compliments!',
    reaction: '❤️‍🔥 "Best purchase ever! Never taking this watch off my wrist!"',
  },
];

export const WatchLoveCartoonStory: React.FC = () => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const SCENE_DURATION_MS = 20000;
  const UPDATE_INTERVAL_MS = 50;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSceneIndex((idx) => (idx + 1) % SCENES.length);
          return 0;
        }
        return prev + (UPDATE_INTERVAL_MS / SCENE_DURATION_MS) * 100;
      });
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isPlaying, currentSceneIndex]);

  const handleSelectScene = (index: number) => {
    setCurrentSceneIndex(index);
    setProgress(0);
  };

  const handleNext = () => {
    setCurrentSceneIndex((prev) => (prev + 1) % SCENES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentSceneIndex((prev) => (prev - 1 + SCENES.length) % SCENES.length);
    setProgress(0);
  };

  const currentScene = SCENES[currentSceneIndex];

  return (
    <section className="mb-20 md:mb-28 px-4 md:px-16 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-[#c4c7c7] pb-4 gap-4">
        <div>
          <span className="font-label-caps text-[11px] text-[#735c00] flex items-center gap-1.5 font-bold mb-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            Collector's Journey • Animated Cartoon Story
          </span>
          <h2 className="font-headline-lg text-2xl md:text-4xl text-black">
            The Joy of Getting Your Dream Watch
          </h2>
        </div>
        
        {/* Play / Pause & Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-label-caps bg-white border border-[#c4c7c7] hover:border-black text-black transition-colors cursor-pointer"
            title={isPlaying ? 'Pause auto-cycle' : 'Play auto-cycle'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#735c00]" /> Pause Story
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" /> Auto-Cycle
              </>
            )}
          </button>
          <div className="flex items-center border border-[#c4c7c7] bg-white">
            <button
              onClick={handlePrev}
              className="p-1.5 hover:bg-[#e4e3dc] transition-colors cursor-pointer border-r border-[#c4c7c7]"
              title="Previous Cartoon Gif"
            >
              <ChevronLeft className="w-4 h-4 text-black" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-[#e4e3dc] transition-colors cursor-pointer"
              title="Next Cartoon Gif"
            >
              <ChevronRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Cartoon Stage Card */}
      <div className="bg-[#f5f4ed] border-2 border-black shadow-lg overflow-hidden relative">
        {/* Progress Bar along the top */}
        <div className="w-full bg-[#d8c87e]/40 h-1.5 relative overflow-hidden">
          <div
            className="bg-[#735c00] h-full transition-all ease-linear"
            style={{ width: `${progress}%`, transitionDuration: `${UPDATE_INTERVAL_MS}ms` }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Cartoon Visual Canvas Area (7 Cols on desktop) */}
          <div className="lg:col-span-7 bg-[#fffdf0] p-6 sm:p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-black relative min-h-[380px] sm:min-h-[440px] overflow-hidden">
            
            {/* Background comic dots & radial aura */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#735c00_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* SCENE 1: Finding & Falling in love with watch online */}
            {currentSceneIndex === 0 && (
              <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center animate-in zoom-in-95 duration-500">
                <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md">
                  {/* Comic Sunburst Background */}
                  <g opacity="0.25">
                    <circle cx="200" cy="200" r="180" fill="#fef08a" />
                    <polygon points="200,200 120,20 160,10" fill="#facc15" />
                    <polygon points="200,200 240,10 280,20" fill="#facc15" />
                    <polygon points="200,200 380,120 390,160" fill="#facc15" />
                    <polygon points="200,200 390,240 380,280" fill="#facc15" />
                    <polygon points="200,200 280,380 240,390" fill="#facc15" />
                    <polygon points="200,200 160,390 120,380" fill="#facc15" />
                    <polygon points="200,200 20,280 10,240" fill="#facc15" />
                    <polygon points="200,200 10,160 20,120" fill="#facc15" />
                  </g>

                  {/* Desk with laptop */}
                  <rect x="60" y="270" width="280" height="24" rx="4" fill="#854d0e" stroke="#1e293b" strokeWidth="4" />
                  <polygon points="120,270 280,270 260,310 140,310" fill="#a16207" stroke="#1e293b" strokeWidth="4" />
                  
                  {/* Laptop base & Screen */}
                  <rect x="130" y="248" width="140" height="20" rx="3" fill="#cbd5e1" stroke="#1e293b" strokeWidth="3" />
                  <rect x="140" y="160" width="120" height="90" rx="6" fill="#1e293b" stroke="#1e293b" strokeWidth="4" />
                  <rect x="146" y="166" width="108" height="78" rx="3" fill="#0f172a" />
                  
                  {/* Screen Content: Swapping Time watch listing */}
                  <rect x="152" y="172" width="96" height="66" fill="#fefce8" rx="2" />
                  <circle cx="200" cy="198" r="18" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
                  <circle cx="200" cy="198" r="14" fill="#ffffff" />
                  <line x1="200" y1="198" x2="200" y2="188" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
                  <line x1="200" y1="198" x2="208" y2="198" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
                  <rect x="160" y="222" width="80" height="10" rx="2" fill="#16a34a" />
                  <text x="200" y="229" fontSize="6" fontWeight="bold" fill="#ffffff" textAnchor="middle">MAKE OFFER</text>

                  {/* Cartoon Character: ecstatic buyer */}
                  <g className="animate-bounce" style={{ animationDuration: '2s' }}>
                    {/* Character Body / Hoodie */}
                    <path d="M 130 270 Q 130 200 200 200 Q 270 200 270 270 Z" fill="#2563eb" stroke="#1e293b" strokeWidth="4" />
                    
                    {/* Head */}
                    <circle cx="200" cy="130" r="54" fill="#fed7aa" stroke="#1e293b" strokeWidth="4" />
                    
                    {/* Hair */}
                    <path d="M 150 120 Q 200 65 250 120 Q 240 85 200 80 Q 160 85 150 120 Z" fill="#451a03" stroke="#1e293b" strokeWidth="4" />
                    
                    {/* Giant Heart Eyes (Animated Pulse) */}
                    <g fill="#e11d48">
                      <path d="M 175 125 C 175 118 167 114 163 118 C 159 114 151 118 151 125 C 151 134 163 142 163 142 C 163 142 175 134 175 125 Z" stroke="#881337" strokeWidth="2" />
                      <path d="M 249 125 C 249 118 241 114 237 118 C 233 114 225 118 225 125 C 225 134 237 142 237 142 C 237 142 249 134 249 125 Z" stroke="#881337" strokeWidth="2" />
                    </g>

                    {/* Big Cartoon Smile with Rosy Cheeks */}
                    <circle cx="156" cy="146" r="8" fill="#fda4af" opacity="0.8" />
                    <circle cx="244" cy="146" r="8" fill="#fda4af" opacity="0.8" />
                    <path d="M 180 148 Q 200 172 220 148" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
                  </g>

                  {/* Floating Love Hearts and Sparkles */}
                  <g>
                    <path d="M 100 90 C 100 80 90 75 85 80 C 80 75 70 80 70 90 C 70 102 85 112 85 112 C 85 112 100 102 100 90 Z" fill="#ec4899" stroke="#9d174d" strokeWidth="2" />
                    <path d="M 320 80 C 320 70 310 65 305 70 C 300 65 290 70 290 80 C 290 92 305 102 305 102 C 305 102 320 92 320 80 Z" fill="#f43f5e" stroke="#9f1239" strokeWidth="2" />
                    
                    {/* Golden Star Sparkles */}
                    <polygon points="120,60 123,68 131,71 123,74 120,82 117,74 109,71 117,68" fill="#eab308" />
                    <polygon points="290,130 292,136 298,138 292,140 290,146 288,140 282,138 288,136" fill="#eab308" />
                  </g>
                </svg>
              </div>
            )}

            {/* SCENE 2: Handshake Deal Made */}
            {currentSceneIndex === 1 && (
              <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center animate-in zoom-in-95 duration-500">
                <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md">
                  {/* Confetti Explosion */}
                  <g>
                    <rect x="50" y="60" width="12" height="6" rx="2" fill="#3b82f6" transform="rotate(25 50 60)" />
                    <rect x="330" y="80" width="10" height="6" rx="2" fill="#ef4444" transform="rotate(-35 330 80)" />
                    <rect x="180" y="40" width="14" height="6" rx="2" fill="#eab308" transform="rotate(15 180 40)" />
                    <rect x="80" y="140" width="10" height="5" rx="2" fill="#10b981" transform="rotate(45 80 140)" />
                    <rect x="310" y="160" width="12" height="6" rx="2" fill="#8b5cf6" transform="rotate(-20 310 160)" />
                    <circle cx="120" cy="80" r="5" fill="#f43f5e" />
                    <circle cx="270" cy="60" r="5" fill="#06b6d4" />
                    <circle cx="340" cy="120" r="4" fill="#eab308" />
                  </g>

                  {/* Cartoon Buyer (Left) */}
                  <g>
                    <path d="M 60 300 Q 70 200 130 200 Q 150 200 160 250 L 110 300 Z" fill="#2563eb" stroke="#1e293b" strokeWidth="4" />
                    <circle cx="105" cy="140" r="44" fill="#fed7aa" stroke="#1e293b" strokeWidth="4" />
                    {/* Winking happy eye */}
                    <path d="M 85 140 Q 95 130 105 140" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
                    {/* Big Star Eye */}
                    <polygon points="125,130 128,137 135,139 129,143 131,150 125,145 119,150 121,143 115,139 122,137" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                    {/* Huge Smile */}
                    <path d="M 90 158 Q 110 178 130 158" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
                  </g>

                  {/* Cartoon Seller (Right) */}
                  <g>
                    <path d="M 340 300 Q 330 200 270 200 Q 250 200 240 250 L 290 300 Z" fill="#059669" stroke="#1e293b" strokeWidth="4" />
                    <circle cx="295" cy="140" r="44" fill="#ffedd5" stroke="#1e293b" strokeWidth="4" />
                    {/* Happy Curved Eyes */}
                    <path d="M 275 140 Q 285 130 295 140" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M 305 140 Q 315 130 325 140" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
                    {/* Big Smile */}
                    <path d="M 285 158 Q 300 178 315 158" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
                  </g>

                  {/* Golden Handshake Clasp in Center */}
                  <g className="animate-pulse">
                    <circle cx="200" cy="240" r="45" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
                    {/* Handshake Arms */}
                    <path d="M 130 250 L 180 240 L 205 248 L 195 260 L 150 270 Z" fill="#fed7aa" stroke="#1e293b" strokeWidth="4" />
                    <path d="M 270 250 L 220 240 L 195 248 L 205 260 L 250 270 Z" fill="#ffedd5" stroke="#1e293b" strokeWidth="4" />
                    {/* Thumbs Up Symbol */}
                    <circle cx="200" cy="195" r="16" fill="#16a34a" stroke="#1e293b" strokeWidth="2" />
                    <path d="M 194 195 L 198 200 L 206 190" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </g>

                  {/* Floating Golden Coin / Stars */}
                  <circle cx="200" cy="100" r="22" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
                  <text x="200" y="108" fontSize="20" fontWeight="bold" fill="#78350f" textAnchor="middle">✓</text>
                </svg>
              </div>
            )}

            {/* SCENE 3: Unboxing Luxury Box with Light Rays */}
            {currentSceneIndex === 2 && (
              <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center animate-in zoom-in-95 duration-500">
                <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md">
                  {/* Glowing Light Beams radiating upwards */}
                  <g opacity="0.45">
                    <polygon points="200,240 100,20 140,10" fill="#fde047" />
                    <polygon points="200,240 170,10 210,5" fill="#fde047" />
                    <polygon points="200,240 240,5 280,15" fill="#fde047" />
                    <polygon points="200,240 310,25 350,50" fill="#fde047" />
                    <polygon points="200,240 50,50 90,25" fill="#fde047" />
                  </g>

                  {/* Character behind the box, glowing face in awe */}
                  <g>
                    <path d="M 120 320 Q 120 180 200 180 Q 280 180 280 320 Z" fill="#4338ca" stroke="#1e293b" strokeWidth="4" />
                    <circle cx="200" cy="115" r="50" fill="#fed7aa" stroke="#1e293b" strokeWidth="4" />
                    {/* Glistening Eyes wide open in pure awe */}
                    <circle cx="180" cy="115" r="14" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                    <circle cx="184" cy="110" r="5" fill="#ffffff" />
                    <circle cx="176" cy="120" r="2.5" fill="#ffffff" />

                    <circle cx="220" cy="115" r="14" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                    <circle cx="224" cy="110" r="5" fill="#ffffff" />
                    <circle cx="216" cy="120" r="2.5" fill="#ffffff" />

                    {/* Gasped Open Mouth of Joy */}
                    <ellipse cx="200" cy="142" rx="12" ry="15" fill="#e11d48" stroke="#1e293b" strokeWidth="3" />
                    <ellipse cx="200" cy="148" rx="8" ry="6" fill="#f43f5e" />

                    {/* Raised hands in excitement */}
                    <circle cx="120" cy="180" r="18" fill="#fed7aa" stroke="#1e293b" strokeWidth="3" />
                    <circle cx="280" cy="180" r="18" fill="#fed7aa" stroke="#1e293b" strokeWidth="3" />
                  </g>

                  {/* Luxury Green/Gold Presentation Watch Box */}
                  <g>
                    {/* Box Base */}
                    <polygon points="120,250 280,250 260,330 140,330" fill="#064e3b" stroke="#022c22" strokeWidth="4" />
                    {/* Box Velvet Cushion inside */}
                    <polygon points="130,245 270,245 255,275 145,275" fill="#fefce8" stroke="#ca8a04" strokeWidth="2" />
                    {/* Open Box Lid tilted up */}
                    <polygon points="120,250 280,250 300,180 100,180" fill="#065f46" stroke="#022c22" strokeWidth="4" />
                    <rect x="180" y="195" width="40" height="15" rx="3" fill="#ca8a04" />
                    <text x="200" y="206" fontSize="7" fontWeight="bold" fill="#ffffff" textAnchor="middle">LUXURY</text>

                    {/* The Watch resting on the pillow radiating light */}
                    <circle cx="200" cy="255" r="20" fill="#eab308" stroke="#713f12" strokeWidth="3" />
                    <circle cx="200" cy="255" r="15" fill="#0284c7" />
                    <line x1="200" y1="255" x2="200" y2="245" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                    <line x1="200" y1="255" x2="208" y2="255" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  </g>

                  {/* Sparkles Floating Up */}
                  <polygon points="150,90 153,98 161,101 153,104 150,112 147,104 139,101 147,98" fill="#fde047" />
                  <polygon points="250,90 253,98 261,101 253,104 250,112 247,104 239,101 247,98" fill="#fde047" />
                  <polygon points="200,45 204,55 214,59 204,63 200,73 196,63 186,59 196,55" fill="#fde047" />
                </svg>
              </div>
            )}

            {/* SCENE 4: First Wrist-Check & Checking Sweep Hand */}
            {currentSceneIndex === 3 && (
              <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center animate-in zoom-in-95 duration-500">
                <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md">
                  {/* Comic Action Lines */}
                  <g stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" opacity="0.7">
                    <line x1="60" y1="60" x2="110" y2="100" />
                    <line x1="340" y1="60" x2="290" y2="100" />
                    <line x1="40" y1="200" x2="90" y2="200" />
                    <line x1="360" y1="200" x2="310" y2="200" />
                  </g>

                  {/* Character Head in background looking down at wrist */}
                  <g>
                    <circle cx="290" cy="110" r="48" fill="#fed7aa" stroke="#1e293b" strokeWidth="4" />
                    {/* Happy anime closed eye tears of joy */}
                    <path d="M 265 110 Q 275 95 285 110" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M 295 110 Q 305 95 315 110" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M 280 130 Q 295 145 310 130" stroke="#1e293b" strokeWidth="3" fill="#ffffff" />
                    {/* Rosy blush */}
                    <circle cx="265" cy="120" r="8" fill="#fda4af" opacity="0.8" />
                    <circle cx="320" cy="120" r="8" fill="#fda4af" opacity="0.8" />
                  </g>

                  {/* Giant Arm & Wrist in foreground */}
                  <g>
                    {/* Arm sleeve */}
                    <path d="M 30 350 L 110 240 L 170 290 L 90 390 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="4" />
                    {/* Wrist & Forearm */}
                    <path d="M 100 250 L 210 150 L 260 200 L 150 300 Z" fill="#fed7aa" stroke="#1e293b" strokeWidth="4" />
                    {/* Hand with thumbs up */}
                    <path d="M 230 130 Q 260 90 280 130 L 260 180 Z" fill="#fed7aa" stroke="#1e293b" strokeWidth="4" />
                  </g>

                  {/* Giant Shiny Luxury Watch on Wrist */}
                  <g className="animate-in fade-in">
                    {/* Oyster Bracelet / Strap */}
                    <polygon points="150,150 200,105 245,155 195,200" fill="#94a3b8" stroke="#475569" strokeWidth="4" />
                    
                    {/* Watch Case Bezel (Gold & Ceramic) */}
                    <circle cx="190" cy="180" r="58" fill="#eab308" stroke="#78350f" strokeWidth="5" />
                    <circle cx="190" cy="180" r="48" fill="#0f172a" stroke="#ca8a04" strokeWidth="3" />
                    
                    {/* Dial Indices */}
                    <circle cx="190" cy="142" r="4" fill="#ffffff" />
                    <circle cx="228" cy="180" r="4" fill="#ffffff" />
                    <circle cx="190" cy="218" r="4" fill="#ffffff" />
                    <circle cx="152" cy="180" r="4" fill="#ffffff" />

                    {/* Watch Hands */}
                    <line x1="190" y1="180" x2="190" y2="155" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                    <line x1="190" y1="180" x2="212" y2="180" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                    <line x1="190" y1="180" x2="175" y2="162" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="190" cy="180" r="4" fill="#ef4444" />

                    {/* Diamond Sparkle Glint on Bezel */}
                    <polygon points="230,135 234,148 247,152 234,156 230,169 226,156 213,152 226,148" fill="#38bdf8" />
                    <polygon points="145,210 148,220 158,223 148,226 145,236 142,226 132,223 142,220" fill="#38bdf8" />
                  </g>

                  {/* Sound Effect Comic Text: "TICK TICK SWEEP!" */}
                  <g>
                    <rect x="40" y="90" width="130" height="34" rx="6" fill="#fef08a" stroke="#1e293b" strokeWidth="3" />
                    <text x="105" y="112" fontSize="12" fontWeight="bold" fill="#854d0e" textAnchor="middle">PRECISION SWEEP!</text>
                  </g>
                </svg>
              </div>
            )}

            {/* SCENE 5: Strutting down the street totally in love with watch */}
            {currentSceneIndex === 4 && (
              <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center animate-in zoom-in-95 duration-500">
                <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md">
                  {/* Street & City Sun backdrop */}
                  <circle cx="200" cy="200" r="170" fill="#e0f2fe" />
                  <circle cx="310" cy="90" r="35" fill="#fde047" opacity="0.8" />
                  <rect x="30" y="320" width="340" height="40" fill="#cbd5e1" stroke="#1e293b" strokeWidth="3" />
                  <line x1="30" y1="340" x2="370" y2="340" stroke="#f8fafc" strokeWidth="4" strokeDasharray="16 12" />

                  {/* Cool Character Walking / Strutting */}
                  <g className="animate-bounce" style={{ animationDuration: '1.8s' }}>
                    {/* Legs Walking */}
                    <line x1="180" y1="280" x2="150" y2="330" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                    <line x1="210" y1="280" x2="240" y2="330" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                    {/* Shoes */}
                    <ellipse cx="140" cy="335" rx="16" ry="7" fill="#ef4444" stroke="#1e293b" strokeWidth="2" />
                    <ellipse cx="250" cy="335" rx="16" ry="7" fill="#ef4444" stroke="#1e293b" strokeWidth="2" />

                    {/* Stylish Jacket Body */}
                    <path d="M 150 180 L 240 180 L 225 285 L 165 285 Z" fill="#0284c7" stroke="#1e293b" strokeWidth="4" />
                    <polygon points="180,180 210,180 200,240 190,240" fill="#ffffff" />
                    
                    {/* Head with Cool Sunglasses */}
                    <circle cx="195" cy="115" r="45" fill="#fed7aa" stroke="#1e293b" strokeWidth="4" />
                    
                    {/* Cool Sunglasses */}
                    <polygon points="160,105 190,105 185,125 165,125" fill="#0f172a" stroke="#000000" strokeWidth="3" />
                    <polygon points="200,105 230,105 225,125 205,125" fill="#0f172a" stroke="#000000" strokeWidth="3" />
                    <line x1="190" y1="110" x2="200" y2="110" stroke="#000000" strokeWidth="3" />
                    <line x1="165" y1="112" x2="175" y2="120" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                    <line x1="205" y1="112" x2="215" y2="120" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

                    {/* Huge Confident Grin */}
                    <path d="M 175 135 Q 195 155 215 135" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />

                    {/* Arm held up high showing off the watch! */}
                    <path d="M 230 190 Q 280 170 290 110" stroke="#fed7aa" strokeWidth="18" fill="none" strokeLinecap="round" />
                    <path d="M 230 190 Q 280 170 290 110" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
                    
                    {/* Hand with Peace / Thumbs sign */}
                    <circle cx="290" cy="100" r="14" fill="#fed7aa" stroke="#1e293b" strokeWidth="3" />

                    {/* The Watch Gleaming on the Raised Wrist */}
                    <circle cx="282" cy="125" r="18" fill="#eab308" stroke="#713f12" strokeWidth="3" />
                    <circle cx="282" cy="125" r="12" fill="#0284c7" />
                    <polygon points="305,110 310,120 320,123 310,126 305,136 300,126 290,123 300,120" fill="#f59e0b" />
                  </g>

                  {/* Floating Giant Hearts of Love */}
                  <g>
                    <path d="M 90 80 C 90 68 76 60 70 68 C 64 60 50 68 50 80 C 50 96 70 110 70 110 C 70 110 90 96 90 80 Z" fill="#ec4899" stroke="#9d174d" strokeWidth="2" />
                    <path d="M 330 60 C 330 48 316 40 310 48 C 304 40 290 48 290 60 C 290 76 310 90 310 90 C 310 90 330 76 330 60 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
                    <path d="M 120 150 C 120 142 110 136 106 142 C 102 136 92 142 92 150 C 92 160 106 170 106 170 C 106 170 120 160 120 150 Z" fill="#f43f5e" stroke="#881337" strokeWidth="2" />
                  </g>
                </svg>
              </div>
            )}

            {/* Cycling Indicator Pill on visual canvas */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xs text-white px-3 py-1 text-[11px] font-label-caps flex items-center gap-1.5 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              GIF {currentScene.id} / 5
            </div>

            {/* Quick jump dots on canvas */}
            <div className="absolute bottom-4 flex items-center gap-2 bg-black/70 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/20">
              {SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => handleSelectScene(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    currentSceneIndex === idx
                      ? 'bg-[#efe3aa] w-6'
                      : 'bg-white/50 hover:bg-white'
                  }`}
                  title={`Jump to Scene ${scene.id}`}
                />
              ))}
            </div>
          </div>

          {/* Story Narrative & Scene Descriptions (5 Cols on desktop) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#fafaf5]">
            <div className="space-y-4">
              <div>
                <span className="inline-block bg-[#efe3aa] text-[#474016] text-[10px] font-label-caps px-2.5 py-1 border border-[#d8c87e] font-bold tracking-wider mb-2">
                  {currentScene.badge}
                </span>
                <h3 className="font-headline-lg text-2xl md:text-3xl text-black leading-snug">
                  {currentScene.title}
                </h3>
                <p className="font-label-caps text-xs text-[#735c00] font-semibold mt-1">
                  {currentScene.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#444748] leading-relaxed border-l-2 border-[#735c00] pl-3 py-1">
                {currentScene.caption}
              </p>

              {/* Collector's Reaction Quote Box */}
              <div className="p-3.5 bg-white border border-[#c4c7c7] text-xs text-black">
                <span className="font-label-caps text-[10px] text-[#747878] block mb-1">
                  COLLECTOR'S THOUGHTS:
                </span>
                <p className="font-medium text-black italic">
                  {currentScene.reaction}
                </p>
              </div>
            </div>

            {/* 5-Scene Step Thumbnails Selector */}
            <div className="pt-6 mt-6 border-t border-[#e5e5df] space-y-2">
              <span className="font-label-caps text-[10px] text-[#747878] block">
                STORYLINE PROGRESSION (CLICK TO VIEW):
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {SCENES.map((scene, idx) => (
                  <button
                    key={scene.id}
                    onClick={() => handleSelectScene(idx)}
                    className={`py-2 px-1 text-center border transition-all cursor-pointer ${
                      currentSceneIndex === idx
                        ? 'bg-black text-[#efe3aa] border-black font-bold shadow-xs ring-1 ring-black'
                        : 'bg-white text-[#444748] border-[#c4c7c7] hover:border-black'
                    }`}
                  >
                    <span className="font-label-caps text-[10px] block">0{scene.id}</span>
                    <span className="text-[9px] block truncate">
                      {idx === 0 && 'Discovery'}
                      {idx === 1 && 'Deal'}
                      {idx === 2 && 'Unbox'}
                      {idx === 3 && 'Wrist Check'}
                      {idx === 4 && 'Watch Love'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
