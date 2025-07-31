///<reference types="nativewind/types" />
import { Text, View, ImageBackground, TouchableOpacity, StatusBar, Dimensions } from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const { height } = Dimensions.get("window");
  useEffect(() => {
    // Navigate to home after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/(tabs)/home");
    }, 3000);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require("../assets/images/LandingScreen.png")}
        resizeMode="cover"
        className="flex-1"
        
      >
        <View style={{ height: height * 1 }}>
        </View>
      </ImageBackground>
    </View>
  );
}
