'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Camera,
  Check,
  Image as ImageIcon,
  LogIn,
  Plus,
  QrCode,
  Radio,
  Save,
  Shield,
  Smartphone,
  Trash2,
  Upload,
  UserCheck,
  X,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import {
  CITT_BANNER_PRESETS,
  CITT_CAMPUSES,
  DUOC_SCHOOLS,
  ROLE_CONFIG,
} from '@/data/citt-catalog';
import { CittMemberProfile, CittRole, DuocSchoolSlug } from '@/types/citt';
import { PhygitalPassCard } from '@/components/PhygitalPassCard';
import { RoleBadge } from '@/components/RoleBadge';

function ensureHttpUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function MyProfileEditorPage() {
  const { activeUser, isAuthenticated, updateActiveUserProfile } = useCittNetwork();

  const [formState, setFormState] = useState<CittMemberProfile>(activeUser);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [previewInQrMode, setPreviewInQrMode] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormState(activeUser);
  }, [activeUser]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-theme bg-theme-surface p-8 text-center shadow-theme-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFB800]/15 text-[#FFB800]">
          <LogIn className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-theme-primary">
          Acceso Requerido
        </h1>
        <p className="mt-2 text-sm text-theme-secondary">
          Debes iniciar sesión con tu cuenta de CITT Connect para configurar tu perfil,
          subir tu fotografía de credencial y personalizar tu banner.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/acceso?redirect=/mi-perfil"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
          >
            <span>Iniciar Sesión / Acceso Rápido</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/directorio"
            className="inline-flex items-center gap-2 rounded-xl border border-theme bg-theme-subtle px-4 py-2.5 text-xs font-bold text-theme-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al Directorio</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleFieldChange = <K extends keyof CittMemberProfile>(
    key: K,
    value: CittMemberProfile[K]
  ) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG o WEBP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('La imagen excede el límite de 3 MB. Elige una imagen más liviana.');
      return;
    }

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      handleFieldChange('avatarUrl', result);
      setIsUploadingAvatar(false);
    };
    reader.onerror = () => {
      setIsUploadingAvatar(false);
      alert('Error al leer el archivo de imagen local.');
    };
    reader.readAsDataURL(file);
  };

  const handleAddSpecialty = () => {
    const trimmed = newSpecialty.trim();
    if (!trimmed) return;
    if (!formState.specialties?.includes(trimmed)) {
      handleFieldChange('specialties', [...(formState.specialties || []), trimmed]);
    }
    setNewSpecialty('');
  };

  const handleRemoveSpecialty = (specToRemove: string) => {
    handleFieldChange(
      'specialties',
      (formState.specialties || []).filter((s) => s !== specToRemove)
    );
  };

  const handleAddAchievement = () => {
    const trimmed = newAchievement.trim();
    if (!trimmed) return;
    handleFieldChange('achievements', [...(formState.achievements || []), trimmed]);
    setNewAchievement('');
  };

  const handleRemoveAchievement = (indexToRemove: number) => {
    handleFieldChange(
      'achievements',
      (formState.achievements || []).filter((_, idx) => idx !== indexToRemove)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedProfile: CittMemberProfile = {
      ...formState,
      linkedinUrl: ensureHttpUrl(formState.linkedinUrl),
      githubUrl: ensureHttpUrl(formState.githubUrl),
      portfolioUrl: ensureHttpUrl(formState.portfolioUrl),
      instagramUrl: ensureHttpUrl(formState.instagramUrl),
    };

    updateActiveUserProfile(sanitizedProfile);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2600);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-theme pb-8 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-theme-primary sm:text-4xl">
            Editor de Perfil Social, Banner & Pase QR
          </h1>
          <p className="mt-1 max-w-[65ch] text-sm text-theme-secondary">
            Personaliza tu fotografía de credencial, banner de portada, trayectoria académica, datos de
            contacto y especialidades. Tu credencial pública{' '}
            <code className="font-mono font-bold text-theme-primary">
              /u/{formState.username}
            </code>{' '}
            y tu código QR se sincronizan al instante.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/u/${formState.username}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-theme-subtle px-4 py-2.5 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
          >
            <span>Ver Mi Credencial Pública</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setPreviewInQrMode((prev) => !prev)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
          >
            <QrCode className="h-4 w-4" />
            <span>{previewInQrMode ? 'Ver Tarjeta Datos' : 'Ver Código QR'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column: Form Controls */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card sm:p-8 lg:col-span-7"
        >
          {/* Avatar Upload Section */}
          <div className="space-y-3 border-b border-theme pb-6">
            <h2 className="text-sm font-bold text-theme-primary">
              Fotografía de Credencial & Identidad Phygital
            </h2>
            <div className="flex flex-wrap items-center gap-5">
              <div className="relative">
                <img
                  src={formState.avatarUrl || '/assets/citt-logo.webp'}
                  alt={formState.fullName}
                  className="h-20 w-20 rounded-2xl border-2 border-[#FFB800] object-cover shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFB800] text-[#1A1A1A] shadow-md transition hover:bg-[#ffc633]"
                  title="Subir nueva foto"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarFileSelect}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-elevated px-3 py-1.5 text-xs font-bold text-theme-primary transition hover:border-[#FFB800]"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{isUploadingAvatar ? 'Procesando...' : 'Subir Imagen Local'}</span>
                  </button>
                  {formState.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('avatarUrl', undefined)}
                      className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-theme-secondary hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Restablecer</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-theme-secondary">
                  Formatos compatibles: WEBP, PNG o JPG (máx. 3 MB). Se visualiza en tu credencial y en el Muro.
                </p>
              </div>
            </div>
          </div>

          {/* Banner Selector */}
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-theme-primary">
              <ImageIcon className="h-4 w-4 text-[#FFB800]" />
              <span>Banner de Portada Duoc UC</span>
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CITT_BANNER_PRESETS.map((preset) => {
                const isSelected = formState.bannerUrl === preset.imageUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleFieldChange('bannerUrl', preset.imageUrl)}
                    className={`flex flex-col items-start rounded-xl p-2 text-left text-xs transition ${
                      isSelected
                        ? 'bg-[#FFB800] font-bold text-[#1A1A1A]'
                        : 'border border-theme bg-theme-elevated text-theme-primary hover:border-[#FFB800]'
                    }`}
                  >
                    <span className="line-clamp-1 font-bold">
                      {preset.category}
                    </span>
                    <span
                      className={`line-clamp-1 text-xs ${
                        isSelected ? 'text-[#1A1A1A]/80' : 'text-theme-secondary'
                      }`}
                    >
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-primary">
                URL de Banner Personalizado (Opcional)
              </label>
              <input
                type="text"
                value={formState.bannerUrl || ''}
                onChange={(e) => handleFieldChange('bannerUrl', e.target.value)}
                placeholder="/assets/citt-hero-lobby.webp o https://..."
                className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>
          </div>

          {/* Availability Switch */}
          <div className="flex items-center justify-between rounded-2xl border border-theme bg-theme-subtle p-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-theme-primary">
                Disponible para Proyectos Inter-Sedes
              </p>
              <p className="text-[11px] text-theme-secondary">
                Muestra la insignia verde &ldquo;Disponible para Proyectos&rdquo; en tu credencial pública.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={formState.isOpenToCollaborate}
                onChange={(e) =>
                  handleFieldChange('isOpenToCollaborate', e.target.checked)
                }
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-theme-elevated peer-checked:bg-[#43B02A] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
            </label>
          </div>

          {/* Academic & Identity Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-theme-primary">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={formState.fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Username (Enlace `/u/...`) *
              </label>
              <input
                type="text"
                required
                value={formState.username}
                onChange={(e) =>
                  handleFieldChange(
                    'username',
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-_]/g, '-')
                  )
                }
                className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 font-mono text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Correo Electrónico de Contacto *
              </label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-theme-primary">
                Ocupación Actual *
              </label>
              <input
                type="text"
                required
                value={formState.currentOccupation}
                onChange={(e) =>
                  handleFieldChange('currentOccupation', e.target.value)
                }
                placeholder="Ej. Líder Track Robótica CITT / Full-Stack Developer"
                className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-theme-primary">
                Carrera o Título Académico *
              </label>
              <input
                type="text"
                required
                value={formState.careerTitle}
                onChange={(e) =>
                  handleFieldChange('careerTitle', e.target.value)
                }
                placeholder="Ej. Ingeniería en Informática / Diseño Industrial"
                className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-theme-primary">
                Biografía & Propósito en la Red CITT
              </label>
              <textarea
                rows={3}
                value={formState.bio || ''}
                onChange={(e) => handleFieldChange('bio', e.target.value)}
                placeholder="Describe tu enfoque académico, proyectos e intereses de colaboración inter-sedes..."
                className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            {/* Read-Only Role Field (Security Hardened) */}
            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Rol Oficial CITT (Gobernado por Correo Institucional)
              </label>
              <div className="mt-1.5 flex items-center justify-between rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5">
                <RoleBadge role={formState.role} size="md" />
                <span className="text-xs font-bold text-theme-secondary">
                  {ROLE_CONFIG[formState.role].shortLabel}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-theme-secondary">
                Tu rol está gobernado por tu credencial institucional Duoc UC. Para solicitar cambios, contacta a tu Coordinador CITT.
              </p>
            </div>

            {/* Campus Selector (18 Official Campuses) */}
            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Sede CITT Duoc UC (18 Sedes Oficiales)
              </label>
              <select
                value={formState.campusSlug}
                onChange={(e) =>
                  handleFieldChange('campusSlug', e.target.value)
                }
                className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
              >
                {CITT_CAMPUSES.map((campus) => (
                  <option key={campus.slug} value={campus.slug}>
                    {campus.name} ({campus.region})
                  </option>
                ))}
              </select>
            </div>

            {/* School Selector */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-theme-primary">
                Escuela Oficial Duoc UC (Color de Insignia Institucional)
              </label>
              <select
                value={formState.schoolSlug}
                onChange={(e) =>
                  handleFieldChange(
                    'schoolSlug',
                    e.target.value as DuocSchoolSlug
                  )
                }
                className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
              >
                {DUOC_SCHOOLS.map((school) => (
                  <option key={school.slug} value={school.slug}>
                    {school.name} ({school.primaryHex})
                  </option>
                ))}
              </select>
            </div>

            {formState.role === 'consejero_carrera' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-theme-primary">
                  Información de Enlace para Alumnos Duoc sin cuenta CITT Connect
                </label>
                <input
                  type="text"
                  value={formState.representedCareerInfo || ''}
                  onChange={(e) =>
                    handleFieldChange('representedCareerInfo', e.target.value)
                  }
                  placeholder="Ej. Horario de atención o canal para estudiantes de tu carrera"
                  className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>
            )}

            {formState.role === 'partner' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-theme-primary">
                  Empresa u Organización Partner
                </label>
                <input
                  type="text"
                  value={formState.partnerOrganization || ''}
                  onChange={(e) =>
                    handleFieldChange('partnerOrganization', e.target.value)
                  }
                  placeholder="Ej. Nombre de la empresa o institución aliada"
                  className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Especialidades */}
          <div className="border-t border-theme pt-5">
            <label className="block text-xs font-bold text-theme-primary">
              Especialidades & Áreas de Dominio
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSpecialty();
                  }
                }}
                placeholder="Agregar especialidad (ej. Ciberseguridad, React, Impresión 3D)..."
                className="flex-1 rounded-xl border border-theme bg-theme-elevated px-3.5 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSpecialty}
                className="inline-flex items-center gap-1 rounded-xl bg-theme-subtle px-3.5 py-2 text-xs font-bold text-theme-primary hover:bg-[#FFB800] hover:text-[#1A1A1A]"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar</span>
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {(formState.specialties || []).map((spec) => (
                <span
                  key={spec}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-theme-elevated px-2.5 py-1 text-xs font-medium text-theme-primary"
                >
                  <span>{spec}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialty(spec)}
                    className="text-theme-secondary hover:text-theme-primary"
                    aria-label={`Eliminar ${spec}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Hitos Académicos & Logros (Achievements) */}
          <div className="border-t border-theme pt-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-theme-primary">
              <Award className="h-4 w-4 text-[#FFB800]" />
              <span>Hitos y Reconocimientos Destacados</span>
            </h2>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAchievement();
                  }
                }}
                placeholder="Ej. 1er Lugar Hackathon Nacional CITT 2025..."
                className="flex-1 rounded-xl border border-theme bg-theme-elevated px-3.5 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddAchievement}
                className="inline-flex items-center gap-1 rounded-xl bg-theme-subtle px-3.5 py-2 text-xs font-bold text-theme-primary hover:bg-[#FFB800] hover:text-[#1A1A1A]"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar</span>
              </button>
            </div>

            <div className="mt-3 space-y-1.5">
              {(formState.achievements || []).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-theme-elevated px-3 py-2 text-xs text-theme-primary"
                >
                  <span className="truncate">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAchievement(idx)}
                    className="ml-2 text-theme-secondary hover:text-red-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contacto & Redes Sociales */}
          <div className="border-t border-theme pt-5">
            <h2 className="text-sm font-bold text-theme-primary">
              Perfil Profesional y Redes Sociales
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-theme-secondary">
                  Teléfono Móvil (Para exportación vCard .vcf)
                </label>
                <input
                  type="tel"
                  value={formState.phoneOptional || ''}
                  onChange={(e) =>
                    handleFieldChange('phoneOptional', e.target.value)
                  }
                  placeholder="+56 9 1234 5678"
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-theme-secondary">
                  URL de LinkedIn
                </label>
                <input
                  type="text"
                  value={formState.linkedinUrl || ''}
                  onChange={(e) =>
                    handleFieldChange('linkedinUrl', e.target.value)
                  }
                  placeholder="https://linkedin.com/in/tu-perfil"
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-theme-secondary">
                  URL de GitHub
                </label>
                <input
                  type="text"
                  value={formState.githubUrl || ''}
                  onChange={(e) =>
                    handleFieldChange('githubUrl', e.target.value)
                  }
                  placeholder="https://github.com/tu-usuario"
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-theme-secondary">
                  Portafolio o Sitio Web
                </label>
                <input
                  type="text"
                  value={formState.portfolioUrl || ''}
                  onChange={(e) =>
                    handleFieldChange('portfolioUrl', e.target.value)
                  }
                  placeholder="https://miportafolio.cl"
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-theme-secondary">
                  Instagram u Otra Red Social
                </label>
                <input
                  type="text"
                  value={formState.instagramUrl || ''}
                  onChange={(e) =>
                    handleFieldChange('instagramUrl', e.target.value)
                  }
                  placeholder="https://instagram.com/tu-usuario"
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between border-t border-theme pt-5">
            {savedNotice ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#43B02A]">
                <Check className="h-4 w-4" />
                <span>Perfil y Código QR actualizados correctamente</span>
              </span>
            ) : (
              <span className="text-xs text-theme-secondary">
                Los cambios se reflejan al instante en tu credencial y proyectos.
              </span>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-5 py-3 text-sm font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Cambios en mi Credencial</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Credential & QR Preview */}
        <div className="space-y-4 lg:col-span-5">
          <div className="sticky top-24 space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-bold tracking-wider text-theme-primary uppercase">
                Vista Previa en Vivo (Credencial & QR)
              </p>
              <span className="text-xs text-theme-secondary">
                Haz clic en &ldquo;Ver Código QR&rdquo; en la tarjeta
              </span>
            </div>
            <PhygitalPassCard
              profile={formState}
              initialShowQR={previewInQrMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
