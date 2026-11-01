'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { CITT_CAMPUSES } from '@/data/citt-catalog';
import { SupabaseAdminBlock, createSupabaseAdminBlock } from '@/lib/supabase/reservations';

interface AdminBlockDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlockCreated: (block: SupabaseAdminBlock) => void;
}

const COMMON_REASONS = [
  'Mantenimiento preventivo de impresoras 3D y kits IoT',
  'Jornada de capacitación docente inter-sedes',
  'Feriado nacional o receso institucional Duoc UC',
  'Uso exclusivo para Hackathon Nacional CITT',
  'Auditoría y mantención de redes de telecomunicaciones',
];

export function AdminBlockDayModal({
  isOpen,
  onClose,
  onBlockCreated,
}: AdminBlockDayModalProps) {
  const [campus, setCampus] = useState('San Bernardo');
  const [room, setRoom] = useState('Sala 312 (Laboratorio CITT)');
  const [blockDate, setBlockDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [isFullDay, setIsFullDay] = useState(true);
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('21:00');
  const [reason, setReason] = useState(COMMON_REASONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate || !reason.trim()) return;

    setIsSubmitting(true);
    const newBlock: Omit<SupabaseAdminBlock, 'id' | 'createdAt'> = {
      campus,
      room,
      blockDate,
      startTime: isFullDay ? '08:30' : startTime,
      endTime: isFullDay ? '21:00' : endTime,
      reason: reason.trim(),
      createdBy: 'Personal Duoc UC (Admin CITT)',
    };

    const res = await createSupabaseAdminBlock(newBlock);
    setIsSubmitting(false);

    if (res.success && res.data) {
      onBlockCreated(res.data);
    } else {
      // Fallback local
      onBlockCreated({
        ...newBlock,
        id: `blk-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-6"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-theme pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/15 text-red-500 font-bold">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-theme-primary">
                Bloquear Día o Franja Horaria de Sala
              </h3>
              <p className="text-xs text-theme-secondary">
                Invalida la reserva en el calendario satélite y tótem exterior
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-theme-secondary hover:bg-theme-subtle hover:text-theme-primary transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Sede Duoc UC
              </label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
              >
                {CITT_CAMPUSES.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-primary">
                Espacio / Sala
              </label>
              <input
                type="text"
                required
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-primary">
              Fecha a Bloquear
            </label>
            <input
              type="date"
              required
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
            />
          </div>

          {/* Toggle Día Completo vs Rango Horario */}
          <div className="flex items-center justify-between rounded-2xl border border-theme bg-theme-subtle p-3.5 text-xs">
            <span className="font-bold text-theme-primary">
              Bloquear Día Completo (Jornada Diurna y Vespertina)
            </span>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isFullDay}
                onChange={(e) => setIsFullDay(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-5 w-9 rounded-full bg-theme-elevated peer-checked:bg-red-500 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>

          {!isFullDay && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-theme-primary">
                  Hora Inicio
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-theme-primary">
                  Hora Término
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-theme-primary">
              Motivo del Bloqueo Institucional
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej. Mantención general de equipos"
              className="mt-1.5 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {COMMON_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className="rounded-lg border border-theme bg-theme-subtle px-2 py-0.5 text-[10px] text-theme-secondary hover:text-theme-primary"
                >
                  + {r.split(' ')[0]} {r.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-theme">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-theme bg-theme-elevated px-4 py-2 text-xs font-bold text-theme-primary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-500 px-5 py-2 text-xs font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Guardando...' : 'Aplicar Bloqueo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
