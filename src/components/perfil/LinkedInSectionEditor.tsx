'use client';

import React, { useState } from 'react';
import {
  Linkedin,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Image as ImageIcon,
  Link as LinkIcon,
  HelpCircle,
} from 'lucide-react';
import { CittMemberProfile, LinkedInFeaturedPost } from '@/types/citt';
import { LinkedInPostCard } from './LinkedInPostCard';

interface LinkedInSectionEditorProps {
  profile: CittMemberProfile;
  onChange: (updated: Partial<CittMemberProfile>) => void;
}

export function LinkedInSectionEditor({
  profile,
  onChange,
}: LinkedInSectionEditorProps) {
  // New Post Form State
  const [newPostUrl, setNewPostUrl] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostSummary, setNewPostSummary] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const posts = profile.linkedinPosts || [];

  const handleAddPost = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!newPostUrl.trim()) {
      setFormError('Ingresa el enlace de la publicación en LinkedIn.');
      return;
    }

    if (!newPostUrl.includes('linkedin.com')) {
      setFormError('La URL debe pertenecer al dominio linkedin.com.');
      return;
    }

    const newPost: LinkedInFeaturedPost = {
      id: `li-post-${Date.now()}`,
      url: newPostUrl.trim(),
      title: newPostTitle.trim() || 'Logro o publicación profesional',
      summary: newPostSummary.trim() || undefined,
      publishedAt: new Date().toLocaleDateString('es-CL', {
        month: 'short',
        year: 'numeric',
      }),
      authorName: profile.fullName,
    };

    const updated = [...posts, newPost];
    onChange({ linkedinPosts: updated });

    setNewPostUrl('');
    setNewPostTitle('');
    setNewPostSummary('');
    setFormError(null);
  };

  const handleDeletePost = (id: string) => {
    const updated = posts.filter((p) => p.id !== id);
    onChange({ linkedinPosts: updated });
  };

  const handleSimulateLinkedInOAuth = () => {
    setIsConnecting(true);
    setTimeout(() => {
      // Simulate OAuth OpenID Connect callback payload
      const mockSub = `urn:li:person:${profile.username}`;
      const mockHeadline = `${profile.careerTitle} | Duoc UC | CITT Innovador`;
      const mockAvatar =
        profile.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

      onChange({
        linkedinId: mockSub,
        linkedinHeadline: mockHeadline,
        linkedinVerified: true,
        linkedinAvatarUrl: mockAvatar,
        linkedinUrl: profile.linkedinUrl || `https://www.linkedin.com/in/${profile.username}`,
      });
      setIsConnecting(false);
    }, 700);
  };

  return (
    <div className="space-y-6 rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A66C2] text-white shadow-md">
            <Linkedin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-theme-primary flex items-center gap-2">
              Integración con LinkedIn
              {profile.linkedinVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                  <CheckCircle2 className="h-3 w-3" />
                  Conectado y Verificado
                </span>
              )}
            </h3>
            <p className="text-xs text-theme-secondary">
              Vincula tu identidad profesional, sincroniza tu fotografía y exhibe tus logros y posts.
            </p>
          </div>
        </div>

        {/* OAuth Connect Button */}
        {!profile.linkedinVerified ? (
          <button
            type="button"
            onClick={handleSimulateLinkedInOAuth}
            disabled={isConnecting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#004182] active:scale-95 disabled:opacity-50"
          >
            <Linkedin className="h-4 w-4" />
            <span>{isConnecting ? 'Conectando...' : 'Vincular con LinkedIn'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onChange({
                  linkedinVerified: false,
                  linkedinId: undefined,
                })
              }
              className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
            >
              Desvincular
            </button>
          </div>
        )}
      </div>

      {/* Inputs: URL & Titular */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-[var(--citt-border)]">
        <div>
          <label className="block text-xs font-bold text-theme-primary mb-1">
            Enlace a tu Perfil de LinkedIn
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3.5 top-3 h-4 w-4 text-theme-secondary" />
            <input
              type="url"
              value={profile.linkedinUrl || ''}
              onChange={(e) => onChange({ linkedinUrl: e.target.value })}
              placeholder="https://www.linkedin.com/in/usuario"
              className="w-full rounded-xl border border-theme bg-theme-elevated py-2.5 pl-10 pr-3 text-xs text-theme-primary placeholder-zinc-500 focus:border-[#0A66C2] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-theme-primary mb-1">
            Titular Profesional en LinkedIn
          </label>
          <input
            type="text"
            value={profile.linkedinHeadline || ''}
            onChange={(e) => onChange({ linkedinHeadline: e.target.value })}
            placeholder="Ej: Estudiante Informática | Innovador CITT Duoc UC"
            className="w-full rounded-xl border border-theme bg-theme-elevated py-2.5 px-3 text-xs text-theme-primary placeholder-zinc-500 focus:border-[#0A66C2] focus:outline-none"
          />
        </div>
      </div>

      {/* Sincronización de Avatar */}
      {profile.linkedinAvatarUrl && (
        <div className="flex items-center justify-between rounded-2xl border border-[var(--citt-border)] bg-theme-subtle p-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.linkedinAvatarUrl}
              alt="Avatar de LinkedIn"
              className="h-9 w-9 rounded-full object-cover border border-[#0A66C2]"
            />
            <div>
              <p className="text-xs font-bold text-theme-primary">Foto de Perfil de LinkedIn</p>
              <p className="text-[11px] text-theme-secondary">
                ¿Deseas usar automáticamente tu foto de LinkedIn en CITT Connect?
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const nextSync = !profile.linkedinSyncAvatar;
              onChange({
                linkedinSyncAvatar: nextSync,
                avatarUrl: nextSync ? profile.linkedinAvatarUrl : profile.avatarUrl,
              });
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              profile.linkedinSyncAvatar
                ? 'bg-emerald-500 text-white'
                : 'bg-theme-elevated border border-theme text-theme-primary hover:border-[#0A66C2]'
            }`}
          >
            {profile.linkedinSyncAvatar ? 'Sincronizado' : 'Usar esta foto'}
          </button>
        </div>
      )}

      {/* Sección: Publicaciones y Actividades Destacadas */}
      <div className="pt-4 border-t border-[var(--citt-border)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-bold text-theme-primary flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#FFB800]" />
              Publicaciones y Logros Destacados en LinkedIn
            </h4>
            <p className="text-xs text-theme-secondary">
              Agrega los enlaces a tus posts más representativos en LinkedIn para mostrarlos en tu perfil público de CITT Connect.
            </p>
          </div>
          <span className="text-xs font-bold text-theme-secondary">
            {posts.length} {posts.length === 1 ? 'publicación' : 'publicaciones'}
          </span>
        </div>

        {/* Formulario Agregar Publicación */}
        <div className="space-y-3 rounded-2xl border border-[var(--citt-border)] bg-theme-elevated p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold text-theme-secondary mb-1">
                Enlace a la Publicación de LinkedIn *
              </label>
              <input
                type="url"
                value={newPostUrl}
                onChange={(e) => {
                  setNewPostUrl(e.target.value);
                  setFormError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPost();
                  }
                }}
                placeholder="https://www.linkedin.com/posts/..."
                className="w-full rounded-xl border border-theme bg-theme-surface py-2 px-3 text-xs text-theme-primary placeholder-zinc-500 focus:border-[#0A66C2] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-theme-secondary mb-1">
                Título o Tema del Post
              </label>
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPost();
                  }
                }}
                placeholder="Ej: Presentación de proyecto en CITT Duoc UC"
                className="w-full rounded-xl border border-theme bg-theme-surface py-2 px-3 text-xs text-theme-primary placeholder-zinc-500 focus:border-[#0A66C2] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-theme-secondary mb-1">
              Breve Resumen o Fragmento (opcional)
            </label>
            <textarea
              rows={2}
              value={newPostSummary}
              onChange={(e) => setNewPostSummary(e.target.value)}
              placeholder="Ej: Comparto el desarrollo de nuestra plataforma IoT para monitoreo de sensores..."
              className="w-full rounded-xl border border-theme bg-theme-surface py-2 px-3 text-xs text-theme-primary placeholder-zinc-500 focus:border-[#0A66C2] focus:outline-none resize-none"
            />
          </div>

          {formError && (
            <div className="flex items-center gap-1.5 text-xs text-red-500">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddPost}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A66C2] px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-[#004182]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Añadir a mi Perfil</span>
            </button>
          </div>
        </div>

        {/* Lista de Publicaciones Agregadas */}
        {posts.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {posts.map((post) => (
              <LinkedInPostCard
                key={post.id}
                post={post}
                isEditable={true}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
