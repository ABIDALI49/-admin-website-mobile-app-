import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const Instruction2 = ({ navigation }: any) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>How It Works</Text>
      <Text style={styles.text}>
        1. Sign up or log in to your account.\n2. Book appointments or request help.\n3. Manage your requests and profile anytime.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  content: { alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#007AFF', marginBottom: 16 },
  text: { fontSize: 18, color: '#333', textAlign: 'center', marginBottom: 32 },
  button: { backgroundColor: '#28a745', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 8 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
});

export default Instruction2; 