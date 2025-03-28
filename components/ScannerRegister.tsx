import { CameraView } from "expo-camera";
import { AppState, Linking, Platform, SafeAreaView, StatusBar, StyleSheet, View, Text } from "react-native";
import { useEffect, useRef } from "react";
import { useBarcode } from './BarCodeContext';
import { useNavigation } from '@react-navigation/native';


export default function QRCodeScanner() {
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);
    const { setBarcode } = useBarcode();
    const navigation = useNavigation();

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                qrLock.current = false;
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const handleBarCodeScanned = async ({ data }: any) => {
        if (data && !qrLock.current) {
            qrLock.current = true;
            setBarcode(data); // Actualiza el contexto con el código de barras escaneado
            navigation.goBack(); // Regresa a la pantalla anterior
        }
    };

    return (
        <SafeAreaView style={StyleSheet.absoluteFillObject}>
            {Platform.OS === "android" ? <StatusBar hidden /> : null}
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={handleBarCodeScanned}
            />
            <View style={styles.overlay}>
                <View style={styles.topOverlay}>
                    <Text style={styles.title}>Escanea el código de barras</Text>
                </View>
                <View style={styles.middleOverlay}>
                    <View style={styles.sideOverlay} />
                    <View style={styles.rectangle} />
                    <View style={styles.sideOverlay} />
                </View>
                <View style={styles.bottomOverlay} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topOverlay: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleOverlay: {
        flexDirection: 'row',
    },
    sideOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    rectangle: {
        width: '60%',
        height: 150,
        borderWidth: 2,
        borderColor: '#fff',
    },
    bottomOverlay: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
});