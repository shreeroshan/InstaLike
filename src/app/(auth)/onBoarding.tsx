import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import * as ImagePicker from "expo-image-picker"

export default function SignUpScreen(){

  const [name,setName]=useState('')
  const [username,setUsername]=useState("")

  const [loading, setLoading]=useState(false)
  const router=useRouter()
  const [profileImage,setProfileImage]=useState<string | null>(null)
  const handleComplete=()=>{

  }
  // const cameraOption=()=>{}
  const showOptions=async()=>{
    Alert.alert("Select Profile image.","Choose an option",[
      // {"text":"Camera", onPress:cameraOption},
      {"text":"Galary", onPress:pickImage},
      {"text":"Cancel", style:"cancel"}
    ])
  }
  const pickImage=async()=>{
    const {status}= await ImagePicker.getMediaLibraryPermissionsAsync()
    if (status!=="granted"){
      Alert.alert(
        "Permission needed",
        "We need  camera roll persmissions to select a profile image"
      )
      return ; 
    }
    const result= await ImagePicker.launchImageLibraryAsync({
      mediaTypes:['images'],
      allowsEditing:false,
      aspect:[1,1],
      quality:0.8
    }
    )
    if(!result.canceled && result.assets[0]){
      setProfileImage(result.assets[0].uri)
    }
    console.log(result)
  }
    return (
        <SafeAreaView edges={['top',"bottom"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete your profile</Text>
          <Text style={styles.subtitle}>
            Add your informatiion to get started.
          </Text>
        </View>
          <View style={styles.form}>
            <TouchableOpacity style={styles.imageContainer} onPress={showOptions}>
             {profileImage?(<Image 
             source={{uri:profileImage}}
             style={styles.profileImage}
             />): (<View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>+</Text>
              </View>)}
              <View style={styles.editBadge}>
                <Text style={styles.editText}>Edit</Text>
              </View>
            </TouchableOpacity>

             <TextInput 
                        placeholder='Full name'
                        placeholderTextColor={"#999"}                       
                        autoCapitalize='none'
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
              />
             <TextInput 
                        placeholder='Username'
                        placeholderTextColor={"#999"}                        
                        autoCapitalize='none'
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
              />
          </View>
           <TouchableOpacity style={styles.button}onPress={handleComplete}>
                        {loading ? (
                          <ActivityIndicator size={24} color="#fff"/>
                        ):( <Text style={styles.buttonText} >Complete Profile</Text>)}
                        </TouchableOpacity>
                      <TouchableOpacity style={styles.linkButton} onPress={()=>{router.push("/(auth)/signIn")}} >
                      </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

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
  header:{
    marginBottom:32
  },
  form:{
    width:"100%",
    alignItems:"center"
  },
  input:{
    backgroundColor:"#f5f5f5",
    borderRadius:12,
    padding:16,
    borderWidth:1,
    fontSize:16,
    width:"100%",
    marginBottom:16,
    borderColor:"#e0e0e0"
  },
  profileImage:{
    width:120,
    height:120,
    borderRadius:60
  },
  button:{
    backgroundColor:"#000",
    borderRadius:12,
    padding:16,
    alignItems:"center"

  },
  editText:{
    fontSize:16,
    color:"white"
  },
  buttonText:{
        color:"white",
        fontSize:16,
        fontWeight:"600"
  },
  imageContainer:{
    marginBottom:32,
    position:"relative"
  },
  placeholderImage:{
    width:120,
    height:120,
    backgroundColor:"#f5f5f5",
    borderRadius:60,
    justifyContent:"center",
    alignItems:"center",
    borderWidth:2,
    borderColor:"#e0e0e0",
    borderStyle:"dashed",
    position:"relative"
  },
  placeholderText:{
    fontSize:48,
    color:"#999"
  },
  editBadge:{
    position:"absolute",
    bottom:0,
    right:0,
    backgroundColor:"#000",
    paddingHorizontal:12,
    paddingVertical:6,
    borderRadius:16,
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