import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Dimensions, FlatList } from 'react-native';
import { MapPin, X, Clock, ChevronDown, Users, Check, Timer, Share2, Shield } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';
import { SafeTimerModal } from './SafeTimerModal';
import { LiveLocationModal } from './LiveLocationModal';

const { width: screenWidth } = Dimensions.get('window');

interface JourneyModalProps {
  visible: boolean;
  onClose: () => void;
}

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
}

// Mock data pour les suggestions d'adresses parisiennes
const parisAddresses = [
  'Place de la République, Paris',
  'Gare du Nord, Paris',
  'Châtelet-Les Halles, Paris',
  'Place de la Bastille, Paris',
  'Montmartre, Paris',
  'Tour Eiffel, Paris',
  'Louvre, Paris',
  'Notre-Dame, Paris',
  'Opéra, Paris',
  'Marais, Paris',
  'Saint-Germain-des-Prés, Paris',
  'Belleville, Paris',
  'Pigalle, Paris',
  'République, Paris',
  'Oberkampf, Paris',
  'Canal Saint-Martin, Paris',
  'Père Lachaise, Paris',
  'Buttes-Chaumont, Paris',
  'Trocadéro, Paris',
  'Invalides, Paris'
];

// Suggestions de durées
const durationSlots = [
  '5 min', '10 min', '15 min', '20 min',
  '25 min', '30 min', '35 min', '40 min',
  '45 min', '50 min', '1h', '1h15',
  '1h30', '1h45', '2h', '2h30'
];

