'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Users,
  Award,
  BookOpen,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Radio,
  Clock,
  Plus,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';

interface ActivitiesHeroProps {
  totalWorkshops: number;
  availableSeats: number;
  totalStudyMaterials: number;
  onOpenCreate?: () => void;
  isPrivileged?: boolean;
}

export function ActivitiesHero({
  totalWorkshops,
  availableSeats,
  totalStudyMaterials,
  onOpenCreate,
  isPrivileged,
}: ActivitiesHeroProps) {
  const { profiles, activeUser, isAuthenticated } = useCittNetwork();

  // Muestra de avatares de la comunidad
  const communityFaces = profiles.slice(0, 5);

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-theme bg-theme-surface shadow-2xl transition-all">
      {/* Fondos y gradientes ambientales sutiles */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#FFB800]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#307FE2]/10 blur-3xl pointer-events-none" />

      {/* Grid Principal Asimétrico */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 items-center">
        {/* Columna Izquierda: Mensaje Comunitario & Misión */}
        <div className="lg:col-span-7 space-y-6">
          {/* Badge de Pulso en Vivo */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-theme bg-theme-subtle px-3.5 py-1.5 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#43B02A] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#43B02A]" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-theme-primary">
              Comunidad CITT en Vivo · 18 Sedes Duoc UC
            </span>
          </div>

          {/* Título de Autoridad con Tipografía Editorial Duoc */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-theme-primary leading-[1.12]">
              Aprende construyendo.{' '}
              <span className="underline decoration-[#FFB800] decoration-wavy decoration-2">
                Conecta con la innovación real.
              </span>
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-theme-secondary max-w-xl">
              Workshops prácticos de robótica, ciberseguridad, diseño 3D e inteligencia artificial dictados por líderes estudiantiles y docentes. Inscríbete con tu credencial digital, accede a repositorios y acredita <strong>Horas CITT oficiales</strong>.
            </p>
          </div>

          {/* Social Proof Comunitario: Avatares de Alumnos Reales */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
            <div className="flex items-center -space-x-3">
              {communityFaces.map((member) => (
                <img
                  key={member.id}
                  src={member.avatarUrl || '/assets/citt-logo.webp'}
                  alt={member.fullName}
                  title={`${member.fullName} · ${member.careerTitle}`}
                  className="h-10 w-10 rounded-full object-cover border-2 border-theme-surface shadow-md transition-transform hover:scale-110 hover:z-20"
                />
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-theme-surface bg-[#FFB800] text-[11px] font-black text-[#1A1A1A] shadow-md">
                +140
              </div>
            </div>

            <div className="text-xs text-theme-secondary leading-snug">
              <strong className="text-theme-primary font-bold block">
                Comunidad multidisciplinaria activa
              </strong>
              Estudiantes de 9 escuelas colaborando en laboratorios físicos CITT.
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {isPrivileged && onOpenCreate && (
              <button
                type="button"
                onClick={onOpenCreate}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#FFB800] px-5 py-3 text-xs font-black text-[#1A1A1A] shadow-md transition hover:bg-[#ffc633]"
              >
                <Plus className="h-4 w-4" />
                <span>Organizar Actividad o Taller</span>
              </button>
            )}

            {!isAuthenticated ? (
              <Link
                href="/acceso?redirect=/actividades"
                className="inline-flex items-center gap-2 rounded-2xl border border-theme bg-theme-subtle px-5 py-3 text-xs font-bold text-theme-primary transition hover:bg-theme-surface shadow-sm"
              >
                <span>Acceder con mi Cuenta Duoc UC</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[#43B02A]/30 bg-[#43B02A]/10 px-4 py-2.5 text-xs font-bold text-[#43B02A]">
                <ShieldCheck className="h-4 w-4" />
                <span>Credencial CITT Activa: @{activeUser.username}</span>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Tarjeta Visual de Comunidad & Radar de Salas */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-3xl border border-theme bg-theme-subtle p-5 sm:p-6 shadow-xl space-y-5">
            {/* Imagen de Ambiente Comunitario de Laboratorio Maker */}
            <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-black">
              <img
                src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
                alt="Laboratorio CITT Duoc UC"
                className="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="rounded-full bg-[#FFB800] px-2.5 py-1 text-[10px] font-black text-[#1A1A1A] shadow-sm">
                  DESTACADO CITT
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-bold text-[#FFB800] uppercase tracking-wider block">
                  Próxima Sesión en Sala
                </span>
                <p className="text-xs sm:text-sm font-black truncate">
                  Bootcamp IoT & LoRaWAN · Sala CITT 312
                </p>
              </div>
            </div>

            {/* Radar de Sedes Activas con CITT */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-theme-primary">
                <span className="flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-[#307FE2]" />
                  <span>Sedes con Salas CITT Activas</span>
                </span>
                <span className="text-[11px] text-[#43B02A] font-black">● 100% Operativo</span>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="rounded-lg border border-theme bg-theme-surface px-2.5 py-1 font-semibold text-theme-primary">
                  🏛️ San Bernardo
                </span>
                <span className="rounded-lg border border-theme bg-theme-surface px-2.5 py-1 font-semibold text-theme-primary">
                  ⚙️ Plaza Vespucio
                </span>
                <span className="rounded-lg border border-theme bg-theme-surface px-2.5 py-1 font-semibold text-theme-primary">
                  🌐 Viña del Mar
                </span>
                <span className="rounded-lg border border-theme bg-theme-surface px-2.5 py-1 font-semibold text-theme-primary">
                  🛡️ Maipú
                </span>
                <span className="rounded-lg border border-theme bg-theme-surface px-2.5 py-1 font-semibold text-theme-primary">
                  ⚡ San Joaquín
                </span>
              </div>
            </div>

            {/* Garantía de Aforo & Certificación */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-theme">
              <div className="rounded-xl border border-theme bg-theme-surface p-2.5">
                <span className="text-[10px] font-bold uppercase text-theme-secondary block">
                  Aforo por Sala
                </span>
                <span className="text-xs font-black text-theme-primary flex items-center gap-1 mt-0.5">
                  <Users className="h-3.5 w-3.5 text-[#307FE2]" />
                  15 pers. / turno
                </span>
              </div>

              <div className="rounded-xl border border-theme bg-theme-surface p-2.5">
                <span className="text-[10px] font-bold uppercase text-theme-secondary block">
                  Cómputo Oficial
                </span>
                <span className="text-xs font-black text-[#43B02A] flex items-center gap-1 mt-0.5">
                  <Award className="h-3.5 w-3.5" />
                  Horas CITT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Franja Inferior de Pilares de la Comunidad */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-theme bg-theme-subtle/50 divide-y sm:divide-y-0 sm:divide-x divide-theme">
        <div className="p-4 sm:p-5 flex items-center gap-3">
          <div className="rounded-xl bg-[#FFB800]/15 p-2.5 text-[#FFB800] shrink-0">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-black text-theme-primary block">
              {totalWorkshops} Talleres Activos
            </span>
            <span className="text-[11px] text-theme-secondary">
              Robótica, IA, 3D e IoT
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex items-center gap-3">
          <div className="rounded-xl bg-[#43B02A]/15 p-2.5 text-[#43B02A] shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-black text-theme-primary block">
              {availableSeats} Cupos Libres
            </span>
            <span className="text-[11px] text-theme-secondary">
              Aforo distribuido por sala
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex items-center gap-3">
          <div className="rounded-xl bg-[#307FE2]/15 p-2.5 text-[#307FE2] shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-black text-theme-primary block">
              {totalStudyMaterials} Recursos de Estudio
            </span>
            <span className="text-[11px] text-theme-secondary">
              PDFs, GitHub & Slides
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex items-center gap-3">
          <div className="rounded-xl bg-[#FFB800]/15 p-2.5 text-[#FFB800] shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-black text-theme-primary block">
              Acreditación Directa
            </span>
            <span className="text-[11px] text-theme-secondary">
              Al validar en Tótem CITT
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
