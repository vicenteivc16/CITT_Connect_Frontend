'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Compass,
  Copy,
  Crown,
  ExternalLink,
  FileCode,
  FileText,
  Github,
  Globe,
  HandHelping,
  Image as ImageIcon,
  Info,
  Kanban,
  Layers,
  MapPin,
  Maximize2,
  Play,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Terminal,
  UserCheck,
  Users,
  Video,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import {
  getCampusBySlug,
  getSchoolBySlug,
  ROLE_CONFIG,
} from '@/data/citt-catalog';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';
import { MermaidChart } from '@/components/MermaidChart';
import { getEmbedVideoUrl } from '@/lib/video';
import { getSchoolChromaticPair } from '@/styles/themes';
import { CittRole, ProjectCollaborator, ProjectMaturityStage } from '@/types/citt';

interface PageProps {
  params: Promise<{ id: string }>;
}

const MATURITY_LABELS: Record<
  ProjectMaturityStage,
  { label: string; step: number; color: string; desc: string }
> = {
  ideacion: {
    label: 'Fase 1: Ideación & Validación',
    step: 1,
    color: '#00A499',
    desc: 'Definición de requerimientos técnicos y conceptualización de arquitectura.',
  },
  prototipado: {
    label: 'Fase 2: Prototipado en Lab',
    step: 2,
    color: '#307FE2',
    desc: 'Construcción física y ensamble de hardware/software en laboratorios CITT.',
  },
  pruebas_campo: {
    label: 'Fase 3: Pruebas Inter-Sedes',
    step: 3,
    color: '#FFB800',
    desc: 'Ensayos funcionales distribuidos con estudiantes de diversas sedes.',
  },
  transferencia: {
    label: 'Fase 4: Transferencia & Partner',
    step: 4,
    color: '#43B02A',
    desc: 'Solución lista para despliegue industrial o postulación a fondos.',
  },
};

