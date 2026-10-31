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
} from '@/data/citt-catalog';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';
import { getEmbedVideoUrl } from '@/lib/video';
import { getSchoolChromaticPair } from '@/styles/themes';
import { CittRole, ProjectCollaborator, ProjectMaturityStage } from '@/types/citt';

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
    desc: 'Desarrollo de prototipo funcional en talleres CITT.',
  },
  pruebas_campo: {
    label: 'Fase 3: Pruebas en Campo',
    step: 3,
    color: '#FFB800',
    desc: 'Validación en entorno real con estudiantes y sedes de la red.',
  },
  transferencia: {
    label: 'Fase 4: Transferencia & Partner',
    step: 4,
    color: '#43B02A',
    desc: 'Solución lista para despliegue industrial o postulación a fondos.',
  },
};

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
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const [applicationNote, setApplicationNote] = useState('');
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Leader Management state (UC-LID-03)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [approvingAppId, setApprovingAppId] = useState<string | null>(null);
  const [assignRoleInput, setAssignRoleInput] = useState('');

  // Edit project form state
  const [editTitle, setEditTitle] = useState(project?.title || '');
  const [editSummary, setEditSummary] = useState(project?.summary || '');
  const [editMaturity, setEditMaturity] = useState<ProjectMaturityStage>(
    project?.maturityStage || 'prototipado'
  );
  const [editVideoUrl, setEditVideoUrl] = useState(project?.videoUrl || '');
  const [editReadme, setEditReadme] = useState(project?.readmeContent || '');
  const [editSpecs, setEditSpecs] = useState(
    project?.neededSpecialties?.join(', ') || ''
  );
  const [editLooking, setEditLooking] = useState(
    project?.lookingForCollaborators ?? true
  );

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
      setFormAnswers({});
      setApplicationNote('');
    } else {
      setSubmissionFeedback({
        type: 'error',
        text: result.message,
      });
    }
  };

  const handleWithdraw = () => {
    if (confirm('¿Estás seguro de que deseas retirar tu postulación a esta iniciativa?')) {
      const res = withdrawApplication(project.id);
      setSubmissionFeedback({ type: 'success', text: res.message });
    }
  };

  const handleApproveConfirm = (applicationId: string) => {
    const roleToAssign = assignRoleInput.trim() || 'Colaborador de Proyecto';
    const res = approveApplication(project.id, applicationId, roleToAssign);
    setApprovingAppId(null);
    setAssignRoleInput('');
    alert(res.message);
  };

  const handleRejectConfirm = (applicationId: string) => {
    if (confirm('¿Deseas desestimar esta postulación?')) {
      const res = rejectApplication(project.id, applicationId);
      alert(res.message);
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

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const specsArray = editSpecs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateProject(project.id, {
      title: editTitle.trim(),
      summary: editSummary.trim(),
      maturityStage: editMaturity,
      videoUrl: editVideoUrl.trim() || undefined,
      readmeContent: editReadme.trim() || undefined,
      neededSpecialties: specsArray,
      lookingForCollaborators: editLooking,
    });

    setIsEditModalOpen(false);
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

      {/* 2. Barra de Navegación y Herramientas del Líder */}
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

        <div className="flex flex-wrap items-center gap-2">
          {/* Controles exclusivos de edición y borrado para el Líder */}
          {isLead && (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditTitle(project.title);
                  setEditSummary(project.summary);
                  setEditMaturity(project.maturityStage || 'prototipado');
                  setEditVideoUrl(project.videoUrl || '');
                  setEditReadme(project.readmeContent || '');
                  setEditSpecs(project.neededSpecialties?.join(', ') || '');
                  setEditLooking(project.lookingForCollaborators);
                  setIsEditModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#307FE2] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#2569bd]"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Editar Proyecto</span>
              </button>

              <button
                type="button"
                onClick={handleDeleteProject}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                title="Eliminar este proyecto"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Eliminar</span>
              </button>
            </>
          )}

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

      {/* 3. Hero Panorámico de Medios */}
      <section className="relative overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card">
        <div className="relative h-60 sm:h-72 lg:h-80 w-full overflow-hidden bg-black">
          <img
            src={galleryList[activeMediaIndex]}
            alt={project.title}
            className="h-full w-full object-cover object-center opacity-85 transition duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

          {/* Badges Flotantes sobre el Hero */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 sm:top-6 sm:left-6 sm:right-6">
            <div className="flex flex-wrap items-center gap-2">
              <SchoolBadge schoolSlug={project.schoolSlug} />
              <span className="inline-flex items-center gap-1 rounded-full bg-[#1A1A1A]/85 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                <MapPin className="h-3 w-3 text-[#FFB800]" />
                <span>{campus.name}</span>
              </span>
            </div>

            {project.isFeatured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFB800] px-3.5 py-1 text-xs font-black text-[#1A1A1A] shadow-lg">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Proyecto Destacado Nacional</span>
              </span>
            )}
          </div>

          {/* CTA de Video Lightbox si existe */}
          {videoData && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="group flex items-center gap-3 rounded-full border border-white/20 bg-black/60 px-5 py-3 text-xs font-bold text-white backdrop-blur-md transition hover:scale-105 hover:bg-[#FFB800] hover:text-[#1A1A1A]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFB800] text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white">
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </div>
                <span>Ver Video Pitch / Demo</span>
              </button>
            </div>
          )}

          {/* Selector de Galería */}
          {galleryList.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-2xl bg-black/70 p-1.5 backdrop-blur-md">
              {galleryList.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`h-9 w-14 overflow-hidden rounded-lg border transition ${
                    activeMediaIndex === idx
                      ? 'border-[#FFB800] scale-105'
                      : 'border-white/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Título, Resumen y Métricas Clave */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-theme-primary">
                {project.title}
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-theme-secondary font-medium">
                {project.summary}
              </p>

              {/* Barra de Progreso de Madurez TRL */}
              <div className="space-y-2 rounded-2xl border border-theme bg-theme-subtle p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-theme-primary">
                    Madurez Tecnológica (TRL Duoc UC)
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-black text-white"
                    style={{ backgroundColor: maturity.color }}
                  >
                    {maturity.label}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[1, 2, 3, 4].map((step) => {
                    const isPassed = step <= maturity.step;
                    return (
                      <div
                        key={step}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isPassed ? '' : 'bg-theme-elevated'
                        }`}
                        style={{
                          backgroundColor: isPassed ? maturity.color : undefined,
                        }}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-theme-secondary">{maturity.desc}</p>
              </div>
            </div>

            {/* Ficha Rápida del Líder e Información de Postulación */}
            <div className="space-y-4 rounded-2xl border border-theme bg-theme-subtle p-5 lg:col-span-4">
              <div className="flex items-center gap-3">
                <img
                  src={activeUser.username === project.leadUsername ? (activeUser.avatarUrl || '/assets/citt-logo.webp') : '/assets/citt-logo.webp'}
                  alt={project.leadName}
                  className="h-12 w-12 rounded-2xl object-cover ring-2 ring-[#FFB800]"
                />
                <div>
                  <p className="text-xs text-theme-secondary font-medium">
                    Líder del Proyecto
                  </p>
                  <Link
                    href={`/u/${project.leadUsername}`}
                    className="font-bold text-sm text-theme-primary hover:underline"
                  >
                    {project.leadName}
                  </Link>
                  <div className="mt-0.5">
                    <RoleBadge role={project.leadRole} showTooltip={false} size="sm" />
                  </div>
                </div>
              </div>

              <div className="border-t border-theme pt-3 space-y-2 text-xs text-theme-secondary">
                <div className="flex justify-between">
                  <span>Sede de Origen:</span>
                  <strong className="text-theme-primary">{campus.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Escuela:</span>
                  <strong className="text-theme-primary">{school.shortName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Convocatoria:</span>
                  <strong
                    className={
                      project.lookingForCollaborators
                        ? 'text-[#43B02A]'
                        : 'text-theme-secondary'
                    }
                  >
                    {project.lookingForCollaborators ? 'Abierta (Buscando Talento)' : 'Cerrada'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

          {/* PANEL EXCLUSIVO DEL LÍDER / ADMIN: GESTIÓN DE POSTULACIONES (UC-LID-03) */}
          {isLead && (
            <div className="rounded-3xl border border-[#307FE2]/40 bg-theme-surface p-6 shadow-theme-card">
              <div className="flex items-center justify-between border-b border-theme pb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#307FE2]" />
                  <h2 className="text-base font-bold text-theme-primary">
                    Bandeja del Líder: Postulaciones Recibidas ({project.applications?.length || 0})
                  </h2>
                </div>
                <span className="rounded-full bg-[#307FE2]/10 px-2.5 py-0.5 text-xs font-bold text-[#307FE2]">
                  Caso UC-LID-03 Activo
                </span>
              </div>

              {!project.applications || project.applications.length === 0 ? (
                <div className="py-8 text-center">
                  <Users className="mx-auto h-8 w-8 text-theme-secondary opacity-50" />
                  <p className="mt-2 text-xs font-bold text-theme-primary">
                    Aún no hay postulaciones para esta iniciativa
                  </p>
                  <p className="mt-0.5 text-[11px] text-theme-secondary">
                    Comparte tu proyecto en el Muro de Noticias o en el Directorio para convocar colaboradores.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {project.applications.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-2xl border border-theme bg-theme-subtle p-4 transition"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <Link
                            href={`/u/${app.applicantUsername}`}
                            className="font-bold text-sm text-theme-primary hover:underline"
                          >
                            {app.applicantName}
                          </Link>
                          <RoleBadge role={app.applicantRole} showTooltip={false} size="sm" />
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                              app.status === 'accepted'
                                ? 'bg-[#43B02A]/15 text-[#43B02A]'
                                : app.status === 'rejected'
                                ? 'bg-red-500/15 text-red-500'
                                : 'bg-[#FFB800]/15 text-[#FFB800]'
                            }`}
                          >
                            {app.status === 'accepted'
                              ? 'Aceptado en el Equipo'
                              : app.status === 'rejected'
                              ? 'Desestimado'
                              : 'Pendiente de Revisión'}
                          </span>
                        </div>
                        <span className="text-xs text-theme-secondary">
                          {app.appliedAt}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-theme-secondary">
                        Correo: {app.applicantEmail} · Sede: {getCampusBySlug(app.applicantCampusSlug).name}
                      </p>

                      {/* Respuestas del Formulario */}
                      {app.answers && Object.keys(app.answers).length > 0 && (
                        <div className="mt-3 space-y-1.5 rounded-xl border border-theme bg-theme-surface p-3 text-xs">
                          {Object.entries(app.answers).map(([key, val]) => (
                            <div key={key}>
                              <span className="font-bold text-theme-primary">{key}: </span>
                              <span className="text-theme-secondary">{val}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {app.note && (
                        <p className="mt-2 rounded-xl bg-theme-surface p-2.5 text-xs italic text-theme-primary">
                          &ldquo;{app.note}&rdquo;
                        </p>
                      )}

                      {/* Acciones de Aprobación / Rechazo UC-LID-03 */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-theme pt-3">
                        <Link
                          href={`/u/${app.applicantUsername}`}
                          className="rounded-lg border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary hover:border-[#FFB800]"
                        >
                          Ver Credencial Completa
                        </Link>

                        {app.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            {approvingAppId === app.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={assignRoleInput}
                                  onChange={(e) => setAssignRoleInput(e.target.value)}
                                  placeholder="Rol (ej. Desarrollador C++)"
                                  className="rounded-xl border border-theme bg-theme-surface px-2.5 py-1 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleApproveConfirm(app.id)}
                                  className="rounded-xl bg-[#43B02A] px-3 py-1 text-xs font-bold text-white hover:bg-[#389623]"
                                >
                                  Confirmar Admisión
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setApprovingAppId(null)}
                                  className="text-xs text-theme-secondary hover:text-theme-primary"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setApprovingAppId(app.id);
                                    setAssignRoleInput('Colaborador de Proyecto');
                                  }}
                                  className="inline-flex items-center gap-1 rounded-xl bg-[#43B02A] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#389623]"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Aceptar en el Equipo</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRejectConfirm(app.id)}
                                  className="inline-flex items-center gap-1 rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-secondary transition hover:text-red-500"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  <span>Declinar</span>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* COLUMNA LATERAL (4 Cols): Postulación SSO & Hub Ecosistema CITT */}
        <aside className="space-y-6 lg:col-span-4">
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

            {/* Caso 1: No autenticado */}
            {!isAuthenticated ? (
              <div className="mt-5 space-y-3 rounded-2xl border border-theme bg-theme-subtle p-4 text-center">
                <LogIn className="mx-auto h-7 w-7 text-[#FFB800]" />
                <p className="text-xs font-bold text-theme-primary">
                  Inicia sesión para postular a este equipo
                </p>
                <p className="text-[11px] text-theme-secondary">
                  Tu postulación se vincula automáticamente con tu credencial @duocuc.cl.
                </p>
                <Link
                  href={`/acceso?redirect=/proyectos/${project.slug}`}
                  className="mt-2 block w-full rounded-xl bg-[#FFB800] py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                >
                  Acceder a CITT Connect
                </Link>
              </div>
            ) : project.leadUsername === activeUser.username ? (
              /* Caso 2: Es el líder del proyecto */
              <div className="mt-5 rounded-2xl border border-theme bg-theme-subtle p-4 text-center">
                <Shield className="mx-auto h-7 w-7 text-[#307FE2]" />
                <p className="mt-2 text-xs font-bold text-theme-primary">
                  Eres el Líder y Creador de este Proyecto
                </p>
                <p className="mt-1 text-[11px] text-theme-secondary">
                  Administra las postulaciones y la admisión de colaboradores en la bandeja inferior.
                </p>
              </div>
            ) : isCollaborator ? (
              /* Caso 3: Ya es parte del equipo */
              <div className="mt-5 rounded-2xl border border-[#43B02A]/40 bg-[#43B02A]/10 p-4 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-[#43B02A]" />
                <p className="mt-2 text-xs font-bold text-theme-primary">
                  ¡Eres Colaborador Oficial de este Proyecto!
                </p>
                <p className="mt-1 text-[11px] text-theme-secondary">
                  Tu nombre y rol figuran en la pestaña de Equipo.
                </p>
              </div>
            ) : appStatus === 'accepted' ? (
              /* Caso 4: Fue aceptado */
              <div className="mt-5 rounded-2xl border border-[#43B02A]/40 bg-[#43B02A]/10 p-4 text-center">
                <Award className="mx-auto h-8 w-8 text-[#43B02A]" />
                <p className="mt-2 text-xs font-bold text-theme-primary">
                  ¡Tu postulación ha sido Aceptada!
                </p>
                <p className="mt-1 text-[11px] text-theme-secondary">
                  El líder del proyecto te ha sumado al equipo. Revisa tu correo institucional para la coordinación.
                </p>
              </div>
            ) : appStatus === 'pending' ? (
              /* Caso 5: Postulación en revisión */
              <div className="mt-5 space-y-3 rounded-2xl border border-[#FFB800]/40 bg-[#FFB800]/10 p-4 text-center">
                <Clock className="mx-auto h-8 w-8 text-[#FFB800]" />
                <p className="text-xs font-bold text-theme-primary">
                  Postulación en Revisión
                </p>
                <p className="text-[11px] text-theme-secondary">
                  El líder del equipo ha recibido tu ficha y la evaluará a la brevedad.
                </p>
                <button
                  type="button"
                  onClick={handleWithdraw}
                  className="rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-secondary hover:text-red-500"
                >
                  Retirar Postulación
                </button>
              </div>
            ) : appStatus === 'rejected' ? (
              /* Caso 6: Declinada */
              <div className="mt-5 rounded-2xl border border-theme bg-theme-subtle p-4 text-center">
                <Info className="mx-auto h-7 w-7 text-theme-secondary" />
                <p className="mt-2 text-xs font-bold text-theme-primary">
                  Postulación Desestimada
                </p>
                <p className="mt-1 text-[11px] text-theme-secondary">
                  El equipo cerró las vacantes para este perfil. Puedes explorar otras iniciativas en el Hub.
                </p>
              </div>
            ) : (
              /* Caso 7: Formulario de Inscripción SSO */
              <>
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
                  <p className="mt-2 text-[11px] text-theme-secondary">
                    Tu postulación se vinculará automáticamente a tu perfil institucional verificado.
                  </p>
                </div>

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

                <form onSubmit={handleApplySubmit} className="mt-5 space-y-4">
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
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1A1A1A]/30 bg-[#FFB800] px-4 py-3 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633] focus-visible:outline-none"
                  >
                    <Send className="h-4 w-4" />
                    <span>
                      {project.applicationMode === 'form'
                        ? 'Enviar Formulario de Postulación'
                        : 'Postular Directamente al Equipo'}
                    </span>
                  </button>
                </form>
              </>
            )}
          </div>

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
      <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-2xl focus:outline-none">
            <div className="flex items-center justify-between border-b border-theme pb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-[#307FE2]" />
                <Dialog.Title className="text-lg font-bold text-theme-primary">
                  Editar Iniciativa: {project.title}
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-theme-subtle text-theme-primary hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-theme-primary">
                  Título del Proyecto
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-theme-primary">
                  Resumen Ejecutivo
                </label>
                <textarea
                  rows={3}
                  required
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Madurez Tecnológica (TRL)
                  </label>
                  <select
                    value={editMaturity}
                    onChange={(e) =>
                      setEditMaturity(e.target.value as ProjectMaturityStage)
                    }
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  >
                    <option value="ideacion">Fase 1: Ideación (TRL 1-2)</option>
                    <option value="prototipado">Fase 2: Prototipado en Lab (TRL 3-4)</option>
                    <option value="pruebas_campo">Fase 3: Pruebas en Campo (TRL 5-6)</option>
                    <option value="transferencia">Fase 4: Transferencia (TRL 7-8)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    URL de Video Pitch (YouTube / Vimeo)
                  </label>
                  <input
                    type="url"
                    value={editVideoUrl}
                    onChange={(e) => setEditVideoUrl(e.target.value)}
                    placeholder="https://youtu.be/..."
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-theme-primary">
                  Especialidades Requeridas (separadas por coma)
                </label>
                <input
                  type="text"
                  value={editSpecs}
                  onChange={(e) => setEditSpecs(e.target.value)}
                  placeholder="React, Microcontroladores, CAD 3D, Ciberseguridad"
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-theme-primary">
                  Documentación Extendida (README.md con soporte Mermaid)
                </label>
                <textarea
                  rows={8}
                  value={editReadme}
                  onChange={(e) => setEditReadme(e.target.value)}
                  placeholder="## Arquitectura del Sistema..."
                  className="mt-1 w-full font-mono rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="edit-looking"
                  type="checkbox"
                  checked={editLooking}
                  onChange={(e) => setEditLooking(e.target.checked)}
                  className="h-4 w-4 rounded border-theme text-[#FFB800]"
                />
                <label htmlFor="edit-looking" className="text-xs font-bold text-theme-primary">
                  Convocatoria Abierta (Buscando colaboradores activamente)
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-theme pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-theme bg-theme-surface px-4 py-2 text-xs font-bold text-theme-secondary hover:text-theme-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FFB800] px-5 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#ffc633]"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
