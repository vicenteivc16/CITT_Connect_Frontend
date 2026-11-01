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
      coverImageUrl: row.cover_image_url,
      readmeContent: row.readme_content,
      maturityStage: row.maturity_stage,
      isFeatured: row.is_featured,
      featuredReason: row.featured_reason,
      createdAt: new Date(row.created_at).toLocaleDateString('es-CL'),
      collaborators: [],
      applications: [],
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
      cover_image_url: project.coverImageUrl,
      readme_content: project.readmeContent,
      maturity_stage: project.maturityStage,
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
