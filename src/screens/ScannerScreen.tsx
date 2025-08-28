import React, { useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

let DocumentScanner: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DocumentScanner = require('react-native-document-scanner-plugin');
} catch (e) {
  DocumentScanner = null;
}

export default function ScannerScreen() {
  const navigation = useNavigation<any>();
  const [isScanning, setIsScanning] = useState(false);
  const isProcessingRef = useRef(false);

  const startScan = useCallback(async () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsScanning(true);
    try {
      if (DocumentScanner && Platform.OS !== 'web') {
        const result = await DocumentScanner.scanDocument({
          croppedImageQuality: 1,
          letUserAdjustCrop: true,
          maxNumDocuments: 20,
          mode: 'auto',
          responseType: 'base64',
          quality: 1,
          overlayColor: '#4f89ff',
        });
        const scannedImages: string[] | undefined = result?.scannedImages;
        if (scannedImages && scannedImages.length > 0) {
          navigation.navigate('Preview', { images: scannedImages });
          return;
        }
      }

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setIsScanning(false);
        isProcessingRef.current = false;
        return;
      }
      const capture = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        base64: true,
        quality: 1,
      });
      if (!capture.canceled && capture.assets && capture.assets.length > 0) {
        const base64 = capture.assets[0].base64;
        if (base64) {
          navigation.navigate('Preview', { images: [base64] });
        }
      }
    } catch (e) {
      // no-op
    } finally {
      setIsScanning(false);
      isProcessingRef.current = false;
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Belge Tara</Text>
        <View style={{ width: 64 }} />
      </View>

      <View style={styles.previewBox}>
        <Image source={require('../../assets/splash-icon.png')} style={styles.previewImg} />
        <Text style={styles.hint}>Belgeyi çerçeve içine hizalayın ve Tara'ya basın</Text>
      </View>

      <TouchableOpacity style={styles.scanButton} onPress={startScan} disabled={isScanning}>
        {isScanning ? <ActivityIndicator color="#fff" /> : <Text style={styles.scanText}>Tara</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c10', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  backBtn: { width: 64, paddingVertical: 10, alignItems: 'center', borderRadius: 12, backgroundColor: '#141821', borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1 },
  backText: { color: '#eaf0f6', fontWeight: '600' },
  title: { color: '#eaf0f6', fontSize: 18, fontWeight: '700' },
  previewBox: { flex: 1, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#0f1220', marginTop: 20, alignItems: 'center', justifyContent: 'center', padding: 16 },
  previewImg: { width: 128, height: 128, opacity: 0.4, marginBottom: 16 },
  hint: { color: '#a8b3c7' },
  scanButton: { backgroundColor: '#4f89ff', paddingVertical: 18, borderRadius: 18, alignItems: 'center', marginBottom: 20 },
  scanText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
