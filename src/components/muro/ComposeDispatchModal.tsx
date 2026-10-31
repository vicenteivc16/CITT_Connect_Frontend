'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { CITT_CAMPUSES } from '@/data/citt-catalog';
import { CittFeedPost, CittMemberProfile } from '@/types/citt';

interface ComposeDispatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeUser: CittMemberProfile;
  isAuthenticated: boolean;
  onSubmitDispatch: (dispatch: {
    title: string;
    subtitle?: string;
    content: string;
    campusSlug: string;
    category: CittFeedPost['category'];
    imageUrl?: string;
  }) => void;
}

export function ComposeDispatchModal({
  open,
  onOpenChange,
  activeUser,
  isAuthenticated,
  onSubmitDispatch,
}: ComposeDispatchModalProps) {
  const [postTitle, setPostTitle] = useState('');
  const [postSubtitle, setPostSubtitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postCategory, setPostCategory] =
    useState<CittFeedPost['category']>('noticia_citt');
  const [postCampus, setPostCampus] = useState('san-joaquin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    onSubmitDispatch({
      title: postTitle.trim(),
      subtitle: postSubtitle.trim() || undefined,
      content: postContent.trim(),
      campusSlug: postCampus,
      category: postCategory,
      imageUrl: postImageUrl.trim() || undefined,
    });

    setPostTitle('');
    setPostSubtitle('');
    setPostContent('');
    setPostImageUrl('');
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
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
  );
}
