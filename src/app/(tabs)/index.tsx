import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Host, Button } from '@expo/ui/jetpack-compose';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
         <Host matchContents>
      <Button onClick={() => alert('Pressed!')}>
        <Text>Press me</Text>
      </Button>
    </Host>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
