'use client';

import React from 'react';
import { ExternalLink, Linkedin, Sparkles, Trash2, Calendar, User } from 'lucide-react';
import { LinkedInFeaturedPost } from '@/types/citt';

interface LinkedInPostCardProps {
  post: LinkedInFeaturedPost;
  onDelete?: (id: string) => void;
  isEditable?: boolean;
}

export function LinkedInPostCard({
  post,
  onDelete,
  isEditable = false,
}: LinkedInPostCardProps) {
  // Format or sanitize link
  const safeUrl = post.url?.startsWith('http') ? post.url : `https://${post.url}`;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-theme bg-theme-surface p-5 transition-all duration-200 hover:border-[#0A66C2]/40 hover:shadow-lg">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A66C2]/10 text-[#0A66C2]">
              <Linkedin className="h-4 w-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A66C2]">
                Publicación en LinkedIn
              </span>
              {post.publishedAt && (
                <div className="flex items-center gap-1 text-[11px] text-theme-secondary">
                  <Calendar className="h-3 w-3" />
                  <span>{post.publishedAt}</span>
                </div>
              )}
            </div>
          </div>

          {isEditable && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(post.id)}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
              title="Eliminar publicación destacada"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Title */}
        <h4 className="mt-3 text-sm font-bold text-theme-primary line-clamp-2">
          {post.title || 'Publicación compartida en LinkedIn'}
        </h4>

        {/* Summary Snippet */}
        {post.summary && (
          <p className="mt-2 text-xs leading-relaxed text-theme-secondary line-clamp-3">
            {post.summary}
          </p>
        )}

        {/* Author if defined */}
        {post.authorName && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-theme-secondary">
            <User className="h-3 w-3" />
            <span>Por {post.authorName}</span>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-4 pt-3 border-t border-[var(--citt-border)] flex items-center justify-between">
        <a
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A66C2] transition-colors hover:text-[#004182] hover:underline"
        >
          <span>Abrir en LinkedIn</span>
          <ExternalLink className="h-3 w-3" />
        </a>

        <span className="inline-flex items-center gap-1 text-[10px] text-theme-secondary">
          <Sparkles className="h-2.5 w-2.5 text-[#FFB800]" />
          Verificado
        </span>
      </div>
    </div>
  );
}
