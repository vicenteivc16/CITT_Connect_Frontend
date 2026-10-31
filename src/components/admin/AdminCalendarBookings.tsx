'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Laptop,
  MapPin,
  QrCode,
  Radio,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { RoleBadge } from '@/components/RoleBadge';
import { CittRole } from '@/types/citt';

export interface RoomReservation {
  id: string;
  roomName: string;
  campusName: string;
  workshopTitle: string;
  applicantName: string;
  applicantUsername: string;
  applicantRole: CittRole;
  career: string;
  dateStr: string;
  startTime: string;
  endTime: string;
  attendeesCount: number;
  requiresComputers: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ATTENDED' | 'NO_SHOW';
  cittHoursGranted: number;
}

const INITIAL_RESERVATIONS: RoomReservation[] = [
  {
    id: 'res-101',
    roomName: 'Sala 312 (Laboratorio CITT)',
    campusName: 'San Bernardo',
    workshopTitle: 'Taller de Prototipado IoT y Sensores Agrícolas',
    applicantName: 'Vicente Vásquez',
    applicantUsername: 'vicente-vasquez',
    applicantRole: 'lider_citt',
    career: 'Ingeniería en Informática',
    dateStr: 'Hoy, 31 Octubre',
    startTime: '10:00',
    endTime: '12:00',
    attendeesCount: 6,
    requiresComputers: true,
    status: 'APPROVED',
    cittHoursGranted: 2,
  },
  {
    id: 'res-102',
    roomName: 'Sala 312 (Laboratorio CITT)',
    campusName: 'San Bernardo',
    workshopTitle: 'Sesión de Programación de Microcontroladores ESP32',
    applicantName: 'Matías Alarcón',
    applicantUsername: 'matias-alarcon',
    applicantRole: 'usuario_citt',
    career: 'Automatización y Robótica',
    dateStr: 'Hoy, 31 Octubre',
    startTime: '14:30',
    endTime: '16:00',
    attendeesCount: 4,
    requiresComputers: true,
    status: 'PENDING',
    cittHoursGranted: 1.5,
  },
  {
    id: 'res-103',
    roomName: 'Laboratorio de Hardware Abierto',
    campusName: 'San Joaquín',
    workshopTitle: 'Mesa de Trabajo: Gemelos Digitales Portuarios',
    applicantName: 'Ignacio Sepúlveda',
    applicantUsername: 'ignacio-sepulveda',
    applicantRole: 'lider_citt',
    career: 'Ingeniería en Informática',
    dateStr: 'Lunes, 02 Noviembre',
    startTime: '11:00',
    endTime: '13:00',
    attendeesCount: 8,
    requiresComputers: false,
    status: 'APPROVED',
    cittHoursGranted: 2,
  },
  {
    id: 'res-104',
    roomName: 'Sala 312 (Laboratorio CITT)',
    campusName: 'San Bernardo',
    workshopTitle: 'Pruebas de Ciberseguridad en Redes Industriales',
    applicantName: 'Javier Morales',
    applicantUsername: 'javier-morales',
    applicantRole: 'usuario_citt',
    career: 'Ingeniería en Conectividad y Redes',
    dateStr: 'Ayer',
    startTime: '16:00',
    endTime: '17:30',
    attendeesCount: 5,
    requiresComputers: true,
    status: 'ATTENDED',
    cittHoursGranted: 1.5,
  },
];

