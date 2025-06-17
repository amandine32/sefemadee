import { useState } from 'react';
import { User } from '@/types/database';

export function useUser() {
  const [user, setUser] = useState<User | null>({
    id: '1',
    pseudo: 'Marie',
    age: 28,
    ville: 'Paris',
    anonymat: false,
    contactsUrgence: ['2', '3', '4'],
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', // Jeune femme brune
    savedPosts: ['1', '3'], // Posts sauvegardés
    safeMates: ['2', '3', '4'] // SafeMates connectées
  });

  const updateUserSetting = (key: keyof User, value: any) => {
    if (user) {
      setUser({
        ...user,
        [key]: value
      });
    }
  };

  const toggleSavedPost = (postId: string) => {
    if (user) {
      const savedPosts = user.savedPosts || [];
      const isAlreadySaved = savedPosts.includes(postId);
      
      const updatedSavedPosts = isAlreadySaved
        ? savedPosts.filter(id => id !== postId)
        : [...savedPosts, postId];
      
      setUser({
        ...user,
        savedPosts: updatedSavedPosts
      });
    }
  };

  const addSafeMate = (safeMateId: string) => {
    if (user) {
      const safeMates = user.safeMates || [];
      if (!safeMates.includes(safeMateId)) {
        setUser({
          ...user,
          safeMates: [...safeMates, safeMateId]
        });
      }
    }
  };

  const removeSafeMate = (safeMateId: string) => {
    if (user) {
      const safeMates = user.safeMates || [];
      setUser({
        ...user,
        safeMates: safeMates.filter(id => id !== safeMateId)
      });
    }
  };

  return {
    user,
    updateUserSetting,
    toggleSavedPost,
    addSafeMate,
    removeSafeMate
  };
}