'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ExternalLink,
  HandHelping,
  MapPin,
  Plus,
  Users,
  X,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import { getCampusBySlug } from '@/data/citt-catalog';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';

export default function InterCampusProjectsPage() {
  const { projects, activeUser, addProject } = useCittNetwork();
  const [onlyLookingForHelp, setOnlyLookingForHelp] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [neededSpecsInput, setNeededSpecsInput] = useState('');
  const [helpDetails, setHelpDetails] = useState('');
  const [repoUrl, setRepoUrl] = useState('');

  const visibleProjects = onlyLookingForHelp
    ? projects.filter((p) => p.lookingForCollaborators)
    : projects;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const specs = neededSpecsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addProject({
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: title.trim(),
      summary: summary.trim(),
      status: 'en_desarrollo',
      leadUsername: activeUser.username,
      leadName: activeUser.fullName,
      leadRole: activeUser.role,
      originCampusSlug: activeUser.campusSlug,
      schoolSlug: activeUser.schoolSlug,
      lookingForCollaborators: true,
      neededSpecialties:
        specs.length > 0 ? specs : ['Colaboración Inter-Sedes'],
      helpRequestDetails:
        helpDetails.trim() ||
        'Abierto a colaborar con estudiantes y líderes de cualquier sede CITT de Chile.',
      repoUrl: repoUrl.trim() || undefined,
    });

    setTitle('');
    setSummary('');
    setNeededSpecsInput('');
    setHelpDetails('');
    setRepoUrl('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-6 border-b border-theme pb-8 sm:flex-row sm:items-end">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-balance text-3xl font-black tracking-tight text-theme-primary sm:text-4xl">
            Hub de Proyectos Inter-Sedes & Solicitudes de Ayuda
          </h1>
          <p className="text-sm leading-relaxed text-theme-secondary">
            Propón iniciativas tecnológicas, busca colaboradores de otras
            carreras o sedes CITT de Chile y suma tu especialidad a proyectos en
            desarrollo.
          </p>
        </div>

        <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-3 text-sm font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
            >
              <Plus className="h-4 w-4" />
              <span>Proponer Proyecto / Pedir Ayuda</span>
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-theme bg-theme-surface p-6 text-theme-primary shadow-2xl focus:outline-none">
              <div className="flex items-center justify-between border-b border-theme pb-3">
                <Dialog.Title className="text-base font-bold text-theme-primary">
                  Proponer Proyecto o Pedir Ayuda Inter-Sedes
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-lg p-1 text-theme-secondary hover:text-theme-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>

              <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Título del Proyecto o Iniciativa *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Sistema IoT de Riego Inteligente Multi-Sede"
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Resumen del Proyecto *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Describe qué problema resuelve y en qué etapa se encuentra..."
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Especialidades que buscas en otras Sedes / Carreras (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={neededSpecsInput}
                    onChange={(e) => setNeededSpecsInput(e.target.value)}
                    placeholder="Ej. Diseño UX/UI, Impresión 3D, Ciberseguridad, Python"
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Detalle de la ayuda o perfiles requeridos
                  </label>
                  <textarea
                    rows={2}
                    value={helpDetails}
                    onChange={(e) => setHelpDetails(e.target.value)}
                    placeholder="Ej. Buscamos 1 compañero de Diseño y 1 de Ingeniería de cualquier sede para completar el prototipo..."
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="rounded-xl border border-theme px-4 py-2 text-xs font-semibold text-theme-primary"
                    >
                      Cancelar
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-bold text-[#1A1A1A]"
                  >
                    Publicar en Red Nacional CITT
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyLookingForHelp(false)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              !onlyLookingForHelp
                ? 'bg-[#FFB800] text-[#1A1A1A]'
                : 'border border-theme bg-theme-subtle text-theme-primary'
            }`}
          >
            Todos los Proyectos ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setOnlyLookingForHelp(true)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              onlyLookingForHelp
                ? 'bg-[#FFB800] text-[#1A1A1A]'
                : 'border border-theme bg-theme-subtle text-theme-primary'
            }`}
          >
            <HandHelping className="h-3.5 w-3.5" />
            <span>Buscando Colaboradores Inter-Sedes</span>
          </button>
        </div>

        <span className="text-xs text-theme-secondary">
          Publicando como{' '}
          <strong className="text-theme-primary">{activeUser.fullName}</strong>
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {visibleProjects.map((project) => {
          const campus = getCampusBySlug(project.originCampusSlug);

          return (
            <article
              key={project.id}
              className="flex flex-col justify-between rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <SchoolBadge schoolSlug={project.schoolSlug} />
                    <span className="inline-flex items-center gap-1 rounded-full border border-theme bg-theme-subtle px-2.5 py-0.5 text-xs text-theme-primary">
                      <MapPin className="h-3 w-3 text-[#307FE2]" />
                      {campus.shortName}
                    </span>
                  </div>

                  <span className="rounded-full bg-[#307FE2] px-2.5 py-0.5 text-xs font-bold text-white uppercase">
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-black text-theme-primary">
                  {project.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-theme-secondary">
                  {project.summary}
                </p>

                {project.lookingForCollaborators && (
                  <div className="mt-4 border-t border-theme pt-4">
                    <p className="inline-flex items-center gap-1.5 text-xs font-bold text-theme-primary">
                      <HandHelping className="h-4 w-4 text-[#FFB800]" />
                      <span>Se buscan colaboradores / Especialidades:</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {project.neededSpecialties.map((spec) => (
                        <span
                          key={spec}
                          className="rounded-lg bg-theme-elevated px-2.5 py-1 text-xs font-semibold text-theme-primary"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2.5 text-xs leading-relaxed text-theme-secondary">
                      {project.helpRequestDetails}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-theme pt-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#307FE2]" />
                  <span className="text-xs text-theme-secondary">Lidera:</span>
                  <Link
                    href={`/u/${project.leadUsername}`}
                    className="text-xs font-bold text-theme-primary hover:underline"
                  >
                    {project.leadName}
                  </Link>
                  <RoleBadge role={project.leadRole} showTooltip={false} />
                </div>

                <Link
                  href={`/u/${project.leadUsername}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-3.5 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                >
                  <span>Contactar / Ver Credencial</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
