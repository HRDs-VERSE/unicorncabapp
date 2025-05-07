import { create } from "zustand"
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

interface AuthStore {
    user: any;
    token: string | null;
    setUser: (user: any) => Promise<void>;
    setToken: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    
    setUser: async (user: any) => {
        await AsyncStorage.setItem('user', JSON.stringify(user))
        set({ user })
    },

    setToken: async (token: string) => {
        await SecureStore.setItemAsync('token', token)
        set({ token })
    },

    logout: async () => {
        await AsyncStorage.removeItem('user')
        await SecureStore.deleteItemAsync('token')
        set({ user: null, token: null })
    },

    initialize: async () => {
        try {
            const [storedUser, storedToken] = await Promise.all([
                AsyncStorage.getItem('user'),
                SecureStore.getItemAsync('token')
            ])

            if (storedUser) {
                set({ user: JSON.parse(storedUser) })
            }

            if (storedToken) {
                set({ token: storedToken })
            }
        } catch (error) {
            console.error('Error loading auth data from storage:', error)
        }
    }
}))
