const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xwocptujausuyxkpcrzb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3b2NwdHVqYXVzdXl4a3BjcnpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MTczOTYsImV4cCI6MjEwODk5MzM5Nn0.55IzKdRRyWkQum5PGtmik4AZhCLZU9VnytiSVgpq_pM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('--- SEEDING SUPABASE FROM CITT CONNECT ---');

  // 1. SEED PROFILES
  const profiles = [
    {
      username: 'vicente.vasquez',
      full_name: 'Vicente Vásquez Contreras',
      email: 'vi.vasquezc@duocuc.cl',
      career_title: 'Ingeniería en Informática',
      current_occupation: 'Lead Full-Stack Developer & CITT Architect',
      specialties: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Hardware IoT'],
      bio: 'Líder técnico del ecosistema CITT Connect y arquitecto del Catálogo Nacional. Enfocado en soluciones de alto impacto y vinculación tecnológica inter-sedes.',
      role: 'dev',
      campus_slug: 'san-bernardo',
      school_slug: 'informatica',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
      banner_url: '/assets/citt-hero-lobby.webp',
      academic_track: 'Semestre 7 · Diurno',
      achievements: ['Core Dev CITT Connect', 'Ganador Hackathon Nacional Duoc UC', 'Certificación AWS Cloud Practitioner'],
      is_open_to_collaborate: true,
      is_verified: true,
      linkedin_url: 'https://linkedin.com/in/vicente-vasquez',
      github_url: 'https://github.com/vicenteivc16'
    },
    {
      username: 'patricio.gonzalez',
      full_name: 'Patricio González Valdés',
      email: 'p.gonzalez@profesor.duoc.cl',
      career_title: 'Docente & Coordinador CITT',
      current_occupation: 'Docente Escuela de Informática y Telecomunicaciones',
      specialties: ['IoT', 'Microcontroladores', 'Sistemas Embebidos', 'Ciberseguridad'],
      bio: 'Coordinador general del Centro de Innovación y Transferencia Tecnológica en Sede San Bernardo. Mentor de proyectos TRL avanzados.',
      role: 'personal_duoc',
      campus_slug: 'san-bernardo',
      school_slug: 'informatica',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      banner_url: '/assets/banner-iot.webp',
      academic_track: 'Cuerpo Docente Institucional',
      achievements: ['Docente Destacado 2025', 'Líder Programa de Transferencia Tecnológica'],
      is_open_to_collaborate: true,
      is_verified: true
    },
    {
      username: 'sofia.matus',
      full_name: 'Sofía Matus Silva',
      email: 'so.matus@duocuc.cl',
      career_title: 'Diseño Industrial',
      current_occupation: 'Líder Estudiantil CITT · Laboratorio Maker',
      specialties: ['Modelado 3D', 'Fusion 360', 'Impresión 3D', 'Prototipado Rápido', 'Design Thinking'],
      bio: 'Líder de diseño en Sede Plaza Vespucio. Especialista en carcasas ergonómicas, fabricación digital y validación de usuarios.',
      role: 'lider_citt',
      campus_slug: 'plaza-vespucio',
      school_slug: 'diseno',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      banner_url: '/assets/banner-comunidad.webp',
      academic_track: 'Semestre 6 · Diurno',
      achievements: ['Líder CITT Sede Plaza Vespucio', 'Premio Innovación Diseña Duoc'],
      is_open_to_collaborate: true,
      is_verified: true
    },
    {
      username: 'martin.silva',
      full_name: 'Martín Silva Paredes',
      email: 'm.silvap@duocuc.cl',
      career_title: 'Ingeniería en Conectividad y Redes',
      current_occupation: 'Consejero de Carrera & Especialista en Ciberseguridad',
      specialties: ['Pentesting', 'Linux', 'Ethical Hacking', 'Infraestructura Cloud', 'Cisco'],
      bio: 'Consejero estudiantil. Puente de comunicación entre alumnos de redes y los desafíos de ciberseguridad del CITT.',
      role: 'consejero_carrera',
      campus_slug: 'maipu',
      school_slug: 'comunicacion',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      banner_url: '/assets/banner-iot.webp',
      academic_track: 'Semestre 8 · Vespertino',
      achievements: ['Consejero Oficial de Carrera', 'Top 5 CTF Inter-Universitario'],
      is_open_to_collaborate: true,
      is_verified: true
    },
    {
      username: 'camila.valenzuela',
      full_name: 'Camila Valenzuela Ríos',
      email: 'ca.valenzuelar@duocuc.cl',
      career_title: 'Desarrollo y Diseño Web',
      current_occupation: 'Frontend Developer & UI Specialist',
      specialties: ['UI/UX', 'Figma', 'React', 'Tailwind', 'Accesibilidad Web'],
      bio: 'Estudiante apasionada por interfaces claras, accesibilidad WCAG y micro-interacciones.',
      role: 'usuario_citt',
      campus_slug: 'san-bernardo',
      school_slug: 'informatica',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
      banner_url: '/assets/citt-hero-lobby.webp',
      academic_track: 'Semestre 4 · Diurno',
      achievements: ['Pase Digital NFC Activo'],
      is_open_to_collaborate: true,
      is_verified: true
    }
  ];

  const { data: profData, error: profErr } = await supabase.from('profiles').upsert(profiles, { onConflict: 'username' });
  if (profErr) console.error('Error seeding profiles:', profErr.message);
  else console.log('✓ Profiles seeded successfully (', profiles.length, 'records)');

  // 2. SEED ACTIVITIES
  const activities = [
    {
      slug: 'bootcamp-iot-esp32-lorawan',
      title: 'Bootcamp IoT & Sensores de Telemetría con ESP32 y LoRaWAN',
      description: 'Aprende a programar microcontroladores ESP32 en C++ y MicroPython para capturar métricas ambientales y enviarlas a gateways LoRaWAN institucionales.',
      detailed_description: 'Este taller práctico capacita a estudiantes de cualquier carrera en el despliegue de nodos sensores de bajo consumo. Cada participante utilizará un kit de desarrollo provisto por el CITT compuesto por sensores DHT22, sondas de humedad capacitivas y transceptores SX1276. Al finalizar, los proyectos se integran con una API en Node-RED y paneles en tiempo real.',
      school_slug: 'informatica',
      campus_slug: 'san-bernardo',
      room_location: 'Sala CITT 312 · San Bernardo',
      modality: 'presencial',
      status: 'abierto',
      instructor_name: 'Patricio González',
      instructor_role: 'personal_duoc',
      instructor_username: 'patricio.gonzalez',
      instructor_avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      capacity_per_session: 15,
      sessions_count_per_week: 2,
      total_seats: 30,
      days_description: 'Martes y Jueves (Turno A: 17:00 · Turno B: 18:45)',
      session_time: '17:00 - 20:15',
      frequency_per_week: 2,
      duration_weeks: 4,
      start_date: '2026-11-10',
      end_date: '2026-12-05',
      total_hours_citt: 16,
      tags: ['IoT', 'ESP32', 'LoRaWAN', 'Electrónica', 'Horas CITT'],
      cover_image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      study_materials: [
        {
          id: 'mat-esp32-pinout',
          title: 'Guía Técnica: Pinout y Alimentación ESP32 DevKit V1',
          description: 'Documento PDF con precauciones de voltaje, buses I2C y SPI recomendados en laboratorios Duoc UC.',
          type: 'pdf',
          url: 'https://citt.duoc.cl/docs/guias/esp32-pinout-reference.pdf',
          fileSizeOrDuration: '2.4 MB',
          uploadedAt: 'Hace 3 días'
        },
        {
          id: 'mat-github-esp32-starter',
          title: 'Repositorio GitHub: Starter Kit MicroPython & LoRa Duoc',
          description: 'Código base con librerías optimizadas para conexión a gateway The Things Network (TTN).',
          type: 'github',
          url: 'https://github.com/citt-duocuc/esp32-lorawan-telemetry-starter',
          uploadedAt: 'Hace 2 días'
        }
      ]
    },
    {
      slug: 'workshop-fabricacion-digital-impresion-3d',
      title: 'Workshop de Fabricación Digital & Modelado Paramétrico 3D',
      description: 'Domina el modelado 3D en Autodesk Fusion 360 y la calibración avanzada de impresoras Bambu Lab X1-Carbon y cortadoras láser.',
      detailed_description: 'Enfocado en diseñadores e ingenieros que necesiten materializar prototipos de hardware, carcasas ergonómicas y engranajes mecánicos. Se enseñará cálculo de tolerancias, selección de polímeros (PLA, PETG, TPU flexible) y post-procesado para acabados industriales de alta fidelidad.',
      school_slug: 'diseno',
      campus_slug: 'plaza-vespucio',
      room_location: 'FabLab CITT · Plaza Vespucio',
      modality: 'presencial',
      status: 'abierto',
      instructor_name: 'Sofía Matus',
      instructor_role: 'lider_citt',
      instructor_username: 'sofia.matus',
      instructor_avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      capacity_per_session: 12,
      sessions_count_per_week: 2,
      total_seats: 24,
      days_description: 'Lunes y Miércoles (15:30 a 17:30)',
      session_time: '15:30 - 17:30',
      frequency_per_week: 2,
      duration_weeks: 3,
      start_date: '2026-11-17',
      end_date: '2026-12-08',
      total_hours_citt: 12,
      tags: ['Impresión 3D', 'Fusion 360', 'Diseño Industrial', 'Maker', 'Horas CITT'],
      cover_image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      study_materials: [
        {
          id: 'mat-tolerancias-3d',
          title: 'Manual de Tolerancias y Encajes Mecánicos en Impresión FDM',
          description: 'Parámetros de compensación dimensional en slicers OrcaSlicer y Bambu Studio.',
          type: 'pdf',
          url: 'https://citt.duoc.cl/docs/fablab/tolerancias-fdm-guia.pdf',
          fileSizeOrDuration: '4.1 MB',
          uploadedAt: 'Hace 5 días'
        }
      ]
    },
    {
      slug: 'seminario-ia-llms-locales-ollama',
      title: 'Seminario de Inteligencia Artificial: LLMs Locales con Ollama & LangChain',
      description: 'Construye asistentes inteligentes que corren localmente en GPU sin enviar datos confidenciales a la nube mediante arquitecturas RAG.',
      detailed_description: 'Diseñado para estudiantes de informática y telecomunicaciones que buscan comprender la ingeniería de prompts y Retrieval-Augmented Generation (RAG). Se realizarán demostraciones con modelos Llama 3 y DeepSeek corriendo en servidores del CITT con bases de datos vectoriales ChromaDB.',
      school_slug: 'informatica',
      campus_slug: 'vina-del-mar',
      room_location: 'Auditorio CITT & Transmisión Teams · Viña del Mar',
      modality: 'hibrido',
      status: 'abierto',
      instructor_name: 'Vicente Vásquez',
      instructor_role: 'dev',
      instructor_username: 'vicente.vasquez',
      instructor_avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      capacity_per_session: 25,
      sessions_count_per_week: 1,
      total_seats: 50,
      days_description: 'Viernes Intensivo (16:00 a 19:00)',
      session_time: '16:00 - 19:00',
      frequency_per_week: 1,
      duration_weeks: 4,
      start_date: '2026-11-14',
      end_date: '2026-12-12',
      total_hours_citt: 16,
      tags: ['IA Generativa', 'Ollama', 'Python', 'LangChain', 'Horas CITT'],
      cover_image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      study_materials: [
        {
          id: 'mat-rag-repo',
          title: 'Repositorio GitHub: Pipeline RAG en Python con LangChain & FastAPI',
          description: 'Plantilla de inicio con vectorización de PDFs y embeddings en memoria.',
          type: 'github',
          url: 'https://github.com/citt-duocuc/citt-rag-ollama-starter',
          uploadedAt: 'Hace 1 semana'
        }
      ]
    }
  ];

  const { data: actData, error: actErr } = await supabase.from('activities').upsert(activities, { onConflict: 'slug' }).select();
  if (actErr) console.error('Error seeding activities:', actErr.message);
  else console.log('✓ Activities seeded successfully (', actData.length, 'records)');

  // 3. SEED ENROLLMENT SAMPLE
  if (actData && actData.length > 0) {
    const enrollments = [
      {
        activity_id: actData[0].id,
        username: 'camila.valenzuela',
        user_email: 'ca.valenzuelar@duocuc.cl',
        user_full_name: 'Camila Valenzuela Ríos',
        user_role: 'usuario_citt',
        user_campus_slug: 'san-bernardo',
        user_school_slug: 'informatica',
        status: 'confirmed'
      }
    ];
    const { error: enrErr } = await supabase.from('activity_enrollments').upsert(enrollments, { onConflict: 'activity_id,username' });
    if (enrErr) console.error('Error seeding enrollments:', enrErr.message);
    else console.log('✓ Enrollments seeded successfully');
  }

  // 4. SEED PROJECTS
  const projects = [
    {
      slug: 'telemetria-agricola-lorawan',
      title: 'Sistema de Telemetría Agrícola de Bajo Costo con LoRaWAN',
      summary: 'Monitoreo de estrés hídrico y microclima en cultivos de la Región Metropolitana mediante red de sensores autónomos alimentados por energía solar.',
      status: 'prototipo',
      lead_username: 'vicente.vasquez',
      lead_name: 'Vicente Vásquez Contreras',
      lead_role: 'dev',
      origin_campus_slug: 'san-bernardo',
      school_slug: 'informatica',
      looking_for_collaborators: true,
      needed_specialties: ['Agronomía', 'Electrónica', 'Diseño CAD', 'Data Science'],
      help_request_details: 'Buscamos alumnos de Ingeniería Agrícola o Recursos Naturales para calibrar sensores de humedad del suelo en terreno.',
      repo_url: 'https://github.com/citt-duocuc/lorawan-agritech-telemetry',
      cover_image_url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80',
      readme_content: '# Telemetría Agrícola LoRaWAN\n\nProyecto inter-sedes desarrollado en el CITT San Bernardo...',
      maturity_stage: 'pruebas_campo',
      is_featured: true,
      featured_reason: 'Proyecto con validación en viñas del Maipo y transferencia tecnológica en curso.'
    },
    {
      slug: 'exoesqueleto-rehabilitacion-motriz',
      title: 'Órtesis Activa y Exoesqueleto de Mano para Rehabilitación Motriz',
      summary: 'Dispositivo electromecánico impreso en 3D con actuadores lineales para terapia kinésica asistida en personas con secuelas de ACV.',
      status: 'prototipo',
      lead_username: 'sofia.matus',
      lead_name: 'Sofía Matus Silva',
      lead_role: 'lider_citt',
      origin_campus_slug: 'plaza-vespucio',
      school_slug: 'diseno',
      looking_for_collaborators: true,
      needed_specialties: ['Kinesiología', 'Electrónica', 'Programación C++', 'Biomecánica'],
      help_request_details: 'Se requiere validar el rango de movimiento con docentes o estudiantes de la Escuela de Salud.',
      repo_url: 'https://github.com/citt-duocuc/hand-exoskeleton-rehab',
      cover_image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      readme_content: '# Órtesis Activa CITT\n\nFabricación aditiva en PETG y control por sensores EMG.',
      maturity_stage: 'prototipado',
      is_featured: true,
      featured_reason: 'Finalista en concurso nacional de innovación en salud y biotecnología.'
    }
  ];

  const { data: prjData, error: prjErr } = await supabase.from('projects').upsert(projects, { onConflict: 'slug' });
  if (prjErr) console.error('Error seeding projects:', prjErr.message);
  else console.log('✓ Projects seeded successfully (', projects.length, 'records)');

  // 5. SEED RESERVATIONS (CALENDARIO CITT)
  const reservations = [
    {
      room: 'Sala CITT 312',
      campus: 'San Bernardo',
      in_charge_name: 'Vicente Vásquez',
      in_charge_email: 'vi.vasquezc@duocuc.cl',
      in_charge_role: 'dev',
      school: 'Escuela de Informática y Telecom.',
      reservation_date: '2026-11-04',
      time_slot: '10:00 - 11:30',
      purpose: 'Sesión de Prototipado IoT LoRaWAN y Telemetría',
      attendees: 4,
      requires_computers: true,
      status: 'CONFIRMED',
      source: 'TOTEM_QR',
      totem_token: 'citt_kiosk_sb_84920',
      horas_citt: '1.5 hrs',
      checked_in: true
    },
    {
      room: 'FabLab Maker',
      campus: 'Plaza Vespucio',
      in_charge_name: 'Sofía Matus',
      in_charge_email: 'so.matus@duocuc.cl',
      in_charge_role: 'lider_citt',
      school: 'Escuela de Diseño',
      reservation_date: '2026-11-05',
      time_slot: '15:30 - 17:30',
      purpose: 'Taller de Impresión 3D y Tolerancias en Bambu Lab',
      attendees: 12,
      requires_computers: false,
      status: 'CONFIRMED',
      source: 'TOTEM_QR',
      totem_token: 'citt_kiosk_pv_19283',
      horas_citt: '2.0 hrs',
      checked_in: false
    }
  ];

  const { error: resErr } = await supabase.from('reservations').insert(reservations);
  if (resErr) console.error('Error seeding reservations:', resErr.message);
  else console.log('✓ Reservations seeded successfully');

  console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
}

seed().catch(console.error);
