'use client';

import React from 'react';
import Link from 'next/link';
import {
  Check,
  Clock,
  Download,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  QrCode,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { getCampusBySlug, getSchoolBySlug } from '@/data/citt-catalog';
import { CittMemberProfile, ConnectionStatus } from '@/types/citt';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';
import { downloadMemberVCard } from '@/lib/vcard';

interface MemberDirectoryCardProps {
  member: CittMemberProfile;
  isSelf: boolean;
  connStatus: ConnectionStatus;
  onConnectAction: (member: CittMemberProfile) => void;
  onAcceptConnection: (memberId: string) => void;
  onRejectConnection: (memberId: string) => void;
  onOpenQr: (member: CittMemberProfile) => void;
  onSelectSpecialty: (specialty: string) => void;
}

export function MemberDirectoryCard({
  member,
  isSelf,
  connStatus,
  onConnectAction,
  onAcceptConnection,
  onRejectConnection,
  onOpenQr,
  onSelectSpecialty,
}: MemberDirectoryCardProps) {
  const campus = getCampusBySlug(member.campusSlug);
  const school = getSchoolBySlug(member.schoolSlug);

  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card transition duration-200 hover:shadow-lg">
      {/* Top School Color Strip */}
      <div
        style={{ backgroundColor: school.primaryHex }}
        className="h-2 w-full"
      />

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* Lanyard Cutout + Role/School Badges */}
          <div
            aria-hidden="true"
            className="mx-auto mb-3.5 h-2 w-12 rounded-full border border-theme bg-theme-subtle"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <RoleBadge role={member.role} />
            <SchoolBadge schoolSlug={member.schoolSlug} />
          </div>

          {/* Crisp Portrait & Identity */}
          <div className="mt-5 flex items-center gap-4">
            <img
              src={member.avatarUrl || '/assets/citt-logo.webp'}
              alt={member.fullName}
              style={{ borderColor: school.primaryHex }}
              className="h-16 w-16 shrink-0 rounded-2xl border-2 object-cover"
            />

            <div className="min-w-0 flex-1">
              <Link
                href={`/u/${member.username}`}
                className="block truncate text-lg font-black text-theme-primary hover:underline focus:outline-none"
              >
                {member.fullName}
              </Link>
              <p className="line-clamp-1 text-xs font-bold text-theme-primary">
                {member.currentOccupation}
              </p>
              <p className="mt-0.5 truncate font-serif text-xs italic text-theme-secondary">
                {member.careerTitle}
              </p>
            </div>
          </div>

          {/* Campus, Region & Email */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-y border-theme py-2.5 text-xs text-theme-primary">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <MapPin className="h-3.5 w-3.5 text-[#FFB800]" />
              {campus.shortName} ({campus.region})
            </span>
            <span className="inline-flex items-center gap-1.5 truncate text-theme-secondary">
              <Mail className="h-3.5 w-3.5 text-[#307FE2]" />
              {member.email}
            </span>
          </div>

          {/* Special Role Context */}
          {member.role === 'consejero_carrera' &&
            member.representedCareerInfo && (
              <p className="mt-3 border-b border-theme pb-2.5 text-xs text-theme-secondary">
                <strong className="font-bold text-theme-primary">
                  Puente Carrera:{' '}
                </strong>
                {member.representedCareerInfo}
              </p>
            )}

          {member.role === 'partner' && member.partnerOrganization && (
            <p className="mt-3 border-b border-theme pb-2.5 text-xs text-theme-secondary">
              <strong className="font-bold text-theme-primary">
                Partner:{' '}
              </strong>
              {member.partnerOrganization}
            </p>
          )}

          {/* Specialties */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {(member.specialties || []).slice(0, 4).map((spec) => (
              <span
                key={spec}
                onClick={() => onSelectSpecialty(spec)}
                className="cursor-pointer rounded-lg bg-theme-elevated px-2.5 py-1 text-xs font-semibold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                title={`Filtrar por ${spec}`}
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer: + Connect Engine (Bilateral) + QR + vCard + Ficha */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-theme pt-4">
          {/* Bilateral Connection Button */}
          {isSelf ? (
            <Link
              href="/mi-perfil"
              className="inline-flex items-center gap-1.5 rounded-xl bg-theme-elevated px-3.5 py-2 text-xs font-bold text-theme-primary hover:bg-[#FFB800] hover:text-[#1A1A1A]"
            >
              <span>Tu Perfil Activo</span>
            </Link>
          ) : connStatus === 'connected' ? (
            <button
              type="button"
              onClick={() => onConnectAction(member)}
              title="Haz clic para desvincular"
              className="inline-flex items-center gap-1.5 rounded-xl bg-theme-inverse px-3.5 py-2 text-xs font-bold text-theme-text-inverse transition hover:opacity-85"
            >
              <UserCheck className="h-3.5 w-3.5 text-[#43B02A]" />
              <span>Conectado</span>
            </button>
          ) : connStatus === 'pending_sent' ? (
            <button
              type="button"
              onClick={() => onConnectAction(member)}
              title="Haz clic para cancelar solicitud"
              className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-bold text-theme-secondary transition hover:border-[#E87722] hover:text-[#E87722]"
            >
              <Clock className="h-3.5 w-3.5 text-[#FFB800]" />
              <span>Enviada (Cancelar)</span>
            </button>
          ) : connStatus === 'pending_received' ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onAcceptConnection(member.id)}
                className="inline-flex items-center gap-1 rounded-xl bg-[#43B02A] px-2.5 py-2 text-xs font-bold text-white transition hover:bg-[#389623]"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Aceptar</span>
              </button>
              <button
                type="button"
                onClick={() => onRejectConnection(member.id)}
                className="inline-flex items-center gap-1 rounded-xl border border-theme bg-theme-surface px-2.5 py-2 text-xs font-bold text-theme-secondary transition hover:text-red-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onConnectAction(member)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-3.5 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>+ Connect</span>
            </button>
          )}

          {/* Quick Actions: Socials, vCard, QR, Ficha */}
          <div className="flex items-center gap-1.5">
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`LinkedIn de ${member.fullName}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-theme-elevated text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            )}
            {member.githubUrl && (
              <a
                href={member.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`GitHub de ${member.fullName}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-theme-elevated text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            )}
            {member.portfolioUrl && (
              <a
                href={member.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Portafolio de ${member.fullName}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-theme-elevated text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
              >
                <Globe className="h-3.5 w-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={() =>
                downloadMemberVCard(
                  member,
                  typeof window !== 'undefined'
                    ? `${window.location.origin}/u/${member.username}`
                    : `https://cittconnect.cl/u/${member.username}`
                )
              }
              title="Descargar contacto vCard (.vcf)"
              aria-label={`Descargar contacto de ${member.fullName}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-theme-elevated text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
            >
              <Download className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onOpenQr(member)}
              className="inline-flex items-center gap-1 rounded-xl bg-theme-elevated px-2.5 py-1.5 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>QR</span>
            </button>

            <Link
              href={`/u/${member.username}`}
              className="inline-flex items-center gap-1 rounded-xl bg-theme-elevated px-2.5 py-1.5 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
            >
              <span>Ficha</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
