import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface VoiceRecorderProps {
  onSend: (audioUri: string, duration: number) => void;
  onCancel: () => void;
}

export function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [recording, setRecording] = useState<any>(null);
  const [sound, setSound] = useState<any>(null);
  
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      // Animation de pulsation pendant l'enregistrement
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Compteur de durée
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      if (Platform.OS === 'web') {
        // Pour le web, on simule l'enregistrement
        setIsRecording(true);
        setRecordingDuration(0);
        
        // Simuler un enregistrement de 3 secondes
        setTimeout(() => {
          setIsRecording(false);
          setAudioUri('mock-audio-uri');
        }, 3000);
      } else {
        // Code pour mobile avec expo-av
        console.log('Starting recording...');
        setIsRecording(true);
        setRecordingDuration(0);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (Platform.OS === 'web') {
        setIsRecording(false);
        setAudioUri('mock-audio-uri');
      } else {
        console.log('Stopping recording...');
        setIsRecording(false);
        if (recording) {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          setAudioUri(uri);
        }
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const playRecording = async () => {
    try {
      if (Platform.OS === 'web') {
        // Simuler la lecture sur web
        setIsPlaying(true);
        setTimeout(() => {
          setIsPlaying(false);
        }, recordingDuration * 1000);
      } else {
        console.log('Playing recording...');
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Failed to play recording', err);
    }
  };

  const pauseRecording = async () => {
    try {
      if (Platform.OS === 'web') {
        setIsPlaying(false);
      } else {
        console.log('Pausing recording...');
        setIsPlaying(false);
      }
    } catch (err) {
      console.error('Failed to pause recording', err);
    }
  };

  const deleteRecording = () => {
    setAudioUri(null);
    setRecordingDuration(0);
    setIsPlaying(false);
  };

  const sendRecording = () => {
    if (audioUri) {
      onSend(audioUri, recordingDuration);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {!audioUri ? (
        // Interface d'enregistrement
        <View style={styles.recordingInterface}>
          <View style={styles.recordingControls}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>

            <View style={styles.recordingCenter}>
              {isRecording ? (
                <Animated.View
                  style={[
                    styles.recordingButton,
                    styles.recordingActive,
                    { transform: [{ scale: pulseAnim }] }
                  ]}
                >
                  <TouchableOpacity
                    style={styles.stopButton}
                    onPress={stopRecording}
                  >
                    <Square size={24} color={Colors.white} fill={Colors.white} />
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                <TouchableOpacity
                  style={styles.recordingButton}
                  onPress={startRecording}
                >
                  <Mic size={32} color={Colors.white} />
                </TouchableOpacity>
              )}
              
              <Text style={styles.durationText}>
                {formatDuration(recordingDuration)}
              </Text>
            </View>

            <View style={styles.placeholder} />
          </View>

          <Text style={styles.instructionText}>
            {isRecording ? 'Appuyez pour arrêter' : 'Maintenez pour enregistrer'}
          </Text>
        </View>
      ) : (
        // Interface de prévisualisation
        <View style={styles.previewInterface}>
          <View style={styles.previewControls}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={deleteRecording}
            >
              <Trash2 size={20} color={Colors.danger} />
            </TouchableOpacity>

            <View style={styles.playbackControls}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={isPlaying ? pauseRecording : playRecording}
              >
                {isPlaying ? (
                  <Pause size={20} color={Colors.primary} />
                ) : (
                  <Play size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
              
              <View style={styles.waveform}>
                <Text style={styles.durationText}>
                  {formatDuration(recordingDuration)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendRecording}
            >
              <Text style={styles.sendText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  recordingInterface: {
    alignItems: 'center',
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  recordingCenter: {
    alignItems: 'center',
  },
  recordingButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordingActive: {
    backgroundColor: Colors.danger,
  },
  stopButton: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 80,
  },
  instructionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  previewInterface: {
    
  },
  previewControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  playButton: {
    marginRight: 12,
  },
  waveform: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  sendText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
});