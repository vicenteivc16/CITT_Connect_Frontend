'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Radio, X } from 'lucide-react';
import { getCampusBySlug } from '@/data/citt-catalog';
import { RoleBadge } from '@/components/RoleBadge';
import { CittFeedPost } from '@/types/citt';

interface CommunityDispatchModalProps {
  post: CittFeedPost | null;
  onClose: () => void;
}

export function CommunityDispatchModal({
  post,
  onClose,
}: CommunityDispatchModalProps) {
  if (!post) return null;

  const campus = getCampusBySlug(post.campusSlug);

  return (
    <Dialog.Root open={!!post} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-theme pb-3">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-[#E87722]" />
                <span className="text-xs font-black uppercase text-[#E87722]">
                  Despacho Sede {campus.shortName}
                </span>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="text-theme-secondary hover:text-theme-primary">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-black text-theme-primary">
              {post.title}
            </h3>

            {post.imageUrl && (
              <div className="aspect-[16/9] overflow-hidden rounded-xl border border-theme">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            <div className="flex items-center justify-between border-t border-theme pt-3 text-xs text-theme-secondary">
              <span className="font-bold text-theme-primary">
                Despachado por @{post.authorUsername}
              </span>
              <RoleBadge role={post.authorRole} showTooltip={false} size="sm" />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
