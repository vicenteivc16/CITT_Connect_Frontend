'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  BookOpen,
  ChevronDown,
  FolderGit2,
  LogIn,
  LogOut,
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
  const router = useRouter();
  const {
    activeUser,
    isAuthenticated,
    profiles,
    setActiveUserByUsername,
    logoutMember,
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
  const isPrivileged =
    isAuthenticated &&
    (activeUser.role === 'dev' ||
      activeUser.role === 'personal_duoc' ||
      activeUser.role === 'lider_citt');

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
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap text-base font-black tracking-tight text-theme-primary">
                    CITT Connect
                  </span>
                  <img
                    src="/assets/Logo_DuocUC.svg.webp"
                    alt="Logo Oficial Duoc UC"
                    className="h-4 w-auto object-contain hidden sm:inline-block brightness-100 dark:brightness-110"
                  />
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

            {!isAuthenticated ? (
              <Link
                href="/acceso"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-black text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
              >
                <LogIn className="h-4 w-4" />
                <span>Acceso / Iniciar Sesión</span>
              </Link>
            ) : (
              <>
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

                {/* Acceso Directo al Panel Interno para Roles con Privilegios */}
                {isPrivileged && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#307FE2]/40 bg-[#307FE2]/10 px-3 py-2 text-xs font-bold text-[#307FE2] shadow-sm transition hover:bg-[#307FE2] hover:text-white"
                  >
                    <Shield className="h-4 w-4 shrink-0" />
                    <span className="hidden md:inline">Panel Interno</span>
                  </Link>
                )}

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
                      className="z-50 w-80 rounded-2xl border border-theme bg-theme-surface p-3 text-xs text-theme-primary shadow-theme-card"
                    >
                      {/* Cabecera Institucional del Usuario Activo */}
                      <div className="border-b border-theme pb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={activeUser.avatarUrl || '/assets/citt-logo.webp'}
                            alt={activeUser.fullName}
                            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-[#FFB800]"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-black text-theme-primary">
                              {activeUser.fullName}
                            </p>
                            <p className="truncate text-[11px] text-theme-secondary">
                              {activeUser.email}
                            </p>
                            <div className="mt-1 flex items-center gap-1.5">
                              <RoleBadge role={activeUser.role} showTooltip={false} size="sm" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enlaces Rápidos de Gestión */}
                      <div className="py-2 space-y-1">
                        <DropdownMenu.Item asChild>
                          <Link
                            href="/mi-perfil"
                            className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-theme-primary transition hover:bg-theme-subtle"
                          >
                            <span>Mi Perfil & Credencial NFC</span>
                            <span className="text-[11px] text-[#FFB800] font-black">→</span>
                          </Link>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item asChild>
                          <Link
                            href={`/u/${activeUser.username}`}
                            className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-theme-primary transition hover:bg-theme-subtle"
                          >
                            <span>Ver mi Perfil Público</span>
                            <span className="text-[11px] text-[#307FE2] font-black">↗</span>
                          </Link>
                        </DropdownMenu.Item>

                        {isPrivileged && (
                          <DropdownMenu.Item asChild>
                            <Link
                              href="/admin"
                              className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#307FE2]/30 bg-[#307FE2]/10 px-3 py-2 text-xs font-bold text-[#307FE2] transition hover:bg-[#307FE2] hover:text-white"
                            >
                              <div className="flex items-center gap-2">
                                <Shield className="h-3.5 w-3.5" />
                                <span>Panel Interno CITT</span>
                              </div>
                              <span className="rounded-full bg-[#FFB800] px-1.5 py-0.5 text-[9px] font-black text-[#1A1A1A]">
                                ADMIN
                              </span>
                            </Link>
                          </DropdownMenu.Item>
                        )}
                      </div>

                      {/* Simulador Rápido de Roles (Herramienta Institucional CITT) */}
                      <div className="border-t border-theme pt-2">
                        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-theme-secondary">
                          Alternar Rol de Usuario
                        </p>
                        <div className="mt-1.5 max-h-48 space-y-1 overflow-y-auto pr-1">
                          {profiles.map((member) => {
                            const isSelected = member.username === activeUser.username;
                            return (
                              <DropdownMenu.Item
                                key={member.id}
                                onSelect={() => setActiveUserByUsername(member.username)}
                                className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 outline-none transition ${
                                  isSelected
                                    ? 'bg-theme-subtle font-bold text-theme-primary'
                                    : 'text-theme-primary hover:bg-theme-subtle/70'
                                }`}
                              >
                                <div className="flex min-w-0 flex-1 items-center gap-2">
                                  <img
                                    src={member.avatarUrl || '/assets/citt-logo.webp'}
                                    alt={member.fullName}
                                    className="h-6 w-6 shrink-0 rounded-full object-cover"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[11px] font-bold">
                                      {member.fullName.split(' ')[0]}
                                    </p>
                                    <p className="truncate text-[10px] text-theme-secondary">
                                      {ROLE_CONFIG[member.role].shortLabel}
                                    </p>
                                  </div>
                                </div>
                                {isSelected && (
                                  <span className="text-[#FFB800] font-black text-xs">●</span>
                                )}
                              </DropdownMenu.Item>
                            );
                          })}
                        </div>
                      </div>

                      <DropdownMenu.Separator className="my-2 h-px bg-theme" />

                      {/* Botón de Cerrar Sesión */}
                      <DropdownMenu.Item asChild>
                        <button
                          type="button"
                          onClick={() => {
                            logoutMember();
                            router.push('/acceso');
                          }}
                          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-500 outline-none transition hover:bg-red-500 hover:text-white"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Cerrar Sesión Institucional</span>
                        </button>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </>
            )}
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

        {isPrivileged && (
          <Link
            href="/admin"
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              pathname.startsWith('/admin')
                ? 'border-[#307FE2] bg-[#307FE2] text-white shadow-sm'
                : 'border-[#307FE2]/40 bg-[#307FE2]/10 text-[#307FE2]'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin CITT</span>
          </Link>
        )}
      </div>
    </header>
    {!isHome && <div className="h-[116px] xl:h-[74px]" aria-hidden="true" />}
    </>
  );
}
