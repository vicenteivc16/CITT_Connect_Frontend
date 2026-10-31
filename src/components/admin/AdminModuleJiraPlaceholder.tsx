'use client';

import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  KeyRound,
  Layers,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';

export function AdminModuleJiraPlaceholder() {
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(true);

  const mockApiKey = 'citt_sec_live_984f1028ba491cd';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col justify-between gap-4 border-b border-theme pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#7C3AED]/15 px-3 py-1 text-xs font-bold text-[#7C3AED]">
            <Workflow className="h-3.5 w-3.5" />
            <span>Arquitectura Modular de Ecosistema</span>
          </span>
          <h1 className="text-2xl font-black tracking-tight text-theme-primary mt-2">
            Satélites CITT & Conector CITT Jira
          </h1>
          <p className="text-xs text-theme-secondary mt-1 max-w-2xl">
            Administra las herramientas externas de la red. CITT Connect provee autenticación centralizada (SSO), gobernanza y roles, mientras la interfaz de usuario opera en su propio sistema independiente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-2xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-3.5 py-2 text-xs font-bold text-[#7C3AED]">
            Plugin System v1.0 Activo
          </span>
        </div>
      </div>

      {/* Módulo Satélite 1: CITT Jira */}
      <section className="rounded-3xl border border-theme bg-theme-surface p-6 sm:p-8 shadow-theme-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7C3AED] text-white shadow-md">
              <Workflow className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-theme-primary">
                  CITT Jira · Tableros Kanban & Sprints
                </h2>
                <span className="rounded-full bg-[#43B02A]/15 text-[#43B02A] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  Conectado
                </span>
              </div>
              <p className="text-xs text-theme-secondary mt-0.5">
                Microfrontend para la gestión ágil de proyectos de innovación de Duoc UC.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-theme-primary cursor-pointer">
            <input
              type="checkbox"
              checked={syncEnabled}
              onChange={(e) => setSyncEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-theme text-[#FFB800]"
            />
            <span>Sincronización en Tiempo Real</span>
          </label>
        </div>

        {/* Configuración Técnica del Satélite */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div className="rounded-2xl border border-theme bg-theme-subtle p-4 space-y-1.5">
            <span className="text-theme-secondary font-bold text-[11px] block">
              URL del Sistema Operativo Satélite:
            </span>
            <div className="flex items-center justify-between bg-theme-surface rounded-xl p-2.5 border border-theme font-mono">
              <span className="truncate text-theme-primary">
                https://jira.citt.duoc.cl
              </span>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[#307FE2] hover:underline flex items-center gap-1 font-sans font-bold ml-2 shrink-0"
              >
                <span>Probar</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-theme bg-theme-subtle p-4 space-y-1.5">
            <span className="text-theme-secondary font-bold text-[11px] block">
              Credencial API & Webhook Secret:
            </span>
            <div className="flex items-center justify-between bg-theme-surface rounded-xl p-2.5 border border-theme font-mono">
              <span className="truncate text-theme-secondary">
                {mockApiKey}
              </span>
              <button
                type="button"
                onClick={handleCopyKey}
                className="inline-flex items-center gap-1 text-[#FFB800] hover:underline font-sans font-bold ml-2 shrink-0"
              >
                {apiKeyCopied ? (
                  <>
                    <Check className="h-3 w-3 text-[#43B02A]" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Reglas de Negocio Gobernadas desde CITT Connect */}
        <div className="rounded-2xl border border-theme bg-theme-subtle p-5 space-y-3">
          <h3 className="text-xs font-black text-theme-primary flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#107C41]" />
            <span>Políticas de Control de Acceso Delegadas</span>
          </h3>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs">
            <div className="bg-theme-surface rounded-xl p-3 border border-theme">
              <strong className="block text-theme-primary font-bold">
                Creación de Tableros:
              </strong>
              <span className="text-theme-secondary text-[11px]">
                Solo Líderes CITT y Personal Duoc pueden aperturar nuevos tableros de iniciativa.
              </span>
            </div>

            <div className="bg-theme-surface rounded-xl p-3 border border-theme">
              <strong className="block text-theme-primary font-bold">
                Asignación de Tickets:
              </strong>
              <span className="text-theme-secondary text-[11px]">
                Cualquier usuario con cuenta CITT Connect verificada puede ser etiquetado en un issue.
              </span>
            </div>

            <div className="bg-theme-surface rounded-xl p-3 border border-theme">
              <strong className="block text-theme-primary font-bold">
                Métricas de Sprint:
              </strong>
              <span className="text-theme-secondary text-[11px]">
                Los puntos de historia completados se consolidan en el portafolio de proyectos del líder.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Módulo Satélite 2: Hardware Tracker & Préstamo de Kits IoT */}
      <section className="rounded-3xl border border-dashed border-theme bg-theme-surface/50 p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-theme-subtle text-theme-primary border border-theme">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-theme-primary">
                  CITT Hardware Tracker & Préstamo de Kits IoT
                </h2>
                <span className="rounded-full bg-theme-elevated text-theme-secondary px-2 py-0.5 text-[10px] font-bold">
                  Próxima Extensión
                </span>
              </div>
              <p className="text-xs text-theme-secondary mt-0.5">
                Control de inventario, chips NFC de laboratorio y devolución de herramientas.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-xl border border-theme bg-theme-surface px-4 py-2 text-xs font-bold text-theme-primary hover:border-[#FFB800] transition"
          >
            Habilitar Módulo Satélite
          </button>
        </div>
      </section>
    </div>
  );
}
