import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Colors from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';

interface ProfileAvatarProps {
  size?: number;
  showName?: boolean;
  style?: any;
}

export function ProfileAvatar({ size = 48, showName = false, style }: ProfileAvatarProps) {
  const { user } = useUser();

  if (!user) return null;

  const getDisplayName = () => {
    if (user.anonymat) {
      return user.pseudo.charAt(0).toUpperCase();
    }
    return user.pseudo;
  };

  const getInitial = () => {
    return user.pseudo.charAt(0).toUpperCase();
  };

  return (
    <View style={[styles.container, style]}>
      {user.anonymat ? (
        <View style={[styles.anonymousAvatar, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={[styles.initialText, { fontSize: size * 0.4 }]}>
            {getInitial()}
          </Text>
        </View>
      ) : (
        <Image 
          source={{ uri: user.avatar }}
          style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]} 
        />
      )}
      
      {showName && (
        <Text style={styles.nameText}>
          {getDisplayName()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatar: {
    // Dynamic styles applied inline
  },
  anonymousAvatar: {
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray,
  },
  initialText: {
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
  },
  nameText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.textPrimary,
    marginTop: 4,
    textAlign: 'center',
  },
});