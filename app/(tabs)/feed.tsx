import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { PostCard } from '@/components/PostCard';
import { Story } from '@/components/Story';
import { StoryModal } from '@/components/StoryModal';
import { useMockData } from '@/hooks/useMockData';
import { CreatePostForm } from '@/components/CreatePostForm';

export default function FeedScreen() {
  const { posts, stories } = useMockData();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const handleStoryPress = (story: any, index: number) => {
    setSelectedStory(story);
    setCurrentStoryIndex(index);
  };

  const handleNextStory = () => {
    const nextIndex = currentStoryIndex + 1;
    if (nextIndex < stories.length) {
      setCurrentStoryIndex(nextIndex);
      setSelectedStory(stories[nextIndex]);
    } else {
      setSelectedStory(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Fil d'actualité</Text>
      </View>
      
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.feedContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.storiesContainer}
            contentContainerStyle={styles.storiesContent}
          >
            <TouchableOpacity style={styles.addStoryButton}>
              <View style={styles.addStoryIcon}>
                <Plus size={24} color={Colors.primary} />
              </View>
              <Text style={styles.addStoryText}>Votre story</Text>
            </TouchableOpacity>
            
            {(stories || []).map((story, index) => (
              <Story
                key={story.id}
                story={story}
                onPress={() => handleStoryPress(story, index)}
              />
            ))}
          </ScrollView>
        )}
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={24} color="#FFF" />
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        presentationStyle="fullScreen"
      >
        <CreatePostForm onClose={() => setModalVisible(false)} />
      </Modal>

      {selectedStory && (
        <StoryModal
          visible={!!selectedStory}
          onClose={() => setSelectedStory(null)}
          story={selectedStory}
          allStories={stories}
          currentStoryIndex={currentStoryIndex}
          onNextStory={handleNextStory}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  storiesContainer: {
    marginBottom: 16,
  },
  storiesContent: {
    paddingHorizontal: 16,
  },
  addStoryButton: {
    alignItems: 'center',
    marginRight: 16,
    width: 72,
  },
  addStoryIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  addStoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  feedContainer: {
    padding: 16,
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});