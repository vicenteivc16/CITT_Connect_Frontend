'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, GraduationCap, School, Sparkles } from 'lucide-react';

export interface PromoSlide {
  id: string;
  category: string;
  headline: string;
  subheadline: string;
  description: string;
  image: string;
  statsPill: string;
  badgeColor: string;
}

export const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'red-nacional',
    category: 'RED INTER-SEDES DUOC UC',
    headline: '18 Sedes Conectadas en un Ecosistema Único',
    subheadline: 'Innovación Abierta & Transferencia Tecnológica',
    description:
      'Colabora con estudiantes, docentes y coordinadores de todo el país. Participa en proyectos reales, hackathons y desafíos multidisciplinarios de alto impacto.',
    image: '/assets/citt-hero-lobby.webp',
    statsPill: '18 Sedes Activas · 9 Escuelas · +10,000 Horas CITT',
    badgeColor: '#FFB800',
  },
  {
    id: 'prototipado-id',
    category: 'I+D APLICADA & PROTOTIPADO',
    headline: 'Laboratorios Vivos & Créditos de Innovación',
    subheadline: 'De la Idea al Producto Tecnológico Validado',
    description:
      'Desde robótica y gemelos digitales hasta inteligencia artificial y soluciones para la industria. Valida horas de laboratorio y obtén reconocimiento oficial en tu historial académico.',
    image: '/assets/banner-iot.webp',
    statsPill: 'Robótica · IoT · Inteligencia Artificial · AgroTech',
    badgeColor: '#307FE2',
  },
  {
    id: 'identidad-nfc',
    category: 'IDENTIDAD INSTITUCIONAL INTEROPERABLE',
    headline: 'Tu Pasaporte Tecnológico Duoc UC',
    subheadline: 'Credencial Digital con Autenticación Microsoft 365',
    description:
      'Acceso unificado mediante tu cuenta institucional. Portafolio público de proyectos, verificación de roles, trazabilidad de competencias y soporte para hardware con chip NFC.',
    image: '/assets/banner-comunidad.webp',
    statsPill: 'Microsoft 365 SSO · Chip NFC · Trazabilidad Académica',
    badgeColor: '#107C41',
  },
];

export function AuthPromoGallery() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const slide = PROMO_SLIDES[currentSlide];

  return (
    <div
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-theme bg-theme-surface p-8 shadow-theme-card lg:col-span-6 xl:col-span-7 min-h-[580px] lg:min-h-[680px]"
    >
      {/* Fondo con Imagen en Rotación y Gradiente Institucional */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.image}
          alt={slide.headline}
          className="h-full w-full object-cover transition-opacity duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/40" />
      </div>

      {/* Cabecera Superior de la Galería */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
          <img
            src="/assets/Logo_DuocUC.svg.webp"
            alt="Duoc UC"
            className="h-4 w-auto brightness-200"
          />
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
            CITT Connect Oficial
          </span>
        </div>

        {/* Indicador de Rotación Automática */}
        <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-semibold text-white/80 backdrop-blur-md">
          <Sparkles className="h-3 w-3 text-[#FFB800]" />
          <span>Ecosistema Vivo</span>
        </div>
      </div>

      {/* Contenido Principal de la Diapositiva */}
      <div className="relative z-10 space-y-4 pt-24 text-white">
        <span
          style={{ borderColor: slide.badgeColor, color: slide.badgeColor }}
          className="inline-block rounded-full border bg-black/50 px-3 py-1 text-[11px] font-black uppercase tracking-wider backdrop-blur-md"
        >
          {slide.category}
        </span>

        <h1 className="text-2xl font-black leading-tight sm:text-3xl md:text-4xl text-white">
          {slide.headline}
        </h1>

        <p className="text-sm font-semibold text-[#FFB800] sm:text-base">
          {slide.subheadline}
        </p>

        <p className="max-w-xl text-xs sm:text-sm text-white/85 leading-relaxed">
          {slide.description}
        </p>

        {/* Pill de métricas institucionales */}
        <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-3.5 py-2 text-xs font-bold text-white/95 backdrop-blur-md">
          <School className="h-3.5 w-3.5 text-[#FFB800]" />
          <span>{slide.statsPill}</span>
        </div>
      </div>

      {/* Controles de Navegación de la Galería */}
      <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/15">
        <div className="flex items-center gap-2">
          {PROMO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Ver diapositiva ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-8 bg-[#FFB800]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length
              )
            }
            aria-label="Diapositiva anterior"
            className="rounded-xl border border-white/20 bg-black/40 p-2 text-white/90 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length)
            }
            aria-label="Siguiente diapositiva"
            className="rounded-xl border border-white/20 bg-black/40 p-2 text-white/90 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
