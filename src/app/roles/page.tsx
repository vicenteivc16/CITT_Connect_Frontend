'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ExternalLink, Moon, Palette, Sun } from 'lucide-react';
import { DUOC_SCHOOLS, ROLE_CONFIG } from '@/data/citt-catalog';
import { CittRole } from '@/types/citt';
import { RoleBadge } from '@/components/RoleBadge';
import { useCittNetwork } from '@/context/CittNetworkContext';
import {
  DUOC_KIT_PALETTE,
  getSchoolChromaticPair,
} from '@/styles/themes';

const ROLE_ORDER: CittRole[] = [
  'personal_duoc',
  'lider_citt',
  'consejero_carrera',
  'dev',
  'partner',
  'usuario_citt',
];

const ROLE_CAPABILITIES: Record<CittRole, string[]> = {
  personal_duoc: [
    'Rango institucional más alto dentro de CITT Connect.',
    'Validación oficial de sedes, docentes y coordinadores CITT.',
    'Publicación de comunicados y eventos institucionales nacionales.',
  ],
  lider_citt: [
    'Autoridad estudiantil y técnica dentro de su sede CITT.',
    'Coordinación de tracks, torneos inter-sedes y validación de equipos.',
    'Destacar proyectos que buscan ayuda en otras sedes.',
  ],
  consejero_carrera: [
    'Puente oficial entre el CITT y los alumnos de su carrera en Duoc UC que no tienen cuenta en CITT Connect.',
    'Canaliza dudas, propuestas e interesados desde todas las escuelas hacia el CITT.',
    'Muestra un bloque especial de atención estudiantil en su Credencial Digital.',
  ],
  dev: [
    'Equipo desarrollador y mantenedor de la plataforma CITT Connect.',
    'Administración técnica, despliegue de nuevas funciones y vinculación de lotes de Pines NFC 3D.',
    'Distintivo oficial Core Dev en toda la red.',
  ],
  partner: [
    'Rol exclusivo para empresas, mentores e instituciones externas aliadas al CITT.',
    'Publicación de desafíos reales de la industria, prácticas profesionales, becas y charlas.',
    'Identificación verificada con el nombre de su organización en su credencial.',
  ],
  usuario_citt: [
    'Núcleo de la comunidad abierto a todas las carreras de Duoc UC.',
    'Credencial digital rápida con código QR dinámico y descarga de contacto (.vcf).',
    'Creación de proyectos inter-sedes y conexión directa con compañeros de todo Chile.',
  ],
};

