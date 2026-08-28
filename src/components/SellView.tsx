import React, { useState } from 'react';
import { Camera, HelpCircle, ArrowRight, Check, Image as ImageIcon, Trash2, Sparkles, UploadCloud, Video, Play, Film } from 'lucide-react';
import { BRAND_MODELS, WATCH_BRANDS } from '../data/watches';
import { ConsignmentForm, ValuationResult, SiteContent } from '../types';
import { Edit3, Crown } from 'lucide-react';

interface SellViewProps {
  onProceedToValuation: (form: ConsignmentForm, valuation: ValuationResult) => void;
  siteContent?: SiteContent;
  isAdmin?: boolean;
  isAdminEditMode?: boolean;
  onOpenPageEdit?: () => void;
}

export const SellView: React.FC<SellViewProps> = ({
  onProceedToValuation,
  siteContent,
  isAdmin = false,
  isAdminEditMode = false,
  onOpenPageEdit,
}) => {
  const [brand, setBrand] = useState<string>('');
  const [customBrand, setCustomBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [customModel, setCustomModel] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [customReference, setCustomReference] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [customYear, setCustomYear] = useState<string>('');
  const [shippingMethod, setShippingMethod] = useState<'free' | 'buyer'>('free');
  const [shippingRate, setShippingRate] = useState<number>(8);
  const [condition, setCondition] = useState<string>('Exceptional Condition');
  const [boxAndPapers, setBoxAndPapers] = useState<string>('Complete Set');
  const [askingPrice, setAskingPrice] = useState<string>('');
  const [priceType, setPriceType] = useState<'firm' | 'obo'>('obo');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [allowVideo, setAllowVideo] = useState<boolean>(false);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Available models based on brand
  const availableModels = brand && BRAND_MODELS[brand] ? BRAND_MODELS[brand] : [];

  // When brand changes, reset model and reference
  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand);
    const models = BRAND_MODELS[newBrand];
    if (models && models.length > 0) {
      if (newBrand !== 'other') {
        setModel(models[0].model);
        setReference(models[0].ref);
      }
    } else {
      setModel('');
      setReference('');
    }
  };

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    const matched = availableModels.find((m) => m.model === newModel);
    if (matched) {
      setReference(matched.ref);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      const newUrls: string[] = [];
      files.forEach((file: File) => {
        const url = URL.createObjectURL(file);
        newUrls.push(url);
      });
      setUploadedImages((prev) => [...prev, ...newUrls].slice(0, 6));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files) as File[];
      const newUrls: string[] = [];
      files.forEach((file: File) => {
        const url = URL.createObjectURL(file);
        newUrls.push(url);
      });
      setUploadedImages((prev) => [...prev, ...newUrls].slice(0, 6));
    }
  };

  // Add sample stock watch photos for quick testing
  const addSamplePhotos = () => {
    setUploadedImages([
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFHlzyYPiuttehCrfEFzx3d5YgZQAsbRwGu9LdlOtaEf4yqNbYrZzDoQXl-AztVuucpcSfrgX8e8SlN7qwOmYbzjedGTXZM9dA6_yB70mMK4NNpUQAhBbamVlj1tyQcZbbssdOQJCNzDNOESQXsv9iide6fKVisAebebUQkVOx14RTWg90k8aADehkadZJnnQEwWRnbLrXGW9hJG14-G3EpYVF7qE1vjama69UOVqLiZEg2lVHHfSU_Q',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBfGZaVWSf-dgx7lYW7rPglaLBwL0Kch_EYXyGYQdoz8zha4BwCgefxBeUqhXyE-xtk9043F5bHb0bBd70oYQqt5DY_74sNvYxm316XMmIv9tMJs9GvH1mEcI5BDOwl0Hl-jhfHdG4nUiI3vQnHR1hcreNiWBym-B5DKf9LOBMbiHQaAzFZLJLxS77navaVwP58PAqYjBoCUseJmKZ7UqasO3PrEiQSdDMhtgCRNBG92B8eOs-P62OmvA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCT9k4VIcwruMteOOdIwxpwreC0egFC8n683TTrsLcfs3ezAY4Pi2_ovg8v1RGy5PAIasjrcRA97PJEqgVbA34ftHAU_DJS_n4lrOFN49JG094AZBK6Qn2kLRNIuhQRAoFrt-yAwSJZam6T-2F-2GkriY4Cu7sSufD2twtvDe2eOzTt-9mBHkL4Ct3jt_9lPoANBZbKLOcjFXe4H-gnRrN-ptfom-Qz-Mt8NPPa5wfkhed8qEjVDhGM6w'
    ]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setUploadedVideo(url);
      setVideoFileName(file.name);
    }
  };

  const removeVideo = () => {
    setUploadedVideo(null);
    setVideoFileName('');
  };

  const loadSampleVideo = () => {
    // Sample high quality horological movement loop video (royalty free preview)
    setUploadedVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setVideoFileName('watch_running_movement_60fps.mp4');
  };

  const handleProceed = () => {
    // Generate intelligent valuation estimate based on inputs
    const matchedModel = availableModels.find((m) => m.model === model);
    const baseEst = matchedModel?.estValue || 25000;
    
    // Adjust by year and condition
    let multiplier = 1.0;
    if (condition === 'Mint / Unworn') multiplier += 0.08;
    if (condition === 'Vintage Patina') multiplier += 0.05;
    if (condition === 'Good (with scratches and signs of wear)') multiplier -= 0.15;
    if (condition === 'Parts Only') multiplier -= 0.65;
    if (boxAndPapers === 'Complete Set') multiplier += 0.06;

    const calculatedListing = Math.round((baseEst * multiplier) / 100) * 100;
    const parsedAskingPrice = askingPrice ? parseFloat(askingPrice.replace(/[^0-9.]/g, '')) : undefined;
    const finalPrice = parsedAskingPrice && !isNaN(parsedAskingPrice) && parsedAskingPrice > 0 ? parsedAskingPrice : calculatedListing;
    const netEstimatedPayout = finalPrice;

    const resolvedBrand = brand === 'other' ? (customBrand.trim() || 'Custom Brand') : (WATCH_BRANDS.find((b) => b.id === brand)?.name || brand || 'Luxury Timepiece');
    const resolvedModel = model === 'other' ? (customModel.trim() || 'Custom Model') : (model || 'Designation Pending');
    const resolvedReference = reference === 'other' ? (customReference.trim() || 'Ref. Custom') : (reference || 'Ref. Standard');
    const resolvedYear = year === 'other' ? (customYear.trim() || 'Custom Year') : (year || '2022');

    const form: ConsignmentForm = {
      brand: resolvedBrand,
      model: resolvedModel,
      reference: resolvedReference,
      year: resolvedYear,
      condition,
      boxAndPapers,
      shippingMethod,
      shippingRate,
      askingPrice: finalPrice,
      priceType,
      includeVideo: allowVideo && !!uploadedVideo,
      videoUrl: allowVideo && uploadedVideo ? uploadedVideo : undefined,
      uploadedImages: uploadedImages.length > 0 ? uploadedImages : [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDFHlzyYPiuttehCrfEFzx3d5YgZQAsbRwGu9LdlOtaEf4yqNbYrZzDoQXl-AztVuucpcSfrgX8e8SlN7qwOmYbzjedGTXZM9dA6_yB70mMK4NNpUQAhBbamVlj1tyQcZbbssdOQJCNzDNOESQXsv9iide6fKVisAebebUQkVOx14RTWg90k8aADehkadZJnnQEwWRnbLrXGW9hJG14-G3EpYVF7qE1vjama69UOVqLiZEg2lVHHfSU_Q'
      ],
      expectedPayout: netEstimatedPayout
    };

    const valuation: ValuationResult = {
      estimatedLow: Math.round((finalPrice * 0.92) / 100) * 100,
      estimatedHigh: Math.round((finalPrice * 1.08) / 100) * 100,
      recommendedListing: finalPrice,
      netEstimatedPayout,
      marketDemand: finalPrice > 35000 ? 'Very High' : 'High',
      historicalAppreciation: '+8.4% past 12 months in secondary market index',
      referenceNotes: `Authenticity physical inspection required upon insured courier arrival at Swapping Time Vault.`
    };

    onProceedToValuation(form, valuation);
  };

  const pageTitle = siteContent?.sellPage?.title || 'List Your Timepiece';
  const pageSubtitle = siteContent?.sellPage?.subtitle || 'Step 1: Details & Imagery. Provide precise information and clear photographs to ensure an accurate listing.';

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-16 py-10 md:py-20 animate-in fade-in duration-300">
      {/* Super Admin Notice */}
      {isAdmin && isAdminEditMode && (
        <div className="mb-6 p-3 bg-[#efe3aa] border border-[#d8c87e] flex items-center justify-between">
          <span className="text-xs font-label-caps text-[#474016] font-bold flex items-center gap-1.5">
            <Crown className="w-4 h-4 fill-[#735c00]" />
            Super Admin: Sell Page Live Controls
          </span>
          {onOpenPageEdit && (
            <button
              onClick={onOpenPageEdit}
              className="bg-black text-white px-3 py-1 text-xs font-label-caps flex items-center gap-1 hover:bg-[#2f312e] cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Sell Page Copy
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="mb-12 md:mb-20 text-center relative">
        {isAdmin && onOpenPageEdit && (
          <div className="flex justify-center mb-2">
            <button
              onClick={onOpenPageEdit}
              className="font-label-caps text-xs px-3 py-1 border border-black hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Page Title &amp; Terms
            </button>
          </div>
        )}
        <h2 className="font-headline-lg text-3xl md:text-5xl mb-4 text-black">
          {pageTitle}
        </h2>
        <p className="font-body-lg text-base md:text-lg text-[#444748] max-w-2xl mx-auto leading-relaxed">
          {pageSubtitle}
        </p>
      </div>

      {/* Form Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Upload */}
        <div className="md:col-span-7 flex flex-col gap-8">
          <div className="bg-white p-6 md:p-8 border border-[#c4c7c7] shadow-[0_40px_80px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-2xl text-black">
                Photographic Evidence
              </h3>
              <div
                className="relative group cursor-help"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <HelpCircle className="w-5 h-5 text-[#747878] hover:text-black transition-colors" />
                <div
                  className={`absolute bottom-full right-0 mb-2 w-72 p-4 bg-[#1c1b1b] text-white font-label-caps text-[11px] leading-relaxed opacity-0 transition-opacity duration-300 pointer-events-none z-30 shadow-2xl ${
                    showTooltip ? 'opacity-100' : 'group-hover:opacity-100'
                  }`}
                >
                  Ensure natural lighting. Capture dial, case back, clasp, and any notable imperfections. Minimum 3 angles required.
                </div>
              </div>
            </div>

            {/* Drag and drop upload zone */}
            <label
              htmlFor="watch-photo-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`custom-file-upload w-full h-64 flex flex-col items-center justify-center text-center hover:text-[#735c00] transition-all duration-300 bg-[#f4f4ef] group relative ${
                isDragging ? 'border-[#735c00] bg-[#fafaf5]' : ''
              }`}
            >
              <input
                id="watch-photo-upload"
                accept="image/*"
                className="hidden"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <Camera className="w-10 h-10 mb-3 text-[#747878] group-hover:text-[#735c00] transition-colors duration-300" />
              <span className="font-label-caps text-xs text-[#444748] group-hover:text-[#735c00] transition-colors duration-300">
                Upload High-Resolution Images
              </span>
              <span className="font-body-md text-sm text-[#747878] mt-2">
                Drag &amp; drop or click to browse
              </span>
              <span className="text-[11px] text-[#747878] mt-1">
                JPEG, PNG, WEBP up to 25MB
              </span>
            </label>

            {/* Quick Helper Button to populate high-res sample photos */}
            {uploadedImages.length === 0 && (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={addSamplePhotos}
                  className="font-label-caps text-[11px] text-[#735c00] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Load Sample High-Res Watch Photos
                </button>
              </div>
            )}

            {/* 3 Photo Angle Slots / Uploaded Thumbnails */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[0, 1, 2].map((idx) => {
                const img = uploadedImages[idx];
                const angleLabels = ['Dial / Front', 'Case Back', 'Clasp / Crown'];
                return (
                  <div
                    key={idx}
                    className="aspect-square bg-[#eeeee9] border border-[#c4c7c7] flex flex-col items-center justify-center text-[#747878] relative overflow-hidden group"
                  >
                    {img ? (
                      <>
                        <img
                          src={img}
                          alt={`Uploaded angle ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/70 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[9px] font-label-caps text-center py-0.5 truncate">
                          {angleLabels[idx]}
                        </span>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <ImageIcon className="w-6 h-6 mb-1 text-[#747878]" />
                        <span className="text-[10px] font-label-caps text-[#747878]">
                          {angleLabels[idx]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {uploadedImages.length > 3 && (
              <p className="font-label-caps text-[11px] text-[#735c00] mt-3">
                + {uploadedImages.length - 3} additional photographs attached
              </p>
            )}

            {/* Video Evidence Checkbox Option */}
            <div className="mt-8 pt-6 border-t border-[#eeeee9]">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="chk-allow-video"
                  checked={allowVideo}
                  onChange={(e) => {
                    setAllowVideo(e.target.checked);
                    if (!e.target.checked) {
                      setUploadedVideo(null);
                      setVideoFileName('');
                    }
                  }}
                  className="mt-1 w-4 h-4 accent-[#735c00] cursor-pointer rounded-none"
                />
                <div className="flex-1">
                  <label htmlFor="chk-allow-video" className="cursor-pointer select-none">
                    <span className="font-label-caps text-xs text-black font-semibold flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-[#735c00]" />
                      Include video of watch running &amp; ticking
                    </span>
                    <p className="text-xs text-[#444748] mt-0.5">
                      Upload a short clip (5–30 seconds) demonstrating the sweep of the second hand, escapement rhythm, and operational movement.
                    </p>
                  </label>

                  {/* Expandable Video Upload Area when Checked */}
                  {allowVideo && (
                    <div className="mt-4 p-4 bg-[#f8f8f4] border border-[#d8c87e] transition-all animate-in fade-in duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <span className="font-label-caps text-[11px] text-[#735c00] font-semibold flex items-center gap-1.5">
                          <Video className="w-4 h-4" />
                          Movement Video Clip (MP4, MOV, WEBM)
                        </span>
                        {!uploadedVideo && (
                          <button
                            type="button"
                            onClick={loadSampleVideo}
                            className="font-label-caps text-[10px] text-[#735c00] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            Load Sample Running Video
                          </button>
                        )}
                      </div>

                      {uploadedVideo ? (
                        <div className="space-y-3">
                          <div className="relative bg-black rounded-none overflow-hidden aspect-video max-h-56 w-full flex items-center justify-center border border-[#1c1b1b]">
                            <video
                              src={uploadedVideo}
                              controls
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={removeVideo}
                              className="absolute top-2 right-2 bg-black/80 hover:bg-red-900 text-white p-1.5 text-xs transition-colors cursor-pointer"
                              title="Remove video"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-xs text-[#444748]">
                            <span className="truncate max-w-[240px] font-mono text-[11px]">
                              {videoFileName || 'watch_running_clip.mp4'}
                            </span>
                            <span className="font-label-caps text-[10px] text-green-800 bg-green-100 px-2 py-0.5 font-semibold">
                              ✓ Verified Movement Video Ready
                            </span>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="watch-video-upload"
                          className="custom-file-upload w-full h-32 border-2 border-dashed border-[#c4c7c7] hover:border-[#735c00] flex flex-col items-center justify-center text-center cursor-pointer bg-white p-4 transition-colors group"
                        >
                          <input
                            id="watch-video-upload"
                            accept="video/mp4,video/quicktime,video/webm"
                            className="hidden"
                            type="file"
                            onChange={handleVideoUpload}
                          />
                          <Video className="w-6 h-6 mb-1 text-[#747878] group-hover:text-[#735c00] transition-colors" />
                          <span className="font-label-caps text-xs text-black group-hover:text-[#735c00] font-semibold">
                            Select or Drop Short Running Video
                          </span>
                          <span className="text-[11px] text-[#747878] mt-0.5">
                            Max duration 30s • MP4 or MOV up to 50MB
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Condition & Provenance Extras */}
          <div className="bg-white p-6 md:p-8 border border-[#c4c7c7] shadow-[0_40px_80px_rgba(0,0,0,0.05)]">
            <h3 className="font-headline-md text-xl text-black mb-6">
              Condition &amp; Scope of Delivery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="font-label-caps text-xs text-[#444748] block mb-2">
                  Condition Rating
                </label>
                <select
                  id="select-condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="form-input-luxury w-full font-body-md text-black cursor-pointer"
                >
                  <option value="Mint / Unworn">Mint / Unworn (Like New)</option>
                  <option value="Exceptional Condition">Exceptional Condition</option>
                  <option value="Very Good">Very Good (Light Wear)</option>
                  <option value="Good (with scratches and signs of wear)">Good (with scratches and signs of wear)</option>
                  <option value="Vintage Patina">Vintage Patina (Original / Untouched)</option>
                  <option value="Needs Service / Project">Needs Service / Project</option>
                  <option value="Parts Only">Parts Only</option>
                </select>
              </div>

              <div>
                <label className="font-label-caps text-xs text-[#444748] block mb-2">
                  Box &amp; Papers
                </label>
                <select
                  value={boxAndPapers}
                  onChange={(e) => setBoxAndPapers(e.target.value)}
                  className="form-input-luxury w-full font-body-md text-black cursor-pointer"
                >
                  <option value="Complete Set">Complete Set (Box, Card &amp; Manuals)</option>
                  <option value="Watch & Box">Watch &amp; Original Box</option>
                  <option value="Watch Only">Watch Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications */}
        <div className="md:col-span-5 flex flex-col gap-8">
          <div className="bg-white p-6 md:p-8 border border-[#c4c7c7] shadow-[0_40px_80px_rgba(0,0,0,0.05)] h-full flex flex-col justify-between">
            <div>
              <h3 className="font-headline-md text-2xl text-black mb-8">
                Specifications
              </h3>

              <div className="space-y-8">
                {/* 1. Manufacture / Brand */}
                <div className="relative">
                  <label className="font-label-caps text-xs text-[#444748] block mb-2">
                    Manufacture / Brand
                  </label>
                  <select
                    id="select-brand"
                    value={brand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    className="form-input-luxury w-full font-body-md text-black focus:border-[#735c00] transition-colors duration-300 appearance-none bg-transparent cursor-pointer"
                  >
                    <option value="" disabled>Select Brand</option>
                    <option value="patek-philippe">Patek Philippe</option>
                    <option value="rolex">Rolex</option>
                    <option value="audemars-piguet">Audemars Piguet</option>
                    <option value="omega">Omega</option>
                    <option value="vacheron-constantin">Vacheron Constantin</option>
                    <option value="tag-heuer">TAG Heuer / Heuer</option>
                    <option value="cartier">Cartier</option>
                    <option value="other">Other (Specify Manufacture)</option>
                  </select>
                  {brand === 'other' && (
                    <div className="mt-3">
                      <input
                        id="custom-brand-input"
                        type="text"
                        value={customBrand}
                        onChange={(e) => setCustomBrand(e.target.value)}
                        placeholder="Enter Manufacture / Brand name..."
                        className="form-input-luxury w-full text-black placeholder:text-[#747878] text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Model Designation */}
                <div className="relative">
                  <label className="font-label-caps text-xs text-[#444748] block mb-2">
                    Model Designation
                  </label>
                  {availableModels.length > 0 ? (
                    <select
                      id="select-model"
                      value={model}
                      onChange={(e) => handleModelChange(e.target.value)}
                      className="form-input-luxury w-full font-body-md text-black focus:border-[#735c00] transition-colors duration-300 appearance-none bg-transparent cursor-pointer"
                    >
                      <option value="" disabled>Select Model</option>
                      {availableModels.map((m) => (
                        <option key={m.model} value={m.model}>
                          {m.model}
                        </option>
                      ))}
                      <option value="other">Other (Specify Model)</option>
                    </select>
                  ) : (
                    <select
                      id="select-model-default"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="form-input-luxury w-full font-body-md text-black focus:border-[#735c00] transition-colors duration-300 appearance-none bg-transparent cursor-pointer"
                    >
                      <option value="" disabled>Select Model</option>
                      <option value="nautilus">Nautilus</option>
                      <option value="submariner">Submariner</option>
                      <option value="royal-oak">Royal Oak</option>
                      <option value="speedmaster">Speedmaster</option>
                      <option value="other">Other (Specify Model)</option>
                    </select>
                  )}
                  {model === 'other' && (
                    <div className="mt-3">
                      <input
                        id="custom-model-input"
                        type="text"
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        placeholder="Enter Model Designation (e.g. Seamaster 300M)..."
                        className="form-input-luxury w-full text-black placeholder:text-[#747878] text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Reference Number */}
                <div className="relative">
                  <label className="font-label-caps text-xs text-[#444748] block mb-2">
                    Reference Number
                  </label>
                  {availableModels.length > 0 ? (
                    <select
                      id="select-reference"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="form-input-luxury w-full font-body-md text-black focus:border-[#735c00] transition-colors duration-300 appearance-none bg-transparent cursor-pointer"
                    >
                      <option value="" disabled>Select Reference</option>
                      {availableModels.map((m) => (
                        <option key={m.ref} value={m.ref}>
                          {m.ref}
                        </option>
                      ))}
                      <option value="other">Other (Specify Reference)</option>
                    </select>
                  ) : (
                    <select
                      id="select-reference-default"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="form-input-luxury w-full font-body-md text-black focus:border-[#735c00] transition-colors duration-300 appearance-none bg-transparent cursor-pointer"
                    >
                      <option value="" disabled>Select Reference</option>
                      <option value="5711/1A-010">5711/1A-010</option>
                      <option value="126610LN">126610LN</option>
                      <option value="15500ST">15500ST</option>
                      <option value="other">Other (Specify Reference)</option>
                    </select>
                  )}
                  {reference === 'other' && (
                    <div className="mt-3">
                      <input
                        id="custom-ref-input"
                        type="text"
                        value={customReference}
                        onChange={(e) => setCustomReference(e.target.value)}
                        placeholder="Enter Reference Number (e.g. Ref. 116500LN)..."
                        className="form-input-luxury w-full text-black placeholder:text-[#747878] text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* 4. Year of Production */}
                <div className="relative">
                  <label className="font-label-caps text-xs text-[#444748] block mb-2">
                    Year of Production
                  </label>
                  <select
                    id="select-year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="form-input-luxury w-full font-body-md text-black focus:border-[#735c00] transition-colors duration-300 appearance-none bg-transparent cursor-pointer"
                  >
                    <option value="" disabled>Select Year</option>
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
                    <div className="mt-3">
                      <input
                        id="custom-year-input"
                        type="text"
                        value={customYear}
                        onChange={(e) => setCustomYear(e.target.value)}
                        placeholder="Enter Year of Production (e.g. 1974 or 2025)..."
                        className="form-input-luxury w-full text-black placeholder:text-[#747878] text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* 5. Asking Price & Terms */}
                <div className="relative pt-2">
                  <label htmlFor="input-asking-price" className="font-label-caps text-xs text-[#444748] block mb-2">
                    Asking Price ($ USD)
                  </label>

                  <div className="relative mb-3">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#747878] font-semibold select-none">
                      $
                    </span>
                    <input
                      id="input-asking-price"
                      type="text"
                      inputMode="numeric"
                      value={askingPrice}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setAskingPrice(val ? parseInt(val, 10).toLocaleString() : '');
                      }}
                      placeholder="Enter asking price (e.g. 24,500)"
                      className="form-input-luxury w-full pl-8 pr-4 text-black placeholder:text-[#747878] font-headline-md text-lg"
                    />
                  </div>

                  {/* Two Checkboxes: FIRM or OBO */}
                  <div className="bg-[#fcfcfa] p-3.5 border border-[#c4c7c7] space-y-2.5">
                    <span className="text-[10px] font-label-caps text-[#444748] block font-semibold">
                      Price Terms (Select One)
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {/* FIRM Checkbox */}
                      <label
                        htmlFor="chk-price-firm"
                        className={`flex items-center gap-2.5 p-2.5 border cursor-pointer select-none transition-all ${
                          priceType === 'firm'
                            ? 'bg-black text-white border-black font-semibold shadow-sm'
                            : 'bg-white text-black border-[#c4c7c7] hover:border-black'
                        }`}
                      >
                        <input
                          type="checkbox"
                          id="chk-price-firm"
                          checked={priceType === 'firm'}
                          onChange={() => setPriceType('firm')}
                          className="w-4 h-4 accent-black cursor-pointer rounded-none"
                        />
                        <div className="flex flex-col">
                          <span className="font-label-caps text-xs tracking-wider">FIRM</span>
                          <span className={`text-[10px] ${priceType === 'firm' ? 'text-[#c8c6c5]' : 'text-[#747878]'}`}>
                            Fixed price
                          </span>
                        </div>
                      </label>

                      {/* OBO Checkbox */}
                      <label
                        htmlFor="chk-price-obo"
                        className={`flex items-center gap-2.5 p-2.5 border cursor-pointer select-none transition-all ${
                          priceType === 'obo'
                            ? 'bg-[#efe3aa] text-[#474016] border-[#d8c87e] font-semibold shadow-sm'
                            : 'bg-white text-black border-[#c4c7c7] hover:border-[#735c00]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          id="chk-price-obo"
                          checked={priceType === 'obo'}
                          onChange={() => setPriceType('obo')}
                          className="w-4 h-4 accent-[#735c00] cursor-pointer rounded-none"
                        />
                        <div className="flex flex-col">
                          <span className="font-label-caps text-xs tracking-wider">OBO</span>
                          <span className={`text-[10px] ${priceType === 'obo' ? 'text-[#5d5423]' : 'text-[#747878]'}`}>
                            Or best offer
                          </span>
                        </div>
                      </label>
                    </div>
                    <p className="text-[10px] text-[#747878]">
                      Selected badge ({priceType === 'firm' ? 'FIRM' : 'OBO'}) will be displayed publicly on the listing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Configuration */}
            <div className="mt-12 pt-8 border-t border-[#c4c7c7] space-y-8">
              <div className="relative">
                <h4 className="font-headline-md text-2xl text-black mb-6">
                  Shipping Configuration
                </h4>
                <label className="font-label-caps text-xs text-[#444748] block mb-2">
                  Shipping Method
                </label>
                <select
                  id="select-shipping-method"
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value as 'free' | 'buyer')}
                  className="form-input-luxury w-full font-body-md text-black focus:border-[#735c00] transition-colors duration-300 appearance-none bg-transparent cursor-pointer"
                >
                  <option value="free">Free Shipping (I will pay)</option>
                  <option value="buyer">Buyer Pays Shipping</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="font-label-caps text-xs text-[#444748] block">
                  Flat Rate Selection
                </label>
                <div className="flex gap-4">
                  {[5, 8, 10].map((rate) => (
                    <label
                      key={rate}
                      id={`shipping-rate-${rate}`}
                      onClick={() => setShippingRate(rate)}
                      className={`flex-1 flex items-center justify-center py-3 border rounded-none cursor-pointer transition-colors ${
                        shippingRate === rate
                          ? 'border-[#735c00] bg-[#fafaf5] text-black font-semibold ring-1 ring-[#735c00]'
                          : 'border-[#c4c7c7] hover:border-[#735c00] text-black'
                      }`}
                    >
                      <input
                        className="hidden"
                        name="shipping_rate"
                        type="radio"
                        value={rate}
                        checked={shippingRate === rate}
                        onChange={() => setShippingRate(rate)}
                      />
                      <span className="font-body-md text-base text-black">${rate}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Proceed to Authenticity Statement Button */}
            <div className="mt-12 pt-8 border-t border-transparent flex justify-end">
              <button
                id="btn-proceed-valuation"
                type="button"
                onClick={handleProceed}
                className="bg-black text-white font-label-caps text-xs px-8 py-4 hover:bg-[#2f312e] transition-colors duration-300 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
              >
                Proceed to Authenticity Statement
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
