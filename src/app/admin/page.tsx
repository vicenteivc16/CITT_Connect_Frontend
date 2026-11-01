'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Lock,
  LogIn,
  ShieldAlert,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import { RoleBadge } from '@/components/RoleBadge';

// Subcomponentes del Panel Interno
import {
  AdminSidebarNav,
  AdminModuleTab,
} from '@/components/admin/AdminSidebarNav';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { AdminMuroModeration } from '@/components/admin/AdminMuroModeration';
import { AdminProjectsApproval } from '@/components/admin/AdminProjectsApproval';
import { AdminCalendarBookings } from '@/components/admin/AdminCalendarBookings';
import { AdminModuleJiraPlaceholder } from '@/components/admin/AdminModuleJiraPlaceholder';

export default function AdminControlPlanePage() {
  const { activeUser, isAuthenticated } = useCittNetwork();
  const [activeTab, setActiveTab] = useState<AdminModuleTab>('overview');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFB800] border-t-transparent" />
      </div>
    );
  }

  // 1. Verificación de Autenticación
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-theme bg-theme-surface p-8 text-center shadow-theme-card mt-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFB800]/15 text-[#FFB800]">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-theme-primary">
          Panel Interno CITT Connect
        </h1>
        <p className="mt-2 text-xs text-theme-secondary leading-relaxed">
          Debes iniciar sesión con tu cuenta institucional para ingresar a la consola de gobernanza, moderación y administración de salas.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/acceso?redirect=/admin"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
          >
            <span>Iniciar Sesión con Duoc UC</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-theme bg-theme-subtle px-4 py-2.5 text-xs font-bold text-theme-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </div>
    );
  }

  // 2. Control de Acceso basado en Roles (RBAC)
  const isPrivileged =
    activeUser.role === 'dev' ||
    activeUser.role === 'personal_duoc' ||
    activeUser.role === 'lider_citt';

  if (!isPrivileged) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-red-500/30 bg-theme-surface p-8 text-center shadow-theme-card mt-12 space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-xl font-black text-theme-primary">
            Acceso Restringido a Gobernanza
          </h1>
          <p className="mt-2 text-xs text-theme-secondary leading-relaxed">
            Tu cuenta actual está asignada al rol{' '}
            <strong className="text-theme-primary">
              <RoleBadge role={activeUser.role} showTooltip={false} size="sm" />
            </strong>
            . Este panel interno está reservado exclusivamente para{' '}
            <strong>Líderes de Laboratorio CITT, Coordinadores de Sede y Personal Docente Duoc UC</strong>.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/directorio"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-bold text-[#1A1A1A]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al Directorio Nacional</span>
          </Link>
        </div>
      </div>
    );
  }

  // 3. Renderizado del Panel Interno Multi-Módulo
  return (
    <div className="min-h-[85vh] space-y-8 pb-16">
      <div className="flex flex-col gap-8 lg:flex-row items-start">
        {/* Barra Lateral de Módulos */}
        <AdminSidebarNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeUser={activeUser}
          pendingPostsCount={2}
          pendingProjectsCount={2}
          pendingBookingsCount={1}
        />

        {/* Contenedor del Módulo Activo */}
        <main className="flex-1 min-w-0 w-full">
          {activeTab === 'overview' && (
            <AdminOverview
              onNavigateTab={setActiveTab}
              pendingPostsCount={2}
              pendingProjectsCount={2}
              pendingBookingsCount={1}
            />
          )}

          {activeTab === 'muro' && <AdminMuroModeration />}

          {activeTab === 'proyectos' && <AdminProjectsApproval />}

          {activeTab === 'calendario' && <AdminCalendarBookings />}

          {activeTab === 'ecosistema' && <AdminModuleJiraPlaceholder />}
        </main>
      </div>
    </div>
  );
}
