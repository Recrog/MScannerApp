import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { PDFDocument } from 'pdf-lib';
import { toByteArray, fromByteArray } from 'base64-js';

type RouteParams = { images: string[] };

export default function PreviewScreen() {
	const navigation = useNavigation();
	const route = useRoute();
	const { images = [] } = (route.params as unknown as RouteParams) || {};
	const [isExporting, setIsExporting] = useState(false);

	const onSavePDF = async () => {
		try {
			setIsExporting(true);
			const pdfDoc = await PDFDocument.create();
			for (const base64 of images) {
				const bytes = toByteArray(base64);
				const img = await pdfDoc.embedJpg(bytes);
				const page = pdfDoc.addPage([img.width, img.height]);
				page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
			}
			const pdfBytes = await pdfDoc.save();
			const fileUri = FileSystem.cacheDirectory + `scan_${Date.now()}.pdf`;
			const base64Pdf = fromByteArray(pdfBytes);
			await FileSystem.writeAsStringAsync(fileUri, base64Pdf, { encoding: FileSystem.EncodingType.Base64 });
			await Sharing.shareAsync(fileUri, { mimeType: 'application/pdf', dialogTitle: 'PDF Paylaş' });
		} catch (e) {
			Alert.alert('Hata', 'PDF oluşturulamadı');
		} finally {
			setIsExporting(false);
		}
	};

	const onSaveImages = async () => {
		try {
			setIsExporting(true);
			const { status } = await MediaLibrary.requestPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert('İzin Gerekli', 'Galeriye kaydetmek için izin gerekli.');
				return;
			}
			for (const base64 of images) {
				const uri = FileSystem.cacheDirectory + `scan_${Math.random().toString(36).slice(2)}.jpg`;
				await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
				await MediaLibrary.saveToLibraryAsync(uri);
			}
			Alert.alert('Başarılı', 'Görseller galeriye kaydedildi.');
		} catch (e) {
			Alert.alert('Hata', 'Görseller kaydedilemedi');
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
					<Text style={styles.backText}>Geri</Text>
				</TouchableOpacity>
				<Text style={styles.title}>Önizleme ({images.length})</Text>
				<View style={{ width: 64 }} />
			</View>

			<FlatList
				data={images}
				keyExtractor={(item, idx) => `${idx}`}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 12 }}
				renderItem={({ item }) => (
					<Image
						source={{ uri: `data:image/jpeg;base64,${item}` }}
						style={styles.page}
					/>
				)}
			/>

			<View style={styles.actions}>
				<TouchableOpacity style={styles.secondaryButton} onPress={onSaveImages} disabled={isExporting}>
					<Text style={styles.secondaryText}>Görsel Kaydet</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.primaryButton} onPress={onSavePDF} disabled={isExporting}>
					<Text style={styles.primaryText}>PDF Paylaş</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#0b0c10', paddingVertical: 12 },
	header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
	backBtn: { width: 64, paddingVertical: 10, alignItems: 'center', borderRadius: 12, backgroundColor: '#141821', borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1 },
	backText: { color: '#eaf0f6', fontWeight: '600' },
	title: { color: '#eaf0f6', fontSize: 18, fontWeight: '700' },
	page: { width: 260, height: 360, marginHorizontal: 6, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
	actions: { flexDirection: 'row', gap: 12, padding: 16 },
	primaryButton: { flex: 1, backgroundColor: '#4f89ff', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
	primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
	secondaryButton: { flex: 1, backgroundColor: '#141821', paddingVertical: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
	secondaryText: { color: '#eaf0f6', fontSize: 16, fontWeight: '600' },
});


