'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Edit3,
  ExternalLink,
  Github,
  MapPin,
  Play,
  Share2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { getCampusBySlug, getSchoolBySlug, MATURITY_LABELS } from '@/data/citt-catalog';
import { getEmbedVideoUrl } from '@/lib/video';
import { SchoolBadge, RoleBadge } from '@/components/RoleBadge';
import { CittMemberProfile, CittProject } from '@/types/citt';

interface ProjectHeroHeaderProps {
  project: CittProject;
  activeUser: CittMemberProfile;
  isLead: boolean;
  copiedLink: boolean;
  onOpenEdit: () => void;
  onDeleteProject: () => void;
  onShareLink: () => void;
  onOpenVideo: () => void;
}

export function ProjectHeroHeader({
  project,
  activeUser,
  isLead,
  copiedLink,
  onOpenEdit,
  onDeleteProject,
  onShareLink,
  onOpenVideo,
}: ProjectHeroHeaderProps) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const campus = getCampusBySlug(project.originCampusSlug);
  const school = getSchoolBySlug(project.schoolSlug);
  const videoData = getEmbedVideoUrl(project.videoUrl);

  const maturity = project.maturityStage
    ? MATURITY_LABELS[project.maturityStage]
    : MATURITY_LABELS.prototipado;

  const galleryList =
    project.galleryImages && project.galleryImages.length > 0
      ? project.galleryImages
      : [project.coverImageUrl || '/assets/citt-hero-lobby.webp'];

  return (
    <>
      {/* 1. Cinta Cromática de la Escuela Duoc UC */}
      <div
        className="h-2 w-full rounded-full shadow-sm"
        style={{
          background: `linear-gradient(90deg, ${school.primaryHex} 0%, ${school.secondaryHex} 100%)`,
        }}
      />

      {/* 2. Barra de Navegación y Herramientas Superiores */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme pb-4">
        <Link
          href="/proyectos"
          className="inline-flex items-center gap-2 rounded-xl bg-theme-subtle px-3.5 py-2 text-xs font-bold text-theme-primary transition hover:bg-[#FFB800] hover:text-[#1A1A1A]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a Explorar Proyectos</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {/* Controles exclusivos de edición y borrado para el Líder */}
          {isLead && (
            <>
              <button
                type="button"
                onClick={onOpenEdit}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#307FE2] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#2569bd]"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Editar Proyecto</span>
              </button>

              <button
                type="button"
                onClick={onDeleteProject}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Eliminar</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onShareLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary transition hover:border-[#FFB800]"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#43B02A]" />
                <span>Enlace Copiado</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Compartir</span>
              </>
            )}
          </button>

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-primary transition hover:border-[#307FE2]"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3 text-theme-secondary" />
            </a>
          )}
        </div>
      </div>

      {/* 3. Hero Panorámico de Medios */}
      <section className="relative overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card">
        <div className="relative h-60 sm:h-72 lg:h-80 w-full overflow-hidden bg-black">
          <img
            src={galleryList[activeMediaIndex]}
            alt={project.title}
            className="h-full w-full object-cover object-center opacity-85 transition duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

          {/* Badges Flotantes sobre el Hero */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 sm:top-6 sm:left-6 sm:right-6">
            <div className="flex flex-wrap items-center gap-2">
              <SchoolBadge schoolSlug={project.schoolSlug} />
              <span className="inline-flex items-center gap-1 rounded-full bg-[#1A1A1A]/85 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                <MapPin className="h-3 w-3 text-[#FFB800]" />
                <span>{campus.name}</span>
              </span>
            </div>

            {project.isFeatured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFB800] px-3.5 py-1 text-xs font-black text-[#1A1A1A] shadow-lg">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Proyecto Destacado Nacional</span>
              </span>
            )}
          </div>

          {/* CTA de Video Lightbox si existe */}
          {videoData && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={onOpenVideo}
                className="group flex items-center gap-3 rounded-full border border-white/20 bg-black/60 px-5 py-3 text-xs font-bold text-white backdrop-blur-md transition hover:scale-105 hover:bg-[#FFB800] hover:text-[#1A1A1A]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFB800] text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white">
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </div>
                <span>Ver Video Pitch / Demo</span>
              </button>
            </div>
          )}

          {/* Selector de Galería */}
          {galleryList.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-2xl bg-black/70 p-1.5 backdrop-blur-md">
              {galleryList.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`h-9 w-14 overflow-hidden rounded-lg border transition ${
                    activeMediaIndex === idx
                      ? 'border-[#FFB800] scale-105'
                      : 'border-white/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Título, Resumen y Métricas Clave */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-theme-primary">
                {project.title}
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-theme-secondary font-medium">
                {project.summary}
              </p>

              {/* Barra de Progreso de Madurez TRL */}
              <div className="space-y-2 rounded-2xl border border-theme bg-theme-subtle p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-theme-primary">
                    Madurez Tecnológica (TRL Duoc UC)
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-black text-white"
                    style={{ backgroundColor: maturity.color }}
                  >
                    {maturity.label}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[1, 2, 3, 4].map((step) => {
                    const isPassed = step <= maturity.step;
                    return (
                      <div
                        key={step}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isPassed ? '' : 'bg-theme-elevated'
                        }`}
                        style={{
                          backgroundColor: isPassed ? maturity.color : undefined,
                        }}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-theme-secondary">{maturity.desc}</p>
              </div>
            </div>

            {/* Ficha Rápida del Líder e Información de Postulación */}
            <div className="space-y-4 rounded-2xl border border-theme bg-theme-subtle p-5 lg:col-span-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    activeUser.username === project.leadUsername
                      ? activeUser.avatarUrl || '/assets/citt-logo.webp'
                      : '/assets/citt-logo.webp'
                  }
                  alt={project.leadName}
                  className="h-12 w-12 rounded-2xl object-cover ring-2 ring-[#FFB800]"
                />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-theme-secondary">
                    Líder de Proyecto
                  </span>
                  <Link
                    href={`/u/${project.leadUsername}`}
                    className="block truncate text-sm font-bold text-theme-primary hover:underline"
                  >
                    {project.leadName}
                  </Link>
                  <RoleBadge role={project.leadRole} showTooltip={false} size="sm" />
                </div>
              </div>

              <div className="space-y-1.5 border-t border-theme pt-3 text-xs text-theme-secondary">
                <div className="flex justify-between">
                  <span>Convocatoria:</span>
                  <span
                    className={`font-bold ${
                      project.lookingForCollaborators ? 'text-[#43B02A]' : 'text-theme-secondary'
                    }`}
                  >
                    {project.lookingForCollaborators ? 'Abierta' : 'Equipo Completo'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Modo Postulación:</span>
                  <span className="font-bold text-theme-primary">
                    {project.applicationMode === 'form' ? 'Formulario Específico' : 'Directa'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Colaboradores:</span>
                  <span className="font-bold text-theme-primary">
                    {project.collaborators?.length || 1} activos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
