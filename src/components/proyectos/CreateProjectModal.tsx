'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, ClipboardList, Plus, Sparkles, X } from 'lucide-react';
import { CITT_CAMPUSES, DUOC_SCHOOLS } from '@/data/citt-catalog';
import {
  CittMemberProfile,
  CittProject,
  DuocSchoolSlug,
  ProjectApplicationMode,
  ProjectMaturityStage,
  ProjectQuestion,
} from '@/types/citt';

const DEFAULT_README_TEMPLATE = `# [Nombre del Proyecto] 🚀

> **Iniciativa Inter-Sedes CITT Duoc UC**

## 💡 Descripción & Propósito
Breve explicación de la problemática que resuelve este proyecto y qué tecnologías clave utiliza.

---

## 🛠️ Stack Tecnológico
* **Lenguajes:** TypeScript / Python / C++
* **Frameworks & Librerías:** Next.js / ROS 2 / PyTorch
* **Hardware:** ESP32 / Arduino / Sensores IoT

---

## 👥 Colaboradores Buscados
Buscamos compañeros de diferentes sedes y escuelas de Duoc UC para apoyarnos en:
1. Diseño de Interfaz & Prototipado UX
2. Desarrollo de Firmware / Backend
3. Pruebas de campo y validación con usuarios
`;

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeUser: CittMemberProfile;
  isAuthenticated: boolean;
  onProjectCreated: (project: Omit<CittProject, 'id' | 'createdAt'>) => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
  activeUser,
  isAuthenticated,
  onProjectCreated,
}: CreateProjectModalProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [schoolSlug, setSchoolSlug] = useState<DuocSchoolSlug>('informatica');
  const [campusSlug, setCampusSlug] = useState(
    activeUser.campusSlug || 'san-joaquin'
  );
  const [maturityStage, setMaturityStage] =
    useState<ProjectMaturityStage>('ideacion');
  const [status, setStatus] = useState<CittProject['status']>('idea');
  const [specialties, setSpecialties] = useState('');
  const [helpDetails, setHelpDetails] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [readmeContent, setReadmeContent] = useState(DEFAULT_README_TEMPLATE);

  // Modalidad de postulación & preguntas
  const [applicationMode, setApplicationMode] =
    useState<ProjectApplicationMode>('direct');
  const [question1, setQuestion1] = useState(
    '¿Qué rol o tecnología te gustaría aportar en este proyecto?'
  );
  const [question2, setQuestion2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const specsArray = specialties
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const questions: ProjectQuestion[] = [];
    if (applicationMode === 'form') {
      if (question1.trim()) {
        questions.push({
          id: 'q-1',
          question: question1.trim(),
          required: true,
          placeholder: 'Escribe tu respuesta...',
        });
      }
      if (question2.trim()) {
        questions.push({
          id: 'q-2',
          question: question2.trim(),
          required: false,
          placeholder: 'Escribe tu respuesta...',
        });
      }
    }

    onProjectCreated({
      title: title.trim(),
      slug: title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      summary: summary.trim(),
      leadName: activeUser.fullName,
      leadUsername: activeUser.username,
      leadRole: activeUser.role,
      originCampusSlug: campusSlug,
      schoolSlug,
      status,
      maturityStage,
      neededSpecialties: specsArray,
      lookingForCollaborators: specsArray.length > 0,
      helpRequestDetails: helpDetails.trim(),
      videoUrl: videoUrl.trim() || undefined,
      repoUrl: repoUrl.trim() || undefined,
      coverImageUrl: coverImageUrl.trim() || undefined,
      galleryImages: coverImageUrl.trim() ? [coverImageUrl.trim()] : undefined,
      readmeContent: readmeContent.trim() || undefined,
      applicationMode,
      applicationQuestions: questions.length > 0 ? questions : undefined,
      collaborators: [
        {
          id: `collab-${activeUser.id}`,
          username: activeUser.username,
          fullName: activeUser.fullName,
          role: activeUser.role,
          roleInProject: 'Líder / Creador',
          campusSlug: activeUser.campusSlug,
          schoolSlug: activeUser.schoolSlug || schoolSlug,
          avatarUrl: activeUser.avatarUrl,
        },
      ],
      applications: [],
    });

    // Reset Form
    setTitle('');
    setSummary('');
    setSpecialties('');
    setHelpDetails('');
    setVideoUrl('');
    setRepoUrl('');
    setCoverImageUrl('');
    setReadmeContent(DEFAULT_README_TEMPLATE);
    setApplicationMode('direct');
    setQuestion2('');
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 shadow-2xl focus:outline-none sm:p-8">
          <div className="flex items-center justify-between border-b border-theme pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFB800] text-[#1A1A1A]">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-theme-primary sm:text-lg">
                  Publicar Nuevo Proyecto CITT
                </Dialog.Title>
                <Dialog.Description className="text-xs text-theme-secondary">
                  Convoca a compañeros de cualquier sede y escuela de Duoc UC
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-xl border border-theme p-1.5 text-theme-secondary hover:text-theme-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {!isAuthenticated && (
              <div className="rounded-xl border border-[#FFB800]/40 bg-[#FFB800]/10 p-3 text-xs text-[#FFB800]">
                💡 Publicarás con el usuario activo{' '}
                <strong>{activeUser.fullName}</strong>. Para vincular con tu credencial personal,{' '}
                <Link href="/acceso" className="font-bold underline">
                  inicia sesión aquí
                </Link>.
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Título del Proyecto *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Rover Autónomo para Detección de Focos Forestales"
                className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Resumen Ejecutivo (2-3 líneas) *
              </label>
              <textarea
                required
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Describe la problemática, qué resuelve y el impacto de esta iniciativa..."
                className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-theme-primary">
                  Escuela Patrocinante *
                </label>
                <select
                  value={schoolSlug}
                  onChange={(e) => setSchoolSlug(e.target.value as DuocSchoolSlug)}
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                >
                  {DUOC_SCHOOLS.map((school) => (
                    <option key={school.slug} value={school.slug}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-theme-primary">
                  Sede de Origen *
                </label>
                <select
                  value={campusSlug}
                  onChange={(e) => setCampusSlug(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                >
                  {CITT_CAMPUSES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-theme-primary">
                  Nivel de Madurez (TRL) *
                </label>
                <select
                  value={maturityStage}
                  onChange={(e) =>
                    setMaturityStage(e.target.value as ProjectMaturityStage)
                  }
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                >
                  <option value="ideacion">TRL 1-2 · Ideación & Concepto</option>
                  <option value="prototipado">TRL 3-4 · Prototipo Laboratorio</option>
                  <option value="pruebas_campo">TRL 5-6 · Validación Terreno</option>
                  <option value="transferencia">TRL 7-8 · Transferencia Tecnológica</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-theme-primary">
                  Estado Operativo *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CittProject['status'])}
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                >
                  <option value="idea">Fase Idea</option>
                  <option value="en_desarrollo">En Desarrollo</option>
                  <option value="prototipo">Prototipo Funcional</option>
                  <option value="finalizado">Completado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Perfiles / Especialidades Buscadas (Separar por comas)
              </label>
              <input
                type="text"
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                placeholder="Ej. Frontend Next.js, Firmware ESP32, Diseño 3D en Fusion360"
                className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Detalle de la Ayuda Solicitada
              </label>
              <textarea
                rows={2}
                value={helpDetails}
                onChange={(e) => setHelpDetails(e.target.value)}
                placeholder="Cuéntale a los postulantes qué retos van a enfrentar y qué horas semanales estimas..."
                className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            {/* Modalidad de Postulación */}
            <div className="rounded-2xl border border-theme bg-theme-subtle p-4">
              <p className="text-xs font-bold text-theme-primary">
                Modalidad de Postulación para Compañeros
              </p>
              <p className="text-[11px] text-theme-secondary mt-0.5">
                Siempre se registrará la cuenta institucional autenticada de CITT Connect.
              </p>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setApplicationMode('direct')}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition ${
                    applicationMode === 'direct'
                      ? 'border-[#FFB800] bg-theme-surface font-bold text-theme-primary shadow-sm'
                      : 'border-theme bg-transparent text-theme-secondary'
                  }`}
                >
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#FFB800]" />
                  <div>
                    <p className="font-bold">Postulación Directa (1 Clic)</p>
                    <p className="text-[10px] text-theme-secondary">
                      Rápida vinculación con su perfil CITT
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setApplicationMode('form')}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition ${
                    applicationMode === 'form'
                      ? 'border-[#307FE2] bg-theme-surface font-bold text-theme-primary shadow-sm'
                      : 'border-theme bg-transparent text-theme-secondary'
                  }`}
                >
                  <ClipboardList className="h-4 w-4 shrink-0 text-[#307FE2]" />
                  <div>
                    <p className="font-bold">Formulario con Preguntas</p>
                    <p className="text-[10px] text-theme-secondary">
                      Filtro a medida antes de aceptar
                    </p>
                  </div>
                </button>
              </div>

              {applicationMode === 'form' && (
                <div className="mt-3 space-y-2 border-t border-theme pt-3">
                  <p className="text-xs font-bold text-theme-primary">
                    Preguntas para los postulantes:
                  </p>
                  <div>
                    <label className="text-[11px] text-theme-secondary">
                      Pregunta 1 (Obligatoria):
                    </label>
                    <input
                      type="text"
                      value={question1}
                      onChange={(e) => setQuestion1(e.target.value)}
                      className="mt-0.5 w-full rounded-lg border border-theme bg-theme-surface px-2.5 py-1.5 text-xs text-theme-primary focus:border-[#307FE2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-theme-secondary">
                      Pregunta 2 (Opcional):
                    </label>
                    <input
                      type="text"
                      value={question2}
                      onChange={(e) => setQuestion2(e.target.value)}
                      className="mt-0.5 w-full rounded-lg border border-theme bg-theme-surface px-2.5 py-1.5 text-xs text-theme-primary focus:border-[#307FE2] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-xl border border-theme px-4 py-2 text-xs font-semibold text-theme-primary hover:bg-theme-subtle"
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
              >
                Publicar en Red Nacional CITT
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
