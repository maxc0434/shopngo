import { supabase } from "@/lib/supabase";
import { create } from "zustand";

// Interface représentant un utilisateur authentifié
export interface User {
  id: string; // Identifiant unique de l'utilisateur (généré par Supabase)
  email: string; // Email de l'utilisateur
}

// Interface définissant l'état global d'authentification
interface AuthState {
  user: User | null; // Utilisateur connecté (null si déconnecté)
  isLoading: boolean; // Indicateur de chargement (pendant connexion/déconnexion)
  error: string | null; // Message d'erreur en cas d'échec d'authentification

  // Fonctions d'authentification
  signup: (email: string, password: string) => Promise<void>; // Inscription
  login: (email: string, password: string) => Promise<void>; // Connexion
  logout: () => Promise<void>; // Déconnexion
  checkSession: () => Promise<void>; // Vérification de la session
}

// Création du store Zustand pour la gestion d'état d'authentification
export const useAuthStore = create<AuthState>((set) => ({
  user: null, // Initialement, aucun utilisateur n'est connecté
  isLoading: false, // Aucune opération en cours au démarrage
  error: null, // Aucune erreur au démarrage

  // Fonction de connexion (email + mot de passe)
  login: async (email: string, password: string) => {
    try {
      // On active le chargement et on réinitialise l'erreur
      set({ isLoading: true, error: null });

      // Appel à Supabase pour la connexion
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Si une erreur est retournée, on la lance pour être attrapée dans le catch
      if (error) throw error;

      // Si la connexion réussit, on met à jour l'état avec les infos utilisateur
      if (data && data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email || "",
          },
          isLoading: false,
        });
      }
    } catch (error: any) {
      // En cas d'erreur, on affiche le message et on arrête le chargement
      set({ error: error.message, isLoading: false });
    }
  },

  // Fonction d'inscription (email + mot de passe)
  signup: async (email: string, password: string) => {
    try {
      // On active le chargement et on réinitialise l'erreur 0 puisqu'il n'y en a pas (ou pas encore)
      set({ isLoading: true, error: null });

      // Appel à Supabase pour l'inscription
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      // Si une erreur est retournée, on la lance pour être attrapée dans le catch
      if (error) throw error;

      // Si l'inscription réussit, on met à jour l'état avec les infos utilisateur
      if (data && data.user) {
        set({
          user: { id: data.user.id, email: data.user.email || "" },
          isLoading: false,
        });
      }
    } catch (error: any) {
      // En cas d'erreur, on affiche le message et on arrête le chargement
      set({ error: error.message, isLoading: false });
    }
  },

  // Fonction de déconnexion
  logout: async () => {
    try {
      // On active le chargement et on réinitialise l'erreur
      set({ isLoading: true, error: null });

      // Appel à Supabase pour la déconnexion
      const { error } = await supabase.auth.signOut();

      // Si une erreur est retournée, on la lance pour être attrapée dans le catch
      if (error) throw error;

      // On met à jour l'état : utilisateur déconnecté. Réinitialisation du store à l'état déconnecté.
      set({ user: null, isLoading: false });
    } catch (error: any) {
      // En cas d'erreur, on affiche le message et on arrête le chargement
      set({ error: error.message, isLoading: false });
    }
  },

  // Fonction pour vérifier que la session est en cours (ex: au chargement de l'app, refresh du token )
  checkSession: async () => {
    try {
      // On active le chargement et on réinitialise l'erreur
      set({ isLoading: true, error: null });

      // Appel à Supabase pour récupérer la session active
      const { data, error } = await supabase.auth.getSession();

      // Si une erreur est retournée, on la lance pour être attrapée dans le catch
      if (error) throw error;

      // Si une session existe, on met à jour l'état avec les infos utilisateur
      if (data && data.session) {
        const { user } = data.session;
        set({
          user: {
            id: user.id,
            email: user.email || "",
          },
          isLoading: false,
        });
      } else {
        // Sinon, on met à jour l'état : utilisateur non connecté
        set({ user: null, isLoading: false });
      }
    } catch (error: any) {
      // En cas d'erreur, on affiche le message et on arrête le chargement
      set({ user: null, error: error.message, isLoading: false });
    }
  },
}));
