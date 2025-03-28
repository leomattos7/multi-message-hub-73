
import { supabase } from '../client';

export const employeeService = {
  async getEmployees() {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },
  
  async createEmployee(employee: { name: string; email: string; role: string }) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .insert([employee])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  },
  
  async updateEmployee(id: string, updates: { name?: string; email?: string; role?: string; status?: string }) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  },
  
  async deleteEmployee(id: string) {
    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  }
};
