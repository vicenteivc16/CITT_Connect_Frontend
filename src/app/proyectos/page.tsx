'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  HandHelping,
  MapPin,
  Play,
  Plus,
  Rocket,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import {
  CITT_CAMPUSES,
  DUOC_SCHOOLS,
  getCampusBySlug,
} from '@/data/citt-catalog';
import { SchoolBadge } from '@/components/RoleBadge';
import { CittProject, ProjectMaturityStage } from '@/types/citt';

// Subcomponentes Modulares de Proyectos
import { ProjectCard } from '@/components/proyectos/ProjectCard';
import { ProjectFiltersBar } from '@/components/proyectos/ProjectFiltersBar';
import { CreateProjectModal } from '@/components/proyectos/CreateProjectModal';

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
    label: 'TRL 5-6 · Validación en Entorno Real',
    tag: 'Validación',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
  },
  transferencia: {
    label: 'TRL 7-8 · Transferencia Tecnológica',
    tag: 'Transferencia',
    badgeClass: 'border-purple-500/30 bg-purple-500/10 text-purple-500',
  },
};

const REGIONS = [
  'Todas las Regiones',
  'Región Metropolitana',
  'Región de Valparaíso',
  'Región del Biobío',
  'Región de La Araucanía',
  'Región de Los Lagos',
];

