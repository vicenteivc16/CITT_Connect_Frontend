# 05. Diseño de las 7 Vistas del Sistema y Arquitectura de los 6 Roles

> **Repositorio:** `CITT_Connect_Frontend`
> **Dirección Visual Seleccionada:** **Opción A — *"Phygital Pass & Spotlight"*** (Linear + Apple Wallet + Read.cv)
> **Stack UI:** Tailwind CSS (Tokens Kit Digital Duoc UC) + **Radix UI (`@radix-ui/primitives`)** + **Framer Motion**.

---

## 1. Sistema Oficial de 6 Roles de CITT Connect

Cada usuario dentro de **CITT Connect** posee uno de los **6 roles oficiales**, los cuales determinan tanto sus permisos en el sistema como el **acabado visual de su Credencial Digital (Pass)** y su *Badge* identificatorio:

| Rol (`citt_role`) | Nombre Visible | Nivel / Propósito en la Comunidad | Distintivo Visual en Tarjeta y Perfil |
| :--- | :--- | :--- | :--- |
| **`personal_duoc`** | **Personal Duoc** | **Rango Institucional Más Alto:** Coordinadores CITT, Docentes y Directivos Duoc UC. Autoridad institucional transversal. | Borde y sello **Amarillo Duoc (`#FFB800`)** con ícono `ShieldCheck` e indicador *"Institucional Duoc UC"*. |
| **`lider_citt`** | **Líder CITT** | **Autoridad Interna CITT:** Capitanes y Líderes de Track/Área dentro de cada sede. Organizan proyectos, eventos y validan equipos. | Acento **Azul Circuito CITT (`#307FE2`) + Dorado (`#FFB800`)** con ícono `Crown` / `Cpu`. |
| **`consejero_carrera`** | **Consejero de Carrera** | **Puente CITT ↔ Alumnado Duoc:** Perfiles especiales que mantienen el contacto directo entre el CITT y los estudiantes de Duoc UC que aún no tienen cuenta en CITT Connect. | Acento **Esmeralda/Cian (`#00A499` / `#2AD2C9`)** con ícono `Compass` y etiqueta *"Puente de Carrera"*. |
| **`usuario_citt`** | **Miembro CITT** | **Núcleo de la Comunidad:** Estudiantes e integrantes activos de todas las carreras que participan en algún CITT de Chile. | Acento según el **Color Oficial de su Escuela Duoc UC** + Azul CITT (`#307FE2`). |
| **`partner`** | **Partner Oficial** | **Alianza Externa / Industria:** Empresas, mentores externos o instituciones vinculadas al CITT autorizadas para publicar desafíos, anuncios, charlas u oportunidades laborales/prácticas. | Acento **Púrpura/Platino (`#AC4FC6` / `#EEEEEE`)** con ícono `Handshake` / `Building2` y sello *"Partner Verificado"*. |
| **`dev`** | **Core Dev** | **Desarrolladores de Plataforma:** Equipo creador y administrador técnico de **CITT Connect**. | Acento **Terminal / Circuito (`#307FE2` + `#FFFFFF`)** con ícono `Terminal` y badge *"CITT Connect Dev"*. |

---

## 2. Datos Esenciales de la Base Inicial (MVP de Contacto Rápido)

Para garantizar que el intercambio de contacto sea instantáneo, limpio y profesional desde la primera versión, cada perfil estructura la siguiente ficha base:

1. **Nombre Completo** (`full_name`)
2. **Ocupación Actual** (`current_occupation` — ej. *"Estudiante Ing. en Informática & Investigador Robótica"* o *"Tech Lead en Empresa Partner"*)
3. **Título / Carrera** (`career_title` — ej. *"Ingeniería en Informática"*, *"Diseño Gráfico"*, *"Ingeniería en Conectividad y Redes"*) + **Escuela Duoc UC** y **Sede CITT**
4. **Rol en la Comunidad** (`citt_role` — uno de los 6 roles oficiales)
5. **Correo Electrónico de Contacto** (`public_email`)
6. **Especialidades / Áreas de Dominio** (`specialties` — ej. `["Ciberseguridad", "React / Next.js", "Impresión 3D", "IA Aplicada"]`)
7. **Perfil de LinkedIn y Redes Sociales / Enlaces Profesionales** (`linkedin_url`, `github_url`, `portfolio_url`, `instagram_url`, `twitter_url`)
8. **Código QR Dinámico Integrado:** Generado dentro de su propio perfil con el [Emblema Azul 3D CITT (`citt-logo.webp`)](../assets/citt-logo.webp) al centro, dirigiendo sin intermediarios a su perfil público `/u/[username]`, acompañado del botón **"Guardar en Contactos (`.vcf`)"**.

---

## 3. Especificación de las 7 Vistas del Sistema (*Opción A: "Phygital Pass & Spotlight"*)

