'use client';

import { useHelpMessagesContext } from '@/contexts/HelpMessagesContext';

export function useHelpMessages() {
  return useHelpMessagesContext();
}