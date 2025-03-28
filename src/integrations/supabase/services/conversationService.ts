
import { supabase, getCurrentUserId } from '../client';

export const conversationService = {
  async getConversations() {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        patient:patients(id, name, email, phone, avatar_url),
        conversation_to_tag(tag_id)
      `)
      .eq('doctor_id', userId)
      .order('last_activity', { ascending: false });
    
    if (error) throw error;
    
    // Get all tags for the current user
    const { data: tags, error: tagsError } = await supabase
      .from('conversation_tags')
      .select('*')
      .eq('doctor_id', userId);
      
    if (tagsError) throw tagsError;
    
    // Map tags to conversations
    const dataWithTags = data.map(conversation => {
      const conversationTags = conversation.conversation_to_tag || [];
      const tagIds = conversationTags.map((ct: any) => ct.tag_id);
      const assignedTags = tags.filter(tag => tagIds.includes(tag.id));
      
      return {
        ...conversation,
        tags: assignedTags
      };
    });
    
    return dataWithTags;
  },
  
  async getConversation(id: string) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        patient:patients(id, name, email, phone, avatar_url),
        messages(*),
        conversation_to_tag(tag_id)
      `)
      .eq('id', id)
      .eq('doctor_id', userId)
      .order('messages.created_at', { ascending: true })
      .single();
    
    if (error) throw error;
    
    // Get all tags for the current user
    const { data: tags, error: tagsError } = await supabase
      .from('conversation_tags')
      .select('*')
      .eq('doctor_id', userId);
      
    if (tagsError) throw tagsError;
    
    // Map tags to conversation
    const conversationTags = data.conversation_to_tag || [];
    const tagIds = conversationTags.map((ct: any) => ct.tag_id);
    const assignedTags = tags.filter(tag => tagIds.includes(tag.id));
    
    return {
      ...data,
      tags: assignedTags
    };
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
