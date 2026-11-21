import { supabase, isSupabaseConfigured } from './client';
import { CittProject } from '@/types/citt';

export async function getSupabaseProjects(): Promise<CittProject[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Error fetching projects:', error?.message);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      status: row.status,
      leadUsername: row.lead_username,
      leadName: row.lead_name,
      leadRole: row.lead_role,
      originCampusSlug: row.origin_campus_slug,
      schoolSlug: row.school_slug,
      lookingForCollaborators: row.looking_for_collaborators,
      neededSpecialties: row.needed_specialties || [],
      helpRequestDetails: row.help_request_details || '',
      repoUrl: row.repo_url,
      videoUrl: row.video_url || undefined,
      coverImageUrl: row.cover_image_url,
      galleryImages: row.gallery_images || [],
      readmeContent: row.readme_content,
      maturityStage: row.maturity_stage,
      applicationMode: row.application_mode || 'direct',
      applicationQuestions: row.application_questions || [],
      isFeatured: row.is_featured,
      featuredReason: row.featured_reason,
      createdAt: new Date(row.created_at).toLocaleDateString('es-CL'),
      collaborators: row.collaborators || [],
      applications: row.applications || [],
    }));
  } catch (err) {
    console.error('Exception fetching projects from Supabase:', err);
    return [];
  }
}

export async function createSupabaseProject(
  project: Omit<CittProject, 'id' | 'createdAt'>
): Promise<CittProject | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const payload = {
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      status: project.status,
      lead_username: project.leadUsername,
      lead_name: project.leadName,
      lead_role: project.leadRole,
      origin_campus_slug: project.originCampusSlug,
      school_slug: project.schoolSlug,
      looking_for_collaborators: project.lookingForCollaborators,
      needed_specialties: project.neededSpecialties,
      help_request_details: project.helpRequestDetails,
      repo_url: project.repoUrl,
      video_url: project.videoUrl,
      cover_image_url: project.coverImageUrl,
      gallery_images: project.galleryImages || [],
      readme_content: project.readmeContent,
      maturity_stage: project.maturityStage,
      application_mode: project.applicationMode || 'direct',
      application_questions: project.applicationQuestions || [],
      is_featured: project.isFeatured || false,
      featured_reason: project.featuredReason,
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(payload)
      .select()
      .single();

    if (error || !data) {
      console.error('Error inserting project into Supabase:', error?.message);
      return null;
    }

    return {
      ...project,
      id: data.id,
      createdAt: 'Recién publicado',
      collaborators: project.collaborators || [],
      applications: project.applications || [],
    };
  } catch (err) {
    console.error('Exception inserting project into Supabase:', err);
    return null;
  }
}

export async function updateSupabaseProject(
  id: string,
  updates: Partial<CittProject>
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const payload: Record<string, unknown> = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.summary !== undefined) payload.summary = updates.summary;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.lookingForCollaborators !== undefined)
      payload.looking_for_collaborators = updates.lookingForCollaborators;
    if (updates.neededSpecialties !== undefined)
      payload.needed_specialties = updates.neededSpecialties;
    if (updates.helpRequestDetails !== undefined)
      payload.help_request_details = updates.helpRequestDetails;
    if (updates.repoUrl !== undefined) payload.repo_url = updates.repoUrl;
    if (updates.videoUrl !== undefined) payload.video_url = updates.videoUrl;
    if (updates.coverImageUrl !== undefined)
      payload.cover_image_url = updates.coverImageUrl;
    if (updates.galleryImages !== undefined)
      payload.gallery_images = updates.galleryImages;
    if (updates.readmeContent !== undefined)
      payload.readme_content = updates.readmeContent;
    if (updates.maturityStage !== undefined)
      payload.maturity_stage = updates.maturityStage;
    if (updates.isFeatured !== undefined) payload.is_featured = updates.isFeatured;
    if (updates.featuredReason !== undefined)
      payload.featured_reason = updates.featuredReason;
    if (updates.collaborators !== undefined)
      payload.collaborators = updates.collaborators;
    if (updates.applications !== undefined)
      payload.applications = updates.applications;

    payload.updated_at = new Date().toISOString();

    const { error } = await supabase.from('projects').update(payload).eq('id', id);
    return !error;
  } catch (err) {
    console.warn('Exception updating Supabase project:', err);
    return false;
  }
}
