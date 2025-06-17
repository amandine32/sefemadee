import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { Heart, MessageSquare, Share2, MoveHorizontal as MoreHorizontal, Flag, EyeOff, Link, Bookmark, X, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Post } from '@/types/database';
import { useUser } from '@/hooks/useUser';
import { SafeMateProfileModal } from './SafeMateProfileModal';
import { useMockData } from '@/hooks/useMockData';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useUser();
  const { safeMates } = useMockData();
  const [liked, setLiked] = useState(post.likes.includes(user?.id || ''));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [menuVisible, setMenuVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const toggleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

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

  // Check if this is the current user's post and if they're in anonymous mode
  const isCurrentUserPost = post.author === user?.pseudo;
  const shouldShowAnonymous = isCurrentUserPost && user?.anonymat;

  const getDisplayName = () => {
    if (shouldShowAnonymous) {
      return post.author.charAt(0).toUpperCase();
    }
    return post.author;
  };

  const getAvatarComponent = () => {
    if (shouldShowAnonymous) {
      return (
        <View style={styles.anonymousAvatar}>
          <Text style={styles.initialText}>
            {post.author.charAt(0).toUpperCase()}
          </Text>
        </View>
      );
    }
    
    return (
      <Image 
        source={{ uri: post.authorAvatar }}
        style={styles.avatar} 
      />
    );
  };

  const handleMenuAction = (action: string) => {
    setMenuVisible(false);
    
    switch (action) {
      case 'report':
        console.log('Signaler le post');
        break;
      case 'hide':
        console.log('Masquer ce post');
        break;
      case 'copy':
        console.log('Copier le lien');
        break;
      case 'save':
        console.log('Enregistrer pour plus tard');
        break;
    }
  };

  const handleImagePress = () => {
    if (post.imageUrl) {
      setImageModalVisible(true);
    }
  };

  const handleAuthorPress = () => {
    // Ne pas ouvrir le profil si c'est l'utilisateur actuel ou en mode anonyme
    if (isCurrentUserPost || shouldShowAnonymous) {
      return;
    }
    
    // Chercher la SafeMate correspondante
    const safeMate = safeMates.find(mate => mate.name === post.author);
    if (safeMate) {
      setProfileModalVisible(true);
    }
  };

  // Trouver la SafeMate correspondante pour le modal
  const authorSafeMate = safeMates.find(mate => mate.name === post.author);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.authorContainer}
            onPress={handleAuthorPress}
            disabled={isCurrentUserPost || shouldShowAnonymous}
          >
            {getAvatarComponent()}
            <View style={styles.headerInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.username}>{getDisplayName()}</Text>
                {!isCurrentUserPost && !shouldShowAnonymous && (
                  <User size={14} color={Colors.textSecondary} style={styles.profileIcon} />
                )}
              </View>
              <Text style={styles.timestamp}>{formatTimestamp(post.timestamp)}</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <MoreHorizontal size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.content}>{post.content}</Text>
        
        {post.imageUrl && (
          <TouchableOpacity onPress={handleImagePress} activeOpacity={0.9}>
            <Image 
              source={{ uri: post.imageUrl }} 
              style={styles.postImage} 
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        
        <View style={styles.stats}>
          <Text style={styles.statsText}>{likesCount} j'aime • {post.comments.length} commentaires</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
            <Heart 
              size={20} 
              color={liked ? Colors.danger : Colors.textSecondary} 
              fill={liked ? Colors.danger : 'transparent'} 
            />
            <Text style={[styles.actionText, liked && styles.actionTextActive]}>J'aime</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MessageSquare size={20} color={Colors.textSecondary} />
            <Text style={styles.actionText}>Commenter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={20} color={Colors.textSecondary} />
            <Text style={styles.actionText}>Partager</Text>
          </TouchableOpacity>
        </View>

        {/* Menu contextuel */}
        <Modal
          visible={menuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          >
            <View style={styles.menuContainer}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuAction('report')}
              >
                <Flag size={20} color={Colors.textPrimary} />
                <Text style={styles.menuItemText}>Signaler le post</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuAction('hide')}
              >
                <EyeOff size={20} color={Colors.textPrimary} />
                <Text style={styles.menuItemText}>Ce post ne m'intéresse pas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuAction('copy')}
              >
                <Link size={20} color={Colors.textPrimary} />
                <Text style={styles.menuItemText}>Copier le lien</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.menuItem, styles.lastMenuItem]}
                onPress={() => handleMenuAction('save')}
              >
                <Bookmark size={20} color={Colors.textPrimary} />
                <Text style={styles.menuItemText}>Enregistrer pour plus tard</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Modal pour agrandir l'image du post */}
        <Modal
          visible={imageModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View style={styles.imageModalContainer}>
            <TouchableOpacity 
              style={styles.imageModalOverlay}
              activeOpacity={1}
              onPress={() => setImageModalVisible(false)}
            >
              <View style={styles.imageModalContent}>
                <TouchableOpacity 
                  style={styles.closeImageButton}
                  onPress={() => setImageModalVisible(false)}
                >
                  <X size={24} color={Colors.white} />
                </TouchableOpacity>
                {post.imageUrl && (
                  <Image 
                    source={{ uri: post.imageUrl }} 
                    style={styles.fullScreenImage} 
                    resizeMode="contain"
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>

      {/* Modal de profil SafeMate */}
      {authorSafeMate && (
        <SafeMateProfileModal
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          safeMate={authorSafeMate}
          onConnect={() => console.log('Connect to', authorSafeMate.id)}
          onMessage={() => console.log('Message to', authorSafeMate.id)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  anonymousAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray,
  },
  initialText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  profileIcon: {
    marginLeft: 6,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  content: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 8,
  },
  stats: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  statsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  actionTextActive: {
    color: Colors.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    minWidth: 280,
    maxWidth: 320,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 16,
    flex: 1,
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  imageModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  closeImageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  fullScreenImage: {
    width: '90%',
    height: '80%',
  },
});