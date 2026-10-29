'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CittFeedPost,
  CittMemberProfile,
  CittProject,
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
  theme: ThemeMode;
  themeTokens: CittThemeTokens;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  connectedMemberIds: string[];
  toggleConnection: (memberId: string) => void;
  isConnected: (memberId: string) => boolean;
  setActiveUserByUsername: (username: string) => void;
  updateActiveUserProfile: (updated: CittMemberProfile) => void;
  registerMember: (profile: CittMemberProfile) => void;
  loginMember: (emailOrUsername: string) => boolean;
  logoutMember: () => void;
  addProject: (project: Omit<CittProject, 'id' | 'createdAt'>) => void;
  addPost: (post: Omit<CittFeedPost, 'id' | 'createdAt'>) => void;
}

const CittNetworkContext = createContext<CittNetworkContextValue | undefined>(
  undefined
);

const STORAGE_KEYS = {
  PROFILES: 'citt_connect_profiles_v4',
  PROJECTS: 'citt_connect_projects_v2',
  POSTS: 'citt_connect_posts_v2',
  ACTIVE_USERNAME: 'citt_connect_active_user_v2',
  THEME: 'citt_connect_theme_v2',
  CONNECTIONS: 'citt_connect_connections_v2',
};

export function CittNetworkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profiles, setProfiles] =
    useState<CittMemberProfile[]>(INITIAL_PROFILES);
  const [projects, setProjects] = useState<CittProject[]>(INITIAL_PROJECTS);
  const [posts, setPosts] = useState<CittFeedPost[]>(INITIAL_POSTS);
  const [activeUsername, setActiveUsername] =
    useState<string>('vicente-vasquez');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [connectedMemberIds, setConnectedMemberIds] = useState<string[]>([
    'usr-coordinador',
    'usr-consejera-diseno',
  ]);

  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      const savedActive = localStorage.getItem(STORAGE_KEYS.ACTIVE_USERNAME);
      const savedTheme = localStorage.getItem(
        STORAGE_KEYS.THEME
      ) as ThemeMode | null;
      const savedConnections = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);

      if (savedProfiles) setProfiles(JSON.parse(savedProfiles));
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedPosts) setPosts(JSON.parse(savedPosts));
      if (savedActive) setActiveUsername(savedActive);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      } else {
        setTheme('light');
      }
      if (savedConnections) {
        setConnectedMemberIds(JSON.parse(savedConnections));
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

  const toggleConnection = (memberId: string) => {
    setConnectedMemberIds((prev) => {
      const exists = prev.includes(memberId);
      const next = exists
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId];
      try {
        localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isConnected = (memberId: string) =>
    connectedMemberIds.includes(memberId);

  const activeUser =
    profiles.find((p) => p.username === activeUsername) || profiles[0];

  const setActiveUserByUsername = (username: string) => {
    setActiveUsername(username);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USERNAME, username);
    } catch {
      // ignore storage errors
    }
  };

  const updateActiveUserProfile = (updated: CittMemberProfile) => {
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
  };

  const registerMember = (newProfile: CittMemberProfile) => {
    setProfiles((prev) => {
      const exists = prev.some((p) => p.username === newProfile.username || p.id === newProfile.id);
      const next = exists
        ? prev.map((p) => (p.username === newProfile.username ? newProfile : p))
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
    const defaultUser = profiles[0]?.username || 'vicente-vasquez';
    setActiveUsername(defaultUser);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USERNAME, defaultUser);
    } catch {
      // ignore
    }
  };

  const addProject = (projectData: Omit<CittProject, 'id' | 'createdAt'>) => {
    const newProject: CittProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: 'Recién publicado',
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

  return (
    <CittNetworkContext.Provider
      value={{
        profiles,
        projects,
        posts,
        activeUser,
        theme,
        themeTokens,
        setThemeMode,
        toggleTheme,
        connectedMemberIds,
        toggleConnection,
        isConnected,
        setActiveUserByUsername,
        updateActiveUserProfile,
        registerMember,
        loginMember,
        logoutMember,
        addProject,
        addPost,
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
