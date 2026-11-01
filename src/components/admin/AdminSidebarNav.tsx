'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FolderGit2,
  Layers,
  LayoutDashboard,
  Newspaper,
  Shield,
  Sparkles,
  UserCheck,
  Workflow,
} from 'lucide-react';
import { RoleBadge } from '@/components/RoleBadge';
import { CittMemberProfile } from '@/types/citt';

export type AdminModuleTab =
  | 'overview'
  | 'tenants'
  | 'usuarios'
  | 'bitacora'
  | 'calendario'
  | 'proyectos'
  | 'actividades'
  | 'muro'
  | 'ecosistema';

interface AdminSidebarNavProps {
  activeTab: AdminModuleTab;
  onTabChange: (tab: AdminModuleTab) => void;
  activeUser: CittMemberProfile;
  pendingPostsCount: number;
  pendingProjectsCount: number;
  pendingBookingsCount: number;
  pendingActivitiesCount?: number;
}

export function AdminSidebarNav({
  activeTab,
  onTabChange,
  activeUser,
  pendingPostsCount,
  pendingProjectsCount,
  pendingBookingsCount,
  pendingActivitiesCount = 0,
}: AdminSidebarNavProps) {
  const isCoreDev = activeUser.role === 'dev';

  const navItems: {
    id: AdminModuleTab;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeCount?: number;
    badgeColor?: string;
    onlyDev?: boolean;
  }[] = [
    {
      id: 'overview',
      label: 'Control General',
      sublabel: 'KPIs & Telemetría CITT',
      icon: LayoutDashboard,
    },
    {
      id: 'tenants',
      label: 'Sedes & Tenants CITT',
      sublabel: '18 Sedes, Salas & Tótems',
      icon: Building2,
    },
    {
      id: 'usuarios',
      label: 'Padrón de Usuarios',
      sublabel: 'Gestión de roles y sedes',
      icon: UserCheck,
      onlyDev: true,
    },
    {
      id: 'bitacora',
      label: 'Bitácora de Auditoría',
      sublabel: 'Historial en tiempo real',
      icon: Activity,
    },
    {
      id: 'calendario',
      label: 'Salas & Calendario CITT',
      sublabel: 'Reservas, Tótems & QR',
      icon: Calendar,
      badgeCount: pendingBookingsCount,
      badgeColor: '#43B02A',
    },
    {
      id: 'proyectos',
      label: 'Curaduría de Proyectos',
      sublabel: 'Validación TRL & Catálogo',
      icon: FolderGit2,
      badgeCount: pendingProjectsCount,
      badgeColor: '#FFB800',
    },
    {
      id: 'actividades',
      label: 'Talleres & Actividades',
      sublabel: 'Validación de convocatorias',
      icon: Sparkles,
      badgeCount: pendingActivitiesCount,
      badgeColor: '#43B02A',
    },
    {
      id: 'muro',
      label: 'Muro & Noticias',
      sublabel: 'Moderación de despachos',
      icon: Newspaper,
      badgeCount: pendingPostsCount,
      badgeColor: '#307FE2',
    },
    {
      id: 'ecosistema',
      label: 'CITT Jira & Satélites',
      sublabel: 'Plugins y microfrontends',
      icon: Workflow,
    },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Tarjeta de Identidad y Rango Administrativo */}
      <div className="rounded-3xl border border-theme bg-theme-surface p-5 shadow-theme-card space-y-4">
        <div className="flex items-center gap-2.5 border-b border-theme pb-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#FFB800] text-[#1A1A1A] shadow-sm">
            <Shield className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FFB800]">
              Gobernanza Central
            </span>
            <h2 className="text-sm font-black text-theme-primary truncate">
              Panel Interno CITT
            </h2>
          </div>
        </div>

        {/* Perfil del Administrador */}
        <div className="flex items-center gap-3">
          <img
            src={activeUser.avatarUrl || '/assets/citt-logo.webp'}
            alt={activeUser.fullName}
            className="h-10 w-10 rounded-2xl border border-theme object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-theme-primary truncate">
              {activeUser.fullName}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <RoleBadge role={activeUser.role} showTooltip={false} size="sm" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-theme bg-theme-subtle p-2.5 text-[11px] text-theme-secondary flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#43B02A] shrink-0" />
          <span className="truncate">Sesión con permisos ejecutivos activa</span>
        </div>
      </div>

      {/* Navegación por Módulos */}
      <nav
        aria-label="Módulos del panel interno"
        className="rounded-3xl border border-theme bg-theme-surface p-2.5 shadow-theme-card space-y-1"
      >
        <span className="px-3.5 pt-2 pb-1 block text-[10px] font-black uppercase tracking-wider text-theme-secondary">
          Módulos de Gestión
        </span>

        {navItems
          .filter((item) => !item.onlyDev || isCoreDev)
          .map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between rounded-2xl px-3.5 py-3 text-left transition ${
                isActive
                  ? 'bg-[#FFB800] text-[#1A1A1A] shadow-sm font-bold'
                  : 'text-theme-primary hover:bg-theme-subtle'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-[#1A1A1A]' : 'text-[#FFB800]'
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{item.label}</p>
                  <p
                    className={`text-[10px] truncate ${
                      isActive ? 'text-[#1A1A1A]/80' : 'text-theme-secondary'
                    }`}
                  >
                    {item.sublabel}
                  </p>
                </div>
              </div>

              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span
                  style={{
                    backgroundColor: isActive ? '#1A1A1A' : item.badgeColor,
                    color: isActive ? '#FFB800' : '#FFFFFF',
                  }}
                  className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black"
                >
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Accesos rápidos de vuelta al portal */}
      <div className="rounded-3xl border border-theme bg-theme-subtle p-4 space-y-2 text-xs">
        <span className="text-[10px] font-black uppercase tracking-wider text-theme-secondary block">
          Vistas Públicas
        </span>
        <Link
          href="/"
          className="flex items-center justify-between py-1 text-theme-secondary hover:text-theme-primary transition"
        >
          <span>Portada CITT Connect</span>
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/muro"
          className="flex items-center justify-between py-1 text-theme-secondary hover:text-theme-primary transition"
        >
          <span>El Diario CITT (Muro)</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/proyectos"
          className="flex items-center justify-between py-1 text-theme-secondary hover:text-theme-primary transition"
        >
          <span>Hub Nacional de Proyectos</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </aside>
  );
}
