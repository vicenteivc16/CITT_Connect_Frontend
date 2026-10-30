import {
  CittBannerPreset,
  CittBlogArticle,
  CittCampus,
  CittFeedPost,
  CittMemberProfile,
  CittPinterestPin,
  CittProject,
  CittRole,
  DuocSchool,
  DuocSchoolSlug,
} from '@/types/citt';

export const CITT_BANNER_PRESETS: CittBannerPreset[] = [
  {
    id: 'banner-lobby-citt',
    label: 'Lobby Arquitectónico CITT (Madera, Vidrio & Plantas)',
    category: 'Institucional Duoc UC',
    imageUrl: '/assets/citt-hero-lobby.webp',
  },
  {
    id: 'banner-robotics-iot',
    label: 'Laboratorio de Robótica Autónoma, Electrónica & IoT',
    category: 'Ingeniería & Hardware',
    imageUrl: '/assets/banner-iot.webp',
  },
  {
    id: 'banner-summit-partner',
    label: 'Comunidad Nacional CITT & Encuentro Inter-Sedes',
    category: 'Comunidad & Partners',
    imageUrl: '/assets/banner-comunidad.webp',
  },
  {
    id: 'banner-software-ai',
    label: 'Arquitectura Cloud, Código & Inteligencia Artificial',
    category: 'Informática & Dev',
    imageUrl:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'banner-cyber-ctf',
    label: 'Centro de Operaciones Ciberseguridad & Red Team CTF',
    category: 'Redes & Ciberseguridad',
    imageUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'banner-fablab-design',
    label: 'Taller de Prototipado Digital, Diseño & Colaboración',
    category: 'Diseño & Fabricación',
    imageUrl:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=80',
  },
];

export const ROLE_CONFIG: Record<
  CittRole,
  {
    label: string;
    shortLabel: string;
    authorityRank: number;
    description: string;
    accentHex: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
  }
> = {
  personal_duoc: {
    label: 'Personal Duoc UC',
    shortLabel: 'Personal Duoc',
    authorityRank: 1,
    description:
      'Autoridad institucional de Duoc UC (Coordinadores CITT, Docentes y Directivos).',
    accentHex: '#FFB800',
    badgeBg: '#FFB800',
    badgeText: '#000000',
    badgeBorder: '#FFB800',
  },
  lider_citt: {
    label: 'Líder CITT',
    shortLabel: 'Líder CITT',
    authorityRank: 2,
    description:
      'Autoridad estudiantil y técnica dentro de cada sede CITT (Capitanes y Líderes de Área).',
    accentHex: '#307FE2',
    badgeBg: 'rgba(48, 127, 226, 0.22)',
    badgeText: '#FFFFFF',
    badgeBorder: '#307FE2',
  },
  consejero_carrera: {
    label: 'Consejero de Carrera',
    shortLabel: 'Consejero Carrera',
    authorityRank: 3,
    description:
      'Perfil especial que conecta el CITT con los alumnos de su carrera en Duoc UC que no tienen cuenta en CITT Connect.',
    accentHex: '#43B02A',
    badgeBg: 'rgba(67, 176, 42, 0.2)',
    badgeText: '#EEEEEE',
    badgeBorder: '#43B02A',
  },
  dev: {
    label: 'Core Dev Plataforma',
    shortLabel: 'Core Dev',
    authorityRank: 4,
    description:
      'Desarrolladores y arquitectos de la plataforma CITT Connect.',
    accentHex: '#307FE2',
    badgeBg: 'rgba(255, 184, 0, 0.16)',
    badgeText: '#FFB800',
    badgeBorder: '#FFB800',
  },
  partner: {
    label: 'Partner Oficial',
    shortLabel: 'Partner Oficial',
    authorityRank: 5,
    description:
      'Empresas e instituciones externas aliadas al CITT que publican oportunidades, desafíos y anuncios.',
    accentHex: '#E87722',
    badgeBg: 'rgba(232, 119, 34, 0.2)',
    badgeText: '#FFFFFF',
    badgeBorder: '#E87722',
  },
  usuario_citt: {
    label: 'Miembro CITT',
    shortLabel: 'Miembro CITT',
    authorityRank: 6,
    description:
      'Integrante activo de la comunidad CITT perteneciente a cualquiera de las escuelas de Duoc UC.',
    accentHex: '#EEEEEE',
    badgeBg: 'rgba(238, 238, 238, 0.1)',
    badgeText: '#EEEEEE',
    badgeBorder: 'rgba(238, 238, 238, 0.28)',
  },
};

export const DUOC_SCHOOLS: DuocSchool[] = [
  {
    slug: 'informatica',
    name: 'Escuela de Informática y Telecomunicaciones',
    shortName: 'Informática y Telecom.',
    cssClass: 'E-IyT-New',
    primaryHex: '#307FE2',
    secondaryHex: '#8BB8E8',
  },
  {
    slug: 'ingenieria',
    name: 'Escuela de Ingeniería y Recursos Naturales',
    shortName: 'Ingeniería y RN',
    cssClass: 'E-Ing-New',
    primaryHex: '#43B02A',
    secondaryHex: '#A1D884',
  },
  {
    slug: 'diseno',
    name: 'Escuela de Diseño',
    shortName: 'Diseño',
    cssClass: 'E-Dis-New',
    primaryHex: '#C4D600',
    secondaryHex: '#DBE442',
  },
  {
    slug: 'administracion',
    name: 'Escuela de Administración y Negocios',
    shortName: 'Administración y Negocios',
    cssClass: 'E-AyN-New',
    primaryHex: '#AC4FC6',
    secondaryHex: '#C98BDB',
  },
  {
    slug: 'comunicacion',
    name: 'Escuela de Comunicación',
    shortName: 'Comunicación',
    cssClass: 'E-Com-New',
    primaryHex: '#D50032',
    secondaryHex: '#DF4661',
  },
  {
    slug: 'construccion',
    name: 'Escuela de Construcción',
    shortName: 'Construcción',
    cssClass: 'E-Cons-New',
    primaryHex: '#E87722',
    secondaryHex: '#ECA154',
  },
  {
    slug: 'salud',
    name: 'Escuela de Salud y Bienestar',
    shortName: 'Salud y Bienestar',
    cssClass: 'E-Sal-New',
    primaryHex: '#5BC2E7',
    secondaryHex: '#99D6EA',
  },
  {
    slug: 'gastronomia',
    name: 'Escuela de Gastronomía',
    shortName: 'Gastronomía',
    cssClass: 'E-Gas',
    primaryHex: '#FF585D',
    secondaryHex: '#FF808B',
  },
  {
    slug: 'turismo',
    name: 'Escuela de Turismo y Hospitalidad',
    shortName: 'Turismo y Hospitalidad',
    cssClass: 'E-Tur-New',
    primaryHex: '#00A499',
    secondaryHex: '#2AD2C9',
  },
];

