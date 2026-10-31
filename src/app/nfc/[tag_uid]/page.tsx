'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  LogIn,
  Radio,
  ShieldAlert,
  Sparkles,
  Tag,
  UserCheck,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import { RoleBadge } from '@/components/RoleBadge';
import { getCampusBySlug } from '@/data/citt-catalog';
import { CittNfcTag } from '@/types/citt';

export default function NfcTagResolverPage() {
  const params = useParams<{ tag_uid: string }>();
  const router = useRouter();
  const { resolveNfcTag, claimNfcTag, activeUser, isAuthenticated } =
    useCittNetwork();

  const [resolution, setResolution] = useState<{
    status: 'active' | 'unassigned' | 'suspended' | 'not_found';
    username?: string;
    tag?: CittNfcTag;
  } | null>(null);

  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.tag_uid) return;
    const res = resolveNfcTag(params.tag_uid);
    setResolution(res);

    // Si ya está activo y asignado a un usuario, redirigir fluidamente al perfil público
    if (res.status === 'active' && res.username) {
      const timer = setTimeout(() => {
        router.replace(`/u/${res.username}`);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [params?.tag_uid, resolveNfcTag, router]);

  const handleClaim = () => {
    if (!params?.tag_uid) return;
    setIsClaiming(true);
    const result = claimNfcTag(params.tag_uid, activeUser.username);
    if (result.success) {
      setClaimSuccessMsg(result.message);
      setTimeout(() => {
        router.replace(`/u/${activeUser.username}`);
      }, 1200);
    }
    setIsClaiming(false);
  };

  const tagUid = params?.tag_uid || 'UID-DESCONOCIDO';

  // 1. Estado de Carga Inicial o Redirección Activa
  if (!resolution || (resolution.status === 'active' && resolution.username)) {
    return (
      <div className="mx-auto my-12 max-w-md rounded-3xl border border-theme bg-theme-surface p-8 text-center shadow-theme-card">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FFB800]/15 text-[#FFB800]">
          <Cpu className="h-10 w-10 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFB800] opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-[#FFB800]"></span>
          </span>
        </div>

        <h1 className="mt-5 font-serif text-xl font-black text-theme-primary">
          Resolviendo Pin NFC 3D CITT
        </h1>
        <p className="mt-1.5 text-xs text-theme-secondary">
          Verificando identificador criptográfico{' '}
          <code className="rounded bg-theme-subtle px-1.5 py-0.5 font-mono text-[#307FE2]">
            {tagUid}
          </code>
        </p>

        {resolution?.username && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-[#43B02A]/30 bg-[#43B02A]/10 px-4 py-2 text-xs font-bold text-[#43B02A]">
            <CheckCircle2 className="h-4 w-4" />
            <span>Redirigiendo al perfil @{resolution.username}...</span>
          </div>
        )}
      </div>
    );
  }

  // 2. Pin Suspendido
  if (resolution.status === 'suspended') {
    return (
      <div className="mx-auto my-12 max-w-md rounded-3xl border border-red-500/30 bg-theme-surface p-8 text-center shadow-theme-card">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-4 font-serif text-xl font-black text-theme-primary">
          Pin NFC Suspendido
        </h1>
        <p className="mt-2 text-xs text-theme-secondary leading-relaxed">
          El hardware identificado con UID{' '}
          <strong className="text-theme-primary">{tagUid}</strong> ha sido
          pausado preventivamente por la coordinación CITT de su sede.
        </p>
        <div className="mt-6">
          <Link
            href="/directorio"
            className="inline-flex items-center gap-2 rounded-xl bg-theme-subtle px-4 py-2 text-xs font-bold text-theme-primary hover:bg-theme-elevated"
          >
            <span>Explorar Directorio Nacional</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // 3. Pin Sin Asignar (Unassigned / Claim Flow)
  return (
    <div className="mx-auto my-8 max-w-lg rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-theme-card">
      {/* Encabezado Phygital */}
      <div className="text-center space-y-3">
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFB800]/15 text-[#FFB800]">
          <Radio className="h-8 w-8" />
          <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-[#FFB800] animate-bounce" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB800]/30 bg-[#FFB800]/10 px-3 py-1 text-[11px] font-black text-[#FFB800] uppercase tracking-wider">
            Hardware Phygital CITT
          </span>
          <h1 className="font-serif mt-2 text-2xl font-black text-theme-primary sm:text-3xl">
            ¡Pin Físico 3D CITT Detectado!
          </h1>
          <p className="mt-1 text-xs text-theme-secondary">
            Dispositivo NFC impreso en 3D listo para vincularse
          </p>
        </div>
      </div>

      {/* Tarjeta de Metadatos del Hardware */}
      <div className="my-6 space-y-3 rounded-2xl border border-theme bg-theme-subtle p-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-theme-secondary">Identificador UID:</span>
          <code className="rounded bg-theme-canvas px-2 py-0.5 font-mono font-bold text-[#307FE2]">
            {tagUid}
          </code>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-theme-secondary">Estado del Chip:</span>
          <span className="rounded-full bg-[#FFB800]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#FFB800]">
            Disponible para vincular
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-theme-secondary">Lote de Fabricación:</span>
          <span className="font-semibold text-theme-primary">
            {resolution.tag?.batchLabel || 'Lote Duoc UC Maker Space'}
          </span>
        </div>
      </div>

      {claimSuccessMsg ? (
        <div className="rounded-2xl border border-[#43B02A]/40 bg-[#43B02A]/10 p-5 text-center space-y-2">
          <CheckCircle2 className="mx-auto h-8 w-8 text-[#43B02A]" />
          <h4 className="font-serif text-sm font-bold text-[#43B02A]">
            ¡Vinculación Exitosa!
          </h4>
          <p className="text-xs text-theme-secondary">{claimSuccessMsg}</p>
          <p className="text-[11px] text-theme-secondary">
            Redirigiendo a tu perfil con credencial NFC activa...
          </p>
        </div>
      ) : isAuthenticated ? (
        /* Usuario Autenticado -> 1-Click Claim */
        <div className="space-y-4">
          <div className="rounded-2xl border border-theme bg-theme-surface p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-theme-secondary">
              Vincular a tu cuenta activa:
            </p>
            <div className="mt-2.5 flex items-center gap-3">
              <img
                src={activeUser.avatarUrl || '/assets/citt-logo.webp'}
                alt={activeUser.fullName}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[#FFB800]"
              />
              <div className="min-w-0 flex-1 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-theme-primary truncate">
                    {activeUser.fullName}
                  </span>
                  <RoleBadge role={activeUser.role} showTooltip={false} />
                </div>
                <p className="text-[11px] text-theme-secondary truncate">
                  @{activeUser.username} ·{' '}
                  {getCampusBySlug(activeUser.campusSlug).shortName}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClaim}
            disabled={isClaiming}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-5 py-3.5 text-xs font-black text-[#1A1A1A] shadow-md transition hover:bg-[#ffc633] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <UserCheck className="h-4 w-4" />
            <span>
              {isClaiming
                ? 'Grabando asignación en red CITT...'
                : `Vincular Pin a mi Perfil (@${activeUser.username})`}
            </span>
          </button>

          <p className="text-center text-[11px] text-theme-secondary">
            Cada vez que acerquen un smartphone a este pin 3D, abrirá
            instantáneamente tu credencial digital CITT Connect.
          </p>
        </div>
      ) : (
        /* Usuario No Autenticado -> Solicitar Login */
        <div className="space-y-4 text-center">
          <p className="text-xs text-theme-secondary leading-relaxed">
            Para reclamar y programar este pin físico a tu identidad estudiantil,
            inicia sesión o regístrate con tu correo Duoc UC.
          </p>

          <div className="flex flex-col gap-2">
            <Link
              href={`/acceso?redirect=/nfc/${tagUid}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-5 py-3 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633]"
            >
              <LogIn className="h-4 w-4" />
              <span>Iniciar Sesión y Reclamar Pin</span>
            </Link>

            <Link
              href="/directorio"
              className="inline-flex items-center justify-center gap-1 rounded-2xl border border-theme px-4 py-2.5 text-xs font-semibold text-theme-secondary hover:bg-theme-subtle hover:text-theme-primary"
            >
              <span>Explorar la red sin vincular</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
