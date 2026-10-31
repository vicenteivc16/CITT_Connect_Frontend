'use client';

import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Edit3, X } from 'lucide-react';
import { CittProject, ProjectMaturityStage } from '@/types/citt';

interface ProjectEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: CittProject;
  onSave: (updates: Partial<CittProject>) => void;
}

export function ProjectEditModal({
  open,
  onOpenChange,
  project,
  onSave,
}: ProjectEditModalProps) {
  const [editTitle, setEditTitle] = useState(project.title);
  const [editSummary, setEditSummary] = useState(project.summary);
  const [editMaturity, setEditMaturity] = useState<ProjectMaturityStage>(
    project.maturityStage || 'prototipado'
  );
  const [editVideoUrl, setEditVideoUrl] = useState(project.videoUrl || '');
  const [editReadme, setEditReadme] = useState(project.readmeContent || '');
  const [editSpecs, setEditSpecs] = useState(
    project.neededSpecialties?.join(', ') || ''
  );
  const [editLooking, setEditLooking] = useState(project.lookingForCollaborators);

  useEffect(() => {
    if (open) {
      setEditTitle(project.title);
      setEditSummary(project.summary);
      setEditMaturity(project.maturityStage || 'prototipado');
      setEditVideoUrl(project.videoUrl || '');
      setEditReadme(project.readmeContent || '');
      setEditSpecs(project.neededSpecialties?.join(', ') || '');
      setEditLooking(project.lookingForCollaborators);
    }
  }, [open, project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specsArray = editSpecs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      title: editTitle.trim(),
      summary: editSummary.trim(),
      maturityStage: editMaturity,
      videoUrl: editVideoUrl.trim() || undefined,
      readmeContent: editReadme.trim() || undefined,
      neededSpecialties: specsArray,
      lookingForCollaborators: editLooking,
    });

    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-2xl focus:outline-none">
          <div className="flex items-center justify-between border-b border-theme pb-4">
            <div className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-[#307FE2]" />
              <Dialog.Title className="text-lg font-bold text-theme-primary">
                Editar Iniciativa: {project.title}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-theme-subtle text-theme-primary hover:bg-[#FFB800] hover:text-[#1A1A1A]"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Título del Proyecto
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Resumen Ejecutivo
              </label>
              <textarea
                rows={3}
                required
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-theme-primary">
                  Madurez Tecnológica (TRL)
                </label>
                <select
                  value={editMaturity}
                  onChange={(e) =>
                    setEditMaturity(e.target.value as ProjectMaturityStage)
                  }
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                >
                  <option value="ideacion">Fase 1: Ideación (TRL 1-2)</option>
                  <option value="prototipado">Fase 2: Prototipado en Lab (TRL 3-4)</option>
                  <option value="pruebas_campo">Fase 3: Pruebas en Campo (TRL 5-6)</option>
                  <option value="transferencia">Fase 4: Transferencia (TRL 7-8)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-theme-primary">
                  URL de Video Pitch (YouTube / Vimeo)
                </label>
                <input
                  type="url"
                  value={editVideoUrl}
                  onChange={(e) => setEditVideoUrl(e.target.value)}
                  placeholder="https://youtu.be/..."
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Especialidades Requeridas (separadas por coma)
              </label>
              <input
                type="text"
                value={editSpecs}
                onChange={(e) => setEditSpecs(e.target.value)}
                placeholder="React, Microcontroladores, CAD 3D, Ciberseguridad"
                className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Documentación Extendida (README.md con soporte Mermaid)
              </label>
              <textarea
                rows={8}
                value={editReadme}
                onChange={(e) => setEditReadme(e.target.value)}
                placeholder="## Arquitectura del Sistema..."
                className="mt-1 w-full font-mono rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="edit-looking"
                type="checkbox"
                checked={editLooking}
                onChange={(e) => setEditLooking(e.target.checked)}
                className="h-4 w-4 rounded border-theme text-[#FFB800]"
              />
              <label htmlFor="edit-looking" className="text-xs font-bold text-theme-primary">
                Convocatoria Abierta (Buscando colaboradores activamente)
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-theme pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-xl border border-theme bg-theme-surface px-4 py-2 text-xs font-bold text-theme-secondary hover:text-theme-primary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#FFB800] px-5 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#ffc633]"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
