'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Laptop,
  Layers,
  MapPin,
  Monitor,
  Plus,
  Power,
  Printer,
  QrCode,
  Radio,
  Search,
  Sparkles,
  Trash2,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CITT_CAMPUSES, getCampusBySlug } from '@/data/citt-catalog';
import {
  CampusRoom,
  createSupabaseCampusRoom,
  deleteSupabaseCampusRoom,
  getSupabaseCampusRooms,
  toggleSupabaseRoomActive,
} from '@/lib/supabase/tenants';
import { logAuditEvent } from '@/lib/supabase/audit';
import { useCittNetwork } from '@/context/CittNetworkContext';

interface AdminCalendarRoomsProps {
  selectedCampusSlug?: string;
  onNotice?: (msg: string) => void;
}

export function AdminCalendarRooms({ selectedCampusSlug, onNotice }: AdminCalendarRoomsProps) {
  const { activeUser } = useCittNetwork();
  const [rooms, setRooms] = useState<CampusRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Modales
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [qrModalRoom, setQrModalRoom] = useState<CampusRoom | null>(null);

  // Formulario de nueva sala
  const [newCampus, setNewCampus] = useState(
    selectedCampusSlug && selectedCampusSlug !== 'nacional' ? selectedCampusSlug : 'san-bernardo'
  );
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomSlug, setNewRoomSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [newCapacity, setNewCapacity] = useState('20');
  const [newComputers, setNewComputers] = useState('15');
  const [newHasIot, setNewHasIot] = useState(true);
  const [newHasMaker, setNewHasMaker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRooms = async () => {
    setIsLoading(true);
    const data = await getSupabaseCampusRooms();
    setRooms(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Sincronizar campus por defecto con selector global
  useEffect(() => {
    if (selectedCampusSlug && selectedCampusSlug !== 'nacional') {
      setNewCampus(selectedCampusSlug);
    }
  }, [selectedCampusSlug]);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (name: string) => {
    setNewRoomName(name);
    if (!isSlugManuallyEdited) {
      setNewRoomSlug(slugify(name));
    }
  };

  const getCalendarUrl = (campusSlug: string, roomSlug: string) => {
    // Si estamos en entorno local podemos usar el puerto del calendario, o el dominio en Vercel
    const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const baseUrl = isLocal ? 'http://localhost:3001' : 'https://calendario-citt.vercel.app';
    return `${baseUrl}/${campusSlug}/${roomSlug}`;
  };

  const handleCopyLink = (campusSlug: string, roomSlug: string) => {
    const url = getCalendarUrl(campusSlug, roomSlug);
    navigator.clipboard.writeText(url);
    setCopiedSlug(`${campusSlug}/${roomSlug}`);
    onNotice?.(`Enlace de Tótem copiado: /${campusSlug}/${roomSlug}`);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleToggleActive = async (room: CampusRoom) => {
    const updated = await toggleSupabaseRoomActive(room.id, !room.isActive);
    if (updated) {
      setRooms((prev) =>
        prev.map((r) => (r.id === room.id ? { ...r, isActive: !r.isActive } : r))
      );
      onNotice?.(
        `Sala "${room.roomName}" ${!room.isActive ? 'activada' : 'desactivada'} exitosamente.`
      );
    }
  };

  const handleDeleteRoom = async (room: CampusRoom) => {
    if (
      !confirm(
        `¿Confirmas la eliminación del calendario y sala "${room.roomName}" (${room.campusSlug}/${room.roomSlug})?`
      )
    ) {
      return;
    }

    const success = await deleteSupabaseCampusRoom(room.id);
    if (success) {
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
      onNotice?.(`Sala "${room.roomName}" eliminada.`);
      if (activeUser) {
        await logAuditEvent({
          campusSlug: room.campusSlug,
          actorUsername: activeUser.username,
          actorName: activeUser.fullName,
          actorRole: activeUser.role,
          actionType: 'bloqueo_dia',
          title: `Eliminación de sala ${room.roomName} (/${room.campusSlug}/${room.roomSlug})`,
          details: { roomId: room.id },
        });
      }
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !newRoomSlug.trim()) return;

    setIsSubmitting(true);
    const created = await createSupabaseCampusRoom({
      campusSlug: newCampus,
      roomName: newRoomName.trim(),
      roomSlug: newRoomSlug.trim(),
      capacity: Number(newCapacity) || 20,
      computersCount: Number(newComputers) || 15,
      hasMakerTools: newHasMaker,
      hasIotEquipment: newHasIot,
      isActive: true,
      totemToken: `totem_${newCampus}_${newRoomSlug.trim()}`,
    });

    if (created) {
      setRooms((prev) => [created, ...prev]);
      setCreateModalOpen(false);
      setNewRoomName('');
      setNewRoomSlug('');
      setIsSlugManuallyEdited(false);
      onNotice?.(`✓ Nueva sala y ruta /${created.campusSlug}/${created.roomSlug} generada con éxito.`);

      if (activeUser) {
        await logAuditEvent({
          campusSlug: newCampus,
          actorUsername: activeUser.username,
          actorName: activeUser.fullName,
          actorRole: activeUser.role,
          actionType: 'nueva_sala',
          title: `Creación de ruta de calendario: /${created.campusSlug}/${created.roomSlug}`,
          details: {
            roomName: created.roomName,
            capacity: created.capacity,
            hasMaker: created.hasMakerTools,
            hasIot: created.hasIotEquipment,
          },
        });
      }
    } else {
      alert('Hubo un problema al crear la sala. Verifica que el slug no esté repetido en esta sede.');
    }
    setIsSubmitting(false);
  };

  // Filtrado de salas
  const filteredRooms = rooms.filter((r) => {
    if (selectedCampusSlug && selectedCampusSlug !== 'nacional' && r.campusSlug !== selectedCampusSlug) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const campus = getCampusBySlug(r.campusSlug);
      return (
        r.roomName.toLowerCase().includes(q) ||
        r.roomSlug.toLowerCase().includes(q) ||
        campus.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCap = filteredRooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
  const totalPcs = filteredRooms.reduce((acc, r) => acc + (r.computersCount || 0), 0);
  const activeCount = filteredRooms.filter((r) => r.isActive).length;

  return (
    <div className="space-y-6">
      {/* Barra de Estadísticas de Rutas Tótem */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-theme bg-theme-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-theme-secondary">
            <Monitor className="h-4 w-4 text-[#FFB800]" />
            <span>Salas & Calendarios</span>
          </div>
          <div className="mt-2 text-2xl font-black text-theme-primary">
            {filteredRooms.length}{' '}
            <span className="text-xs font-medium text-[#43B02A]">({activeCount} activas)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-theme bg-theme-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-theme-secondary">
            <Users className="h-4 w-4 text-[#307FE2]" />
            <span>Capacidad Total</span>
          </div>
          <div className="mt-2 text-2xl font-black text-theme-primary">{totalCap} pax</div>
        </div>

        <div className="rounded-2xl border border-theme bg-theme-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-theme-secondary">
            <Laptop className="h-4 w-4 text-[#43B02A]" />
            <span>Estaciones PC</span>
          </div>
          <div className="mt-2 text-2xl font-black text-theme-primary">{totalPcs} PCs</div>
        </div>

        <div className="rounded-2xl border border-theme bg-theme-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-theme-secondary">
            <Radio className="h-4 w-4 text-purple-400" />
            <span>Sedes con Tótem</span>
          </div>
          <div className="mt-2 text-2xl font-black text-theme-primary">
            {new Set(filteredRooms.map((r) => r.campusSlug)).size}
          </div>
        </div>
      </div>

      {/* Controles de Acción y Búsqueda */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, slug (ej. sala-312) o sede..."
            className="w-full rounded-2xl border border-theme bg-theme-surface py-2.5 pl-10 pr-4 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-4 py-2.5 text-xs font-black text-[#1A1A1A] transition hover:bg-[#e0a200] shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Crear Nueva Sala & Ruta Tótem</span>
        </button>
      </div>

      {/* Grid de Salas y Rutas Dinámicas */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFB800] border-t-transparent" />
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-theme p-12 text-center">
          <Layers className="mx-auto h-10 w-10 text-theme-secondary opacity-40" />
          <h3 className="mt-3 text-sm font-bold text-theme-primary">No se encontraron salas</h3>
          <p className="mt-1 text-xs text-theme-secondary">
            Crea una nueva sala para habilitar su ruta personalizada del Calendario CITT.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredRooms.map((room) => {
            const campus = getCampusBySlug(room.campusSlug);
            const dynamicRoute = `/${room.campusSlug}/${room.roomSlug}`;
            const fullUrl = getCalendarUrl(room.campusSlug, room.roomSlug);
            const isCopied = copiedSlug === `${room.campusSlug}/${room.roomSlug}`;

            return (
              <div
                key={room.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-theme-surface p-5 transition shadow-sm ${
                  room.isActive
                    ? 'border-theme hover:border-[#FFB800]/50'
                    : 'border-red-500/20 opacity-75 bg-red-500/[0.02]'
                }`}
              >
                <div>
                  {/* Encabezado: Sede y Estado */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-2.5 py-1 text-[11px] font-bold text-[#FFB800] border border-[#FFB800]/30">
                      <MapPin className="h-3 w-3" />
                      <span>{campus.shortName}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                          room.isActive
                            ? 'bg-[#43B02A]/15 text-[#43B02A]'
                            : 'bg-red-500/15 text-red-500'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            room.isActive ? 'bg-[#43B02A]' : 'bg-red-500'
                          }`}
                        />
                        <span>{room.isActive ? 'TÓTEM ACTIVO' : 'PAUSADO'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Nombre de la Sala */}
                  <h3 className="mt-3 text-base font-black text-theme-primary leading-snug">
                    {room.roomName}
                  </h3>

                  {/* RUTA DINÁMICA DESTACADA */}
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-theme bg-theme-subtle px-3 py-2 font-mono text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[#FFB800] font-bold">RUTA:</span>
                      <span className="text-theme-primary font-bold truncate">{dynamicRoute}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(room.campusSlug, room.roomSlug)}
                      title="Copiar enlace de pantalla"
                      className="ml-2 inline-flex items-center gap-1 rounded-lg bg-theme-surface px-2 py-1 text-[10px] font-bold text-theme-secondary hover:text-[#FFB800] transition"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 text-[#43B02A]" />
                          <span className="text-[#43B02A]">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Ficha técnica de capacidades */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[11px] text-theme-secondary">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-theme bg-theme-subtle px-2 py-1">
                      <Users className="h-3 w-3 text-theme-primary" />
                      <span>{room.capacity} asientos</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-theme bg-theme-subtle px-2 py-1">
                      <Laptop className="h-3 w-3 text-theme-primary" />
                      <span>{room.computersCount} PCs</span>
                    </span>
                    {room.hasMakerTools && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[#FFB800]/10 px-2 py-1 font-bold text-[#FFB800]">
                        <Wrench className="h-3 w-3" />
                        <span>Maker & 3D</span>
                      </span>
                    )}
                    {room.hasIotEquipment && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[#43B02A]/10 px-2 py-1 font-bold text-[#43B02A]">
                        <Radio className="h-3 w-3" />
                        <span>IoT & Sensores</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Acciones del Administrador */}
                <div className="mt-5 flex items-center justify-between border-t border-theme pt-3.5 gap-2">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#1A1A1A] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-black shadow-sm"
                    >
                      <ExternalLink className="h-3 w-3 text-[#FFB800]" />
                      <span>Abrir Tótem</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setQrModalRoom(room)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-secondary hover:text-theme-primary transition"
                    >
                      <QrCode className="h-3 w-3 text-[#307FE2]" />
                      <span>Ver QR</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(room)}
                      title={room.isActive ? 'Pausar Tótem' : 'Activar Tótem'}
                      className={`rounded-xl p-1.5 transition ${
                        room.isActive
                          ? 'text-theme-secondary hover:bg-theme-subtle hover:text-yellow-500'
                          : 'text-[#43B02A] hover:bg-[#43B02A]/10'
                      }`}
                    >
                      <Power className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRoom(room)}
                      title="Eliminar Sala"
                      className="rounded-xl p-1.5 text-theme-secondary hover:bg-red-500/10 hover:text-red-500 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: CREAR NUEVA SALA & RUTA TÓTEM */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-theme bg-theme-surface p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-theme-secondary hover:bg-theme-subtle hover:text-theme-primary"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFB800]/20 text-[#FFB800]">
                <Monitor className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-theme-primary">
                  Crear Sala & Ruta de Calendario
                </h2>
                <p className="text-xs text-theme-secondary">
                  Genera una URL dinámica dedicada para el tótem o pantalla de tu sede.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateRoom} className="mt-5 space-y-4">
              {/* Sede */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary">
                  Sede Duoc UC (Tenant)
                </label>
                <select
                  value={newCampus}
                  onChange={(e) => setNewCampus(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-theme bg-theme-surface p-2.5 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
                >
                  {CITT_CAMPUSES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nombre de la Sala */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary">
                  Nombre Oficial del Espacio / Sala
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sala 312 · Laboratorio Central, FabLab Maker..."
                  value={newRoomName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-theme bg-theme-surface p-2.5 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              {/* Slug de la Ruta URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary">
                  Identificador URL (Slug de Sala)
                </label>
                <div className="mt-1.5 flex items-center rounded-xl border border-theme bg-theme-subtle px-3 py-1.5 font-mono text-xs">
                  <span className="text-theme-secondary">/{newCampus}/</span>
                  <input
                    type="text"
                    required
                    placeholder="sala-312"
                    value={newRoomSlug}
                    onChange={(e) => {
                      setIsSlugManuallyEdited(true);
                      setNewRoomSlug(slugify(e.target.value));
                    }}
                    className="w-full bg-transparent px-1 font-bold text-[#FFB800] focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-theme-secondary">
                  Vista final:{' '}
                  <span className="font-mono text-theme-primary">
                    https://calendario-citt.vercel.app/{newCampus}/{newRoomSlug || '...'}
                  </span>
                </p>
              </div>

              {/* Capacidad y PCs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary">
                    Capacidad (Personas)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-theme bg-theme-surface p-2.5 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary">
                    Computadores Disponibles
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newComputers}
                    onChange={(e) => setNewComputers(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-theme bg-theme-surface p-2.5 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>
              </div>

              {/* Equipamiento Especial */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-theme-secondary">
                  Equipamiento Especial
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-theme-primary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHasMaker}
                      onChange={(e) => setNewHasMaker(e.target.checked)}
                      className="rounded border-theme text-[#FFB800] focus:ring-[#FFB800]"
                    />
                    <span>Herramientas Maker / Impresión 3D</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-theme-primary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHasIot}
                      onChange={(e) => setNewHasIot(e.target.checked)}
                      className="rounded border-theme text-[#43B02A] focus:ring-[#43B02A]"
                    />
                    <span>Equipamiento IoT & Microcontroladores</span>
                  </label>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-xl border border-theme px-4 py-2.5 text-xs font-bold text-theme-secondary hover:bg-theme-subtle"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-black text-[#1A1A1A] hover:bg-[#e0a200] disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isSubmitting ? 'Creando...' : 'Crear y Publicar Ruta'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VER QR TÓTEM PARA IMPRIMIR */}
      {qrModalRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-theme bg-theme-surface p-6 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setQrModalRoom(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-theme-secondary hover:bg-theme-subtle hover:text-theme-primary"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-3 py-1 text-xs font-bold text-[#FFB800]">
              <QrCode className="h-3.5 w-3.5" />
              <span>Tótem Físico & Pantalla CITT</span>
            </span>

            <h3 className="mt-3 text-lg font-black text-theme-primary">
              {qrModalRoom.roomName}
            </h3>
            <p className="text-xs text-theme-secondary mt-0.5">
              {getCampusBySlug(qrModalRoom.campusSlug).name}
            </p>

            <div className="mt-5 flex justify-center">
              <div className="rounded-2xl border-4 border-[#1A1A1A] bg-white p-4 shadow-xl">
                <QRCodeSVG
                  value={getCalendarUrl(qrModalRoom.campusSlug, qrModalRoom.roomSlug)}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            <p className="mt-4 font-mono text-xs text-[#FFB800] font-bold">
              /{qrModalRoom.campusSlug}/{qrModalRoom.roomSlug}
            </p>

            <p className="mt-2 text-xs text-theme-secondary max-w-xs mx-auto">
              Escanea con tu teléfono o abre esta URL directamente en el navegador del tótem o tablet táctil en la puerta de la sala.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-4 py-2.5 text-xs font-bold text-white hover:bg-black transition"
              >
                <Printer className="h-4 w-4 text-[#FFB800]" />
                <span>Imprimir Cartel Tótem</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyLink(qrModalRoom.campusSlug, qrModalRoom.roomSlug)}
                className="inline-flex items-center gap-2 rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs font-bold text-theme-primary hover:bg-theme-subtle transition"
              >
                <Copy className="h-4 w-4" />
                <span>Copiar Enlace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
