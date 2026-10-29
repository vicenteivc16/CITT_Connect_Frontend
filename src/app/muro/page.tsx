'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Building2,
  Compass,
  ExternalLink,
  MapPin,
  Megaphone,
  Plus,
  X,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import { getCampusBySlug } from '@/data/citt-catalog';
import { RoleBadge } from '@/components/RoleBadge';
import { CittFeedPost } from '@/types/citt';

const CATEGORY_LABELS: Record<
  CittFeedPost['category'],
  { label: string; accent: string }
> = {
  oportunidad_partner: {
    label: 'Oportunidad Partner Oficial',
    accent: '#AC4FC6',
  },
  puente_consejero: {
    label: 'Puente Consejero de Carrera ↔ Duoc',
    accent: '#00A499',
  },
  evento_nacional: {
    label: 'Evento / Torneo Inter-Sedes',
    accent: '#FFB800',
  },
  noticia_citt: {
    label: 'Noticia Comunidad CITT',
    accent: '#307FE2',
  },
  pedir_ayuda: {
    label: 'Solicitud de Apoyo Técnico',
    accent: '#E87722',
  },
};

export default function NationalFeedPage() {
  const { posts, activeUser, addPost } = useCittNetwork();
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] =
    useState<CittFeedPost['category']>('noticia_citt');

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
      content: content.trim(),
      actionLabel: `Ver credencial de ${activeUser.fullName.split(' ')[0]}`,
      actionUrl: `/u/${activeUser.username}`,
    });

    setTitle('');
    setContent('');
    setModalOpen(false);
  };

  const renderPostList = (filtered: CittFeedPost[]) => (
    <div className="mt-6 space-y-4">
      {filtered.map((post) => {
        const campus = getCampusBySlug(post.campusSlug);
        const cat = CATEGORY_LABELS[post.category];

        return (
          <article
            key={post.id}
            className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-theme bg-theme-subtle px-3 py-0.5 text-xs font-bold text-theme-primary">
                  <span
                    style={{ backgroundColor: cat.accent }}
                    className="h-2.5 w-2.5 rounded-full"
                  />
                  {cat.label}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-theme-secondary">
                  <MapPin className="h-3.5 w-3.5 text-[#307FE2]" />
                  {campus.name}
                </span>
              </div>
              <span className="text-xs text-theme-secondary">
                {post.createdAt}
              </span>
            </div>

            <h2 className="mt-3.5 text-xl font-black text-theme-primary">
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-theme-secondary">
              {post.content}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-theme pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/u/${post.authorUsername}`}
                  className="text-xs font-bold text-theme-primary hover:underline"
                >
                  {post.authorName}
                </Link>
                <RoleBadge role={post.authorRole} showTooltip={false} />
                <span className="text-xs text-theme-secondary">
                  · {post.authorOccupation}
                </span>
              </div>

              {post.actionUrl && (
                <Link
                  href={post.actionUrl}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-3.5 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                >
                  <span>{post.actionLabel || 'Conectar'}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-6 border-b border-theme pb-8 sm:flex-row sm:items-end">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-balance text-3xl font-black tracking-tight text-theme-primary sm:text-4xl">
            Muro Nacional CITT, Consejeros de Carrera & Partners
          </h1>
          <p className="text-sm leading-relaxed text-theme-secondary">
            Comunicación directa entre todas las sedes CITT de Chile, anuncios y
            prácticas publicadas por empresas Partner, y canal de enlace de los
            Consejeros de Carrera con el alumnado de Duoc UC.
          </p>
        </div>

        <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-3 text-sm font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
            >
              <Plus className="h-4 w-4" />
              <span>Crear Publicación / Anuncio</span>
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-theme bg-theme-surface p-6 text-theme-primary shadow-2xl focus:outline-none">
              <div className="flex items-center justify-between border-b border-theme pb-3">
                <Dialog.Title className="text-base font-bold text-theme-primary">
                  Nueva Publicación en Red Nacional CITT
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-lg p-1 text-theme-secondary hover:text-theme-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>

              <form onSubmit={handlePublish} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Tipo de Publicación
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as CittFeedPost['category'])
                    }
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  >
                    <option value="noticia_citt">
                      Noticia o Logro de Sede CITT
                    </option>
                    <option value="evento_nacional">
                      Evento / Hackathon / Torneo Inter-Sedes
                    </option>
                    <option value="oportunidad_partner">
                      Oportunidad Partner (Práctica, Desafío o Charla)
                    </option>
                    <option value="puente_consejero">
                      Puente Consejero de Carrera (Enlace Alumnos Duoc)
                    </option>
                    <option value="pedir_ayuda">
                      Solicitud de Ayuda Técnica Inter-Sedes
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Titular *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Escribe un título claro para todas las sedes..."
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-primary">
                    Contenido y detalles *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Comparte la información, requisitos o invitación..."
                    className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3.5 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="rounded-xl border border-theme px-4 py-2 text-xs font-semibold text-theme-primary"
                    >
                      Cancelar
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-bold text-[#1A1A1A]"
                  >
                    Publicar como {activeUser.fullName.split(' ')[0]}
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </section>

      {/* Radix UI Tabs for Feed Channels */}
      <Tabs.Root defaultValue="all">
        <Tabs.List
          aria-label="Canales del muro nacional"
          className="flex flex-wrap gap-2 rounded-2xl border border-theme bg-theme-subtle p-2"
        >
          <Tabs.Trigger
            value="all"
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-theme-primary transition data-[state=active]:bg-[#FFB800] data-[state=active]:text-[#1A1A1A]"
          >
            <Megaphone className="h-3.5 w-3.5" />
            <span>Todo el Feed Nacional ({posts.length})</span>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="partner"
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-theme-primary transition data-[state=active]:bg-[#FFB800] data-[state=active]:text-[#1A1A1A]"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Oportunidades Partner</span>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="consejeros"
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-theme-primary transition data-[state=active]:bg-[#FFB800] data-[state=active]:text-[#1A1A1A]"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Puente Consejeros de Carrera</span>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="all">{renderPostList(posts)}</Tabs.Content>
        <Tabs.Content value="partner">
          {renderPostList(
            posts.filter((p) => p.category === 'oportunidad_partner')
          )}
        </Tabs.Content>
        <Tabs.Content value="consejeros">
          {renderPostList(
            posts.filter((p) => p.category === 'puente_consejero')
          )}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
