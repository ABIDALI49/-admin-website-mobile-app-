import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const Instruction1 = ({ navigation }: any) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>Welcome to UserNest!</Text>
      <Text style={styles.text}>
        This app helps you book appointments, request help, and manage your profile easily.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Instruction2')}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  content: { alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#007AFF', marginBottom: 16 },
  text: { fontSize: 18, color: '#333', textAlign: 'center', marginBottom: 32 },
  button: { backgroundColor: '#007AFF', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 8 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
});

export default Instruction1; 