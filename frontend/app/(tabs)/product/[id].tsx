import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"; // Import des composants de base React Native
import React, { useEffect, useState } from "react"; // Import de React et des hooks pour la gestion d'état et effets
import { useLocalSearchParams, useRouter } from "expo-router"; // Hook Expo Router pour récupérer les paramètres de l'URL locale
import CommonHeader from "@/components/CommonHeader"; // Import d'un composant d'en-tête commun
import { AppColors } from "@/constants/theme"; // Import des constantes de couleurs de thème
import { Product } from "@/type"; // Import du type Product pour typer les données produit
import { getProduct } from "@/lib/api"; // Import de la fonction pour récupérer un produit depuis l'API
import LoadingSpinner from "@/components/LoadingSpinner";
import Button from "@/components/Button";

const { width } = Dimensions.get("window");

// Composant écran pour afficher un produit unique
const SingleProductScreen = () => {
  // Récupération de l'id du produit depuis les paramètres locaux de navigation
  const { id } = useLocalSearchParams<{ id: string }>();

  // State pour stocker le produit récupéré, ou null si non chargé
  const [product, setProduct] = useState<Product | null>(null);

  // State pour indiquer si les données sont en cours de chargement
  const [loading, setLoading] = useState(false);

  // State pour stocker un message d'erreur éventuel
  const [error, setError] = useState<string | null>(null);

  // State pour la quantité sélectionnée du produit (initialisée à 1)
  const [quantity, setQuantity] = useState(1);

  const idNum = Number(id);

  const router = useRouter();

  // Effet déclenché à chaque changement d'id pour récupérer les données du produit
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true); // Activer le loader avant la requête
        const data = await getProduct(idNum); // Appel API pour récupérer produit selon id
        setProduct(data); // Mise à jour du produit dans le state
        setError(null); // Réinitialiser l'erreur en cas de succès
      } catch (error) {
        setError("Failed to fetch product data"); // Message d'erreur en cas d'échec
      } finally {
        setLoading(false); // Désactiver le loader à la fin de la requête
      }
    };

    // Lancer la récupération uniquement si l'id est défini
    if (id) {
      fetchProductData();
    }
  }, [id]); // Déclencheur quand l'id change
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner fullScreen />
      </View>
    );
  }
  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Produit introuvable"}</Text>
        <Button
          title="Retour"
          onPress={() => router.back()}
          style={styles.errorButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.headerContainerStyle}>
      <CommonHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product?.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.productInfo}>
            <Text style={styles.category}>
                {product?.category?.charAt(0).toUpperCase() + product?.category.slice(1)}
            </Text>
            <Text style={styles.title}>{product?.title}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SingleProductScreen;

// Styles du composant avec StyleSheet de React Native
const styles = StyleSheet.create({
  addToCartButton: {
    width: "50%",
  },
  totalPrice: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: AppColors.text.primary,
  },
  headerContainerStyle: {
    paddingTop: 30,
    backgroundColor: AppColors.background.primary,
  },
  errorButton: {
    marginTop: 8,
  },
  errorText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: AppColors.error,
    textAlign: "center",
    marginBottom: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  footer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: AppColors.background.primary,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray[200],
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: AppColors.text.primary,
    paddingHorizontal: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.background.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.text.primary,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  description: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: AppColors.text.secondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray[200],
    // marginVertical: 16,
    marginBottom: 16,
  },
  price: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: AppColors.primary[600],
    marginBottom: 16,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  category: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.text.secondary,
    marginBottom: 8,
    textTransform: "capitalize",
  },
  productInfo: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    paddingTop: 10,
    backgroundColor: AppColors.background.secondary,
  },
  productImage: {
    width: "80%",
    height: "80%",
  },
  imageContainer: {
    width: width,
    height: width,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
    position: "relative",
  },
});
