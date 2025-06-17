import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { X, Share2, MapPin, Users, Clock, Eye, EyeOff, Copy, MessageSquare } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';

interface LiveLocationModalProps {
  visible: boolean;
  onClose: () => void;
}

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  isSharing: boolean;
}

interface LocationSession {
  id: string;
  name: string;
  startTime: number;
  duration: number; // en minutes
  participants: string[];
  shareLink: string;
  isActive: boolean;
}

export function LiveLocationModal({ visible, onClose }: LiveLocationModalProps) {
  const { user } = useUser();
  const [isSharing, setIsSharing] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [shareLink, setShareLink] = useState('');
  const [sessionDuration, setSessionDuration] = useState(60); // 1 heure par défaut
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [allowAnonymousViewing, setAllowAnonymousViewing] = useState(false);
  const [showLocationHistory, setShowLocationHistory] = useState(true);
  const [currentSession, setCurrentSession] = useState<LocationSession | null>(null);

  // Contacts de confiance depuis le profil utilisateur
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([
    { id: '1', name: 'Amina Benali', phone: '06 12 34 56 78', isSharing: false },
    { id: '2', name: 'Keiko Tanaka', phone: '06 23 45 67 89', isSharing: false },
    { id: '3', name: 'Fatou Diallo', phone: '06 34 56 78 90', isSharing: false },
    { id: '4', name: 'Elena Rodriguez', phone: '06 45 67 89 01', isSharing: false },
  ]);

  // Durées prédéfinies
  const durationOptions = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '1h', value: 60 },
    { label: '2h', value: 120 },
    { label: '4h', value: 240 },
    { label: '8h', value: 480 },
  ];

  useEffect(() => {
    if (isSharing && currentSession) {
      // Simuler la mise à jour de la session
      const interval = setInterval(() => {
        setCurrentSession(prev => {
          if (!prev) return null;
          
          const elapsed = Math.floor((Date.now() - prev.startTime) / 60000); // minutes écoulées
          if (elapsed >= prev.duration) {
            // Session expirée
            handleStopSharing();
            return null;
          }
          
          return prev;
        });
      }, 60000); // Vérifier chaque minute

      return () => clearInterval(interval);
    }
  }, [isSharing, currentSession]);

  const generateShareLink = () => {
    const sessionId = Date.now().toString();
    return `https://safemate.app/live/${sessionId}`;
  };

  const handleStartSharing = () => {
    if (selectedContacts.length === 0) return;

    const link = generateShareLink();
    const session: LocationSession = {
      id: Date.now().toString(),
      name: `Session de ${user?.pseudo || 'Utilisatrice'}`,
      startTime: Date.now(),
      duration: sessionDuration,
      participants: selectedContacts,
      shareLink: link,
      isActive: true,
    };

    setShareLink(link);
    setCurrentSession(session);
    setIsSharing(true);

    // Marquer les contacts sélectionnés comme partageant
    setTrustedContacts(prev => 
      prev.map(contact => ({
        ...contact,
        isSharing: selectedContacts.includes(contact.id)
      }))
    );

    // Dans une vraie app, on enverrait les invitations ici
    console.log('Partage de position démarré:', session);
  };

  const handleStopSharing = () => {
    setIsSharing(false);
    setCurrentSession(null);
    setShareLink('');
    setSelectedContacts([]);
    
    // Arrêter le partage pour tous les contacts
    setTrustedContacts(prev => 
      prev.map(contact => ({
        ...contact,
        isSharing: false
      }))
    );

    console.log('Partage de position arrêté');
  };

  const handleExtendSession = (additionalMinutes: number) => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        duration: prev.duration + additionalMinutes
      } : null);
      setSessionDuration(prev => prev + additionalMinutes);
    }
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

  const copyShareLink = () => {
    // Dans une vraie app, on copierait dans le presse-papiers
    console.log('Lien copié:', shareLink);
    // Feedback visuel que le lien a été copié
  };

  const formatTimeRemaining = () => {
    if (!currentSession) return '';
    
    const elapsed = Math.floor((Date.now() - currentSession.startTime) / 60000);
    const remaining = currentSession.duration - elapsed;
    
    if (remaining <= 0) return 'Expiré';
    
    const hours = Math.floor(remaining / 60);
    const minutes = remaining % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}min restantes`;
    }
    return `${minutes}min restantes`;
  };

  const resetModal = () => {
    if (isSharing) {
      handleStopSharing();
    }
    setShowAdvancedOptions(false);
    setAllowAnonymousViewing(false);
    setShowLocationHistory(true);
    setSessionDuration(60);
    onClose();
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
            <Text style={styles.modalTitle}>Partage de position en direct</Text>
            <TouchableOpacity onPress={resetModal} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {!isSharing ? (
              <>
                <Text style={styles.description}>
                  Partagez votre position en temps réel avec vos contacts de confiance pour qu'ils puissent vous suivre pendant vos déplacements.
                </Text>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Durée du partage</Text>
                  <View style={styles.durationGrid}>
                    {durationOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.durationButton,
                          sessionDuration === option.value && styles.durationButtonSelected
                        ]}
                        onPress={() => setSessionDuration(option.value)}
                      >
                        <Text style={[
                          styles.durationButtonText,
                          sessionDuration === option.value && styles.durationButtonTextSelected
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Contacts à inviter</Text>
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
                </View>

                <TouchableOpacity 
                  style={styles.advancedToggle}
                  onPress={() => setShowAdvancedOptions(!showAdvancedOptions)}
                >
                  <Text style={styles.advancedToggleText}>Options avancées</Text>
                  {showAdvancedOptions ? (
                    <EyeOff size={20} color={Colors.primary} />
                  ) : (
                    <Eye size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>

                {showAdvancedOptions && (
                  <View style={styles.advancedOptions}>
                    <View style={styles.optionRow}>
                      <View style={styles.optionInfo}>
                        <Text style={styles.optionLabel}>Autoriser la visualisation anonyme</Text>
                        <Text style={styles.optionDescription}>
                          Permet aux personnes avec le lien de voir votre position sans compte
                        </Text>
                      </View>
                      <Switch
                        value={allowAnonymousViewing}
                        onValueChange={setAllowAnonymousViewing}
                        trackColor={{ false: Colors.gray, true: Colors.primary }}
                        thumbColor={Colors.white}
                      />
                    </View>

                    <View style={styles.optionRow}>
                      <View style={styles.optionInfo}>
                        <Text style={styles.optionLabel}>Afficher l'historique de position</Text>
                        <Text style={styles.optionDescription}>
                          Montre le trajet parcouru pendant la session
                        </Text>
                      </View>
                      <Switch
                        value={showLocationHistory}
                        onValueChange={setShowLocationHistory}
                        trackColor={{ false: Colors.gray, true: Colors.primary }}
                        thumbColor={Colors.white}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.infoBox}>
                  <MapPin size={20} color={Colors.primary} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>Informations importantes</Text>
                    <Text style={styles.infoText}>
                      • Votre position sera mise à jour en temps réel{'\n'}
                      • Les invités recevront un lien pour vous suivre{'\n'}
                      • Vous pouvez arrêter le partage à tout moment{'\n'}
                      • La session s'arrête automatiquement après la durée choisie
                    </Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.startButton,
                    {opacity: selectedContacts.length > 0 ? 1 : 0.6}
                  ]}
                  disabled={selectedContacts.length === 0}
                  onPress={handleStartSharing}
                >
                  <Share2 size={20} color={Colors.white} />
                  <Text style={styles.startButtonText}>Commencer le partage</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.activeSharingContainer}>
                <View style={styles.statusCard}>
                  <View style={styles.statusHeader}>
                    <View style={styles.statusIndicator}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>Partage actif</Text>
                    </View>
                    <Text style={styles.timeRemaining}>{formatTimeRemaining()}</Text>
                  </View>
                  
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionTitle}>{currentSession?.name}</Text>
                    <Text style={styles.sessionDetails}>
                      Démarré à {new Date(currentSession?.startTime || 0).toLocaleTimeString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.shareLinkCard}>
                  <Text style={styles.shareLinkTitle}>Lien de partage</Text>
                  <View style={styles.shareLinkContainer}>
                    <Text style={styles.shareLink} numberOfLines={1}>
                      {shareLink}
                    </Text>
                    <TouchableOpacity style={styles.copyButton} onPress={copyShareLink}>
                      <Copy size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.shareLinkDescription}>
                    Partagez ce lien avec vos contacts pour qu'ils puissent vous suivre
                  </Text>
                </View>

                <View style={styles.participantsCard}>
                  <Text style={styles.participantsTitle}>Contacts qui vous suivent</Text>
                  {trustedContacts
                    .filter(contact => contact.isSharing)
                    .map((contact) => (
                      <View key={contact.id} style={styles.participantItem}>
                        <Users size={16} color={Colors.success} />
                        <Text style={styles.participantName}>{contact.name}</Text>
                        <View style={styles.participantStatus}>
                          <View style={styles.onlineDot} />
                          <Text style={styles.participantStatusText}>En ligne</Text>
                        </View>
                      </View>
                    ))}
                </View>

                <View style={styles.extendOptions}>
                  <Text style={styles.extendTitle}>Prolonger la session :</Text>
                  <View style={styles.extendButtons}>
                    <TouchableOpacity 
                      style={styles.extendButton}
                      onPress={() => handleExtendSession(30)}
                    >
                      <Text style={styles.extendButtonText}>+30 min</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.extendButton}
                      onPress={() => handleExtendSession(60)}
                    >
                      <Text style={styles.extendButtonText}>+1h</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.extendButton}
                      onPress={() => handleExtendSession(120)}
                    >
                      <Text style={styles.extendButtonText}>+2h</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.chatButton}>
                    <MessageSquare size={20} color={Colors.primary} />
                    <Text style={styles.chatButtonText}>Chat de groupe</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.stopButton}
                    onPress={handleStopSharing}
                  >
                    <Text style={styles.stopButtonText}>Arrêter le partage</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.privacyNote}>
                  <Text style={styles.privacyNoteText}>
                    🔒 Votre position n'est visible que par les personnes invitées et sera automatiquement supprimée à la fin de la session.
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
    minWidth: 80,
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
  contactsList: {
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
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 16,
  },
  advancedToggleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
  },
  advancedOptions: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionInfo: {
    flex: 1,
    marginRight: 16,
  },
  optionLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  optionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
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
  activeSharingContainer: {
    alignItems: 'stretch',
  },
  statusCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  timeRemaining: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sessionInfo: {
    
  },
  sessionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sessionDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  shareLinkCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  shareLinkTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  shareLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  shareLink: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  copyButton: {
    padding: 4,
  },
  shareLinkDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  participantsCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  participantsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  participantName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  participantStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: 4,
  },
  participantStatusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.success,
  },
  extendOptions: {
    marginBottom: 16,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
  },
  chatButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 6,
  },
  stopButton: {
    backgroundColor: Colors.danger,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
  privacyNote: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
  },
  privacyNoteText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
    lineHeight: 20,
  },
});