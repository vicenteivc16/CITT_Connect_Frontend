'use client';

import React, { useEffect, useState } from 'react';
import {
  Activity,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  Users,
} from 'lucide-react';
import { RoleBadge } from '@/components/RoleBadge';
import { CITT_CAMPUSES, getCampusBySlug } from '@/data/citt-catalog';
import { AuditLogEntry, getSupabaseAuditLogs } from '@/lib/supabase/audit';

interface AdminAuditLogsProps {
  selectedCampusSlug: string;
}

export function AdminAuditLogs({ selectedCampusSlug }: AdminAuditLogsProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = async () => {
    setIsLoading(true);
    const data = await getSupabaseAuditLogs(
      selectedCampusSlug === 'nacional' ? undefined : selectedCampusSlug,
      100
    );
    setLogs(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedCampusSlug]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorUsername.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = selectedAction === 'todos' || log.actionType === selectedAction;
    return matchesSearch && matchesAction;
  });

  const getActionBadge = (type: string) => {
    switch (type) {
      case 'reserva_sala':
        return <span className="rounded-full bg-[#43B02A]/10 border border-[#43B02A]/30 text-[#43B02A] px-2 py-0.5 text-[9px] font-bold">Reserva Sala</span>;
      case 'citt_pass':
        return <span className="rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] px-2 py-0.5 text-[9px] font-bold">CITT PASS</span>;
      case 'bloqueo_dia':
        return <span className="rounded-full bg-red-500/10 border border-red-500/30 text-red-500 px-2 py-0.5 text-[9px] font-bold">Bloqueo Sala</span>;
      case 'cambio_rol':
        return <span className="rounded-full bg-[#307FE2]/10 border border-[#307FE2]/30 text-[#307FE2] px-2 py-0.5 text-[9px] font-bold">Gobernanza</span>;
      case 'nuevo_usuario':
        return <span className="rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 px-2 py-0.5 text-[9px] font-bold">Registro</span>;
      case 'nueva_sala':
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 text-[9px] font-bold">Salas & Tenant</span>;
      default:
        return <span className="rounded-full bg-theme-subtle border border-theme text-theme-secondary px-2 py-0.5 text-[9px] font-bold">{type}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera de la Bitácora */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#43B02A]">
              Trazabilidad & Telemetría
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-theme-primary tracking-tight">
            Bitácora Central de Auditoría CITT
          </h2>
          <p className="mt-1 text-xs text-theme-secondary max-w-2xl leading-relaxed">
            Registro cronológico inmutable de eventos ejecutivos: reservas de sala, despacho de CITT PASS,
            cambio de privilegios de usuario y bloqueos de sedes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchLogs}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-bold text-theme-primary transition hover:bg-theme-surface"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Filtros de Auditoría */}
      <div className="flex flex-col gap-3 rounded-2xl border border-theme bg-theme-surface p-4 shadow-theme-card sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-theme-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por actor, acción o título del evento..."
            className="w-full rounded-xl border border-theme bg-theme-subtle py-2 pl-9 pr-3 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-theme-secondary shrink-0">Tipo:</span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-primary focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos los Eventos</option>
            <option value="reserva_sala">📅 Reservas de Sala</option>
            <option value="citt_pass">🎟️ CITT PASS Despachados</option>
            <option value="bloqueo_dia">🚫 Bloqueos de Salas</option>
            <option value="cambio_rol">🛡️ Cambios de Rol & Permisos</option>
            <option value="nuevo_usuario">👤 Registros de Usuario</option>
            <option value="nueva_sala">🏛️ Creación de Salas</option>
          </select>
        </div>
      </div>

      {/* Lista Cronológica de Eventos */}
      <div className="rounded-3xl border border-theme bg-theme-surface p-5 shadow-theme-card">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-theme-secondary">
            No hay registros de auditoría que coincidan con los filtros.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => {
              const campus = getCampusBySlug(log.campusSlug);
              const date = new Date(log.createdAt);
              const formattedDate = date.toLocaleDateString('es-CL', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              const formattedTime = date.toLocaleTimeString('es-CL', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className="flex flex-col gap-3 rounded-2xl border border-theme bg-theme-subtle/60 p-4 transition hover:bg-theme-subtle sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black/30 border border-theme text-theme-primary">
                      <Clock className="h-4 w-4 text-[#FFB800]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getActionBadge(log.actionType)}
                        <span className="text-[10px] font-bold text-theme-secondary">
                          Sede {campus.shortName}
                        </span>
                        <span className="text-[10px] text-theme-secondary">·</span>
                        <span className="text-[10px] text-theme-secondary font-mono">
                          {formattedDate} a las {formattedTime}
                        </span>
                      </div>
                      <h4 className="mt-1 text-xs font-bold text-theme-primary">{log.title}</h4>
                      <p className="mt-0.5 text-[11px] text-theme-secondary">
                        Ejecutado por <strong className="text-theme-primary">{log.actorName}</strong> (@{log.actorUsername})
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <RoleBadge role={log.actorRole} size="sm" showTooltip={false} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
