'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowRight,
  Building2,
  Check,
  ClipboardList,
  Compass,
  FileText,
  Filter,
  Flame,
  HandHelping,
  Layers,
  Lightbulb,
  MapPin,
  Play,
  Plus,
  Rocket,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Users,
  Video,
  X,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import {
  CITT_CAMPUSES,
  DUOC_SCHOOLS,
  getCampusBySlug,
  getSchoolBySlug,
} from '@/data/citt-catalog';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';
import {
  CittRole,
  DuocSchoolSlug,
  ProjectApplicationMode,
  ProjectMaturityStage,
  ProjectQuestion,
} from '@/types/citt';

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

const MATURITY_CONFIG: Record<
  ProjectMaturityStage,
  { label: string; tag: string; badgeClass: string }
> = {
  ideacion: {
    label: 'TRL 1-2 · Ideación & Concepto',
    tag: 'Ideación',
    badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
  },
  prototipado: {
    label: 'TRL 3-4 · Prototipado de Laboratorio',
    tag: 'Prototipo',
    badgeClass: 'border-blue-500/30 bg-blue-500/10 text-blue-500',
  },
  pruebas_campo: {
    label: 'TRL 5-6 · Pruebas en Terreno',
    tag: 'Pruebas Terreno',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
  },
  transferencia: {
    label: 'TRL 7-8 · Transferencia & Industria',
    tag: 'Transferencia',
    badgeClass: 'border-purple-500/30 bg-purple-500/10 text-purple-500',
  },
};

const REGIONS = [
  'Todas las Regiones',
  'Metropolitana',
  'Valparaíso',
  'Biobío',
  'Los Lagos',
];

type QuickTab = 'todos' | 'iniciativas' | 'ayuda' | 'colaboradores' | 'video';

