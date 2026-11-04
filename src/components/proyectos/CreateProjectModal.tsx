'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileCode,
  FileText,
  Image as ImageIcon,
  Lock,
  Play,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react';
import { CITT_CAMPUSES, DUOC_SCHOOLS, getCampusBySlug } from '@/data/citt-catalog';
import { getEmbedVideoUrl } from '@/lib/video';
import {
  CittMemberProfile,
  CittProject,
  DuocSchoolSlug,
  ProjectApplicationMode,
  ProjectMaturityStage,
  ProjectQuestion,
} from '@/types/citt';

const STORAGE_DRAFT_KEY = 'citt_create_project_draft_v2';

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

// Opciones unificadas de Madurez TRL & Estado Operativo
type TrlUnifiedLevel = 'trl_1_2' | 'trl_3_4' | 'trl_5_6' | 'trl_7_8';

interface TrlConfig {
  label: string;
  shortLabel: string;
  maturityStage: ProjectMaturityStage;
  status: CittProject['status'];
  colorHex: string;
  badgeBg: string;
  badgeBorder: string;
  legend: string;
}

const TRL_UNIFIED_MAP: Record<TrlUnifiedLevel, TrlConfig> = {
  trl_1_2: {
    label: 'TRL 1-2 · Ideación & Concepto',
    shortLabel: 'Fase Idea (TRL 1-2)',
    maturityStage: 'ideacion',
    status: 'idea',
    colorHex: '#00A499',
    badgeBg: 'bg-emerald-500/10 text-emerald-500',
    badgeBorder: 'border-emerald-500/30',
    legend:
      'TRL 1-2: Formulación de hipótesis, requerimientos técnicos iniciales y conceptualización de la arquitectura de la solución.',
  },
  trl_3_4: {
    label: 'TRL 3-4 · Prototipo en Laboratorio',
    shortLabel: 'Prototipo Funcional (TRL 3-4)',
    maturityStage: 'prototipado',
    status: 'prototipo',
    colorHex: '#FFB800',
    badgeBg: 'bg-amber-500/10 text-amber-500',
    badgeBorder: 'border-amber-500/30',
    legend:
      'TRL 3-4: Prueba de concepto analítica y experimental validada en mesas de trabajo y laboratorios CITT (MVP funcional).',
  },
  trl_5_6: {
    label: 'TRL 5-6 · Validación en Terreno',
    shortLabel: 'En Desarrollo / Terreno (TRL 5-6)',
    maturityStage: 'pruebas_campo',
    status: 'en_desarrollo',
    colorHex: '#307FE2',
    badgeBg: 'bg-blue-500/10 text-blue-500',
    badgeBorder: 'border-blue-500/30',
    legend:
      'TRL 5-6: Tecnología testeada con usuarios finales en contexto real o simulación operacional cercana al entorno productivo.',
  },
  trl_7_8: {
    label: 'TRL 7-8 · Transferencia Tecnológica & Escala',
    shortLabel: 'Completado / Transferencia (TRL 7-8)',
    maturityStage: 'transferencia',
    status: 'finalizado',
    colorHex: '#107C41',
    badgeBg: 'bg-emerald-600/10 text-emerald-600',
    badgeBorder: 'border-emerald-600/30',
    legend:
      'TRL 7-8: Sistema integrado y demostrado en entorno real, preparado para adopción, licenciamiento o spin-off con partners.',
  },
};

const SUGGESTED_SPECIALTIES = [
  'Frontend Next.js',
  'Firmware ESP32',
  'Modelado 3D',
  'Diseño UI/UX',
  'Machine Learning',
  'Backend FastAPI',
  'IoT & Sensores',
];

