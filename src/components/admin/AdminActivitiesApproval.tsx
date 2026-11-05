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
  Pause,
  Play,
  Flag,
  RotateCcw,
  Eye,
  EyeOff,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { CITT_CAMPUSES, getCampusBySlug } from '@/data/citt-catalog';
import { SchoolBadge } from '@/components/RoleBadge';
import { ActivityStatus, CittActivity, CittMemberProfile } from '@/types/citt';
import { getSupabaseActivities } from '@/lib/supabase/activities';
import { logSupabaseAudit } from '@/lib/supabase/audit';
import { useCittNetwork } from '@/context/CittNetworkContext';

interface AdminActivitiesApprovalProps {
  activeUser: CittMemberProfile;
  selectedCampusSlug?: string;
}

type FilterStatusType = 'pending' | 'approved' | 'paused' | 'finished' | 'all';

export function AdminActivitiesApproval({
  activeUser,
  selectedCampusSlug = 'nacional',
}: AdminActivitiesApprovalProps) {
  const { activities: networkActivities, updateActivityStatus } = useCittNetwork();
  const [activities, setActivities] = useState<CittActivity[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatusType>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionConfirmTarget, setActionConfirmTarget] = useState<{
    activity: CittActivity;
    action: 'pause' | 'finish' | 'reject';
  } | null>(null);

  const loadActivities = async () => {
    try {
      const list = await getSupabaseActivities();
      if (list && list.length > 0) {
        const merged = [...list];
        (networkActivities || []).forEach((na) => {
          if (!merged.some((m) => m.id === na.id || m.slug === na.slug)) {
            merged.push(na);
          }
        });
        setActivities(merged);
      } else if (networkActivities && networkActivities.length > 0) {
        setActivities(networkActivities);
      }
    } catch {
      setActivities(networkActivities);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [networkActivities]);

  // Sync with context updates
  useEffect(() => {
    if (networkActivities && networkActivities.length > 0) {
      setActivities((prev) => {
        const merged = [...networkActivities];
        prev.forEach((item) => {
          if (!merged.some((m) => m.id === item.id || m.slug === item.slug)) {
            merged.push(item);
          }
        });
        return merged;
      });
    }
  }, [networkActivities]);

  const handleApprove = async (id: string) => {
    const target = activities.find((a) => a.id === id || a.slug === id);
    updateActivityStatus(id, 'aprobada');
    setActivities((prev) =>
      prev.map((a) => (a.id === id || a.slug === id ? { ...a, status: 'aprobada' } : a))
    );

    if (target) {
      await logSupabaseAudit({
        actionType: 'APROBACION_ACTIVIDAD',
        title: `Taller/Actividad aprobada y publicada en /actividades: ${target.title} (Sede: ${target.campusSlug})`,
        actorUsername: activeUser.username,
        actorName: activeUser.fullName,
        actorRole: activeUser.role,
        campusSlug: target.campusSlug,
        metadata: { activityId: target.id, slug: target.slug },
      }).catch(() => {});
    }
  };

  const handlePause = async (id: string) => {
    const target = activities.find((a) => a.id === id || a.slug === id);
    updateActivityStatus(id, 'pausada');
    setActivities((prev) =>
      prev.map((a) => (a.id === id || a.slug === id ? { ...a, status: 'pausada' } : a))
    );
    setActionConfirmTarget(null);

    if (target) {
      await logSupabaseAudit({
        actionType: 'PAUSA_ACTIVIDAD',
        title: `Taller pausado y ocultado del catálogo público /actividades: ${target.title}`,
        actorUsername: activeUser.username,
        actorName: activeUser.fullName,
        actorRole: activeUser.role,
        campusSlug: target.campusSlug,
        metadata: { activityId: target.id, slug: target.slug },
      }).catch(() => {});
    }
  };

  const handleResume = async (id: string) => {
    const target = activities.find((a) => a.id === id || a.slug === id);
    updateActivityStatus(id, 'aprobada');
    setActivities((prev) =>
      prev.map((a) => (a.id === id || a.slug === id ? { ...a, status: 'aprobada' } : a))
    );

    if (target) {
      await logSupabaseAudit({
        actionType: 'REANUDACION_ACTIVIDAD',
        title: `Taller reanudado y publicado nuevamente en /actividades: ${target.title}`,
        actorUsername: activeUser.username,
        actorName: activeUser.fullName,
        actorRole: activeUser.role,
        campusSlug: target.campusSlug,
        metadata: { activityId: target.id, slug: target.slug },
      }).catch(() => {});
    }
  };

  const handleFinish = async (id: string) => {
    const target = activities.find((a) => a.id === id || a.slug === id);
    updateActivityStatus(id, 'finalizada');
    setActivities((prev) =>
      prev.map((a) => (a.id === id || a.slug === id ? { ...a, status: 'finalizada' } : a))
    );
    setActionConfirmTarget(null);

    if (target) {
      await logSupabaseAudit({
        actionType: 'FINALIZACION_ACTIVIDAD',
        title: `Taller/Proyecto marcado como finalizado y concluido: ${target.title}`,
        actorUsername: activeUser.username,
        actorName: activeUser.fullName,
        actorRole: activeUser.role,
        campusSlug: target.campusSlug,
        metadata: { activityId: target.id, slug: target.slug },
      }).catch(() => {});
    }
  };

  const handleReject = async (id: string) => {
    const target = activities.find((a) => a.id === id || a.slug === id);
    updateActivityStatus(id, 'rechazada');
    setActivities((prev) =>
      prev.map((a) => (a.id === id || a.slug === id ? { ...a, status: 'rechazada' } : a))
    );
    setActionConfirmTarget(null);

    if (target) {
      await logSupabaseAudit({
        actionType: 'RECHAZO_ACTIVIDAD',
        title: `Propuesta de actividad rechazada/desestimada: ${target.title}`,
        actorUsername: activeUser.username,
        actorName: activeUser.fullName,
        actorRole: activeUser.role,
        campusSlug: target.campusSlug,
        metadata: { activityId: target.id, slug: target.slug },
      }).catch(() => {});
    }
  };

  // Aislamiento por Sede / Tenant
  const isDev = activeUser.role === 'dev';
  const effectiveTenantSlug = !isDev
    ? activeUser.campusSlug
    : selectedCampusSlug && selectedCampusSlug !== 'nacional'
    ? selectedCampusSlug
    : null;

  const tenantActivities = activities.filter((act) => {
    if (effectiveTenantSlug && act.campusSlug !== effectiveTenantSlug) {
      return false;
    }
    return true;
  });

  const pendingCount = tenantActivities.filter((a) => a.status === 'en_espera').length;
  const approvedCount = tenantActivities.filter(
    (a) => a.status === 'aprobada' || a.status === 'abierto'
  ).length;
  const pausedCount = tenantActivities.filter((a) => a.status === 'pausada').length;
  const finishedCount = tenantActivities.filter(
    (a) => a.status === 'finalizada' || a.status === 'finalizado'
  ).length;

  const filteredActivities = tenantActivities.filter((act) => {
    if (filterStatus === 'pending' && act.status !== 'en_espera') return false;
    if (
      filterStatus === 'approved' &&
      act.status !== 'aprobada' &&
      act.status !== 'abierto'
    )
      return false;
    if (filterStatus === 'paused' && act.status !== 'pausada') return false;
    if (
      filterStatus === 'finished' &&
      act.status !== 'finalizada' &&
      act.status !== 'finalizado'
    )
      return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        act.title.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q) ||
        act.instructorName.toLowerCase().includes(q) ||
        act.roomLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col justify-between gap-4 border-b border-theme pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#43B02A]/15 px-3 py-1 text-xs font-bold text-[#43B02A]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ciclo de Vida de Talleres & Convocatorias</span>
          </span>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-theme-primary">
            Aprobación & Moderación de Actividades CITT
          </h2>
          <p className="mt-1 text-xs text-theme-secondary max-w-2xl">
            {isDev
              ? 'Consola omnisciente Core Dev: Evalúa propuestas, publica en /actividades, pausa para ocultar temporalmente o finaliza proyectos concluidos en las 18 sedes.'
              : `Consola de Sede: Administrando iniciativas de ${
                  getCampusBySlug(activeUser.campusSlug)?.name || 'tu sede'
                }.`}
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="rounded-2xl border border-[#FFB800]/40 bg-[#FFB800]/10 px-4 py-2 text-xs font-bold text-[#FFB800]">
            {pendingCount} {pendingCount === 1 ? 'taller por evaluar' : 'talleres por evaluar'}
          </div>
        )}
      </div>

      {/* Barra de Filtros por Estado */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-theme bg-theme-surface p-1">
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
              filterStatus === 'pending'
                ? 'bg-[#FFB800] text-[#1A1A1A] shadow-sm'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <span>Por Evaluar</span>
            <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px] font-black">
              {pendingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('approved')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
              filterStatus === 'approved'
                ? 'bg-[#43B02A] text-white shadow-sm'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <span>Aprobadas & Públicas</span>
            <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-black">
              {approvedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('paused')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
              filterStatus === 'paused'
                ? 'bg-[#FFB800]/80 text-[#1A1A1A] shadow-sm'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <EyeOff className="h-3 w-3" />
            <span>Pausadas (Ocultas)</span>
            <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px] font-black">
              {pausedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('finished')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
              filterStatus === 'finished'
                ? 'bg-[#307FE2] text-white shadow-sm'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <Flag className="h-3 w-3" />
            <span>Finalizadas</span>
            <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-black">
              {finishedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filterStatus === 'all'
                ? 'bg-theme-subtle text-theme-primary font-black shadow-sm'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            Todas ({tenantActivities.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-theme-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por taller, instructor o sala..."
            className="w-full rounded-xl border border-theme bg-theme-subtle pl-9 pr-3 py-1.5 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
          />
        </div>
      </div>

      {/* Lista de Actividades */}
      {filteredActivities.length === 0 ? (
        <div className="rounded-3xl border border-theme bg-theme-surface p-12 text-center shadow-theme-card">
          <Calendar className="mx-auto h-12 w-12 text-theme-secondary/40" />
          <h3 className="mt-4 text-sm font-bold text-theme-primary">
            No hay actividades bajo este filtro
          </h3>
          <p className="mt-1 text-xs text-theme-secondary max-w-sm mx-auto">
            {filterStatus === 'pending'
              ? 'No hay propuestas de talleres en espera de evaluación en esta sede.'
              : filterStatus === 'paused'
              ? 'No hay actividades pausadas u ocultas en esta sede.'
              : filterStatus === 'finished'
              ? 'No hay actividades con ciclo finalizado.'
              : 'No se encontraron registros coincidentes.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((act) => {
            const campus = getCampusBySlug(act.campusSlug);
            const isPending = act.status === 'en_espera';
            const isApproved = act.status === 'aprobada' || act.status === 'abierto';
            const isPaused = act.status === 'pausada';
            const isFinished = act.status === 'finalizada' || act.status === 'finalizado';
            const isRejected = act.status === 'rechazada';

            return (
              <div
                key={act.id}
                className={`rounded-3xl border bg-theme-surface p-5 shadow-theme-card transition space-y-4 ${
                  isApproved
                    ? 'border-[#43B02A]/40 hover:border-[#43B02A]'
                    : isPaused
                    ? 'border-[#FFB800]/40 bg-[#FFB800]/5'
                    : isFinished
                    ? 'border-theme opacity-80'
                    : isRejected
                    ? 'border-red-500/30 opacity-75'
                    : 'border-theme hover:border-[#FFB800]/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Badge de Estado del Ciclo de Vida */}
                      {isPending && (
                        <span className="rounded-full bg-[#FFB800]/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#FFB800] border border-[#FFB800]/30 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>En Evaluación Inicial</span>
                        </span>
                      )}
                      {isApproved && (
                        <span className="rounded-full bg-[#43B02A]/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#43B02A] border border-[#43B02A]/30 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Aprobada & Visible en /actividades</span>
                        </span>
                      )}
                      {isPaused && (
                        <span className="rounded-full bg-[#FFB800]/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#FFB800] border border-[#FFB800]/40 flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          <span>Pausada (Oculta del Catálogo)</span>
                        </span>
                      )}
                      {isFinished && (
                        <span className="rounded-full bg-[#307FE2]/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#307FE2] border border-[#307FE2]/30 flex items-center gap-1">
                          <Flag className="h-3 w-3" />
                          <span>Ciclo Finalizado</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-500 border border-red-500/30 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          <span>Rechazada / Desestimada</span>
                        </span>
                      )}

                      <span className="rounded-full bg-theme-subtle px-2.5 py-0.5 text-[10px] font-bold text-theme-secondary">
                        📍 {campus?.name || act.campusSlug}
                      </span>
                      <span className="rounded-full bg-[#307FE2]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#307FE2]">
                        {act.roomLocation}
                      </span>
                      <SchoolBadge schoolSlug={act.schoolSlug} size="sm" />
                    </div>

                    <h4 className="text-base font-black text-theme-primary">
                      {act.title}
                    </h4>
                    <p className="text-xs text-theme-secondary line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0 space-y-0.5 bg-theme-subtle sm:bg-transparent p-2.5 sm:p-0 rounded-2xl">
                    <p className="text-xs font-bold text-theme-primary">
                      Instructor: {act.instructorName}
                    </p>
                    <p className="text-[10px] text-theme-secondary">
                      Cupos: <strong>{act.totalSeats}</strong> ({act.capacityPerSession} por sesión)
                    </p>
                    {act.badge && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#FFB800]">
                        <Award className="h-3 w-3" />
                        <span>Otorga Insignia CITT</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta de Horarios y Botones de Acción */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-theme">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-theme-secondary">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#FFB800]" />
                      <span>
                        {act.schedule.daysDescription} ·{' '}
                        {act.schedule.timeStart && act.schedule.timeEnd
                          ? `${act.schedule.timeStart} a ${act.schedule.timeEnd} hrs`
                          : act.schedule.sessionTime}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-[#43B02A]" />
                      <span className="font-bold text-theme-primary">
                        +{act.schedule.totalHoursCitt} Horas CITT
                      </span>
                    </span>
                  </div>

                  {/* Acciones por Estado */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* ACCIÓN 1: Taller Pendiente de Aprobación */}
                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActionConfirmTarget({ activity: act, action: 'reject' })}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/20 transition"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Rechazar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(act.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#43B02A] px-4 py-1.5 text-xs font-black text-white shadow-md hover:bg-[#3ba024] active:scale-95 transition"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Aprobar & Publicar en /actividades</span>
                        </button>
                      </>
                    )}

                    {/* ACCIÓN 2: Taller Aprobado y Activo */}
                    {isApproved && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActionConfirmTarget({ activity: act, action: 'pause' })}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#FFB800]/40 bg-[#FFB800]/10 px-3.5 py-1.5 text-xs font-bold text-[#FFB800] hover:bg-[#FFB800]/20 transition"
                          title="Oculta temporalmente el taller de /actividades sin eliminar inscritos"
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>Pausar (Ocultar)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActionConfirmTarget({ activity: act, action: 'finish' })}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-subtle px-3.5 py-1.5 text-xs font-bold text-theme-primary hover:border-red-500/50 hover:text-red-500 transition"
                          title="Concluye y cierra el ciclo formativo del taller"
                        >
                          <Flag className="h-3.5 w-3.5" />
                          <span>Finalizar Proyecto</span>
                        </button>
                      </>
                    )}

                    {/* ACCIÓN 3: Taller Pausado / Oculto */}
                    {isPaused && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleResume(act.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#43B02A] px-4 py-1.5 text-xs font-black text-white shadow-md hover:bg-[#3ba024] transition"
                        >
                          <Play className="h-3.5 w-3.5" />
                          <span>Reanudar (Publicar en /actividades)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActionConfirmTarget({ activity: act, action: 'finish' })}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-subtle px-3.5 py-1.5 text-xs font-bold text-theme-secondary hover:text-theme-primary transition"
                        >
                          <Flag className="h-3.5 w-3.5" />
                          <span>Finalizar</span>
                        </button>
                      </>
                    )}

                    {/* ACCIÓN 4: Taller Finalizado */}
                    {isFinished && (
                      <button
                        type="button"
                        onClick={() => handleResume(act.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-subtle px-3.5 py-1.5 text-xs font-bold text-theme-secondary hover:border-[#FFB800] hover:text-theme-primary transition"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reabrir Convocatoria</span>
                      </button>
                    )}

                    {/* ACCIÓN 5: Taller Rechazado */}
                    {isRejected && (
                      <button
                        type="button"
                        onClick={() => {
                          updateActivityStatus(act.id, 'en_espera');
                          setActivities((prev) =>
                            prev.map((a) =>
                              a.id === act.id ? { ...a, status: 'en_espera' } : a
                            )
                          );
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-subtle px-3.5 py-1.5 text-xs font-bold text-theme-secondary hover:text-theme-primary transition"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Pasar a Evaluación</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Diálogo de Confirmación para Pausar, Finalizar o Rechazar */}
      {actionConfirmTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md rounded-3xl border border-theme bg-theme-surface p-6 shadow-2xl space-y-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                actionConfirmTarget.action === 'pause'
                  ? 'bg-[#FFB800]/15 text-[#FFB800]'
                  : actionConfirmTarget.action === 'finish'
                  ? 'bg-[#307FE2]/15 text-[#307FE2]'
                  : 'bg-red-500/15 text-red-500'
              }`}
            >
              {actionConfirmTarget.action === 'pause' && <EyeOff className="h-6 w-6" />}
              {actionConfirmTarget.action === 'finish' && <Flag className="h-6 w-6" />}
              {actionConfirmTarget.action === 'reject' && <XCircle className="h-6 w-6" />}
            </div>

            <div>
              <h3 className="text-base font-black text-theme-primary">
                {actionConfirmTarget.action === 'pause' && '¿Pausar y ocultar esta actividad?'}
                {actionConfirmTarget.action === 'finish' && '¿Finalizar este proyecto/taller?'}
                {actionConfirmTarget.action === 'reject' && '¿Rechazar esta propuesta de taller?'}
              </h3>
              <p className="mt-1 text-xs text-theme-secondary leading-relaxed">
                {actionConfirmTarget.action === 'pause' && (
                  <>
                    La actividad <strong>{actionConfirmTarget.activity.title}</strong> se ocultará
                    de inmediato del catálogo público en{' '}
                    <code className="font-mono text-theme-primary">/actividades</code>. Los alumnos
                    ya inscritos conservarán su cupo y podrás reanudarla en cualquier momento.
                  </>
                )}
                {actionConfirmTarget.action === 'finish' && (
                  <>
                    Se dará por concluido el ciclo formativo de{' '}
                    <strong>{actionConfirmTarget.activity.title}</strong>. Se cerrará la convocatoria
                    y quedará registrada como iniciativa finalizada.
                  </>
                )}
                {actionConfirmTarget.action === 'reject' && (
                  <>
                    La propuesta <strong>{actionConfirmTarget.activity.title}</strong> quedará
                    desestimada y no será publicada en la red de estudiantes.
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActionConfirmTarget(null)}
                className="rounded-xl border border-theme px-4 py-2 text-xs font-bold text-theme-secondary hover:text-theme-primary"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (actionConfirmTarget.action === 'pause') {
                    handlePause(actionConfirmTarget.activity.id);
                  } else if (actionConfirmTarget.action === 'finish') {
                    handleFinish(actionConfirmTarget.activity.id);
                  } else if (actionConfirmTarget.action === 'reject') {
                    handleReject(actionConfirmTarget.activity.id);
                  }
                }}
                className={`rounded-xl px-5 py-2 text-xs font-black text-white shadow-md transition ${
                  actionConfirmTarget.action === 'pause'
                    ? 'bg-[#FFB800] !text-[#1A1A1A] hover:bg-[#ffc633]'
                    : actionConfirmTarget.action === 'finish'
                    ? 'bg-[#307FE2] hover:bg-[#256ac2]'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {actionConfirmTarget.action === 'pause' && 'Sí, Pausar y Ocultar'}
                {actionConfirmTarget.action === 'finish' && 'Sí, Finalizar Proyecto'}
                {actionConfirmTarget.action === 'reject' && 'Sí, Rechazar Propuesta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
