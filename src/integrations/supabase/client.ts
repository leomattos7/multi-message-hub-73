
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
  
  async archiveConversation(id: string) {
    const data = await this.updateConversation(id, { is_archived: true });
    return { success: true, data };
  },
  
  async unarchiveConversation(id: string) {
    const data = await this.updateConversation(id, { is_archived: false });
    return { success: true, data };
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
  },
  
  async addPatientFromConversation(conversation: any) {
    console.log("Adding patient from conversation:", conversation);
    
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("User not authenticated");
      
      // Check if the conversation has patient_id
      const patientId = conversation.patient_id;
      
      if (!patientId) {
        console.error('No patient_id available in conversation');
        throw new Error('No patient_id available in conversation');
      }
      
      // Get patient data from conversation
      const patientName = conversation.patient?.name || 
                         conversation.contact?.name || 
                         "Unknown Patient";
      
      const patientEmail = conversation.patient?.email || 
                          conversation.contact?.email || 
                          null;
                          
      const patientPhone = conversation.patient?.phone || 
                          conversation.contact?.phone || 
                          null;
                          
      const patientAvatar = conversation.patient?.avatar_url || 
                            conversation.contact?.avatar || 
                            null;
      
      console.log("Patient data to save:", {
        id: patientId,
        name: patientName,
        email: patientEmail,
        phone: patientPhone,
        avatar_url: patientAvatar,
        doctor_id: userId
      });
      
      // Check if patient already exists
      const { data: existingPatient, error: checkError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing patient:', checkError);
        throw checkError;
      }
      
      console.log("Existing patient check result:", existingPatient);
      
      let result;
      
      // If patient exists, update their data
      if (existingPatient) {
        console.log("Patient exists, updating...");
        const { data: updatedPatient, error: updateError } = await supabase
          .from('patients')
          .update({
            name: patientName,
            email: patientEmail,
            phone: patientPhone,
            avatar_url: patientAvatar,
            doctor_id: userId,
            updated_at: new Date().toISOString()
          })
          .eq('id', patientId)
          .select()
          .single();
        
        if (updateError) {
          console.error('Error updating patient:', updateError);
          throw updateError;
        }
        
        console.log("Patient updated successfully:", updatedPatient);
        result = updatedPatient;
      } else {
        // Create a new patient if they don't exist
        console.log("Patient doesn't exist, creating new...");
        const { data: newPatient, error: insertError } = await supabase
          .from('patients')
          .insert({
            id: patientId,
            name: patientName,
            email: patientEmail,
            phone: patientPhone,
            avatar_url: patientAvatar,
            doctor_id: userId
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating patient:', insertError);
          throw insertError;
        }
        
        console.log("New patient created successfully:", newPatient);
        result = newPatient;
      }
      
      return { success: true, data: result };
    } catch (error) {
      console.error("Error in addPatientFromConversation:", error);
      return { success: false, error };
    }
  }
};

// Doctor profile and links service
export const doctorProfileService = {
  async getProfileByDoctorId(doctorId: string) {
    // Convert user-prefixed IDs to valid UUIDs if needed
    let queryId = doctorId;
    
    // For non-UUID doctorIds, try to find a profile that matches this exact id
    // since we removed the foreign key constraint
    
    const { data, error } = await supabase
      .from('doctor_profiles')
      .select('*')
      .eq('id', queryId)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
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
    // Make sure the slug is unique
    const slug = profile.public_url_slug.toLowerCase().replace(/\s+/g, '-');
    
    const { data: existingProfile, error: checkError } = await supabase
      .from('doctor_profiles')
      .select('public_url_slug')
      .eq('public_url_slug', slug)
      .maybeSingle();
      
    if (checkError && checkError.code !== 'PGRST116') throw checkError;
    
    if (existingProfile) {
      throw new Error('Este nome de URL já está em uso. Por favor, escolha outro.');
    }
    
    // Use the original ID as is - we've removed the foreign key constraint
    // so we can now store any ID format
    let profileId = doctorId;
    
    // Insert the new profile with the doctor's ID
    const { data, error } = await supabase
      .from('doctor_profiles')
      .insert({
        id: profileId,
        bio: profile.bio,
        specialty: profile.specialty,
        profile_image_url: profile.profile_image_url,
        public_url_slug: slug,
        theme: profile.theme || 'default'
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
    
    return data;
  },
  
  async updateProfile(doctorId: string, updates: any) {
    // First check if profile exists
    const { data: existingProfile } = await this.getProfileByDoctorId(doctorId);
    
    if (!existingProfile) {
      throw new Error('Perfil não encontrado');
    }
    
    const { data, error } = await supabase
      .from('doctor_profiles')
      .update(updates)
      .eq('id', existingProfile.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async getLinksByDoctorId(doctorId: string) {
    // First check if profile exists
    const { data: existingProfile } = await this.getProfileByDoctorId(doctorId);
    
    if (!existingProfile) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('doctor_links')
      .select('*')
      .eq('doctor_id', existingProfile.id)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
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
