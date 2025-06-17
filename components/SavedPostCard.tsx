import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Heart, MessageSquare, Bookmark, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Post } from '@/types/database';

interface SavedPostCardProps {
  post: Post;
  onUnsave: () => void;
  onOpen: () => void;
}

export function SavedPostCard({ post, onUnsave, onOpen }: SavedPostCardProps) {
  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
      return `Il y a ${minutes} min`;
    } else if (hours < 24) {
      return `Il y a ${hours} h`;
    } else {
      return `Il y a ${days} j`;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onOpen} activeOpacity={0.9}>
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Image source={{ uri: post.authorAvatar }} style={styles.avatar} />
          <View>
            <Text style={styles.authorName}>{post.author}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(post.timestamp)}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.unsaveButton} onPress={onUnsave}>
          <X size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.content} numberOfLines={3}>
        {post.content}
      </Text>
      
      {post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
      )}
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Heart size={16} color={Colors.textSecondary} />
          <Text style={styles.statText}>{post.likes.length}</Text>
        </View>
        
        <View style={styles.statItem}>
          <MessageSquare size={16} color={Colors.textSecondary} />
          <Text style={styles.statText}>{post.comments.length}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Bookmark size={16} color={Colors.primary} fill={Colors.primary} />
          <Text style={styles.statText}>Sauvegardé</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  unsaveButton: {
    padding: 4,
  },
  content: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
});