import { AuthProvider } from "@/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const router=useRouter()
  const isAuthenticated=false

  useEffect(()=>{
    if (!isAuthenticated){
        router.replace("/(auth)/signIn")
    }else{
      router.replace("/(tabs)")
    }
  },[])
  return (
    <AuthProvider>
        <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="(tabs)"/>
        <Stack.Screen name="(auth)"/>
        </Stack>
    </AuthProvider>
  )
}
