'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ClipboardList, X } from 'lucide-react';
import { getCampusBySlug } from '@/data/citt-catalog';
import { RoleBadge } from '@/components/RoleBadge';
import { ProjectApplication } from '@/types/citt';

interface ProjectReviewTrayProps {
  applications: ProjectApplication[];
  onApprove: (applicationId: string, assignedRole: string) => void;
  onReject: (applicationId: string) => void;
}

export function ProjectReviewTray({
  applications,
  onApprove,
  onReject,
}: ProjectReviewTrayProps) {
  const [approvingAppId, setApprovingAppId] = useState<string | null>(null);
  const [assignRoleInput, setAssignRoleInput] = useState('');

  const handleApproveConfirm = (appId: string) => {
    const role = assignRoleInput.trim() || 'Colaborador de Proyecto';
    onApprove(appId, role);
    setApprovingAppId(null);
    setAssignRoleInput('');
  };

  const handleRejectConfirm = (appId: string) => {
    if (confirm('¿Deseas desestimar esta postulación?')) {
      onReject(appId);
    }
  };

  return (
    <div className="rounded-3xl border border-[#307FE2]/30 bg-theme-surface p-6 shadow-theme-card space-y-4">
      <div className="flex items-center justify-between border-b border-theme pb-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#307FE2]" />
          <div>
            <h3 className="text-sm font-bold text-theme-primary">
              Bandeja de Postulaciones al Equipo
            </h3>
            <p className="text-xs text-theme-secondary">
              Solo visible para el líder del proyecto
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#307FE2]/10 px-3 py-1 text-xs font-bold text-[#307FE2]">
          {applications.length} registradas
        </span>
      </div>

      {applications.length === 0 ? (
        <p className="text-xs text-theme-secondary italic py-2">
          Aún no hay postulaciones recibidas para este proyecto.
        </p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-theme bg-theme-subtle p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Link
                    href={`/u/${app.applicantUsername}`}
                    className="font-bold text-sm text-theme-primary hover:underline"
                  >
                    {app.applicantName}
                  </Link>
                  <RoleBadge role={app.applicantRole} showTooltip={false} size="sm" />
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      app.status === 'accepted'
                        ? 'bg-[#43B02A]/15 text-[#43B02A]'
                        : app.status === 'rejected'
                        ? 'bg-red-500/15 text-red-500'
                        : 'bg-[#FFB800]/15 text-[#FFB800]'
                    }`}
                  >
                    {app.status === 'accepted'
                      ? 'Aceptado en el Equipo'
                      : app.status === 'rejected'
                      ? 'Desestimado'
                      : 'Pendiente de Revisión'}
                  </span>
                </div>
                <span className="text-xs text-theme-secondary">
                  {app.appliedAt}
                </span>
              </div>

              <p className="mt-1 text-xs text-theme-secondary">
                Correo: {app.applicantEmail} · Sede:{' '}
                {getCampusBySlug(app.applicantCampusSlug).name}
              </p>

              {/* Respuestas del Formulario */}
              {app.answers && Object.keys(app.answers).length > 0 && (
                <div className="mt-3 space-y-1.5 rounded-xl border border-theme bg-theme-surface p-3 text-xs">
                  {Object.entries(app.answers).map(([key, val]) => (
                    <div key={key}>
                      <span className="font-bold text-theme-primary">{key}: </span>
                      <span className="text-theme-secondary">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {app.note && (
                <p className="mt-2 rounded-xl bg-theme-surface p-2.5 text-xs italic text-theme-primary">
                  &ldquo;{app.note}&rdquo;
                </p>
              )}

              {/* Acciones de Aprobación / Rechazo */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-theme pt-3">
                <Link
                  href={`/u/${app.applicantUsername}`}
                  className="rounded-lg border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary hover:border-[#FFB800]"
                >
                  Ver Credencial Completa
                </Link>

                {app.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    {approvingAppId === app.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={assignRoleInput}
                          onChange={(e) => setAssignRoleInput(e.target.value)}
                          placeholder="Rol (ej. Desarrollador C++)"
                          className="rounded-xl border border-theme bg-theme-surface px-2.5 py-1 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleApproveConfirm(app.id)}
                          className="rounded-xl bg-[#43B02A] px-3 py-1 text-xs font-bold text-white hover:bg-[#389623]"
                        >
                          Confirmar Admisión
                        </button>
                        <button
                          type="button"
                          onClick={() => setApprovingAppId(null)}
                          className="text-xs text-theme-secondary hover:text-theme-primary"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setApprovingAppId(app.id);
                            setAssignRoleInput('Colaborador de Proyecto');
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-[#43B02A] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#389623]"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Aceptar en el Equipo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRejectConfirm(app.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-secondary transition hover:text-red-500"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Declinar</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