export default function RolesAndSchoolsPage() {
  const {
    profiles,
    activeUser,
    setActiveUserByUsername,
    theme,
    setThemeMode,
  } = useCittNetwork();

  return (
    <div className="space-y-12 pb-10">
      <div className="rounded-2xl border border-[#307FE2]/30 bg-[#307FE2]/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-theme-secondary text-center sm:text-left">
          <strong className="text-theme-primary font-bold block mb-0.5">
            ¿Buscabas los Talleres y Bootcamps CITT?
          </strong>
          Las actividades extracurriculares con cupos y cómputo de Horas CITT ahora están en la nueva sección de Actividades.
        </div>
        <Link
          href="/actividades"
          className="shrink-0 rounded-xl bg-[#FFB800] px-4 py-2 text-xs font-black text-[#1A1A1A] hover:bg-[#ffc633] transition shadow-sm"
        >
          Explorar Actividades CITT →
        </Link>
      </div>

      <section className="flex flex-col justify-between gap-4 border-b border-theme pb-8 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <h1 className="text-balance text-3xl font-black tracking-tight text-theme-primary sm:text-4xl">
            Gobernanza de Roles & Sistema Oficial de Temas Duoc UC
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-theme-secondary">
            CITT Connect articula los 6 roles oficiales de la red y aplica el
            motor cromático dual basado en la{' '}
            <strong>Paleta de Color Primaria (Modo Claro por defecto)</strong> y{' '}
            <strong>Paleta de Color Secundaria (Modo Oscuro)</strong> del Kit
            Digital Duoc UC.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setThemeMode(theme === 'light' ? 'dark' : 'light')}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-bold text-[#1A1A1A] transition hover:bg-[#ffc633]"
        >
          {theme === 'light' ? (
            <>
              <Moon className="h-4 w-4" />
              <span>Probar en Modo Oscuro (#000000)</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4" />
              <span>Volver a Modo Claro (#FFFFFF)</span>
            </>
          )}
        </button>
      </section>

      {/* 1. 6 Roles Grid */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ROLE_ORDER.map((roleKey) => {
          const config = ROLE_CONFIG[roleKey];
          const capabilities = ROLE_CAPABILITIES[roleKey];
          const sampleMember = profiles.find((p) => p.role === roleKey);
          const isCurrentRole = activeUser.role === roleKey;

          return (
            <article
              key={roleKey}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border border-theme bg-theme-surface shadow-theme-card"
            >
              <div>
                <div
                  style={{ backgroundColor: config.accentHex }}
                  className="h-2 w-full"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <RoleBadge role={roleKey} showTooltip={false} size="md" />
                    <span className="text-xs font-semibold text-theme-secondary">
                      Nivel #{config.authorityRank}
                    </span>
                  </div>

                  <h2 className="mt-4 text-lg font-black text-theme-primary">
                    {config.label}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-theme-secondary">
                    {config.description}
                  </p>

                  <ul className="mt-4 space-y-2 border-t border-theme pt-4">
                    {capabilities.map((cap) => (
                      <li
                        key={cap}
                        className="flex items-start gap-2 text-xs text-theme-secondary"
                      >
                        <CheckCircle2
                          style={{
                            color:
                              theme === 'light' &&
                              config.accentHex === '#EEEEEE'
                                ? '#1A1A1A'
                                : config.accentHex,
                          }}
                          className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {sampleMember && (
                <div className="flex items-center justify-between gap-2 border-t border-theme px-6 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveUserByUsername(sampleMember.username)
                    }
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                      isCurrentRole
                        ? 'bg-theme-inverse text-theme-text-inverse'
                        : 'bg-[#FFB800] text-[#1A1A1A] hover:bg-[#ffc633]'
                    }`}
                  >
                    {isCurrentRole
                      ? 'Rol Activo en tu Sesión'
                      : `Probar vista como ${config.shortLabel}`}
                  </button>

                  <Link
                    href={`/u/${sampleMember.username}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-theme-primary hover:underline"
                  >
                    <span>Ver ejemplo</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* 2. Inspector Oficial de Tokens: Paleta Primaria vs Paleta Secundaria */}
      <section className="space-y-6 border-y border-theme py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-4">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-2xl font-black text-theme-primary">
              <Palette className="h-5 w-5 text-[#FFB800]" />
              <span>
                Arquitectura de Color Oficial (Kit Digital Duoc UC)
              </span>
            </h2>
            <p className="text-xs text-theme-secondary">
              Tema actual activo:{' '}
              <strong className="text-theme-primary">
                {theme === 'light'
                  ? 'Modo Claro (Por Defecto — Paleta Primaria)'
                  : 'Modo Oscuro (Paleta Secundaria)'}
              </strong>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Paleta Primaria */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-theme-primary">
              Paleta de Color Primaria (Base Modo Claro)
            </h3>
            <div className="divide-y divide-[var(--citt-border)] rounded-2xl border border-theme bg-theme-surface">
              {DUOC_KIT_PALETTE.primary.map((swatch) => (
                <div
                  key={swatch.hex}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      style={{ backgroundColor: swatch.hex }}
                      className="h-10 w-10 shrink-0 rounded-xl border border-theme"
                    />
                    <div>
                      <p className="text-xs font-black text-theme-primary">
                        {swatch.name} ({swatch.hex})
                      </p>
                      <p className="text-xs text-theme-secondary">
                        {swatch.roleInThemes}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-lg bg-theme-elevated px-2.5 py-1 font-mono text-xs font-bold text-theme-primary">
                    {swatch.kitClass}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Paleta Secundaria */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-theme-primary">
              Paleta de Color Secundaria (Base Modo Oscuro & Capas)
            </h3>
            <div className="divide-y divide-[var(--citt-border)] rounded-2xl border border-theme bg-theme-surface">
              {DUOC_KIT_PALETTE.secondary.map((swatch) => (
                <div
                  key={swatch.hex}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      style={{ backgroundColor: swatch.hex }}
                      className="h-10 w-10 shrink-0 rounded-xl border border-theme"
                    />
                    <div>
                      <p className="text-xs font-black text-theme-primary">
                        {swatch.name} ({swatch.hex})
                      </p>
                      <p className="text-xs text-theme-secondary">
                        {swatch.roleInThemes}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-lg bg-theme-elevated px-2.5 py-1 font-mono text-xs font-bold text-theme-primary">
                    {swatch.kitClass}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Par Cromático Inteligente de las 9 Escuelas Duoc UC */}
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-black text-theme-primary">
            Par Cromático Adaptativo de las 9 Escuelas Duoc UC
          </h2>
          <p className="mt-1 text-xs text-theme-secondary">
            En <strong>Modo Claro</strong> se prioriza el hex primario intenso
            de cada escuela; al pasar a <strong>Modo Oscuro</strong> los
            indicadores conmutan automáticamente a su hex secundario luminoso.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DUOC_SCHOOLS.map((school) => {
            const pair = getSchoolChromaticPair(school, theme);
            return (
              <div
                key={school.slug}
                className="flex items-center justify-between rounded-2xl border border-theme bg-theme-surface p-4 shadow-theme-card"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex items-center -space-x-2">
                    <span
                      style={{ backgroundColor: school.primaryHex }}
                      title={`Primario: ${school.primaryHex}`}
                      className="h-7 w-7 rounded-full border-2 border-white"
                    />
                    <span
                      style={{ backgroundColor: school.secondaryHex }}
                      title={`Secundario: ${school.secondaryHex}`}
                      className="h-7 w-7 rounded-full border-2 border-white"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-black text-theme-primary">
                      {school.shortName}
                    </p>
                    <p className="font-mono text-xs text-theme-secondary">
                      Activo: {pair.activeAccentHex}
                    </p>
                  </div>
                </div>
                <span className="rounded-lg bg-theme-elevated px-2.5 py-1 font-mono text-xs font-semibold text-theme-primary">
                  .{school.cssClass}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
