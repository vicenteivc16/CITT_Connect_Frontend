const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://aroepwtqrxobsjsuazqd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyb2Vwd3RxcnhvYnNqc3VhenFkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzQ4NjMwOCwiZXhwIjoyMTA5MDYyMzA4fQ.JDj9-UkSrKGYdU7KjS732UJZcsh0fl9z-D6ZlR-tjiw';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log('1. Limpiando datos hardcodeados y tablas en Supabase...');
  
  // Limpiar enrollments
  const { error: errEnr } = await supabase.from('activity_enrollments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (errEnr) console.warn('Error borrando activity_enrollments:', errEnr.message);
  else console.log('✓ activity_enrollments limpio');

  // Limpiar activities
  const { error: errAct } = await supabase.from('activities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (errAct) console.warn('Error borrando activities:', errAct.message);
  else console.log('✓ activities limpio');

  // Limpiar reservations
  const { error: errRes } = await supabase.from('reservations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (errRes) console.warn('Error borrando reservations:', errRes.message);
  else console.log('✓ reservations limpio');

  // Limpiar admin_blocks
  const { error: errBlk } = await supabase.from('admin_blocks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (errBlk) console.warn('Error borrando admin_blocks:', errBlk.message);
  else console.log('✓ admin_blocks limpio');

  // Limpiar projects
  const { error: errPrj } = await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (errPrj) console.warn('Error borrando projects:', errPrj.message);
  else console.log('✓ projects limpio');

  // Limpiar profiles
  const { error: errProf } = await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (errProf) console.warn('Error borrando profiles:', errProf.message);
  else console.log('✓ profiles limpio');

  // Limpiar usuarios previos en auth
  console.log('2. Limpiando usuarios en Supabase Auth...');
  const { data: usersData, error: errUsers } = await supabase.auth.admin.listUsers();
  if (usersData && usersData.users) {
    for (const u of usersData.users) {
      console.log(`Eliminando auth user: ${u.email} (${u.id})`);
      await supabase.auth.admin.deleteUser(u.id);
    }
  }

  // 3. Crear cuenta admin core dev
  console.log('3. Creando cuenta admin core dev...');
  const adminEmail = 'vice.vasca@cittconnect.cl';
  const adminPassword = 'Familiaermosa12.';
  const adminUsername = 'vice.vasca';

  const { data: newAuthUser, error: createAuthErr } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      full_name: 'Vicente Vásquez',
      username: adminUsername,
      citt_role: 'dev',
      campus_slug: 'san-bernardo',
      school_slug: 'informatica',
      career_title: 'Core Dev & Lead Architect',
      is_verified: true
    }
  });

  if (createAuthErr) {
    console.error('Error creando admin auth:', createAuthErr.message);
    return;
  }
  console.log('✓ Auth user creado con éxito ID:', newAuthUser.user.id);

  // 4. Crear profile en public.profiles
  const adminProfile = {
    id: newAuthUser.user.id,
    username: adminUsername,
    full_name: 'Vicente Vásquez',
    email: adminEmail,
    career_title: 'Core Dev & Lead Architect',
    current_occupation: 'Lead Full-Stack Developer & CITT Architect',
    specialties: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Supabase', 'Tailwind CSS', 'Hardware IoT'],
    bio: 'Cuenta Administradora y Core Dev oficial del ecosistema CITT Connect. Gestión técnica, arquitectura de software e infraestructura.',
    role: 'dev',
    campus_slug: 'san-bernardo',
    school_slug: 'informatica',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
    banner_url: '/assets/citt-hero-lobby.webp',
    academic_track: 'Core Team CITT',
    achievements: ['Core Dev & SuperAdmin CITT Connect', 'Arquitecto de Plataforma'],
    is_open_to_collaborate: true,
    is_verified: true,
    linkedin_url: 'https://linkedin.com/in/vicente-vasquez',
    github_url: 'https://github.com/vicenteivc16'
  };

  const { error: insProfErr } = await supabase.from('profiles').insert(adminProfile);
  if (insProfErr) {
    console.error('Error insertando admin profile:', insProfErr.message);
  } else {
    console.log('✓ Perfil admin en public.profiles creado con éxito!');
  }

  console.log('--- BASE DE DATOS LIMPIA Y RECONFIGURADA DESDE CERO ---');
}

main().catch(console.error);
