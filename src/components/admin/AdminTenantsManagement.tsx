'use client';

import React, { useEffect, useState } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Cpu,
  Layers,
  MapPin,
  Monitor,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Shield,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { CITT_CAMPUSES, getCampusBySlug } from '@/data/citt-catalog';
import { CampusRoom, createSupabaseCampusRoom, getSupabaseCampusRooms } from '@/lib/supabase/tenants';
import { CittMemberProfile } from '@/types/citt';
import { logAuditEvent } from '@/lib/supabase/audit';

interface AdminTenantsManagementProps {
  onSelectTenantForCalendar: (campusSlug: string) => void;
  activeUser: CittMemberProfile;
  profiles: CittMemberProfile[];
}

export function AdminTenantsManagement({
  onSelectTenantForCalendar,
  activeUser,
  profiles,
}: AdminTenantsManagementProps) {
  const [rooms, setRooms] = useState<CampusRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('todas');

  // Modal para agregar nueva sala
  const [modalOpen, setModalOpen] = useState(false);
  const [targetCampus, setTargetCampus] = useState(CITT_CAMPUSES[0].slug);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCapacity, setNewRoomCapacity] = useState(20);
  const [newRoomComputers, setNewRoomComputers] = useState(15);
  const [newHasIot, setNewHasIot] = useState(true);
  const [newHasMaker, setNewHasMaker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fetchRooms = async () => {
    setIsLoading(true);
    const data = await getSupabaseCampusRooms();
    setRooms(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const regions = ['todas', ...Array.from(new Set(CITT_CAMPUSES.map((c) => c.region)))];

  const filteredCampuses = CITT_CAMPUSES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'todas' || c.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    setIsSubmitting(true);
    const created = await createSupabaseCampusRoom({
      campusSlug: targetCampus,
      roomName: newRoomName.trim(),
      capacity: Number(newRoomCapacity),
      computersCount: Number(newRoomComputers),
      hasIotEquipment: newHasIot,
      hasMakerTools: newHasMaker,
      isActive: true,
      totemToken: `totem_${targetCampus}_${Date.now().toString(36)}`,
    });

    if (created) {
      await logAuditEvent({
        campusSlug: targetCampus,
        actorUsername: activeUser.username,
        actorName: activeUser.fullName,
        actorRole: activeUser.role,
        actionType: 'nueva_sala',
        title: `Creación de nueva sala ${created.roomName} en ${getCampusBySlug(targetCampus).shortName}`,
        details: { roomId: created.id, capacity: created.capacity },
      });

      setRooms((prev) => [...prev, created]);
      setFeedbackMsg(`✓ Sala "${created.roomName}" creada con éxito.`);
      setNewRoomName('');
      setTimeout(() => {
        setFeedbackMsg(null);
        setModalOpen(false);
      }, 1200);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera del Módulo de Sedes & Tenants */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FFB800]">
              Arquitectura Multi-Tenant Federada
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-theme-primary tracking-tight">
            Gestión de Sedes CITT & Salas Locales
          </h2>
          <p className="mt-1 text-xs text-theme-secondary max-w-2xl leading-relaxed">
            Cada sede de Duoc UC opera su propio tenant con salas, calendario, tótems y equipo directivo local.
            El Core Dev tiene visibilidad y control sobre todas las sedes del país.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchRooms}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-bold text-theme-primary transition hover:bg-theme-surface"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633] shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Sala CITT</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros de Sedes */}
      <div className="flex flex-col gap-3 rounded-2xl border border-theme bg-theme-surface p-4 shadow-theme-card sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-theme-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar sede por nombre, comuna o región..."
            className="w-full rounded-xl border border-theme bg-theme-subtle py-2 pl-9 pr-3 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-theme-secondary shrink-0">Región:</span>
          {regions.map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => setSelectedRegion(reg)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition whitespace-nowrap ${
                selectedRegion === reg
                  ? 'bg-[#FFB800] text-[#1A1A1A]'
                  : 'border border-theme bg-theme-subtle text-theme-secondary hover:text-theme-primary'
              }`}
            >
              {reg === 'todas' ? 'Todas las Regiones' : reg}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de 18 Tenants / Sedes */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredCampuses.map((campus) => {
          const campusRooms = rooms.filter((r) => r.campusSlug === campus.slug);
          const campusMembers = profiles.filter((p) => p.campusSlug === campus.slug);
          const coordinadores = campusMembers.filter((p) => p.role === 'personal_duoc');
          const lideres = campusMembers.filter((p) => p.role === 'lider_citt');

          return (
            <div
              key={campus.slug}
              className="flex flex-col justify-between rounded-3xl border border-theme bg-theme-surface p-5 shadow-theme-card hover:border-[#FFB800]/50 transition-all duration-200"
            >
              <div>
                {/* Cabecera de la Sede */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-theme">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 font-black text-sm">
                      {campus.shortName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-theme-primary">{campus.name}</h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-theme-secondary mt-0.5">
                        <MapPin className="h-3 w-3 text-[#307FE2]" />
                        <span>Región del {campus.region}</span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-[#43B02A]/10 border border-[#43B02A]/30 px-2 py-0.5 text-[10px] font-bold text-[#43B02A]">
                    Activo
                  </span>
                </div>

                {/* Métricas del Tenant */}
                <div className="grid grid-cols-3 gap-2 py-3.5 my-1 text-center">
                  <div className="rounded-2xl border border-theme bg-theme-subtle p-2">
                    <p className="text-xs font-black text-theme-primary">{campusRooms.length}</p>
                    <p className="text-[10px] text-theme-secondary">Salas CITT</p>
                  </div>
                  <div className="rounded-2xl border border-theme bg-theme-subtle p-2">
                    <p className="text-xs font-black text-theme-primary">{coordinadores.length}</p>
                    <p className="text-[10px] text-theme-secondary">Personal Duoc</p>
                  </div>
                  <div className="rounded-2xl border border-theme bg-theme-subtle p-2">
                    <p className="text-xs font-black text-theme-primary">{lideres.length}</p>
                    <p className="text-[10px] text-theme-secondary">Líderes CITT</p>
                  </div>
                </div>

                {/* Listado de Salas del Tenant */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-bold text-theme-secondary">Espacios de Innovación:</p>
                  {campusRooms.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-theme p-3 text-center text-[11px] text-theme-secondary">
                      No hay salas configuradas en esta sede aún.
                    </div>
                  ) : (
                    campusRooms.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-theme-primary truncate">{r.roomName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-theme-secondary mt-0.5">
                            <span>Aforo: {r.capacity}</span>
                            <span>·</span>
                            <span>{r.computersCount} PCs</span>
                            {r.hasIotEquipment && <span className="text-[#307FE2] font-semibold">· IoT</span>}
                            {r.hasMakerTools && <span className="text-[#FFB800] font-semibold">· Maker</span>}
                          </div>
                        </div>
                        <span className="shrink-0 text-[10px] font-mono text-theme-secondary bg-black/30 px-1.5 py-0.5 rounded">
                          {r.totemToken ? '✓ Tótem' : 'Sin tótem'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Botón de Acción para Calendario Local */}
              <div className="pt-4 border-t border-theme mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectTenantForCalendar(campus.slug)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-theme-subtle border border-theme py-2 text-xs font-bold text-theme-primary transition hover:border-[#FFB800] hover:text-[#FFB800]"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Gestionar Calendario Sede</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetCampus(campus.slug);
                    setModalOpen(true);
                  }}
                  className="rounded-xl border border-theme bg-theme-subtle p-2 text-theme-secondary transition hover:text-theme-primary hover:border-[#FFB800]"
                  title="Añadir Sala a esta Sede"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Crear Sala en Sede */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-theme bg-theme-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-theme pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFB800] text-[#1A1A1A]">
                  <Building2 className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-theme-primary">
                  Añadir Sala o Laboratorio CITT
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-theme-secondary hover:text-theme-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {feedbackMsg && (
              <div className="rounded-xl border border-[#43B02A]/40 bg-[#43B02A]/10 p-3 text-xs font-bold text-[#43B02A]">
                {feedbackMsg}
              </div>
            )}

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-theme-primary mb-1">
                  Sede Duoc UC (Tenant) *
                </label>
                <select
                  value={targetCampus}
                  onChange={(e) => setTargetCampus(e.target.value)}
                  className="w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
                >
                  {CITT_CAMPUSES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} ({c.region})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-theme-primary mb-1">
                  Nombre de la Sala / Espacio *
                </label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Ej: Sala CITT 312, Laboratorio Maker, Hub IoT..."
                  className="w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-theme-primary mb-1">
                    Aforo Máximo (Personas)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                    className="w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-theme-primary mb-1">
                    Computadores Disponibles
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={newRoomComputers}
                    onChange={(e) => setNewRoomComputers(Number(e.target.value))}
                    className="w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-theme-primary">
                  Equipamiento Especializado de la Sala:
                </label>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-theme-primary font-medium">
                    <input
                      type="checkbox"
                      checked={newHasIot}
                      onChange={(e) => setNewHasIot(e.target.checked)}
                      className="rounded border-theme text-[#FFB800] focus:ring-[#FFB800]"
                    />
                    <span>Equipos IoT / Microcontroladores</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-theme-primary font-medium">
                    <input
                      type="checkbox"
                      checked={newHasMaker}
                      onChange={(e) => setNewHasMaker(e.target.checked)}
                      className="rounded border-theme text-[#FFB800] focus:ring-[#FFB800]"
                    />
                    <span>Fabricación Digital / Maker</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-theme">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-theme bg-theme-subtle px-4 py-2 text-xs font-bold text-theme-secondary hover:text-theme-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                >
                  {isSubmitting ? 'Guardando...' : 'Crear Sala en Sede'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
