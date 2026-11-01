'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Laptop,
  Lock,
  Mail,
  MapPin,
  Monitor,
  Plus,
  QrCode,
  Radio,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { RoleBadge } from '@/components/RoleBadge';
import { CittRole } from '@/types/citt';
import { CITT_CAMPUSES, getCampusBySlug } from '@/data/citt-catalog';
import {
  getSupabaseReservations,
  getSupabaseAdminBlocks,
  deleteSupabaseAdminBlock,
  updateSupabaseReservation,
  toggleCheckInSupabaseReservation,
  SupabaseAdminBlock,
} from '@/lib/supabase/reservations';
import { AdminBlockDayModal } from './AdminBlockDayModal';
import { AdminCittPassModal } from './AdminCittPassModal';
import { AdminCasaCentralReportModal } from './AdminCasaCentralReportModal';
import { AdminCalendarRooms } from './AdminCalendarRooms';

export interface RoomReservation {
  id: string;
  roomName: string;
  campusName: string;
  workshopTitle: string;
  applicantName: string;
  applicantUsername: string;
  applicantEmail?: string;
  applicantAvatarUrl?: string;
  applicantRole: CittRole;
  career: string;
  schoolName?: string;
  dateStr: string;
  startTime: string;
  endTime: string;
  attendeesCount: number;
  requiresComputers: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ATTENDED' | 'NO_SHOW';
  cittHoursGranted: number;
  cittPassCode?: string;
  cittPassUrl?: string;
  cittPassSentAt?: string;
}

const INITIAL_RESERVATIONS: RoomReservation[] = [];

const INITIAL_BLOCKS: SupabaseAdminBlock[] = [];

type SubTab = 'reservas' | 'historial' | 'bloqueos' | 'kpis' | 'salas';

interface AdminCalendarBookingsProps {
  selectedCampusSlug?: string;
}

