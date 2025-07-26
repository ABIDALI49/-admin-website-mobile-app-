import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Animated
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../../android/firebase';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');

const Profile = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();
        if (userData) {
          setName(userData.name || '');
          setPhone(userData.phone || '');
          setEmail(userData.email || currentUser.email || '');
          setProfileImage(userData.profileImage || '');
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
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
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleSaveChanges = async () => {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSaving(true);
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      // Update user data in Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        profileImage: profileImage,
        updatedAt: new Date()
      });

      Alert.alert(
        '🎉 Profile Updated!',
        'Your profile has been successfully updated. Looking great! ✨',
        [{ text: 'Awesome! 👍', style: 'default' }]
      );
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handlePickImage = async () => {
    console.log('handlePickImage called!');
    Alert.alert('Debug', 'Image picker function called!');
    
    try {
      launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, async (response) => {
        console.log('Image picker response:', response);
        
        if (response.didCancel) {
          Alert.alert('Debug', 'User cancelled image picker');
          return;
        }
        
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to pick image');
          return;
        }
        
        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          console.log('Selected asset:', asset);
          // TODO: Upload asset.uri to Firebase Storage and get the download URL
          // For now, just use the local uri as a placeholder
          setProfileImage(asset.uri || '');
          Alert.alert(
            '📸 Photo Selected!',
            'Your new profile picture looks amazing! Don\'t forget to save your changes. 🌟',
            [{ text: 'Got it! 📱', style: 'default' }]
          );
        } else {
          Alert.alert('Debug', 'No assets found in response');
        }
      });
    } catch (error) {
      console.error('Error in handlePickImage:', error);
      Alert.alert('Error', 'Failed to open image picker: ' + error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIconContainer}>
            <Text style={styles.loadingIcon}>👤</Text>
            <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
          </View>
          <Text style={styles.loadingText}>Loading your profile...</Text>
          <Text style={styles.loadingSubtext}>Getting everything ready for you! ✨</Text>
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
              <View style={styles.heroBackground}>
                <View style={styles.heroPattern} />
              </View>
              
              <Animated.View 
                style={[
                  styles.profileImageContainer,
                  { transform: [{ scale: scaleAnim }] }
                ]}
              >
                <TouchableOpacity 
                  onPress={isEditing ? handlePickImage : undefined} 
                  disabled={!isEditing}
                  style={styles.profileImageTouchable}
                >
                  <View style={styles.profileImageWrapper}>
                    {profileImage ? (
                      <Image
                        source={{ uri: profileImage }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
                        <Text style={styles.profileImageEmoji}>👤</Text>
                      </View>
                    )}
                    {isEditing && (
                      <View style={styles.cameraOverlay}>
                        <Text style={styles.cameraIcon}>📷</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.profileImageGlow} />
                </TouchableOpacity>
                
                {isEditing && (
                  <Text style={styles.changePhotoText}>Tap to change photo</Text>
                )}
              </Animated.View>
              
              <Text style={styles.heroTitle}>My Profile</Text>
              <Text style={styles.heroSubtitle}>Manage your personal information</Text>
              
              <View style={styles.profileStats}>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>🎯</Text>
                  <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>🛡️</Text>
                  <Text style={styles.statLabel}>Verified</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>⭐</Text>
                  <Text style={styles.statLabel}>Premium</Text>
                </View>
              </View>
            </View>

            {/* Form Container */}
            <View style={styles.formContainer}>
              {/* Personal Information Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>👤</Text>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                {!isEditing && (
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>View Mode</Text>
                  </View>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View style={[styles.inputWrapper, !isEditing && styles.disabledInputWrapper]}>
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput
                    style={[styles.input, !isEditing && styles.disabledInput]}
                    value={name}
                    onChangeText={setName}
                    editable={isEditing}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                  />
                  {!isEditing && <Text style={styles.inputStatus}>🔒</Text>}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={[styles.inputWrapper, !isEditing && styles.disabledInputWrapper]}>
                  <Text style={styles.inputIcon}>📞</Text>
                  <TextInput
                    style={[styles.input, !isEditing && styles.disabledInput]}
                    value={phone}
                    onChangeText={setPhone}
                    editable={isEditing}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                  />
                  {!isEditing && <Text style={styles.inputStatus}>🔒</Text>}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View style={[styles.inputWrapper, !isEditing && styles.disabledInputWrapper]}>
                  <Text style={styles.inputIcon}>📧</Text>
                  <TextInput
                    style={[styles.input, !isEditing && styles.disabledInput]}
                    value={email}
                    onChangeText={setEmail}
                    editable={isEditing}
                    placeholder="Enter your email address"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {!isEditing && <Text style={styles.inputStatus}>🔒</Text>}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                {!isEditing ? (
                  <TouchableOpacity 
                    style={styles.editButton} 
                    onPress={() => setIsEditing(true)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.buttonContent}>
                      <Text style={styles.buttonIcon}>✏️</Text>
                      <Text style={styles.editButtonText}>Edit Profile</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.editingButtons}>
                    <TouchableOpacity 
                      style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
                      onPress={handleSaveChanges}
                      disabled={saving}
                      activeOpacity={0.8}
                    >
                      <View style={styles.buttonContent}>
                        {saving ? (
                          <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
                        ) : (
                          <Text style={styles.buttonIcon}>💾</Text>
                        )}
                        <Text style={styles.saveButtonText}>
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.cancelButton} 
                      onPress={() => {
                        setIsEditing(false);
                        fetchUserProfile();
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.buttonContent}>
                        <Text style={styles.buttonIcon}>❌</Text>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* Account Actions */}
            <View style={styles.actionsContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>⚙️</Text>
                <Text style={styles.sectionTitle}>Account Actions</Text>
              </View>
              
              <View style={styles.actionsList}>
                <TouchableOpacity style={styles.actionItem}>
                  <Text style={styles.actionIcon}>🔔</Text>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>Notifications</Text>
                    <Text style={styles.actionSubtitle}>Manage your notification preferences</Text>
                  </View>
                  <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionItem}>
                  <Text style={styles.actionIcon}>🔐</Text>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>Privacy & Security</Text>
                    <Text style={styles.actionSubtitle}>Control your privacy settings</Text>
                  </View>
                  <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionItem}>
                  <Text style={styles.actionIcon}>❓</Text>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>Help & Support</Text>
                    <Text style={styles.actionSubtitle}>Get help when you need it</Text>
                  </View>
                  <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Logout Section */}
            <View style={styles.logoutContainer}>
              <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonIcon}>🚪</Text>
                  <Text style={styles.logoutButtonText}>Sign Out</Text>
                </View>
              </TouchableOpacity>
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
    position: 'relative',
    overflow: 'hidden',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroPattern: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 100,
    transform: [{ rotate: '45deg' }],
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profileImageTouchable: {
    position: 'relative',
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: '#e0e0e0',
  },
  profileImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  profileImageEmoji: {
    fontSize: 50,
    color: '#999',
  },
  profileImageGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 70,
    zIndex: -1,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#667eea',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  cameraIcon: {
    fontSize: 12,
  },
  changePhotoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 25,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 300,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 70,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
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
    minHeight: '60%',
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
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionBadgeText: {
    fontSize: 10,
    color: '#667eea',
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
    color: '#999',
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  editButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  editingButtons: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 16,
    borderRadius: 12,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  actionsList: {
    gap: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#fafafa',
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
    textAlign: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  actionArrow: {
    fontSize: 20,
    color: '#ccc',
    fontWeight: 'bold',
  },
  logoutContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Profile;
