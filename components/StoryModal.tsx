import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Image, TouchableOpacity, Text, Animated } from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface StoryModalProps {
  visible: boolean;
  onClose: () => void;
  story: {
    id: string;
    user: {
      name: string;
      avatar: string;
    };
    timestamp: number;
    media: {
      type: 'image';
      url: string;
      duration?: number;
    }[];
  };
  allStories?: any[];
  currentStoryIndex?: number;
  onNextStory?: () => void;
}

export function StoryModal({ 
  visible, 
  onClose, 
  story, 
  allStories = [], 
  currentStoryIndex = 0, 
  onNextStory 
}: StoryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const progressAnim = new Animated.Value(0);
  
  useEffect(() => {
    if (visible) {
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: story.media[currentIndex].duration || 5000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          if (currentIndex < story.media.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            // Fin de cette story, passer à la suivante si disponible
            const nextStoryIndex = currentStoryIndex + 1;
            if (nextStoryIndex < allStories.length && onNextStory) {
              setCurrentIndex(0); // Reset pour la prochaine story
              onNextStory();
            } else {
              onClose();
            }
          }
        }
      });
    }
    return () => progressAnim.stopAnimation();
  }, [visible, currentIndex, currentStoryIndex, allStories.length]);

  // Reset currentIndex when story changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [story.id]);

  const handlePress = (event: any) => {
    const screenWidth = event.nativeEvent.locationX;
    const halfScreen = screenWidth / 2;
    
    if (event.nativeEvent.locationX < halfScreen) {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    } else {
      if (currentIndex < story.media.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Fin de cette story, passer à la suivante si disponible
        const nextStoryIndex = currentStoryIndex + 1;
        if (nextStoryIndex < allStories.length && onNextStory) {
          setCurrentIndex(0); // Reset pour la prochaine story
          onNextStory();
        } else {
          onClose();
        }
      }
    }
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

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            {story.media.map((_, index) => (
              <View key={index} style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: index === currentIndex ? 
                        progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }) :
                        index < currentIndex ? '100%' : '0%',
                    },
                  ]}
                />
              </View>
            ))}
          </View>
          
          <View style={styles.userInfo}>
            <Image
              source={{ uri: story.user.avatar }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.username}>{story.user.name}</Text>
              <Text style={styles.timestamp}>{formatTimestamp(story.timestamp)}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          activeOpacity={1}
          style={styles.content}
          onPress={handlePress}
        >
          <Image
            source={{ uri: story.media[currentIndex].url }}
            style={styles.media}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 16,
    paddingTop: 50,
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 4,
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.white,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginBottom: 2,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 60,
  },
  content: {
    flex: 1,
  },
  media: {
    width: '100%',
    height: '100%',
  },
});