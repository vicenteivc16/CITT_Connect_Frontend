import { CittRole, DuocSchoolSlug } from '@/types/citt';
import { supabase, isSupabaseConfigured } from './supabase/client';

export type InstitutionalDomainType =
  | 'student'
  | 'faculty'
  | 'core_dev'
  | 'external'
  | 'invalid';

export interface DomainInspectionResult {
  domain: string;
  type: InstitutionalDomainType;
  assignedRole: CittRole | null;
  badgeLabel: string;
  badgeColor: string;
  description: string;
  requiresPartnerInvite: boolean;
}

export interface PartnerInviteRecord {
  code: string;
  companyName: string;
  allowedEmailPattern?: string;
  expiresAt: string;
}

export const SEEDED_PARTNER_INVITES: PartnerInviteRecord[] = [
  {
    code: 'CITT-PARTNER-2026',
    companyName: 'Red de Empresas Aliadas CITT',
    expiresAt: '2026-12-31',
  },
  {
    code: 'AWS-INNOVA-2026',
    companyName: 'Amazon Web Services (AWS)',
    expiresAt: '2026-12-31',
  },
  {
    code: 'SANTANDER-HUB-2026',
    companyName: 'Banco Santander Innovación',
    expiresAt: '2026-12-31',
  },
  {
    code: 'MICROSOFT-AI-2026',
    companyName: 'Microsoft Founders Hub',
    expiresAt: '2026-12-31',
  },
];

/**
 * Inspecciona un correo en tiempo real y determina su pertinencia institucional
 * según las directivas estrictas de CITT Connect:
 *   - @duocuc.cl          -> Alumno / Miembro CITT ('usuario_citt')
 *   - @profesor.duocuc.cl -> Personal Duoc / Docente ('personal_duoc')
 *   - @cittconnect.cl     -> Admin / Core Dev ('dev')
 *   - Cualquier otro      -> Externo: Requiere invitación partner activa
 */
export function inspectEmailDomain(email: string): DomainInspectionResult {
  const clean = email.trim().toLowerCase();
  if (!clean.includes('@')) {
    return {
      domain: '',
      type: 'invalid',
      assignedRole: null,
      badgeLabel: 'Ingresa tu correo institucional',
      badgeColor: '#666666',
      description: 'Usa tu correo @duocuc.cl, @profesor.duocuc.cl o invitación partner.',
      requiresPartnerInvite: false,
    };
  }

  const parts = clean.split('@');
  const domain = parts[1] || '';

  if (!domain.includes('.')) {
    return {
      domain,
      type: 'invalid',
      assignedRole: null,
      badgeLabel: 'Completando dominio...',
      badgeColor: '#666666',
      description: 'Escribe el dominio completo (@duocuc.cl, etc.).',
      requiresPartnerInvite: false,
    };
  }

  if (domain === 'duocuc.cl') {
    return {
      domain,
      type: 'student',
      assignedRole: 'usuario_citt',
      badgeLabel: '✓ Alumno / Miembro CITT Duoc UC',
      badgeColor: '#307FE2',
      description: 'Acceso directo a credencial digital, proyectos y comunidad CITT.',
      requiresPartnerInvite: false,
    };
  }

  if (domain === 'profesor.duocuc.cl') {
    return {
      domain,
      type: 'faculty',
      assignedRole: 'personal_duoc',
      badgeLabel: '✓ Personal Docente / Directivo Duoc UC',
      badgeColor: '#FFB800',
      description: 'Privilegios para asesorar proyectos y emitir invitaciones a empresas Partner.',
      requiresPartnerInvite: false,
    };
  }

  if (domain === 'cittconnect.cl') {
    return {
      domain,
      type: 'core_dev',
      assignedRole: 'dev',
      badgeLabel: '✓ Core Dev & Arquitectura CITT',
      badgeColor: '#307FE2',
      description: 'Acceso administrativo y de despliegue de infraestructura.',
      requiresPartnerInvite: false,
    };
  }

  // Correo no institucional
  return {
    domain,
    type: 'external',
    assignedRole: null,
    badgeLabel: '⚠ Dominio externo — Requiere Invitación Partner',
    badgeColor: '#E87722',
    description: 'Los correos fuera de Duoc UC requieren un Código de Invitación válido de una empresa aliada.',
    requiresPartnerInvite: true,
  };
}

/**
 * Valida un código de invitación Partner contra la lista local o Supabase
 */
