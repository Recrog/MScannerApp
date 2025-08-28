import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>FullScanner</Text>
        <Text style={styles.subtitle}>Hızlı, şık ve ücretsiz belge tarayıcı</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Scanner' as never)}>
        <Text style={styles.primaryText}>Yeni Tarama</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Kütüphane</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Ayarlar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c10', padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 48 },
  logo: { width: 72, height: 72, marginBottom: 12, borderRadius: 16 },
  title: { color: '#eaf0f6', fontSize: 28, fontWeight: '800', letterSpacing: 0.3 },
  subtitle: { color: '#a8b3c7', marginTop: 6 },
  primaryButton: { backgroundColor: '#4f89ff', paddingVertical: 18, borderRadius: 18, alignItems: 'center', shadowColor: '#4f89ff', shadowOpacity: 0.3, shadowRadius: 12 },
  primaryText: { color: 'white', fontSize: 17, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 16, marginTop: 16 },
  secondaryButton: { flex: 1, backgroundColor: '#141821', paddingVertical: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  secondaryText: { color: '#eaf0f6' }
});


