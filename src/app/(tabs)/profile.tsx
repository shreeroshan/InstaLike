import { useAuth } from "@/context/AuthContext";
import { uploadProfileImage } from "@/lib/supabase/storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedUsername, setEditedUsername] = useState(user?.username || "");
  const [editedProfileImage, setEditedProfileImage] = useState<string | null>(
    null,
  );

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "We need camera roll permissions to select a photo.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length) {
        setEditedProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Unable to open the image picker.");
    }
  };

  const handleSaveProfile = async () => {
    if (!editedName.trim() || !editedUsername.trim()) {
      Alert.alert("Validation", "Name and username cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      let profileImageUrl = user?.profileImage;

      if (editedProfileImage && editedProfileImage !== user?.profileImage) {
        profileImageUrl = await uploadProfileImage(
          user?.id || "",
          editedProfileImage,
        );
      }

      await updateUser({
        name: editedName,
        username: editedUsername,
        profileImage: profileImageUrl,
      });

      setEditModalVisible(false);
      setEditedProfileImage(null);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true);
            await logout();
            router.replace("/(auth)/signIn");
          } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </Text>
              </View>
            )}
          </View>

          {/* User Info */}
          <View style={styles.userInfoSection}>
            <Text style={styles.userName}>{user?.name || "User"}</Text>
            <Text style={styles.userHandle}>
              @{user?.username || "username"}
            </Text>
            <Text style={styles.userEmail}>{user?.email || ""}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setEditedName(user?.name || "");
                setEditedUsername(user?.username || "");
                setEditedProfileImage(null);
                setEditModalVisible(true);
              }}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Privacy & Security</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>About</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.closeButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity
                onPress={handleSaveProfile}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.saveButton,
                    isLoading && styles.saveButtonDisabled,
                  ]}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              {/* Profile Image Editor */}
              <View style={styles.imageEditSection}>
                {editedProfileImage ? (
                  <Image
                    source={{ uri: editedProfileImage }}
                    style={styles.editAvatar}
                  />
                ) : user?.profileImage ? (
                  <Image
                    source={{ uri: user.profileImage }}
                    style={styles.editAvatar}
                  />
                ) : (
                  <View style={[styles.editAvatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarInitial}>
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.changePhotoButton}
                  onPress={handlePickImage}
                >
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your name"
                  placeholderTextColor="#999"
                  value={editedName}
                  onChangeText={setEditedName}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Username</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your username"
                  placeholderTextColor="#999"
                  value={editedUsername}
                  onChangeText={setEditedUsername}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={[styles.textInput, styles.readOnlyInput]}
                  placeholder="Email"
                  value={user?.email || ""}
                  editable={false}
                />
                <Text style={styles.helpText}>Email cannot be changed</Text>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
  },
  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarSection: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#bbb",
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: "700",
    color: "#fff",
  },
  userInfoSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 13,
    color: "#999",
  },
  actionButtons: {
    width: "100%",
    gap: 12,
  },
  editButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  logoutButtonText: {
    color: "#d32f2f",
    fontSize: 16,
    fontWeight: "600",
  },
  settingsSection: {
    marginTop: 20,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  settingItem: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  settingArrow: {
    fontSize: 20,
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  closeButton: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  saveButton: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  saveButtonDisabled: {
    color: "#ccc",
  },
  formContainer: {
    padding: 16,
  },
  imageEditSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  editAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    marginBottom: 16,
  },
  changePhotoButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  changePhotoText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  readOnlyInput: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  helpText: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
