import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import { X, User, Users, Shield, MapPin } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface JourneyTypeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: 'solo' | 'shared') => void;
}

export function JourneyTypeModal({ visible, onClose, onSelectType }: JourneyTypeModalProps) {
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
            <Text style={styles.modalTitle}>Choisir le type de trajet</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.description}>
            Sélectionnez le type de trajet qui vous convient le mieux.
          </Text>

          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => onSelectType('solo')}
          >
            <View style={styles.optionIcon}>
              <User size={32} color={Colors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Trajet solo</Text>
              <Text style={styles.optionDescription}>
                Voyagez seule avec un suivi sécurisé. Vos contacts de confiance seront notifiés de votre trajet.
              </Text>
              <View style={styles.optionFeatures}>
                <View style={styles.feature}>
                  <Shield size={16} color={Colors.success} />
                  <Text style={styles.featureText}>Suivi GPS en temps réel</Text>
                </View>
                <View style={styles.feature}>
                  <MapPin size={16} color={Colors.success} />
                  <Text style={styles.featureText}>Alerte automatique d'arrivée</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => onSelectType('shared')}
          >
            <View style={styles.optionIcon}>
              <Users size={32} color={Colors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Trajet partagé</Text>
              <Text style={styles.optionDescription}>
                Trouvez une partenaire pour voyager ensemble. Plus de sécurité et de convivialité.
              </Text>
              <View style={styles.optionFeatures}>
                <View style={styles.feature}>
                  <Users size={16} color={Colors.success} />
                  <Text style={styles.featureText}>Matching intelligent</Text>
                </View>
                <View style={styles.feature}>
                  <Shield size={16} color={Colors.success} />
                  <Text style={styles.featureText}>Sécurité renforcée</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
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
    maxHeight: '80%',
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
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  optionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  optionFeatures: {
    gap: 6,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.textPrimary,
    marginLeft: 6,
  },
});