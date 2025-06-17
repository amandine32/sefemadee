import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search, Plus, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { MapScreen } from '@/components/MapScreen';
import { ReportDangerForm } from '@/components/ReportDangerForm';
import { useMockData } from '@/hooks/useMockData';

export default function MapTab() {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { dangerReports } = useMockData();
  
  const highRiskCount = dangerReports.filter(report => report.riskLevel === 'high').length;
  const mediumRiskCount = dangerReports.filter(report => report.riskLevel === 'medium').length;
  const lowRiskCount = dangerReports.filter(report => report.riskLevel === 'low').length;

  // Adresses parisiennes réalistes pour chaque rapport
  const parisianAddresses = [
    'Métro Châtelet-Les Halles, Paris 1er',
    'Boulevard Saint-Germain, Paris 6ème',
    'Place de la République, Paris 11ème',
    'Rue de Rivoli, Paris 4ème',
    'Gare du Nord, Paris 10ème',
    'Place de la Bastille, Paris 12ème',
    'Montmartre, Paris 18ème',
    'Quartier Latin, Paris 5ème'
  ];

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) {
      return `${minutes} min ago`;
    }
    return `${hours}h ago`;
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return Colors.danger;
      case 'medium':
        return Colors.warning;
      case 'low':
        return Colors.low;
      default:
        return Colors.low;
    }
  };

  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Safety Map</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search locations"
          placeholderTextColor={Colors.textSecondary}
        />
      </View>
      
      <View style={styles.mapContainer}>
        <MapScreen dangerReports={dangerReports} />
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.danger }]} />
          <Text style={styles.legendText}>High Risk</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
          <Text style={styles.legendText}>Medium Risk</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.low }]} />
          <Text style={styles.legendText}>Low Risk</Text>
        </View>
      </View>

      <View style={styles.alertsContainer}>
        <View style={styles.alertsHeader}>
          <Text style={styles.alertsTitle}>Recent Alerts</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Plus size={20} color={Colors.white} />
            <Text style={styles.addButtonText}>Add Alert</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.alertsList}>
          {dangerReports
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((report, index) => (
              <View key={report.id} style={styles.alertItemContainer}>
                <View 
                  style={[
                    styles.alertSidebar,
                    { backgroundColor: getRiskColor(report.riskLevel) }
                  ]} 
                />
                <View style={styles.alertItem}>
                  <View style={styles.alertHeader}>
                    <Text style={styles.alertTitle}>
                      {report.description}
                    </Text>
                    <View style={[
                      styles.riskBadge,
                      { backgroundColor: getRiskColor(report.riskLevel) }
                    ]}>
                      <Text style={styles.riskText}>
                        {report.riskLevel.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  
                  {report.imageUrl && (
                    <TouchableOpacity onPress={() => handleImagePress(report.imageUrl!)}>
                      <Image 
                        source={{ uri: report.imageUrl }} 
                        style={styles.alertImage} 
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                  
                  <View style={styles.alertFooter}>
                    <Text style={styles.locationText}>
                      {parisianAddresses[index % parisianAddresses.length]}
                    </Text>
                    <Text style={styles.timeText}>
                      {formatTime(report.timestamp)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ReportDangerForm onClose={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal pour agrandir les images */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity 
            style={styles.imageModalOverlay}
            activeOpacity={1}
            onPress={() => setImageModalVisible(false)}
          >
            <View style={styles.imageModalContent}>
              <TouchableOpacity 
                style={styles.closeImageButton}
                onPress={() => setImageModalVisible(false)}
              >
                <X size={24} color={Colors.white} />
              </TouchableOpacity>
              {selectedImage && (
                <Image 
                  source={{ uri: selectedImage }} 
                  style={styles.fullScreenImage} 
                  resizeMode="contain"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F0F4',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 12,
  },
  mapContainer: {
    height: 200,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E8EAF6',
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  alertsContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  alertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.white,
    marginLeft: 8,
  },
  alertsList: {
    flex: 1,
  },
  alertItemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.lightGray,
  },
  alertSidebar: {
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  alertItem: {
    flex: 1,
    padding: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertTitle: {
    flex: 1,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginRight: 12,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  riskText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: Colors.white,
  },
  alertImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
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
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  imageModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  closeImageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  fullScreenImage: {
    width: '90%',
    height: '80%',
  },
});