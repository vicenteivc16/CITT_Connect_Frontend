import { NextResponse } from 'next/server';
import { DuocSchoolSlug } from '@/types/citt';

export interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  schoolSlug: DuocSchoolSlug;
  schoolName: string;
  region: 'chile' | 'internacional';
  regionLabel: string;
  sourceName: string;
  sourceUrl?: string;
  author: string;
  authorTitle: string;
  imageUrl: string;
  publishedAt: string;
  readingTime: string;
  isHeroFeatured?: boolean;
  tags: string[];
}

// Filtro estricto de neutralidad Duoc UC: exclusión total de temas políticos, electorales y religiosos
const BLACKLISTED_TERMS = [
  'politica',
  'político',
  'partido político',
  'elecciones',
  'gobierno',
  'senador',
  'diputado',
  'presidente',
  'congreso',
  'campaña electoral',
  'candidato',
  'ministro',
  'parlamento',
  'plebiscito',
  'constitucion',
  'politics',
  'election',
  'democrat',
  'republican',
  'biden',
  'trump',
  'boric',
  'kast',
  'parliament',
  'guerra',
  'militar',
  'geopolitics',
  'conflicto armado',
  'religion',
  'religioso',
  'iglesia',
  'papa francisco',
  'obispo',
  'vaticano',
  'doctrina',
  'evangelio',
  'fe catolica',
  'church',
  'pope',
  'catholic',
  'religious',
  'faith',
];

function isCleanContent(text: string): boolean {
  const lower = text.toLowerCase();
  return !BLACKLISTED_TERMS.some((term) => lower.includes(term));
}

