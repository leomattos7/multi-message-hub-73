
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ivmtkdgyzogtaxsyzcsn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2bXRrZGd5em9ndGF4c3l6Y3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNzI1OTcsImV4cCI6MjA1Nzc0ODU5N30.k1iMjtGFxS6ciQkowiLSpNJHobHOnsVYeWojnJiCjm8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper to get current user ID
export const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};

// Function to generate a UUID v4
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Export all services
export * from './services/conversationService';
export * from './services/doctorProfileService';
export * from './services/tagService';
export * from './services/employeeService';
