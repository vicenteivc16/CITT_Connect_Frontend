'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Building2,
  Check,
  Clock,
  Compass,
  Copy,
  Download,
  Edit3,
  FolderGit2,
  Github,
  Globe,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Newspaper,
  QrCode,
  Share2,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import { PhygitalPassCard } from '@/components/PhygitalPassCard';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';
import {
  getCampusBySlug,
  getSchoolBySlug,
  ROLE_CONFIG,
} from '@/data/citt-catalog';
import { downloadMemberVCard } from '@/lib/vcard';

const STATUS_LABELS: Record<
  'idea' | 'en_desarrollo' | 'prototipo' | 'finalizado',
  string
> = {
  idea: 'Fase Idea',
  en_desarrollo: 'En Desarrollo',
  prototipo: 'Prototipo Funcional',
  finalizado: 'Implementado',
};

export default function PublicMemberProfilePage() {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const {
    profiles,
    projects,
    posts,
    activeUser,
    isAuthenticated,
    isConnected,
    toggleConnection,
    getConnectionStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectOrCancelConnection,
  } = useCittNetwork();

  const [copied, setCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [originUrl, setOriginUrl] = useState('https://cittconnect.cl');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      setOriginUrl(window.location.origin);
    }
  }, []);

  const member = profiles.find((p) => p.username === params.username);

  if (!member) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-theme bg-theme-surface p-8 text-center shadow-theme-card">
        <h1 className="text-xl font-bold text-theme-primary">
          Perfil no encontrado en CITT Connect
        </h1>
        <p className="mt-2 max-w-[55ch] text-xs text-theme-secondary">
          El enlace público{' '}
          <code className="font-mono font-bold text-theme-primary">
            /u/{params.username}
          </code>{' '}
          no corresponde a un perfil activo o fue modificado.
        </p>
        <Link
          href="/directorio"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-bold text-[#1A1A1A]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Directorio CITT Connect</span>
        </Link>
      </div>
    );
  }

  const campus = getCampusBySlug(member.campusSlug);
  const school = getSchoolBySlug(member.schoolSlug);
  const roleInfo = ROLE_CONFIG[member.role];
  const isSelf = isAuthenticated && member.id === activeUser.id;
  const connStatus = getConnectionStatus(member.id);
  const publicProfileUrl = `${originUrl}/u/${member.username}`;
  const bannerImage = member.bannerUrl || '/assets/citt-hero-lobby.webp';

  const memberProjects = projects.filter(
    (proj) =>
      proj.leadUsername === member.username ||
      proj.collaborators?.some((c) => c.username === member.username)
  );
  const relatedSchoolProjects = projects.filter(
    (proj) =>
      proj.leadUsername !== member.username &&
      !proj.collaborators?.some((c) => c.username === member.username) &&
      (proj.schoolSlug === member.schoolSlug ||
        proj.originCampusSlug === member.campusSlug)
  );
  const displayedProjects =
    memberProjects.length > 0
      ? memberProjects
      : relatedSchoolProjects.length > 0
      ? relatedSchoolProjects.slice(0, 2)
      : projects.slice(0, 2);

  const memberPosts = posts.filter(
    (post) => post.authorUsername === member.username
  );

  const sameCampusOrSchoolPeers = profiles.filter(
    (p) =>
      p.id !== member.id &&
      (p.campusSlug === member.campusSlug ||
        p.schoolSlug === member.schoolSlug)
  );
  const otherNetworkPeers = profiles.filter(
    (p) =>
      p.id !== member.id &&
      !sameCampusOrSchoolPeers.some((sp) => sp.id === p.id)
  );
  const peers = [...sameCampusOrSchoolPeers, ...otherNetworkPeers].slice(0, 3);

  const initials = member.fullName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicProfileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Barra Superior de Navegación Contextual */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/directorio"
          className="inline-flex items-center gap-2 rounded-xl border border-theme bg-theme-surface px-3.5 py-2 text-xs font-bold text-theme-primary transition hover:border-[#FFB800]"
        >
          <ArrowLeft className="h-4 w-4 text-[#FFB800]" />
          <span>Volver al Directorio Nacional CITT</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-theme-subtle px-3 py-1.5 font-mono text-xs font-semibold text-theme-primary">
            <ShieldCheck className="h-3.5 w-3.5 text-[#FFB800]" />
            <span>/u/{member.username}</span>
          </span>

          {isSelf && (
            <Link
              href="/mi-perfil"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-3.5 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Editar mi Perfil y Banner</span>
            </Link>
          )}
        </div>
      </div>

      {/* 1. CABECERA SOCIAL & ACADÉMICA PANORÁMICA (Combinación 1: LinkedIn Executive × MIT Media Lab) */}
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
                  style={{
                    borderColor: school.primaryHex,
                  }}
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
                    onClick={() => {
                      if (
                        confirm(
                          `¿Deseas desvincular tu conexión con ${member.fullName}?`
                        )
                      ) {
                        rejectOrCancelConnection(member.id);
                      }
                    }}
                    title="Haz clic para desvincular"
                    className="inline-flex items-center gap-2 rounded-xl bg-theme-inverse px-5 py-2.5 text-xs font-bold text-theme-text-inverse transition hover:opacity-85 sm:text-sm"
                  >
                    <UserCheck className="h-4 w-4 text-[#43B02A]" />
                    <span>Conectado en mi Red</span>
                  </button>
                ) : connStatus === 'pending_sent' ? (
                  <button
                    type="button"
                    onClick={() => rejectOrCancelConnection(member.id)}
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
                      onClick={() => acceptConnectionRequest(member.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#43B02A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#389623] sm:text-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>Aceptar Vínculo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectOrCancelConnection(member.id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-theme bg-theme-surface px-3 py-2.5 text-xs font-bold text-theme-secondary transition hover:text-red-500 sm:text-sm"
                    >
                      <X className="h-4 w-4" />
                      <span>Ignorar</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => sendConnectionRequest(member.id)}
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

              <button
                type="button"
                onClick={() => downloadMemberVCard(member, publicProfileUrl)}
                className="inline-flex items-center gap-2 rounded-xl bg-theme-subtle px-4 py-2.5 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A] sm:text-sm"
              >
                <Download className="h-4 w-4" />
                <span>Guardar Contacto (.vcf)</span>
              </button>

              <Dialog.Root open={qrModalOpen} onOpenChange={setQrModalOpen}>
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
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1.5 rounded-xl bg-theme-subtle px-3.5 py-2.5 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-[#43B02A]" />
                    <span>URL Copiada</span>
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

      {/* 2. RETÍCULA ASIMÉTRICA DE 2 COLUMNAS (4 Cols Ficha & QR / 8 Cols Portafolio & Trayectoria) */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* COLUMNA IZQUIERDA (4 Cols): Contacto Directo, Especialidades y Credencial QR */}
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
                onClick={handleCopyUrl}
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
                onClick={() => setQrModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-theme-subtle px-3 py-2.5 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>Ampliar Pase</span>
              </button>
            </div>
          </section>
        </aside>

        {/* COLUMNA DERECHA PRINCIPAL (8 Cols): Biografía, Rol Especial, Proyectos CITT y Actividad */}
        <div className="space-y-6 lg:col-span-8">
          {/* Bloque 1: Biografía, Propósito Académico y Módulos según Rol */}
          <section className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card sm:p-8">
            <h2 className="inline-flex items-center gap-2.5 text-xl font-black text-theme-primary">
              <Sparkles className="h-5 w-5 text-[#FFB800]" />
              <span>Acerca de & Trayectoria en la Red CITT</span>
            </h2>

            <p className="mt-3 max-w-[65ch] font-serif text-base leading-relaxed text-theme-secondary">
              {member.bio}
            </p>

            {/* Módulo Especial: Consejero de Carrera */}
            {member.role === 'consejero_carrera' &&
              member.representedCareerInfo && (
                <div className="mt-6 border-t border-theme pt-5">
                  <h3 className="inline-flex items-center gap-2 text-base font-black text-theme-primary">
                    <Compass className="h-4 w-4 text-[#43B02A]" />
                    <span>
                      Puente Oficial Consejero de Carrera ↔ Alumnos Duoc UC
                    </span>
                  </h3>
                  <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-theme-secondary">
                    {member.representedCareerInfo}
                  </p>
                </div>
              )}

            {/* Módulo Especial: Empresa Partner */}
            {member.role === 'partner' && member.partnerOrganization && (
              <div className="mt-6 border-t border-theme pt-5">
                <h3 className="inline-flex items-center gap-2 text-base font-black text-theme-primary">
                  <Building2 className="h-4 w-4 text-[#E87722]" />
                  <span>
                    Organización Partner Aliada: {member.partnerOrganization}
                  </span>
                </h3>
                <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-theme-secondary">
                  Vinculación directa con los laboratorios CITT de Duoc UC para
                  desafíos tecnológicos reales, mentorías de industria y
                  oportunidades de práctica profesional.
                </p>
              </div>
            )}

            {/* Hitos, Liderazgo y Contribuciones Destacadas */}
            {member.achievements && member.achievements.length > 0 && (
              <div className="mt-6 border-t border-theme pt-5">
                <h3 className="inline-flex items-center gap-2 text-base font-black text-theme-primary">
                  <Award className="h-4 w-4 text-[#FFB800]" />
                  <span>Hitos Académicos y Contribuciones Destacadas</span>
                </h3>
                <ul className="mt-3 space-y-2">
                  {member.achievements.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-theme-secondary"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#43B02A]" />
                      <span className="max-w-[65ch]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Bloque 2: Portafolio de Proyectos e Investigación Aplicada */}
          <section className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="inline-flex items-center gap-2.5 text-xl font-black text-theme-primary">
                  <FolderGit2 className="h-5 w-5 text-[#FFB800]" />
                  <span>
                    {memberProjects.length > 0
                      ? 'Proyectos Liderados en el CITT'
                      : 'Proyectos CITT de su Escuela & Sede'}
                  </span>
                </h2>
                <p className="mt-1 text-xs text-theme-secondary">
                  Iniciativas de transferencia tecnológica y colaboración
                  inter-sedes.
                </p>
              </div>

              <Link
                href="/proyectos"
                className="inline-flex items-center gap-1.5 rounded-xl bg-theme-subtle px-3.5 py-2 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
              >
                <span>Explorar todos los proyectos</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-5 divide-y divide-[var(--citt-border)]">
              {displayedProjects.map((proj) => {
                const projCampus = getCampusBySlug(proj.originCampusSlug);
                return (
                  <article
                    key={proj.id}
                    className="py-5 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <SchoolBadge schoolSlug={proj.schoolSlug} />
                        <span className="rounded-full bg-theme-elevated px-2.5 py-0.5 text-xs font-bold text-theme-primary">
                          {STATUS_LABELS[proj.status]}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-theme-secondary">
                        Sede {projCampus.shortName} · {proj.createdAt}
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-lg font-black text-theme-primary">
                      {proj.title}
                    </h3>

                    <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-theme-secondary">
                      {proj.summary}
                    </p>

                    {proj.lookingForCollaborators && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-bold text-theme-primary">
                          Especialidades buscadas en otras sedes CITT:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.neededSpecialties.map((spec) => (
                            <span
                              key={spec}
                              className="rounded-lg bg-theme-elevated px-2.5 py-1 text-xs font-semibold text-theme-primary"
                            >
                              + {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-theme-secondary">
                        Líder:{' '}
                        <strong className="text-theme-primary">
                          {proj.leadName}
                        </strong>
                      </span>

                      <div className="flex items-center gap-2">
                        {proj.repoUrl && (
                          <a
                            href={proj.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-theme-subtle px-3 py-1.5 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                          >
                            <Github className="h-3.5 w-3.5" />
                            <span>Repositorio</span>
                          </a>
                        )}
                        <Link
                          href={`/proyectos/${proj.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-3.5 py-1.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                        >
                          <span>Ver Iniciativa</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Bloque 3: Publicaciones en el Muro & Miembros Relacionados de su Sede/Escuela */}
          <section className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="inline-flex items-center gap-2.5 text-xl font-black text-theme-primary">
                <Newspaper className="h-5 w-5 text-[#307FE2]" />
                <span>Actividad en el Muro & Red de su Escuela</span>
              </h2>
              <Link
                href="/muro"
                className="text-xs font-bold text-theme-primary hover:underline"
              >
                Ir al Muro Nacional →
              </Link>
            </div>

            {memberPosts.length > 0 && (
              <div className="mt-4 divide-y divide-[var(--citt-border)] border-b border-theme pb-5">
                {memberPosts.map((post) => (
                  <article key={post.id} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2 text-xs text-theme-secondary">
                      <span className="font-bold text-theme-primary">
                        Publicación oficial de {post.authorName}
                      </span>
                      <span>{post.createdAt}</span>
                    </div>
                    <h3 className="mt-1 text-base font-bold text-theme-primary">
                      {post.title}
                    </h3>
                    <p className="mt-1 max-w-[65ch] text-sm leading-relaxed text-theme-secondary">
                      {post.content}
                    </p>
                  </article>
                ))}
              </div>
            )}

            {/* Miembros de la misma Sede o Escuela para continuar conectando */}
            <div className="mt-5">
              <h3 className="inline-flex items-center gap-2 text-base font-black text-theme-primary">
                <Users className="h-4 w-4 text-[#FFB800]" />
                <span>
                  Otros Talentos CITT de {campus.shortName} y {school.shortName}
                </span>
              </h3>

              <div className="mt-3 divide-y divide-[var(--citt-border)]">
                {peers.map((peer) => {
                  const peerCampus = getCampusBySlug(peer.campusSlug);
                  const peerConnected = isConnected(peer.id);
                  return (
                    <div
                      key={peer.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-0"
                    >
                      <Link
                        href={`/u/${peer.username}`}
                        className="flex min-w-0 flex-1 items-center gap-3"
                      >
                        <img
                          src={peer.avatarUrl || '/assets/citt-logo.webp'}
                          alt={peer.fullName}
                          className="h-11 w-11 shrink-0 rounded-2xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-bold text-theme-primary hover:underline">
                              {peer.fullName}
                            </p>
                            <RoleBadge role={peer.role} showTooltip={false} />
                          </div>
                          <p className="truncate text-xs text-theme-secondary">
                            {peer.currentOccupation} · Sede{' '}
                            {peerCampus.shortName}
                          </p>
                        </div>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleConnection(peer.id)}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                            peerConnected
                              ? 'bg-theme-inverse text-theme-text-inverse'
                              : 'bg-[#FFB800] text-[#1A1A1A] hover:bg-[#ffc633]'
                          }`}
                        >
                          {peerConnected ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>Conectado</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-3.5 w-3.5" />
                              <span>+ Connect</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
