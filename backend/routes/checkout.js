import { Router } from "express";


const router = Router()

// Pour démarrer une session de paiement STRIPE
router.post("/checkout", async (req, res) => {
    // Extraction des données envoyées dans le corps de la requête
    const reqBody = await req.body;
    const {email, price} = reqBody;

    //Validation du prix doit etre un nombre positif Valide 
    if(typeof price !== "number" || isNaN(price) || price <=0) { 
        return res.status(400).send({
            success: false,
            message: "valeur de prix invalide",
        });
    }
    // Conversion du prix en centimes
    const amountInCents = Math.round(price*100);

    try{
        //création d'un nouveau client stripe sans autres données supplémentaires
        const customer = await stripe.customers.create();
        //création d'une clé ephemere pour le client. Utile pour Stripe Mobile SDK
        const ephemeralKey = await stripe.ephemeralKey.create(
            {
                customer: customer.id,
            },
            {
                apiVersion: "2025-09-30.clover"
            });
        //création d'une tentative de paiement avec les données fournies.
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "EUR",
            customer: customer.id,
            automatic_payment_methods: {  //active les méthodes de paiement automatique proposées par stripe
                enabled: true,
            },
            receipt_email: email, //email où le recu de paiement est envoyé 
            description:`Commande de ${email}`, //description du paiement
            metadata: { 
                email: email 
            }
        });
        // Reponse http 200 avec infos nécessaires pour finaliser le paiement coté client
        return res.status(200).send({
            success: true,
            message: 'Session de paiement crée avec succès !',
            payementIntent: payementIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
        });
    }catch (error) {
        //gestion d'erreur, log serveur et reponse http 500
        console.log("Error:", error);
        return res.status(500).send({
            success: false,
            message: "paiement échoué",
        });
    }
});

export default router;