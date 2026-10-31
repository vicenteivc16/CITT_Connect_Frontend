'use client';

import React from 'react';

interface ProfileSocialLinksFormProps {
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  instagramUrl?: string;
  onChangeField: (field: string, value: string) => void;
}

export function ProfileSocialLinksForm({
  phone,
  linkedinUrl,
  githubUrl,
  portfolioUrl,
  instagramUrl,
  onChangeField,
}: ProfileSocialLinksFormProps) {
  return (
    <div className="border-t border-theme pt-5">
      <h2 className="text-sm font-bold text-theme-primary">
        Perfil Profesional y Redes Sociales
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-theme-secondary">
            Teléfono Móvil (Para exportación vCard .vcf)
          </label>
          <input
            type="tel"
            value={phone || ''}
            onChange={(e) => onChangeField('phoneOptional', e.target.value)}
            placeholder="+56 9 1234 5678"
            className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-theme-secondary">
            URL de LinkedIn
          </label>
          <input
            type="text"
            value={linkedinUrl || ''}
            onChange={(e) => onChangeField('linkedinUrl', e.target.value)}
            placeholder="https://linkedin.com/in/tu-perfil"
            className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-theme-secondary">
            URL de GitHub
          </label>
          <input
            type="text"
            value={githubUrl || ''}
            onChange={(e) => onChangeField('githubUrl', e.target.value)}
            placeholder="https://github.com/tu-usuario"
            className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-theme-secondary">
            Portafolio o Sitio Web
          </label>
          <input
            type="text"
            value={portfolioUrl || ''}
            onChange={(e) => onChangeField('portfolioUrl', e.target.value)}
            placeholder="https://miportafolio.cl"
            className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-theme-secondary">
            Instagram u Otra Red Social
          </label>
          <input
            type="text"
            value={instagramUrl || ''}
            onChange={(e) => onChangeField('instagramUrl', e.target.value)}
            placeholder="https://instagram.com/tu-usuario"
            className="mt-1 w-full rounded-xl border border-theme bg-theme-elevated px-3 py-2 text-xs text-theme-primary focus:border-[#FFB800] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
