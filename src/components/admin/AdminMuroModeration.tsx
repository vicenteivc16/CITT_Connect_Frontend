'use client';

import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  MapPin,
  Newspaper,
  Pin,
  Search,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { CITT_CAMPUSES, getCampusBySlug } from '@/data/citt-catalog';
import { SchoolBadge } from '@/components/RoleBadge';

export interface DispatchToModerate {
  id: string;
  title: string;
  summary: string;
  authorName: string;
  authorRole: string;
  campusSlug: string;
  schoolSlug: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  isPinned?: boolean;
}

const INITIAL_DISPATCHES: DispatchToModerate[] = [];

export function AdminMuroModeration() {
  const [dispatches, setDispatches] = useState<DispatchToModerate[]>(INITIAL_DISPATCHES);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterCampus, setFilterCampus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreview, setSelectedPreview] = useState<DispatchToModerate | null>(null);

  const handleApprove = (id: string) => {
    setDispatches((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'approved' } : d))
    );
  };

  const handleReject = (id: string) => {
    setDispatches((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'rejected', isPinned: false } : d))
    );
  };

  const handleTogglePin = (id: string) => {
    setDispatches((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isPinned: !d.isPinned } : d))
    );
  };

  const filteredDispatches = dispatches.filter((d) => {
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    if (filterCampus !== 'all' && d.campusSlug !== filterCampus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.authorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = dispatches.filter((d) => d.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col justify-between gap-4 border-b border-theme pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#307FE2]/15 px-3 py-1 text-xs font-bold text-[#307FE2]">
            <Newspaper className="h-3.5 w-3.5" />
            <span>Redacción & Curaduría de Prensa</span>
          </span>
          <h1 className="text-2xl font-black tracking-tight text-theme-primary mt-2">
            Moderación de Despachos & El Diario CITT
          </h1>
          <p className="text-xs text-theme-secondary mt-1 max-w-2xl">
            Revisa, aprueba y fija despachos generados por las 18 sedes antes de que aparezcan en el Muro Nacional público.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="rounded-2xl border border-[#307FE2]/30 bg-[#307FE2]/10 px-4 py-2 text-xs font-bold text-[#307FE2]">
            {pendingCount} despacho{pendingCount > 1 ? 's' : ''} pendiente{pendingCount > 1 ? 's' : ''} de revisión
          </div>
        )}
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme bg-theme-subtle p-3.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                filterStatus === st
                  ? 'bg-[#FFB800] text-[#1A1A1A] shadow-sm'
                  : 'bg-theme-surface border border-theme text-theme-secondary hover:text-theme-primary'
              }`}
            >
              {st === 'all'
                ? `Todos (${dispatches.length})`
                : st === 'pending'
                ? `Pendientes (${pendingCount})`
                : st === 'approved'
                ? 'Publicados'
                : 'Rechazados'}
            </button>
          ))}

          {/* Sede Select */}
          <select
            value={filterCampus}
            onChange={(e) => setFilterCampus(e.target.value)}
            className="rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
          >
            <option value="all">Todas las Sedes</option>
            {CITT_CAMPUSES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-theme-secondary pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, autor o tema..."
            className="w-full rounded-xl border border-theme bg-theme-surface pl-8.5 pr-3 py-1.5 text-xs text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
          />
        </div>
      </div>

      {/* Listado de Despachos */}
      <div className="space-y-3">
        {filteredDispatches.length === 0 ? (
          <div className="rounded-3xl border border-theme bg-theme-surface p-12 text-center text-xs text-theme-secondary">
            No se encontraron despachos con los filtros seleccionados.
          </div>
        ) : (
          filteredDispatches.map((dispatch) => {
            const campus = getCampusBySlug(dispatch.campusSlug);
            return (
              <article
                key={dispatch.id}
                className="rounded-3xl border border-theme bg-theme-surface p-5 shadow-theme-card space-y-3 transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        dispatch.status === 'approved'
                          ? 'bg-[#43B02A]/15 text-[#43B02A]'
                          : dispatch.status === 'pending'
                          ? 'bg-[#307FE2]/15 text-[#307FE2]'
                          : 'bg-red-500/15 text-red-500'
                      }`}
                    >
                      {dispatch.status === 'approved'
                        ? 'Publicado en Muro'
                        : dispatch.status === 'pending'
                        ? 'Aguardando Moderación'
                        : 'Rechazado'}
                    </span>

                    {dispatch.isPinned && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFB800]/20 px-2.5 py-0.5 text-[10px] font-black text-[#FFB800]">
                        <Pin className="h-3 w-3" />
                        <span>Primicia Destacada</span>
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-[11px] text-theme-secondary">
                      <MapPin className="h-3 w-3 text-[#FFB800]" />
                      <span>Sede {campus.shortName}</span>
                    </span>
                  </div>

                  <span className="text-[11px] text-theme-secondary">
                    {dispatch.submittedAt}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-theme-primary">
                    {dispatch.title}
                  </h3>
                  <p className="text-xs text-theme-secondary leading-relaxed mt-1">
                    {dispatch.summary}
                  </p>
                </div>

                {/* Pie con Autor y Acciones */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme pt-3 text-xs">
                  <div className="text-theme-secondary">
                    Enviado por:{' '}
                    <strong className="text-theme-primary">
                      {dispatch.authorName}
                    </strong>{' '}
                    · {dispatch.authorRole}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTogglePin(dispatch.id)}
                      title={dispatch.isPinned ? 'Desfijar' : 'Fijar como portada'}
                      className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-bold transition ${
                        dispatch.isPinned
                          ? 'bg-[#FFB800] text-[#1A1A1A]'
                          : 'bg-theme-subtle text-theme-secondary hover:text-theme-primary'
                      }`}
                    >
                      <Pin className="h-3.5 w-3.5" />
                      <span>{dispatch.isPinned ? 'Fijado' : 'Fijar'}</span>
                    </button>

                    {dispatch.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => handleApprove(dispatch.id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-[#43B02A] px-3 py-1.5 font-bold text-white transition hover:bg-[#389623]"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Aprobar Despacho</span>
                      </button>
                    )}

                    {dispatch.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => handleReject(dispatch.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Desestimar</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
