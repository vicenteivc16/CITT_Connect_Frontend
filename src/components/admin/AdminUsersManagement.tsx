'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Filter,
  GraduationCap,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';
import { CITT_CAMPUSES, DUOC_SCHOOLS, getCampusBySlug, getSchoolBySlug } from '@/data/citt-catalog';
import { CittMemberProfile, CittRole } from '@/types/citt';
import {
  toggleSupabaseProfileVerification,
  updateSupabaseProfileCampus,
  updateSupabaseProfileRole,
} from '@/lib/supabase/profiles';
import { logAuditEvent } from '@/lib/supabase/audit';

interface AdminUsersManagementProps {
  profiles: CittMemberProfile[];
  onRefreshProfiles: () => Promise<void>;
  activeUser: CittMemberProfile;
}

export function AdminUsersManagement({
  profiles,
  onRefreshProfiles,
  activeUser,
}: AdminUsersManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('todos');
  const [selectedCampus, setSelectedCampus] = useState<string>('todos');
  const [selectedSchool, setSelectedSchool] = useState<string>('todos');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtrado reactivo de usuarios
  const filteredProfiles = profiles.filter((profile) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      profile.fullName.toLowerCase().includes(q) ||
      profile.username.toLowerCase().includes(q) ||
      profile.email.toLowerCase().includes(q) ||
      profile.careerTitle.toLowerCase().includes(q);

    const matchesRole = selectedRole === 'todos' || profile.role === selectedRole;
    const matchesCampus = selectedCampus === 'todos' || profile.campusSlug === selectedCampus;
    const matchesSchool = selectedSchool === 'todos' || profile.schoolSlug === selectedSchool;

    return matchesSearch && matchesRole && matchesCampus && matchesSchool;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleChangeRole = async (username: string, newRole: CittRole) => {
    setIsUpdating(username);
    const success = await updateSupabaseProfileRole(username, newRole);
    if (success) {
      await logAuditEvent({
        campusSlug: activeUser.campusSlug,
        actorUsername: activeUser.username,
        actorName: activeUser.fullName,
        actorRole: activeUser.role,
        actionType: 'cambio_rol',
        title: `Modificación de rango: @${username} ahora tiene rol "${newRole}"`,
        details: { targetUsername: username, newRole },
      });
      showToast(`✓ Rol de @${username} actualizado a ${newRole}.`);
      await onRefreshProfiles();
    } else {
      showToast(`✕ Error al actualizar rol de @${username}.`);
    }
    setIsUpdating(null);
  };

  const handleChangeCampus = async (username: string, newCampus: string) => {
    setIsUpdating(username);
    const success = await updateSupabaseProfileCampus(username, newCampus);
    if (success) {
      await logAuditEvent({
        campusSlug: newCampus,
        actorUsername: activeUser.username,
        actorName: activeUser.fullName,
        actorRole: activeUser.role,
        actionType: 'cambio_sede',
        title: `Reasignación de tenant: @${username} transferido a ${getCampusBySlug(newCampus).shortName}`,
        details: { targetUsername: username, newCampus },
      });
      showToast(`✓ Sede de @${username} actualizada.`);
      await onRefreshProfiles();
    }
    setIsUpdating(null);
  };

  const handleToggleVerification = async (username: string, currentStatus: boolean) => {
    setIsUpdating(username);
    const success = await toggleSupabaseProfileVerification(username, !currentStatus);
    if (success) {
      showToast(`✓ Verificación de @${username} alternada.`);
      await onRefreshProfiles();
    }
    setIsUpdating(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-[#43B02A]/40 bg-[#1A1A1A] p-4 text-xs font-bold text-white shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#43B02A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabecera del Padrón de Usuarios */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#307FE2]">
              SuperAdmin & Control de Identidades
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-theme-primary tracking-tight">
            Padrón Central de Usuarios & Roles CITT
          </h2>
          <p className="mt-1 text-xs text-theme-secondary max-w-2xl leading-relaxed">
            Gestión omnisciente de miembros, docentes, consejeros y líderes de las 18 sedes de Duoc UC.
            Modifica privilegios y asignaciones en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onRefreshProfiles()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-bold text-theme-primary transition hover:bg-theme-surface"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Actualizar</span>
          </button>
          <div className="rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-bold text-theme-primary">
            Total: <span className="text-[#FFB800] font-black">{profiles.length}</span> miembros
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="rounded-3xl border border-theme bg-theme-surface p-4 sm:p-5 shadow-theme-card space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-theme-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, correo @duocuc.cl, username o carrera..."
              className="w-full rounded-2xl border border-theme bg-theme-subtle py-2.5 pl-10 pr-4 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filtro Rol */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-primary focus:outline-none"
            >
              <option value="todos">Todos los Roles</option>
              <option value="dev">👑 Core Dev / SuperAdmin</option>
              <option value="personal_duoc">🏛️ Personal Duoc (Docente)</option>
              <option value="lider_citt">⚡ Líder CITT</option>
              <option value="consejero_carrera">🎓 Consejero de Carrera</option>
              <option value="usuario_citt">👤 Miembro CITT</option>
              <option value="partner">🤝 Partner Oficial</option>
            </select>

            {/* Filtro Sede */}
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-primary focus:outline-none"
            >
              <option value="todos">Todas las Sedes (18 Sedes)</option>
              {CITT_CAMPUSES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Filtro Escuela */}
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-primary focus:outline-none"
            >
              <option value="todos">Todas las Escuelas</option>
              {DUOC_SCHOOLS.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.shortName}
                </option>
              ))}
            </select>

            {(searchQuery || selectedRole !== 'todos' || selectedCampus !== 'todos' || selectedSchool !== 'todos') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRole('todos');
                  setSelectedCampus('todos');
                  setSelectedSchool('todos');
                }}
                className="rounded-xl border border-theme bg-theme-subtle px-3 py-2 text-xs font-bold text-theme-secondary hover:text-theme-primary"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Resumen de resultados */}
        <div className="text-[11px] text-theme-secondary">
          Mostrando <strong className="text-theme-primary">{filteredProfiles.length}</strong> de {profiles.length} usuarios
        </div>
      </div>

      {/* Tabla Padrón de Usuarios */}
      <div className="overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-theme bg-theme-subtle text-[11px] font-black uppercase tracking-wider text-theme-secondary">
                <th className="py-3.5 px-4">Usuario & Credencial</th>
                <th className="py-3.5 px-4">Contacto Institucional</th>
                <th className="py-3.5 px-4">Sede / Tenant</th>
                <th className="py-3.5 px-4">Rol Asignado</th>
                <th className="py-3.5 px-4 text-center">Verificación</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-theme-secondary">
                    No se encontraron usuarios con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((user) => {
                  const campus = getCampusBySlug(user.campusSlug);
                  const isDev = user.role === 'dev';

                  return (
                    <tr key={user.id} className="hover:bg-theme-subtle/50 transition">
                      {/* Usuario */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatarUrl || '/assets/citt-logo.webp'}
                            alt={user.fullName}
                            className="h-10 w-10 shrink-0 rounded-2xl object-cover border border-theme"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-theme-primary truncate">{user.fullName}</p>
                            <p className="text-[11px] font-mono text-theme-secondary">@{user.username}</p>
                            <p className="text-[10px] text-theme-secondary truncate max-w-xs">{user.careerTitle}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contacto */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-mono text-[11px] text-theme-primary">{user.email}</p>
                          <SchoolBadge schoolSlug={user.schoolSlug} />
                        </div>
                      </td>

                      {/* Sede / Tenant Switcher individual */}
                      <td className="py-3.5 px-4">
                        <select
                          value={user.campusSlug}
                          disabled={isUpdating === user.username}
                          onChange={(e) => handleChangeCampus(user.username, e.target.value)}
                          className="rounded-xl border border-theme bg-theme-subtle px-2.5 py-1.5 text-xs font-bold text-theme-primary focus:outline-none cursor-pointer"
                        >
                          {CITT_CAMPUSES.map((c) => (
                            <option key={c.slug} value={c.slug}>
                              {c.shortName} ({c.region})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Rol Switcher individual */}
                      <td className="py-3.5 px-4">
                        <select
                          value={user.role}
                          disabled={isUpdating === user.username}
                          onChange={(e) => handleChangeRole(user.username, e.target.value as CittRole)}
                          className="rounded-xl border border-theme bg-theme-subtle px-2.5 py-1.5 text-xs font-bold text-theme-primary focus:outline-none cursor-pointer"
                        >
                          <option value="dev">👑 Core Dev</option>
                          <option value="personal_duoc">🏛️ Personal Duoc</option>
                          <option value="lider_citt">⚡ Líder CITT</option>
                          <option value="consejero_carrera">🎓 Consejero</option>
                          <option value="usuario_citt">👤 Miembro CITT</option>
                          <option value="partner">🤝 Partner</option>
                        </select>
                      </td>

                      {/* Verificación */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleVerification(user.username, user.isVerified)}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold border transition ${
                            user.isVerified
                              ? 'bg-[#43B02A]/10 text-[#43B02A] border-[#43B02A]/30'
                              : 'bg-red-500/10 text-red-500 border-red-500/30'
                          }`}
                        >
                          {user.isVerified ? '✓ Verificado' : 'Sin Verificar'}
                        </button>
                      </td>

                      {/* Enlace al perfil */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/u/${user.username}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 rounded-xl border border-theme bg-theme-subtle px-3 py-1.5 text-xs font-bold text-theme-primary transition hover:border-[#FFB800] hover:text-[#FFB800]"
                        >
                          <span>Perfil</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
