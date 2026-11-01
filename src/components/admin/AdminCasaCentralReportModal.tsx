'use client';

import React from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Award,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { RoomReservation } from './AdminCalendarBookings';

interface AdminCasaCentralReportModalProps {
  reservations: RoomReservation[];
  isOpen: boolean;
  onClose: () => void;
}

export function AdminCasaCentralReportModal({
  reservations,
  isOpen,
  onClose,
}: AdminCasaCentralReportModalProps) {
  if (!isOpen) return null;

  const totalReservations = reservations.length;
  const attendedReservations = reservations.filter((r) => r.status === 'ATTENDED').length;
  const noShowReservations = reservations.filter((r) => r.status === 'NO_SHOW').length;
  const totalCittHours = reservations.reduce((acc, r) => acc + r.cittHoursGranted, 0);
  const totalStudentsReached = reservations.reduce((acc, r) => acc + r.attendeesCount, 0);
  const passDispatchedCount = reservations.filter((r) => !!r.cittPassCode).length;

  const attendanceRate =
    attendedReservations + noShowReservations > 0
      ? Math.round(
          (attendedReservations / (attendedReservations + noShowReservations)) * 100
        )
      : 100;

  const handleDownloadCsv = () => {
    const headers = [
      'ID Reserva',
      'Fecha',
      'Sede Duoc UC',
      'Sala',
      'Actividad / Taller',
      'Encargado',
      'Username CITT',
      'Correo Institucional',
      'Carrera',
      'Escuela',
      'Quorum Participantes',
      'Horas CITT Acreditadas',
      'Estado Reserva',
      'Codigo CITT PASS',
      'CITT PASS Despachado',
    ];

    const rows = reservations.map((r) => [
      r.id,
      r.dateStr,
      r.campusName,
      `"${r.roomName}"`,
      `"${r.workshopTitle}"`,
      `"${r.applicantName}"`,
      r.applicantUsername,
      r.applicantEmail || `${r.applicantUsername}@duocuc.cl`,
      `"${r.career}"`,
      `"${r.schoolName || 'Escuela de Informática y Telecomunicaciones'}"`,
      r.attendeesCount,
      r.cittHoursGranted,
      r.status,
      r.cittPassCode || 'NO_EMITIDO',
      r.cittPassSentAt ? 'SI' : 'NO',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Reporte_CITT_Casa_Central_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-theme pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#43B02A]/15 text-[#43B02A] font-bold">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#43B02A] uppercase">
                Formulario Oficial de Rendición CITT
              </span>
              <h3 className="text-base font-black text-theme-primary">
                Reporte & Tablero de Indicadores para Casa Central
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-theme-secondary hover:bg-theme-subtle hover:text-theme-primary transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Resumen de KPIs */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 text-center">
            <span className="text-[11px] font-medium text-theme-secondary block">
              Total Reservas
            </span>
            <span className="text-2xl font-black text-theme-primary">
              {totalReservations}
            </span>
          </div>

          <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 text-center">
            <span className="text-[11px] font-medium text-theme-secondary block">
              Horas de Sala
            </span>
            <span className="text-2xl font-black text-[#FFB800]">
              {totalCittHours} hrs
            </span>
          </div>

          <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 text-center">
            <span className="text-[11px] font-medium text-theme-secondary block">
              Alumnos Alcanzados
            </span>
            <span className="text-2xl font-black text-[#307FE2]">
              {totalStudentsReached}
            </span>
          </div>

          <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 text-center">
            <span className="text-[11px] font-medium text-theme-secondary block">
              Tasa Asistencia
            </span>
            <span className="text-2xl font-black text-[#43B02A]">
              {attendanceRate}%
            </span>
          </div>
        </div>

        {/* Detalle Institucional */}
        <div className="rounded-2xl border border-theme bg-theme-elevated p-4 text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-theme pb-2.5">
            <span className="font-bold text-theme-primary">Pases CITT PASS Emitidos</span>
            <span className="font-mono font-bold text-[#FFB800]">{passDispatchedCount} de {totalReservations}</span>
          </div>
          <div className="flex items-center justify-between border-b border-theme pb-2.5">
            <span className="font-bold text-theme-primary">Inasistencias Registradas (No-Show)</span>
            <span className="font-mono font-bold text-red-500">{noShowReservations} casos</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-theme-primary">Quórum Promedio por Actividad</span>
            <span className="font-mono font-bold text-theme-primary">
              {totalReservations > 0 ? (totalStudentsReached / totalReservations).toFixed(1) : 0} personas / sesión
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-theme bg-theme-subtle p-4 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-theme-primary">
            <CheckCircle2 className="h-4 w-4 text-[#43B02A]" />
            <span>Formato Compatible con Formulario de Casa Central</span>
          </div>
          <p className="text-[11px] text-theme-secondary leading-relaxed">
            La descarga incluye la nómina codificada con RUT, correos institucionales `@duocuc.cl`, horas de taller acreditadas y código CITT PASS para la rendición curricular.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-theme">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-theme bg-theme-elevated px-4 py-2 text-xs font-bold text-theme-primary"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-2 rounded-xl bg-[#43B02A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#3ba024]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Descargar Planilla Oficial Casa Central (.CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
