'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  FolderGit2,
  Layers,
  MapPin,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { CITT_CAMPUSES, getCampusBySlug, MATURITY_LABELS } from '@/data/citt-catalog';
import { SchoolBadge } from '@/components/RoleBadge';
import { CittMemberProfile, ProjectMaturityStage } from '@/types/citt';
import { getSupabaseProjects } from '@/lib/supabase/projects';
import { supabase } from '@/lib/supabase/client';
import { logSupabaseAudit } from '@/lib/supabase/audit';

export interface ProjectToReview {
  id: string;
  slug: string;
  title: string;
  summary: string;
  leadName: string;
  leadUsername: string;
  campusSlug: string;
  schoolSlug: string;
  maturityStage: ProjectMaturityStage;
  neededSpecialties: string[];
  submittedAt: string;
  status: 'pending_review' | 'approved_public' | 'needs_revision';
}

const INITIAL_PROJECTS_QUEUE: ProjectToReview[] = [];

interface AdminProjectsApprovalProps {
  activeUser: CittMemberProfile;
  selectedCampusSlug?: string;
}

export function AdminProjectsApproval({
  activeUser,
  selectedCampusSlug = 'nacional',
}: AdminProjectsApprovalProps) {
  const [projects, setProjects] = useState<ProjectToReview[]>(INITIAL_PROJECTS_QUEUE);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'revision'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    getSupabaseProjects().then((remoteProjs) => {
      if (!isMounted) return;
      setProjects(
        remoteProjs.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          summary: p.summary,
          leadName: p.leadName,
          leadUsername: p.leadUsername,
          campusSlug: p.originCampusSlug,
          schoolSlug: p.schoolSlug,
          maturityStage: p.maturityStage || 'ideacion',
          neededSpecialties: p.neededSpecialties,
          submittedAt: p.createdAt,
          status: p.status === 'idea' ? 'pending_review' : 'approved_public',
        }))
      );
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleApprove = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved_public' } : p))
    );
    try {
      await supabase.from('projects').update({ status: 'prototipo' }).eq('id', id);
      if (target) {
        await logSupabaseAudit({
          actionType: 'APROBACION_PROYECTO',
          title: `Curaduría aprobada: ${target.title} (Sede: ${target.campusSlug})`,
          actorUsername: activeUser.username,
          actorName: activeUser.fullName,
          actorRole: activeUser.role,
          campusSlug: target.campusSlug,
          metadata: { projectId: target.id, slug: target.slug },
        });
      }
    } catch (err) {
      console.error('Error approving project in Supabase:', err);
    }
  };

  const handleRequestRevision = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'needs_revision' } : p))
    );
    try {
      await supabase.from('projects').update({ status: 'idea' }).eq('id', id);
      if (target) {
        await logSupabaseAudit({
          actionType: 'OBSERVACION_PROYECTO',
          title: `Observación en curaduría: ${target.title} (Sede: ${target.campusSlug})`,
          actorUsername: activeUser.username,
          actorName: activeUser.fullName,
          actorRole: activeUser.role,
          campusSlug: target.campusSlug,
          metadata: { projectId: target.id, slug: target.slug },
        });
      }
    } catch (err) {
      console.error('Error requesting revision for project in Supabase:', err);
    }
  };

  const handleChangeMaturity = async (id: string, newStage: ProjectMaturityStage) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, maturityStage: newStage } : p))
    );
    try {
      await supabase.from('projects').update({ maturity_stage: newStage }).eq('id', id);
    } catch (err) {
      console.error('Error updating maturity stage in Supabase:', err);
    }
  };

  // Aislamiento por Sede / Tenant
  const isDev = activeUser.role === 'dev';
  const effectiveTenantSlug = !isDev
    ? activeUser.campusSlug
    : selectedCampusSlug && selectedCampusSlug !== 'nacional'
    ? selectedCampusSlug
    : null;

  const filteredProjects = projects.filter((p) => {
    // Si no es dev, o si el dev filtró por sede, aislar estrictamente al tenant correspondiente
    if (effectiveTenantSlug && p.campusSlug !== effectiveTenantSlug) {
      return false;
    }
    if (filterStatus === 'pending' && p.status !== 'pending_review') return false;
    if (filterStatus === 'approved' && p.status !== 'approved_public') return false;
    if (filterStatus === 'revision' && p.status !== 'needs_revision') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.leadName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = projects.filter((p) => p.status === 'pending_review').length;

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col justify-between gap-4 border-b border-theme pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFB800]/15 px-3 py-1 text-xs font-bold text-[#FFB800]">
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>Curaduría & Estándares de Innovación</span>
          </span>
          <h1 className="text-2xl font-black tracking-tight text-theme-primary mt-2">
            Aprobación & Clasificación TRL de Proyectos
          </h1>
          <p className="text-xs text-theme-secondary mt-1 max-w-2xl">
            Valida los proyectos antes de habilitar su postulación nacional, evalúa su madurez tecnológica y asígnales reconocimiento en la red.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="rounded-2xl border border-[#FFB800]/30 bg-[#FFB800]/10 px-4 py-2 text-xs font-bold text-[#FFB800]">
            {pendingCount} proyecto{pendingCount > 1 ? 's' : ''} en cola de revisión
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme bg-theme-subtle p-3.5">
        <div className="flex items-center gap-2">
          {(['all', 'pending', 'approved', 'revision'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                filterStatus === st
                  ? 'bg-[#FFB800] text-[#1A1A1A] shadow-sm'
                  : 'bg-theme-surface border border-theme text-theme-secondary hover:text-theme-primary'
              }`}
            >
              {st === 'all'
                ? `Todos (${projects.length})`
                : st === 'pending'
                ? `Por Evaluar (${pendingCount})`
                : st === 'approved'
                ? 'Públicos en Catálogo'
                : 'Con Observaciones'}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-theme-secondary pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, líder o tecnología..."
            className="w-full rounded-xl border border-theme bg-theme-surface pl-8.5 pr-3 py-1.5 text-xs text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none"
          />
        </div>
      </div>

      {/* Lista de Proyectos */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-theme bg-theme-surface p-12 text-center text-xs text-theme-secondary">
            No se encontraron iniciativas en este estado de curaduría.
          </div>
        ) : (
          filteredProjects.map((proj) => {
            const campus = getCampusBySlug(proj.campusSlug);
            const maturity = MATURITY_LABELS[proj.maturityStage];

            return (
              <article
                key={proj.id}
                className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card space-y-4 transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        proj.status === 'approved_public'
                          ? 'bg-[#43B02A]/15 text-[#43B02A]'
                          : proj.status === 'pending_review'
                          ? 'bg-[#FFB800]/15 text-[#FFB800]'
                          : 'bg-red-500/15 text-red-500'
                      }`}
                    >
                      {proj.status === 'approved_public'
                        ? 'Público en Catálogo'
                        : proj.status === 'pending_review'
                        ? 'En Evaluación Inicial'
                        : 'Requiere Correcciones'}
                    </span>

                    <span
                      style={{ backgroundColor: `${maturity.color}20`, color: maturity.color }}
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-black"
                    >
                      {maturity.label}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] text-theme-secondary">
                      <MapPin className="h-3 w-3 text-[#FFB800]" />
                      <span>Sede {campus.name}</span>
                    </span>
                  </div>

                  <span className="text-[11px] text-theme-secondary">
                    {proj.submittedAt}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-theme-primary">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-theme-secondary leading-relaxed mt-1.5 max-w-3xl">
                    {proj.summary}
                  </p>
                </div>

                {/* Especialidades buscadas */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-theme-primary">
                    Especialidades:
                  </span>
                  {proj.neededSpecialties.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-lg bg-theme-elevated px-2 py-0.5 text-[11px] font-semibold text-theme-primary"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Controles de Curaduría & Cambio de TRL */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme pt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-theme-secondary">Líder:</span>
                    <strong className="text-theme-primary">
                      {proj.leadName}
                    </strong>
                    <span className="text-theme-secondary">
                      (@{proj.leadUsername})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Selector de TRL para recalibrar nivel */}
                    <div className="flex items-center gap-1.5 mr-2">
                      <span className="text-theme-secondary text-[11px]">Nivel TRL:</span>
                      <select
                        value={proj.maturityStage}
                        onChange={(e) =>
                          handleChangeMaturity(
                            proj.id,
                            e.target.value as ProjectMaturityStage
                          )
                        }
                        className="rounded-xl border border-theme bg-theme-subtle px-2.5 py-1 text-xs font-bold text-theme-primary focus:border-[#FFB800] focus:outline-none"
                      >
                        <option value="ideacion">Fase 1: Ideación</option>
                        <option value="prototipado">Fase 2: Prototipado</option>
                        <option value="pruebas_campo">Fase 3: Pruebas Campo</option>
                        <option value="transferencia">Fase 4: Transferencia</option>
                      </select>
                    </div>

                    {proj.status !== 'approved_public' && (
                      <button
                        type="button"
                        onClick={() => handleApprove(proj.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#43B02A] px-3.5 py-1.5 font-bold text-white transition hover:bg-[#389623]"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Aprobar Publicación</span>
                      </button>
                    )}

                    {proj.status !== 'needs_revision' && (
                      <button
                        type="button"
                        onClick={() => handleRequestRevision(proj.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-subtle px-3 py-1.5 font-bold text-theme-secondary hover:text-theme-primary transition"
                      >
                        <span>Solicitar Ajustes</span>
                      </button>
                    )}

                    <Link
                      href={`/proyectos/${proj.slug}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#FFB800] px-3 py-1.5 font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                    >
                      <span>Ver Ficha</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
