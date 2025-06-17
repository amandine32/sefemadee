import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { MessageSquare, UserPlus, UserCheck, Clock, MapPin, Shield, CircleCheck as CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { SafeMate } from '@/types/database';
import { SafeMateProfileModal } from './SafeMateProfileModal';

interface SafeMateCardProps {
  safeMate: SafeMate;
  onConnect?: () => void;
  onMessage?: () => void;
  showActions?: boolean;
}

export function SafeMateCard({ safeMate, onConnect, onMessage, showActions = true }: SafeMateCardProps) {
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const formatLastSeen = (timestamp?: number) => {
    if (!timestamp) return 'Jamais vue';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
      return `Active il y a ${minutes} min`;
    } else if (hours < 24) {
      return `Active il y a ${hours}h`;
    } else {
      return `Active il y a ${days}j`;
    }
  };

  const formatConnectedSince = (timestamp?: number) => {
    if (!timestamp) return '';
    
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / 86400000);
    
    if (days < 30) {
      return `Connectées depuis ${days} jours`;
    } else {
      const months = Math.floor(days / 30);
      return `Connectées depuis ${months} mois`;
    }
  };

  const isVerified = safeMate.safetyScore && safeMate.safetyScore >= 90;

  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={() => setProfileModalVisible(true)}
        activeOpacity={0.9}
      >
        <View style={styles.header}>
          <Image source={{ uri: safeMate.avatar }} style={styles.avatar} />
          
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{safeMate.name}</Text>
              <View style={styles.badgesRow}>
                {isVerified && (
                  <View style={styles.verifiedBadge}>
                    <CheckCircle size={14} color={Colors.success} fill={Colors.success} />
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.locationRow}>
              <MapPin size={14} color={Colors.textSecondary} />
              <Text style={styles.location}>{safeMate.city} • {safeMate.age} ans</Text>
            </View>
            
            {safeMate.status === 'accepted' && safeMate.lastSeen && (
              <View style={styles.statusRow}>
                <Clock size={14} color={Colors.textSecondary} />
                <Text style={styles.lastSeen}>{formatLastSeen(safeMate.lastSeen)}</Text>
              </View>
            )}
          </View>
        </View>

        {safeMate.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {safeMate.bio}
          </Text>
        )}

        {safeMate.interests && safeMate.interests.length > 0 && (
          <View style={styles.interestsContainer}>
            {safeMate.interests.slice(0, 3).map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
            {safeMate.interests.length > 3 && (
              <Text style={styles.moreInterests}>+{safeMate.interests.length - 3}</Text>
            )}
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{safeMate.mutualFriends}</Text>
            <Text style={styles.statLabel}>Amies communes</Text>
          </View>
          
          <View style={styles.stat}>
            <View style={styles.verificationStatus}>
              <Shield size={16} color={isVerified ? Colors.success : Colors.gray} />
              <Text style={[styles.verificationText, { color: isVerified ? Colors.success : Colors.gray }]}>
                {isVerified ? 'Vérifié' : 'Non vérifié'}
              </Text>
            </View>
          </View>
          
          {safeMate.status === 'accepted' && safeMate.connectedSince && (
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{formatConnectedSince(safeMate.connectedSince)}</Text>
            </View>
          )}
        </View>

        {showActions && (
          <View style={styles.actions}>
            {safeMate.status === 'pending' ? (
              <TouchableOpacity 
                style={styles.connectButton} 
                onPress={(e) => {
                  e.stopPropagation();
                  onConnect?.();
                }}
              >
                <UserPlus size={16} color={Colors.white} />
                <Text style={styles.connectButtonText}>Se connecter</Text>
              </TouchableOpacity>
            ) : safeMate.status === 'accepted' ? (
              <>
                <TouchableOpacity 
                  style={styles.messageButton} 
                  onPress={(e) => {
                    e.stopPropagation();
                    onMessage?.();
                  }}
                >
                  <MessageSquare size={16} color={Colors.primary} />
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
                
                <View style={styles.connectedIndicator}>
                  <UserCheck size={16} color={Colors.success} />
                  <Text style={styles.connectedText}>Connectées</Text>
                </View>
              </>
            ) : null}
          </View>
        )}
      </TouchableOpacity>

      <SafeMateProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        safeMate={safeMate}
        onConnect={onConnect}
        onMessage={onMessage}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedBadge: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastSeen: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  bio: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  interestTag: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  interestText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.textPrimary,
  },
  moreInterests: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.textSecondary,
    alignSelf: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: 'center',
  },
  connectButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.white,
    marginLeft: 6,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  messageButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 6,
  },
  connectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.success,
    marginLeft: 4,
  },
});