export const CITT_CAMPUSES: CittCampus[] = [
  {
    slug: 'concepcion',
    name: 'Sede San Andrés de Concepción',
    shortName: 'Concepción',
    region: 'Biobío',
  },
  {
    slug: 'antonio-varas',
    name: 'Sede Antonio Varas',
    shortName: 'Antonio Varas',
    region: 'Metropolitana',
  },
  {
    slug: 'san-joaquin',
    name: 'Sede San Joaquín',
    shortName: 'San Joaquín',
    region: 'Metropolitana',
  },
  {
    slug: 'vina-del-mar',
    name: 'Sede Viña del Mar',
    shortName: 'Viña del Mar',
    region: 'Valparaíso',
  },
  {
    slug: 'plaza-oeste',
    name: 'Sede Plaza Oeste',
    shortName: 'Plaza Oeste',
    region: 'Metropolitana',
  },
  {
    slug: 'maipu',
    name: 'Sede Maipú',
    shortName: 'Maipú',
    region: 'Metropolitana',
  },
  {
    slug: 'puente-alto',
    name: 'Sede Puente Alto',
    shortName: 'Puente Alto',
    region: 'Metropolitana',
  },
  {
    slug: 'valparaiso',
    name: 'Sede Valparaíso',
    shortName: 'Valparaíso',
    region: 'Valparaíso',
  },
  {
    slug: 'puerto-montt',
    name: 'Sede Puerto Montt',
    shortName: 'Puerto Montt',
    region: 'Los Lagos',
  },
  {
    slug: 'plaza-norte',
    name: 'Sede Plaza Norte',
    shortName: 'Plaza Norte',
    region: 'Metropolitana',
  },
  {
    slug: 'alameda',
    name: 'Sede Alameda',
    shortName: 'Alameda',
    region: 'Metropolitana',
  },
];

export function getSchoolBySlug(slug: DuocSchoolSlug): DuocSchool {
  return DUOC_SCHOOLS.find((s) => s.slug === slug) || DUOC_SCHOOLS[0];
}

export function getCampusBySlug(slug: string): CittCampus {
  return CITT_CAMPUSES.find((c) => c.slug === slug) || CITT_CAMPUSES[0];
}

