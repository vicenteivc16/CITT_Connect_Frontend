'use client';

import React from 'react';
import { ImageIcon } from 'lucide-react';
import { CITT_BANNER_PRESETS } from '@/data/citt-catalog';

interface ProfileBannersSelectorProps {
  currentBannerUrl?: string;
  onSelectBanner: (url: string) => void;
}

export function ProfileBannersSelector({
  currentBannerUrl,
  onSelectBanner,
}: ProfileBannersSelectorProps) {
  return (
    <div className="space-y-3">
      <h2 className="flex items-center gap-2 text-sm font-bold text-theme-primary">
        <ImageIcon className="h-4 w-4 text-[#FFB800]" />
        <span>Banner de Portada Duoc UC</span>
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {CITT_BANNER_PRESETS.map((preset) => {
          const isSelected = currentBannerUrl === preset.imageUrl;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectBanner(preset.imageUrl)}
              className={`flex flex-col items-start rounded-xl p-2 text-left text-xs transition ${
                isSelected
                  ? 'bg-[#FFB800] font-bold text-[#1A1A1A]'
                  : 'border border-theme bg-theme-elevated text-theme-primary hover:border-[#FFB800]'
              }`}
            >
              <span className="line-clamp-1 font-bold">
                {preset.category}
              </span>
              <span
                className={`line-clamp-1 text-xs ${
                  isSelected ? 'text-[#1A1A1A]/80' : 'text-theme-secondary'
                }`}
              >
                {preset.label}
              </span>
            </button>
          );
        })}
      </div>

      <div>
        <label className="block text-xs font-bold text-theme-primary">
          URL de Banner Personalizado (Opcional)
        </label>
        <input
          type="text"
          value={currentBannerUrl || ''}
          onChange={(e) => onSelectBanner(e.target.value)}
          placeholder="/assets/citt-hero-lobby.webp o https://..."
          className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
        />
      </div>
    </div>
  );
}
