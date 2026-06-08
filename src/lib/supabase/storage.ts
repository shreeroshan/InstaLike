import {File} from "expo-file-system"
import { supabase } from "./client"

export const uploadProfileImage=async(userId:string, imgUri:string)=>{
    try{
        const fileExtension=imgUri.split(".").pop() || "jpg"
        const fileName=`${userId}/profile.${fileExtension}`
        const file= new File(imgUri)
        const bytes= await file.bytes()

        const {error}=await supabase.storage
        .from("profiles")
        .upload(fileName,bytes,{
            contentType:`image/${fileExtension}`,
            upsert:true
        })
        if(error){
            throw error
        }

        const {data:urlData}= await supabase.storage
        .from("profiles")
        .getPublicUrl(fileName)

        return urlData.publicUrl
    } catch(error){
        console.log("Error uploading the images...",error)
        throw error;
    }
}