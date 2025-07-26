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
} from 'react-native';
import { auth, db } from '../../../android/firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const BookAppointment = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !reason.trim() || !preferredDate.trim() || !preferredTime.trim()) {
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

      const appointmentData = {
        userId: currentUser.uid,
        userName: name,
        userPhone: phone,
        type: 'appointment',
        title: 'Appointment Request',
        reason: reason,
        preferredDate: preferredDate,
        preferredTime: preferredTime,
        status: 'pending',
        createdAt: new Date(),
        date: preferredDate,
        time: preferredTime
      };

      await addDoc(collection(db, 'appointments'), appointmentData);

      Alert.alert(
        'Appointment Request Submitted',
        `Your appointment request has been submitted successfully. We will contact you to confirm the appointment for ${preferredDate} at ${preferredTime}.`,
        [{ text: 'OK' }]
      );

      setReason('');
      setPreferredDate('');
      setPreferredTime('');
    } catch (error) {
      console.error('Error submitting appointment:', error);
      Alert.alert('Error', 'Failed to submit appointment request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading your information...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>📅</Text>
            </View>
            <Text style={styles.title}>Book Appointment</Text>
            <Text style={styles.subtitle}>Schedule your consultation with ease</Text>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* Personal Information Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>👤</Text>
              <Text style={styles.sectionTitle}>Personal Information</Text>
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
              </View>
            </View>

            {/* Appointment Details Section */}
            <View style={[styles.sectionHeader, { marginTop: 30 }]}>
              <Text style={styles.sectionIcon}>🏥</Text>
              <Text style={styles.sectionTitle}>Appointment Details</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reason for Visit *</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>📝</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your reason for the appointment..."
                  placeholderTextColor="#999"
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.dateTimeRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Preferred Date *</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>📅</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#999"
                    value={preferredDate}
                    onChangeText={setPreferredDate}
                  />
                </View>
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.label}>Preferred Time *</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>⏰</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="HH:MM"
                    placeholderTextColor="#999"
                    value={preferredTime}
                    onChangeText={setPreferredTime}
                  />
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.8}
            >
              <View style={styles.submitButtonContent}>
                {submitting ? (
                  <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 10 }} />
                ) : (
                  <Text style={styles.submitButtonIcon}>✅</Text>
                )}
                <Text style={styles.submitButtonText}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Info Container */}
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoHeaderIcon}>ℹ️</Text>
              <Text style={styles.infoTitle}>Available Times</Text>
            </View>
            <View style={styles.infoContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoRowIcon}>⏰</Text>
                <Text style={styles.infoText}>Monday - Friday: 9:00 AM - 5:00 PM</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoRowIcon}>⏰</Text>
                <Text style={styles.infoText}>Saturday: 9:00 AM - 2:00 PM</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoRowIcon}>❌</Text>
                <Text style={styles.infoText}>Sunday: Closed</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoRowIcon}>⚠️</Text>
                <Text style={styles.infoText}>Please book at least 24 hours in advance</Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 16,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#667eea',
  },
  headerIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
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
    shadowRadius: 10,
    elevation: 10,
    minHeight: '70%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: '#667eea',
    borderRadius: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  submitButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoHeaderIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  infoContent: {
    paddingLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoRowIcon: {
    fontSize: 14,
    marginRight: 12,
    width: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    flex: 1,
  },
});

export default BookAppointment;