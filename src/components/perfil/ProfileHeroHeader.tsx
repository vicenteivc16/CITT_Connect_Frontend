'use client';

import React from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Building2,
  Check,
  Clock,
  Copy,
  Edit3,
  GraduationCap,
  Mail,
  MapPin,
  QrCode,
  Share2,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { getCampusBySlug, getSchoolBySlug, ROLE_CONFIG } from '@/data/citt-catalog';
import { CittMemberProfile, ConnectionStatus } from '@/types/citt';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';
import { PhygitalPassCard } from '@/components/PhygitalPassCard';

interface ProfileHeroHeaderProps {
  member: CittMemberProfile;
  isSelf: boolean;
  isAuthenticated: boolean;
  connStatus: ConnectionStatus;
  copied: boolean;
  qrModalOpen: boolean;
  onSetQrModalOpen: (open: boolean) => void;
  onCopyUrl: () => void;
  onConnectAction: () => void;
  onAcceptConnection: () => void;
  onRejectConnection: () => void;
}

export function ProfileHeroHeader({
  member,
  isSelf,
  isAuthenticated,
  connStatus,
  copied,
  qrModalOpen,
  onSetQrModalOpen,
  onCopyUrl,
  onConnectAction,
  onAcceptConnection,
  onRejectConnection,
}: ProfileHeroHeaderProps) {
  const campus = getCampusBySlug(member.campusSlug);
  const school = getSchoolBySlug(member.schoolSlug);
  const roleInfo = ROLE_CONFIG[member.role];
  const bannerImage = member.bannerUrl || '/assets/citt-hero-lobby.webp';

  const initials = member.fullName
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <section
      aria-label={`Cabecera de perfil de ${member.fullName}`}
      className="overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card"
    >
      {/* Cinta Cromática Oficial de la Escuela Duoc UC */}
      <div
        style={{ backgroundColor: school.primaryHex }}
        className="h-2.5 w-full"
      />

      {/* Banner de Portada Personalizable */}
      <div className="relative h-48 w-full overflow-hidden bg-theme-subtle sm:h-60 lg:h-64">
        <img
          src={bannerImage}
          alt={`Banner de portada de ${member.fullName}`}
          onError={(e) => {
            e.currentTarget.src = '/assets/citt-hero-lobby.webp';
          }}
          className="h-full w-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/10"
        />

        {/* Insignias Flotantes sobre el Banner */}
        <div className="absolute top-4 right-4 left-4 flex flex-wrap items-center justify-between gap-2 sm:top-5 sm:right-6 sm:left-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A]/85 px-3.5 py-1.5 text-xs font-bold text-[#FFFFFF] backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5 text-[#FFB800]" />
            <span>
              {campus.name} · Región {campus.region}
            </span>
          </span>

          {member.isOpenToCollaborate && (
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A]/85 px-3.5 py-1.5 text-xs font-bold text-[#FFFFFF] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#43B02A]" />
              <span>Disponible para Proyectos Inter-Sedes</span>
            </span>
          )}
        </div>
      </div>

      {/* Cubierta Principal de Identidad, Rol y Acciones Ejecutivas */}
      <div className="px-6 pb-7 sm:px-8 sm:pb-8">
        {/* Fila de Avatar Superpuesto + Botonera de Red Social */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative -mt-14 sm:-mt-16">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.fullName}
                style={{ borderColor: school.primaryHex }}
                className="h-28 w-28 rounded-3xl border-4 bg-theme-surface object-cover shadow-theme-card sm:h-32 sm:w-32"
              />
            ) : (
              <div
                style={{ borderColor: school.primaryHex }}
                className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 bg-theme-subtle text-3xl font-black text-theme-primary shadow-theme-card sm:h-32 sm:w-32"
              >
                {initials}
              </div>
            )}
          </div>

          {/* Acciones Primarias (+ Connect Bilateral, Guardar vCard, Pase QR, Compartir) */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 sm:pt-4">
            {!isSelf ? (
              !isAuthenticated ? (
                <Link
                  href={`/acceso?redirect=/u/${member.username}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633] sm:text-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>+ Connect</span>
                </Link>
              ) : connStatus === 'connected' ? (
                <button
                  type="button"
                  onClick={onConnectAction}
                  title="Haz clic para desvincular"
                  className="inline-flex items-center gap-2 rounded-xl bg-theme-inverse px-5 py-2.5 text-xs font-bold text-theme-text-inverse transition hover:opacity-85 sm:text-sm"
                >
                  <UserCheck className="h-4 w-4 text-[#43B02A]" />
                  <span>Conectado en mi Red</span>
                </button>
              ) : connStatus === 'pending_sent' ? (
                <button
                  type="button"
                  onClick={onConnectAction}
                  title="Haz clic para cancelar solicitud"
                  className="inline-flex items-center gap-2 rounded-xl border border-theme bg-theme-subtle px-4 py-2.5 text-xs font-bold text-theme-secondary transition hover:border-[#E87722] hover:text-[#E87722] sm:text-sm"
                >
                  <Clock className="h-4 w-4 text-[#FFB800]" />
                  <span>Solicitud Enviada (Cancelar)</span>
                </button>
              ) : connStatus === 'pending_received' ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onAcceptConnection}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#43B02A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#389623] sm:text-sm"
                  >
                    <Check className="h-4 w-4" />
                    <span>Aceptar Vínculo</span>
                  </button>
                  <button
                    type="button"
                    onClick={onRejectConnection}
                    className="inline-flex items-center gap-1 rounded-xl border border-theme bg-theme-surface px-3 py-2.5 text-xs font-bold text-theme-secondary transition hover:text-red-500 sm:text-sm"
                  >
                    <X className="h-4 w-4" />
                    <span>Ignorar</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onConnectAction}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633] sm:text-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>+ Connect</span>
                </button>
              )
            ) : (
              <Link
                href="/mi-perfil"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633] sm:text-sm"
              >
                <Edit3 className="h-4 w-4" />
                <span>Personalizar Banner y Datos</span>
              </Link>
            )}

            {/* Radix Dialog: Pase QR Phygital */}
            <Dialog.Root open={qrModalOpen} onOpenChange={onSetQrModalOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-4 py-2.5 text-xs font-bold text-[#FFFFFF] transition hover:bg-[#333333] sm:text-sm"
                >
                  <QrCode className="h-4 w-4 text-[#FFB800]" />
                  <span>Pase QR Phygital</span>
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
                <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[92vh] w-[94vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl focus:outline-none">
                  <div className="mb-2.5 flex items-center justify-between px-1">
                    <Dialog.Title className="text-sm font-bold text-white">
                      Pase Phygital & Código QR ({member.fullName})
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Cerrar modal QR"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-[#1A1A1A] text-white hover:border-[#FFB800]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <PhygitalPassCard
                    profile={member}
                    initialShowQR={true}
                    showPublicPageLink={false}
                  />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <button
              type="button"
              onClick={onCopyUrl}
              className="inline-flex items-center gap-1.5 rounded-xl bg-theme-subtle px-3.5 py-2.5 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-[#43B02A]" />
                  <span>Enlace Copiado</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span>Compartir</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Datos Principales de Identidad Académica y Profesional */}
        <div className="mt-5 grid grid-cols-1 gap-6 border-t border-theme pt-5 lg:grid-cols-12">
          <div className="space-y-2.5 lg:col-span-8">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight text-theme-primary sm:text-3xl lg:text-4xl">
                {member.fullName}
              </h1>
              <RoleBadge role={member.role} size="md" />
              <SchoolBadge schoolSlug={member.schoolSlug} size="md" />
            </div>

            <p className="text-base font-bold text-theme-primary sm:text-lg">
              {member.currentOccupation}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-theme-secondary sm:text-sm">
              <span className="inline-flex items-center gap-1.5 text-theme-primary">
                <GraduationCap className="h-4 w-4 text-[#FFB800]" />
                <span>{member.careerTitle}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-[#307FE2]" />
                <span>{school.name}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-[#43B02A]" />
                <span>{member.email}</span>
              </span>
            </div>
          </div>

          {/* Síntesis de Track Académico y Autoridad CITT */}
          <div className="flex flex-col justify-center space-y-2 border-t border-theme pt-4 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <p className="text-xs font-bold text-theme-primary">
              {member.academicTrack ||
                'Track de Innovación & Transferencia Tecnológica CITT'}
            </p>
            <p className="text-xs leading-relaxed text-theme-secondary">
              {roleInfo.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
