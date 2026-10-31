'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  Info,
  Lock,
  Mail,
  School,
  ShieldCheck,
  Sparkles,
  User,
  XCircle,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import {
  CITT_CAMPUSES,
  DUOC_SCHOOLS,
  ROLE_CONFIG,
  getCampusBySlug,
  getSchoolBySlug,
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

type AuthTab = 'login' | 'register';

interface PromoSlide {
  id: string;
  category: string;
  headline: string;
  subheadline: string;
  description: string;
  image: string;
  statsPill: string;
  badgeColor: string;
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'red-nacional',
    category: 'RED INTER-SEDES DUOC UC',
    headline: '18 Sedes Conectadas en un Ecosistema Único',
    subheadline: 'Innovación Abierta & Transferencia Tecnológica',
    description:
      'Colabora con estudiantes, docentes y coordinadores de todo el país. Participa en proyectos reales, hackathons y desafíos multidisciplinarios de alto impacto.',
    image: '/assets/citt-hero-lobby.webp',
    statsPill: '18 Sedes Activas · 9 Escuelas · +10,000 Horas CITT',
    badgeColor: '#FFB800',
  },
  {
    id: 'prototipado-id',
    category: 'I+D APLICADA & PROTOTIPADO',
    headline: 'Laboratorios Vivos & Créditos de Innovación',
    subheadline: 'De la Idea al Producto Tecnológico Validado',
    description:
      'Desde robótica y gemelos digitales hasta inteligencia artificial y soluciones para la industria. Valida horas de laboratorio y obtén reconocimiento oficial en tu historial académico.',
    image: '/assets/banner-iot.webp',
    statsPill: 'Robótica · IoT · Inteligencia Artificial · AgroTech',
    badgeColor: '#307FE2',
  },
  {
    id: 'identidad-nfc',
    category: 'IDENTIDAD INSTITUCIONAL INTEROPERABLE',
    headline: 'Tu Pasaporte Tecnológico Duoc UC',
    subheadline: 'Credencial Digital con Autenticación Microsoft 365',
    description:
      'Acceso unificado mediante tu cuenta institucional. Portafolio público de proyectos, verificación de roles, trazabilidad de competencias y soporte para hardware con chip NFC.',
    image: '/assets/banner-comunidad.webp',
    statsPill: 'Microsoft 365 SSO · Chip NFC · Trazabilidad Académica',
    badgeColor: '#107C41',
  },
];

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Formulario Login
  const [loginEmailOrUser, setLoginEmailOrUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Formulario Registro
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCampusSlug, setRegCampusSlug] = useState('san-joaquin');
  const [regSchoolSlug, setRegSchoolSlug] =
    useState<DuocSchoolSlug>('informatica');
  const [regCareerTitle, setRegCareerTitle] = useState('');

  // Inspección reactiva del dominio mientras se escribe en registro
  const domainInfo = inspectEmailDomain(regEmail);

  // Rotación automática de la galería promocional
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

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
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsLoading(true);

    if (!regFullName.trim() || !regEmail.trim() || !regCareerTitle.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Por favor, completa tu nombre completo, correo institucional y carrera.',
      });
      setIsLoading(false);
      return;
    }

    if (domainInfo.type === 'external' || domainInfo.type === 'invalid') {
      setStatusMessage({
        type: 'error',
        text: 'Acceso restringido: Solo se permiten correos institucionales oficiales de Duoc UC (@duocuc.cl, @profesor.duoc.cl, @duoc.cl). El registro de empresas aliadas se gestiona mediante invitación personalizada.',
      });
      setIsLoading(false);
      return;
    }

    const effectiveUsername = regEmail
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');

    try {
      const result = await executeCittRegister({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        username: effectiveUsername,
        password: regPassword,
        campusSlug: regCampusSlug,
        schoolSlug: regSchoolSlug,
        careerTitle: regCareerTitle.trim(),
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
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        careerTitle: regCareerTitle.trim(),
        currentOccupation:
          assignedRole === 'personal_duoc'
            ? 'Docente / Funcionario Duoc UC'
            : 'Estudiante / Miembro CITT',
        specialties: ['Innovación', 'Transferencia Tecnológica'],
        bio: `Credencial institucional activada. Miembro de la sede ${regCampusSlug} en CITT Connect.`,
        role: assignedRole,
        campusSlug: regCampusSlug,
        schoolSlug: regSchoolSlug,
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

  const activeSlideData = PROMO_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-theme-canvas pt-20 pb-16 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* LAYOUT PRINCIPAL: 2 PARTES (IZQUIERDA: GALERÍA PROMOCIONAL · DERECHA: PANEL DE ACCESO) */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* ========================================================= */}
          {/* COLUMNA IZQUIERDA: GALERÍA PROMOCIONAL CITT CONNECT       */}
          {/* ========================================================= */}
          <div
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-theme bg-theme-surface p-7 sm:p-9 shadow-theme-card lg:col-span-6 xl:col-span-7"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Imagen de Fondo Dinámica con Overlay Editorial */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={activeSlideData.image}
                alt={activeSlideData.headline}
                className="h-full w-full object-cover transition-all duration-700 ease-out scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F141C] via-[#0F141C]/85 to-[#0F141C]/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F141C]/90 via-transparent to-[#0F141C]/40" />
            </div>

            {/* Cabecera de la Galería Promocional */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-black/40 p-1.5 backdrop-blur-md shadow-lg">
                    <img
                      src="/assets/citt-logo.webp"
                      alt="Emblema CITT Connect"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#FFB800]">
                      Duoc UC · Red Nacional
                    </span>
                    <h2 className="text-base font-black tracking-tight text-white">
                      CITT Connect
                    </h2>
                  </div>
                </div>

                <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-[#FFB800]" />
                  <span>Portal Oficial</span>
                </div>
              </div>

              {/* Categoría y Tag del Slide Activo */}
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                <span
                  className="h-2 w-2 rounded-full animate-pulse"
                  style={{ backgroundColor: activeSlideData.badgeColor }}
                />
                <span className="tracking-wide">{activeSlideData.category}</span>
              </div>
            </div>

            {/* Cuerpo del Slide Activo: Titular, Bajada y Estadísticas */}
            <div className="relative z-10 my-8 space-y-4 max-w-xl">
              <h1 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                {activeSlideData.headline}
              </h1>

              <p className="text-xs font-bold uppercase tracking-wider text-[#FFB800]/95 sm:text-sm">
                {activeSlideData.subheadline}
              </p>

              <p className="text-xs leading-relaxed text-white/80 sm:text-sm">
                {activeSlideData.description}
              </p>

              <div className="pt-2">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                  <ShieldCheck className="h-4 w-4 text-[#FFB800]" />
                  <span>{activeSlideData.statsPill}</span>
                </div>
              </div>
            </div>

            {/* Pie de la Galería: Controles de Slide y Respaldo Institucional */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/15 pt-5">
              {/* Indicadores de Slide */}
              <div className="flex items-center gap-2">
                {PROMO_SLIDES.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Ver diapositiva ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-8 bg-[#FFB800]'
                        : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>

              {/* Botones Anterior / Siguiente */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide(
                      (prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length
                    )
                  }
                  aria-label="Diapositiva anterior"
                  className="rounded-xl border border-white/20 bg-black/40 p-2 text-white/90 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length)
                  }
                  aria-label="Diapositiva siguiente"
                  className="rounded-xl border border-white/20 bg-black/40 p-2 text-white/90 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMNA DERECHA: PANEL DE ACCESO & REGISTRO INSTITUCIONAL  */}
          {/* ========================================================= */}
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

              {/* BOTÓN PROMINENTE: CONTINUAR CON MICROSOFT 365 (DUOC UC) */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleMicrosoftAuth}
                  disabled={isLoading}
                  className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-theme bg-theme-subtle px-4 py-3.5 text-xs font-bold text-theme-primary shadow-sm transition hover:border-[#00A4EF] hover:bg-theme-surface hover:shadow-md"
                >
                  {/* Isotipo Oficial Microsoft 4 Colores */}
                  <div className="grid grid-cols-2 gap-0.5 h-4 w-4 shrink-0">
                    <div className="bg-[#F25022] rounded-[1px]" />
                    <div className="bg-[#7FBA00] rounded-[1px]" />
                    <div className="bg-[#00A4EF] rounded-[1px]" />
                    <div className="bg-[#FFB900] rounded-[1px]" />
                  </div>
                  <div className="flex flex-col items-start text-left sm:flex-row sm:items-center sm:gap-1.5">
                    <span>Continuar con Cuenta Institucional Duoc UC</span>
                    <span className="text-[10px] text-theme-secondary font-medium">
                      (Microsoft 365)
                    </span>
                  </div>
                </button>

                {/* Divisor Visual */}
                <div className="relative my-4 flex items-center justify-center">
                  <div className="w-full border-t border-theme" />
                  <span className="absolute bg-theme-surface px-3 text-[10px] font-bold uppercase tracking-wider text-theme-secondary">
                    o con tu correo institucional
                  </span>
                </div>
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

              {/* ========================================================= */}
              {/* TAB 1: FORMULARIO DE INICIO DE SESIÓN                     */}
              {/* ========================================================= */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Correo Institucional o Usuario *
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="text"
                        required
                        value={loginEmailOrUser}
                        onChange={(e) => setLoginEmailOrUser(e.target.value)}
                        placeholder="tu.nombre@duocuc.cl o usuario"
                        className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none pl-9"
                      />
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-theme-secondary" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-theme-primary">
                        Contraseña *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSupportModal(true)}
                        className="text-[11px] font-semibold text-[#307FE2] hover:underline"
                      >
                        ¿Problemas para ingresar?
                      </button>
                    </div>
                    <div className="relative mt-1">
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none pl-9"
                      />
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-theme-secondary" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-theme-secondary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-theme text-[#FFB800] focus:ring-[#FFB800]"
                      />
                      <span>Recordar en este equipo</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB800] py-3 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633]"
                  >
                    <span>{isLoading ? 'Autenticando...' : 'Ingresar al Ecosistema CITT'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}

              {/* ========================================================= */}
              {/* TAB 2: FORMULARIO DE REGISTRO INSTITUCIONAL               */}
              {/* ========================================================= */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Ej. Valentina Soto Miranda"
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Correo Electrónico Institucional *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nombre@duocuc.cl o @profesor.duoc.cl"
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />

                    {/* Validación Reactiva del Dominio */}
                    {regEmail && (
                      <div className="mt-2 rounded-xl border border-theme bg-theme-subtle p-2.5 text-xs">
                        <span
                          style={{ color: domainInfo.badgeColor }}
                          className="font-bold"
                        >
                          {domainInfo.badgeLabel}
                        </span>
                        <p className="text-[11px] text-theme-secondary mt-0.5">
                          {domainInfo.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-theme-primary">
                        Sede Duoc UC *
                      </label>
                      <select
                        value={regCampusSlug}
                        onChange={(e) => setRegCampusSlug(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                      >
                        {CITT_CAMPUSES.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-theme-primary">
                        Escuela Duoc UC *
                      </label>
                      <select
                        value={regSchoolSlug}
                        onChange={(e) =>
                          setRegSchoolSlug(e.target.value as DuocSchoolSlug)
                        }
                        className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3 py-2.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                      >
                        {DUOC_SCHOOLS.map((s) => (
                          <option key={s.slug} value={s.slug}>
                            {s.shortName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Carrera o Especialidad *
                    </label>
                    <input
                      type="text"
                      required
                      value={regCareerTitle}
                      onChange={(e) => setRegCareerTitle(e.target.value)}
                      placeholder="Ej. Ingeniería en Informática / Diseño Industrial"
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      domainInfo.type === 'external' ||
                      domainInfo.type === 'invalid'
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB800] py-3 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>
                      {isLoading ? 'Registrando...' : 'Crear Mi Credencial CITT'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
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
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card space-y-4">
            <div className="flex items-center justify-between border-b border-theme pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#307FE2]" />
                <h3 className="text-sm font-black text-theme-primary">
                  Soporte de Acceso Duoc UC
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="text-theme-secondary hover:text-theme-primary text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-theme-secondary leading-relaxed">
              <p>
                <strong className="text-theme-primary">
                  ¿Cómo ingreso si soy estudiante o docente?
                </strong>{' '}
                Te recomendamos hacer clic en el botón{' '}
                <strong className="text-theme-primary">
                  «Continuar con Cuenta Institucional Duoc UC (Microsoft 365)»
                </strong>
                . El sistema validará tu sesión automáticamente con las mismas
                credenciales que utilizas en tu correo institucional o intranet.
              </p>
              <p>
                <strong className="text-theme-primary">¿Empresas Partner?</strong>{' '}
                El acceso a partners corporativos se efectúa de manera exclusiva
                mediante invitación enviada directamente a su correo de convenio.
              </p>
              <p>
                Si tienes problemas con tu contraseña de Microsoft 365,
                comunícate con la mesa de ayuda institucional de tu sede Duoc UC.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSupportModal(false)}
              className="w-full rounded-xl bg-theme-subtle py-2.5 text-xs font-bold text-theme-primary hover:bg-theme-canvas transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
