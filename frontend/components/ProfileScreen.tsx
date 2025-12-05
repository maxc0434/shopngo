import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { AppColors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import Button from "./Button";
import Toast from "react-native-toast-message";

const ProfileScreen = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if(!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error} = await supabase
        .from("profiles")
        .select("full_name, delivery_address, phone")
        .eq("id", user.id)
        .single();

      setLoading(false);

      if (error && error.code !== "PGRST116") {
        Alert.alert("Erreur", "Impossible de charger le profil");
      } else if (data) {
        setFullName(data.full_name || "");
        setDeliveryAddress(data.delivery_address || "");
        setPhone(data.phone || "");
      }
    };
    fetchProfile();
  }, [user]);


  const saveProfile = async () => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Utilisateur non connecté",
        visibilityTime: 2000,
      })
      return;
    }
      console.log("test Formulaire", {fullName, deliveryAddress, phone, userId:user.id});

    setLoading(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      delivery_address: deliveryAddress,
      phone: phone,
      updated_at: new Date().toISOString(),
    });
    setLoading(false);
    if (error) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible de sauvegarder le profil",
        visibilityTime: 2000,
      });
    } else {
      Toast.show({
        type: "success",
        text1: "Succès",
        text2: "Profil mis a jour avec succès",
        visibilityTime: 2000,
      });
      router.push('/(tabs)/profile');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonflex}>

      <Text style={styles.label}> Nom Complet </Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Votre nom complet"
        />
      <Text style={styles.label}> Adresse de Livraison </Text>
      <TextInput
        style={styles.input}
        value={deliveryAddress}
        onChangeText={setDeliveryAddress}
        placeholder="Votre adresse de livraison"
        />
      <Text style={styles.label}> Votre Téléphone </Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Votre numéro de téléphone"
        keyboardType="phone-pad"
        />
      </View>
      <Button 
        title={loading ? "Sauvegarde..." : "Sauvegarder le profil"}
        onPress={saveProfile}
        disabled={loading}
        style={styles.button}
        />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: AppColors.background.primary,
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.gray[300],
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  button: {
    marginTop: 10,
  },
  buttonflex: {
    flex: 1
  },
});
