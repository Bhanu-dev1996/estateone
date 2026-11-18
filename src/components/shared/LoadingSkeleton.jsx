import React from 'react';

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border-0 shadow-xs animate-pulse text-left">
      {/* Media skeleton */}
      <div className="aspect-[16/10] w-full bg-slate-200" />
      
      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-slate-200 rounded-lg w-1/3" />
          <div className="h-4 bg-slate-100 rounded w-1/4" />
        </div>
        
        <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
        
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100">
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-full" />
        </div>
        
        <div className="pt-2 flex items-center gap-2">
          <div className="h-9 bg-slate-200 rounded-xl flex-1" />
          <div className="h-9 w-9 bg-slate-200 rounded-xl" />
          <div className="h-9 w-9 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <PropertyCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function PropertyDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse text-left space-y-8">
      {/* Title & Location Skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-slate-200 rounded-xl w-1/2" />
        <div className="h-4 bg-slate-100 rounded w-1/3" />
      </div>

      {/* Gallery Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 aspect-[21/9]">
        <div className="md:col-span-2 bg-slate-200 rounded-3xl" />
        <div className="grid grid-rows-2 gap-4">
          <div className="bg-slate-200 rounded-3xl" />
          <div className="bg-slate-200 rounded-3xl" />
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-32 bg-slate-200 rounded-3xl" />
          <div className="h-48 bg-slate-200 rounded-3xl" />
        </div>
        <div>
          <div className="h-80 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export default PropertyCardSkeleton;
