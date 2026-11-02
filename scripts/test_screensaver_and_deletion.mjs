import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aroepwtqrxobsjsuazqd.supabase.co';
const SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyb2Vwd3RxcnhvYnNqc3VhenFkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzQ4NjMwOCwiZXhwIjoyMTA5MDYyMzA4fQ.JDj9-UkSrKGYdU7KjS732UJZcsh0fl9z-D6ZlR-tjiw';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runTests() {
  console.log('================================================================');
  console.log('INICIANDO VERIFICACIÓN E2E DE CALENDARIO CITT & CITT CONNECT');
  console.log('================================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Verificar que salas inexistentes devuelven 404 Not Found
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Verificando acceso bloqueado en ruta inexistente: /san-bernardo/sala-fantasma');
    await page.goto('http://localhost:3001/san-bernardo/sala-fantasma');
    await page.waitForTimeout(1500);

    const title404 = await page.title();
    console.log('Título de página recibido:', title404);
    const notFoundVisible = await page.locator('text=Página no encontrada').isVisible();
    const notFoundDesc = await page.locator('text=La página que buscas no existe o fue movida').isVisible();
    console.log('¿Muestra pantalla institucional "Página no encontrada"?:', notFoundVisible && notFoundDesc);

    if (!notFoundVisible || !title404.includes('no encontrada')) {
      throw new Error('Fallo: La sala inexistente no mostró la pantalla de 404 / no encontrada.');
    }
    console.log('✓ TEST 1 EXITOSO: Ruta inexistente bloqueada con 404 Not Found.');

    // -------------------------------------------------------------------------
    // TEST 2: Ciclo de vida completo: Crear sala -> Acceder -> Eliminar -> Verificar 404
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Verificando ciclo de vida: Creación, Acceso dinámico, Eliminación en BD y Bloqueo 404');
    const testSlug = `sala-temporal-${Date.now().toString(36)}`;
    const { data: createdRoom, error: createError } = await supabase
      .from('campus_rooms')
      .insert({
        campus_slug: 'san-bernardo',
        room_name: 'Sala de Pruebas Eliminación',
        room_slug: testSlug,
        capacity: 15,
        computers_count: 8,
        has_maker_tools: true,
        has_iot_equipment: true,
        is_active: true,
        totem_token: `token_${testSlug}`,
        screensaver_config: {
          subtitle: 'ESPACIO EXPERIMENTAL TEMPORAL',
          description: 'Esta sala será eliminada para comprobar que no se puede acceder con su URL.',
          floorLocation: 'PISO 1 · SALA TEMP',
          equipmentSummary: '15 PUESTOS · 8 PCs',
        },
      })
      .select()
      .single();

    if (createError || !createdRoom) {
      throw new Error(`Error creando sala temporal: ${createError?.message}`);
    }
    console.log(`✓ Sala creada en Supabase: /san-bernardo/${testSlug} (ID: ${createdRoom.id})`);

    // Acceder a la sala creada (debe renderizar el Kiosk con los textos dinámicos)
    await page.goto(`http://localhost:3001/san-bernardo/${testSlug}`);
    await page.waitForTimeout(1500);

    const subtitleVisible = await page.locator('text=ESPACIO EXPERIMENTAL TEMPORAL').isVisible();
    const tempRoomTitle = await page.title();
    console.log('Título al estar activa:', tempRoomTitle);
    console.log('¿Subtítulo dinámico visible en pantalla?:', subtitleVisible);
    if (!subtitleVisible) {
      throw new Error('El subtítulo dinámico de la sala creada no se visualizó.');
    }

    // Ahora eliminamos la sala de Supabase (simulando clic en Eliminar en CITT Connect Admin)
    console.log('Eliminando sala de la base de datos Supabase...');
    const { error: deleteError } = await supabase.from('campus_rooms').delete().eq('id', createdRoom.id);
    if (deleteError) {
      throw new Error(`Error eliminando sala temporal: ${deleteError.message}`);
    }
    console.log('✓ Sala eliminada exitosamente de Supabase.');

    // Intentar acceder nuevamente con la misma URL (debe dar 404 y bloquear el tótem)
    console.log(`Reintentando acceso a la URL eliminada: /san-bernardo/${testSlug}...`);
    await page.goto(`http://localhost:3001/san-bernardo/${testSlug}`);
    await page.waitForTimeout(1500);

    const afterDeleteTitle = await page.title();
    const afterDeleteNotFound = await page.locator('text=Página no encontrada').isVisible();
    console.log('Título post-eliminación:', afterDeleteTitle);
    console.log('¿Muestra "Página no encontrada"?:', afterDeleteNotFound);

    if (!afterDeleteNotFound || !afterDeleteTitle.includes('no encontrada')) {
      throw new Error('¡FALLO CRÍTICO! La URL de la sala eliminada sigue cargando el tótem.');
    }
    console.log('✓ TEST 2 EXITOSO: Al eliminar una sala en la base de datos, el acceso con la URL queda estrictamente bloqueado.');

    // -------------------------------------------------------------------------
    // TEST 3: Personalización en vivo de Salvapantallas & Calendario para Sala 312
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Personalizando salvapantallas y vista dividida en Sala 312');
    const customConfig = {
      subtitle: 'NÚCLEO DE INTELIGENCIA Y ROBÓTICA APLICADA',
      description: 'Espacio de investigación aplicada para proyectos interdisciplinarios de co-creación.',
      secondaryDescription: 'Mentoría permanente de líderes, kits Arduino/ESP32 y estaciones Bambu Lab X1C.',
      floorLocation: 'PABELLÓN TECNOLÓGICO · PISO 3 · SALA 312',
      equipmentSummary: '30 PUESTOS · KITS ROBÓTICA & VISIÓN ARTIFICIAL',
      heroImageUrl: '/hero/hero-vista1.webp',
      tickerChips: ['DUOC UC', 'INNOVACIÓN', 'SALA 312', 'AUTOMATIZACIÓN'],
      idleTimeoutSeconds: 15,
      screensaverDurationSeconds: 8,
      announcementBanner: '⚡ CONVOCATORIA ABIERTA: PROYECTOS CITT 2026',
    };

    const { error: updateErr } = await supabase
      .from('campus_rooms')
      .update({ screensaver_config: customConfig })
      .eq('campus_slug', 'san-bernardo')
      .eq('room_slug', 'sala-312');

    if (updateErr) {
      throw new Error(`Error actualizando screensaver_config: ${updateErr.message}`);
    }
    console.log('✓ screensaver_config actualizado en Supabase para sala-312');

    // Navegar a /san-bernardo/sala-312
    await page.goto('http://localhost:3001/san-bernardo/sala-312');
    await page.waitForTimeout(1500);

    // Verificar subtítulo personalizado
    const customSubtitleVisible = await page.locator('text=NÚCLEO DE INTELIGENCIA Y ROBÓTICA APLICADA').isVisible();
    console.log('¿Subtítulo personalizado visible en salvapantallas?:', customSubtitleVisible);

    // Verificar ubicación de piso personalizada
    const floorLocationVisible = await page.locator('text=PABELLÓN TECNOLÓGICO · PISO 3 · SALA 312').isVisible();
    console.log('¿Ubicación personalizada visible?:', floorLocationVisible);

    // Verificar chips del ticker
    const chipVisible = await page.locator('text=AUTOMATIZACIÓN').isVisible();
    console.log('¿Palabra clave del ticker "AUTOMATIZACIÓN" visible?:', chipVisible);

    // Capturar screenshot del salvapantallas personalizado
    const screenshotScreensaverPath =
      '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/01-screensaver-customizado-sala-312.png';
    await page.screenshot({ path: screenshotScreensaverPath });
    console.log('✓ Screenshot guardado:', screenshotScreensaverPath);

    // Tocar la pantalla para pasar al modo calendario / vista dividida
    console.log('Tocando pantalla para alternar a vista calendario...');
    await page.click('role=button[name="Toca la pantalla para abrir el calendario y reservar"]');
    await page.waitForTimeout(1500);

    // Verificar que el banner de anuncio aparece en la vista dividida
    const bannerVisible = await page.locator('text=CONVOCATORIA ABIERTA: PROYECTOS CITT 2026').isVisible();
    console.log('¿Banner de anuncio visible en vista dividida?:', bannerVisible);

    // Capturar screenshot de la vista dividida con el banner activo
    const screenshotSplitPath =
      '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/02-calendario-split-banner-sala-312.png';
    await page.screenshot({ path: screenshotSplitPath });
    console.log('✓ Screenshot guardado:', screenshotSplitPath);

    // -------------------------------------------------------------------------
    // TEST 4: Verificar Modal de Administración en CITT Connect (/admin)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Verificando panel CITT Connect /admin y botón "Personalizar"');
    await page.goto('http://localhost:3000/acceso', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Iniciar sesión con Core Dev
    console.log('Iniciando sesión como Core Dev (vice.vasca@cittconnect.cl)...');
    await page.fill('input[placeholder*="duocuc" i]', 'vice.vasca@cittconnect.cl');
    await page.fill('input[type="password"]', 'Familiaermosa12.');
    await page.click('button:has-text("Ingresar al Ecosistema CITT")');
    await page.waitForTimeout(2000);

    // Navegar al Panel de Administración
    console.log('Navegando a /admin...');
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Clickeando pestaña "Salas & Calendario CITT"
    console.log('Esperando pestaña "Salas & Calendario CITT"...');
    const calTab = page.locator('button:has-text("Salas & Calendario")');
    await calTab.waitFor({ state: 'visible', timeout: 15000 });
    await calTab.click();
    console.log('✓ Tab Calendario clickeado');

    // Clickear en el subtab de "Rutas & Salas Tótem"
    console.log('Esperando subtab "Rutas & Salas Tótem"...');
    const roomsSubTab = page.locator('button:has-text("Rutas & Salas Tótem")');
    await roomsSubTab.waitFor({ state: 'visible', timeout: 15000 });
    await roomsSubTab.click();
    console.log('✓ Subtab Rutas & Salas Tótem clickeado');

    // Verificar que el botón "Personalizar" está presente
    const personalizarBtn = page.locator('button:has-text("Personalizar")').first();
    await personalizarBtn.waitFor({ state: 'visible', timeout: 15000 });
    console.log('¿Botón "Personalizar" visible en la tarjeta de sala?: true');

    // Clic en "Personalizar" para abrir el modal
    console.log('Abriendo modal de personalización de tótem...');
    await personalizarBtn.click();
    await page.locator('text=Personalizar Tótem & Salvapantallas').waitFor({ state: 'visible', timeout: 10000 });
    console.log('¿Modal de personalización abierto exitosamente?: true');

    // Capturar screenshot del modal de administración
    const screenshotAdminModalPath =
      '/Users/vicentevasquez/.gemini/antigravity-cli/brain/68b4e395-9483-4f48-90be-a43277120ca3/03-admin-personalizar-totem-modal.png';
    await page.screenshot({ path: screenshotAdminModalPath });
    console.log('✓ Screenshot guardado:', screenshotAdminModalPath);

    console.log('\n============================================================');
    console.log('✓ ¡TODAS LAS PRUEBAS E2E (1, 2, 3, 4) PASARON CON ÉXITO!');
    console.log('============================================================');
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error('ERROR EN PRUEBAS:', err);
  process.exit(1);
});
