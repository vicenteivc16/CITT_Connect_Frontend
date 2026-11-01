import {
  CittActivity,
  CittBannerPreset,
  CittBlogArticle,
  CittCampus,
  CittFeedPost,
  CittMemberProfile,
  CittPinterestPin,
  CittProject,
  CittRole,
  ProjectMaturityStage,
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
    slug: 'plaza-norte',
    name: 'Sede Plaza Norte',
    shortName: 'Plaza Norte',
    region: 'Metropolitana',
  },
  {
    slug: 'plaza-vespucio',
    name: 'Sede Plaza Vespucio',
    shortName: 'Plaza Vespucio',
    region: 'Metropolitana',
  },
  {
    slug: 'alameda',
    name: 'Sede Alameda',
    shortName: 'Alameda',
    region: 'Metropolitana',
  },
  {
    slug: 'alonso-de-ovalle',
    name: 'Sede Padre Alonso de Ovalle',
    shortName: 'Alonso de Ovalle',
    region: 'Metropolitana',
  },
  {
    slug: 'san-bernardo',
    name: 'Sede San Bernardo',
    shortName: 'San Bernardo',
    region: 'Metropolitana',
  },
  {
    slug: 'melipilla',
    name: 'Sede Melipilla',
    shortName: 'Melipilla',
    region: 'Metropolitana',
  },
  {
    slug: 'vina-del-mar',
    name: 'Sede Viña del Mar',
    shortName: 'Viña del Mar',
    region: 'Valparaíso',
  },
  {
    slug: 'valparaiso',
    name: 'Sede Valparaíso',
    shortName: 'Valparaíso',
    region: 'Valparaíso',
  },
  {
    slug: 'villarrica',
    name: 'Sede Villarrica',
    shortName: 'Villarrica',
    region: 'La Araucanía',
  },
  {
    slug: 'puerto-montt',
    name: 'Sede Puerto Montt',
    shortName: 'Puerto Montt',
    region: 'Los Lagos',
  },
  {
    slug: 'nacimiento',
    name: 'Sede Nacimiento',
    shortName: 'Nacimiento',
    region: 'Biobío',
  },
  {
    slug: 'arauco',
    name: 'Sede Arauco',
    shortName: 'Arauco',
    region: 'Biobío',
  },
];

export function getSchoolBySlug(slug: DuocSchoolSlug): DuocSchool {
  return DUOC_SCHOOLS.find((s) => s.slug === slug) || DUOC_SCHOOLS[0];
}

export function getCampusBySlug(slug: string): CittCampus {
  return CITT_CAMPUSES.find((c) => c.slug === slug) || CITT_CAMPUSES[0];
}

export const GUEST_USER: CittMemberProfile = {
  id: 'guest',
  username: 'invitado',
  fullName: 'Visitante Institucional',
  email: 'invitado@duoc.cl',
  careerTitle: 'Comunidad Duoc UC',
  currentOccupation: 'Explorador CITT',
  specialties: [],
  bio: 'Explorador de iniciativas del Centro de Innovación y Transferencia Tecnológica.',
  role: 'usuario_citt',
  campusSlug: 'san-bernardo',
  schoolSlug: 'informatica',
  isOpenToCollaborate: false,
  isVerified: false,
  avatarUrl: '/assets/citt-logo.webp',
};

// ============================================================================
// COLECCIONES ORGÁNICAS (LIMPIAS DE DATOS HARDCODEADOS)
// ============================================================================
export const INITIAL_PROFILES: CittMemberProfile[] = [];
export const INITIAL_PROJECTS: CittProject[] = [];
export const INITIAL_POSTS: CittFeedPost[] = [];
export const INITIAL_ACTIVITIES: CittActivity[] = [];

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
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
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


export const MATURITY_LABELS: Record<
  ProjectMaturityStage,
  { label: string; step: number; color: string; desc: string }
> = {
  ideacion: {
    label: 'Fase 1: Ideación & Validación',
    step: 1,
    color: '#00A499',
    desc: 'Definición de requerimientos técnicos y conceptualización de arquitectura.',
  },
  prototipado: {
    label: 'Fase 2: Prototipo Funcional',
    step: 2,
    color: '#FFB800',
    desc: 'Desarrollo de MVP y pruebas controladas en laboratorios CITT.',
  },
  pruebas_campo: {
    label: 'Fase 3: Validación en Terreno',
    step: 3,
    color: '#307FE2',
    desc: 'Pruebas de campo con usuarios reales y métricas de desempeño.',
  },
  transferencia: {
    label: 'Fase 4: Transferencia & Escala',
    step: 4,
    color: '#107C41',
    desc: 'Implementación productiva, licenciamiento o adopción por partners.',
  },
};

