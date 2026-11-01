'use client';

import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Mail,
  Send,
  Upload,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  FileCheck,
  Download,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { RoomReservation } from './AdminCalendarBookings';
import { updateSupabaseReservation } from '@/lib/supabase/reservations';

interface AdminCittPassModalProps {
  reservation: RoomReservation | null;
  isOpen: boolean;
  onClose: () => void;
  onPassDispatched: (resId: string, passCode: string, passUrl?: string) => void;
}

export function AdminCittPassModal({
  reservation,
  isOpen,
  onClose,
  onPassDispatched,
}: AdminCittPassModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPassUrl, setUploadedPassUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<'generate' | 'upload'>('generate');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen || !reservation) return null;

  const defaultPassCode = `CITTPASS-${reservation.id.slice(0, 6).toUpperCase()}-${new Date().getFullYear()}`;
  const effectivePassCode = reservation.cittPassCode || defaultPassCode;

  const qrPayload = JSON.stringify({
    system: 'CITT_PASS_INSTITUCIONAL',
    org: 'DUOC_UC_CASA_CENTRAL',
    code: effectivePassCode,
    reservationId: reservation.id,
    workshop: reservation.workshopTitle,
    room: reservation.roomName,
    campus: reservation.campusName,
    inCharge: reservation.applicantName,
    email: reservation.applicantEmail || `${reservation.applicantUsername}@duocuc.cl`,
    date: reservation.dateStr,
    hours: reservation.cittHoursGranted,
    issuedBy: 'Coordinación CITT Duoc UC',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedPassUrl(reader.result as string);
      setMode('upload');
    };
    reader.readAsDataURL(file);
  };

  const handleDispatchEmail = async () => {
    setIsSending(true);

    const nowIso = new Date().toISOString();
    // Persistir en Supabase
    await updateSupabaseReservation(reservation.id, {
      cittPassCode: effectivePassCode,
      cittPassUrl: uploadedPassUrl || undefined,
      cittPassSentAt: nowIso,
      status: 'APPROVED',
    });

    setIsSending(false);
    setSentSuccess(true);
    onPassDispatched(reservation.id, effectivePassCode, uploadedPassUrl || undefined);

    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-theme pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFB800] text-[#1A1A1A] font-black text-sm shadow-sm">
              PASS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-[#FFB800] uppercase">
                  Requerimiento Casa Central Duoc UC
                </span>
              </div>
              <h3 className="text-base font-black text-theme-primary">
                Gestor y Despacho de CITT PASS Oficial
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-theme-secondary hover:bg-theme-subtle hover:text-theme-primary transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Resumen de la Reserva */}
        <div className="rounded-2xl border border-theme bg-theme-subtle p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-theme-primary">{reservation.workshopTitle}</span>
            <span className="rounded-full bg-[#307FE2]/15 px-2 py-0.5 text-[11px] font-bold text-[#307FE2]">
              {reservation.roomName}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-theme-secondary text-[11px]">
            <span>Encargado: <strong className="text-theme-primary">{reservation.applicantName}</strong></span>
            <span>Fecha: <strong className="text-theme-primary">{reservation.dateStr} ({reservation.startTime} - {reservation.endTime})</strong></span>
            <span>Quórum: <strong className="text-theme-primary">{reservation.attendeesCount} pers.</strong></span>
          </div>
        </div>

        {/* Selector de Modo: Generación Automática vs Subida Oficial */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode('generate')}
            className={`rounded-2xl border p-3.5 text-left text-xs font-bold transition ${
              mode === 'generate'
                ? 'border-[#FFB800] bg-[#FFB800]/10 text-theme-primary shadow-sm'
                : 'border-theme bg-theme-elevated text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <Sparkles className="h-4 w-4 text-[#FFB800] mb-1.5" />
            <div>Generar QR Dinámico CITT</div>
            <p className="text-[10px] font-normal text-theme-secondary mt-0.5">
              Crea el código institucional con token único de asistencia
            </p>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-2xl border p-3.5 text-left text-xs font-bold transition ${
              mode === 'upload'
                ? 'border-[#307FE2] bg-[#307FE2]/10 text-theme-primary shadow-sm'
                : 'border-theme bg-theme-elevated text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <Upload className="h-4 w-4 text-[#307FE2] mb-1.5" />
            <div>Subir Formato Oficial Duoc</div>
            <p className="text-[10px] font-normal text-theme-secondary mt-0.5">
              {uploadedPassUrl ? 'Archivo cargado con éxito' : 'Adjuntar plantilla de Casa Central (PNG/PDF)'}
            </p>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Previsualización del CITT PASS */}
        <div className="rounded-3xl border-2 border-dashed border-theme bg-theme-elevated p-6 text-center space-y-4">
          <div className="flex items-center justify-between text-left border-b border-theme pb-3">
            <div>
              <span className="font-mono text-xs font-black text-[#FFB800]">
                {effectivePassCode}
              </span>
              <p className="text-[11px] text-theme-secondary">
                Control de Asistencia & Aforo para Salas Maker Duoc UC
              </p>
            </div>
            <span className="rounded-full bg-[#43B02A]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#43B02A]">
              ✓ Válido Casa Central
            </span>
          </div>

          {mode === 'upload' && uploadedPassUrl ? (
            <div className="relative mx-auto max-w-xs overflow-hidden rounded-2xl border border-theme shadow-md">
              <img
                src={uploadedPassUrl}
                alt="CITT PASS Subido"
                className="w-full object-contain max-h-48"
              />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 py-2">
              <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-2xl bg-white p-3 shadow-inner">
                <QRCodeSVG value={qrPayload} size={120} level="M" />
              </div>
              <div className="text-left space-y-1.5 max-w-xs text-xs">
                <div className="inline-flex items-center gap-1.5 font-bold text-theme-primary">
                  <ShieldCheck className="h-4 w-4 text-[#43B02A]" />
                  <span>Escaneo en Tótem o Móvil Docente</span>
                </div>
                <p className="text-[11px] text-theme-secondary leading-relaxed">
                  Este código permite tabular los asistentes en el formulario centralizado exigido por Casa Central para la rendición de fondos e indicadores de innovación.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Estado de Envío */}
        {sentSuccess ? (
          <div className="flex items-center gap-2 rounded-2xl border border-[#43B02A]/40 bg-[#43B02A]/10 p-4 text-xs font-bold text-[#43B02A]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>¡CITT PASS despachado exitosamente por correo electrónico institucional!</span>
          </div>
        ) : (
          <div className="rounded-xl border border-theme bg-theme-subtle p-3 text-xs text-theme-secondary flex items-start gap-2">
            <Mail className="h-4 w-4 text-[#307FE2] shrink-0 mt-0.5" />
            <span>
              El correo se enviará a{' '}
              <strong className="text-theme-primary">
                {reservation.applicantEmail || `${reservation.applicantUsername}@duocuc.cl`}
              </strong>{' '}
              con el CITT PASS adjunto y las instrucciones de llegada y aforo de sala.
            </span>
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-theme">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-theme bg-theme-elevated px-4 py-2 text-xs font-bold text-theme-primary"
          >
            Cerrar
          </button>
          <button
            type="button"
            disabled={isSending || sentSuccess}
            onClick={handleDispatchEmail}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633] disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{isSending ? 'Enviando Correo...' : 'Despachar CITT PASS por Correo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
