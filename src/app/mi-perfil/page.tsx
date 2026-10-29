'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Check,
  Image as ImageIcon,
  Plus,
  QrCode,
  Save,
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

export default function MyProfileEditorPage() {
  const { activeUser, updateActiveUserProfile } = useCittNetwork();

  const [formState, setFormState] = useState<CittMemberProfile>(activeUser);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [previewInQrMode, setPreviewInQrMode] = useState(false);

  useEffect(() => {
    setFormState(activeUser);
  }, [activeUser]);

  const handleFieldChange = <K extends keyof CittMemberProfile>(
    key: K,
    value: CittMemberProfile[K]
  ) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddSpecialty = () => {
    const trimmed = newSpecialty.trim();
    if (!trimmed) return;
    if (!formState.specialties.includes(trimmed)) {
      handleFieldChange('specialties', [...formState.specialties, trimmed]);
    }
    setNewSpecialty('');
  };

  const handleRemoveSpecialty = (specToRemove: string) => {
    handleFieldChange(
      'specialties',
      formState.specialties.filter((s) => s !== specToRemove)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateActiveUserProfile(formState);
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
            Personaliza tu banner de portada, trayectoria académica, datos de
            contacto y especialidades. Tu perfil social público{' '}
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
            <span>Ver Perfil Social (/u/{formState.username})</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setPreviewInQrMode((prev) => !prev)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
          >
            <QrCode className="h-4 w-4" />
            <span>
              {previewInQrMode
                ? 'Ver Vista Previa de Datos'
                : 'Ver / Descargar mi Código QR'}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Live Contact & Social Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card lg:col-span-7"
        >
          {/* Banner de Portada Social (Selector Visual + URL Personalizada) */}
          <div className="space-y-3 border-b border-theme pb-6">
            <h2 className="inline-flex items-center gap-2 text-base font-black text-theme-primary">
              <ImageIcon className="h-4 w-4 text-[#FFB800]" />
              <span>Banner de Portada para tu Perfil Social (/u/{formState.username})</span>
            </h2>
            <p className="text-xs text-theme-secondary">
              Elige uno de los banners oficiales de laboratorios CITT o ingresa
              una URL de imagen personalizada:
            </p>

            {/* Vista Previa Rápida del Banner Seleccionado */}
            <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-theme-subtle">
              <img
                src={formState.bannerUrl || '/assets/citt-hero-lobby.webp'}
                alt="Vista previa de tu banner de portada"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-2.5 left-3 rounded-lg bg-[#1A1A1A]/85 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                Banner activo en /u/{formState.username}
              </span>
            </div>

            {/* Selector de 6 Presets Oficiales CITT */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CITT_BANNER_PRESETS.map((preset) => {
                const isSelected =
                  (formState.bannerUrl || '/assets/citt-hero-lobby.webp') ===
                  preset.imageUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleFieldChange('bannerUrl', preset.imageUrl)}
                    className={`flex flex-col items-start rounded-xl p-2 text-left text-xs transition ${
                      isSelected
                        ? 'bg-[#FFB800] font-bold text-[#1A1A1A]'
                        : 'bg-theme-elevated text-theme-primary hover:bg-theme-subtle'
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
                Username (URL Pública `/u/...`) *
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
                Título o Carrera *
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
                Track Académico / Línea de Laboratorio CITT
              </label>
              <input
                type="text"
                value={formState.academicTrack || ''}
                onChange={(e) =>
                  handleFieldChange('academicTrack', e.target.value)
                }
                placeholder="Ej. Track Robótica Autónoma, Ciberseguridad CTF o Arquitectura Cloud"
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

            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Rol en CITT Connect
              </label>
              <select
                value={formState.role}
                onChange={(e) =>
                  handleFieldChange('role', e.target.value as CittRole)
                }
                className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
              >
                {(Object.keys(ROLE_CONFIG) as CittRole[]).map((roleKey) => (
                  <option key={roleKey} value={roleKey}>
                    {ROLE_CONFIG[roleKey].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Sede CITT Duoc UC
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
                    {campus.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-theme-primary">
                Escuela Oficial Duoc UC (Define el color de tu insignia)
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
              {formState.specialties.map((spec) => (
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

          {/* LinkedIn y Redes Sociales */}
          <div className="border-t border-theme pt-5">
            <h2 className="text-sm font-bold text-theme-primary">
              Perfil de LinkedIn y Redes Sociales
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-theme-secondary">
                  URL de LinkedIn
                </label>
                <input
                  type="url"
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
                  type="url"
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
                  type="url"
                  value={formState.portfolioUrl || ''}
                  onChange={(e) =>
                    handleFieldChange('portfolioUrl', e.target.value)
                  }
                  placeholder="https://miportafolio.cl"
                  className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-theme-secondary">
                  Instagram u Otra Red Social
                </label>
                <input
                  type="url"
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

          <div className="flex items-center justify-between border-t border-theme pt-5">
            {savedNotice ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#43B02A]">
                <Check className="h-4 w-4" />
                <span>Perfil y Código QR actualizados correctamente</span>
              </span>
            ) : (
              <span className="text-xs text-theme-secondary">
                Los cambios se reflejan al instante en tu credencial pública.
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