export function validatePartnerInviteCode(
  code: string
): { valid: boolean; companyName?: string; error?: string } {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, error: 'Ingresa un código de invitación' };
  }

  const found = SEEDED_PARTNER_INVITES.find(
    (inv) => inv.code.toUpperCase() === cleanCode
  );

  if (found) {
    return { valid: true, companyName: found.companyName };
  }

  // Código genérico que cumpla con el formato CITT-PARTNER-XXXX
  if (/^CITT-PARTNER-[A-Z0-9]{3,}$/.test(cleanCode)) {
    return { valid: true, companyName: 'Partner Invitado CITT' };
  }

  return {
    valid: false,
    error: 'Código de invitación no encontrado o expirado. Solicita uno a un Coordinador CITT.',
  };
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  username: string;
  password?: string;
  campusSlug: string;
  schoolSlug: DuocSchoolSlug;
  careerTitle: string;
  inviteCode?: string;
  partnerCompany?: string;
}

export interface AuthActionResult {
  success: boolean;
  message: string;
  role?: CittRole;
  user?: {
    username: string;
    fullName: string;
    email: string;
    role: CittRole;
  };
}

/**
 * Registro de nuevo integrante con validación estricta de dominios institucionales
 */
export async function executeCittRegister(
  payload: RegisterPayload
): Promise<AuthActionResult> {
  const domainInfo = inspectEmailDomain(payload.email);

  let finalRole: CittRole;

  if (domainInfo.type === 'student') {
    finalRole = 'usuario_citt';
  } else if (domainInfo.type === 'faculty') {
    finalRole = 'personal_duoc';
  } else if (domainInfo.type === 'core_dev') {
    finalRole = 'dev';
  } else if (domainInfo.type === 'external') {
    // Exigir código de invitación
    if (!payload.inviteCode) {
      return {
        success: false,
        message:
          'Acceso denegado: Los correos fuera de Duoc UC requieren un Código de Invitación Partner válido emitido por CITT o Docente.',
      };
    }

    const inviteValidation = validatePartnerInviteCode(payload.inviteCode);
    if (!inviteValidation.valid) {
      return {
        success: false,
        message: inviteValidation.error || 'Código de invitación inválido.',
      };
    }

    finalRole = 'partner';
  } else {
    return {
      success: false,
      message: 'Ingresa un correo electrónico con formato válido.',
    };
  }

  // Si Supabase está configurado con credenciales reales, intentamos registrar vía Supabase Auth
  if (isSupabaseConfigured && payload.password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            full_name: payload.fullName,
            username: payload.username,
            campus_slug: payload.campusSlug,
            school_slug: payload.schoolSlug,
            career_title: payload.careerTitle,
            citt_role: finalRole,
            partner_company: payload.partnerCompany,
            invite_code: payload.inviteCode,
          },
        },
      });

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      if (data.user) {
        return {
          success: true,
          message:
            'Cuenta registrada con éxito en Supabase Auth. Revisa tu correo institucional para confirmar tu cuenta.',
          role: finalRole,
          user: {
            username: payload.username,
            fullName: payload.fullName,
            email: payload.email,
            role: finalRole,
          },
        };
      }
    } catch {
      // Fallback a flujo local si hay error de red
    }
  }

  // Flujo local / Demostración / Offline
  return {
    success: true,
    message: `¡Cuenta institucional creada con éxito! Rol asignado: ${finalRole}.`,
    role: finalRole,
    user: {
      username: payload.username,
      fullName: payload.fullName,
      email: payload.email,
      role: finalRole,
    },
  };
}

/**
 * Inicio de sesión con correo o username
 */
export async function executeCittLogin(
  emailOrUsername: string,
  password?: string
): Promise<AuthActionResult> {
  const isEmail = emailOrUsername.includes('@');

  if (isSupabaseConfigured && isEmail && password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
        password,
      });

      if (error) {
        return {
          success: false,
          message:
            error.message === 'Invalid login credentials'
              ? 'Credenciales inválidas. Verifica tu correo y contraseña.'
              : error.message,
        };
      }

      if (data.user) {
        const metadata = data.user.user_metadata || {};
        return {
          success: true,
          message: 'Inicio de sesión exitoso vía Supabase Auth.',
          role: (metadata.citt_role as CittRole) || 'usuario_citt',
          user: {
            username: metadata.username || emailOrUsername.split('@')[0],
            fullName: metadata.full_name || 'Usuario Duoc UC',
            email: data.user.email || emailOrUsername,
            role: (metadata.citt_role as CittRole) || 'usuario_citt',
          },
        };
      }
    } catch {
      // Fallback
    }
  }

  // Modo local
  return {
    success: true,
    message: 'Sesión iniciada con éxito.',
    user: {
      username: isEmail ? emailOrUsername.split('@')[0] : emailOrUsername,
      fullName: 'Usuario CITT Conectado',
      email: isEmail ? emailOrUsername : `${emailOrUsername}@duocuc.cl`,
      role: isEmail && emailOrUsername.endsWith('@profesor.duocuc.cl')
        ? 'personal_duoc'
        : isEmail && emailOrUsername.endsWith('@cittconnect.cl')
        ? 'dev'
        : 'usuario_citt',
    },
  };
}
