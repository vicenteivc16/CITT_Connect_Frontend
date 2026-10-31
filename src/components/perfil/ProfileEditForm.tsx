'use client';

import React, { useRef, useState } from 'react';
import {
  Award,
  Camera,
  Check,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  CITT_CAMPUSES,
  DUOC_SCHOOLS,
} from '@/data/citt-catalog';
import { CittMemberProfile, DuocSchoolSlug } from '@/types/citt';
import { ProfileBannersSelector } from './ProfileBannersSelector';
import { ProfileSocialLinksForm } from './ProfileSocialLinksForm';

function ensureHttpUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

interface ProfileEditFormProps {
  initialProfile: CittMemberProfile;
  onSaveProfile: (profile: CittMemberProfile) => void;
  onProfileStateChange?: (profile: CittMemberProfile) => void;
}

export function ProfileEditForm({
  initialProfile,
  onSaveProfile,
  onProfileStateChange,
}: ProfileEditFormProps) {
  const [formState, setFormState] = useState<CittMemberProfile>(initialProfile);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = <K extends keyof CittMemberProfile>(
    key: K,
    value: CittMemberProfile[K]
  ) => {
    setFormState((prev) => {
      const updated = { ...prev, [key]: value };
      onProfileStateChange?.(updated);
      return updated;
    });
  };

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('La imagen excede el límite recomendado de 3 MB.');
      return;
    }

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      handleFieldChange('avatarUrl', base64);
      setIsUploadingAvatar(false);
    };
    reader.onerror = () => {
      alert('Error al leer el archivo de imagen.');
      setIsUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSpecialty = () => {
    const trimmed = newSpecialty.trim();
    if (!trimmed) return;
    if ((formState.specialties || []).includes(trimmed)) {
      setNewSpecialty('');
      return;
    }
    handleFieldChange('specialties', [
      ...(formState.specialties || []),
      trimmed,
    ]);
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
    handleFieldChange('achievements', [
      ...(formState.achievements || []),
      trimmed,
    ]);
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

    onSaveProfile(sanitizedProfile);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2600);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card sm:p-8"
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
      <ProfileBannersSelector
        currentBannerUrl={formState.bannerUrl}
        onSelectBanner={(url) => handleFieldChange('bannerUrl', url)}
      />

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
            Nombre y Apellidos Oficiales
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
            Ocupación o Título Profesional
          </label>
          <input
            type="text"
            required
            value={formState.currentOccupation}
            onChange={(e) =>
              handleFieldChange('currentOccupation', e.target.value)
            }
            placeholder="Ej. Líder de Proyectos IoT / Alumno 5to Semestre"
            className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-theme-primary">
            Carrera o Programa Académico
          </label>
          <input
            type="text"
            required
            value={formState.careerTitle}
            onChange={(e) =>
              handleFieldChange('careerTitle', e.target.value)
            }
            placeholder="Ej. Ingeniería en Informática"
            className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-theme-primary">
            Sede Duoc UC
          </label>
          <select
            value={formState.campusSlug}
            onChange={(e) => handleFieldChange('campusSlug', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
          >
            {CITT_CAMPUSES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.region})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-theme-primary">
            Escuela Duoc UC
          </label>
          <select
            value={formState.schoolSlug}
            onChange={(e) =>
              handleFieldChange('schoolSlug', e.target.value as DuocSchoolSlug)
            }
            className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
          >
            {DUOC_SCHOOLS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-theme-primary">
            Biografía y Trayectoria en la Red CITT
          </label>
          <textarea
            rows={3}
            value={formState.bio}
            onChange={(e) => handleFieldChange('bio', e.target.value)}
            placeholder="Describe tus intereses tecnológicos, proyectos previos o experiencia en innovación..."
            className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
          />
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

      {/* Hitos Académicos & Logros */}
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
      <ProfileSocialLinksForm
        phone={formState.phoneOptional}
        linkedinUrl={formState.linkedinUrl}
        githubUrl={formState.githubUrl}
        portfolioUrl={formState.portfolioUrl}
        instagramUrl={formState.instagramUrl}
        onChangeField={(field, val) => handleFieldChange(field as keyof CittMemberProfile, val)}
      />

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
  );
}
