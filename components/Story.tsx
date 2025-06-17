import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';

interface StoryProps {
  story: {
    id: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    hasUnseenStory: boolean;
  };
  onPress: () => void;
}

export function Story({ story, onPress }: StoryProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[
        styles.avatarContainer,
        story.hasUnseenStory && styles.unseenStory
      ]}>
        <Image
          source={{ uri: story.user.avatar }}
          style={styles.avatar}
        />
      </View>
      <Text style={styles.username} numberOfLines={1}>
        {story.user.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
    width: 72,
  },
  avatarContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    backgroundColor: Colors.lightGray,
    marginBottom: 4,
  },
  unseenStory: {
    backgroundColor: Colors.primary,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  username: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});