'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FolderGit2,
  LayoutDashboard,
  Monitor,
  Newspaper,
  Shield,
  Sparkles,
  UserCheck,
  Workflow,
} from 'lucide-react';
import { RoleBadge } from '@/components/RoleBadge';
import { CittMemberProfile, CittRole } from '@/types/citt';

export type AdminModuleTab =
  | 'overview'
  | 'salas_totem'
  | 'calendario'
  | 'muro'
  | 'proyectos'
  | 'actividades'
  | 'bitacora'
  | 'tenants'
  | 'usuarios'
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

interface NavItemConfig {
  id: AdminModuleTab;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  badgeColor?: string;
  allowedRoles: CittRole[];
}

interface NavSectionConfig {
  id: string;
  title: string;
  items: NavItemConfig[];
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
  const userRole = activeUser.role;

  // Secciones y módulos organizados por dominio funcional y matriz RBAC
  const navSections: NavSectionConfig[] = [
    {
      id: 'operaciones',
      title: 'Operación de Sede & Salas',
      items: [
        {
          id: 'overview',
          label: 'Control General',
          sublabel: 'KPIs & Telemetría CITT',
          icon: LayoutDashboard,
          allowedRoles: ['dev', 'personal_duoc', 'lider_citt'],
        },
        {
          id: 'salas_totem',
          label: 'Salas & Tótems Kiosk',
          sublabel: 'Rutas, QR & Salvapantallas',
          icon: Monitor,
          allowedRoles: ['dev', 'personal_duoc', 'lider_citt'],
        },
        {
          id: 'calendario',
          label: 'Reservas & Calendario',
          sublabel: 'Aprobación & Bloqueos',
          icon: Calendar,
          badgeCount: pendingBookingsCount,
          badgeColor: '#43B02A',
          allowedRoles: ['dev', 'personal_duoc', 'lider_citt'],
        },
      ],
    },
    {
      id: 'curaduria',
      title: 'Curaduría & Aprobaciones',
      items: [
        {
          id: 'muro',
          label: 'Muro & Despachos',
          sublabel: 'Moderación de noticias',
          icon: Newspaper,
          badgeCount: pendingPostsCount,
          badgeColor: '#307FE2',
          allowedRoles: ['dev', 'personal_duoc', 'lider_citt'],
        },
        {
          id: 'proyectos',
          label: 'Curaduría de Proyectos',
          sublabel: 'Validación TRL & Catálogo',
          icon: FolderGit2,
          badgeCount: pendingProjectsCount,
          badgeColor: '#FFB800',
          allowedRoles: ['dev', 'personal_duoc', 'lider_citt'],
        },
        {
          id: 'actividades',
          label: 'Talleres & Actividades',
          sublabel: 'Validación de aforos',
          icon: Sparkles,
          badgeCount: pendingActivitiesCount,
          badgeColor: '#43B02A',
          allowedRoles: ['dev', 'personal_duoc', 'lider_citt'],
        },
      ],
    },
    {
      id: 'gobernanza',
      title: 'Plataforma & Gobernanza',
      items: [
        {
          id: 'bitacora',
          label: 'Bitácora de Auditoría',
          sublabel: userRole === 'dev' ? 'Trazabilidad nacional' : 'Historial de sede',
          icon: Activity,
          allowedRoles: ['dev', 'personal_duoc'],
        },
        {
          id: 'tenants',
          label: userRole === 'dev' ? 'Red Nacional de Sedes' : 'Sede & Equipamiento',
          sublabel: userRole === 'dev' ? '18 Sedes CITT Duoc UC' : 'Información institucional',
          icon: Building2,
          allowedRoles: ['dev', 'personal_duoc'],
        },
        {
          id: 'usuarios',
          label: 'Padrón de Usuarios',
          sublabel: 'Gestión de roles y sedes',
          icon: UserCheck,
          allowedRoles: ['dev'],
        },
        {
          id: 'ecosistema',
          label: 'CITT Jira & Satélites',
          sublabel: 'Plugins y microfrontends',
          icon: Workflow,
          allowedRoles: ['dev'],
        },
      ],
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

      {/* Navegación por Secciones y Módulos RBAC */}
      <nav
        aria-label="Módulos del panel interno"
        className="rounded-3xl border border-theme bg-theme-surface p-3 shadow-theme-card space-y-4"
      >
        {navSections.map((section, sIdx) => {
          // Filtrar items permitidos para el rol activo
          const visibleItems = section.items.filter((item) =>
            item.allowedRoles.includes(userRole)
          );

          // Si el usuario no tiene acceso a ningún item de esta sección, omitirla
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.id} className={sIdx > 0 ? 'pt-2 border-t border-theme/60' : ''}>
              <span className="px-3 pt-1 pb-1.5 block text-[10px] font-black uppercase tracking-wider text-theme-secondary opacity-80">
                {section.title}
              </span>

              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onTabChange(item.id)}
                      className={`w-full flex items-center justify-between rounded-2xl px-3 py-2.5 text-left transition ${
                        isActive
                          ? 'bg-[#FFB800] text-[#1A1A1A] shadow-sm font-bold'
                          : 'text-theme-primary hover:bg-theme-subtle'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive ? 'text-[#1A1A1A]' : 'text-[#FFB800]'
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate leading-tight">{item.label}</p>
                          <p
                            className={`text-[10px] truncate leading-tight mt-0.5 ${
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
              </div>
            </div>
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
