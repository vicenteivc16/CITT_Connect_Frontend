'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  PenTool,
  Plus,
  Radio,
  Search,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import {
  CITT_CAMPUSES,
  DUOC_SCHOOLS,
  getCampusBySlug,
} from '@/data/citt-catalog';
import { RoleBadge } from '@/components/RoleBadge';
import { CittFeedPost, DuocSchoolSlug } from '@/types/citt';
import { NewsItem } from '@/app/api/news/route';
import { SedeWeatherItem } from '@/app/api/weather/route';

// Subcomponentes Modulares de Prensa
import { WeatherTicker } from '@/components/muro/WeatherTicker';
import { MuroMasthead } from '@/components/muro/MuroMasthead';
import { SchoolHeroCarousel } from '@/components/muro/SchoolHeroCarousel';
import { ArticleReadingModal } from '@/components/muro/ArticleReadingModal';
import { ComposeDispatchModal } from '@/components/muro/ComposeDispatchModal';
import { CommunityDispatchModal } from '@/components/muro/CommunityDispatchModal';

type FilterDesk = 'todas' | 'chile' | 'internacional' | DuocSchoolSlug | 'comunidad';

export default function NationalGazettePage() {
  const { posts, activeUser, isAuthenticated, addPost } = useCittNetwork();

  // News API State (100% en español)
  const [newsArticles, setNewsArticles] = useState<NewsItem[]>([]);
  const [, setIsLoadingNews] = useState(true);

  // Weather API State (18 Sedes Duoc UC)
  const [sedeWeathers, setSedeWeathers] = useState<SedeWeatherItem[]>([]);
  const [, setIsLoadingWeather] = useState(true);

  // Filter State
  const [activeDesk, setActiveDesk] = useState<FilterDesk>('todas');
  const [selectedCampus, setSelectedCampus] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Hero Carousel State
  const [heroSchoolIndex, setHeroSchoolIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  // Modals
  const [readingArticle, setReadingArticle] = useState<NewsItem | null>(null);
  const [readingCommunityPost, setReadingCommunityPost] =
    useState<CittFeedPost | null>(null);
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fetch /api/news
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

  // Fetch /api/weather
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

  // Rotación automática del Hero Carrusel
  useEffect(() => {
    if (isHeroPaused) return;
    const interval = setInterval(() => {
      setHeroSchoolIndex((prev) => (prev + 1) % DUOC_SCHOOLS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isHeroPaused]);

  // Artículo destacado de la escuela seleccionada
  const currentHeroArticle = useMemo(() => {
    const school = DUOC_SCHOOLS[heroSchoolIndex];
    if (!school) return newsArticles[0] || null;

    const featured = newsArticles.find(
      (a) => a.schoolSlug === school.slug && a.isHeroFeatured
    );
    if (featured) return featured;

    const fallback = newsArticles.find((a) => a.schoolSlug === school.slug);
    if (fallback) return fallback;

    return newsArticles[0] || null;
  }, [newsArticles, heroSchoolIndex]);

  // Titulares de Último Minuto para la marquesina
  const tickerHeadlines = useMemo(() => {
    if (newsArticles.length === 0) {
      return [
        'Chile inaugura su primer laboratorio abierto de Inteligencia Artificial Generativa y Ciberdefensa',
        'Duoc UC despliega 18 hubs CITT inter-sedes para proyectos de I+D aplicada',
        'Estudiantes de Ingeniería prueban microrredes solares en el desierto de Atacama',
      ];
    }
    return newsArticles.slice(0, 8).map((a) => `${a.regionLabel}: ${a.title}`);
  }, [newsArticles]);

  // Filtrado de artículos
  const filteredArticles = useMemo(() => {
    return newsArticles.filter((art) => {
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

  // Posts de la comunidad filtrados (Solo despachos aprobados públicamente)
  const communityPosts = useMemo(() => {
    return posts.filter((p) => {
      if (p.status === 'pending') {
        return false;
      }
      if (selectedCampus !== 'todas' && p.campusSlug !== selectedCampus) {
        return false;
      }
      return true;
    });
  }, [posts, selectedCampus]);

  const canComposeDispatch = Boolean(
    isAuthenticated &&
      activeUser &&
      ['dev', 'personal_duoc', 'consejero_carrera', 'lider_citt'].includes(activeUser.role)
  );

  // Enviar nuevo despacho a moderación de sede
  const handleDispatchSubmit = (dispatchData: {
    title: string;
    subtitle?: string;
    content: string;
    campusSlug: string;
    category: CittFeedPost['category'];
    imageUrl?: string;
  }) => {
    addPost({
      ...dispatchData,
      status: 'pending',
      authorName: activeUser.fullName,
      authorUsername: activeUser.username,
      authorRole: activeUser.role,
      authorOccupation: activeUser.currentOccupation || 'Miembro CITT',
    });

    setStatusMessage('¡Despacho enviado a moderación interna de sede! Será evaluado antes de su publicación.');
    setTimeout(() => setStatusMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-theme-canvas pt-16 pb-20 text-theme-primary transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 0. Ticker de Clima en Vivo (18 Sedes Duoc UC) */}
        <WeatherTicker sedeWeathers={sedeWeathers} />

        {/* 1. Cabecera Editorial Broadsheet «El Diario CITT» */}
        <MuroMasthead
          onOpenCompose={() => setComposeModalOpen(true)}
          tickerHeadlines={tickerHeadlines}
          canCompose={canComposeDispatch}
        />

        {/* Alerta de Publicación Exitosa */}
        {statusMessage && (
          <div className="flex items-center gap-2 rounded-2xl border border-[#43B02A]/40 bg-[#43B02A]/10 p-3.5 text-xs font-bold text-[#43B02A]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* 2. Hero Carrusel de 9 Escuelas con Medidas Estáticas Rígidas (Zero CLS) */}
        <SchoolHeroCarousel
          heroSchoolIndex={heroSchoolIndex}
          onSelectSchoolIndex={setHeroSchoolIndex}
          onPrevSchool={() =>
            setHeroSchoolIndex(
              (prev) => (prev - 1 + DUOC_SCHOOLS.length) % DUOC_SCHOOLS.length
            )
          }
          onNextSchool={() =>
            setHeroSchoolIndex((prev) => (prev + 1) % DUOC_SCHOOLS.length)
          }
          currentHeroArticle={currentHeroArticle}
          onReadArticle={setReadingArticle}
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
        />

        {/* 3. Barra de Filtros & Secciones de Prensa */}
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

        {/* 4. Cuerpo de Prensa a 3 Columnas (Broadsheet Washington Post) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columnas 1 y 2: Crónicas Principales (8 cols) */}
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

          {/* Columna 3: Cables de Sede & Tribuna (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Tarjeta de Gobernanza CITT */}
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

            {/* Cables de Sede en Vivo */}
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
                          {post.createdAt.startsWith('Hace') ||
                          post.createdAt.includes('Ayer') ||
                          post.createdAt.includes('Hoy')
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

            {/* Tribuna & Opinión Docente */}
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

      {/* Modales Desacoplados y Reutilizables */}
      <ArticleReadingModal
        article={readingArticle}
        onClose={() => setReadingArticle(null)}
      />

      <CommunityDispatchModal
        post={readingCommunityPost}
        onClose={() => setReadingCommunityPost(null)}
      />

      <ComposeDispatchModal
        open={composeModalOpen}
        onOpenChange={setComposeModalOpen}
        activeUser={activeUser}
        isAuthenticated={isAuthenticated}
        onSubmitDispatch={handleDispatchSubmit}
      />
    </div>
  );
}
