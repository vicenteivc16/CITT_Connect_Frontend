'use client';

import React, { useState } from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';

interface LoginFormProps {
  isLoading: boolean;
  onMicrosoftAuth: () => void;
  onSubmit: (emailOrUser: string, password: string, rememberMe: boolean) => void;
  onOpenSupport: () => void;
}

export function LoginForm({
  isLoading,
  onMicrosoftAuth,
  onSubmit,
  onOpenSupport,
}: LoginFormProps) {
  const [loginEmailOrUser, setLoginEmailOrUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(loginEmailOrUser, loginPassword, rememberMe);
  };

  return (
    <div className="space-y-4">
      {/* BOTÓN PROMINENTE: CONTINUAR CON MICROSOFT 365 (DUOC UC) */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onMicrosoftAuth}
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

      <form onSubmit={handleSubmit} className="space-y-4">
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
              onClick={onOpenSupport}
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
    </div>
  );
}
