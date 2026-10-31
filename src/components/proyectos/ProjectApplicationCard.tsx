'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  ClipboardList,
  Clock,
  Info,
  LogIn,
  Send,
  Shield,
} from 'lucide-react';
import { CittMemberProfile, CittProject } from '@/types/citt';

interface ProjectApplicationCardProps {
  project: CittProject;
  activeUser: CittMemberProfile;
  isAuthenticated: boolean;
  isLead: boolean;
  isCollaborator: boolean;
  appStatus: 'none' | 'pending' | 'accepted' | 'rejected';
  onApply: (data: { answers: Record<string, string>; note?: string }) => {
    success: boolean;
    message: string;
  };
  onWithdraw: () => void;
}

export function ProjectApplicationCard({
  project,
  activeUser,
  isAuthenticated,
  isLead,
  isCollaborator,
  appStatus,
  onApply,
  onWithdraw,
}: ProjectApplicationCardProps) {
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const [applicationNote, setApplicationNote] = useState('');
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionFeedback(null);

    const result = onApply({
      answers: formAnswers,
      note: applicationNote.trim() || undefined,
    });

    if (result.success) {
      setSubmissionFeedback({ type: 'success', text: result.message });
      setFormAnswers({});
      setApplicationNote('');
    } else {
      setSubmissionFeedback({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFB800] text-[#1A1A1A]">
          {project.applicationMode === 'form' ? (
            <ClipboardList className="h-5 w-5" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </div>
        <div>
          <h2 className="text-sm font-bold text-theme-primary">
            {project.applicationMode === 'form'
              ? 'Formulario de Postulación'
              : 'Postulación Directa'}
          </h2>
          <p className="text-xs text-theme-secondary">
            Ecosistema CITT Connect SSO
          </p>
        </div>
      </div>

      {/* Caso 1: No autenticado */}
      {!isAuthenticated ? (
        <div className="mt-5 space-y-3 rounded-2xl border border-theme bg-theme-subtle p-4 text-center">
          <LogIn className="mx-auto h-7 w-7 text-[#FFB800]" />
          <p className="text-xs font-bold text-theme-primary">
            Inicia sesión para postular a este equipo
          </p>
          <p className="text-[11px] text-theme-secondary">
            Tu postulación se vincula automáticamente con tu credencial @duocuc.cl.
          </p>
          <Link
            href={`/acceso?redirect=/proyectos/${project.slug}`}
            className="mt-2 block w-full rounded-xl bg-[#FFB800] py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
          >
            Acceder a CITT Connect
          </Link>
        </div>
      ) : isLead ? (
        /* Caso 2: Es el líder del proyecto */
        <div className="mt-5 rounded-2xl border border-theme bg-theme-subtle p-4 text-center">
          <Shield className="mx-auto h-7 w-7 text-[#307FE2]" />
          <p className="mt-2 text-xs font-bold text-theme-primary">
            Eres el Líder y Creador de este Proyecto
          </p>
          <p className="mt-1 text-[11px] text-theme-secondary">
            Administra las postulaciones y la admisión de colaboradores en la bandeja inferior.
          </p>
        </div>
      ) : isCollaborator ? (
        /* Caso 3: Ya es parte del equipo */
        <div className="mt-5 rounded-2xl border border-[#43B02A]/40 bg-[#43B02A]/10 p-4 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-[#43B02A]" />
          <p className="mt-2 text-xs font-bold text-theme-primary">
            ¡Eres Colaborador Oficial de este Proyecto!
          </p>
          <p className="mt-1 text-[11px] text-theme-secondary">
            Tu nombre y rol figuran en la pestaña de Equipo.
          </p>
        </div>
      ) : appStatus === 'accepted' ? (
        /* Caso 4: Fue aceptado */
        <div className="mt-5 rounded-2xl border border-[#43B02A]/40 bg-[#43B02A]/10 p-4 text-center">
          <Award className="mx-auto h-8 w-8 text-[#43B02A]" />
          <p className="mt-2 text-xs font-bold text-theme-primary">
            ¡Tu postulación ha sido Aceptada!
          </p>
          <p className="mt-1 text-[11px] text-theme-secondary">
            El líder del proyecto te ha sumado al equipo. Revisa tu correo institucional para la coordinación.
          </p>
        </div>
      ) : appStatus === 'pending' ? (
        /* Caso 5: Postulación en revisión */
        <div className="mt-5 space-y-3 rounded-2xl border border-[#FFB800]/40 bg-[#FFB800]/10 p-4 text-center">
          <Clock className="mx-auto h-8 w-8 text-[#FFB800]" />
          <p className="text-xs font-bold text-theme-primary">
            Postulación en Revisión
          </p>
          <p className="text-[11px] text-theme-secondary">
            El líder del equipo ha recibido tu ficha y la evaluará a la brevedad.
          </p>
          <button
            type="button"
            onClick={onWithdraw}
            className="rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-secondary hover:text-red-500"
          >
            Retirar Postulación
          </button>
        </div>
      ) : appStatus === 'rejected' ? (
        /* Caso 6: Declinada */
        <div className="mt-5 rounded-2xl border border-theme bg-theme-subtle p-4 text-center">
          <Info className="mx-auto h-7 w-7 text-theme-secondary" />
          <p className="mt-2 text-xs font-bold text-theme-primary">
            Postulación Desestimada
          </p>
          <p className="mt-1 text-[11px] text-theme-secondary">
            El equipo cerró las vacantes para este perfil. Puedes explorar otras iniciativas en el Hub.
          </p>
        </div>
      ) : (
        /* Caso 7: Formulario de Inscripción SSO */
        <>
          <div className="mt-4 rounded-2xl border border-theme bg-theme-subtle p-3">
            <div className="flex items-center gap-2.5">
              <img
                src={activeUser.avatarUrl || '/assets/citt-logo.webp'}
                alt={activeUser.fullName}
                className="h-8 w-8 rounded-full object-cover ring-1 ring-[#FFB800]"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-theme-primary">
                  {activeUser.fullName}
                </p>
                <p className="truncate text-xs text-theme-secondary">
                  {activeUser.email}
                </p>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-theme-secondary">
              Tu postulación se vinculará automáticamente a tu perfil institucional verificado.
            </p>
          </div>

          {submissionFeedback && (
            <div
              className={`mt-4 rounded-xl p-3 text-xs font-medium ${
                submissionFeedback.type === 'success'
                  ? 'border border-[#43B02A]/40 bg-[#43B02A]/10 text-theme-primary'
                  : 'border border-[#D50032]/40 bg-[#D50032]/10 text-theme-primary'
              }`}
            >
              {submissionFeedback.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {project.applicationMode === 'form' &&
              project.applicationQuestions &&
              project.applicationQuestions.length > 0 && (
                <div className="space-y-3">
                  {project.applicationQuestions.map((q, idx) => (
                    <div key={q.id}>
                      <label
                        htmlFor={`q-${q.id}`}
                        className="block text-xs font-bold text-theme-primary"
                      >
                        {idx + 1}. {q.question} {q.required && '*'}
                      </label>
                      <input
                        id={`q-${q.id}`}
                        type="text"
                        required={q.required}
                        value={formAnswers[q.question] || ''}
                        onChange={(e) =>
                          setFormAnswers({
                            ...formAnswers,
                            [q.question]: e.target.value,
                          })
                        }
                        placeholder={q.placeholder || 'Escribe tu respuesta...'}
                        className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}

            <div>
              <label
                htmlFor="app-note"
                className="block text-xs font-bold text-theme-primary"
              >
                Nota o motivación (Opcional)
              </label>
              <textarea
                id="app-note"
                rows={3}
                value={applicationNote}
                onChange={(e) => setApplicationNote(e.target.value)}
                placeholder="Cuéntale al equipo en qué horario estás disponible o cómo te gustaría aportar..."
                className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1A1A1A]/30 bg-[#FFB800] px-4 py-3 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633] focus-visible:outline-none"
            >
              <Send className="h-4 w-4" />
              <span>
                {project.applicationMode === 'form'
                  ? 'Enviar Formulario de Postulación'
                  : 'Postular Directamente al Equipo'}
              </span>
            </button>
          </form>
        </>
      )}
    </div>
  );
}
