import { CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { AppState, Platform, SafeAreaView, StatusBar, StyleSheet, View, Text, Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import { db } from '../database/conexion';
import { doc, getDoc } from "firebase/firestore";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FontAwesome } from '@expo/vector-icons';


interface ProductDetails {
  Nombre: string;
  Categoria: string;
  Stock: number;
  Marca: string;
  Precio_Compra: number;
  Precio_Venta: number;
  Fecha_Caducidad: string;
  Fecha_Compra: string;
}

export default function QRCodeScanner() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);

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
      try {
        const docRef = doc(db, "Productos", data);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProductDetails(docSnap.data() as ProductDetails);
        } else {
          Alert.alert("Error", "No se encontró el producto.");
        }
      } catch (error) {
        Alert.alert("Error", "Hubo un problema al obtener los detalles del producto.");
      } finally {
        qrLock.current = false;
      }
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
      {productDetails && (
        <View style={styles.productDetails}>
          <Text style={styles.titleDetails}>Detalles del producto</Text>
          <View style={styles.dateProduct}>
            <AntDesign name="shoppingcart" size={24} color="#73488c" />
            <Text style={styles.productText}>Nombre: {productDetails.Nombre}</Text>
          </View>
          <View style={styles.dateProduct}>
            <MaterialIcons name="category" size={24} color="#73488c" />
            <Text style={styles.productText}>Categoría: {productDetails.Categoria}</Text>
          </View>
          <View style={styles.dateProduct}>
            <Entypo name="box" size={24} color="#73488c" />
            <Text style={styles.productText}>Stock: {productDetails.Stock}</Text>
          </View>
          <View style={styles.dateProduct}>
            <AntDesign name="tag" size={24} color="#73488c" />
            <Text style={styles.productText}>Marca: {productDetails.Marca}</Text>
          </View>
          <View style={styles.dateProduct}>
            <Entypo name="price-tag" size={24} color="#73488c" />
            <Text style={styles.productText}>Precio de Compra: {productDetails.Precio_Compra}</Text>
          </View>
          <View style={styles.dateProduct}>
            <MaterialCommunityIcons name="account-cash-outline" size={24} color="#73488c" />
            <Text style={styles.productText}>Precio de Venta: {productDetails.Precio_Venta}</Text>
          </View>
          <View style={styles.dateProduct}>
            <FontAwesome name="calendar" size={24} color={'#5b3274'} />
            <Text style={styles.productText}>Fecha de Caducidad: {productDetails.Fecha_Caducidad}</Text>
          </View>
          <View style={styles.dateProduct}>
            <FontAwesome name="calendar" size={24} color={'#5b3274'} />
            <Text style={styles.productText}>Fecha de Compra: {productDetails.Fecha_Compra}</Text>
          </View>
        </View>
      )}
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
    width: '80%',
    height: 100,
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
  productDetails: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 10,
  },
  productText: {
    fontSize: 19,
    marginLeft: 15
  },
  dateProduct: {
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row'
  },
  titleDetails:{
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 20
  }
});