export default function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const projectIdOrSlug = resolvedParams.id;

  const {
    projects,
    activeUser,
    applyToProject,
    hasUserApplied,
    theme,
  } = useCittNetwork();

  // Buscar proyecto por slug o id
  const project =
    projects.find(
      (p) => p.slug === projectIdOrSlug || p.id === projectIdOrSlug
    ) || projects[0];

  const [activeTab, setActiveTab] = useState<
    'readme' | 'details' | 'gallery' | 'team'
  >('readme');
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCodeSuccess, setCopiedCodeSuccess] = useState<string | null>(
    null
  );

  // Estados de postulación
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const [applicationNote, setApplicationNote] = useState('');
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  if (!project) {
    return (
      <div className="mx-auto max-w-4xl py-24 text-center">
        <h1 className="text-2xl font-black text-theme-primary">
          Proyecto no encontrado
        </h1>
        <p className="mt-2 text-sm text-theme-secondary">
          No pudimos localizar la iniciativa con el identificador solicitado.
        </p>
        <Link
          href="/proyectos"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-bold text-[#1A1A1A]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Hub de Proyectos</span>
        </Link>
      </div>
    );
  }

  const campus = getCampusBySlug(project.originCampusSlug);
  const school = getSchoolBySlug(project.schoolSlug);
  const videoData = getEmbedVideoUrl(project.videoUrl);
  const userHasApplied = hasUserApplied(project.id);
  const isLead =
    activeUser.username === project.leadUsername || activeUser.role === 'dev';

  const maturity = project.maturityStage
    ? MATURITY_LABELS[project.maturityStage]
    : MATURITY_LABELS.prototipado;

  const galleryList =
    project.galleryImages && project.galleryImages.length > 0
      ? project.galleryImages
      : [project.coverImageUrl || '/assets/citt-hero-lobby.webp'];

  const collaboratorsList = project.collaborators || [
    {
      id: 'lead',
      username: project.leadUsername,
      fullName: project.leadName,
      role: project.leadRole,
      roleInProject: 'Líder de Proyecto',
      campusSlug: project.originCampusSlug,
      schoolSlug: project.schoolSlug,
    },
  ];

  const handleCopyMarkdown = () => {
    if (project.readmeContent) {
      navigator.clipboard.writeText(project.readmeContent);
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    }
  };

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionFeedback(null);

    const result = applyToProject(project.id, {
      answers: formAnswers,
      note: applicationNote.trim() || undefined,
    });

    if (result.success) {
      setSubmissionFeedback({
        type: 'success',
        text: result.message,
      });
    } else {
      setSubmissionFeedback({
        type: 'error',
        text: result.message,
      });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Cinta Cromática de la Escuela Duoc UC */}
      <div
        className="h-2 w-full rounded-full shadow-sm"
        style={{
          background: `linear-gradient(90deg, ${school.primaryHex} 0%, ${school.secondaryHex} 100%)`,
        }}
      />

      {/* 2. Barra de Navegación y Herramientas */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-4">
        <div className="flex items-center gap-2 text-xs font-medium text-theme-secondary">
          <Link
            href="/proyectos"
            className="flex items-center gap-1 font-bold text-theme-primary hover:text-[#FFB800]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Hub de Proyectos</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-theme-secondary/50" />
          <span className="truncate max-w-xs sm:max-w-md text-theme-primary font-bold">
            {project.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary transition hover:border-[#FFB800]"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#43B02A]" />
                <span>Enlace Copiado</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Compartir</span>
              </>
            )}
          </button>

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary transition hover:border-[#307FE2]"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3 text-theme-secondary" />
            </a>
          )}
        </div>
      </div>

      {/* 3. Hero Panorámico de Medios (Banner o Video Integrado Opcional) */}
      <section className="relative overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card">
        {/* Banner Panorámico */}
        <div className="relative h-60 sm:h-72 lg:h-80 w-full overflow-hidden bg-black">
          <img
            src={galleryList[activeMediaIndex]}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Insignias Superpuestas en Banner */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <SchoolBadge schoolSlug={project.schoolSlug} />
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-md">
              <MapPin className="h-3 w-3 text-[#307FE2]" />
              <span>{campus.name}</span>
            </span>
            <span className="rounded-full bg-[#307FE2] px-2.5 py-0.5 text-xs font-bold uppercase text-white shadow-sm">
              {project.status.replace('_', ' ')}
            </span>
          </div>

          {/* Botón flotante para ver video demo si existe */}
          {videoData.embedUrl && (
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-[#FFB800] px-4 py-2.5 text-xs font-black text-[#1A1A1A] shadow-lg transition hover:bg-[#ffc633] hover:scale-105 active:scale-95"
              >
                <Play className="h-4 w-4 fill-[#1A1A1A]" />
                <span>Ver Video Demo / Pitch</span>
              </button>
            </div>
          )}

          {/* Selector de Miniaturas de Galería en la esquina inferior izquierda */}
          {galleryList.length > 1 && (
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/60 p-1.5 backdrop-blur-md">
              <ImageIcon className="h-3.5 w-3.5 text-white/80 ml-1 mr-0.5" />
              {galleryList.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`h-7 w-10 overflow-hidden rounded-lg border transition ${
                    activeMediaIndex === idx
                      ? 'border-[#FFB800] scale-105 ring-1 ring-[#FFB800]'
                      : 'border-white/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Título y Resumen en Cabecera */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-3xl space-y-2">
              <h1 className="text-balance text-2xl font-black tracking-tight text-theme-primary sm:text-3xl">
                {project.title}
              </h1>
              <p className="text-sm leading-relaxed text-theme-secondary sm:text-base">
                {project.summary}
              </p>
            </div>

            {/* Fase de Madurez / TRL */}
            <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 text-right sm:min-w-[240px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-theme-secondary">
                Madurez en CITT
              </span>
              <p
                className="mt-0.5 text-xs font-bold"
                style={{ color: maturity.color }}
              >
                {maturity.label}
              </p>
              <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-theme-canvas">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 transition-all ${
                      step <= maturity.step
                        ? 'bg-[#FFB800]'
                        : 'bg-theme-secondary/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal / Lightbox de Video si el usuario pulsa "Ver Video Demo" */}
      {isVideoModalOpen && videoData.embedUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
        >
          <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
            >
              ✕
            </button>
            <iframe
              src={videoData.embedUrl}
              title={`Video demostrativo de ${project.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        </div>
      )}

      {/* 4. Colaboradores del Proyecto Tipo GitHub con Jerarquía Visual */}
      <section className="rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-theme-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme pb-4">
          <div>
            <h2 className="text-base font-bold text-theme-primary">
              Equipo & Colaboradores Activos ({collaboratorsList.length})
            </h2>
            <p className="text-xs text-theme-secondary">
              Perfiles verificados de Duoc UC, mentores de industria y líderes de track
            </p>
          </div>

          <span className="rounded-full border border-theme bg-theme-subtle px-3 py-1 text-xs font-semibold text-theme-secondary">
            Sede Central: {campus.name}
          </span>
        </div>

        {/* Cuadrícula de Colaboradores con badges de rol institucional */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collaboratorsList.map((collab) => {
            const isPersonalDuoc = collab.role === 'personal_duoc';
            const isPartner = collab.role === 'partner';
            const isDev = collab.role === 'dev';
            const isLider = collab.role === 'lider_citt';

            return (
              <Link
                key={collab.id || collab.username}
                href={`/u/${collab.username}`}
                className={`group flex items-center gap-3 rounded-2xl border p-3 transition hover:scale-[1.01] ${
                  isPersonalDuoc
                    ? 'border-[#FFB800]/50 bg-[#FFB800]/5 hover:border-[#FFB800]'
                    : isPartner
                    ? 'border-[#AC4FC6]/50 bg-[#AC4FC6]/5 hover:border-[#AC4FC6]'
                    : isDev
                    ? 'border-[#307FE2]/50 bg-[#307FE2]/5 hover:border-[#307FE2]'
                    : isLider
                    ? 'border-[#FFB800]/40 bg-theme-subtle hover:border-[#FFB800]'
                    : 'border-theme bg-theme-subtle hover:border-[#FFB800]'
                }`}
              >
                <img
                  src={collab.avatarUrl || '/assets/citt-logo.webp'}
                  alt={collab.fullName}
                  className={`h-11 w-11 shrink-0 rounded-full object-cover ring-2 ${
                    isPersonalDuoc
                      ? 'ring-[#FFB800]'
                      : isPartner
                      ? 'ring-[#AC4FC6]'
                      : isDev
                      ? 'ring-[#307FE2]'
                      : 'ring-theme'
                  }`}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs font-bold text-theme-primary group-hover:underline">
                      {collab.fullName}
                    </p>
                  </div>

                  <p className="truncate text-[11px] font-semibold text-[#FFB800]">
                    {collab.roleInProject}
                  </p>

                  <div className="mt-1 flex items-center gap-1.5">
                    <RoleBadge role={collab.role} showTooltip={false} size="sm" />
                    {collab.organization && (
                      <span className="truncate rounded-md bg-[#AC4FC6]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#AC4FC6]">
                        {collab.organization}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-theme-secondary opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Layout Principal: Documentación README.md vs Ficha Técnica + Módulo SSO */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* COLUMNA PRINCIPAL (8 Cols): README.md con soporte nativo de MERMAID */}
        <div className="space-y-6 lg:col-span-8">
          {/* Selector de Pestañas de la Documentación */}
          <div className="flex items-center justify-between rounded-2xl border border-theme bg-theme-subtle p-1.5">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('readme')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === 'readme'
                    ? 'border border-[#1A1A1A]/20 bg-[#FFB800] text-[#1A1A1A] shadow-sm'
                    : 'text-theme-secondary hover:text-theme-primary'
                }`}
              >
                <FileCode className="h-3.5 w-3.5" />
                <span>README.md (Mermaid + GFM)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === 'details'
                    ? 'border border-[#1A1A1A]/20 bg-[#FFB800] text-[#1A1A1A] shadow-sm'
                    : 'text-theme-secondary hover:text-theme-primary'
                }`}
              >
                <ClipboardList className="h-3.5 w-3.5" />
                <span>Ficha & Requerimientos</span>
              </button>
            </div>

            {activeTab === 'readme' && project.readmeContent && (
              <button
                type="button"
                onClick={handleCopyMarkdown}
                title="Copiar contenido Markdown"
                className="hidden items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-theme-secondary hover:bg-theme-surface hover:text-theme-primary sm:inline-flex"
              >
                {copiedMarkdown ? (
                  <>
                    <Check className="h-3 w-3 text-[#43B02A]" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copiar .MD</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* VISTA 1: README.MD RENDERIZADO CON MERMAID NATIVO */}
          {activeTab === 'readme' && (
            <div className="rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-theme-card">
              {/* Barra superior estilo GitHub Repo File */}
              <div className="mb-6 flex items-center justify-between border-b border-theme pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-theme-secondary">
                  <FileText className="h-4 w-4 text-[#FFB800]" />
                  <span className="font-bold text-theme-primary">README.md</span>
                  <span>· {project.slug}.md</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-[#307FE2]/30 bg-[#307FE2]/10 px-2 py-0.5 text-[11px] font-mono font-bold text-[#307FE2]">
                    Mermaid Engine Activo
                  </span>
                  <span className="rounded-md border border-theme bg-theme-subtle px-2 py-0.5 text-[11px] font-mono text-theme-secondary">
                    Markdown GFM
                  </span>
                </div>
              </div>

              {/* Renderizador ReactMarkdown con detección de Mermaid */}
              <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-black prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-p:text-theme-secondary prose-a:text-[#307FE2] prose-a:no-underline hover:prose-a:underline prose-hr:border-theme">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeString = String(children).replace(/\n$/, '');

                      // Bloque de código Mermaid: Renderizar como diagrama gráfico SVG interactivo
                      if (!inline && match && match[1] === 'mermaid') {
                        return <MermaidChart chart={codeString} />;
                      }

                      // Bloque de código ordinario: Con barra de lenguaje y botón para copiar
                      if (!inline) {
                        return (
                          <div className="relative my-4 overflow-hidden rounded-2xl border border-theme bg-theme-canvas">
                            <div className="flex items-center justify-between border-b border-theme bg-theme-subtle px-4 py-2 text-[11px] font-mono font-bold text-theme-secondary">
                              <span>{match ? match[1].toUpperCase() : 'CODE'}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(codeString);
                                  setCopiedCodeSuccess(codeString);
                                  setTimeout(
                                    () => setCopiedCodeSuccess(null),
                                    2000
                                  );
                                }}
                                className="inline-flex items-center gap-1 hover:text-theme-primary"
                              >
                                {copiedCodeSuccess === codeString ? (
                                  <>
                                    <Check className="h-3 w-3 text-[#43B02A]" />
                                    <span>Copiado</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>Copiar</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="overflow-x-auto p-4 text-xs font-mono text-theme-primary">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          </div>
                        );
                      }

                      // Código inline
                      return (
                        <code
                          className="rounded-md bg-theme-subtle px-1.5 py-0.5 font-mono text-xs font-semibold text-theme-primary"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    blockquote({ children }) {
                      return (
                        <blockquote className="my-4 rounded-2xl border border-theme bg-theme-subtle p-4 not-italic text-theme-primary">
                          {children}
                        </blockquote>
                      );
                    },
                    table({ children }) {
                      return (
                        <div className="my-4 overflow-x-auto rounded-2xl border border-theme">
                          <table className="w-full text-left text-xs text-theme-primary">
                            {children}
                          </table>
                        </div>
                      );
                    },
                  }}
                >
                  {project.readmeContent ||
                    `# ${project.title}\n\n${project.summary}\n\n*El creador no ha subido aún un README.md detallado para esta iniciativa.*`}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* VISTA 2: FICHA TÉCNICA ESTRUCTURADA */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Especialidades Requeridas */}
              <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
                <h2 className="text-base font-bold text-theme-primary">
                  Perfiles y Especialidades Buscadas
                </h2>
                <p className="mt-1 text-xs text-theme-secondary">
                  El equipo busca compañeros con formación en las siguientes áreas para colaborar de forma inter-sedes:
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.neededSpecialties.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-xl border border-theme bg-theme-subtle px-3 py-1.5 text-xs font-bold text-theme-primary"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-theme bg-theme-subtle p-4">
                  <p className="text-xs font-bold text-theme-primary">
                    Detalle de la solicitud de colaboración:
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-theme-secondary">
                    {project.helpRequestDetails}
                  </p>
                </div>
              </div>

              {/* Ficha Institucional Duoc UC */}
              <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
                <h2 className="text-base font-bold text-theme-primary">
                  Identidad Institucional de la Iniciativa
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5">
                    <span className="text-xs text-theme-secondary">
                      Sede de Origen
                    </span>
                    <p className="mt-0.5 text-sm font-bold text-theme-primary">
                      {campus.name}
                    </p>
                    <p className="text-xs text-theme-secondary">
                      Región {campus.region}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5">
                    <span className="text-xs text-theme-secondary">
                      Escuela Patrocinante
                    </span>
                    <p className="mt-0.5 text-sm font-bold text-theme-primary">
                      {school.name}
                    </p>
                    <p className="text-xs text-theme-secondary">
                      Color Semántico: {school.primaryHex}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PANEL EXCLUSIVO DEL LÍDER / ADMIN: POSTULACIONES RECIBIDAS */}
          {isLead && project.applications && project.applications.length > 0 && (
            <div className="rounded-3xl border border-[#307FE2]/40 bg-theme-surface p-6 shadow-theme-card">
              <div className="flex items-center justify-between border-b border-theme pb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#307FE2]" />
                  <h2 className="text-base font-bold text-theme-primary">
                    Panel del Líder: Postulaciones Recibidas (
                    {project.applications.length})
                  </h2>
                </div>
                <span className="rounded-full bg-[#307FE2]/10 px-2.5 py-0.5 text-xs font-bold text-[#307FE2]">
                  Exclusivo Creador / Admin
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {project.applications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-2xl border border-theme bg-theme-subtle p-4 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Link
                          href={`/u/${app.applicantUsername}`}
                          className="font-bold text-theme-primary hover:underline"
                        >
                          {app.applicantName}
                        </Link>
                        <RoleBadge role={app.applicantRole} showTooltip={false} />
                      </div>
                      <span className="text-xs text-theme-secondary">
                        {app.appliedAt}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-theme-secondary">
                      Correo: {app.applicantEmail} · Sede: {app.applicantCampusSlug}
                    </p>

                    {/* Respuestas del Formulario si existen */}
                    {app.answers && Object.keys(app.answers).length > 0 && (
                      <div className="mt-3 space-y-1.5 border-t border-theme pt-2 text-xs">
                        {Object.entries(app.answers).map(([key, val]) => (
                          <div key={key}>
                            <span className="font-semibold text-theme-primary">
                              {key}:{' '}
                            </span>
                            <span className="text-theme-secondary">{val}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {app.note && (
                      <p className="mt-2 rounded-xl bg-theme-surface p-2.5 text-xs italic text-theme-primary">
                        "{app.note}"
                      </p>
                    )}

                    <div className="mt-3 flex justify-end gap-2">
                      <Link
                        href={`/u/${app.applicantUsername}`}
                        className="rounded-lg border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary hover:border-[#FFB800]"
                      >
                        Ver Credencial
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA LATERAL (4 Cols): Postulación SSO & Hub Ecosistema CITT */}
        <aside className="space-y-6 lg:col-span-4">
          {/* Card 1: Módulo de Postulación con Cuenta Logueada */}
          <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFB800] text-[#1A1A1A]">
                {project.applicationMode === 'form' ? (
                  <ClipboardList className="h-5 w-5" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </div>
              <div>
                <h2 className="text-sm font-bold text-theme-primary">
                  {project.applicationMode === 'form'
                    ? 'Formulario de Postulación'
                    : 'Postulación Directa'}
                </h2>
                <p className="text-xs text-theme-secondary">
                  Ecosistema CITT Connect SSO
                </p>
              </div>
            </div>

            {/* Identidad Activa del Usuario Logueado */}
            <div className="mt-4 rounded-2xl border border-theme bg-theme-subtle p-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeUser.avatarUrl || '/assets/citt-logo.webp'}
                  alt={activeUser.fullName}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-[#FFB800]"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-theme-primary">
                    {activeUser.fullName}
                  </p>
                  <p className="truncate text-xs text-theme-secondary">
                    {activeUser.email}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-theme-secondary">
                Tu postulación se vinculará automáticamente a tu perfil institucional verificado.
              </p>
            </div>

            {/* Mensajes de feedback */}
            {submissionFeedback && (
              <div
                className={`mt-4 rounded-xl p-3 text-xs font-medium ${
                  submissionFeedback.type === 'success'
                    ? 'border border-[#43B02A]/40 bg-[#43B02A]/10 text-theme-primary'
                    : 'border border-[#D50032]/40 bg-[#D50032]/10 text-theme-primary'
                }`}
              >
                {submissionFeedback.text}
              </div>
            )}

            {/* Estado ya postulado */}
            {userHasApplied ? (
              <div className="mt-5 rounded-2xl border border-[#43B02A]/40 bg-[#43B02A]/10 p-4 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-[#43B02A]" />
                <p className="mt-2 text-xs font-bold text-theme-primary">
                  ¡Ya has postulado a este proyecto!
                </p>
                <p className="mt-1 text-xs text-theme-secondary">
                  El líder del proyecto ha recibido tu ficha y te contactará a tu correo institucional.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="mt-5 space-y-4">
                {/* Preguntas si el modo es 'form' */}
                {project.applicationMode === 'form' &&
                  project.applicationQuestions &&
                  project.applicationQuestions.length > 0 && (
                    <div className="space-y-3">
                      {project.applicationQuestions.map((q, idx) => (
                        <div key={q.id}>
                          <label
                            htmlFor={`q-${q.id}`}
                            className="block text-xs font-bold text-theme-primary"
                          >
                            {idx + 1}. {q.question} {q.required && '*'}
                          </label>
                          <input
                            id={`q-${q.id}`}
                            type="text"
                            required={q.required}
                            value={formAnswers[q.question] || ''}
                            onChange={(e) =>
                              setFormAnswers({
                                ...formAnswers,
                                [q.question]: e.target.value,
                              })
                            }
                            placeholder={q.placeholder || 'Escribe tu respuesta...'}
                            className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                {/* Nota opcional */}
                <div>
                  <label
                    htmlFor="app-note"
                    className="block text-xs font-bold text-theme-primary"
                  >
                    Nota o motivación (Opcional)
                  </label>
                  <textarea
                    id="app-note"
                    rows={3}
                    value={applicationNote}
                    onChange={(e) => setApplicationNote(e.target.value)}
                    placeholder="Cuéntale al equipo en qué horario estás disponible o cómo te gustaría aportar..."
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1A1A1A]/30 bg-[#FFB800] px-4 py-3 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB800]"
                >
                  <Send className="h-4 w-4" />
                  <span>
                    {project.applicationMode === 'form'
                      ? 'Enviar Formulario de Postulación'
                      : 'Postular Directamente al Equipo'}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Card 2: HUB ECOSISTEMA CITT (Punto 5 del Usuario) */}
          <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
            <div className="flex items-center gap-2.5 border-b border-theme pb-3">
              <Layers className="h-5 w-5 text-[#307FE2]" />
              <div>
                <h3 className="text-xs font-bold text-theme-primary">
                  Ecosistema CITT Integrado
                </h3>
                <p className="text-[11px] text-theme-secondary">
                  Identidad única & trazabilidad de avances
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-theme-secondary">
              CITT Connect opera como el nodo central de datos. Tu credencial conecta directamente con:
            </p>

            <div className="mt-4 space-y-2.5">
              {/* Calendario CITT */}
              <div className="flex items-start gap-2.5 rounded-2xl border border-theme bg-theme-subtle p-3">
                <Calendar className="h-4 w-4 shrink-0 text-[#FFB800] mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-theme-primary">
                    Calendario CITT
                  </p>
                  <p className="text-[11px] text-theme-secondary">
                    Reserva de mesas de prototipado y talleres usando tu cuenta @duocuc.cl.
                  </p>
                </div>
              </div>

              {/* Sprint Tracker / Jira CITT */}
              <div className="flex items-start gap-2.5 rounded-2xl border border-theme bg-theme-subtle p-3">
                <Kanban className="h-4 w-4 shrink-0 text-[#307FE2] mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-theme-primary">
                    CITT Sprint Tracker (Jira)
                  </p>
                  <p className="text-[11px] text-theme-secondary">
                    Gestión ágil de tareas y asignación de sprints sincronizados con este proyecto.
                  </p>
                </div>
              </div>

              {/* NFC Access */}
              <div className="flex items-start gap-2.5 rounded-2xl border border-theme bg-theme-subtle p-3">
                <Compass className="h-4 w-4 shrink-0 text-[#43B02A] mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-theme-primary">
                    Control de Acceso Físico NFC
                  </p>
                  <p className="text-[11px] text-theme-secondary">
                    Check-in en laboratorio y autorización de instrumental con tu tag personal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
