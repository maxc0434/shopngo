import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { AppColors } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import Button from "@/components/Button";

const DeliveryAddressScreen = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // const [orderId, setOrderId] = useState<string | null>(null);
  const {orderId} = useLocalSearchParams();

  // useEffect(() => {
  //   const fetchLastOrder = async () => {
  //     // recupération de la dernière commande de l'utilisateur
  //     if (!user) return; // si pas de user connecté => stop fonction
  //     setLoading(true); // demarrage du chargement
  //     const { data, error } = await supabase // requete pour récupérer la dernier commande
  //       .from("orders") // depuis table orders
  //       .select("id") // selectionne l'id de la commande
  //       .eq("user_email", user.email) // en l'associant au user qui est rattaché a cette commande
  //       .order("created_at", { ascending: false }) // et en triant les commande par ordre descendant
  //       .limit(1) // requete qui se limite a 1 reponse, donc la dernière commande
  //       .single(); // on récupère alors 1 seul objet
  //     setLoading(false); // une fois l'info récupéré, stop loading
  //     if (error) {
  //       console.log("Error:", error);
  //       Alert.alert("Erreur", "Impossible de récupérer votre commande");
  //     } else if (data) {
  //       console.log('OrderId:', data.id);
  //       //sinon on mémorise l'id de la commande
  //       setOrderId(data.id);
  //     } else {
  //       console.log('Info: Aucune commande trouvée');
  //     }
  //   };
  //   fetchLastOrder(); // Appel immédiat de la fonction dès que le composant est monté
  // }, [user]);

  const handleAddAddress = async () => {
    //fonction qui se déclenche au Press du bouton "ajouter l'adresse"
    console.log("User:", user?.id, "OrderId:", orderId);
    if (!user || !orderId) {
      Alert.alert("Erreur", "Aucune commande récente trouvée pour l'ajout d'adresse");
      return;
    }
    if (!address.trim) {
      // Vérifie que le champ n'est pas vide ou juste composé d'espace
      Alert.alert("Validation", "l'adresse ne peut pas être vide");
      return;
    }
    setLoading(true);


    const { error } = await supabase // requete pour mettre a jour l'adresse sur une commande spécifique
      .from("orders")
      .update({ delivery_address: address })
      .eq("id", orderId);

    setLoading(false);

    if (error) {
      Alert.alert("Erreur", "Impossible d'ajouter l'adresse");
    } else {
      Alert.alert("Succes", "adresse ajoutée avec succès");
      router.push('/(tabs)/orders');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.containerTitle}>
        Ajouter une adresse de Livraison
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre adresse"
        value={address}
        onChangeText={setAddress}
        multiline
        editable={!loading}
      />
      <Button
        onPress={handleAddAddress}
        title={loading ? "chargement..." : "ajouter l'adresse"}
        fullWidth
        style={styles.button}
      />
    </View>
  );
};

export default DeliveryAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: AppColors.background.primary,
  },
  containerTitle: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 100,
    borderColor: AppColors.gray[300],
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 16,
  },
});
