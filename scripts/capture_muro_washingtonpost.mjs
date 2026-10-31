import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const OUT_DIR = '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/muro-washingtonpost';
fs.mkdirSync(OUT_DIR, { recursive: true });

async function runCapture() {
  console.log(`Iniciando verificación visual de /muro estilo Washington Post en ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    // 1. Cargar /muro y capturar Masthead y Hero
    await page.goto(`${BASE_URL}/muro`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(OUT_DIR, '01-muro-masthead-broadsheet.png'),
      fullPage: false,
    });
    console.log('Captura 1 guardada: 01-muro-masthead-broadsheet.png');

    // 2. Scroll al Hero Carrusel de Escuelas
    const heroSection = page.locator('h2:has-text("Vanguardia Multidisciplinaria")');
    if (await heroSection.count() > 0) {
      await heroSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
    }
    await page.screenshot({
      path: path.join(OUT_DIR, '02-muro-hero-carrusel-escuelas.png'),
      fullPage: false,
    });
    console.log('Captura 2 guardada: 02-muro-hero-carrusel-escuelas.png');

    // 3. Cambiar de Escuela en el Hero (Clic en Diseño o Salud)
    const disenoBtn = page.locator('button:has-text("Diseño")');
    if (await disenoBtn.count() > 0) {
      await disenoBtn.first().click();
      await page.waitForTimeout(700);
    }
    await page.screenshot({
      path: path.join(OUT_DIR, '03-muro-hero-escuela-diseno.png'),
      fullPage: false,
    });
    console.log('Captura 3 guardada: 03-muro-hero-escuela-diseno.png');

    // 4. Filtrar por "🇨🇱 Solo Chile"
    const chileFilterBtn = page.locator('button:has-text("Solo Chile")');
    if (await chileFilterBtn.count() > 0) {
      await chileFilterBtn.click();
      await page.waitForTimeout(600);
      const articleGrid = page.locator('h3:has-text("Crónicas Nacionales")');
      if (await articleGrid.count() > 0) {
        await articleGrid.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
      }
    }
    await page.screenshot({
      path: path.join(OUT_DIR, '04-muro-filtro-solo-chile.png'),
      fullPage: false,
    });
    console.log('Captura 4 guardada: 04-muro-filtro-solo-chile.png');

    // 5. Abrir Modal de Lectura de Crónica Completa
    const readBtn = page.locator('button:has-text("Leer Crónica")');
    if (await readBtn.count() > 0) {
      await readBtn.first().click();
      await page.waitForTimeout(700);
    }
    await page.screenshot({
      path: path.join(OUT_DIR, '05-muro-modal-lectura-cronica.png'),
      fullPage: false,
    });
    console.log('Captura 5 guardada: 05-muro-modal-lectura-cronica.png');

    // Cerrar modal de lectura
    const closeBtn = page.locator('button:has-text("Cerrar Lectura")');
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
      await page.waitForTimeout(400);
    }

    // 6. Abrir Modal de Redactar Despacho / Noticia de Sede
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const composeBtn = page.locator('button:has-text("Redactar Despacho / Noticia")');
    if (await composeBtn.count() > 0) {
      await composeBtn.first().click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({
      path: path.join(OUT_DIR, '06-muro-modal-redactar-despacho.png'),
      fullPage: false,
    });
    console.log('Captura 6 guardada: 06-muro-modal-redactar-despacho.png');

    await context.close();
  } finally {
    await browser.close();
  }
  console.log('Capturas del nuevo Muro Washington Post completadas con éxito.');
}

runCapture().catch(err => {
  console.error('Error durante la captura:', err);
  process.exit(1);
});