export function AdminCalendarBookings({ selectedCampusSlug }: AdminCalendarBookingsProps = {}) {
  const [subTab, setSubTab] = useState<SubTab>('reservas');
  const [reservations, setReservations] = useState<RoomReservation[]>(INITIAL_RESERVATIONS);
  const [adminBlocks, setAdminBlocks] = useState<SupabaseAdminBlock[]>(INITIAL_BLOCKS);
  const [filterRoom, setFilterRoom] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Modales
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [cittPassTarget, setCittPassTarget] = useState<RoomReservation | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Sincronizar con Supabase
  useEffect(() => {
    let isMounted = true;
    getSupabaseReservations().then((remoteRsvs) => {
      if (!isMounted) return;
      const mapped: RoomReservation[] = remoteRsvs.map((r) => ({
        id: r.id,
        roomName: r.room,
        campusName: r.campus,
        workshopTitle: r.purpose,
        applicantName: r.inChargeName,
        applicantUsername: r.applicantUsername || r.inChargeEmail.split('@')[0],
        applicantEmail: r.inChargeEmail,
        applicantRole: (r.inChargeRole as CittRole) || 'usuario_citt',
        career: r.school || 'Duoc UC',
        schoolName: r.school,
        dateStr: r.date,
        startTime: r.timeSlot.split(' - ')[0] || '10:00',
        endTime: r.timeSlot.split(' - ')[1] || '12:00',
        attendeesCount: r.attendees,
        requiresComputers: r.requiresComputers,
        status: (r.status.toUpperCase() as any) || 'PENDING',
        cittHoursGranted: parseFloat(r.horasCitt) || 1.5,
        cittPassCode: r.cittPassCode,
        cittPassUrl: r.cittPassUrl,
        cittPassSentAt: r.cittPassSentAt,
      }));
      setReservations(mapped);
    });

    getSupabaseAdminBlocks().then((remoteBlocks) => {
      if (!isMounted) return;
      setAdminBlocks(remoteBlocks);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const showNotice = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  const handleApprove = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r))
    );
    updateSupabaseReservation(id, { status: 'APPROVED' });
    showNotice('Reserva aprobada oficialmente. Puedes emitir el CITT PASS.');
  };

  const handleReject = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r))
    );
    updateSupabaseReservation(id, { status: 'REJECTED' });
    showNotice('Reserva rechazada. Horario liberado en el calendario satélite.');
  };

  const handleMarkAttended = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'ATTENDED' } : r))
    );
    toggleCheckInSupabaseReservation(id, true);
    showNotice('Asistencia presencial verificada. Horas CITT acreditadas al perfil.');
  };

  const handleMarkNoShow = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'NO_SHOW' } : r))
    );
    updateSupabaseReservation(id, { status: 'NO_SHOW', checkedIn: false });
    showNotice('Inasistencia registrada (No-Show). Se aplica suspensión preventiva temporal.');
  };

  const handleDeleteBlock = async (blockId: string) => {
    setAdminBlocks((prev) => prev.filter((b) => b.id !== blockId));
    await deleteSupabaseAdminBlock(blockId);
    showNotice('Bloqueo eliminado. Sala liberada para reservas en el calendario.');
  };

  const handlePassDispatched = (resId: string, passCode: string, passUrl?: string) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === resId
          ? {
              ...r,
              cittPassCode: passCode,
              cittPassUrl: passUrl,
              cittPassSentAt: new Date().toISOString(),
              status: 'APPROVED',
            }
          : r
      )
    );
    showNotice(`¡CITT PASS [${passCode}] despachado por correo al solicitante!`);
  };

  const pendingCount = reservations.filter((r) => r.status === 'PENDING').length;

  const filteredReservations = reservations.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterRoom !== 'all' && r.campusName !== filterRoom) return false;
    if (selectedCampusSlug && selectedCampusSlug !== 'nacional') {
      const short = getCampusBySlug(selectedCampusSlug).shortName.toLowerCase();
      if (!r.campusName.toLowerCase().includes(short)) return false;
    }
    return true;
  });

  const filteredBlocks = adminBlocks.filter((b) => {
    if (selectedCampusSlug && selectedCampusSlug !== 'nacional') {
      const short = getCampusBySlug(selectedCampusSlug).shortName.toLowerCase();
      if (!b.campus.toLowerCase().includes(short)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Cabecera del Módulo */}
      <div className="flex flex-col justify-between gap-4 border-b border-theme pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#43B02A]/15 px-3 py-1 text-xs font-bold text-[#43B02A]">
            <Calendar className="h-3.5 w-3.5" />
            <span>Módulo Integrado: Calendario & Salas CITT</span>
          </span>
          <h1 className="text-2xl font-black tracking-tight text-theme-primary mt-2">
            Administración Centralizada de Salas & Tótem
          </h1>
          <p className="text-xs text-theme-secondary mt-1 max-w-2xl">
            Gestiona la agenda satélite del Calendario CITT, bloquea días por mantenimiento, audita el historial de reservas con perfiles oficiales y despacha el CITT PASS por correo para Casa Central.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setBlockModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Bloquear Día / Sala</span>
          </button>

          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#43B02A] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#3ba024]"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Reportes Casa Central</span>
          </button>
        </div>
      </div>

      {/* Alerta de Feedback */}
      {feedbackNotice && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-[#43B02A]/30 bg-[#43B02A]/10 p-3.5 text-xs font-bold text-[#43B02A]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Sub-Navegación de Pestañas */}
      <div className="flex flex-wrap items-center gap-2 border-b border-theme pb-2">
        <button
          type="button"
          onClick={() => setSubTab('reservas')}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${
            subTab === 'reservas'
              ? 'bg-[#1A1A1A] text-white shadow-md'
              : 'border border-theme bg-theme-surface text-theme-secondary hover:text-theme-primary'
          }`}
        >
          <Calendar className="h-4 w-4 text-[#FFB800]" />
          <span>Reservas Activas</span>
          {pendingCount > 0 && (
            <span className="rounded-full bg-[#FFB800] px-2 py-0.5 text-[10px] font-black text-[#1A1A1A]">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSubTab('historial')}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${
            subTab === 'historial'
              ? 'bg-[#1A1A1A] text-white shadow-md'
              : 'border border-theme bg-theme-surface text-theme-secondary hover:text-theme-primary'
          }`}
        >
          <Users className="h-4 w-4 text-[#307FE2]" />
          <span>Historial & Perfiles de Usuario ({reservations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('bloqueos')}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${
            subTab === 'bloqueos'
              ? 'bg-[#1A1A1A] text-white shadow-md'
              : 'border border-theme bg-theme-surface text-theme-secondary hover:text-theme-primary'
          }`}
        >
          <Lock className="h-4 w-4 text-red-500" />
          <span>Días Bloqueados ({adminBlocks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('kpis')}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${
            subTab === 'kpis'
              ? 'bg-[#1A1A1A] text-white shadow-md'
              : 'border border-theme bg-theme-surface text-theme-secondary hover:text-theme-primary'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4 text-[#43B02A]" />
          <span>KPIs & Rendición Casa Central</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('salas')}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${
            subTab === 'salas'
              ? 'bg-[#1A1A1A] text-white shadow-md'
              : 'border border-theme bg-theme-surface text-theme-secondary hover:text-theme-primary'
          }`}
        >
          <Monitor className="h-4 w-4 text-[#FFB800]" />
          <span>Rutas & Salas Tótem (/[sede]/[sala])</span>
        </button>
      </div>

      {/* PESTAÑA 1: RESERVAS ACTIVAS */}
      {subTab === 'reservas' && (
        <div className="space-y-4">
          {/* Barra de Filtros */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme bg-theme-subtle p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'PENDING', label: `Pendientes (${pendingCount})` },
                { id: 'APPROVED', label: 'Aprobadas' },
                { id: 'ATTENDED', label: 'Asistidas' },
                { id: 'NO_SHOW', label: 'Inasistencias' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilterStatus(item.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    filterStatus === item.id
                      ? 'bg-[#FFB800] text-[#1A1A1A] shadow-sm'
                      : 'bg-theme-surface border border-theme text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <select
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
              className="rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
            >
              <option value="all">Todas las Sedes</option>
              {CITT_CAMPUSES.map((c) => (
                <option key={c.slug} value={c.shortName}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Listado */}
          <div className="space-y-3">
            {filteredReservations.length === 0 ? (
              <div className="rounded-3xl border border-theme bg-theme-surface p-12 text-center text-xs text-theme-secondary">
                No hay reservas registradas bajo este filtro.
              </div>
            ) : (
              filteredReservations.map((res) => (
                <article
                  key={res.id}
                  className="rounded-3xl border border-theme bg-theme-surface p-5 shadow-theme-card space-y-3 transition hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          res.status === 'APPROVED'
                            ? 'bg-[#43B02A]/15 text-[#43B02A]'
                            : res.status === 'PENDING'
                            ? 'bg-[#FFB800]/15 text-[#FFB800]'
                            : res.status === 'ATTENDED'
                            ? 'bg-[#307FE2]/15 text-[#307FE2]'
                            : res.status === 'NO_SHOW'
                            ? 'bg-red-500/15 text-red-500'
                            : 'bg-theme-subtle text-theme-secondary'
                        }`}
                      >
                        {res.status === 'APPROVED'
                          ? '✓ Aprobada'
                          : res.status === 'PENDING'
                          ? '⏳ En Revisión'
                          : res.status === 'ATTENDED'
                          ? '✓ Asistencia Cumplida'
                          : res.status === 'NO_SHOW'
                          ? '✗ Inasistencia (No-Show)'
                          : 'Rechazada'}
                      </span>
                      <span className="text-xs font-semibold text-theme-secondary">
                        {res.roomName} · Sede {res.campusName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-theme-primary">
                      <Clock className="h-3.5 w-3.5 text-[#FFB800]" />
                      <span>{res.dateStr} · {res.startTime} - {res.endTime}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-theme-primary leading-snug">
                      {res.workshopTitle}
                    </h3>
                    <p className="text-xs text-theme-secondary mt-1">
                      Solicitante:{' '}
                      <strong className="text-theme-primary">{res.applicantName}</strong> (
                      {res.applicantEmail || `${res.applicantUsername}@duocuc.cl`}) · Carrera:{' '}
                      <span className="text-theme-primary">{res.career}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme pt-3 text-xs">
                    <div className="flex items-center gap-4 text-theme-secondary">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-[#307FE2]" />
                        <span>Quórum: <strong>{res.attendeesCount} pers.</strong></span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Laptop className="h-3.5 w-3.5 text-[#43B02A]" />
                        <span>PCs: <strong>{res.requiresComputers ? 'Sí' : 'No'}</strong></span>
                      </span>
                      {res.cittPassCode ? (
                        <span className="flex items-center gap-1 font-mono font-bold text-[#FFB800]">
                          <QrCode className="h-3.5 w-3.5" />
                          <span>PASS: {res.cittPassCode}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-theme-secondary italic">
                          Sin CITT PASS
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCittPassTarget(res)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#FFB800]/40 bg-[#FFB800]/10 px-3 py-1.5 text-xs font-bold text-theme-primary hover:bg-[#FFB800] hover:text-[#1A1A1A] transition"
                      >
                        <QrCode className="h-3.5 w-3.5 text-[#FFB800]" />
                        <span>{res.cittPassCode ? 'Reenviar CITT PASS' : 'Generar / Despachar PASS'}</span>
                      </button>

                      {res.status === 'PENDING' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleReject(res.id)}
                            className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Rechazar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprove(res.id)}
                            className="inline-flex items-center gap-1 rounded-xl bg-[#43B02A] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#3ba024] transition shadow-sm"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Aprobar</span>
                          </button>
                        </>
                      )}

                      {res.status === 'APPROVED' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleMarkNoShow(res.id)}
                            className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition"
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>No-Show</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkAttended(res.id)}
                            className="inline-flex items-center gap-1 rounded-xl bg-[#307FE2] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#286cc0] transition shadow-sm"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Marcar Asistencia</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      )}

      {/* PESTAÑA 2: HISTORIAL CON PERFILES DE USUARIO */}
      {subTab === 'historial' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-sm font-black text-theme-primary">
                Trazabilidad Histórica de Usuarios en Salas CITT
              </h2>
              <p className="text-xs text-theme-secondary">
                Cada reserva queda vinculada al perfil institucional y credencial de CITT Connect
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-elevated px-3 py-1.5 text-xs font-bold text-theme-primary"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exportar Reporte</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="rounded-3xl border border-theme bg-theme-surface p-5 shadow-theme-card space-y-4"
              >
                {/* Perfil del Solicitante */}
                <div className="flex items-center justify-between gap-3 border-b border-theme pb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={res.applicantAvatarUrl || '/assets/citt-logo.webp'}
                      alt={res.applicantName}
                      className="h-10 w-10 rounded-2xl border border-[#FFB800] object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/u/${res.applicantUsername}`}
                        className="truncate text-xs font-black text-theme-primary hover:underline block"
                      >
                        {res.applicantName}
                      </Link>
                      <p className="truncate text-[10px] text-theme-secondary">
                        {res.applicantEmail || `${res.applicantUsername}@duocuc.cl`}
                      </p>
                    </div>
                  </div>

                  <RoleBadge role={res.applicantRole} />
                </div>

                {/* Info de Reserva */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-theme-primary block">
                      {res.workshopTitle}
                    </span>
                    <span className="text-[11px] text-theme-secondary">
                      {res.schoolName || 'Escuela Duoc UC'} · Carrera: {res.career}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-theme-subtle p-2.5 text-[11px]">
                    <div>
                      <span className="text-theme-secondary block">Fecha & Horario:</span>
                      <strong className="text-theme-primary">
                        {res.dateStr} ({res.startTime} - {res.endTime})
                      </strong>
                    </div>
                    <div>
                      <span className="text-theme-secondary block">Espacio:</span>
                      <strong className="text-theme-primary">{res.roomName}</strong>
                    </div>
                  </div>
                </div>

                {/* Footer CITT PASS */}
                <div className="flex items-center justify-between border-t border-theme pt-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-theme-secondary block">CITT PASS Casa Central:</span>
                    <span className="font-mono font-bold text-[#FFB800] text-[11px]">
                      {res.cittPassCode || 'Pendiente de Emisión'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCittPassTarget(res)}
                    className="inline-flex items-center gap-1 rounded-xl bg-theme-elevated px-3 py-1.5 text-xs font-bold text-theme-primary hover:border-[#FFB800] border border-theme"
                  >
                    <Mail className="h-3.5 w-3.5 text-[#307FE2]" />
                    <span>{res.cittPassSentAt ? 'Reenviar' : 'Despachar'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA 3: DÍAS BLOQUEADOS */}
      {subTab === 'bloqueos' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-sm font-black text-theme-primary">
                Gestor de Días y Horarios Bloqueados
              </h2>
              <p className="text-xs text-theme-secondary">
                Las salas bloqueadas no admitirán reservas en el tótem ni desde la aplicación externa
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBlockModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-600 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nuevo Bloqueo de Sala</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredBlocks.length === 0 ? (
              <div className="rounded-3xl border border-theme bg-theme-surface p-12 text-center text-xs text-theme-secondary">
                No hay bloqueos activos para este ámbito. Todas las salas están disponibles en el calendario.
              </div>
            ) : (
              filteredBlocks.map((block) => (
                <div
                  key={block.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-theme bg-theme-surface p-5 shadow-theme-card"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 text-red-500">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-red-500">
                          {block.blockDate}
                        </span>
                        <span className="rounded-full bg-theme-subtle px-2 py-0.5 text-[10px] font-bold text-theme-primary">
                          {block.startTime} - {block.endTime}
                        </span>
                        <span className="text-xs text-theme-secondary">
                          {block.room} ({block.campus})
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-theme-primary">
                        {block.reason}
                      </h4>
                      <p className="text-[11px] text-theme-secondary">
                        Registrado por: <strong>{block.createdBy}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteBlock(block.id)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-theme bg-theme-elevated px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Desbloquear Sala</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PESTAÑA 4: KPIS & CASA CENTRAL */}
      {subTab === 'kpis' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme pb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#43B02A] uppercase">
                  Auditoría Curricular & Formación Maker
                </span>
                <h3 className="text-base font-black text-theme-primary mt-1">
                  Indicadores de Rendición Exigidos por Casa Central
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#43B02A] px-4 py-2 text-xs font-bold text-white hover:bg-[#3ba024] transition shadow-sm"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Descargar Nómina Oficial Casa Central</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-theme bg-theme-subtle p-4 text-center">
                <span className="text-xs text-theme-secondary font-medium block">
                  Horas de Laboratorio
                </span>
                <span className="text-3xl font-black text-[#FFB800] mt-1 block">
                  {reservations.reduce((acc, r) => acc + r.cittHoursGranted, 0)} hrs
                </span>
                <span className="text-[10px] text-theme-secondary">Acreditadas en el semestre</span>
              </div>

              <div className="rounded-2xl border border-theme bg-theme-subtle p-4 text-center">
                <span className="text-xs text-theme-secondary font-medium block">
                  Estudiantes Impactados
                </span>
                <span className="text-3xl font-black text-[#307FE2] mt-1 block">
                  {reservations.reduce((acc, r) => acc + r.attendeesCount, 0)}
                </span>
                <span className="text-[10px] text-theme-secondary">Alumnos en salas Duoc</span>
              </div>

              <div className="rounded-2xl border border-theme bg-theme-subtle p-4 text-center">
                <span className="text-xs text-theme-secondary font-medium block">
                  Tasa de Asistencia
                </span>
                <span className="text-3xl font-black text-[#43B02A] mt-1 block">
                  {reservations.filter((r) => r.status === 'ATTENDED' || r.status === 'NO_SHOW').length > 0
                    ? `${(
                        (reservations.filter((r) => r.status === 'ATTENDED').length /
                          reservations.filter((r) => r.status === 'ATTENDED' || r.status === 'NO_SHOW').length) *
                        100
                      ).toFixed(1)}%`
                    : '100%'}
                </span>
                <span className="text-[10px] text-theme-secondary">
                  {reservations.filter((r) => r.status === 'NO_SHOW').length > 0
                    ? `${reservations.filter((r) => r.status === 'NO_SHOW').length} no-show`
                    : 'Sin inasistencias'}
                </span>
              </div>

              <div className="rounded-2xl border border-theme bg-theme-subtle p-4 text-center">
                <span className="text-xs text-theme-secondary font-medium block">
                  Pases CITT PASS
                </span>
                <span className="text-3xl font-black text-theme-primary mt-1 block">
                  {reservations.filter((r) => !!r.cittPassCode).length}
                </span>
                <span className="text-[10px] text-theme-secondary">Despachados a tiempo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 5: RUTAS Y SALAS TÓTEM (/[sede]/[sala]) */}
      {subTab === 'salas' && (
        <AdminCalendarRooms
          selectedCampusSlug={selectedCampusSlug}
          onNotice={showNotice}
        />
      )}

      {/* Modales */}
      <AdminBlockDayModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onBlockCreated={(block) => {
          setAdminBlocks((prev) => [block, ...prev]);
          showNotice(`¡Sala bloqueada para el ${block.blockDate}!`);
        }}
      />

      <AdminCittPassModal
        reservation={cittPassTarget}
        isOpen={!!cittPassTarget}
        onClose={() => setCittPassTarget(null)}
        onPassDispatched={handlePassDispatched}
      />

      <AdminCasaCentralReportModal
        reservations={reservations}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}
