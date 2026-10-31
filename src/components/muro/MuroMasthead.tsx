'use client';

import React from 'react';
import { Flame, Plus, ShieldCheck } from 'lucide-react';

interface MuroMastheadProps {
  onOpenCompose: () => void;
  tickerHeadlines: string[];
}

export function MuroMasthead({ onOpenCompose, tickerHeadlines }: MuroMastheadProps) {
  return (
    <header className="rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-theme-card text-center space-y-5">
      {/* Fila Superior: Fechador Oficial, Telemetría y Botón de Despacho */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-theme pb-4 text-xs font-semibold text-theme-secondary">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="font-bold text-theme-primary">
            Sábado, 31 de Octubre de 2026
          </span>
          <span>·</span>
          <span>Edición Nacional Nº 1,428</span>
          <span>·</span>
          <span>Depósito Legal CITT-2026-CL</span>
          <span>·</span>
          <span className="rounded-full bg-[#107C41]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#107C41]">
            ● 18 Sedes Conectadas
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden lg:inline-block text-[11px] text-theme-secondary/80">
            Información 100% en Español
          </span>
          <button
            type="button"
            onClick={onOpenCompose}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-3.5 py-1.5 text-xs font-black text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633] active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Redactar Despacho / Noticia</span>
          </button>
        </div>
      </div>

      {/* Gran Cabecera Artística & Disruptiva con Letra Monumental "E" */}
      <div className="py-2 space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 px-2 sm:px-6">
          {/* Bloque Izquierdo: Logo Duoc UC Oficial en Alta Resolución */}
          <div className="flex flex-col items-center lg:items-start gap-1">
            <img
              src="/assets/Logo_DuocUC.svg.webp"
              alt="Logo Oficial Duoc UC"
              className="h-9 sm:h-11 w-auto object-contain brightness-100 dark:brightness-110 drop-shadow-sm"
            />
            <span className="text-[10px] font-bold tracking-wider text-theme-secondary uppercase">
              Vicerrectoría Académica & CITT
            </span>
          </div>

          {/* Centro: Título Monumental Disruptivo con Drop-Cap y CITT Subrayado en Amarillo */}
          <div className="flex items-center justify-center">
            <div className="flex items-baseline">
              {/* Letra Inicial Gigante Monumental "E" */}
              <span className="font-serif text-7xl sm:text-8xl lg:text-9xl font-black text-theme-primary leading-none select-none tracking-tighter drop-shadow-sm pr-1">
                E
              </span>

              {/* Resto del Titular en Tipografía Broadsheet Clásica */}
              <div className="text-left flex flex-col justify-end">
                <div className="flex items-baseline flex-wrap gap-x-2">
                  <span className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-theme-primary uppercase">
                    L DIARIO
                  </span>

                  {/* CITT con Subrayado Amarillo Marcador Vibrante */}
                  <span className="relative inline-block">
                    <span className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-theme-primary uppercase px-1">
                      CITT
                    </span>
                    {/* Trazo Amarillo Highlighter de Énfasis */}
                    <span
                      className="absolute -bottom-1 left-0 w-full h-3 sm:h-4 bg-[#FFB800] -rotate-1 rounded-sm opacity-90 -z-0"
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <p className="font-serif italic text-xs sm:text-sm text-theme-secondary mt-1">
                  La Gran Gaceta Tecnológica y de Innovación Abierta de Duoc UC
                </p>
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Sello Oficial Circular de Prensa CITT */}
          <div className="hidden lg:flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#FFB800]/50 p-2.5 text-center">
            <ShieldCheck className="h-6 w-6 text-[#FFB800]" />
            <span className="text-[10px] font-black uppercase text-theme-primary tracking-wider mt-1">
              PRENSA DUOC UC
            </span>
            <span className="text-[9px] text-theme-secondary font-bold">
              Neutralidad Verificada
            </span>
          </div>
        </div>

        {/* Doble Línea Clásica de Prensa con Principios Editoriales */}
        <div className="border-t-2 border-b-4 border-double border-theme py-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] font-black uppercase tracking-widest text-theme-secondary px-2">
            <span>Información Verificada · Solo en Español</span>
            <span className="hidden md:inline">●</span>
            <span>Foco Prioritario en Chile & Vanguardia Global</span>
            <span className="hidden md:inline">●</span>
            <span>18 Sedes Conectadas en Directo</span>
          </div>
        </div>
      </div>

      {/* Marquesina de Último Minuto (Ticker Infinito) */}
      <div className="flex items-center gap-3 overflow-hidden rounded-2xl border border-theme bg-theme-subtle p-2 text-xs">
        <div className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#E87722] px-3 py-1 font-black text-white uppercase tracking-wider text-[11px]">
          <Flame className="h-3.5 w-3.5 animate-bounce" />
          <span>ÚLTIMO MINUTO</span>
        </div>

        <div className="relative w-full overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee font-medium text-theme-primary">
            {tickerHeadlines.map((headline, idx) => (
              <span key={idx} className="mx-4 inline-flex items-center gap-3">
                <span>{headline}</span>
                <span className="text-[#FFB800]">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
