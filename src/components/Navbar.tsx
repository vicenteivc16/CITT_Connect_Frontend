'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  BookOpen,
  ChevronDown,
  FolderGit2,
  LogIn,
  Moon,
  Newspaper,
  QrCode,
  Shield,
  Sun,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import { ROLE_CONFIG } from '@/data/citt-catalog';
import { RoleBadge } from '@/components/RoleBadge';
import { PhygitalPassCard } from '@/components/PhygitalPassCard';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Inicio',
    icon: BookOpen,
  },
  {
    href: '/directorio',
    label: 'Directorio',
    icon: Users,
  },
  {
    href: '/proyectos',
    label: 'Proyectos',
    icon: FolderGit2,
  },
  {
    href: '/muro',
    label: 'Muro',
    icon: Newspaper,
  },
  {
    href: '/roles',
    label: 'Roles',
    icon: Shield,
  },
  {
    href: '/mi-perfil',
    label: 'Mi Perfil',
    icon: UserCog,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const {
    activeUser,
    profiles,
    setActiveUserByUsername,
    theme,
    setThemeMode,
    connectedMemberIds,
  } = useCittNetwork();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';
  const isTransparentTop = isHome && !isScrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          isTransparentTop
            ? 'border-b border-transparent bg-transparent'
            : 'border-b border-theme bg-[#FFFFFF]/95 shadow-theme-card backdrop-blur-md dark:bg-[#000000]/95'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* 1. PRINCIPIO (Izquierda): Logo e Identidad CITT Connect */}
          <div className="flex shrink-0 items-center justify-start">
            <Link
              href="/"
              className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-3 py-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB800] ${
                isTransparentTop
                  ? 'border border-theme-strong bg-[#FFFFFF]/90 shadow-sm backdrop-blur-md dark:bg-[#141414]/90'
                  : 'border border-transparent bg-transparent'
              }`}
            >
              <img
                src="/assets/citt-logo.webp"
                alt="Emblema CITT Connect 3D"
                className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="whitespace-nowrap text-base font-black tracking-tight text-theme-primary">
                    CITT Connect
                  </span>
                  <span className="whitespace-nowrap rounded-full border border-[#1A1A1A]/20 bg-[#FFB800] px-2 py-0.5 text-xs font-bold text-[#1A1A1A]">
                    Duoc UC
                  </span>
                </div>
                <p className="whitespace-nowrap text-xs font-medium text-theme-secondary">
                  18 Sedes · {connectedMemberIds.length} vínculos
                </p>
              </div>
            </Link>
          </div>

          {/* 2. MEDIO (Centrado): Navegación Principal + Selector de Tema Claro/Oscuro */}
          <div className="hidden flex-1 items-center justify-center xl:flex">
            <nav
              aria-label="Navegación principal"
              className={`flex items-center gap-1 rounded-full p-1.5 transition-all duration-200 ${
                isTransparentTop
                  ? 'border border-theme-strong bg-[#FFFFFF]/90 shadow-sm backdrop-blur-md dark:bg-[#141414]/90'
                  : 'border border-theme bg-theme-subtle'
              }`}
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      isActive
                        ? 'border border-[#1A1A1A]/20 bg-[#FFB800] text-[#1A1A1A] shadow-sm'
                        : 'text-theme-primary hover:bg-theme-subtle'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <span
                aria-hidden="true"
                className="mx-1 h-4 w-px bg-[var(--citt-border-strong)]"
              />

              {/* Selector de Tema Integrado en el Centro */}
              <div
                role="group"
                aria-label="Selector de tema Claro u Oscuro"
                className="inline-flex items-center gap-0.5"
              >
                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  aria-label="Cambiar a Modo Claro"
                  aria-pressed={theme === 'light'}
                  className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold transition ${
                    theme === 'light'
                      ? 'border border-theme bg-[#FFFFFF] text-[#1A1A1A] shadow-sm'
                      : 'text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5 text-[#FFB800]" />
                  <span>Claro</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  aria-label="Cambiar a Modo Oscuro"
                  aria-pressed={theme === 'dark'}
                  className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold transition ${
                    theme === 'dark'
                      ? 'border border-theme bg-[#1A1A1A] text-[#FFFFFF] shadow-sm'
                      : 'text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  <span>Oscuro</span>
                </button>
              </div>
            </nav>
          </div>

          {/* 3. FINAL (Derecha): Mi Pase QR + Usuario Activo */}
          <div className="flex shrink-0 items-center justify-end gap-2">
            {/* Selector de Tema visible en pantallas < xl */}
            <div
              role="group"
              aria-label="Selector de tema móvil"
              className={`inline-flex items-center rounded-xl p-1 xl:hidden ${
                isTransparentTop
                  ? 'border border-theme-strong bg-[#FFFFFF]/90 shadow-sm backdrop-blur-md dark:bg-[#141414]/90'
                  : 'border border-theme bg-theme-subtle'
              }`}
            >
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                aria-label="Modo Claro"
                aria-pressed={theme === 'light'}
                className={`rounded-lg p-1.5 text-xs font-bold ${
                  theme === 'light'
                    ? 'bg-[#FFFFFF] text-[#1A1A1A] shadow-sm'
                    : 'text-theme-secondary'
                }`}
              >
                <Sun className="h-3.5 w-3.5 text-[#FFB800]" />
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                aria-label="Modo Oscuro"
                aria-pressed={theme === 'dark'}
                className={`rounded-lg p-1.5 text-xs font-bold ${
                  theme === 'dark'
                    ? 'bg-[#1A1A1A] text-[#FFFFFF] shadow-sm'
                    : 'text-theme-secondary'
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
            </div>

            <Dialog.Root open={qrModalOpen} onOpenChange={setQrModalOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#1A1A1A]/25 bg-[#FFB800] px-3.5 py-2 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                >
                  <QrCode className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Mi Pase QR</span>
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
                <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[92vh] w-[94vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl focus:outline-none">
                  <div className="mb-2.5 flex items-center justify-between px-1">
                    <Dialog.Title className="text-sm font-bold text-white">
                      Credencial Pública & Código QR ({activeUser.fullName})
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
                  <PhygitalPassCard profile={activeUser} initialShowQR={true} />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            {/* Usuario Activo & Simulador de Rol */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-1.5 text-left text-xs text-theme-primary transition hover:border-[#FFB800] ${
                    isTransparentTop
                      ? 'border border-theme-strong bg-[#FFFFFF]/90 shadow-sm backdrop-blur-md dark:bg-[#141414]/90'
                      : 'border border-theme bg-theme-surface'
                  }`}
                >
                  <img
                    src={activeUser.avatarUrl || '/assets/citt-logo.webp'}
                    alt={activeUser.fullName}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                  <div className="hidden leading-tight sm:block">
                    <p className="font-bold text-theme-primary">
                      {activeUser.fullName.split(' ')[0]}
                    </p>
                    <p className="text-xs font-semibold text-theme-primary">
                      {ROLE_CONFIG[activeUser.role].shortLabel}
                    </p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-theme-secondary" />
                </button>
              </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-50 w-80 rounded-2xl border border-theme bg-theme-surface p-2.5 text-xs text-theme-primary shadow-theme-card"
              >
                <div className="border-b border-theme px-3 py-2">
                  <p className="font-bold text-theme-primary">
                    Simulador de Sesión (6 Roles CITT)
                  </p>
                  <p className="mt-0.5 text-xs text-theme-secondary">
                    Alterna entre perfiles para probar cada rol:
                  </p>
                </div>

                <div className="mt-1.5 max-h-72 space-y-1 overflow-y-auto">
                  {profiles.map((member) => {
                    const isSelected = member.username === activeUser.username;
                    return (
                      <DropdownMenu.Item
                        key={member.id}
                        onSelect={() => setActiveUserByUsername(member.username)}
                        className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 outline-none transition ${
                          isSelected
                            ? 'bg-theme-subtle font-bold text-theme-primary'
                            : 'text-theme-primary hover:bg-theme-subtle/70'
                        }`}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2.5">
                          <img
                            src={member.avatarUrl || '/assets/citt-logo.webp'}
                            alt={member.fullName}
                            className="h-7 w-7 shrink-0 rounded-full object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-bold">
                              {member.fullName}
                            </p>
                            <p className="truncate text-xs text-theme-secondary">
                              {member.careerTitle}
                            </p>
                          </div>
                        </div>
                        <RoleBadge role={member.role} showTooltip={false} />
                      </DropdownMenu.Item>
                    );
                  })}
                </div>

                <DropdownMenu.Separator className="my-2 h-px bg-theme-subtle" />

                <div className="space-y-1.5">
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/acceso"
                      className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-primary outline-none transition hover:border-[#FFB800] hover:bg-theme-surface"
                    >
                      <LogIn className="h-3.5 w-3.5 text-[#307FE2]" />
                      <span>Acceso Institucional & Registro</span>
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item asChild>
                    <Link
                      href="/mi-perfil"
                      className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#FFB800] px-3 py-2 font-bold text-[#1A1A1A] outline-none transition hover:bg-[#ffc633]"
                    >
                      Editar mi credencial y generar QR
                    </Link>
                  </DropdownMenu.Item>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Responsive Tablet/Mobile Navigation Bar */}
      <div
        className={`flex items-center gap-1.5 overflow-x-auto px-4 py-2 transition-colors xl:hidden ${
          isTransparentTop
            ? 'border-t border-theme-strong/40 bg-[#FFFFFF]/90 backdrop-blur-md dark:bg-[#141414]/90'
            : 'border-t border-theme bg-theme-subtle'
        }`}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ${
                isActive
                  ? 'border border-[#1A1A1A]/20 bg-[#FFB800] text-[#1A1A1A]'
                  : 'border border-theme bg-theme-surface text-theme-primary'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
    {!isHome && <div className="h-[116px] xl:h-[74px]" aria-hidden="true" />}
    </>
  );
}
