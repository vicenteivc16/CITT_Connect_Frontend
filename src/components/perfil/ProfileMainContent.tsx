'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Award,
  Building2,
  Calendar,
  Check,
  Clock,
  Compass,
  FolderGit2,
  Github,
  MapPin,
  Newspaper,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react';
import { getCampusBySlug, getSchoolBySlug } from '@/data/citt-catalog';
import {
  CittMemberProfile,
  CittProject,
  CittFeedPost,
  CittActivity,
} from '@/types/citt';
import { RoleBadge, SchoolBadge } from '@/components/RoleBadge';

const STATUS_LABELS: Record<
  'idea' | 'en_desarrollo' | 'prototipo' | 'finalizado',
  string
> = {
  idea: 'Fase Idea',
  en_desarrollo: 'En Desarrollo',
  prototipo: 'Prototipo Funcional',
  finalizado: 'Implementado',
};

interface ProfileMainContentProps {
  member: CittMemberProfile;
  displayedProjects: CittProject[];
  hasOwnProjects: boolean;
  memberPosts: CittFeedPost[];
  peers: CittMemberProfile[];
  memberActivities?: CittActivity[];
  isConnected: (id: string) => boolean;
  onToggleConnection: (id: string) => void;
}

export function ProfileMainContent({
  member,
  displayedProjects,
  hasOwnProjects,
  memberPosts,
  peers,
  memberActivities,
  isConnected,
  onToggleConnection,
}: ProfileMainContentProps) {
  const campus = getCampusBySlug(member.campusSlug);

  return (
    <div className="space-y-6 lg:col-span-8">
      {/* Bloque 1: Biografía, Propósito Académico y Módulos según Rol */}
      <section className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card sm:p-8">
        <h2 className="inline-flex items-center gap-2.5 text-xl font-black text-theme-primary">
          <Sparkles className="h-5 w-5 text-[#FFB800]" />
          <span>Acerca de & Trayectoria en la Red CITT</span>
        </h2>

        <p className="mt-3 max-w-[65ch] font-serif text-base leading-relaxed text-theme-secondary">
          {member.bio}
        </p>

        {/* Módulo Especial: Consejero de Carrera */}
        {member.role === 'consejero_carrera' &&
          member.representedCareerInfo && (
            <div className="mt-6 border-t border-theme pt-5">
              <h3 className="inline-flex items-center gap-2 text-base font-black text-theme-primary">
                <Compass className="h-4 w-4 text-[#43B02A]" />
                <span>
                  Puente Oficial Consejero de Carrera ↔ Alumnos Duoc UC
                </span>
              </h3>
              <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-theme-secondary">
                {member.representedCareerInfo}
              </p>
            </div>
          )}

        {/* Módulo Especial: Empresa Partner */}
        {member.role === 'partner' && member.partnerOrganization && (
          <div className="mt-6 border-t border-theme pt-5">
            <h3 className="inline-flex items-center gap-2 text-base font-black text-theme-primary">
              <Building2 className="h-4 w-4 text-[#E87722]" />
              <span>
                Organización Partner Aliada: {member.partnerOrganization}
              </span>
            </h3>
            <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-theme-secondary">
              Vinculación directa con los laboratorios CITT de Duoc UC para
              desafíos tecnológicos reales, mentorías de industria y
              oportunidades de práctica profesional.
            </p>
          </div>
        )}

        {/* Hitos, Liderazgo y Contribuciones Destacadas */}
        {member.achievements && member.achievements.length > 0 && (
          <div className="mt-6 border-t border-theme pt-5">
            <h3 className="inline-flex items-center gap-2 text-base font-black text-theme-primary">
              <Award className="h-4 w-4 text-[#FFB800]" />
              <span>Hitos Académicos y Contribuciones Destacadas</span>
            </h3>
            <ul className="mt-3 space-y-2">
              {member.achievements.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-theme-secondary"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#43B02A]" />
                  <span className="max-w-[65ch]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Bloque 2: Portafolio de Proyectos e Investigación Aplicada */}
      <section className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="inline-flex items-center gap-2.5 text-xl font-black text-theme-primary">
              <FolderGit2 className="h-5 w-5 text-[#FFB800]" />
              <span>
                {hasOwnProjects
                  ? 'Proyectos Liderados en el CITT'
                  : 'Proyectos CITT de su Escuela & Sede'}
              </span>
            </h2>
            <p className="mt-1 text-xs text-theme-secondary">
              Iniciativas de transferencia tecnológica y colaboración
              inter-sedes.
            </p>
          </div>

          <Link
            href="/proyectos"
            className="inline-flex items-center gap-1.5 rounded-xl bg-theme-subtle px-3.5 py-2 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
          >
            <span>Explorar todos los proyectos</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-5 divide-y divide-[var(--citt-border)]">
          {displayedProjects.map((proj) => {
            const projCampus = getCampusBySlug(proj.originCampusSlug);
            return (
              <article
                key={proj.id}
                className="py-5 first:pt-0 last:pb-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <SchoolBadge schoolSlug={proj.schoolSlug} />
                    <span className="rounded-full bg-theme-elevated px-2.5 py-0.5 text-xs font-bold text-theme-primary">
                      {STATUS_LABELS[proj.status]}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-theme-secondary">
                    Sede {projCampus.shortName} · {proj.createdAt}
                  </span>
                </div>

                <h3 className="mt-2.5 text-lg font-black text-theme-primary">
                  {proj.title}
                </h3>

                <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-theme-secondary">
                  {proj.summary}
                </p>

                {proj.lookingForCollaborators && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-bold text-theme-primary">
                      Especialidades buscadas en otras sedes CITT:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.neededSpecialties.map((spec) => (
                        <span
                          key={spec}
                          className="rounded-lg bg-theme-elevated px-2.5 py-1 text-xs font-semibold text-theme-primary"
                        >
                          + {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-theme-secondary">
                    Líder:{' '}
                    <strong className="text-theme-primary">
                      {proj.leadName}
                    </strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {proj.repoUrl && (
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-theme-subtle px-3 py-1.5 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
                      >
                        <Github className="h-3.5 w-3.5" />
                        <span>Repositorio</span>
                      </a>
                    )}
                    <Link
                      href={`/proyectos/${proj.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-3.5 py-1.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                    >
                      <span>Ver Iniciativa</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Bloque 2.5: Talleres & Formación en Laboratorios CITT */}
      {memberActivities && memberActivities.length > 0 && (
        <section className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="inline-flex items-center gap-2.5 text-xl font-black text-theme-primary">
                <Calendar className="h-5 w-5 text-[#FFB800]" />
                <span>Talleres & Formación en Laboratorios CITT</span>
              </h2>
              <p className="mt-1 text-xs text-theme-secondary">
                Actividades prácticas, especialización y transferencia tecnológica en Duoc UC.
              </p>
            </div>

            <Link
              href="/actividades"
              className="inline-flex items-center gap-1.5 rounded-xl bg-theme-subtle px-3.5 py-2 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
            >
              <span>Ver todas las actividades</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {memberActivities.map((act) => {
              const actSchool = getSchoolBySlug(act.schoolSlug);
              const isInstructor = act.instructorUsername === member.username;

              return (
                <div
                  key={act.id}
                  className="rounded-2xl border border-theme bg-theme-subtle p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-theme-secondary">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: actSchool.primaryHex }}
                      />
                      {actSchool.name}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isInstructor
                          ? 'bg-[#FFB800]/20 text-[#FFB800]'
                          : 'bg-[#43B02A]/20 text-[#43B02A]'
                      }`}
                    >
                      {isInstructor ? 'Docente / Relator' : 'Participante Activo'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-theme-primary">
                      {act.title}
                    </h3>
                    <p className="mt-1 text-xs text-theme-secondary line-clamp-2">
                      {act.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-theme pt-2.5 text-[11px]">
                    <span className="text-theme-secondary flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 text-[#307FE2] shrink-0" />
                      <span className="truncate">{act.roomLocation}</span>
                    </span>
                    <span className="font-bold text-theme-primary flex items-center gap-1 shrink-0">
                      <Award className="h-3 w-3 text-[#FFB800] shrink-0" />
                      {act.schedule.totalHoursCitt} Horas CITT
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Bloque 3: Publicaciones en el Muro & Miembros Relacionados de su Sede/Escuela */}
      <section className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-2.5 text-xl font-black text-theme-primary">
            <Newspaper className="h-5 w-5 text-[#307FE2]" />
            <span>Actividad en el Muro & Red de su Escuela</span>
          </h2>
          <Link
            href="/muro"
            className="text-xs font-bold text-theme-primary hover:underline"
          >
            Ir al Muro Nacional →
          </Link>
        </div>

        {memberPosts.length > 0 && (
          <div className="mt-4 divide-y divide-[var(--citt-border)] border-b border-theme pb-5">
            {memberPosts.map((post) => (
              <article key={post.id} className="py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-2 text-xs text-theme-secondary">
                  <span className="font-bold text-theme-primary">
                    Publicación oficial de {post.authorName}
                  </span>
                  <span>{post.createdAt}</span>
                </div>
                <h3 className="mt-1 text-base font-bold text-theme-primary">
                  {post.title}
                </h3>
                <p className="mt-1 max-w-[65ch] text-sm leading-relaxed text-theme-secondary">
                  {post.content}
                </p>
              </article>
            ))}
          </div>
        )}

        {/* Miembros de la misma Sede o Escuela para continuar conectando */}
        <div className="mt-5">
          <h3 className="inline-flex items-center gap-2 text-base font-black text-theme-primary">
            <Users className="h-4 w-4 text-[#FFB800]" />
            <span>
              Otros Talentos CITT de {campus.shortName}
            </span>
          </h3>

          <div className="mt-3 divide-y divide-[var(--citt-border)]">
            {peers.map((peer) => {
              const peerCampus = getCampusBySlug(peer.campusSlug);
              const peerConnected = isConnected(peer.id);
              return (
                <div
                  key={peer.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-0"
                >
                  <Link
                    href={`/u/${peer.username}`}
                    className="flex min-w-0 flex-1 items-center gap-3"
                  >
                    <img
                      src={peer.avatarUrl || '/assets/citt-logo.webp'}
                      alt={peer.fullName}
                      className="h-11 w-11 shrink-0 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-bold text-theme-primary hover:underline">
                          {peer.fullName}
                        </p>
                        <RoleBadge role={peer.role} showTooltip={false} />
                      </div>
                      <p className="truncate text-xs text-theme-secondary">
                        {peer.currentOccupation} · Sede{' '}
                        {peerCampus.shortName}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleConnection(peer.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        peerConnected
                          ? 'bg-theme-inverse text-theme-text-inverse'
                          : 'bg-[#FFB800] text-[#1A1A1A] hover:bg-[#ffc633]'
                      }`}
                    >
                      {peerConnected ? (
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
