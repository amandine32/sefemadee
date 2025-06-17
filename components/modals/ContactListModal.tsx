import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { X, Plus, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';

interface ContactListModalProps {
  visible: boolean;
  onClose: () => void;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
}

export function ContactListModal({ visible, onClose }: ContactListModalProps) {
  const { user } = useUser();
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Amina Benali', phone: '06 12 34 56 78' },
    { id: '2', name: 'Keiko Tanaka', phone: '06 23 45 67 89' },
    { id: '3', name: 'Fatou Diallo', phone: '06 34 56 78 90' },
  ]);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  
  const handleAddContact = () => {
    if (name.trim() && phone.trim()) {
      const newContact = {
        id: Date.now().toString(),
        name: name.trim(),
        phone: phone.trim(),
      };
      
      setContacts([...contacts, newContact]);
      setName('');
      setPhone('');
      setIsAddingContact(false);
    }
  };
  
  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
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
            <Text style={styles.modalTitle}>Contacts de confiance</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.description}>
            Ces contacts recevront une alerte avec votre position en cas d'urgence.
          </Text>
          
          {isAddingContact ? (
            <View style={styles.addContactForm}>
              <Text style={styles.formTitle}>Ajouter un contact</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Nom"
                value={name}
                onChangeText={setName}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Téléphone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              
              <View style={styles.formButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsAddingContact(false);
                    setName('');
                    setPhone('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.saveButton, 
                    {opacity: name && phone ? 1 : 0.6}
                  ]}
                  disabled={!name || !phone}
                  onPress={handleAddContact}
                >
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <FlatList
                data={contacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.contactItem}>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{item.name}</Text>
                      <Text style={styles.contactPhone}>{item.phone}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteContact(item.id)}
                    >
                      <Trash2 size={20} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                )}
                contentContainerStyle={styles.contactsList}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    Aucun contact ajouté. Ajoutez des contacts pour recevoir de l'aide en cas d'urgence.
                  </Text>
                }
              />
              
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setIsAddingContact(true)}
              >
                <Plus size={20} color={Colors.white} />
                <Text style={styles.addButtonText}>Ajouter un contact</Text>
              </TouchableOpacity>
            </>
          )}
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
  },
  contactsList: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  contactPhone: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  addContactForm: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  formTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.white,
  },
});