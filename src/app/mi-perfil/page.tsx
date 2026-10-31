'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  LogIn,
  QrCode,
  ShieldCheck,
  Sparkles,
  UserCog,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import { CittMemberProfile } from '@/types/citt';
import { MyActivitiesTab } from '@/components/perfil/MyActivitiesTab';
import { ProfileEditForm } from '@/components/perfil/ProfileEditForm';
import { ProfilePassLivePreview } from '@/components/perfil/ProfilePassLivePreview';
import { PhygitalPassCard } from '@/components/PhygitalPassCard';

type ProfileActiveTab = 'actividades' | 'editar' | 'nfc';

function MyProfilePageContent() {
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get('tab') as ProfileActiveTab;

  const {
    activeUser,
    isAuthenticated,
    updateActiveUserProfile,
    activities,
    unenrollFromActivity,
  } = useCittNetwork();

  const [activeTab, setActiveTab] = useState<ProfileActiveTab>(
    initialTabParam === 'editar' || initialTabParam === 'nfc'
      ? initialTabParam
      : 'actividades'
  );

  const [previewProfile, setPreviewProfile] = useState<CittMemberProfile>(activeUser);
  const [previewInQrMode, setPreviewInQrMode] = useState(false);

  useEffect(() => {
    setPreviewProfile(activeUser);
  }, [activeUser]);

  useEffect(() => {
    if (initialTabParam && ['actividades', 'editar', 'nfc'].includes(initialTabParam)) {
      setActiveTab(initialTabParam);
    }
  }, [initialTabParam]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-theme bg-theme-surface p-8 text-center shadow-theme-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFB800]/15 text-[#FFB800]">
          <LogIn className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-theme-primary">
          Acceso Requerido
        </h1>
        <p className="mt-2 text-sm text-theme-secondary">
          Debes iniciar sesión con tu cuenta de CITT Connect para acceder a tus talleres inscritos,
          código de ticket de sala, historial de horas CITT y credencial digital.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/acceso?redirect=/mi-perfil"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
          >
            <span>Iniciar Sesión con Duoc UC</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/directorio"
            className="inline-flex items-center gap-2 rounded-xl border border-theme bg-theme-subtle px-4 py-2.5 text-xs font-bold text-theme-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al Directorio</span>
          </Link>
        </div>
      </div>
    );
  }

  const enrolledActivities = activities.filter((act) =>
    act.enrolledUsernames.includes(activeUser.username)
  );
  const waitingActivities = activities.filter((act) =>
    act.waitingListUsernames?.includes(activeUser.username)
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-theme pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#FFB800] uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Portal del Estudiante & Credencial CITT</span>
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-theme-primary sm:text-4xl">
            Mi Panel CITT Connect
          </h1>
          <p className="mt-1 max-w-[65ch] text-sm text-theme-secondary">
            Gestiona tus inscripciones a talleres, tickets con pase QR para salas Duoc UC,
            certificación de horas CITT y personalización de tu credencial digital.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/u/${activeUser.username}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-theme bg-theme-elevated px-4 py-2.5 text-xs font-bold text-theme-primary transition hover:border-[#FFB800]"
          >
            <span>Ver mi Credencial Pública</span>
            <ArrowUpRight className="h-4 w-4 text-[#307FE2]" />
          </Link>
          <Link
            href="/actividades"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
          >
            <Calendar className="h-4 w-4" />
            <span>Ver Catálogo de Talleres</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-theme pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('actividades')}
          className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition ${
            activeTab === 'actividades'
              ? 'bg-[#1A1A1A] text-white shadow-md'
              : 'border border-theme bg-theme-surface text-theme-secondary hover:text-theme-primary'
          }`}
        >
          <Calendar className="h-4 w-4 text-[#FFB800]" />
          <span>Mis Talleres & Horas CITT</span>
          {enrolledActivities.length > 0 && (
            <span className="rounded-full bg-[#43B02A] px-2 py-0.5 text-[10px] font-black text-white">
              {enrolledActivities.length}
            </span>
          )}
          {waitingActivities.length > 0 && (
            <span className="rounded-full bg-[#FFB800] px-2 py-0.5 text-[10px] font-black text-[#1A1A1A]">
              +{waitingActivities.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('editar')}
          className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition ${
            activeTab === 'editar'
              ? 'bg-[#1A1A1A] text-white shadow-md'
              : 'border border-theme bg-theme-surface text-theme-secondary hover:text-theme-primary'
          }`}
        >
          <UserCog className="h-4 w-4 text-[#307FE2]" />
          <span>Editar Credencial & Perfil</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('nfc')}
          className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition ${
            activeTab === 'nfc'
              ? 'bg-[#1A1A1A] text-white shadow-md'
              : 'border border-theme bg-theme-surface text-theme-secondary hover:text-theme-primary'
          }`}
        >
          <QrCode className="h-4 w-4 text-[#43B02A]" />
          <span>Pase Digital NFC</span>
        </button>
      </div>

      {/* Tab 1: Mis Actividades & Talleres */}
      {activeTab === 'actividades' && (
        <MyActivitiesTab
          user={activeUser}
          activities={activities}
          onUnenroll={unenrollFromActivity}
        />
      )}

      {/* Tab 2: Editar Credencial & Perfil */}
      {activeTab === 'editar' && (
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProfileEditForm
              initialProfile={activeUser}
              onSaveProfile={updateActiveUserProfile}
              onProfileStateChange={setPreviewProfile}
            />
          </div>

          <ProfilePassLivePreview
            profile={previewProfile}
            previewInQrMode={previewInQrMode}
          />
        </div>
      )}

      {/* Tab 3: Pase Digital NFC Interactivo */}
      {activeTab === 'nfc' && (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-theme-primary">
                  Credencial Phygital NFC Institucional
                </h3>
                <p className="mt-1 text-xs text-theme-secondary">
                  Esta credencial se sincroniza con tus pins NFC físicos impresos en 3D en los laboratorios CITT.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewInQrMode((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFB800] px-3.5 py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>{previewInQrMode ? 'Ver Tarjeta Datos' : 'Ver Código QR'}</span>
              </button>
            </div>

            <div className="flex justify-center py-2">
              <div className="w-full max-w-sm">
                <PhygitalPassCard
                  profile={activeUser}
                  initialShowQR={previewInQrMode}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-theme bg-theme-subtle p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-theme-primary">
                <ShieldCheck className="h-4 w-4 text-[#43B02A]" />
                <span>Enlace Directo Verificado</span>
              </div>
              <p className="text-[11px] text-theme-secondary leading-relaxed">
                Cualquier persona o empresa que escanee tu código o acerque su teléfono con NFC a tu pin
                podrá acceder a tu credencial oficial en{' '}
                <code className="font-mono font-bold text-theme-primary">
                  /u/{activeUser.username}
                </code>{' '}
                sin requerir instalar aplicaciones adicionales.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[350px] items-center justify-center">
          <div className="text-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFB800] border-t-transparent mx-auto" />
            <p className="text-xs font-bold text-theme-secondary">
              Cargando panel de perfil CITT...
            </p>
          </div>
        </div>
      }
    >
      <MyProfilePageContent />
    </Suspense>
  );
}
