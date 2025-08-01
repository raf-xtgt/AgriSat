import { Text, View } from "react-native";

export default function MyFarm() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is the farm screen connected to the bottom navigation</Text>
    </View>
  );
}
