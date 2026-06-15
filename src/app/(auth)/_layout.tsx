import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function AuthLayout(){
  return (
   <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name='signIn' options={{title:"SignIn"}}/>
    <Stack.Screen name='signUp' options={{title:"SignUp"}}/>
   </Stack>
  )
}