export function JourneyModal({ visible, onClose }: JourneyModalProps) {
  const { user } = useUser();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [selectedSecurityMode, setSelectedSecurityMode] = useState<'none' | 'timer' | 'live'>('none');
  const [showSecurityModeSelection, setShowSecurityModeSelection] = useState(false);
  const [safeTimerModalVisible, setSafeTimerModalVisible] = useState(false);
  const [liveLocationModalVisible, setLiveLocationModalVisible] = useState(false);

  // États pour les suggestions et sélecteurs
  const [departureSuggestions, setDepartureSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [showDurationSelector, setShowDurationSelector] = useState(false);

  // Contacts de confiance depuis le profil utilisateur
  const trustedContacts: TrustedContact[] = [
    { id: '1', name: 'Amina Benali', phone: '06 12 34 56 78' },
    { id: '2', name: 'Keiko Tanaka', phone: '06 23 45 67 89' },
    { id: '3', name: 'Fatou Diallo', phone: '06 34 56 78 90' },
    { id: '4', name: 'Elena Rodriguez', phone: '06 45 67 89 01' },
  ];

  // Fonction pour filtrer les suggestions d'adresses
  const filterAddresses = (query: string): string[] => {
    if (query.length < 2) return [];
    return parisAddresses.filter(address => 
      address.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  // Gestion des changements d'adresse de départ
  const handleDepartureChange = (text: string) => {
    setDeparture(text);
    
    const suggestions = filterAddresses(text);
    setDepartureSuggestions(suggestions);
    setShowDepartureSuggestions(suggestions.length > 0);
  };

  // Gestion des changements d'adresse de destination
  const handleDestinationChange = (text: string) => {
    setDestination(text);
    
    const suggestions = filterAddresses(text);
    setDestinationSuggestions(suggestions);
    setShowDestinationSuggestions(suggestions.length > 0);
  };

  // Sélection d'une suggestion d'adresse
  const selectDepartureSuggestion = (address: string) => {
    setDeparture(address);
    setShowDepartureSuggestions(false);
  };

  const selectDestinationSuggestion = (address: string) => {
    setDestination(address);
    setShowDestinationSuggestions(false);
  };

  // Sélection d'une durée
  const selectDurationSlot = (duration: string) => {
    setEstimatedDuration(duration);
    setShowDurationSelector(false);
  };

  // Gestion de la sélection des contacts
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

  const handleSecurityModeSelect = (mode: 'timer' | 'live') => {
    setSelectedSecurityMode(mode);
    setShowSecurityModeSelection(false);
    
    // Démarrer le trajet avec le mode de sécurité sélectionné
    setJourneyStarted(true);
    
    // Ouvrir le modal correspondant au mode sélectionné
    if (mode === 'timer') {
      setSafeTimerModalVisible(true);
    } else if (mode === 'live') {
      setLiveLocationModalVisible(true);
    }
  };

  const getSecurityModeText = () => {
    switch (selectedSecurityMode) {
      case 'timer':
        return 'Minuteur sécurisé activé';
      case 'live':
        return 'Partage de position en direct';
      default:
        return 'Choisir un mode de sécurité';
    }
  };

  const canChooseSecurityMode = () => {
    return departure && destination && estimatedDuration;
  };

  const handleChooseSecurityMode = () => {
    if (canChooseSecurityMode()) {
      setShowSecurityModeSelection(true);
    }
  };

  const handleEndJourney = () => {
    setJourneyStarted(false);
    setDeparture('');
    setDestination('');
    setEstimatedDuration('');
    setSelectedContacts([]);
    setSelectedSecurityMode('none');
    setShowDepartureSuggestions(false);
    setShowDestinationSuggestions(false);
    setShowDurationSelector(false);
    setShowContactsModal(false);
    setShowSecurityModeSelection(false);
    onClose();
  };

  const handleClose = () => {
    if (!journeyStarted) {
      setDeparture('');
      setDestination('');
      setEstimatedDuration('');
      setSelectedContacts([]);
      setSelectedSecurityMode('none');
      setShowDepartureSuggestions(false);
      setShowDestinationSuggestions(false);
      setShowDurationSelector(false);
      setShowContactsModal(false);
      setShowSecurityModeSelection(false);
    }
    onClose();
  };

  const renderContactsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showContactsModal}
      onRequestClose={() => setShowContactsModal(false)}
    >
      <View style={styles.contactsModalContainer}>
        <View style={styles.contactsModalContent}>
          <View style={styles.contactsModalHeader}>
            <Text style={styles.contactsModalTitle}>Contacts de confiance</Text>
            <TouchableOpacity onPress={() => setShowContactsModal(false)} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.contactsDescription}>
            Sélectionnez les contacts qui recevront votre position pendant le trajet.
          </Text>

          <FlatList
            data={trustedContacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.contactItem,
                  selectedContacts.includes(item.id) && styles.contactItemSelected
                ]}
                onPress={() => toggleContactSelection(item.id)}
              >
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{item.name}</Text>
                  <Text style={styles.contactPhone}>{item.phone}</Text>
                </View>
                {selectedContacts.includes(item.id) && (
                  <View style={styles.checkIcon}>
                    <Check size={20} color={Colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            )}
            style={styles.contactsList}
          />

          <TouchableOpacity 
            style={styles.confirmContactsButton}
            onPress={() => setShowContactsModal(false)}
          >
            <Text style={styles.confirmContactsButtonText}>
              Confirmer ({selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderSecurityModeSelection = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showSecurityModeSelection}
      onRequestClose={() => setShowSecurityModeSelection(false)}
    >
      <View style={styles.securityModeModalContainer}>
        <View style={styles.securityModeModalContent}>
          <View style={styles.securityModeModalHeader}>
            <Text style={styles.securityModeModalTitle}>Choisir le mode de sécurité</Text>
            <TouchableOpacity onPress={() => setShowSecurityModeSelection(false)} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.securityModeDescription}>
            Sélectionnez le mode de sécurité qui vous convient pour ce trajet.
          </Text>

          <TouchableOpacity 
            style={styles.securityModeOption}
            onPress={() => handleSecurityModeSelect('timer')}
          >
            <View style={styles.securityModeIcon}>
              <Timer size={32} color={Colors.success} />
            </View>
            <View style={styles.securityModeContent}>
              <Text style={styles.securityModeTitle}>Minuteur sécurisé</Text>
              <Text style={styles.securityModeSubtitle}>
                Alerte automatique si vous n'arrivez pas à temps
              </Text>
              <View style={styles.securityModeFeatures}>
                <Text style={styles.securityModeFeature}>• Timer personnalisable</Text>
                <Text style={styles.securityModeFeature}>• Alerte automatique aux contacts</Text>
                <Text style={styles.securityModeFeature}>• Extension possible du délai</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.securityModeOption}
            onPress={() => handleSecurityModeSelect('live')}
          >
            <View style={styles.securityModeIcon}>
              <Share2 size={32} color={Colors.primaryDark} />
            </View>
            <View style={styles.securityModeContent}>
              <Text style={styles.securityModeTitle}>Partage de position en direct</Text>
              <Text style={styles.securityModeSubtitle}>
                Vos contacts peuvent vous suivre en temps réel
              </Text>
              <View style={styles.securityModeFeatures}>
                <Text style={styles.securityModeFeature}>• Position en temps réel</Text>
                <Text style={styles.securityModeFeature}>• Lien de partage sécurisé</Text>
                <Text style={styles.securityModeFeature}>• Chat de groupe intégré</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
            <Text style={styles.modalTitle}>
              {journeyStarted ? 'Trajet en cours' : 'Nouveau trajet solo'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {!journeyStarted ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Point de départ</Text>
                <View style={styles.inputContainer}>
                  <View style={[styles.locationDot, { backgroundColor: Colors.primary }]} />
                  <TextInput
                    style={styles.input}
                    placeholder="Adresse de départ"
                    value={departure}
                    onChangeText={handleDepartureChange}
                    onFocus={() => {
                      if (departure && departure.length >= 2) {
                        setShowDepartureSuggestions(true);
                      }
                    }}
                  />
                </View>
                
                {showDepartureSuggestions && (
                  <View style={styles.suggestionsContainer}>
                    {departureSuggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => selectDepartureSuggestion(suggestion)}
                      >
                        <MapPin size={16} color={Colors.textSecondary} />
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                <TouchableOpacity style={styles.locationButton}>
                  <Text style={styles.locationButtonText}>📍 Utiliser ma position actuelle</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Destination</Text>
                <View style={styles.inputContainer}>
                  <View style={[styles.locationDot, { backgroundColor: Colors.warning }]} />
                  <TextInput
                    style={styles.input}
                    placeholder="Adresse de destination"
                    value={destination}
                    onChangeText={handleDestinationChange}
                    onFocus={() => {
                      if (destination && destination.length >= 2) {
                        setShowDestinationSuggestions(true);
                      }
                    }}
                  />
                </View>
                
                {showDestinationSuggestions && (
                  <View style={styles.suggestionsContainer}>
                    {destinationSuggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => selectDestinationSuggestion(suggestion)}
                      >
                        <MapPin size={16} color={Colors.textSecondary} />
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Estimation de durée du trajet</Text>
                <TouchableOpacity 
                  style={styles.durationSelector}
                  onPress={() => setShowDurationSelector(!showDurationSelector)}
                >
                  <Clock size={20} color={Colors.primary} />
                  <Text style={[styles.durationSelectorText, !estimatedDuration && styles.placeholder]}>
                    {estimatedDuration || 'Sélectionner une durée'}
                  </Text>
                  <ChevronDown size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
                
                {showDurationSelector && (
                  <View style={styles.durationGrid}>
                    {durationSlots.map((duration) => (
                      <TouchableOpacity
                        key={duration}
                        style={[
                          styles.durationSlot,
                          estimatedDuration === duration && styles.durationSlotSelected
                        ]}
                        onPress={() => selectDurationSlot(duration)}
                      >
                        <Text style={[
                          styles.durationSlotText,
                          estimatedDuration === duration && styles.durationSlotTextSelected
                        ]}>
                          {duration}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              
              <View style={styles.optionsContainer}>
                <Text style={styles.optionsTitle}>Options de sécurité</Text>
                
                <View style={styles.optionRow}>
                  <Text style={styles.optionLabel}>Partager avec contacts de confiance</Text>
                  <TouchableOpacity 
                    style={styles.optionButton}
                    onPress={() => setShowContactsModal(true)}
                  >
                    <Text style={styles.optionButtonText}>{getSelectedContactsText()}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.chooseSecurityModeButton, 
                  {opacity: canChooseSecurityMode() ? 1 : 0.6}
                ]}
                onPress={handleChooseSecurityMode}
                disabled={!canChooseSecurityMode()}
              >
                <Shield size={20} color="#FFF" />
                <Text style={styles.chooseSecurityModeButtonText}>Choisir le mode de sécurité</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <View style={styles.activeJourneyContainer}>
              <View style={styles.journeyDetails}>
                <Text style={styles.journeyTitle}>Trajet en cours</Text>
                
                <View style={styles.journeyPoints}>
                  <View style={styles.journeyPoint}>
                    <View style={[styles.locationDot, { backgroundColor: Colors.primary }]} />
                    <Text style={styles.journeyPointText}>{departure}</Text>
                  </View>
                  
                  <View style={styles.journeyDivider} />
                  
                  <View style={styles.journeyPoint}>
                    <View style={[styles.locationDot, { backgroundColor: Colors.warning }]} />
                    <Text style={styles.journeyPointText}>{destination}</Text>
                  </View>
                </View>
                
                <View style={styles.durationInfo}>
                  <Clock size={16} color={Colors.textSecondary} />
                  <Text style={styles.durationText}>Durée estimée: {estimatedDuration}</Text>
                </View>

                {selectedSecurityMode !== 'none' && (
                  <View style={styles.securityModeActive}>
                    <Shield size={16} color={Colors.success} />
                    <Text style={styles.securityModeActiveText}>
                      {selectedSecurityMode === 'timer' ? 'Minuteur sécurisé actif' : 'Partage de position actif'}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.statusContainer}>
                <View style={styles.statusIndicator}>
                  <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
                  <Text style={styles.statusText}>Trajet sécurisé</Text>
                </View>
                <Text style={styles.statusDescription}>
                  {selectedContacts.length > 0 
                    ? `${selectedContacts.length} contact${selectedContacts.length > 1 ? 's' : ''} de confiance suivent votre trajet`
                    : 'Votre trajet est suivi en temps réel'
                  }
                </Text>
              </View>
              
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.pauseButton}>
                  <Text style={styles.pauseButtonText}>Mettre en pause</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.endButton}
                  onPress={handleEndJourney}
                >
                  <Text style={styles.endButtonText}>Terminer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
      
      {renderContactsModal()}
      {renderSecurityModeSelection()}

      <SafeTimerModal 
        visible={safeTimerModalVisible} 
        onClose={() => setSafeTimerModalVisible(false)} 
      />

      <LiveLocationModal 
        visible={liveLocationModalVisible} 
        onClose={() => setLiveLocationModalVisible(false)} 
      />
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
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  suggestionsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  suggestionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  locationButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  locationButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
  durationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  durationSelectorText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  placeholder: {
    color: Colors.textSecondary,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  durationSlot: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: (screenWidth - 120) / 4 - 8, // Responsive width
    alignItems: 'center',
  },
  durationSlotSelected: {
    backgroundColor: Colors.primary,
  },
  durationSlotText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  durationSlotTextSelected: {
    color: Colors.white,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  optionButton: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    maxWidth: 200,
  },
  optionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  chooseSecurityModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
  },
  chooseSecurityModeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  activeJourneyContainer: {
    alignItems: 'stretch',
  },
  journeyDetails: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  journeyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  journeyPoints: {
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  journeyPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  journeyPointText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  journeyDivider: {
    height: 20,
    width: 1,
    backgroundColor: Colors.gray,
    marginLeft: 6,
    marginVertical: 4,
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  durationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  securityModeActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  securityModeActiveText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.success,
    marginLeft: 6,
  },
  statusContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  statusDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pauseButton: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  pauseButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  endButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  endButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  // Styles pour le modal des contacts
  contactsModalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  contactsModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  contactsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactsModalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
  },
  contactsDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 24,
  },
  contactsList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  contactItemSelected: {
    backgroundColor: Colors.primary,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  contactPhone: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmContactsButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmContactsButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  // Styles pour le modal de sélection du mode de sécurité
  securityModeModalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  securityModeModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  securityModeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  securityModeModalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
  },
  securityModeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  securityModeOption: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  securityModeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  securityModeContent: {
    flex: 1,
  },
  securityModeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  securityModeSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  securityModeFeatures: {
    gap: 4,
  },
  securityModeFeature: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textPrimary,
  },
});