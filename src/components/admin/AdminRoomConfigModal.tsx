'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Clock,
  Layers,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import {
  CampusRoom,
  RoomScreensaverConfig,
  GalleryPhotoItem,
  updateSupabaseCampusRoomConfig,
} from '@/lib/supabase/tenants';
import { logAuditEvent } from '@/lib/supabase/audit';
import { CittMemberProfile } from '@/types/citt';

interface AdminRoomConfigModalProps {
  room: CampusRoom;
  campusName: string;
  onClose: () => void;
  onSaved: (updatedRoom: CampusRoom) => void;
  onNotice?: (msg: string) => void;
  activeUser?: CittMemberProfile | null;
}

const HERO_PRESETS = [
  {
    id: 'hero-citt-official',
    label: 'Espacio Tecnológico CITT (Oficial)',
    url: '/hero/hero-vista1.webp',
    description: 'Laboratorio de alto contraste con estaciones de prototipado',
  },
  {
    id: 'hero-iot',
    label: 'Laboratorio IoT & Telemetría',
    url: '/galeria/iot.webp',
    description: 'Microcontroladores, banco de telemetría y sensores',
  },
  {
    id: 'hero-comunidad',
    label: 'Comunidad & Co-Creación',
    url: '/galeria/comunidad.webp',
    description: 'Espacio colaborativo de mentoría y desarrollo estudiantil',
  },
  {
    id: 'hero-digital-fab',
    label: 'Fabricación Digital & Prototipado 3D',
    url: '/showcase/digital-fab.svg',
    description: 'Estaciones de impresión 3D y manufactura digital',
  },
  {
    id: 'hero-robotics',
    label: 'Robótica y Automatización ROS 2',
    url: '/showcase/robotics.svg',
    description: 'Brazos cinemáticos y robótica móvil autónoma',
  },
];

const DEFAULT_GALLERY: GalleryPhotoItem[] = [
  {
    id: 'g-comunidad',
    title: 'Comunidad & Co-Creación CITT',
    category: 'Comunidad',
    src: '/galeria/comunidad.webp',
    alt: 'Estudiantes y líderes CITT colaborando en desarrollo tecnológico',
  },
  {
    id: 'g-iot',
    title: 'Laboratorio IoT & Telemetría',
    category: 'IoT',
    src: '/galeria/iot.webp',
    alt: 'Estaciones de prototipado de Internet de las Cosas y sensores',
  },
  {
    id: 'g-robotica',
    title: 'Laboratorio de Robótica & ROS 2',
    category: 'Robótica',
    src: '/showcase/robotics.svg',
    alt: 'Brazo robótico controlado por cinemática inversa y ROS 2',
  },
  {
    id: 'g-hardware',
    title: 'Fabricación Digital & Prototipado 3D',
    category: 'Hardware',
    src: '/showcase/digital-fab.svg',
    alt: 'Impresión 3D de piezas mecánicas y estaciones de prototipado rápido',
  },
];

