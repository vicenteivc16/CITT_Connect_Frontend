# 04. Roadmap de Desarrollo — Frontend (`CITT_Connect_Frontend`)

> **Planificación de Pantallas, Sistema de Temas, Autenticación por Dominio Duoc UC y Despliegue en Vercel**

---

## Fase 0: Setup Base, Paleta Oficial Duoc UC y Sistema de Temas *(Completado)*
- [x] Definición de arquitectura e integración de las skills `impeccable` y `webapp-testing` (Playwright + Chromium).
- [x] Optimización de activos gráficos a formato `.webp` (`citt-logo.webp`, `citt-hero-lobby.webp`, `banner-comunidad.webp`, `banner-iot.webp`).
- [x] Inicialización de **Next.js 15 (App Router) + TypeScript + Tailwind CSS + Radix UI**.
- [x] Motor de Temas Libre de Conflictos ([`src/styles/themes.ts`](../src/styles/themes.ts) y [`src/app/globals.css`](../src/app/globals.css)) con **Modo Claro (`#FFFFFF`) por defecto** y **Modo Oscuro (`#000000`)** sin parpadeo (Anti-FOUC).

## Fase 1: Portada Editorial, Navbar Dinámico y Perfil Social `/u/` *(Completado)*
- [x] **Navbar Superior de 3 Zonas ([`src/components/Navbar.tsx`](../src/components/Navbar.tsx)):**
  - Transparente al estar en el tope del Hero y sólido/esmerilado al hacer scroll.
  - Zona izquierda (Logo CITT Connect Duoc UC), Zona central (Navegación + Selector Claro/Oscuro), Zona derecha (Acceso, Mi Pase QR y Usuario Activo).
- [x] **Portada Editorial Full-Screen `100dvh` ([`src/app/page.tsx`](../src/app/page.tsx)):**
  - Hero a pantalla completa con fondo arquitectónico `.webp` + blur suave, Manifiesto Institucional (Qué es, Misión y Visión), Galería Masonry estilo Pinterest y Crónicas de Laboratorio.
- [x] **Directorio Nacional con Vínculo `+ Connect` ([`src/app/directorio/page.tsx`](../src/app/directorio/page.tsx)):**
  - Filtros por Región, Sede, Escuela Duoc UC, Rol CITT, buscador y pestaña *"Mis Vínculos"*.
- [x] **Perfil Social & Académico `/u/[username]` — Combinación 1 LinkedIn × MIT Media Lab ([`src/app/u/[username]/page.tsx`](../src/app/u/%5Busername%5D/page.tsx)):**
  - Cabecera panorámica con Banner de Portada personalizable, Avatar superpuesto, botón `+ Connect`, descarga `.vcf`, Pase QR Phygital en vivo, trayectoria académica, módulos especiales por Rol y portafolio de proyectos.
- [x] **Editor de Perfil y Selector de Banners ([`src/app/mi-perfil/page.tsx`](../src/app/mi-perfil/page.tsx)).**

## Fase 2: Autenticación por Dominio Duoc UC e Invitaciones Partner (`/acceso`) *(Implementado)*
- [x] **Portal de Acceso Institucional y Gatekeeper de Dominios ([`src/app/acceso/page.tsx`](../src/app/acceso/page.tsx)):**
  - Validación estricta de dominio en tiempo real:
    - **`@duocuc.cl`** → Registro habilitado como **Alumno / Miembro CITT (`usuario_citt`)**.
    - **`@profesor.duocuc.cl`** → Registro habilitado como **Personal Duoc (`personal_duoc`)**.
    - **`@cittconnect.cl`** → Registro habilitado como **Admin de Plataforma (`dev`)**.
    - **Otros dominios** → Bloqueados automáticamente salvo que ingresen un **Código de Invitación Partner** válido.
  - **Consola de Invitaciones Partner:** Exclusiva para cuentas `@cittconnect.cl` (Admin) y `@profesor.duocuc.cl` (Personal Duoc) para emitir invitaciones a correos corporativos de empresas externas.
- [x] Cliente Supabase SSR/Browser ([`src/lib/supabase/client.ts`](../src/lib/supabase/client.ts)) preparado para conectar con variables de entorno en Vercel y Supabase CLI.

## Fase 3: Conexión Productiva con Supabase CLI & Vercel CLI *(Siguiente Paso)*
- [ ] Vincular proyecto Supabase (`supabase link` + `supabase db push`) y configurar variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Vincular y desplegar `CITT_Connect_Frontend` en producción con **Vercel CLI** (`vercel link` + `vercel env add` + `vercel --prod`).

## Fase 4: PWA Offline & Hardware Pin NFC 3D
- [ ] Modo Offline PWA para apertura instantánea del Pase QR sin señal.
- [ ] Vinculación Web NFC (`NDEFReader`) para los pines físicos impresos en 3D (`/nfc/[tag_uid]`).