export const INITIAL_PROFILES: CittMemberProfile[] = [
  {
    id: 'usr-vicente',
    username: 'vicente-vasquez',
    fullName: 'Vicente Vásquez',
    email: 'vi.vasquez@duocuc.cl',
    careerTitle: 'Ingeniería en Informática',
    currentOccupation: 'Arquitecto & Core Developer CITT Connect',
    specialties: [
      'Full-Stack Next.js',
      'Arquitectura Cloud & Supabase',
      'Sistemas UI/UX',
      'Hardware NFC & Impresión 3D',
    ],
    bio: 'Impulsando la transformación digital de la red CITT a nivel nacional mediante credenciales interactivas, sistemas multisede y hardware impreso en 3D.',
    role: 'dev',
    campusSlug: 'concepcion',
    schoolSlug: 'informatica',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bannerUrl: '/assets/citt-hero-lobby.webp',
    academicTrack: 'Track Arquitectura de Software & Identidad Phygital NFC',
    achievements: [
      'Creador y Arquitecto Principal de la plataforma nacional CITT Connect Duoc UC',
      'Diseñador del Pin Phygital NFC impreso en 3D con código QR dinámico integrado',
      'Mentor técnico en integración Full-Stack (Next.js + FastAPI + Supabase)',
    ],
    linkedinUrl: 'https://www.linkedin.com',
    githubUrl: 'https://github.com',
    portfolioUrl: 'https://duoc.cl',
    phoneOptional: '+56 9 8765 4321',
    isOpenToCollaborate: true,
    isVerified: true,
  },
  {
    id: 'usr-coordinador',
    username: 'rodrigo-morales',
    fullName: 'Rodrigo Morales Arriagada',
    email: 'r.morales@profesor.duoc.cl',
    careerTitle: 'Magíster en Innovación Tecnológica · Docente Duoc UC',
    currentOccupation: 'Coordinador General CITT & Docente Investigador',
    specialties: [
      'Gestión de Innovación',
      'Transferencia Tecnológica',
      'Vinculación con el Medio',
      'Mentoría de Proyectos',
    ],
    bio: 'Articulando equipos multidisciplinarios entre sedes Duoc UC y desafíos tecnológicos de la industria nacional.',
    role: 'personal_duoc',
    campusSlug: 'antonio-varas',
    schoolSlug: 'informatica',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80',
    academicTrack: 'Dirección Académica de Innovación & Transferencia CITT',
    achievements: [
      'Coordinación de mesas técnicas inter-sedes y desafíos con empresas Partner',
      'Dirección de proyectos de investigación aplicada con impacto regional y nacional',
    ],
    linkedinUrl: 'https://www.linkedin.com',
    isOpenToCollaborate: true,
    isVerified: true,
  },
  {
    id: 'usr-lider',
    username: 'camila-fuentes',
    fullName: 'Camila Fuentes Riquelme',
    email: 'ca.fuentes@duocuc.cl',
    careerTitle: 'Ingeniería en Conectividad y Redes',
    currentOccupation: 'Capitana CITT & Líder Track Ciberseguridad',
    specialties: [
      'Pentesting & Red Team',
      'Seguridad en Redes IoT',
      'Linux Hardening',
      'Liderazgo de Equipos CTF',
    ],
    bio: 'Organizadora de competencias Capture The Flag inter-sedes y talleres prácticos de seguridad ofensiva y defensiva.',
    role: 'lider_citt',
    campusSlug: 'vina-del-mar',
    schoolSlug: 'informatica',
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80',
    academicTrack: 'Track Nacional de Ciberseguridad Ofensiva & Defensiva (CTF)',
    achievements: [
      'Capitana General del Torneo Nacional Inter-Sedes Capture The Flag 2026',
      'Instructora par en laboratorios de auditoría de redes industriales e IoT',
    ],
    linkedinUrl: 'https://www.linkedin.com',
    githubUrl: 'https://github.com',
    isOpenToCollaborate: true,
    isVerified: true,
  },
  {
    id: 'usr-consejera-diseno',
    username: 'valentina-soto',
    fullName: 'Valentina Soto Lagos',
    email: 'va.sotol@duocuc.cl',
    careerTitle: 'Diseño Industrial & Prototipado Digital',
    currentOccupation: 'Consejera de Carrera (Escuela de Diseño ↔ CITT)',
    specialties: [
      'Modelado CAD / Fusion 360',
      'Impresión 3D Resina y FDM',
      'Diseño de Producto & UX',
      'Enlace Estudiantil',
    ],
    bio: 'Puente directo entre los estudiantes de la Escuela de Diseño y los laboratorios CITT. Si eres alumno de Diseño sin cuenta en CITT Connect y quieres sumarte a un proyecto tecnológico, escríbeme.',
    role: 'consejero_carrera',
    campusSlug: 'san-joaquin',
    schoolSlug: 'diseno',
    avatarUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    bannerUrl: '/assets/banner-comunidad.webp',
    academicTrack: 'FabLab & Prototipado Industrial Inter-Escuelas',
    achievements: [
      'Consejera Oficial de Carrera para integración de alumnos de Diseño en proyectos CITT',
      'Co-diseñadora de carcasas ergonómicas impresas en 3D para robótica y telemetría',
    ],
    representedCareerInfo:
      'Enlace oficial para estudiantes de Diseño Industrial y Gráfico (Lunes a Jueves en Laboratorio CITT).',
    linkedinUrl: 'https://www.linkedin.com',
    portfolioUrl: 'https://behance.net',
    instagramUrl: 'https://instagram.com',
    isOpenToCollaborate: true,
    isVerified: true,
  },
  {
    id: 'usr-partner',
    username: 'javiera-mendez-aws',
    fullName: 'Javiera Méndez Solar',
    email: 'jmendez@techpartner.cl',
    careerTitle: 'Ingeniera Civil Informática · Cloud Partner Lead',
    currentOccupation: 'Líder de Alianzas Universitarias en AustralCloud Chile',
    specialties: [
      'Arquitectura Cloud AWS/GCP',
      'IA Generativa Empresarial',
      'Prácticas Profesionales',
      'Desafíos de Industria',
    ],
    bio: 'Conecto a los talentos destacados de todas las sedes CITT con desafíos reales de clientes, mentorías técnicas y programas de contratación temprana.',
    role: 'partner',
    partnerOrganization: 'AustralCloud Technologies Chile',
    campusSlug: 'antonio-varas',
    schoolSlug: 'administracion',
    avatarUrl:
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1400&q=80',
    academicTrack: 'Alianza Industrial Cloud, IA & Empleabilidad Temprana',
    achievements: [
      'Patrocinadora oficial de créditos Cloud y mentorías técnicas para proyectos CITT',
      'Coordinadora del programa anual de prácticas y semillero profesional Duoc UC',
    ],
    linkedinUrl: 'https://www.linkedin.com',
    portfolioUrl: 'https://duoc.cl',
    isOpenToCollaborate: true,
    isVerified: true,
  },
  {
    id: 'usr-miembro-robotica',
    username: 'matias-alarcon',
    fullName: 'Matías Alarcón Vergara',
    email: 'ma.alarconv@duocuc.cl',
    careerTitle: 'Ingeniería en Automatización y Robótica',
    currentOccupation: 'Investigador Track Robótica & Sistemas Embebidos',
    specialties: [
      'ROS 2 & C++',
      'ESP32 / Microcontroladores',
      'Visión Artificial OpenCV',
      'Diseño de PCBs',
    ],
    bio: 'Desarrollando robots autónomos de rescate y telemetría agrícola junto a compañeros de Ingeniería e Informática.',
    role: 'usuario_citt',
    campusSlug: 'concepcion',
    schoolSlug: 'ingenieria',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bannerUrl: '/assets/banner-iot.webp',
    academicTrack: 'Track Robótica Autónoma, Sensórica LoRaWAN & Visión IA',
    achievements: [
      'Líder técnico del Rover Autónomo de Detección Temprana Forestal en Biobío',
      'Finalista Hackathon Inter-Sedes de Automatización e IoT Industrial',
    ],
    linkedinUrl: 'https://www.linkedin.com',
    githubUrl: 'https://github.com',
    isOpenToCollaborate: true,
    isVerified: true,
  },
  {
    id: 'usr-consejero-salud',
    username: 'diego-herrera',
    fullName: 'Diego Herrera Campos',
    email: 'di.herrerac@duocuc.cl',
    careerTitle: 'Informática Biomédica',
    currentOccupation: 'Consejero de Carrera (Salud & Tecnología ↔ CITT)',
    specialties: [
      'Interoperabilidad HL7 FHIR',
      'Salud Digital',
      'Analítica Clínica',
      'Coordinación Inter-Escuelas',
    ],
    bio: 'Vinculando a estudiantes de la Escuela de Salud con desarrolladores del CITT para crear soluciones de telemedicina y rehabilitación asistida.',
    role: 'consejero_carrera',
    campusSlug: 'plaza-oeste',
    schoolSlug: 'salud',
    avatarUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    bannerUrl: '/assets/citt-hero-lobby.webp',
    academicTrack: 'Track Salud Digital, Bio-IoT & Simulación Clínica',
    achievements: [
      'Puente académico entre la Escuela de Salud y los laboratorios de ingeniería CITT',
    ],
    representedCareerInfo:
      'Enlace oficial para alumnos de Informática Biomédica y Enfermería interesados en innovación.',
    linkedinUrl: 'https://www.linkedin.com',
    isOpenToCollaborate: true,
    isVerified: true,
  },
  {
    id: 'usr-miembro-audiovisual',
    username: 'francisca-navarro',
    fullName: 'Francisca Navarro Pino',
    email: 'fr.navarro@duocuc.cl',
    careerTitle: 'Comunicación Audiovisual & Animación 3D',
    currentOccupation: 'Creadora XR & Entornos Virtuales en CITT',
    specialties: [
      'Unreal Engine 5',
      'Blender 3D',
      'Realidad Virtual (VR)',
      'Dirección de Arte Digital',
    ],
    bio: 'Construyendo simuladores inmersivos y experiencias interactivas para ferias tecnológicas del CITT.',
    role: 'usuario_citt',
    campusSlug: 'maipu',
    schoolSlug: 'comunicacion',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    bannerUrl: '/assets/citt-hero-lobby.webp',
    academicTrack: 'Track Realidad Extendida (XR), Simulación VR & Arte Técnico',
    achievements: [
      'Directora de entornos 3D para simuladores de prevención de riesgos eléctricos en VR',
    ],
    linkedinUrl: 'https://www.linkedin.com',
    portfolioUrl: 'https://artstation.com',
    instagramUrl: 'https://instagram.com',
    isOpenToCollaborate: true,
    isVerified: true,
  },
];

