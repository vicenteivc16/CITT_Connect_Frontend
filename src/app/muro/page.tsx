'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowRight,
  Bookmark,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  ExternalLink,
  Flame,
  Globe,
  GraduationCap,
  Layers,
  MapPin,
  Megaphone,
  Newspaper,
  PenTool,
  Plus,
  Radio,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
  Users,
  X,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import {
  CITT_CAMPUSES,
  DUOC_SCHOOLS,
  ROLE_CONFIG,
  getCampusBySlug,
  getSchoolBySlug,
} from '@/data/citt-catalog';
import { RoleBadge } from '@/components/RoleBadge';
import { CittFeedPost, DuocSchoolSlug } from '@/types/citt';
import { NewsItem } from '@/app/api/news/route';
import { SedeWeatherItem } from '@/app/api/weather/route';

type FilterDesk = 'todas' | 'chile' | 'internacional' | DuocSchoolSlug | 'comunidad';

export default function NationalGazettePage() {
  const { posts, activeUser, isAuthenticated, addPost } = useCittNetwork();

  // News API State
  const [newsArticles, setNewsArticles] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  // Weather API State (18 Duoc UC Sedes)
  const [sedeWeathers, setSedeWeathers] = useState<SedeWeatherItem[]>([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  // Filter State
  const [activeDesk, setActiveDesk] = useState<FilterDesk>('todas');
  const [selectedCampus, setSelectedCampus] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Hero School Carousel State
  const [heroSchoolIndex, setHeroSchoolIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  // Modals
  const [readingArticle, setReadingArticle] = useState<NewsItem | null>(null);
  const [readingCommunityPost, setReadingCommunityPost] =
    useState<CittFeedPost | null>(null);
  const [composeModalOpen, setComposeModalOpen] = useState(false);

  // Compose Post State
  const [postTitle, setPostTitle] = useState('');
  const [postSubtitle, setPostSubtitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postCategory, setPostCategory] =
    useState<CittFeedPost['category']>('noticia_citt');
  const [postCampus, setPostCampus] = useState('san-joaquin');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fetch news from /api/news (100% en español)
  useEffect(() => {
    let isMounted = true;
    async function loadNews() {
      try {
        setIsLoadingNews(true);
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.articles) {
            setNewsArticles(data.articles);
          }
        }
      } catch (err) {
        console.warn('Error al cargar noticias de /api/news:', err);
      } finally {
        if (isMounted) setIsLoadingNews(false);
      }
    }
    loadNews();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch live weather from /api/weather (Open-Meteo para las 18 sedes Duoc UC)
  useEffect(() => {
    let isMounted = true;
    async function loadWeather() {
      try {
        setIsLoadingWeather(true);
        const res = await fetch('/api/weather');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.sedes) {
            setSedeWeathers(data.sedes);
          }
        }
      } catch (err) {
        console.warn('Error al cargar clima de /api/weather:', err);
      } finally {
        if (isMounted) setIsLoadingWeather(false);
      }
    }
    loadWeather();
    return () => {
      isMounted = false;
    };
  }, []);

  // Hero carousel auto-advance (9 schools)
  useEffect(() => {
    if (isHeroPaused) return;
    const interval = setInterval(() => {
      setHeroSchoolIndex((prev) => (prev + 1) % DUOC_SCHOOLS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isHeroPaused]);

  // Current school in the hero carousel
  const currentHeroSchool = DUOC_SCHOOLS[heroSchoolIndex];

  // Featured article for current hero school
  const currentHeroArticle = useMemo(() => {
    const forSchool = newsArticles.find(
      (a) => a.schoolSlug === currentHeroSchool.slug && a.isHeroFeatured
    );
    if (forSchool) return forSchool;
    const fallbackForSchool = newsArticles.find(
      (a) => a.schoolSlug === currentHeroSchool.slug
    );
    if (fallbackForSchool) return fallbackForSchool;
    return newsArticles[0] || null;
  }, [newsArticles, currentHeroSchool]);

  // Breaking ticker headlines (Chile & World)
  const tickerHeadlines = useMemo(() => {
    if (newsArticles.length === 0) {
      return [
        'Chile lidera adopción de inteligencia artificial y ciberseguridad en Sudamérica',
        'Duoc UC despliega 18 hubs CITT inter-sedes para proyectos de I+D aplicada',
        'Estudiantes de Ingeniería prueban microrredes solares en el desierto de Atacama',
      ];
    }
    return newsArticles.slice(0, 8).map((a) => `${a.regionLabel}: ${a.title}`);
  }, [newsArticles]);

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    return newsArticles.filter((art) => {
      // Desk Filter
      if (activeDesk === 'chile' && art.region !== 'chile') return false;
      if (activeDesk === 'internacional' && art.region !== 'internacional')
        return false;
      if (
        activeDesk !== 'todas' &&
        activeDesk !== 'chile' &&
        activeDesk !== 'internacional' &&
        activeDesk !== 'comunidad' &&
        art.schoolSlug !== activeDesk
      ) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          art.title.toLowerCase().includes(q) ||
          art.subtitle.toLowerCase().includes(q) ||
          art.content.toLowerCase().includes(q) ||
          art.schoolName.toLowerCase().includes(q) ||
          art.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [newsArticles, activeDesk, searchQuery]);

  // Community posts filtered by campus
  const communityPosts = useMemo(() => {
    return posts.filter((p) => {
      if (selectedCampus !== 'todas' && p.campusSlug !== selectedCampus) {
        return false;
      }
      return true;
    });
  }, [posts, selectedCampus]);

  // Handle compose post submission
  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    addPost({
      title: postTitle.trim(),
      subtitle: postSubtitle.trim() || undefined,
      content: postContent.trim(),
      authorName: activeUser.fullName,
      authorUsername: activeUser.username,
      authorRole: activeUser.role,
      authorOccupation: activeUser.currentOccupation || 'Miembro CITT',
      campusSlug: postCampus,
      category: postCategory,
      imageUrl: postImageUrl.trim() || undefined,
    });

    setStatusMessage('¡Despacho de sede publicado exitosamente en la Gaceta CITT!');
    setPostTitle('');
    setPostSubtitle('');
    setPostContent('');
    setPostImageUrl('');
    setComposeModalOpen(false);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-theme-canvas pt-16 pb-20 text-theme-primary transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ========================================================= */}
        {/* 0. BANNER SUPERIOR DEL CLIMA: 18 SEDES DUOC UC SCROLL DERECHA */}
        {/* ========================================================= */}
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

        {/* ========================================================= */}
        {/* 1. MASTHEAD DISRUPTIVO & LIBRE · EL DIARIO CITT DUOC UC   */}
        {/* ========================================================= */}
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
                onClick={() => setComposeModalOpen(true)}
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

        {/* ALERTA DE PUBLICACIÓN EXITOSA */}
        {statusMessage && (
          <div className="flex items-center gap-2 rounded-2xl border border-[#43B02A]/40 bg-[#43B02A]/10 p-3.5 text-xs font-bold text-[#43B02A]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. HERO: CARRUSEL CON MEDIDAS RÍGIDAS ESTÁTICAS (ZERO CLS) */}
        {/* ========================================================= */}
        <section
          className="rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-theme-card space-y-6"
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
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
                    onClick={() =>
                      setHeroSchoolIndex(
                        (prev) => (prev - 1 + DUOC_SCHOOLS.length) % DUOC_SCHOOLS.length
                      )
                    }
                    aria-label="Escuela anterior"
                    className="rounded-lg border border-theme p-1 hover:bg-theme-subtle"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setHeroSchoolIndex((prev) => (prev + 1) % DUOC_SCHOOLS.length)
                    }
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
                    onClick={() => setHeroSchoolIndex(index)}
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
                      onClick={() => setReadingArticle(currentHeroArticle)}
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
                      onClick={() => setReadingArticle(currentHeroArticle)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-theme-canvas transition hover:opacity-90"
                    >
                      <span>Leer Crónica</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1">
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

        {/* ========================================================= */}
        {/* 3. BARRA DE FILTROS & SECCIONES DE PRENSA                 */}
        {/* ========================================================= */}
        <section className="rounded-3xl border border-theme bg-theme-surface p-4 sm:p-5 shadow-theme-card space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Pestañas de Secciones */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveDesk('todas')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  activeDesk === 'todas'
                    ? 'bg-theme-primary text-theme-canvas shadow-sm'
                    : 'border border-theme bg-theme-subtle text-theme-secondary hover:text-theme-primary'
                }`}
              >
                Todas las Noticias
              </button>
              <button
                type="button"
                onClick={() => setActiveDesk('chile')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  activeDesk === 'chile'
                    ? 'bg-[#107C41] text-white shadow-sm'
                    : 'border border-theme bg-theme-subtle text-theme-secondary hover:text-theme-primary'
                }`}
              >
                🇨🇱 Solo Chile
              </button>
              <button
                type="button"
                onClick={() => setActiveDesk('internacional')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  activeDesk === 'internacional'
                    ? 'bg-[#307FE2] text-white shadow-sm'
                    : 'border border-theme bg-theme-subtle text-theme-secondary hover:text-theme-primary'
                }`}
              >
                🌎 Internacional
              </button>
              <button
                type="button"
                onClick={() => setActiveDesk('comunidad')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  activeDesk === 'comunidad'
                    ? 'bg-[#AC4FC6] text-white shadow-sm'
                    : 'border border-theme bg-theme-subtle text-theme-secondary hover:text-theme-primary'
                }`}
              >
                📢 Cables de Sede ({communityPosts.length})
              </button>
            </div>

            {/* Buscador Rápido y Filtro de Sede */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar titular o tecnología..."
                  className="w-full rounded-xl border border-theme bg-theme-subtle px-3 py-1.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none pl-8"
                />
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-theme-secondary" />
              </div>

              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="w-full sm:w-auto rounded-xl border border-theme bg-theme-subtle px-3 py-1.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
              >
                <option value="todas">Todas las Sedes (18)</option>
                {CITT_CAMPUSES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.shortName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. CUERPO DE PRENSA A 3 COLUMNAS (BROADSHEET WASHINGTON POST) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ------------------------------------------------------- */}
          {/* COLUMNA 1 & 2: GRANDES CRÓNICAS Y REPORTAJES (8 COLS)   */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-theme pb-2.5">
              <h3 className="font-serif text-lg font-black tracking-tight text-theme-primary uppercase">
                {activeDesk === 'chile'
                  ? 'Crónicas Nacionales · Ecosistema Chileno'
                  : activeDesk === 'internacional'
                  ? 'Despachos Globales · Frontera Tecnológica'
                  : activeDesk === 'comunidad'
                  ? 'Cables de Sedes Duoc UC'
                  : 'Primera Plana · Noticias de Innovación'}
              </h3>
              <span className="text-xs text-theme-secondary font-medium">
                {filteredArticles.length} artículos disponibles
              </span>
            </div>

            {/* Listado Principal de Noticias en Grid Editorial */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article, idx) => (
                <article
                  key={article.id}
                  onClick={() => setReadingArticle(article)}
                  className={`group flex flex-col justify-between rounded-2xl border border-theme bg-theme-surface p-5 shadow-theme-card cursor-pointer transition hover:border-[#FFB800] hover:shadow-md ${
                    idx === 0 ? 'md:col-span-2' : ''
                  }`}
                >
                  <div className="space-y-3">
                    {/* Imagen */}
                    <div
                      className={`relative overflow-hidden rounded-xl border border-theme bg-theme-subtle ${
                        idx === 0 ? 'aspect-[21/9]' : 'aspect-[16/10]'
                      }`}
                    >
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="rounded-full border border-black/30 bg-black/75 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                          {article.regionLabel}
                        </span>
                        <span className="rounded-full bg-[#FFB800] px-2 py-0.5 text-[10px] font-black text-[#1A1A1A]">
                          {article.schoolName}
                        </span>
                      </div>
                    </div>

                    {/* Titular & Subtítulo */}
                    <div className="space-y-1.5">
                      <h4
                        className={`font-serif font-black text-theme-primary group-hover:text-[#307FE2] transition leading-tight ${
                          idx === 0 ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                        }`}
                      >
                        {article.title}
                      </h4>
                      <p className="text-xs text-theme-secondary line-clamp-2 leading-relaxed">
                        {article.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Pie de Noticia */}
                  <div className="mt-4 flex items-center justify-between border-t border-theme pt-3 text-[11px] text-theme-secondary">
                    <div>
                      <span className="font-bold text-theme-primary">
                        {article.author}
                      </span>
                      <span className="mx-1">·</span>
                      <span>{article.readingTime}</span>
                    </div>

                    <span className="font-bold text-[#307FE2] group-hover:underline">
                      Leer más →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* COLUMNA 3: CABLES DE SEDE, OPINIÓN & TRIBUNA (4 COLS)   */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-6">
            {/* Tarjeta de Identidad Editorial con Logo Duoc UC */}
            <div className="rounded-3xl border border-theme bg-theme-surface p-5 shadow-theme-card space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/Logo_DuocUC.svg.webp"
                  alt="Duoc UC"
                  className="h-5 w-auto object-contain brightness-100 dark:brightness-110"
                />
                <span className="text-[11px] font-black uppercase tracking-wider text-[#FFB800]">
                  Gobernanza CITT
                </span>
              </div>
              <p className="text-xs text-theme-secondary leading-relaxed">
                Diario tecnológico administrado por los centros de innovación y
                transferencia tecnológica de las 18 sedes de Duoc UC. Información
                académica, técnica y neutral orientada al desarrollo nacional.
              </p>
            </div>

            {/* Despachos / Cables de Sede en Vivo (Comunidad) */}
            <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card space-y-4">
              <div className="flex items-center justify-between border-b border-theme pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-[#E87722] animate-pulse" />
                  <h4 className="font-serif text-sm font-black text-theme-primary uppercase">
                    Cables de Sede en Vivo
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-theme-secondary">
                  {communityPosts.length} despachos
                </span>
              </div>

              <div className="space-y-4 divide-y divide-theme">
                {communityPosts.slice(0, 5).map((post) => {
                  const campus = getCampusBySlug(post.campusSlug);
                  return (
                    <div
                      key={post.id}
                      onClick={() => setReadingCommunityPost(post)}
                      className="pt-3 first:pt-0 space-y-1.5 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-1 text-[10px]">
                        <span className="font-bold text-[#E87722]">
                          Sede {campus.shortName}
                        </span>
                        <span className="text-theme-secondary">
                          {post.createdAt.startsWith('Hace') || post.createdAt.includes('Ayer') || post.createdAt.includes('Hoy')
                            ? post.createdAt
                            : isNaN(new Date(post.createdAt).getTime())
                            ? 'Hoy'
                            : new Date(post.createdAt).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                      <h5 className="font-serif text-xs font-bold text-theme-primary group-hover:text-[#307FE2] transition leading-snug">
                        {post.title}
                      </h5>
                      <p className="text-[11px] text-theme-secondary line-clamp-2 leading-relaxed">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[10px] text-theme-secondary">
                        <span className="font-semibold text-theme-primary">
                          {post.authorName}
                        </span>
                        <span>·</span>
                        <RoleBadge role={post.authorRole} showTooltip={false} size="sm" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setComposeModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-theme bg-theme-subtle py-2 text-xs font-bold text-theme-primary transition hover:border-[#FFB800]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Enviar Despacho desde mi Sede</span>
              </button>
            </div>

            {/* Tribuna de Opinión CITT */}
            <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card space-y-4">
              <div className="flex items-center gap-2 border-b border-theme pb-3">
                <PenTool className="h-4 w-4 text-[#307FE2]" />
                <h4 className="font-serif text-sm font-black text-theme-primary uppercase">
                  Tribuna & Opinión Docente
                </h4>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 space-y-2">
                  <p className="font-serif italic text-xs font-semibold text-theme-primary leading-relaxed">
                    «La interoperabilidad de la computación cuántica y la IA exigirá técnicos capaces de auditar modelos locales en menos de cinco años.»
                  </p>
                  <div className="text-[11px] text-theme-secondary">
                    <strong className="text-theme-primary">Prof. Carlos Vega R.</strong>
                    <p>Coordinador CITT Sede Concepción</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 space-y-2">
                  <p className="font-serif italic text-xs font-semibold text-theme-primary leading-relaxed">
                    «El ecodiseño chileno no es una opción de marketing; es la única vía para exportar productos con trazabilidad comprobable.»
                  </p>
                  <div className="text-[11px] text-theme-secondary">
                    <strong className="text-theme-primary">Valentina Soto Miranda</strong>
                    <p>Consejera de Carrera · Escuela de Diseño</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. MODAL DE LECTURA DE CRÓNICA COMPLETA (WASHINGTON POST) */}
      {/* ========================================================= */}
      {readingArticle && (
        <Dialog.Root open={!!readingArticle} onOpenChange={(open) => !open && setReadingArticle(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 sm:p-10 shadow-2xl">
              <div className="space-y-6">
                {/* Cabecera del Reportaje */}
                <div className="flex items-center justify-between border-b border-theme pb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/Logo_DuocUC.svg.webp"
                      alt="Duoc UC"
                      className="h-5 w-auto object-contain brightness-100 dark:brightness-110"
                    />
                    <span className="rounded-full bg-[#FFB800] px-2.5 py-0.5 text-xs font-black text-[#1A1A1A]">
                      {readingArticle.schoolName}
                    </span>
                    <span className="text-xs font-bold text-theme-secondary">
                      {readingArticle.regionLabel}
                    </span>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="rounded-xl border border-theme p-1.5 text-theme-secondary hover:text-theme-primary"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Titular & Subtítulo Editorial */}
                <div className="space-y-3">
                  <h2 className="font-serif text-2xl sm:text-4xl font-black leading-tight tracking-tight text-theme-primary">
                    {readingArticle.title}
                  </h2>
                  <p className="font-serif text-sm sm:text-base font-bold text-theme-secondary leading-relaxed">
                    {readingArticle.subtitle}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-theme-secondary border-t border-b border-theme py-2.5">
                    <span>Por <strong className="text-theme-primary">{readingArticle.author}</strong> ({readingArticle.authorTitle})</span>
                    <span>·</span>
                    <span>Fuente: {readingArticle.sourceName}</span>
                    <span>·</span>
                    <span>{readingArticle.readingTime}</span>
                  </div>
                </div>

                {/* Imagen Principal */}
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-theme bg-theme-subtle">
                  <img
                    src={readingArticle.imageUrl}
                    alt={readingArticle.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Cuerpo del Reportaje (Con Formato Periodístico) */}
                <div className="space-y-4 text-xs sm:text-sm text-theme-primary/90 leading-relaxed font-serif">
                  {readingArticle.content.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className={pIdx === 0 ? 'first-letter:text-4xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:text-[#FFB800]' : ''}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Enlace a Fuente Original si existe */}
                {readingArticle.sourceUrl && (
                  <div className="pt-2">
                    <a
                      href={readingArticle.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#307FE2] hover:underline"
                    >
                      <span>Ver fuente original en {readingArticle.sourceName}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}

                {/* Pie del Modal */}
                <div className="flex items-center justify-between border-t border-theme pt-4">
                  <div className="flex flex-wrap gap-1">
                    {readingArticle.tags.map((t) => (
                      <span key={t} className="rounded-md border border-theme bg-theme-subtle px-2 py-0.5 text-[10px] font-semibold text-theme-secondary">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-theme-canvas"
                    >
                      Cerrar Lectura
                    </button>
                  </Dialog.Close>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL DE LECTURA DE CABLE DE COMUNIDAD                 */}
      {/* ========================================================= */}
      {readingCommunityPost && (
        <Dialog.Root open={!!readingCommunityPost} onOpenChange={(open) => !open && setReadingCommunityPost(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-theme pb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-[#E87722]" />
                    <span className="text-xs font-black uppercase text-[#E87722]">
                      Despacho Sede {getCampusBySlug(readingCommunityPost.campusSlug).shortName}
                    </span>
                  </div>
                  <Dialog.Close asChild>
                    <button type="button" className="text-theme-secondary hover:text-theme-primary">
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-black text-theme-primary">
                  {readingCommunityPost.title}
                </h3>

                {readingCommunityPost.imageUrl && (
                  <div className="aspect-[16/9] overflow-hidden rounded-xl border border-theme">
                    <img
                      src={readingCommunityPost.imageUrl}
                      alt={readingCommunityPost.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed whitespace-pre-line">
                  {readingCommunityPost.content}
                </p>

                <div className="flex items-center justify-between border-t border-theme pt-3 text-xs text-theme-secondary">
                  <span className="font-bold text-theme-primary">
                    Despachado por @{readingCommunityPost.authorUsername}
                  </span>
                  <RoleBadge role={readingCommunityPost.authorRole} showTooltip={false} size="sm" />
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      {/* ========================================================= */}
      {/* 7. MODAL: REDACTAR CABLE / NOTICIA DE SEDE                 */}
      {/* ========================================================= */}
      {composeModalOpen && (
        <Dialog.Root open={composeModalOpen} onOpenChange={setComposeModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-2xl">
              <form onSubmit={handleComposeSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-theme pb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/Logo_DuocUC.svg.webp"
                      alt="Duoc UC"
                      className="h-5 w-auto object-contain brightness-100 dark:brightness-110"
                    />
                    <h3 className="text-sm font-black text-theme-primary">
                      Redactar Despacho / Cable de Sede
                    </h3>
                  </div>
                  <Dialog.Close asChild>
                    <button type="button" className="text-theme-secondary hover:text-theme-primary">
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                {!isAuthenticated && (
                  <div className="rounded-xl border border-[#FFB800]/40 bg-[#FFB800]/10 p-3 text-xs text-[#FFB800]">
                    💡 Publicarás como <strong>{activeUser.fullName}</strong>. Para firmar con tu credencial verificada,{' '}
                    <Link href="/acceso" className="font-bold underline">
                      inicia sesión aquí
                    </Link>.
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Titular del Despacho *
                  </label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Ej. Sede San Joaquín inaugura banco de pruebas robóticas"
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Bajada / Resumen Breve
                  </label>
                  <input
                    type="text"
                    value={postSubtitle}
                    onChange={(e) => setPostSubtitle(e.target.value)}
                    placeholder="Ej. Iniciativa conjunta entre Informática y Diseño para estudiantes de jornada diurna y vespertina"
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Sede Emisora *
                    </label>
                    <select
                      value={postCampus}
                      onChange={(e) => setPostCampus(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    >
                      {CITT_CAMPUSES.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Categoría *
                    </label>
                    <select
                      value={postCategory}
                      onChange={(e) =>
                        setPostCategory(e.target.value as CittFeedPost['category'])
                      }
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    >
                      <option value="noticia_citt">Noticia & Avance de Proyecto</option>
                      <option value="evento_nacional">Convocatoria o Hackathon</option>
                      <option value="oportunidad_partner">Oportunidad de Práctica / Mentoría</option>
                      <option value="pedir_ayuda">Cable Urgente / SOS Técnico</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Cuerpo del Despacho (Crónica o Hito) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Detalla el acontecimiento tecnológico, los alumnos involucrados y cómo contactar al equipo..."
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    URL de Fotografía (Opcional)
                  </label>
                  <input
                    type="url"
                    value={postImageUrl}
                    onChange={(e) => setPostImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-theme pt-3">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="rounded-xl border border-theme px-4 py-2 text-xs font-bold text-theme-secondary hover:text-theme-primary"
                    >
                      Cancelar
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#ffc633]"
                  >
                    Emitir Despacho a la Gaceta
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
}
