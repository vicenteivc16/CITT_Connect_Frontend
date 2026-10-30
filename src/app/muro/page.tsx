'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  Clock,
  Compass,
  ExternalLink,
  Flame,
  Globe,
  HandHelping,
  Layers,
  MapPin,
  Megaphone,
  Newspaper,
  PenTool,
  Plus,
  Radio,
  Search,
  Share2,
  Sparkles,
  Tag,
  User,
  Users,
  X,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import {
  CITT_BLOG_ARTICLES,
  CITT_CAMPUSES,
  getCampusBySlug,
} from '@/data/citt-catalog';
import { RoleBadge } from '@/components/RoleBadge';
import { CittBlogArticle, CittFeedPost } from '@/types/citt';

const CATEGORY_META: Record<
  CittFeedPost['category'],
  { label: string; sectionName: string; accent: string }
> = {
  noticia_citt: {
    label: 'Noticia CITT',
    sectionName: 'INNOVACIÓN & CIENCIA',
    accent: '#307FE2',
  },
  evento_nacional: {
    label: 'Evento Nacional',
    sectionName: 'TORNEOS & HACKATHONS',
    accent: '#FFB800',
  },
  oportunidad_partner: {
    label: 'Oportunidad Partner',
    sectionName: 'MERCADO & EMPRESAS',
    accent: '#AC4FC6',
  },
  puente_consejero: {
    label: 'Puente Consejero',
    sectionName: 'TRIBUNA ESTUDIANTIL',
    accent: '#00A499',
  },
  pedir_ayuda: {
    label: 'Cable Urgente / SOS',
    sectionName: 'CLASIFICADOS & CABLES',
    accent: '#E87722',
  },
};

type NewsDesk =
  | 'todos'
  | 'innovacion'
  | 'partners'
  | 'consejeros'
  | 'cables'
  | 'reportajes';

