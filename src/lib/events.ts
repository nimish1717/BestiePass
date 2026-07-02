import { supabase } from './supabase';

export type EventType = 'fixed' | 'flexible';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  venue: string;
  personalized_message: string;
  cover_emoji: string;
  fixed_date?: string;
  fixed_start_time?: string;
  fixed_end_time?: string;
  range_start_date?: string;
  range_end_date?: string;
  allowed_start_time?: string;
  allowed_end_time?: string;
  created_at: string;
}

export interface RSVP {
  id: string;
  event_id: string;
  guest_name: string;
  status: 'confirmed' | 'declined' | 'pending';
  selected_date?: string;
  selected_start_time?: string;
  selected_end_time?: string;
  responded_at: string;
}

export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching event:', error);
    return null;
  }
  return data;
}

export async function submitRSVP(rsvp: Partial<RSVP>): Promise<RSVP | null> {
  const { data, error } = await supabase
    .from('rsvps')
    .insert(rsvp)
    .select()
    .single();

  if (error || !data) {
    console.error('Error submitting RSVP:', error);
    return null;
  }
  return data;
}
