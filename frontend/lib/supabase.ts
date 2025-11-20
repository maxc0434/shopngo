import {
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY,
} from "@/config"; // Import des variables d'environnement pour Supabase

import { createClient } from "@supabase/supabase-js"; // Import de la fonction pour créer un client Supabase
import * as SecureStore from "expo-secure-store"; // Import du module SecureStore d'Expo pour stocker des données sécurisées
import { Platform } from "react-native"; // Import pour détecter la plateforme d'exécution (web ou mobile)

// Adaptateur pour gérer le stockage sécurisé selon la plateforme utilisée
const ExpoSecureStoreAdapter = {
  // Récupère un item selon la plateforme (localStorage pour web, SecureStore pour mobile)
  getItem: (key: string) => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },

  // Définit un item dans le stockage selon la plateforme
  setItem: (key: string, value: string) => {
    if (Platform.OS === "web") {
      return localStorage.setItem(key, value);
    }
    return SecureStore.setItemAsync(key, value);
  },

  // Supprime un item dans le stockage selon la plateforme
  removeItem: (key: string) => {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

// Récupère l'URL et la clé anonyme Supabase depuis les variables d'environnement
const supabaseUrl = EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// Création du client Supabase avec configuration personnalisée
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter, // Utilisation de l'adaptateur pour le stockage sécurisé des tokens
    autoRefreshToken: true,          // Rafraîchissement automatique du token d'authentification
    persistSession: true,            // Persistance de la session utilisateur (login l'utilisateur et garde la session ouverte)
    detectSessionInUrl: false,       // Désactivation de la détection automatique dans l'URL (utile pour React Native)
  },
  realtime: {
    transport: undefined,             // Désactivation des transports en temps réel (optionnel selon l'usage)
  }
});
