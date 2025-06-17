import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput, ScrollView, FlatList, Dimensions } from 'react-native';
import { MapPin, X, Clock, Users, MessageSquare, ChevronDown } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { JourneyRequest } from '@/types/journey';
import { useUser } from '@/hooks/useUser';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SharedJourneyModalProps {
  visible: boolean;
  onClose: () => void;
}

type Step = 'form' | 'matching' | 'matches' | 'chat' | 'confirmed';

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

// Suggestions d'heures
const timeSlots = [
  '17h00', '17h15', '17h30', '17h45',
  '18h00', '18h15', '18h30', '18h45',
  '19h00', '19h15', '19h30', '19h45',
  '20h00', '20h15', '20h30', '20h45',
  '21h00', '21h15', '21h30', '21h45',
  '22h00', '22h15', '22h30', '22h45'
];

export function SharedJourneyModal({ visible, onClose }: SharedJourneyModalProps) {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [journeyRequest, setJourneyRequest] = useState<Partial<JourneyRequest>>({
    type: 'shared',
    departure: { address: '' },
    destination: { address: '' },
    estimatedDepartureTime: '',
    transportMode: 'walking',
    description: ''
  });

  // États pour les suggestions et sélecteurs
  const [departureSuggestions, setDepartureSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [showTimeSelector, setShowTimeSelector] = useState(false);

  const [matches, setMatches] = useState([
    {
      id: '1',
      user: {
        id: '2',
        name: 'Amina',
        avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg',
        city: 'Paris 11ème'
      },
      compatibility: 95,
      route: 'Métro République → Bastille',
      departureTime: '18h25',
      description: 'Je pars du métro République vers Bastille, on peut se retrouver à la sortie !'
    },
    {
      id: '2',
      user: {
        id: '3',
        name: 'Keiko',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
        city: 'Paris 3ème'
      },
      compatibility: 87,
      route: 'Place de la République → Rue de la Roquette',
      departureTime: '18h30',
      description: 'Trajet à pied, environ 15 minutes'
    }
  ]);

  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      type: 'system',
      content: 'Vous pouvez maintenant discuter avec {name} pour organiser votre trajet.',
      timestamp: Date.now() - 300000
    },
    {
      id: '2',
      type: 'received',
      content: 'Salut ! Je vois qu\'on a un trajet similaire. Tu veux qu\'on se retrouve à la sortie du métro ?',
      timestamp: Date.now() - 240000
    },
    {
      id: '3',
      type: 'sent',
      content: 'Parfait ! Je serai là vers 18h25. On se retrouve sortie République côté rue du Temple ?',
      timestamp: Date.now() - 180000
    },
    {
      id: '4',
      type: 'received',
      content: 'Super ! À tout à l\'heure 😊',
      timestamp: Date.now() - 120000
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Fonction pour filtrer les suggestions d'adresses
  const filterAddresses = (query: string): string[] => {
    if (query.length < 2) return [];
    return parisAddresses.filter(address => 
      address.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  // Gestion des changements d'adresse de départ
  const handleDepartureChange = (text: string) => {
    setJourneyRequest(prev => ({
      ...prev,
      departure: { address: text }
    }));
    
    const suggestions = filterAddresses(text);
    setDepartureSuggestions(suggestions);
    setShowDepartureSuggestions(suggestions.length > 0);
  };

  // Gestion des changements d'adresse de destination
  const handleDestinationChange = (text: string) => {
    setJourneyRequest(prev => ({
      ...prev,
      destination: { address: text }
    }));
    
    const suggestions = filterAddresses(text);
    setDestinationSuggestions(suggestions);
    setShowDestinationSuggestions(suggestions.length > 0);
  };

  // Sélection d'une suggestion d'adresse
  const selectDepartureSuggestion = (address: string) => {
    setJourneyRequest(prev => ({
      ...prev,
      departure: { address }
    }));
    setShowDepartureSuggestions(false);
  };

  const selectDestinationSuggestion = (address: string) => {
    setJourneyRequest(prev => ({
      ...prev,
      destination: { address }
    }));
    setShowDestinationSuggestions(false);
  };

  // Sélection d'un créneau horaire
  const selectTimeSlot = (time: string) => {
    setJourneyRequest(prev => ({
      ...prev,
      estimatedDepartureTime: time
    }));
    setShowTimeSelector(false);
  };

  const handleFormSubmit = () => {
    if (journeyRequest.departure?.address && journeyRequest.destination?.address && journeyRequest.estimatedDepartureTime) {
      setCurrentStep('matching');
      
      // Simulate matching process
      setTimeout(() => {
        setCurrentStep('matches');
      }, 2000);
    }
  };

  const handleMatchSelect = (match: any) => {
    setSelectedMatch(match);
    setCurrentStep('chat');
  };

  const handleConfirmJourney = () => {
    setCurrentStep('confirmed');
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        type: 'sent',
        content: newMessage.trim(),
        timestamp: Date.now()
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const resetModal = () => {
    setCurrentStep('form');
    setJourneyRequest({
      type: 'shared',
      departure: { address: '' },
      destination: { address: '' },
      estimatedDepartureTime: '',
      transportMode: 'walking',
      description: ''
    });
    setSelectedMatch(null);
    setShowDepartureSuggestions(false);
    setShowDestinationSuggestions(false);
    setShowTimeSelector(false);
    setNewMessage('');
    onClose();
  };

  const renderForm = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Nouveau trajet partagé</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Point de départ</Text>
        <View style={styles.inputContainer}>
          <MapPin size={20} color={Colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Adresse de départ"
            value={journeyRequest.departure?.address}
            onChangeText={handleDepartureChange}
            onFocus={() => {
              if (journeyRequest.departure?.address && journeyRequest.departure.address.length >= 2) {
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
          <MapPin size={20} color={Colors.warning} />
          <TextInput
            style={styles.input}
            placeholder="Adresse de destination"
            value={journeyRequest.destination?.address}
            onChangeText={handleDestinationChange}
            onFocus={() => {
              if (journeyRequest.destination?.address && journeyRequest.destination.address.length >= 2) {
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
        <Text style={styles.label}>Heure de départ estimée</Text>
        <TouchableOpacity 
          style={styles.timeSelector}
          onPress={() => setShowTimeSelector(!showTimeSelector)}
        >
          <Clock size={20} color={Colors.primary} />
          <Text style={[styles.timeSelectorText, !journeyRequest.estimatedDepartureTime && styles.placeholder]}>
            {journeyRequest.estimatedDepartureTime || 'Sélectionner une heure'}
          </Text>
          <ChevronDown size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        {showTimeSelector && (
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  journeyRequest.estimatedDepartureTime === time && styles.timeSlotSelected
                ]}
                onPress={() => selectTimeSlot(time)}
              >
                <Text style={[
                  styles.timeSlotText,
                  journeyRequest.estimatedDepartureTime === time && styles.timeSlotTextSelected
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mode de transport</Text>
        <View style={styles.transportModes}>
          {[
            { key: 'walking', label: '🚶‍♀️ Marche', value: 'walking' },
            { key: 'metro', label: '🚇 Métro', value: 'metro' },
            { key: 'rer', label: '🚊 RER', value: 'rer' },
            { key: 'bus', label: '🚌 Bus', value: 'bus' },
            { key: 'tram', label: '🚋 Tramway', value: 'tram' },
            { key: 'taxi', label: '🚕 Taxi', value: 'taxi' }
          ].map((mode) => (
            <TouchableOpacity
              key={mode.key}
              style={[
                styles.transportMode,
                journeyRequest.transportMode === mode.value && styles.transportModeSelected
              ]}
              onPress={() => setJourneyRequest(prev => ({
                ...prev,
                transportMode: mode.value as any
              }))}
            >
              <Text style={[
                styles.transportModeText,
                journeyRequest.transportMode === mode.value && styles.transportModeTextSelected
              ]}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description (optionnel)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Ex: je pars du métro Jaurès vers République si jamais tu es dans le coin"
          value={journeyRequest.description}
          onChangeText={(text) => setJourneyRequest(prev => ({
            ...prev,
            description: text
          }))}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity 
        style={[
          styles.submitButton,
          {opacity: journeyRequest.departure?.address && journeyRequest.destination?.address && journeyRequest.estimatedDepartureTime ? 1 : 0.6}
        ]}
        disabled={!journeyRequest.departure?.address || !journeyRequest.destination?.address || !journeyRequest.estimatedDepartureTime}
        onPress={handleFormSubmit}
      >
        <Users size={20} color={Colors.white} />
        <Text style={styles.submitButtonText}>Rechercher des partenaires</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderMatching = () => (
    <View style={styles.matchingContainer}>
      <View style={styles.matchingAnimation}>
        <Text style={styles.matchingEmoji}>🔍</Text>
      </View>
      <Text style={styles.matchingTitle}>Recherche en cours...</Text>
      <Text style={styles.matchingDescription}>
        Nous recherchons des utilisatrices avec des trajets similaires dans votre créneau horaire.
      </Text>
      <View style={styles.matchingDetails}>
        <Text style={styles.matchingDetail}>📍 {journeyRequest.departure?.address}</Text>
        <Text style={styles.matchingDetail}>📍 {journeyRequest.destination?.address}</Text>
        <Text style={styles.matchingDetail}>🕐 {journeyRequest.estimatedDepartureTime}</Text>
      </View>
    </View>
  );

  const renderMatches = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Partenaires trouvées</Text>
      <Text style={styles.matchesDescription}>
        {matches.length} utilisatrices avec des trajets compatibles
      </Text>

      {matches.map((match) => (
        <TouchableOpacity
          key={match.id}
          style={styles.matchCard}
          onPress={() => handleMatchSelect(match)}
        >
          <View style={styles.matchHeader}>
            <View style={styles.matchUser}>
              <View style={styles.matchAvatar}>
                <Text style={styles.matchAvatarText}>
                  {match.user.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.matchUserInfo}>
                <Text style={styles.matchUserName}>{match.user.name}</Text>
                <Text style={styles.matchUserCity}>{match.user.city}</Text>
              </View>
            </View>
            <View style={styles.compatibilityContainer}>
              <View style={styles.compatibilityBadge}>
                <Text style={styles.compatibilityText}>{match.compatibility}%</Text>
              </View>
              <Text style={styles.compatibilityLabel}>compatibilité</Text>
            </View>
          </View>

          <View style={styles.matchDetails}>
            <Text style={styles.matchRoute}>{match.route}</Text>
            <Text style={styles.matchTime}>Départ: {match.departureTime}</Text>
            {match.description && (
              <Text style={styles.matchDescription}>{match.description}</Text>
            )}
          </View>

          <View style={styles.matchActions}>
            <TouchableOpacity style={styles.chatButton}>
              <MessageSquare size={16} color={Colors.primary} />
              <Text style={styles.chatButtonText}>Discuter</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.noMatchButton}>
        <Text style={styles.noMatchButtonText}>
          Aucune correspondance ? Publier mon trajet et attendre
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderChat = () => (
    <View style={styles.chatContainer}>
      <View style={styles.chatHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentStep('matches')}
        >
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <View style={styles.chatUserInfo}>
          <Text style={styles.chatUserName}>{selectedMatch?.user.name}</Text>
          <Text style={styles.chatUserCity}>{selectedMatch?.user.city}</Text>
        </View>
      </View>

      <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
        {chatMessages.map((message) => (
          <View key={message.id}>
            {message.type === 'system' && (
              <View style={styles.systemMessage}>
                <Text style={styles.systemMessageText}>
                  {message.content.replace('{name}', selectedMatch?.user.name || '')}
                </Text>
              </View>
            )}
            
            {message.type === 'received' && (
              <View style={styles.messageReceived}>
                <Text style={styles.messageText}>{message.content}</Text>
                <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
              </View>
            )}
            
            {message.type === 'sent' && (
              <View style={styles.messageSent}>
                <Text style={[styles.messageText, styles.messageTextSent]}>{message.content}</Text>
                <Text style={[styles.messageTime, styles.messageTimeSent]}>{formatTime(message.timestamp)}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.chatInputContainer}>
        <View style={styles.chatInput}>
          <TextInput
            style={styles.messageInput}
            placeholder="Votre message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Text style={styles.sendButtonText}>Envoyer</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.confirmJourneyButton}
          onPress={handleConfirmJourney}
        >
          <Text style={styles.confirmJourneyButtonText}>
            Confirmer le trajet avec {selectedMatch?.user.name}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConfirmed = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.confirmedContainer}>
        <Text style={styles.confirmedEmoji}>✅</Text>
        <Text style={styles.confirmedTitle}>Trajet confirmé !</Text>
        <Text style={styles.confirmedDescription}>
          Votre trajet partagé avec {selectedMatch?.user.name} est confirmé.
        </Text>

        <View style={styles.confirmedDetails}>
          <View style={styles.confirmedDetail}>
            <Text style={styles.confirmedDetailLabel}>Partenaire</Text>
            <Text style={styles.confirmedDetailValue}>{selectedMatch?.user.name}</Text>
          </View>
          <View style={styles.confirmedDetail}>
            <Text style={styles.confirmedDetailLabel}>Rendez-vous</Text>
            <Text style={styles.confirmedDetailValue}>Métro République - {journeyRequest.estimatedDepartureTime}</Text>
          </View>
          <View style={styles.confirmedDetail}>
            <Text style={styles.confirmedDetailLabel}>Destination</Text>
            <Text style={styles.confirmedDetailValue}>{journeyRequest.destination?.address}</Text>
          </View>
        </View>

        <View style={styles.securityFeatures}>
          <Text style={styles.securityTitle}>🛡️ Sécurité activée</Text>
          <Text style={styles.securityFeature}>• Localisation partagée entre vous</Text>
          <Text style={styles.securityFeature}>• Timer automatique d'arrivée</Text>
          <Text style={styles.securityFeature}>• Contacts d'urgence notifiés</Text>
        </View>

        <TouchableOpacity 
          style={styles.startJourneyButton}
          onPress={resetModal}
        >
          <Text style={styles.startJourneyButtonText}>Démarrer le trajet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const getStepContent = () => {
    switch (currentStep) {
      case 'form':
        return renderForm();
      case 'matching':
        return renderMatching();
      case 'matches':
        return renderMatches();
      case 'chat':
        return renderChat();
      case 'confirmed':
        return renderConfirmed();
      default:
        return renderForm();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={resetModal}
    >
      <View style={styles.modalContainer}>
        <View style={[
          styles.modalContent,
          currentStep === 'chat' && styles.modalContentChat
        ]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {currentStep === 'form' && 'Trajet partagé'}
              {currentStep === 'matching' && 'Recherche'}
              {currentStep === 'matches' && 'Correspondances'}
              {currentStep === 'chat' && 'Discussion'}
              {currentStep === 'confirmed' && 'Confirmé'}
            </Text>
            <TouchableOpacity onPress={resetModal} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          {getStepContent()}
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
    minHeight: '50%',
  },
  modalContentChat: {
    maxHeight: '95%',
    minHeight: '80%',
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
  stepTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 16,
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
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
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
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeSelectorText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  placeholder: {
    color: Colors.textSecondary,
  },
  timeGrid: {
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
  timeSlot: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: (screenWidth - 120) / 4 - 8, // Responsive width
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: Colors.primary,
  },
  timeSlotText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  timeSlotTextSelected: {
    color: Colors.white,
  },
  transportModes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  transportMode: {
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: (screenWidth - 80) / 2 - 8, // Responsive width
    alignItems: 'center',
  },
  transportModeSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  transportModeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  transportModeTextSelected: {
    color: Colors.white,
  },
  textArea: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  matchingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  matchingAnimation: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  matchingEmoji: {
    fontSize: 32,
  },
  matchingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  matchingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  matchingDetails: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  matchingDetail: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  matchesDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  matchCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  matchUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  matchAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  matchAvatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  matchUserInfo: {
    flex: 1,
  },
  matchUserName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  matchUserCity: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  compatibilityContainer: {
    alignItems: 'center',
    minWidth: 60,
  },
  compatibilityBadge: {
    backgroundColor: Colors.success,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  compatibilityText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: Colors.white,
  },
  compatibilityLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  matchDetails: {
    marginBottom: 12,
  },
  matchRoute: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  matchTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  matchDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    fontStyle: 'italic',
  },
  matchActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chatButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
  },
  noMatchButton: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  noMatchButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    minHeight: screenHeight * 0.6, // Minimum 60% de la hauteur d'écran
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
  },
  chatUserInfo: {
    flex: 1,
  },
  chatUserName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  chatUserCity: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  chatMessages: {
    flex: 1,
    marginBottom: 20,
    minHeight: screenHeight * 0.35, // Minimum 35% de la hauteur d'écran pour les messages
  },
  systemMessage: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignSelf: 'center',
  },
  systemMessageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  messageReceived: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageSent: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
    marginBottom: 8,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 22,
  },
  messageTextSent: {
    color: Colors.white,
  },
  messageTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  messageTimeSent: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chatInputContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: 16,
    minHeight: 120, // Hauteur minimale pour la zone de saisie
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  messageInput: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
    minHeight: 44,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  sendButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  confirmJourneyButton: {
    backgroundColor: Colors.success,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmJourneyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  confirmedContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  confirmedEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  confirmedTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  confirmedDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  confirmedDetails: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  confirmedDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  confirmedDetailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  confirmedDetailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  securityFeatures: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  securityTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  securityFeature: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  startJourneyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  startJourneyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
});