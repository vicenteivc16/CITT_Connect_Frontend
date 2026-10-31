'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

export function SupportModal({ open, onClose }: SupportModalProps) {
  if (!open) return null;

  return (
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
            onClick={onClose}
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
          onClick={onClose}
          className="w-full rounded-xl bg-theme-subtle py-2.5 text-xs font-bold text-theme-primary hover:bg-theme-canvas transition"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
