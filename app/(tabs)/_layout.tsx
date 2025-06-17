import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { usePathname } from 'expo-router';
import { Chrome as Home, Map, Users, MessageCircle, User } from 'lucide-react-native';
import { EmergencyButton } from '@/components/EmergencyButton';
import { useUser } from '@/hooks/useUser';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: user?.anonymat ? Colors.danger : Colors.primary,
          tabBarInactiveTintColor: Colors.gray,
          tabBarStyle: [
            styles.tabBar,
            user?.anonymat && styles.anonymousTabBar
          ],
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
          tabBarShowLabel: true,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color, size }) => <Home size={size} strokeWidth={1.5} color={color} />,
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            tabBarIcon: ({ color, size }) => <Map size={size} strokeWidth={1.5} color={color} />,
          }}
        />
        <Tabs.Screen
          name="feed"
          options={{
            title: 'Feed',
            tabBarIcon: ({ color, size }) => <Users size={size} strokeWidth={1.5} color={color} />,
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color, size }) => <MessageCircle size={size} strokeWidth={1.5} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} strokeWidth={1.5} color={color} />,
          }}
        />
      </Tabs>
      {pathname !== '/' && <EmergencyButton />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0.1,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  anonymousTabBar: {
    backgroundColor: '#FFE4E1',
    borderTopColor: '#FFB6C1',
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginBottom: 5,
  },
});