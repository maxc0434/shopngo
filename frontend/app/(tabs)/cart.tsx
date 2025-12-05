import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import MainLayout from "@/components/MainLayout";
import EmptyState from "@/components/EmptyState";
import { AppColors } from "@/constants/theme";
import Title from "@/components/customText";
import { Product } from "@/type";
import CartItem from "@/components/CartItem";
import Button from "@/components/Button";
import Toast from "react-native-toast-message";
import { supabase } from "@/lib/supabase";
import axios from "axios";

const CartScreen = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const subtotal = getTotalPrice();
  const shippingCost = subtotal > 100 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  // Verifie que l'utilisateur est connecté
  const handlePlaceOrder = async () => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Connexion requise",
        text2: "Connectez vous pour passer votre commande ",
        position: "bottom",
        visibilityTime: 2000,
      });
      return;
    }
    try {
      //On indique le chargement
      setLoading(true);

      //Récupérer l'adresse de livraison depuis le profil utilisateur
      const {data: profile, error: profileError} = await supabase
        .from("profiles")
        .select('"delivery_address"')
        .eq("id", user.id)
        .single();

      //Gestion du cas "profil non trouvé"
      if (profileError && profileError.code !== "PGRST116") {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Impossible de récupérer l'adresse de livraison",
          position: "bottom",
          visibilityTime: 2000,
        })
        setLoading(false);
        return;
      }

      const deliveryAddress = profile?.delivery_address || "";

      //Préparation pour insertion des données de la commande en BDD
      const orderData = {
        user_email: user.email,
        total_price: total,
        items: items.map((item) => ({
          product_id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        payment_status: "en attente",
        delivery_address: deliveryAddress,
      };

      //insertion de la commande dans la table orders
      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();
      // gestion des erreurs à l'insertion
      if (error) {
        throw new Error(`Echec de sauvegarde de la commande: ${error.message}`);
      }

      // On crée un objet "payload" qui contient les données à envoyer au serveur
      const payload = {
        price: total, // Le prix total, stocké dans la variable "total"
        email: user?.email, // L'email de l'utilisateur, si disponible
      };

      // On envoie une requête HTTP POST au serveur avec axios
      const response = await axios.post(
        "http://192.168.50.34:8000/checkout", 
        // "http://10.0.2.2:8000/checkout", 
        // "http://localhost:8000/checkout", 
        payload, // Les données à envoyer (le "payload" qu'on vient de créer)
        {
          headers: {
            "Content-Type": "application/json", // On précise qu'on envoie du JSON
          },
        }
        // Le résultat de la requête est stocké dans la variable "response"
      );

      // console.log("response", response);
      const { paymentIntent, ephemeralKey, customer} = response.data;
      // console.log("res", paymentIntent, ephemeralKey, customer);
      if(!paymentIntent || !ephemeralKey || !customer) { //verification des données Stripe
        throw new Error("Données Stripe requises manquantes depuis le serveur");
      } else { //Si toutes les données sont OK, Affichage de la confirmation de commande
        Toast.show({
          type: "success",
          text1: "Commande réussie",
          text2: "Commande passée avec succès",
          position: "bottom",
          visibilityTime: 2000,
        });
        router.push({ // navigation vers l'ecran de paiement avec les données de Stripe
          pathname: "/(tabs)/payment",
          params:{
            paymentIntent, // données de Stripe
            ephemeralKey, // données de Stripe
            customer, // données de Stripe
            orderId:data.id, // iD de la commande Supabase 
            total: total, // total de la commande
          },
        });
        clearCart(); //Vide le panier apres la commande
      }
      // gestion du cas d'erreur
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Commande échouée",
        text2: "Echec de la commande",
        position: "bottom",
        visibilityTime: 2000,
      });
      console.log("Erreur de la commande", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {items?.length > 0 ? (
        <>
          <View style={styles.headerView}>
            <View style={styles.header}>
              <Title>Produit du Panier</Title>
              <Text style={styles.itemCount}>{items?.length} Produits</Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => clearCart()}>
                <Text style={styles.resetText}>Vider le panier</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id.toString()}
            renderItem={({ item }) => (
              <CartItem product={item.product} quantity={item.quantity} />
            )}
            contentContainerStyle={styles.cartItemsContainer}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sous-Total: </Text>
              <Text style={styles.summaryValue}> {subtotal.toFixed(2)} €</Text>
            </View>
            {shippingCost > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Frais de port: </Text>
                <Text style={styles.summaryValue}>
                  {" "}
                  {shippingCost.toFixed(2)} €
                </Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total: </Text>
              <Text style={styles.summaryValue}> {total.toFixed(2)} €</Text>
            </View>
          </View>
          <Button
            title="Passer commande"
            fullWidth
            style={styles.checkoutButton}
            disabled={!user || loading}
            onPress={handlePlaceOrder}
          />
          {!user && (
            <View style={styles.alertView}>
              <Text style={styles.alertText}>
                Connectez-vous pour passer commande
              </Text>
              <Link href={"/(tabs)/login"}>
                <Text style={styles.loginText}> Connexion</Text>
              </Link>
            </View>
          )}
        </>
      ) : (
        <EmptyState
          type="cart"
          message="Votre panier est vide"
          actionLabel="Commencez vos achats"
          onAction={() => router.push("/(tabs)/shop")}
        />
      )}
    </MainLayout>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: AppColors.background.secondary,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 16,
  },

  container: {
    flex: 1,
    position: "relative",
    // backgroundColor: AppColors.background.secondary,
  },
  resetText: {
    color: AppColors.error,
  },
  headerView: {
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  header: {
    paddingBottom: 16,
    paddingTop: 7,
    backgroundColor: AppColors.background.primary,
  },
  itemCount: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.text.secondary,
    marginTop: 4,
  },
  cartItemsContainer: {
    paddingVertical: 16,
  },
  summaryContainer: {
    // position: 'absolute',
    // bottom: 200,
    // width: "100%",
    backgroundColor: AppColors.background.primary,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray[200],
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  summaryValue: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray[200],
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.text.primary,
  },
  totalValue: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: AppColors.primary[600],
  },
  checkoutButton: {
    marginTop: 16,
  },
  alertView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  alertText: {
    fontWeight: "500",
    textAlign: "center",
    color: AppColors.error,
    marginRight: 3,
  },
  loginText: {
    fontWeight: "700",
    color: AppColors.primary[500],
  },
});