export const INITIAL_PROJECTS: CittProject[] = [
  {
    id: 'proj-pin-nfc',
    slug: 'citt-connect-pin-nfc-3d',
    title: 'Pin Inteligente NFC Tipo Sándwich & Red CITT Connect',
    summary:
      'Ecosistema de networking instantáneo para todas las sedes CITT de Chile combinado con pines físicos impresos en 3D con chip NFC encapsulado.',
    status: 'en_desarrollo',
    leadUsername: 'vicente-vasquez',
    leadName: 'Vicente Vásquez',
    leadRole: 'dev',
    originCampusSlug: 'concepcion',
    schoolSlug: 'informatica',
    lookingForCollaborators: true,
    neededSpecialties: [
      'Modelado 3D / Laminado FDM',
      'Testing en iOS/Android',
      'Embajadores en otras Sedes CITT',
    ],
    helpRequestDetails:
      'Buscamos líderes o miembros de otras sedes (Viña del Mar, San Joaquín, Antonio Varas, Puerto Montt) para probar la lectura de códigos QR y preparar la fase de impresión de los pines 3D.',
    repoUrl: 'https://github.com/vicenteivc16/CITT_Connect_Frontend',
    videoUrl: 'https://www.youtube.com/watch?v=kYv_3jZf9oU',
    coverImageUrl: '/assets/banner-iot.webp',
    galleryImages: [
      '/assets/banner-iot.webp',
      '/assets/citt-hero-lobby.webp',
      '/assets/banner-comunidad.webp',
    ],
    maturityStage: 'prototipado',
    collaborators: [
      {
        id: 'collab-1',
        username: 'carlos-vega-docente',
        fullName: 'Prof. Carlos Vega R.',
        role: 'personal_duoc',
        roleInProject: 'Docente Patrocinador Duoc UC',
        campusSlug: 'concepcion',
        schoolSlug: 'informatica',
        avatarUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'collab-2',
        username: 'javiera-mendez-aws',
        fullName: 'Javiera Méndez Solar',
        role: 'partner',
        organization: 'AWS Cloud Chile',
        roleInProject: 'Mentora de Industria & Sponsor',
        campusSlug: 'antonio-varas',
        schoolSlug: 'informatica',
        avatarUrl:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'collab-3',
        username: 'vicente-vasquez',
        fullName: 'Vicente Vásquez',
        role: 'dev',
        roleInProject: 'Lead Core Dev & Creador',
        campusSlug: 'concepcion',
        schoolSlug: 'informatica',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'collab-4',
        username: 'camila-soto',
        fullName: 'Camila Soto',
        role: 'lider_citt',
        roleInProject: 'Líder Track Robótica & 3D',
        campusSlug: 'san-joaquin',
        schoolSlug: 'ingenieria',
        avatarUrl:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'collab-5',
        username: 'matias-alarcon',
        fullName: 'Matías Alarcón Vergara',
        role: 'usuario_citt',
        roleInProject: 'Desarrollador Firmware C++',
        campusSlug: 'concepcion',
        schoolSlug: 'informatica',
        avatarUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      },
    ],
    applicationMode: 'form',
    applicationQuestions: [
      {
        id: 'q1',
        question: '¿En qué sede de Duoc UC estudias y qué carrera cursas?',
        placeholder: 'Ej: San Joaquín · Ingeniería en Informática',
        required: true,
      },
      {
        id: 'q2',
        question: '¿Tienes acceso o experiencia con impresión 3D (FDM/Resina) o pruebas de hardware?',
        placeholder: 'Cuéntanos qué filamentos o impresoras has utilizado...',
        required: true,
      },
      {
        id: 'q3',
        question: '¿Cuántas horas a la semana puedes dedicar para pruebas inter-sedes?',
        placeholder: 'Ej: 4 a 6 horas semanales',
        required: false,
      },
    ],
    readmeContent: `# Pin Inteligente NFC Tipo Sándwich & Ecosistema CITT Connect 🚀

> **Proyecto Oficial del CITT Duoc UC · Sede San Andrés de Concepción & Red Nacional**

El **Pin Inteligente NFC** es un dispositivo físico tipo credencial de solapa diseñado para ser impreso en 3D mediante tecnología FDM (Fused Deposition Modeling). Incorpora un encapsulado tipo sándwich que protege un chip **NTAG213 / NTAG215**, permitiendo el intercambio instantáneo de contactos profesionales con solo acercar un teléfono móvil.

---

## 🛠️ Especificaciones Técnicas del Hardware
* **Chip NFC:** NTAG213 (144 bytes útiles) o NTAG215 (504 bytes útiles) con protocolo ISO/IEC 14443 Type A.
* **Material del Chasis:** Filamento PLA+ o PETG de alta tenacidad con pausa en capa media (Z=1.6mm) para incrustar el tag NFC.
* **Acabado Estético:** Emblema 3D CITT en relieve con doble extrusión o pintura acrílica bicomponente.
* **Compatibilidad:** 100% nativo con iOS (iPhone XS en adelante) y Android con lector NFC activo sin necesidad de aplicaciones adicionales.

---

## 🌐 Arquitectura de Redirección Dinámica

\`\`\`mermaid
flowchart TD
    A["Tap en Pin NFC Físico (NTAG213)"] --> B["Lectura Nativa en iOS / Android"]
    B --> C["GET /nfc/{tag_uid} (Edge Handler)"]
    C --> D{"¿Tag Activo en CITT Connect?"}
    D -- "Sí" --> E["HTTP 307 Redirección Instantánea"]
    E --> F["/u/{username} (Perfil Phygital & vCard)"]
    D -- "No" --> G["Pantalla de Asignación de Pin a Estudiante"]
\`\`\`

1. **Lectura Inmediata:** El chip no almacena datos estáticos; almacena la URL corta única \`https://cittconnect.duocuc.cl/nfc/{uid}\`.
2. **Desacoplamiento:** Si el alumno cambia su número o rol, el pin físico sigue funcionando sin tener que reescribir el chip.
3. **Métricas de Contacto:** Registra la cantidad de toques exitosos para analítica de networking en ferias.

---

## 👥 Perfiles Buscados para el Equipo
Buscamos estudiantes y docentes de cualquier sede Duoc UC para colaborar en:
- **Área Maker / 3D:** Calibración de tolerancias de contracción térmica para el alojamiento del tag.
- **Área Frontend / PWA:** Optimización del tiempo de respuesta del perfil público a menos de 500ms.
- **Embajadores de Sede:** Alumnos encargados de distribuir y ensayar los pines en sus sedes locales.
`,
    createdAt: 'Hace 2 días',
  },
  {
    id: 'proj-rover-biobio',
    slug: 'rover-monitoreo-forestal-ia',
    title: 'Rover Autónomo de Detección Temprana Forestal con Visión IA',
    summary:
      'Vehículo terrestre no tripulado equipado con cámaras térmicas y modelo embebido para alerta temprana en zonas boscosas.',
    status: 'prototipo',
    leadUsername: 'matias-alarcon',
    leadName: 'Matías Alarcón Vergara',
    leadRole: 'usuario_citt',
    originCampusSlug: 'concepcion',
    schoolSlug: 'ingenieria',
    lookingForCollaborators: true,
    neededSpecialties: [
      'Diseño Industrial (Carcasa 3D)',
      'Dashboard Web React',
      'Entrenamiento YOLO / Visión IA',
    ],
    helpRequestDetails:
      'Necesitamos 1 estudiante de Diseño de cualquier sede para optimizar la carcasa resistente al polvo y 1 desarrollador frontend para el panel de telemetría en tiempo real.',
    repoUrl: 'https://github.com',
    videoUrl: 'https://www.youtube.com/watch?v=Sby1UkHAbxA',
    coverImageUrl: '/assets/banner-iot.webp',
    galleryImages: ['/assets/banner-iot.webp', '/assets/citt-hero-lobby.webp'],
    maturityStage: 'pruebas_campo',
    collaborators: [
      {
        id: 'collab-r1',
        username: 'matias-alarcon',
        fullName: 'Matías Alarcón Vergara',
        role: 'usuario_citt',
        roleInProject: 'Líder de Proyecto & Robótica',
        campusSlug: 'concepcion',
        schoolSlug: 'ingenieria',
      },
      {
        id: 'collab-r2',
        username: 'carlos-vega-docente',
        fullName: 'Prof. Carlos Vega R.',
        role: 'personal_duoc',
        roleInProject: 'Coordinador CITT Sede Concepción',
        campusSlug: 'concepcion',
        schoolSlug: 'informatica',
      },
    ],
    applicationMode: 'form',
    applicationQuestions: [
      {
        id: 'q1',
        question: '¿Qué experiencia tienes con Python, OpenCV o modelos de visión como YOLO?',
        placeholder: 'Describe brevemente tus proyectos previos...',
        required: true,
      },
      {
        id: 'q2',
        question: '¿En qué área te gustaría colaborar principalmente (Hardware, IA o Dashboard)?',
        placeholder: 'Selecciona tu foco preferido...',
        required: true,
      },
    ],
    readmeContent: `# Rover Autónomo de Monitoreo Forestal con Visión Artificial 🌲🤖

Iniciativa inter-escuelas Duoc UC (Ingeniería + Informática + Diseño) para prevenir focos de incendios forestales mediante robótica terrestre autónoma y telemetría de largo alcance.

---

## 🛰️ Componentes del Sistema
- **Unidad de Cómputo Embebido:** NVIDIA Jetson Orin Nano / Raspberry Pi 4.
- **Sensor Térmico & Espectral:** Cámara termográfica FLIR Lepton 3.5 con resolución radiométrica.
- **Navegación:** Sistema ROS 2 (Robot Operating System) con odometría visual y GPS RTK centimétrico.
- **Comunicaciones:** Módulos LoRaWAN 915 MHz para zonas rurales sin cobertura 4G/5G.

\`\`\`mermaid
flowchart LR
    A["Cámara Térmica FLIR"] --> B["Jetson Orin (YOLOv8)"]
    C["Sensores Gas / Humo"] --> B
    B --> D["Módulo LoRaWAN"]
    D --> E["Gateway Estación Base CITT"]
    E --> F["Dashboard CITT Connect"]
\`\`\`

## 🎯 Estado Actual y Próximos Pasos
Hemos completado las pruebas de tracción 4x4 en terrenos con pendiente de 25 grados. Actualmente estamos optimizando el peso de la carcasa hermética y conectando los eventos de alerta al panel web de CITT Connect.
`,
    createdAt: 'Hace 5 días',
  },
  {
    id: 'proj-simulador-vr',
    slug: 'simulador-vr-seguridad-electrica',
    title: 'Simulador VR de Prevención de Riesgos en Subestaciones',
    summary:
      'Entorno inmersivo en Unreal Engine 5 para entrenar procedimientos de bloqueo eléctrico sin riesgo físico para estudiantes de Ingeniería y Construcción.',
    status: 'en_desarrollo',
    leadUsername: 'francisca-navarro',
    leadName: 'Francisca Navarro Pino',
    leadRole: 'usuario_citt',
    originCampusSlug: 'maipu',
    schoolSlug: 'comunicacion',
    lookingForCollaborators: true,
    neededSpecialties: [
      'Programación Blueprints / C++',
      'Validación Técnica Eléctrica',
      'Sonido Espacial',
    ],
    helpRequestDetails:
      'Pedimos ayuda a compañeros de Ingeniería en Electricidad o Construcción de cualquier sede para validar el protocolo técnico dentro del simulador.',
    coverImageUrl: '/assets/citt-hero-lobby.webp',
    galleryImages: ['/assets/citt-hero-lobby.webp'],
    maturityStage: 'ideacion',
    collaborators: [
      {
        id: 'collab-vr1',
        username: 'francisca-navarro',
        fullName: 'Francisca Navarro Pino',
        role: 'usuario_citt',
        roleInProject: 'Creadora & Diseñadora 3D',
        campusSlug: 'maipu',
        schoolSlug: 'comunicacion',
      },
      {
        id: 'collab-vr2',
        username: 'vicente-vasquez',
        fullName: 'Vicente Vásquez',
        role: 'dev',
        roleInProject: 'Asesor Técnico WebXR',
        campusSlug: 'concepcion',
        schoolSlug: 'informatica',
      },
    ],
    applicationMode: 'direct',
    readmeContent: `# Simulador de Realidad Virtual para Maniobras Eléctricas 🥽⚡

Desarrollado en el laboratorio CITT Sede Maipú para apoyar la formación de técnicos e ingenieros de Duoc UC.

### 🎮 Tecnologías
- **Motor Gráfico:** Unreal Engine 5.3 con Nanite y Lumen.
- **Dispositivos Objetivo:** Meta Quest 2 / Quest 3 y HTC Vive Focus 3.
- **Interacciones:** Sistema háptico para uso de pértiga aislante y colocación de candados de bloqueo (LOTO).

### 🚀 Postulación Abierta Directa
Este proyecto admite **Postulación Directa en 1 Clic**: tu cuenta institucional autenticada se vinculará automáticamente al registro de colaboradores de la iniciativa.
`,
    createdAt: 'Hace 1 semana',
  },
];

