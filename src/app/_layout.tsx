import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

function RouteGuard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  const inAuthGroup = segments[0] === "(auth)";
  const inTabsGroup = segments[0] === "(tabs)";

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      if (!inAuthGroup) {
        router.replace("/(auth)/signIn");
      }
    } else {
      if (!inTabsGroup) {
        router.replace("/(tabs)");
      }
    }
  }, [user, segments, router, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

function RootLayoutContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return <RouteGuard />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
