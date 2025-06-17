import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { X, MapPin, Camera, TriangleAlert as AlertTriangle, ChevronDown } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface DangerModalProps {
  visible: boolean;
  onClose: () => void;
}

const dangerOptions = [
  'Harcèlement de rue',
  'Agression physique',
  'Agression verbale',
  'Vol / Tentative de vol',
  'Exhibitionnisme',
  'Suivie / Filature',
  'Éclairage défaillant',
  'Zone mal fréquentée',
  'Groupe d\'hommes menaçants',
  'Comportement suspect',
  'Insécurité générale',
  'Autre'
];

export function DangerModal({ visible, onClose }: DangerModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [customDescription, setCustomDescription] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handleSubmit = () => {
    const description = selectedOption === 'Autre' ? customDescription : selectedOption;
    
    if (description.trim()) {
      // In a real app, this would submit the report to the database
      console.log({
        description,
        riskLevel,
        location: 'Current location', // Would use actual coordinates in a real app
        timestamp: Date.now(),
        imageUrl: selectedImage
      });
      
      setSelectedOption('');
      setCustomDescription('');
      setSelectedImage(null);
      setShowDropdown(false);
      onClose();
    }
  };

  const handleAddPhoto = () => {
    // In a real app, this would open camera or photo library
    // For demo purposes, we'll use a placeholder image
    const demoImages = [
      'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ];
    
    const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
    setSelectedImage(randomImage);
  };

  const removePhoto = () => {
    setSelectedImage(null);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowDropdown(false);
    if (option !== 'Autre') {
      setCustomDescription('');
    }
  };

  const canSubmit = () => {
    if (selectedOption === 'Autre') {
      return customDescription.trim().length > 0;
    }
    return selectedOption.length > 0;
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Signaler un danger</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.locationContainer}>
              <View style={styles.locationHeader}>
                <Text style={styles.sectionTitle}>Localisation</Text>
                <TouchableOpacity style={styles.currentLocationButton}>
                  <MapPin size={16} color={Colors.primary} />
                  <Text style={styles.currentLocationText}>Position actuelle</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.locationPreview}>
                <Text style={styles.locationText}>75 rue de Rivoli, Paris</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Type de danger</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text style={[
                styles.dropdownButtonText,
                !selectedOption && styles.placeholder
              ]}>
                {selectedOption || 'Sélectionner le type de danger'}
              </Text>
              <ChevronDown 
                size={20} 
                color={Colors.textSecondary}
                style={[styles.chevron, showDropdown && styles.chevronRotated]}
              />
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdownContainer}>
                <ScrollView style={styles.optionsList} nestedScrollEnabled>
                  {dangerOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionItem,
                        selectedOption === option && styles.selectedOption
                      ]}
                      onPress={() => handleOptionSelect(option)}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedOption === option && styles.selectedOptionText
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {selectedOption === 'Autre' && (
              <View style={styles.customDescriptionContainer}>
                <Text style={styles.sectionTitle}>Précisez le danger</Text>
                <TextInput
                  style={styles.customDescriptionInput}
                  placeholder="Décrivez la situation..."
                  value={customDescription}
                  onChangeText={setCustomDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            )}
            
            <Text style={styles.sectionTitle}>Niveau de risque</Text>
            <View style={styles.riskLevelContainer}>
              <TouchableOpacity 
                style={[
                  styles.riskLevelButton, 
                  riskLevel === 'low' && styles.selectedRiskButton,
                  { borderColor: Colors.low, backgroundColor: riskLevel === 'low' ? Colors.low : 'transparent' }
                ]}
                onPress={() => setRiskLevel('low')}
              >
                <Text 
                  style={[
                    styles.riskLevelText, 
                    { color: riskLevel === 'low' ? Colors.white : Colors.low }
                  ]}
                >
                  Faible
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.riskLevelButton, 
                  riskLevel === 'medium' && styles.selectedRiskButton,
                  { borderColor: Colors.warning, backgroundColor: riskLevel === 'medium' ? Colors.warning : 'transparent' }
                ]}
                onPress={() => setRiskLevel('medium')}
              >
                <Text 
                  style={[
                    styles.riskLevelText, 
                    { color: riskLevel === 'medium' ? Colors.white : Colors.warning }
                  ]}
                >
                  Moyen
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.riskLevelButton, 
                  riskLevel === 'high' && styles.selectedRiskButton,
                  { borderColor: Colors.danger, backgroundColor: riskLevel === 'high' ? Colors.danger : 'transparent' }
                ]}
                onPress={() => setRiskLevel('high')}
              >
                <Text 
                  style={[
                    styles.riskLevelText, 
                    { color: riskLevel === 'high' ? Colors.white : Colors.danger }
                  ]}
                >
                  Élevé
                </Text>
              </TouchableOpacity>
            </View>
            
            {selectedImage ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: selectedImage }} style={styles.selectedPhoto} />
                <TouchableOpacity style={styles.removePhotoButton} onPress={removePhoto}>
                  <X size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
                <Camera size={20} color={Colors.primary} />
                <Text style={styles.addPhotoText}>Ajouter une photo</Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.noteContainer}>
              <AlertTriangle size={20} color={Colors.textSecondary} />
              <Text style={styles.noteText}>
                Les signalements sont anonymes et visibles par les utilisatrices pendant 24h.
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.submitButton,
                {opacity: canSubmit() ? 1 : 0.6}
              ]}
              disabled={!canSubmit()}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Signaler</Text>
            </TouchableOpacity>
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
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  locationContainer: {
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLocationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
  },
  locationPreview: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  dropdownButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  placeholder: {
    color: Colors.textSecondary,
  },
  chevron: {
    marginLeft: 8,
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    maxHeight: 200,
  },
  optionsList: {
    maxHeight: 200,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  selectedOptionText: {
    color: Colors.white,
    fontFamily: 'Inter-SemiBold',
  },
  customDescriptionContainer: {
    marginBottom: 24,
  },
  customDescriptionInput: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  riskLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  riskLevelButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedRiskButton: {
    // Background color is set dynamically in the component
  },
  riskLevelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  selectedPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removePhotoButton: {
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
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
  },
  addPhotoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  noteText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
});