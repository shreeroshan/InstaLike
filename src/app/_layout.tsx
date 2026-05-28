import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const router=useRouter()
  const isAuthenticated=false

  useEffect(()=>{
    if (!isAuthenticated){
        router.replace("/(auth)/signUp")
    }else{
      router.replace("/(tabs)")
    }
  },[])
  return <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name="(tabs)"/>
    <Stack.Screen name="(auth)"/>
    </Stack>;
}
