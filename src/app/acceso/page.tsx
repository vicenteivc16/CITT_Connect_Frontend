'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Info,
  KeyRound,
  Lock,
  Mail,
  School,
  ShieldCheck,
  Sparkles,
  Ticket,
  User,
  XCircle,
} from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';
import {
  CITT_CAMPUSES,
  DUOC_SCHOOLS,
  ROLE_CONFIG,
} from '@/data/citt-catalog';
import {
  executeCittLogin,
  executeCittRegister,
  inspectEmailDomain,
  validatePartnerInviteCode,
} from '@/lib/auth';
import { CittMemberProfile, CittRole, DuocSchoolSlug } from '@/types/citt';

type AuthTab = 'login' | 'register' | 'partner-invite';

export default function AccesoPage() {
  const router = useRouter();
  const {
    profiles,
    activeUser,
    registerMember,
    loginMember,
    setActiveUserByUsername,
  } = useCittNetwork();

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Formulario Login ---
  const [loginEmailOrUser, setLoginEmailOrUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // --- Formulario Registro ---
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCampusSlug, setRegCampusSlug] = useState('san-joaquin');
  const [regSchoolSlug, setRegSchoolSlug] =
    useState<DuocSchoolSlug>('informatica');
  const [regCareerTitle, setRegCareerTitle] = useState('');
  const [regInviteCode, setRegInviteCode] = useState('');
  const [regPartnerOrg, setRegPartnerOrg] = useState('');

  // --- Formulario Invitación Partner Directa ---
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [partnerEmailInput, setPartnerEmailInput] = useState('');
  const [partnerValidatedOrg, setPartnerValidatedOrg] = useState<string | null>(
    null
  );

  // Inspección reactiva del dominio mientras se escribe en registro
  const domainInfo = inspectEmailDomain(regEmail);

  // Manejar Login
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
      const result = await executeCittLogin(loginEmailOrUser, loginPassword);
      if (result.success) {
        // Enlazar al perfil de la red
        const loggedInLocally = loginMember(loginEmailOrUser);
        if (!loggedInLocally && result.user) {
          // Si no existía en el mock local, creamos un perfil para la sesión
          const generatedProfile: CittMemberProfile = {
            id: `usr-${Date.now()}`,
            username: result.user.username,
            fullName: result.user.fullName,
            email: result.user.email,
            careerTitle:
              result.user.role === 'personal_duoc'
                ? 'Docente & Coordinador CITT'
                : result.user.role === 'dev'
                ? 'Core Dev Arquitectura'
                : 'Miembro CITT Duoc UC',
            currentOccupation: 'Comunidad Duoc UC',
            specialties: ['Innovación', 'Transferencia Tecnológica'],
            bio: 'Perfil verificado con acceso institucional a CITT Connect.',
            role: result.user.role,
            campusSlug: 'san-joaquin',
            schoolSlug: 'informatica',
            avatarUrl: '/assets/citt-logo.webp',
            bannerUrl: '/assets/citt-hero-lobby.webp',
            isOpenToCollaborate: true,
            isVerified: true,
          };
          registerMember(generatedProfile);
        }

        setStatusMessage({
          type: 'success',
          text: `¡Bienvenido de vuelta! Accediendo como ${loginEmailOrUser}...`,
        });
        setTimeout(() => {
          router.push(`/u/${result.user?.username || activeUser.username}`);
        }, 800);
      } else {
        setStatusMessage({
          type: 'error',
          text: result.message,
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Ocurrió un error al intentar autenticar. Inténtalo nuevamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar Registro
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

    // Auto-generar username si viene vacío
    const effectiveUsername =
      regUsername.trim() ||
      regEmail
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
        inviteCode: regInviteCode.trim() || undefined,
        partnerCompany: regPartnerOrg.trim() || undefined,
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

      // Agregar a profiles locales para interactividad inmediata
      const newMember: CittMemberProfile = {
        id: `usr-${Date.now()}`,
        username: effectiveUsername,
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        careerTitle: regCareerTitle.trim(),
        currentOccupation:
          assignedRole === 'partner'
            ? regPartnerOrg || 'Empresa Partner'
            : assignedRole === 'personal_duoc'
            ? 'Docente Duoc UC'
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
        partnerOrganization:
          assignedRole === 'partner' ? regPartnerOrg || undefined : undefined,
      };

      registerMember(newMember);

      setStatusMessage({
        type: 'success',
        text: `¡Cuenta institucional verificada con éxito! Rol asignado: ${
          ROLE_CONFIG[assignedRole].label
        }. Redirigiendo a tu credencial...`,
      });

      setTimeout(() => {
        router.push(`/u/${effectiveUsername}`);
      }, 1200);
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error de conexión al procesar el registro institucional.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Validar Código Partner en Tab 3
  const handleValidatePartnerCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const validation = validatePartnerInviteCode(partnerCodeInput);
    if (!validation.valid) {
      setStatusMessage({
        type: 'error',
        text: validation.error || 'Código no válido.',
      });
      return;
    }

    setPartnerValidatedOrg(validation.companyName || 'Empresa Aliada');
    setRegInviteCode(partnerCodeInput.trim().toUpperCase());
    if (validation.companyName) {
      setRegPartnerOrg(validation.companyName);
    }
    if (partnerEmailInput.trim()) {
      setRegEmail(partnerEmailInput.trim());
    }

    setStatusMessage({
      type: 'success',
      text: `Código verificado para "${validation.companyName}". Transfiriendo a formulario de registro con rol Partner...`,
    });

    setTimeout(() => {
      setActiveTab('register');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-theme-canvas pt-20 pb-16 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabecera Principal */}
        <div className="mb-10 text-center sm:text-left">
          <div className="flex flex-col items-center justify-between gap-4 border-b border-theme pb-6 sm:flex-row">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-theme-primary sm:text-4xl">
                Acceso Institucional CITT Connect
              </h1>
              <p className="mt-1.5 text-sm text-theme-secondary">
                Red inter-sedes Duoc UC con validación estricta de dominios y credenciales digitales.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-surface px-4 py-2 text-xs font-bold text-theme-primary transition hover:border-[#FFB800]"
            >
              Volver al inicio
            </Link>
          </div>
        </div>

        {/* Layout en 2 Columnas: Contexto Institucional + Panel de Autenticación */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* COLUMNA IZQUIERDA: Reglas de Dominio y Seguridad Institucional */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/citt-logo.webp"
                  alt="Emblema CITT Connect 3D"
                  className="h-12 w-12 shrink-0 object-contain"
                />
                <div>
                  <h2 className="text-lg font-black tracking-tight text-theme-primary">
                    Comunidad Duoc UC Cerrada
                  </h2>
                  <p className="text-xs text-theme-secondary">
                    Filtro estricto de identidad por dominio de correo
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {/* 1. Alumnos y Miembros CITT */}
                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 transition">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-[#307FE2]/30 bg-[#307FE2]/10 p-2 text-[#307FE2]">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-theme-primary">
                          Alumnos & Miembros CITT
                        </span>
                        <span className="rounded-md border border-[#307FE2]/40 bg-[#307FE2]/15 px-2 py-0.5 text-xs font-bold text-[#307FE2]">
                          @duocuc.cl
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-theme-secondary">
                        Registro automático con credencial pública, portafolio de proyectos y vinculación con las 18 sedes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Personal Docente y Directivos */}
                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 transition">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-[#FFB800]/40 bg-[#FFB800]/15 p-2 text-[#FFB800]">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-theme-primary">
                          Docentes & Coordinadores
                        </span>
                        <span className="rounded-md border border-[#1A1A1A]/30 bg-[#FFB800] px-2 py-0.5 text-xs font-bold text-[#1A1A1A]">
                          @profesor.duocuc.cl
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-theme-secondary">
                        Rol Personal Duoc con privilegios de emisión de invitaciones oficiales para empresas Partner.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Core Dev Team */}
                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 transition">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-[#307FE2]/40 bg-[#307FE2]/15 p-2 text-[#307FE2]">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-theme-primary">
                          Core Dev & Admin
                        </span>
                        <span className="rounded-md border border-[#307FE2]/40 bg-[#307FE2]/15 px-2 py-0.5 text-xs font-bold text-[#307FE2]">
                          @cittconnect.cl
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-theme-secondary">
                        Arquitectura de plataforma, gobernanza técnica y administración de integraciones.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Partners Externos */}
                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5 transition">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-[#AC4FC6]/40 bg-[#AC4FC6]/15 p-2 text-[#AC4FC6]">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-theme-primary">
                          Empresas Aliadas (Partner)
                        </span>
                        <span className="rounded-md border border-[#AC4FC6]/40 bg-[#AC4FC6]/15 px-2 py-0.5 text-xs font-bold text-[#AC4FC6]">
                          Con Invitación
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-theme-secondary">
                        Acceso mediante código de invitación autorizado para publicar desafíos e iniciativas en el muro.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensaje de política de privacidad */}
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-theme bg-theme-surface p-3 text-xs text-theme-secondary">
                <Info className="h-4 w-4 shrink-0 text-[#307FE2]" />
                <p>
                  Si eres estudiante o docente de Duoc UC, no necesitas un código previo: tu correo institucional te autentica de forma directa.
                </p>
              </div>
            </div>

            {/* Acceso Rápido Demo para Evaluación */}
            <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
              <h2 className="text-sm font-bold tracking-tight text-theme-primary">
                Perfiles de Prueba Rápida
              </h2>
              <p className="mt-1 text-xs text-theme-secondary">
                Prueba la experiencia de cada rol con un solo clic:
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {profiles.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setActiveUserByUsername(p.username);
                      setStatusMessage({
                        type: 'success',
                        text: `Sesión activa cambiada a ${p.fullName} (${
                          ROLE_CONFIG[p.role].label
                        }).`,
                      });
                    }}
                    className="flex items-center gap-2.5 rounded-xl border border-theme bg-theme-subtle p-2 text-left transition hover:border-[#FFB800] hover:bg-theme-surface"
                  >
                    <img
                      src={p.avatarUrl || '/assets/citt-logo.webp'}
                      alt={p.fullName}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-theme-primary">
                        {p.fullName.split(' ')[0]}
                      </p>
                      <p className="truncate text-xs text-theme-secondary">
                        {ROLE_CONFIG[p.role].shortLabel}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Card Interactiva de Acceso y Registro */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-theme-card">
              {/* Pestañas de Navegación del Formulario */}
              <div className="flex rounded-2xl border border-theme bg-theme-subtle p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setStatusMessage(null);
                  }}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                    activeTab === 'login'
                      ? 'border border-[#1A1A1A]/20 bg-[#FFB800] text-[#1A1A1A] shadow-sm'
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
                      ? 'border border-[#1A1A1A]/20 bg-[#FFB800] text-[#1A1A1A] shadow-sm'
                      : 'text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  Crear Cuenta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('partner-invite');
                    setStatusMessage(null);
                  }}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                    activeTab === 'partner-invite'
                      ? 'border border-[#1A1A1A]/20 bg-[#FFB800] text-[#1A1A1A] shadow-sm'
                      : 'text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  Canjear Invitación
                </button>
              </div>

              {/* Mensajes de Notificación */}
              {statusMessage && (
                <div
                  className={`mt-5 flex items-start gap-3 rounded-2xl p-4 text-xs font-medium ${
                    statusMessage.type === 'success'
                      ? 'border border-[#43B02A]/40 bg-[#43B02A]/10 text-theme-primary'
                      : statusMessage.type === 'error'
                      ? 'border border-[#D50032]/40 bg-[#D50032]/10 text-theme-primary'
                      : 'border border-[#307FE2]/40 bg-[#307FE2]/10 text-theme-primary'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#43B02A]" />
                  ) : statusMessage.type === 'error' ? (
                    <XCircle className="h-4 w-4 shrink-0 text-[#D50032]" />
                  ) : (
                    <Info className="h-4 w-4 shrink-0 text-[#307FE2]" />
                  )}
                  <p className="flex-1">{statusMessage.text}</p>
                </div>
              )}

              {/* TAB 1: INICIAR SESIÓN */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-xs font-bold text-theme-primary"
                    >
                      Correo Institucional o Nombre de Usuario
                    </label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
                      <input
                        id="login-email"
                        type="text"
                        value={loginEmailOrUser}
                        onChange={(e) => setLoginEmailOrUser(e.target.value)}
                        placeholder="tu.nombre@duocuc.cl o vicente-vasquez"
                        className="w-full rounded-xl border border-theme bg-theme-subtle py-2.5 pr-4 pl-10 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="login-password"
                        className="block text-xs font-bold text-theme-primary"
                      >
                        Contraseña
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setStatusMessage({
                            type: 'info',
                            text: 'Para restablecer tu contraseña, ingresa tu correo institucional Duoc UC y recibirás un enlace seguro vía Supabase Auth.',
                          })
                        }
                        className="text-xs font-bold text-[#307FE2] hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <div className="relative mt-1.5">
                      <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
                      <input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-theme bg-theme-subtle py-2.5 pr-4 pl-10 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#1A1A1A]/30 bg-[#FFB800] px-4 py-3 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB800] disabled:opacity-60"
                  >
                    {isLoading ? (
                      'Autenticando...'
                    ) : (
                      <>
                        <span>Ingresar a CITT Connect</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <p className="text-xs text-theme-secondary">
                      ¿Aún no tienes cuenta?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('register')}
                        className="font-bold text-[#FFB800] hover:underline"
                      >
                        Regístrate con tu correo Duoc UC
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* TAB 2: CREAR CUENTA INSTITUCIONAL */}
              {activeTab === 'register' && (
                <form
                  onSubmit={handleRegisterSubmit}
                  className="mt-6 space-y-4"
                >
                  {/* Correo Electrónico con Inspector de Dominio en Tiempo Real */}
                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-xs font-bold text-theme-primary"
                    >
                      Correo Institucional Duoc UC
                    </label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
                      <input
                        id="reg-email"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="tu.nombre@duocuc.cl"
                        className="w-full rounded-xl border border-theme bg-theme-subtle py-2.5 pr-4 pl-10 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
                      />
                    </div>

                    {/* Badge Reactivo de Inspección de Dominio */}
                    {regEmail.length > 3 && (
                      <div className="mt-2.5 rounded-xl border border-theme bg-theme-subtle p-3 text-xs transition">
                        <div className="flex items-center justify-between">
                          <span
                            className="font-bold"
                            style={{ color: domainInfo.badgeColor }}
                          >
                            {domainInfo.badgeLabel}
                          </span>
                          {domainInfo.assignedRole && (
                            <span className="rounded-md border border-theme bg-theme-surface px-2 py-0.5 text-xs font-bold text-theme-primary">
                              Rol: {ROLE_CONFIG[domainInfo.assignedRole].label}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-theme-secondary">
                          {domainInfo.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Campo de Código de Invitación si el correo no pertenece a Duoc UC */}
                  {domainInfo.requiresPartnerInvite && (
                    <div className="rounded-2xl border border-[#AC4FC6]/40 bg-[#AC4FC6]/10 p-4 transition">
                      <div className="flex items-center gap-2 text-xs font-bold text-theme-primary">
                        <Ticket className="h-4 w-4 text-[#AC4FC6]" />
                        <span>Código de Invitación Partner Requerido</span>
                      </div>
                      <p className="mt-1 text-xs text-theme-secondary">
                        Para correos no institucionales, ingresa el código emitido por el CITT o tu contraparte Duoc UC:
                      </p>
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={regInviteCode}
                          onChange={(e) => setRegInviteCode(e.target.value)}
                          placeholder="Ej: CITT-PARTNER-2026"
                          className="flex-1 rounded-xl border border-theme bg-theme-surface py-2 px-3 text-xs font-bold uppercase tracking-wider text-theme-primary placeholder-theme-secondary focus:border-[#AC4FC6] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const val = validatePartnerInviteCode(regInviteCode);
                            if (val.valid) {
                              setRegPartnerOrg(val.companyName || 'Partner');
                              setStatusMessage({
                                type: 'success',
                                text: `✓ Código válido para "${val.companyName}". Rol Partner habilitado.`,
                              });
                            } else {
                              setStatusMessage({
                                type: 'error',
                                text: val.error || 'Código inválido.',
                              });
                            }
                          }}
                          className="rounded-xl border border-[#AC4FC6] bg-[#AC4FC6] px-3.5 py-2 text-xs font-bold text-white transition hover:opacity-90"
                        >
                          Verificar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Nombre Completo y Usuario */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="reg-fullname"
                        className="block text-xs font-bold text-theme-primary"
                      >
                        Nombre y Apellidos
                      </label>
                      <div className="relative mt-1.5">
                        <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
                        <input
                          id="reg-fullname"
                          type="text"
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="Vicente Vásquez"
                          className="w-full rounded-xl border border-theme bg-theme-subtle py-2.5 pr-4 pl-10 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="reg-username"
                        className="block text-xs font-bold text-theme-primary"
                      >
                        Nombre de Usuario (/u/...)
                      </label>
                      <input
                        id="reg-username"
                        type="text"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="vicente-vasquez"
                        className="mt-1.5 w-full rounded-xl border border-theme bg-theme-subtle py-2.5 px-3.5 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
                      />
                    </div>
                  </div>

                  {/* Sede Duoc UC (18 Sedes Oficiales) y Escuela */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="reg-campus"
                        className="block text-xs font-bold text-theme-primary"
                      >
                        Sede Duoc UC
                      </label>
                      <div className="relative mt-1.5">
                        <School className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary pointer-events-none" />
                        <select
                          id="reg-campus"
                          value={regCampusSlug}
                          onChange={(e) => setRegCampusSlug(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-theme bg-theme-subtle py-2.5 pr-8 pl-10 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
                        >
                          {CITT_CAMPUSES.map((c) => (
                            <option key={c.slug} value={c.slug}>
                              {c.name} ({c.region})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="reg-school"
                        className="block text-xs font-bold text-theme-primary"
                      >
                        Escuela Duoc UC
                      </label>
                      <select
                        id="reg-school"
                        value={regSchoolSlug}
                        onChange={(e) =>
                          setRegSchoolSlug(e.target.value as DuocSchoolSlug)
                        }
                        className="mt-1.5 w-full rounded-xl border border-theme bg-theme-subtle py-2.5 px-3 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
                      >
                        {DUOC_SCHOOLS.map((s) => (
                          <option key={s.slug} value={s.slug}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Carrera o Cargo */}
                  <div>
                    <label
                      htmlFor="reg-career"
                      className="block text-xs font-bold text-theme-primary"
                    >
                      Carrera o Título Profesional
                    </label>
                    <input
                      id="reg-career"
                      type="text"
                      value={regCareerTitle}
                      onChange={(e) => setRegCareerTitle(e.target.value)}
                      placeholder="Ej: Ingeniería en Informática, Diseño Digital, etc."
                      className="mt-1.5 w-full rounded-xl border border-theme bg-theme-subtle py-2.5 px-3.5 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
                    />
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label
                      htmlFor="reg-password"
                      className="block text-xs font-bold text-theme-primary"
                    >
                      Contraseña para CITT Connect
                    </label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
                      <input
                        id="reg-password"
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className="w-full rounded-xl border border-theme bg-theme-subtle py-2.5 pr-4 pl-10 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#1A1A1A]/30 bg-[#FFB800] px-4 py-3 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB800] disabled:opacity-60"
                  >
                    {isLoading ? (
                      'Validando dominio institucional...'
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Crear y Activar Mi Pase Digital</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <p className="text-xs text-theme-secondary">
                      ¿Ya posees una cuenta registrada?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="font-bold text-[#FFB800] hover:underline"
                      >
                        Inicia sesión aquí
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* TAB 3: CANJEAR INVITACIÓN PARTNER */}
              {activeTab === 'partner-invite' && (
                <form
                  onSubmit={handleValidatePartnerCode}
                  className="mt-6 space-y-4"
                >
                  <div className="rounded-2xl border border-theme bg-theme-subtle p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-theme-primary">
                      <Building2 className="h-4 w-4 text-[#AC4FC6]" />
                      <span>Invitación Exclusiva para Empresas y Aliados</span>
                    </div>
                    <p className="mt-1 text-xs text-theme-secondary">
                      Si tu organización fue invitada por un Administrador o Personal Duoc, ingresa aquí tu código oficial para validar el acceso.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="invite-code"
                      className="block text-xs font-bold text-theme-primary"
                    >
                      Código de Invitación (Token)
                    </label>
                    <div className="relative mt-1.5">
                      <Ticket className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
                      <input
                        id="invite-code"
                        type="text"
                        value={partnerCodeInput}
                        onChange={(e) => setPartnerCodeInput(e.target.value)}
                        placeholder="Ej: CITT-PARTNER-2026 o AWS-INNOVA-2026"
                        className="w-full rounded-xl border border-theme bg-theme-subtle py-2.5 pr-4 pl-10 text-xs font-bold uppercase tracking-wider text-theme-primary placeholder-theme-secondary focus:border-[#AC4FC6] focus:outline-none focus:ring-1 focus:ring-[#AC4FC6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="invite-email"
                      className="block text-xs font-bold text-theme-primary"
                    >
                      Correo Corporativo de Empresa (Opcional para autocompletar)
                    </label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
                      <input
                        id="invite-email"
                        type="email"
                        value={partnerEmailInput}
                        onChange={(e) => setPartnerEmailInput(e.target.value)}
                        placeholder="contacto@tuempresa.com"
                        className="w-full rounded-xl border border-theme bg-theme-subtle py-2.5 pr-4 pl-10 text-xs font-medium text-theme-primary placeholder-theme-secondary focus:border-[#AC4FC6] focus:outline-none focus:ring-1 focus:ring-[#AC4FC6]"
                      />
                    </div>
                  </div>

                  {/* Códigos Demo disponibles */}
                  <div className="rounded-xl border border-theme bg-theme-subtle p-3 text-xs">
                    <p className="font-bold text-theme-primary">
                      Códigos de Demostración Activos:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {['CITT-PARTNER-2026', 'AWS-INNOVA-2026', 'SANTANDER-HUB-2026'].map(
                        (code) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => setPartnerCodeInput(code)}
                            className="rounded-lg border border-theme bg-theme-surface px-2.5 py-1 text-xs font-bold text-theme-primary transition hover:border-[#AC4FC6]"
                          >
                            {code}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#AC4FC6] bg-[#AC4FC6] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AC4FC6]"
                  >
                    <span>Validar Código y Completar Registro</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
