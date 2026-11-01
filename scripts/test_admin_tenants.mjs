import pkg from 'playwright';
const { chromium } = pkg;

async function testAdminTenants() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('1. Autenticando como Core Dev en /acceso...');
  await page.goto('http://localhost:3000/acceso', { waitUntil: 'networkidle' });
  await page.fill('input[placeholder*="duocuc" i]', 'vice.vasca@cittconnect.cl');
  await page.fill('input[type="password"]', 'Familiaermosa12.');
  await page.click('button:has-text("Ingresar al Ecosistema CITT")');
  await page.waitForTimeout(2000);

  console.log('2. Navegando al panel /admin...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/scratch/10_admin_overview_with_switcher.png' });

  console.log('3. Accediendo al módulo "Sedes & Tenants CITT"...');
  await page.click('button:has-text("Sedes & Tenants CITT")');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/scratch/11_admin_tenants_module.png' });

  console.log('4. Accediendo al módulo "Padrón de Usuarios"...');
  await page.click('button:has-text("Padrón de Usuarios")');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/scratch/12_admin_padron_usuarios.png' });

  console.log('5. Accediendo a la "Bitácora de Auditoría"...');
  await page.click('button:has-text("Bitácora de Auditoría")');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/scratch/13_admin_bitacora_auditoria.png' });

  console.log('6. Probando Tenant Switcher: Cambiando a Sede San Bernardo...');
  await page.selectOption('select#tenant-switcher', 'san-bernardo');
  await page.waitForTimeout(1000);

  console.log('7. Verificando Calendario filtrado por Tenant San Bernardo...');
  await page.click('button:has-text("Salas & Calendario CITT")');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/scratch/14_admin_calendario_tenant_sb.png' });

  await browser.close();
  console.log('✓ Pruebas de Tenants, Padrón y Auditoría completadas con éxito!');
}

testAdminTenants().catch(console.error);
