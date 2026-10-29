'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Compass,
  MapPin,
  Sparkles,
  Target,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import {
  CITT_BLOG_ARTICLES,
  CITT_PINTEREST_PINS,
  DUOC_SCHOOLS,
  getCampusBySlug,
  getSchoolBySlug,
} from '@/data/citt-catalog';
import { CittBlogArticle, CittPinterestPin } from '@/types/citt';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';

const PINTEREST_CATEGORIES: Array<'Todos' | CittPinterestPin['tag']> = [
  'Todos',
  'Robótica & IoT',
  'Ciberseguridad',
  'IA & Software',
  'Diseño & Fabricación 3D',
  'Comunidad Inter-Sedes',
];

export default function EditorialHomePage() {
  const [selectedPinTag, setSelectedPinTag] = useState<
    'Todos' | CittPinterestPin['tag']
  >('Todos');
  const [activeArticle, setActiveArticle] = useState<CittBlogArticle | null>(
    null
  );

  const featuredArticle = CITT_BLOG_ARTICLES[0];
  const editorialChronicles = CITT_BLOG_ARTICLES.slice(1);

  const filteredPins = useMemo(() => {
    if (selectedPinTag === 'Todos') return CITT_PINTEREST_PINS;
    return CITT_PINTEREST_PINS.filter((pin) => pin.tag === selectedPinTag);
  }, [selectedPinTag]);

  const featuredCampus = getCampusBySlug(featuredArticle.campusSlug);

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Full-Screen (100dvh) Hero Institucional con Fondo Arquitectónico CITT (.webp + Soft Blur) */}
      <section
        aria-label="Portada Editorial CITT Connect"
        className="relative left-1/2 right-1/2 isolate -ml-[50vw] -mr-[50vw] -mt-8 flex min-h-[100dvh] w-screen flex-col justify-between overflow-hidden border-b border-theme pt-[130px] pb-6 xl:h-[100dvh] xl:min-h-[760px] xl:pt-[90px] xl:pb-7"
      >
        {/* Capa 1: Imagen Arquitectónica Convertida a WebP con Blur Suave */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <img
            src="/assets/citt-hero-lobby.webp"
            alt="Lobby moderno de madera, vidrio y plantas CITT Duoc UC"
            className="h-full w-full scale-105 object-cover object-center blur-[3px]"
          />
          {/* Velo Atmosférico Suave que Preserva Madera, Vidrio y Plantas */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#FFFFFF]/15 dark:bg-[#000000]/35"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FFFFFF]/75 via-[#FFFFFF]/25 to-transparent dark:from-[#000000]/80 dark:via-[#000000]/30"
          />
        </div>

        {/* Contenido Central del Hero (Ajustado a 100dvh sin recortes ni scroll requerido) */}
        <div className="relative z-10 mx-auto my-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Columna Izquierda: Escenario Editorial Traslúcido sobre el Lobby */}
            <div className="space-y-5 rounded-3xl border border-theme-strong bg-[#FFFFFF]/90 p-6 shadow-theme-card backdrop-blur-md dark:bg-[#121212]/90 sm:p-8 lg:col-span-7">
              <h1 className="max-w-[20ch] text-balance text-4xl font-black tracking-tight text-theme-primary sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]">
                Innovación Aplicada y Talento Conectado en los{' '}
                <span className="underline decoration-[#FFB800] decoration-4 underline-offset-8">
                  CITT de Chile
                </span>
              </h1>

              <p className="max-w-[62ch] font-serif text-base leading-relaxed text-theme-secondary sm:text-[1.0625rem]">
                CITT Connect es la red institucional y bitácora editorial que
                une a los Centros de Innovación y Transferencia Tecnológica de
                Duoc UC. Un puente directo entre estudiantes de las 9 escuelas,
                Líderes CITT, Consejeros de Carrera, Docentes y Empresas Partner
                de Arica a Puerto Montt.
              </p>

              {/* Acciones Primarias con Contorno y Alto Contraste */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/directorio"
                  className="inline-flex items-center gap-2.5 rounded-2xl border border-[#1A1A1A]/25 bg-[#FFB800] px-5 py-3 text-sm font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633]"
                >
                  <Users className="h-4 w-4" />
                  <span>Explorar Directorio Nacional (+ Connect)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveArticle(featuredArticle)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-theme-strong bg-theme-subtle px-4 py-3 text-sm font-bold text-theme-primary transition hover:border-[#FFB800]"
                >
                  <BookOpen className="h-4 w-4 text-[#FFB800]" />
                  <span>Leer Reportaje de Portada</span>
                </button>

                <Link
                  href="/proyectos"
                  className="inline-flex items-center gap-2 rounded-2xl border border-theme-strong bg-theme-subtle px-4 py-3 text-sm font-bold text-theme-primary transition hover:border-[#FFB800]"
                >
                  <Sparkles className="h-4 w-4 text-[#307FE2]" />
                  <span>Proyectos Inter-Sedes</span>
                </Link>
              </div>

              {/* Síntesis Institucional */}
              <div className="grid grid-cols-3 gap-6 border-t border-theme-strong pt-5">
                <div>
                  <p className="text-2xl font-black tabular-nums text-theme-primary sm:text-3xl">
                    18 Sedes
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-theme-secondary">
                    Red nacional interconectada
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-black tabular-nums text-theme-primary sm:text-3xl">
                    9 Escuelas
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-theme-secondary">
                    Innovación multidisciplinaria
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-black tabular-nums text-theme-primary sm:text-3xl">
                    6 Roles
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-theme-secondary">
                    Gobernanza y puente industrial
                  </p>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Artículo Editorial de Portada Flotando sobre el Lobby */}
            <article className="overflow-hidden rounded-3xl border border-theme-strong bg-[#FFFFFF]/90 shadow-theme-card backdrop-blur-md dark:bg-[#121212]/90 lg:col-span-5">
              <div className="aspect-[16/9] w-full overflow-hidden bg-theme-subtle">
                <img
                  src={featuredArticle.coverImageUrl}
                  alt={featuredArticle.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-3.5 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <SchoolBadge schoolSlug={featuredArticle.schoolSlug} />
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme-secondary">
                    <Clock className="h-3.5 w-3.5" />
                    {featuredArticle.readTime} · {featuredArticle.publishedAt}
                  </span>
                </div>

                <h2 className="text-balance text-lg font-black leading-snug text-theme-primary sm:text-xl">
                  {featuredArticle.title}
                </h2>

                <p className="line-clamp-3 font-serif text-sm leading-relaxed text-theme-secondary">
                  {featuredArticle.excerpt}
                </p>

                <div className="flex items-center justify-between gap-3 border-t border-theme pt-3.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={featuredArticle.authorAvatarUrl}
                      alt={featuredArticle.authorName}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-theme-primary">
                        {featuredArticle.authorName}
                      </p>
                      <p className="text-xs text-theme-secondary">
                        Sede {featuredCampus.shortName}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveArticle(featuredArticle)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#1A1A1A]/20 bg-[#FFB800] px-3.5 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                  >
                    <span>Leer crónica</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* Barra Inferior del Hero (100% dentro del viewport inicial) */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme-strong bg-[#FFFFFF]/90 px-4 py-2.5 text-xs font-semibold text-theme-secondary shadow-sm backdrop-blur-md dark:bg-[#121212]/90">
            <span className="inline-flex items-center gap-2 font-bold text-theme-primary">
              <MapPin className="h-3.5 w-3.5 text-[#FFB800]" />
              <span>
                Campus & Laboratorios CITT Duoc UC · De Arica a Puerto Montt
              </span>
            </span>
            <span className="font-bold text-theme-primary">
              Desliza para explorar Manifiesto, Misión, Visión y Galería Pinterest ↓
            </span>
          </div>
        </div>
      </section>

      {/* 2. Manifiesto Institucional: ¿Qué es CITT Connect?, Misión y Visión */}
      <section aria-label="Propósito, Misión y Visión de CITT Connect" className="space-y-8">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-theme-primary sm:text-3xl">
            Propósito Institucional: Nuestra Identidad, Misión y Visión
          </h2>
          <p className="text-sm leading-relaxed text-theme-secondary">
            Diseñado bajo los lineamientos de innovación de Duoc UC para
            conectar el aprendizaje técnico con los desafíos reales de la
            sociedad y la industria chilena.
          </p>
        </div>

        {/* Retícula Editorial de 3 Pilares sin tarjetas anidadas */}
        <div className="grid grid-cols-1 divide-y divide-[var(--citt-border)] border-y border-theme lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {/* Qué es CITT Connect */}
          <div className="space-y-3 py-8 lg:pr-8">
            <h3 className="flex items-center gap-2.5 text-xl font-black text-theme-primary">
              <Sparkles className="h-5 w-5 shrink-0 text-[#FFB800]" />
              <span>¿Qué es CITT Connect?</span>
            </h3>
            <p className="font-serif text-sm leading-relaxed text-theme-secondary">
              Es la plataforma oficial de articulación e identidad digital de
              los Centros de Innovación y Transferencia Tecnológica de Duoc UC.
              Reúne en un solo ecosistema el directorio nacional de talentos,
              las crónicas de laboratorio, la búsqueda de colaboradores
              inter-sedes y la credencial Phygital QR para eventos.
            </p>
          </div>

          {/* Nuestra Misión */}
          <div className="space-y-3 py-8 lg:px-8">
            <h3 className="flex items-center gap-2.5 text-xl font-black text-theme-primary">
              <Target className="h-5 w-5 shrink-0 text-[#307FE2]" />
              <span>Nuestra Misión</span>
            </h3>
            <p className="font-serif text-sm leading-relaxed text-theme-secondary">
              Conectar y visibilizar el talento práctico de estudiantes, Líderes
              CITT, Consejeros de Carrera y Docentes de todas las escuelas de
              Duoc UC, facilitando el trabajo colaborativo entre sedes y la
              vinculación temprana con empresas Partner mediante proyectos de
              transferencia tecnológica aplicada.
            </p>
          </div>

          {/* Nuestra Visión */}
          <div className="space-y-3 py-8 lg:pl-8">
            <h3 className="flex items-center gap-2.5 text-xl font-black text-theme-primary">
              <Compass className="h-5 w-5 shrink-0 text-[#43B02A]" />
              <span>Nuestra Visión</span>
            </h3>
            <p className="font-serif text-sm leading-relaxed text-theme-secondary">
              Consolidarse como la red universitaria de innovación aplicada y
              co-creación estudiantil referente en Chile, donde la distancia
              geográfica entre regiones desaparece y cada miembro cuenta con una
              trayectoria verificable de proyectos, mentorías y soluciones de
              impacto nacional.
            </p>
          </div>
        </div>

        {/* Franja de las 9 Escuelas Duoc UC */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="mr-2 text-xs font-bold text-theme-primary">
            9 Escuelas Integradas:
          </span>
          {DUOC_SCHOOLS.map((school) => (
            <span
              key={school.slug}
              className="inline-flex items-center gap-2 rounded-full border border-theme bg-theme-subtle px-3 py-1 text-xs font-semibold text-theme-primary"
            >
              <span
                style={{ backgroundColor: school.primaryHex }}
                className="h-2.5 w-2.5 rounded-full"
              />
              <span>{school.shortName}</span>
            </span>
          ))}
        </div>
      </section>

      {/* 3. Galería Tipo Pinterest (Masonry con imágenes de diferentes tamaños) */}
      <section aria-label="Galería visual de laboratorios CITT" className="space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b border-theme pb-5 md:flex-row md:items-end">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black tracking-tight text-theme-primary sm:text-3xl">
              Mosaico Visual: Vida y Prototipos en los CITT de Chile
            </h2>
            <p className="max-w-[65ch] text-sm text-theme-secondary">
              Explora registros fotográficos de diferentes dimensiones enviados
              por los tracks de robótica, ciberseguridad, fabricación 3D, salud
              y cumbres inter-sedes.
            </p>
          </div>

          {/* Filtros de Categoría Pinterest */}
          <div className="flex flex-wrap items-center gap-1.5">
            {PINTEREST_CATEGORIES.map((category) => {
              const active = selectedPinTag === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedPinTag(category)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    active
                      ? 'bg-[#FFB800] text-[#1A1A1A]'
                      : 'border border-theme bg-theme-subtle text-theme-primary hover:border-[#FFB800]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grilla Masonry tipo Pinterest (alturas y proporciones variables) */}
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {filteredPins.map((pin) => {
            const campus = getCampusBySlug(pin.campusSlug);
            const school = getSchoolBySlug(pin.schoolSlug);

            return (
              <figure
                key={pin.id}
                className="mb-6 break-inside-avoid overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card"
              >
                {/* Franja Superior del Color de la Escuela */}
                <div
                  style={{ backgroundColor: school.primaryHex }}
                  className="h-1.5 w-full"
                />

                {/* Imagen con altura variable tipo Pinterest (h-52, h-64, h-80, h-96) */}
                <div
                  className={`relative w-full overflow-hidden bg-theme-subtle ${pin.imageHeightClass}`}
                >
                  <img
                    src={pin.imageUrl}
                    alt={pin.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <figcaption className="space-y-2.5 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-theme-elevated px-2.5 py-0.5 text-xs font-bold text-theme-primary">
                      {pin.tag}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-theme-secondary">
                      <MapPin className="h-3 w-3" />
                      {campus.shortName}
                    </span>
                  </div>

                  <h3 className="text-base font-black leading-snug text-theme-primary">
                    {pin.title}
                  </h3>

                  <p className="text-xs leading-relaxed text-theme-secondary">
                    {pin.caption}
                  </p>

                  <div className="flex items-center justify-between border-t border-theme pt-2.5 text-xs text-theme-secondary">
                    <span className="font-semibold text-theme-primary">
                      {pin.authorName}
                    </span>
                    <span>{school.shortName}</span>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* 4. Blog & Crónicas de Innovación CITT */}
      <section aria-label="Blog y crónicas CITT Connect" className="space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b border-theme pb-5 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black tracking-tight text-theme-primary sm:text-3xl">
              Blog & Crónicas de la Red CITT
            </h2>
            <p className="max-w-[62ch] text-sm text-theme-secondary">
              Artículos escritos por Coordinadores, Líderes CITT, Consejeros de
              Carrera y Desarrolladores sobre gobernanza, eventos y casos de
              éxito.
            </p>
          </div>

          <Link
            href="/muro"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-theme-primary underline decoration-[#FFB800] decoration-2 underline-offset-4 hover:text-[#307FE2]"
          >
            <span>Ver Muro & Convocatorias Partner</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {editorialChronicles.map((article) => {
            const campus = getCampusBySlug(article.campusSlug);
            return (
              <article
                key={article.id}
                className="flex flex-col justify-between overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card"
              >
                <div>
                  <div className="aspect-[16/10] w-full overflow-hidden bg-theme-subtle">
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-3 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <RoleBadge role={article.authorRole} showTooltip={false} />
                      <span className="text-xs font-medium text-theme-secondary">
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-black leading-snug text-theme-primary">
                      {article.title}
                    </h3>

                    <p className="font-serif text-xs leading-relaxed text-theme-secondary">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-theme px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-theme-primary">
                      {article.authorName}
                    </p>
                    <p className="truncate text-xs text-theme-secondary">
                      Sede {campus.shortName} · {article.publishedAt}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveArticle(article)}
                    className="shrink-0 rounded-xl bg-theme-elevated px-3 py-1.5 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                  >
                    Leer artículo
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. Puerta Institucional al Directorio Nacional (+ Connect) */}
      <section className="rounded-3xl border border-theme bg-theme-subtle p-8 sm:p-10">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-theme-primary sm:text-3xl">
              ¿Buscas conectar con miembros, líderes o partners de otra sede?
            </h2>
            <p className="text-sm leading-relaxed text-theme-secondary">
              Accede al <strong>Directorio Nacional de Credenciales</strong> para
              filtrar integrantes por Región, Sede, Escuela Duoc UC o Rol,
              establecer vínculos profesionales con <strong>+ Connect</strong> y
              escanear sus pases QR.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/directorio"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FFB800] px-6 py-3.5 text-sm font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
            >
              <UserPlus className="h-4 w-4" />
              <span>Ir al Directorio Nacional (+ Connect)</span>
            </Link>
            <Link
              href="/proyectos"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#1A1A1A] px-5 py-3.5 text-sm font-bold text-[#FFFFFF] transition hover:bg-[#333333]"
            >
              <span>Ver Proyectos Inter-Sedes</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Modal Lector de Artículos del Blog */}
      <Dialog.Root
        open={activeArticle !== null}
        onOpenChange={(open) => {
          if (!open) setActiveArticle(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[94vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 text-theme-primary shadow-2xl focus:outline-none sm:p-8">
            {activeArticle && (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <RoleBadge
                      role={activeArticle.authorRole}
                      showTooltip={false}
                    />
                    <SchoolBadge schoolSlug={activeArticle.schoolSlug} />
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Cerrar lectura"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-theme-elevated text-theme-primary hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="space-y-2">
                  <Dialog.Title className="text-balance text-2xl font-black leading-tight sm:text-3xl">
                    {activeArticle.title}
                  </Dialog.Title>
                  <p className="font-serif text-sm italic text-theme-secondary">
                    {activeArticle.subtitle}
                  </p>
                </div>

                <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-theme-subtle">
                  <img
                    src={activeArticle.coverImageUrl}
                    alt={activeArticle.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between border-y border-theme py-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={activeArticle.authorAvatarUrl}
                      alt={activeArticle.authorName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="font-bold text-theme-primary">
                      {activeArticle.authorName}
                    </span>
                  </div>
                  <span className="text-theme-secondary">
                    {activeArticle.publishedAt} · {activeArticle.readTime}
                  </span>
                </div>

                <div className="space-y-4 font-serif text-base leading-relaxed text-theme-secondary">
                  {activeArticle.contentParagraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-theme pt-4">
                  <Link
                    href="/directorio"
                    onClick={() => setActiveArticle(null)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-bold text-[#1A1A1A]"
                  >
                    <Users className="h-4 w-4" />
                    <span>Conectar con el autor en el Directorio</span>
                  </Link>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="rounded-xl bg-theme-elevated px-4 py-2.5 text-xs font-bold text-theme-primary"
                    >
                      Cerrar crónica
                    </button>
                  </Dialog.Close>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
