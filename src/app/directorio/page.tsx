'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Check,
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  Github,
  Globe,
  Inbox,
  Linkedin,
  LogIn,
  Mail,
  MapPin,
  QrCode,
  Search,
  SlidersHorizontal,
  UserCheck,
  UserPlus,
  UserX,
  X,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import {
  CITT_CAMPUSES,
  DUOC_SCHOOLS,
  getCampusBySlug,
  getSchoolBySlug,
} from '@/data/citt-catalog';
import { CittMemberProfile, CittRole, DuocSchoolSlug } from '@/types/citt';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';
import { PhygitalPassCard } from '@/components/PhygitalPassCard';
import { downloadMemberVCard } from '@/lib/vcard';

const ROLE_FILTER_OPTIONS: { value: 'all' | CittRole; label: string }[] = [
  { value: 'all', label: 'Todos los Roles' },
  { value: 'personal_duoc', label: 'Personal Duoc' },
  { value: 'lider_citt', label: 'Líderes CITT' },
  { value: 'consejero_carrera', label: 'Consejeros de Carrera' },
  { value: 'partner', label: 'Partners Oficiales' },
  { value: 'dev', label: 'Core Devs' },
  { value: 'usuario_citt', label: 'Miembros CITT' },
];

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
    incomingConnectionRequests,
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
        !member.specialties?.some((s) => s.toLowerCase() === selectedSpecialty.toLowerCase())
      ) {
        return false;
      }

      // Search query (accent-insensitive)
      if (!q) return true;

      const haystack = normalizeText(
        [
          member.fullName,
          member.email,
          member.careerTitle,
          member.currentOccupation,
          member.username,
          campus.name,
          campus.region,
          ...(member.specialties || []),
        ].join(' ')
      );

      return haystack.includes(q);
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

              {/* Mi Credencial QR */}
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
      <section
        aria-label="Filtros del directorio"
        className="space-y-4 rounded-2xl border border-theme bg-theme-subtle p-5"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          {/* Search Input with Unaccent */}
          <div className="relative md:col-span-4">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, especialidad, carrera o sede..."
              className="w-full rounded-xl border border-theme bg-theme-surface py-2.5 pr-4 pl-10 text-sm text-theme-primary placeholder:text-theme-secondary focus:border-[#FFB800] focus:outline-none"
            />
          </div>

          {/* Region Filter */}
          <div className="md:col-span-2">
            <select
              aria-label="Filtrar por Región"
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="w-full rounded-xl border border-theme bg-theme-surface px-3 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
            >
              <option value="all">Todas las Regiones</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  Región {region}
                </option>
              ))}
            </select>
          </div>

          {/* Campus Filter (Cascading) */}
          <div className="md:col-span-3">
            <select
              aria-label="Filtrar por Sede CITT"
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full rounded-xl border border-theme bg-theme-surface px-3 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
            >
              <option value="all">
                {selectedRegion === 'all'
                  ? 'Todas las Sedes (18 Sedes)'
                  : `Sedes de ${selectedRegion} (${availableCampuses.length})`}
              </option>
              {availableCampuses.map((campus) => (
                <option key={campus.slug} value={campus.slug}>
                  {campus.name}
                </option>
              ))}
            </select>
          </div>

          {/* School Filter */}
          <div className="md:col-span-3">
            <select
              aria-label="Filtrar por Escuela Duoc UC"
              value={selectedSchool}
              onChange={(e) =>
                setSelectedSchool(e.target.value as 'all' | DuocSchoolSlug)
              }
              className="w-full rounded-xl border border-theme bg-theme-surface px-3 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
            >
              <option value="all">Todas las Escuelas (9 Escuelas)</option>
              {DUOC_SCHOOLS.map((school) => (
                <option key={school.slug} value={school.slug}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Specialty Selector + Role Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme pt-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Specialty Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-theme-secondary">Especialidad:</span>
              <select
                aria-label="Filtrar por Especialidad"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
              >
                <option value="all">Todas las especialidades</option>
                {allSpecialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 inline-flex items-center gap-1 text-xs font-bold text-theme-secondary">
                <SlidersHorizontal className="h-3 w-3 text-[#FFB800]" />
                <span>Rol:</span>
              </span>
              {ROLE_FILTER_OPTIONS.map((option) => {
                const active = selectedRole === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedRole(option.value)}
                    className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
                      active
                        ? 'bg-[#FFB800] text-[#1A1A1A]'
                        : 'border border-theme bg-theme-surface text-theme-primary hover:border-[#FFB800]'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tabular-nums text-theme-secondary">
              Mostrando <strong className="text-theme-primary">{filteredProfiles.length}</strong> perfiles verificados
            </span>

            {(searchQuery ||
              selectedRole !== 'all' ||
              selectedRegion !== 'all' ||
              selectedCampus !== 'all' ||
              selectedSchool !== 'all' ||
              selectedSpecialty !== 'all' ||
              connectionFilter !== 'all') && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-[#FFB800] hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </section>

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
          {visibleProfiles.map((member) => {
            const campus = getCampusBySlug(member.campusSlug);
            const school = getSchoolBySlug(member.schoolSlug);
            const isSelf = isAuthenticated && member.id === activeUser.id;
            const connStatus = getConnectionStatus(member.id);

            return (
              <article
                key={member.id}
                className="flex flex-col justify-between overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card transition duration-200 hover:shadow-lg"
              >
                {/* Top School Color Strip */}
                <div
                  style={{ backgroundColor: school.primaryHex }}
                  className="h-2 w-full"
                />

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    {/* Lanyard Cutout + Role/School Badges */}
                    <div
                      aria-hidden="true"
                      className="mx-auto mb-3.5 h-2 w-12 rounded-full border border-theme bg-theme-subtle"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <RoleBadge role={member.role} />
                      <SchoolBadge schoolSlug={member.schoolSlug} />
                    </div>

                    {/* Crisp Portrait & Identity */}
                    <div className="mt-5 flex items-center gap-4">
                      <img
                        src={member.avatarUrl || '/assets/citt-logo.webp'}
                        alt={member.fullName}
                        style={{ borderColor: school.primaryHex }}
                        className="h-16 w-16 shrink-0 rounded-2xl border-2 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/u/${member.username}`}
                          className="block truncate text-lg font-black text-theme-primary hover:underline focus:outline-none"
                        >
                          {member.fullName}
                        </Link>
                        <p className="line-clamp-1 text-xs font-bold text-theme-primary">
                          {member.currentOccupation}
                        </p>
                        <p className="mt-0.5 truncate font-serif text-xs italic text-theme-secondary">
                          {member.careerTitle}
                        </p>
                      </div>
                    </div>

                    {/* Campus, Region & Email */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-y border-theme py-2.5 text-xs text-theme-primary">
                      <span className="inline-flex items-center gap-1.5 font-semibold">
                        <MapPin className="h-3.5 w-3.5 text-[#FFB800]" />
                        {campus.shortName} ({campus.region})
                      </span>
                      <span className="inline-flex items-center gap-1.5 truncate text-theme-secondary">
                        <Mail className="h-3.5 w-3.5 text-[#307FE2]" />
                        {member.email}
                      </span>
                    </div>

                    {/* Special Role Context */}
                    {member.role === 'consejero_carrera' &&
                      member.representedCareerInfo && (
                        <p className="mt-3 border-b border-theme pb-2.5 text-xs text-theme-secondary">
                          <strong className="font-bold text-theme-primary">
                            Puente Carrera:{' '}
                          </strong>
                          {member.representedCareerInfo}
                        </p>
                      )}

                    {member.role === 'partner' && member.partnerOrganization && (
                      <p className="mt-3 border-b border-theme pb-2.5 text-xs text-theme-secondary">
                        <strong className="font-bold text-theme-primary">
                          Partner:{' '}
                        </strong>
                        {member.partnerOrganization}
                      </p>
                    )}

                    {/* Specialties */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(member.specialties || []).slice(0, 4).map((spec) => (
                        <span
                          key={spec}
                          onClick={() => setSelectedSpecialty(spec)}
                          className="cursor-pointer rounded-lg bg-theme-elevated px-2.5 py-1 text-xs font-semibold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                          title={`Filtrar por ${spec}`}
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: + Connect Engine (Bilateral) + QR + vCard + Ficha */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-theme pt-4">
                    {/* Bilateral Connection Button */}
                    {isSelf ? (
                      <Link
                        href="/mi-perfil"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-theme-elevated px-3.5 py-2 text-xs font-bold text-theme-primary hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                      >
                        <span>Tu Perfil Activo</span>
                      </Link>
                    ) : connStatus === 'connected' ? (
                      <button
                        type="button"
                        onClick={() => handleConnectAction(member)}
                        title="Haz clic para desvincular"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-theme-inverse px-3.5 py-2 text-xs font-bold text-theme-text-inverse transition hover:opacity-85"
                      >
                        <UserCheck className="h-3.5 w-3.5 text-[#43B02A]" />
                        <span>Conectado</span>
                      </button>
                    ) : connStatus === 'pending_sent' ? (
                      <button
                        type="button"
                        onClick={() => handleConnectAction(member)}
                        title="Haz clic para cancelar solicitud"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-subtle px-3.5 py-2 text-xs font-bold text-theme-secondary transition hover:border-[#E87722] hover:text-[#E87722]"
                      >
                        <Clock className="h-3.5 w-3.5 text-[#FFB800]" />
                        <span>Enviada (Cancelar)</span>
                      </button>
                    ) : connStatus === 'pending_received' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => acceptConnectionRequest(member.id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-[#43B02A] px-2.5 py-2 text-xs font-bold text-white transition hover:bg-[#389623]"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Aceptar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectOrCancelConnection(member.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-theme bg-theme-surface px-2.5 py-2 text-xs font-bold text-theme-secondary transition hover:text-red-500"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleConnectAction(member)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-3.5 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>+ Connect</span>
                      </button>
                    )}

                    {/* Quick Actions: Socials, vCard, QR, Ficha */}
                    <div className="flex items-center gap-1.5">
                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`LinkedIn de ${member.fullName}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-theme-elevated text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                        >
                          <Linkedin className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {member.githubUrl && (
                        <a
                          href={member.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`GitHub de ${member.fullName}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-theme-elevated text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                        >
                          <Github className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {member.portfolioUrl && (
                        <a
                          href={member.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Portafolio de ${member.fullName}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-theme-elevated text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                        >
                          <Globe className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          downloadMemberVCard(
                            member,
                            typeof window !== 'undefined'
                              ? `${window.location.origin}/u/${member.username}`
                              : `https://cittconnect.cl/u/${member.username}`
                          )
                        }
                        title="Descargar contacto vCard (.vcf)"
                        aria-label={`Descargar contacto de ${member.fullName}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-theme-elevated text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedMember({
                            profile: member,
                            openInQrMode: true,
                          })
                        }
                        className="inline-flex items-center gap-1 rounded-xl bg-theme-elevated px-2.5 py-1.5 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        <span>QR</span>
                      </button>

                      <Link
                        href={`/u/${member.username}`}
                        className="inline-flex items-center gap-1 rounded-xl bg-theme-elevated px-2.5 py-1.5 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                      >
                        <span>Ficha</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
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
      <Dialog.Root
        open={selectedMember !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedMember(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[92vh] w-[94vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl focus:outline-none">
            {selectedMember && (
              <>
                <div className="mb-2.5 flex items-center justify-between px-1">
                  <Dialog.Title className="text-sm font-bold text-white">
                    Credencial CITT Connect — {selectedMember.profile.fullName}
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
                  profile={selectedMember.profile}
                  initialShowQR={selectedMember.openInQrMode}
                />
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
