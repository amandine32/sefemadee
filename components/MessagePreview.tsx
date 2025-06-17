import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Mic } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Conversation } from '@/types/database';

interface MessagePreviewProps {
  conversation: Conversation;
}

export function MessagePreview({ conversation }: MessagePreviewProps) {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      // Today, show only time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // Different day, show date
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
  };

  const renderLastMessageContent = () => {
    if (conversation.lastMessage.type === 'voice') {
      return (
        <View style={styles.voiceMessagePreview}>
          <Mic size={14} color={Colors.textSecondary} />
          <Text style={styles.voiceMessageText}>Message vocal</Text>
        </View>
      );
    }
    
    return (
      <Text 
        style={styles.message}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {conversation.lastMessage.content}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: conversation.avatar }}
        style={styles.avatar} 
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{conversation.name}</Text>
          <Text style={styles.time}>{formatTimestamp(conversation.lastMessage.timestamp)}</Text>
        </View>
        
        {renderLastMessageContent()}
      </View>
      
      {conversation.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  voiceMessagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voiceMessageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
    fontStyle: 'italic',
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.white,
  },
});