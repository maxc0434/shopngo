import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useStripe } from "@stripe/stripe-react-native"
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import * as Linking from "expo-linking";


    type Props = {  //interface definissant les props requises pour le composant
        paymentIntent: string; //secretKey du paymentIntent de Stripe
        ephemeralKey: string;
        customer: string; //id du client stripe
        orderId: string; 
        userEmail: string;
        onSuccess?: () => void; // fonction de callback (optionnel) en cas de succès du paiement
    }

    const StripePayment = ({ // composant personnalisé qui va gérer l'ensemble du flux StripePayment
        paymentIntent, ephemeralKey,
        customer, orderId, 
        userEmail, onSuccess
    } : Props) => {

        const { initPaymentSheet, presentPaymentSheet } = useStripe(); //extraction des fonctions principales de Stripe
        const router = useRouter();

        const returnURL = Linking.createURL("/(tabs)/orders");

        const initializePaymentSheet = async () => { // initialisation du PaymentStripe avec les paramètres recus du backend
            const {error} = await initPaymentSheet({
                paymentIntentClientSecret: paymentIntent,
                customerId: customer,
                customerEphemeralKeySecret: ephemeralKey,
                merchantDisplayName: 'ShopNGO',
                returnURL: returnURL,
            });
            if(error) {
                throw new Error (`Echec de l'initialisation de la feuille de paiement: ${error}`);
            }
        }
            const updatePaymentStatus = async () => { //maj du status de paiement dans Supabase 
                const {error} = await supabase
                .from("orders")
                .update({ payment_status: "success"})
                .eq("id", orderId)
                .select();

                if (error) {
                    throw new Error (`Echec de l'initialisation de la feuille de paiement: ${error}`);
                }
            };
            // Fonction principale qui déclenche le processus du paiement 
            const handlePayment = async () => {
                try {
                    //Etape 1: initialisation du paiement
                    await initializePaymentSheet()
                    //Etape 2: présentation de l'interface de paiement
                    const { error: presentError } = await presentPaymentSheet();
                    if(presentError) {
                        throw new Error (`Paiement échoué: ${presentError.message}`);
                    }
                    //Etape 3: mise a jour du status de commande en BDD après le succès du paiement
                    await updatePaymentStatus();
                    //Etape 4: Notification de succès et redirection
                    Alert.alert("Paiement Réussi!", "Merci pour votre commande", [
                        {
                            text: "OK",
                            onPress: () => {
                                // Appel du callback ou redirection
                                onSuccess?.() || router.push("/(tabs)/orders")
                            },
                        },
                    ]);
                } catch (error) {
                    Alert.alert("Paiement échoué");
                    console.log("Paiement échoué erreur", error);
                    
                }
            };
            
            return {
                handlePayment,
            }
        };
    

export default StripePayment

const styles = StyleSheet.create({})