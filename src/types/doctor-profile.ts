
export interface DoctorProfile {
  id: string;
  bio?: string;
  profile_image_url?: string;
  specialty?: string;
  public_url_slug: string;
  theme?: string;
  created_at: string;
  updated_at: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  
  // Join fields
  doctor_links?: DoctorLink[];
}

import { DoctorLink } from './doctor-link';
