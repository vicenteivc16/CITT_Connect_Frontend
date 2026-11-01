import { supabase, isSupabaseConfigured } from './client';

export interface SupabaseReservation {
  id: string;
  room: string;
  campus: string;
  inChargeName: string;
  inChargeEmail: string;
  inChargeRole: string;
  school: string;
  date: string;
  timeSlot: string;
  purpose: string;
  attendees: number;
  requiresComputers: boolean;
  status: string; // 'PENDING' | 'APPROVED' | 'REJECTED' | 'ATTENDED' | 'NO_SHOW'
  source: string;
  totemToken?: string;
  horasCitt: string;
  checkedIn: boolean;
  applicantUsername?: string;
  cittPassCode?: string;
  cittPassUrl?: string;
  cittPassSentAt?: string;
  createdAt: string;
}

export interface SupabaseAdminBlock {
  id: string;
  campus: string;
  room: string;
  blockDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export async function getSupabaseReservations(): Promise<SupabaseReservation[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Error fetching reservations:', error?.message);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      room: row.room,
      campus: row.campus,
      inChargeName: row.in_charge_name,
      inChargeEmail: row.in_charge_email,
      inChargeRole: row.in_charge_role,
      school: row.school,
      date: row.reservation_date,
      timeSlot: row.time_slot,
      purpose: row.purpose,
      attendees: row.attendees,
      requiresComputers: row.requires_computers,
      status: row.status,
      source: row.source,
      totemToken: row.totem_token,
      horasCitt: row.horas_citt,
      checkedIn: row.checked_in,
      applicantUsername: row.applicant_username,
      cittPassCode: row.citt_pass_code,
      cittPassUrl: row.citt_pass_url,
      cittPassSentAt: row.citt_pass_sent_at,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error('Exception fetching reservations:', err);
    return [];
  }
}

export async function createSupabaseReservation(
  rsv: Omit<SupabaseReservation, 'id' | 'createdAt'>
): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase no configurado' };
  }

  try {
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        room: rsv.room,
        campus: rsv.campus,
        in_charge_name: rsv.inChargeName,
        in_charge_email: rsv.inChargeEmail,
        in_charge_role: rsv.inChargeRole,
        school: rsv.school,
        reservation_date: rsv.date,
        time_slot: rsv.timeSlot,
        purpose: rsv.purpose,
        attendees: rsv.attendees,
        requires_computers: rsv.requiresComputers,
        status: rsv.status,
        source: rsv.source,
        totem_token: rsv.totemToken,
        horas_citt: rsv.horasCitt,
        checked_in: rsv.checkedIn,
        applicant_username: rsv.applicantUsername,
        citt_pass_code: rsv.cittPassCode,
        citt_pass_url: rsv.cittPassUrl,
        citt_pass_sent_at: rsv.cittPassSentAt,
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function updateSupabaseReservation(
  id: string,
  updates: Partial<{
    status: string;
    checkedIn: boolean;
    cittPassCode: string;
    cittPassUrl: string;
    cittPassSentAt: string;
  }>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const payload: any = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.checkedIn !== undefined) payload.checked_in = updates.checkedIn;
    if (updates.cittPassCode !== undefined) payload.citt_pass_code = updates.cittPassCode;
    if (updates.cittPassUrl !== undefined) payload.citt_pass_url = updates.cittPassUrl;
    if (updates.cittPassSentAt !== undefined) payload.citt_pass_sent_at = updates.cittPassSentAt;

    const { error } = await supabase
      .from('reservations')
      .update(payload)
      .match({ id });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function toggleCheckInSupabaseReservation(
  id: string,
  newCheckedIn: boolean
): Promise<{ success: boolean; error?: string }> {
  return updateSupabaseReservation(id, {
    checkedIn: newCheckedIn,
    status: newCheckedIn ? 'ATTENDED' : 'APPROVED',
  });
}

// ----------------- ADMIN BLOCKS -----------------

export async function getSupabaseAdminBlocks(): Promise<SupabaseAdminBlock[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('admin_blocks')
      .select('*')
      .order('block_date', { ascending: true });

    if (error || !data) {
      console.error('Error fetching admin blocks:', error?.message);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      campus: row.campus,
      room: row.room,
      blockDate: row.block_date,
      startTime: row.start_time,
      endTime: row.end_time,
      reason: row.reason,
      createdBy: row.created_by,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error('Exception fetching admin blocks:', err);
    return [];
  }
}

export async function createSupabaseAdminBlock(
  block: Omit<SupabaseAdminBlock, 'id' | 'createdAt'>
): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const { data, error } = await supabase
      .from('admin_blocks')
      .insert({
        campus: block.campus,
        room: block.room,
        block_date: block.blockDate,
        start_time: block.startTime,
        end_time: block.endTime,
        reason: block.reason,
        created_by: block.createdBy,
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteSupabaseAdminBlock(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const { error } = await supabase
      .from('admin_blocks')
      .delete()
      .match({ id });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
