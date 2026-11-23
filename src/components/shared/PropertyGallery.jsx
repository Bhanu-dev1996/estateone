import React, { useState, useEffect } from 'react';
import { 
  CaretLeft, 
  CaretRight, 
  Images, 
  ShieldCheck, 
  PlayCircle,
  Blueprint,
  VideoCamera
} from '@phosphor-icons/react';
import { Dialog, DialogContent } from '../ui/dialog';
import {
  resolvePropertyVideoSource,
  pickDummyPropertyVideo,
  pickDummyFloorPlan,
  isUsableFloorPlanUrl,
} from '../../lib/propertyMedia';

export default function PropertyGallery({ 
  images = [], 
  title = 'Verified residence',
  verified = true,
  videoUrl = '',
  floorPlanImage = '',
  className = '' 
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('photos'); // 'photos' | 'video' | 'floorplan'
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80'
  ];

  const total = displayImages.length;

  const floorPlanSrc = isUsableFloorPlanUrl(floorPlanImage)
    ? floorPlanImage.trim()
    : pickDummyFloorPlan(title);
  const showFloorPlanTab = Boolean(floorPlanSrc);
  const showVideoTab = Boolean(videoUrl?.trim());
  const videoSource = resolvePropertyVideoSource(videoUrl);
  const activeVideo =
    videoSource.kind !== 'none'
      ? videoSource
      : showVideoTab
        ? resolvePropertyVideoSource(pickDummyPropertyVideo(title))
        : null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (activeTab === 'photos') {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
      if (e.key === 'Escape') setLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, activeTab, total]);

  return (
    <>
      {/* Editorial Thumbnail Grid per PRD 4.1 & 5.5 */}
      <div className={`relative rounded-3xl overflow-hidden bg-slate-100 ${className}`}>
        
        {/* Desktop 5 Photo Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 aspect-[16/9] md:aspect-[21/9]">
          
          {/* Main Hero Photo (Takes 2 cols) */}
          <div 
            onClick={() => {
              setActiveTab('photos');
              setCurrentIndex(0);
              setLightboxOpen(true);
            }}
            className="md:col-span-2 relative h-full overflow-hidden cursor-pointer group"
          >
            <img
              src={displayImages[0]}
              alt={`${title} main view`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {verified && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-semibold shadow-xs">
                <ShieldCheck size={14} weight="fill" />
                <span>Verified photograph</span>
              </span>
            )}
          </div>

          {/* Secondary Thumbnail Grid (2 cols) */}
          <div className="hidden md:grid grid-cols-2 col-span-2 gap-2 h-full">
            {displayImages.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActiveTab('photos');
                  setCurrentIndex(idx + 1);
                  setLightboxOpen(true);
                }}
                className="relative overflow-hidden cursor-pointer group h-full"
              >
                <img
                  src={img}
                  alt={`${title} photograph ${idx + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

        </div>

        {/* Floating Quick Media Action Buttons (PRD 5.5) */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 flex-wrap">
          
          {/* Video Tour Button */}
          {showVideoTab && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('video');
                setLightboxOpen(true);
              }}
              className="min-h-10 button-sm flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-900 text-white shadow-md backdrop-blur-md transition-all cursor-pointer"
            >
              <PlayCircle size={16} weight="fill" className="text-brand-gold" />
              <span>Video tour</span>
            </button>
          )}

          {/* Floor Plan Button */}
          {showFloorPlanTab && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('floorplan');
                setLightboxOpen(true);
              }}
              className="min-h-10 button-sm flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-brand-navy shadow-md backdrop-blur-md transition-all cursor-pointer"
            >
              <Blueprint size={16} weight="bold" />
              <span>Floor plan</span>
            </button>
          )}

          {/* View all photos button */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('photos');
              setCurrentIndex(0);
              setLightboxOpen(true);
            }}
            className="min-h-10 button-sm flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/95 hover:bg-white text-brand-navy shadow-md backdrop-blur-md transition-all cursor-pointer"
          >
            <Images size={16} weight="bold" />
            <span>View all {total} photographs</span>
          </button>

        </div>

      </div>

      {/* Full Screen Interactive Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showClose
          closeClassName="right-5 top-5 z-20 text-slate-300 hover:text-white hover:bg-white/10 focus-visible:ring-white/40"
          className="max-w-6xl w-[95vw] h-[90vh] p-0 rounded-3xl bg-slate-950 border-0 shadow-2xl flex flex-col overflow-hidden text-white"
        >
          
          {/* Lightbox Top Header & Tab Controls */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-small font-semibold text-white tracking-tight">{title}</p>
                <p className="text-small text-slate-400 mt-0.5">
                  {activeTab === 'photos' && `Photograph ${currentIndex + 1} of ${total}`}
                  {activeTab === 'video' && 'Sample walkthrough preview (demo media)'}
                  {activeTab === 'floorplan' && 'Sample layout drawing (demo)'}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="hidden sm:flex items-center bg-white/10 p-1 rounded-full text-caption">
                <button
                  type="button"
                  onClick={() => setActiveTab('photos')}
                  className={`px-3 py-1 rounded-full font-semibold transition-all ${
                    activeTab === 'photos' ? 'bg-white text-brand-navy' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Photographs ({total})
                </button>
                {showFloorPlanTab && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('floorplan')}
                    className={`px-3 py-1 rounded-full font-semibold transition-all ${
                      activeTab === 'floorplan' ? 'bg-white text-brand-navy' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Floor plan
                  </button>
                )}
                {showVideoTab && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('video')}
                    className={`px-3 py-1 rounded-full font-semibold transition-all ${
                      activeTab === 'video' ? 'bg-white text-brand-navy' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Video tour
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Lightbox Main Stage */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden p-4">
            
            {activeTab === 'photos' && (
              <>
                <img
                  src={displayImages[currentIndex]}
                  alt={`${title} preview ${currentIndex + 1}`}
                  className="max-h-full max-w-full object-contain rounded-2xl select-none"
                />

                {/* Previous Arrow */}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous photograph"
                  className="absolute left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
                >
                  <CaretLeft size={20} weight="bold" />
                </button>

                {/* Next Arrow */}
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next photograph"
                  className="absolute right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
                >
                  <CaretRight size={20} weight="bold" />
                </button>
              </>
            )}

            {activeTab === 'floorplan' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <img
                  src={floorPlanSrc}
                  alt={`${title} architectural floor plan layout`}
                  className="max-h-full max-w-full object-contain rounded-2xl bg-white p-4 shadow-inner"
                />
              </div>
            )}

            {activeTab === 'video' && (
              <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                {!activeVideo ? (
                  <div className="flex h-full items-center justify-center p-8 text-center text-slate-400">
                    <VideoCamera size={48} className="mx-auto mb-2 text-slate-600" aria-hidden />
                    <p className="text-small font-semibold">Video walkthrough is not available for this listing yet.</p>
                  </div>
                ) : activeVideo.kind === 'file' ? (
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-contain bg-black"
                    title={`${title} video tour`}
                  >
                    <source src={activeVideo.src} />
                    <track kind="captions" />
                  </video>
                ) : (
                  <iframe
                    src={activeVideo.src}
                    title={`${title} video tour`}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                )}
              </div>
            )}

          </div>

          {/* Thumbnail Strip (only for photos) */}
          {activeTab === 'photos' && (
            <div className="p-4 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto shrink-0">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-14 h-10 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    currentIndex === idx ? 'border-brand-gold scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </DialogContent>
      </Dialog>
    </>
  );
}
