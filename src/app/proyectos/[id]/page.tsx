'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Copy,
  ExternalLink,
  FileCode,
  FileText,
  Github,
  HandHelping,
  Info,
  MapPin,
  Play,
  Send,
  Share2,
  Sparkles,
  UserCheck,
  Users,
  Video,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import { getCampusBySlug, getSchoolBySlug } from '@/data/citt-catalog';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';
import { getEmbedVideoUrl } from '@/lib/video';
import { getSchoolChromaticPair } from '@/styles/themes';

interface PageProps {
  params: Promise<{ id: string }>;
}

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

  // Buscar por slug o por id
  const project =
    projects.find(
      (p) => p.slug === projectIdOrSlug || p.id === projectIdOrSlug
    ) || projects[0];

  const [activeTab, setActiveTab] = useState<'readme' | 'details'>('readme');
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Estados del formulario de postulación
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
  const chromatic = getSchoolChromaticPair(school, theme);
  const videoData = getEmbedVideoUrl(project.videoUrl);
  const userHasApplied = hasUserApplied(project.id);
  const isLead =
    activeUser.username === project.leadUsername || activeUser.role === 'dev';

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
      {/* Cinta Cromática de la Escuela Duoc UC */}
      <div
        className="h-2 w-full rounded-full shadow-sm"
        style={{
          background: `linear-gradient(90deg, ${school.primaryHex} 0%, ${school.secondaryHex} 100%)`,
        }}
      />

      {/* Navegación y Breadcrumb */}
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
          <span className="truncate max-w-xs sm:max-w-md text-theme-primary">
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
              <span>Ver Repositorio</span>
              <ExternalLink className="h-3 w-3 text-theme-secondary" />
            </a>
          )}
        </div>
      </div>

      {/* Cabecera Principal del Proyecto */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <SchoolBadge schoolSlug={project.schoolSlug} />
          <span className="inline-flex items-center gap-1 rounded-full border border-theme bg-theme-subtle px-2.5 py-0.5 text-xs text-theme-primary">
            <MapPin className="h-3 w-3 text-[#307FE2]" />
            <span>{campus.name}</span>
          </span>
          <span className="rounded-full bg-[#307FE2] px-2.5 py-0.5 text-xs font-bold uppercase text-white">
            {project.status.replace('_', ' ')}
          </span>
          {project.lookingForCollaborators && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#FFB800]/40 bg-[#FFB800]/15 px-2.5 py-0.5 text-xs font-bold text-theme-primary">
              <HandHelping className="h-3 w-3 text-[#FFB800]" />
              <span>Convocatoria Activa</span>
            </span>
          )}
        </div>

        <h1 className="text-balance text-2xl font-black tracking-tight text-theme-primary sm:text-4xl">
          {project.title}
        </h1>

        <p className="text-base leading-relaxed text-theme-secondary">
          {project.summary}
        </p>

        {/* Ficha del Líder del Proyecto */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-theme bg-theme-surface p-4 shadow-theme-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-subtle text-[#307FE2]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-theme-secondary">Liderado por:</span>
                <Link
                  href={`/u/${project.leadUsername}`}
                  className="text-sm font-bold text-theme-primary hover:underline"
                >
                  {project.leadName}
                </Link>
                <RoleBadge role={project.leadRole} showTooltip={false} />
              </div>
              <p className="text-xs text-theme-secondary">
                {campus.name} · {school.name}
              </p>
            </div>
          </div>

          <Link
            href={`/u/${project.leadUsername}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-subtle px-3 py-1.5 text-xs font-bold text-theme-primary transition hover:border-[#FFB800] hover:bg-theme-surface"
          >
            <span>Ver Pase Digital del Líder</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Reproductor de Video Embebido (YouTube / Demo sin redirección) */}
      {videoData.embedUrl && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-theme-primary">
              <Video className="h-4 w-4 text-[#307FE2]" />
              <span>Video Demostrativo / Pitch del Proyecto</span>
            </h2>
            <span className="text-xs text-theme-secondary">
              Reproducción directa sin salir de CITT Connect
            </span>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-theme bg-black shadow-theme-card">
            {videoData.provider === 'direct' ? (
              <video
                controls
                src={videoData.embedUrl}
                className="h-full w-full object-contain"
              >
                Tu navegador no soporta reproducción de video.
              </video>
            ) : (
              <iframe
                src={videoData.embedUrl}
                title={`Video demostrativo de ${project.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            )}
          </div>
        </section>
      )}

      {/* Layout Principal: Contenido Técnico (README / Ficha) + Sidebar de Postulación */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* COLUMNA PRINCIPAL (8 Cols): Selector de Vista README.md vs Ficha */}
        <div className="space-y-6 lg:col-span-8">
          {/* Selector de Pestañas */}
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
                <span>README.md (Estilo GitHub)</span>
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
                <span>Ficha Técnica & Requerimientos</span>
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

          {/* VISTA 1: README.MD ESTILO GITHUB */}
          {activeTab === 'readme' && (
            <div className="rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-theme-card">
              {/* Barra superior de archivo estilo GitHub */}
              <div className="mb-6 flex items-center justify-between border-b border-theme pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-theme-secondary">
                  <FileText className="h-4 w-4 text-[#FFB800]" />
                  <span className="font-bold text-theme-primary">README.md</span>
                  <span>· {project.slug}.md</span>
                </div>

                <span className="rounded-md border border-theme bg-theme-subtle px-2 py-0.5 text-xs font-mono text-theme-secondary">
                  Markdown GFM
                </span>
              </div>

              {/* Contenido Markdown Renderizado */}
              <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-black prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-p:text-theme-secondary prose-a:text-[#307FE2] prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-theme-subtle prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-xs prose-pre:rounded-2xl prose-pre:border prose-pre:border-theme prose-pre:bg-theme-canvas prose-hr:border-theme">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
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

        {/* COLUMNA LATERAL (4 Cols): Módulo de Postulación con Cuenta Logueada */}
        <aside className="space-y-6 lg:col-span-4">
          <div className="sticky top-24 rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
            {/* Cabecera del Módulo */}
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
                {/* Preguntas del Formulario si está configurado en modo form */}
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

                {/* Nota o mensaje motivacional opcional */}
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

            {/* Aviso de Conectividad del Ecosistema */}
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-theme bg-theme-subtle p-3 text-xs text-theme-secondary">
              <Info className="h-4 w-4 shrink-0 text-[#307FE2]" />
              <p>
                Al ser parte de CITT Connect, tu participación en este proyecto quedará registrada para futuros sistemas del centro (Sprint Trackers y Calendario CITT).
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
