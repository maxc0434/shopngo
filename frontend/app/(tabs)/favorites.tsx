import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router, useRouter } from "expo-router";
import { useFavoritesStore } from "@/store/favoriteStore";
import HomeHeader from "@/components/HomeHeader";
import { AppColors } from "@/constants/theme";
import Wrapper from "@/components/Wrapper";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";


const navigateToProducts = () => {
  router.push("/(tabs)/shop")
}

const FavoritesScreen = () => {
  const router = useRouter();
  const { favoriteItems, resetFavorite } = useFavoritesStore();

  if(favoriteItems?.length === 0) {
    return <Wrapper>
      <HomeHeader/>
      <EmptyState
        type="favorites"
        message="Vous n'avez pas ajouté de produits en favoris"
        actionLabel="Browse products"
        onAction={navigateToProducts}
      />
    </Wrapper>
  }

return (
    <View style={{flex: 1}}>
      <HomeHeader />
        {favoriteItems?.length > 0 && (
      <Wrapper>
          <View style={styles.headerView}>
            <View style={styles.header}>
              <Text style={styles.title}>Mes favoris</Text>
              <Text style={styles.itemCount}>{favoriteItems?.length} Produits</Text>
            </View>
            <View>
              <TouchableOpacity
              onPress={() => resetFavorite()}
              >
                <Text style={styles.resetText}>Réinitialiser</Text>
              </TouchableOpacity>
            </View>
            </View>
               <FlatList
               data={favoriteItems}
               keyExtractor={(item)=>item.id.toString()}
                numColumns={2}
                renderItem={({item}) =>(
                 <View style={styles.productContainer}>
                      <ProductCard product={item} customStyle={{width: '100%'}} />
                 </View>
                )}
                // Style de la grille principale
                contentContainerStyle={styles.productsGrid}
                // Espacement entre les colonnes
                columnWrapperStyle={styles.columnWrapper}
                // Masque la barre de défilement verticale
                showsVerticalScrollIndicator={false}
                // Marge en bas de la liste
                ListFooterComponent={<View style={styles.footer} />}

                />
      </Wrapper>
      )}
    </View>
  );
};



export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  headerView: {
    paddingBottom: 5,
    backgroundColor: AppColors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  header: {},
  resetText: {
    color: AppColors.error,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: AppColors.text.primary,
  },
  itemCount: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.text.secondary,
    marginTop: 2,
  },
  productsGrid: {
    paddingTop: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productContainer: {
    width: "48%",
  },
  footer: {
    height: 100,
  },
});
