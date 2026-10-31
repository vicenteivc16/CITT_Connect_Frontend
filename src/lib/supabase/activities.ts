import { supabase, isSupabaseConfigured } from './client';
import { CittActivity, CittMemberProfile } from '@/types/citt';

export async function getSupabaseActivities(): Promise<CittActivity[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data: actRows, error: actErr } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });

    if (actErr || !actRows) {
      console.error('Error fetching activities from Supabase:', actErr?.message);
      return [];
    }

    const { data: enrRows, error: enrErr } = await supabase
      .from('activity_enrollments')
      .select('activity_id, username, status');

    if (enrErr) {
      console.warn('Could not fetch enrollments:', enrErr.message);
    }

    const enrollmentsByActId: Record<string, { enrolled: string[]; waiting: string[] }> = {};
    (enrRows || []).forEach((enr) => {
      if (!enrollmentsByActId[enr.activity_id]) {
        enrollmentsByActId[enr.activity_id] = { enrolled: [], waiting: [] };
      }
      if (enr.status === 'confirmed' || enr.status === 'attended') {
        enrollmentsByActId[enr.activity_id].enrolled.push(enr.username);
      } else if (enr.status === 'waiting_list') {
        enrollmentsByActId[enr.activity_id].waiting.push(enr.username);
      }
    });

    return actRows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      detailedDescription: row.detailed_description,
      schoolSlug: row.school_slug,
      campusSlug: row.campus_slug,
      roomLocation: row.room_location,
      modality: row.modality,
      status: row.status,
      instructorName: row.instructor_name,
      instructorRole: row.instructor_role,
      instructorUsername: row.instructor_username,
      instructorAvatarUrl: row.instructor_avatar_url,
      capacityPerSession: row.capacity_per_session,
      sessionsCountPerWeek: row.sessions_count_per_week,
      totalSeats: row.total_seats,
      enrolledUsernames: enrollmentsByActId[row.id]?.enrolled || [],
      waitingListUsernames: enrollmentsByActId[row.id]?.waiting || [],
      tags: row.tags || [],
      coverImageUrl: row.cover_image_url || '/assets/citt-hero-lobby.webp',
      schedule: {
        daysDescription: row.days_description,
        sessionTime: row.session_time,
        frequencyPerWeek: row.frequency_per_week,
        durationWeeks: row.duration_weeks,
        startDate: row.start_date || '',
        endDate: row.end_date || '',
        totalHoursCitt: row.total_hours_citt,
      },
      studyMaterials: (row.study_materials as any) || [],
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error('Exception fetching activities from Supabase:', err);
    return [];
  }
}

export async function enrollInSupabaseActivity(
  activityId: string,
  user: CittMemberProfile,
  isWaitingList: boolean = false
): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    return { success: true, message: 'Inscripción simulada en modo local.' };
  }

  try {
    const { error } = await supabase.from('activity_enrollments').insert({
      activity_id: activityId,
      username: user.username,
      user_email: user.email,
      user_full_name: user.fullName,
      user_role: user.role,
      user_campus_slug: user.campusSlug,
      user_school_slug: user.schoolSlug,
      status: isWaitingList ? 'waiting_list' : 'confirmed',
    });

    if (error) {
      if (error.code === '23505') {
        return { success: false, message: 'Ya te encuentras inscrito en esta actividad.' };
      }
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: isWaitingList
        ? 'Cupo agotado. Has quedado registrado en la Lista de Espera de Supabase.'
        : '¡Inscripción confirmada y guardada en Supabase!',
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Error de red con Supabase' };
  }
}

export async function unenrollFromSupabaseActivity(
  activityId: string,
  username: string
): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    return { success: true, message: 'Inscripción cancelada en modo local.' };
  }

  try {
    const { error } = await supabase
      .from('activity_enrollments')
      .delete()
      .match({ activity_id: activityId, username });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Cupo liberado con éxito en Supabase.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Error de conexión' };
  }
}

export async function createSupabaseActivity(
  activity: Omit<CittActivity, 'id' | 'createdAt' | 'enrolledUsernames'>
): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase no configurado' };
  }

  try {
    const { data, error } = await supabase
      .from('activities')
      .insert({
        slug: activity.slug,
        title: activity.title,
        description: activity.description,
        detailed_description: activity.detailedDescription,
        school_slug: activity.schoolSlug,
        campus_slug: activity.campusSlug,
        room_location: activity.roomLocation,
        modality: activity.modality,
        status: activity.status,
        instructor_name: activity.instructorName,
        instructor_role: activity.instructorRole,
        instructor_username: activity.instructorUsername,
        instructor_avatar_url: activity.instructorAvatarUrl,
        capacity_per_session: activity.capacityPerSession,
        sessions_count_per_week: activity.sessionsCountPerWeek,
        total_seats: activity.totalSeats,
        days_description: activity.schedule.daysDescription,
        session_time: activity.schedule.sessionTime,
        frequency_per_week: activity.schedule.frequencyPerWeek,
        duration_weeks: activity.schedule.durationWeeks,
        start_date: activity.schedule.startDate || null,
        end_date: activity.schedule.endDate || null,
        total_hours_citt: activity.schedule.totalHoursCitt,
        tags: activity.tags,
        cover_image_url: activity.coverImageUrl,
        study_materials: activity.studyMaterials,
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
