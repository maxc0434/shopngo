import { StyleSheet, View } from "react-native";
import React from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { AppColors } from "@/constants/theme";

interface RatingProps {
  rating: number;
  count?: number;
  size?: number;
  showCount?: boolean;
}

const Rating: React.FC<RatingProps> = ({
  rating, count,
  size = 16, showCount = true,
}) => {
  const roundedRating = Math.round(rating * 2) / 2;
  
const renderStars = () => {
  const stars = [];
  const fullStars = Math.floor(roundedRating);
  const emptyStars = 5 - fullStars;

  for (let i = 1; i <= fullStars; i++) {
    stars.push(
      <AntDesign
        name="star"
        key={`star-full-${i}`}
        size={size}
        color={AppColors.accent[500]}
      />
    );
  }

  for (let i = 1; i <= emptyStars; i++) {
    stars.push(
      <MaterialIcons
        name="star-outline"
        key={`star-empty-${i}`}
        size={size}
        color={AppColors.accent[500]}
      />
    );
  }

  return stars;
};

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>
    </View>
  );
};

export default Rating;

const styles = StyleSheet.create({
  halfStarforeground: {
    position: "absolute",
  },
  halfStarOverlay: {
    position: "absolute",
    width: "50%",
    overflow: "hidden",
  },
  halfStarBackground: {
    // position: "absolute",
  },
  halfStarContainer: {
    position: "relative",
  },
  count: {
    marginLeft: 4,
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
