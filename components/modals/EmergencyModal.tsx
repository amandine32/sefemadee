import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Animated, Easing } from 'react-native';
import { X, Video, Mic, MapPin, Send } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface EmergencyModalProps {
  visible: boolean;
  onClose: () => void;
}

export function EmergencyModal({ visible, onClose }: EmergencyModalProps) {
  const [isActive, setIsActive] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [contactsSent, setContactsSent] = useState(false);
  
  const pulseAnim = new Animated.Value(1);
  const recordingAnim = new Animated.Value(1);
  
  useEffect(() => {
    if (isActive) {
      // Pulse animation for the recording indicator
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(recordingAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Timer for recording
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
      // Simulate sending to contacts after 2 seconds
      const timeout = setTimeout(() => {
        setContactsSent(true);
      }, 2000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setRecordingTime(0);
      setContactsSent(false);
    }
  }, [isActive]);
  
  useEffect(() => {
    // Pulse animation for the alert button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleAlertPress = () => {
    setIsActive(!isActive);
  };
  
  const handleClose = () => {
    setIsActive(false);
    onClose();
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Alerte d'urgence</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.alertDescription}>
            En cas de danger immédiat, déclenchez l'alerte pour enregistrer votre environnement et envoyer votre position à vos contacts de confiance.
          </Text>
          
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.alertButton, isActive && styles.alertButtonActive]}
              onPress={handleAlertPress}
            >
              {!isActive ? (
                <Animated.View
                  style={[
                    styles.pulseCircle,
                    {
                      transform: [{ scale: pulseAnim }],
                      opacity: pulseAnim.interpolate({
                        inputRange: [1, 1.2],
                        outputRange: [0.6, 0],
                      }),
                    },
                  ]}
                />
              ) : null}
              <Text style={[styles.alertButtonText, isActive && styles.alertButtonTextActive]}>
                {isActive ? 'ARRÊTER' : 'DÉCLENCHER'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {isActive && (
            <View style={styles.recordingContainer}>
              <View style={styles.recordingHeader}>
                <Text style={styles.recordingTitle}>Enregistrement en cours</Text>
                <Animated.View
                  style={[
                    styles.recordingIndicator,
                    {
                      transform: [{ scale: recordingAnim }],
                    },
                  ]}
                />
              </View>
              
              <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
              
              <View style={styles.recordingStatus}>
                <View style={styles.statusItem}>
                  <Video size={20} color={Colors.success} />
                  <Text style={styles.statusText}>Vidéo</Text>
                </View>
                
                <View style={styles.statusItem}>
                  <Mic size={20} color={Colors.success} />
                  <Text style={styles.statusText}>Audio</Text>
                </View>
                
                <View style={styles.statusItem}>
                  <MapPin size={20} color={Colors.success} />
                  <Text style={styles.statusText}>Position</Text>
                </View>
              </View>
              
              <View style={styles.contactsContainer}>
                <View style={styles.contactsHeader}>
                  <Text style={styles.contactsTitle}>Contacts d'urgence</Text>
                  {contactsSent ? (
                    <View style={styles.sentIndicator}>
                      <Send size={16} color={Colors.success} />
                      <Text style={styles.sentText}>Envoyé</Text>
                    </View>
                  ) : (
                    <Text style={styles.sendingText}>Envoi en cours...</Text>
                  )}
                </View>
                
                <View style={styles.contactsList}>
                  <Text style={styles.contactItem}>Amina Benali</Text>
                  <Text style={styles.contactItem}>Keiko Tanaka</Text>
                  <Text style={styles.contactItem}>Fatou Diallo</Text>
                </View>
              </View>
              
              <Text style={styles.emergencyNote}>
                En cas d'urgence vitale, appelez directement le 17 ou le 112
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  alertDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 24,
  },
  actionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  alertButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.white,
    borderWidth: 8,
    borderColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  alertButtonActive: {
    backgroundColor: Colors.danger,
  },
  pulseCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    borderColor: Colors.danger,
  },
  alertButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.danger,
  },
  alertButtonTextActive: {
    color: Colors.white,
  },
  recordingContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 16,
  },
  recordingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recordingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.danger,
  },
  recordingTime: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  recordingStatus: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 6,
  },
  contactsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  sendingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  sentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.success,
    marginLeft: 4,
  },
  contactsList: {
    
  },
  contactItem: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 6,
  },
  emergencyNote: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});