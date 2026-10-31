'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as Dialog from '@radix-ui/react-dialog';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Compass,
  Copy,
  Crown,
  Edit3,
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
  LogIn,
  MapPin,
  Maximize2,
  Play,
  Plus,
  Send,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  Video,
  X,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import {
  getCampusBySlug,
  getSchoolBySlug,
  ROLE_CONFIG,
  MATURITY_LABELS,
} from '@/data/citt-catalog';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';
import { getEmbedVideoUrl } from '@/lib/video';
import { getSchoolChromaticPair } from '@/styles/themes';
import { CittRole, ProjectCollaborator, ProjectMaturityStage } from '@/types/citt';

// Subcomponentes Modulares de Proyectos
import { ProjectHeroHeader } from '@/components/proyectos/ProjectHeroHeader';
import { ProjectApplicationCard } from '@/components/proyectos/ProjectApplicationCard';
import { ProjectReviewTray } from '@/components/proyectos/ProjectReviewTray';
import { ProjectEditModal } from '@/components/proyectos/ProjectEditModal';

// Lazy loading of Mermaid to save 2.5 MB bundle impact on initial route
const MermaidChart = dynamic(
  () => import('@/components/MermaidChart').then((mod) => mod.MermaidChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-32 items-center justify-center rounded-xl bg-theme-subtle p-4 text-xs text-theme-secondary">
        Cargando diagrama Mermaid...
      </div>
    ),
  }
);

interface PageProps {
  params: Promise<{ id: string }>;
}


