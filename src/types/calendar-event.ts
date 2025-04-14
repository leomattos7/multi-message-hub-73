
export interface CalendarEvent {
  id: string;
  doctor_id: string;
  title: string;
  description?: string;
  date: string;
  start_time: string;
  end_time: string;
  event_type: string;
  created_at: string;
}
