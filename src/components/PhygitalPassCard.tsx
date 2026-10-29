'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  QrCode,
  RotateCcw,
  Share2,
  UserPlus,
  Wifi,
} from 'lucide-react';
import { CittMemberProfile } from '@/types/citt';
import {
  getCampusBySlug,
  getSchoolBySlug,
} from '@/data/citt-catalog';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';
import { downloadMemberVCard } from '@/lib/vcard';
import { useCittNetwork } from '@/context/CittNetworkContext';

export function PhygitalPassCard({
  profile,
  initialShowQR = false,
  showPublicPageLink = true,
}: {
  profile: CittMemberProfile;
  initialShowQR?: boolean;
  showPublicPageLink?: boolean;
}) {
  const { activeUser, isConnected, toggleConnection } = useCittNetwork();
  const [showQRSide, setShowQRSide] = useState(initialShowQR);
  const [copied, setCopied] = useState(false);
  const [originUrl, setOriginUrl] = useState('https://cittconnect.cl');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      setOriginUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    setShowQRSide(initialShowQR);
  }, [initialShowQR, profile.username]);

  const campus = getCampusBySlug(profile.campusSlug);
  const school = getSchoolBySlug(profile.schoolSlug);
  const publicProfileUrl = `${originUrl}/u/${profile.username}`;
  const connected = isConnected(profile.id);
  const isSelf = profile.id === activeUser.id;

  const initials = profile.fullName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicProfileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${profile.fullName} — CITT Connect`,
          text: `${profile.fullName} (${profile.currentOccupation}) en CITT Connect Duoc UC`,
          url: publicProfileUrl,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    handleCopyLink();
  };

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card transition-colors">
        {/* Top School Color Identity Band */}
        <div
          style={{ backgroundColor: school.primaryHex }}
          className="h-2.5 w-full"
        />

        {/* Physical Lanyard Punch-Hole & Hardware Pass Header */}
        <div className="relative border-b border-theme bg-theme-subtle px-6 pt-3 pb-4">
          <div
            aria-hidden="true"
            className="mx-auto mb-3 h-2.5 w-16 rounded-full border border-theme bg-theme-canvas"
          />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/citt-logo.webp"
                alt="Emblema CITT 3D"
                className="h-9 w-9 shrink-0 object-contain"
              />
              <div>
                <p className="text-xs font-black tracking-wider text-theme-primary uppercase">
                  Credencial CITT Connect
                </p>
                <p className="text-xs text-theme-secondary">
                  {campus.name} · {campus.region}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowQRSide((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-3.5 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
            >
              {showQRSide ? (
                <>
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Ver Ficha</span>
                </>
              ) : (
                <>
                  <QrCode className="h-3.5 w-3.5" />
                  <span>Ver Código QR</span>
                </>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {!showQRSide ? (
            <motion.div
              key="pass-front"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 sm:p-7"
            >
              {/* Role & School Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <RoleBadge role={profile.role} size="md" />
                  <SchoolBadge schoolSlug={profile.schoolSlug} size="md" />
                </div>
                {profile.isOpenToCollaborate && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#43B02A] bg-theme-subtle px-3 py-1 text-xs font-bold text-theme-primary">
                    <span className="h-2 w-2 rounded-full bg-[#43B02A]" />
                    Disponible Inter-Sedes
                  </span>
                )}
              </div>

              {/* Member Identity Header with Real Portrait */}
              <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    style={{ borderColor: school.primaryHex }}
                    className="h-24 w-24 shrink-0 rounded-2xl border-2 object-cover"
                  />
                ) : (
                  <div
                    style={{
                      borderColor: school.primaryHex,
                      backgroundColor: `${school.primaryHex}28`,
                    }}
                    className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 text-2xl font-black text-theme-primary"
                  >
                    {initials}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h2 className="text-balance text-2xl font-black tracking-tight text-theme-primary sm:text-3xl">
                    {profile.fullName}
                  </h2>
                  <p className="mt-1 text-sm font-bold text-theme-primary">
                    {profile.currentOccupation}
                  </p>
                  <p className="mt-0.5 font-serif text-xs italic text-theme-secondary">
                    {profile.careerTitle}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-theme-secondary">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-theme-primary">
                      <MapPin className="h-3.5 w-3.5 text-[#FFB800]" />
                      {campus.name}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-[#307FE2]" />
                      {profile.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Role Highlight (Consejero de Carrera or Partner) */}
              {profile.role === 'consejero_carrera' &&
                profile.representedCareerInfo && (
                  <div className="mt-5 border-y border-theme py-3 text-xs text-theme-primary">
                    <p className="font-bold">
                      Puente Oficial Consejero de Carrera ↔ Alumnos Duoc UC:
                    </p>
                    <p className="mt-1 leading-relaxed text-theme-secondary">
                      {profile.representedCareerInfo}
                    </p>
                  </div>
                )}

              {profile.role === 'partner' && profile.partnerOrganization && (
                <div className="mt-5 border-y border-theme py-3 text-xs text-theme-primary">
                  <p className="font-bold">
                    Organización Partner Vinculada al CITT:
                  </p>
                  <p className="mt-1 leading-relaxed text-theme-secondary">
                    {profile.partnerOrganization}
                  </p>
                </div>
              )}

              {/* Bio */}
              {profile.bio && (
                <p className="mt-5 max-w-[65ch] text-sm leading-relaxed text-theme-secondary">
                  {profile.bio}
                </p>
              )}

              {/* Specialties / Especialidades */}
              <div className="mt-5">
                <p className="text-xs font-bold tracking-wider text-theme-secondary uppercase">
                  Especialidades & Áreas de Dominio
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {profile.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-lg bg-theme-elevated px-3 py-1.5 text-xs font-semibold text-theme-primary"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Contact & Social Networks */}
              <div className="mt-6">
                <p className="text-xs font-bold tracking-wider text-theme-secondary uppercase">
                  Canales de Contacto y Redes Profesionales
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-xs font-bold text-theme-primary transition hover:border-[#FFB800]"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-[#FFB800]" />
                    <span className="truncate">Enviar Correo</span>
                  </a>

                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-xs font-bold text-theme-primary transition hover:border-[#307FE2]"
                    >
                      <Linkedin className="h-4 w-4 shrink-0 text-[#307FE2]" />
                      <span className="truncate">LinkedIn</span>
                    </a>
                  )}

                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-xs font-bold text-theme-primary transition hover:border-theme-strong"
                    >
                      <Github className="h-4 w-4 shrink-0" />
                      <span className="truncate">GitHub</span>
                    </a>
                  )}

                  {profile.portfolioUrl && (
                    <a
                      href={profile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-xs font-bold text-theme-primary transition hover:border-[#FFB800]"
                    >
                      <Globe className="h-4 w-4 shrink-0 text-[#FFB800]" />
                      <span className="truncate">Portafolio / Web</span>
                    </a>
                  )}

                  {profile.instagramUrl && (
                    <a
                      href={profile.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-xs font-bold text-theme-primary transition hover:border-theme-strong"
                    >
                      <Instagram className="h-4 w-4 shrink-0 text-[#D50032]" />
                      <span className="truncate">Instagram</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Primary Action Bar: + Connect, Save Contact (.vcf), QR & Share */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-theme pt-5">
                {!isSelf && (
                  <button
                    type="button"
                    onClick={() => toggleConnection(profile.id)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                      connected
                        ? 'bg-theme-inverse text-theme-text-inverse'
                        : 'bg-[#FFB800] text-[#1A1A1A] hover:bg-[#ffc633]'
                    }`}
                  >
                    {connected ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Conectado</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        <span>+ Connect</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    downloadMemberVCard(profile, publicProfileUrl)
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FFB800] px-4 py-3 text-sm font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                >
                  <Download className="h-4 w-4" />
                  <span>Guardar Contacto (.vcf)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQRSide(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-4 py-3 text-sm font-bold text-[#FFFFFF] transition hover:bg-[#333333]"
                >
                  <QrCode className="h-4 w-4 text-[#FFB800]" />
                  <span>Código QR</span>
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  title="Compartir o copiar enlace público"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-theme bg-theme-elevated px-3.5 py-3 text-xs font-bold text-theme-primary transition hover:border-[#FFB800]"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-[#43B02A]" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      <span>Compartir</span>
                    </>
                  )}
                </button>
              </div>

              {showPublicPageLink && (
                <div className="mt-4 flex items-center justify-between border-t border-theme pt-3 text-xs text-theme-secondary">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-theme-primary">
                    <Wifi className="h-3.5 w-3.5 text-[#FFB800]" />
                    /u/{profile.username}
                  </span>
                  <Link
                    href={`/u/${profile.username}`}
                    className="inline-flex items-center gap-1 font-bold text-theme-primary hover:underline"
                  >
                    <span>Abrir perfil público dedicado</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="pass-qr"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center p-6 text-center sm:p-8"
            >
              <div className="mb-3 flex items-center gap-2">
                <RoleBadge role={profile.role} showTooltip={false} />
                <SchoolBadge schoolSlug={profile.schoolSlug} />
              </div>

              <h3 className="text-2xl font-black text-theme-primary">
                {profile.fullName}
              </h3>
              <p className="mt-1 text-sm font-bold text-theme-secondary">
                {profile.currentOccupation}
              </p>

              {/* High-Contrast Duoc Neutral (#EEEEEE) QR Surface */}
              <div className="mt-5 rounded-2xl border-2 border-[#FFB800] bg-[#EEEEEE] p-5 shadow-md">
                <QRCodeSVG
                  value={publicProfileUrl}
                  size={220}
                  bgColor="#EEEEEE"
                  fgColor="#000000"
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: '/assets/citt-logo.webp',
                    height: 48,
                    width: 48,
                    excavate: true,
                  }}
                />
              </div>

              <p className="mt-4 max-w-[48ch] text-xs leading-relaxed text-theme-secondary">
                Escanea este código QR con cualquier cámara móvil para abrir el
                perfil público de{' '}
                <strong className="text-theme-primary">{profile.fullName}</strong>{' '}
                en CITT Connect sin instalar aplicaciones.
              </p>

              <div className="mt-4 flex w-full max-w-sm items-center justify-between gap-2 rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-xs">
                <span className="truncate font-mono text-theme-primary">
                  {publicProfileUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#FFB800] px-3 py-1.5 font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar URL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    downloadMemberVCard(profile, publicProfileUrl)
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar Contacto (.vcf)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowQRSide(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-theme bg-theme-elevated px-4 py-2.5 text-xs font-bold text-theme-primary transition hover:border-[#FFB800]"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Volver a la ficha</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
