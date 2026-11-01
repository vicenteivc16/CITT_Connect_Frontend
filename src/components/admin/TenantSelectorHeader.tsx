'use client';

import React from 'react';
import { Building2, ChevronDown, Globe, Shield, Sparkles } from 'lucide-react';
import { CITT_CAMPUSES, getCampusBySlug } from '@/data/citt-catalog';
import { CittRole } from '@/types/citt';

interface TenantSelectorHeaderProps {
  selectedCampusSlug: string; // 'nacional' or specific slug
  onSelectCampus: (slug: string) => void;
  userRole: CittRole;
  userCampusSlug: string;
}

export function TenantSelectorHeader({
  selectedCampusSlug,
  onSelectCampus,
  userRole,
  userCampusSlug,
}: TenantSelectorHeaderProps) {
  const isSuperAdmin = userRole === 'dev';
  const currentCampus = selectedCampusSlug === 'nacional' ? null : getCampusBySlug(selectedCampusSlug);

  return (
    <div className="rounded-3xl border border-theme bg-theme-surface p-4 sm:p-5 shadow-theme-card">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Lado izquierdo: Información del Tenant Activo */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 shadow-sm">
            {selectedCampusSlug === 'nacional' ? (
              <Globe className="h-6 w-6 text-[#307FE2]" />
            ) : (
              <Building2 className="h-6 w-6 text-[#FFB800]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-theme-secondary">
                {selectedCampusSlug === 'nacional' ? 'Ámbito Global · Red Nacional' : `Tenant Sede · ${currentCampus?.region || 'Chile'}`}
              </span>
              {isSuperAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#307FE2]/10 border border-[#307FE2]/30 px-2 py-0.5 text-[9px] font-bold text-[#307FE2]">
                  <Shield className="h-2.5 w-2.5" />
                  <span>Modo Core Dev</span>
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-black text-theme-primary tracking-tight">
              {selectedCampusSlug === 'nacional' ? 'Consola Nacional Duoc UC (18 Sedes)' : currentCampus?.name || selectedCampusSlug}
            </h2>
          </div>
        </div>

        {/* Lado derecho: Switcher interactivo de Tenants */}
        <div className="flex items-center gap-2.5">
          {isSuperAdmin ? (
            <div className="relative w-full sm:w-auto">
              <label htmlFor="tenant-switcher" className="sr-only">
                Seleccionar Sede o Tenant
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-primary">
                <span className="text-theme-secondary text-[11px] whitespace-nowrap">Sede Activa:</span>
                <select
                  id="tenant-switcher"
                  value={selectedCampusSlug}
                  onChange={(e) => onSelectCampus(e.target.value)}
                  className="bg-transparent text-xs font-bold text-theme-primary focus:outline-none cursor-pointer pr-4"
                >
                  <option value="nacional" className="bg-[#1A1A1A] text-white">
                    🌐 Red Nacional (Todas las Sedes)
                  </option>
                  <optgroup label="Sedes Duoc UC">
                    {CITT_CAMPUSES.map((c) => (
                      <option key={c.slug} value={c.slug} className="bg-[#1A1A1A] text-white">
                        🏛️ {c.name} ({c.region})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-2xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-bold text-theme-primary">
              <Building2 className="h-3.5 w-3.5 text-[#FFB800]" />
              <span>Sede Asignada: {getCampusBySlug(userCampusSlug).shortName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
