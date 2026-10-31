'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCittNetwork } from '@/context/CittNetworkContext';
import { RoleBadge } from '@/components/RoleBadge';
import { DUOC_SCHOOLS } from '@/data/citt-catalog';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Users,
  Monitor,
  Sparkles,
  ArrowRight,
  ExternalLink,
  QrCode,
  Building2,
  AlertCircle,
  Cpu,
  LogIn,
} from 'lucide-react';

function AutorizarReservaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { activeUser, isAuthenticated } = useCittNetwork();

  const token = searchParams.get('token') || 'citt_demo_session_9281';
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const roomParam = searchParams.get('room') || 'Sala CITT 312';
  const campusParam = searchParams.get('campus') || 'San Bernardo';
  const callbackUrl = searchParams.get('callback_url');

  const [startTime, setStartTime] = useState('10:00');
  const [duration, setDuration] = useState('60');
  const [activityName, setActivityName] = useState('Desarrollo de Proyecto e Innovación CITT');
  const [attendeesCount, setAttendeesCount] = useState(3);
  const [requiresComputers, setRequiresComputers] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const school = DUOC_SCHOOLS.find((s) => s.slug === activeUser?.schoolSlug) || null;

  const handleConfirmReservation = async () => {
    if (!acceptedTerms) return;
    setIsSubmitting(true);

    try {
      // Intentar sincronizar con Calendario CITT API si callbackUrl o localhost:3001 está disponible
      const payload = {
        token,
        date: dateParam,
        room: roomParam,
        campus: campusParam,
        startTime,
        durationMinutes: parseInt(duration, 10),
        activityName,
        attendeesCount,
        requiresComputers,
        user: {
          id: activeUser.id,
          fullName: activeUser.fullName,
          email: activeUser.email,
          role: activeUser.role,
          campus: campusParam,
          school: school?.name || activeUser.careerTitle,
        },
      };

      // Si existe un endpoint en Calendario CITT, se enviaría aquí
      // Guardar también en localStorage para que el Admin Panel de CITT Connect lo lea al instante
      const currentBookings = JSON.parse(localStorage.getItem('citt_admin_bookings') || '[]');
      const newBooking = {
        id: `rsv_${Date.now()}`,
        room: roomParam,
        campus: campusParam,
        inChargeName: activeUser.fullName,
        inChargeEmail: activeUser.email,
        inChargeRole: activeUser.role,
        school: school?.shortName || 'Informática',
        date: dateParam,
        timeSlot: `${startTime} - ${parseInt(startTime.split(':')[0], 10) + parseInt(duration, 10) / 60}:00`,
        purpose: activityName,
        attendees: attendeesCount,
        requiresComputers,
        status: 'CONFIRMED',
        source: 'TOTEM_QR',
        totemToken: token,
        horasCitt: parseInt(duration, 10) === 120 ? '2.0 hrs' : '1.0 hr',
        checkedIn: false,
        createdAt: new Date().toISOString(),
      };

      currentBookings.unshift(newBooking);
      localStorage.setItem('citt_admin_bookings', JSON.stringify(currentBookings));

      // Simular delay de firma criptográfica CITT Zero-Trust
      await new Promise((resolve) => setTimeout(resolve, 800));

      const generatedCode = `CITT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      setConfirmationCode(generatedCode);
      setIsConfirmed(true);
    } catch {
      // Fallback
      setConfirmationCode(`CITT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
      setIsConfirmed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-base py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Cabecera Institucional */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/40 bg-[#FFB800]/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#FFB800]">
            <Sparkles className="h-4 w-4" />
            <span>Sistema Central de Identidad & Espacios CITT</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-theme-primary">
            Validación de Reserva en Tótem
          </h1>
          <p className="mt-2 text-sm text-theme-secondary">
            Sincronización segura entre el Tótem Físico de Sala y tu Credencial CITT Connect.
          </p>
        </div>

        {/* Si el usuario NO está logueado en CITT Connect */}
        {!isAuthenticated ? (
          <div className="rounded-3xl border border-theme bg-theme-surface p-8 sm:p-10 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFB800]/20 text-[#FFB800]">
              <LogIn className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-xl font-black text-theme-primary">
              Inicio de Sesión Requerido
            </h2>
            <p className="mt-2 text-sm text-theme-secondary max-w-md mx-auto">
              Para reservar un espacio CITT en el tótem necesitas validar tu identidad estudiantil o docente con tu cuenta de CITT Connect.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/acceso?redirect=/autorizar-reserva?token=${token}&date=${dateParam}&room=${encodeURIComponent(roomParam)}&campus=${encodeURIComponent(campusParam)}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFB800] px-6 py-3 text-sm font-black text-[#1A1A1A] transition hover:bg-[#FFB800]/90"
              >
                <span>Acceder con mi Cuenta Duoc UC</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/acceso"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-theme bg-theme-subtle px-6 py-3 text-sm font-bold text-theme-primary transition hover:bg-theme-surface"
              >
                <span>Registrarme en CITT Connect</span>
              </Link>
            </div>

            <div className="mt-8 rounded-2xl border border-theme-strong/40 bg-theme-subtle p-4 text-left">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-[#307FE2]" />
                <div className="text-xs text-theme-secondary">
                  <strong className="text-theme-primary block font-bold">¿Por qué registrarte en un solo lugar?</strong>
                  Al crear tu credencial en CITT Connect, tu RUN, Escuela, Sede y Carrera quedan automáticamente autenticados para todos los tótems, préstamos de hardware IoT y salas CITT a nivel nacional.
                </div>
              </div>
            </div>
          </div>
        ) : isConfirmed ? (
          /* Pantalla de Confirmación Exitosa */
          <div className="rounded-3xl border border-[#43B02A]/40 bg-theme-surface p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#43B02A]/10 blur-3xl" />
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#43B02A]/20 text-[#43B02A]">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <span className="mt-6 inline-block rounded-full border border-[#43B02A]/30 bg-[#43B02A]/10 px-3 py-1 text-xs font-black text-[#43B02A]">
              RESERVA CONFIRMADA · CITT ZERO-TRUST
            </span>

            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-theme-primary">
              ¡Tu espacio está reservado con éxito!
            </h2>
            <p className="mt-2 text-sm text-theme-secondary max-w-lg mx-auto">
              El tótem de <strong className="text-theme-primary">{roomParam}</strong> ha recibido tu confirmación en tiempo real.
            </p>

            {/* Código de Confirmación */}
            <div className="mt-6 inline-flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#FFB800] bg-[#FFB800]/10 px-8 py-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-theme-secondary">
                Código de Validación en Pantalla
              </span>
              <span className="mt-1 font-mono text-3xl font-black text-theme-primary tracking-widest">
                {confirmationCode}
              </span>
            </div>

            {/* Resumen de la reserva */}
            <div className="mt-8 rounded-2xl border border-theme bg-theme-subtle p-5 text-left space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-theme">
                <span className="text-theme-secondary">Responsable Autorizado:</span>
                <span className="font-bold text-theme-primary">{activeUser.fullName}</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-theme">
                <span className="text-theme-secondary">Espacio & Sede:</span>
                <span className="font-bold text-theme-primary">{roomParam} · {campusParam}</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-theme">
                <span className="text-theme-secondary">Fecha & Bloque:</span>
                <span className="font-bold text-theme-primary">{dateParam} | {startTime} ({duration} mins)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-theme-secondary">Cómputo Horas CITT:</span>
                <span className="font-black text-[#43B02A]">+ {duration === '120' ? '2.0 hrs' : '1.0 hr'} acreditables</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              {callbackUrl ? (
                <a
                  href={callbackUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#307FE2] px-6 py-3 text-sm font-black text-white transition hover:bg-[#307FE2]/90"
                >
                  <span>Volver al Tótem del Calendario</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href="/mi-perfil"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFB800] px-6 py-3 text-sm font-black text-[#1A1A1A] transition hover:bg-[#FFB800]/90"
                >
                  <span>Ver mi Credencial NFC & Horas CITT</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link
                href="/admin"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-theme bg-theme-subtle px-6 py-3 text-sm font-bold text-theme-primary transition hover:bg-theme-surface"
              >
                <span>Ver en Panel Interno</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Formulario de Autorización de Reserva con Credencial CITT */
          <div className="space-y-6">
            {/* Tarjeta de Identidad Digital CITT */}
            <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-theme">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={activeUser.avatarUrl || '/assets/citt-logo.webp'}
                      alt={activeUser.fullName}
                      className="h-16 w-16 rounded-2xl object-cover border-2 border-[#FFB800] shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-[#43B02A] p-1 text-white shadow-sm">
                      <ShieldCheck className="h-3 w-3" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-theme-primary">{activeUser.fullName}</h3>
                      <span className="text-[10px] rounded-md bg-[#43B02A]/10 text-[#43B02A] px-1.5 py-0.5 font-black">
                        ID VERIFICADA
                      </span>
                    </div>
                    <p className="text-xs text-theme-secondary">{activeUser.email}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <RoleBadge role={activeUser.role} size="sm" showTooltip={false} />
                      <span className="text-xs text-theme-secondary">· {activeUser.careerTitle}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-theme bg-theme-subtle p-3 text-right sm:min-w-[160px]">
                  <span className="text-[10px] font-bold text-theme-secondary block uppercase">Credencial Digital</span>
                  <span className="text-xs font-mono font-black text-[#FFB800]">PASS-CITT-{activeUser.username.toUpperCase()}</span>
                  <span className="text-[10px] text-theme-secondary block mt-0.5">Sede: {campusParam}</span>
                </div>
              </div>

              {/* Parámetros del Espacio Solicitado */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 flex items-center gap-3">
                  <div className="rounded-xl bg-[#307FE2]/10 p-2 text-[#307FE2]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-theme-secondary block">Espacio Físico</span>
                    <span className="text-xs font-black text-theme-primary">{roomParam}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 flex items-center gap-3">
                  <div className="rounded-xl bg-[#FFB800]/10 p-2 text-[#FFB800]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-theme-secondary block">Fecha Solicitada</span>
                    <span className="text-xs font-black text-theme-primary">{dateParam}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 flex items-center gap-3">
                  <div className="rounded-xl bg-[#43B02A]/10 p-2 text-[#43B02A]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-theme-secondary block">Sede Institucional</span>
                    <span className="text-xs font-black text-theme-primary">{campusParam}</span>
                  </div>
                </div>
              </div>

              {/* Formulario de Configuración de la Reserva */}
              <div className="mt-6 space-y-4 pt-6 border-t border-theme">
                <div>
                  <label className="block text-xs font-black uppercase text-theme-secondary mb-1">
                    Motivo o Nombre de la Actividad en Sala
                  </label>
                  <input
                    type="text"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    placeholder="Ej. Taller de Prototipado IoT con Arduino"
                    className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-theme-secondary mb-1">
                      Hora de Inicio
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    >
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:30">11:30 AM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="14:30">02:30 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:30">05:30 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-theme-secondary mb-1">
                      Duración del Bloque
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    >
                      <option value="60">60 Minutos (1 Hora CITT)</option>
                      <option value="120">120 Minutos (2 Horas CITT)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-theme-secondary mb-1">
                      Cantidad Estimada de Asistentes
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={attendeesCount}
                      onChange={(e) => setAttendeesCount(parseInt(e.target.value, 10) || 1)}
                      className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requiresComputers}
                        onChange={(e) => setRequiresComputers(e.target.checked)}
                        className="rounded border-theme text-[#FFB800] focus:ring-[#FFB800]"
                      />
                      <span className="text-xs font-bold text-theme-primary flex items-center gap-1.5">
                        <Monitor className="h-4 w-4 text-[#307FE2]" />
                        Requiere Estaciones de Trabajo / PC
                      </span>
                    </label>
                  </div>
                </div>

                {/* Aceptación de términos institucionales CITT */}
                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 rounded border-theme text-[#FFB800] focus:ring-[#FFB800]"
                    />
                    <div className="text-xs text-theme-secondary">
                      <strong className="text-theme-primary block font-bold">
                        Compromiso de Asistencia & Cuidado de Equipamiento CITT
                      </strong>
                      Declaro conocer las normas de sala. La inasistencia no justificada incurre en suspensión temporal según política del Líder CITT.
                    </div>
                  </label>
                </div>

                {/* Botón Principal de Confirmación */}
                <button
                  type="button"
                  disabled={isSubmitting || !acceptedTerms}
                  onClick={handleConfirmReservation}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-6 py-4 text-sm font-black text-[#1A1A1A] shadow-lg transition hover:bg-[#FFB800]/90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1A1A1A] border-t-transparent" />
                      <span>Firmando y autorizando con Credencial CITT...</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5" />
                      <span>Confirmar Reserva con mi Credencial CITT</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Token Hash Técnico para Auditoría */}
            <div className="flex items-center justify-between text-[11px] text-theme-secondary px-2">
              <span className="font-mono">Token Tótem: {token}</span>
              <span className="flex items-center gap-1">
                <Cpu className="h-3 w-3 text-[#307FE2]" />
                Autenticación Federada CITT Connect
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AutorizarReservaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-theme-base">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFB800] border-t-transparent" />
        </div>
      }
    >
      <AutorizarReservaContent />
    </Suspense>
  );
}
