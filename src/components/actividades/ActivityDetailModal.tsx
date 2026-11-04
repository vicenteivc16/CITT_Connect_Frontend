'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  FolderGit2,
  Github,
  HardDrive,
  Lock,
  MessageCircle,
  MonitorPlay,
  Presentation,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  Building2,
  AlertCircle,
  HelpCircle,
  QrCode,
  Trash2,
} from 'lucide-react';
import { ActivityPublicQuestion, ActivityStudyMaterial, CittActivity } from '@/types/citt';
import { DUOC_SCHOOLS, CITT_CAMPUSES } from '@/data/citt-catalog';
import { RoleBadge } from '@/components/RoleBadge';
import { useCittNetwork } from '@/context/CittNetworkContext';

interface ActivityDetailModalProps {
  activity: CittActivity | null;
  onClose: () => void;
  onOpenEnrollment?: (activity: CittActivity) => void;
  onViewTicket?: (activity: CittActivity) => void;
}

export function ActivityDetailModal({
  activity,
  onClose,
  onOpenEnrollment,
  onViewTicket,
}: ActivityDetailModalProps) {
  const {
    activeUser,
    isAuthenticated,
    unenrollFromActivity,
    addActivityQuestion,
    answerActivityQuestion,
  } = useCittNetwork();

  const [newQuestionText, setNewQuestionText] = useState('');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!activity) return null;

  const school = DUOC_SCHOOLS.find((s) => s.slug === activity.schoolSlug);
  const campus = CITT_CAMPUSES.find((c) => c.slug === activity.campusSlug);

  const isEnrolled =
    Boolean(activeUser?.username) &&
    activity.enrolledUsernames.includes(activeUser.username);

  const isWaitingList =
    Boolean(activeUser?.username) &&
    (activity.waitingListUsernames || []).includes(activeUser.username);

  const isInstructor =
    Boolean(activeUser?.username) &&
    activeUser.username === activity.instructorUsername;

  const isCoreDev = activeUser?.role === 'dev';

  const canAccessResources = isEnrolled || isInstructor || isCoreDev;

  const enrolledCount = activity.enrolledUsernames.length;
  const availableSeats = Math.max(0, activity.totalSeats - enrolledCount);
  const percentage = Math.min(100, Math.round((enrolledCount / activity.totalSeats) * 100));

  const handleEnrollClick = () => {
    if (isEnrolled || isWaitingList) {
      if (onViewTicket) {
        onViewTicket(activity);
      }
      return;
    }

    if (onOpenEnrollment) {
      onOpenEnrollment(activity);
    }
  };

  const handleConfirmCancel = () => {
    unenrollFromActivity(activity.id);
    setShowCancelConfirm(false);
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    addActivityQuestion(activity.id, newQuestionText.trim());
    setNewQuestionText('');
  };

  const handleSendReply = (questionId: string) => {
    const text = replyTextMap[questionId];
    if (!text || !text.trim()) return;
    answerActivityQuestion(activity.id, questionId, text.trim());
    setReplyTextMap((prev) => ({ ...prev, [questionId]: '' }));
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'drive':
        return <HardDrive className="h-4 w-4 text-[#307FE2]" />;
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
    <Dialog.Root open={Boolean(activity)} onOpenChange={(val) => !val && onClose()}>
      <Dialog.Portal>
        {/* Backdrop a nivel raíz: cubre toda la ventana de extremo a extremo incluyendo el Navbar z-40 */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[92vh] w-[94vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface shadow-2xl focus:outline-none">
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
              <Dialog.Title className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md text-white">
                {activity.title}
              </Dialog.Title>
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
                  <span className="text-[10px] font-bold uppercase text-theme-secondary block">
                    Días & Frecuencia
                  </span>
                  <span className="text-xs font-black text-theme-primary truncate block">
                    {activity.schedule.daysDescription}
                  </span>
                  {activity.schedule.daysOfWeek && activity.schedule.daysOfWeek.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activity.schedule.daysOfWeek.map((d) => (
                        <span
                          key={d}
                          className="rounded-md bg-[#FFB800]/20 px-1.5 py-0.5 text-[9px] font-black text-[#FFB800] uppercase"
                        >
                          {d.slice(0, 2)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 flex items-center gap-3">
                <div className="rounded-xl bg-[#307FE2]/10 p-2 text-[#307FE2]">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-theme-secondary block">
                    Horario de Sesión
                  </span>
                  <span className="text-xs font-black text-theme-primary truncate block">
                    {activity.schedule.timeStart && activity.schedule.timeEnd
                      ? `${activity.schedule.timeStart} a ${activity.schedule.timeEnd} hrs`
                      : activity.schedule.sessionTime}
                  </span>
                  <span className="text-[10px] text-theme-secondary block mt-0.5">
                    {activity.schedule.durationWeeks} semanas de duración
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 flex items-center gap-3">
                <div className="rounded-xl bg-[#43B02A]/10 p-2 text-[#43B02A]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-theme-secondary block">
                    Espacio Físico
                  </span>
                  <span className="text-xs font-black text-theme-primary truncate block">
                    {activity.roomLocation}
                  </span>
                  <span className="text-[10px] text-theme-secondary block mt-0.5">
                    {campus?.name || activity.campusSlug}
                  </span>
                </div>
              </div>
            </div>

            {/* Tarjeta de Insignia Digital CITT (si la actividad la otorga) */}
            {activity.badge && (
              <div className="relative overflow-hidden rounded-3xl border border-[#FFB800]/40 bg-gradient-to-br from-[#FFB800]/15 via-theme-subtle to-theme-subtle p-5 shadow-lg shadow-[#FFB800]/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Contenedor Gráfico con Glow */}
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-[#FFB800] bg-black/90 p-2 shadow-md shadow-[#FFB800]/25">
                      {activity.badge.imageUrl ? (
                        <img
                          src={activity.badge.imageUrl}
                          alt={activity.badge.name}
                          className="h-full w-full object-contain drop-shadow"
                        />
                      ) : (
                        <Award className="h-8 w-8 text-[#FFB800]" />
                      )}
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFB800] text-[#1A1A1A] shadow-sm">
                        <Sparkles className="h-3 w-3" />
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#FFB800] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#1A1A1A]">
                          Insignia Digital CITT
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                          Acreditable al 100% de Asistencia
                        </span>
                      </div>
                      <h4 className="mt-1 text-base font-black text-theme-primary">
                        {activity.badge.name}
                      </h4>
                      <p className="mt-0.5 text-xs text-theme-secondary leading-snug">
                        {activity.badge.criteria}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-theme/40 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-theme-secondary">
                  <span>🛡️ Regulada bajo el Estándar Oficial de Insignias CITT.</span>
                  <span className="font-bold text-[#FFB800]">
                    Verificada en tu Credencial Digital & Perfil CITT
                  </span>
                </div>
              </div>
            )}

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

              {/* Explicación de distribución pedagógica */}
              <div className="rounded-2xl border border-[#307FE2]/20 bg-[#307FE2]/10 p-3.5 text-xs text-theme-secondary leading-relaxed">
                <strong className="text-theme-primary block font-bold mb-0.5">
                  Arquitectura de Aforo CITT:
                </strong>
                La sala física tiene un aforo máximo de{' '}
                <strong>{activity.capacityPerSession} personas por sesión</strong> para garantizar estaciones de trabajo y kits de hardware individuales. Al distribuirse en{' '}
                <strong>{activity.sessionsCountPerWeek} sesiones semanales</strong>, el cupo total es de{' '}
                <strong>{activity.totalSeats} alumnos</strong>.
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

            {/* ========================================================= */}
            {/* RECURSOS & ENLACES EXCLUSIVOS PARA INSCRITOS */}
            {/* ========================================================= */}
            <div className="space-y-3 pt-2 border-t border-theme">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-theme-primary flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#FFB800]" />
                  <span>Recursos & Material de Estudio</span>
                </h4>
                {canAccessResources && (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-500">
                    Acceso Desbloqueado
                  </span>
                )}
              </div>

              {!canAccessResources ? (
                /* Estado Bloqueado para No Inscritos */
                <div className="rounded-2xl border border-[#FFB800]/40 bg-[#FFB800]/10 p-5 text-center space-y-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFB800]/20 text-[#FFB800]">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-theme-primary">
                      Recursos & Material Exclusivo para Alumnos Inscritos
                    </p>
                    <p className="mt-1 text-[11px] text-theme-secondary max-w-md mx-auto leading-relaxed">
                      Este taller cuenta con{' '}
                      <strong>{activity.studyMaterials.length} recurso(s) protegidos</strong>{' '}
                      (carpetas Google Drive, repositorios y documentación). Inscríbete oficialmente en el taller para desbloquear los accesos directos del docente.
                    </p>
                  </div>
                </div>
              ) : (
                /* Estado Desbloqueado para Inscritos e Instructor */
                <div className="space-y-2">
                  {activity.studyMaterials.length === 0 ? (
                    <p className="text-xs text-theme-secondary py-3 text-center">
                      El instructor aún no ha compartido enlaces adicionales para este taller.
                    </p>
                  ) : (
                    activity.studyMaterials.map((mat) => (
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
                          <span>Abrir Enlace</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* ========================================================= */}
            {/* PANEL INFERIOR: PREGUNTAS PÚBLICAS (Q&A DEL TALLER) */}
            {/* ========================================================= */}
            <div className="space-y-4 pt-4 border-t border-theme">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-[#307FE2]" />
                  <div>
                    <h4 className="text-sm font-black text-theme-primary">
                      Preguntas & Dudas del Taller
                    </h4>
                    <p className="text-[11px] text-theme-secondary">
                      Preguntas públicas para resolver dudas sobre requisitos e instrumental
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-theme-secondary">
                  {(activity.publicQuestions || []).length} pregunta(s)
                </span>
              </div>

              {/* Formulario para Enviar Pregunta */}
              {isAuthenticated ? (
                <form onSubmit={handleSendQuestion} className="flex gap-2">
                  <input
                    type="text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Escribe tu pregunta sobre el taller (ej. ¿Se requieren conocimientos previos de Python?)..."
                    className="flex-1 rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs text-theme-primary placeholder-theme-secondary focus:border-[#307FE2] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newQuestionText.trim()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#307FE2] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2569bd] disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Preguntar</span>
                  </button>
                </form>
              ) : (
                <div className="rounded-xl border border-theme bg-theme-subtle p-3 text-xs text-theme-secondary flex items-center justify-between">
                  <span>Inicia sesión con tu credencial institucional para publicar preguntas.</span>
                  <Link href="/acceso" className="font-bold text-[#FFB800] underline">
                    Iniciar Sesión
                  </Link>
                </div>
              )}

              {/* Lista de Preguntas */}
              <div className="space-y-3">
                {(!activity.publicQuestions || activity.publicQuestions.length === 0) ? (
                  <p className="py-4 text-center text-xs text-theme-secondary">
                    Aún no hay preguntas para este taller. ¡Sé el primero en consultar!
                  </p>
                ) : (
                  activity.publicQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="rounded-2xl border border-theme bg-theme-subtle p-4 space-y-3"
                    >
                      {/* Cabecera de la Pregunta */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={q.authorAvatarUrl || '/assets/citt-logo.webp'}
                            alt={q.authorName}
                            className="h-7 w-7 rounded-lg object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-theme-primary">
                                {q.authorName}
                              </span>
                              <RoleBadge role={q.authorRole} size="sm" showTooltip={false} />
                            </div>
                            <span className="text-[10px] text-theme-secondary">
                              @{q.authorUsername} · {q.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Texto de la Pregunta */}
                      <p className="text-xs text-theme-primary leading-relaxed pl-9">
                        {q.question}
                      </p>

                      {/* Respuesta Oficial si existe */}
                      {q.answer ? (
                        <div className="ml-9 rounded-xl border border-[#307FE2]/30 bg-[#307FE2]/10 p-3 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-[#307FE2]" />
                            <span className="text-[11px] font-black text-[#307FE2] uppercase tracking-wider">
                              Respuesta Oficial del Instructor
                            </span>
                            <span className="text-[10px] text-theme-secondary">
                              · {q.answer.answeredAt}
                            </span>
                          </div>
                          <p className="text-xs text-theme-primary leading-relaxed">
                            {q.answer.text}
                          </p>
                          <p className="text-[10px] text-theme-secondary font-medium">
                            Respondido por {q.answer.authorName}
                          </p>
                        </div>
                      ) : (
                        /* Si no tiene respuesta y el usuario es Instructor o Core Dev */
                        (isInstructor || isCoreDev) && (
                          <div className="ml-9 mt-2 flex gap-2">
                            <input
                              type="text"
                              value={replyTextMap[q.id] || ''}
                              onChange={(e) =>
                                setReplyTextMap((prev) => ({
                                  ...prev,
                                  [q.id]: e.target.value,
                                }))
                              }
                              placeholder="Escribe la respuesta oficial como instructor..."
                              className="flex-1 rounded-lg border border-theme bg-theme-surface px-3 py-1.5 text-xs text-theme-primary focus:border-[#307FE2] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleSendReply(q.id)}
                              disabled={!replyTextMap[q.id]?.trim()}
                              className="rounded-lg bg-[#307FE2] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#2569bd] disabled:opacity-50"
                            >
                              Responder
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Barra de Acción de Inscripción */}
            <div className="pt-4 border-t border-theme flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-theme-secondary text-center sm:text-left">
                {isEnrolled ? (
                  <span className="font-bold text-[#43B02A] flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Estás inscrito con cupo confirmado. Sumará +{activity.schedule.totalHoursCitt} Horas CITT.
                  </span>
                ) : isWaitingList ? (
                  <span className="font-bold text-[#FFB800] flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    Estás en lista de espera prioritaria institucional.
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

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isEnrolled ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-red-500/30 px-3.5 py-3 text-xs font-bold text-red-500 hover:bg-red-500/10 transition"
                      title="Liberar cupo para un compañero"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Liberar Cupo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onViewTicket ? onViewTicket(activity) : null}
                      className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-2xl bg-[#43B02A] px-5 py-3 text-xs font-black text-white hover:bg-[#3ba024] transition shadow-md"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>Ver mi Pase QR</span>
                    </button>
                  </>
                ) : isWaitingList ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-theme px-3 py-3 text-xs font-bold text-theme-secondary hover:text-red-500"
                    >
                      <span>Salir de Espera</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onViewTicket ? onViewTicket(activity) : null}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-5 py-3 text-xs font-black text-[#1A1A1A] hover:bg-[#ffc633]"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>Ver Pase en Espera</span>
                    </button>
                  </>
                ) : availableSeats === 0 ? (
                  <button
                    type="button"
                    onClick={handleEnrollClick}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-[#FFB800] bg-[#FFB800]/15 px-6 py-3 text-xs font-black text-theme-primary hover:bg-[#FFB800] hover:text-[#1A1A1A] transition"
                  >
                    <Users className="h-4 w-4" />
                    <span>Unirme a Lista de Espera</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleEnrollClick}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-6 py-3 text-xs font-black text-[#1A1A1A] hover:bg-[#ffc633] transition shadow-lg"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Inscribirme con Credencial CITT</span>
                  </button>
                )}
              </div>
            </div>

            {/* Modal de Confirmación de Cancelación */}
            {showCancelConfirm && (
              <div className="absolute inset-0 z-50 flex items-center justify-center rounded-3xl bg-black/85 p-6 backdrop-blur-sm animate-in fade-in duration-150">
                <div className="w-full max-w-md rounded-3xl border border-theme bg-theme-surface p-6 shadow-2xl space-y-4 text-left">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-500">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-theme-primary">
                      ¿Liberar tu cupo en este taller?
                    </h4>
                    <p className="mt-1 text-xs text-theme-secondary leading-relaxed">
                      Estás a punto de cancelar tu inscripción en <strong>{activity.title}</strong>.
                      Tu cupo físico en la sala será asignado automáticamente al siguiente compañero en la lista de espera institucional.
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(false)}
                      className="rounded-xl border border-theme bg-theme-subtle px-4 py-2 text-xs font-bold text-theme-primary"
                    >
                      Mantener mi Cupo
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmCancel}
                      className="rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-600 transition"
                    >
                      Sí, Liberar Cupo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
