import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../android/firebase'; // ✅ Update if needed

const Settings = () => {
  const navigation = useNavigation<any>(); // 👈 Fix type here

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // 👈 Change 'Login' if your login screen has a different name
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleViewTerms = () => {
    console.log('Viewing Terms...');
  };

  const handleViewPrivacy = () => {
    console.log('Viewing Privacy...');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.settingsContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Logout</Text>
              <Text style={styles.settingDescription}>
                Sign out of your account
              </Text>
            </View>
            <Text style={styles.arrow}>&gt;</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal Information</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleViewTerms}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>📄</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>View Terms & Conditions</Text>
                <Text style={styles.settingDescription}>
                  Read our terms of service
                </Text>
              </View>
            </View>
            <Text style={styles.arrow}>&gt;</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleViewPrivacy}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>🔒</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>View Privacy Policy</Text>
                <Text style={styles.settingDescription}>
                  Learn about data protection
                </Text>
              </View>
            </View>
            <Text style={styles.arrow}>&gt;</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    backgroundColor: '#fff',
  },
  settingsContainer: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
  },
  arrow: {
    fontSize: 18,
    color: '#999',
  },
});