export function AdminRoomConfigModal({
  room,
  campusName,
  onClose,
  onSaved,
  onNotice,
  activeUser,
}: AdminRoomConfigModalProps) {
  const currentCfg = room.screensaverConfig || {};

  const [activeTab, setActiveTab] = useState<'screensaver' | 'hero' | 'timing' | 'gallery'>('screensaver');

  // Tab 1: Salvapantallas Textos
  const [subtitle, setSubtitle] = useState(currentCfg.subtitle || 'CENTRO DE INNOVACIÓN');
  const [description, setDescription] = useState(
    currentCfg.description ||
      `Espacio de co-creación tecnológica, prototipado rápido, robótica e Internet de las Cosas para estudiantes de Duoc UC ${campusName}.`
  );
  const [secondaryDescription, setSecondaryDescription] = useState(
    currentCfg.secondaryDescription ||
      'Reserva bloques de trabajo, accede a equipamiento especializado y recibe mentoría personalizada de Líderes CITT.'
  );
  const [floorLocation, setFloorLocation] = useState(
    currentCfg.floorLocation || `PISO 3 · ${room.roomName.toUpperCase()}`
  );
  const [equipmentSummary, setEquipmentSummary] = useState(
    currentCfg.equipmentSummary ||
      `${room.capacity || 25} PUESTOS · ${room.computersCount || 10} PCs · KITS IOT & 3D`
  );
  const [tickerChipsText, setTickerChipsText] = useState(
    currentCfg.tickerChips && currentCfg.tickerChips.length > 0
      ? currentCfg.tickerChips.join(', ')
      : `DUOC UC, TECNOLOGÍA, ${room.roomName.toUpperCase()}, CITT PASS`
  );

  // Tab 2: Hero
  const [heroImageUrl, setHeroImageUrl] = useState(currentCfg.heroImageUrl || '/hero/hero-vista1.webp');

  // Tab 3: Timing & Banners
  const [screensaverDurationSeconds, setScreensaverDurationSeconds] = useState(
    currentCfg.screensaverDurationSeconds ?? 10
  );
  const [idleTimeoutSeconds, setIdleTimeoutSeconds] = useState(
    currentCfg.idleTimeoutSeconds ?? 20
  );
  const [announcementBanner, setAnnouncementBanner] = useState(currentCfg.announcementBanner || '');

  // Tab 4: Galería
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoItem[]>(
    currentCfg.galleryPhotos && currentCfg.galleryPhotos.length > 0
      ? currentCfg.galleryPhotos
      : DEFAULT_GALLERY
  );

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleResetDefaults = () => {
    if (!confirm('¿Deseas restablecer los valores institucionales por defecto para este tótem?')) return;
    setSubtitle('CENTRO DE INNOVACIÓN');
    setDescription(
      `Espacio de co-creación tecnológica, prototipado rápido, robótica e Internet de las Cosas para estudiantes de Duoc UC ${campusName}.`
    );
    setSecondaryDescription(
      'Reserva bloques de trabajo, accede a equipamiento especializado y recibe mentoría personalizada de Líderes CITT.'
    );
    setFloorLocation(`PISO 3 · ${room.roomName.toUpperCase()}`);
    setEquipmentSummary(`${room.capacity || 25} PUESTOS · ${room.computersCount || 10} PCs · KITS IOT & 3D`);
    setTickerChipsText(`DUOC UC, TECNOLOGÍA, ${room.roomName.toUpperCase()}, CITT PASS`);
    setHeroImageUrl('/hero/hero-vista1.webp');
    setScreensaverDurationSeconds(10);
    setIdleTimeoutSeconds(20);
    setAnnouncementBanner('');
    setGalleryPhotos(DEFAULT_GALLERY);
    setStatusMessage('Valores reestablecidos a valores por defecto. Guarda para persistir.');
  };

  const handleAddPhoto = () => {
    const newPhoto: GalleryPhotoItem = {
      id: `photo-${Date.now()}`,
      title: 'Nueva Foto de Espacio',
      category: 'Innovación',
      src: '/hero/hero-vista1.webp',
      alt: `Fotografía de ${room.roomName}`,
    };
    setGalleryPhotos((prev) => [...prev, newPhoto]);
  };

  const handleUpdatePhoto = (index: number, field: keyof GalleryPhotoItem, value: string) => {
    setGalleryPhotos((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemovePhoto = (index: number) => {
    setGalleryPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const parsedChips = tickerChipsText
      .split(',')
      .map((chip) => chip.trim().toUpperCase())
      .filter((chip) => chip.length > 0);

    const newConfig: RoomScreensaverConfig = {
      subtitle: subtitle.trim() || 'CENTRO DE INNOVACIÓN',
      description: description.trim(),
      secondaryDescription: secondaryDescription.trim(),
      floorLocation: floorLocation.trim() || `PISO 3 · ${room.roomName.toUpperCase()}`,
      equipmentSummary: equipmentSummary.trim(),
      heroImageUrl: heroImageUrl.trim() || '/hero/hero-vista1.webp',
      tickerChips: parsedChips.length > 0 ? parsedChips : ['DUOC UC', 'TECNOLOGÍA', room.roomName.toUpperCase(), 'CITT PASS'],
      screensaverDurationSeconds: Math.max(3, Number(screensaverDurationSeconds) || 10),
      idleTimeoutSeconds: Math.max(5, Number(idleTimeoutSeconds) || 20),
      announcementBanner: announcementBanner.trim() || undefined,
      galleryPhotos: galleryPhotos.length > 0 ? galleryPhotos : undefined,
    };

    const success = await updateSupabaseCampusRoomConfig(room.id, newConfig);

    if (success) {
      const updatedRoom: CampusRoom = {
        ...room,
        screensaverConfig: newConfig,
      };

      if (activeUser) {
        await logAuditEvent({
          campusSlug: room.campusSlug,
          actorUsername: activeUser.username,
          actorName: activeUser.fullName,
          actorRole: activeUser.role,
          actionType: 'totem_config_updated',
          title: `Personalización de Tótem & Salvapantallas: ${room.roomName} (/${room.campusSlug}/${room.roomSlug})`,
          details: {
            roomId: room.id,
            subtitle: newConfig.subtitle,
            heroImageUrl: newConfig.heroImageUrl,
            screensaverDurationSeconds: newConfig.screensaverDurationSeconds,
          },
        });
      }

      onNotice?.(`Configuración de tótem y salvapantallas guardada para "${room.roomName}".`);
      onSaved(updatedRoom);
      onClose();
    } else {
      setStatusMessage('Error al guardar la configuración en la base de datos. Verifica tu conexión.');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-theme px-6 py-4 bg-theme-subtle/50">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#FFB800]/15 text-[#FFB800] ring-1 ring-[#FFB800]/40">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-theme-primary">
                  Personalizar Tótem & Salvapantallas
                </h3>
                <span className="rounded-full bg-[#1A1A1A] px-2.5 py-0.5 text-[11px] font-mono font-bold text-[#FFB800]">
                  /{room.campusSlug}/{room.roomSlug}
                </span>
              </div>
              <p className="text-xs text-theme-secondary">
                {room.roomName} · {campusName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-theme-secondary hover:bg-theme-subtle hover:text-theme-primary transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-theme px-6 bg-theme-surface gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('screensaver')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-semibold transition ${
              activeTab === 'screensaver'
                ? 'border-[#FFB800] text-theme-primary font-bold'
                : 'border-transparent text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <Sparkles className="size-4 text-[#FFB800]" />
            <span>Salvapantallas (Textos)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-semibold transition ${
              activeTab === 'hero'
                ? 'border-[#307FE2] text-theme-primary font-bold'
                : 'border-transparent text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <ImageIcon className="size-4 text-[#307FE2]" />
            <span>Fondo Hero</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timing')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-semibold transition ${
              activeTab === 'timing'
                ? 'border-[#43B02A] text-theme-primary font-bold'
                : 'border-transparent text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <Clock className="size-4 text-[#43B02A]" />
            <span>Tiempos & Banner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-semibold transition ${
              activeTab === 'gallery'
                ? 'border-purple-500 text-theme-primary font-bold'
                : 'border-transparent text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <Layers className="size-4 text-purple-500" />
            <span>Galería Split ({galleryPhotos.length})</span>
          </button>
        </div>

        {/* Body Content with Scroll */}
        <form onSubmit={handleSave} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {statusMessage && (
              <div className="flex items-center gap-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5 text-xs text-amber-500">
                <AlertCircle className="size-4 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* TAB 1: SALVAPANTALLAS TEXTOS */}
            {activeTab === 'screensaver' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary mb-1">
                    Subtítulo Superior del Espacio
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Ej. CENTRO DE INNOVACIÓN Y TRANSFERENCIA TECNOLÓGICA"
                    className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-sm font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-theme-secondary">
                    Aparece sobre el nombre de la sala en color amarillo CITT institucional.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary mb-1">
                    Descripción Principal
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe el propósito del espacio..."
                    className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary mb-1">
                    Instrucciones / Segunda Descripción
                  </label>
                  <textarea
                    rows={2}
                    value={secondaryDescription}
                    onChange={(e) => setSecondaryDescription(e.target.value)}
                    placeholder="Instrucciones para estudiantes, reservas o uso..."
                    className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary mb-1">
                      Ubicación Física
                    </label>
                    <input
                      type="text"
                      value={floorLocation}
                      onChange={(e) => setFloorLocation(e.target.value)}
                      placeholder="Ej. PISO 3 · SALA 312"
                      className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary mb-1">
                      Resumen de Capacidad y Equipos
                    </label>
                    <input
                      type="text"
                      value={equipmentSummary}
                      onChange={(e) => setEquipmentSummary(e.target.value)}
                      placeholder="Ej. 25 PUESTOS · KITS IOT & 3D"
                      className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary mb-1">
                    Palabras Clave del Footer Ticker (Separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={tickerChipsText}
                    onChange={(e) => setTickerChipsText(e.target.value)}
                    placeholder="DUOC UC, TECNOLOGÍA, SALA 312, CITT PASS"
                    className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-sm font-mono text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-theme-secondary">
                    Aparecen en la barra inferior del salvapantallas con animación y mayúsculas.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: FONDO HERO */}
            {activeTab === 'hero' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary mb-2">
                    Presets Oficiales Duoc UC
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {HERO_PRESETS.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => setHeroImageUrl(preset.url)}
                        className={`flex items-start gap-3 rounded-2xl border p-3 cursor-pointer transition ${
                          heroImageUrl === preset.url
                            ? 'border-[#FFB800] bg-[#FFB800]/10 ring-1 ring-[#FFB800]'
                            : 'border-theme bg-theme-subtle hover:border-theme-primary/30'
                        }`}
                      >
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-theme-surface">
                          {heroImageUrl === preset.url ? (
                            <CheckCircle2 className="size-4 text-[#FFB800]" />
                          ) : (
                            <ImageIcon className="size-4 text-theme-secondary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-theme-primary">{preset.label}</p>
                          <p className="text-[11px] text-theme-secondary truncate">{preset.description}</p>
                          <span className="text-[10px] font-mono text-[#307FE2]">{preset.url}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary mb-1">
                    URL Personalizada de Imagen de Fondo (Hero)
                  </label>
                  <input
                    type="text"
                    value={heroImageUrl}
                    onChange={(e) => setHeroImageUrl(e.target.value)}
                    placeholder="https://... o ruta relativa /hero/..."
                    className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-sm font-mono text-theme-primary focus:border-[#307FE2] focus:outline-none"
                  />
                </div>

                {/* Vista previa miniatura */}
                <div className="rounded-2xl border border-theme bg-black/40 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-theme-secondary">Vista Previa de Fondo</span>
                    <a
                      href={heroImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#307FE2] hover:underline"
                    >
                      <span>Abrir Imagen</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                  <div className="relative h-40 w-full overflow-hidden rounded-xl bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroImageUrl}
                      alt="Vista previa hero"
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/hero/hero-vista1.webp';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                      <p className="text-xs font-bold text-white drop-shadow">
                        Fondo Activo: {room.roomName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TIEMPOS & BANNER */}
            {activeTab === 'timing' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary mb-1">
                      Duración Salvapantallas (Segundos)
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={60}
                      value={screensaverDurationSeconds}
                      onChange={(e) => setScreensaverDurationSeconds(Number(e.target.value))}
                      className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-sm font-mono text-theme-primary focus:border-[#43B02A] focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-theme-secondary">
                      Tiempo de exhibición del logo y ficha 3D antes de cambiar al calendario (Por defecto: 10s).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary mb-1">
                      Inactividad del Calendario (Segundos)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={idleTimeoutSeconds}
                      onChange={(e) => setIdleTimeoutSeconds(Number(e.target.value))}
                      className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-sm font-mono text-theme-primary focus:border-[#43B02A] focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-theme-secondary">
                      Tiempo sin toques antes de volver al salvapantallas (Por defecto: 20s). Se pausa durante reservas.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary mb-1">
                    Banner de Anuncio Destacado (Opcional)
                  </label>
                  <input
                    type="text"
                    value={announcementBanner}
                    onChange={(e) => setAnnouncementBanner(e.target.value)}
                    placeholder="Ej. 🚀 Hackathon de Robótica este viernes desde las 14:00 hrs en Sala 312"
                    className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-theme-secondary">
                    Si se define, se muestra una barra dorada institucional en la parte superior del calendario interactivo.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: GALERÍA ROTATIVA */}
            {activeTab === 'gallery' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-theme-secondary">
                      Fotografías del Espacio (Rotación cada 5s)
                    </h4>
                    <p className="text-[11px] text-theme-secondary">
                      Aparecen en el 40% derecho de la vista dividida del calendario.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-theme-subtle border border-theme px-3 py-1.5 text-xs font-bold text-theme-primary hover:border-purple-500 transition"
                  >
                    <Plus className="size-3.5 text-purple-500" />
                    <span>Añadir Foto</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {galleryPhotos.map((photo, index) => (
                    <div
                      key={photo.id || index}
                      className="rounded-2xl border border-theme bg-theme-subtle/50 p-3.5 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-purple-400">
                          Foto #{index + 1}
                        </span>
                        {galleryPhotos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(index)}
                            className="p-1 rounded-lg text-theme-secondary hover:text-red-500 hover:bg-red-500/10 transition"
                            title="Eliminar foto"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-theme-secondary mb-1">
                            Título
                          </label>
                          <input
                            type="text"
                            value={photo.title}
                            onChange={(e) => handleUpdatePhoto(index, 'title', e.target.value)}
                            className="w-full rounded-lg border border-theme bg-theme-surface px-2.5 py-1.5 text-xs text-theme-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-theme-secondary mb-1">
                            Categoría (Badge)
                          </label>
                          <input
                            type="text"
                            value={photo.category}
                            onChange={(e) => handleUpdatePhoto(index, 'category', e.target.value)}
                            className="w-full rounded-lg border border-theme bg-theme-surface px-2.5 py-1.5 text-xs text-theme-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-theme-secondary mb-1">
                          Ruta o URL de Imagen
                        </label>
                        <input
                          type="text"
                          value={photo.src}
                          onChange={(e) => handleUpdatePhoto(index, 'src', e.target.value)}
                          className="w-full rounded-lg border border-theme bg-theme-surface px-2.5 py-1.5 text-xs font-mono text-theme-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-theme px-6 py-4 bg-theme-subtle/50 gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-surface px-3.5 py-2 text-xs font-bold text-theme-secondary hover:text-theme-primary transition w-full sm:w-auto justify-center"
            >
              <RotateCcw className="size-3.5 text-theme-secondary" />
              <span>Restablecer Defectos</span>
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-theme bg-theme-surface px-4 py-2 text-xs font-bold text-theme-secondary hover:text-theme-primary transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-5 py-2 text-xs font-bold text-white transition hover:bg-black shadow-md border border-[#FFB800] disabled:opacity-50"
              >
                <Save className="size-3.5 text-[#FFB800]" />
                <span>{saving ? 'Guardando...' : 'Guardar Configuración'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
