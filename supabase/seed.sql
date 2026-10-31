-- ============================================================================
-- SEED INSTITUCIONAL DIRECTO VIA SUPABASE CLI (POSTGRES ADMIN)
-- ============================================================================

-- PERFILES
INSERT INTO public.profiles (
  username, full_name, email, career_title, current_occupation,
  specialties, bio, role, campus_slug, school_slug, avatar_url,
  academic_track, is_open_to_collaborate, is_verified, linkedin_url, github_url
) VALUES
(
  'vicente.vasquez', 'Vicente Vásquez Contreras', 'vi.vasquezc@duocuc.cl',
  'Ingeniería en Informática', 'Lead Full-Stack Developer & CITT Architect',
  ARRAY['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Hardware IoT'],
  'Líder técnico del ecosistema CITT Connect y arquitecto del Catálogo Nacional. Enfocado en soluciones de alto impacto y vinculación tecnológica inter-sedes.',
  'dev', 'san-bernardo', 'informatica',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
  'Semestre 7 · Diurno', true, true,
  'https://linkedin.com/in/vicente-vasquez', 'https://github.com/vicenteivc16'
),
(
  'patricio.gonzalez', 'Patricio González Valdés', 'p.gonzalez@profesor.duoc.cl',
  'Docente & Coordinador CITT', 'Docente Escuela de Informática y Telecomunicaciones',
  ARRAY['IoT', 'Microcontroladores', 'Sistemas Embebidos', 'Ciberseguridad'],
  'Coordinador general del Centro de Innovación y Transferencia Tecnológica en Sede San Bernardo. Mentor de proyectos TRL avanzados.',
  'personal_duoc', 'san-bernardo', 'informatica',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'Cuerpo Docente Institucional', true, true, NULL, NULL
),
(
  'sofia.matus', 'Sofía Matus Silva', 'so.matus@duocuc.cl',
  'Diseño Industrial', 'Líder Estudiantil CITT · Laboratorio Maker',
  ARRAY['Modelado 3D', 'Fusion 360', 'Impresión 3D', 'Prototipado Rápido', 'Design Thinking'],
  'Líder de diseño en Sede Plaza Vespucio. Especialista en carcasas ergonómicas, fabricación digital y validación de usuarios.',
  'lider_citt', 'plaza-vespucio', 'diseno',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'Semestre 6 · Diurno', true, true, NULL, NULL
),
(
  'martin.silva', 'Martín Silva Paredes', 'm.silvap@duocuc.cl',
  'Ingeniería en Conectividad y Redes', 'Consejero de Carrera & Especialista en Ciberseguridad',
  ARRAY['Pentesting', 'Linux', 'Ethical Hacking', 'Infraestructura Cloud', 'Cisco'],
  'Consejero estudiantil. Puente de comunicación entre alumnos de redes y los desafíos de ciberseguridad del CITT.',
  'consejero_carrera', 'maipu', 'comunicacion',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'Semestre 8 · Vespertino', true, true, NULL, NULL
),
(
  'camila.valenzuela', 'Camila Valenzuela Ríos', 'ca.valenzuelar@duocuc.cl',
  'Desarrollo y Diseño Web', 'Frontend Developer & UI Specialist',
  ARRAY['UI/UX', 'Figma', 'React', 'Tailwind', 'Accesibilidad Web'],
  'Estudiante apasionada por interfaces claras, accesibilidad WCAG y micro-interacciones.',
  'usuario_citt', 'san-bernardo', 'informatica',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  'Semestre 4 · Diurno', true, true, NULL, NULL
)
ON CONFLICT (username) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  campus_slug = EXCLUDED.campus_slug,
  school_slug = EXCLUDED.school_slug;

-- PROYECTOS
INSERT INTO public.projects (
  slug, title, summary, status, lead_username, lead_name, lead_role,
  origin_campus_slug, school_slug, looking_for_collaborators, needed_specialties,
  help_request_details, repo_url, cover_image_url, readme_content, maturity_stage,
  is_featured, featured_reason
) VALUES
(
  'telemetria-agricola-lorawan',
  'Sistema de Telemetría Agrícola de Bajo Costo con LoRaWAN',
  'Monitoreo de estrés hídrico y microclima en cultivos de la Región Metropolitana mediante red de sensores autónomos alimentados por energía solar.',
  'prototipo', 'vicente.vasquez', 'Vicente Vásquez Contreras', 'dev',
  'san-bernardo', 'informatica', true,
  ARRAY['Agronomía', 'Electrónica', 'Diseño CAD', 'Data Science'],
  'Buscamos alumnos de Ingeniería Agrícola o Recursos Naturales para calibrar sensores de humedad del suelo en terreno.',
  'https://github.com/citt-duocuc/lorawan-agritech-telemetry',
  'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80',
  '# Telemetría Agrícola LoRaWAN\n\nProyecto inter-sedes desarrollado en el CITT San Bernardo...',
  'pruebas_campo', true,
  'Proyecto con validación en viñas del Maipo y transferencia tecnológica en curso.'
),
(
  'exoesqueleto-rehabilitacion-motriz',
  'Órtesis Activa y Exoesqueleto de Mano para Rehabilitación Motriz',
  'Dispositivo electromecánico impreso en 3D con actuadores lineales para terapia kinésica asistida en personas con secuelas de ACV.',
  'prototipo', 'sofia.matus', 'Sofía Matus Silva', 'lider_citt',
  'plaza-vespucio', 'diseno', true,
  ARRAY['Kinesiología', 'Electrónica', 'Programación C++', 'Biomecánica'],
  'Se requiere validar el rango de movimiento con docentes o estudiantes de la Escuela de Salud.',
  'https://github.com/citt-duocuc/hand-exoskeleton-rehab',
  'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
  '# Órtesis Activa CITT\n\nFabricación aditiva en PETG y control por sensores EMG.',
  'prototipado', true,
  'Finalista en concurso nacional de innovación en salud y biotecnología.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  maturity_stage = EXCLUDED.maturity_stage;

-- POLÍTICAS RLS PERMISIVAS PARA LA APLICACIÓN CLIENTE
DO $$ BEGIN
  DROP POLICY IF EXISTS "Inserción de perfiles" ON public.profiles;
  CREATE POLICY "Inserción de perfiles" ON public.profiles FOR INSERT WITH CHECK (true);
  DROP POLICY IF EXISTS "Actualización de perfiles" ON public.profiles;
  CREATE POLICY "Actualización de perfiles" ON public.profiles FOR UPDATE USING (true);
  DROP POLICY IF EXISTS "Inserción de proyectos" ON public.projects;
  CREATE POLICY "Inserción de proyectos" ON public.projects FOR INSERT WITH CHECK (true);
  DROP POLICY IF EXISTS "Actualización de proyectos" ON public.projects;
  CREATE POLICY "Actualización de proyectos" ON public.projects FOR UPDATE USING (true);
  DROP POLICY IF EXISTS "Inserción de posts" ON public.posts;
  CREATE POLICY "Inserción de posts" ON public.posts FOR INSERT WITH CHECK (true);
  DROP POLICY IF EXISTS "Actualización de posts" ON public.posts;
  CREATE POLICY "Actualización de posts" ON public.posts FOR UPDATE USING (true);
EXCEPTION WHEN OTHERS THEN NULL; END $$;
