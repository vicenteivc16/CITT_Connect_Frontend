'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CittFeedPost,
  CittMemberProfile,
  CittNfcTag,
  CittProject,
  ConnectionRequest,
  ConnectionStatus,
  ProjectApplication,
  ProjectCollaborator,
} from '@/types/citt';
import {
  INITIAL_POSTS,
  INITIAL_PROFILES,
  INITIAL_PROJECTS,
} from '@/data/citt-catalog';
import { CITT_THEMES, CittThemeTokens, ThemeMode } from '@/styles/themes';

interface CittNetworkContextValue {
  profiles: CittMemberProfile[];
  projects: CittProject[];
  posts: CittFeedPost[];
  activeUser: CittMemberProfile;
  isAuthenticated: boolean;
  theme: ThemeMode;
  themeTokens: CittThemeTokens;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  // Bilateral Connections
  connectionRequests: ConnectionRequest[];
  incomingConnectionRequests: ConnectionRequest[];
  incomingConnectionCount: number;
  getConnectionStatus: (targetMemberId: string) => ConnectionStatus;
  sendConnectionRequest: (targetMemberId: string) => { success: boolean; message: string };
  acceptConnectionRequest: (requesterMemberId: string) => void;
  rejectOrCancelConnection: (targetMemberId: string) => void;
  // Backward compatibility for connections
  connectedMemberIds: string[];
  toggleConnection: (memberId: string) => void;
  isConnected: (memberId: string) => boolean;
  // Auth & Profile
  setActiveUserByUsername: (username: string) => void;
  updateActiveUserProfile: (updated: CittMemberProfile) => void;
  registerMember: (profile: CittMemberProfile) => void;
  loginMember: (emailOrUsername: string) => boolean;
  logoutMember: () => void;
  // Projects Engine & Management
  addProject: (project: Omit<CittProject, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updatedData: Partial<CittProject>) => void;
  deleteProject: (id: string) => void;
  applyToProject: (
    projectId: string,
    appData: { answers?: Record<string, string>; note?: string }
  ) => { success: boolean; message: string };
  withdrawApplication: (projectId: string) => { success: boolean; message: string };
  approveApplication: (
    projectId: string,
    applicationId: string,
    roleInProject: string
  ) => { success: boolean; message: string };
  rejectApplication: (
    projectId: string,
    applicationId: string
  ) => { success: boolean; message: string };
  removeCollaborator: (projectId: string, collaboratorUsername: string) => void;
  hasUserApplied: (projectId: string, username?: string) => boolean;
  getUserApplicationStatus: (
    projectId: string,
    username?: string
  ) => 'none' | 'pending' | 'accepted' | 'rejected';
  toggleFeaturedProject: (projectId: string) => void;
  // Feed & Newsroom
  addPost: (post: Omit<CittFeedPost, 'id' | 'createdAt'>) => void;
  updatePost: (id: string, updatedData: Partial<CittFeedPost>) => void;
  deletePost: (id: string) => void;
  // Hardware NFC Tags & Pins
  nfcTags: CittNfcTag[];
  resolveNfcTag: (tagUid: string) => {
    status: 'active' | 'unassigned' | 'suspended' | 'not_found';
    username?: string;
    tag?: CittNfcTag;
  };
  claimNfcTag: (
    tagUid: string,
    targetUsername?: string
  ) => { success: boolean; message: string };
}

const CittNetworkContext = createContext<CittNetworkContextValue | undefined>(
  undefined
);

const STORAGE_KEYS = {
  PROFILES: 'citt_connect_profiles_v4',
  PROJECTS: 'citt_connect_projects_v2',
  POSTS: 'citt_connect_posts_v3',
  ACTIVE_USERNAME: 'citt_connect_active_user_v3',
  THEME: 'citt_connect_theme_v2',
  CONNECTION_REQUESTS: 'citt_connect_connection_requests_v3',
  NFC_TAGS: 'citt_connect_nfc_tags_v2',
};

