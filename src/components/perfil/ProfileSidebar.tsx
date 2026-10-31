'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowUpRight,
  Copy,
  Download,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  QrCode,
} from 'lucide-react';
import { getCampusBySlug, getSchoolBySlug, ROLE_CONFIG } from '@/data/citt-catalog';
import { CittMemberProfile } from '@/types/citt';
import { downloadMemberVCard } from '@/lib/vcard';

interface ProfileSidebarProps {
  member: CittMemberProfile;
  publicProfileUrl: string;
  copied: boolean;
  onCopyUrl: () => void;
  onOpenQrModal: () => void;
}

export function ProfileSidebar({
  member,
  publicProfileUrl,
  copied,
  onCopyUrl,
  onOpenQrModal,
}: ProfileSidebarProps) {
  const campus = getCampusBySlug(member.campusSlug);
  const school = getSchoolBySlug(member.schoolSlug);
  const roleInfo = ROLE_CONFIG[member.role];

  return (
    <aside className="space-y-6 lg:col-span-4">
      {/* Bloque A: Canales de Contacto y Redes Profesionales */}
      <section className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
        <h2 className="text-lg font-black text-theme-primary">
          Canales Directos y Redes
        </h2>
        <p className="mt-1 text-xs text-theme-secondary">
          Vías verificadas para contacto académico, proyectos e industria.
        </p>

        <div className="mt-4 divide-y divide-[var(--citt-border)]">
          <a
            href={`mailto:${member.email}`}
            className="flex items-center justify-between gap-3 py-3 text-xs font-bold text-theme-primary transition hover:text-[#FFB800] first:pt-0"
          >
            <span className="inline-flex min-w-0 items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-[#FFB800]" />
              <span className="truncate">{member.email}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-theme-secondary" />
          </a>

          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 py-3 text-xs font-bold text-theme-primary transition hover:text-[#307FE2]"
            >
              <span className="inline-flex items-center gap-2.5">
                <Linkedin className="h-4 w-4 shrink-0 text-[#307FE2]" />
                <span>Perfil Profesional en LinkedIn</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-theme-secondary" />
            </a>
          )}

          {member.githubUrl && (
            <a
              href={member.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 py-3 text-xs font-bold text-theme-primary transition hover:text-[#FFB800]"
            >
              <span className="inline-flex items-center gap-2.5">
                <Github className="h-4 w-4 shrink-0" />
                <span>Repositorios & Código en GitHub</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-theme-secondary" />
            </a>
          )}

          {member.portfolioUrl && (
            <a
              href={member.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 py-3 text-xs font-bold text-theme-primary transition hover:text-[#FFB800]"
            >
              <span className="inline-flex items-center gap-2.5">
                <Globe className="h-4 w-4 shrink-0 text-[#43B02A]" />
                <span>Portafolio Académico / Sitio Web</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-theme-secondary" />
            </a>
          )}

          {member.instagramUrl && (
            <a
              href={member.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 py-3 text-xs font-bold text-theme-primary transition hover:text-[#D50032] last:pb-0"
            >
              <span className="inline-flex items-center gap-2.5">
                <Instagram className="h-4 w-4 shrink-0 text-[#D50032]" />
                <span>Bitácora Visual en Instagram</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-theme-secondary" />
            </a>
          )}
        </div>
      </section>

      {/* Bloque B: Especialidades & Competencias CITT */}
      <section className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
        <h2 className="text-lg font-black text-theme-primary">
          Especialidades & Dominio
        </h2>
        <p className="mt-1 text-xs text-theme-secondary">
          Áreas técnicas disponibles para colaboración entre sedes.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {member.specialties.map((spec) => (
            <span
              key={spec}
              className="rounded-xl bg-theme-elevated px-3 py-1.5 text-xs font-bold text-theme-primary"
            >
              {spec}
            </span>
          ))}
        </div>

        <div className="mt-5 border-t border-theme pt-4 text-xs text-theme-secondary">
          <div className="flex items-center justify-between py-1">
            <span>Sede Base:</span>
            <strong className="text-theme-primary">
              {campus.shortName} ({campus.region})
            </strong>
          </div>
          <div className="flex items-center justify-between py-1">
            <span>Escuela Duoc UC:</span>
            <strong className="text-theme-primary">
              {school.shortName}
            </strong>
          </div>
          <div className="flex items-center justify-between py-1">
            <span>Rango Institucional:</span>
            <strong className="text-theme-primary">{roleInfo.label}</strong>
          </div>
        </div>
      </section>

      {/* Bloque C: Pase QR Phygital en Vivo */}
      <section className="rounded-3xl border border-theme bg-theme-surface p-6 text-center shadow-theme-card">
        <h2 className="text-lg font-black text-theme-primary">
          Pase QR Phygital en Vivo
        </h2>
        <p className="mt-1 text-xs text-theme-secondary">
          Escanea para guardar el contacto o compartir en eventos CITT.
        </p>

        <div className="mx-auto mt-4 inline-flex rounded-2xl bg-[#EEEEEE] p-4 shadow-sm">
          <QRCodeSVG
            value={publicProfileUrl}
            size={176}
            bgColor="#EEEEEE"
            fgColor="#000000"
            level="H"
            includeMargin={false}
            imageSettings={{
              src: '/assets/citt-logo.webp',
              height: 38,
              width: 38,
              excavate: true,
            }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-theme-elevated px-3 py-2 text-xs">
          <span className="truncate font-mono text-theme-primary">
            /u/{member.username}
          </span>
          <button
            type="button"
            onClick={onCopyUrl}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#FFB800] px-2.5 py-1 font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
          >
            <Copy className="h-3 w-3" />
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => downloadMemberVCard(member, publicProfileUrl)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FFB800] px-3 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>vCard (.vcf)</span>
          </button>
          <button
            type="button"
            onClick={onOpenQrModal}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-theme-subtle px-3 py-2.5 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Ampliar Pase</span>
          </button>
        </div>
      </section>
    </aside>
  );
}