export const INITIAL_POSTS: CittFeedPost[] = [
  {
    id: 'post-partner-1',
    authorUsername: 'javiera-mendez-aws',
    authorName: 'Javiera Méndez Solar · AustralCloud',
    authorRole: 'partner',
    authorOccupation: 'Líder de Alianzas Universitarias (Partner Oficial)',
    campusSlug: 'antonio-varas',
    category: 'oportunidad_partner',
    title:
      'Convocatoria Abierta: 6 Cupos de Práctica y Mentoría Cloud & IA para Miembros CITT (Todas las Sedes)',
    content:
      'En AustralCloud abrimos nuestra convocatoria semestral exclusiva para integrantes de los CITT de Duoc UC (modalidad híbrida o remota desde regiones). Buscamos perfiles con interés en Arquitectura Cloud, Desarrollo Full-Stack, Ciberseguridad o Automatización.',
    actionLabel: 'Ver bases y postular con tu perfil CITT',
    actionUrl: '/u/javiera-mendez-aws',
    createdAt: 'Hace 3 horas',
  },
  {
    id: 'post-consejero-1',
    authorUsername: 'valentina-soto',
    authorName: 'Valentina Soto Lagos',
    authorRole: 'consejero_carrera',
    authorOccupation: 'Consejera de Carrera · Escuela de Diseño',
    campusSlug: 'san-joaquin',
    category: 'puente_consejero',
    title:
      'Puente Escuela de Diseño ↔ CITT: 14 alumnos de Diseño buscan sumarse a proyectos de software y robótica',
    content:
      'Como Consejera de Carrera en San Joaquín, reuní a un grupo de estudiantes de Diseño Gráfico e Industrial que aún no tienen cuenta en CITT Connect pero quieren diseñar interfaces, logos e imprimir carcasas 3D para los proyectos tecnológicos de cualquier sede.',
    actionLabel: 'Contactar a Valentina para conectar equipos',
    actionUrl: '/u/valentina-soto',
    createdAt: 'Hace 1 día',
  },
  {
    id: 'post-lider-1',
    authorUsername: 'camila-fuentes',
    authorName: 'Camila Fuentes Riquelme',
    authorRole: 'lider_citt',
    authorOccupation: 'Capitana CITT Sede Viña del Mar',
    campusSlug: 'vina-del-mar',
    category: 'evento_nacional',
    title:
      'Torneo Inter-Sedes CTF Ciberseguridad 2026: Inscripciones abiertas por equipos mixtos entre sedes',
    content:
      'Este mes realizaremos el entrenamiento nacional Capture The Flag. Pueden armar escuadrones de hasta 4 integrantes combinando estudiantes de distintas sedes y carreras.',
    actionLabel: 'Conectar con Camila (Organización CTF)',
    actionUrl: '/u/camila-fuentes',
    createdAt: 'Hace 2 días',
  },
];

