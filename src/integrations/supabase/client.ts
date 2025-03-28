import { createClient } from "@supabase/supabase-js";
import { mockSupabase, getMockData, createMockData, updateMockData, deleteMockData } from "@/utils/mock-data-provider";

// This is a placeholder that returns the mock Supabase client
export const supabase = mockSupabase;

// Define service objects that provide mock data instead of actual DB queries
export const doctorProfileService = {
  getProfileByDoctorId: async (doctorId: string) => {
    const { data, error } = getMockData("doctor_profiles");
    return data;
  },
  
  createProfile: async (doctorId: string, profileData: any) => {
    const { data, error } = createMockData("doctor_profiles", {
      doctor_id: doctorId,
      ...profileData
    });
    return data;
  },
  
  updateProfile: async (doctorId: string, profileData: any) => {
    const { data, error } = updateMockData("doctor_profiles", "dp1", profileData);
    return data;
  },
  
  getProfileBySlug: async (slug: string) => {
    const { data, error } = getMockData("doctor_profiles");
    return data;
  }
};

export const doctorLinksService = {
  getLinksByDoctorId: async (doctorId: string) => {
    const { data, error } = getMockData("doctor_links");
    return data;
  },
  
  createLink: async (linkData: any) => {
    const { data, error } = createMockData("doctor_links", linkData);
    return data;
  },
  
  updateLink: async (linkId: string, linkData: any) => {
    const { data, error } = updateMockData("doctor_links", linkId, linkData);
    return data;
  },
  
  deleteLink: async (linkId: string) => {
    const { data, error } = deleteMockData("doctor_links", linkId);
    return data;
  },
  
  updateLinkOrder: async (links: any[]) => {
    return { success: true };
  }
};

export const conversationService = {
  getConversations: async () => {
    const { data, error } = getMockData("conversations");
    return data;
  },
  
  getConversation: async (conversationId: string) => {
    const { data, error } = getMockData("conversations", conversationId);
    return data;
  },
  
  sendMessage: async (conversationId: string, content: string) => {
    const newMessage = {
      conversation_id: conversationId,
      content,
      is_outgoing: true,
      status: 'delivered',
      created_at: new Date().toISOString()
    };
    
    const { data, error } = createMockData("messages", newMessage);
    return data;
  },
  
  getTags: async () => {
    const { data, error } = getMockData("conversation_tags");
    return data;
  },
  
  getConversationTags: async (conversationId: string) => {
    const { data, error } = getMockData("conversation_tags");
    // Just return a few random tags for mock purposes
    return data.slice(0, 2);
  },
  
  addTagToConversation: async (conversationId: string, tagId: string) => {
    return { success: true };
  },
  
  removeTagFromConversation: async (conversationId: string, tagId: string) => {
    return { success: true };
  }
};

export const employeeService = {
  getEmployees: async () => {
    const { data, error } = getMockData("employees");
    return data;
  },
  
  createEmployee: async (employeeData: any) => {
    const { data, error } = createMockData("employees", employeeData);
    return data;
  },
  
  updateEmployee: async (employeeId: string, employeeData: any) => {
    const { data, error } = updateMockData("employees", employeeId, employeeData);
    return data;
  },
  
  deleteEmployee: async (employeeId: string) => {
    const { data, error } = deleteMockData("employees", employeeId);
    return { success: true };
  }
};
