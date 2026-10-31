'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Award,
  Sparkles,
  QrCode,
  FileText,
  ExternalLink,
  Trash2,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Users,
} from 'lucide-react';
import { CittActivity, CittMemberProfile } from '@/types/citt';
import { getCampusBySlug, getSchoolBySlug } from '@/data/citt-catalog';
import { ActivityTicketModal } from './ActivityTicketModal';

interface MyActivitiesTabProps {
  user: CittMemberProfile;
  activities: CittActivity[];
  onUnenroll: (activityId: string) => { success: boolean; message: string };
}

export function MyActivitiesTab({
  user,
  activities,
  onUnenroll,
}: MyActivitiesTabProps) {
  const [selectedTicketActivity, setSelectedTicketActivity] = useState<CittActivity | null>(null);
  const [isWaitingListModal, setIsWaitingListModal] = useState(false);
  const [activityToCancel, setActivityToCancel] = useState<CittActivity | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Filter activities for this user
  const confirmedActivities = activities.filter((act) =>
    act.enrolledUsernames.includes(user.username)
  );

  const waitingListActivities = activities.filter((act) =>
    act.waitingListUsernames?.includes(user.username)
  );

  // Total Hours CITT calculation
  const totalHoursInProgress = confirmedActivities.reduce(
    (acc, act) => acc + (act.schedule?.totalHoursCitt || 0),
    0
  );

  const handleOpenTicket = (act: CittActivity, isWaiting: boolean = false) => {
    setSelectedTicketActivity(act);
    setIsWaitingListModal(isWaiting);
  };

  const handleConfirmCancel = () => {
    if (!activityToCancel) return;
    const res = onUnenroll(activityToCancel.id);
    setNoticeMessage(res.message);
    setActivityToCancel(null);

    // Auto-clear notice after 5 seconds
    setTimeout(() => {
      setNoticeMessage(null);
    }, 5000);
  };

  const hasAnyEnrollment =
    confirmedActivities.length > 0 || waitingListActivities.length > 0;

  return (
    <div className="space-y-8">
      {/* KPI Cards: Resumen de Horas y Talleres */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* KPI 1: Horas CITT */}
        <div className="relative overflow-hidden rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-theme-secondary uppercase tracking-wider">
              Horas CITT en Curso
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFB800]/15 text-[#FFB800]">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-theme-primary">
              {totalHoursInProgress}
            </span>
            <span className="text-xs font-bold text-theme-secondary">
              horas acreditables
            </span>
          </div>
          <p className="mt-2 text-[11px] text-theme-secondary leading-tight">
            Válidas para certificación institucional de habilidades CITT Duoc UC.
          </p>
        </div>

        {/* KPI 2: Talleres Confirmados */}
        <div className="relative overflow-hidden rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-theme-secondary uppercase tracking-wider">
              Talleres con Cupo
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#43B02A]/15 text-[#43B02A]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-theme-primary">
              {confirmedActivities.length}
            </span>
            <span className="text-xs font-bold text-[#43B02A]">
              activos en sala
            </span>
          </div>
          <p className="mt-2 text-[11px] text-theme-secondary leading-tight">
            Pase digital y aforo reservado en los laboratorios de tu sede.
          </p>
        </div>

        {/* KPI 3: Lista de Espera */}
        <div className="relative overflow-hidden rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-theme-secondary uppercase tracking-wider">
              Lista de Espera
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#307FE2]/15 text-[#307FE2]">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-theme-primary">
              {waitingListActivities.length}
            </span>
            <span className="text-xs font-bold text-theme-secondary">
              en cola prioritaria
            </span>
          </div>
          <p className="mt-2 text-[11px] text-theme-secondary leading-tight">
            Si un compañero libera su cupo, asciendes de forma automática.
          </p>
        </div>
      </div>

      {/* Notice Message Toast */}
      {noticeMessage && (
        <div className="flex items-center justify-between rounded-2xl border border-[#43B02A]/40 bg-[#43B02A]/10 p-4 text-xs font-bold text-[#43B02A]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{noticeMessage}</span>
          </div>
          <button
            onClick={() => setNoticeMessage(null)}
            className="text-xs hover:underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Main List Section */}
      {!hasAnyEnrollment ? (
        <div className="rounded-3xl border border-theme bg-theme-surface p-8 text-center shadow-theme-card sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFB800]/15 text-[#FFB800]">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="mt-5 text-xl font-black text-theme-primary">
            Aún no estás inscrito en talleres CITT
          </h3>
          <p className="mx-auto mt-2 max-w-[55ch] text-xs text-theme-secondary leading-relaxed">
            Explora la oferta formativa institucional disponible en las 18 sedes de Duoc UC.
            Aprende robótica, IoT, ciberseguridad, desarrollo full-stack e IA aplicada en los laboratorios maker con horas certificadas.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/actividades"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-5 py-3 text-xs font-black text-[#1A1A1A] transition hover:bg-[#ffc633]"
            >
              <span>Explorar Catálogo de Actividades CITT</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section: Talleres Confirmados */}
          {confirmedActivities.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="inline-flex items-center gap-2 text-base font-black text-theme-primary">
                  <CheckCircle2 className="h-5 w-5 text-[#43B02A]" />
                  <span>Talleres Activos con Cupo Confirmado ({confirmedActivities.length})</span>
                </h3>
                <Link
                  href="/actividades"
                  className="text-xs font-bold text-[#307FE2] hover:underline"
                >
                  Ver más talleres →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {confirmedActivities.map((act) => {
                  const campus = getCampusBySlug(act.campusSlug);
                  const school = getSchoolBySlug(act.schoolSlug);

                  return (
                    <div
                      key={act.id}
                      className="group flex flex-col justify-between rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card transition hover:border-[#FFB800]"
                    >
                      <div className="space-y-4">
                        {/* Header Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-theme-elevated px-2.5 py-1 text-[11px] font-bold text-theme-secondary">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: school.primaryHex }}
                            />
                            {school.name}
                          </span>

                          <span className="rounded-full bg-[#43B02A]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#43B02A]">
                            ✓ Cupo Confirmado
                          </span>
                        </div>

                        {/* Title & Desc */}
                        <div>
                          <h4 className="text-base font-black text-theme-primary leading-snug group-hover:text-[#FFB800] transition-colors">
                            {act.title}
                          </h4>
                          <p className="mt-1.5 text-xs text-theme-secondary line-clamp-2 leading-relaxed">
                            {act.description}
                          </p>
                        </div>

                        {/* Meta Info */}
                        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-theme bg-theme-subtle p-3 text-[11px]">
                          <div className="flex items-center gap-1.5 text-theme-secondary truncate">
                            <MapPin className="h-3.5 w-3.5 text-[#307FE2] shrink-0" />
                            <span className="font-bold text-theme-primary truncate">
                              {act.roomLocation}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-theme-secondary truncate">
                            <Clock className="h-3.5 w-3.5 text-[#FFB800] shrink-0" />
                            <span className="font-bold text-theme-primary truncate">
                              {act.schedule.sessionTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-theme-secondary truncate">
                            <Calendar className="h-3.5 w-3.5 text-[#43B02A] shrink-0" />
                            <span className="font-medium truncate">
                              {act.schedule.daysDescription}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-theme-secondary truncate">
                            <Award className="h-3.5 w-3.5 text-[#FFB800] shrink-0" />
                            <span className="font-bold text-theme-primary">
                              {act.schedule.totalHoursCitt} Horas CITT
                            </span>
                          </div>
                        </div>

                        {/* Materiales de estudio si existen */}
                        {act.studyMaterials && act.studyMaterials.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] font-bold text-theme-primary block">
                              Recursos y Material de Estudio:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {act.studyMaterials.map((mat) => (
                                <a
                                  key={mat.id}
                                  href={mat.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-theme bg-theme-elevated px-2.5 py-1 text-[11px] font-semibold text-theme-primary hover:border-[#FFB800] transition"
                                >
                                  <FileText className="h-3 w-3 text-[#307FE2]" />
                                  <span className="truncate max-w-[150px]">{mat.title}</span>
                                  <ExternalLink className="h-2.5 w-2.5 text-theme-secondary" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-theme pt-4">
                        <button
                          type="button"
                          onClick={() => setActivityToCancel(act)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-500 hover:text-red-600 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Liberar Cupo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenTicket(act, false)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-3.5 py-1.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                          <span>Ver Ticket & Pase QR</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Talleres en Lista de Espera */}
          {waitingListActivities.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="inline-flex items-center gap-2 text-base font-black text-theme-primary">
                <Clock className="h-5 w-5 text-[#FFB800]" />
                <span>Talleres en Lista de Espera ({waitingListActivities.length})</span>
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {waitingListActivities.map((act) => {
                  const school = getSchoolBySlug(act.schoolSlug);

                  return (
                    <div
                      key={act.id}
                      className="rounded-3xl border border-dashed border-theme bg-theme-surface p-5 shadow-theme-card space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-theme-secondary">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: school.primaryHex }}
                          />
                          {school.name}
                        </span>
                        <span className="rounded-full bg-[#FFB800]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#FFB800]">
                          ⏳ En Cola de Espera
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-theme-primary">
                          {act.title}
                        </h4>
                        <p className="mt-1 text-xs text-theme-secondary">
                          {act.roomLocation} · {act.schedule.daysDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-theme pt-3">
                        <button
                          type="button"
                          onClick={() => setActivityToCancel(act)}
                          className="text-[11px] font-bold text-red-500 hover:underline"
                        >
                          Retirarme de la Lista
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenTicket(act, true)}
                          className="inline-flex items-center gap-1 rounded-lg border border-theme bg-theme-elevated px-2.5 py-1 text-xs font-bold text-theme-primary"
                        >
                          <QrCode className="h-3 w-3" />
                          <span>Ver Estado</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ticket Modal */}
      <ActivityTicketModal
        activity={selectedTicketActivity}
        user={user}
        isOpen={!!selectedTicketActivity}
        onClose={() => setSelectedTicketActivity(null)}
        isWaitingList={isWaitingListModal}
      />

      {/* Confirm Cancellation Modal */}
      {activityToCancel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={() => setActivityToCancel(null)}
            className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-theme bg-theme-surface p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-500">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h4 className="mt-4 text-base font-black text-theme-primary">
              ¿Liberar tu cupo en este taller?
            </h4>
            <p className="mt-2 text-xs text-theme-secondary leading-relaxed">
              Estás a punto de cancelar tu inscripción en{' '}
              <strong className="text-theme-primary">{activityToCancel.title}</strong>.
              Tu lugar será transferido de inmediato al siguiente estudiante en la lista de espera institucional.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setActivityToCancel(null)}
                className="rounded-xl border border-theme bg-theme-elevated px-4 py-2 text-xs font-bold text-theme-primary"
              >
                Mantener mi cupo
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-600 transition"
              >
                Sí, liberar cupo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
