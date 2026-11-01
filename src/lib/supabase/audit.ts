import { supabase, isSupabaseConfigured } from './client';
import { CittRole } from '@/types/citt';

export interface AuditLogEntry {
  id: string;
  campusSlug: string;
  actorUsername: string;
  actorName: string;
  actorRole: CittRole;
  actionType: string;
  title: string;
  details: Record<string, any>;
  createdAt: string;
}

export async function getSupabaseAuditLogs(campusSlug?: string, limit = 50): Promise<AuditLogEntry[]> {
  if (!isSupabaseConfigured) return [];

  try {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (campusSlug && campusSlug !== 'nacional') {
      query = query.eq('campus_slug', campusSlug);
    }

    const { data, error } = await query;
    if (error || !data) {
      console.error('Error fetching audit logs:', error?.message);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      campusSlug: row.campus_slug,
      actorUsername: row.actor_username,
      actorName: row.actor_name,
      actorRole: row.actor_role,
      actionType: row.action_type,
      title: row.title,
      details: row.details || {},
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error('Exception fetching audit logs:', err);
    return [];
  }
}

export async function logAuditEvent(entry: {
  campusSlug: string;
  actorUsername: string;
  actorName: string;
  actorRole: CittRole;
  actionType: string;
  title: string;
  details?: Record<string, any>;
}): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const payload = {
      campus_slug: entry.campusSlug,
      actor_username: entry.actorUsername,
      actor_name: entry.actorName,
      actor_role: entry.actorRole,
      action_type: entry.actionType,
      title: entry.title,
      details: entry.details || {},
    };

    const { error } = await supabase.from('audit_logs').insert(payload);
    return !error;
  } catch {
    return false;
  }
}
