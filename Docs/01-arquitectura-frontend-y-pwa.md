# 01. Arquitectura Frontend, Rutas y PWA (`CITT_Connect_Frontend`)

> **Repositorio:** `CITT_Connect_Frontend`
> **Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + Radix UI + Framer Motion + `@supabase/ssr`.

---

## 1. Estructura de Carpetas del Proyecto

```text
CITT_Connect_Frontend/
├── .agent/skills/impeccable/     # Skill de Diseño UI/UX integrada para Antigravity (agy)
├── assets/                       # Emblema oficial CITT 3D en formato .webp (134 KB) y .png
├── Docs/                         # Documentación técnica exclusiva de Frontend
├── PRODUCT.md                    # Contexto de producto para agentes e Impeccable
├── DESIGN.md                     # Sistema de diseño Duoc UC para agentes e Impeccable
├── public/
│   ├── manifest.webmanifest      # Configuración PWA instalable en iOS y Android
│   └── icons/                    # Íconos de app derivados de citt-logo.webp
└── src/
    ├── app/
    │   ├── layout.tsx            # Carga de fuentes Lato/Merriweather y ThemeProvider
    │   ├── page.tsx              # Landing + Galería Interactiva con efecto Blur/Spotlight
    │   ├── u/[username]/page.tsx # Tarjeta Digital Pública (QR / Link directo)
    │   ├── nfc/[tag_uid]/route.ts# Redirección ultrarrápida para Pines NFC (Fase 4 Ready)
    │   ├── (red)/                # Rutas de la Red Nacional Inter-Sedes
    │   │   ├── directorio/       # Buscador por Sede, Escuela Duoc UC, Track y Skills
    │   │   ├── proyectos/        # Showcase de Proyectos CITT y búsqueda de colaboradores
    │   │   ├── muro/             # Feed nacional de noticias, eventos y hackathons
    │   │   └── mi-perfil/        # Editor de perfil, descarga de QR y vinculación NFC
    ├── components/
    │   ├── ui/                   # Primitivas Radix UI estilizadas con tokens Duoc UC
    │   ├── gallery/              # InteractiveGallery, MemberCard, SpotlightModal
    │   ├── profile/              # DynamicQRCode, VCardButton, SchoolBadge, TrackBadge
    │   └── network/              # CampusFilter, ProjectCard, PostFeed
    └── lib/
        ├── supabase/             # Clientes Supabase (Browser & Server SSR)
        ├── vcard.ts              # Generador de archivos .vcf compatibles con iOS/Android
        └── image-webp.ts         # Compresor de fotos de perfil a .webp en el navegador
```

---

## 2. Flujos Críticos de Frontend

### 2.1 Galería Interactiva con Efecto *Spotlight & Blur*
* **Estado Global de Foco (`hoveredId` / `activeId`):**
  * Cuando ningún miembro está seleccionado, todas las tarjetas (`MemberCard`) muestran una versión sobria con retrato suavemente atenuado sobre fondo `#1A1A1A`.
  * Al hacer `hover` (en escritorio) o `tap` (en móvil) sobre una tarjeta, las tarjetas hermanas reciben la clase `blur-[3px] opacity-40 scale-[0.98] transition-all duration-300`, mientras la tarjeta activa pasa a `scale-[1.03] ring-2 ring-[#FFB800] shadow-2xl z-10`, desplegando sus botones de contacto rápido (LinkedIn, Correo, GitHub y QR).

### 2.2 Generador de Contacto `vCard (.vcf)` a un Toque
* Para que quien escanee el QR o el Pin NFC pueda guardar al miembro en la agenda de su teléfono sin escribir nada, `src/lib/vcard.ts` construye un archivo estándar `VCARD 3.0` en memoria y dispara la descarga directa:

```typescript
export function generateVCard(profile: {
  fullName: string;
  headline?: string;
  email?: string;
  phone?: string;
  campusName?: string;
  linkedinUrl?: string;
  profileUrl: string;
}): string {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.fullName}`,
    `ORG:CITT Duoc UC - ${profile.campusName ?? 'Chile'}`,
    profile.headline ? `TITLE:${profile.headline}` : '',
    profile.email ? `EMAIL;TYPE=INTERNET,WORK:${profile.email}` : '',
    profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : '',
    `URL:${profile.profileUrl}`,
    profile.linkedinUrl ? `X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedinUrl}` : '',
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\r\n');
}
```

### 2.3 Compresión Automática a `.webp` al Subir Avatar
* Antes de enviar una fotografía al bucket `avatars` de `CITT_Connect_Backend`, el cliente redimensiona la imagen a `512 × 512 px` usando un `<canvas>` HTML5 y la exporta con `canvas.toBlob(callback, 'image/webp', 0.88)`, garantizando que todos los retratos de la galería pesen menos de `60 KB`.
