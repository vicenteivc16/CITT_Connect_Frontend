import pkg from 'playwright';
const { chromium } = pkg;

async function testAdminLogin() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('1. Navegando a http://localhost:3000/acceso...');
  await page.goto('http://localhost:3000/acceso', { waitUntil: 'networkidle' });

  console.log('2. Ingresando credenciales admin core dev...');
  await page.fill('input[placeholder*="duocuc" i]', 'vice.vasca@cittconnect.cl');
  await page.fill('input[type="password"]', 'Familiaermosa12.');

  console.log('3. Haciendo clic en Ingresar al Ecosistema CITT...');
  await page.click('button:has-text("Ingresar al Ecosistema CITT")');

  // Esperar a que se actualice la UI
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/scratch/02_despues_de_login.png' });

  console.log('4. Navegando al perfil público /u/vice.vasca...');
  await page.goto('http://localhost:3000/u/vice.vasca', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/scratch/02b_perfil_admin.png' });

  console.log('5. Navegando a /admin...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/scratch/03_panel_admin.png' });

  console.log('6. Navegando a /directorio...');
  await page.goto('http://localhost:3000/directorio', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/scratch/06_directorio_organico.png' });

  await browser.close();
  console.log('✓ Pruebas completadas con éxito!');
}

testAdminLogin().catch(console.error);