export default function ProjectDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const projectIdOrSlug = resolvedParams.id;

  const {
    projects,
    activeUser,
    isAuthenticated,
    applyToProject,
    withdrawApplication,
    approveApplication,
    rejectApplication,
    removeCollaborator,
    hasUserApplied,
    getUserApplicationStatus,
    updateProject,
    deleteProject,
    theme,
  } = useCittNetwork();

  // Find project
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
  const [copiedCodeSuccess, setCopiedCodeSuccess] = useState<string | null>(null);

  // Application state
  // Leader Management state (UC-LID-03)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
  const appStatus = getUserApplicationStatus(project.id);
  const isLead =
    isAuthenticated &&
    (activeUser.username === project.leadUsername || activeUser.role === 'dev');
  const isCollaborator = project.collaborators?.some(
    (c) => c.username === activeUser.username
  );

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

  const handleWithdraw = () => {
    if (confirm('¿Estás seguro de que deseas retirar tu postulación a esta iniciativa?')) {
      withdrawApplication(project.id);
    }
  };

  const handleRemoveCollab = (username: string) => {
    if (confirm(`¿Deseas retirar a @${username} del equipo de colaboradores?`)) {
      removeCollaborator(project.id, username);
    }
  };

  const handleDeleteProject = () => {
    if (
      confirm(
        `¿Confirmas la eliminación del proyecto "${project.title}"? Esta acción no se puede deshacer.`
      )
    ) {
      deleteProject(project.id);
      router.push('/proyectos');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1, 2, 3: Hero Panorámico de Medios, Navegación y Encabezado */}
      <ProjectHeroHeader
        project={project}
        activeUser={activeUser}
        isLead={isLead}
        copiedLink={copiedLink}
        onOpenEdit={() => setIsEditModalOpen(true)}
        onDeleteProject={handleDeleteProject}
        onShareLink={handleShareLink}
        onOpenVideo={() => setIsVideoModalOpen(true)}
      />

      {/* 4. Retícula Principal: Contenido Extendido (8 cols) vs Sidebar Postulación (4 cols) */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          {/* Navegación por Pestañas */}
          <div className="flex items-center gap-2 border-b border-theme pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('readme')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'readme'
                  ? 'bg-[#FFB800] text-[#1A1A1A]'
                  : 'text-theme-secondary hover:text-theme-primary'
              }`}
            >
              <FileCode className="h-4 w-4" />
              <span>Documentación Técnica (README.md)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'details'
                  ? 'bg-[#FFB800] text-[#1A1A1A]'
                  : 'text-theme-secondary hover:text-theme-primary'
              }`}
            >
              <HandHelping className="h-4 w-4" />
              <span>Requerimientos & Perfiles Buscados</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'team'
                  ? 'bg-[#FFB800] text-[#1A1A1A]'
                  : 'text-theme-secondary hover:text-theme-primary'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Equipo ({collaboratorsList.length})</span>
            </button>
          </div>

          {/* TAB 1: README.md Renderizado con Soporte Mermaid */}
          {activeTab === 'readme' && (
            <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card sm:p-8">
              <div className="mb-6 flex items-center justify-between border-b border-theme pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#FFB800]" />
                  <span className="font-mono text-xs font-bold text-theme-primary">
                    README.md · Especificación del Proyecto
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-theme bg-theme-subtle px-2.5 py-1 text-xs font-bold text-theme-primary transition hover:border-[#FFB800]"
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
              </div>

              {project.readmeContent ? (
                <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-black prose-headings:text-theme-primary prose-p:text-theme-secondary prose-p:leading-relaxed prose-strong:text-theme-primary prose-code:text-[#FFB800]">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isMermaid = match && match[1] === 'mermaid';

                        if (isMermaid) {
                          return (
                            <MermaidChart chart={String(children).replace(/\n$/, '')} />
                          );
                        }

                        return (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {project.readmeContent}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-theme-secondary">
                  Este proyecto aún no incluye documentación extendida en formato Markdown.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Requerimientos y Especialidades */}
          {activeTab === 'details' && (
            <div className="space-y-6 rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card sm:p-8">
              <div>
                <h2 className="text-lg font-black text-theme-primary">
                  Especialidades Requeridas en la Red
                </h2>
                <p className="mt-1 text-xs text-theme-secondary">
                  Perfiles multidisciplinarios buscados en cualquier sede de Duoc UC.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(project.neededSpecialties || []).map((spec) => (
                    <span
                      key={spec}
                      className="rounded-xl bg-[#FFB800]/15 px-3.5 py-1.5 text-xs font-bold text-[#FFB800]"
                    >
                      + {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-theme pt-6">
                <h3 className="text-base font-bold text-theme-primary">
                  Detalles del Desafío y Modalidad de Trabajo
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-theme-secondary">
                  {project.helpRequestDetails ||
                    'Iniciativa abierta a colaboración remota y presencial en laboratorios CITT.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Equipo de Colaboradores Oficiales */}
          {activeTab === 'team' && (
            <div className="space-y-4 rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card sm:p-8">
              <div className="flex items-center justify-between border-b border-theme pb-4">
                <div>
                  <h2 className="text-lg font-black text-theme-primary">
                    Equipo & Colaboradores Activos ({collaboratorsList.length})
                  </h2>
                  <p className="text-xs text-theme-secondary">
                    Miembros incorporados a la iniciativa.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {collaboratorsList.map((collab) => {
                  const collabCampus = getCampusBySlug(collab.campusSlug);
                  return (
                    <div
                      key={collab.id}
                      className="flex items-center justify-between rounded-2xl border border-theme bg-theme-subtle p-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={collab.avatarUrl || '/assets/citt-logo.webp'}
                          alt={collab.fullName}
                          className="h-10 w-10 rounded-xl object-cover ring-1 ring-[#FFB800]"
                        />
                        <div>
                          <Link
                            href={`/u/${collab.username}`}
                            className="font-bold text-xs text-theme-primary hover:underline"
                          >
                            {collab.fullName}
                          </Link>
                          <p className="text-[11px] font-semibold text-[#FFB800]">
                            {collab.roleInProject}
                          </p>
                          <p className="text-[10px] text-theme-secondary">
                            Sede {collabCampus.shortName}
                          </p>
                        </div>
                      </div>

                      {/* Botón para remover colaborador si es el Líder */}
                      {isLead && collab.username !== project.leadUsername && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCollab(collab.username)}
                          className="text-theme-secondary hover:text-red-500 p-1"
                          title="Retirar colaborador del equipo"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PANEL EXCLUSIVO DEL LÍDER: BANDEJA DE POSTULACIONES */}
          {isLead && (
            <ProjectReviewTray
              applications={project.applications || []}
              onApprove={(appId, role) => {
                const res = approveApplication(project.id, appId, role);
                alert(res.message);
              }}
              onReject={(appId) => {
                const res = rejectApplication(project.id, appId);
                alert(res.message);
              }}
            />
          )}
        </div>

        {/* COLUMNA LATERAL (4 Cols): Postulación SSO & Hub Ecosistema CITT */}
        <aside className="space-y-6 lg:col-span-4">
          <ProjectApplicationCard
            project={project}
            activeUser={activeUser}
            isAuthenticated={isAuthenticated}
            isLead={isLead}
            isCollaborator={Boolean(isCollaborator)}
            appStatus={appStatus}
            onApply={(data) => applyToProject(project.id, data)}
            onWithdraw={handleWithdraw}
          />

          {/* HUB ECOSISTEMA CITT */}
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

              <div className="flex items-start gap-2.5 rounded-2xl border border-theme bg-theme-subtle p-3">
                <Compass className="h-4 w-4 shrink-0 text-[#43B02A] mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-theme-primary">
                    Control de Acceso Físico NFC
                  </p>
                  <p className="text-[11px] text-theme-secondary">
                    Check-in en laboratorio y autorización de instrumental con tu pin 3D personal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal Lightbox de Video Demo */}
      {videoData && (
        <Dialog.Root open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-[#1A1A1A] p-4 text-white shadow-2xl focus:outline-none">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-[#FFB800]" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Video Pitch · {project.title}
                  </span>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
                <iframe
                  src={videoData.embedUrl || undefined}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      {/* Modal de Edición del Proyecto por el Líder */}
      <ProjectEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        project={project}
        onSave={(updates) => updateProject(project.id, updates)}
      />
    </div>
  );
}
