'use client';

import React from 'react';
import { Search, Filter, Plus, Calendar, CheckCircle, Sparkles } from 'lucide-react';
import { DUOC_SCHOOLS, CITT_CAMPUSES } from '@/data/citt-catalog';
import { DuocSchoolSlug, ActivityModality } from '@/types/citt';

interface ActivityFiltersBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedSchool: DuocSchoolSlug | 'all';
  onSchoolChange: (s: DuocSchoolSlug | 'all') => void;
  selectedCampus: string;
  onCampusChange: (c: string) => void;
  selectedModality: ActivityModality | 'all';
  onModalityChange: (m: ActivityModality | 'all') => void;
  showOnlyEnrolled: boolean;
  onToggleEnrolled: (val: boolean) => void;
  totalResults: number;
  isPrivileged: boolean;
  onOpenCreate: () => void;
}

export function ActivityFiltersBar({
  searchQuery,
  onSearchChange,
  selectedSchool,
  onSchoolChange,
  selectedCampus,
  onCampusChange,
  selectedModality,
  onModalityChange,
  showOnlyEnrolled,
  onToggleEnrolled,
  totalResults,
  isPrivileged,
  onOpenCreate,
}: ActivityFiltersBarProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-theme bg-theme-surface p-4 sm:p-6 shadow-theme-card">
      {/* Fila Superior: Buscador y Botón de Creación */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por taller, tecnología (ESP32, IA, Fusion 360), instructor o sala..."
            className="w-full rounded-2xl border border-theme bg-theme-subtle pl-10 pr-4 py-2.5 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        {isPrivileged && (
          <button
            type="button"
            onClick={onOpenCreate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-4 py-2.5 text-xs font-black text-[#1A1A1A] transition hover:bg-[#ffc633] shrink-0 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Organizar Nueva Actividad</span>
          </button>
        )}
      </div>

      {/* Fila Inferior: Filtros de Escuela, Sede, Modalidad y Switch de Inscrito */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-theme">
        {/* Selector de Escuela */}
        <select
          value={selectedSchool}
          onChange={(e) => onSchoolChange(e.target.value as DuocSchoolSlug | 'all')}
          className="rounded-xl border border-theme bg-theme-subtle px-3 py-1.5 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
        >
          <option value="all">Todas las Escuelas Duoc UC</option>
          {DUOC_SCHOOLS.map((school) => (
            <option key={school.slug} value={school.slug}>
              {school.shortName}
            </option>
          ))}
        </select>

        {/* Selector de Sede */}
        <select
          value={selectedCampus}
          onChange={(e) => onCampusChange(e.target.value)}
          className="rounded-xl border border-theme bg-theme-subtle px-3 py-1.5 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
        >
          <option value="all">Todas las Sedes</option>
          {CITT_CAMPUSES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Pestañas de Modalidad */}
        <div className="inline-flex rounded-xl border border-theme bg-theme-subtle p-0.5 text-xs font-bold">
          {(['all', 'presencial', 'hibrido', 'online'] as const).map((mod) => (
            <button
              key={mod}
              type="button"
              onClick={() => onModalityChange(mod)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                selectedModality === mod
                  ? 'bg-theme-surface text-theme-primary shadow-sm'
                  : 'text-theme-secondary hover:text-theme-primary'
              }`}
            >
              {mod === 'all'
                ? 'Todas'
                : mod === 'presencial'
                ? '🏛️ Presencial'
                : mod === 'hibrido'
                ? '🌐 Híbrido'
                : '💻 Online'}
            </button>
          ))}
        </div>

        {/* Switch Solo Mis Actividades */}
        <button
          type="button"
          onClick={() => onToggleEnrolled(!showOnlyEnrolled)}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
            showOnlyEnrolled
              ? 'border-[#43B02A] bg-[#43B02A]/10 text-[#43B02A]'
              : 'border-theme bg-theme-subtle text-theme-secondary hover:text-theme-primary'
          }`}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          <span>Mis Talleres Inscritos</span>
        </button>

        {/* Contador de resultados */}
        <div className="ml-auto text-xs text-theme-secondary font-medium">
          Mostrando <strong className="text-theme-primary">{totalResults}</strong> actividad(es)
        </div>
      </div>
    </div>
  );
}
