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
  status: string;
  source: string;
  totemToken?: string;
  horasCitt: string;
  checkedIn: boolean;
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
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function toggleCheckInSupabaseReservation(
  id: string,
  newCheckedIn: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const { error } = await supabase
      .from('reservations')
      .update({ checked_in: newCheckedIn })
      .match({ id });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
