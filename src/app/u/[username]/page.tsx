'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useCittNetwork } from '@/context/CittNetworkContext';

// Subcomponentes Modulares de Perfil
import { ProfileHeroHeader } from '@/components/perfil/ProfileHeroHeader';
import { ProfileSidebar } from '@/components/perfil/ProfileSidebar';
import { ProfileMainContent } from '@/components/perfil/ProfileMainContent';

export default function PublicMemberProfilePage() {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const {
    profiles,
    projects,
    posts,
    activeUser,
    isAuthenticated,
    isConnected,
    toggleConnection,
    getConnectionStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectOrCancelConnection,
  } = useCittNetwork();

  const [copied, setCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [originUrl, setOriginUrl] = useState('https://cittconnect.cl');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      setOriginUrl(window.location.origin);
    }
  }, []);

  const member = profiles.find((p) => p.username === params.username);

  if (!member) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-theme bg-theme-surface p-8 text-center shadow-theme-card">
        <h1 className="text-xl font-bold text-theme-primary">
          Perfil no encontrado en CITT Connect
        </h1>
        <p className="mt-2 max-w-[55ch] text-xs text-theme-secondary">
          El enlace público{' '}
          <code className="font-mono font-bold text-theme-primary">
            /u/{params.username}
          </code>{' '}
          no corresponde a un perfil activo o fue modificado.
        </p>
        <Link
          href="/directorio"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-4 py-2.5 text-xs font-bold text-[#1A1A1A]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Directorio CITT Connect</span>
        </Link>
      </div>
    );
  }

  const isSelf = isAuthenticated && member.id === activeUser.id;
  const connStatus = getConnectionStatus(member.id);
  const publicProfileUrl = `${originUrl}/u/${member.username}`;

  const memberProjects = projects.filter(
    (proj) =>
      proj.leadUsername === member.username ||
      proj.collaborators?.some((c) => c.username === member.username)
  );
  const relatedSchoolProjects = projects.filter(
    (proj) =>
      proj.leadUsername !== member.username &&
      !proj.collaborators?.some((c) => c.username === member.username) &&
      (proj.schoolSlug === member.schoolSlug ||
        proj.originCampusSlug === member.campusSlug)
  );
  const displayedProjects =
    memberProjects.length > 0
      ? memberProjects
      : relatedSchoolProjects.length > 0
      ? relatedSchoolProjects.slice(0, 2)
      : projects.slice(0, 2);

  const memberPosts = posts.filter(
    (post) => post.authorUsername === member.username
  );

  const sameCampusOrSchoolPeers = profiles.filter(
    (p) =>
      p.id !== member.id &&
      (p.campusSlug === member.campusSlug ||
        p.schoolSlug === member.schoolSlug)
  );
  const otherNetworkPeers = profiles.filter(
    (p) =>
      p.id !== member.id &&
      !sameCampusOrSchoolPeers.some((sp) => sp.id === p.id)
  );
  const peers = [...sameCampusOrSchoolPeers, ...otherNetworkPeers].slice(0, 4);

  const handleCopyUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(publicProfileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnectAction = () => {
    if (!isAuthenticated) {
      router.push(`/acceso?redirect=/u/${member.username}`);
      return;
    }
    const status = getConnectionStatus(member.id);
    if (status === 'none') {
      sendConnectionRequest(member.id);
    } else if (status === 'pending_sent') {
      rejectOrCancelConnection(member.id);
    } else if (status === 'connected') {
      if (
        confirm(
          `¿Deseas desvincular tu conexión con ${member.fullName}?`
        )
      ) {
        rejectOrCancelConnection(member.id);
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. CABECERA SOCIAL & ACADÉMICA PANORÁMICA */}
      <ProfileHeroHeader
        member={member}
        isSelf={isSelf}
        isAuthenticated={isAuthenticated}
        connStatus={connStatus}
        copied={copied}
        qrModalOpen={qrModalOpen}
        onSetQrModalOpen={setQrModalOpen}
        onCopyUrl={handleCopyUrl}
        onConnectAction={handleConnectAction}
        onAcceptConnection={() => acceptConnectionRequest(member.id)}
        onRejectConnection={() => rejectOrCancelConnection(member.id)}
      />

      {/* 2. RETÍCULA ASIMÉTRICA DE 2 COLUMNAS */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* COLUMNA IZQUIERDA (4 Cols): Canales, Especialidades, QR */}
        <ProfileSidebar
          member={member}
          publicProfileUrl={publicProfileUrl}
          copied={copied}
          onCopyUrl={handleCopyUrl}
          onOpenQrModal={() => setQrModalOpen(true)}
        />

        {/* COLUMNA DERECHA PRINCIPAL (8 Cols): Biografía, Proyectos, Muro, Pares */}
        <ProfileMainContent
          member={member}
          displayedProjects={displayedProjects}
          hasOwnProjects={memberProjects.length > 0}
          memberPosts={memberPosts}
          peers={peers}
          isConnected={isConnected}
          onToggleConnection={(peerId) => {
            if (!isAuthenticated) {
              router.push(`/acceso?redirect=/u/${member.username}`);
              return;
            }
            toggleConnection(peerId);
          }}
        />
      </div>
    </div>
  );
}
