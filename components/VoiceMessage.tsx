import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface VoiceMessageProps {
  audioUri: string;
  duration: number;
  isMyMessage: boolean;
  timestamp: number;
}

export function VoiceMessage({ audioUri, duration, isMyMessage, timestamp }: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sound, setSound] = useState<any>(null);
  
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    if (isPlaying) {
      // Simuler la progression de lecture
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: duration * 1000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setIsPlaying(false);
          setCurrentTime(0);
          progressAnim.setValue(0);
        }
      });

      // Simuler le temps actuel
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      progressAnim.stopAnimation();
    }
  }, [isPlaying, duration]);

  const togglePlayback = async () => {
    try {
      if (isPlaying) {
        setIsPlaying(false);
        setCurrentTime(0);
        progressAnim.setValue(0);
      } else {
        setIsPlaying(true);
        setCurrentTime(0);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[
      styles.container,
      isMyMessage ? styles.myMessage : styles.theirMessage
    ]}>
      <View style={styles.voiceContent}>
        <TouchableOpacity
          style={[
            styles.playButton,
            isMyMessage ? styles.myPlayButton : styles.theirPlayButton
          ]}
          onPress={togglePlayback}
        >
          {isPlaying ? (
            <Pause size={16} color={isMyMessage ? Colors.white : Colors.primary} />
          ) : (
            <Play size={16} color={isMyMessage ? Colors.white : Colors.primary} />
          )}
        </TouchableOpacity>

        <View style={styles.waveformContainer}>
          <View style={styles.waveform}>
            {/* Simulation d'une forme d'onde */}
            {Array.from({ length: 20 }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.waveformBar,
                  {
                    height: Math.random() * 20 + 8,
                    backgroundColor: isMyMessage ? 
                      'rgba(255, 255, 255, 0.6)' : 
                      'rgba(143, 188, 143, 0.6)'
                  }
                ]}
              />
            ))}
            
            {/* Barre de progression */}
            <Animated.View
              style={[
                styles.progressOverlay,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                }
              ]}
            >
              {Array.from({ length: 20 }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.waveformBar,
                    {
                      height: Math.random() * 20 + 8,
                      backgroundColor: isMyMessage ? Colors.white : Colors.primary
                    }
                  ]}
                />
              ))}
            </Animated.View>
          </View>

          <View style={styles.timeContainer}>
            <Text style={[
              styles.timeText,
              isMyMessage ? styles.myTimeText : styles.theirTimeText
            ]}>
              {isPlaying ? formatTime(currentTime) : formatTime(duration)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[
        styles.timestamp,
        isMyMessage ? styles.myTimestamp : styles.theirTimestamp
      ]}>
        {formatTimestamp(timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  voiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    padding: 12,
    minWidth: 200,
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  voiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 12,
    minWidth: 200,
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  voiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 12,
    minWidth: 200,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  myPlayButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  theirPlayButton: {
    backgroundColor: Colors.primary,
  },
  waveformContainer: {
    flex: 1,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  waveformBar: {
    width: 2,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  timeContainer: {
    marginTop: 4,
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  myTimeText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  theirTimeText: {
    color: Colors.textSecondary,
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

// Correction des styles pour éviter la duplication
const correctedStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  voiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 12,
    minWidth: 200,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  myPlayButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  theirPlayButton: {
    backgroundColor: Colors.primary,
  },
  waveformContainer: {
    flex: 1,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  waveformBar: {
    width: 2,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  timeContainer: {
    marginTop: 4,
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  myTimeText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  theirTimeText: {
    color: Colors.textSecondary,
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

// Remplacer les styles par les styles corrigés
Object.assign(styles, correctedStyles);