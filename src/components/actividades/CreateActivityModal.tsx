'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  FolderGit2,
  Github,
  HardDrive,
  Image as ImageIcon,
  Lock,
  MapPin,
  MonitorPlay,
  Plus,
  Presentation,
  RefreshCw,
  Shield,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  Users,
  Video,
  X,
} from 'lucide-react';
import { DUOC_SCHOOLS, CITT_CAMPUSES, getCampusBySlug } from '@/data/citt-catalog';
import {
  ActivityModality,
  ActivityStudyMaterial,
  CittActivity,
  DuocSchoolSlug,
} from '@/types/citt';
import { useCittNetwork } from '@/context/CittNetworkContext';

const STORAGE_DRAFT_KEY = 'citt_activity_draft_v2';

const SUGGESTED_TAGS = [
  'Robótica & ROS',
  'IoT & Sensores',
  'Python & AI',
  'Impresión 3D',
  'Ciberseguridad',
  'Frontend Next.js',
  'Cloud AWS',
];

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateActivityModal({
  isOpen,
  onClose,
}: CreateActivityModalProps) {
  const { activeUser, isAuthenticated, addActivity } = useCittNetwork();

  // Wizard Step (1: Identidad & Espacio, 2: Cronograma & Aforo, 3: Portada & Recursos)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Fase 1: Identidad & Espacio Físico
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [schoolSlug, setSchoolSlug] = useState<DuocSchoolSlug>(
    activeUser.schoolSlug || 'informatica'
  );
  const [campusSlug, setCampusSlug] = useState(
    activeUser.campusSlug || 'san-bernardo'
  );
  const [roomLocation, setRoomLocation] = useState('Sala CITT 312');
  const [modality, setModality] = useState<ActivityModality>('presencial');

  // Fase 2: Cronograma, Horarios & Aforo Inteligente
  const [daysDescription, setDaysDescription] = useState('Martes y Jueves');
  const [sessionTime, setSessionTime] = useState('17:00 - 18:30');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [totalHoursCitt, setTotalHoursCitt] = useState(16);
  const [capacityPerSession, setCapacityPerSession] = useState(15);
  const [sessionsCountPerWeek, setSessionsCountPerWeek] = useState(2);

  // Cálculo dinámico de aforo total
  const calculatedTotalSeats = Math.max(1, capacityPerSession * sessionsCountPerWeek);

  // Fase 3: Portada & Recursos Exclusivos para Inscritos
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [materials, setMaterials] = useState<ActivityStudyMaterial[]>([]);
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatType, setNewMatType] = useState<ActivityStudyMaterial['type']>('drive');
  const [newMatUrl, setNewMatUrl] = useState('');

  // Tags
  const [tagsList, setTagsList] = useState<string[]>(['Taller CITT', 'Innovación Duoc']);
  const [tagInput, setTagInput] = useState('');

  // Alerta de confirmación de salida
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  // File input ref
  const fileBannerRef = useRef<HTMLInputElement>(null);

  const isCoreDev = activeUser.role === 'dev';
  const assignedCampus = getCampusBySlug(activeUser.campusSlug || 'san-bernardo');

  // Cargar borrador persistido al abrir
  useEffect(() => {
    if (isOpen) {
      if (!isCoreDev) {
        setCampusSlug(activeUser.campusSlug || 'san-bernardo');
      }

      try {
        const raw = localStorage.getItem(STORAGE_DRAFT_KEY);
        if (raw) {
          const draft = JSON.parse(raw);
          if (draft.title || draft.description) {
            setTitle(draft.title || '');
            setDescription(draft.description || '');
            if (draft.detailedDescription) setDetailedDescription(draft.detailedDescription);
            if (draft.schoolSlug) setSchoolSlug(draft.schoolSlug);
            if (isCoreDev && draft.campusSlug) setCampusSlug(draft.campusSlug);
            if (draft.roomLocation) setRoomLocation(draft.roomLocation);
            if (draft.modality) setModality(draft.modality);
            if (draft.daysDescription) setDaysDescription(draft.daysDescription);
            if (draft.sessionTime) setSessionTime(draft.sessionTime);
            if (draft.durationWeeks) setDurationWeeks(draft.durationWeeks);
            if (draft.totalHoursCitt) setTotalHoursCitt(draft.totalHoursCitt);
            if (draft.capacityPerSession) setCapacityPerSession(draft.capacityPerSession);
            if (draft.sessionsCountPerWeek) setSessionsCountPerWeek(draft.sessionsCountPerWeek);
            if (draft.coverImageUrl) setCoverImageUrl(draft.coverImageUrl);
            if (Array.isArray(draft.materials)) setMaterials(draft.materials);
            if (Array.isArray(draft.tagsList)) setTagsList(draft.tagsList);
            setHasRestoredDraft(true);
          }
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen, isCoreDev, activeUser.campusSlug]);

  const hasDirtyChanges = Boolean(
    title.trim() ||
      description.trim() ||
      materials.length > 0 ||
      coverImageUrl.trim() ||
      tagsList.length > 2
  );

  const handleSaveDraft = () => {
    try {
      const draftData = {
        title,
        description,
        detailedDescription,
        schoolSlug,
        campusSlug,
        roomLocation,
        modality,
        daysDescription,
        sessionTime,
        durationWeeks,
        totalHoursCitt,
        capacityPerSession,
        sessionsCountPerWeek,
        coverImageUrl,
        materials,
        tagsList,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(draftData));
    } catch {
      // ignore
    }
    setShowExitConfirm(false);
    onClose();
  };

  const handleDiscardChanges = () => {
    try {
      localStorage.removeItem(STORAGE_DRAFT_KEY);
    } catch {
      // ignore
    }
    resetForm();
    setShowExitConfirm(false);
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDetailedDescription('');
    setSchoolSlug(activeUser.schoolSlug || 'informatica');
    setCampusSlug(activeUser.campusSlug || 'san-bernardo');
    setRoomLocation('Sala CITT 312');
    setModality('presencial');
    setDaysDescription('Martes y Jueves');
    setSessionTime('17:00 - 18:30');
    setDurationWeeks(4);
    setTotalHoursCitt(16);
    setCapacityPerSession(15);
    setSessionsCountPerWeek(2);
    setCoverImageUrl('');
    setMaterials([]);
    setTagsList(['Taller CITT', 'Innovación Duoc']);
    setStep(1);
    setHasRestoredDraft(false);
  };

  const handleRequestClose = () => {
    if (hasDirtyChanges) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  // Manejo de materiales / enlaces para inscritos
  const handleAddMaterial = () => {
    if (!newMatTitle.trim() || !newMatUrl.trim()) return;
    setMaterials((prev) => [
      ...prev,
      {
        id: `mat_${Date.now()}`,
        title: newMatTitle.trim(),
        description: 'Recurso exclusivo disponible para participantes confirmados.',
        type: newMatType,
        url: newMatUrl.trim(),
        uploadedAt: 'Hoy',
      },
    ]);
    setNewMatTitle('');
    setNewMatUrl('');
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  // Manejo de tags
  const handleAddTag = (tagToAdd?: string) => {
    const val = (tagToAdd || tagInput).trim();
    if (!val) return;
    if (!tagsList.includes(val)) {
      setTagsList((prev) => [...prev, val]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTagsList((prev) => prev.filter((t) => t !== tagToRemove));
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

  // Envío final
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setStep(1);
      return;
    }

    addActivity({
      title: title.trim(),
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      description: description.trim(),
      detailedDescription: detailedDescription.trim() || description.trim(),
      schoolSlug,
      campusSlug: isCoreDev ? campusSlug : (activeUser.campusSlug || 'san-bernardo'),
      roomLocation: roomLocation.trim() || 'Sala CITT',
      modality,
      status: 'en_espera',
      instructorName: activeUser.fullName,
      instructorRole: activeUser.role,
      instructorUsername: activeUser.username,
      instructorAvatarUrl: activeUser.avatarUrl,
      capacityPerSession,
      sessionsCountPerWeek,
      totalSeats: calculatedTotalSeats,
      schedule: {
        daysDescription: daysDescription.trim() || 'Por definir',
        sessionTime: sessionTime.trim() || '17:00 - 18:30',
        frequencyPerWeek: sessionsCountPerWeek,
        durationWeeks,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + durationWeeks * 7 * 86400000).toISOString().split('T')[0],
        totalHoursCitt,
      },
      studyMaterials: materials,
      tags: tagsList,
      coverImageUrl:
        coverImageUrl.trim() ||
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    });

    try {
      localStorage.removeItem(STORAGE_DRAFT_KEY);
    } catch {
      // ignore
    }

    resetForm();
    onClose();
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
    <Dialog.Root open={isOpen} onOpenChange={(val) => !val && handleRequestClose()}>
      <Dialog.Portal>
        {/* Backdrop a nivel raíz: cubre toda la pantalla incluyendo el Navbar z-40 */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[92vh] w-[94vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 shadow-2xl focus:outline-none sm:p-8">
          {/* Header del Modal */}
          <div className="flex items-center justify-between border-b border-theme pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFB800] text-[#1A1A1A] shadow-md">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-extrabold text-theme-primary sm:text-lg">
                  Organizar Nueva Actividad o Taller CITT
                </Dialog.Title>
                <Dialog.Description className="text-xs text-theme-secondary">
                  Convoca a estudiantes y acredita Horas CITT en laboratorios institucionales
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
                <span>Se restauró un borrador de actividad guardado en este equipo.</span>
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
              <span className="text-xs font-bold leading-tight">Identidad & Espacio</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!title.trim() || !description.trim()) {
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
              <span className="text-xs font-bold leading-tight">Cronograma & Aforo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!title.trim() || !description.trim()) {
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
              <span className="text-xs font-bold leading-tight">Portada & Recursos</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* ========================================================= */}
            {/* FASE 1: IDENTIDAD & ESPACIO FÍSICO */}
            {/* ========================================================= */}
            {step === 1 && (
              <div className="space-y-4">
                {!isAuthenticated && (
                  <div className="rounded-2xl border border-[#FFB800]/40 bg-[#FFB800]/10 p-3 text-xs text-[#FFB800]">
                    💡 Registrarás como instructor a{' '}
                    <strong>{activeUser.fullName}</strong>. Para vincular con tu credencial personal,{' '}
                    <Link href="/acceso" className="font-bold underline">
                      inicia sesión aquí
                    </Link>.
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Título de la Actividad o Taller *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Taller Práctico de Microcontroladores ESP32 & IoT"
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Breve descripción del objetivo, tecnologías y resultados del taller..."
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Detalles & Plan de Aprendizaje
                  </label>
                  <textarea
                    rows={3}
                    value={detailedDescription}
                    onChange={(e) => setDetailedDescription(e.target.value)}
                    placeholder="Describe los temas sesión a sesión, requisitos previos o entregables..."
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

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Espacio Físico / Sala CITT *
                    </label>
                    <input
                      type="text"
                      required
                      value={roomLocation}
                      onChange={(e) => setRoomLocation(e.target.value)}
                      placeholder="Ej. Sala CITT 312 / Laboratorio IoT"
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Modalidad de Asistencia *
                    </label>
                    <select
                      value={modality}
                      onChange={(e) => setModality(e.target.value as ActivityModality)}
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    >
                      <option value="presencial">🏛️ Presencial en Sala CITT</option>
                      <option value="hibrido">🌐 Modalidad Híbrida (Presencial + Streaming)</option>
                      <option value="online">💻 100% Online / Remoto</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* FASE 2: CRONOGRAMA, HORARIOS & AFORO INTELIGENTE */}
            {/* ========================================================= */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Días de Sesión *
                    </label>
                    <input
                      type="text"
                      required
                      value={daysDescription}
                      onChange={(e) => setDaysDescription(e.target.value)}
                      placeholder="Ej. Martes y Jueves / Sábados"
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Horario de Sesión *
                    </label>
                    <input
                      type="text"
                      required
                      value={sessionTime}
                      onChange={(e) => setSessionTime(e.target.value)}
                      placeholder="Ej. 17:00 - 18:30"
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Duración (Semanas) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={16}
                      required
                      value={durationWeeks}
                      onChange={(e) => setDurationWeeks(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Sesiones por Semana *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={7}
                      required
                      value={sessionsCountPerWeek}
                      onChange={(e) => setSessionsCountPerWeek(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Aforo por Sesión (Físico) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      required
                      value={capacityPerSession}
                      onChange={(e) => setCapacityPerSession(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tarjeta de Aforo Inteligente Calculado */}
                <div className="rounded-2xl border border-[#307FE2]/30 bg-[#307FE2]/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#307FE2]" />
                      <span className="text-xs font-bold text-theme-primary">
                        Aforo Inteligente & Cupo Total
                      </span>
                    </div>
                    <span className="rounded-full bg-[#307FE2] px-3 py-1 text-xs font-black text-white shadow-sm">
                      {calculatedTotalSeats} Cupos Totales
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-theme-secondary">
                    Capacidad física de <strong>{capacityPerSession} estaciones de trabajo</strong> distribuidas en{' '}
                    <strong>{sessionsCountPerWeek} turnos semanales</strong>. Esto garantiza un kit de hardware individual para cada participante.
                  </p>
                </div>

                {/* Horas CITT Acreditables */}
                <div className="rounded-2xl border border-[#FFB800]/30 bg-[#FFB800]/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-[#FFB800]" />
                      <div>
                        <span className="text-xs font-bold text-theme-primary block">
                          Horas CITT Acreditables
                        </span>
                        <span className="text-[11px] text-theme-secondary">
                          Horas curriculares que sumarán los estudiantes al completar la asistencia
                        </span>
                      </div>
                    </div>
                    <select
                      value={totalHoursCitt}
                      onChange={(e) => setTotalHoursCitt(Number(e.target.value))}
                      className="rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-black text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    >
                      <option value={4}>+4 Horas CITT</option>
                      <option value={8}>+8 Horas CITT</option>
                      <option value={16}>+16 Horas CITT (Recomendado)</option>
                      <option value={24}>+24 Horas CITT</option>
                      <option value={32}>+32 Horas CITT</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* FASE 3: PORTADA & RECURSOS EXCLUSIVOS PARA INSCRITOS */}
            {/* ========================================================= */}
            {step === 3 && (
              <div className="space-y-4">
                {/* Banner de Portada */}
                <div className="rounded-2xl border border-theme bg-theme-subtle p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-bold text-theme-primary">
                        Imagen de Portada del Taller (Opcional)
                      </label>
                      <p className="text-[11px] text-theme-secondary">
                        Sube una foto del instrumental o pega una URL web.
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
                    placeholder="https://images.unsplash.com/photo-..."
                    className="mt-2 w-full rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />

                  {coverImageUrl && (
                    <div className="relative mt-3 h-28 w-full overflow-hidden rounded-xl border border-theme bg-black">
                      <img
                        src={coverImageUrl}
                        alt="Preview"
                        className="h-full w-full object-cover object-center"
                      />
                      <button
                        type="button"
                        onClick={() => setCoverImageUrl('')}
                        className="absolute top-2 right-2 rounded-lg bg-black/70 p-1 text-white hover:bg-red-500"
                        title="Quitar portada"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* RECURSOS & ENLACES EXCLUSIVOS PARA INSCRITOS */}
                <div className="rounded-2xl border border-theme bg-theme-subtle p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[#FFB800]" />
                        <label className="text-xs font-bold text-theme-primary">
                          Recursos & Enlaces para Inscritos
                        </label>
                      </div>
                      <p className="mt-0.5 text-[11px] text-theme-secondary">
                        🔒 Estos enlaces sólo serán accesibles para los alumnos que se inscriban en este taller.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-theme-secondary">
                      {materials.length} recurso(s)
                    </span>
                  </div>

                  {/* Lista de Recursos Añadidos */}
                  {materials.length > 0 && (
                    <div className="space-y-2">
                      {materials.map((m, idx) => (
                        <div
                          key={m.id || idx}
                          className="flex items-center justify-between gap-3 rounded-xl border border-theme bg-theme-surface p-2.5 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="rounded-lg bg-theme-subtle p-1.5 shrink-0">
                              {getMaterialIcon(m.type)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-theme-primary truncate">{m.title}</p>
                              <p className="text-[10px] text-theme-secondary truncate">{m.url}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterial(idx)}
                            className="p-1 text-theme-secondary hover:text-red-500"
                            title="Eliminar recurso"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulario para Añadir Recurso */}
                  <div className="rounded-xl border border-theme bg-theme-surface p-3 space-y-2">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
                      <input
                        type="text"
                        value={newMatTitle}
                        onChange={(e) => setNewMatTitle(e.target.value)}
                        placeholder="Título (Ej. Carpeta Google Drive con Guías y Firmware)"
                        className="sm:col-span-6 rounded-lg border border-theme bg-theme-subtle px-3 py-1.5 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                      />

                      <select
                        value={newMatType}
                        onChange={(e) =>
                          setNewMatType(e.target.value as ActivityStudyMaterial['type'])
                        }
                        className="sm:col-span-3 rounded-lg border border-theme bg-theme-subtle px-2 py-1.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                      >
                        <option value="drive">📁 Google Drive</option>
                        <option value="github">🐙 GitHub / GitLab</option>
                        <option value="pdf">📄 Documento PDF</option>
                        <option value="slides">📊 Presentación</option>
                        <option value="link">🔗 Enlace Web</option>
                      </select>

                      <button
                        type="button"
                        onClick={handleAddMaterial}
                        disabled={!newMatTitle.trim() || !newMatUrl.trim()}
                        className="sm:col-span-3 inline-flex items-center justify-center gap-1 rounded-lg bg-[#307FE2] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#2569bd] disabled:opacity-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Añadir Enlace</span>
                      </button>
                    </div>

                    <input
                      type="url"
                      value={newMatUrl}
                      onChange={(e) => setNewMatUrl(e.target.value)}
                      placeholder="URL del recurso (https://drive.google.com/... o https://github.com/...)"
                      className="w-full rounded-lg border border-theme bg-theme-subtle px-3 py-1.5 text-xs text-theme-primary focus:border-[#307FE2] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tags / Especialidades */}
                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Etiquetas & Temáticas del Taller
                  </label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Ej. Robótica, ESP32, Docker, Machine Learning..."
                      className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag()}
                      className="flex items-center gap-1 rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agregar</span>
                    </button>
                  </div>

                  {/* Chips interactivos */}
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {tagsList.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#FFB800]/40 bg-[#FFB800]/15 px-3 py-1 text-xs font-bold text-[#FFB800]"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="rounded-full p-0.5 hover:bg-[#FFB800]/30 hover:text-white"
                          title="Eliminar etiqueta"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Sugerencias Rápidas */}
                  <div className="mt-2 text-[11px] text-theme-secondary flex flex-wrap items-center gap-1.5">
                    <span>Sugerencias:</span>
                    {SUGGESTED_TAGS.filter((t) => !tagsList.includes(t)).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleAddTag(st)}
                        className="rounded-lg border border-theme bg-theme-subtle px-2 py-0.5 text-[10px] text-theme-secondary hover:border-[#FFB800] hover:text-[#FFB800]"
                      >
                        + {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navegación del Wizard */}
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
                      if (step === 1 && (!title.trim() || !description.trim())) {
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
                    <span>Publicar Actividad en Red CITT</span>
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
                      Tienes datos ingresados en la organización del taller.
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
  );
}