export default function NationalGazettePage() {
  const { posts, activeUser, addPost } = useCittNetwork();

  // State
  const [activeDesk, setActiveDesk] = useState<NewsDesk>('todos');
  const [selectedCampus, setSelectedCampus] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [readingArticle, setReadingArticle] = useState<CittBlogArticle | null>(
    null
  );

  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] =
    useState<CittFeedPost['category']>('noticia_citt');
  const [actionLabel, setActionLabel] = useState('');
  const [actionUrl, setActionUrl] = useState('');

  // Breaking news ticker items
  const tickerItems = useMemo(() => {
    return posts.slice(0, 4).map((p) => ({
      id: p.id,
      title: p.title,
      campus: getCampusBySlug(p.campusSlug).shortName,
      category: CATEGORY_META[p.category].sectionName,
    }));
  }, [posts]);

  // Filtering posts by desk, campus and search
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Desk filtering
      if (activeDesk === 'innovacion') {
        if (
          post.category !== 'noticia_citt' &&
          post.category !== 'evento_nacional'
        ) {
          return false;
        }
      } else if (activeDesk === 'partners') {
        if (post.category !== 'oportunidad_partner') return false;
      } else if (activeDesk === 'consejeros') {
        if (post.category !== 'puente_consejero') return false;
      } else if (activeDesk === 'cables') {
        if (post.category !== 'pedir_ayuda') return false;
      }

      // Campus filtering
      if (selectedCampus !== 'todas' && post.campusSlug !== selectedCampus) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesSubtitle = post.subtitle?.toLowerCase().includes(query);
        const matchesContent = post.content.toLowerCase().includes(query);
        const matchesAuthor = post.authorName.toLowerCase().includes(query);
        const campus = getCampusBySlug(post.campusSlug);
        const matchesCampus = campus.name.toLowerCase().includes(query);

        if (
          !matchesTitle &&
          !matchesSubtitle &&
          !matchesContent &&
          !matchesAuthor &&
          !matchesCampus
        ) {
          return false;
        }
      }

      return true;
    });
  }, [posts, activeDesk, selectedCampus, searchQuery]);

  // Lead Story (Primera Plana)
  const leadStory = useMemo(() => {
    if (activeDesk === 'reportajes') return null;
    return (
      filteredPosts.find((p) => p.isLeadStory) ||
      filteredPosts.find((p) => p.imageUrl) ||
      filteredPosts[0] ||
      null
    );
  }, [filteredPosts, activeDesk]);

  // Secondary Stories (Segunda Plana)
  const secondaryStories = useMemo(() => {
    if (!leadStory) return [];
    return filteredPosts
      .filter((p) => p.id !== leadStory.id && p.category !== 'pedir_ayuda')
      .slice(0, 4);
  }, [filteredPosts, leadStory]);

  // Urgent Cables (Clasificados / Cables Rápidos)
  const urgentCables = useMemo(() => {
    return posts.filter((p) => p.category === 'pedir_ayuda');
  }, [posts]);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addPost({
      authorUsername: activeUser.username,
      authorName: activeUser.fullName,
      authorRole: activeUser.role,
      authorOccupation: activeUser.currentOccupation,
      campusSlug: activeUser.campusSlug,
      category,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      readTime: '2 min de lectura',
      actionLabel:
        actionLabel.trim() ||
        (category === 'oportunidad_partner'
          ? 'Postular a la vacante'
          : category === 'pedir_ayuda'
          ? 'Responder al cable'
          : `Contactar a ${activeUser.fullName.split(' ')[0]}`),
      actionUrl: actionUrl.trim() || `/u/${activeUser.username}`,
    });

    // Reset form
    setTitle('');
    setSubtitle('');
    setContent('');
    setImageUrl('');
    setActionLabel('');
    setActionUrl('');
    setCategory('noticia_citt');
    setModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. CABECERA DE PRENSA / MASTHEAD CITT */}
      <header className="rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-theme-card">
        {/* Barra Superior de Metadatos de Edición */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme pb-3 text-[11px] font-semibold text-theme-secondary uppercase tracking-wider">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-theme-primary">
              <Calendar className="h-3.5 w-3.5 text-[#FFB800]" />
              <span>Viernes, 30 de Octubre de 2026</span>
            </span>
            <span className="hidden sm:inline">·</span>
            <span>Año IV · Edición Nacional N° 42</span>
            <span className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1 text-theme-primary">
              <Globe className="h-3 w-3 text-[#307FE2]" />
              <span>18 Sedes Conectadas</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[#43B02A]">
              <Radio className="h-3 w-3 animate-pulse" />
              <span>Red En Línea</span>
            </span>
            <span>·</span>
            <span>Circulación Abierta Duoc UC</span>
          </div>
        </div>

        {/* Nombre Central del Periódico (The Gazette Nameplate) */}
        <div className="my-6 border-y-2 border-theme py-5 text-center">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:text-left">
            <div className="space-y-1">
              <h1 className="font-serif text-3xl font-black tracking-tight text-theme-primary sm:text-5xl lg:text-6xl">
                LA GACETA CITT
              </h1>
              <p className="text-xs font-medium text-theme-secondary sm:text-sm">
                Diario Oficial de Innovación, Transferencia Tecnológica y Vinculación Estudiantil · Duoc UC
              </p>
            </div>

            {/* Botón CTA Redactar Noticia */}
            <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#FFB800] px-5 py-3.5 text-xs font-black text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PenTool className="h-4 w-4" />
                  <span>Redactar Noticia / Enviar Cable</span>
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
                <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[92vh] w-[94vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 text-theme-primary shadow-2xl focus:outline-none sm:p-8">
                  <div className="flex items-center justify-between border-b border-theme pb-4">
                    <div>
                      <Dialog.Title className="font-serif text-lg font-black text-theme-primary">
                        Enviar Noticia o Cable a Redacción
                      </Dialog.Title>
                      <p className="text-xs text-theme-secondary">
                        Se publicará en la edición nacional con tu firma de corresponsal
                      </p>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Cerrar modal"
                        className="rounded-xl p-1.5 text-theme-secondary hover:bg-theme-subtle hover:text-theme-primary"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <form onSubmit={handlePublish} className="mt-5 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-theme-primary">
                        Sección / Desk Periodístico *
                      </label>
                      <select
                        value={category}
                        onChange={(e) =>
                          setCategory(e.target.value as CittFeedPost['category'])
                        }
                        className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                      >
                        <option value="noticia_citt">
                          Innovación & Proyectos CITT (Logro o Avance)
                        </option>
                        <option value="oportunidad_partner">
                          Mercado & Partners (Práctica, Mentoría o Vacante)
                        </option>
                        <option value="puente_consejero">
                          Tribuna Consejeros de Carrera (Puente Inter-Escuelas)
                        </option>
                        <option value="evento_nacional">
                          Agenda Nacional (Hackathon, Torneo o Charla)
                        </option>
                        <option value="pedir_ayuda">
                          Cable Urgente / Clasificado SOS (Ayuda Inmediata)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-theme-primary">
                        Titular de Prensa *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ej. Estudiantes de Sede Maipú Diseñan Simulador de Rescate Minero..."
                        className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-theme-primary">
                        Bajada de Noticia / Subtítulo (Opcional)
                      </label>
                      <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="Breve resumen explicativo que acompaña al titular..."
                        className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-theme-primary">
                        Cuerpo del Artículo / Crónica *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Redacta la crónica con los detalles, antecedentes y cómo sumarse..."
                        className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-theme-primary">
                        URL de Fotografía Editorial (Opcional)
                      </label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... o enlace de imagen pública"
                        className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-theme-primary">
                          Texto del Botón de Acción
                        </label>
                        <input
                          type="text"
                          value={actionLabel}
                          onChange={(e) => setActionLabel(e.target.value)}
                          placeholder="Ej. Postular con perfil CITT"
                          className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-theme-primary">
                          Enlace de Destino (Opcional)
                        </label>
                        <input
                          type="text"
                          value={actionUrl}
                          onChange={(e) => setActionUrl(e.target.value)}
                          placeholder="/proyectos/... o URL externa"
                          className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Previsualización del Byline */}
                    <div className="rounded-xl border border-theme bg-theme-subtle p-3 text-[11px] text-theme-secondary">
                      <span>Firma editorial:{' '}</span>
                      <strong className="text-theme-primary">
                        Por {activeUser.fullName}
                      </strong>
                      <span>, {activeUser.currentOccupation} · {getCampusBySlug(activeUser.campusSlug).name}</span>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="rounded-xl border border-theme px-4 py-2 text-xs font-semibold text-theme-primary hover:bg-theme-subtle"
                        >
                          Cancelar
                        </button>
                      </Dialog.Close>
                      <button
                        type="submit"
                        className="rounded-xl bg-[#FFB800] px-5 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                      >
                        Publicar en La Gaceta
                      </button>
                    </div>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>

        {/* Cintillo / Ticker de Último Minuto */}
        <div className="flex items-center gap-3 overflow-hidden rounded-2xl border border-theme bg-theme-subtle p-2.5">
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#FFB800] px-3 py-1 text-xs font-black text-[#1A1A1A] shadow-sm">
            <Flame className="h-3.5 w-3.5 text-[#1A1A1A]" />
            <span>ÚLTIMO MINUTO</span>
          </span>

          <div className="flex items-center gap-6 overflow-x-auto text-xs whitespace-nowrap">
            {tickerItems.map((item, idx) => (
              <span key={item.id} className="inline-flex items-center gap-2">
                <span className="font-bold text-[#307FE2]">[{item.category}]</span>
                <span className="text-theme-primary">{item.title}</span>
                <span className="text-[10px] text-theme-secondary">({item.campus})</span>
                {idx < tickerItems.length - 1 && (
                  <span className="text-theme-secondary/40">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* 2. SECCIONES PERIODÍSTICAS (DESK TABS) & BÚSQUEDA */}
      <nav aria-label="Secciones de La Gaceta" className="space-y-4 rounded-3xl border border-theme bg-theme-surface p-4 sm:p-5 shadow-theme-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Desk Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveDesk('todos')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeDesk === 'todos'
                  ? 'bg-[#FFB800] text-[#1A1A1A]'
                  : 'border border-theme bg-theme-subtle text-theme-primary hover:bg-theme-elevated'
              }`}
            >
              Portada General ({posts.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveDesk('innovacion')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeDesk === 'innovacion'
                  ? 'bg-[#FFB800] text-[#1A1A1A]'
                  : 'border border-theme bg-theme-subtle text-theme-primary hover:bg-theme-elevated'
              }`}
            >
              Innovación & CITT
            </button>

            <button
              type="button"
              onClick={() => setActiveDesk('partners')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeDesk === 'partners'
                  ? 'bg-[#FFB800] text-[#1A1A1A]'
                  : 'border border-theme bg-theme-subtle text-theme-primary hover:bg-theme-elevated'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Mercado & Partners</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDesk('consejeros')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeDesk === 'consejeros'
                  ? 'bg-[#FFB800] text-[#1A1A1A]'
                  : 'border border-theme bg-theme-subtle text-theme-primary hover:bg-theme-elevated'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Tribuna Consejeros</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDesk('cables')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeDesk === 'cables'
                  ? 'bg-[#FFB800] text-[#1A1A1A]'
                  : 'border border-theme bg-theme-subtle text-theme-primary hover:bg-theme-elevated'
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              <span>Cables SOS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDesk('reportajes')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeDesk === 'reportajes'
                  ? 'bg-[#FFB800] text-[#1A1A1A]'
                  : 'border border-theme bg-theme-subtle text-theme-primary hover:bg-theme-elevated'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Crónicas a Fondo ({CITT_BLOG_ARTICLES.length})</span>
            </button>
          </div>

          {/* Buscador & Selector de Sede */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-theme-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por titular, autor o tema..."
                className="w-full rounded-xl border border-theme bg-theme-subtle py-1.5 pr-8 pl-9 text-xs text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-theme-secondary hover:text-theme-primary"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="rounded-xl border border-theme bg-theme-subtle px-3 py-1.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
            >
              <option value="todas">Todas las Sedes</option>
              {CITT_CAMPUSES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      {/* 3. RETÍCULA ASIMÉTRICA DE PRIMERA PLANA */}
      {activeDesk !== 'reportajes' && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* COLUMNA PRINCIPAL (8 COLS): GRAN TITULAR DE PORTADA + SEGUNDA PLANA */}
          <main className="space-y-8 lg:col-span-8">
            {/* A. GRAN TITULAR DE PORTADA (LEAD STORY) */}
            {leadStory && (
              <article className="overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card">
                {leadStory.imageUrl && (
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img
                      src={leadStory.imageUrl}
                      alt={leadStory.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#FFB800] px-3 py-1 text-xs font-black text-[#1A1A1A] shadow-md">
                        GRAN TITULAR DE PORTADA
                      </span>
                      <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                        {CATEGORY_META[leadStory.category].sectionName}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/80">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-[#307FE2]" />
                        <span>{getCampusBySlug(leadStory.campusSlug).name}</span>
                      </span>
                      {leadStory.readTime && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{leadStory.readTime}</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-6 sm:p-8 space-y-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold leading-tight text-theme-primary sm:text-3xl lg:text-4xl">
                      {leadStory.title}
                    </h2>
                    {leadStory.subtitle && (
                      <p className="mt-3 text-sm font-semibold leading-relaxed text-theme-primary/90 sm:text-base">
                        {leadStory.subtitle}
                      </p>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-theme-secondary sm:text-base">
                    {leadStory.content}
                  </p>

                  {/* Byline Periodístico y Botón de Acción */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-theme pt-4">
                    <div className="flex items-center gap-3">
                      <RoleBadge role={leadStory.authorRole} showTooltip={false} />
                      <div className="text-xs">
                        <p className="font-bold text-theme-primary">
                          Por{' '}
                          <Link
                            href={`/u/${leadStory.authorUsername}`}
                            className="hover:underline"
                          >
                            {leadStory.authorName}
                          </Link>
                        </p>
                        <p className="text-[11px] text-theme-secondary">
                          {leadStory.authorOccupation} · {leadStory.createdAt}
                        </p>
                      </div>
                    </div>

                    {leadStory.actionUrl && (
                      <Link
                        href={leadStory.actionUrl}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-black text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633]"
                      >
                        <span>{leadStory.actionLabel || 'Leer completa'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            )}

            {/* B. SEGUNDA PLANA (COLUMNAS PARALELAS DE ARTÍCULOS) */}
            {secondaryStories.length > 0 && (
              <section aria-label="Segunda Plana" className="space-y-4">
                <div className="flex items-center justify-between border-b border-theme pb-2">
                  <h3 className="font-serif text-base font-bold text-theme-primary uppercase tracking-wide">
                    Segunda Plana & Despachos de Sede
                  </h3>
                  <span className="text-xs text-theme-secondary">
                    {secondaryStories.length} despachos confirmados
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {secondaryStories.map((post) => {
                    const campus = getCampusBySlug(post.campusSlug);
                    const meta = CATEGORY_META[post.category];

                    return (
                      <article
                        key={post.id}
                        className="flex flex-col justify-between overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card transition hover:border-[#FFB800]/50"
                      >
                        {post.imageUrl && (
                          <div className="relative aspect-video w-full overflow-hidden bg-black">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105 opacity-90"
                            />
                            <div className="absolute top-2.5 left-2.5">
                              <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                                {meta.sectionName}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex-1 p-5 space-y-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#307FE2]">
                              {campus.name}
                            </span>
                            <h4 className="font-serif mt-1 text-base font-bold leading-snug text-theme-primary">
                              {post.title}
                            </h4>
                          </div>

                          <p className="line-clamp-3 text-xs leading-relaxed text-theme-secondary">
                            {post.content}
                          </p>
                        </div>

                        <div className="border-t border-theme p-4 bg-theme-subtle/50">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-[11px] truncate">
                              <span className="text-theme-secondary">Por </span>
                              <Link
                                href={`/u/${post.authorUsername}`}
                                className="font-bold text-theme-primary hover:underline"
                              >
                                {post.authorName.split(' ')[0]}
                              </Link>
                              <span className="text-theme-secondary">
                                {' '}· {post.createdAt}
                              </span>
                            </div>

                            {post.actionUrl && (
                              <Link
                                href={post.actionUrl}
                                className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#307FE2] hover:underline"
                              >
                                <span>Ver</span>
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </main>

          {/* COLUMNA LATERAL (4 COLS): CABLES TELEGRÁFICOS, CLASIFICADOS & ESTADO */}
          <aside aria-label="Cables telegráficos y estado" className="space-y-6 lg:col-span-4">
            {/* Bloque 1: Estado de la Red Nacional CITT */}
            <div className="rounded-3xl border border-theme bg-theme-surface p-5 shadow-theme-card">
              <h3 className="font-serif text-sm font-bold text-theme-primary uppercase tracking-wider border-b border-theme pb-2.5">
                Estado de la Red Nacional CITT
              </h3>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-theme-secondary">Sedes Interconectadas:</span>
                  <span className="font-bold text-theme-primary">18 / 18 Sedes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-theme-secondary">Convocatorias Abiertas:</span>
                  <span className="font-bold text-[#FFB800]">{posts.length} Activas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-theme-secondary">Canal de Consejeros:</span>
                  <span className="font-bold text-[#00A499]">Enlace Directo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-theme-secondary">Alianzas con Industria:</span>
                  <span className="font-bold text-[#AC4FC6]">AWS & Partners</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-theme bg-theme-subtle p-3 text-[11px] text-theme-secondary">
                <p className="font-medium">
                  💡 <strong className="text-theme-primary">Nota de Redacción:</strong> Todas las postulaciones se registran automáticamente con tu cuenta institucional CITT Connect.
                </p>
              </div>
            </div>

            {/* Bloque 2: Cables Urgentes & Clasificados SOS */}
            <div className="rounded-3xl border border-theme bg-theme-surface p-5 shadow-theme-card">
              <div className="flex items-center justify-between border-b border-theme pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-[#E87722]" />
                  <h3 className="font-serif text-sm font-bold text-theme-primary uppercase tracking-wider">
                    Cables Urgentes SOS
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-[#E87722] bg-[#E87722]/10 px-2 py-0.5 rounded-full">
                  EN VIVO
                </span>
              </div>

              <div className="mt-4 divide-y divide-theme space-y-3">
                {urgentCables.map((cable) => {
                  const campus = getCampusBySlug(cable.campusSlug);
                  return (
                    <article key={cable.id} className="pt-3 first:pt-0 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-theme-secondary">
                        <span className="font-bold text-[#E87722] uppercase">
                          Sede {campus.shortName}
                        </span>
                        <span>{cable.createdAt}</span>
                      </div>

                      <h4 className="text-xs font-bold text-theme-primary leading-snug">
                        {cable.title}
                      </h4>
                      <p className="text-[11px] leading-relaxed text-theme-secondary line-clamp-2">
                        {cable.content}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-theme-secondary">
                          Por{' '}
                          <strong className="text-theme-primary">
                            {cable.authorName.split(' ')[0]}
                          </strong>
                        </span>
                        {cable.actionUrl && (
                          <Link
                            href={cable.actionUrl}
                            className="inline-flex items-center gap-1 font-bold text-[#307FE2] hover:underline"
                          >
                            <span>Responder</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Bloque 3: Reportajes de Fondo Destacados */}
            <div className="rounded-3xl border border-theme bg-theme-surface p-5 shadow-theme-card">
              <h3 className="font-serif text-sm font-bold text-theme-primary uppercase tracking-wider border-b border-theme pb-2.5">
                Suplemento de Investigación
              </h3>

              <div className="mt-4 space-y-4">
                {CITT_BLOG_ARTICLES.slice(0, 2).map((art) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => setReadingArticle(art)}
                    className="group block w-full text-left space-y-1.5 transition"
                  >
                    <span className="text-[10px] font-bold text-[#FFB800] uppercase">
                      {art.readTime}
                    </span>
                    <h4 className="font-serif text-xs font-bold text-theme-primary group-hover:text-[#307FE2] leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-[11px] text-theme-secondary line-clamp-2">
                      {art.excerpt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* 4. SECCIÓN ESPECIAL: SUPLEMENTO DE CRÓNICAS & REPORTAJES A FONDO */}
      {(activeDesk === 'reportajes' || activeDesk === 'todos') && (
        <section aria-label="Suplemento de Crónicas y Reportajes a Fondo" className="space-y-6 border-t border-theme pt-8">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-2xl font-black text-theme-primary sm:text-3xl">
                Suplemento Editorial: Crónicas & Reportajes a Fondo
              </h2>
              <p className="text-xs text-theme-secondary sm:text-sm">
                Análisis en profundidad sobre la red nacional CITT, integración de escuelas y modelo de innovación Duoc UC
              </p>
            </div>

            <span className="text-xs font-semibold text-theme-secondary">
              {CITT_BLOG_ARTICLES.length} crónicas disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {CITT_BLOG_ARTICLES.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card transition hover:border-[#FFB800]/50"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={article.coverImageUrl}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-[#FFB800] px-3 py-1 text-xs font-black text-[#1A1A1A] shadow-md">
                      REPORTAJE CITT
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                      {article.readTime}
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-6 space-y-3">
                  <h3 className="font-serif text-xl font-bold leading-snug text-theme-primary group-hover:text-[#307FE2] transition">
                    {article.title}
                  </h3>
                  <p className="text-xs font-semibold text-theme-secondary leading-relaxed">
                    {article.subtitle}
                  </p>
                  <p className="text-xs text-theme-secondary leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="border-t border-theme p-4 bg-theme-subtle/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={article.authorAvatarUrl}
                      alt={article.authorName}
                      className="h-7 w-7 rounded-full object-cover ring-1 ring-theme"
                    />
                    <div className="text-[11px]">
                      <p className="font-bold text-theme-primary">
                        {article.authorName}
                      </p>
                      <p className="text-theme-secondary">
                        {article.publishedAt}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setReadingArticle(article)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-3.5 py-1.5 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633]"
                  >
                    <span>Leer Reportaje</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 5. MODAL DE LECTURA DE CRÓNICA COMPLETA */}
      {readingArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
        >
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 sm:p-10 shadow-2xl">
            <button
              type="button"
              onClick={() => setReadingArticle(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-theme bg-theme-subtle text-theme-secondary hover:text-theme-primary"
            >
              ✕
            </button>

            <span className="rounded-full bg-[#FFB800] px-3 py-1 text-xs font-black text-[#1A1A1A]">
              CRÓNICA DE INVESTIGACIÓN CITT
            </span>

            <h2 className="font-serif mt-4 text-2xl font-black text-theme-primary sm:text-3xl lg:text-4xl leading-tight">
              {readingArticle.title}
            </h2>

            <p className="mt-2 text-sm font-semibold text-theme-secondary sm:text-base leading-relaxed">
              {readingArticle.subtitle}
            </p>

            <div className="mt-4 flex items-center gap-3 border-y border-theme py-3 text-xs text-theme-secondary">
              <img
                src={readingArticle.authorAvatarUrl}
                alt={readingArticle.authorName}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-[#FFB800]"
              />
              <div>
                <p className="font-bold text-theme-primary">
                  Por {readingArticle.authorName}
                </p>
                <p className="text-[11px]">
                  {readingArticle.publishedAt} · {getCampusBySlug(readingArticle.campusSlug).name} · {readingArticle.readTime}
                </p>
              </div>
            </div>

            <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <img
                src={readingArticle.coverImageUrl}
                alt={readingArticle.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-theme-primary/90 font-serif">
              {readingArticle.contentParagraphs.map((par, i) => (
                <p key={i}>{par}</p>
              ))}
            </div>

            <div className="mt-8 border-t border-theme pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setReadingArticle(null)}
                className="rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
              >
                Cerrar Lectura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
