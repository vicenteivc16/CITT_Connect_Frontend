'use client';

import React from 'react';
import { Filter, HandHelping, RotateCcw, Search, Video, X } from 'lucide-react';
import { DUOC_SCHOOLS } from '@/data/citt-catalog';
import { CittCampus } from '@/types/citt';

interface ProjectFiltersBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  activeTab: 'todos' | 'iniciativas' | 'ayuda' | 'video';
  onTabChange: (tab: 'todos' | 'iniciativas' | 'ayuda' | 'video') => void;
  selectedSchool: string;
  onSchoolChange: (school: string) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  selectedCampus: string;
  onCampusChange: (campus: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedMaturity: string;
  onMaturityChange: (maturity: string) => void;
  regions: string[];
  availableCampuses: CittCampus[];
  totalProjects: number;
  filteredCount: number;
  isFiltered: boolean;
  onResetFilters: () => void;
}

export function ProjectFiltersBar({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  selectedSchool,
  onSchoolChange,
  selectedRegion,
  onRegionChange,
  selectedCampus,
  onCampusChange,
  selectedStatus,
  onStatusChange,
  selectedMaturity,
  onMaturityChange,
  regions,
  availableCampuses,
  totalProjects,
  filteredCount,
  isFiltered,
  onResetFilters,
}: ProjectFiltersBarProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-theme bg-theme-surface p-5 sm:p-6 shadow-theme-card">
      {/* Fila 1: Búsqueda de texto y Segmented Tabs */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Input de Búsqueda */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por tecnología (ESP32, Python), sede, nombre del proyecto o líder..."
            className="w-full rounded-2xl border border-theme bg-theme-subtle py-2.5 pr-10 pl-10 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
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
            onClick={() => onTabChange('todos')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              activeTab === 'todos'
                ? 'bg-[#FFB800] text-[#1A1A1A]'
                : 'border border-theme bg-theme-subtle text-theme-primary hover:bg-theme-elevated'
            }`}
          >
            Todos ({totalProjects})
          </button>

          <button
            type="button"
            onClick={() => onTabChange('iniciativas')}
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
            onClick={() => onTabChange('ayuda')}
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
            onClick={() => onTabChange('video')}
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
            onChange={(e) => onSchoolChange(e.target.value)}
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
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full rounded-xl border border-theme bg-theme-subtle px-2.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
          >
            {regions.map((region) => (
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
            onChange={(e) => onCampusChange(e.target.value)}
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
            onChange={(e) => onStatusChange(e.target.value)}
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
            onChange={(e) => onMaturityChange(e.target.value)}
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
              {filteredCount}
            </strong>{' '}
            de {totalProjects} proyectos encontrados
          </span>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 rounded-lg border border-theme bg-theme-subtle px-3 py-1 text-xs font-semibold text-theme-primary transition hover:border-[#FFB800]"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>
    </section>
  );
}
