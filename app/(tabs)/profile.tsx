import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight, Shield, LogOut, Users, Bell, Bookmark, History, UserPlus, Search } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';
import { useMockData } from '@/hooks/useMockData';
import { ProfileSection } from '@/components/ProfileSection';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { ContactListModal } from '@/components/modals/ContactListModal';
import { SafeMateCard } from '@/components/SafeMateCard';
import { SavedPostCard } from '@/components/SavedPostCard';
import { PostCard } from '@/components/PostCard';

type ProfileTab = 'safemates' | 'posts' | 'saved' | 'settings';

export default function ProfileScreen() {
  const { user, updateUserSetting, toggleSavedPost, addSafeMate } = useUser();
  const { posts, safeMates } = useMockData();
  const [contactsModalVisible, setContactsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('safemates');

  const getDisplayName = () => {
    if (!user) return 'Utilisatrice';
    if (user.anonymat) {
      return user.pseudo.charAt(0).toUpperCase();
    }
    return user.pseudo;
  };

  const savedPosts = posts.filter(post => user?.savedPosts?.includes(post.id));
  const myPosts = posts.filter(post => post.author === user?.pseudo);
  const mySafeMates = safeMates.filter(mate => user?.safeMates?.includes(mate.id));
  const suggestedSafeMates = safeMates.filter(mate => !user?.safeMates?.includes(mate.id));

  const handleConnectSafeMate = (safeMateId: string) => {
    addSafeMate(safeMateId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'safemates':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Mes SafeMates</Text>
            <Text style={styles.tabSubtitle}>
              {mySafeMates.length} SafeMate{mySafeMates.length > 1 ? 's' : ''} connectée{mySafeMates.length > 1 ? 's' : ''}
            </Text>
            
            {mySafeMates.length > 0 && (
              <View style={styles.safeMatesSection}>
                <FlatList
                  data={mySafeMates}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <SafeMateCard
                      safeMate={item}
                      onMessage={() => console.log('Message', item.id)}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                />
              </View>
            )}

            {suggestedSafeMates.length > 0 && (
              <View style={styles.suggestionsSection}>
                <View style={styles.suggestionsHeader}>
                  <Text style={styles.suggestionsTitle}>Suggestions</Text>
                  <TouchableOpacity style={styles.searchButton}>
                    <Search size={16} color={Colors.primary} />
                    <Text style={styles.searchButtonText}>Rechercher</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={suggestedSafeMates.slice(0, 3)}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <SafeMateCard
                      safeMate={item}
                      onConnect={() => handleConnectSafeMate(item.id)}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                />
              </View>
            )}

            {mySafeMates.length === 0 && (
              <View style={styles.emptyState}>
                <UserPlus size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyStateTitle}>Aucune SafeMate</Text>
                <Text style={styles.emptyStateDescription}>
                  Connectez-vous avec d'autres utilisatrices pour créer un réseau de sécurité
                </Text>
                <TouchableOpacity style={styles.exploreButton}>
                  <Text style={styles.exploreButtonText}>Explorer les suggestions</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'posts':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Mes publications</Text>
            {myPosts.length > 0 ? (
              <FlatList
                data={myPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PostCard post={item} />}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <History size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyStateTitle}>Aucune publication</Text>
                <Text style={styles.emptyStateDescription}>
                  Vos publications apparaîtront ici
                </Text>
              </View>
            )}
          </View>
        );

      case 'saved':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Publications sauvegardées</Text>
            {savedPosts.length > 0 ? (
              <FlatList
                data={savedPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <SavedPostCard
                    post={item}
                    onUnsave={() => toggleSavedPost(item.id)}
                    onOpen={() => console.log('Open post', item.id)}
                  />
                )}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Bookmark size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyStateTitle}>Aucune publication sauvegardée</Text>
                <Text style={styles.emptyStateDescription}>
                  Les publications que vous sauvegardez apparaîtront ici
                </Text>
              </View>
            )}
          </View>
        );

      case 'settings':
        return (
          <View style={styles.tabContent}>
            <ProfileSection title="Préférences de confidentialité">
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Mode anonyme</Text>
                  <Text style={styles.settingDescription}>
                    Masque votre nom et informations personnelles
                  </Text>
                </View>
                <Switch
                  value={user?.anonymat || false}
                  onValueChange={(value) => updateUserSetting('anonymat', value)}
                  trackColor={{ false: Colors.gray, true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              </View>
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Recevoir des alertes en temps réel
                  </Text>
                </View>
                <Switch
                  value={true}
                  trackColor={{ false: Colors.gray, true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              </View>
            </ProfileSection>
            
            <ProfileSection title="Sécurité">
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => setContactsModalVisible(true)}
              >
                <View style={styles.menuItemLeft}>
                  <Users size={20} color={Colors.textPrimary} />
                  <Text style={styles.menuItemText}>Contacts de confiance</Text>
                </View>
                <ChevronRight size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Bell size={20} color={Colors.textPrimary} />
                  <Text style={styles.menuItemText}>Paramètres d'alerte</Text>
                </View>
                <ChevronRight size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Shield size={20} color={Colors.textPrimary} />
                  <Text style={styles.menuItemText}>Confidentialité</Text>
                </View>
                <ChevronRight size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </ProfileSection>
            
            <TouchableOpacity style={styles.logoutButton}>
              <LogOut size={20} color={Colors.danger} />
              <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profil</Text>
        </View>
        
        <View style={styles.profileCard}>
          <ProfileAvatar size={60} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{getDisplayName()}</Text>
            <Text style={styles.profileLocation}>{user?.ville || 'Paris'}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Modifier</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'safemates' && styles.activeTab]}
              onPress={() => setActiveTab('safemates')}
            >
              <UserPlus size={20} color={activeTab === 'safemates' ? Colors.white : Colors.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'safemates' && styles.activeTabText]}>
                SafeMates
              </Text>
              {mySafeMates.length > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{mySafeMates.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
              onPress={() => setActiveTab('posts')}
            >
              <History size={20} color={activeTab === 'posts' ? Colors.white : Colors.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
                Mes posts
              </Text>
              {myPosts.length > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{myPosts.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
              onPress={() => setActiveTab('saved')}
            >
              <Bookmark size={20} color={activeTab === 'saved' ? Colors.white : Colors.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
                Sauvegardés
              </Text>
              {savedPosts.length > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{savedPosts.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
              onPress={() => setActiveTab('settings')}
            >
              <Shield size={20} color={activeTab === 'settings' ? Colors.white : Colors.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
                Paramètres
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {renderTabContent()}
      </ScrollView>
      
      <ContactListModal
        visible={contactsModalVisible}
        onClose={() => setContactsModalVisible(false)}
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
  },
  header: {
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
  },
  profileLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  editButton: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  tabsContainer: {
    marginBottom: 24,
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  activeTabText: {
    color: Colors.white,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: Colors.white,
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  tabTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  tabSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  exploreButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
  safeMatesSection: {
    marginBottom: 32,
  },
  suggestionsSection: {
    
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.textPrimary,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  searchButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 6,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginVertical: 24,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.danger,
    marginLeft: 8,
  },
});