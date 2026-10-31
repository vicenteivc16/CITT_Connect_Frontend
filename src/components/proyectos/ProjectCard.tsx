'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  HandHelping,
  MapPin,
  Play,
  Star,
} from 'lucide-react';
import { SchoolBadge } from '@/components/RoleBadge';
import { getCampusBySlug } from '@/data/citt-catalog';
import { CittProject, ProjectMaturityStage } from '@/types/citt';

const MATURITY_CONFIG: Record<
  ProjectMaturityStage,
  { label: string; tag: string; badgeClass: string }
> = {
  ideacion: {
    label: 'TRL 1-2 · Ideación & Concepto',
    tag: 'Ideación',
    badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
  },
  prototipado: {
    label: 'TRL 3-4 · Prototipado de Laboratorio',
    tag: 'Prototipo',
    badgeClass: 'border-blue-500/30 bg-blue-500/10 text-blue-500',
  },
  pruebas_campo: {
    label: 'TRL 5-6 · Validación en Entorno Real',
    tag: 'Validación',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
  },
  transferencia: {
    label: 'TRL 7-8 · Transferencia Tecnológica',
    tag: 'Transferencia',
    badgeClass: 'border-purple-500/30 bg-purple-500/10 text-purple-500',
  },
};

interface ProjectCardProps {
  project: CittProject;
  canFeatureProjects?: boolean;
  onToggleFeatured?: (id: string) => void;
}

export function ProjectCard({
  project,
  canFeatureProjects,
  onToggleFeatured,
}: ProjectCardProps) {
  const campus = getCampusBySlug(project.originCampusSlug);
  const coverImage =
    project.coverImageUrl ||
    project.galleryImages?.[0] ||
    '/assets/banner-iot.webp';
  const maturityInfo = project.maturityStage
    ? MATURITY_CONFIG[project.maturityStage]
    : null;
  const collaborators = project.collaborators || [];

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card transition hover:border-[#FFB800]/50 hover:shadow-lg">
      {/* NIVEL 1: PORTADA PANORÁMICA 16:9 CON OVERLAYS */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <img
          src={coverImage}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />

        {/* Overlays Superiores: Escuela, Sede y Control Core Dev */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
          <SchoolBadge schoolSlug={project.schoolSlug} />

          <div className="flex items-center gap-1.5">
            {canFeatureProjects && onToggleFeatured && (
              <button
                type="button"
                onClick={() => onToggleFeatured(project.id)}
                className={`rounded-full p-1 backdrop-blur-md transition ${
                  project.isFeatured
                    ? 'bg-[#FFB800] text-[#1A1A1A]'
                    : 'border border-white/20 bg-black/60 text-white/80 hover:text-white'
                }`}
                title={
                  project.isFeatured
                    ? 'Proyecto Destacado (clic para quitar)'
                    : 'Destacar como Proyecto Core Dev'
                }
              >
                <Star
                  className={`h-3 w-3 ${
                    project.isFeatured ? 'fill-[#1A1A1A]' : ''
                  }`}
                />
              </button>
            )}

            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
              <MapPin className="h-3 w-3 text-[#307FE2]" />
              <span>{campus.shortName}</span>
            </span>
          </div>
        </div>

        {/* Overlays Inferiores: Badges de Capacidades */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
          <div className="flex flex-wrap items-center gap-1.5">
            {project.videoUrl && (
              <span className="inline-flex items-center gap-1 rounded-md bg-red-600/90 px-2 py-0.5 font-bold text-white backdrop-blur-md">
                <Play className="h-2.5 w-2.5 fill-white" />
                <span>Video Pitch</span>
              </span>
            )}
            {project.readmeContent && (
              <span className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-black/60 px-2 py-0.5 font-bold text-white backdrop-blur-md">
                <FileText className="h-2.5 w-2.5 text-[#FFB800]" />
                <span>README</span>
              </span>
            )}
          </div>

          {maturityInfo && (
            <span className="rounded-md border border-white/20 bg-black/60 px-2 py-0.5 font-bold text-white backdrop-blur-md">
              {maturityInfo.tag}
            </span>
          )}
        </div>
      </div>

      {/* NIVEL 2: CUERPO DE INFORMACIÓN & EQUIPO */}
      <div className="flex-1 p-5 sm:p-6 space-y-4">
        <div>
          <Link
            href={`/proyectos/${project.slug || project.id}`}
            className="group/title inline-block"
          >
            <h3 className="text-base font-black leading-snug text-theme-primary transition group-hover/title:text-[#307FE2]">
              {project.title}
            </h3>
          </Link>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-theme-secondary">
            {project.summary}
          </p>
        </div>

        {/* Especialidades Buscadas */}
        {project.lookingForCollaborators && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-theme-primary">
              <HandHelping className="h-3.5 w-3.5 text-[#FFB800]" />
              <span>Se buscan colaboradores:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {project.neededSpecialties.slice(0, 3).map((spec) => (
                <span
                  key={spec}
                  className="rounded-lg border border-theme bg-theme-subtle px-2 py-0.5 text-[11px] font-semibold text-theme-primary"
                >
                  {spec}
                </span>
              ))}
              {project.neededSpecialties.length > 3 && (
                <span className="rounded-lg border border-theme bg-theme-subtle px-1.5 py-0.5 text-[11px] text-theme-secondary">
                  +{project.neededSpecialties.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Fila de Colaboradores con Anillos de Rol Institucional */}
        <div className="flex items-center justify-between border-t border-theme pt-3">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              {collaborators.slice(0, 3).map((c) => {
                const isGold = c.role === 'personal_duoc';
                const isPurple = c.role === 'partner';
                const isBlue = c.role === 'dev' || c.role === 'lider_citt';
                return (
                  <img
                    key={c.id || c.username}
                    src={c.avatarUrl || '/assets/citt-logo.webp'}
                    alt={c.fullName}
                    title={`${c.fullName} (${c.roleInProject})`}
                    className={`inline-block h-7 w-7 rounded-full object-cover ring-2 ${
                      isGold
                        ? 'ring-[#FFB800]'
                        : isPurple
                        ? 'ring-[#AC4FC6]'
                        : isBlue
                        ? 'ring-[#307FE2]'
                        : 'ring-theme'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-[11px] text-theme-secondary">
              {collaborators.length > 0
                ? `${collaborators.length} integrantes`
                : 'Equipo CITT'}
            </span>
          </div>

          <span className="rounded-full bg-theme-subtle border border-theme px-2 py-0.5 text-[10px] font-bold uppercase text-theme-secondary">
            {project.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* NIVEL 3: FOOTER CON LÍDER & BOTÓN "MÁS INFORMACIÓN" */}
      <div className="flex items-center justify-between border-t border-theme bg-theme-subtle/50 px-5 py-3.5 sm:px-6">
        <div className="min-w-0 flex-1 pr-2">
          <p className="truncate text-[11px] text-theme-secondary">
            Líder:{' '}
            <strong className="text-theme-primary font-bold">
              {project.leadName}
            </strong>
          </p>
        </div>

        <Link
          href={`/proyectos/${project.slug || project.id}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#FFB800] px-3.5 py-1.5 text-xs font-black text-[#1A1A1A] transition hover:bg-[#ffc633]"
        >
          <span>Ver Ficha</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
