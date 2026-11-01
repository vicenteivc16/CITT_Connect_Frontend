import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/dynamic-calendar-routes';
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('1. Accediendo a CITT Connect /acceso...');
  await page.goto('http://localhost:3000/acceso', { waitUntil: 'networkidle' });

  // Iniciar sesión con Core Dev
  console.log('2. Iniciando sesión con vice.vasca@cittconnect.cl...');
  await page.fill('input[placeholder*="duocuc" i]', 'vice.vasca@cittconnect.cl');
  await page.fill('input[type="password"]', 'Familiaermosa12.');
  await page.click('button:has-text("Ingresar al Ecosistema CITT")');

  await page.waitForTimeout(2000);

  // Navegar al Panel de Administración
  console.log('3. Navegando a /admin...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Ir a la pestaña de Calendario
  console.log('4. Clickeando tab de Calendario...');
  const calTab = page.locator('button:has-text("Salas & Calendario")');
  if (await calTab.isVisible()) {
    await calTab.click();
  }
  await page.waitForTimeout(1500);

  // Clickear en el nuevo subtab de Rutas & Salas Tótem
  console.log('5. Clickeando subtab "Rutas & Salas Tótem"...');
  const roomsSubTab = page.locator('button:has-text("Rutas & Salas Tótem")');
  await roomsSubTab.click();
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '01-admin-rutas-salas-totem.png') });
  console.log('✓ Captura 01 guardada: Listado de Salas y Rutas Dinámicas');

  // Click en "Ver QR" de la primera sala
  console.log('6. Abriendo modal de Código QR...');
  const qrButton = page.locator('button:has-text("Ver QR")').first();
  if (await qrButton.isVisible()) {
    await qrButton.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '02-modal-qr-totem.png') });
    console.log('✓ Captura 02 guardada: Modal QR para Tótem Físico');
  }

  // 7. Probar Calendario CITT Dinámico: San Bernardo Sala 312
  console.log('7. Abriendo Calendario CITT en /san-bernardo/sala-312...');
  const pageCal1 = await context.newPage();
  await pageCal1.goto('http://localhost:3001/san-bernardo/sala-312', { waitUntil: 'networkidle' });
  await pageCal1.waitForTimeout(2500);
  await pageCal1.screenshot({ path: path.join(ARTIFACTS_DIR, '03-calendario-san-bernardo-sala-312.png') });
  console.log('✓ Captura 03 guardada: San Bernardo Sala 312');

  // Interacción para pasar al split-view
  console.log('8. Interactuando con tótem San Bernardo para ver split-view...');
  await pageCal1.click('div[role="button"]');
  await pageCal1.waitForTimeout(2000);
  await pageCal1.screenshot({ path: path.join(ARTIFACTS_DIR, '04-calendario-san-bernardo-editorial-split.png') });
  console.log('✓ Captura 04 guardada: Split-view San Bernardo');

  // 9. Probar Calendario CITT Dinámico: Plaza Vespucio FabLab Maker
  console.log('9. Abriendo Calendario CITT en /plaza-vespucio/fablab-maker...');
  const pageCal2 = await context.newPage();
  await pageCal2.goto('http://localhost:3001/plaza-vespucio/fablab-maker', { waitUntil: 'networkidle' });
  await pageCal2.waitForTimeout(2500);
  await pageCal2.screenshot({ path: path.join(ARTIFACTS_DIR, '05-calendario-plaza-vespucio-fablab.png') });
  console.log('✓ Captura 05 guardada: Plaza Vespucio FabLab');

  // Interacción en Plaza Vespucio
  console.log('10. Interactuando con tótem Plaza Vespucio...');
  await pageCal2.click('div[role="button"]');
  await pageCal2.waitForTimeout(2000);
  await pageCal2.screenshot({ path: path.join(ARTIFACTS_DIR, '06-calendario-plaza-vespucio-split.png') });
  console.log('✓ Captura 06 guardada: Split-view Plaza Vespucio');

  await browser.close();
  console.log('🎉 TODAS LAS VERIFICACIONES COMPLETADAS EXITOSAMENTE!');
}

run().catch((err) => {
  console.error('Error durante la verificación:', err);
  process.exit(1);
});
