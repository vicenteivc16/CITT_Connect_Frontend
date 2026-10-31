'use client';

import React from 'react';
import { SedeWeatherItem } from '@/app/api/weather/route';

interface WeatherTickerProps {
  sedeWeathers: SedeWeatherItem[];
}

export function WeatherTicker({ sedeWeathers }: WeatherTickerProps) {
  if (!sedeWeathers || sedeWeathers.length === 0) return null;

  return (
    <section
      aria-label="Clima en vivo sedes Duoc UC"
      className="rounded-2xl border border-theme bg-theme-surface shadow-theme-card overflow-hidden flex flex-col sm:flex-row items-stretch"
    >
      {/* Badge Fijo Sede Meteorología */}
      <div className="shrink-0 flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2.5 text-[11px] font-black uppercase tracking-wider border-b sm:border-b-0 sm:border-r border-theme z-10 shadow-sm">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#43B02A] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#43B02A]" />
        </span>
        <span className="text-[#FFB800]">CLIMA SEDES HOY</span>
        <span className="hidden md:inline text-white/50">| 18 Sedes</span>
      </div>

      {/* Carril de Marquesina que se desplaza hacia la DERECHA */}
      <div className="relative overflow-hidden whitespace-nowrap flex-1 py-2 bg-theme-subtle/50">
        <div className="animate-ticker-right flex items-center">
          {/* Primer set de sedes */}
          {sedeWeathers.map((sede) => (
            <div
              key={`weather-1-${sede.slug}`}
              className="inline-flex items-center gap-2 px-4 border-r border-theme/40 text-xs font-semibold text-theme-primary"
            >
              <span className="font-bold text-theme-secondary text-[11px]">
                📍 {sede.cityName} ({sede.campusName.replace('Sede ', '')})
              </span>
              <span className="text-base">{sede.conditionEmoji}</span>
              <span className="font-black text-theme-primary">{sede.temp}</span>
              <span className="text-[10px] text-theme-secondary/80 hidden lg:inline">
                · {sede.conditionText}
              </span>
              <span className="text-[#FFB800] text-[10px]">●</span>
            </div>
          ))}

          {/* Segundo set duplicado para scroll infinito continuo hacia la derecha */}
          {sedeWeathers.map((sede) => (
            <div
              key={`weather-2-${sede.slug}`}
              className="inline-flex items-center gap-2 px-4 border-r border-theme/40 text-xs font-semibold text-theme-primary"
            >
              <span className="font-bold text-theme-secondary text-[11px]">
                📍 {sede.cityName} ({sede.campusName.replace('Sede ', '')})
              </span>
              <span className="text-base">{sede.conditionEmoji}</span>
              <span className="font-black text-theme-primary">{sede.temp}</span>
              <span className="text-[10px] text-theme-secondary/80 hidden lg:inline">
                · {sede.conditionText}
              </span>
              <span className="text-[#FFB800] text-[10px]">●</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
