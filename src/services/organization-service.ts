
import { Organization } from '@/types';
import { apiService } from './api-service';

/**
 * Creates a new organization via API
 */
export const createOrganization = async (name: string, userId?: string): Promise<Organization> => {
  return await apiService.post<Organization>('/organizations', { name }, userId);
};

/**
 * Gets an organization by ID via API
 */
export const getOrganizationById = async (id: string, userId?: string): Promise<Organization | null> => {
  try {
    return await apiService.get<Organization>(`/organizations/${id}`, userId);
  } catch (error) {
    console.error('Error fetching organization:', error);
    return null;
  }
};

/**
 * Updates an organization via API
 */
export const updateOrganization = async (organization: Organization, userId?: string): Promise<Organization> => {
  return await apiService.put<Organization>(`/organizations/${organization.id}`, organization, userId);
};

/**
 * Deletes an organization via API
 */
export const deleteOrganization = async (id: string, userId?: string): Promise<void> => {
  await apiService.delete(`/organizations/${id}`, userId);
};

/**
 * Gets all organizations via API
 */
export const getAllOrganizations = async (userId?: string): Promise<Organization[]> => {
  return await apiService.get<Organization[]>('/organizations', userId);
};
