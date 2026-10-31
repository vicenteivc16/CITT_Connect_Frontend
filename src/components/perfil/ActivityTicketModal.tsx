'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  Download,
  AlertCircle,
  Building2,
  User,
  ExternalLink,
} from 'lucide-react';
import { CittActivity, CittMemberProfile } from '@/types/citt';
import { getCampusBySlug, getSchoolBySlug } from '@/data/citt-catalog';

interface ActivityTicketModalProps {
  activity: CittActivity | null;
  user: CittMemberProfile;
  isOpen: boolean;
  onClose: () => void;
  isWaitingList?: boolean;
}

export function ActivityTicketModal({
  activity,
  user,
  isOpen,
  onClose,
  isWaitingList = false,
}: ActivityTicketModalProps) {
  if (!isOpen || !activity) return null;

  const campus = getCampusBySlug(activity.campusSlug);
  const school = getSchoolBySlug(activity.schoolSlug);
  const ticketCode = `TKT-${activity.slug.slice(0, 6).toUpperCase()}-${user.username.slice(0, 4).toUpperCase()}-${new Date().getFullYear()}`;

  const qrPayload = JSON.stringify({
    ticket: ticketCode,
    activityId: activity.id,
    activitySlug: activity.slug,
    studentUsername: user.username,
    studentEmail: user.email,
    room: activity.roomLocation,
    campus: campus.name,
    verifiedAt: new Date().toISOString(),
  });

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0A0A0A]/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-2xl">
        {/* Institutional Header Banner */}
        <div className="relative bg-[#1A1A1A] p-6 text-white border-b-2 border-[#FFB800]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFB800] text-[#1A1A1A] font-black text-sm shadow-md">
                CITT
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-widest text-[#FFB800] uppercase">
                    Pase de Asistencia & Aforo
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                    Duoc UC
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  Ticket Institucional de Taller CITT
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
              aria-label="Cerrar ticket"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs">
            <span className="font-mono font-bold tracking-wider text-[#FFB800]">
              {ticketCode}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                isWaitingList
                  ? 'bg-[#FFB800]/20 text-[#FFB800]'
                  : 'bg-[#43B02A]/20 text-[#43B02A]'
              }`}
            >
              {isWaitingList ? '⏳ Lista de Espera' : '✓ Cupo y Aforo Confirmado'}
            </span>
          </div>
        </div>

        {/* Ticket Content */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Workshop Details Box */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-theme-elevated px-2.5 py-1 text-[11px] font-bold text-theme-secondary">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: school.primaryHex }} />
              {school.name}
            </span>

            <h4 className="text-lg font-black text-theme-primary leading-snug">
              {activity.title}
            </h4>
            <p className="text-xs text-theme-secondary leading-relaxed line-clamp-2">
              {activity.description}
            </p>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl border border-theme bg-theme-subtle p-4 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-theme-secondary block">
                Sede & Sala
              </span>
              <span className="font-bold text-theme-primary flex items-center gap-1 truncate">
                <MapPin className="h-3.5 w-3.5 text-[#307FE2] shrink-0" />
                {activity.roomLocation}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-medium text-theme-secondary block">
                Horario
              </span>
              <span className="font-bold text-theme-primary flex items-center gap-1 truncate">
                <Clock className="h-3.5 w-3.5 text-[#FFB800] shrink-0" />
                {activity.schedule.sessionTime}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-medium text-theme-secondary block">
                Frecuencia
              </span>
              <span className="font-bold text-theme-primary flex items-center gap-1 truncate">
                <Calendar className="h-3.5 w-3.5 text-[#43B02A] shrink-0" />
                {activity.schedule.daysDescription}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-medium text-theme-secondary block">
                Horas CITT
              </span>
              <span className="font-bold text-theme-primary flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-[#FFB800] shrink-0" />
                {activity.schedule.totalHoursCitt} hrs
              </span>
            </div>
          </div>

          {/* QR Code and Pass Validation Block */}
          <div className="flex flex-col sm:flex-row items-center gap-5 rounded-2xl border-2 border-dashed border-theme bg-theme-surface p-5">
            <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-2xl bg-white p-3 shadow-inner">
              <QRCodeSVG
                value={qrPayload}
                size={120}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-theme-primary">
                <ShieldCheck className="h-4 w-4 text-[#43B02A]" />
                <span>Pase Digital Verificado por Supabase</span>
              </div>
              <p className="text-xs text-theme-secondary leading-relaxed">
                Presenta este código en el tótem de entrada o ante el docente a cargo en{' '}
                <strong className="text-theme-primary">{activity.roomLocation}</strong> ({campus.name})
                para registrar tu asistencia efectiva y acreditar tus horas institucionales.
              </p>
              <div className="pt-1 text-[11px] text-theme-secondary">
                Titular: <strong className="text-theme-primary">{user.fullName}</strong> ({user.email})
              </div>
            </div>
          </div>

          {/* Warning / Guidelines Box */}
          <div className="rounded-xl border border-theme bg-theme-subtle p-3.5 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-theme-primary">
              <AlertCircle className="h-4 w-4 text-[#FFB800] shrink-0" />
              <span>Compromiso de Asistencia & Aforo CITT</span>
            </div>
            <p className="text-[11px] text-theme-secondary leading-relaxed">
              El aforo de los laboratorios CITT es limitado ({activity.capacityPerSession} puestos por sesión).
              Si no puedes asistir a una sesión, por favor libera tu cupo desde tu perfil para que un compañero de la
              lista de espera pueda aprovechar el taller.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme bg-theme-subtle p-4 px-6">
          <span className="text-[11px] text-theme-secondary">
            Instructor: <strong>{activity.instructorName}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-elevated px-3.5 py-2 text-xs font-bold text-theme-primary transition hover:border-[#FFB800]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
            >
              <span>Aceptar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
