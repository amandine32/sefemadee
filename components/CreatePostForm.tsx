import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Paperclip, MapPin, Image as ImageIcon } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';
import { ProfileAvatar } from '@/components/ProfileAvatar';

interface CreatePostFormProps {
  onClose: () => void;
}

export function CreatePostForm({ onClose }: CreatePostFormProps) {
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [includeLocation, setIncludeLocation] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  
  const handleSubmit = () => {
    if (content.trim()) {
      // In a real app, this would save the post to the database
      console.log({
        content,
        includeLocation,
        selectedMedia,
        timestamp: Date.now()
      });
      
      setContent('');
      setSelectedMedia(null);
      setIncludeLocation(false);
      onClose();
    }
  };

  const handleAddMedia = () => {
    // In a real app, this would open camera or media library
    // For demo purposes, we'll use a placeholder image
    const demoImages = [
      'https://images.pexels.com/photos/1850619/pexels-photo-1850619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ];
    
    const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
    setSelectedMedia(randomImage);
  };

  const removeMedia = () => {
    setSelectedMedia(null);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.publishButton,
              {opacity: content.trim() ? 1 : 0.6}
            ]}
            disabled={!content.trim()}
            onPress={handleSubmit}
          >
            <Text style={styles.publishText}>Publier</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.inputContainer}>
            <ProfileAvatar size={48} />
            
            <TextInput
              style={styles.input}
              placeholder="Exprimez-vous..."
              placeholderTextColor={Colors.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              autoFocus
            />
          </View>
          
          {selectedMedia && (
            <View style={styles.mediaContainer}>
              <Image source={{ uri: selectedMedia }} style={styles.selectedMedia} />
              <TouchableOpacity style={styles.removeMediaButton} onPress={removeMedia}>
                <X size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          )}
          
          {includeLocation && (
            <View style={styles.locationContainer}>
              <MapPin size={16} color={Colors.primary} />
              <Text style={styles.locationText}>Paris, France</Text>
            </View>
          )}
        </View>
        
        <View style={styles.toolbar}>
          <TouchableOpacity 
            style={styles.toolbarButton}
            onPress={handleAddMedia}
          >
            <Paperclip size={24} color={Colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.toolbarButton,
              includeLocation && styles.toolbarButtonActive
            ]}
            onPress={() => setIncludeLocation(!includeLocation)}
          >
            <MapPin 
              size={24} 
              color={includeLocation ? Colors.white : Colors.primary}
              fill={includeLocation ? Colors.white : 'transparent'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.toolbarButton}>
            <Text style={styles.gifText}>GIF</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
    minHeight: 72,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  publishButton: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: Colors.textPrimary,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
    marginLeft: 12,
  },
  mediaContainer: {
    position: 'relative',
    marginBottom: 16,
    marginLeft: 60, // Align with text input
  },
  selectedMedia: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 60, // Align with text input
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 6,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
    minHeight: 84,
  },
  toolbarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  toolbarButtonActive: {
    backgroundColor: Colors.primary,
  },
  gifText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.primary,
  },
});