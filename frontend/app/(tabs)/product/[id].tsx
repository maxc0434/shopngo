import { StyleSheet, Text, View } from 'react-native'; // Import des composants de base React Native
import React, { useEffect, useState } from 'react'; // Import de React et des hooks pour la gestion d'état et effets
import { useLocalSearchParams } from 'expo-router'; // Hook Expo Router pour récupérer les paramètres de l'URL locale
import CommonHeader from '@/components/CommonHeader'; // Import d'un composant d'en-tête commun
import { AppColors } from '@/constants/theme'; // Import des constantes de couleurs de thème
import { Product } from '@/type'; // Import du type Product pour typer les données produit
import { getProduct } from '@/lib/api'; // Import de la fonction pour récupérer un produit depuis l'API


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

    // Effet déclenché à chaque changement d'id pour récupérer les données du produit
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true); // Activer le loader avant la requête
                const data = await getProduct(Number(id)); // Appel API pour récupérer produit selon id
                setProduct(data); // Mise à jour du produit dans le state
                setError(null);   // Réinitialiser l'erreur en cas de succès
            } catch (error) {
                setError('Failed to fetch product data'); // Message d'erreur en cas d'échec
            } finally {
                setLoading(false); // Désactiver le loader à la fin de la requête
            }
        };

        // Lancer la récupération uniquement si l'id est défini
        if (id) {
            fetchProductData();
        }
    }, [id]); // Déclencheur quand l'id change

    // Logging console du produit récupéré (pour debug)
    console.log('Product data:', product);

    // Rendu JSX minimaliste pour l'instant (affiche juste un header)
    return (
        <View style={styles.headerContainerStyle}>
            <CommonHeader />
        </View>
    );
};

export default SingleProductScreen;

// Styles du composant avec StyleSheet de React Native
const styles = StyleSheet.create({
    headerContainerStyle: {
        paddingTop: 30, // Ajout d'un padding au-dessus
        backgroundColor: AppColors.background.primary, // Couleur de fond selon thème
    },
});
