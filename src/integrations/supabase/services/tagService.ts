
import { supabase, getCurrentUserId } from '../client';

export const tagService = {
  async getTags() {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('conversation_tags')
      .select('*')
      .eq('doctor_id', userId)
      .order('name');
    
    if (error) throw error;
    return data;
  },
  
  async createTag(name: string, color: string) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('conversation_tags')
      .insert({
        name,
        color,
        doctor_id: userId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async updateTag(id: string, updates: { name?: string; color?: string }) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('conversation_tags')
      .update(updates)
      .eq('id', id)
      .eq('doctor_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async deleteTag(id: string) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const { error } = await supabase
      .from('conversation_tags')
      .delete()
      .eq('id', id)
      .eq('doctor_id', userId);
    
    if (error) throw error;
    return { success: true };
  },
  
  async assignTagToConversation(conversationId: string, tagId: string) {
    const { data, error } = await supabase
      .from('conversation_tag_links')
      .insert({
        conversation_id: conversationId,
        tag_id: tagId
      })
      .select();
    
    if (error) throw error;
    return data;
  },
  
  async removeTagFromConversation(conversationId: string, tagId: string) {
    const { error } = await supabase
      .from('conversation_tag_links')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('tag_id', tagId);
    
    if (error) throw error;
    return { success: true };
  },
  
  async getConversationTags(conversationId: string) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('conversation_tag_links')
      .select(`
        tag_id,
        conversation_tags!inner(*)
      `)
      .eq('conversation_id', conversationId)
      .eq('conversation_tags.doctor_id', userId);
    
    if (error) throw error;
    return data.map((item: any) => item.conversation_tags);
  }
};
