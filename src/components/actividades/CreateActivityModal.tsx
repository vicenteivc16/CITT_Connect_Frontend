'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { DUOC_SCHOOLS, CITT_CAMPUSES } from '@/data/citt-catalog';
import {
  ActivityModality,
  ActivityStudyMaterial,
  CittActivity,
  DuocSchoolSlug,
} from '@/types/citt';
import { useCittNetwork } from '@/context/CittNetworkContext';

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateActivityModal({
  isOpen,
  onClose,
}: CreateActivityModalProps) {
  const { activeUser, addActivity } = useCittNetwork();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [schoolSlug, setSchoolSlug] = useState<DuocSchoolSlug>('informatica');
  const [campusSlug, setCampusSlug] = useState('san-bernardo');
  const [roomLocation, setRoomLocation] = useState('Sala CITT 312');
  const [modality, setModality] = useState<ActivityModality>('presencial');

  // Horarios y Frecuencia
  const [daysDescription, setDaysDescription] = useState('Martes y Jueves');
  const [sessionTime, setSessionTime] = useState('17:00 - 18:30');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [totalHoursCitt, setTotalHoursCitt] = useState(16);

  // Aforo Inteligente y Cálculo Dinámico
  const [capacityPerSession, setCapacityPerSession] = useState(15);
  const [sessionsCountPerWeek, setSessionsCountPerWeek] = useState(2);

  // Cupo Total = Aforo de sala * turnos semanales
  const calculatedTotalSeats = capacityPerSession * sessionsCountPerWeek;

  // Material de estudio inicial
  const [materials, setMaterials] = useState<
    Array<{ title: string; description: string; type: ActivityStudyMaterial['type']; url: string }>
  >([
    {
      title: 'Guía de Inicio y Requisitos Técnicos',
      description: 'Documento base con software y dependencias previas al taller.',
      type: 'pdf',
      url: 'https://citt.duoc.cl/docs/starter-guide.pdf',
    },
  ]);

  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatType, setNewMatType] = useState<ActivityStudyMaterial['type']>('pdf');
  const [newMatUrl, setNewMatUrl] = useState('');

  if (!isOpen) return null;

  const handleAddMaterial = () => {
    if (!newMatTitle.trim() || !newMatUrl.trim()) return;
    setMaterials([
      ...materials,
      {
        title: newMatTitle.trim(),
        description: 'Recurso de estudio cargado por el instructor.',
        type: newMatType,
        url: newMatUrl.trim(),
      },
    ]);
    setNewMatTitle('');
    setNewMatUrl('');
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const formattedMaterials: ActivityStudyMaterial[] = materials.map((m, idx) => ({
      id: `mat_${Date.now()}_${idx}`,
      title: m.title,
      description: m.description,
      type: m.type,
      url: m.url,
      uploadedAt: 'Hoy',
    }));

    addActivity({
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      detailedDescription: detailedDescription.trim() || description.trim(),
      schoolSlug,
      campusSlug,
      roomLocation,
      modality,
      status: 'abierto',
      instructorName: activeUser.fullName,
      instructorRole: activeUser.role,
      instructorUsername: activeUser.username,
      instructorAvatarUrl: activeUser.avatarUrl,
      capacityPerSession,
      sessionsCountPerWeek,
      totalSeats: calculatedTotalSeats,
      schedule: {
        daysDescription,
        sessionTime,
        frequencyPerWeek: sessionsCountPerWeek,
        durationWeeks,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + durationWeeks * 7 * 86400000).toISOString().split('T')[0],
        totalHoursCitt,
      },
      studyMaterials: formattedMaterials,
      tags: ['Taller CITT', 'Innovación Duoc', 'Horas CITT'],
      coverImageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between pb-4 border-b border-theme">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-[#FFB800]/10 p-2 text-[#FFB800]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-theme-primary">
                Organizar Nueva Actividad o Taller CITT
              </h2>
              <p className="text-xs text-theme-secondary">
                Configura aforo, días, distribución de cupos y material de estudio.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-theme-secondary hover:bg-theme-subtle hover:text-theme-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Título */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-theme-secondary mb-1">
              Título de la Actividad / Taller
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Bootcamp de Robótica Autónoma con ROS2"
              className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
            />
          </div>

          {/* Escuela y Sede */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-theme-secondary mb-1">
                Escuela Duoc UC
              </label>
              <select
                value={schoolSlug}
                onChange={(e) => setSchoolSlug(e.target.value as DuocSchoolSlug)}
                className="w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
              >
                {DUOC_SCHOOLS.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-theme-secondary mb-1">
                Sede Institucional
              </label>
              <select
                value={campusSlug}
                onChange={(e) => setCampusSlug(e.target.value)}
                className="w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
              >
                {CITT_CAMPUSES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-theme-secondary mb-1">
                Modalidad
              </label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value as ActivityModality)}
                className="w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
              >
                <option value="presencial">Presencial en Sala</option>
                <option value="hibrido">Híbrido (Sala + Teams)</option>
                <option value="online">Online / Streaming</option>
              </select>
            </div>
          </div>

          {/* Espacio Físico */}
          <div>
            <label className="block text-xs font-black uppercase text-theme-secondary mb-1">
              Espacio Físico / Laboratorio
            </label>
            <input
              type="text"
              value={roomLocation}
              onChange={(e) => setRoomLocation(e.target.value)}
              placeholder="Ej. Sala CITT 312 · Laboratorio Maker"
              className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
            />
          </div>

          {/* Frecuencia, Días y Horas CITT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-theme-secondary mb-1">
                Días de la Semana
              </label>
              <input
                type="text"
                value={daysDescription}
                onChange={(e) => setDaysDescription(e.target.value)}
                placeholder="Ej. Martes y Jueves"
                className="w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-theme-secondary mb-1">
                Horario de Sesión
              </label>
              <input
                type="text"
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                placeholder="Ej. 17:00 - 18:30"
                className="w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-theme-secondary mb-1">
                Horas CITT Totales
              </label>
              <input
                type="number"
                min={1}
                max={40}
                value={totalHoursCitt}
                onChange={(e) => setTotalHoursCitt(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>
          </div>

          {/* SECCIÓN CLAVE: Calculadora de Aforo y Distribución de Cupos */}
          <div className="rounded-2xl border border-[#FFB800]/40 bg-[#FFB800]/10 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#FFB800]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-theme-primary">
                Cálculo de Aforo y Distribución de Cupos
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-theme-secondary mb-1">
                  Aforo por Sala/Sesión (personas)
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={capacityPerSession}
                  onChange={(e) => setCapacityPerSession(parseInt(e.target.value, 10) || 1)}
                  className="w-full rounded-xl border border-theme bg-theme-surface px-3 py-2 text-xs font-black text-theme-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-theme-secondary mb-1">
                  Sesiones por Semana
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={sessionsCountPerWeek}
                  onChange={(e) => setSessionsCountPerWeek(parseInt(e.target.value, 10) || 1)}
                  className="w-full rounded-xl border border-theme bg-theme-surface px-3 py-2 text-xs font-black text-theme-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-xl bg-theme-surface p-3 text-xs flex items-center justify-between border border-theme">
              <span className="text-theme-secondary font-medium">
                Distribución ({capacityPerSession} aforo × {sessionsCountPerWeek} veces/semana):
              </span>
              <span className="font-black text-[#FFB800] text-sm">
                {calculatedTotalSeats} Cupos Totales
              </span>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-black uppercase text-theme-secondary mb-1">
              Descripción Breve
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Resume el objetivo del taller y a quién está dirigido..."
              className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
            />
          </div>

          {/* Material de Estudio */}
          <div className="space-y-3 pt-2 border-t border-theme">
            <label className="block text-xs font-black uppercase text-theme-secondary">
              Material de Estudio Inicial (PDFs, GitHub, Diapositivas)
            </label>

            <div className="space-y-2">
              {materials.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs"
                >
                  <div className="truncate min-w-0">
                    <span className="font-bold text-theme-primary block truncate">{m.title}</span>
                    <span className="text-[10px] text-theme-secondary truncate block">{m.url}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(idx)}
                    className="text-red-500 hover:text-red-700 p-1 shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Agregar nuevo recurso */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
              <input
                type="text"
                placeholder="Nombre del recurso"
                value={newMatTitle}
                onChange={(e) => setNewMatTitle(e.target.value)}
                className="sm:col-span-2 rounded-xl border border-theme bg-theme-subtle px-3 py-1.5 text-xs text-theme-primary focus:outline-none"
              />
              <select
                value={newMatType}
                onChange={(e) => setNewMatType(e.target.value as ActivityStudyMaterial['type'])}
                className="rounded-xl border border-theme bg-theme-subtle px-2 py-1.5 text-xs font-bold text-theme-primary focus:outline-none"
              >
                <option value="pdf">PDF</option>
                <option value="github">GitHub</option>
                <option value="slides">Diapositivas</option>
                <option value="video">Video</option>
              </select>
              <button
                type="button"
                onClick={handleAddMaterial}
                className="rounded-xl bg-theme-subtle border border-theme px-3 py-1.5 text-xs font-bold text-theme-primary hover:bg-[#FFB800] hover:text-[#1A1A1A] transition"
              >
                + Añadir
              </button>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-theme flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-theme bg-theme-subtle px-4 py-2.5 text-xs font-bold text-theme-secondary hover:text-theme-primary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-black text-[#1A1A1A] hover:bg-[#ffc633] shadow-md transition"
            >
              Publicar Actividad en CITT Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
