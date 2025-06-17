import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X, MapPin, Shield, CircleCheck as CheckCircle, MessageSquare, UserPlus, UserCheck, Calendar, Users, Heart } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { SafeMate } from '@/types/database';
import { useUser } from '@/hooks/useUser';

interface SafeMateProfileModalProps {
  visible: boolean;
  onClose: () => void;
  safeMate: SafeMate;
  onConnect?: () => void;
  onMessage?: () => void;
}

export function SafeMateProfileModal({ visible, onClose, safeMate, onConnect, onMessage }: SafeMateProfileModalProps) {
  const { user, addSafeMate } = useUser();
  const [isConnecting, setIsConnecting] = useState(false);

  const formatJoinDate = (timestamp?: number) => {
    if (!timestamp) return 'Récemment';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `Membre depuis ${diffDays} jours`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return `Membre depuis ${diffMonths} mois`;
    }
  };

  const formatLastSeen = (timestamp?: number) => {
    if (!timestamp) return 'Jamais vue';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 5) {
      return 'En ligne';
    } else if (minutes < 60) {
      return `Active il y a ${minutes} min`;
    } else if (hours < 24) {
      return `Active il y a ${hours}h`;
    } else {
      return `Active il y a ${days}j`;
    }
  };

  const handleConnect = async () => {
    if (onConnect) {
      setIsConnecting(true);
      // Simuler une requête de connexion
      setTimeout(() => {
        onConnect();
        addSafeMate(safeMate.id);
        setIsConnecting(false);
      }, 1000);
    }
  };

  const isVerified = safeMate.safetyScore && safeMate.safetyScore >= 90;
  const isConnected = user?.safeMates?.includes(safeMate.id);
  const canConnect = safeMate.status === 'pending' && !isConnected;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Photo de profil et infos principales */}
            <View style={styles.profileHeader}>
              <Image source={{ uri: safeMate.avatar }} style={styles.profileImage} />
              
              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.profileName}>{safeMate.name}</Text>
                  {isVerified && (
                    <View style={styles.verifiedBadge}>
                      <CheckCircle size={20} color={Colors.success} fill={Colors.success} />
                    </View>
                  )}
                </View>
                
                <View style={styles.locationRow}>
                  <MapPin size={16} color={Colors.textSecondary} />
                  <Text style={styles.location}>{safeMate.city} • {safeMate.age} ans</Text>
                </View>
                
                <View style={styles.statusRow}>
                  <View style={[
                    styles.statusDot, 
                    { backgroundColor: safeMate.lastSeen && (Date.now() - safeMate.lastSeen) < 300000 ? Colors.success : Colors.gray }
                  ]} />
                  <Text style={styles.lastSeen}>{formatLastSeen(safeMate.lastSeen)}</Text>
                </View>
              </View>
            </View>

            {/* Statut de vérification */}
            <View style={styles.verificationSection}>
              <View style={styles.verificationCard}>
                <Shield size={24} color={isVerified ? Colors.success : Colors.gray} />
                <View style={styles.verificationInfo}>
                  <Text style={[styles.verificationStatus, { color: isVerified ? Colors.success : Colors.gray }]}>
                    {isVerified ? 'Profil vérifié' : 'Non vérifié'}
                  </Text>
                  <Text style={styles.verificationLabel}>Statut de vérification</Text>
                </View>
              </View>
            </View>

            {/* Bio */}
            {safeMate.bio && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>À propos</Text>
                <Text style={styles.bio}>{safeMate.bio}</Text>
              </View>
            )}

            {/* Centres d'intérêt */}
            {safeMate.interests && safeMate.interests.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Centres d'intérêt</Text>
                <View style={styles.interestsContainer}>
                  {safeMate.interests.map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Statistiques */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statistiques</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Users size={20} color={Colors.primary} />
                  <Text style={styles.statValue}>{safeMate.mutualFriends}</Text>
                  <Text style={styles.statLabel}>Amies communes</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Calendar size={20} color={Colors.primary} />
                  <Text style={styles.statLabel}>{formatJoinDate(safeMate.connectedSince)}</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Heart size={20} color={Colors.primary} />
                  <Text style={styles.statValue}>4.8</Text>
                  <Text style={styles.statLabel}>Note communauté</Text>
                </View>
              </View>
            </View>

            {/* Badges de sécurité */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sécurité</Text>
              <View style={styles.securityBadges}>
                {isVerified && (
                  <View style={styles.securityBadge}>
                    <CheckCircle size={16} color={Colors.success} />
                    <Text style={styles.securityBadgeText}>Identité vérifiée</Text>
                  </View>
                )}
                
                <View style={styles.securityBadge}>
                  <Shield size={16} color={Colors.primary} />
                  <Text style={styles.securityBadgeText}>Membre actif</Text>
                </View>
                
                {safeMate.mutualFriends > 0 && (
                  <View style={styles.securityBadge}>
                    <Users size={16} color={Colors.warning} />
                    <Text style={styles.securityBadgeText}>Réseau commun</Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            {canConnect ? (
              <TouchableOpacity 
                style={[styles.connectButton, isConnecting && styles.connectButtonLoading]}
                onPress={handleConnect}
                disabled={isConnecting}
              >
                <UserPlus size={20} color={Colors.white} />
                <Text style={styles.connectButtonText}>
                  {isConnecting ? 'Connexion...' : 'Se connecter'}
                </Text>
              </TouchableOpacity>
            ) : isConnected ? (
              <>
                <TouchableOpacity style={styles.messageButton} onPress={onMessage}>
                  <MessageSquare size={20} color={Colors.primary} />
                  <Text style={styles.messageButtonText}>Envoyer un message</Text>
                </TouchableOpacity>
                
                <View style={styles.connectedIndicator}>
                  <UserCheck size={20} color={Colors.success} />
                  <Text style={styles.connectedText}>Connectées</Text>
                </View>
              </>
            ) : (
              <View style={styles.pendingIndicator}>
                <Text style={styles.pendingText}>Demande en attente</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 0,
  },
  closeButton: {
    padding: 8,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.textPrimary,
    marginRight: 8,
  },
  verifiedBadge: {
    
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  lastSeen: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  verificationSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  verificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 16,
  },
  verificationInfo: {
    marginLeft: 12,
  },
  verificationStatus: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  verificationLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  bio: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  interestText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  securityBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  securityBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.textPrimary,
    marginLeft: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    gap: 12,
  },
  connectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
  },
  connectButtonLoading: {
    opacity: 0.7,
  },
  connectButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingVertical: 16,
  },
  messageButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
  connectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  connectedText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.success,
    marginLeft: 8,
  },
  pendingIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingVertical: 16,
  },
  pendingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
  },
});