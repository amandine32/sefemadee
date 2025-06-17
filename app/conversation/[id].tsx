import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Send, Mic } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useConversation } from '@/hooks/useConversation';
import { MessageBubble } from '@/components/MessageBubble';
import { VoiceRecorder } from '@/components/VoiceRecorder';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { conversation, messages, sendMessage, sendVoiceMessage } = useConversation(id);
  const [messageText, setMessageText] = useState('');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  if (!conversation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Conversation</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text>Conversation introuvable</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSend = () => {
    if (messageText.trim().length > 0) {
      sendMessage(messageText);
      setMessageText('');
    }
  };

  const handleVoiceSend = (audioUri: string, duration: number) => {
    sendVoiceMessage(audioUri, duration);
    setShowVoiceRecorder(false);
  };

  const handleVoiceCancel = () => {
    setShowVoiceRecorder(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{conversation.name}</Text>
      </View>
      
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble message={item} />
        )}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        {showVoiceRecorder ? (
          <VoiceRecorder
            onSend={handleVoiceSend}
            onCancel={handleVoiceCancel}
          />
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Votre message..."
              value={messageText}
              onChangeText={setMessageText}
              multiline
            />
            
            <TouchableOpacity 
              style={styles.voiceButton}
              onPress={() => setShowVoiceRecorder(true)}
            >
              <Mic size={20} color={Colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.sendButton,
                {backgroundColor: messageText.trim() ? Colors.primary : Colors.gray}
              ]}
              onPress={handleSend}
              disabled={!messageText.trim()}
            >
              <Send size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontFamily: 'Inter-Regular',
    marginRight: 8,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});