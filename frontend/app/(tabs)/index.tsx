import HomeHeader from "@/components/HomeHeader";
import { useState } from "react";
import { View, StyleSheet } from "react-native";

export default function HomeScreen() {
  // featuredProducts : state pour les produits favoris
  const [featuredProducts, setFeaturedProducts] = useState([]);
  return (
    
      <View>
        <HomeHeader/>
      </View>
  );
}

const styles = StyleSheet.create({});
