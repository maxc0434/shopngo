import { StyleSheet, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "@/constants/theme";

// sert de conteneur sûr pour l'affichage de contenu
const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    // Prend en compte les zones a éviter sur les différents appareils
    <SafeAreaView style={styles.safeView}> 
    {/* Vue principale contenant le contenu enfant */}
        <View style={styles.container}>
            {children}
            {/* Affiche dynamiquement tout ce que le wrapper enveloppe */}
        </View>
    </SafeAreaView>
  );
};

export default wrapper;

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
