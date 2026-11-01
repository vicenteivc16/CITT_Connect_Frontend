import { supabase, isSupabaseConfigured } from './client';
import { CittMemberProfile, CittRole } from '@/types/citt';

export async function getSupabaseProfiles(): Promise<CittMemberProfile[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data) {
      console.error('Error fetching profiles:', error?.message);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      username: row.username,
      fullName: row.full_name,
      email: row.email,
      careerTitle: row.career_title,
      currentOccupation: row.current_occupation,
      specialties: row.specialties || [],
      bio: row.bio || '',
      role: row.role,
      campusSlug: row.campus_slug,
      schoolSlug: row.school_slug,
      avatarUrl: row.avatar_url,
      bannerUrl: row.banner_url,
      academicTrack: row.academic_track,
      achievements: row.achievements || [],
      partnerOrganization: row.partner_organization,
      representedCareerInfo: row.represented_career_info,
      linkedinUrl: row.linkedin_url,
      githubUrl: row.github_url,
      portfolioUrl: row.portfolio_url,
      instagramUrl: row.instagram_url,
      phoneOptional: row.phone_optional,
      isOpenToCollaborate: row.is_open_to_collaborate ?? true,
      isVerified: row.is_verified ?? true,
    }));
  } catch (err) {
    console.error('Exception fetching profiles:', err);
    return [];
  }
}

export async function updateSupabaseProfileRole(username: string, newRole: CittRole): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('username', username);
    return !error;
  } catch {
    return false;
  }
}

export async function updateSupabaseProfileCampus(username: string, newCampusSlug: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ campus_slug: newCampusSlug, updated_at: new Date().toISOString() })
      .eq('username', username);
    return !error;
  } catch {
    return false;
  }
}

export async function toggleSupabaseProfileVerification(username: string, isVerified: boolean): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: isVerified, updated_at: new Date().toISOString() })
      .eq('username', username);
    return !error;
  } catch {
    return false;
  }
}
