// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ivmtkdgyzogtaxsyzcsn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2bXRrZGd5em9ndGF4c3l6Y3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNzI1OTcsImV4cCI6MjA1Nzc0ODU5N30.k1iMjtGFxS6ciQkowiLSpNJHobHOnsVYeWojnJiCjm8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Function to generate a UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper to get current user ID
export const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};

// Conversations and messages utility functions
export const conversationService = {
  async getConversations() {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        patient:patients(id, name, email, phone, avatar_url)
      `)
      .eq('doctor_id', userId)
      .order('last_activity', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async getConversation(id: string) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        patient:patients(id, name, email, phone, avatar_url),
        messages(*)
      `)
      .eq('id', id)
      .eq('doctor_id', userId)
      .order('messages.timestamp', { ascending: true })
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async updateConversation(id: string, updates: any) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', id)
      .eq('doctor_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async sendMessage(conversationId: string, content: string) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    // Update the conversation's last_activity timestamp
    await supabase
      .from('conversations')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', conversationId)
      .eq('doctor_id', userId);
    
    // Insert the new message
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content,
        is_outgoing: true,
        status: 'sent'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Doctor profile and links service
export const doctorProfileService = {
  async getProfileByDoctorId(doctorId: string) {
    try {
      console.log("Getting profile for doctor ID:", doctorId);
      
      // Get the profile using a direct query
      const { data, error } = await supabase
        .from('doctor_profiles')
        .select('*')
        .eq('id', doctorId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching doctor profile:", error);
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error("Error in getProfileByDoctorId:", error);
      throw error;
    }
  },
  
  async getProfileBySlug(slug: string) {
    const { data, error } = await supabase
      .from('doctor_profiles')
      .select(`
        *,
        doctor_links(*)
      `)
      .eq('public_url_slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async createProfile(doctorId: string, profile: any) {
    try {
      // Make sure the slug is unique
      const slug = profile.public_url_slug.toLowerCase().replace(/\s+/g, '-');
      
      console.log("Checking if slug exists:", slug);
      const { data: existingProfile, error: checkError } = await supabase
        .from('doctor_profiles')
        .select('public_url_slug')
        .eq('public_url_slug', slug)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking slug existence:", checkError);
        throw checkError;
      }
      
      if (existingProfile) {
        console.error("Slug already exists:", slug);
        throw new Error('Este nome de URL já está em uso. Por favor, escolha outro.');
      }
      
      console.log("Creating profile with doctor ID:", doctorId);
      
      // Use the RPC function to create the profile
      const { error } = await supabase.rpc('create_doctor_profile', {
        p_id: doctorId,
        p_bio: profile.bio || null,
        p_specialty: profile.specialty || null,
        p_name: profile.name || null,
        p_email: profile.email || null,
        p_phone: profile.phone || null,
        p_address: profile.address || null,
        p_profile_image_url: profile.profile_image_url || null,
        p_public_url_slug: slug,
        p_theme: profile.theme || 'default'
      });
      
      if (error) {
        console.error("Error creating profile:", error);
        throw error;
      }
      
      // Get the created profile
      const { data: newProfile, error: getError } = await supabase
        .from('doctor_profiles')
        .select('*')
        .eq('id', doctorId)
        .single();
        
      if (getError) {
        console.error("Error retrieving created profile:", getError);
        throw getError;
      }
      
      console.log("Profile created successfully:", newProfile);
      return newProfile;
    } catch (error: any) {
      console.error("Error in createProfile:", error);
      throw error;
    }
  },
  
  async updateProfile(doctorId: string, updates: any) {
    try {
      console.log("Updating profile for doctor ID:", doctorId);
      
      // First check if profile exists
      const existingProfile = await this.getProfileByDoctorId(doctorId);
      
      if (!existingProfile) {
        console.error("Profile not found for doctor ID:", doctorId);
        throw new Error('Perfil não encontrado');
      }
      
      // Use the RPC function to update the profile
      const { error } = await supabase.rpc('update_doctor_profile', {
        p_id: doctorId,
        p_bio: updates.bio || null,
        p_specialty: updates.specialty || null,
        p_name: updates.name || null,
        p_email: updates.email || null,
        p_phone: updates.phone || null,
        p_address: updates.address || null,
        p_profile_image_url: updates.profile_image_url || null,
        p_theme: updates.theme || 'default'
      });
      
      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
      
      // Get the updated profile
      const { data: updatedProfile, error: getError } = await supabase
        .from('doctor_profiles')
        .select('*')
        .eq('id', doctorId)
        .single();
        
      if (getError) {
        console.error("Error retrieving updated profile:", getError);
        throw getError;
      }
      
      console.log("Profile updated successfully:", updatedProfile);
      return updatedProfile;
    } catch (error: any) {
      console.error("Error in updateProfile:", error);
      throw error;
    }
  },
  
  async getLinksByDoctorId(doctorId: string) {
    try {
      console.log("Getting links for doctor ID:", doctorId);
      
      // First check if profile exists
      const existingProfile = await this.getProfileByDoctorId(doctorId);
      
      if (!existingProfile) {
        console.log("No profile found for doctor ID:", doctorId);
        return [];
      }
      
      const { data, error } = await supabase
        .from('doctor_links')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error("Error fetching doctor links:", error);
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error("Error in getLinksByDoctorId:", error);
      throw error;
    }
  },
  
  async createLink(link: any) {
    // Add the current user ID if not provided
    if (!link.doctor_id) {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("User not authenticated");
      link.doctor_id = userId;
    }
    
    // Get the current highest display order
    const { data: links, error: fetchError } = await supabase
      .from('doctor_links')
      .select('display_order')
      .eq('doctor_id', link.doctor_id)
      .order('display_order', { ascending: false })
      .limit(1);
    
    if (fetchError) throw fetchError;
    
    const nextOrder = links && links.length > 0 ? links[0].display_order + 1 : 1;
    
    const { data, error } = await supabase
      .from('doctor_links')
      .insert({
        doctor_id: link.doctor_id,
        title: link.title,
        url: link.url,
        icon: link.icon,
        is_active: link.is_active !== undefined ? link.is_active : true,
        display_order: nextOrder
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async updateLink(linkId: string, updates: any) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('doctor_links')
      .update(updates)
      .eq('id', linkId)
      .eq('doctor_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async deleteLink(linkId: string) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const { error } = await supabase
      .from('doctor_links')
      .delete()
      .eq('id', linkId)
      .eq('doctor_id', userId);
    
    if (error) throw error;
    return { success: true };
  },
  
  async reorderLinks(doctorId: string, linkIds: string[]) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    // Update each link with its new display order
    const updates = linkIds.map((id, index) => {
      return supabase
        .from('doctor_links')
        .update({ display_order: index + 1 })
        .eq('id', id)
        .eq('doctor_id', userId);
    });
    
    await Promise.all(updates);
    
    return { success: true };
  }
};
