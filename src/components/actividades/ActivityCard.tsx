'use client';

import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  FileText,
  Github,
  MonitorPlay,
  Presentation,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CittActivity } from '@/types/citt';
import { DUOC_SCHOOLS, CITT_CAMPUSES } from '@/data/citt-catalog';
import { RoleBadge } from '@/components/RoleBadge';
import { useCittNetwork } from '@/context/CittNetworkContext';

interface ActivityCardProps {
  activity: CittActivity;
  onSelect: (activity: CittActivity) => void;
  onEnrollRequest?: (activity: CittActivity) => void;
}

export function ActivityCard({
  activity,
  onSelect,
  onEnrollRequest,
}: ActivityCardProps) {
  const { activeUser, isAuthenticated, unenrollFromActivity } =
    useCittNetwork();

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

  const handleQuickEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEnrolled || isWaitingList) {
      unenrollFromActivity(activity.id);
      return;
    }

    if (onEnrollRequest) {
      onEnrollRequest(activity);
    } else {
      onSelect(activity);
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <Github className="h-3 w-3 text-theme-primary" />;
      case 'video':
        return <MonitorPlay className="h-3 w-3 text-[#307FE2]" />;
      case 'slides':
        return <Presentation className="h-3 w-3 text-[#FFB800]" />;
      default:
        return <FileText className="h-3 w-3 text-[#43B02A]" />;
    }
  };

  return (
    <article
      onClick={() => onSelect(activity)}
      className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card transition-all duration-300 hover:-translate-y-1 hover:border-[#FFB800]/60 hover:shadow-xl cursor-pointer"
    >
      <div>
        {/* Cabecera / Portada con badges flotantes */}
        <div className="relative h-44 w-full overflow-hidden bg-theme-subtle">
          <img
            src={activity.coverImageUrl || '/assets/citt-hero-lobby.webp'}
            alt={activity.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Badges superiores */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span
              style={{
                backgroundColor: school?.primaryHex ? `${school.primaryHex}EE` : '#307FE2EE',
              }}
              className="rounded-full px-2.5 py-1 text-[11px] font-black text-white shadow-sm backdrop-blur-md"
            >
              {school?.shortName || 'Inter-Escuelas'}
            </span>

            <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
              {activity.modality === 'presencial'
                ? '🏛️ Presencial'
                : activity.modality === 'hibrido'
                ? '🌐 Híbrido'
                : '💻 Online'}
            </span>
          </div>

          {/* Sede y Horas CITT en la base de la imagen */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-1.5 font-bold drop-shadow-md">
              <MapPin className="h-3.5 w-3.5 text-[#FFB800]" />
              <span className="truncate">{campus?.name || activity.campusSlug}</span>
            </div>

            <div className="flex items-center gap-1 rounded-md bg-[#FFB800] px-2 py-0.5 text-[11px] font-black text-[#1A1A1A] shadow-sm">
              <Award className="h-3.5 w-3.5" />
              <span>+{activity.schedule.totalHoursCitt} Horas CITT</span>
            </div>
          </div>
        </div>

        {/* Cuerpo del contenido */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="text-base sm:text-lg font-black leading-snug text-theme-primary group-hover:text-[#FFB800] transition-colors">
              {activity.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-theme-secondary">
              {activity.description}
            </p>
          </div>

          {/* Horario y Frecuencia */}
          <div className="rounded-2xl border border-theme bg-theme-subtle p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-theme-primary">
              <Calendar className="h-3.5 w-3.5 text-[#FFB800] shrink-0" />
              <span className="truncate">{activity.schedule.daysDescription}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-theme-secondary">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 shrink-0" />
                <span>{activity.schedule.sessionTime}</span>
              </div>
              <span className="font-semibold">{activity.schedule.durationWeeks} semanas</span>
            </div>
          </div>

          {/* Barra de Gestión de Cupos & Aforo Inteligente */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-theme-primary flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#307FE2]" />
                <span>Cupos: {enrolledCount} / {activity.totalSeats}</span>
              </span>
              <span
                className={`text-[11px] font-bold ${
                  availableSeats === 0
                    ? 'text-red-500'
                    : availableSeats <= 5
                    ? 'text-[#FFB800]'
                    : 'text-[#43B02A]'
                }`}
              >
                {availableSeats === 0
                  ? 'Cupos agotados'
                  : `${availableSeats} disponibles`}
              </span>
            </div>

            {/* Barra de Progreso */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-theme-subtle border border-theme">
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

            <p className="text-[10px] text-theme-secondary italic">
              Aforo por sala: {activity.capacityPerSession} pers. ({activity.sessionsCountPerWeek} sesiones/sem. = {activity.totalSeats} cupos distribuidos).
            </p>
          </div>

          {/* Chips de Materiales de Estudio Disponibles */}
          {activity.studyMaterials && activity.studyMaterials.length > 0 && (
            <div className="pt-2 border-t border-theme">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-theme-secondary">
                <BookOpen className="h-3.5 w-3.5 text-[#307FE2]" />
                <span>{activity.studyMaterials.length} recursos de estudio incluidos:</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {activity.studyMaterials.slice(0, 3).map((mat) => (
                  <span
                    key={mat.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-theme bg-theme-subtle px-2 py-0.5 text-[10px] font-medium text-theme-primary"
                  >
                    {getMaterialIcon(mat.type)}
                    <span className="truncate max-w-[120px]">{mat.title.split(':')[0]}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer con Instructor y Botón de Acción */}
      <div className="border-t border-theme bg-theme-subtle/50 px-5 py-3.5 sm:px-6 flex items-center justify-between gap-3">
        {/* Info Instructor */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={activity.instructorAvatarUrl || '/assets/citt-logo.webp'}
            alt={activity.instructorName}
            className="h-8 w-8 rounded-full object-cover border border-[#FFB800] shrink-0"
          />
          <div className="min-w-0">
            <p className="truncate text-xs font-black text-theme-primary">
              {activity.instructorName}
            </p>
            <p className="truncate text-[10px] text-theme-secondary">
              Instructor CITT
            </p>
          </div>
        </div>

        {/* Botón de Inscripción / Estado */}
        <button
          type="button"
          onClick={handleQuickEnroll}
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition shadow-sm ${
            isEnrolled
              ? 'border border-[#43B02A]/40 bg-[#43B02A]/10 text-[#43B02A] hover:bg-[#43B02A] hover:text-white'
              : isWaitingList
              ? 'border border-[#FFB800]/40 bg-[#FFB800]/10 text-[#FFB800]'
              : availableSeats === 0
              ? 'border border-theme bg-theme-subtle text-theme-secondary hover:bg-theme-surface'
              : 'bg-[#FFB800] text-[#1A1A1A] hover:bg-[#ffc633]'
          }`}
        >
          {isEnrolled ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Inscrito</span>
            </>
          ) : isWaitingList ? (
            <span>En Lista</span>
          ) : availableSeats === 0 ? (
            <span>Lista Espera</span>
          ) : (
            <>
              <span>Inscribirme</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>
    </article>
  );
}
