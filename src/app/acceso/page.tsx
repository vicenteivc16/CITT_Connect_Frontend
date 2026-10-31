'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Compass,
  Crown,
  ExternalLink,
  GraduationCap,
  Info,
  KeyRound,
  Lock,
  Mail,
  School,
  ShieldCheck,
  Sparkles,
  Terminal,
  Ticket,
  User,
  UserCheck,
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
  validatePartnerInviteCode,
} from '@/lib/auth';
import { RoleBadge } from '@/components/RoleBadge';
import { CittMemberProfile, CittRole, DuocSchoolSlug } from '@/types/citt';

type AuthTab = 'login' | 'register' | 'partner-invite';

interface QuickRoleAccessItem {
  role: CittRole;
  username: string;
  fullName: string;
  careerTitle: string;
  campusSlug: string;
  email: string;
  accentHex: string;
}

const QUICK_ROLE_USERS: QuickRoleAccessItem[] = [
  {
    role: 'personal_duoc',
    username: 'carlos-vega-docente',
    fullName: 'Prof. Carlos Vega R.',
    careerTitle: 'Docente Patrocinador & Coordinador CITT',
    campusSlug: 'concepcion',
    email: 'carlos.vega@profesor.duocuc.cl',
    accentHex: '#FFB800',
  },
  {
    role: 'lider_citt',
    username: 'camila-soto',
    fullName: 'Camila Soto',
    careerTitle: 'Líder Track Robótica & Fabricación 3D',
    campusSlug: 'san-joaquin',
    email: 'c.soto@duocuc.cl',
    accentHex: '#FFB800',
  },
  {
    role: 'consejero_carrera',
    username: 'valentina-soto',
    fullName: 'Valentina Soto Miranda',
    careerTitle: 'Consejera de Carrera · Escuela de Salud',
    campusSlug: 'vina-del-mar',
    email: 'v.soto@duocuc.cl',
    accentHex: '#00A499',
  },
  {
    role: 'usuario_citt',
    username: 'matias-alarcon',
    fullName: 'Matías Alarcón Vergara',
    careerTitle: 'Desarrollador Firmware C++ / Robótica',
    campusSlug: 'concepcion',
    email: 'm.alarcon@duocuc.cl',
    accentHex: '#43B02A',
  },
  {
    role: 'partner',
    username: 'javiera-mendez-aws',
    fullName: 'Javiera Méndez Solar',
    careerTitle: 'Líder Alianzas Cloud & IA · AustralCloud',
    campusSlug: 'antonio-varas',
    email: 'jmendez@australcloud.cl',
    accentHex: '#AC4FC6',
  },
  {
    role: 'dev',
    username: 'vicente-vasquez',
    fullName: 'Vicente Vásquez',
    careerTitle: 'Lead Core Dev & Creador CITT Connect',
    campusSlug: 'concepcion',
    email: 'v.vasquez@cittconnect.cl',
    accentHex: '#307FE2',
  },
];

