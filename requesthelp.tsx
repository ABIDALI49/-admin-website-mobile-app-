import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { auth, db } from '../../../android/firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const RequestHelp = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [helpType, setHelpType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const helpTypes = [
    { type: 'Food', emoji: '🍽️', color: '#FF6B6B', description: 'Meals & Groceries' },
    { type: 'Health', emoji: '🏥', color: '#4ECDC4', description: 'Medical Support' },
    { type: 'Education', emoji: '📚', color: '#45B7D1', description: 'Learning Resources' },
    { type: 'Other', emoji: '🤝', color: '#96CEB4', description: 'General Assistance' }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          const userData = userDoc.data();
          if (userData) {
            setName(userData.name || '');
            setPhone(userData.phone || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setLoading(false);
        // Start animations
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    fetchUserData();
  }, []);

  const handleSubmitHelp = async () => {
    if (!name.trim() || !phone.trim() || !helpType.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSubmitting(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      // Save help request data to Firebase
      const helpRequestData = {
        userId: currentUser.uid,
        userName: name,
        userPhone: phone,
        type: 'help',
        title: `${helpType} Assistance`,
        helpType: helpType,
        description: description,
        status: 'pending',
        createdAt: new Date(),
        date: new Date().toISOString().split('T')[0] // Current date
      };

      await addDoc(collection(db, 'requests'), helpRequestData);

      Alert.alert(
        '🎉 Request Submitted Successfully!',
        `Your ${helpType.toLowerCase()} assistance request has been submitted. Our team will reach out within 24 hours to help you. Stay strong! 💪`,
        [{ text: 'Got it! 👍', style: 'default' }]
      );

      // Clear form fields
      setHelpType('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting help request:', error);
      Alert.alert('Error', 'Failed to submit help request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIconContainer}>
            <Text style={styles.loadingIcon}>🤝</Text>
            <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
          </View>
          <Text style={styles.loadingText}>Preparing your help request form...</Text>
          <Text style={styles.loadingSubtext}>We're here to support you! 💙</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Header */}
            <View style={styles.heroHeader}>
              <View style={styles.heroIconContainer}>
                <Text style={styles.heroIcon}>🤝</Text>
                <View style={styles.heroIconGlow} />
              </View>
              <Text style={styles.heroTitle}>Request Help</Text>
              <Text style={styles.heroSubtitle}>We're here to support you through any challenge</Text>
              <View style={styles.heroStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>24h</Text>
                  <Text style={styles.statLabel}>Response</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>100%</Text>
                  <Text style={styles.statLabel}>Confidential</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>24/7</Text>
                  <Text style={styles.statLabel}>Available</Text>
                </View>
              </View>
            </View>

            {/* Form Container */}
            <View style={styles.formContainer}>
              {/* Personal Info Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>👤</Text>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.sectionBadge}>
                  <Text style={styles.sectionBadgeText}>Auto-filled</Text>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View style={[styles.inputWrapper, styles.disabledInputWrapper]}>
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={name}
                    onChangeText={setName}
                    editable={false}
                    placeholder="Name will be autofilled"
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.inputStatus}>✓</Text>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={[styles.inputWrapper, styles.disabledInputWrapper]}>
                  <Text style={styles.inputIcon}>📞</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={phone}
                    onChangeText={setPhone}
                    editable={false}
                    placeholder="Phone will be autofilled"
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.inputStatus}>✓</Text>
                </View>
              </View>

              {/* Help Type Section */}
              <View style={[styles.sectionHeader, { marginTop: 30 }]}>
                <Text style={styles.sectionIcon}>🎯</Text>
                <Text style={styles.sectionTitle}>Type of Assistance</Text>
              </View>

              <View style={styles.helpTypeGrid}>
                {helpTypes.map((item) => (
                  <TouchableOpacity
                    key={item.type}
                    style={[
                      styles.helpTypeCard,
                      helpType === item.type && styles.helpTypeCardActive,
                      { borderColor: item.color }
                    ]}
                    onPress={() => setHelpType(item.type)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.helpTypeIconContainer, { backgroundColor: item.color + '20' }]}>
                      <Text style={styles.helpTypeEmoji}>{item.emoji}</Text>
                    </View>
                    <Text style={[
                      styles.helpTypeTitle,
                      helpType === item.type && styles.helpTypeTextActive
                    ]}>
                      {item.type}
                    </Text>
                    <Text style={[
                      styles.helpTypeDescription,
                      helpType === item.type && styles.helpTypeDescriptionActive
                    ]}>
                      {item.description}
                    </Text>
                    {helpType === item.type && (
                      <View style={[styles.selectedIndicator, { backgroundColor: item.color }]}>
                        <Text style={styles.selectedIcon}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Description Section */}
              <View style={[styles.sectionHeader, { marginTop: 30 }]}>
                <Text style={styles.sectionIcon}>📝</Text>
                <Text style={styles.sectionTitle}>Tell Us More</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Describe your situation *</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>💬</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Please share details about what kind of help you need. The more information you provide, the better we can assist you..."
                    placeholderTextColor="#999"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>
                <Text style={styles.characterCount}>{description.length}/500 characters</Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  submitting && styles.submitButtonDisabled,
                  helpType && styles.submitButtonReady
                ]}
                onPress={handleSubmitHelp}
                disabled={submitting}
                activeOpacity={0.8}
              >
                <View style={styles.submitButtonContent}>
                  {submitting ? (
                    <>
                      <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 10 }} />
                      <Text style={styles.submitButtonText}>Submitting your request...</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.submitButtonIcon}>🚀</Text>
                      <Text style={styles.submitButtonText}>Submit Help Request</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Support Info */}
            <View style={styles.supportContainer}>
              <View style={styles.supportHeader}>
                <Text style={styles.supportIcon}>💡</Text>
                <Text style={styles.supportTitle}>How We Help</Text>
              </View>
              <View style={styles.supportGrid}>
                <View style={styles.supportItem}>
                  <Text style={styles.supportItemIcon}>⚡</Text>
                  <Text style={styles.supportItemTitle}>Quick Response</Text>
                  <Text style={styles.supportItemText}>Within 24 hours</Text>
                </View>
                <View style={styles.supportItem}>
                  <Text style={styles.supportItemIcon}>🔒</Text>
                  <Text style={styles.supportItemTitle}>Secure & Private</Text>
                  <Text style={styles.supportItemText}>100% Confidential</Text>
                </View>
                <View style={styles.supportItem}>
                  <Text style={styles.supportItemIcon}>🌟</Text>
                  <Text style={styles.supportItemTitle}>Expert Care</Text>
                  <Text style={styles.supportItemText}>Professional team</Text>
                </View>
              </View>

              <View style={styles.emergencyContainer}>
                <Text style={styles.emergencyIcon}>🚨</Text>
                <View style={styles.emergencyContent}>
                  <Text style={styles.emergencyTitle}>Emergency?</Text>
                  <Text style={styles.emergencyText}>Call +1-800-SUPPORT immediately</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  safeArea: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loadingIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  heroHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#667eea',
  },
  heroIconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  heroIcon: {
    fontSize: 60,
    textAlign: 'center',
  },
  heroIconGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
    transform: [{ scale: 1.2 }],
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 15,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 15,
    minHeight: '75%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionBadgeText: {
    fontSize: 10,
    color: '#28a745',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8e8e8',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    paddingHorizontal: 15,
    minHeight: 50,
  },
  disabledInputWrapper: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  disabledInput: {
    color: '#999',
  },
  inputStatus: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
  },
  helpTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  helpTypeCard: {
    width: (width - 64) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e8e8e8',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  helpTypeCardActive: {
    backgroundColor: '#f8f9ff',
    borderWidth: 3,
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.15,
    elevation: 8,
  },
  helpTypeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  helpTypeEmoji: {
    fontSize: 24,
  },
  helpTypeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  helpTypeDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  helpTypeTextActive: {
    color: '#667eea',
  },
  helpTypeDescriptionActive: {
    color: '#667eea',
  },
  selectedIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: '#ccc',
    borderRadius: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonReady: {
    backgroundColor: '#667eea',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  submitButtonIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  supportContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  supportIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  supportGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  supportItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  supportItemIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  supportItemTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  supportItemText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  emergencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  emergencyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d63384',
    marginBottom: 2,
  },
  emergencyText: {
    fontSize: 12,
    color: '#d63384',
  },
});

export default RequestHelp;