export const CITT_BLOG_ARTICLES: CittBlogArticle[] = [
  {
    id: 'blog-1',
    slug: 'red-nacional-citt-connect-transferencia-tecnologica',
    title:
      'De laboratorios locales a una Red Nacional: Cómo CITT Connect articula las 18 sedes de Duoc UC',
    subtitle:
      'Una infraestructura común para conectar talento estudiantil, docentes, Consejeros de Carrera y empresas Partner de Arica a Puerto Montt.',
    excerpt:
      'Durante años, cada sede del Centro de Innovación y Transferencia Tecnológica (CITT) desarrolló proyectos extraordinarios de forma aislada. Hoy, CITT Connect une ese conocimiento en una sola red viva e interdisciplinaria.',
    contentParagraphs: [
      'El Centro de Innovación y Transferencia Tecnológica (CITT) nació en Duoc UC como un espacio de experimentación práctica donde los estudiantes llevan la teoría al mundo real mediante robótica, desarrollo de software, ciberseguridad, fabricación digital e inteligencia artificial.',
      'Sin embargo, el crecimiento a 18 sedes a lo largo de Chile planteó un desafío clave: ¿cómo logra un equipo de Ingeniería en Concepción colaborar en tiempo real con un equipo de Diseño en San Joaquín o con un Capitán de Ciberseguridad en Viña del Mar?',
      'CITT Connect responde a esa necesidad institucional combinando tres pilares: un Directorio Nacional verificable con vínculos directos (+ Connect), una Credencial Digital con código QR dinámico y descarga vCard (.vcf) para eventos presenciales, y un espacio de co-creación donde Partners de la industria y Consejeros de Carrera abren oportunidades para todas las escuelas de Duoc UC.',
    ],
    coverImageUrl:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Rodrigo Morales Arriagada',
    authorRole: 'personal_duoc',
    authorAvatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    campusSlug: 'antonio-varas',
    schoolSlug: 'informatica',
    readTime: '4 min de lectura',
    publishedAt: '28 Octubre 2026',
    featured: true,
  },
  {
    id: 'blog-2',
    slug: 'rol-consejero-carrera-puente-interdisciplinario',
    title:
      'El rol del Consejero de Carrera: Integrando las 9 escuelas de Duoc UC a la innovación tecnológica',
    subtitle:
      'Por qué un proyecto de software o hardware necesita diseñadores, comunicadores, administradores y especialistas de salud.',
    excerpt:
      'Los Consejeros de Carrera actúan como embajadores que vinculan a compañeros que aún no pertenecen al CITT con proyectos reales que requieren talento multidisciplinario.',
    contentParagraphs: [
      'La innovación tecnológica real nunca ocurre en una sola disciplina. Un exoesqueleto o un monitor clínico IoT requiere tanto de Ingeniería e Informática como de la Escuela de Salud y de la Escuela de Diseño.',
      'Por eso CITT Connect incorpora oficialmente el rol de Consejero de Carrera: perfiles verificados que mantienen el puente directo entre los laboratorios CITT y los estudiantes de todas las carreras de Duoc UC.',
      'Gracias a este modelo, cualquier líder de proyecto puede publicar un requerimiento específico y recibir apoyo de estudiantes de Diseño Industrial, Producción Audiovisual, Gastronomía, Construcción o Administración.',
    ],
    coverImageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
    authorName: 'Valentina Soto Lagos',
    authorRole: 'consejero_carrera',
    authorAvatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    campusSlug: 'san-joaquin',
    schoolSlug: 'diseno',
    readTime: '3 min de lectura',
    publishedAt: '24 Octubre 2026',
  },
  {
    id: 'blog-3',
    slug: 'ciberseguridad-ctf-entrenamiento-inter-sedes',
    title:
      'Escuadrones Inter-Sedes: Así se preparan los equipos CITT para los desafíos nacionales de Ciberseguridad',
    subtitle:
      'Entrenamientos conjuntos de Red Team, Hardening y análisis forense entre sedes de distintas regiones.',
    excerpt:
      'La comunidad de ciberseguridad del CITT organiza laboratorios compartidos donde estudiantes de primer año aprenden junto a capitanes experimentados.',
    contentParagraphs: [
      'Los torneos Capture The Flag (CTF) se han transformado en uno de los motores de aprendizaje más potentes dentro de la Escuela de Informática y Telecomunicaciones de Duoc UC.',
      'A través de CITT Connect, los capitanes de pista publican laboratorios semanales y arman escuadrones mixtos que conectan a estudiantes de Viña del Mar, Maipú, Plaza Oeste y Concepción.',
      'Además, las empresas Partner observan directamente el desempeño técnico de los participantes, abriendo una vía rápida hacia prácticas profesionales y mentorías especializadas.',
    ],
    coverImageUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80',
    authorName: 'Camila Fuentes Riquelme',
    authorRole: 'lider_citt',
    authorAvatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    campusSlug: 'vina-del-mar',
    schoolSlug: 'informatica',
    readTime: '5 min de lectura',
    publishedAt: '19 Octubre 2026',
  },
  {
    id: 'blog-4',
    slug: 'credencial-phygital-qr-networking-eventos',
    title:
      'Identidad Phygital: Del código QR en congresos al vínculo profesional permanente en CITT Connect',
    subtitle:
      'Cómo diseñamos una credencial pensada para funcionar en ferias tecnológicas, hackathons y encuentros con la industria.',
    excerpt:
      'En menos de 3 segundos, cualquier asistente escanea tu pase CITT, descarga tu contacto vCard (.vcf) y establece conexión dentro de la plataforma.',
    contentParagraphs: [
      'En cada hackathon, feria de innovación o congreso inter-sedes, decenas de estudiantes y docentes intercambian ideas valiosas que suelen perderse al terminar la jornada.',
      'El Pase Phygital de CITT Connect resuelve esta fricción: cada miembro posee una URL única (/u/usuario), un código QR de alto contraste optimizado para lectura rápida y descarga directa de tarjeta de contacto estándar (.vcf).',
      'Combinado con el nuevo Directorio Nacional y el botón "+ Connect", el contacto presencial se transforma de inmediato en una red profesional duradera dentro de Duoc UC.',
    ],
    coverImageUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
    authorName: 'Vicente Vásquez',
    authorRole: 'dev',
    authorAvatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    campusSlug: 'concepcion',
    schoolSlug: 'informatica',
    readTime: '3 min de lectura',
    publishedAt: '15 Octubre 2026',
  },
];

