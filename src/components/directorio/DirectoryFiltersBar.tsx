'use client';

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { CITT_CAMPUSES, DUOC_SCHOOLS } from '@/data/citt-catalog';
import { CittRole, DuocSchoolSlug } from '@/types/citt';

export const ROLE_FILTER_OPTIONS: { value: 'all' | CittRole; label: string }[] = [
  { value: 'all', label: 'Todos los Roles' },
  { value: 'personal_duoc', label: 'Personal Duoc' },
  { value: 'lider_citt', label: 'Líderes CITT' },
  { value: 'consejero_carrera', label: 'Consejeros de Carrera' },
  { value: 'partner', label: 'Partners Oficiales' },
  { value: 'dev', label: 'Core Devs' },
  { value: 'usuario_citt', label: 'Miembros CITT' },
];

interface DirectoryFiltersBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRegion: string;
  onRegionChange: (r: string) => void;
  selectedCampus: string;
  onCampusChange: (c: string) => void;
  selectedSchool: 'all' | DuocSchoolSlug;
  onSchoolChange: (s: 'all' | DuocSchoolSlug) => void;
  selectedSpecialty: string;
  onSpecialtyChange: (spec: string) => void;
  selectedRole: 'all' | CittRole;
  onRoleChange: (role: 'all' | CittRole) => void;
  regions: string[];
  availableCampuses: typeof CITT_CAMPUSES;
  allSpecialties: string[];
  totalResults: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function DirectoryFiltersBar({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  selectedCampus,
  onCampusChange,
  selectedSchool,
  onSchoolChange,
  selectedSpecialty,
  onSpecialtyChange,
  selectedRole,
  onRoleChange,
  regions,
  availableCampuses,
  allSpecialties,
  totalResults,
  hasActiveFilters,
  onClearFilters,
}: DirectoryFiltersBarProps) {
  return (
    <section
      aria-label="Filtros del directorio"
      className="space-y-4 rounded-2xl border border-theme bg-theme-subtle p-5"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        {/* Search Input with Unaccent */}
        <div className="relative md:col-span-4">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, especialidad, carrera o sede..."
            className="w-full rounded-xl border border-theme bg-theme-surface py-2.5 pr-4 pl-10 text-sm text-theme-primary placeholder:text-theme-secondary focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        {/* Region Filter */}
        <div className="md:col-span-2">
          <select
            aria-label="Filtrar por Región"
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full rounded-xl border border-theme bg-theme-surface px-3 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
          >
            <option value="all">Todas las Regiones</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                Región {region}
              </option>
            ))}
          </select>
        </div>

        {/* Campus Filter (Cascading) */}
        <div className="md:col-span-3">
          <select
            aria-label="Filtrar por Sede CITT"
            value={selectedCampus}
            onChange={(e) => onCampusChange(e.target.value)}
            className="w-full rounded-xl border border-theme bg-theme-surface px-3 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
          >
            <option value="all">
              {selectedRegion === 'all'
                ? 'Todas las Sedes (18 Sedes)'
                : `Sedes de ${selectedRegion} (${availableCampuses.length})`}
            </option>
            {availableCampuses.map((campus) => (
              <option key={campus.slug} value={campus.slug}>
                {campus.name}
              </option>
            ))}
          </select>
        </div>

        {/* School Filter */}
        <div className="md:col-span-3">
          <select
            aria-label="Filtrar por Escuela Duoc UC"
            value={selectedSchool}
            onChange={(e) =>
              onSchoolChange(e.target.value as 'all' | DuocSchoolSlug)
            }
            className="w-full rounded-xl border border-theme bg-theme-surface px-3 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
          >
            <option value="all">Todas las Escuelas (9 Escuelas)</option>
            {DUOC_SCHOOLS.map((school) => (
              <option key={school.slug} value={school.slug}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Specialty Selector + Role Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme pt-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Specialty Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-theme-secondary">Especialidad:</span>
            <select
              aria-label="Filtrar por Especialidad"
              value={selectedSpecialty}
              onChange={(e) => onSpecialtyChange(e.target.value)}
              className="rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
            >
              <option value="all">Todas las especialidades</option>
              {allSpecialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Role Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 inline-flex items-center gap-1 text-xs font-bold text-theme-secondary">
              <SlidersHorizontal className="h-3 w-3 text-[#FFB800]" />
              <span>Rol:</span>
            </span>
            {ROLE_FILTER_OPTIONS.map((option) => {
              const active = selectedRole === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onRoleChange(option.value)}
                  className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
                    active
                      ? 'bg-[#FFB800] text-[#1A1A1A]'
                      : 'border border-theme bg-theme-surface text-theme-primary hover:border-[#FFB800]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tabular-nums text-theme-secondary">
            Mostrando <strong className="text-theme-primary">{totalResults}</strong> perfiles verificados
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-bold text-[#FFB800] hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
