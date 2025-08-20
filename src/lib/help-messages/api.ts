import { createClient } from '@/lib/supabase/client';
import { HelpMessage, CreateHelpMessageInput } from '@/types/help-messages';

export class HelpMessagesAPI {
  private supabase = createClient();

  /**
   * Create a new help message
   */
  async createHelpMessage(input: CreateHelpMessageInput): Promise<HelpMessage> {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabase
      .from('help_messages')
      .insert({
        user_id: user.id,
        page_name: input.page_name,
        message: input.message
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating help message:', error);
      throw error;
    }
    
    return data;
  }

  /**
   * Get user's help messages
   */
  async getUserMessages(): Promise<HelpMessage[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabase
      .from('help_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching help messages:', error);
      throw error;
    }
    
    return data || [];
  }

  /**
   * Get all help messages (admin only)
   */
  async getAllMessages(): Promise<HelpMessage[]> {
    const { data, error } = await this.supabase
      .from('help_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all help messages:', error);
      throw error;
    }
    
    return data || [];
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string): Promise<void> {
    const { error } = await this.supabase
      .from('help_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId);
    
    if (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  /**
   * Add response to message (admin only)
   */
  async addResponse(messageId: string, response: string): Promise<void> {
    const { error } = await this.supabase
      .from('help_messages')
      .update({ 
        response,
        responded_at: new Date().toISOString()
      })
      .eq('id', messageId);
    
    if (error) {
      console.error('Error adding response:', error);
      throw error;
    }
  }
}