import { supabase, isSupabaseConfigured } from './client';
import { ConnectionRequest } from '@/types/citt';

/**
 * Obtiene todas las solicitudes de conexión relevantes para un miembro
 */
export async function getSupabaseConnections(
  memberId: string
): Promise<ConnectionRequest[]> {
  if (!isSupabaseConfigured || !memberId) return [];

  try {
    const { data, error } = await supabase
      .from('connection_requests')
      .select('*')
      .or(`requester_id.eq.${memberId},receiver_id.eq.${memberId}`)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Error al consultar connection_requests:', error?.message);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      requesterId: row.requester_id,
      receiverId: row.receiver_id,
      status: row.status as 'pending' | 'accepted',
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.warn('Excepción en getSupabaseConnections:', err);
    return [];
  }
}

/**
 * Crea o envía una nueva solicitud de conexión bilateral
 */
export async function createSupabaseConnectionRequest(
  requesterId: string,
  receiverId: string
): Promise<ConnectionRequest | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const payload = {
      requester_id: requesterId,
      receiver_id: receiverId,
      status: 'pending',
    };

    const { data, error } = await supabase
      .from('connection_requests')
      .upsert(payload, { onConflict: 'requester_id,receiver_id' })
      .select()
      .single();

    if (error || !data) {
      console.warn('Error al crear connection_request:', error?.message);
      return null;
    }

    return {
      id: data.id,
      requesterId: data.requester_id,
      receiverId: data.receiver_id,
      status: data.status,
      createdAt: data.created_at,
    };
  } catch (err) {
    console.warn('Excepción en createSupabaseConnectionRequest:', err);
    return null;
  }
}

/**
 * Actualiza el estado de una conexión (ej. aceptar 'accepted' o rechazar 'rejected')
 */
export async function updateSupabaseConnectionStatus(
  requesterId: string,
  receiverId: string,
  status: 'pending' | 'accepted' | 'rejected'
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase
      .from('connection_requests')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .or(
        `and(requester_id.eq.${requesterId},receiver_id.eq.${receiverId}),and(requester_id.eq.${receiverId},receiver_id.eq.${requesterId})`
      );

    if (error) {
      console.warn('Error actualizando connection_request:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Excepción actualizando connection_request:', err);
    return false;
  }
}

/**
 * Elimina o cancela una conexión bilateral
 */
export async function deleteSupabaseConnection(
  requesterId: string,
  receiverId: string
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase
      .from('connection_requests')
      .delete()
      .or(
        `and(requester_id.eq.${requesterId},receiver_id.eq.${receiverId}),and(requester_id.eq.${receiverId},receiver_id.eq.${requesterId})`
      );

    if (error) {
      console.warn('Error eliminando connection_request:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Excepción eliminando connection_request:', err);
    return false;
  }
}
