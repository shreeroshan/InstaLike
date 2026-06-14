import { supabase } from "@/lib/supabase/client";
import { createContext, ReactNode, useContext, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  profileImage?: string;
  onBoardingCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      if (!data) {
        console.error("No profile data returned");
        return null;
      }

      const authUser = await supabase.auth.getUser();

      if (!authUser.data.user) {
        console.error("No auth user found");
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        username: data.username,
        email: authUser.data.user.email || "",
        profileImage: data.profile_image,
        onBoardingCompleted: data.onBoarding_completed,
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const profile = await fetchUserProfile(data.user.id);
      setUser(profile);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const profile = await fetchUserProfile(data.user.id);
      setUser(profile);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const updateData: Record<string, any> = {};

      if (userData.name !== undefined) {
        updateData.name = userData.name;
      }

      if (userData.username !== undefined) {
        updateData.username = userData.username;
      }

      if (userData.profileImage !== undefined) {
        updateData.profile_image = userData.profileImage;
      }

      if (userData.onBoardingCompleted !== undefined) {
        updateData.onBoarding_completed = userData.onBoardingCompleted;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      setUser((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          name: data.name ?? prev.name,
          username: data.username ?? prev.username,
          profileImage: data.profile_image ?? prev.profileImage,
          onBoardingCompleted:
            data.onBoarding_completed ?? prev.onBoardingCompleted,
        };
      });
    } catch (error) {
      console.error("Error encountered while updating:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        signIn,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
