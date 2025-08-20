export interface HelpMessage {
  id: string;
  user_id?: string;
  user_name?: string;
  page_name: string;
  message: string;
  created_at: string;
  read_at?: string;
  response?: string;
  responded_at?: string;
}

export interface CreateHelpMessageInput {
  page_name: string;
  message: string;
}