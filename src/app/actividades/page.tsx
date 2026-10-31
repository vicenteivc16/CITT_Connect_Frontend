'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Sparkles,
  Award,
  Users,
  BookOpen,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import { ActivitiesHero } from '@/components/actividades/ActivitiesHero';
import { ActivityCard } from '@/components/actividades/ActivityCard';
import { ActivityFiltersBar } from '@/components/actividades/ActivityFiltersBar';
import { ActivityDetailModal } from '@/components/actividades/ActivityDetailModal';
import { CreateActivityModal } from '@/components/actividades/CreateActivityModal';
import { EnrollmentModal } from '@/components/actividades/EnrollmentModal';
import { CittActivity, DuocSchoolSlug, ActivityModality } from '@/types/citt';

export default function ActividadesPage() {
  const { activities, activeUser } = useCittNetwork();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<DuocSchoolSlug | 'all'>('all');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedModality, setSelectedModality] = useState<ActivityModality | 'all'>('all');
  const [showOnlyEnrolled, setShowOnlyEnrolled] = useState(false);

  // Modales
  const [selectedActivity, setSelectedActivity] = useState<CittActivity | null>(null);
  const [enrollmentTarget, setEnrollmentTarget] = useState<CittActivity | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const isPrivileged = ['dev', 'personal_duoc', 'lider_citt'].includes(activeUser.role);

  // Filtrado de Actividades
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Búsqueda por texto
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = act.title.toLowerCase().includes(query);
        const matchesDesc = act.description.toLowerCase().includes(query);
        const matchesInstructor = act.instructorName.toLowerCase().includes(query);
        const matchesTags = act.tags.some((t) => t.toLowerCase().includes(query));
        const matchesRoom = act.roomLocation.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesInstructor && !matchesTags && !matchesRoom) {
          return false;
        }
      }

      // Filtro por Escuela
      if (selectedSchool !== 'all' && act.schoolSlug !== selectedSchool) {
        return false;
      }

      // Filtro por Sede
      if (selectedCampus !== 'all' && act.campusSlug !== selectedCampus) {
        return false;
      }

      // Filtro por Modalidad
      if (selectedModality !== 'all' && act.modality !== selectedModality) {
        return false;
      }

      // Filtro Solo Inscritas
      if (showOnlyEnrolled) {
        if (!activeUser?.username || !act.enrolledUsernames.includes(activeUser.username)) {
          return false;
        }
      }

      return true;
    });
  }, [
    activities,
    searchQuery,
    selectedSchool,
    selectedCampus,
    selectedModality,
    showOnlyEnrolled,
    activeUser?.username,
  ]);

  // Métricas para la cabecera
  const totalOpenWorkshops = activities.filter((a) => a.status === 'abierto').length;
  const totalAvailableSeats = activities.reduce(
    (acc, a) => acc + Math.max(0, a.totalSeats - a.enrolledUsernames.length),
    0
  );
  const totalStudyMaterials = activities.reduce(
    (acc, a) => acc + (a.studyMaterials?.length || 0),
    0
  );

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Hero Estético y de Comunidad CITT */}
      <ActivitiesHero
        totalWorkshops={totalOpenWorkshops}
        availableSeats={totalAvailableSeats}
        totalStudyMaterials={totalStudyMaterials}
        onOpenCreate={() => setIsCreateOpen(true)}
        isPrivileged={isPrivileged}
      />

      {/* 2. Barra de Filtros y Búsqueda */}
      <ActivityFiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSchool={selectedSchool}
        onSchoolChange={setSelectedSchool}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        selectedModality={selectedModality}
        onModalityChange={setSelectedModality}
        showOnlyEnrolled={showOnlyEnrolled}
        onToggleEnrolled={setShowOnlyEnrolled}
        totalResults={filteredActivities.length}
        isPrivileged={isPrivileged}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      {/* 3. Grid de Tarjetas de Actividades */}
      {filteredActivities.length === 0 ? (
        <div className="rounded-3xl border border-theme bg-theme-surface p-12 text-center shadow-theme-card">
          <Calendar className="mx-auto h-12 w-12 text-theme-secondary/50" />
          <h3 className="mt-4 text-base font-black text-theme-primary">
            No se encontraron actividades con los filtros seleccionados
          </h3>
          <p className="mt-1 text-xs text-theme-secondary max-w-sm mx-auto">
            Prueba ajustando la búsqueda, seleccionando otra sede o removiendo el filtro de escuela.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedSchool('all');
              setSelectedCampus('all');
              setSelectedModality('all');
              setShowOnlyEnrolled(false);
            }}
            className="mt-4 rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-black text-[#1A1A1A] transition hover:bg-[#ffc633]"
          >
            Limpiar todos los filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onSelect={(act) => setSelectedActivity(act)}
              onEnrollRequest={(act) => setEnrollmentTarget(act)}
            />
          ))}
        </div>
      )}

      {/* 4. Modales */}
      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onOpenEnrollment={(act) => {
            setSelectedActivity(null);
            setEnrollmentTarget(act);
          }}
        />
      )}

      <EnrollmentModal
        activity={enrollmentTarget}
        isOpen={Boolean(enrollmentTarget)}
        onClose={() => setEnrollmentTarget(null)}
      />

      <CreateActivityModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
