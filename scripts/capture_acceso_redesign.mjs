import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const OUT_DIR = '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/acceso-rediseño';
fs.mkdirSync(OUT_DIR, { recursive: true });

async function runCapture() {
  console.log(`Iniciando captura y verificación visual de nuevo /acceso en ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    // 1. Cargar /acceso en desktop
    await page.goto(`${BASE_URL}/acceso`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Asegurar que no haya sesión previa
    const logoutBtn = page.locator('button:has-text("Cerrar Sesión")');
    if (await logoutBtn.count() > 0) {
      await logoutBtn.first().click();
      await page.waitForTimeout(600);
    }

    await page.screenshot({
      path: path.join(OUT_DIR, '01-acceso-split-desktop.png'),
      fullPage: false,
    });
    console.log('Captura 1 guardada: 01-acceso-split-desktop.png');

    // 2. Cambiar de diapositiva en la galería izquierda
    const nextBtn = page.locator('button[aria-label="Diapositiva siguiente"]');
    if (await nextBtn.count() > 0) {
      await nextBtn.click();
      await page.waitForTimeout(600);
    }
    await page.screenshot({
      path: path.join(OUT_DIR, '02-acceso-slide-2-rotacion.png'),
      fullPage: false,
    });
    console.log('Captura 2 guardada: 02-acceso-slide-2-rotacion.png');

    // 3. Tab "Crear Cuenta" con correo de alumno
    const tabRegister = page.locator('button:has-text("Crear Cuenta")');
    await tabRegister.click();
    await page.waitForTimeout(400);

    const emailInput = page.locator('input[placeholder*="@duocuc.cl o @profesor.duoc.cl"]');
    await emailInput.fill('estudiante.citt@duocuc.cl');
    await page.waitForTimeout(400);

    await page.screenshot({
      path: path.join(OUT_DIR, '03-acceso-register-tab-duocuc.png'),
      fullPage: false,
    });
    console.log('Captura 3 guardada: 03-acceso-register-tab-duocuc.png');

    // 4. Probar correo externo para verificar bloqueo reactivo
    await emailInput.fill('externo.no.autorizado@gmail.com');
    await page.waitForTimeout(400);

    await page.screenshot({
      path: path.join(OUT_DIR, '04-acceso-bloqueo-dominio-externo.png'),
      fullPage: false,
    });
    console.log('Captura 4 guardada: 04-acceso-bloqueo-dominio-externo.png');

    // 5. Modal de soporte institucional
    await page.locator('button:has-text("Iniciar Sesión")').click();
    await page.waitForTimeout(400);
    const helpBtn = page.locator('button:has-text("¿Problemas para ingresar?")');
    if (await helpBtn.count() > 0) {
      await helpBtn.click();
      await page.waitForTimeout(400);
    }
    await page.screenshot({
      path: path.join(OUT_DIR, '05-acceso-modal-soporte.png'),
      fullPage: false,
    });
    console.log('Captura 5 guardada: 05-acceso-modal-soporte.png');

    await context.close();

    // 6. Vista Móvil (iPhone 14 Pro viewport 390x844)
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`${BASE_URL}/acceso`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(600);

    await mobilePage.screenshot({
      path: path.join(OUT_DIR, '06-acceso-mobile.png'),
      fullPage: false,
    });
    console.log('Captura 6 guardada: 06-acceso-mobile.png');

    await mobileContext.close();
  } finally {
    await browser.close();
  }
  console.log('Todas las capturas completadas.');
}

runCapture().catch(err => {
  console.error('Error durante la captura:', err);
  process.exit(1);
});