export default function ProjectsShowcasePage() {
  const {
    projects,
    activeUser,
    isAuthenticated,
    addProject,
    toggleFeaturedProject,
  } = useCittNetwork();

  // Estados de Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string>('todas');
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas las Regiones');
  const [selectedCampus, setSelectedCampus] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedMaturity, setSelectedMaturity] = useState<string>('todas');
  const [activeTab, setActiveTab] = useState<'todos' | 'iniciativas' | 'ayuda' | 'video'>('todos');

  // Modal de Creación
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const canFeatureProjects =
    activeUser.role === 'dev' || activeUser.role === 'lider_citt';

  // Sedes filtradas por región seleccionada
  const availableCampuses = useMemo(() => {
    if (selectedRegion === 'Todas las Regiones') {
      return CITT_CAMPUSES;
    }
    return CITT_CAMPUSES.filter((c) => c.region === selectedRegion);
  }, [selectedRegion]);

  // Proyecto Destacado (Spotlight)
  const spotlightProject = useMemo(() => {
    const featured = projects.find((p) => p.isFeatured);
    if (featured) return featured;
    return projects[0] || null;
  }, [projects]);

  // Lógica de Filtrado Multicriterio
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filtro por Tab Principal
      if (activeTab === 'ayuda' && !project.lookingForCollaborators) return false;
      if (activeTab === 'iniciativas' && project.lookingForCollaborators) return false;
      if (activeTab === 'video' && !project.videoUrl) return false;

      // Filtro por Escuela
      if (selectedSchool !== 'todas' && project.schoolSlug !== selectedSchool)
        return false;

      // Filtro por Región
      if (selectedRegion !== 'Todas las Regiones') {
        const campus = getCampusBySlug(project.originCampusSlug);
        if (campus.region !== selectedRegion) return false;
      }

      // Filtro por Sede
      if (selectedCampus !== 'todas' && project.originCampusSlug !== selectedCampus)
        return false;

      // Filtro por Estado
      if (selectedStatus !== 'todos' && project.status !== selectedStatus)
        return false;

      // Filtro por Nivel de Madurez (TRL)
      if (selectedMaturity !== 'todas' && project.maturityStage !== selectedMaturity)
        return false;

      // Búsqueda de Texto
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const campus = getCampusBySlug(project.originCampusSlug);
        const school = DUOC_SCHOOLS.find((s) => s.slug === project.schoolSlug);

        const matchTitle = project.title.toLowerCase().includes(q);
        const matchSummary = project.summary.toLowerCase().includes(q);
        const matchLead = project.leadName.toLowerCase().includes(q);
        const matchCampus = campus.name.toLowerCase().includes(q);
        const matchSchool = school ? school.name.toLowerCase().includes(q) : false;
        const matchSpecs = (project.neededSpecialties || []).some((s) =>
          s.toLowerCase().includes(q)
        );

        if (
          !matchTitle &&
          !matchSummary &&
          !matchLead &&
          !matchCampus &&
          !matchSchool &&
          !matchSpecs
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    projects,
    activeTab,
    selectedSchool,
    selectedRegion,
    selectedCampus,
    selectedStatus,
    selectedMaturity,
    searchQuery,
  ]);

  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedSchool !== 'todas' ||
    selectedRegion !== 'Todas las Regiones' ||
    selectedCampus !== 'todas' ||
    selectedStatus !== 'todos' ||
    selectedMaturity !== 'todas' ||
    activeTab !== 'todos';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSchool('todas');
    setSelectedRegion('Todas las Regiones');
    setSelectedCampus('todas');
    setSelectedStatus('todos');
    setSelectedMaturity('todas');
    setActiveTab('todos');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. CABECERA & HERO DE PROYECTOS */}
      <section className="rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-theme-card">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#FFB800]" />
              <p className="text-xs font-black uppercase tracking-wider text-[#FFB800]">
                Ecosistema de I+D y Proyectos Aplicados
              </p>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-theme-primary sm:text-4xl">
              Iniciativas & Convocatorias Inter-Sedes
            </h1>
            <p className="max-w-3xl text-xs leading-relaxed text-theme-secondary sm:text-sm">
              Espacio abierto donde estudiantes y docentes de Duoc UC presentan soluciones tecnológicas reales, colaboran entre sedes y postulan a equipos multidisciplinarios.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-5 py-3 text-xs font-black text-[#1A1A1A] shadow-md transition hover:bg-[#ffc633] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Publicar Proyecto</span>
          </button>
        </div>

        {/* 3 Pasos CITT */}
        <div className="mt-6 grid grid-cols-1 gap-3 border-t border-theme pt-6 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-2xl border border-theme bg-theme-subtle p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#307FE2]/10 text-[#307FE2]">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-theme-primary">1. Explora & Filtra</p>
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
              <p className="text-xs font-bold text-theme-primary">2. Postula con tu Cuenta CITT</p>
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
              <p className="text-xs font-bold text-theme-primary">3. Lanza tu Iniciativa o Pide Ayuda</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-theme-secondary">
                Publica un proyecto o solicita especialidades específicas para colaborar con alumnos de todo el país.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROYECTO DESTACADO (SPOTLIGHT) */}
      {spotlightProject && !isFiltered && (
        <section className="relative overflow-hidden rounded-3xl border border-[#FFB800]/40 bg-theme-surface p-6 sm:p-8 shadow-theme-card">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="relative aspect-video w-full lg:w-1/2 overflow-hidden rounded-2xl bg-black">
              <img
                src={
                  spotlightProject.coverImageUrl ||
                  spotlightProject.galleryImages?.[0] ||
                  '/assets/banner-iot.webp'
                }
                alt={spotlightProject.title}
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFB800] px-3 py-1 text-xs font-black text-[#1A1A1A] shadow-md">
                  <Star className="h-3.5 w-3.5 fill-[#1A1A1A] text-[#1A1A1A]" />
                  <span>Destacado CITT</span>
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
                    <span>Video Pitch</span>
                  </span>
                )}
              </div>
            </div>

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
              </div>

              <div>
                <h2 className="text-xl font-black text-theme-primary sm:text-2xl">
                  {spotlightProject.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-theme-secondary sm:text-sm">
                  {spotlightProject.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-theme pt-4">
                <span className="text-xs text-theme-secondary">
                  Lidera: <strong className="text-theme-primary font-bold">{spotlightProject.leadName}</strong>
                </span>

                <Link
                  href={`/proyectos/${spotlightProject.slug || spotlightProject.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-black text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633]"
                >
                  <span>Ver Ficha Completa</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. BARRA DE FILTRADO MODULAR */}
      <ProjectFiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedSchool={selectedSchool}
        onSchoolChange={setSelectedSchool}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedMaturity={selectedMaturity}
        onMaturityChange={setSelectedMaturity}
        regions={REGIONS}
        availableCampuses={availableCampuses}
        totalProjects={projects.length}
        filteredCount={filteredProjects.length}
        isFiltered={isFiltered}
        onResetFilters={resetFilters}
      />

      {/* 4. CUADRÍCULA DE PROYECTOS MODULARES */}
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
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              canFeatureProjects={canFeatureProjects}
              onToggleFeatured={toggleFeaturedProject}
            />
          ))}
        </div>
      )}

      {/* Modal Desacoplado de Creación de Proyecto */}
      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        activeUser={activeUser}
        isAuthenticated={isAuthenticated}
        onProjectCreated={addProject}
      />
    </div>
  );
}
