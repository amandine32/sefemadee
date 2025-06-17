import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { X, Timer, Play, Pause, Square, Clock, Users, MapPin, Bell } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';

const { width: screenWidth } = Dimensions.get('window');

interface SafeTimerModalProps {
  visible: boolean;
  onClose: () => void;
}

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
}

// Durées prédéfinies en minutes
const presetDurations = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1h', value: 60 },
  { label: '1h30', value: 90 },
  { label: '2h', value: 120 },
  { label: '3h', value: 180 },
  { label: '4h', value: 240 },
];

export function SafeTimerModal({ visible, onClose }: SafeTimerModalProps) {
  const { user } = useUser();
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showContactsSelection, setShowContactsSelection] = useState(false);

  // Contacts de confiance depuis le profil utilisateur
  const trustedContacts: TrustedContact[] = [
    { id: '1', name: 'Amina Benali', phone: '06 12 34 56 78' },
    { id: '2', name: 'Keiko Tanaka', phone: '06 23 45 67 89' },
    { id: '3', name: 'Fatou Diallo', phone: '06 34 56 78 90' },
    { id: '4', name: 'Elena Rodriguez', phone: '06 45 67 89 01' },
  ];

  // Effet pour le décompte du timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Timer terminé - déclencher l'alerte
            handleTimerExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, isPaused, timeRemaining]);

  const handleTimerExpired = () => {
    setIsActive(false);
    setIsPaused(false);
    
    // Ici, on déclencherait l'alerte automatique
    console.log('Timer expiré - Alerte automatique déclenchée');
    console.log('Contacts notifiés:', selectedContacts);
    
    // Dans une vraie app, on enverrait les notifications
    // et on déclencherait les procédures d'urgence
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    if (selectedDuration && selectedContacts.length > 0) {
      setTimeRemaining(selectedDuration * 60); // Convertir en secondes
      setIsActive(true);
      setIsPaused(false);
      setShowContactsSelection(false);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStopTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeRemaining(0);
  };

  const handleExtendTimer = (additionalMinutes: number) => {
    setTimeRemaining(prev => prev + (additionalMinutes * 60));
  };

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  const getSelectedContactsText = () => {
    if (selectedContacts.length === 0) {
      return 'Sélectionner des contacts';
    } else if (selectedContacts.length === 1) {
      const contact = trustedContacts.find(c => c.id === selectedContacts[0]);
      return contact?.name || '';
    } else {
      return `${selectedContacts.length} contacts sélectionnés`;
    }
  };

  const resetModal = () => {
    setSelectedDuration(null);
    setIsActive(false);
    setIsPaused(false);
    setTimeRemaining(0);
    setSelectedContacts([]);
    setShowContactsSelection(false);
    onClose();
  };

  const getTimerColor = () => {
    if (!isActive) return Colors.textSecondary;
    
    const totalSeconds = selectedDuration ? selectedDuration * 60 : 0;
    const percentage = timeRemaining / totalSeconds;
    
    if (percentage > 0.5) return Colors.success;
    if (percentage > 0.25) return Colors.warning;
    return Colors.danger;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={resetModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Minuteur sécurisé</Text>
            <TouchableOpacity onPress={resetModal} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {!isActive ? (
              <>
                <Text style={styles.description}>
                  Configurez un minuteur qui alertera automatiquement vos contacts de confiance si vous ne le désactivez pas à temps.
                </Text>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Durée du minuteur</Text>
                  <View style={styles.durationGrid}>
                    {presetDurations.map((duration) => (
                      <TouchableOpacity
                        key={duration.value}
                        style={[
                          styles.durationButton,
                          selectedDuration === duration.value && styles.durationButtonSelected
                        ]}
                        onPress={() => setSelectedDuration(duration.value)}
                      >
                        <Text style={[
                          styles.durationButtonText,
                          selectedDuration === duration.value && styles.durationButtonTextSelected
                        ]}>
                          {duration.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Contacts à alerter</Text>
                  <TouchableOpacity 
                    style={styles.contactsSelector}
                    onPress={() => setShowContactsSelection(!showContactsSelection)}
                  >
                    <Users size={20} color={Colors.primary} />
                    <Text style={[
                      styles.contactsSelectorText,
                      selectedContacts.length === 0 && styles.placeholder
                    ]}>
                      {getSelectedContactsText()}
                    </Text>
                  </TouchableOpacity>

                  {showContactsSelection && (
                    <View style={styles.contactsList}>
                      {trustedContacts.map((contact) => (
                        <TouchableOpacity
                          key={contact.id}
                          style={[
                            styles.contactItem,
                            selectedContacts.includes(contact.id) && styles.contactItemSelected
                          ]}
                          onPress={() => toggleContactSelection(contact.id)}
                        >
                          <View style={styles.contactInfo}>
                            <Text style={styles.contactName}>{contact.name}</Text>
                            <Text style={styles.contactPhone}>{contact.phone}</Text>
                          </View>
                          {selectedContacts.includes(contact.id) && (
                            <View style={styles.checkmark}>
                              <Text style={styles.checkmarkText}>✓</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.infoBox}>
                  <Bell size={20} color={Colors.primary} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>Comment ça marche ?</Text>
                    <Text style={styles.infoText}>
                      • Le minuteur se lance dès que vous confirmez{'\n'}
                      • Vos contacts recevront votre position actuelle{'\n'}
                      • Si le minuteur arrive à zéro, une alerte automatique est envoyée{'\n'}
                      • Vous pouvez l'arrêter ou l'étendre à tout moment
                    </Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.startButton,
                    {opacity: selectedDuration && selectedContacts.length > 0 ? 1 : 0.6}
                  ]}
                  disabled={!selectedDuration || selectedContacts.length === 0}
                  onPress={handleStartTimer}
                >
                  <Play size={20} color={Colors.white} />
                  <Text style={styles.startButtonText}>Démarrer le minuteur</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.activeTimerContainer}>
                <View style={styles.timerDisplay}>
                  <Timer size={32} color={getTimerColor()} />
                  <Text style={[styles.timerText, { color: getTimerColor() }]}>
                    {formatTime(timeRemaining)}
                  </Text>
                  <Text style={styles.timerStatus}>
                    {isPaused ? 'En pause' : 'Actif'}
                  </Text>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${selectedDuration ? (timeRemaining / (selectedDuration * 60)) * 100 : 0}%`,
                          backgroundColor: getTimerColor()
                        }
                      ]} 
                    />
                  </View>
                </View>

                <View style={styles.contactsInfo}>
                  <Text style={styles.contactsInfoTitle}>Contacts surveillant :</Text>
                  {selectedContacts.map(contactId => {
                    const contact = trustedContacts.find(c => c.id === contactId);
                    return contact ? (
                      <Text key={contactId} style={styles.contactsInfoItem}>
                        • {contact.name}
                      </Text>
                    ) : null;
                  })}
                </View>

                <View style={styles.timerControls}>
                  <TouchableOpacity 
                    style={styles.controlButton}
                    onPress={handlePauseResume}
                  >
                    {isPaused ? (
                      <Play size={20} color={Colors.primary} />
                    ) : (
                      <Pause size={20} color={Colors.primary} />
                    )}
                    <Text style={styles.controlButtonText}>
                      {isPaused ? 'Reprendre' : 'Pause'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.controlButton, styles.stopButton]}
                    onPress={handleStopTimer}
                  >
                    <Square size={20} color={Colors.white} />
                    <Text style={[styles.controlButtonText, styles.stopButtonText]}>
                      Arrêter
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.extendOptions}>
                  <Text style={styles.extendTitle}>Prolonger le minuteur :</Text>
                  <View style={styles.extendButtons}>
                    <TouchableOpacity 
                      style={styles.extendButton}
                      onPress={() => handleExtendTimer(15)}
                    >
                      <Text style={styles.extendButtonText}>+15 min</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.extendButton}
                      onPress={() => handleExtendTimer(30)}
                    >
                      <Text style={styles.extendButtonText}>+30 min</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.extendButton}
                      onPress={() => handleExtendTimer(60)}
                    >
                      <Text style={styles.extendButtonText}>+1h</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>
                    ⚠️ Si le minuteur arrive à zéro, vos contacts recevront automatiquement une alerte avec votre dernière position connue.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
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
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationButton: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: (screenWidth - 80) / 4 - 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  durationButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  durationButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  durationButtonTextSelected: {
    color: Colors.white,
  },
  contactsSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactsSelectorText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  placeholder: {
    color: Colors.textSecondary,
  },
  contactsList: {
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  contactItemSelected: {
    backgroundColor: Colors.lightGray,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  contactPhone: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
  },
  startButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  activeTimerContainer: {
    alignItems: 'center',
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    marginVertical: 8,
  },
  timerStatus: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  contactsInfo: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  contactsInfoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  contactsInfoItem: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 4,
  },
  stopButton: {
    backgroundColor: Colors.danger,
  },
  controlButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 6,
  },
  stopButtonText: {
    color: Colors.white,
  },
  extendOptions: {
    width: '100%',
    marginBottom: 24,
  },
  extendTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  extendButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  extendButton: {
    backgroundColor: Colors.success,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  extendButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: Colors.white,
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  warningText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 20,
  },
});