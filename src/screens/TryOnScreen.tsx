import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, fontSizes, radii, spacing } from '../theme/tokens';
import { getProductById } from '../data/products';
import { detectFace } from '../services/faceDetection';
import { computeOutfitGeometry, OutfitGeometry } from '../utils/overlayGeometry';
import { ColorVariant, FaceLandmarks, OverlayTransform } from '../types';
import { ColorSwatch } from '../components/ColorSwatch';
import { DraggableOverlay } from '../components/DraggableOverlay';
import { OutfitLayer } from '../components/OutfitLayer';
import { useAppStore } from '../state/store';

type Props = NativeStackScreenProps<RootStackParamList, 'TryOn'>;

interface Photo {
  uri: string;
  width: number;
  height: number;
}

const DEFAULT_TRANSFORM: OverlayTransform = { x: 0, y: 0, scale: 1, rotation: 0 };

export function TryOnScreen({ route, navigation }: Props) {
  const product = getProductById(route.params.productId);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const isPro = useAppStore((s) => s.isPro);

  const [selectedColor, setSelectedColor] = useState<ColorVariant | undefined>(product?.colors[0]);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [landmarks, setLandmarks] = useState<FaceLandmarks | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [noFaceFound, setNoFaceFound] = useState(false);
  const [transform, setTransform] = useState<OverlayTransform>(DEFAULT_TRANSFORM);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [busy, setBusy] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const captureAreaRef = useRef<View>(null);

  const runDetection = useCallback(async (uri: string) => {
    setDetecting(true);
    setNoFaceFound(false);
    try {
      const result = await detectFace(uri);
      setLandmarks(result);
      setNoFaceFound(!result);
    } catch (error) {
      console.warn('[TryOn] Face detection failed', error);
      setLandmarks(null);
      setNoFaceFound(true);
    } finally {
      setDetecting(false);
      setTransform(DEFAULT_TRANSFORM);
    }
  }, []);

  const handleTakePhoto = async () => {
    if (!cameraPermission?.granted) {
      const response = await requestCameraPermission();
      if (!response.granted) {
        Alert.alert('Camera access needed', 'Enable camera access in Settings to take a try-on photo.');
        return;
      }
    }
    const picture = await cameraRef.current?.takePictureAsync({ quality: 0.85 });
    if (!picture) return;
    setPhoto({ uri: picture.uri, width: picture.width, height: picture.height });
    void runDetection(picture.uri);
  };

  const handlePickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photo access needed', 'Enable photo library access in Settings to choose a picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      allowsEditing: false,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setPhoto({ uri: asset.uri, width: asset.width, height: asset.height });
    void runDetection(asset.uri);
  };

  const onImageLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDisplaySize({ width, height });
  };

  const handleSave = async () => {
    if (!captureAreaRef.current) return;
    setBusy(true);
    try {
      const permission = await MediaLibrary.requestPermissionsAsync(true);
      if (!permission.granted) {
        Alert.alert('Photo access needed', 'Enable photo library access in Settings to save your try-on.');
        return;
      }
      const uri = await captureRef(captureAreaRef, { format: 'jpg', quality: 0.92 });
      await MediaLibrary.Asset.create(uri);
      Alert.alert('Saved!', 'Your try-on photo was saved to your gallery.');
    } catch (error) {
      console.warn('[TryOn] Save failed', error);
      Alert.alert('Something went wrong', 'Could not save the photo. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    if (!captureAreaRef.current) return;
    setBusy(true);
    try {
      const uri = await captureRef(captureAreaRef, { format: 'jpg', quality: 0.92 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Sharing unavailable', 'Sharing is not supported on this device.');
      }
    } catch (error) {
      console.warn('[TryOn] Share failed', error);
    } finally {
      setBusy(false);
    }
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>This item is no longer available.</Text>
      </SafeAreaView>
    );
  }

  const geometry: OutfitGeometry | null =
    photo && displaySize.width > 0
      ? computeOutfitGeometry(landmarks, product.category, displaySize.width, displaySize.height, photo.width, photo.height)
      : null;

  const effectiveTransform: OverlayTransform = geometry
    ? { ...transform, rotation: transform.rotation || geometry.rotation }
    : DEFAULT_TRANSFORM;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {!photo && (
        <View style={styles.captureStage}>
          {cameraPermission?.granted ? (
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front" />
          ) : (
            <View style={styles.permissionPrompt}>
              <Text style={styles.permissionText}>We need camera access to try this on live.</Text>
              <Pressable style={styles.primaryButton} onPress={handleTakePhoto}>
                <Text style={styles.primaryButtonText}>Enable Camera</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.captureControls}>
            <Pressable style={styles.secondaryButton} onPress={handlePickFromGallery}>
              <Text style={styles.secondaryButtonText}>Choose Photo</Text>
            </Pressable>
            {cameraPermission?.granted && (
              <Pressable style={styles.shutterButton} onPress={handleTakePhoto}>
                <View style={styles.shutterInner} />
              </Pressable>
            )}
          </View>
        </View>
      )}

      {photo && (
        <>
          <View style={styles.previewStage} ref={captureAreaRef} collapsable={false}>
            <Image
              source={{ uri: photo.uri }}
              style={{ width: '100%', aspectRatio: photo.width / photo.height }}
              onLayout={onImageLayout}
            />

            {detecting && (
              <View style={styles.detectingOverlay}>
                <ActivityIndicator color={colors.white} />
                <Text style={styles.detectingText}>Finding your face…</Text>
              </View>
            )}

            {!detecting && geometry && selectedColor && (
              <DraggableOverlay origin={geometry.origin} transform={effectiveTransform} onTransformChange={setTransform}>
                <OutfitLayer product={product} color={selectedColor} geometry={geometry} />
              </DraggableOverlay>
            )}

            {!isPro && (
              <View style={styles.watermark}>
                <Text style={styles.watermarkText}>Virtual Try-On</Text>
              </View>
            )}
          </View>

          {noFaceFound && (
            <Text style={styles.hint}>No face detected - drag, pinch and rotate to position it manually.</Text>
          )}
          {!noFaceFound && !detecting && (
            <Text style={styles.hint}>Drag to move, pinch to resize, twist with two fingers to rotate.</Text>
          )}
        </>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorRow} contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.md }}>
        {product.colors.map((c) => (
          <ColorSwatch key={c.id} variant={c} selected={selectedColor?.id === c.id} onPress={() => setSelectedColor(c)} />
        ))}
      </ScrollView>

      {photo && (
        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryButton} onPress={() => setPhoto(null)} disabled={busy}>
            <Text style={styles.secondaryButtonText}>Retake</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={handleSave} disabled={busy}>
            <Text style={styles.primaryButtonText}>{busy ? 'Saving…' : 'Save'}</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={handleShare} disabled={busy}>
            <Text style={styles.primaryButtonText}>Share</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  back: { color: colors.primary, fontSize: fontSizes.md, fontWeight: '600' },
  title: { color: colors.text, fontSize: fontSizes.md, fontWeight: '700', flex: 1, textAlign: 'center' },
  errorText: { color: colors.text, textAlign: 'center', marginTop: spacing.xl },

  captureStage: { flex: 1, margin: spacing.md, borderRadius: radii.lg, overflow: 'hidden', backgroundColor: colors.surface },
  permissionPrompt: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
  permissionText: { color: colors.textMuted, textAlign: 'center' },
  captureControls: {
    position: 'absolute',
    bottom: spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  shutterButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  shutterInner: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.white },

  previewStage: {
    marginHorizontal: spacing.md,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  detectingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,17,21,0.55)',
    gap: spacing.sm,
  },
  detectingText: { color: colors.white, fontSize: fontSizes.sm },
  watermark: { position: 'absolute', bottom: spacing.sm, right: spacing.sm },
  watermarkText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  hint: { color: colors.textMuted, fontSize: fontSizes.xs, textAlign: 'center', marginTop: spacing.sm },

  colorRow: { marginTop: spacing.md, flexGrow: 0 },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  primaryButtonText: { color: colors.white, fontWeight: '700' },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: { color: colors.text, fontWeight: '700' },
});
