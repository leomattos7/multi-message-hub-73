
import { supabase } from "../client";
import { DoctorProfile, DoctorLink } from "@/components/DoctorProfile/types";

export const doctorProfileService = {
  async getProfileByDoctorId(doctorId: string): Promise<DoctorProfile | null> {
    try {
      // Note: We're using type casting here as a temporary solution
      // until the database schema is properly updated
      const { data, error } = await supabase
        .from("doctor_profiles" as any)
        .select("*")
        .eq("id", doctorId)
        .single();

      if (error) throw error;
      
      // Return null if no profile exists
      if (!data) return null;
      
      // Cast to DoctorProfile type
      return data as unknown as DoctorProfile;
    } catch (error) {
      console.error("Error getting doctor profile:", error);
      return null;
    }
  },

  async getProfileBySlug(slug: string): Promise<DoctorProfile | null> {
    try {
      // Using type casting as a temporary solution
      const { data, error } = await supabase
        .from("doctor_profiles" as any)
        .select(`
          *,
          doctor_links:doctor_links(*)
        `)
        .eq("public_url_slug", slug)
        .single();

      if (error) throw error;
      
      // Return null if no profile exists
      if (!data) return null;
      
      // Cast to DoctorProfile type
      return data as unknown as DoctorProfile;
    } catch (error) {
      console.error("Error getting doctor profile by slug:", error);
      return null;
    }
  },

  async createProfile(doctorId: string, profileData: Partial<DoctorProfile>): Promise<DoctorProfile> {
    try {
      // Using type casting as a temporary solution
      const { data, error } = await supabase
        .from("doctor_profiles" as any)
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
        })
        .select()
        .single();

      if (error) throw error;
      
      return data as unknown as DoctorProfile;
    } catch (error) {
      console.error("Error creating doctor profile:", error);
      throw error;
    }
  },

  async updateProfile(doctorId: string, profileData: Partial<DoctorProfile>): Promise<DoctorProfile> {
    try {
      // Using type casting as a temporary solution
      const { data, error } = await supabase
        .from("doctor_profiles" as any)
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

      if (error) throw error;
      
      return data as unknown as DoctorProfile;
    } catch (error) {
      console.error("Error updating doctor profile:", error);
      throw error;
    }
  },

  async getLinksByDoctorId(doctorId: string): Promise<DoctorLink[]> {
    try {
      // Using type casting as a temporary solution
      const { data, error } = await supabase
        .from("doctor_links" as any)
        .select("*")
        .eq("doctor_id", doctorId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      
      return data as unknown as DoctorLink[];
    } catch (error) {
      console.error("Error getting doctor links:", error);
      return [];
    }
  },

  async getLinkById(linkId: string): Promise<DoctorLink | null> {
    try {
      // Using type casting as a temporary solution
      const { data, error } = await supabase
        .from("doctor_links" as any)
        .select("*")
        .eq("id", linkId)
        .single();

      if (error) throw error;
      
      return data as unknown as DoctorLink;
    } catch (error) {
      console.error("Error getting link by ID:", error);
      return null;
    }
  },

  async createLink(linkData: Omit<DoctorLink, "id" | "created_at" | "updated_at">): Promise<DoctorLink> {
    try {
      // First get the highest display_order for this doctor
      const { data: existingLinks } = await supabase
        .from("doctor_links" as any)
        .select("display_order")
        .eq("doctor_id", linkData.doctor_id)
        .order("display_order", { ascending: false })
        .limit(1);
      
      const nextDisplayOrder = existingLinks && existingLinks.length > 0 
        ? (existingLinks[0].display_order || 0) + 1 
        : 1;
      
      // Using type casting as a temporary solution
      const { data, error } = await supabase
        .from("doctor_links" as any)
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

      if (error) throw error;
      
      return data as unknown as DoctorLink;
    } catch (error) {
      console.error("Error creating link:", error);
      throw error;
    }
  },

  async updateLink(linkId: string, linkData: Partial<DoctorLink>): Promise<DoctorLink> {
    try {
      // Using type casting as a temporary solution
      const { data, error } = await supabase
        .from("doctor_links" as any)
        .update({
          ...(linkData.title && { title: linkData.title }),
          ...(linkData.url && { url: linkData.url }),
          ...(linkData.icon && { icon: linkData.icon }),
          ...(typeof linkData.is_active === 'boolean' && { is_active: linkData.is_active }),
          ...(linkData.display_order && { display_order: linkData.display_order }),
          updated_at: new Date().toISOString(),
        })
        .eq("id", linkId)
        .select()
        .single();

      if (error) throw error;
      
      return data as unknown as DoctorLink;
    } catch (error) {
      console.error("Error updating link:", error);
      throw error;
    }
  },

  async deleteLink(linkId: string): Promise<void> {
    try {
      // Using type casting as a temporary solution
      const { error } = await supabase
        .from("doctor_links" as any)
        .delete()
        .eq("id", linkId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting link:", error);
      throw error;
    }
  }
};
