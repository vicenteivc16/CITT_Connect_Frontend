# 03. Guía de Uso de la Skill `Impeccable` en Antigravity (`agy`)

> **Repositorio:** `CITT_Connect_Frontend`
> **Ubicación Local:** `.agent/skills/impeccable/`
> **Ubicación Global en tu Mac:** `~/.gemini/config/skills/impeccable/`

---

## 1. ¿Cómo está configurada la Skill en este Proyecto?

La skill **[pbakaus/impeccable](https://github.com/pbakaus/impeccable)** ya se encuentra instalada tanto a nivel **global** en tu configuración de Antigravity (`~/.gemini/config/skills/impeccable`) como a nivel **local** en este repositorio (`.agent/skills/impeccable`).

Además, ya hemos creado en la raíz de `CITT_Connect_Frontend` los dos archivos maestros que `impeccable` lee automáticamente antes de diseñar o editar cualquier componente:
* 📄 **[`PRODUCT.md`](../PRODUCT.md):** Define la audiencia, los modos de cada pantalla (`Experience` para la Galería Interactiva, `Persuade` para la tarjeta pública QR/NFC y `Operate` para el Directorio Multisede).
* 🎨 **[`DESIGN.md`](../DESIGN.md):** Fija como autoridad visual inamovible la **Paleta Primaria y Secundaria del Kit Digital de Duoc UC**, los colores de las 9 Escuelas, las tipografías `Lato` y `Merriweather` y el uso del emblema `.webp`.

---

## 2. Comandos Recomendados para el Desarrollo de CITT Connect

Puedes pedirme en cualquier momento que ejecute cualquiera de estos flujos de `impeccable` sobre nuestras vistas o componentes:

| Comando / Petición | ¿Cuándo usarlo en CITT Connect? |
| :--- | :--- |
| **`impeccable shape [vista]`** | Antes de programar una pantalla nueva (ej. *"Usa impeccable shape para diseñar el Showcase de Proyectos Inter-Sedes"*). |
| **`impeccable bolder [componente]`** | Para elevar el impacto visual de la **Galería Interactiva** o la **Tarjeta Digital Pública** sin romper la paleta de Duoc UC. |
| **`impeccable animate [componente]`** | Para refinar las transiciones de *backdrop-blur*, *hover* y apertura del modal de **Radix UI** con **Framer Motion**. |
| **`impeccable typeset [vista]`** | Para verificar que la jerarquía tipográfica (`Lato` y `Merriweather`, `h1` a `small`) tenga el ritmo y legibilidad exactos en móvil y escritorio. |
| **`impeccable critique [vista]`** | Para hacer una revisión heurística UX puntuada de una pantalla y detectar qué mejorar primero. |
| **`impeccable audit [vista]`** | Para auditar accesibilidad WAI-ARIA en los componentes Radix UI, contraste de colores Duoc UC y rendimiento móvil. |
| **`impeccable harden [vista]`** | Para blindar formularios, estados vacíos, nombres largos, errores de red y soporte offline en la PWA. |
| **`impeccable polish [vista]`** | Pasada final de acabado antes de hacer *deploy* a producción en Vercel. |
