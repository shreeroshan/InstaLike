import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
   <Stack>
    <Stack.Screen name='signIn' options={{title:"SignIn"}}/>
    <Stack.Screen name='signUp' options={{title:"SignUp"}}/>
   </Stack>
  )
}

export default _layout