export interface User {
  id: string;
  pseudo: string;
  age: number;
  ville: string;
  anonymat: boolean;
  contactsUrgence: string[];
  avatar: string;
  savedPosts?: string[]; // IDs des posts sauvegardés
  safeMates?: string[]; // IDs des SafeMates
}

export interface Alert {
  id: string;
  timestamp: number;
  position: {
    latitude: number;
    longitude: number;
  };
  type: string;
  dangerLevel: string;
  recording?: string;
}

export interface Journey {
  id: string;
  type: 'solo' | 'shared';
  departure: string;
  destination: string;
  time: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  imageUrl: string | null;
  timestamp: number;
  likes: string[];
  comments: {
    id: string;
    author: string;
    content: string;
    timestamp: number;
  }[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content?: string;
  audioUri?: string;
  audioDuration?: number;
  type: 'text' | 'voice';
  timestamp: number;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  participants: string[];
  lastMessage: {
    id: string;
    senderId: string;
    content: string;
    type: 'text' | 'voice';
    timestamp: number;
  };
  unreadCount: number;
}

export interface DangerReport {
  id: string;
  position: {
    latitude: number;
    longitude: number;
  };
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: number;
  imageUrl?: string;
}

export interface SafeMate {
  id: string;
  name: string;
  avatar: string;
  city: string;
  age: number;
  mutualFriends: number;
  compatibility: number;
  status: 'pending' | 'accepted' | 'blocked';
  connectedSince?: number;
  lastSeen?: number;
  bio?: string;
  interests?: string[];
  safetyScore?: number;
}

export interface SafeMateRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: number;
}