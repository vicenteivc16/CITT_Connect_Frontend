'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function NfcTagRedirectPage() {
  const params = useParams<{ tag_uid: string }>();
  const router = useRouter();

  useEffect(() => {
    if (params.tag_uid) {
      router.replace(`/u/${params.tag_uid}`);
    }
  }, [params.tag_uid, router]);

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-theme bg-theme-surface p-8 text-center shadow-theme-card">
      <img
        src="/assets/citt-logo.webp"
        alt="Emblema CITT 3D"
        className="mx-auto h-14 w-14 animate-pulse object-contain"
      />
      <h1 className="mt-4 text-lg font-bold text-theme-primary">
        Resolviendo Pin NFC 3D...
      </h1>
      <p className="mt-1 text-xs text-theme-secondary">
        Redirigiendo al perfil público en CITT Connect.
      </p>
    </div>
  );
}
