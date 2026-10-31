'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  Info,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import {
  ROLE_CONFIG,
  getCampusBySlug,
} from '@/data/citt-catalog';
import {
  executeCittLogin,
  executeCittRegister,
  inspectEmailDomain,
  signInWithMicrosoftDuoc,
} from '@/lib/auth';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import { RoleBadge } from '@/components/RoleBadge';
import { CittMemberProfile, CittRole, DuocSchoolSlug } from '@/types/citt';

// Subcomponentes Modulares de Acceso
import { AuthPromoGallery } from '@/components/acceso/AuthPromoGallery';
import { LoginForm } from '@/components/acceso/LoginForm';
import { RegisterForm } from '@/components/acceso/RegisterForm';
import { SupportModal } from '@/components/acceso/SupportModal';

type AuthTab = 'login' | 'register';

export default function AccesoPage() {
  const router = useRouter();
  const {
    activeUser,
    isAuthenticated,
    registerMember,
    setActiveUserByUsername,
    logoutMember,
  } = useCittNetwork();

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Listener de autenticación OAuth (Microsoft 365 / Azure Entra ID)
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (
        session?.user &&
        (event === 'SIGNED_IN' || event === 'USER_UPDATED')
      ) {
        const email = session.user.email || '';
        const domainCheck = inspectEmailDomain(email);

        if (domainCheck.type === 'invalid' || domainCheck.type === 'external') {
          setStatusMessage({
            type: 'error',
            text: `Acceso restringido: La cuenta ${email} no pertenece a los dominios oficiales de Duoc UC (@duocuc.cl, @profesor.duoc.cl, @duoc.cl).`,
          });
          await supabase.auth.signOut();
          return;
        }

        const effectiveRole = domainCheck.assignedRole || 'usuario_citt';
        const effectiveUser =
          session.user.user_metadata?.username ||
          email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '-');

        const newProfile: CittMemberProfile = {
          id: `usr-${session.user.id.slice(0, 8)}`,
          username: effectiveUser,
          fullName:
            session.user.user_metadata?.full_name || email.split('@')[0],
          email,
          careerTitle:
            effectiveRole === 'personal_duoc'
              ? 'Docente / Funcionario Duoc UC'
              : 'Estudiante CITT Duoc UC',
          currentOccupation:
            effectiveRole === 'personal_duoc'
              ? 'Personal Duoc UC'
              : 'Estudiante Duoc UC',
          specialties: ['Innovación', 'Transferencia Tecnológica'],
          bio: 'Perfil verificado institucionalmente con Microsoft 365 Duoc UC.',
          role: effectiveRole,
          campusSlug: session.user.user_metadata?.campus_slug || 'san-joaquin',
          schoolSlug: session.user.user_metadata?.school_slug || 'informatica',
          avatarUrl: '/assets/citt-logo.webp',
          bannerUrl: '/assets/citt-hero-lobby.webp',
          isOpenToCollaborate: true,
          isVerified: true,
        };

        registerMember(newProfile);
        setActiveUserByUsername(effectiveUser);

        setStatusMessage({
          type: 'success',
          text: `¡Autenticación con Microsoft 365 Duoc UC exitosa! Bienvenido @${effectiveUser}.`,
        });

        setTimeout(() => {
          router.push(`/u/${effectiveUser}`);
        }, 800);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [registerMember, setActiveUserByUsername, router]);

  // Manejar Login con Microsoft
  const handleMicrosoftAuth = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await signInWithMicrosoftDuoc();
      if (res.url) {
        window.location.href = res.url;
        return;
      }
      setStatusMessage({
        type: 'info',
        text: 'Portal institucional listo. Ingresa con tu cuenta @duocuc.cl o @profesor.duoc.cl.',
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'No fue posible conectar con el servicio de autenticación de Microsoft 365.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar Login Manual
  const handleLoginSubmit = async (
    loginEmailOrUser: string,
    loginPassword: string,
    _rememberMe: boolean
  ) => {
    setStatusMessage(null);
    setIsLoading(true);

    if (!loginEmailOrUser.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Por favor, ingresa tu correo institucional o tu nombre de usuario.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await executeCittLogin(
        loginEmailOrUser.trim(),
        loginPassword
      );

      if (!result.success) {
        setStatusMessage({
          type: 'error',
          text: result.message,
        });
        setIsLoading(false);
        return;
      }

      if (result.user?.username) {
        setActiveUserByUsername(result.user.username);
      }

      setStatusMessage({
        type: 'success',
        text: 'Inicio de sesión institucional exitoso. Redirigiendo...',
      });

      setTimeout(() => {
        router.push(`/u/${result.user?.username || activeUser.username}`);
      }, 800);
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error de comunicación al autenticar con el servidor.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar Registro Institucional
  const handleRegisterSubmit = async (data: {
    fullName: string;
    email: string;
    password: string;
    campusSlug: string;
    schoolSlug: DuocSchoolSlug;
    careerTitle: string;
  }) => {
    setStatusMessage(null);
    setIsLoading(true);

    if (!data.fullName.trim() || !data.email.trim() || !data.careerTitle.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Por favor, completa tu nombre completo, correo institucional y carrera.',
      });
      setIsLoading(false);
      return;
    }

    const domainInfo = inspectEmailDomain(data.email);
    if (domainInfo.type === 'external' || domainInfo.type === 'invalid') {
      setStatusMessage({
        type: 'error',
        text: 'Acceso restringido: Solo se permiten correos institucionales oficiales de Duoc UC (@duocuc.cl, @profesor.duoc.cl, @duoc.cl). El registro de empresas aliadas se gestiona mediante invitación personalizada.',
      });
      setIsLoading(false);
      return;
    }

    const effectiveUsername = data.email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');

    try {
      const result = await executeCittRegister({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        username: effectiveUsername,
        password: data.password,
        campusSlug: data.campusSlug,
        schoolSlug: data.schoolSlug,
        careerTitle: data.careerTitle.trim(),
      });

      if (!result.success) {
        setStatusMessage({
          type: 'error',
          text: result.message,
        });
        setIsLoading(false);
        return;
      }

      const assignedRole: CittRole = result.role || 'usuario_citt';

      const newMember: CittMemberProfile = {
        id: `usr-${Date.now()}`,
        username: effectiveUsername,
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        careerTitle: data.careerTitle.trim(),
        currentOccupation:
          assignedRole === 'personal_duoc'
            ? 'Docente / Funcionario Duoc UC'
            : 'Estudiante / Miembro CITT',
        specialties: ['Innovación', 'Transferencia Tecnológica'],
        bio: `Credencial institucional activada. Miembro de la sede ${data.campusSlug} en CITT Connect.`,
        role: assignedRole,
        campusSlug: data.campusSlug,
        schoolSlug: data.schoolSlug,
        avatarUrl: '/assets/citt-logo.webp',
        bannerUrl: '/assets/citt-hero-lobby.webp',
        isOpenToCollaborate: true,
        isVerified: true,
      };

      registerMember(newMember);
      setActiveUserByUsername(effectiveUsername);

      setStatusMessage({
        type: 'success',
        text: `¡Cuenta institucional verificada con éxito! Rol asignado: ${ROLE_CONFIG[assignedRole].label}. Redirigiendo a tu credencial...`,
      });

      setTimeout(() => {
        router.push(`/u/${effectiveUsername}`);
      }, 1000);
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error de conexión al procesar el registro institucional.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-canvas pt-20 pb-16 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* LAYOUT PRINCIPAL: 2 PARTES (IZQUIERDA: GALERÍA PROMOCIONAL · DERECHA: PANEL DE ACCESO) */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* COLUMNA IZQUIERDA: GALERÍA PROMOCIONAL CITT CONNECT */}
          <AuthPromoGallery />

          {/* COLUMNA DERECHA: PANEL DE ACCESO & REGISTRO INSTITUCIONAL */}
          <div className="flex flex-col justify-center lg:col-span-6 xl:col-span-5">
            <div className="rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-theme-card">
              {/* Cabecera del Panel */}
              <div className="space-y-1.5 pb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/assets/citt-logo.webp"
                      alt="CITT Duoc UC"
                      className="h-7 w-7 object-contain"
                    />
                    <img
                      src="/assets/Logo_DuocUC.svg.webp"
                      alt="Duoc UC"
                      className="h-5 w-auto object-contain brightness-100 dark:brightness-110"
                    />
                  </div>
                  <Link
                    href="/"
                    className="text-xs font-bold text-theme-secondary hover:text-theme-primary transition"
                  >
                    Volver al inicio
                  </Link>
                </div>

                <h2 className="text-xl font-black tracking-tight text-theme-primary sm:text-2xl">
                  {activeTab === 'login'
                    ? 'Iniciar Sesión Institucional'
                    : 'Crear Credencial CITT'}
                </h2>
                <p className="text-xs text-theme-secondary leading-relaxed">
                  {activeTab === 'login'
                    ? 'Accede con tu cuenta oficial de Duoc UC para gestionar tus proyectos y credencial digital.'
                    : 'Registro exclusivo para estudiantes, docentes y coordinadores de Duoc UC.'}
                </p>
              </div>

              {/* SESIÓN ACTIVA (Si ya está autenticado) */}
              {isAuthenticated && (
                <div className="mb-6 rounded-2xl border border-[#307FE2]/30 bg-[#307FE2]/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-xl border border-theme bg-theme-surface">
                        <img
                          src={activeUser.avatarUrl || '/assets/citt-logo.webp'}
                          alt={activeUser.fullName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-theme-primary">
                            {activeUser.fullName}
                          </span>
                          <RoleBadge
                            role={activeUser.role}
                            showTooltip={false}
                            size="sm"
                          />
                        </div>
                        <p className="text-[11px] text-theme-secondary">
                          @{activeUser.username} · Sede{' '}
                          {getCampusBySlug(activeUser.campusSlug).shortName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={`/u/${activeUser.username}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FFB800] py-2 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
                    >
                      <span>Ir a Mi Credencial</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logoutMember();
                        setStatusMessage({
                          type: 'info',
                          text: 'Sesión cerrada exitosamente.',
                        });
                      }}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}

              {/* Pestañas de Navegación: SOLO 2 TABS (Iniciar Sesión | Crear Cuenta) */}
              <div className="flex rounded-2xl border border-theme bg-theme-subtle p-1.5 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setStatusMessage(null);
                  }}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                    activeTab === 'login'
                      ? 'bg-[#FFB800] text-[#1A1A1A] shadow-sm'
                      : 'text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setStatusMessage(null);
                  }}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                    activeTab === 'register'
                      ? 'bg-[#FFB800] text-[#1A1A1A] shadow-sm'
                      : 'text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  Crear Cuenta
                </button>
              </div>

              {/* MENSAJES DE ESTADO / ALERTAS */}
              {statusMessage && (
                <div
                  role="status"
                  className={`mb-5 flex items-start gap-3 rounded-2xl border p-3.5 text-xs font-semibold ${
                    statusMessage.type === 'success'
                      ? 'border-[#43B02A]/40 bg-[#43B02A]/10 text-theme-primary'
                      : statusMessage.type === 'error'
                      ? 'border-red-500/40 bg-red-500/10 text-red-500'
                      : 'border-[#307FE2]/40 bg-[#307FE2]/10 text-[#307FE2]'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#43B02A]" />
                  ) : statusMessage.type === 'error' ? (
                    <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                  ) : (
                    <Info className="h-4 w-4 shrink-0 text-[#307FE2]" />
                  )}
                  <p className="flex-1">{statusMessage.text}</p>
                  <button
                    type="button"
                    onClick={() => setStatusMessage(null)}
                    className="text-theme-secondary hover:text-theme-primary"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* TAB 1: FORMULARIO DE INICIO DE SESIÓN */}
              {activeTab === 'login' && (
                <LoginForm
                  isLoading={isLoading}
                  onMicrosoftAuth={handleMicrosoftAuth}
                  onSubmit={handleLoginSubmit}
                  onOpenSupport={() => setShowSupportModal(true)}
                />
              )}

              {/* TAB 2: FORMULARIO DE REGISTRO INSTITUCIONAL */}
              {activeTab === 'register' && (
                <RegisterForm
                  isLoading={isLoading}
                  onSubmit={handleRegisterSubmit}
                />
              )}

              {/* Pie del Panel de Acceso */}
              <div className="mt-6 border-t border-theme pt-4 text-center">
                <p className="flex items-center justify-center gap-1.5 text-[11px] text-theme-secondary">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#107C41]" />
                  <span>
                    Acceso protegido con cifrado SSL y políticas de gobernanza Duoc UC.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE AYUDA / SOPORTE INSTITUCIONAL */}
      <SupportModal
        open={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
}