export function AdminCalendarBookings() {
  const [reservations, setReservations] = useState<RoomReservation[]>(INITIAL_RESERVATIONS);
  const [filterRoom, setFilterRoom] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r))
    );
    showNotice('Reserva aprobada oficialmente. Notificación enviada al solicitante.');
  };

  const handleReject = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r))
    );
    showNotice('Reserva desestimada. Horario liberado en el calendario.');
  };

  const handleMarkAttended = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, status: 'ATTENDED' };
        }
        return r;
      })
    );
    showNotice('Asistencia confirmada. Se acreditaron las Horas CITT al perfil.');
  };

  const handleMarkNoShow = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'NO_SHOW' } : r))
    );
    showNotice('Inasistencia registrada (No-Show). Se aplica suspensión preventiva temporal.');
  };

  const showNotice = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  const pendingCount = reservations.filter((r) => r.status === 'PENDING').length;

  const filteredReservations = reservations.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterRoom !== 'all' && r.campusName !== filterRoom) return false;
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
            Administración de Salas & Tótems de Acceso
          </h1>
          <p className="text-xs text-theme-secondary mt-1 max-w-2xl">
            Gestiona la disponibilidad de salas de laboratorio, valida solicitudes de reserva, monitorea los tótems QR de acceso físico y acredita Horas CITT por asistencia.
          </p>
        </div>

        {/* Badge Tótem Activo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-[#43B02A]/40 bg-[#43B02A]/10 px-3.5 py-2 text-xs font-bold text-[#43B02A]">
            <span className="h-2 w-2 rounded-full bg-[#43B02A] animate-pulse" />
            <span>Tótem Sala 312 En Línea (Zero-Trust)</span>
          </div>
        </div>
      </div>

      {/* Alerta de Feedback */}
      {feedbackNotice && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-[#43B02A]/30 bg-[#43B02A]/10 p-3.5 text-xs font-bold text-[#43B02A]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Tarjeta de Control del Tótem QR (Zero-Trust Session Monitor) */}
      <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFB800] text-[#1A1A1A] shadow-sm">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-theme-primary">
                Monitor del Tótem de Acceso Físico
              </h2>
              <p className="text-xs text-theme-secondary">
                Sincronización en tiempo real con la pantalla exterior de la Sala CITT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-theme bg-theme-subtle px-3 py-1.5 text-xs font-bold text-theme-primary">
              Sala 312 · San Bernardo
            </span>
            <span className="rounded-xl bg-[#43B02A]/15 text-[#43B02A] px-3 py-1.5 text-xs font-bold">
              Modo Kiosk Activo
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 space-y-1">
            <span className="text-theme-secondary text-[11px] font-bold block">
              Mecanismo de Autenticación:
            </span>
            <p className="font-bold text-theme-primary flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#107C41]" />
              <span>Pase QR CITT Connect (SSO)</span>
            </p>
          </div>

          <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 space-y-1">
            <span className="text-theme-secondary text-[11px] font-bold block">
              Tiempo de Validez por Sesión:
            </span>
            <p className="font-bold text-theme-primary flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#FFB800]" />
              <span>10 Minutos (Auto-rotativo)</span>
            </p>
          </div>

          <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 space-y-1">
            <span className="text-theme-secondary text-[11px] font-bold block">
              Trazabilidad en Base Central:
            </span>
            <p className="font-bold text-theme-primary flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#307FE2]" />
              <span>Identidad Verificada CITT</span>
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme bg-theme-subtle p-3.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status buttons */}
          {[
            { id: 'all', label: 'Todas' },
            { id: 'PENDING', label: `Pendientes (${pendingCount})` },
            { id: 'APPROVED', label: 'Aprobadas' },
            { id: 'ATTENDED', label: 'Asistidas (Horas CITT)' },
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

        {/* Room selector */}
        <select
          value={filterRoom}
          onChange={(e) => setFilterRoom(e.target.value)}
          className="rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
        >
          <option value="all">Todas las Sedes con Sala CITT</option>
          <option value="San Bernardo">Sede San Bernardo (Sala 312)</option>
          <option value="San Joaquín">Sede San Joaquín (Lab Hardware)</option>
        </select>
      </div>

      {/* Lista de Reservas de Sala */}
      <div className="space-y-3">
        {filteredReservations.length === 0 ? (
          <div className="rounded-3xl border border-theme bg-theme-surface p-12 text-center text-xs text-theme-secondary">
            No hay reservas registradas en este estado.
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
                      ? 'Reserva Aprobada'
                      : res.status === 'PENDING'
                      ? 'Pendiente de Aprobación'
                      : res.status === 'ATTENDED'
                      ? 'Asistencia Validada'
                      : res.status === 'NO_SHOW'
                      ? 'Inasistencia (No-Show)'
                      : 'Rechazada'}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-theme-primary">
                    <MapPin className="h-3 w-3 text-[#FFB800]" />
                    <span>{res.roomName} — {res.campusName}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-theme-primary">
                  <Clock className="h-3.5 w-3.5 text-[#FFB800]" />
                  <span>
                    {res.dateStr} · {res.startTime} - {res.endTime}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-theme-primary">
                  {res.workshopTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-theme-secondary mt-1">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#307FE2]" />
                    <span>{res.attendeesCount} participantes</span>
                  </span>

                  {res.requiresComputers && (
                    <span className="flex items-center gap-1.5 text-theme-primary font-semibold">
                      <Laptop className="h-3.5 w-3.5 text-[#43B02A]" />
                      <span>Requiere computadores del Lab</span>
                    </span>
                  )}

                  <span className="font-semibold text-[#FFB800]">
                    +{res.cittHoursGranted} Horas CITT de acreditación
                  </span>
                </div>
              </div>

              {/* Pie: Solicitante y Acciones de Aprobación / Asistencia */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme pt-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-theme-secondary">Solicitado por:</span>
                  <strong className="text-theme-primary">
                    {res.applicantName}
                  </strong>
                  <RoleBadge role={res.applicantRole} showTooltip={false} size="sm" />
                  <span className="text-theme-secondary hidden sm:inline">
                    · {res.career}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {res.status === 'PENDING' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApprove(res.id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-[#43B02A] px-3 py-1.5 font-bold text-white transition hover:bg-[#389623]"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Aprobar Reserva</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(res.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Desestimar</span>
                      </button>
                    </>
                  )}

                  {res.status === 'APPROVED' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleMarkAttended(res.id)}
                        title="Acreditar horas CITT"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#107C41] px-3 py-1.5 font-bold text-white transition hover:bg-[#0d6334]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Confirmar Asistencia</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMarkNoShow(res.id)}
                        title="Aplicar sanción por inasistencia"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-subtle px-3 py-1.5 font-bold text-theme-secondary hover:text-red-500 transition"
                      >
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>No-Show</span>
                      </button>
                    </>
                  )}

                  {res.status === 'ATTENDED' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#107C41]">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Horas acreditadas en CITT Connect</span>
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
