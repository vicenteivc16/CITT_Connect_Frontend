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

export async function updateSupabaseProfile(
  profile: CittMemberProfile
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.fullName,
        career_title: profile.careerTitle,
        current_occupation: profile.currentOccupation,
        specialties: profile.specialties,
        bio: profile.bio,
        campus_slug: profile.campusSlug,
        school_slug: profile.schoolSlug,
        avatar_url: profile.avatarUrl,
        banner_url: profile.bannerUrl,
        academic_track: profile.academicTrack,
        achievements: profile.achievements,
        partner_organization: profile.partnerOrganization,
        represented_career_info: profile.representedCareerInfo,
        linkedin_url: profile.linkedinUrl,
        github_url: profile.githubUrl,
        portfolio_url: profile.portfolioUrl,
        instagram_url: profile.instagramUrl,
        phone_optional: profile.phoneOptional,
        is_open_to_collaborate: profile.isOpenToCollaborate,
        updated_at: new Date().toISOString(),
      })
      .eq('username', profile.username);

    if (error) {
      console.warn('Supabase update profile error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error)?.message || 'Error de red' };
  }
}