export default function AccesoPage() {
  const router = useRouter();
  const {
    profiles,
    activeUser,
    isAuthenticated,
    registerMember,
    loginMember,
    setActiveUserByUsername,
    logoutMember,
  } = useCittNetwork();

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Formulario Login
  const [loginEmailOrUser, setLoginEmailOrUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Formulario Registro
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

  // Formulario Invitación Partner Directa
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [partnerEmailInput, setPartnerEmailInput] = useState('');
  const [partnerValidatedOrg, setPartnerValidatedOrg] = useState<string | null>(
    null
  );

  // Inspección reactiva del dominio mientras se escribe en registro
  const domainInfo = inspectEmailDomain(regEmail);

  // Acceso Rápido por Rol
  const handleQuickRoleSelect = (item: QuickRoleAccessItem) => {
    setIsLoading(true);
    setLoginEmailOrUser(item.email);
    setLoginPassword('demo-citt-2026');

    setActiveUserByUsername(item.username);

    setStatusMessage({
      type: 'success',
      text: `Iniciando sesión como ${item.fullName} (${ROLE_CONFIG[item.role].label}). Redirigiendo...`,
    });

    setTimeout(() => {
      setIsLoading(false);
      router.push(`/u/${item.username}`);
    }, 800);
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
      const result = await executeCittLogin(loginEmailOrUser, loginPassword);
      if (result.success) {
        const loggedInLocally = loginMember(loginEmailOrUser);
        if (!loggedInLocally && result.user) {
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

  // Validar Código Partner en Tab 3
  const handleValidatePartnerCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerCodeInput.trim()) return;

    const validation = validatePartnerInviteCode(partnerCodeInput.trim());
    if (validation.valid && validation.companyName) {
      setPartnerValidatedOrg(validation.companyName);
      setStatusMessage({
        type: 'success',
        text: `Código oficial validado: ${validation.companyName}. Puedes proceder a registrar tu cuenta partner.`,
      });
      setRegInviteCode(partnerCodeInput.trim());
      setRegPartnerOrg(validation.companyName);
      if (partnerEmailInput.trim()) {
        setRegEmail(partnerEmailInput.trim());
      }
      setActiveTab('register');
    } else {
      setStatusMessage({
        type: 'error',
        text: 'El código de invitación ingresado no es válido o ya ha expirado.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-theme-canvas pt-20 pb-16 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* CABECERA PRINCIPAL */}
        <section className="rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-theme-card">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-theme pb-6 sm:flex-row sm:items-center">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/30 bg-[#FFB800]/10 px-3 py-1 text-xs font-bold text-[#FFB800]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Autenticación Institucional & Gobernanza de Roles</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-theme-primary sm:text-3xl lg:text-4xl">
                Acceso & Registro CITT Connect
              </h1>
              <p className="text-xs leading-relaxed text-theme-secondary sm:text-sm">
                Red inter-sedes de Duoc UC. Autenticación con correo institucional,
                código partner verificado o simulador de roles para evaluación.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logoutMember();
                    setStatusMessage({
                      type: 'info',
                      text: 'Sesión cerrada exitosamente.',
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                >
                  <span>Cerrar Sesión Actual</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-subtle px-3 py-1.5 text-xs font-semibold text-theme-secondary">
                  <span>Sin sesión activa</span>
                </span>
              )}

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-surface px-3.5 py-2 text-xs font-bold text-theme-primary transition hover:border-[#FFB800]"
              >
                <span>Volver al Inicio</span>
              </Link>
            </div>
          </div>

          {/* 1. SECCIÓN DE ACCESO RÁPIDO DEMO (6 ROLES CITT) */}
          <div className="mt-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-black tracking-tight text-theme-primary">
                  Acceso Rápido Demo · 6 Roles CITT Oficiales
                </h2>
                <p className="text-xs text-theme-secondary">
                  Haz clic en cualquiera de los 6 roles para iniciar sesión inmediatamente con un perfil verificado:
                </p>
              </div>

              <span className="text-[11px] font-semibold text-theme-secondary">
                1 clic para evaluar la plataforma
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {QUICK_ROLE_USERS.map((item) => {
                const campus = getCampusBySlug(item.campusSlug);
                const roleConfig = ROLE_CONFIG[item.role];
                const isActive =
                  isAuthenticated && activeUser.username === item.username;

                return (
                  <button
                    key={item.role}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleQuickRoleSelect(item)}
                    className={`group relative flex items-start gap-3 rounded-2xl border p-3.5 text-left transition hover:scale-[1.01] hover:shadow-md ${
                      isActive
                        ? 'border-[#FFB800] bg-theme-subtle ring-2 ring-[#FFB800]/50'
                        : 'border-theme bg-theme-subtle hover:border-theme-primary'
                    }`}
                  >
                    <div
                      style={{ borderColor: item.accentHex }}
                      className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border-2 bg-theme-surface"
                    >
                      <img
                        src={`https://images.unsplash.com/photo-${
                          item.role === 'personal_duoc'
                            ? '1472099645785-5658abf4ff4e'
                            : item.role === 'partner'
                            ? '1573496359142-b8d87734a5a2'
                            : item.role === 'dev'
                            ? '1534528741775-53994a69daeb'
                            : item.role === 'consejero_carrera'
                            ? '1544005313-94ddf0286df2'
                            : item.role === 'lider_citt'
                            ? '1580489944761-15a19d654956'
                            : '1507003211169-0a1dd7228f2d'
                        }?auto=format&fit=crop&w=150&q=80`}
                        alt={item.fullName}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate text-xs font-black text-theme-primary group-hover:text-[#307FE2] transition">
                          {item.fullName}
                        </span>
                        <RoleBadge role={item.role} showTooltip={false} size="sm" />
                      </div>

                      <p className="truncate text-[11px] text-theme-secondary font-medium">
                        {item.careerTitle}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-theme-secondary/80 pt-0.5">
                        <span>Sede {campus.shortName}</span>
                        <span className="font-bold text-[#FFB800] group-hover:underline">
                          {isActive ? '✓ Sesión Activa' : 'Entrar →'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ALERTA DE MENSAJE DE ESTADO */}
        {statusMessage && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-2xl border p-4 text-xs font-semibold shadow-sm ${
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

        {/* 2. FORMULARIOS DE ACCESO & INFORMACIÓN INSTITUCIONAL */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* COLUMNA IZQUIERDA: Reglas de Dominio y Seguridad */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/citt-logo.webp"
                  alt="Emblema CITT Connect 3D"
                  className="h-11 w-11 shrink-0 object-contain"
                />
                <div>
                  <h2 className="text-base font-black tracking-tight text-theme-primary">
                    Comunidad Duoc UC Cerrada
                  </h2>
                  <p className="text-xs text-theme-secondary">
                    Filtro estricto de identidad por dominio de correo
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {/* 1. Alumnos y Miembros CITT */}
                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-[#307FE2]/30 bg-[#307FE2]/10 p-2 text-[#307FE2]">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-theme-primary">
                          Alumnos & Miembros CITT
                        </span>
                        <span className="rounded-md border border-[#307FE2]/40 bg-[#307FE2]/15 px-2 py-0.5 text-[10px] font-bold text-[#307FE2]">
                          @duocuc.cl
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-theme-secondary leading-relaxed">
                        Registro directo con credencial pública, portafolio de proyectos y red inter-sedes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Personal Docente y Directivos */}
                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-[#FFB800]/40 bg-[#FFB800]/15 p-2 text-[#FFB800]">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-theme-primary">
                          Docentes & Coordinadores
                        </span>
                        <span className="rounded-md border border-[#1A1A1A]/30 bg-[#FFB800] px-2 py-0.5 text-[10px] font-bold text-[#1A1A1A]">
                          @profesor.duocuc.cl
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-theme-secondary leading-relaxed">
                        Rol Personal Duoc con privilegios de gestión y validación de proyectos.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Core Dev Team */}
                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-[#307FE2]/40 bg-[#307FE2]/15 p-2 text-[#307FE2]">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-theme-primary">
                          Core Dev & Arquitectura
                        </span>
                        <span className="rounded-md border border-[#307FE2]/40 bg-[#307FE2]/15 px-2 py-0.5 text-[10px] font-bold text-[#307FE2]">
                          @cittconnect.cl
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-theme-secondary leading-relaxed">
                        Gobernanza técnica, integraciones, base de datos y despliegues.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Partners Externos */}
                <div className="rounded-2xl border border-theme bg-theme-subtle p-3.5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-[#AC4FC6]/40 bg-[#AC4FC6]/15 p-2 text-[#AC4FC6]">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-theme-primary">
                          Empresas Aliadas (Partner)
                        </span>
                        <span className="rounded-md border border-[#AC4FC6]/40 bg-[#AC4FC6]/15 px-2 py-0.5 text-[10px] font-bold text-[#AC4FC6]">
                          Con Invitación
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-theme-secondary leading-relaxed">
                        Acceso mediante código de invitación autorizado para publicar desafíos y pasantías.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Card Interactiva con Tabs de Acceso y Registro */}
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
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('partner-invite');
                    setStatusMessage(null);
                  }}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                    activeTab === 'partner-invite'
                      ? 'bg-[#FFB800] text-[#1A1A1A] shadow-sm'
                      : 'text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  Acceso Partner
                </button>
              </div>

              {/* TAB 1: FORMULARIO DE INICIO DE SESIÓN */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Correo Institucional o Usuario *
                    </label>
                    <div className="relative mt-1">
                      <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
                      <input
                        type="text"
                        required
                        value={loginEmailOrUser}
                        onChange={(e) => setLoginEmailOrUser(e.target.value)}
                        placeholder="tu.nombre@duocuc.cl o usuario"
                        className="w-full rounded-xl border border-theme bg-theme-subtle py-2.5 pr-3.5 pl-10 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Contraseña *
                    </label>
                    <div className="relative mt-1">
                      <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-theme bg-theme-subtle py-2.5 pr-3.5 pl-10 text-xs font-medium text-theme-primary focus:border-[#FFB800] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-theme-secondary">
                      ¿Olvidaste tu contraseña? Contacta a tu coordinador CITT.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB800] py-3 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633]"
                  >
                    <span>{isLoading ? 'Autenticando...' : 'Entrar a CITT Connect'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}

              {/* TAB 2: FORMULARIO DE REGISTRO */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
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
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nombre@duocuc.cl o correo corporativo"
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
                      Carrera o Título Profesional *
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
                    disabled={isLoading}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB800] py-3 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633]"
                  >
                    <span>{isLoading ? 'Registrando...' : 'Crear Mi Credencial CITT'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}

              {/* TAB 3: VALIDACIÓN CÓDIGO PARTNER */}
              {activeTab === 'partner-invite' && (
                <form
                  onSubmit={handleValidatePartnerCode}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-theme-primary">
                      Código de Invitación Partner *
                    </label>
                    <input
                      type="text"
                      required
                      value={partnerCodeInput}
                      onChange={(e) => setPartnerCodeInput(e.target.value)}
                      placeholder="Ej. AWS-INNOVA-2026 o CITT-PARTNER-2026"
                      className="mt-1 w-full rounded-xl border border-theme bg-theme-subtle px-3.5 py-2.5 text-xs font-medium uppercase text-theme-primary focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div className="rounded-xl border border-theme bg-theme-subtle p-3 text-xs text-theme-secondary space-y-1.5">
                    <p className="font-bold text-theme-primary">
                      Códigos demo precargados para evaluación:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['AWS-INNOVA-2026', 'CITT-PARTNER-2026', 'SANTANDER-HUB-2026'].map(
                        (code) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => setPartnerCodeInput(code)}
                            className="rounded-lg border border-theme bg-theme-surface px-2.5 py-1 text-[11px] font-mono font-bold text-theme-primary hover:border-[#FFB800]"
                          >
                            {code}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB800] py-3 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633]"
                  >
                    <span>Validar Código & Continuar</span>
                    <ArrowRight className="h-4 w-4" />
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
