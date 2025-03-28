
import { supabase } from "@/integrations/supabase/client";
import { DoctorProfile, DoctorLink } from "@/components/DoctorProfile/types";

export const doctorProfileService = {
  /**
   * Gets a doctor's profile by their ID
   */
  async getProfileByDoctorId(doctorId: string): Promise<DoctorProfile | null> {
    try {
      console.log("Fetching profile for doctor ID:", doctorId);
      
      const { data, error } = await supabase
        .from("doctor_profiles")
        .select("*")
        .eq("id", doctorId)
        .single();

      if (error) {
        console.error("Error fetching doctor profile:", error);
        throw error;
      }

      return data as DoctorProfile;
    } catch (error) {
      console.error("Failed to get doctor profile:", error);
      return null;
    }
  },

  /**
   * Gets a doctor's profile by their URL slug
   */
  async getProfileBySlug(slug: string): Promise<DoctorProfile | null> {
    try {
      const { data, error } = await supabase
        .from("doctor_profiles")
        .select("*")
        .eq("public_url_slug", slug)
        .single();

      if (error) {
        console.error("Error fetching doctor profile by slug:", error);
        throw error;
      }

      return data as DoctorProfile;
    } catch (error) {
      console.error("Failed to get doctor profile by slug:", error);
      return null;
    }
  },

  /**
   * Creates a new doctor profile
   */
  async createProfile(doctorId: string, profileData: Partial<DoctorProfile>): Promise<DoctorProfile> {
    try {
      const { data, error } = await supabase
        .from("doctor_profiles")
        .insert({
          id: doctorId,
          bio: profileData.bio || null,
          specialty: profileData.specialty || null,
          profile_image_url: profileData.profile_image_url || null,
          public_url_slug: profileData.public_url_slug,
          theme: profileData.theme || 'default',
          name: profileData.name || null,
          email: profileData.email || null,
          phone: profileData.phone || null,
          address: profileData.address || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating doctor profile:", error);
        throw error;
      }

      return data as DoctorProfile;
    } catch (error) {
      console.error("Failed to create doctor profile:", error);
      throw error;
    }
  },

  /**
   * Updates an existing doctor profile
   */
  async updateProfile(doctorId: string, profileData: Partial<DoctorProfile>): Promise<DoctorProfile> {
    try {
      const { data, error } = await supabase
        .from("doctor_profiles")
        .update({
          bio: profileData.bio,
          specialty: profileData.specialty,
          profile_image_url: profileData.profile_image_url,
          theme: profileData.theme,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", doctorId)
        .select()
        .single();

      if (error) {
        console.error("Error updating doctor profile:", error);
        throw error;
      }

      return data as DoctorProfile;
    } catch (error) {
      console.error("Failed to update doctor profile:", error);
      throw error;
    }
  },

  /**
   * Gets all links for a doctor
   */
  async getLinksByDoctorId(doctorId: string): Promise<DoctorLink[]> {
    try {
      const { data, error } = await supabase
        .from("doctor_links")
        .select("*")
        .eq("doctor_id", doctorId)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching doctor links:", error);
        throw error;
      }

      return data as DoctorLink[];
    } catch (error) {
      console.error("Failed to get doctor links:", error);
      return [];
    }
  },

  /**
   * Creates a new link for a doctor
   */
  async createLink(linkData: Omit<DoctorLink, 'id' | 'created_at' | 'updated_at'>): Promise<DoctorLink> {
    try {
      // Get highest display order
      const { data: existingLinks } = await supabase
        .from("doctor_links")
        .select("display_order")
        .eq("doctor_id", linkData.doctor_id)
        .order("display_order", { ascending: false })
        .limit(1);

      const nextDisplayOrder = existingLinks?.length ? (existingLinks[0].display_order || 0) + 1 : 0;

      const { data, error } = await supabase
        .from("doctor_links")
        .insert({
          doctor_id: linkData.doctor_id,
          title: linkData.title,
          url: linkData.url,
          icon: linkData.icon,
          is_active: linkData.is_active,
          display_order: nextDisplayOrder,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating doctor link:", error);
        throw error;
      }

      return data as DoctorLink;
    } catch (error) {
      console.error("Failed to create doctor link:", error);
      throw error;
    }
  },

  /**
   * Updates an existing link
   */
  async updateLink(linkId: string, linkData: Partial<DoctorLink>): Promise<DoctorLink> {
    try {
      const { data, error } = await supabase
        .from("doctor_links")
        .update({
          title: linkData.title,
          url: linkData.url,
          icon: linkData.icon,
          is_active: linkData.is_active,
          display_order: linkData.display_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", linkId)
        .select()
        .single();

      if (error) {
        console.error("Error updating doctor link:", error);
        throw error;
      }

      return data as DoctorLink;
    } catch (error) {
      console.error("Failed to update doctor link:", error);
      throw error;
    }
  },

  /**
   * Deletes a link
   */
  async deleteLink(linkId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("doctor_links")
        .delete()
        .eq("id", linkId);

      if (error) {
        console.error("Error deleting doctor link:", error);
        throw error;
      }
    } catch (error) {
      console.error("Failed to delete doctor link:", error);
      throw error;
    }
  }
};
