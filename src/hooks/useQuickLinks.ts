'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  QuickLinkAction, 
  getAvailableActions, 
  getActionById,
  getActionsByCategory 
} from '@/lib/quickLinks/registry';

const STORAGE_KEY = 'user-quick-links';
const MAX_QUICK_LINKS = 8; // Maximum number of quick links a user can have

export function useQuickLinks() {
  const { user, profile } = useAuth();
  const [quickLinkIds, setQuickLinkIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load quick links from localStorage on mount
  useEffect(() => {
    const loadQuickLinks = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const ids = JSON.parse(stored);
          if (Array.isArray(ids)) {
            setQuickLinkIds(ids);
          }
        }
      } catch (error) {
        console.error('Error loading quick links:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuickLinks();
  }, []);

  // Save quick links to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quickLinkIds));
      } catch (error) {
        console.error('Error saving quick links:', error);
      }
    }
  }, [quickLinkIds, isLoading]);

  // Get all available actions for the current user
  const availableActions = getAvailableActions(
    !!user,
    profile?.member ?? false,
    profile?.role ?? null
  );

  // Get the user's selected quick links
  const quickLinks = quickLinkIds
    .map(id => getActionById(id))
    .filter((action): action is QuickLinkAction => {
      if (!action) return false;
      // Ensure the user still has permission for this action
      return availableActions.some(a => a.id === action.id);
    });

  // Add a quick link
  const addQuickLink = useCallback((actionId: string) => {
    setQuickLinkIds(prev => {
      // Check if already added
      if (prev.includes(actionId)) return prev;
      // Check max limit
      if (prev.length >= MAX_QUICK_LINKS) {
        alert(`You can only have up to ${MAX_QUICK_LINKS} quick links`);
        return prev;
      }
      // Add the new quick link
      return [...prev, actionId];
    });
  }, []);

  // Remove a quick link
  const removeQuickLink = useCallback((actionId: string) => {
    setQuickLinkIds(prev => prev.filter(id => id !== actionId));
  }, []);

  // Reorder quick links
  const reorderQuickLinks = useCallback((newOrder: string[]) => {
    setQuickLinkIds(newOrder);
  }, []);

  // Check if an action is already a quick link
  const isQuickLink = useCallback((actionId: string) => {
    return quickLinkIds.includes(actionId);
  }, [quickLinkIds]);

  // Get available actions that are not already quick links
  const availableToAdd = availableActions.filter(
    action => !quickLinkIds.includes(action.id)
  );

  // Get available actions grouped by category
  const availableByCategory = getActionsByCategory(availableToAdd);

  // Clear all quick links
  const clearQuickLinks = useCallback(() => {
    setQuickLinkIds([]);
  }, []);

  return {
    quickLinks,
    quickLinkIds,
    availableActions,
    availableToAdd,
    availableByCategory,
    isLoading,
    addQuickLink,
    removeQuickLink,
    reorderQuickLinks,
    isQuickLink,
    clearQuickLinks,
    hasReachedLimit: quickLinkIds.length >= MAX_QUICK_LINKS
  };
}