const INITIAL_NFC_TAGS: CittNfcTag[] = [
  {
    tagUid: 'citt-pin-001',
    status: 'active',
    assignedUsername: 'vicente.vasquez',
    batchLabel: 'Lote 3D Maipú 2026-A',
  },
  {
    tagUid: 'pin-dev-01',
    status: 'active',
    assignedUsername: 'vicente.vasquez',
    batchLabel: 'Lote 3D Maipú 2026-A',
  },
  {
    tagUid: 'citt-pin-002',
    status: 'active',
    assignedUsername: 'valentina.araya',
    batchLabel: 'Lote 3D San Joaquín 2026-A',
  },
  {
    tagUid: 'pin-val-02',
    status: 'active',
    assignedUsername: 'valentina.araya',
    batchLabel: 'Lote 3D San Joaquín 2026-A',
  },
  {
    tagUid: 'citt-pin-003',
    status: 'active',
    assignedUsername: 'diego.retamal',
    batchLabel: 'Lote 3D Maipú 2026-A',
  },
  {
    tagUid: 'citt-pin-004',
    status: 'active',
    assignedUsername: 'camila.navarro',
    batchLabel: 'Lote 3D Viña del Mar 2026-A',
  },
  {
    tagUid: 'citt-pin-005',
    status: 'active',
    assignedUsername: 'matias.morales',
    batchLabel: 'Lote 3D Plaza Vespucio 2026-A',
  },
  {
    tagUid: 'citt-new-001',
    status: 'unassigned',
    batchLabel: 'Lote Virgen Impresión 3D CITT',
  },
  {
    tagUid: 'citt-new-002',
    status: 'unassigned',
    batchLabel: 'Lote Virgen Impresión 3D CITT',
  },
  {
    tagUid: 'citt-unassigned',
    status: 'unassigned',
    batchLabel: 'Lote Virgen Impresión 3D CITT',
  },
];

const INITIAL_CONNECTION_REQUESTS: ConnectionRequest[] = [
  {
    id: 'req-init-1',
    requesterId: 'usr-coordinador',
    receiverId: 'usr-vicente',
    status: 'accepted',
    createdAt: '1 día atrás',
  },
  {
    id: 'req-init-2',
    requesterId: 'usr-consejera-diseno',
    receiverId: 'usr-vicente',
    status: 'accepted',
    createdAt: '2 días atrás',
  },
  {
    id: 'req-init-3',
    requesterId: 'usr-lider-vina',
    receiverId: 'usr-vicente',
    status: 'pending',
    createdAt: 'Hace 35 min',
  },
];

