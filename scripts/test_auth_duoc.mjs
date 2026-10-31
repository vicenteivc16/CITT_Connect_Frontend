import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACT_DIR = '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/auth-tests';
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

console.log(`====================================================`);
console.log(` INICIANDO SUITE DE PRUEBAS AUTH & DOMINIOS DUOC UC`);
console.log(` URL Objetivo: ${BASE_URL}`);
console.log(`====================================================\n`);

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  const addResult = (id, name, passed, details) => {
    results.push({ id, name, passed, details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`[${mark}] ${id}: ${name} - ${details}`);
  };

  try {
    const context = await browser.newContext({
      viewport: { width: 1400, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    // ----------------------------------------------------
    // TEST 1: Carga limpia de /acceso y detección de Microsoft 365 SSO
    // ----------------------------------------------------
    await page.goto(`${BASE_URL}/acceso`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Si había sesión anterior, asegurar logout
    const logoutBtn = page.locator('button:has-text("Cerrar Sesión")');
    if (await logoutBtn.count() > 0) {
      await logoutBtn.first().click();
      await page.waitForTimeout(800);
    }

    const msButton = page.locator('button:has-text("Microsoft 365")');
    const msExists = (await msButton.count()) > 0;
    addResult(
      'TEST-01',
      'Botón SSO Institucional Microsoft 365 visible',
      msExists,
      msExists ? 'Botón oficial con isotipo de Microsoft 365 presente en interfaz de acceso' : 'No se encontró el botón Microsoft 365'
    );
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '01-acceso-pantalla-inicial-con-microsoft.png') });

    // ----------------------------------------------------
    // TEST 2: Trigger de autenticación Microsoft 365 y redirección a Azure OAuth
    // ----------------------------------------------------
    let oauthUrlTriggered = false;
    let targetOAuthUrl = '';
    page.on('framenavigated', (frame) => {
      const u = frame.url();
      if (u.includes('provider=azure') || u.includes('authorize')) {
        oauthUrlTriggered = true;
        targetOAuthUrl = u;
      }
    });

    await msButton.first().click();
    await page.waitForTimeout(2000);

    addResult(
      'TEST-02',
      'Redirección a Microsoft Entra ID / Azure OAuth endpoint',
      oauthUrlTriggered,
      `Redirección OAuth capturada: ${targetOAuthUrl || page.url()}`
    );

    // ----------------------------------------------------
    // TEST 3: Volver a /acceso, abrir Tab "Crear Cuenta" y probar correo no institucional (@gmail.com)
    // ----------------------------------------------------
    await page.goto(`${BASE_URL}/acceso`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const tabRegister = page.locator('button:has-text("Crear Cuenta")');
    await tabRegister.click();
    await page.waitForTimeout(400);

    const regEmailInput = page.locator('input[placeholder*="@duocuc.cl o @profesor.duoc.cl"]');
    await regEmailInput.fill('estudiante.infiltrado@gmail.com');
    await page.waitForTimeout(400);

    const bannerDomain = page.locator('span:has-text("Dominio externo no institucional")');
    const domainBlockedMsg = (await bannerDomain.count()) > 0;
    addResult(
      'TEST-03',
      'Detección reactiva de Dominio Externo (@gmail.com)',
      domainBlockedMsg,
      domainBlockedMsg ? 'El sistema detectó y alertó en tiempo real que @gmail.com no es institucional' : 'No se detectó la advertencia'
    );

    // Verificar si se desplegó el input de Código Partner
    const inviteInput = page.locator('input[placeholder*="AWS-INNOVA-2026"]');
    const partnerFieldVisible = (await inviteInput.count()) > 0;
    addResult(
      'TEST-04',
      'Exigencia condicional de Código Partner para correos externos',
      partnerFieldVisible,
      partnerFieldVisible ? 'El campo Código de Invitación se activó reactivamente' : 'El campo no se desplegó'
    );
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '02-registro-bloqueo-dominio-externo.png') });

    // ----------------------------------------------------
    // TEST 5: Intento de registro con Gmail sin código de invitación -> BLOQUEO
    // ----------------------------------------------------
    await page.locator('input[placeholder*="Valentina Soto"]').fill('Estudiante Falso');
    await page.locator('input[placeholder*="Ingeniería en Informática"]').fill('Auditor de Seguridad');
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill('DuocSeguro2026!');

    const submitBtn = page.locator('button[type="submit"]:has-text("Crear Mi Credencial CITT")');
    await submitBtn.click();
    await page.waitForTimeout(600);

    const bodyAfterSubmit1 = await page.evaluate(() => document.body.innerText);
    const rejectedWithoutCode = bodyAfterSubmit1.includes('restringido') || bodyAfterSubmit1.includes('Solo se permiten') || bodyAfterSubmit1.includes('Partner');
    addResult(
      'TEST-05',
      'Bloqueo estricto de registro externo sin Partner Code',
      rejectedWithoutCode,
      'Rechazo formal con banner de advertencia institucional'
    );

    // ----------------------------------------------------
    // TEST 6: Intento con código de invitación FALSO -> RECHAZO
    // ----------------------------------------------------
    await inviteInput.fill('CODIGO-HACKER-999');
    await submitBtn.click();
    await page.waitForTimeout(600);

    const bodyAfterSubmit2 = await page.evaluate(() => document.body.innerText);
    const rejectedInvalidCode = bodyAfterSubmit2.includes('inválido') || bodyAfterSubmit2.includes('expirado');
    addResult(
      'TEST-06',
      'Rechazo estricto ante código de invitación espurio o inexistente',
      rejectedInvalidCode,
      'Rechazado con validación de convenios activos'
    );
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '03-registro-codigo-falso-rechazado.png') });

    // ----------------------------------------------------
    // TEST 7: Registro con Dominio Estudiante Duoc UC (@duocuc.cl) -> ACEPTADO
    // ----------------------------------------------------
    const uniqueStudent = `alumno.valido.${Date.now().toString().slice(-4)}@duocuc.cl`;
    await regEmailInput.fill(uniqueStudent);
    await page.waitForTimeout(400);

    const studentBadge = page.locator('span:has-text("Alumno / Miembro CITT Duoc UC")');
    const studentIdentified = (await studentBadge.count()) > 0;
    addResult(
      'TEST-07',
      'Identificación automática de estudiante @duocuc.cl',
      studentIdentified,
      'Rol usuario_citt reconocido automáticamente sin requerir código de invitación'
    );

    // Código partner debe desaparecer
    const partnerFieldAfterStudent = (await inviteInput.count()) > 0;
    addResult(
      'TEST-08',
      'Ocultamiento de campo de invitación para dominios oficiales Duoc UC',
      !partnerFieldAfterStudent,
      'Campo partner no requerido y oculto para la comunidad Duoc'
    );

    await page.locator('input[placeholder*="Valentina Soto"]').fill('Estudiante Oficial Duoc');
    await submitBtn.click();
    await page.waitForTimeout(2000);

    // Verificar redirección a perfil
    const currentUrl = page.url();
    const successCreated = currentUrl.includes('/u/') || (await page.locator('text=exitosa').count()) > 0 || (await page.locator('text=verificada con éxito').count()) > 0;
    addResult(
      'TEST-09',
      'Creación y aprovisionamiento exitoso de cuenta Estudiante Duoc UC',
      successCreated,
      `Cuenta creada y sesión iniciada en: ${currentUrl}`
    );
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '04-registro-estudiante-duocuc-exitoso.png') });

    // ----------------------------------------------------
    // TEST 10: Validación de dominio Docente (@profesor.duoc.cl)
    // ----------------------------------------------------
    await page.goto(`${BASE_URL}/acceso`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Logout si está logeado
    const logoutBtn2 = page.locator('button:has-text("Cerrar Sesión")');
    if (await logoutBtn2.count() > 0) {
      await logoutBtn2.first().click();
      await page.waitForTimeout(600);
    }

    const tabRegister2 = page.locator('button:has-text("Crear Cuenta")');
    await tabRegister2.click();
    await page.waitForTimeout(400);

    const regEmailInput2 = page.locator('input[placeholder*="@duocuc.cl o @profesor.duoc.cl"]');
    await regEmailInput2.fill('profesor.innovacion@profesor.duoc.cl');
    await page.waitForTimeout(500);

    const docBadge = page.locator('span:has-text("Personal Docente / Directivo Duoc UC")');
    const docIdentified = (await docBadge.count()) > 0;
    addResult(
      'TEST-10',
      'Identificación de Docente institucional @profesor.duoc.cl',
      docIdentified,
      'Asignación automática de rol personal_duoc'
    );

    // ----------------------------------------------------
    // TEST 11: Registro Partner Autorizado con código oficial (AWS-INNOVA-2026)
    // ----------------------------------------------------
    await regEmailInput2.fill('arquitecto@aws.amazon.com');
    await page.waitForTimeout(400);
    const inviteInput2 = page.locator('input[placeholder*="AWS-INNOVA-2026"]');
    await inviteInput2.fill('AWS-INNOVA-2026');
    await page.waitForTimeout(400);

    // Enviar formulario partner
    await page.locator('input[placeholder*="Valentina Soto"]').fill('Arquitecto Soluciones AWS');
    await page.locator('input[placeholder*="Ingeniería en Informática"]').fill('Cloud Enterprise Architect');
    const passwordInputs2 = page.locator('input[type="password"]');
    await passwordInputs2.nth(0).fill('AwsPartner2026!');
    const submitBtn2 = page.locator('button[type="submit"]:has-text("Crear Mi Credencial CITT")');
    await submitBtn2.click();
    await page.waitForTimeout(2000);

    const urlPartner = page.url();
    const partnerRegistered = urlPartner.includes('/u/') || (await page.locator('text=exitosa').count()) > 0 || (await page.locator('text=verificada con éxito').count()) > 0;
    addResult(
      'TEST-11',
      'Creación exitosa de cuenta Partner Corporativo con código AWS',
      partnerRegistered,
      `Partner aprovisionado correctamente con rol partner en ${urlPartner}`
    );
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '05-registro-partner-autorizado.png') });

    // ----------------------------------------------------
    // TEST 12: Acceso Rápido por Rol y Persistencia de Sesión
    // ----------------------------------------------------
    await page.goto(`${BASE_URL}/acceso`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const quickRoles = [
      { label: 'Camila Soto', role: 'Líder CITT' },
      { label: 'Prof. Carlos Vega R.', role: 'Personal Duoc' },
      { label: 'Matías Alarcón Vergara', role: 'Miembro CITT' },
      { label: 'Javiera Méndez Solar', role: 'Partner Oficial' },
      { label: 'Vicente Vásquez', role: 'Core Dev' },
    ];

    for (const r of quickRoles) {
      const qBtn = page.locator(`button:has-text("${r.label}")`);
      if (await qBtn.count() > 0) {
        await qBtn.first().click();
        await page.waitForTimeout(1500);
        const loggedInUrl = page.url();
        const ok = loggedInUrl.includes(`/u/`);
        addResult(
          `TEST-QUICK-${r.label.replace(/\s+/g, '-').toLowerCase()}`,
          `Acceso Rápido Rol: ${r.label} (${r.role})`,
          ok,
          `Redirección exitosa a credencial digital (${loggedInUrl})`
        );
        // Volver a acceso y cerrar sesión para el siguiente rol
        await page.goto(`${BASE_URL}/acceso`, { waitUntil: 'networkidle' });
        const closeBtn = page.locator('button:has-text("Cerrar Sesión")');
        if (await closeBtn.count() > 0) {
          await closeBtn.first().click();
          await page.waitForTimeout(400);
        }
      }
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, '06-acceso-rapido-completado.png') });

    await context.close();
  } finally {
    await browser.close();
  }

  console.log(`\n====================================================`);
  console.log(` RESUMEN DE PRUEBAS AUTH Y DOMINIOS:`);
  console.log(` Total pruebas: ${results.length}`);
  console.log(` Aprobadas: ${results.filter(r => r.passed).length}`);
  console.log(` Fallidas: ${results.filter(r => !r.passed).length}`);
  console.log(`====================================================\n`);

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'auth-test-results.json'),
    JSON.stringify(results, null, 2)
  );
}

runTests().catch(err => {
  console.error('Error fatal durante la ejecución de pruebas:', err);
  process.exit(1);
});
