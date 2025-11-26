import { Product } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand"; 
import { createJSONStorage, persist } from "zustand/middleware";

// interface qui représente 1 article dans tout le panier
interface CartItem {
    product: Product;
    quantity: number;
}

// interface qui définit la forme du Panier et toutes les actions possible d'effectuer
interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getItemCount: () => number;
}

// Hook pour gérer l'état du panier 
export const useCartStore=create<CartState>()(
    persist( //=>middleware: sauvegarde l'état du panier dans le stockage ("asyncStorage")
        (set,get) => ({  //methode set et get
            items: [], // etat initial du panier -> panier vide
            addItem: (product: Product, quantity: number = 1) => { //ajoute un produit au panier et donc met automatiquement la quantité a 1
                set((state) => { // mise a jour de l'état
                    const existingItem = state.items.find( //vérifie si le produit est dans le panier
                        (item) => item.product.id === product.id
                    );
                    if (existingItem) { // Si le produit est déja présent dans le panier ...
                        return {
                            items: state.items.map((item) => // (...map sur tous les articles déja présent dans la panier...)
                            item.product.id === product.id // (... s'il existe...)
                                ? {...item, quantity: item.quantity + quantity} // créer un nouvel objet article en ajoutant une quantité 1  
                                : item // mais tous les autres articles restent à la même quantité
                            ),
                        };
                    } else {
                        return {
                            items: [...state.items, {product, quantity}], // s'il n'existe pas, ajoute ce nouvel article dans le panier a quantité 1
                        }
                    }
                });
            },
            removeItem: (productId: number) => { //supprimer un produit du panier a partir de son id
                set((state) => ({ // mise a jour de l'état du panier
                    items: state.items.filter((item) => item.product.id !== productId), // créer un nouveau tableau items en gardant seulement les produits dont l'id est !== de celui que je veux supprimer
                }));
            },
            updateQuantity: (productId: number, quantity: number) => { // mise a jour de la quantité total d'un produit
                if (quantity <= 0) { // si la quantité du produit est inférieur ou égal a 0,
                    get().removeItem(productId); // on supprime l'article en appelant removeItem
                    return;
                }
                set((state) => ({ //sinon on met a jour la quantité de l'article ciblé
                    items: state.items.map((item) => //on créer un nouveau tableau d'items avec les mêmes articles dedans  
                    item.product.id === productId ? { ...item, quantity} : item // mais dans lequel on met à jour la quantité de l'article ciblé
                ),
                }));
            },
            clearCart: () => {
                set({ items: [] }); // on vide la tableau
            },
            getTotalPrice: () => { 
                return get().items.reduce( // reduce: permet ici de boucler sur les quantités de produits ET les prix
                    (total, item) => total + item.product.price * item.quantity, // affiche le prix total du panier
                    0 // en commencant de 0
                );
            },
            getItemCount: () => {
                return get().items.reduce( // reduce: permet ici de boucler sur la quantité total des articles présents dans le panier
                    (total, item) => total + item.quantity,
                    0
                );
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);