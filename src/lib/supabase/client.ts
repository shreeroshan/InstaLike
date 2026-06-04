import { createClient } from "@supabase/supabase-js"

const supabaseUrl=process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnnoKey=process.env.EXPO_PUBLIC_SUPABASE_ANNO_KEY!;
import AsyncStorage from '@react-native-async-storage/async-storage'

export const supabase = createClient(supabaseUrl, supabaseAnnoKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})