export default function InterCampusProjectsPage() {
  const {
    projects,
    activeUser,
    addProject,
    toggleFeaturedProject,
  } = useCittNetwork();

  // Permisos para destacar: Core Dev o Personal Duoc
  const canFeatureProjects =
    activeUser.role === 'dev' || activeUser.role === 'personal_duoc';

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<QuickTab>('todos');
  const [selectedSchool, setSelectedSchool] = useState<string>('todas');
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas las Regiones');
  const [selectedCampus, setSelectedCampus] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedMaturity, setSelectedMaturity] = useState<string>('todas');

  // Modal creation state
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [neededSpecsInput, setNeededSpecsInput] = useState('');
  const [helpDetails, setHelpDetails] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [readmeContent, setReadmeContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('/assets/banner-iot.webp');
  const [maturityStage, setMaturityStage] =
    useState<ProjectMaturityStage>('prototipado');
  const [applicationMode, setApplicationMode] =
    useState<ProjectApplicationMode>('direct');
  const [question1, setQuestion1] = useState(
    '¿En qué sede y carrera de Duoc UC estudias?'
  );
  const [question2, setQuestion2] = useState(
    '¿Qué experiencia previa o interés tienes en esta área?'
  );

  // Filtered campuses based on selected region
  const availableCampuses = useMemo(() => {
    if (selectedRegion === 'Todas las Regiones') {
      return CITT_CAMPUSES;
    }
    return CITT_CAMPUSES.filter((c) => c.region === selectedRegion);
  }, [selectedRegion]);

  // Real-time filtering logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // 1. Text Search across title, summary, specialties, lead, help, readme, campus, school
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const campus = getCampusBySlug(project.originCampusSlug);
        const school = getSchoolBySlug(project.schoolSlug);

        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesSummary = project.summary.toLowerCase().includes(query);
        const matchesLead = project.leadName.toLowerCase().includes(query);
        const matchesSpecs = project.neededSpecialties?.some((spec) =>
          spec.toLowerCase().includes(query)
        );
        const matchesHelp = project.helpRequestDetails
          ?.toLowerCase()
          .includes(query);
        const matchesReadme = project.readmeContent
          ?.toLowerCase()
          .includes(query);
        const matchesCampus =
          campus.name.toLowerCase().includes(query) ||
          campus.shortName.toLowerCase().includes(query);
        const matchesSchool =
          school.name.toLowerCase().includes(query) ||
          school.shortName.toLowerCase().includes(query);

        if (
          !matchesTitle &&
          !matchesSummary &&
          !matchesLead &&
          !matchesSpecs &&
          !matchesHelp &&
          !matchesReadme &&
          !matchesCampus &&
          !matchesSchool
        ) {
          return false;
        }
      }

      // 2. Quick Tab
      if (activeTab === 'iniciativas') {
        if (project.status === 'idea' && project.lookingForCollaborators) {
          return false;
        }
      } else if (activeTab === 'ayuda') {
        if (!project.lookingForCollaborators) return false;
      } else if (activeTab === 'colaboradores') {
        if (!project.lookingForCollaborators) return false;
      } else if (activeTab === 'video') {
        if (!project.videoUrl) return false;
      }

      // 3. School Facet
      if (selectedSchool !== 'todas' && project.schoolSlug !== selectedSchool) {
        return false;
      }

      // 4. Region Facet
      if (selectedRegion !== 'Todas las Regiones') {
        const campus = getCampusBySlug(project.originCampusSlug);
        if (campus.region !== selectedRegion) {
          return false;
        }
      }

      // 5. Campus Facet
      if (
        selectedCampus !== 'todas' &&
        project.originCampusSlug !== selectedCampus
      ) {
        return false;
      }

      // 6. Status Facet
      if (selectedStatus !== 'todos' && project.status !== selectedStatus) {
        return false;
      }

      // 7. Maturity Stage Facet
      if (
        selectedMaturity !== 'todas' &&
        project.maturityStage !== selectedMaturity
      ) {
        return false;
      }

      return true;
    });
  }, [
    projects,
    searchQuery,
    activeTab,
    selectedSchool,
    selectedRegion,
    selectedCampus,
    selectedStatus,
    selectedMaturity,
  ]);

  // Spotlight Project: SOLO APARECE SI UN CORE DEV / ADMIN LO DESTACÓ
  const spotlightProject = useMemo(() => {
    return projects.find((p) => p.isFeatured === true);
  }, [projects]);

  // Active filters count
  const isFiltered =
    Boolean(searchQuery.trim()) ||
    activeTab !== 'todos' ||
    selectedSchool !== 'todas' ||
    selectedRegion !== 'Todas las Regiones' ||
    selectedCampus !== 'todas' ||
    selectedStatus !== 'todos' ||
    selectedMaturity !== 'todas';

  const resetFilters = () => {
    setSearchQuery('');
    setActiveTab('todos');
    setSelectedSchool('todas');
    setSelectedRegion('Todas las Regiones');
    setSelectedCampus('todas');
    setSelectedStatus('todos');
    setSelectedMaturity('todas');
  };

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
      coverImageUrl: coverImageUrl || '/assets/banner-iot.webp',
      galleryImages: [coverImageUrl || '/assets/banner-iot.webp'],
      maturityStage,
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
    setCoverImageUrl('/assets/banner-iot.webp');
    setMaturityStage('prototipado');
    setApplicationMode('direct');
    setModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. HERO INFORMATIVO & GUÍA SIMPLE DE 3 PASOS */}
      <section className="relative overflow-hidden rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-theme-card">
        {/* Cabecera del Hero */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/30 bg-[#FFB800]/10 px-3 py-1 text-xs font-bold text-[#FFB800]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ecosistema de Innovación Colaborativa Duoc UC</span>
            </div>

            <h1 className="text-balance text-2xl font-black tracking-tight text-theme-primary sm:text-3xl lg:text-4xl">
              Hub de Proyectos & Convocatorias Inter-Sedes
            </h1>

            <p className="text-sm leading-relaxed text-theme-secondary sm:text-base">
              Espacio central para descubrir iniciativas tecnológicas, sumar tu especialidad
              a proyectos de otras sedes y postular con tu cuenta institucional CITT Connect.
            </p>
          </div>

          <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-5 py-3.5 text-xs font-black text-[#1A1A1A] shadow-md transition hover:bg-[#ffc633] hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                <span>Proponer Proyecto / Pedir Ayuda</span>
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
              <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[92vh] w-[94vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 text-theme-primary shadow-2xl focus:outline-none sm:p-8">
                <div className="flex items-center justify-between border-b border-theme pb-4">
                  <div>
                    <Dialog.Title className="text-base font-black text-theme-primary">
                      Publicar Proyecto o Convocatoria CITT
                    </Dialog.Title>
                    <p className="text-xs text-theme-secondary">
                      Visible para todas las sedes de Duoc UC en la red CITT
                    </p>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Cerrar modal"
                      className="rounded-xl p-1.5 text-theme-secondary hover:bg-theme-subtle hover:text-theme-primary"
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
                      Resumen Ejecutivo *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Describe qué problemática resuelve y su propuesta de valor tecnológica..."
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  {/* Nivel de Madurez TRL */}
                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Nivel de Madurez Tecnológica (TRL)
                    </label>
                    <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {(
                        [
                          'ideacion',
                          'prototipado',
                          'pruebas_campo',
                          'transferencia',
                        ] as ProjectMaturityStage[]
                      ).map((stage) => {
                        const isSelected = maturityStage === stage;
                        const config = MATURITY_CONFIG[stage];
                        return (
                          <button
                            key={stage}
                            type="button"
                            onClick={() => setMaturityStage(stage)}
                            className={`rounded-xl border p-2.5 text-left text-xs transition ${
                              isSelected
                                ? 'border-[#FFB800] bg-theme-subtle font-bold text-theme-primary ring-1 ring-[#FFB800]'
                                : 'border-theme bg-transparent text-theme-secondary hover:border-theme-primary'
                            }`}
                          >
                            <span className="block font-bold">{config.tag}</span>
                            <span className="text-[10px] text-theme-secondary">
                              {stage === 'ideacion'
                                ? 'TRL 1-2'
                                : stage === 'prototipado'
                                ? 'TRL 3-4'
                                : stage === 'pruebas_campo'
                                ? 'TRL 5-6'
                                : 'TRL 7-8'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Enlace Video / Pitch */}
                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Video Pitch o Demostración (YouTube / Vimeo / Loom - Opcional)
                    </label>
                    <div className="relative mt-1">
                      <Video className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... (se reproducirá integrado en el detalle)"
                        className="w-full rounded-xl border border-theme bg-theme-subtle py-2.5 pr-3.5 pl-10 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Documentación Técnica README.md */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-theme-primary">
                        Documentación Técnica (README.md estilo GitHub con soporte Mermaid)
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

                  {/* Especialidades buscadas y GitHub */}
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
                        Repositorio de Código (GitHub/GitLab - Opcional)
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

                  {/* Modalidad de Postulación */}
                  <div className="rounded-2xl border border-theme bg-theme-subtle p-4">
                    <p className="text-xs font-bold text-theme-primary">
                      Modalidad de Postulación para Compañeros
                    </p>
                    <p className="text-[11px] text-theme-secondary mt-0.5">
                      Siempre se registrará la cuenta institucional autenticada de CITT Connect.
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
                          <p className="font-bold">Postulación Directa (1 Clic)</p>
                          <p className="text-[10px] text-theme-secondary">
                            Rápida vinculación con su perfil CITT
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
                          <p className="text-[10px] text-theme-secondary">
                            Filtro a medida antes de aceptar
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
                          <label className="text-[11px] text-theme-secondary">
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
                          <label className="text-[11px] text-theme-secondary">
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
                        className="rounded-xl border border-theme px-4 py-2 text-xs font-semibold text-theme-primary hover:bg-theme-subtle"
                      >
                        Cancelar
                      </button>
                    </Dialog.Close>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                    >
                      Publicar en Red Nacional CITT
                    </button>
                  </div>
                </form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        {/* Instrucción Básica: Cómo funciona en 3 pasos sencillos */}
        <div className="mt-6 grid grid-cols-1 gap-3 border-t border-theme pt-6 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-2xl border border-theme bg-theme-subtle p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#307FE2]/10 text-[#307FE2]">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-theme-primary">
                1. Explora & Filtra
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-theme-secondary">
                Busca por escuela, sede o tecnologías (IoT, IA, VR) y descubre qué se está construyendo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-theme bg-theme-subtle p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#43B02A]/10 text-[#43B02A]">
              <HandHelping className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-theme-primary">
                2. Postula con tu Cuenta CITT
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-theme-secondary">
                Únete a convocatorias abiertas en 1 clic o mediante formulario usando tu credencial institucional.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-theme bg-theme-subtle p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFB800]/10 text-[#FFB800]">
              <Rocket className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-theme-primary">
                3. Lanza tu Iniciativa o Pide Ayuda
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-theme-secondary">
                Publica un proyecto o solicita especialidades específicas para colaborar con alumnos de todo el país.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROYECTO DESTACADO (CONDICIONAL: SOLO SI UN CORE DEV LO MARCÓ COMO DESTACADO) */}
      {spotlightProject && !isFiltered && (
        <section className="relative overflow-hidden rounded-3xl border border-[#FFB800]/40 bg-theme-surface p-6 sm:p-8 shadow-theme-card">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            {/* Portada 16:9 con overlays */}
            <div className="relative aspect-video w-full lg:w-1/2 overflow-hidden rounded-2xl bg-black">
              <img
                src={
                  spotlightProject.coverImageUrl ||
                  spotlightProject.galleryImages?.[0] ||
                  '/assets/banner-iot.webp'
                }
                alt={spotlightProject.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              {/* Badges Superpuestos */}
              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFB800] px-3 py-1 text-xs font-black text-[#1A1A1A] shadow-md">
                  <Star className="h-3.5 w-3.5 fill-[#1A1A1A] text-[#1A1A1A]" />
                  <span>Destacado por Core Dev</span>
                </span>
                <SchoolBadge schoolSlug={spotlightProject.schoolSlug} />
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                  <MapPin className="h-3 w-3 text-[#307FE2]" />
                  <span>{getCampusBySlug(spotlightProject.originCampusSlug).name}</span>
                </span>

                {spotlightProject.videoUrl && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                    <Play className="h-3 w-3 fill-white" />
                    <span>Video Demo</span>
                  </span>
                )}
              </div>
            </div>

            {/* Información & Contenido */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {spotlightProject.maturityStage && (
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                        MATURITY_CONFIG[spotlightProject.maturityStage].badgeClass
                      }`}
                    >
                      {MATURITY_CONFIG[spotlightProject.maturityStage].label}
                    </span>
                  )}
                  <span className="rounded-full bg-[#307FE2]/10 border border-[#307FE2]/30 px-2.5 py-0.5 text-xs font-bold text-[#307FE2] uppercase">
                    {spotlightProject.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Control para Core Dev: Desmarcar destacado */}
                {canFeatureProjects && (
                  <button
                    type="button"
                    onClick={() => toggleFeaturedProject(spotlightProject.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-theme bg-theme-subtle px-2.5 py-1 text-[11px] font-semibold text-theme-secondary hover:text-red-500"
                    title="Solo visible para Core Devs"
                  >
                    <X className="h-3 w-3" />
                    <span>Quitar de Destacados</span>
                  </button>
                )}
              </div>

              <div>
                <h2 className="text-xl font-black text-theme-primary sm:text-2xl">
                  {spotlightProject.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-theme-secondary sm:text-sm">
                  {spotlightProject.summary}
                </p>
              </div>

              {/* Especialidades buscadas */}
              {spotlightProject.neededSpecialties &&
                spotlightProject.neededSpecialties.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-theme-primary">
                      Perfiles & Especialidades en Convocatoria:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {spotlightProject.neededSpecialties.map((spec) => (
                        <span
                          key={spec}
                          className="rounded-lg border border-theme bg-theme-subtle px-2 py-0.5 text-xs font-medium text-theme-primary"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Colaboradores & Botón "Más información" */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-theme pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    {(spotlightProject.collaborators || []).slice(0, 4).map((collab) => {
                      const isGold = collab.role === 'personal_duoc';
                      const isPurple = collab.role === 'partner';
                      const isBlue = collab.role === 'dev' || collab.role === 'lider_citt';
                      return (
                        <img
                          key={collab.id || collab.username}
                          src={collab.avatarUrl || '/assets/citt-logo.webp'}
                          alt={collab.fullName}
                          title={`${collab.fullName} (${collab.roleInProject})`}
                          className={`inline-block h-8 w-8 rounded-full object-cover ring-2 ${
                            isGold
                              ? 'ring-[#FFB800]'
                              : isPurple
                              ? 'ring-[#AC4FC6]'
                              : isBlue
                              ? 'ring-[#307FE2]'
                              : 'ring-theme'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs text-theme-secondary">
                    Lidera:{' '}
                    <strong className="text-theme-primary">
                      {spotlightProject.leadName}
                    </strong>
                  </span>
                </div>

                <Link
                  href={`/proyectos/${spotlightProject.slug || spotlightProject.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-black text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633]"
                >
                  <span>Más información</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. BARRA DE BÚSQUEDA Y FILTRADO POR FACETAS */}
      <section className="space-y-4 rounded-3xl border border-theme bg-theme-surface p-5 sm:p-6 shadow-theme-card">
        {/* Fila 1: Búsqueda de texto y Segmented Tabs */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Input de Búsqueda */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tecnología (ESP32, Python), sede, nombre del proyecto o líder..."
              className="w-full rounded-2xl border border-theme bg-theme-subtle py-2.5 pr-10 pl-10 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-theme-secondary hover:text-theme-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('todos')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeTab === 'todos'
                  ? 'bg-[#FFB800] text-[#1A1A1A]'
                  : 'border border-theme bg-theme-subtle text-theme-primary hover:bg-theme-elevated'
              }`}
            >
              Todos ({projects.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('iniciativas')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeTab === 'iniciativas'
                  ? 'bg-[#FFB800] text-[#1A1A1A]'
                  : 'border border-theme bg-theme-subtle text-theme-primary hover:bg-theme-elevated'
              }`}
            >
              Iniciativas
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ayuda')}
              className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeTab === 'ayuda'
                  ? 'bg-[#FFB800] text-[#1A1A1A]'
                  : 'border border-theme bg-theme-subtle text-theme-primary hover:bg-theme-elevated'
              }`}
            >
              <HandHelping className="h-3.5 w-3.5" />
              <span>Convocatorias SOS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeTab === 'video'
                  ? 'bg-[#FFB800] text-[#1A1A1A]'
                  : 'border border-theme bg-theme-subtle text-theme-primary hover:bg-theme-elevated'
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              <span>Con Video Pitch</span>
            </button>
          </div>
        </div>

        {/* Fila 2: Selectores Facetados Dropdowns */}
        <div className="grid grid-cols-2 gap-3 border-t border-theme pt-4 sm:grid-cols-3 lg:grid-cols-5">
          {/* Faceta Escuela Duoc UC */}
          <div>
            <label className="block text-[11px] font-bold text-theme-secondary mb-1">
              Escuela Duoc UC
            </label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full rounded-xl border border-theme bg-theme-subtle px-2.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
            >
              <option value="todas">Todas las Escuelas ({DUOC_SCHOOLS.length})</option>
              {DUOC_SCHOOLS.map((school) => (
                <option key={school.slug} value={school.slug}>
                  {school.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Faceta Región */}
          <div>
            <label className="block text-[11px] font-bold text-theme-secondary mb-1">
              Región de Chile
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedCampus('todas'); // reset campus when region changes
              }}
              className="w-full rounded-xl border border-theme bg-theme-subtle px-2.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
            >
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Faceta Sede Duoc UC */}
          <div>
            <label className="block text-[11px] font-bold text-theme-secondary mb-1">
              Sede Duoc UC
            </label>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full rounded-xl border border-theme bg-theme-subtle px-2.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
            >
              <option value="todas">
                Todas las Sedes ({availableCampuses.length})
              </option>
              {availableCampuses.map((campus) => (
                <option key={campus.slug} value={campus.slug}>
                  {campus.name}
                </option>
              ))}
            </select>
          </div>

          {/* Faceta Estado */}
          <div>
            <label className="block text-[11px] font-bold text-theme-secondary mb-1">
              Estado de Proyecto
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-theme bg-theme-subtle px-2.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
            >
              <option value="todos">Todos los Estados</option>
              <option value="idea">Idea / Concepción</option>
              <option value="en_desarrollo">En Desarrollo</option>
              <option value="prototipo">Prototipo Funcional</option>
              <option value="finalizado">Finalizado / Transferido</option>
            </select>
          </div>

          {/* Faceta Nivel de Madurez (TRL) */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[11px] font-bold text-theme-secondary mb-1">
              Nivel de Madurez (TRL)
            </label>
            <select
              value={selectedMaturity}
              onChange={(e) => setSelectedMaturity(e.target.value)}
              className="w-full rounded-xl border border-theme bg-theme-subtle px-2.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
            >
              <option value="todas">Todos los TRL</option>
              <option value="ideacion">Ideación (TRL 1-2)</option>
              <option value="prototipado">Prototipado (TRL 3-4)</option>
              <option value="pruebas_campo">Pruebas Campo (TRL 5-6)</option>
              <option value="transferencia">Transferencia (TRL 7-8)</option>
            </select>
          </div>
        </div>

        {/* Fila 3: Resultados dinámicos y Botón de Limpiar Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme pt-3 text-xs text-theme-secondary">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-[#307FE2]" />
            <span>
              Mostrando{' '}
              <strong className="text-theme-primary">
                {filteredProjects.length}
              </strong>{' '}
              de {projects.length} proyectos encontrados
            </span>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-theme bg-theme-subtle px-3 py-1 text-xs font-semibold text-theme-primary transition hover:border-[#FFB800]"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </section>

      {/* 4. CUADRÍCULA DE PROYECTOS (ESTRUCTURA DE 3 NIVELES) */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-3xl border border-theme bg-theme-surface p-12 text-center shadow-theme-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-theme bg-theme-subtle text-theme-secondary">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-theme-primary">
            No se encontraron proyectos con los filtros seleccionados
          </h3>
          <p className="mt-1 text-xs text-theme-secondary">
            Prueba ajustando la búsqueda, seleccionando otra sede o limpiando los filtros.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restablecer Filtros</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const campus = getCampusBySlug(project.originCampusSlug);
            const coverImage =
              project.coverImageUrl ||
              project.galleryImages?.[0] ||
              '/assets/banner-iot.webp';
            const maturityInfo = project.maturityStage
              ? MATURITY_CONFIG[project.maturityStage]
              : null;
            const collaborators = project.collaborators || [];

            return (
              <article
                key={project.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card transition hover:border-[#FFB800]/50 hover:shadow-lg"
              >
                {/* NIVEL 1: PORTADA PANORÁMICA 16:9 CON OVERLAYS */}
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={coverImage}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />

                  {/* Overlays Superiores: Escuela, Sede y Control Core Dev */}
                  <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
                    <SchoolBadge schoolSlug={project.schoolSlug} />

                    <div className="flex items-center gap-1.5">
                      {/* Botón para Core Devs: Marcar / Desmarcar Destacado */}
                      {canFeatureProjects && (
                        <button
                          type="button"
                          onClick={() => toggleFeaturedProject(project.id)}
                          className={`rounded-full p-1 backdrop-blur-md transition ${
                            project.isFeatured
                              ? 'bg-[#FFB800] text-[#1A1A1A]'
                              : 'border border-white/20 bg-black/60 text-white/80 hover:text-white'
                          }`}
                          title={
                            project.isFeatured
                              ? 'Proyecto Destacado (clic para quitar)'
                              : 'Destacar como Proyecto Core Dev'
                          }
                        >
                          <Star
                            className={`h-3 w-3 ${
                              project.isFeatured ? 'fill-[#1A1A1A]' : ''
                            }`}
                          />
                        </button>
                      )}

                      <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
                        <MapPin className="h-3 w-3 text-[#307FE2]" />
                        <span>{campus.shortName}</span>
                      </span>
                    </div>
                  </div>

                  {/* Overlays Inferiores: Badges de Capacidades */}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {project.videoUrl && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-red-600/90 px-2 py-0.5 font-bold text-white backdrop-blur-md">
                          <Play className="h-2.5 w-2.5 fill-white" />
                          <span>Video Pitch</span>
                        </span>
                      )}
                      {project.readmeContent && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-black/60 px-2 py-0.5 font-bold text-white backdrop-blur-md">
                          <FileText className="h-2.5 w-2.5 text-[#FFB800]" />
                          <span>README</span>
                        </span>
                      )}
                    </div>

                    {maturityInfo && (
                      <span className="rounded-md border border-white/20 bg-black/60 px-2 py-0.5 font-bold text-white backdrop-blur-md">
                        {maturityInfo.tag}
                      </span>
                    )}
                  </div>
                </div>

                {/* NIVEL 2: CUERPO DE INFORMACIÓN & EQUIPO */}
                <div className="flex-1 p-5 sm:p-6 space-y-4">
                  <div>
                    <Link
                      href={`/proyectos/${project.slug || project.id}`}
                      className="group/title inline-block"
                    >
                      <h3 className="text-base font-black leading-snug text-theme-primary transition group-hover/title:text-[#307FE2]">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-theme-secondary">
                      {project.summary}
                    </p>
                  </div>

                  {/* Especialidades Buscadas */}
                  {project.lookingForCollaborators && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-theme-primary">
                        <HandHelping className="h-3.5 w-3.5 text-[#FFB800]" />
                        <span>Se buscan colaboradores:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.neededSpecialties.slice(0, 3).map((spec) => (
                          <span
                            key={spec}
                            className="rounded-lg border border-theme bg-theme-subtle px-2 py-0.5 text-[11px] font-semibold text-theme-primary"
                          >
                            {spec}
                          </span>
                        ))}
                        {project.neededSpecialties.length > 3 && (
                          <span className="rounded-lg border border-theme bg-theme-subtle px-1.5 py-0.5 text-[11px] text-theme-secondary">
                            +{project.neededSpecialties.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Fila de Colaboradores con Anillos de Rol Institucional */}
                  <div className="flex items-center justify-between border-t border-theme pt-3">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {collaborators.slice(0, 3).map((c) => {
                          const isGold = c.role === 'personal_duoc';
                          const isPurple = c.role === 'partner';
                          const isBlue = c.role === 'dev' || c.role === 'lider_citt';
                          return (
                            <img
                              key={c.id || c.username}
                              src={c.avatarUrl || '/assets/citt-logo.webp'}
                              alt={c.fullName}
                              title={`${c.fullName} (${c.roleInProject})`}
                              className={`inline-block h-7 w-7 rounded-full object-cover ring-2 ${
                                isGold
                                  ? 'ring-[#FFB800]'
                                  : isPurple
                                  ? 'ring-[#AC4FC6]'
                                  : isBlue
                                  ? 'ring-[#307FE2]'
                                  : 'ring-theme'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-[11px] text-theme-secondary">
                        {collaborators.length > 0
                          ? `${collaborators.length} integrantes`
                          : 'Equipo CITT'}
                      </span>
                    </div>

                    <span className="rounded-full bg-theme-subtle border border-theme px-2 py-0.5 text-[10px] font-bold uppercase text-theme-secondary">
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* NIVEL 3: FOOTER CON LÍDER & BOTÓN "MÁS INFORMACIÓN" */}
                <div className="flex items-center justify-between gap-3 border-t border-theme bg-theme-subtle/50 px-5 py-3.5 sm:px-6">
                  <div className="flex items-center gap-2 min-w-0">
                    <RoleBadge role={project.leadRole} showTooltip={false} />
                    <Link
                      href={`/u/${project.leadUsername}`}
                      className="truncate text-xs font-bold text-theme-primary hover:underline"
                    >
                      {project.leadName}
                    </Link>
                  </div>

                  <Link
                    href={`/proyectos/${project.slug || project.id}`}
                    className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-[#FFB800] px-3.5 py-1.5 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633]"
                  >
                    <span>Más información</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
