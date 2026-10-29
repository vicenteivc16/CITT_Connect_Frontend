/**
 * Sistema Oficial de Temas (Light & Dark) — CITT Connect Duoc UC
 * Basado estrictamente en https://www.duoc.cl/kit-digital/web/tipografia-colores/
 *
 * - Paleta de Color Primaria:
 *   - Negro Duoc (.bg-dark):     #1A1A1A
 *   - Blanco (.bg-white):        #FFFFFF
 *   - Amarillo (.orange-duoc):   #FFB800
 *
 * - Paleta de Color Secundaria:
 *   - Gris (.bg-grey):           #666666
 *   - Terciario (Negro):         #000000
 *   - Neutro (Gris Claro):       #EEEEEE
 */

import { DuocSchool } from '@/types/citt';

export type ThemeMode = 'light' | 'dark';

export interface CittThemeTokens {
  name: ThemeMode;
  label: string;
  bgCanvas: string;
  bgSection: string;
  bgSurface: string;
  bgSubtle: string;
  bgElevated: string;
  bgInverse: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  accentPrimary: string;
  accentBlue: string;
  borderSubtle: string;
  borderStrong: string;
}

export const DUOC_KIT_PALETTE = {
  primary: [
    {
      name: 'Negro Duoc',
      hex: '#1A1A1A',
      kitClass: '.bg-dark / .text-dark',
      roleInThemes:
        'Texto principal e íconos en Modo Claro · Superficie de tarjetas en Modo Oscuro',
      contrastOnWhite: '17.4:1 (AAA)',
    },
    {
      name: 'Blanco Institucional',
      hex: '#FFFFFF',
      kitClass: '.bg-white / .text-white',
      roleInThemes:
        'Lienzo principal y tarjetas en Modo Claro · Texto titular en Modo Oscuro',
      contrastOnDark: '17.4:1 (AAA)',
    },
    {
      name: 'Amarillo Duoc',
      hex: '#FFB800',
      kitClass: '.bg-orange-duoc / .orange-duoc',
      roleInThemes:
        'Acento institucional primario, botones CTA (+ Connect) e insignia Personal Duoc',
      contrastWithDark: '10.5:1 (AAA)',
    },
  ],
  secondary: [
    {
      name: 'Gris Secundario',
      hex: '#666666',
      kitClass: '.bg-grey / .grey',
      roleInThemes:
        ' Textos secundarios, metadatos editoriales y bordes de apoyo',
      contrastOnWhite: '5.7:1 (AA)',
    },
    {
      name: 'Negro Terciario',
      hex: '#000000',
      kitClass: 'Terciario Kit Digital',
      roleInThemes:
        'Lienzo global en Modo Oscuro y perforaciones físicas de gafete',
      contrastWithWhite: '21.0:1 (AAA)',
    },
    {
      name: 'Neutro Duoc',
      hex: '#EEEEEE',
      kitClass: 'Neutro Kit Digital',
      roleInThemes:
        'Capas secundarias, filtros, RoleBadges ejecutivos en Modo Claro y superficie QR de alto contraste',
      contrastWithDark: '15.4:1 (AAA)',
    },
  ],
};

export const CITT_THEMES: Record<ThemeMode, CittThemeTokens> = {
  light: {
    name: 'light',
    label: 'Modo Claro (Paleta Primaria Duoc UC)',
    bgCanvas: '#FFFFFF',      // Blanco — Paleta Primaria (Capa 1: Lienzo)
    bgSection: '#EEEEEE',     // Neutro — Paleta Secundaria (Capa 2: Secciones destacadas)
    bgSurface: '#FFFFFF',     // Blanco Puro (Capa 3: Tarjetas elevadas)
    bgSubtle: '#EEEEEE',      // Neutro — Paleta Secundaria (Filtros, barras y contenedores)
    bgElevated: '#EEEEEE',    // Chips, inputs y botones secundarios
    bgInverse: '#1A1A1A',     // Negro Duoc — Paleta Primaria
    badgeBg: '#EEEEEE',       // RoleBadge ejecutivo en Modo Claro
    badgeText: '#1A1A1A',     // Texto Negro Duoc sobre #EEEEEE (15.4:1)
    badgeBorder: 'rgba(26, 26, 26, 0.22)',
    textPrimary: '#1A1A1A',   // Negro Duoc — Paleta Primaria (17.4:1 sobre #FFFFFF)
    textSecondary: '#525252', // Gris Secundario con >= 4.8:1 tanto en #FFFFFF como en #EEEEEE
    textInverse: '#FFFFFF',   // Blanco sobre #1A1A1A
    accentPrimary: '#FFB800', // Amarillo Duoc — Paleta Primaria
    accentBlue: '#307FE2',    // Azul Emblema CITT / Escuela Informática
    borderSubtle: 'rgba(26, 26, 26, 0.15)',
    borderStrong: 'rgba(26, 26, 26, 0.30)',
  },
  dark: {
    name: 'dark',
    label: 'Modo Oscuro (Paleta Secundaria Duoc UC)',
    bgCanvas: '#000000',      // Terciario Negro — Paleta Secundaria (Capa 1: Lienzo)
    bgSection: '#121212',     // Capa 2: Secciones en Modo Oscuro
    bgSurface: '#1A1A1A',     // Negro Duoc — Paleta Primaria (Capa 3: Tarjetas sobre #000000)
    bgSubtle: '#141414',      // Paneles de filtros en Modo Oscuro
    bgElevated: '#000000',    // Chips e inputs dentro de tarjetas #1A1A1A
    bgInverse: '#FFFFFF',     // Blanco — Paleta Primaria
    badgeBg: '#1A1A1A',       // RoleBadge en Modo Oscuro
    badgeText: '#FFFFFF',     // Texto Blanco sobre #1A1A1A (17.4:1)
    badgeBorder: 'rgba(238, 238, 238, 0.24)',
    textPrimary: '#FFFFFF',   // Blanco — Paleta Primaria (21:1 sobre #000000)
    textSecondary: '#EEEEEE', // Neutro — Paleta Secundaria (15.4:1 sobre #1A1A1A)
    textInverse: '#1A1A1A',   // Negro Duoc sobre #FFFFFF / #FFB800
    accentPrimary: '#FFB800', // Amarillo Duoc — Paleta Primaria
    accentBlue: '#307FE2',    // Azul Emblema CITT / Escuela Informática
    borderSubtle: 'rgba(238, 238, 238, 0.16)',
    borderStrong: 'rgba(238, 238, 238, 0.32)',
  },
};

/**
 * Par Cromático Inteligente para las 9 Escuelas Duoc UC:
 * - En Modo Claro ('light') prioriza `primaryHex` (tono intenso con alto contraste sobre #FFFFFF y #EEEEEE).
 * - En Modo Oscuro ('dark') prioriza `secondaryHex` para indicadores y acentos luminosos sobre #1A1A1A y #000000.
 */
export function getSchoolChromaticPair(school: DuocSchool, theme: ThemeMode) {
  return {
    bandHex: school.primaryHex,
    activeAccentHex: theme === 'dark' ? school.secondaryHex : school.primaryHex,
    dotHex: theme === 'dark' ? school.secondaryHex : school.primaryHex,
  };
}
