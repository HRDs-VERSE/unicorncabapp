import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                // headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarActiveTintColor: "black",
                tabBarInactiveTintColor: "black",
                tabBarStyle: {
                    backgroundColor: "white",
                    height: 60,
                    paddingTop: 2,
                },
                header: ({ navigation, route }) => (
                    <View className={`flex-row items-center ${route.name == "index" || route.name == "booking" ? "hidden" : "flex"} p-4 bg-black`}>
                        {/* Back Button (Only if there's a previous screen) */}
                        {navigation.canGoBack() && (
                            <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                                <Ionicons name="arrow-back" size={24} color="white" />
                            </TouchableOpacity>
                        )}

                        {/* Page Title */}
                        <Text className="text-lg text-white font-bold ml-4 capitalize">
                            {route.name}
                        </Text>
                    </View>
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ size, color, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="booking"
                options={{
                    tabBarIcon: ({ size, color, focused }) => (
                        <Ionicons name={focused ? "calendar" : "calendar-outline"} size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="post"
                options={{
                    tabBarIcon: ({ size, color, focused }) => (
                        <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={34} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    tabBarIcon: ({ size, color, focused }) => (
                        <Ionicons name={focused ? "chatbubble" : "chatbubble-outline"} size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ size, color, focused }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
