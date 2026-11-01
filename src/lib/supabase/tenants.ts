import { supabase, isSupabaseConfigured } from './client';

export interface CampusRoom {
  id: string;
  campusSlug: string;
  roomName: string;
  roomSlug: string;
  capacity: number;
  computersCount: number;
  hasMakerTools: boolean;
  hasIotEquipment: boolean;
  isActive: boolean;
  totemToken?: string;
  createdAt: string;
}

export async function getSupabaseCampusRooms(campusSlug?: string): Promise<CampusRoom[]> {
  if (!isSupabaseConfigured) return [];

  try {
    let query = supabase.from('campus_rooms').select('*').order('room_name', { ascending: true });
    if (campusSlug && campusSlug !== 'nacional') {
      query = query.eq('campus_slug', campusSlug);
    }

    const { data, error } = await query;
    if (error || !data) {
      console.error('Error fetching campus rooms:', error?.message);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      campusSlug: row.campus_slug,
      roomName: row.room_name,
      roomSlug: row.room_slug || row.room_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      capacity: row.capacity,
      computersCount: row.computers_count,
      hasMakerTools: row.has_maker_tools,
      hasIotEquipment: row.has_iot_equipment,
      isActive: row.is_active,
      totemToken: row.totem_token,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error('Exception fetching campus rooms:', err);
    return [];
  }
}

export async function createSupabaseCampusRoom(
  room: Omit<CampusRoom, 'id' | 'createdAt' | 'roomSlug'> & { roomSlug?: string }
): Promise<CampusRoom | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const slug =
      room.roomSlug?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
      room.roomName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const payload = {
      campus_slug: room.campusSlug,
      room_name: room.roomName,
      room_slug: slug,
      capacity: room.capacity,
      computers_count: room.computersCount,
      has_maker_tools: room.hasMakerTools,
      has_iot_equipment: room.hasIotEquipment,
      is_active: room.isActive,
      totem_token: room.totemToken || `totem_${room.campusSlug}_${Date.now().toString(36)}`,
    };

    const { data, error } = await supabase.from('campus_rooms').insert(payload).select().single();
    if (error || !data) {
      console.error('Error creating campus room:', error?.message);
      return null;
    }

    return {
      id: data.id,
      campusSlug: data.campus_slug,
      roomName: data.room_name,
      roomSlug: data.room_slug,
      capacity: data.capacity,
      computersCount: data.computers_count,
      hasMakerTools: data.has_maker_tools,
      hasIotEquipment: data.has_iot_equipment,
      isActive: data.is_active,
      totemToken: data.totem_token,
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error('Exception creating campus room:', err);
    return null;
  }
}

export async function toggleSupabaseRoomActive(roomId: string, isActive: boolean): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase
      .from('campus_rooms')
      .update({ is_active: isActive })
      .eq('id', roomId);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSupabaseCampusRoom(roomId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase.from('campus_rooms').delete().eq('id', roomId);
    return !error;
  } catch {
    return false;
  }
}