export function CittNetworkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profiles, setProfiles] =
    useState<CittMemberProfile[]>(INITIAL_PROFILES);
  const [projects, setProjects] = useState<CittProject[]>(INITIAL_PROJECTS);
  const [posts, setPosts] = useState<CittFeedPost[]>(INITIAL_POSTS);
  const [activeUsername, setActiveUsername] = useState<string | null>(null);
  const isAuthenticated = Boolean(activeUsername);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [connectionRequests, setConnectionRequests] = useState<
    ConnectionRequest[]
  >(INITIAL_CONNECTION_REQUESTS);
  const [nfcTags, setNfcTags] = useState<CittNfcTag[]>(INITIAL_NFC_TAGS);

  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      const savedActive = localStorage.getItem(STORAGE_KEYS.ACTIVE_USERNAME);
      const savedTheme = localStorage.getItem(
        STORAGE_KEYS.THEME
      ) as ThemeMode | null;
      const savedRequests = localStorage.getItem(
        STORAGE_KEYS.CONNECTION_REQUESTS
      );
      const savedNfc = localStorage.getItem(STORAGE_KEYS.NFC_TAGS);

      if (savedProfiles) setProfiles(JSON.parse(savedProfiles));
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedPosts) setPosts(JSON.parse(savedPosts));
      if (savedActive) setActiveUsername(savedActive);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      } else {
        setTheme('light');
      }
      if (savedRequests) {
        setConnectionRequests(JSON.parse(savedRequests));
      }
      if (savedNfc) {
        setNfcTags(JSON.parse(savedNfc));
      }
    } catch {
      // Fallback to initial seed data if localStorage is unavailable
    }
  }, []);

  const themeTokens = CITT_THEMES[theme];

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const body = document.body;

      root.setAttribute('data-theme', theme);
      body.setAttribute('data-theme', theme);

      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        body.classList.add('dark');
        body.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        body.classList.add('light');
        body.classList.remove('dark');
      }

      root.style.backgroundColor = themeTokens.bgCanvas;
      root.style.color = themeTokens.textPrimary;
      body.style.backgroundColor = themeTokens.bgCanvas;
      body.style.color = themeTokens.textPrimary;
    }
  }, [theme, themeTokens]);

  const setThemeMode = (mode: ThemeMode) => {
    setTheme(mode);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, mode);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEYS.THEME, next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  const activeUser =
    profiles.find((p) => p.username === activeUsername) || profiles[0];

  // Helper to persist requests
  const persistConnectionRequests = (updated: ConnectionRequest[]) => {
    setConnectionRequests(updated);
    try {
      localStorage.setItem(
        STORAGE_KEYS.CONNECTION_REQUESTS,
        JSON.stringify(updated)
      );
    } catch {
      // ignore
    }
  };

  // Bilateral connection logic
  const getConnectionStatus = (targetMemberId: string): ConnectionStatus => {
    if (!isAuthenticated || !activeUser) return 'none';
    if (targetMemberId === activeUser.id) return 'none';

    const match = connectionRequests.find(
      (r) =>
        (r.requesterId === activeUser.id && r.receiverId === targetMemberId) ||
        (r.requesterId === targetMemberId && r.receiverId === activeUser.id)
    );

    if (!match) return 'none';
    if (match.status === 'accepted') return 'connected';
    if (match.requesterId === activeUser.id) return 'pending_sent';
    if (match.receiverId === activeUser.id) return 'pending_received';
    return 'none';
  };

  const sendConnectionRequest = (
    targetMemberId: string
  ): { success: boolean; message: string } => {
    if (!isAuthenticated) {
      return {
        success: false,
        message: 'Debes iniciar sesión para conectar con este miembro de la red.',
      };
    }
    if (targetMemberId === activeUser.id) {
      return { success: false, message: 'No puedes enviarte una solicitud a ti mismo.' };
    }

    const currentStatus = getConnectionStatus(targetMemberId);
    if (currentStatus === 'connected') {
      return { success: false, message: 'Ya estás conectado con este miembro.' };
    }
    if (currentStatus === 'pending_sent') {
      return { success: false, message: 'Ya has enviado una solicitud a este miembro.' };
    }
    if (currentStatus === 'pending_received') {
      acceptConnectionRequest(targetMemberId);
      return { success: true, message: '¡Has aceptado el vínculo de conexión!' };
    }

    const newRequest: ConnectionRequest = {
      id: `req-${Date.now()}`,
      requesterId: activeUser.id,
      receiverId: targetMemberId,
      status: 'pending',
      createdAt: 'Ahora mismo',
    };

    const next = [...connectionRequests, newRequest];
    persistConnectionRequests(next);
    return { success: true, message: 'Solicitud de conexión enviada con éxito.' };
  };

  const acceptConnectionRequest = (requesterMemberId: string) => {
    if (!isAuthenticated) return;
    const next = connectionRequests.map((r) => {
      if (
        r.requesterId === requesterMemberId &&
        r.receiverId === activeUser.id &&
        r.status === 'pending'
      ) {
        return { ...r, status: 'accepted' as const };
      }
      return r;
    });
    persistConnectionRequests(next);
  };

  const rejectOrCancelConnection = (targetMemberId: string) => {
    if (!isAuthenticated) return;
    const next = connectionRequests.filter(
      (r) =>
        !(
          (r.requesterId === activeUser.id && r.receiverId === targetMemberId) ||
          (r.requesterId === targetMemberId && r.receiverId === activeUser.id)
        )
    );
    persistConnectionRequests(next);
  };

  const incomingConnectionRequests = isAuthenticated
    ? connectionRequests.filter(
        (r) => r.receiverId === activeUser.id && r.status === 'pending'
      )
    : [];

  const incomingConnectionCount = incomingConnectionRequests.length;

  const connectedMemberIds = isAuthenticated
    ? connectionRequests
        .filter((r) => r.status === 'accepted')
        .map((r) =>
          r.requesterId === activeUser.id ? r.receiverId : r.requesterId
        )
    : [];

  const isConnected = (memberId: string): boolean =>
    connectedMemberIds.includes(memberId);

  const toggleConnection = (memberId: string) => {
    if (!isAuthenticated) return;
    const status = getConnectionStatus(memberId);
    if (status === 'connected' || status === 'pending_sent') {
      rejectOrCancelConnection(memberId);
    } else if (status === 'pending_received') {
      acceptConnectionRequest(memberId);
    } else {
      sendConnectionRequest(memberId);
    }
  };

  const setActiveUserByUsername = (username: string) => {
    setActiveUsername(username);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USERNAME, username);
    } catch {
      // ignore storage errors
    }
  };

  const updateActiveUserProfile = (updated: CittMemberProfile) => {
    const oldUsername = activeUser.username;
    setProfiles((prev) => {
      const exists = prev.some((p) => p.id === updated.id);
      const next = exists
        ? prev.map((p) => (p.id === updated.id ? updated : p))
        : [updated, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    setActiveUsername(updated.username);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USERNAME, updated.username);
    } catch {
      // ignore
    }

    // Cascade update if username or fullName changed
    if (oldUsername !== updated.username || activeUser.fullName !== updated.fullName) {
      setProjects((prev) => {
        const next = prev.map((proj) => {
          if (proj.leadUsername === oldUsername) {
            return {
              ...proj,
              leadUsername: updated.username,
              leadName: updated.fullName,
              leadRole: updated.role,
              originCampusSlug: updated.campusSlug,
              schoolSlug: updated.schoolSlug,
            };
          }
          // Also update in collaborators if present
          if (proj.collaborators?.some((c) => c.username === oldUsername)) {
            return {
              ...proj,
              collaborators: proj.collaborators.map((c) =>
                c.username === oldUsername
                  ? {
                      ...c,
                      username: updated.username,
                      fullName: updated.fullName,
                      role: updated.role,
                      avatarUrl: updated.avatarUrl,
                      campusSlug: updated.campusSlug,
                      schoolSlug: updated.schoolSlug,
                    }
                  : c
              ),
            };
          }
          return proj;
        });
        try {
          localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      setPosts((prev) => {
        const next = prev.map((post) => {
          if (post.authorUsername === oldUsername) {
            return {
              ...post,
              authorUsername: updated.username,
              authorName: updated.fullName,
              authorRole: updated.role,
              authorOccupation: updated.currentOccupation,
              campusSlug: updated.campusSlug,
            };
          }
          return post;
        });
        try {
          localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    }
  };

  const registerMember = (newProfile: CittMemberProfile) => {
    setProfiles((prev) => {
      const exists = prev.some(
        (p) => p.username === newProfile.username || p.id === newProfile.id
      );
      const next = exists
        ? prev.map((p) =>
            p.username === newProfile.username ? newProfile : p
          )
        : [newProfile, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    setActiveUsername(newProfile.username);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USERNAME, newProfile.username);
    } catch {
      // ignore
    }
  };

  const loginMember = (emailOrUsername: string): boolean => {
    const clean = emailOrUsername.trim().toLowerCase();
    const found = profiles.find(
      (p) =>
        p.username.toLowerCase() === clean ||
        p.email.toLowerCase() === clean
    );
    if (found) {
      setActiveUsername(found.username);
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_USERNAME, found.username);
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const logoutMember = () => {
    setActiveUsername(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USERNAME);
    } catch {
      // ignore
    }
  };

  const addProject = (projectData: Omit<CittProject, 'id' | 'createdAt'>) => {
    const newProject: CittProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: 'Recién publicado',
      applications: [],
      collaborators: projectData.collaborators || [],
    };
    setProjects((prev) => {
      const next = [newProject, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const updateProject = (id: string, updatedData: Partial<CittProject>) => {
    setProjects((prev) => {
      const next = prev.map((p) => {
        if (p.id === id || p.slug === id) {
          return { ...p, ...updatedData };
        }
        return p;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id && p.slug !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const applyToProject = (
    projectId: string,
    appData: { answers?: Record<string, string>; note?: string }
  ): { success: boolean; message: string } => {
    if (!isAuthenticated) {
      return {
        success: false,
        message: 'Debes iniciar sesión con tu cuenta institucional para postular.',
      };
    }

    const targetProject = projects.find(
      (p) => p.id === projectId || p.slug === projectId
    );
    if (!targetProject) {
      return { success: false, message: 'Proyecto no encontrado.' };
    }

    if (targetProject.leadUsername === activeUser.username) {
      return {
        success: false,
        message: 'No puedes postular a un proyecto del cual ya eres el líder creador.',
      };
    }

    const alreadyApplied = targetProject.applications?.some(
      (a) => a.applicantUsername === activeUser.username
    );

    if (alreadyApplied) {
      return {
        success: false,
        message: 'Ya has postulado previamente a esta iniciativa.',
      };
    }

    const newApplication: ProjectApplication = {
      id: `app-${Date.now()}`,
      projectId: targetProject.id,
      applicantUsername: activeUser.username,
      applicantName: activeUser.fullName,
      applicantEmail: activeUser.email,
      applicantRole: activeUser.role,
      applicantCampusSlug: activeUser.campusSlug,
      applicantSchoolSlug: activeUser.schoolSlug,
      appliedAt: 'Recién postulado',
      status: 'pending',
      answers: appData.answers,
      note: appData.note,
    };

    setProjects((prev) => {
      const next = prev.map((p) => {
        if (p.id === targetProject.id) {
          return {
            ...p,
            applications: [...(p.applications || []), newApplication],
          };
        }
        return p;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    return {
      success: true,
      message:
        '¡Tu postulación ha sido enviada con éxito al líder del equipo!',
    };
  };

  const withdrawApplication = (
    projectId: string
  ): { success: boolean; message: string } => {
    if (!isAuthenticated) {
      return { success: false, message: 'No estás autenticado.' };
    }

    setProjects((prev) => {
      const next = prev.map((p) => {
        if (p.id === projectId || p.slug === projectId) {
          return {
            ...p,
            applications: (p.applications || []).filter(
              (a) => a.applicantUsername !== activeUser.username
            ),
          };
        }
        return p;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    return { success: true, message: 'Postulación retirada con éxito.' };
  };

  const approveApplication = (
    projectId: string,
    applicationId: string,
    roleInProject: string
  ): { success: boolean; message: string } => {
    let applicantData: ProjectApplication | undefined;

    setProjects((prev) => {
      const next = prev.map((proj) => {
        if (proj.id === projectId || proj.slug === projectId) {
          const updatedApps = (proj.applications || []).map((app) => {
            if (app.id === applicationId) {
              applicantData = app;
              return { ...app, status: 'accepted' as const };
            }
            return app;
          });

          if (!applicantData) return proj;

          // Check if collaborator already exists
          const existingCollab = (proj.collaborators || []).some(
            (c) => c.username === applicantData!.applicantUsername
          );

          let updatedCollabs = proj.collaborators || [];
          if (!existingCollab) {
            const applicantProfile = profiles.find(
              (p) => p.username === applicantData!.applicantUsername
            );

            const newCollab: ProjectCollaborator = {
              id: `collab-${Date.now()}`,
              username: applicantData.applicantUsername,
              fullName: applicantData.applicantName,
              role: applicantData.applicantRole,
              roleInProject: roleInProject.trim() || 'Colaborador de Proyecto',
              campusSlug: applicantData.applicantCampusSlug,
              schoolSlug: applicantData.applicantSchoolSlug,
              avatarUrl: applicantProfile?.avatarUrl,
            };
            updatedCollabs = [...updatedCollabs, newCollab];
          }

          return {
            ...proj,
            applications: updatedApps,
            collaborators: updatedCollabs,
          };
        }
        return proj;
      });

      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    return {
      success: true,
      message: '¡Postulante aprobado y sumado oficialmente al equipo de proyecto!',
    };
  };

  const rejectApplication = (
    projectId: string,
    applicationId: string
  ): { success: boolean; message: string } => {
    setProjects((prev) => {
      const next = prev.map((proj) => {
        if (proj.id === projectId || proj.slug === projectId) {
          return {
            ...proj,
            applications: (proj.applications || []).map((app) =>
              app.id === applicationId
                ? { ...app, status: 'rejected' as const }
                : app
            ),
          };
        }
        return proj;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    return { success: true, message: 'Postulación desestimada.' };
  };

  const removeCollaborator = (
    projectId: string,
    collaboratorUsername: string
  ) => {
    setProjects((prev) => {
      const next = prev.map((proj) => {
        if (proj.id === projectId || proj.slug === projectId) {
          return {
            ...proj,
            collaborators: (proj.collaborators || []).filter(
              (c) => c.username !== collaboratorUsername
            ),
          };
        }
        return proj;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const hasUserApplied = (projectId: string, username?: string): boolean => {
    const checkUsername = username || (isAuthenticated ? activeUser.username : '');
    if (!checkUsername) return false;
    const targetProject = projects.find(
      (p) => p.id === projectId || p.slug === projectId
    );
    if (!targetProject || !targetProject.applications) return false;
    return targetProject.applications.some(
      (a) => a.applicantUsername === checkUsername
    );
  };

  const getUserApplicationStatus = (
    projectId: string,
    username?: string
  ): 'none' | 'pending' | 'accepted' | 'rejected' => {
    const checkUsername = username || (isAuthenticated ? activeUser.username : '');
    if (!checkUsername) return 'none';
    const targetProject = projects.find(
      (p) => p.id === projectId || p.slug === projectId
    );
    if (!targetProject || !targetProject.applications) return 'none';
    const found = targetProject.applications.find(
      (a) => a.applicantUsername === checkUsername
    );
    return found ? found.status : 'none';
  };

  const toggleFeaturedProject = (projectId: string) => {
    setProjects((prev) => {
      const next = prev.map((p) => {
        if (p.id === projectId || p.slug === projectId) {
          return { ...p, isFeatured: !p.isFeatured };
        }
        return p;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const addPost = (postData: Omit<CittFeedPost, 'id' | 'createdAt'>) => {
    const newPost: CittFeedPost = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: 'Ahora mismo',
    };
    setPosts((prev) => {
      const next = [newPost, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const updatePost = (id: string, updatedData: Partial<CittFeedPost>) => {
    setPosts((prev) => {
      const next = prev.map((post) => {
        if (post.id === id) {
          return { ...post, ...updatedData };
        }
        return post;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const deletePost = (id: string) => {
    setPosts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const resolveNfcTag = (
    tagUid: string
  ): {
    status: 'active' | 'unassigned' | 'suspended' | 'not_found';
    username?: string;
    tag?: CittNfcTag;
  } => {
    const cleanUid = (tagUid || '').trim().toLowerCase();
    if (!cleanUid) return { status: 'not_found' };

    // 1. Direct match in registered nfc tags
    const foundTag = nfcTags.find((t) => t.tagUid.toLowerCase() === cleanUid);
    if (foundTag) {
      if (foundTag.status === 'active' && foundTag.assignedUsername) {
        return {
          status: 'active',
          username: foundTag.assignedUsername,
          tag: foundTag,
        };
      }
      return { status: foundTag.status, tag: foundTag };
    }

    // 2. Direct match with username (for direct NFC tags printed with username)
    const matchedProfile = profiles.find(
      (p) => p.username.toLowerCase() === cleanUid
    );
    if (matchedProfile) {
      return {
        status: 'active',
        username: matchedProfile.username,
        tag: {
          tagUid: cleanUid,
          status: 'active',
          assignedUsername: matchedProfile.username,
          batchLabel: 'Tag NFC Directo Duoc UC',
        },
      };
    }

    // 3. Unassigned tag (can be claimed by any authenticated user)
    return {
      status: 'unassigned',
      tag: {
        tagUid: cleanUid,
        status: 'unassigned',
        batchLabel: 'Nuevo Pin NFC Físico 3D Duoc UC',
      },
    };
  };

  const claimNfcTag = (
    tagUid: string,
    targetUsername?: string
  ): { success: boolean; message: string } => {
    const cleanUid = (tagUid || '').trim().toLowerCase();
    const claimer =
      targetUsername || (activeUsername ? activeUser.username : null);

    if (!claimer) {
      return {
        success: false,
        message:
          'Debes identificarte con tu cuenta institucional para vincular este pin NFC.',
      };
    }

    const updatedTags = [...nfcTags];
    const existingIndex = updatedTags.findIndex(
      (t) => t.tagUid.toLowerCase() === cleanUid
    );

    const nowIso = new Date().toISOString();
    if (existingIndex >= 0) {
      updatedTags[existingIndex] = {
        ...updatedTags[existingIndex],
        status: 'active',
        assignedUsername: claimer,
        lastScannedAt: nowIso,
      };
    } else {
      updatedTags.push({
        tagUid: cleanUid,
        status: 'active',
        assignedUsername: claimer,
        batchLabel: 'Vinculación Autoservicio CITT Connect',
        lastScannedAt: nowIso,
      });
    }

    setNfcTags(updatedTags);
    try {
      localStorage.setItem(STORAGE_KEYS.NFC_TAGS, JSON.stringify(updatedTags));
    } catch {
      // ignore
    }

    return {
      success: true,
      message: `¡Pin NFC [${cleanUid}] vinculado exitosamente a tu perfil institucional @${claimer}!`,
    };
  };

  return (
    <CittNetworkContext.Provider
      value={{
        profiles,
        projects,
        posts,
        activeUser,
        isAuthenticated,
        theme,
        themeTokens,
        setThemeMode,
        toggleTheme,
        connectionRequests,
        incomingConnectionRequests,
        incomingConnectionCount,
        getConnectionStatus,
        sendConnectionRequest,
        acceptConnectionRequest,
        rejectOrCancelConnection,
        connectedMemberIds,
        toggleConnection,
        isConnected,
        setActiveUserByUsername,
        updateActiveUserProfile,
        registerMember,
        loginMember,
        logoutMember,
        addProject,
        updateProject,
        deleteProject,
        applyToProject,
        withdrawApplication,
        approveApplication,
        rejectApplication,
        removeCollaborator,
        hasUserApplied,
        getUserApplicationStatus,
        toggleFeaturedProject,
        addPost,
        updatePost,
        deletePost,
        nfcTags,
        resolveNfcTag,
        claimNfcTag,
      }}
    >
      <div
        data-theme={theme}
        style={{
          backgroundColor: themeTokens.bgCanvas,
          color: themeTokens.textPrimary,
        }}
        className={`${
          theme === 'dark' ? 'dark' : 'light'
        } min-h-screen bg-theme-canvas text-theme-primary transition-colors duration-200`}
      >
        {children}
      </div>
    </CittNetworkContext.Provider>
  );
}

export function useCittNetwork() {
  const ctx = useContext(CittNetworkContext);
  if (!ctx) {
    throw new Error(
      'useCittNetwork must be used inside a CittNetworkProvider'
    );
  }
  return ctx;
}
