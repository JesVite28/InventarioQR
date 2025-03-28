//IMPORTACIONES
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

//importaciones para navegacion
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//rutas de los tabs y stacks
import Register from './components/RegisterProducts';
import Scanner from './components/ScannerProducts';
import ScannerRegister from './components/ScannerRegister';
import { BarcodeProvider } from './components/BarCodeContext';

//Iconos de la app
import { FontAwesome } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; 

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

//navegacion principal entre pantallas 
function RegisterStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RegisterProducts" component={Register} />
      <Stack.Screen name="ScannerRegister" component={ScannerRegister} />
    </Stack.Navigator>
  );
}


//TABS DE NAVEGACION ENTRE PANTALLAS 
export default function App() {
  return (
    <BarcodeProvider>
      <StatusBar style="auto" backgroundColor="#000"  />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string = '';
              let IconComponent: any = FontAwesome;

              if (route.name === 'Registro') {
                iconName = 'wpforms';
              } else if (route.name === 'Escanear producto') {
                iconName = 'barcode-scan';
                IconComponent = MaterialCommunityIcons;
              }

              return <IconComponent name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#6200ee',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Registro" component={RegisterStack} />
          <Tab.Screen name="Escanear producto" component={Scanner} />
        </Tab.Navigator>
      </NavigationContainer>
    </BarcodeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
});
