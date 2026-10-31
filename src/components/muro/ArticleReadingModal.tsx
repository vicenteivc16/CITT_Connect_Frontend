'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ExternalLink, X } from 'lucide-react';
import { NewsItem } from '@/app/api/news/route';

interface ArticleReadingModalProps {
  article: NewsItem | null;
  onClose: () => void;
}

export function ArticleReadingModal({ article, onClose }: ArticleReadingModalProps) {
  if (!article) return null;

  return (
    <Dialog.Root open={!!article} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 sm:p-10 shadow-2xl">
          <div className="space-y-6">
            {/* Cabecera del Reportaje con Logo Duoc UC */}
            <div className="flex items-center justify-between border-b border-theme pb-4">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/Logo_DuocUC.svg.webp"
                  alt="Duoc UC"
                  className="h-5 w-auto object-contain brightness-100 dark:brightness-110"
                />
                <span className="rounded-full bg-[#FFB800] px-2.5 py-0.5 text-xs font-black text-[#1A1A1A]">
                  {article.schoolName}
                </span>
                <span className="text-xs font-bold text-theme-secondary">
                  {article.regionLabel}
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
                {article.title}
              </h2>
              <p className="font-serif text-sm sm:text-base font-bold text-theme-secondary leading-relaxed">
                {article.subtitle}
              </p>
              <div className="flex items-center gap-3 text-xs text-theme-secondary border-t border-b border-theme py-2.5">
                <span>
                  Por <strong className="text-theme-primary">{article.author}</strong> ({article.authorTitle})
                </span>
                <span>·</span>
                <span>Fuente: {article.sourceName}</span>
                <span>·</span>
                <span>{article.readingTime}</span>
              </div>
            </div>

            {/* Imagen Principal */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-theme bg-theme-subtle">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Cuerpo del Reportaje (Con Formato Periodístico y Drop-Cap dorado) */}
            <div className="space-y-4 text-xs sm:text-sm text-theme-primary/90 leading-relaxed font-serif">
              {article.content.split('\n\n').map((paragraph, pIdx) => (
                <p
                  key={pIdx}
                  className={
                    pIdx === 0
                      ? 'first-letter:text-4xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:text-[#FFB800]'
                      : ''
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Enlace a Fuente Original si existe */}
            {article.sourceUrl && (
              <div className="pt-2">
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#307FE2] hover:underline"
                >
                  <span>Ver fuente original en {article.sourceName}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}

            {/* Pie del Modal */}
            <div className="flex items-center justify-between border-t border-theme pt-4">
              <div className="flex flex-wrap gap-1">
                {article.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-theme bg-theme-subtle px-2 py-0.5 text-[10px] font-semibold text-theme-secondary"
                  >
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
  );
}
