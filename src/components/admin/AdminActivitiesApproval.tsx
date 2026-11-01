'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  Search,
  Sparkles,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { CITT_CAMPUSES, getCampusBySlug } from '@/data/citt-catalog';
import { SchoolBadge } from '@/components/RoleBadge';
import { CittActivity, CittMemberProfile } from '@/types/citt';
import { getSupabaseActivities } from '@/lib/supabase/activities';
import { supabase } from '@/lib/supabase/client';
import { logSupabaseAudit } from '@/lib/supabase/audit';

interface AdminActivitiesApprovalProps {
  activeUser: CittMemberProfile;
  selectedCampusSlug?: string;
}

export function AdminActivitiesApproval({
  activeUser,
  selectedCampusSlug = 'nacional',
}: AdminActivitiesApprovalProps) {
  const [activities, setActivities] = useState<CittActivity[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const loadActivities = async () => {
    const list = await getSupabaseActivities();
    setActivities(list);
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleApprove = async (id: string) => {
    const target = activities.find((a) => a.id === id);
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'abierto' } : a))
    );
    try {
      await supabase.from('activities').update({ status: 'abierto' }).eq('id', id);
      if (target) {
        await logSupabaseAudit({
          actionType: 'APROBACION_ACTIVIDAD',
          title: `Taller/Actividad aprobada: ${target.title} (Sede: ${target.campusSlug})`,
          actorUsername: activeUser.username,
          actorName: activeUser.fullName,
          actorRole: activeUser.role,
          campusSlug: target.campusSlug,
          metadata: { activityId: target.id, slug: target.slug },
        });
      }
    } catch (err) {
      console.error('Error approving activity in Supabase:', err);
    }
  };

  const handleReject = async (id: string) => {
    const target = activities.find((a) => a.id === id);
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'finalizado' } : a))
    );
    try {
      await supabase.from('activities').update({ status: 'finalizado' }).eq('id', id);
      if (target) {
        await logSupabaseAudit({
          actionType: 'RECHAZO_ACTIVIDAD',
          title: `Actividad rechazada/archivada: ${target.title} (Sede: ${target.campusSlug})`,
          actorUsername: activeUser.username,
          actorName: activeUser.fullName,
          actorRole: activeUser.role,
          campusSlug: target.campusSlug,
          metadata: { activityId: target.id, slug: target.slug },
        });
      }
    } catch (err) {
      console.error('Error rejecting activity in Supabase:', err);
    }
  };

  // Aislamiento por Sede / Tenant
  const isDev = activeUser.role === 'dev';
  const effectiveTenantSlug = !isDev
    ? activeUser.campusSlug
    : selectedCampusSlug && selectedCampusSlug !== 'nacional'
    ? selectedCampusSlug
    : null;

  const filteredActivities = activities.filter((act) => {
    if (effectiveTenantSlug && act.campusSlug !== effectiveTenantSlug) {
      return false;
    }
    if (filterStatus === 'pending' && act.status !== 'en_espera') return false;
    if (filterStatus === 'approved' && act.status !== 'abierto') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        act.title.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q) ||
        act.instructorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = activities.filter((a) => {
    if (effectiveTenantSlug && a.campusSlug !== effectiveTenantSlug) return false;
    return a.status === 'en_espera';
  }).length;

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col justify-between gap-4 border-b border-theme pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#43B02A]/15 px-3 py-1 text-xs font-bold text-[#43B02A]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Validación de Talleres & Convocatorias</span>
          </span>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-theme-primary">
            Aprobación de Actividades CITT
          </h2>
          <p className="mt-1 text-xs text-theme-secondary">
            {isDev
              ? 'Consola omnisciente Core Dev: Evalúa y habilita la apertura pública de talleres en cualquiera de las 18 sedes.'
              : `Consola de Sede: Evaluando únicamente propuestas e iniciativas de ${
                  getCampusBySlug(activeUser.campusSlug)?.name || 'tu sede'
                }.`}
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="rounded-2xl border border-[#FFB800]/40 bg-[#FFB800]/10 px-4 py-2 text-xs font-bold text-[#FFB800]">
            {pendingCount} {pendingCount === 1 ? 'taller pendiente' : 'talleres pendientes'} en tu sede
          </div>
        )}
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 rounded-2xl border border-theme bg-theme-surface p-1">
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filterStatus === 'pending'
                ? 'bg-[#FFB800] text-[#1A1A1A]'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            Por Evaluar ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('approved')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filterStatus === 'approved'
                ? 'bg-[#43B02A] text-white'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            Abiertas al Público
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filterStatus === 'all'
                ? 'bg-theme-subtle text-theme-primary'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            Todas
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-theme-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por taller o instructor..."
            className="w-full rounded-xl border border-theme bg-theme-subtle pl-9 pr-3 py-1.5 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
          />
        </div>
      </div>

      {/* Lista de Actividades */}
      {filteredActivities.length === 0 ? (
        <div className="rounded-3xl border border-theme bg-theme-surface p-12 text-center shadow-theme-card">
          <Calendar className="mx-auto h-12 w-12 text-theme-secondary/40" />
          <h3 className="mt-4 text-sm font-bold text-theme-primary">
            No hay talleres o actividades bajo este filtro
          </h3>
          <p className="mt-1 text-xs text-theme-secondary max-w-sm mx-auto">
            {filterStatus === 'pending'
              ? 'No hay propuestas de talleres en espera de evaluación en esta sede.'
              : 'No se encontraron registros coincidentes.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((act) => {
            const campus = getCampusBySlug(act.campusSlug);
            const isPending = act.status === 'en_espera';

            return (
              <div
                key={act.id}
                className="rounded-3xl border border-theme bg-theme-surface p-5 shadow-theme-card transition hover:border-[#FFB800]/50 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          isPending
                            ? 'bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30'
                            : 'bg-[#43B02A]/15 text-[#43B02A] border border-[#43B02A]/30'
                        }`}
                      >
                        {isPending ? 'En Evaluación Inicial' : 'Abierto al Público'}
                      </span>
                      <span className="rounded-full bg-theme-subtle px-2.5 py-0.5 text-[10px] font-bold text-theme-secondary">
                        📍 {campus.name}
                      </span>
                      <span className="rounded-full bg-[#307FE2]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#307FE2]">
                        {act.roomLocation}
                      </span>
                      <SchoolBadge schoolSlug={act.schoolSlug} size="sm" />
                    </div>

                    <h4 className="text-base font-black text-theme-primary">
                      {act.title}
                    </h4>
                    <p className="text-xs text-theme-secondary line-clamp-2">
                      {act.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-theme-primary">
                      Instructor: {act.instructorName}
                    </p>
                    <p className="text-[10px] text-theme-secondary">
                      Cupos: {act.totalSeats} ({act.capacityPerSession} por sesión)
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-theme">
                  <div className="flex items-center gap-4 text-xs text-theme-secondary">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-theme-secondary" />
                      {act.schedule.daysDescription} · {act.schedule.sessionTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-theme-secondary" />
                      {act.schedule.totalHoursCitt} Horas CITT
                    </span>
                  </div>

                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReject(act.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/20"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Desestimar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(act.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#43B02A] px-4 py-1.5 text-xs font-black text-white shadow-sm hover:bg-[#3ba024] active:scale-95"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Aprobar & Habilitar en /actividades</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