// Catálogo Base Curado de Alta Fidelidad enfocado en Chile e Internacional por Escuela
const CURATED_NEWS_DATA: NewsItem[] = [
  // 1. INFORMÁTICA Y TELECOMUNICACIONES
  {
    id: 'info-chile-01',
    title: 'Chile inaugura su primer laboratorio abierto de Inteligencia Artificial Generativa y Ciberdefensa',
    subtitle: 'Alianza entre centros tecnológicos y sedes regionales para entrenar modelos LLM con datos locales.',
    content: `El ecosistema tecnológico chileno da un salto cualitativo con la puesta en marcha del primer laboratorio inter-sedes dedicado al entrenamiento de modelos de inteligencia artificial generativa con aplicación en la industria productiva. 

La iniciativa, impulsada con participación activa de estudiantes y docentes de Informática de Duoc UC, cuenta con clusters de computación de alto rendimiento (GPUs H100) instalados en Santiago y Concepción. El objetivo central es capacitar a más de 2,000 técnicos e ingenieros en seguridad de infraestructuras críticas, ciberdefensa automatizada y despliegue de microservicios soberanos.

"No se trata solo de consumir algoritmos creados en Silicon Valley, sino de desarrollar soluciones que respondan a la logística portuaria, minera y financiera de nuestro país", destacó la mesa directiva en la ceremonia inaugural. Los primeros prototipos de visión por computadora para detección de fallas ya operan en fase piloto con empresas asociadas.`,
    schoolSlug: 'informatica',
    schoolName: 'Informática y Telecomunicaciones',
    region: 'chile',
    regionLabel: '🇨🇱 Chile · Innovación Tecnológica',
    sourceName: 'Prensa CITT Chile',
    author: 'Ignacio Valenzuela',
    authorTitle: 'Docente Investigador · Sede San Joaquín',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-31T08:30:00Z',
    readingTime: '3 min',
    isHeroFeatured: true,
    tags: ['Inteligencia Artificial', 'Ciberseguridad', 'Cloud Computing', 'Chile'],
  },
  {
    id: 'info-global-02',
    title: 'Avance en computación cuántica tolerante a fallos marca nuevo hito en algoritmos criptográficos',
    subtitle: 'Nuevos procesadores de 1,000 qubits lógicos aceleran la investigación en criptografía post-cuántica.',
    content: `Científicos e ingenieros de software a nivel global han demostrado por primera vez la ejecución de algoritmos con corrección cuántica de errores sostenida durante más de cuatro horas ininterrumpidas.

El hallazgo, publicado en revistas científicas líderes, acelera la transición hacia estándares de cifrado post-cuántico (PQC), los mismos que el consorcio de telecomunicaciones de Duoc UC ha integrado recientemente en sus mallas curriculares de redes seguras. Los investigadores aseguran que la tecnología permitirá en el mediano plazo optimizar redes eléctricas inteligentes y cadenas de suministro globales.`,
    schoolSlug: 'informatica',
    schoolName: 'Informática y Telecomunicaciones',
    region: 'internacional',
    regionLabel: '🌎 Internacional · Ciencia de Cómputo',
    sourceName: 'Tech Wire Global',
    author: 'Elena Rostova',
    authorTitle: 'Corresponsal de Tecnologías Cuánticas',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-30T14:15:00Z',
    readingTime: '4 min',
    isHeroFeatured: false,
    tags: ['Computación Cuántica', 'Criptografía', 'Arquitectura'],
  },

  // 2. INGENIERÍA Y RECURSOS NATURALES
  {
    id: 'ing-chile-01',
    title: 'Desierto de Atacama: Piloto de microrredes solares autónomas con gemelos digitales e IoT',
    subtitle: 'Estudiantes y docentes de Ingeniería implementan sensores LoRaWAN para predecir rendimiento fotovoltaico.',
    content: `En una de las zonas con mayor radiación solar del planeta, equipos de la Escuela de Ingeniería y Recursos Naturales de Duoc UC desplegaron un sistema de microrredes inteligentes dotadas de gemelos digitales (Digital Twins).

El proyecto integra sensores ambientales LoRaWAN y algoritmos de control predictivo que reducen en un 18% las pérdidas de energía ocasionadas por el polvo desértico mediante aspersión robótica en seco. Los datos recopilados se transmiten en tiempo real a los laboratorios CITT de Concepción y Alameda, permitiendo a los alumnos monitorear telemetría industrial de grado operativo.`,
    schoolSlug: 'ingenieria',
    schoolName: 'Ingeniería y Recursos Naturales',
    region: 'chile',
    regionLabel: '🇨🇱 Chile · Energías Renovables',
    sourceName: 'Boletín de Energía & Minería',
    author: 'Carlos Vega',
    authorTitle: 'Coordinador de I+D Energética',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-31T07:00:00Z',
    readingTime: '4 min',
    isHeroFeatured: true,
    tags: ['Energía Solar', 'IoT', 'Automatización', 'Gemelos Digitales'],
  },
  {
    id: 'ing-global-02',
    title: 'Robots cuadrúpedos autónomos comienzan inspecciones geotécnicas en faenas subterráneas',
    subtitle: 'Sistemas equipados con escáner LiDAR y cámaras térmicas previenen incidentes en túneles de alta profundidad.',
    content: `La robótica aplicada a entornos de riesgo da un paso decisivo con la homologación internacional de cuadrúpedos autónomos de inspección minera. Equipados con navegación sin GPS mediante SLAM visual y sensores de gases tóxicos, estos dispositivos realizan rondas nocturnas autónomas, enviando mapas tridimensionales milimétricos al centro de control en superficie.`,
    schoolSlug: 'ingenieria',
    schoolName: 'Ingeniería y Recursos Naturales',
    region: 'internacional',
    regionLabel: '🌎 Internacional · Robótica Aplicada',
    sourceName: 'Robotics Engineering Review',
    author: 'Marcus Lindemann',
    authorTitle: 'Investigador en Mecatrónica de Campo',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-29T18:20:00Z',
    readingTime: '3 min',
    isHeroFeatured: false,
    tags: ['Robótica', 'LiDAR', 'Seguridad Minera'],
  },

  // 3. DISEÑO
  {
    id: 'diseno-chile-01',
    title: 'Diseño circular chileno: Biomateriales derivados del orujo de uva reemplazan plásticos en envases premium',
    subtitle: 'Premio nacional de ecodiseño destaca investigación de estudiantes de Diseño Industrial de Duoc UC Viña del Mar.',
    content: `El valle vitivinícola chileno genera anualmente miles de toneladas de orujo de uva que antes terminaban como residuo. Un equipo multidisciplinario de la Escuela de Diseño de Duoc UC, en colaboración con el hub CITT Viña del Mar, presentó un biomaterial termoconformable 100% biodegradable que se degrada en solo 90 días en compost doméstico.

El proyecto ya cuenta con el interés de viñas chilenas exportadoras que buscan sustituir bandejas y separadores sintéticos por este embalaje con aroma natural y acabado texturizado premium.`,
    schoolSlug: 'diseno',
    schoolName: 'Diseño',
    region: 'chile',
    regionLabel: '🇨🇱 Chile · Ecodiseño & Biomateriales',
    sourceName: 'Revista Diseño Sustentable CL',
    author: 'Valentina Soto Miranda',
    authorTitle: 'Diseñadora Industrial & Consejera',
    imageUrl: 'https://images.unsplash.com/photo-1581291518655-9523c932deda?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-31T06:15:00Z',
    readingTime: '3 min',
    isHeroFeatured: true,
    tags: ['Biomateriales', 'Economía Circular', 'Diseño Industrial'],
  },
  {
    id: 'diseno-global-02',
    title: 'Sistemas de diseño accesibles con tipografías dinámicas se imponen como estándar web global',
    subtitle: 'Nuevos lineamientos WCAG 3.0 integran inteligencia artificial para adaptar contrastes y microcopia en tiempo real.',
    content: `La comunidad global de diseño de interfaces celebra la adopción de tokens semánticos adaptativos que ajustan automáticamente la jerarquía visual de las aplicaciones según las capacidades psicomotrices y de visión del usuario final. Grandes estudios de producto digital adoptan esta metodología para erradicar las barreras de usabilidad en banca y educación.`,
    schoolSlug: 'diseno',
    schoolName: 'Diseño',
    region: 'internacional',
    regionLabel: '🌎 Internacional · UX & Accesibilidad',
    sourceName: 'Global UX Review',
    author: 'Sarah Jenkins',
    authorTitle: 'Directora de Accesibilidad Digital',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-29T11:40:00Z',
    readingTime: '4 min',
    isHeroFeatured: false,
    tags: ['UX/UI', 'Accesibilidad', 'Sistemas de Diseño'],
  },

  // 4. ADMINISTRACIÓN Y NEGOCIOS
  {
    id: 'negocios-chile-01',
    title: 'Fintech e inversión ángel en Chile: Startups de base tecnológica duplican rondas de capital semilla',
    subtitle: 'Santiago y Concepción se consolidan como polos de aceleración para soluciones de financiamiento B2B.',
    content: `El ecosistema de emprendimiento chileno experimenta un nuevo ciclo de maduración. Según el último informe de la Asociación Chilena de Venture Capital, las soluciones SaaS y Fintech creadas por graduados y fundadores jóvenes levantaron más de 85 millones de dólares en etapas tempranas durante el presente trimestre.

Los hubs de CITT Connect han jugado un rol facilitador clave mediante el programa de mentoría de negocios y validación de modelos comerciales con empresas aliadas como AWS y Santander Hub, promoviendo la internacionalización de proyectos nacidos en las aulas.`,
    schoolSlug: 'administracion',
    schoolName: 'Administración y Negocios',
    region: 'chile',
    regionLabel: '🇨🇱 Chile · Ecosistema Emprendedor',
    sourceName: 'Fintech & Capital Chile',
    author: 'Javiera Méndez',
    authorTitle: 'Especialista en Alianzas y VC',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-31T05:45:00Z',
    readingTime: '3 min',
    isHeroFeatured: true,
    tags: ['Fintech', 'Venture Capital', 'Startups', 'Chile'],
  },

  // 5. SALUD Y BIENESTAR
  {
    id: 'salud-chile-01',
    title: 'Telemedicina con visión artificial reduce tiempos de triaje y listas de espera en centros de salud del sur',
    subtitle: 'Proyecto CITT San Bernardo y Puerto Montt valida algoritmo de detección preliminar de lesiones cutáneas.',
    content: `Estudiantes de la Escuela de Salud y Bienestar de Duoc UC, guiados por docentes médicos y tecnólogos en informática, implementaron un sistema de tele-triaje dermatológico asistido por algoritmos de aprendizaje profundo en zonas rurales de la Región de Los Lagos.

La plataforma permite a técnicos en enfermería capturar imágenes estandarizadas con dermatoscopios portátiles acoplados a smartphones. El sistema analiza patrones de pigmentación y clasifica con un 94% de precisión las lesiones sospechosas que requieren derivación urgente con especialistas en el hospital base, descongestionando significativamente la atención primaria.`,
    schoolSlug: 'salud',
    schoolName: 'Salud y Bienestar',
    region: 'chile',
    regionLabel: '🇨🇱 Chile · HealthTech & Telemedicina',
    sourceName: 'Salud Digital Innovación',
    author: 'Dra. Patricia Morales',
    authorTitle: 'Docente Patrocinadora CITT Salud',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-31T08:00:00Z',
    readingTime: '4 min',
    isHeroFeatured: true,
    tags: ['HealthTech', 'Telemedicina', 'Diagnóstico IA'],
  },

  // 6. CONSTRUCCIÓN
  {
    id: 'construccion-chile-01',
    title: 'Industrialización de madera técnica y metodología BIM 7D impulsan la vivienda sustentable en Chile',
    subtitle: 'Nuevas técnicas de montaje rápido y trazabilidad de carbono marcan el estándar en edificación modular.',
    content: `La construcción en Chile transita hacia la industrialización descarbonizada. La Escuela de Construcción de Duoc UC, a través de sus sedes Maipú y Concepción, presentó un modelo piloto de vivienda modular en madera contralaminada (CLT) fabricada con control numérico CNC y modelada con estándar BIM 7D (sostenibilidad y ciclo de vida).

El edificio piloto, ensamblado en tiempo récord de 14 días sin generación de escombros húmedos, demostró una reducción de huella de carbono de un 62% en comparación con la albañilería tradicional, abriendo camino a un nuevo nicho para técnicos en edificación sustentable.`,
    schoolSlug: 'construccion',
    schoolName: 'Construcción',
    region: 'chile',
    regionLabel: '🇨🇱 Chile · Construcción Sustentable',
    sourceName: 'Plataforma Construcción Chile',
    author: 'Guillermo Aránguiz',
    authorTitle: 'Ingeniero Constructor & Docente BIM',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-31T07:30:00Z',
    readingTime: '3 min',
    isHeroFeatured: true,
    tags: ['BIM', 'Madera CLT', 'Edificación Sustentable'],
  },

  // 7. COMUNICACIÓN
  {
    id: 'comunicacion-chile-01',
    title: 'Producción virtual con pantallas LED y motores de videojuegos revoluciona el cine y la publicidad nacional',
    subtitle: 'Estudiantes de Animación y Comunicación Audiovisual de Duoc UC operan primer set de producción virtual inter-sedes.',
    content: `El rodaje con fondos croma verdes da paso a los volúmenes LED de producción virtual en tiempo real (In-Camera VFX). La Escuela de Comunicación de Duoc UC cuenta en sus sedes San Carlos de Apoquindo y Plaza Vespucio con paneles microLED sincronizados con Unreal Engine 5.

Esta infraestructura permite a los creadores iluminar escenas con luz ambiental realista y renderizar escenarios fotorealistas en vivo, reduciendo los costos de posproducción en un 40% y capacitando a los jóvenes en la tecnología utilizada por producciones de clase mundial.`,
    schoolSlug: 'comunicacion',
    schoolName: 'Comunicación',
    region: 'chile',
    regionLabel: '🇨🇱 Chile · Medios & Producción Virtual',
    sourceName: 'Audiovisual & Medios CL',
    author: 'Camila Soto',
    authorTitle: 'Líder Track Animación & XR',
    imageUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-31T06:40:00Z',
    readingTime: '3 min',
    isHeroFeatured: true,
    tags: ['Producción Virtual', 'Unreal Engine', 'Transmedia'],
  },

  // 8. GASTRONOMÍA
  {
    id: 'gastronomia-chile-01',
    title: 'FoodTech chileno: Rescate culinario de algas pardas y fermentación de precisión para alta gastronomía',
    subtitle: 'Escuela de Gastronomía de Duoc UC Valparaíso desarrolla harinas funcionales de alto valor proteico.',
    content: `La costa central chilena alberga una de las mayores reservas de macroalgas del océano Pacífico. La Escuela de Gastronomía de Duoc UC, a través de su centro tecnológico culinario, presentó una gama de productos gastronómicos que incorporan cochayuyo y luche sometidos a fermentación enzimática controlada.

El proceso elimina notas amargas indeseadas y potencia compuestos umami naturales, creando bases para panadería funcional, snacks saludables y salsas de alta cocina con bajo contenido de sodio y alto aporte de hierro y fibra marina.`,
    schoolSlug: 'gastronomia',
    schoolName: 'Gastronomía',
    region: 'chile',
    regionLabel: '🇨🇱 Chile · FoodTech & Cocina Sostenible',
    sourceName: 'Gaceta Gastronómica & FoodTech',
    author: 'Chef Marcelo Poblete',
    authorTitle: 'Maestro de Cocina & Docente CITT',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-31T07:15:00Z',
    readingTime: '4 min',
    isHeroFeatured: true,
    tags: ['FoodTech', 'Cocina Chilena', 'Sustentabilidad Marina'],
  },

  // 9. TURISMO Y HOSPITALIDAD
  {
    id: 'turismo-chile-01',
    title: 'Smart Tourism en la Patagonia: Pasaporte digital y trazabilidad de huella hídrica en rutas de trekking',
    subtitle: 'Sedes Villarrica y Puerto Montt implementan puntos NFC y balizas solares para ecoturismo regenerativo.',
    content: `El turismo de naturaleza en Chile se transforma con herramientas de computación ubicua. En senderos de alta afluencia de la Región de Los Ríos y Los Lagos, la Escuela de Turismo y Hospitalidad de Duoc UC desplegó balizas informativas autosustentables con tecnología NFC.

Los excursionistas registran su paso acercando su teléfono o credencial CITT, accediendo a mapas tridimensionales fuera de línea, alertas meteorológicas en tiempo real y cálculo automático de la huella de carbono neutralizada mediante proyectos locales de reforestación nativa.`,
    schoolSlug: 'turismo',
    schoolName: 'Turismo y Hospitalidad',
    region: 'chile',
    regionLabel: '🇨🇱 Chile · Smart Tourism & Ecoturismo',
    sourceName: 'Turismo & Hospitalidad Innova',
    author: 'Constanza Ríos',
    authorTitle: 'Coordinadora de Rutas Sostenibles',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-31T06:00:00Z',
    readingTime: '3 min',
    isHeroFeatured: true,
    tags: ['Smart Tourism', 'Patagonia', 'Ecoturismo', 'NFC'],
  },
];

