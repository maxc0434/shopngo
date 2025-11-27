import Stripe from "stripe";

// Vérification que la clé secrete STRIPE est définie dans les variable d'environnement (.env)
// Cette clé est nécessaire pour authentifier les requetes vers l'API Stripe.
if (!process.env.STRIPE_SECRET_KEY){
    throw new Error("STRIPE_SECRET_KEY is not defined");
}

//initialisation d'une instance stripe avec la secret key, 
//La version de l'API stripe est specifié explicitement :
//cela garantie que les appels a l'API utilisent CETTE version de l'API même si l'API évolue.
const stripe = new Stripe( process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-09-30.clover", //"2025-04-30.basil" si besoin
});

export default stripe