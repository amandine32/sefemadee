import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Colors from '@/constants/Colors';
import { Message } from '@/types/database';
import { useUser } from '@/hooks/useUser';
import { VoiceMessage } from './VoiceMessage';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useUser();
  const isMyMessage = message.senderId === user?.id;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (message.type === 'voice' && message.audioUri && message.audioDuration) {
    return (
      <VoiceMessage
        audioUri={message.audioUri}
        duration={message.audioDuration}
        isMyMessage={isMyMessage}
        timestamp={message.timestamp}
      />
    );
  }

  return (
    <View style={[styles.container, isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer]}>
      <View style={[styles.bubble, isMyMessage ? styles.myBubble : styles.theirBubble]}>
        <Text style={[styles.text, isMyMessage ? styles.myText : styles.theirText]}>
          {message.content}
        </Text>
      </View>
      <Text style={[styles.timestamp, isMyMessage ? styles.myTimestamp : styles.theirTimestamp]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  myBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: Colors.lightGray,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 22,
  },
  myText: {
    color: Colors.white,
  },
  theirText: {
    color: Colors.textPrimary,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  myTimestamp: {
    color: Colors.textSecondary,
    alignSelf: 'flex-end',
  },
  theirTimestamp: {
    color: Colors.textSecondary,
    alignSelf: 'flex-start',
  },
});