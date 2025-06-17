import { useState, useEffect } from 'react';
import { Conversation, Message } from '@/types/database';
import { useMockData } from './useMockData';
import { useUser } from './useUser';

export function useConversation(conversationId: string | undefined) {
  const { conversations } = useMockData();
  const { user } = useUser();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (conversationId) {
      const foundConversation = conversations.find(c => c.id === conversationId);
      if (foundConversation) {
        setConversation(foundConversation);
        
        // Generate mock messages including voice messages
        const mockMessages: Message[] = [
          {
            id: '1',
            conversationId: conversationId,
            senderId: foundConversation.participants.find(p => p !== user?.id) || '',
            content: 'Salut ! Comment ça va ?',
            type: 'text',
            timestamp: Date.now() - 3600000
          },
          {
            id: '2',
            conversationId: conversationId,
            senderId: user?.id || '',
            content: 'Ça va bien, merci ! Je viens de rentrer chez moi.',
            type: 'text',
            timestamp: Date.now() - 3540000
          },
          {
            id: '3',
            conversationId: conversationId,
            senderId: foundConversation.participants.find(p => p !== user?.id) || '',
            audioUri: 'mock-audio-uri-1',
            audioDuration: 8,
            type: 'voice',
            timestamp: Date.now() - 3480000
          },
          {
            id: '4',
            conversationId: conversationId,
            senderId: user?.id || '',
            content: 'Oui, j\'ai utilisé SafeMate pour suivre mon trajet 😊',
            type: 'text',
            timestamp: Date.now() - 3420000
          },
          {
            id: '5',
            conversationId: conversationId,
            senderId: user?.id || '',
            audioUri: 'mock-audio-uri-2',
            audioDuration: 12,
            type: 'voice',
            timestamp: Date.now() - 3360000
          },
          {
            id: '6',
            conversationId: conversationId,
            senderId: foundConversation.participants.find(p => p !== user?.id) || '',
            content: foundConversation.lastMessage.content,
            type: foundConversation.lastMessage.type,
            timestamp: foundConversation.lastMessage.timestamp
          }
        ];
        
        setMessages(mockMessages.reverse()); // Reverse for display with FlatList inverted
      }
    }
  }, [conversationId, conversations, user]);

  const sendMessage = (content: string) => {
    if (user && conversation) {
      const newMessage: Message = {
        id: Date.now().toString(),
        conversationId: conversation.id,
        senderId: user.id,
        content,
        type: 'text',
        timestamp: Date.now()
      };
      
      setMessages([newMessage, ...messages]);
    }
  };

  const sendVoiceMessage = (audioUri: string, duration: number) => {
    if (user && conversation) {
      const newMessage: Message = {
        id: Date.now().toString(),
        conversationId: conversation.id,
        senderId: user.id,
        audioUri,
        audioDuration: duration,
        type: 'voice',
        timestamp: Date.now()
      };
      
      setMessages([newMessage, ...messages]);
    }
  };

  return {
    conversation,
    messages,
    sendMessage,
    sendVoiceMessage
  };
}