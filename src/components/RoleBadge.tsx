'use client';

import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import {
  Building2,
  Compass,
  Crown,
  ShieldCheck,
  Terminal,
  UserCheck,
} from 'lucide-react';
import { CittRole, DuocSchoolSlug } from '@/types/citt';
import { getSchoolBySlug, ROLE_CONFIG } from '@/data/citt-catalog';
import { useCittNetwork } from '@/context/CittNetworkContext';
import { getSchoolChromaticPair } from '@/styles/themes';

const ROLE_ICONS: Record<CittRole, React.ComponentType<{ className?: string }>> =
  {
    personal_duoc: ShieldCheck,
    lider_citt: Crown,
    consejero_carrera: Compass,
    dev: Terminal,
    partner: Building2,
    usuario_citt: UserCheck,
  };

export function RoleBadge({
  role,
  showTooltip = true,
  size = 'sm',
}: {
  role: CittRole;
  showTooltip?: boolean;
  size?: 'sm' | 'md';
}) {
  const { theme } = useCittNetwork();
  const config = ROLE_CONFIG[role];
  const Icon = ROLE_ICONS[role];
  const isInstitutionalGold = role === 'personal_duoc';

  // In Light mode, non-gold roles use #1A1A1A or official high-contrast school/role accent for the icon
  const iconColor = isInstitutionalGold
    ? '#1A1A1A'
    : theme === 'light' && config.accentHex === '#EEEEEE'
    ? '#1A1A1A'
    : config.accentHex;

  const badge = (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-bold tracking-wide transition-colors ${
        size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-xs'
      } ${
        isInstitutionalGold
          ? 'border-[#FFB800] bg-[#FFB800] text-[#1A1A1A]'
          : 'border-theme-badge-border bg-theme-badge-bg text-theme-badge-text'
      }`}
    >
      <span
        style={{
          color: iconColor,
        }}
        className="inline-flex shrink-0"
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span>{config.shortLabel}</span>
    </span>
  );

  if (!showTooltip) return badge;

  return (
    <Tooltip.Provider delayDuration={180}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{badge}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={6}
            className="z-50 max-w-xs rounded-xl border border-theme bg-theme-surface px-3.5 py-2.5 text-xs text-theme-primary shadow-theme-card"
          >
            <p className="font-bold text-theme-primary">{config.label}</p>
            <p className="mt-1 leading-relaxed text-theme-secondary">
              {config.description}
            </p>
            <Tooltip.Arrow className="fill-[#1A1A1A]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export function SchoolBadge({
  schoolSlug,
  size = 'sm',
}: {
  schoolSlug: DuocSchoolSlug;
  size?: 'sm' | 'md';
}) {
  const { theme } = useCittNetwork();
  const school = getSchoolBySlug(schoolSlug);
  const chromatic = getSchoolChromaticPair(school, theme);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-theme-badge-border bg-theme-badge-bg font-semibold text-theme-badge-text ${
        size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-xs'
      }`}
    >
      <span
        style={{ backgroundColor: chromatic.dotHex }}
        className="h-2.5 w-2.5 shrink-0 rounded-full"
      />
      <span>{school.shortName}</span>
    </span>
  );
}
