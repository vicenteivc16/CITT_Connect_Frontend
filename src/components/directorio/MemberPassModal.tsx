'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { CittMemberProfile } from '@/types/citt';
import { PhygitalPassCard } from '@/components/PhygitalPassCard';

interface MemberPassModalProps {
  member: {
    profile: CittMemberProfile;
    openInQrMode: boolean;
  } | null;
  onClose: () => void;
}

export function MemberPassModal({ member, onClose }: MemberPassModalProps) {
  return (
    <Dialog.Root
      open={member !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[92vh] w-[94vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl focus:outline-none">
          {member && (
            <>
              <div className="mb-2.5 flex items-center justify-between px-1">
                <Dialog.Title className="text-sm font-bold text-white">
                  Credencial CITT Connect — {member.profile.fullName}
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Cerrar modal"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-[#1A1A1A] text-white hover:border-[#FFB800]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>
              <PhygitalPassCard
                profile={member.profile}
                initialShowQR={member.openInQrMode}
              />
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
