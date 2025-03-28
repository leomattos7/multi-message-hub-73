
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import { mockSupabase } from '@/utils/mock-data-provider';

// Create a mock doctor service
export const doctorService = {
  getProfileByDoctorId: async (doctorId: string) => {
    const { data } = mockSupabase.from('doctor_profiles').select().eq('doctor_id', doctorId).single();
    return data;
  },
  
  createProfile: async (doctorId: string, profileData: any) => {
    const { data } = mockSupabase.from('doctor_profiles').insert({
      doctor_id: doctorId,
      ...profileData
    });
    return data;
  },
  
  updateProfile: async (doctorId: string, profileData: any) => {
    const { data } = mockSupabase.from('doctor_profiles').update(profileData).eq('doctor_id', doctorId);
    return data;
  },
  
  getProfileBySlug: async (slug: string) => {
    const { data } = mockSupabase.from('doctor_profiles').select().eq('public_url_slug', slug).single();
    return data;
  },
  
  // Add missing methods related to links
  getLinksByDoctorId: async (doctorId: string) => {
    const { data } = mockSupabase.from('doctor_links').select().eq('doctor_id', doctorId);
    return data;
  },
  
  createLink: async (linkData: any) => {
    const { data } = mockSupabase.from('doctor_links').insert(linkData);
    return data;
  },
  
  updateLink: async (linkId: string, linkData: any) => {
    const { data } = mockSupabase.from('doctor_links').update(linkData).eq('id', linkId);
    return data;
  },
  
  deleteLink: async (linkId: string) => {
    const { data } = mockSupabase.from('doctor_links').delete().eq('id', linkId);
    return data;
  }
};

// Create a mock tag service
export const tagService = {
  getTagsByDoctorId: async (doctorId: string) => {
    const { data } = mockSupabase.from('conversation_tags').select().eq('doctor_id', doctorId);
    return data || [];
  },
  
  createTag: async (tagData: any) => {
    const { data } = mockSupabase.from('conversation_tags').insert(tagData);
    return data;
  },
  
  updateTag: async (tagId: string, tagData: any) => {
    const { data } = mockSupabase.from('conversation_tags').update(tagData).eq('id', tagId);
    return data;
  },
  
  deleteTag: async (tagId: string) => {
    const { data } = mockSupabase.from('conversation_tags').delete().eq('id', tagId);
    return data;
  }
};

// Use mock Supabase client
export const supabase = mockSupabase;
