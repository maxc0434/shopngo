import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { AppColors } from "@/constants/theme";

const Logo = () => {
  // router : permet la navigation entre les pages/composant
  const router = useRouter();
  return (
    // TouchableOpacity : conteneur qui rend son contenu cliquable et fond le "bouton" dans le background
    <TouchableOpacity style={styles.logoView} onPress={() => router.push("/")}>
      {/* MaterialIcons : element de la librairie d'icones sur expo */}
      <MaterialIcons
        name="shopping-cart"
        size={25}
        color={AppColors.primary[700]}
      />
      <Text style={styles.logoText}> ShopNGo</Text>
    </TouchableOpacity>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logoView: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 20,
    marginLeft: 2,
    fontFamily: "Inter-Bold",
    color: AppColors.primary[700],
  },
});
