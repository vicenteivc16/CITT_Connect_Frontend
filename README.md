# CITT Connect — Frontend (`CITT_Connect_Frontend`) 🌐✨

> **Aplicación Web Progresiva (PWA), Galería Interactiva y Red Nacional Inter-Sedes para el CITT de Duoc UC en Chile.**

Este repositorio contiene el cliente **Web-First + PWA** de **CITT Connect**, construido con **Next.js (App Router), TypeScript, Tailwind CSS, Radix UI y Framer Motion**, diseñado bajo la colorimetría y tipografías oficiales del **Kit Digital de Duoc UC** junto al **Emblema Azul 3D con Circuito CITT (`.webp`)**, e integrado con la skill de diseño **[Impeccable](https://github.com/pbakaus/impeccable)** para **Google Antigravity (`agy`)**.

---

## 📚 Índice de Documentación (`/Docs`)

1. 🏗️ **[01. Arquitectura Frontend, Rutas y PWA](./Docs/01-arquitectura-frontend-y-pwa.md)**
   * Estructura de proyecto Next.js (App Router) y conexión con `CITT_Connect_Backend`.
   * Enrutamiento público sin fricción (`/u/[username]` y `/nfc/[tag_uid]`) y privado (`/directorio`, `/proyectos`, `/muro`, `/mi-perfil`).
   * Configuración de **PWA Offline**, generador de **Código QR con logo CITT** y descarga directa de contactos **`vCard (.vcf)`**.
2. 🎨 **[02. Sistema de Diseño Duoc UC y Componentes Radix UI](./Docs/02-sistema-de-diseno-duoc-y-radix-ui.md)**
   * **Paleta Primaria** (`#1A1A1A`, `#FFFFFF`, `#FFB800`), **Paleta Secundaria** (`#666666`, `#000000`, `#EEEEEE`) y **9 Colores Oficiales de Escuelas Duoc UC**.
   * Tipografías oficiales **`Lato`** y **`Merriweather`** con su escala modular en `rem`.
   * Coreografía de la **Galería Interactiva** (*Spotlight + Backdrop Blur*) y catálogo de primitivas **Radix UI**.
3. 🪄 **[03. Guía de Uso de la Skill Impeccable en Antigravity](./Docs/03-guia-impeccable-design-skill.md)**
   * Cómo aprovechar los 24 comandos de `impeccable` (`shape`, `bolder`, `animate`, `typeset`, `critique`, `audit`, `polish`, `live`) sincronizados con [PRODUCT.md](./PRODUCT.md) y [DESIGN.md](./DESIGN.md).
4. 🗺️ **[04. Roadmap Frontend](./Docs/04-roadmap-frontend.md)**
   * Planificación de pantallas, componentes e hitos visuales desde la Fase 0 hasta la Fase 4 (lector/vinculador Web NFC para el Pin 3D).
5. 🖥️ **[05. Diseño de las 7 Vistas y los 6 Roles Oficiales](./Docs/05-diseno-de-vistas-y-roles.md)**
   * Especificación detallada de la **Opción A (*"Phygital Pass & Spotlight"*)**, los **6 Roles** (`usuario_citt`, `lider_citt`, `consejero_carrera`, `personal_duoc`, `dev`, `partner`) y la base de contacto rápido + QR.

---

## 🖼️ Assets Oficiales Incluidos (`/assets`)

* [`assets/citt-logo.webp`](./assets/citt-logo.webp) — Emblema Azul 3D con Circuito CITT optimizado (`1254 × 1254 px`, `134 KB`, canal alfa sin pérdida).
* [`assets/Emblema azul 3D con circuito Citt.webp`](./assets/Emblema%20azul%203D%20con%20circuito%20Citt.webp) — Copia con nombre descriptivo.
* [`assets/Emblema azul 3D con circuito Citt.png`](./assets/Emblema%20azul%203D%20con%20circuito%20Citt.png) — Fuente maestra original en PNG (`1.61 MB`).
