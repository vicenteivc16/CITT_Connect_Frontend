'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  Inbox,
  LogIn,
  QrCode,
  UserCheck,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import {
  CITT_CAMPUSES,
  getCampusBySlug,
} from '@/data/citt-catalog';
import { CittMemberProfile, CittRole, DuocSchoolSlug } from '@/types/citt';

// Subcomponentes Modulares de Directorio
import {
  DirectoryFiltersBar,
} from '@/components/directorio/DirectoryFiltersBar';
import { MemberDirectoryCard } from '@/components/directorio/MemberDirectoryCard';
import { MemberPassModal } from '@/components/directorio/MemberPassModal';

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function DirectorioNacionalPage() {
  const router = useRouter();
  const {
    profiles,
    activeUser,
    isAuthenticated,
    connectedMemberIds,
    incomingConnectionCount,
    getConnectionStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectOrCancelConnection,
  } = useCittNetwork();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | CittRole>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<'all' | DuocSchoolSlug>(
    'all'
  );
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [connectionFilter, setConnectionFilter] = useState<
    'all' | 'connected' | 'pending'
  >('all');
  const [visibleCount, setVisibleCount] = useState<number>(18);

  const [selectedMember, setSelectedMember] = useState<{
    profile: CittMemberProfile;
    openInQrMode: boolean;
  } | null>(null);

  // Available unique regions
  const regions = useMemo(() => {
    return Array.from(new Set(CITT_CAMPUSES.map((c) => c.region)));
  }, []);

  // Filtered campuses cascading by selected region
  const availableCampuses = useMemo(() => {
    if (selectedRegion === 'all') return CITT_CAMPUSES;
    return CITT_CAMPUSES.filter((c) => c.region === selectedRegion);
  }, [selectedRegion]);

  // Unique list of specialties across all profiles
  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach((p) => p.specialties?.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [profiles]);

  // Handle region change (resets campus if not in region)
  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    if (newRegion !== 'all') {
      const matchInRegion = CITT_CAMPUSES.some(
        (c) => c.region === newRegion && c.slug === selectedCampus
      );
      if (!matchInRegion) setSelectedCampus('all');
    }
  };

  const filteredProfiles = useMemo(() => {
    const q = normalizeText(searchQuery);

    return profiles.filter((member) => {
      const campus = getCampusBySlug(member.campusSlug);
      const connStatus = getConnectionStatus(member.id);

      // Connection filter
      if (connectionFilter === 'connected' && connStatus !== 'connected') {
        return false;
      }
      if (connectionFilter === 'pending' && connStatus !== 'pending_received') {
        return false;
      }

      // Role filter
      if (selectedRole !== 'all' && member.role !== selectedRole) return false;

      // Region filter
      if (selectedRegion !== 'all' && campus.region !== selectedRegion) {
        return false;
      }

      // Campus filter
      if (selectedCampus !== 'all' && member.campusSlug !== selectedCampus) {
        return false;
      }

      // School filter
      if (selectedSchool !== 'all' && member.schoolSlug !== selectedSchool) {
        return false;
      }

      // Specialty filter
      if (
        selectedSpecialty !== 'all' &&
        !member.specialties?.includes(selectedSpecialty)
      ) {
        return false;
      }

      // Search query filter (matches name, role, occupation, bio, campus, specialties)
      if (q) {
        const fullSearchable = normalizeText(
          `${member.fullName} ${member.username} ${member.careerTitle} ${member.currentOccupation} ${campus.name} ${campus.region} ${member.specialties?.join(' ')} ${member.bio}`
        );
        return fullSearchable.includes(q);
      }

      return true;
    });
  }, [
    profiles,
    searchQuery,
    selectedRole,
    selectedRegion,
    selectedCampus,
    selectedSchool,
    selectedSpecialty,
    connectionFilter,
    getConnectionStatus,
  ]);

  const visibleProfiles = useMemo(() => {
    return filteredProfiles.slice(0, visibleCount);
  }, [filteredProfiles, visibleCount]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
    setSelectedRegion('all');
    setSelectedCampus('all');
    setSelectedSchool('all');
    setSelectedSpecialty('all');
    setConnectionFilter('all');
    setVisibleCount(18);
  };

  const handleConnectAction = (member: CittMemberProfile) => {
    if (!isAuthenticated) {
      router.push('/acceso?redirect=/directorio');
      return;
    }

    const status = getConnectionStatus(member.id);
    if (status === 'none') {
      sendConnectionRequest(member.id);
    } else if (status === 'pending_sent') {
      rejectOrCancelConnection(member.id);
    } else if (status === 'pending_received') {
      acceptConnectionRequest(member.id);
    } else if (status === 'connected') {
      if (confirm(`¿Deseas desvincular tu conexión con ${member.fullName}?`)) {
        rejectOrCancelConnection(member.id);
      }
    }
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
      selectedRole !== 'all' ||
      selectedRegion !== 'all' ||
      selectedCampus !== 'all' ||
      selectedSchool !== 'all' ||
      selectedSpecialty !== 'all' ||
      connectionFilter !== 'all'
  );

  return (
    <div className="space-y-8">
      {/* Directory Header */}
      <header className="flex flex-col justify-between gap-6 border-b border-theme pb-8 lg:flex-row lg:items-end">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-theme bg-theme-subtle px-3 py-1 font-mono text-xs font-bold text-theme-primary">
              <span className="h-2 w-2 rounded-full bg-[#43B02A]" />
              Red Nacional CITT · 18 Sedes Oficiales
            </span>
            <span className="rounded-full bg-[#FFB800]/15 px-3 py-1 text-xs font-bold text-[#FFB800]">
              9 Escuelas Duoc UC
            </span>
          </div>

          <h1 className="max-w-[24ch] text-balance text-3xl font-black tracking-tight text-theme-primary sm:text-4xl">
            Directorio Nacional de Credenciales CITT
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-theme-secondary">
            Encuentra y conecta con estudiantes, líderes de innovación, consejeros de carrera,
            directivos y partners de todas las sedes de Chile. Vincula tu red profesional con{' '}
            <strong>+ Connect</strong> y accede a su credencial Phygital y contacto oficial vCard.
          </p>
        </div>

        {/* Header Action Badges & Session Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Mis Vínculos */}
              <button
                type="button"
                onClick={() =>
                  setConnectionFilter((prev) =>
                    prev === 'connected' ? 'all' : 'connected'
                  )
                }
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                  connectionFilter === 'connected'
                    ? 'border-[#FFB800] bg-[#FFB800] text-[#1A1A1A]'
                    : 'border-theme bg-theme-subtle text-theme-primary hover:border-[#FFB800]'
                }`}
              >
                <UserCheck className="h-4 w-4" />
                <span>Mis Vínculos ({connectedMemberIds.length})</span>
              </button>

              {/* Solicitudes Entrantes */}
              <button
                type="button"
                onClick={() =>
                  setConnectionFilter((prev) =>
                    prev === 'pending' ? 'all' : 'pending'
                  )
                }
                className={`relative inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                  connectionFilter === 'pending'
                    ? 'border-[#FFB800] bg-[#FFB800] text-[#1A1A1A]'
                    : 'border-theme bg-theme-subtle text-theme-primary hover:border-[#FFB800]'
                }`}
              >
                <Inbox className="h-4 w-4 text-[#307FE2]" />
                <span>Solicitudes</span>
                {incomingConnectionCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E87722] text-[10px] font-black text-white">
                    {incomingConnectionCount}
                  </span>
                )}
              </button>

              {/* Acceso a QR propio */}
              <button
                type="button"
                onClick={() =>
                  setSelectedMember({
                    profile: activeUser,
                    openInQrMode: true,
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
              >
                <QrCode className="h-4 w-4" />
                <span>Mi Credencial QR</span>
              </button>
            </>
          ) : (
            <Link
              href="/acceso?redirect=/directorio"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
            >
              <LogIn className="h-4 w-4" />
              <span>Acceder para Conectar (+ Connect)</span>
            </Link>
          )}
        </div>
      </header>

      {/* Multi-Axis Filter Panel */}
      <DirectoryFiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        selectedSchool={selectedSchool}
        onSchoolChange={setSelectedSchool}
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={setSelectedSpecialty}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        regions={regions}
        availableCampuses={availableCampuses}
        allSpecialties={allSpecialties}
        totalResults={filteredProfiles.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {/* Member Credentials Grid */}
      {filteredProfiles.length === 0 ? (
        <div className="rounded-2xl border border-theme bg-theme-subtle p-12 text-center">
          <p className="text-base font-bold text-theme-primary">
            No se encontraron miembros con esos criterios de búsqueda
          </p>
          <p className="mt-1 text-xs text-theme-secondary">
            Prueba restableciendo los filtros de región, sede, escuela, rol o especialidad.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-bold text-[#1A1A1A]"
          >
            Restablecer todos los filtros
          </button>
        </div>
      ) : (
        <section
          aria-label="Listado nacional de credenciales CITT"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {visibleProfiles.map((member) => (
            <MemberDirectoryCard
              key={member.id}
              member={member}
              isSelf={isAuthenticated && member.id === activeUser.id}
              connStatus={getConnectionStatus(member.id)}
              onConnectAction={handleConnectAction}
              onAcceptConnection={acceptConnectionRequest}
              onRejectConnection={rejectOrCancelConnection}
              onOpenQr={(m) =>
                setSelectedMember({
                  profile: m,
                  openInQrMode: true,
                })
              }
              onSelectSpecialty={setSelectedSpecialty}
            />
          ))}
        </section>
      )}

      {/* Progressive Load / Pagination */}
      {visibleCount < filteredProfiles.length && (
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 18)}
            className="inline-flex items-center gap-2 rounded-2xl border border-theme bg-theme-surface px-6 py-3 text-xs font-bold text-theme-primary shadow-theme-card transition hover:border-[#FFB800]"
          >
            <span>Cargar más talentos (+18)</span>
            <ChevronDown className="h-4 w-4 text-[#FFB800]" />
          </button>
        </div>
      )}

      {/* Modal for Phygital Pass & QR Inspection */}
      <MemberPassModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
