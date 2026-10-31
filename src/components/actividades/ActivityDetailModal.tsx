'use client';

import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Github,
  MonitorPlay,
  Presentation,
  ShieldCheck,
  Sparkles,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { CittActivity } from '@/types/citt';
import { DUOC_SCHOOLS, CITT_CAMPUSES } from '@/data/citt-catalog';
import { RoleBadge } from '@/components/RoleBadge';
import { useCittNetwork } from '@/context/CittNetworkContext';

interface ActivityDetailModalProps {
  activity: CittActivity | null;
  onClose: () => void;
}

export function ActivityDetailModal({
  activity,
  onClose,
}: ActivityDetailModalProps) {
  const { activeUser, isAuthenticated, enrollInActivity, unenrollFromActivity } =
    useCittNetwork();

  if (!activity) return null;

  const school = DUOC_SCHOOLS.find((s) => s.slug === activity.schoolSlug);
  const campus = CITT_CAMPUSES.find((c) => c.slug === activity.campusSlug);

  const isEnrolled =
    Boolean(activeUser?.username) &&
    activity.enrolledUsernames.includes(activeUser.username);

  const isWaitingList =
    Boolean(activeUser?.username) &&
    (activity.waitingListUsernames || []).includes(activeUser.username);

  const enrolledCount = activity.enrolledUsernames.length;
  const availableSeats = Math.max(0, activity.totalSeats - enrolledCount);
  const percentage = Math.min(100, Math.round((enrolledCount / activity.totalSeats) * 100));

  const handleEnrollClick = () => {
    if (!isAuthenticated) return;
    if (isEnrolled || isWaitingList) {
      unenrollFromActivity(activity.id);
    } else {
      enrollInActivity(activity.id);
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <Github className="h-4 w-4 text-theme-primary" />;
      case 'video':
        return <MonitorPlay className="h-4 w-4 text-[#307FE2]" />;
      case 'slides':
        return <Presentation className="h-4 w-4 text-[#FFB800]" />;
      default:
        return <FileText className="h-4 w-4 text-[#43B02A]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-theme bg-theme-surface shadow-2xl"
      >
        {/* Cabecera con Imagen de Portada */}
        <div className="relative h-60 w-full overflow-hidden bg-theme-subtle">
          <img
            src={activity.coverImageUrl || '/assets/citt-hero-lobby.webp'}
            alt={activity.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Botón Cerrar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition shadow-lg backdrop-blur-md"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Badges superiores */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span
              style={{
                backgroundColor: school?.primaryHex ? `${school.primaryHex}EE` : '#307FE2EE',
              }}
              className="rounded-full px-3 py-1 text-xs font-black text-white shadow-md backdrop-blur-md"
            >
              {school?.name || 'Inter-Escuelas'}
            </span>

            <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
              {activity.modality === 'presencial'
                ? '🏛️ Presencial en Sala CITT'
                : activity.modality === 'hibrido'
                ? '🌐 Modalidad Híbrida'
                : '💻 Online / Streaming'}
            </span>
          </div>

          {/* Título en la parte inferior de la portada */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FFB800] mb-1">
              <Award className="h-4 w-4" />
              <span>+{activity.schedule.totalHoursCitt} Horas CITT Acreditables</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md">
              {activity.title}
            </h2>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Fila de Metadatos Rápidos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 flex items-center gap-3">
              <div className="rounded-xl bg-[#FFB800]/10 p-2 text-[#FFB800]">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-theme-secondary block">Días & Frecuencia</span>
                <span className="text-xs font-black text-theme-primary truncate block">{activity.schedule.daysDescription}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 flex items-center gap-3">
              <div className="rounded-xl bg-[#307FE2]/10 p-2 text-[#307FE2]">
                <Clock className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-theme-secondary block">Horario de Sesión</span>
                <span className="text-xs font-black text-theme-primary truncate block">{activity.schedule.sessionTime}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 flex items-center gap-3">
              <div className="rounded-xl bg-[#43B02A]/10 p-2 text-[#43B02A]">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-theme-secondary block">Espacio Físico</span>
                <span className="text-xs font-black text-theme-primary truncate block">{activity.roomLocation}</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Aforo Inteligente & Distribución de Cupos */}
          <div className="rounded-3xl border border-theme bg-theme-subtle p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#307FE2]" />
                <h4 className="text-sm font-black text-theme-primary">
                  Gestión de Cupos & Aforo de Laboratorio
                </h4>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-theme-surface border border-theme text-theme-primary">
                {enrolledCount} de {activity.totalSeats} cupos ocupados ({percentage}%)
              </span>
            </div>

            {/* Barra de Progreso */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-theme-surface border border-theme">
              <div
                style={{ width: `${percentage}%` }}
                className={`h-full transition-all duration-500 ${
                  percentage >= 100
                    ? 'bg-red-500'
                    : percentage >= 75
                    ? 'bg-[#FFB800]'
                    : 'bg-[#43B02A]'
                }`}
              />
            </div>

            {/* Explicación de distribución pedagógica solicitada por el usuario */}
            <div className="rounded-2xl border border-[#307FE2]/20 bg-[#307FE2]/10 p-3.5 text-xs text-theme-secondary leading-relaxed">
              <strong className="text-theme-primary block font-bold mb-0.5">
                Arquitectura de Aforo CITT:
              </strong>
              La sala física tiene un aforo máximo de <strong>{activity.capacityPerSession} personas por sesión</strong> para garantizar estaciones de trabajo y kits de hardware individuales. Al distribuirse en <strong>{activity.sessionsCountPerWeek} sesiones semanales</strong>, el cupo total es de <strong>{activity.totalSeats} alumnos</strong> distribuidos equitativamente.
            </div>
          </div>

          {/* Descripción Detallada */}
          <div className="space-y-2">
            <h4 className="text-sm font-black text-theme-primary uppercase tracking-wide">
              Sobre esta Actividad
            </h4>
            <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed">
              {activity.detailedDescription || activity.description}
            </p>
          </div>

          {/* Tarjeta del Instructor CITT */}
          <div className="rounded-2xl border border-theme bg-theme-subtle p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={activity.instructorAvatarUrl || '/assets/citt-logo.webp'}
                alt={activity.instructorName}
                className="h-12 w-12 rounded-2xl object-cover border-2 border-[#FFB800]"
              />
              <div>
                <p className="text-xs font-black text-theme-primary">
                  {activity.instructorName}
                </p>
                <p className="text-[11px] text-theme-secondary">
                  Docente / Líder CITT a cargo de la actividad
                </p>
                <div className="mt-1">
                  <RoleBadge role={activity.instructorRole} size="sm" showTooltip={false} />
                </div>
              </div>
            </div>

            <div className="text-right text-[11px] text-theme-secondary">
              <span className="block font-bold text-theme-primary">{campus?.name}</span>
              <span>{school?.shortName}</span>
            </div>
          </div>

          {/* Apartado Especial: Recursos y Material de Estudio */}
          <div className="space-y-3 pt-2 border-t border-theme">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-theme-primary flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#FFB800]" />
                <span>Recursos & Material de Estudio del Taller</span>
              </h4>
              <span className="text-xs text-theme-secondary font-medium">
                {activity.studyMaterials.length} archivo(s)
              </span>
            </div>

            <div className="space-y-2">
              {activity.studyMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="rounded-2xl border border-theme bg-theme-subtle p-3.5 flex items-center justify-between gap-3 transition hover:border-[#FFB800]/50"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="rounded-xl bg-theme-surface p-2 border border-theme shrink-0 mt-0.5">
                      {getMaterialIcon(mat.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-theme-primary truncate">
                        {mat.title}
                      </p>
                      <p className="text-[11px] text-theme-secondary line-clamp-1">
                        {mat.description}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-theme-secondary">
                        <span className="uppercase font-bold text-[#FFB800]">{mat.type}</span>
                        {mat.fileSizeOrDuration && <span>· {mat.fileSizeOrDuration}</span>}
                        <span>· {mat.uploadedAt}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={mat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary hover:bg-[#FFB800] hover:text-[#1A1A1A] transition shadow-sm"
                  >
                    <span>Abrir</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Barra de Acción de Inscripción */}
          <div className="pt-4 border-t border-theme flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-theme-secondary text-center sm:text-left">
              {isEnrolled ? (
                <span className="font-bold text-[#43B02A] flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Estás inscrito oficialmente. Tu asistencia sumará +{activity.schedule.totalHoursCitt} Horas CITT.
                </span>
              ) : availableSeats === 0 ? (
                <span className="text-red-500 font-bold">
                  El taller está lleno. Puedes anotarte en la lista de espera por si un compañero cancela.
                </span>
              ) : (
                <span>
                  Inscripción inmediata con tu Credencial Digital Duoc UC. Cupos limitados.
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleEnrollClick}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-xs font-black transition shadow-lg ${
                isEnrolled
                  ? 'border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                  : isWaitingList
                  ? 'border border-[#FFB800]/40 bg-[#FFB800]/10 text-[#FFB800]'
                  : availableSeats === 0
                  ? 'border border-theme bg-theme-subtle text-theme-secondary'
                  : 'bg-[#FFB800] text-[#1A1A1A] hover:bg-[#ffc633]'
              }`}
            >
              {isEnrolled ? (
                <span>Cancelar mi Inscripción</span>
              ) : isWaitingList ? (
                <span>En Lista de Espera</span>
              ) : availableSeats === 0 ? (
                <span>Unirme a Lista de Espera</span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Inscribirme con Credencial CITT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
