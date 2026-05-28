import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

const signUp = () => {
  const router=useRouter()
  return (
    <SafeAreaView edges={['top',"bottom"]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>Sign Up to get started</Text>

        <View style={styles.form}>
            <TextInput 
            placeholder='email'
            placeholderTextColor={"#999"}
            autoComplete='email'
            keyboardType='email-address'
            autoCapitalize='none'
            style={styles.input}
            />
            <TextInput 
            placeholder='password'
            placeholderTextColor={"#999"}
            autoComplete='password'
            secureTextEntry
            autoCapitalize='none'
            style={styles.input}
            />
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Sign Up</Text></TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={()=>{router.push("/(auth)/signIn")}} ><Text style={styles.linkButtonText}>Alreday have an account? <Text style={styles.linkButtonTextBold}>Sign In</Text></Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default signUp

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content:{
    flex:1,
    justifyContent:"center",
    padding:24
  },
  title:{
    fontSize:32,
    fontWeight:"bold",
    marginBottom:8,
  },
  subtitle:{
    fontSize:16,
    marginBottom:32,
    color:"#666 "
  },
  form:{
    width:"100%"
  },
  input:{
    backgroundColor:"#f5f5f5",
    borderRadius:12,
    padding:16,
    borderWidth:1,
    fontSize:16,
    marginBottom:16,
    borderColor:"#e0e0e0"
  },
  button:{
    backgroundColor:"#000",
    borderRadius:12,
    padding:16,
    alignItems:"center"

  },
  buttonText:{
        color:"white",
        fontSize:16,
        fontWeight:"600"
  },
  linkButton:{
    marginTop :16,
    alignItems:"center"
  },
  linkButtonText:{
   color:"#666",
   fontSize:14
  },
  linkButtonTextBold:{
   color:"#000",
   fontWeight:"600"
  },
});