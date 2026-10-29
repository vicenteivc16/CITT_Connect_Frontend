'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Check,
  Download,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  QrCode,
  Search,
  SlidersHorizontal,
  UserPlus,
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

export default function DirectorioNacionalPage() {
  const {
    profiles,
    activeUser,
    isConnected,
    toggleConnection,
    connectedMemberIds,
  } = useCittNetwork();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | CittRole>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<'all' | DuocSchoolSlug>(
    'all'
  );
  const [onlyConnected, setOnlyConnected] = useState(false);

  const [selectedMember, setSelectedMember] = useState<{
    profile: CittMemberProfile;
    openInQrMode: boolean;
  } | null>(null);

  const regions = useMemo(() => {
    return Array.from(new Set(CITT_CAMPUSES.map((c) => c.region)));
  }, []);

  const filteredProfiles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return profiles.filter((member) => {
      const campus = getCampusBySlug(member.campusSlug);
      if (selectedRole !== 'all' && member.role !== selectedRole) return false;
      if (selectedRegion !== 'all' && campus.region !== selectedRegion)
        return false;
      if (selectedCampus !== 'all' && member.campusSlug !== selectedCampus)
        return false;
      if (selectedSchool !== 'all' && member.schoolSlug !== selectedSchool)
        return false;
      if (onlyConnected && !isConnected(member.id)) return false;

      if (!q) return true;

      const haystack = [
        member.fullName,
        member.email,
        member.careerTitle,
        member.currentOccupation,
        member.username,
        campus.name,
        campus.region,
        ...member.specialties,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [
    profiles,
    searchQuery,
    selectedRole,
    selectedRegion,
    selectedCampus,
    selectedSchool,
    onlyConnected,
    isConnected,
  ]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
    setSelectedRegion('all');
    setSelectedCampus('all');
    setSelectedSchool('all');
    setOnlyConnected(false);
  };

  return (
    <div className="space-y-8">
      {/* Directory Header */}
      <header className="flex flex-col justify-between gap-6 border-b border-theme pb-8 lg:flex-row lg:items-end">
        <div className="space-y-3">
          <h1 className="max-w-[24ch] text-balance text-3xl font-black tracking-tight text-theme-primary sm:text-4xl">
            Directorio Nacional de Credenciales CITT
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-theme-secondary">
            Explora perfiles verificados de las 18 sedes y 9 escuelas de Duoc
            UC. Filtra por región, sede, escuela o rol, establece vínculos
            directos con <strong>+ Connect</strong> y accede al código QR o
            contacto vCard de cada miembro.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setOnlyConnected((prev) => !prev)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
              onlyConnected
                ? 'border-[#FFB800] bg-[#FFB800] text-[#1A1A1A]'
                : 'border-theme bg-theme-subtle text-theme-primary hover:border-[#FFB800]'
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            <span>Mis Vínculos ({connectedMemberIds.length})</span>
          </button>

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
            <span>Mi Credencial QR ({activeUser.fullName.split(' ')[0]})</span>
          </button>
        </div>
      </header>

      {/* Multi-Axis Filter Panel (Región, Sede, Escuela, Rol, Búsqueda) */}
      <section
        aria-label="Filtros del directorio"
        className="space-y-4 rounded-2xl border border-theme bg-theme-subtle p-5"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          {/* Search Input */}
          <div className="relative md:col-span-4">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, especialidad o cargo..."
              className="w-full rounded-xl border border-theme bg-theme-surface py-2.5 pr-4 pl-10 text-sm text-theme-primary placeholder:text-theme-secondary focus:border-[#FFB800] focus:outline-none"
            />
          </div>

          {/* Region Filter */}
          <div className="md:col-span-2">
            <select
              aria-label="Filtrar por Región"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
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

          {/* Campus Filter */}
          <div className="md:col-span-3">
            <select
              aria-label="Filtrar por Sede CITT"
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full rounded-xl border border-theme bg-theme-surface px-3 py-2.5 text-sm text-theme-primary focus:border-[#FFB800] focus:outline-none"
            >
              <option value="all">Todas las Sedes CITT</option>
              {CITT_CAMPUSES.map((campus) => (
                <option key={campus.slug} value={campus.slug}>
                  {campus.name} ({campus.region})
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
              <option value="all">Todas las Escuelas Duoc UC</option>
              {DUOC_SCHOOLS.map((school) => (
                <option key={school.slug} value={school.slug}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Role Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold text-theme-primary">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#FFB800]" />
              <span>Rol:</span>
            </span>
            {ROLE_FILTER_OPTIONS.map((option) => {
              const active = selectedRole === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedRole(option.value)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
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

          <span className="text-xs font-semibold tabular-nums text-theme-secondary">
            Mostrando{' '}
            <strong className="text-theme-primary">
              {filteredProfiles.length}
            </strong>{' '}
            perfiles verificados
          </span>
        </div>
      </section>

      {/* Member Credentials Grid (No Blur/Desaturation Gimmick, Clean + Connect) */}
      {filteredProfiles.length === 0 ? (
        <div className="rounded-2xl border border-theme bg-theme-subtle p-12 text-center">
          <p className="text-base font-bold text-theme-primary">
            No se encontraron perfiles con esos criterios
          </p>
          <p className="mt-1 text-xs text-theme-secondary">
            Prueba restableciendo los filtros de región, sede, escuela o rol.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-bold text-[#1A1A1A]"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <section
          aria-label="Listado nacional de credenciales CITT"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProfiles.map((member) => {
            const campus = getCampusBySlug(member.campusSlug);
            const school = getSchoolBySlug(member.schoolSlug);
            const connected = isConnected(member.id);
            const isSelf = member.id === activeUser.id;

            return (
              <article
                key={member.id}
                className="flex flex-col justify-between overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card"
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

                    {/* Special Role Context (Hairline divider, no nested card) */}
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
                      {member.specialties.slice(0, 4).map((spec) => (
                        <span
                          key={spec}
                          className="rounded-lg bg-theme-elevated px-2.5 py-1 text-xs font-semibold text-theme-primary"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: + Connect (LinkedIn style) + QR + vCard + Ficha */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-theme pt-4">
                    {/* LinkedIn-style + Connect Button */}
                    {isSelf ? (
                      <Link
                        href="/mi-perfil"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-theme-elevated px-3.5 py-2 text-xs font-bold text-theme-primary hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                      >
                        <span>Tu Perfil Activo</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleConnection(member.id)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                          connected
                            ? 'bg-theme-inverse text-theme-text-inverse'
                            : 'bg-[#FFB800] text-[#1A1A1A] hover:bg-[#ffc633]'
                        }`}
                      >
                        {connected ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Conectado</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-3.5 w-3.5" />
                            <span>+ Connect</span>
                          </>
                        )}
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
                              : `https://cittconnect.duocuc.cl/u/${member.username}`
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
