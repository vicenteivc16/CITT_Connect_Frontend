'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowRight,
  ClipboardList,
  FileText,
  HandHelping,
  MapPin,
  Play,
  Plus,
  Sparkles,
  Users,
  Video,
  X,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import { getCampusBySlug } from '@/data/citt-catalog';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';
import { ProjectApplicationMode, ProjectQuestion } from '@/types/citt';

const DEFAULT_README_TEMPLATE = `# [Nombre del Proyecto] 🚀

> **Iniciativa Inter-Sedes CITT Duoc UC**

## 💡 Descripción & Propósito
Breve explicación de la problemática que resuelve este proyecto y qué tecnologías clave utiliza.

---

## 🛠️ Stack Tecnológico
* **Lenguajes:** TypeScript / Python / C++
* **Frameworks & Librerías:** Next.js / ROS 2 / PyTorch
* **Hardware:** ESP32 / Arduino / Sensores IoT

---

## 👥 Colaboradores Buscados
Buscamos compañeros de diferentes sedes y escuelas de Duoc UC para apoyarnos en:
1. Diseño de Interfaz & Prototipado UX
2. Desarrollo de Firmware / Backend
3. Pruebas de campo y validación con usuarios
`;

export default function InterCampusProjectsPage() {
  const { projects, activeUser, addProject } = useCittNetwork();
  const [onlyLookingForHelp, setOnlyLookingForHelp] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [neededSpecsInput, setNeededSpecsInput] = useState('');
  const [helpDetails, setHelpDetails] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [readmeContent, setReadmeContent] = useState('');
  const [applicationMode, setApplicationMode] =
    useState<ProjectApplicationMode>('direct');
  const [question1, setQuestion1] = useState(
    '¿En qué sede y carrera de Duoc UC estudias?'
  );
  const [question2, setQuestion2] = useState(
    '¿Qué experiencia previa o interés tienes en esta área?'
  );

  const visibleProjects = onlyLookingForHelp
    ? projects.filter((p) => p.lookingForCollaborators)
    : projects;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const specs = neededSpecsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const questions: ProjectQuestion[] = [];
    if (applicationMode === 'form') {
      if (question1.trim()) {
        questions.push({
          id: 'q1',
          question: question1.trim(),
          required: true,
        });
      }
      if (question2.trim()) {
        questions.push({
          id: 'q2',
          question: question2.trim(),
          required: false,
        });
      }
    }

    addProject({
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: title.trim(),
      summary: summary.trim(),
      status: 'en_desarrollo',
      leadUsername: activeUser.username,
      leadName: activeUser.fullName,
      leadRole: activeUser.role,
      originCampusSlug: activeUser.campusSlug,
      schoolSlug: activeUser.schoolSlug,
      lookingForCollaborators: true,
      neededSpecialties:
        specs.length > 0 ? specs : ['Colaboración Inter-Sedes'],
      helpRequestDetails:
        helpDetails.trim() ||
        'Abierto a colaborar con estudiantes y líderes de cualquier sede CITT de Chile.',
      repoUrl: repoUrl.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      readmeContent: readmeContent.trim() || undefined,
      applicationMode,
      applicationQuestions: questions.length > 0 ? questions : undefined,
    });

    // Reset form
    setTitle('');
    setSummary('');
    setNeededSpecsInput('');
    setHelpDetails('');
    setRepoUrl('');
    setVideoUrl('');
    setReadmeContent('');
    setApplicationMode('direct');
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-6 border-b border-theme pb-8 sm:flex-row sm:items-end">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-balance text-3xl font-black tracking-tight text-theme-primary sm:text-4xl">
            Hub de Proyectos Inter-Sedes & Solicitudes de Ayuda
          </h1>
          <p className="text-sm leading-relaxed text-theme-secondary">
            Propón iniciativas tecnológicas, busca colaboradores de otras
            carreras o sedes CITT de Chile y suma tu especialidad a proyectos en
            desarrollo.
          </p>
        </div>

        <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-3 text-sm font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
            >
              <Plus className="h-4 w-4" />
              <span>Proponer Proyecto / Pedir Ayuda</span>
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[92vh] w-[94vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 text-theme-primary shadow-2xl focus:outline-none sm:p-8">
              <div className="flex items-center justify-between border-b border-theme pb-3">
                <Dialog.Title className="text-base font-bold text-theme-primary">
                  Proponer Proyecto o Convocatoria CITT
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Cerrar modal"
                    className="rounded-lg p-1 text-theme-secondary hover:text-theme-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>

              <form onSubmit={handleCreateProject} className="mt-5 space-y-4">
                {/* Título */}
                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Título del Proyecto o Iniciativa *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Sistema IoT de Riego Inteligente Multi-Sede"
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                {/* Resumen */}
                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Resumen del Proyecto *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Describe qué problema resuelve y en qué etapa se encuentra..."
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                {/* Enlace Video / YouTube Demo */}
                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Enlace de Video Demo (YouTube, Vimeo o video directo)
                  </label>
                  <div className="relative mt-1">
                    <Video className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... (se reproducirá en el portal sin salir)"
                      className="w-full rounded-xl border border-theme bg-theme-subtle py-2 pr-3.5 pl-10 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>
                  <p className="mt-1 text-xs text-theme-secondary">
                    Los videos de YouTube se incrustan directamente en la vista de detalle para que los evaluadores lo vean sin ser redirigidos.
                  </p>
                </div>

                {/* Documentación README.md (Estilo GitHub) */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-theme-primary">
                      Documentación Técnica (README.md estilo GitHub)
                    </label>
                    <button
                      type="button"
                      onClick={() => setReadmeContent(DEFAULT_README_TEMPLATE)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#307FE2] hover:underline"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Cargar plantilla Markdown</span>
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={readmeContent}
                    onChange={(e) => setReadmeContent(e.target.value)}
                    placeholder="# Nombre del Proyecto&#10;&#10;Escribe o pega aquí el contenido Markdown tal como en un README de GitHub..."
                    className="mt-1 font-mono w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                {/* Especialidades buscadas */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Especialidades buscadas (separadas por coma)
                    </label>
                    <input
                      type="text"
                      value={neededSpecsInput}
                      onChange={(e) => setNeededSpecsInput(e.target.value)}
                      placeholder="Diseño UX, Impresión 3D, Python"
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Repositorio GitHub (Opcional)
                    </label>
                    <input
                      type="url"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/usuario/repo"
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Modo de Postulación: Directa vs Formulario con Preguntas */}
                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5">
                  <p className="text-xs font-bold text-theme-primary">
                    Modalidad de Postulación para Compañeros
                  </p>
                  <p className="text-xs text-theme-secondary mt-0.5">
                    Siempre se utilizará la cuenta logueada del ecosistema CITT Connect para registrar la postulación.
                  </p>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setApplicationMode('direct')}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition ${
                        applicationMode === 'direct'
                          ? 'border-[#FFB800] bg-theme-surface font-bold text-theme-primary shadow-sm'
                          : 'border-theme bg-transparent text-theme-secondary'
                      }`}
                    >
                      <ArrowRight className="h-4 w-4 shrink-0 text-[#FFB800]" />
                      <div>
                        <p className="font-bold">Botón Postular Directo</p>
                        <p className="text-xs text-theme-secondary">
                          1-clic rápido con su perfil CITT
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setApplicationMode('form')}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition ${
                        applicationMode === 'form'
                          ? 'border-[#307FE2] bg-theme-surface font-bold text-theme-primary shadow-sm'
                          : 'border-theme bg-transparent text-theme-secondary'
                      }`}
                    >
                      <ClipboardList className="h-4 w-4 shrink-0 text-[#307FE2]" />
                      <div>
                        <p className="font-bold">Formulario con Preguntas</p>
                        <p className="text-xs text-theme-secondary">
                          Filtro con preguntas a medida
                        </p>
                      </div>
                    </button>
                  </div>

                  {applicationMode === 'form' && (
                    <div className="mt-3 space-y-2 border-t border-theme pt-3">
                      <p className="text-xs font-bold text-theme-primary">
                        Preguntas para los postulantes:
                      </p>
                      <div>
                        <label className="text-xs text-theme-secondary">
                          Pregunta 1 (Obligatoria):
                        </label>
                        <input
                          type="text"
                          value={question1}
                          onChange={(e) => setQuestion1(e.target.value)}
                          className="mt-0.5 w-full rounded-lg border border-theme bg-theme-surface px-2.5 py-1.5 text-xs text-theme-primary focus:border-[#307FE2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-theme-secondary">
                          Pregunta 2 (Opcional):
                        </label>
                        <input
                          type="text"
                          value={question2}
                          onChange={(e) => setQuestion2(e.target.value)}
                          className="mt-0.5 w-full rounded-lg border border-theme bg-theme-surface px-2.5 py-1.5 text-xs text-theme-primary focus:border-[#307FE2] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="rounded-xl border border-theme px-4 py-2 text-xs font-semibold text-theme-primary"
                    >
                      Cancelar
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                  >
                    Publicar en Red Nacional CITT
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyLookingForHelp(false)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              !onlyLookingForHelp
                ? 'bg-[#FFB800] text-[#1A1A1A]'
                : 'border border-theme bg-theme-subtle text-theme-primary'
            }`}
          >
            Todos los Proyectos ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setOnlyLookingForHelp(true)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              onlyLookingForHelp
                ? 'bg-[#FFB800] text-[#1A1A1A]'
                : 'border border-theme bg-theme-subtle text-theme-primary'
            }`}
          >
            <HandHelping className="h-3.5 w-3.5" />
            <span>Buscando Colaboradores Inter-Sedes</span>
          </button>
        </div>

        <span className="text-xs text-theme-secondary">
          Sesión activa:{' '}
          <strong className="text-theme-primary">{activeUser.fullName}</strong>
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {visibleProjects.map((project) => {
          const campus = getCampusBySlug(project.originCampusSlug);

          return (
            <article
              key={project.id}
              className="flex flex-col justify-between rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <SchoolBadge schoolSlug={project.schoolSlug} />
                    <span className="inline-flex items-center gap-1 rounded-full border border-theme bg-theme-subtle px-2.5 py-0.5 text-xs text-theme-primary">
                      <MapPin className="h-3 w-3 text-[#307FE2]" />
                      {campus.shortName}
                    </span>
                  </div>

                  <span className="rounded-full bg-[#307FE2] px-2.5 py-0.5 text-xs font-bold text-white uppercase">
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-black text-theme-primary">
                  {project.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-theme-secondary">
                  {project.summary}
                </p>

                {/* Badges de soporte multimedia */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  {project.videoUrl && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#307FE2]/30 bg-[#307FE2]/10 px-2 py-0.5 font-bold text-[#307FE2]">
                      <Play className="h-3 w-3" />
                      <span>Video Demo Incrustado</span>
                    </span>
                  )}
                  {project.readmeContent && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-theme bg-theme-subtle px-2 py-0.5 font-bold text-theme-primary">
                      <FileText className="h-3 w-3 text-[#FFB800]" />
                      <span>README.md GitHub</span>
                    </span>
                  )}
                  {project.applicationMode === 'form' ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#AC4FC6]/30 bg-[#AC4FC6]/10 px-2 py-0.5 font-bold text-[#AC4FC6]">
                      <ClipboardList className="h-3 w-3" />
                      <span>Postulación por Formulario</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#43B02A]/30 bg-[#43B02A]/10 px-2 py-0.5 font-bold text-[#43B02A]">
                      <ArrowRight className="h-3 w-3" />
                      <span>Postulación Directa</span>
                    </span>
                  )}
                </div>

                {project.lookingForCollaborators && (
                  <div className="mt-4 border-t border-theme pt-4">
                    <p className="inline-flex items-center gap-1.5 text-xs font-bold text-theme-primary">
                      <HandHelping className="h-4 w-4 text-[#FFB800]" />
                      <span>Se buscan colaboradores / Especialidades:</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {project.neededSpecialties.map((spec) => (
                        <span
                          key={spec}
                          className="rounded-lg bg-theme-elevated px-2.5 py-1 text-xs font-semibold text-theme-primary"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer con Lead y Botón "Más información" */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-theme pt-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#307FE2]" />
                  <span className="text-xs text-theme-secondary">Lidera:</span>
                  <Link
                    href={`/u/${project.leadUsername}`}
                    className="text-xs font-bold text-theme-primary hover:underline"
                  >
                    {project.leadName}
                  </Link>
                  <RoleBadge role={project.leadRole} showTooltip={false} />
                </div>

                <Link
                  href={`/proyectos/${project.slug || project.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633]"
                >
                  <span>Más información</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
