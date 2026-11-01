'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FolderGit2,
  Newspaper,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { AdminModuleTab } from './AdminSidebarNav';
import { getSupabaseAuditLogs, AuditLogEntry } from '@/lib/supabase/audit';

interface AdminOverviewProps {
  onNavigateTab: (tab: AdminModuleTab) => void;
  pendingPostsCount: number;
  pendingProjectsCount: number;
  pendingBookingsCount: number;
}

export function AdminOverview({
  onNavigateTab,
  pendingPostsCount,
  pendingProjectsCount,
  pendingBookingsCount,
}: AdminOverviewProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    let isMounted = true;
    getSupabaseAuditLogs().then((res) => {
      if (isMounted) setLogs(res);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const kpis = [
    {
      id: 'muro',
      title: 'Despachos del Muro por Revisar',
      value: pendingPostsCount,
      detail: 'Enviados por sedes Duoc UC',
      icon: Newspaper,
      color: '#307FE2',
      tab: 'muro' as AdminModuleTab,
    },
    {
      id: 'proyectos',
      title: 'Proyectos en Cola de Curaduría',
      value: pendingProjectsCount,
      detail: 'Pendientes de validación TRL',
      icon: FolderGit2,
      color: '#FFB800',
      tab: 'proyectos' as AdminModuleTab,
    },
    {
      id: 'reservas',
      title: 'Reservas de Sala Hoy',
      value: pendingBookingsCount,
      detail: 'Salas activas & Labs CITT',
      icon: Calendar,
      color: '#43B02A',
      tab: 'calendario' as AdminModuleTab,
    },
    {
      id: 'asistencia',
      title: 'Tasa de Asistencia en Salas',
      value: '100%',
      detail: 'Sin inasistencias registradas',
      icon: TrendingUp,
      color: '#107C41',
      tab: 'calendario' as AdminModuleTab,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Cabecera del Dashboard */}
      <div className="flex flex-col justify-between gap-4 border-b border-theme pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFB800]/15 px-3 py-1 text-xs font-bold text-[#FFB800]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Control Central Multi-Módulo</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-theme-primary mt-2">
            Panel de Operaciones & Gobernanza CITT
          </h1>
          <p className="text-xs sm:text-sm text-theme-secondary mt-1">
            Supervisa en tiempo real el contenido público, proyectos en revisión y reservas de salas de innovación.
          </p>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={() => onNavigateTab(kpi.tab)}
              className="cursor-pointer rounded-3xl border border-theme bg-theme-surface p-5 shadow-theme-card transition hover:border-[#FFB800] hover:shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-theme-secondary">
                  {kpi.title}
                </span>
                <div
                  style={{ backgroundColor: `${kpi.color}20`, color: kpi.color }}
                  className="flex h-8 w-8 items-center justify-center rounded-xl"
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-theme-primary">
                  {kpi.value}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-theme pt-2 text-[11px] text-theme-secondary">
                <span>{kpi.detail}</span>
                <span className="font-bold text-[#FFB800]">Administrar →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 Columnas de Detalle: Módulos Activos y Registro de Auditoría */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Columna Izquierda (7 Cols): Estado de Módulos Satélite */}
        <div className="lg:col-span-7 space-y-6">
          <section className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card space-y-4">
            <h2 className="text-base font-black text-theme-primary flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#43B02A]" />
              <span>Estado Operativo de Satélites CITT</span>
            </h2>

            <div className="space-y-3">
              {/* Calendario CITT */}
              <div className="flex items-center justify-between rounded-2xl border border-theme bg-theme-subtle p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#43B02A]/15 text-[#43B02A]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-theme-primary">
                      Calendario CITT (Tótems & Pantallas)
                    </h3>
                    <p className="text-[11px] text-theme-secondary">
                      Enlace Zero-Trust activo con Tótem Sala 312
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#43B02A]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#43B02A]">
                    Sincronizado
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('calendario')}
                    className="rounded-xl bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary border border-theme hover:border-[#FFB800]"
                  >
                    Ver Salas
                  </button>
                </div>
              </div>

              {/* Muro & Crónicas */}
              <div className="flex items-center justify-between rounded-2xl border border-theme bg-theme-subtle p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#307FE2]/15 text-[#307FE2]">
                    <Newspaper className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-theme-primary">
                      El Diario CITT (Prensa Escolar)
                    </h3>
                    <p className="text-[11px] text-theme-secondary">
                      {pendingPostsCount} despachos aguardando aprobación
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#FFB800]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#FFB800]">
                    Cola Activa
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('muro')}
                    className="rounded-xl bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary border border-theme hover:border-[#FFB800]"
                  >
                    Moderar
                  </button>
                </div>
              </div>

              {/* Proyectos & TRL */}
              <div className="flex items-center justify-between rounded-2xl border border-theme bg-theme-subtle p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFB800]/15 text-[#FFB800]">
                    <FolderGit2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-theme-primary">
                      Catálogo Nacional de Iniciativas
                    </h3>
                    <p className="text-[11px] text-theme-secondary">
                      {pendingProjectsCount} propuestas con solicitud de TRL
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#307FE2]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#307FE2]">
                    Staging
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('proyectos')}
                    className="rounded-xl bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary border border-theme hover:border-[#FFB800]"
                  >
                    Revisar
                  </button>
                </div>
              </div>

              {/* Futuro CITT Jira */}
              <div className="flex items-center justify-between rounded-2xl border border-dashed border-theme bg-theme-subtle/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/15 text-[#7C3AED]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-theme-primary">
                      CITT Jira & Sprints de Innovación
                    </h3>
                    <p className="text-[11px] text-theme-secondary">
                      Módulo satélite preparado para conexión por API
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab('ecosistema')}
                  className="rounded-xl bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary border border-theme hover:border-[#7C3AED]"
                >
                  Configurar
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Columna Derecha (5 Cols): Registro de Auditoría y Acciones */}
        <div className="lg:col-span-5 space-y-6">
          <section className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card space-y-4">
            <h2 className="text-base font-black text-theme-primary flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#FFB800]" />
              <span>Bitácora de Gobernanza</span>
            </h2>

            <div className="divide-y divide-[var(--citt-border)]">
              {logs.length === 0 ? (
                <div className="py-8 text-center text-xs text-theme-secondary">
                  Sin eventos recientes en la bitácora institucional.
                </div>
              ) : (
                logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#FFB800]/15 text-[#FFB800] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                        {log.actionType.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-theme-secondary">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-theme-primary font-medium">
                      {log.title}
                    </p>
                    <p className="text-[10px] text-theme-secondary">
                      Por: {log.actorName} (@{log.actorUsername})
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
