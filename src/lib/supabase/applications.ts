import { supabase, isSupabaseConfigured } from './client';
import { ProjectApplication, CittRole, DuocSchoolSlug } from '@/types/citt';

/**
 * Consulta postulaciones a proyectos desde Supabase
 */
export async function getSupabaseProjectApplications(
  projectId?: string,
  applicantUsername?: string
): Promise<ProjectApplication[]> {
  if (!isSupabaseConfigured) return [];

  try {
    let query = supabase.from('project_applications').select('*');

    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    if (applicantUsername) {
      query = query.eq('applicant_username', applicantUsername);
    }

    const { data, error } = await query.order('applied_at', { ascending: false });

    if (error || !data) {
      console.warn('Error al consultar project_applications:', error?.message);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      projectId: row.project_id,
      applicantUsername: row.applicant_username,
      applicantName: row.applicant_name,
      applicantEmail: row.applicant_email,
      applicantRole: row.applicant_role as CittRole,
      applicantCampusSlug: row.applicant_campus_slug,
      applicantSchoolSlug: row.applicant_school_slug as DuocSchoolSlug,
      appliedAt: row.applied_at,
      status: row.status as 'pending' | 'accepted' | 'rejected',
      answers: row.answers || {},
      note: row.note || '',
    }));
  } catch (err) {
    console.warn('Excepción en getSupabaseProjectApplications:', err);
    return [];
  }
}

/**
 * Registra una postulación a un proyecto en Supabase
 */
export async function createSupabaseProjectApplication(
  app: Omit<ProjectApplication, 'id' | 'appliedAt'>
): Promise<ProjectApplication | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const payload = {
      project_id: app.projectId,
      applicant_username: app.applicantUsername,
      applicant_name: app.applicantName,
      applicant_email: app.applicantEmail,
      applicant_role: app.applicantRole,
      applicant_campus_slug: app.applicantCampusSlug,
      applicant_school_slug: app.applicantSchoolSlug,
      status: app.status || 'pending',
      answers: app.answers || {},
      note: app.note || '',
    };

    const { data, error } = await supabase
      .from('project_applications')
      .upsert(payload, { onConflict: 'project_id,applicant_username' })
      .select()
      .single();

    if (error || !data) {
      console.warn('Error creando project_application:', error?.message);
      return null;
    }

    return {
      id: data.id,
      projectId: data.project_id,
      applicantUsername: data.applicant_username,
      applicantName: data.applicant_name,
      applicantEmail: data.applicant_email,
      applicantRole: data.applicant_role as CittRole,
      applicantCampusSlug: data.applicant_campus_slug,
      applicantSchoolSlug: data.applicant_school_slug as DuocSchoolSlug,
      appliedAt: data.applied_at,
      status: data.status,
      answers: data.answers || {},
      note: data.note || '',
    };
  } catch (err) {
    console.warn('Excepción en createSupabaseProjectApplication:', err);
    return null;
  }
}

/**
 * Actualiza el estado de una postulación (aceptada o rechazada)
 */
export async function updateSupabaseProjectApplicationStatus(
  projectId: string,
  applicantUsername: string,
  status: 'pending' | 'accepted' | 'rejected'
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase
      .from('project_applications')
      .update({
        status,
      })
      .match({ project_id: projectId, applicant_username: applicantUsername });

    if (error) {
      console.warn('Error actualizando estado de project_application:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Excepción actualizando project_application:', err);
    return false;
  }
}
