import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { EmergencyModal } from './modals/EmergencyModal';

export function EmergencyButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const pulseAnim = new Animated.Value(1);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.pulseCircle,
            {
              transform: [{ scale: pulseAnim }],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.2],
                outputRange: [0.6, 0],
              }),
            },
          ]}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <AlertTriangle size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <EmergencyModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    right: 24, // Changed from left to right
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  pulseCircle: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.danger,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});