### Vista 1: Landing & Galería Interactiva *Spotlight* (`/`)
* **Propósito:** Punto de entrada de alto impacto y directorio visual rápido de la comunidad CITT.
* **Composición:**
  * **Header Flotante (`#1A1A1A/90` con `backdrop-blur-md`):** Emblema 3D CITT `.webp`, navegación principal (*Explorar Galería*, *Proyectos Inter-Sedes*, *Feed & Partners*, *Mi Credencial QR*) y buscador rápido (`Cmd + K` con `@radix-ui/react-dialog`).
  * **Barra de Filtros Precisos (`Radix Select` & `Tabs`):** Filtrado instantáneo por **Rol** (*Todos, Líderes CITT, Consejeros de Carrera, Personal Duoc, Partners, Devs*), **Sede CITT**, **Escuela Duoc UC** y **Especialidad**.
  * **Grilla Interactiva *Spotlight Blur*:**
    * En reposo, las tarjetas descansan sobre el lienzo `#000000` con superficie `#1A1A1A` y borde `#262626`.
    * Al hacer *hover* o *tap* en un miembro, las demás tarjetas se atenúan con un desenfoque suave (`blur-[2px] opacity-45`), mientras la tarjeta activa se ilumina con el borde de su Rol/Escuela y despliega acceso directo a su **LinkedIn**, **Correo**, **Ocupación**, **Especialidades** y vista previa de su **Pase QR**.

### Vista 2: Perfil Público & Credencial Interactiva 3D (`/u/[username]`)
* **Propósito:** La vista que se abre en `< 1s` cuando alguien escanea el QR de un miembro (o acerca su celular al futuro Pin NFC). No requiere iniciar sesión para verla.
* **Experiencia *"Phygital Pass"* (Frente y Reverso con Giro 3D):**
  * **Frente de la Credencial:**
    * Cabecera con el **Emblema Azul 3D CITT**, *Badge* del **Rol** (ej. *Líder CITT*, *Consejero de Carrera*, *Partner*) y color oficial de su **Escuela Duoc UC**.
    * Fotografía nítida, **Nombre Completo**, **Ocupación Actual**, **Título / Carrera** y **Sede CITT**.
    * Bloque de **Especialidades** estilizadas como chips técnicos.
    * Botones de acción inmediata: **"Guardar en Contactos (.vcf)"** (en Amarillo Duoc `#FFB800` con texto `#000000` en negrita), **LinkedIn**, **Correo Directo**, **GitHub / Portafolio / Redes** y botón **"Mostrar Código QR"**.
  * **Reverso de la Credencial (Flip 3D o Modal `@radix-ui/react-dialog`):**
    * Superficie de alto contraste `#EEEEEE` con el **Código QR Dinámico** apuntando a `/u/[username]` y el logo `citt-logo.webp` al centro, listo para ser escaneado por otro teléfono en eventos o pasillos.

### Vista 3: Mi Perfil, Editor en Vivo y Generador QR (`/mi-perfil`)
* **Propósito:** Panel personal donde el miembro edita su información y obtiene su código QR.
* **Composición a 2 Columnas (Escritorio) / Pestañas `@radix-ui/react-tabs` (Móvil):**
  * **Columna Izquierda (Formulario Reactivo):** Edición de Nombre Completo, Correo, Título/Carrera, Sede, Escuela, Ocupación Actual, Especialidades (etiquetas dinámicas) y enlaces a LinkedIn + otras redes sociales.
  * **Columna Derecha (Vista Previa en Vivo + Generador QR):** Muestra en tiempo real cómo se ve su **Credencial Digital** y permite abrir a pantalla completa o descargar en PNG/SVG su **Código QR oficial CITT Connect**.

### Vista 4: Acceso e Identidad Institucional (`/acceso`)
* **Propósito:** Inicio de sesión y registro seguro conectado a Supabase Auth, explicando claramente los perfiles de *Miembro/Líder/Consejero/Personal Duoc* (`@duocuc.cl` / `@profesor.duoc.cl`) y el acceso para *Partners* invitados.

### Vista 5: Hub de Proyectos Inter-Sedes y "Pedir Ayuda" (`/proyectos`)
* **Propósito:** Conectar el talento de distintas sedes y carreras de Chile en torno a proyectos reales.
* **Composición:**
  * Tarjetas de proyectos con estado (*Idea, En Desarrollo, Prototipo, Finalizado*), sede de origen y carreras involucradas.
  * **Modo *"Buscamos Colaboradores / Pedir Ayuda Técnica"*:** Destaca qué especialidades se necesitan de otras sedes (ej. *"CITT Concepción busca 1 estudiante de Diseño y 1 de Ciberseguridad de cualquier sede"*).

### Vista 6: Feed Nacional, Consejeros y Oportunidades Partner (`/muro`)
* **Propósito:** Canal de comunicación ágil entre todas las sedes CITT de Chile.
* **Composición con `@radix-ui/react-tabs`:**
  * **Tab 1 — Noticias y Logros Inter-Sedes:** Publicaciones de `Líderes CITT` y `Personal Duoc`.
  * **Tab 2 — Oportunidades Partner:** Anuncios exclusivos de empresas `Partner` (prácticas, desafíos tecnológicos, charlas, patrocinios).
  * **Tab 3 — Puente de Consejeros de Carrera:** Espacio donde los `Consejeros de Carrera` levantan iniciativas o dudas de alumnos de Duoc UC hacia la red CITT.

### Vista 7: Consola de Gobernanza y Roles (`/admin`)
* **Propósito:** Vista exclusiva para `Personal Duoc`, `Líder CITT` y `Dev` donde se asignan los roles especiales (`consejero_carrera`, `lider_citt`, `partner`), se verifican perfiles por sede y se preparan los lotes de tags NFC para la Fase 4.
