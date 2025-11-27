// Importe le framework Express pour créer un serveur HTTP facilement
import express from "express";

// Charge automatiquement les variables d'environnement définies dans un fichier .env
import "dotenv/config";

// Importe le middleware CORS pour autoriser les requêtes provenant d'autres origines (front-end différent, etc.)
import cors from "cors";


// Crée une instance de l'application Express
const app = express();

// Définit le port du serveur : on prend d'abord la variable d'environnement PORT, sinon 8000 par défaut
const PORT = process.env.PORT || 8000;

// Active le middleware CORS pour toutes les routes de l'application
app.use(cors());

// Indique à Express de parser automatiquement le corps des requêtes au format JSON
app.use(express.json());


// Déclare une route GET sur la racine "/" du serveur
// Quand un client fait une requête GET sur "/", on renvoie le texte "ON A EU LES DROITS !"
app.get("/", (req, res) => {
    res.send("ON A EU LES DROITS !");
});

// Démarre le serveur HTTP et l'écoute sur le port défini plus haut
// Quand le serveur est prêt, on affiche un message dans la console
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
