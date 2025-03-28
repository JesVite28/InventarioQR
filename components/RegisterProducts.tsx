import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import LottieView from "lottie-react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBarcode } from './BarCodeContext';
import { db } from "../database/conexion"; 
import { doc, setDoc } from "firebase/firestore";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function RegisterProducts() {
    const [nombreProducto, setNombreProducto] = useState('');
    const [categoria, setCategoria] = useState('');
    const [stock, setStock] = useState('');
    const [marca, setMarca] = useState('');
    const [precioCompra, setPrecioCompra] = useState('');
    const [precioVenta, setPrecioVenta] = useState('');
    const [fechaCaducidad, setFechaCaducidad] = useState(new Date());
    const [fechaCompra, setFechaCompra] = useState(new Date());
    const [showDatePickerCaducidad, setShowDatePickerCaducidad] = useState(false);
    const [showDatePickerCompra, setShowDatePickerCompra] = useState(false);
    const navigation = useNavigation();
    const { barcode, setBarcode } = useBarcode();

    useEffect(() => {
        if (barcode) {
            console.log('Código de barras escaneado:', barcode);
        }
    }, [barcode]);

    const onChangeDateCaducidad = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || fechaCaducidad;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (currentDate >= today) {
            setShowDatePickerCaducidad(false);
            setFechaCaducidad(currentDate);
        } else {
            alert('Por favor selecciona una fecha futura.');
        }
    };

    const onChangeDateCompra = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || fechaCompra;
        setShowDatePickerCompra(false);
        setFechaCompra(currentDate);
    };

    const handleDateInputChange = (text: any, setter: any) => {
        if (text === '') {
            setter(new Date());
        } else {
            const formattedDate = new Date(text);
            if (!isNaN(formattedDate.getTime())) {
                setter(formattedDate);
            }
        }
    };

    const formatDate = (date: any) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    //funcion para limpiar campos.
    const LimpiarCampos = () => {
        setNombreProducto('');
        setCategoria('');
        setStock('');
        setMarca('');
        setPrecioCompra('');
        setPrecioVenta('');
        setBarcode(''); 
    };

    //Funcion para limitar stock a 8 
    const handleStockChange = (text: any) => {
        if (/^\d{0,8}$/.test(text)) {
            setStock(text);
        }
    };

    const guardarProducto = async () => {
        if (!nombreProducto || !categoria || !stock || !marca || !precioCompra || !precioVenta || !barcode) {
            alert("Por favor completa todos los campos antes de guardar.");
            return;
        }
        try {
            const producto = {
                Nombre: nombreProducto,
                Categoria: categoria,
                Stock: parseInt(stock),
                Marca: marca,
                Precio_Compra: parseFloat(precioCompra),
                Precio_Venta: parseFloat(precioVenta),
                Fecha_Caducidad: formatDate(fechaCaducidad),
                Fecha_Compra: formatDate(fechaCompra),
            };
            await setDoc(doc(db, "Productos", barcode), producto);
            alert("Producto guardado correctamente.");
            LimpiarCampos();
        } catch (error) {
            console.error("Error al guardar producto:", error);
            alert("Ocurrió un error al guardar el producto.");
        }
    };
    
    

    //Funcion para permitir solo numeros decimales.
    const handleDecimalChange = (text: any, setter: any) => {
        if (/^\d*\.?\d*$/.test(text)) {
            setter(text)
        }
    }

    const ScannerProducts = () => {
        navigation.navigate('ScannerRegister');
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.contenedor}
        >
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <Text style={styles.titulo}>Registro de productos</Text>
                <LottieView
                    source={require('../assets/inventory.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
                <Text style={styles.labels}>
                    Nombre Del Producto
                </Text>
                <View style={styles.iconInput}>
                <AntDesign name="shoppingcart" size={24} color="#73488c" />
                <TextInput
                    style={styles.textInput}
                    placeholder="Nombre del Producto"
                    placeholderTextColor="#888"
                    value={nombreProducto}
                    onChangeText={setNombreProducto}
                />
                </View>
                <Text style={styles.labels}>
                    Categoria
                </Text>
                <View style={styles.iconInput}>
                <MaterialIcons name="category" size={24} color="#73488c" />
                <Picker
                    selectedValue={categoria}
                    onValueChange={(itemValue) => setCategoria(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Seleccione una categoría" value="" />
                    <Picker.Item label="Electrónica" value="electronica" />
                    <Picker.Item label="Ropa" value="ropa" />
                    <Picker.Item label="Alimentos" value="alimentos" />
                    <Picker.Item label="Hogar" value="hogar" />
                </Picker>
                </View>
                <View style={styles.viewlabels}>
                    <Text style={styles.labels}>Fecha de caducidad</Text>
                </View>
                <View style={styles.dateInputContainer}>
                    <TextInput
                        style={styles.inputDate}
                        value={formatDate(fechaCaducidad)}
                        onChangeText={(text) => handleDateInputChange(text, setFechaCaducidad)}
                        editable={false}
                    />
                    <Pressable onPress={() => setShowDatePickerCaducidad(true)} style={styles.calendarButton}>
                        <FontAwesome name="calendar" size={24} color={'#5b3274'} />
                    </Pressable>
                </View>
                {showDatePickerCaducidad && (
                    <DateTimePicker
                        testID="dateTimePickerCaducidad"
                        value={fechaCaducidad}
                        mode="date"
                        display="default"
                        onChange={onChangeDateCaducidad}
                        minimumDate={new Date()}
                    />
                )}
                <View style={styles.viewlabels}>
                    <Text style={styles.labels}>Fecha de compra</Text>
                </View>
                <View style={styles.dateInputContainer}>
                    <TextInput
                        style={styles.inputDate}
                        value={formatDate(fechaCompra)}
                        onChangeText={(text) => handleDateInputChange(text, setFechaCompra)}
                        editable={false}
                    />
                    <Pressable onPress={() => setShowDatePickerCompra(true)} style={styles.calendarButton}>
                        <FontAwesome name="calendar" size={24} color={'#5b3274'} />
                    </Pressable>
                </View>
                {showDatePickerCompra && (
                    <DateTimePicker
                        testID="dateTimePickerCompra"
                        value={fechaCompra}
                        mode="date"
                        display="default"
                        onChange={onChangeDateCompra}
                    />
                )}
                <Text style={styles.labels}>
                    Numero de Stock
                </Text>
                <View style={styles.iconInput}>
                <Entypo name="box" size={24} color="#73488c" />
                <TextInput
                    style={styles.textInput}
                    placeholder="Número de Stock"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={stock}
                    onChangeText={handleStockChange}
                    maxLength={8}
                />
                </View>
                <Text style={styles.labels}>
                    Marca
                </Text>
                <View style={styles.iconInput}>
                <AntDesign name="tag" size={24} color="#73488c" />
                <TextInput
                    style={styles.textInput}
                    placeholder="Marca"
                    placeholderTextColor="#888"
                    value={marca}
                    onChangeText={setMarca}
                />
                </View>
                <Text style={styles.labels}>
                    Precio Compra
                </Text>
                <View style={styles.iconInput}>
                <Entypo name="price-tag" size={24} color="#73488c" />
                <TextInput
                    style={styles.textInput}
                    placeholder="Precio de Compra"
                    placeholderTextColor="#888"
                    keyboardType="decimal-pad"
                    value={precioCompra}
                    onChangeText={(text) => handleDecimalChange(text, setPrecioCompra)}
                />
                </View>
                <Text style={styles.labels}>
                    Precio Venta
                </Text>
                <View style={styles.iconInput}>
                <MaterialCommunityIcons name="account-cash-outline" size={24} color="#73488c" />
                <TextInput
                    style={styles.textInput}
                    placeholder="Precio de Venta"
                    placeholderTextColor="#888"
                    keyboardType="decimal-pad"
                    value={precioVenta}
                    onChangeText={(text) => handleDecimalChange(text, setPrecioVenta)}
                />
                </View>
                <View style={styles.viewButton}>
                <Pressable style={styles.scanner} onPress={ScannerProducts}>
                    <FontAwesome name="barcode" size={24} color="white" />
                    <Text style={styles.textScanner}>Escanear Código de Barras</Text>
                </Pressable>
                </View>
                <View style={styles.iconInputCode}>
                <TextInput 
                    style={styles.textInputCode}
                    placeholder="Código de Barras"
                    placeholderTextColor="#888"
                    value={barcode} 
                    editable={false}
                />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.botonGuardar} onPress={guardarProducto}>
                        <Text style={styles.textoBoton}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonReset} onPress={LimpiarCampos}>
                        <Text style={styles.textoBoton}>Reset</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: 60,
    },
    scroll:{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#003916', // Letras blancas
        textAlign: 'center',
        textTransform: 'uppercase', // Convertir en mayúsculas
        letterSpacing: 3, // Espaciado entre letras
        padding: 10, // Espaciado interno para que se vea mejor
        borderRadius: 10, // Bordes redondeados
    
    },
    lottie: {
        width: 200,
        height: 200,
        backgroundColor: '#fff'
    },
    textInput: {
        width: '91%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: '#000',
        marginLeft: 5,
    },
    picker: {
        width: '90%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%'
    },
    botonGuardar: {
        flex: 1,
        backgroundColor: '#73488c',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginRight: 5
    },
    botonReset: {
        flex: 1,
        backgroundColor: '#A20025',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginLeft: 5
    },
    textoBoton: {
        color: '#fff',
        fontWeight: 'bold'
    },
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    inputDate: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        width: '90%',
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#000',
    },
    calendarButton: {
        padding: 10,
        marginTop: 0,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanner: {
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#5b3274',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '97%',
        alignItems: 'center',
    },
    textScanner: {
        marginLeft: 10,
        color: '#fff',
        fontWeight: 'bold'
    },
    labels:{
        width: '100%',
        marginTop: 10,
        marginBottom: 8,
        color: 'black',
        fontSize: 18,
    },
    iconInput: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    iconInputCode: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    textInputCode: {
        width: '97%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: '#000',
    },
    viewButton:{
        width: '100%'
    },
    viewlabels:{
        width: '100%',
        marginTop: 10,
        marginBottom: 8,
        color: 'black',
        fontSize: 15,
    }
});