// Intenta consultar feeds en vivo en español si hay conectividad
async function fetchLiveNewsFromFeeds(): Promise<NewsItem[]> {
  const liveItems: NewsItem[] = [];

  try {
    // 1. Fetch de Dev.to en español/latam (tag: ai, cloud, webdev)
    const devtoRes = await fetch(
      'https://dev.to/api/articles?tag=ai&per_page=5',
      { next: { revalidate: 3600 } }
    );

    if (devtoRes.ok) {
      const articles = await devtoRes.json();
      for (const a of articles) {
        if (!a.title || !isCleanContent(a.title + ' ' + (a.description || '')))
          continue;

        liveItems.push({
          id: `devto-${a.id}`,
          title: a.title,
          subtitle: a.description || 'Avance tecnológico en desarrollo y computación aplicada.',
          content: a.readable_publish_date ? `${a.description}\n\nPublicado originalmente por ${a.user?.name} en la red global de desarrolladores.` : a.description,
          schoolSlug: 'informatica',
          schoolName: 'Informática y Telecomunicaciones',
          region: 'internacional',
          regionLabel: '🌎 Internacional · Desarrollo & IA',
          sourceName: 'Dev.to Global Tech',
          sourceUrl: a.url,
          author: a.user?.name || 'Comunidad Dev',
          authorTitle: 'Ingeniero de Software & Contribuidor',
          imageUrl: a.cover_image || a.social_image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
          publishedAt: a.published_at || new Date().toISOString(),
          readingTime: `${a.reading_time_minutes || 3} min`,
          isHeroFeatured: false,
          tags: a.tag_list || ['Tecnología', 'Desarrollo'],
        });
      }
    }
  } catch (err) {
    console.warn('Aviso: Feed externo no disponible, usando banco editorial curado.', err);
  }

  return liveItems;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const schoolFilter = searchParams.get('school');
  const regionFilter = searchParams.get('region'); // 'chile' | 'internacional'

  // Obtener noticias curadas más feeds vivos
  const liveItems = await fetchLiveNewsFromFeeds();
  
  // Priorizar Chile primero, luego internacional, ordenado por fecha
  let allNews = [...CURATED_NEWS_DATA, ...liveItems];

  // Aplicar filtro de neutralidad institucional a todo el catálogo
  allNews = allNews.filter((item) =>
    isCleanContent(item.title + ' ' + item.subtitle + ' ' + item.content)
  );

  // Ordenar priorizando Chile primero
  allNews.sort((a, b) => {
    if (a.region === 'chile' && b.region !== 'chile') return -1;
    if (a.region !== 'chile' && b.region === 'chile') return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // Filtros opcionales
  if (schoolFilter && schoolFilter !== 'todos' && schoolFilter !== 'all') {
    allNews = allNews.filter((n) => n.schoolSlug === schoolFilter);
  }

  if (regionFilter && (regionFilter === 'chile' || regionFilter === 'internacional')) {
    allNews = allNews.filter((n) => n.region === regionFilter);
  }

  return NextResponse.json({
    status: 'ok',
    total: allNews.length,
    timestamp: new Date().toISOString(),
    editionDate: 'Sábado, 31 de Octubre de 2026',
    editionNumber: 1428,
    newspaperName: 'EL DIARIO CITT · LA GACETA DUOC UC',
    tagline: 'El Periódico Tecnológico Oficial de Duoc UC · 18 Sedes Conectadas',
    articles: allNews,
  });
}
