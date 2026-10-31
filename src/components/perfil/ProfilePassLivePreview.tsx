'use client';

import React from 'react';
import { CittMemberProfile } from '@/types/citt';
import { PhygitalPassCard } from '@/components/PhygitalPassCard';

interface ProfilePassLivePreviewProps {
  profile: CittMemberProfile;
  previewInQrMode: boolean;
}

export function ProfilePassLivePreview({
  profile,
  previewInQrMode,
}: ProfilePassLivePreviewProps) {
  return (
    <div className="space-y-4 lg:col-span-5">
      <div className="sticky top-24 space-y-3">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold tracking-wider text-theme-primary uppercase">
            Vista Previa en Vivo (Credencial & QR)
          </p>
          <span className="text-xs text-theme-secondary">
            Haz clic en &ldquo;Ver Código QR&rdquo; en la tarjeta
          </span>
        </div>
        <PhygitalPassCard
          profile={profile}
          initialShowQR={previewInQrMode}
        />
      </div>
    </div>
  );
}
