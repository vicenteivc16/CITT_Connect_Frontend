'use client';

import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { DUOC_SCHOOLS } from '@/data/citt-catalog';
import { NewsItem } from '@/app/api/news/route';

interface SchoolHeroCarouselProps {
  heroSchoolIndex: number;
  onSelectSchoolIndex: (index: number) => void;
  onPrevSchool: () => void;
  onNextSchool: () => void;
  currentHeroArticle: NewsItem | null;
  onReadArticle: (article: NewsItem) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function SchoolHeroCarousel({
  heroSchoolIndex,
  onSelectSchoolIndex,
  onPrevSchool,
  onNextSchool,
  currentHeroArticle,
  onReadArticle,
  onMouseEnter,
  onMouseLeave,
}: SchoolHeroCarouselProps) {
  const currentHeroSchool = DUOC_SCHOOLS[heroSchoolIndex];

  return (
    <section
      className="rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-theme-card space-y-6"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Encabezado del Carrusel & Selector de las 9 Escuelas */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFB800] animate-ping" />
            <h2 className="text-xs font-black uppercase tracking-wider text-[#FFB800]">
              Vanguardia Multidisciplinaria · 9 Escuelas Oficiales
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-theme-secondary">
            <span>
              Escuela {heroSchoolIndex + 1} de {DUOC_SCHOOLS.length}:{' '}
              <strong className="text-theme-primary">
                {currentHeroSchool.name}
              </strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onPrevSchool}
                aria-label="Escuela anterior"
                className="rounded-lg border border-theme p-1 hover:bg-theme-subtle"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onNextSchool}
                aria-label="Escuela siguiente"
                className="rounded-lg border border-theme p-1 hover:bg-theme-subtle"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Píldoras de las 9 Escuelas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {DUOC_SCHOOLS.map((school, index) => {
            const isActive = index === heroSchoolIndex;
            return (
              <button
                key={school.slug}
                type="button"
                onClick={() => onSelectSchoolIndex(index)}
                className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#FFB800] text-[#1A1A1A] shadow-sm font-black'
                    : 'border border-theme bg-theme-subtle text-theme-secondary hover:text-theme-primary'
                }`}
              >
                <span>{school.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gran Noticia Destacada con MEDIDAS ESTÁTICAS RÍGIDAS para eliminar descuadres */}
      {currentHeroArticle && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-auto lg:h-[450px]">
          {/* Imagen con Altura Fija y Caption Periodístico */}
          <div className="lg:col-span-7 h-full flex flex-col justify-between">
            <div className="relative h-[340px] sm:h-[380px] lg:h-[400px] w-full overflow-hidden rounded-2xl border border-theme bg-theme-subtle group">
              <img
                src={currentHeroArticle.imageUrl}
                alt={currentHeroArticle.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="rounded-full border border-black/30 bg-black/75 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  {currentHeroArticle.regionLabel}
                </span>
                <span className="rounded-full bg-[#FFB800] px-2.5 py-1 text-xs font-black text-[#1A1A1A]">
                  {currentHeroArticle.schoolName}
                </span>
              </div>
            </div>
            <div className="h-[24px] flex items-center justify-between text-[11px] text-theme-secondary px-1 pt-1">
              <span>Fuente: {currentHeroArticle.sourceName}</span>
              <span>Lectura estimada: {currentHeroArticle.readingTime}</span>
            </div>
          </div>

          {/* Contenido Editorial con Altura Fija y Line Clamps Rígidos */}
          <div className="lg:col-span-5 h-full flex flex-col justify-between py-1">
            <div className="space-y-2">
              <div className="h-[20px] overflow-hidden">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#307FE2]">
                  Reportaje Principal · Escuela de {currentHeroArticle.schoolName}
                </span>
              </div>

              <div className="h-[76px] overflow-hidden">
                <h3
                  onClick={() => onReadArticle(currentHeroArticle)}
                  className="font-serif text-xl sm:text-2xl font-black leading-snug tracking-tight text-theme-primary hover:text-[#307FE2] cursor-pointer transition line-clamp-2"
                >
                  {currentHeroArticle.title}
                </h3>
              </div>

              <div className="h-[44px] overflow-hidden">
                <p className="text-xs sm:text-sm font-bold text-theme-secondary leading-relaxed line-clamp-2">
                  {currentHeroArticle.subtitle}
                </p>
              </div>

              <div className="h-[96px] overflow-hidden">
                <p className="text-xs text-theme-secondary/90 leading-relaxed line-clamp-4">
                  {currentHeroArticle.content}
                </p>
              </div>
            </div>

            {/* Tags & Firma de Autor con Altura Fija */}
            <div className="border-t border-theme pt-3 space-y-2 mt-auto">
              <div className="h-[44px] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-theme-primary line-clamp-1">
                    Por {currentHeroArticle.author}
                  </p>
                  <p className="text-[11px] text-theme-secondary line-clamp-1">
                    {currentHeroArticle.authorTitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onReadArticle(currentHeroArticle)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-theme-canvas transition hover:opacity-90"
                >
                  <span>Leer Crónica</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="h-[24px] overflow-hidden flex flex-wrap gap-1">
                {currentHeroArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-theme bg-theme-subtle px-2 py-0.5 text-[10px] font-semibold text-theme-secondary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
