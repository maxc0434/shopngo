import { Product } from "@/type"; // On importe le type Product pour décrire les produits

const API_URL = "https://fakestoreapi.com"; // L'adresse de base de l'API

// Fonction pour récupérer tous les produits (retourne une liste de produits)
// Promesse = Promise => poursuite du code tant qu'aucune reponse n'est recu.
// Cette reponse peut avoir 3 resultats: recu, en attente, erreur.
const getProducts = async (): Promise<Product[]> => {
  try {
    // On fait un appel à l'API à l'adresse /products
    const response = await fetch(`${API_URL}/products`);

    // Si la réponse n'est pas correcte, on interrompt et on lance une erreur
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // On transforme la réponse en format JSON (liste de produits)
    return await response.json();
  } catch (error) {
    // En cas d'erreur, on affiche un message dans la console
    console.log("Error fetching products", error);
    // Et on fait remonter l'erreur
    throw error;
  }
};

const getProduct = async (id:number): Promise<Product> => {
try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.log(`Error fetching products with id ${id}:`, error);
    throw error;
  }
};

const getCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/products/categories`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.log("Error fetching products", error);
    throw error;
  }
};

const getProductsByCategory = async ( category: string ): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    if (!response.ok){
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
      console.error(`Failed to fetch products in category ${category}:`, error);
      throw error;
  }
}

const searchProductsApi = async (query: string): Promise<Product[]> => {
  try {
    const response = await fetch (`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const products = await response.json();
    const searchTerm = query.toLowerCase().trim();

    return products.filter(
      (product :Product) =>
        product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLocaleLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error("Failed to search products:", error);
    throw error;
  }
};

export { getProducts, getProduct, getCategories, getProductsByCategory, searchProductsApi };
