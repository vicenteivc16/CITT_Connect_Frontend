'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CITT_CAMPUSES, DUOC_SCHOOLS } from '@/data/citt-catalog';
import { inspectEmailDomain } from '@/lib/auth';
import { DuocSchoolSlug } from '@/types/citt';

interface RegisterFormProps {
  isLoading: boolean;
  onSubmit: (data: {
    fullName: string;
    email: string;
    password: string;
    campusSlug: string;
    schoolSlug: DuocSchoolSlug;
    careerTitle: string;
  }) => void;
}

export function RegisterForm({ isLoading, onSubmit }: RegisterFormProps) {
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCampusSlug, setRegCampusSlug] = useState('san-joaquin');
  const [regSchoolSlug, setRegSchoolSlug] = useState<DuocSchoolSlug>('informatica');
  const [regCareerTitle, setRegCareerTitle] = useState('');

  // Inspección reactiva del dominio mientras se escribe en registro
  const domainInfo = inspectEmailDomain(regEmail);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      fullName: regFullName,
      email: regEmail,
      password: regPassword,
      campusSlug: regCampusSlug,
      schoolSlug: regSchoolSlug,
      careerTitle: regCareerTitle,
    });
  };

  const isBlocked =
    isLoading ||
    domainInfo.type === 'external' ||
    domainInfo.type === 'invalid';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            onChange={(e) => setRegSchoolSlug(e.target.value as DuocSchoolSlug)}
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
        disabled={isBlocked}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB800] py-3 text-xs font-bold text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc633] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>
          {isLoading ? 'Registrando...' : 'Crear Mi Credencial CITT'}
        </span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
