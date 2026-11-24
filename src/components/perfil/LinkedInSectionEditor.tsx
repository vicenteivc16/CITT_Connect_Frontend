'use client';

import React, { useState } from 'react';
import {
  Linkedin,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Link as LinkIcon,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { CittMemberProfile, LinkedInFeaturedPost } from '@/types/citt';
import { LinkedInPostCard } from './LinkedInPostCard';

interface LinkedInSectionEditorProps {
  profile: CittMemberProfile;
  onChange: (updated: Partial<CittMemberProfile>) => void;
  onSaveInstant?: (updated: Partial<CittMemberProfile>) => void;
}

export function LinkedInSectionEditor({
  profile,
  onChange,
  onSaveInstant,
}: LinkedInSectionEditorProps) {
  // New Post Form State
  const [newPostUrl, setNewPostUrl] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostSummary, setNewPostSummary] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [justSavedNotice, setJustSavedNotice] = useState<string | null>(null);

  const posts = profile.linkedinPosts || [];

  const showInstantNotification = (msg: string) => {
    setJustSavedNotice(msg);
    setTimeout(() => setJustSavedNotice(null), 3500);
  };

  const extractLinkedInHandle = (url?: string): string => {
    if (!url) return profile.username;
    const clean = url.trim().replace(/\/+$/, '');
    const parts = clean.split('/');
    const last = parts[parts.length - 1];
    return last ? last.replace(/^in-/, '') : profile.username;
  };

  const handleConnectLinkedIn = () => {
    setIsConnecting(true);

    // Si no tiene URL de linkedin configurada, generar una URL estándar basada en su username
    const currentUrl = profile.linkedinUrl?.trim();
    const finalUrl =
      currentUrl && currentUrl.includes('linkedin.com')
        ? currentUrl.startsWith('http')
          ? currentUrl
          : `https://${currentUrl}`
        : `https://www.linkedin.com/in/${profile.username}`;

    const handle = extractLinkedInHandle(finalUrl);
    const headline =
      profile.linkedinHeadline?.trim() ||
      `${profile.careerTitle || 'Innovador'} | Duoc UC | CITT`;
    const avatar =
      profile.linkedinAvatarUrl ||
      profile.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

    const patch: Partial<CittMemberProfile> = {
      linkedinUrl: finalUrl,
      linkedinId: `urn:li:person:${handle}`,
      linkedinHeadline: headline,
      linkedinVerified: true,
      linkedinAvatarUrl: avatar,
    };

    setTimeout(() => {
      onChange(patch);
      onSaveInstant?.(patch);
      setIsConnecting(false);
      showInstantNotification('¡Perfil de LinkedIn vinculado y guardado exitosamente!');
    }, 400);
  };

  const handleDisconnectLinkedIn = () => {
    const patch: Partial<CittMemberProfile> = {
      linkedinVerified: false,
      linkedinId: undefined,
    };
    onChange(patch);
    onSaveInstant?.(patch);
    showInstantNotification('Vinculación de LinkedIn desactivada y guardada.');
  };

  const handleToggleSyncAvatar = () => {
    const nextSync = !profile.linkedinSyncAvatar;
    const targetAvatar = nextSync
      ? profile.linkedinAvatarUrl || profile.avatarUrl
      : profile.avatarUrl;

    const patch: Partial<CittMemberProfile> = {
      linkedinSyncAvatar: nextSync,
      avatarUrl: targetAvatar,
    };
    onChange(patch);
    onSaveInstant?.(patch);
    showInstantNotification(
      nextSync
        ? 'Fotografía de LinkedIn sincronizada con tu credencial.'
        : 'Sincronización de fotografía desactivada.'
    );
  };

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
      url: newPostUrl.trim().startsWith('http')
        ? newPostUrl.trim()
        : `https://${newPostUrl.trim()}`,
      title: newPostTitle.trim() || 'Logro o publicación profesional en LinkedIn',
      summary: newPostSummary.trim() || undefined,
      publishedAt: new Date().toLocaleDateString('es-CL', {
        month: 'short',
        year: 'numeric',
      }),
      authorName: profile.fullName,
    };

    const updated = [...posts, newPost];
    onChange({ linkedinPosts: updated });
    onSaveInstant?.({ linkedinPosts: updated });

    setNewPostUrl('');
    setNewPostTitle('');
    setNewPostSummary('');
    setFormError(null);
    showInstantNotification('Publicación agregada y guardada en tu perfil.');
  };

  const handleDeletePost = (id: string) => {
    const updated = posts.filter((p) => p.id !== id);
    onChange({ linkedinPosts: updated });
    onSaveInstant?.({ linkedinPosts: updated });
    showInstantNotification('Publicación eliminada correctamente.');
  };

  return (
    <div className="space-y-6 rounded-3xl border border-theme bg-theme-surface p-6 shadow-theme-card">
      {/* Feedback Toast de Guardado Instantáneo */}
      {justSavedNotice && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 p-3.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{justSavedNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0A66C2] text-white shadow-md">
            <Linkedin className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-theme-primary flex items-center gap-2">
              Integración con LinkedIn
              {profile.linkedinVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                  <ShieldCheck className="h-3 w-3" />
                  Conectado y Verificado
                </span>
              )}
            </h3>
            <p className="text-xs text-theme-secondary">
              Vincula tu perfil profesional de LinkedIn para exhibir tus publicaciones, validar tu identidad y sincronizar tu foto.
            </p>
          </div>
        </div>

        {/* Action Button */}
        {!profile.linkedinVerified ? (
          <button
            type="button"
            onClick={handleConnectLinkedIn}
            disabled={isConnecting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#004182] active:scale-95 disabled:opacity-50"
          >
            <Linkedin className="h-4 w-4" />
            <span>{isConnecting ? 'Guardando...' : 'Vincular y Verificar LinkedIn'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {profile.linkedinUrl && (
              <a
                href={
                  profile.linkedinUrl.startsWith('http')
                    ? profile.linkedinUrl
                    : `https://${profile.linkedinUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-theme-elevated px-3 py-1.5 text-xs font-bold text-[#0A66C2] hover:border-[#0A66C2]"
              >
                <span>Ver en LinkedIn</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={handleDisconnectLinkedIn}
              className="rounded-xl px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors"
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
              onChange={(e) => {
                const val = e.target.value;
                onChange({ linkedinUrl: val });
              }}
              onBlur={() => {
                if (profile.linkedinUrl) {
                  onSaveInstant?.({ linkedinUrl: profile.linkedinUrl });
                }
              }}
              placeholder="https://www.linkedin.com/in/tu-nombre"
              className="w-full rounded-xl border border-theme bg-theme-elevated py-2.5 pl-10 pr-3 text-xs text-theme-primary placeholder-zinc-500 focus:border-[#0A66C2] focus:outline-none"
            />
          </div>
          <p className="mt-1 text-[11px] text-theme-secondary">
            Pega tu URL pública para que otros miembros y empresas puedan contactarte.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-theme-primary mb-1">
            Titular Profesional en LinkedIn
          </label>
          <input
            type="text"
            value={profile.linkedinHeadline || ''}
            onChange={(e) => onChange({ linkedinHeadline: e.target.value })}
            onBlur={() => {
              if (profile.linkedinHeadline) {
                onSaveInstant?.({ linkedinHeadline: profile.linkedinHeadline });
              }
            }}
            placeholder="Ej: Estudiante Informática | Innovador CITT Duoc UC"
            className="w-full rounded-xl border border-theme bg-theme-elevated py-2.5 px-3 text-xs text-theme-primary placeholder-zinc-500 focus:border-[#0A66C2] focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-theme-secondary">
            Se muestra debajo de tu nombre en tu perfil público de CITT Connect.
          </p>
        </div>
      </div>

      {/* Sincronización de Avatar */}
      {profile.linkedinAvatarUrl && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--citt-border)] bg-theme-subtle p-3.5">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.linkedinAvatarUrl}
              alt="Avatar de LinkedIn"
              className="h-10 w-10 rounded-full object-cover border-2 border-[#0A66C2]"
            />
            <div>
              <p className="text-xs font-bold text-theme-primary">Foto de Perfil de LinkedIn</p>
              <p className="text-[11px] text-theme-secondary">
                ¿Deseas usar automáticamente esta fotografía en tu credencial CITT Connect?
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleSyncAvatar}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              profile.linkedinSyncAvatar
                ? 'bg-emerald-500 text-white'
                : 'bg-theme-elevated border border-theme text-theme-primary hover:border-[#0A66C2]'
            }`}
          >
            {profile.linkedinSyncAvatar ? '✓ Foto Sincronizada' : 'Usar esta foto'}
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
