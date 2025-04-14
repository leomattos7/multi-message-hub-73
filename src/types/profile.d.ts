
export interface Profile {
  id: string;
  name: string;
  email?: string;
  role: string;
  organization_id?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}
