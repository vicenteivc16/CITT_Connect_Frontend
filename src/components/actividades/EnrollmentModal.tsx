'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Award,
  AlertCircle,
  LogIn,
  ArrowRight,
  Sparkles,
  QrCode,
  Building2,
  Users,
} from 'lucide-react';
import { CittActivity } from '@/types/citt';
import { RoleBadge } from '@/components/RoleBadge';
import { useCittNetwork } from '@/context/CittNetworkContext';

interface EnrollmentModalProps {
  activity: CittActivity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EnrollmentModal({
  activity,
  isOpen,
  onClose,
}: EnrollmentModalProps) {
  const {
    activeUser,
    isAuthenticated,
    profiles,
    setActiveUserByUsername,
    enrollInActivity,
  } = useCittNetwork();

  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedCode, setConfirmedCode] = useState<string | null>(null);

  if (!isOpen || !activity) return null;

  const isEnrolled =
    Boolean(activeUser?.username) &&
    activity.enrolledUsernames.includes(activeUser.username);

  const enrolledCount = activity.enrolledUsernames.length;
  const isFull = enrolledCount >= activity.totalSeats;

  const handleConfirmEnrollment = async () => {
    if (!acceptedTerms || !isAuthenticated) return;
    setIsSubmitting(true);

    try {
      const res = enrollInActivity(activity.id);
      if (res.success) {
        const ticketCode = `TKT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        setConfirmedCode(ticketCode);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLoginAsStudent = (username: string) => {
    setActiveUserByUsername(username);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-2xl"
      >
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-theme-secondary hover:bg-theme-subtle hover:text-theme-primary transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* CASO 1: NO AUTENTICADO */}
        {!isAuthenticated ? (
          <div className="text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFB800]/20 text-[#FFB800]">
              <LogIn className="h-8 w-8" />
            </div>

            <div>
              <span className="inline-block rounded-full border border-[#FFB800]/40 bg-[#FFB800]/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#FFB800]">
                Acceso Institucional Requerido
              </span>
              <h3 className="mt-3 text-xl font-black text-theme-primary">
                Inicia Sesión para Inscribirte
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-theme-secondary">
                Para respetar el aforo de <strong>{activity.capacityPerSession} personas por sala</strong> y acreditar tus <strong>+{activity.schedule.totalHoursCitt} Horas CITT</strong> en tu credencial digital, debes estar identificado con tu cuenta Duoc UC.
              </p>
            </div>

            {/* Acceso oficial */}
            <div className="pt-2">
              <Link
                href={`/acceso?redirect=/actividades`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-5 py-3.5 text-xs font-black text-[#1A1A1A] transition hover:bg-[#ffc633] shadow-md"
              >
                <span>Acceder con mi Cuenta Duoc UC</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Acceso Rápido para Pruebas del Prototipo */}
            <div className="rounded-2xl border border-theme bg-theme-subtle p-4 text-left space-y-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-theme-secondary">
                O prueba el prototipo con un clic como:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLoginAsStudent('camila.valenzuela')}
                  className="rounded-xl border border-theme bg-theme-surface p-2.5 text-left transition hover:border-[#FFB800] hover:bg-[#FFB800]/5 flex items-center gap-2"
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt="Camila"
                    className="h-7 w-7 rounded-full object-cover border border-[#FFB800]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-theme-primary">Camila Valenzuela</p>
                    <p className="truncate text-[10px] text-theme-secondary">Alumna Duoc UC</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLoginAsStudent('vicente.vasquez')}
                  className="rounded-xl border border-theme bg-theme-surface p-2.5 text-left transition hover:border-[#FFB800] hover:bg-[#FFB800]/5 flex items-center gap-2"
                >
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                    alt="Vicente"
                    className="h-7 w-7 rounded-full object-cover border border-[#307FE2]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-theme-primary">Vicente Vásquez</p>
                    <p className="truncate text-[10px] text-theme-secondary">Core Dev CITT</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : confirmedCode ? (
          /* CASO 2: INSCRIPCIÓN CONFIRMADA CON ÉXITO */
          <div className="text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#43B02A]/20 text-[#43B02A]">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <span className="inline-block rounded-full border border-[#43B02A]/40 bg-[#43B02A]/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#43B02A]">
                {isFull ? 'LISTA DE ESPERA REGISTRADA' : 'CUPO RESERVADO EN SALA'}
              </span>
              <h3 className="mt-2 text-xl font-black text-theme-primary">
                ¡Inscripción Confirmada!
              </h3>
              <p className="mt-1 text-xs text-theme-secondary">
                Tu cupo ha sido registrado en la base de datos de <strong>Supabase</strong>.
              </p>
            </div>

            {/* Tarjeta de Ticket */}
            <div className="rounded-2xl border-2 border-dashed border-[#FFB800] bg-[#FFB800]/10 p-5 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-theme-secondary">
                Código de Ticket Institucional
              </span>
              <p className="font-mono text-2xl font-black text-theme-primary tracking-widest">
                {confirmedCode}
              </p>
              <div className="text-[11px] text-theme-secondary pt-1 border-t border-[#FFB800]/20 flex items-center justify-between">
                <span>{activity.roomLocation}</span>
                <span className="font-bold text-[#43B02A]">+{activity.schedule.totalHoursCitt} Horas CITT</span>
              </div>
            </div>

            {/* Info del Estudiante */}
            <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-theme-secondary">Estudiante:</span>
                <span className="font-bold text-theme-primary">{activeUser.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-theme-secondary">Carrera & Sede:</span>
                <span className="font-bold text-theme-primary">{activeUser.careerTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-theme-secondary">Días de Taller:</span>
                <span className="font-bold text-theme-primary">{activity.schedule.daysDescription}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl bg-[#FFB800] px-5 py-3 text-xs font-black text-[#1A1A1A] hover:bg-[#ffc633] transition shadow-md"
              >
                Entendido y Cerrar
              </button>
            </div>
          </div>
        ) : (
          /* CASO 3: FORMULARIO DE CONFIRMACIÓN CON CREDENCIAL CITT */
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#FFB800] uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Pase Digital CITT Connect</span>
              </div>
              <h3 className="mt-1 text-lg font-black text-theme-primary">
                Confirmar Inscripción Oficial
              </h3>
              <p className="text-xs text-theme-secondary">
                Estás a un paso de reservar tu puesto en el taller.
              </p>
            </div>

            {/* Credencial del Alumno Activo */}
            <div className="rounded-2xl border border-theme bg-theme-subtle p-4 flex items-center gap-3">
              <img
                src={activeUser.avatarUrl || '/assets/citt-logo.webp'}
                alt={activeUser.fullName}
                className="h-12 w-12 rounded-2xl object-cover border-2 border-[#FFB800] shadow-sm shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-black text-theme-primary">
                    {activeUser.fullName}
                  </p>
                  <span className="rounded bg-[#43B02A]/10 px-1 py-0.5 text-[9px] font-black text-[#43B02A]">
                    ID VERIFICADA
                  </span>
                </div>
                <p className="truncate text-[11px] text-theme-secondary">{activeUser.email}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <RoleBadge role={activeUser.role} size="sm" showTooltip={false} />
                  <span className="text-[10px] text-theme-secondary truncate">· {activeUser.careerTitle}</span>
                </div>
              </div>
            </div>

            {/* Resumen del Taller */}
            <div className="rounded-2xl border border-theme bg-theme-subtle p-4 space-y-2 text-xs">
              <h4 className="font-bold text-theme-primary">{activity.title}</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-theme-secondary pt-2 border-t border-theme">
                <div>
                  <span className="block text-[10px] font-bold uppercase">Espacio</span>
                  <span className="font-semibold text-theme-primary">{activity.roomLocation}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase">Horario</span>
                  <span className="font-semibold text-theme-primary">{activity.schedule.daysDescription}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase">Aforo por Sala</span>
                  <span className="font-semibold text-theme-primary">{activity.capacityPerSession} pers. ({activity.totalSeats} cupos totales)</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase">Cómputo Horas</span>
                  <span className="font-black text-[#43B02A]">+{activity.schedule.totalHoursCitt} Horas CITT</span>
                </div>
              </div>
            </div>

            {/* Compromiso de Asistencia */}
            <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-theme text-[#FFB800] focus:ring-[#FFB800]"
                />
                <div className="text-[11px] text-theme-secondary leading-relaxed">
                  <strong className="text-theme-primary block font-bold">
                    Compromiso de Asistencia & Aforo
                  </strong>
                  Declaro que asistiré a las sesiones del taller en la sala física. Entiendo que las inasistencias injustificadas liberan el cupo a compañeros en lista de espera.
                </div>
              </label>
            </div>

            {/* Botón de Confirmación Oficial */}
            <button
              type="button"
              disabled={isSubmitting || !acceptedTerms}
              onClick={handleConfirmEnrollment}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-5 py-3.5 text-xs font-black text-[#1A1A1A] shadow-md transition hover:bg-[#ffc633] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1A1A1A] border-t-transparent" />
                  <span>Registrando en Supabase...</span>
                </div>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>
                    {isFull
                      ? 'Inscribirme en Lista de Espera de Sala'
                      : 'Confirmar mi Cupo con Credencial CITT'}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
