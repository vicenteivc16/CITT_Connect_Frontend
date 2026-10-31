import { supabase, isSupabaseConfigured } from './client';
import { CittMemberProfile } from '@/types/citt';

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