export const CITT_PINTEREST_PINS: CittPinterestPin[] = [
  {
    id: 'pin-1',
    title: 'Prototipado de Rover Agrícola con Sensores LoRaWAN',
    caption:
      'Pruebas de telemetría en terreno y calibración de chasis impreso en PETG por el track de Robótica & IoT.',
    imageUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    imageHeightClass: 'h-80',
    tag: 'Robótica & IoT',
    campusSlug: 'concepcion',
    schoolSlug: 'ingenieria',
    authorName: 'Matías Rojas · Track IoT',
  },
  {
    id: 'pin-2',
    title: 'Entrenamiento Nacional Capture The Flag (CTF)',
    caption:
      'Sesión nocturna de auditoría de redes y defensa de infraestructura crítica entre equipos de 5 sedes.',
    imageUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    imageHeightClass: 'h-52',
    tag: 'Ciberseguridad',
    campusSlug: 'vina-del-mar',
    schoolSlug: 'informatica',
    authorName: 'Camila Fuentes · Capitana CITT',
  },
  {
    id: 'pin-3',
    title: 'Laboratorio de Impresión 3D y Diseño de Carcasas Industriales',
    caption:
      'Iteración de ergonomía y resistencia térmica junto a estudiantes de la Escuela de Diseño.',
    imageUrl:
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    imageHeightClass: 'h-64',
    tag: 'Diseño & Fabricación 3D',
    campusSlug: 'san-joaquin',
    schoolSlug: 'diseno',
    authorName: 'Valentina Soto · Consejera Diseño',
  },
  {
    id: 'pin-4',
    title: 'Cumbre Anual de Capitanes y Líderes CITT',
    caption:
      'Presentación de hojas de ruta semestrales y proyectos colaborativos ante coordinadores y empresas Partner.',
    imageUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    imageHeightClass: 'h-52',
    tag: 'Comunidad Inter-Sedes',
    campusSlug: 'antonio-varas',
    schoolSlug: 'administracion',
    authorName: 'Rodrigo Morales · Coordinación CITT',
  },
  {
    id: 'pin-5',
    title: 'Arquitectura Cloud & Despliegue de Modelos de Visión Artificial',
    caption:
      'Taller práctico de contenedores, inferencia en el borde y pipelines CI/CD dictado junto a Partners.',
    imageUrl:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
    imageHeightClass: 'h-96',
    tag: 'IA & Software',
    campusSlug: 'concepcion',
    schoolSlug: 'informatica',
    authorName: 'Vicente Vásquez · Core Dev',
  },
  {
    id: 'pin-6',
    title: 'Simulación en Realidad Virtual para Prevención de Riesgos Eléctricos',
    caption:
      'Validación de controles inmersivos con cascos VR para entrenamiento seguro en subestaciones.',
    imageUrl:
      'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=800&q=80',
    imageHeightClass: 'h-64',
    tag: 'IA & Software',
    campusSlug: 'maipu',
    schoolSlug: 'comunicacion',
    authorName: 'Francisca Navarro · Track Realidad Extendida',
  },
  {
    id: 'pin-7',
    title: 'Biometría y Sensores Clínicos para Simulación Hospitalaria',
    caption:
      'Integración de placas microcontroladoras con maniquíes de entrenamiento de la Escuela de Salud.',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    imageHeightClass: 'h-96',
    tag: 'Robótica & IoT',
    campusSlug: 'valparaiso',
    schoolSlug: 'salud',
    authorName: 'Dr. Sebastián Pizarro · Salud & Bio-IoT',
  },
  {
    id: 'pin-8',
    title: 'Hackathon Inter-Sedes 48 Horas: Soluciones Sostenibles',
    caption:
      'Equipos multidisciplinarios trabajando en prototipos funcionales para eficiencia hídrica y energética.',
    imageUrl:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    imageHeightClass: 'h-52',
    tag: 'Comunidad Inter-Sedes',
    campusSlug: 'plaza-vespucio',
    schoolSlug: 'construccion',
    authorName: 'Comunidad Nacional CITT',
  },
  {
    id: 'pin-9',
    title: 'Soldadura SMD y Diseño de Placas PCB Personalizadas',
    caption:
      'Fabricación de módulos electrónicos propios en los bancos de hardware abierto del CITT.',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    imageHeightClass: 'h-80',
    tag: 'Robótica & IoT',
    campusSlug: 'puente-alto',
    schoolSlug: 'ingenieria',
    authorName: 'Laboratorio de Hardware CITT',
  },
];
