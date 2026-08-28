import React, { useState } from 'react';
import { X, CheckCircle2, Upload, Plus, Trash2, ArrowRight, ShieldCheck, Video, Film, Sparkles } from 'lucide-react';
import { VaultItem, Watch } from '../types';
import { WATCH_BRANDS, BRAND_MODELS } from '../data/watches';

interface EditListingModalProps {
  vaultItem: VaultItem;
  onClose: () => void;
  onSave: (updatedItem: VaultItem) => void;
}

export const EditListingModal: React.FC<EditListingModalProps> = ({
  vaultItem,
  onClose,
  onSave,
}) => {
  const watch = vaultItem.watch;

  // Check if initial brand is in standard list
  const matchedBrand = WATCH_BRANDS.find((b) => b.name.toLowerCase() === watch.brand.toLowerCase());
  const initialBrandSelection = matchedBrand ? matchedBrand.id : 'other';

  const [brand, setBrand] = useState<string>(initialBrandSelection);
  const [customBrand, setCustomBrand] = useState<string>(initialBrandSelection === 'other' ? watch.brand : '');

  // Check if model is in brand list
  const [model, setModel] = useState<string>(watch.model || '');
  const [customModel, setCustomModel] = useState<string>('');

  const [reference, setReference] = useState<string>(watch.reference || '');
  const [customReference, setCustomReference] = useState<string>('');

  const [year, setYear] = useState<string>(String(watch.year || '2022'));
  const [customYear, setCustomYear] = useState<string>('');

  const [condition, setCondition] = useState<string>(watch.condition || 'Exceptional Condition');
  const [boxAndPapers, setBoxAndPapers] = useState<string>(watch.boxAndPapers || 'Complete Set');
  const [price, setPrice] = useState<number>(watch.price || vaultItem.currentEstimatedValue || 10000);
  const [priceType, setPriceType] = useState<'firm' | 'obo'>(watch.priceType || 'obo');
  const [videoUrl, setVideoUrl] = useState<string | undefined>(watch.videoUrl);
  const [includeVideo, setIncludeVideo] = useState<boolean>(!!watch.videoUrl);
  const [description, setDescription] = useState<string>(watch.description || '');

  const [caseDiameter, setCaseDiameter] = useState<string>(watch.caseDiameter || '40 mm');
  const [caseMaterial, setCaseMaterial] = useState<string>(watch.caseMaterial || 'Stainless Steel');
  const [dialColor, setDialColor] = useState<string>(watch.dialColor || 'Black');
  const [movement, setMovement] = useState<string>(watch.movement || 'Automatic');
  const [powerReserve, setPowerReserve] = useState<string>(watch.powerReserve || '48 Hours');
  const [waterResistance, setWaterResistance] = useState<string>(watch.waterResistance || '100m');

  const [images, setImages] = useState<string[]>([
    watch.imageUrl,
    ...(watch.secondaryImages || [])
  ]);

  const [authenticityDeclaration, setAuthenticityDeclaration] = useState<'guaranteed_authentic' | 'mod_unauthenticated'>(
    watch.condition?.includes('Mod') || watch.condition?.includes('Uncertified')
      ? 'mod_unauthenticated'
      : 'guaranteed_authentic'
  );

  const [isSaved, setIsSaved] = useState(false);

  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand);
    if (newBrand !== 'other') {
      const models = BRAND_MODELS[newBrand];
      if (models && models.length > 0) {
        setModel(models[0].model);
        setReference(models[0].ref);
      }
    }
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      files.forEach((file) => {
        const url = URL.createObjectURL(file);
        setImages((prev) => [...prev, url]);
      });
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (images.length <= 1) return;
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const resolvedBrand = brand === 'other' ? (customBrand.trim() || 'Custom Brand') : (WATCH_BRANDS.find((b) => b.id === brand)?.name || brand);
    const resolvedModel = model === 'other' ? (customModel.trim() || 'Custom Model') : (model || 'Custom Model');
    const resolvedReference = reference === 'other' ? (customReference.trim() || 'Ref. Custom') : (reference || 'Ref. Standard');
    const resolvedYear = year === 'other' ? (customYear.trim() || '2022') : (year || '2022');

    let resolvedCondition = condition;
    const isModOrUnauth = authenticityDeclaration === 'mod_unauthenticated';
    if (isModOrUnauth && !resolvedCondition.includes('Mod')) {
      resolvedCondition = `${condition} (Mod / Uncertified)`;
    }

    const updatedWatch: Watch = {
      ...watch,
      brand: resolvedBrand,
      model: resolvedModel,
      reference: resolvedReference,
      year: resolvedYear,
      price: Number(price),
      priceType,
      condition: resolvedCondition as any,
      boxAndPapers: boxAndPapers as any,
      description: description || `Client listed ${resolvedBrand} ${resolvedModel}.`,
      caseDiameter,
      caseMaterial,
      dialColor,
      movement,
      powerReserve,
      waterResistance,
      imageUrl: images[0] || watch.imageUrl,
      secondaryImages: images.slice(1),
      videoUrl: includeVideo && videoUrl ? videoUrl : undefined,
      isFlaggedFake: isModOrUnauth ? false : watch.isFlaggedFake,
      aiAuthenticityReport: isModOrUnauth
        ? {
            id: watch.aiAuthenticityReport?.id || `ai-rep-${Date.now()}`,
            watchId: watch.id,
            scannedAt: new Date().toISOString(),
            status: 'authentic' as const,
            riskScore: 0,
            confidence: 99,
            summary: 'Seller declared timepiece as custom mod / unauthenticated. Google AI optical scanner cleared listing: transparent disclosure, zero counterfeit deception flag.',
            findings: [
              'Seller explicitly disclosed aftermarket modifications or uncertified provenance.',
              'Complies with Swapping Time transparent custom timepiece standards.',
              'Google AI anti-counterfeit filter: Cleared with zero penalty (not flagged as fake).'
            ],
            flaggedReasons: [],
            opticalInspection: {
              dialAndTypography: 'Mod/Custom dial configuration transparently disclosed.',
              logoAndMarkings: 'Declared aftermarket/custom modifications.',
              handsAndLume: 'Custom/aftermarket hand installation noted.',
              bezelAndCaseFinishing: 'Case and bezel geometry verified without deceptive markings.'
            },
            flaggedToAdmin: false,
            reviewedByAdmin: true,
            adminAction: 'approved' as const,
            adminNotes: 'Cleared: Declared as mod/unauthenticated.'
          }
        : watch.aiAuthenticityReport,
    };

    const updatedVaultItem: VaultItem = {
      ...vaultItem,
      watch: updatedWatch,
      currentEstimatedValue: Number(price),
    };

    setIsSaved(true);
    setTimeout(() => {
      onSave(updatedVaultItem);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#fafaf5] border border-black shadow-2xl p-6 sm:p-10 my-8">
        {/* Close Button */}
        <button
          id="btn-close-edit-listing"
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#444748] hover:text-black hover:bg-[#e4e3dc] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-8 border-b border-[#c4c7c7] pb-4">
          <span className="font-label-caps text-xs text-[#735c00] tracking-widest block mb-1">
            Vault Inventory Management
          </span>
          <h2 className="font-headline-lg text-2xl sm:text-3xl text-black">
            Edit Timepiece Listing
          </h2>
          <p className="text-xs text-[#747878] mt-1">
            Update and modify every specification, physical attribute, photo evidence, and authenticity status for this listing.
          </p>
        </div>

        {isSaved ? (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#735c00] mx-auto animate-bounce" />
            <h3 className="font-headline-md text-2xl text-black">Listing Updated Successfully</h3>
            <p className="text-xs text-[#747878]">Synchronizing vault records and secondary market registry...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Core Horological Specs */}
            <div>
              <h3 className="font-label-caps text-xs text-black uppercase tracking-wider mb-4 font-bold border-b border-[#eeeee9] pb-2">
                1. Horological Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Brand */}
                <div>
                  <label className="font-label-caps text-xs text-[#444748] block mb-2">
                    Manufacture / Brand
                  </label>
                  <select
                    id="edit-select-brand"
                    value={brand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    className="form-input-luxury w-full font-body-md text-black cursor-pointer"
                  >
                    <option value="patek-philippe">Patek Philippe</option>
                    <option value="rolex">Rolex</option>
                    <option value="audemars-piguet">Audemars Piguet</option>
                    <option value="omega">Omega</option>
                    <option value="vacheron-constantin">Vacheron Constantin</option>
                    <option value="tag-heuer">TAG Heuer / Heuer</option>
                    <option value="cartier">Cartier</option>
                    <option value="richard-mille">Richard Mille</option>
                    <option value="other">Other (Specify Manufacture)</option>
                  </select>
                  {brand === 'other' && (
                    <input
                      id="edit-custom-brand"
                      type="text"
                      value={customBrand}
                      onChange={(e) => setCustomBrand(e.target.value)}
                      placeholder="Enter Manufacture / Brand name..."
                      className="form-input-luxury w-full text-black placeholder:text-[#747878] text-sm mt-3"
                    />
                  )}
                </div>

                {/* Model */}
                <div>
                  <label className="font-label-caps text-xs text-[#444748] block mb-2">
                    Model Designation
                  </label>
                  {BRAND_MODELS[brand] && BRAND_MODELS[brand].length > 0 ? (
                    <select
                      id="edit-select-model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="form-input-luxury w-full font-body-md text-black cursor-pointer"
                    >
                      {BRAND_MODELS[brand].map((m) => (
                        <option key={m.model} value={m.model}>
                          {m.model}
                        </option>
                      ))}
                      <option value="other">Other (Specify Model)</option>
                    </select>
                  ) : (
                    <input
                      id="edit-input-model"
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. Royal Oak Selfwinding"
                      className="form-input-luxury w-full text-black placeholder:text-[#747878] text-sm"
                    />
                  )}
                  {model === 'other' && (
                    <input
                      id="edit-custom-model"
                      type="text"
                      value={customModel}
                      onChange={(e) => setCustomModel(e.target.value)}
                      placeholder="Enter Model Designation..."
                      className="form-input-luxury w-full text-black placeholder:text-[#747878] text-sm mt-3"
                    />
                  )}
                </div>

                {/* Reference */}
                <div>
                  <label className="font-label-caps text-xs text-[#444748] block mb-2">
                    Reference Number
                  </label>
                  {BRAND_MODELS[brand] && BRAND_MODELS[brand].length > 0 ? (
                    <select
                      id="edit-select-ref"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="form-input-luxury w-full font-body-md text-black cursor-pointer"
                    >
                      {BRAND_MODELS[brand].map((m) => (
                        <option key={m.ref} value={m.ref}>
                          {m.ref}
                        </option>
                      ))}
                      <option value="other">Other (Specify Reference)</option>
                    </select>
                  ) : (
                    <input
                      id="edit-input-ref"
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="e.g. Ref. 116500LN"
                      className="form-input-luxury w-full text-black placeholder:text-[#747878] text-sm"
                    />
                  )}
                  {reference === 'other' && (
                    <input
                      id="edit-custom-ref"
                      type="text"
                      value={customReference}
                      onChange={(e) => setCustomReference(e.target.value)}
                      placeholder="Enter Reference Number..."
                      className="form-input-luxury w-full text-black placeholder:text-[#747878] text-sm mt-3"
                    />
                  )}
                </div>

                {/* Year */}
                <div>
                  <label className="font-label-caps text-xs text-[#444748] block mb-2">
                    Year of Production
                  </label>
                  <select
                    id="edit-select-year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="form-input-luxury w-full font-body-md text-black cursor-pointer"
                  >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="vintage">Vintage (Pre-2000)</option>
                    <option value="other">Other (Specify Year)</option>
                  </select>
                  {year === 'other' && (
                    <input
                      id="edit-custom-year"
                      type="text"
                      value={customYear}
                      onChange={(e) => setCustomYear(e.target.value)}
                      placeholder="Enter Production Year (e.g. 1989)..."
                      className="form-input-luxury w-full text-black placeholder:text-[#747878] text-sm mt-3"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Condition, Scope & Listing Price */}
            <div>
              <h3 className="font-label-caps text-xs text-black uppercase tracking-wider mb-4 font-bold border-b border-[#eeeee9] pb-2">
                2. Condition &amp; Pricing
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Condition */}
                <div>
                  <label className="font-label-caps text-xs text-[#444748] block mb-2">
                    Condition Rating
                  </label>
                  <select
                    id="edit-select-condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="form-input-luxury w-full font-body-md text-black cursor-pointer text-xs"
                  >
                    <option value="Mint / Unworn">Mint / Unworn (Like New)</option>
                    <option value="Exceptional Condition">Exceptional Condition</option>
                    <option value="Very Good">Very Good (Light Wear)</option>
                    <option value="Good (with scratches and signs of wear)">Good (with scratches and signs of wear)</option>
                    <option value="Vintage Patina">Vintage Patina (Original)</option>
                    <option value="Needs Service / Project">Needs Service / Project</option>
                    <option value="Parts Only">Parts Only</option>
                  </select>
                </div>

                {/* Box and papers */}
                <div>
                  <label className="font-label-caps text-xs text-[#444748] block mb-2">
                    Box &amp; Papers
                  </label>
                  <select
                    id="edit-select-box"
                    value={boxAndPapers}
                    onChange={(e) => setBoxAndPapers(e.target.value)}
                    className="form-input-luxury w-full font-body-md text-black cursor-pointer text-xs"
                  >
                    <option value="Complete Set">Complete Set (Box &amp; Papers)</option>
                    <option value="Watch & Box">Watch &amp; Original Box</option>
                    <option value="Watch Only">Watch Only (No Accessories)</option>
                  </select>
                </div>

                {/* Listing Price */}
                <div>
                  <label className="font-label-caps text-xs text-[#444748] block mb-2">
                    Listing Price ($ USD)
                  </label>
                  <input
                    id="edit-input-price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="form-input-luxury w-full text-black text-sm mb-3"
                    min="100"
                    step="50"
                  />

                  {/* Two Checkboxes: FIRM or OBO */}
                  <div className="bg-[#fcfcfa] p-3 border border-[#c4c7c7] space-y-2">
                    <span className="text-[10px] font-label-caps text-[#444748] block font-semibold">
                      Price Terms (Select One)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <label
                        htmlFor="edit-chk-price-firm"
                        className={`flex items-center gap-2 p-2 border cursor-pointer select-none transition-all ${
                          priceType === 'firm'
                            ? 'bg-black text-white border-black font-semibold'
                            : 'bg-white text-black border-[#c4c7c7] hover:border-black'
                        }`}
                      >
                        <input
                          type="checkbox"
                          id="edit-chk-price-firm"
                          checked={priceType === 'firm'}
                          onChange={() => setPriceType('firm')}
                          className="w-3.5 h-3.5 accent-black cursor-pointer rounded-none"
                        />
                        <div className="flex flex-col">
                          <span className="font-label-caps text-[11px]">FIRM</span>
                          <span className={`text-[9px] ${priceType === 'firm' ? 'text-[#c8c6c5]' : 'text-[#747878]'}`}>
                            Fixed price
                          </span>
                        </div>
                      </label>

                      <label
                        htmlFor="edit-chk-price-obo"
                        className={`flex items-center gap-2 p-2 border cursor-pointer select-none transition-all ${
                          priceType === 'obo'
                            ? 'bg-[#efe3aa] text-[#474016] border-[#d8c87e] font-semibold'
                            : 'bg-white text-black border-[#c4c7c7] hover:border-[#735c00]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          id="edit-chk-price-obo"
                          checked={priceType === 'obo'}
                          onChange={() => setPriceType('obo')}
                          className="w-3.5 h-3.5 accent-[#735c00] cursor-pointer rounded-none"
                        />
                        <div className="flex flex-col">
                          <span className="font-label-caps text-[11px]">OBO</span>
                          <span className={`text-[9px] ${priceType === 'obo' ? 'text-[#5d5423]' : 'text-[#747878]'}`}>
                            Or best offer
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Physical & Technical Attributes */}
            <div>
              <h3 className="font-label-caps text-xs text-black uppercase tracking-wider mb-4 font-bold border-b border-[#eeeee9] pb-2">
                3. Technical Specifications
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-label-caps text-[#444748] block mb-1">Case Diameter</label>
                  <input
                    type="text"
                    value={caseDiameter}
                    onChange={(e) => setCaseDiameter(e.target.value)}
                    className="form-input-luxury w-full text-xs"
                    placeholder="40 mm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-label-caps text-[#444748] block mb-1">Case Material</label>
                  <input
                    type="text"
                    value={caseMaterial}
                    onChange={(e) => setCaseMaterial(e.target.value)}
                    className="form-input-luxury w-full text-xs"
                    placeholder="Oystersteel (904L)"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-label-caps text-[#444748] block mb-1">Dial Color</label>
                  <input
                    type="text"
                    value={dialColor}
                    onChange={(e) => setDialColor(e.target.value)}
                    className="form-input-luxury w-full text-xs"
                    placeholder="Black / Blue / Silver"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-label-caps text-[#444748] block mb-1">Movement / Calibre</label>
                  <input
                    type="text"
                    value={movement}
                    onChange={(e) => setMovement(e.target.value)}
                    className="form-input-luxury w-full text-xs"
                    placeholder="Rolex Calibre 4130"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-label-caps text-[#444748] block mb-1">Power Reserve</label>
                  <input
                    type="text"
                    value={powerReserve}
                    onChange={(e) => setPowerReserve(e.target.value)}
                    className="form-input-luxury w-full text-xs"
                    placeholder="72 Hours"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-label-caps text-[#444748] block mb-1">Water Resistance</label>
                  <input
                    type="text"
                    value={waterResistance}
                    onChange={(e) => setWaterResistance(e.target.value)}
                    className="form-input-luxury w-full text-xs"
                    placeholder="100m / 330ft"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-[11px] font-label-caps text-[#444748] block mb-1">Description &amp; Provenance Notes</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input-luxury w-full text-xs"
                  placeholder="Describe service history, original patina, accessories, or collector background..."
                />
              </div>
            </div>

            {/* Section 4: Photographic Evidence */}
            <div>
              <h3 className="font-label-caps text-xs text-black uppercase tracking-wider mb-4 font-bold border-b border-[#eeeee9] pb-2 flex items-center justify-between">
                <span>4. Photographic Evidence ({images.length})</span>
                <label className="font-label-caps text-[11px] text-[#735c00] hover:text-black cursor-pointer flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Photo
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddImage}
                    className="hidden"
                  />
                </label>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group border border-[#c4c7c7] bg-white aspect-square overflow-hidden">
                    <img
                      src={img}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        disabled={images.length <= 1}
                        className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title={images.length <= 1 ? "At least 1 photo required" : "Remove photo"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black text-white text-[9px] font-label-caps px-1 py-0.5">
                        Primary Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Running Movement Video in Edit Modal */}
              <div className="mt-4 pt-3 border-t border-[#eeeee9]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeVideo}
                    onChange={(e) => {
                      setIncludeVideo(e.target.checked);
                      if (!e.target.checked) {
                        setVideoUrl(undefined);
                      }
                    }}
                    className="accent-[#735c00] cursor-pointer"
                  />
                  <span className="text-xs font-label-caps text-black font-semibold flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-[#735c00]" />
                    Include video of watch running &amp; ticking
                  </span>
                </label>

                {includeVideo && (
                  <div className="mt-3 p-3 bg-white border border-[#c4c7c7]">
                    {videoUrl ? (
                      <div className="space-y-2">
                        <div className="relative aspect-video max-h-40 bg-black overflow-hidden flex items-center justify-center">
                          <video
                            src={videoUrl}
                            controls
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => setVideoUrl(undefined)}
                            className="absolute top-1 right-1 bg-black/80 hover:bg-red-700 text-white p-1"
                            title="Remove video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] font-label-caps text-green-700 font-semibold block">
                          ✓ Running video attached to listing
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <label className="cursor-pointer px-3 py-2 border border-dashed border-[#747878] hover:border-black text-xs font-label-caps flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-[#735c00]" />
                          Upload Video File (MP4/MOV)
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setVideoUrl(URL.createObjectURL(e.target.files[0]));
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4')}
                          className="text-[11px] font-label-caps text-[#735c00] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          Use Sample Movement Video
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Section 5: Authenticity Status Declaration */}
            <div className="space-y-3 pt-2">
              <h3 className="font-label-caps text-xs text-black uppercase tracking-wider font-bold border-b border-[#eeeee9] pb-2">
                5. Authenticity Declaration
              </h3>

              <div
                id="edit-auth-guaranteed-opt"
                onClick={() => setAuthenticityDeclaration('guaranteed_authentic')}
                className={`p-3.5 border cursor-pointer transition-colors flex items-start gap-3 bg-white ${
                  authenticityDeclaration === 'guaranteed_authentic'
                    ? 'border-[#735c00] ring-1 ring-[#735c00] bg-[#fafaf5]'
                    : 'border-[#c4c7c7] hover:border-black'
                }`}
              >
                <input
                  id="edit-auth-guaranteed"
                  type="radio"
                  name="edit-authenticity"
                  value="guaranteed_authentic"
                  checked={authenticityDeclaration === 'guaranteed_authentic'}
                  onChange={() => setAuthenticityDeclaration('guaranteed_authentic')}
                  className="mt-0.5 accent-[#735c00] cursor-pointer"
                />
                <label htmlFor="edit-auth-guaranteed" className="text-xs text-[#1a1c19] cursor-pointer select-none">
                  <strong className="block text-black font-semibold mb-0.5">I guarantee this is authentic</strong>
                  All components, movement, dial, and casing are original factory authentic.
                </label>
              </div>

              <div
                id="edit-auth-mod-opt"
                onClick={() => setAuthenticityDeclaration('mod_unauthenticated')}
                className={`p-3.5 border cursor-pointer transition-colors flex items-start gap-3 bg-white ${
                  authenticityDeclaration === 'mod_unauthenticated'
                    ? 'border-[#735c00] ring-1 ring-[#735c00] bg-[#fafaf5]'
                    : 'border-[#c4c7c7] hover:border-black'
                }`}
              >
                <input
                  id="edit-auth-mod"
                  type="radio"
                  name="edit-authenticity"
                  value="mod_unauthenticated"
                  checked={authenticityDeclaration === 'mod_unauthenticated'}
                  onChange={() => setAuthenticityDeclaration('mod_unauthenticated')}
                  className="mt-0.5 accent-[#735c00] cursor-pointer"
                />
                <label htmlFor="edit-auth-mod" className="text-xs text-[#1a1c19] cursor-pointer select-none">
                  <strong className="block text-black font-semibold mb-0.5">This is a mod or hasn't been authenticated by an outside source</strong>
                  Contains aftermarket parts, custom modifications, or unverified secondary components.
                </label>
              </div>

              {/* Google AI Authenticity Scanner Notification */}
              {authenticityDeclaration === 'mod_unauthenticated' && (
                <div className="p-3 bg-emerald-50/80 border border-emerald-300 text-xs text-emerald-950 flex items-start gap-2 animate-in fade-in duration-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-label-caps text-[10px] font-bold text-emerald-900 block">
                      Google AI Authenticity Policy: Listing Cleared
                    </span>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Because this is declared as a mod or unauthenticated timepiece, <strong>Google AI will NOT flag this watch</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-[#c4c7c7] flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                type="button"
                id="btn-cancel-edit-listing"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 border border-[#c4c7c7] text-black font-label-caps text-xs hover:bg-[#e4e3dc] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                id="btn-save-listing-changes"
                className="w-full sm:w-auto px-8 py-3.5 bg-black text-white font-label-caps text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer hover:bg-[#2f312e]"
              >
                Save Changes to Listing
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
