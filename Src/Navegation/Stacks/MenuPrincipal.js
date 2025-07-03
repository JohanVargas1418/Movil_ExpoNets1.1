import EventosStack from "./stacks/EventosStack";
import ProductosStack from "./stacks/ProductosStack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, Ionicons } from "@expo/vector-icons";



const Tab = createBottomTabNavigator();

export default function NavegacionPrincipal() {
    return (
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#f4340c", // color cuando está activo
            tabBarActiveTintColor: "#f4340c", // color cuando esta inactivo
            tabBarActiveTintColor: {backgroundColor: "#f4340c"}, // Fondo de la barra
          }}
        >
            <Tab.Screen name="Eventos" component={EventosStack} options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="calendar" size={24} color={color} />
                ),
            }}/>

            <Tab.Screen name="Productos" component={ProductosStack} options={{
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="hospital-o" size={24} color="red" />
                )
            }}/>
        </Tab.Navigator>
    );
}
