# PRODUCT.md — CITT Connect

## What It Is
**CITT Connect** is a progressive web platform (PWA) and national inter-campus innovation network for the **Centro de Innovación y Transferencia Tecnológica (CITT)** across all **Duoc UC** campuses in Chile. Its foundational mission is instant, friction-free professional contact exchange (Full Name, Email, Degree/Title, Specialties, Current Occupation, LinkedIn & Social Networks) via a **Public Digital Pass (`/u/[username]`)** and **Dynamic QR Code** (and future 3D-printed NFC pins), evolving into the internal professional community connecting all CITT campuses, schools, student counselors, faculty, and external industry partners.

## The 6 Official Community Roles (`citt_role`)
1. **`personal_duoc` (Personal Duoc):** Highest institutional rank (CITT Coordinators, Faculty, Directors). Gold Duoc accent (`#FFB800`).
2. **`lider_citt` (Líder CITT):** Student/technical authority inside a CITT campus (Captains, Track Leads). Circuit Blue + Gold accent.
3. **`consejero_carrera` (Consejero de Carrera):** Special bridge profiles connecting CITT with regular Duoc UC students who do not yet have a CITT Connect account. Teal/Cyan accent (`#00A499`).
4. **`usuario_citt` (Miembro CITT):** Core community members across all Duoc UC degrees and schools. Styled with their official Duoc UC School color.
5. **`partner` (Partner Oficial):** External companies, sponsors, or industry allies posting internships, challenges, and announcements for CITT talent. Purple/Platinum accent (`#AC4FC6`).
6. **`dev` (Core Dev):** Platform developers and maintainers of CITT Connect. Circuit Blue terminal accent (`#307FE2`).

## Core Views & Modes (Option A: "Phygital Pass & Spotlight")
1. **Interactive Spotlight Gallery (`/`) — Mode: `Experience`**
   - Dark canvas (`#000000`) with `#1A1A1A` credentials. Hovering or tapping a member card casts a soft blur across neighboring cards while bringing the active member into full contrast, showing their role badge, school color, specialties, occupation, social links, and instant QR preview.
2. **Public Digital Credential & 3D Flip QR (`/u/[username]`) — Mode: `Persuade` / `Experience`**
   - Opens in `< 1s` when scanning a member's QR code. Displays Full Name, Current Occupation, Title/Degree, Campus, Role Badge, Specialties, LinkedIn & Social Links, one-tap **"Guardar en Contactos (.vcf)"**, and a 3D flip/modal revealing their high-contrast `#EEEEEE` QR code centered with `assets/citt-logo.webp`.
3. **My Credential Editor & QR Generator (`/mi-perfil`) — Mode: `Operate`**
   - Live side-by-side editor for personal contact fields, specialties, social networks, and an instant QR code generator/downloader pointing to `/u/[username]`.
4. **Inter-Campus Projects & Help Requests (`/proyectos`) — Mode: `Operate`**
   - Cross-campus board to propose projects, recruit talent from other Duoc UC campuses/careers, or request technical help.
5. **National CITT Feed, Partners & Career Counselors (`/muro`) — Mode: `Operate` / `Read`**
   - Segmented feed for Inter-Campus News, Partner Opportunities, and Career Counselor bridges.