interface QuestionItem {
  id: string;
  question: string;
  required: boolean;
}

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
  // Wizard Step (1: Identidad & Núcleo, 2: Convocatoria & Postulación, 3: Multimedia & Docs)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Fase 1: Identidad
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [schoolSlug, setSchoolSlug] = useState<DuocSchoolSlug>(
    activeUser.schoolSlug || 'informatica'
  );
  const [campusSlug, setCampusSlug] = useState(
    activeUser.campusSlug || 'san-joaquin'
  );
  const [trlLevel, setTrlLevel] = useState<TrlUnifiedLevel>('trl_3_4');
  const [specialtiesList, setSpecialtiesList] = useState<string[]>([]);
  const [specInput, setSpecInput] = useState('');
  const [helpDetails, setHelpDetails] = useState('');

  // Fase 2: Convocatoria
  const [applicationMode, setApplicationMode] =
    useState<ProjectApplicationMode>('direct');
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: 'q-1',
      question: '¿Qué rol o tecnología te gustaría aportar en este proyecto?',
      required: true,
    },
  ]);

  // Fase 3: Multimedia & Docs
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [readmeContent, setReadmeContent] = useState(DEFAULT_README_TEMPLATE);

  // Alerta de confirmación de salida
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  // File input refs
  const fileBannerRef = useRef<HTMLInputElement>(null);
  const fileMdRef = useRef<HTMLInputElement>(null);

  const isCoreDev = activeUser.role === 'dev';
  const assignedCampus = getCampusBySlug(activeUser.campusSlug || 'san-joaquin');

  // Cargar borrador persistido al abrir
  useEffect(() => {
    if (open) {
      // Si no es Core Dev, la sede siempre debe ser la del usuario activo
      if (!isCoreDev) {
        setCampusSlug(activeUser.campusSlug || 'san-joaquin');
      }

      try {
        const raw = localStorage.getItem(STORAGE_DRAFT_KEY);
        if (raw) {
          const draft = JSON.parse(raw);
          if (draft.title || draft.summary) {
            setTitle(draft.title || '');
            setSummary(draft.summary || '');
            if (draft.schoolSlug) setSchoolSlug(draft.schoolSlug);
            if (isCoreDev && draft.campusSlug) setCampusSlug(draft.campusSlug);
            if (draft.trlLevel) setTrlLevel(draft.trlLevel);
            if (Array.isArray(draft.specialtiesList))
              setSpecialtiesList(draft.specialtiesList);
            if (draft.helpDetails) setHelpDetails(draft.helpDetails);
            if (draft.applicationMode) setApplicationMode(draft.applicationMode);
            if (Array.isArray(draft.questions) && draft.questions.length > 0)
              setQuestions(draft.questions);
            if (draft.coverImageUrl) setCoverImageUrl(draft.coverImageUrl);
            if (draft.videoUrl) setVideoUrl(draft.videoUrl);
            if (draft.repoUrl) setRepoUrl(draft.repoUrl);
            if (draft.readmeContent) setReadmeContent(draft.readmeContent);
            setHasRestoredDraft(true);
          }
        }
      } catch {
        // ignore draft load error
      }
    }
  }, [open, isCoreDev, activeUser.campusSlug]);

  // Detectar si hay cambios no guardados
  const hasDirtyChanges = Boolean(
    title.trim() ||
      summary.trim() ||
      specialtiesList.length > 0 ||
      helpDetails.trim() ||
      videoUrl.trim() ||
      coverImageUrl.trim() ||
      repoUrl.trim() ||
      readmeContent !== DEFAULT_README_TEMPLATE
  );

  const handleSaveDraft = () => {
    try {
      const draftData = {
        title,
        summary,
        schoolSlug,
        campusSlug,
        trlLevel,
        specialtiesList,
        helpDetails,
        applicationMode,
        questions,
        coverImageUrl,
        videoUrl,
        repoUrl,
        readmeContent,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(draftData));
    } catch {
      // ignore
    }
    setShowExitConfirm(false);
    onOpenChange(false);
  };

  const handleDiscardChanges = () => {
    try {
      localStorage.removeItem(STORAGE_DRAFT_KEY);
    } catch {
      // ignore
    }
    resetForm();
    setShowExitConfirm(false);
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle('');
    setSummary('');
    setSchoolSlug(activeUser.schoolSlug || 'informatica');
    setCampusSlug(activeUser.campusSlug || 'san-joaquin');
    setTrlLevel('trl_3_4');
    setSpecialtiesList([]);
    setSpecInput('');
    setHelpDetails('');
    setApplicationMode('direct');
    setQuestions([
      {
        id: 'q-1',
        question: '¿Qué rol o tecnología te gustaría aportar en este proyecto?',
        required: true,
      },
    ]);
    setCoverImageUrl('');
    setVideoUrl('');
    setRepoUrl('');
    setReadmeContent(DEFAULT_README_TEMPLATE);
    setStep(1);
    setHasRestoredDraft(false);
  };

  const handleRequestClose = () => {
    if (hasDirtyChanges) {
      setShowExitConfirm(true);
    } else {
      onOpenChange(false);
    }
  };

  // Manejo de chips de especialidades
  const handleAddSpecialty = (itemToAdd?: string) => {
    const val = (itemToAdd || specInput).trim();
    if (!val) return;
    if (!specialtiesList.includes(val)) {
      setSpecialtiesList((prev) => [...prev, val]);
    }
    setSpecInput('');
  };

  const handleRemoveSpecialty = (itemToRemove: string) => {
    setSpecialtiesList((prev) => prev.filter((s) => s !== itemToRemove));
  };

  // Manejo de preguntas en Fase 2
  const handleAddQuestion = () => {
    if (questions.length >= 10) return;
    setQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        question: '',
        required: false,
      },
    ]);
  };

  const handleUpdateQuestion = (
    index: number,
    field: 'question' | 'required',
    value: string | boolean
  ) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // Subida de imagen de Banner
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (.png, .jpg, .webp).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        setCoverImageUrl(res);
      }
    };
    reader.readAsDataURL(file);
  };

  // Subida de archivo Markdown (.md)
  const handleMdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.md') && file.type !== 'text/markdown') {
      alert('Por favor selecciona un archivo con extensión .md (Markdown).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (typeof text === 'string') {
        setReadmeContent(text);
      }
    };
    reader.readAsText(file);
  };

  // Envío final del proyecto
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      setStep(1);
      return;
    }

    const trlCfg = TRL_UNIFIED_MAP[trlLevel];

    const finalQuestions: ProjectQuestion[] = [];
    if (applicationMode === 'form') {
      questions.forEach((q, idx) => {
        if (q.question.trim()) {
          finalQuestions.push({
            id: `q-${idx + 1}`,
            question: q.question.trim(),
            required: q.required,
            placeholder: 'Escribe tu respuesta...',
          });
        }
      });
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
      originCampusSlug: isCoreDev ? campusSlug : (activeUser.campusSlug || 'san-joaquin'),
      schoolSlug,
      status: trlCfg.status,
      maturityStage: trlCfg.maturityStage,
      neededSpecialties: specialtiesList,
      lookingForCollaborators: specialtiesList.length > 0,
      helpRequestDetails: helpDetails.trim(),
      videoUrl: videoUrl.trim() || undefined,
      repoUrl: repoUrl.trim() || undefined,
      coverImageUrl: coverImageUrl.trim() || undefined,
      galleryImages: coverImageUrl.trim() ? [coverImageUrl.trim()] : undefined,
      readmeContent: readmeContent.trim() || undefined,
      applicationMode,
      applicationQuestions: finalQuestions.length > 0 ? finalQuestions : undefined,
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

    // Limpiar borrador en localStorage al publicar exitosamente
    try {
      localStorage.removeItem(STORAGE_DRAFT_KEY);
    } catch {
      // ignore
    }

    resetForm();
    onOpenChange(false);
  };

  const videoData = getEmbedVideoUrl(videoUrl);
  const currentTrlCfg = TRL_UNIFIED_MAP[trlLevel];

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(val) => !val && handleRequestClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
          <Dialog.Content className="relative fixed top-1/2 left-1/2 z-50 max-h-[92vh] w-[94vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 shadow-2xl focus:outline-none sm:p-8">
            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-theme pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFB800] text-[#1A1A1A] shadow-md">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <Dialog.Title className="text-base font-extrabold text-theme-primary sm:text-lg">
                    Publicar Nuevo Proyecto CITT
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-theme-secondary">
                    Convocatoria multidisciplinaria e inter-sedes Duoc UC
                  </Dialog.Description>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestClose}
                className="rounded-xl border border-theme p-1.5 text-theme-secondary hover:bg-theme-subtle hover:text-theme-primary"
                title="Cerrar modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Banner de Borrador Restaurado */}
            {hasRestoredDraft && (
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#307FE2]/40 bg-[#307FE2]/10 px-3.5 py-2 text-xs text-[#307FE2]">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5 shrink-0" />
                  <span>Se restauró un borrador guardado en este equipo.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleDiscardChanges();
                    setHasRestoredDraft(false);
                  }}
                  className="font-bold underline hover:text-white"
                >
                  Descartar borrador
                </button>
              </div>
            )}

            {/* Stepper Wizard (Fase 1, 2, 3) */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex flex-col items-start rounded-2xl border p-3 text-left transition ${
                  step === 1
                    ? 'border-[#FFB800] bg-[#FFB800]/10 font-bold text-theme-primary'
                    : 'border-theme bg-theme-subtle text-theme-secondary hover:text-theme-primary'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FFB800]">
                  Fase 1
                </span>
                <span className="text-xs font-bold leading-tight">Identidad & Núcleo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!title.trim() || !summary.trim()) {
                    alert('Por favor completa el Título y Resumen antes de avanzar.');
                    return;
                  }
                  setStep(2);
                }}
                className={`flex flex-col items-start rounded-2xl border p-3 text-left transition ${
                  step === 2
                    ? 'border-[#307FE2] bg-[#307FE2]/10 font-bold text-theme-primary'
                    : 'border-theme bg-theme-subtle text-theme-secondary hover:text-theme-primary'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-[#307FE2]">
                  Fase 2
                </span>
                <span className="text-xs font-bold leading-tight">Postulación</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!title.trim() || !summary.trim()) {
                    alert('Por favor completa el Título y Resumen antes de avanzar.');
                    return;
                  }
                  setStep(3);
                }}
                className={`flex flex-col items-start rounded-2xl border p-3 text-left transition ${
                  step === 3
                    ? 'border-[#43B02A] bg-[#43B02A]/10 font-bold text-theme-primary'
                    : 'border-theme bg-theme-subtle text-theme-secondary hover:text-theme-primary'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-[#43B02A]">
                  Fase 3
                </span>
                <span className="text-xs font-bold leading-tight">Multimedia & Docs</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {/* ========================================================= */}
              {/* FASE 1: IDENTIDAD & NÚCLEO */}
              {/* ========================================================= */}
              {step === 1 && (
                <div className="space-y-4">
                  {!isAuthenticated && (
                    <div className="rounded-2xl border border-[#FFB800]/40 bg-[#FFB800]/10 p-3 text-xs text-[#FFB800]">
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
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
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
                      placeholder="Describe la problemática, qué resuelve y el impacto de esta iniciativa tecnológica..."
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

                    {/* Sede de Origen RBAC */}
                    <div>
                      <label className="flex items-center justify-between text-xs font-bold text-theme-primary">
                        <span>Sede de Origen *</span>
                        {isCoreDev ? (
                          <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-black text-purple-400">
                            Core Dev: Multi-Sede
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-theme-secondary">
                            <Lock className="h-3 w-3 text-[#FFB800]" />
                            Fijada institucional
                          </span>
                        )}
                      </label>

                      {isCoreDev ? (
                        <select
                          value={campusSlug}
                          onChange={(e) => setCampusSlug(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-purple-500/40 bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-purple-400 focus:outline-none"
                        >
                          {CITT_CAMPUSES.map((c) => (
                            <option key={c.slug} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="mt-1 flex items-center justify-between rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs text-theme-primary">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-[#FFB800]" />
                            <span className="font-bold">{assignedCampus.name}</span>
                          </div>
                          <span className="text-[10px] text-theme-secondary">
                            Sede asignada a tu perfil
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Unificación de Madurez TRL & Estado Operativo */}
                  <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5">
                    <label className="block text-xs font-bold text-theme-primary">
                      Nivel de Madurez Tecnológica (Escala TRL Duoc UC) *
                    </label>
                    <select
                      value={trlLevel}
                      onChange={(e) => setTrlLevel(e.target.value as TrlUnifiedLevel)}
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-surface px-3 py-2 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    >
                      <option value="trl_1_2">
                        TRL 1-2 · Ideación & Concepto (Fase Idea)
                      </option>
                      <option value="trl_3_4">
                        TRL 3-4 · Prototipo en Laboratorio (MVP Funcional)
                      </option>
                      <option value="trl_5_6">
                        TRL 5-6 · Validación en Terreno (En Desarrollo Operativo)
                      </option>
                      <option value="trl_7_8">
                        TRL 7-8 · Transferencia Tecnológica & Escala (Completado)
                      </option>
                    </select>

                    {/* Leyenda Explicativa Dinámica */}
                    <div
                      className={`mt-2.5 rounded-xl border p-2.5 text-xs transition ${currentTrlCfg.badgeBg} ${currentTrlCfg.badgeBorder}`}
                    >
                      <p className="font-bold">{currentTrlCfg.label}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">
                        {currentTrlCfg.legend}
                      </p>
                    </div>
                  </div>

                  {/* Especialidades Buscadas con Input + Botón '+' + Chips */}
                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Perfiles / Especialidades Buscadas
                    </label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="text"
                        value={specInput}
                        onChange={(e) => setSpecInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSpecialty();
                          }
                        }}
                        placeholder="Ej. Frontend Next.js, Firmware ESP32, Modelado 3D..."
                        className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSpecialty()}
                        className="flex items-center gap-1 rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Agregar</span>
                      </button>
                    </div>

                    {/* Chips interactivos agregados */}
                    {specialtiesList.length > 0 ? (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {specialtiesList.map((spec) => (
                          <span
                            key={spec}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#FFB800]/40 bg-[#FFB800]/15 px-3 py-1 text-xs font-bold text-[#FFB800]"
                          >
                            <span>+ {spec}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecialty(spec)}
                              className="rounded-full p-0.5 hover:bg-[#FFB800]/30 hover:text-white"
                              title="Eliminar perfil"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 text-[11px] text-theme-secondary">
                        <span>Sugerencias rápidas: </span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {SUGGESTED_SPECIALTIES.map((sug) => (
                            <button
                              key={sug}
                              type="button"
                              onClick={() => handleAddSpecialty(sug)}
                              className="rounded-lg border border-theme bg-theme-subtle px-2 py-0.5 text-[10px] font-medium text-theme-secondary hover:border-[#FFB800] hover:text-[#FFB800]"
                            >
                              + {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Detalle del Desafío y Modalidad de Trabajo
                    </label>
                    <textarea
                      rows={2}
                      value={helpDetails}
                      onChange={(e) => setHelpDetails(e.target.value)}
                      placeholder="Cuéntale a los postulantes qué retos van a enfrentar y qué horas semanales estimas..."
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* FASE 2: CONVOCATORIA & POSTULACIÓN (HASTA 10 PREGUNTAS) */}
              {/* ========================================================= */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-theme bg-theme-subtle p-4">
                    <p className="text-xs font-bold text-theme-primary">
                      Modalidad de Postulación para Compañeros
                    </p>
                    <p className="mt-0.5 text-[11px] text-theme-secondary">
                      Selecciona cómo se vincularán los alumnos interesados en tu proyecto.
                    </p>

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setApplicationMode('direct')}
                        className={`flex items-center gap-2.5 rounded-xl border p-3 text-left text-xs transition ${
                          applicationMode === 'direct'
                            ? 'border-[#FFB800] bg-theme-surface font-bold text-theme-primary shadow-sm'
                            : 'border-theme bg-transparent text-theme-secondary'
                        }`}
                      >
                        <ArrowRight className="h-4 w-4 shrink-0 text-[#FFB800]" />
                        <div>
                          <p className="font-bold">Postulación Directa (1 Clic)</p>
                          <p className="text-[10px] text-theme-secondary">
                            Rápida vinculación con su perfil institucional CITT
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setApplicationMode('form')}
                        className={`flex items-center gap-2.5 rounded-xl border p-3 text-left text-xs transition ${
                          applicationMode === 'form'
                            ? 'border-[#307FE2] bg-theme-surface font-bold text-theme-primary shadow-sm'
                            : 'border-theme bg-transparent text-theme-secondary'
                        }`}
                      >
                        <ClipboardList className="h-4 w-4 shrink-0 text-[#307FE2]" />
                        <div>
                          <p className="font-bold">Formulario con Preguntas</p>
                          <p className="text-[10px] text-theme-secondary">
                            Filtro a medida (hasta 10 preguntas personalizadas)
                          </p>
                        </div>
                      </button>
                    </div>

                    {applicationMode === 'form' && (
                      <div className="mt-4 border-t border-theme pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-theme-primary">
                            Preguntas para los postulantes ({questions.length} / 10):
                          </p>
                          <button
                            type="button"
                            disabled={questions.length >= 10}
                            onClick={handleAddQuestion}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#307FE2] px-2.5 py-1 text-xs font-bold text-white transition hover:bg-[#2569bd] disabled:opacity-50"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Añadir Pregunta</span>
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {questions.map((q, idx) => (
                            <div
                              key={q.id}
                              className="rounded-xl border border-theme bg-theme-surface p-3 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-theme-primary">
                                  Pregunta #{idx + 1}
                                </span>
                                <div className="flex items-center gap-3">
                                  <label className="flex items-center gap-1.5 text-[11px] text-theme-secondary cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={q.required}
                                      onChange={(e) =>
                                        handleUpdateQuestion(
                                          idx,
                                          'required',
                                          e.target.checked
                                        )
                                      }
                                      className="rounded border-theme text-[#307FE2] focus:ring-0"
                                    />
                                    <span>Obligatoria</span>
                                  </label>

                                  {questions.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveQuestion(idx)}
                                      className="text-theme-secondary hover:text-red-500"
                                      title="Eliminar pregunta"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <input
                                type="text"
                                value={q.question}
                                onChange={(e) =>
                                  handleUpdateQuestion(idx, 'question', e.target.value)
                                }
                                placeholder="Escribe aquí tu pregunta para el postulante..."
                                className="w-full rounded-lg border border-theme bg-theme-subtle px-3 py-1.5 text-xs text-theme-primary focus:border-[#307FE2] focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* FASE 3: MULTIMEDIA & DOCUMENTACIÓN MARKDOWN */}
              {/* ========================================================= */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Banner de Portada */}
                  <div className="rounded-2xl border border-theme bg-theme-subtle p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-bold text-theme-primary">
                          Imagen de Banner / Portada (Opcional)
                        </label>
                        <p className="text-[11px] text-theme-secondary">
                          Sube un archivo de imagen o ingresa una URL web.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          ref={fileBannerRef}
                          type="file"
                          accept="image/*"
                          onChange={handleBannerFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileBannerRef.current?.click()}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary hover:border-[#FFB800]"
                        >
                          <Upload className="h-3.5 w-3.5 text-[#FFB800]" />
                          <span>Subir Imagen</span>
                        </button>
                      </div>
                    </div>

                    <input
                      type="url"
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      placeholder="O pega una URL: https://ejemplo.com/banner.jpg"
                      className="mt-2 w-full rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />

                    {/* Previsualización del Banner */}
                    {coverImageUrl && (
                      <div className="relative mt-3 h-32 w-full overflow-hidden rounded-xl border border-theme bg-black">
                        <img
                          src={coverImageUrl}
                          alt="Banner Preview"
                          className="h-full w-full object-cover object-center"
                        />
                        <button
                          type="button"
                          onClick={() => setCoverImageUrl('')}
                          className="absolute top-2 right-2 rounded-lg bg-black/70 p-1 text-white hover:bg-red-500"
                          title="Quitar banner"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Video URL (YouTube) */}
                  <div className="rounded-2xl border border-theme bg-theme-subtle p-4">
                    <label className="block text-xs font-bold text-theme-primary">
                      URL de Video Pitch / Demo (YouTube / Vimeo)
                    </label>
                    <p className="mt-0.5 text-[11px] text-theme-secondary">
                      Si no ingresas un video válido, no se mostrará ningún reproductor vacío en la vista de detalle.
                    </p>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="mt-2 w-full rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />

                    {videoData?.embedUrl && (
                      <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-500">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Video detectado correctamente ({videoData.provider}). Se habilitará el reproductor en el detalle.</span>
                      </div>
                    )}
                  </div>

                  {/* Repositorio de Código */}
                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      URL de Repositorio GitHub / GitLab (Opcional)
                    </label>
                    <input
                      type="url"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/usuario/mi-proyecto-citt"
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  {/* Subida y Edición de Archivo .md */}
                  <div className="rounded-2xl border border-theme bg-theme-subtle p-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <label className="block text-xs font-bold text-theme-primary">
                          Documentación Técnica (README.md)
                        </label>
                        <p className="text-[11px] text-theme-secondary">
                          Puedes subir directamente tu archivo .md local o editar el contenido abajo.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          ref={fileMdRef}
                          type="file"
                          accept=".md,text/markdown"
                          onChange={handleMdFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileMdRef.current?.click()}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary hover:border-[#FFB800]"
                        >
                          <Upload className="h-3.5 w-3.5 text-[#FFB800]" />
                          <span>Subir .md</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setReadmeContent(DEFAULT_README_TEMPLATE)}
                          className="rounded-xl border border-theme bg-theme-surface p-1.5 text-theme-secondary hover:text-theme-primary"
                          title="Restaurar plantilla por defecto"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={6}
                      value={readmeContent}
                      onChange={(e) => setReadmeContent(e.target.value)}
                      className="w-full rounded-xl border border-theme bg-theme-surface p-3 font-mono text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                    <div className="flex justify-end text-[10px] text-theme-secondary">
                      {readmeContent.length} caracteres · Soporta tablas GFM y diagramas Mermaid
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de Navegación del Wizard */}
              <div className="flex items-center justify-between border-t border-theme pt-4">
                <div>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-theme px-4 py-2 text-xs font-bold text-theme-primary hover:bg-theme-subtle"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Anterior</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRequestClose}
                    className="rounded-xl border border-theme px-4 py-2 text-xs font-semibold text-theme-primary hover:bg-theme-subtle"
                  >
                    Cancelar
                  </button>

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (step === 1 && (!title.trim() || !summary.trim())) {
                          alert('Por favor completa el Título y Resumen antes de avanzar.');
                          return;
                        }
                        setStep((prev) => (prev + 1) as 1 | 2 | 3);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-5 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                    >
                      <span>Siguiente</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-6 py-2.5 text-xs font-black text-[#1A1A1A] shadow-md transition hover:bg-[#ffc633]"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Publicar en Red Nacional CITT</span>
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Diálogo de Confirmación al Cerrar (Guardar Borrador / Descartar) */}
            {showExitConfirm && (
              <div className="absolute inset-0 z-50 flex items-center justify-center rounded-3xl bg-black/85 p-6 backdrop-blur-md animate-in fade-in duration-150">
                <div className="w-full max-w-md rounded-2xl border border-theme bg-theme-surface p-6 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-theme-primary">
                        ¿Deseas guardar tu avance?
                      </h3>
                      <p className="text-xs text-theme-secondary">
                        Tienes datos ingresados en el formulario de publicación.
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-theme-secondary">
                    Puedes guardar un borrador en este dispositivo para continuar más tarde, o descartar todos los cambios realizados.
                  </p>

                  <div className="mt-5 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="w-full rounded-xl bg-[#FFB800] py-2.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#ffc633]"
                    >
                      Guardar borrador y salir
                    </button>
                    <button
                      type="button"
                      onClick={handleDiscardChanges}
                      className="w-full rounded-xl border border-red-500/30 bg-red-500/10 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Descartar cambios y salir
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowExitConfirm(false)}
                      className="w-full rounded-xl border border-theme py-2 text-xs font-semibold text-theme-secondary hover:text-theme-primary"
                    >
                      Continuar editando
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
