import { Profile } from '@/types/profile';
import { apiService } from '@/services/api-service';

/**
 * Get organization ID for a doctor by their ID
 */
export async function getOrganizationIdForDoctor(doctorId: string): Promise<string | null> {
  try {
    const response = await apiService.get<{organization_id: string}>(`/doctors/${doctorId}/organization`, doctorId);
    return response.organization_id || null;
  } catch (error) {
    console.error('Error fetching organization ID:', error);
    return null;
  }
}

/**
 * Get a profile by ID
 */
export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    return await apiService.get<Profile>(`/patients/${id}`, id);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Service for handling profile operations
 */
export const profileService = {
  /**
   * Create a new profile
   */
  async createProfile(profile: any): Promise<any> {
    return await apiService.post('/patients', profile, profile.id);
  },
  
  /**
   * Get a profile by ID
   */
  async getProfileById(id: string): Promise<any> {
    return await getProfileById(id);
  },
  
  /**
   * Get organization ID for a doctor by their ID
   */
  async getOrganizationIdForDoctor(doctorId: string): Promise<string | null> {
    return await getOrganizationIdForDoctor(doctorId);
  },
  
  /**
   * Update a profile
   */
  async updateProfile(id: string, updates: any): Promise<any> {
    return await apiService.put(`/patients/${id}`, updates, id);
  },
  
  /**
   * Delete a profile
   */
  async deleteProfile(id: string): Promise<void> {
    await apiService.delete(`/patients/${id}`, id);
  },
  
  /**
   * Get all profiles
   */
  async getAllProfiles(): Promise<any[]> {
    return await apiService.get('/patients');
  },
  
  /**
   * Get profiles by organization
   */
  async getProfilesByOrganization(organizationId: string, userId?: string): Promise<any[]> {
    return await apiService.get(`/organizations/${organizationId}/patients`, userId);
  }
};