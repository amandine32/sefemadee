import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useUser } from '@/hooks/useUser';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Shield, Bell, ChevronDown, ChevronUp, Phone, Lightbulb, Chrome as Home } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { ActionButton } from '@/components/ActionButton';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { JourneyTypeModal } from '@/components/modals/JourneyTypeModal';
import { JourneyModal } from '@/components/modals/JourneyModal';
import { SharedJourneyModal } from '@/components/modals/SharedJourneyModal';
import { DangerModal } from '@/components/modals/DangerModal';
import { AlertModal } from '@/components/modals/AlertModal';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isExpanded: boolean;
}

interface EmergencyNumber {
  id: string;
  number: string;
  label: string;
  description: string;
}

export default function HomeScreen() {
  const { user } = useUser();
  const [journeyTypeModalVisible, setJourneyTypeModalVisible] = useState(false);
  const [soloJourneyModalVisible, setSoloJourneyModalVisible] = useState(false);
  const [sharedJourneyModalVisible, setSharedJourneyModalVisible] = useState(false);
  const [dangerModalVisible, setDangerModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  
  const emergencyNumbers: EmergencyNumber[] = [
    {
      id: '1',
      number: '17',
      label: 'Police',
      description: 'Police / Gendarmerie'
    },
    {
      id: '2',
      number: '15',
      label: 'SAMU',
      description: 'Urgences médicales'
    },
    {
      id: '3',
      number: '18',
      label: 'Pompiers',
      description: 'Secours incendie'
    },
    {
      id: '4',
      number: '112',
      label: 'Urgence EU',
      description: 'Numéro européen'
    },
    {
      id: '5',
      number: '3919',
      label: 'Violences',
      description: 'Femmes Info'
    }
  ];
  
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      id: '1',
      question: "J'ai été victime d'une agression, que faire ?",
      answer: "Si tu es en sécurité, essaye de noter ce que tu as vu ou entendu.\n\nAppelle le 17 (Police) ou le 112.\n\nParle à un proche ou à une association.\n\nTu peux aussi porter plainte ou faire une main courante.\n\n👉 Plus d'infos sur notre site.",
      isExpanded: false
    },
    {
      id: '2',
      question: "Quelle est la différence entre une plainte et une main courante ?",
      answer: "• Plainte = poursuites possibles contre l'agresseur.\n\n• Main courante = déclaration sans poursuites immédiate, mais enregistrée.\n\n👉 Plus d'infos sur notre site.",
      isExpanded: false
    },
    {
      id: '3',
      question: "Je n'ose pas parler, qui peut m'aider ?",
      answer: "Tu peux contacter :\n\n• Le 3919 (écoute gratuite et anonyme)\n\n• Des associations locales\n\n• Une amie de confiance via SafeMate\n\nPlus d'infos sur notre site.",
      isExpanded: false
    },
    {
      id: '4',
      question: "Est-ce que je peux signaler un harcèlement dans la rue ?",
      answer: "Oui. Tu peux appeler la police ou utiliser l'app pour marquer la zone sur la carte.\n\nCela aide les autres femmes à être vigilantes.\n\nPlus d'infos sur notre site.",
      isExpanded: false
    },
    {
      id: '5',
      question: "Est-ce que je peux utiliser un enregistrement vidéo ou audio comme preuve ?",
      answer: "Oui dans certains cas, surtout si cela prouve une agression.\n\nPlus d'infos sur notre site.",
      isExpanded: false
    }
  ]);

  const getDisplayName = () => {
    if (!user) return 'utilisatrice';
    if (user.anonymat) {
      return user.pseudo.charAt(0).toUpperCase();
    }
    return user.pseudo;
  };

  const toggleFAQ = (id: string) => {
    setFaqItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, isExpanded: !item.isExpanded }
          : item
      )
    );
  };

  const handleEmergencyCall = (number: string) => {
    const phoneNumber = Platform.OS === 'web' ? `tel:${number}` : `tel:${number}`;
    
    if (Platform.OS === 'web') {
      // Sur web, ouvrir dans un nouvel onglet ou utiliser le protocole tel:
      window.open(phoneNumber, '_self');
    } else {
      // Sur mobile, utiliser Linking pour composer le numéro
      Linking.openURL(phoneNumber).catch(err => {
        console.error('Erreur lors de l\'ouverture du numéro:', err);
      });
    }
  };

  const handlePhoneNumberPress = (number: string) => {
    handleEmergencyCall(number);
  };

  const handleJourneyTypeSelect = (type: 'solo' | 'shared') => {
    setJourneyTypeModalVisible(false);
    if (type === 'solo') {
      setSoloJourneyModalVisible(true);
    } else {
      setSharedJourneyModalVisible(true);
    }
  };

  // Fonction pour rendre le texte avec les numéros cliquables
  const renderTextWithClickableNumbers = (text: string) => {
    // Regex pour détecter les numéros de téléphone (2-5 chiffres)
    const phoneRegex = /\b(\d{2,5})\b/g;
    const parts = text.split(phoneRegex);
    
    return (
      <Text style={styles.faqAnswerText}>
        {parts.map((part, index) => {
          // Vérifier si c'est un numéro de téléphone valide
          if (phoneRegex.test(part) && (part === '17' || part === '15' || part === '18' || part === '112' || part === '3919')) {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handlePhoneNumberPress(part)}
                style={styles.phoneNumberButton}
              >
                <Text style={styles.phoneNumberText}>{part}</Text>
              </TouchableOpacity>
            );
          }
          return <Text key={index}>{part}</Text>;
        })}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.welcomeText}>Bonjour,</Text>
            <Text style={styles.userName}>{getDisplayName()}</Text>
          </View>
          <ProfileAvatar size={50} />
        </View>

        <View style={styles.safetyStatus}>
          <View style={styles.statusIndicator}>
            <View style={[styles.indicatorDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.statusText}>Environnement sécurisé</Text>
          </View>
          <Text style={styles.statusDescription}>
            Aucun signalement récent dans votre zone
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Actions rapides</Text>
        
        <View style={styles.actionButtons}>
          <ActionButton 
            title="Lancer un trajet sécurisé"
            icon={<MapPin color={Colors.white} size={24} />}
            color={Colors.primary}
            onPress={() => setJourneyTypeModalVisible(true)}
          />
          
          <ActionButton 
            title="Signaler un danger"
            icon={<Shield color={Colors.white} size={24} />}
            color={Colors.warning}
            onPress={() => setDangerModalVisible(true)}
          />
          
          <ActionButton 
            title="Déclencher une alerte"
            icon={<Bell color={Colors.white} size={24} />}
            color={Colors.danger}
            onPress={() => setAlertModalVisible(true)}
          />
        </View>

        <Text style={styles.sectionTitle}>Numéros d'urgence</Text>
        
        <View style={styles.emergencyNumbersContainer}>
          {emergencyNumbers.map((emergency) => (
            <TouchableOpacity
              key={emergency.id}
              style={styles.emergencyButton}
              onPress={() => handleEmergencyCall(emergency.number)}
              activeOpacity={0.8}
            >
              <View style={styles.emergencyButtonContent}>
                <Phone size={20} color={Colors.danger} />
                <View style={styles.emergencyButtonText}>
                  <Text style={styles.emergencyNumber}>{emergency.number}</Text>
                  <Text style={styles.emergencyLabel}>{emergency.label}</Text>
                </View>
              </View>
              <Text style={styles.emergencyDescription}>{emergency.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.safetyTipsCard}>
          <View style={styles.safetyTipsHeader}>
            <Lightbulb size={24} color={Colors.primary} />
            <Text style={styles.safetyTipsTitle}>
              Questions fréquentes
            </Text>
          </View>
          
          <Text style={styles.safetyTipsDescription}>
            Retrouvez ici les informations essentielles pour votre sécurité.
          </Text>
          
          <View style={styles.faqContainer}>
            {faqItems.map((item) => (
              <View key={item.id} style={styles.faqItem}>
                <TouchableOpacity 
                  style={styles.faqQuestion}
                  onPress={() => toggleFAQ(item.id)}
                >
                  <Text style={styles.faqQuestionText}>
                    {item.question}
                  </Text>
                  {item.isExpanded ? (
                    <ChevronUp size={20} color={Colors.primary} />
                  ) : (
                    <ChevronDown size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
                
                {item.isExpanded && (
                  <View style={styles.faqAnswer}>
                    {renderTextWithClickableNumbers(item.answer)}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <JourneyTypeModal 
        visible={journeyTypeModalVisible} 
        onClose={() => setJourneyTypeModalVisible(false)}
        onSelectType={handleJourneyTypeSelect}
      />

      <JourneyModal 
        visible={soloJourneyModalVisible} 
        onClose={() => setSoloJourneyModalVisible(false)} 
      />

      <SharedJourneyModal 
        visible={sharedJourneyModalVisible} 
        onClose={() => setSharedJourneyModalVisible(false)} 
      />
      
      <DangerModal 
        visible={dangerModalVisible} 
        onClose={() => setDangerModalVisible(false)} 
      />
      
      <AlertModal 
        visible={alertModalVisible} 
        onClose={() => setAlertModalVisible(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    flexDirection: 'column',
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  safetyStatus: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  indicatorDot: {
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
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  actionButtons: {
    marginBottom: 24,
  },
  emergencyNumbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  emergencyButton: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    backgroundColor: Colors.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  emergencyButtonText: {
    marginLeft: 8,
    flex: 1,
  },
  emergencyNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.danger,
  },
  emergencyLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: Colors.danger,
  },
  emergencyDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: Colors.danger,
    marginTop: 2,
  },
  safetyTipsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  safetyTipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  safetyTipsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  safetyTipsDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  faqContainer: {
    marginBottom: 20,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    marginBottom: 4,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  faqQuestionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingBottom: 16,
    paddingRight: 32,
  },
  faqAnswerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  phoneNumberButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  phoneNumberText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
});