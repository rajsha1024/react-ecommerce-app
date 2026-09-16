// src/components/SkeletonCard.jsx
import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="mb-4 aspect-square w-full rounded-lg bg-slate-200" />
      {/* Title Skeleton */}
      <div className="h-4 w-3/4 rounded bg-slate-200 mb-2" />
      <div className="h-4 w-1/2 rounded bg-slate-200 mb-4" />
      {/* Rating Skeleton */}
      <div className="h-3 w-1/4 rounded bg-slate-200 mb-6" />
      {/* Price & Button Skeleton */}
      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="h-6 w-1/4 rounded bg-slate-200" />
        <div className="h-8 w-24 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}
