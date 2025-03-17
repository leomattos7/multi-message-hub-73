
export interface DoctorProfile {
  id: string;
  bio: string | null;
  specialty: string | null;
  profile_image_url: string | null;
  public_url_slug: string;
  theme: string;
  created_at: string;
  updated_at: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  consultation_duration?: string | null;
  follow_up_duration?: string | null;
  urgent_duration?: string | null;
}

export interface DoctorLink {
  id: string;
  doctor_id: string;
  title: string;
  url: string;
  icon: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type ProfileTheme = 'default' | 'dark' | 'light' | 'blue' | 'green' | 'purple';

export interface ThemeOption {
  value: ProfileTheme;
  label: string;
  previewClass: string;
}
