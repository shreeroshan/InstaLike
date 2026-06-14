import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const showOptions = async () => {
    Alert.alert("Select Image", "Choose an option", [
      { text: "Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const pickImage = async () => {
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
      allowsEditing: false,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPreviewImage(result.assets[0].uri);
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setDescription("");
  };

  const handlePost = () => {
    if (!previewImage) return;
    console.log("Posting image", { previewImage, description });
    Alert.alert(
      "Post ready",
      "Your image and description are ready to publish.",
    );
    handleCloseModal();
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "top"]}>
      <TouchableOpacity style={styles.fab} onPress={showOptions}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        statusBarTranslucent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalWrapper}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Preview your post</Text>
              {previewImage ? (
                <Image
                  source={{ uri: previewImage }}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>No image selected</Text>
                </View>
              )}
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Write a description for your image..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                style={styles.textInput}
              />
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.postButton]}
                  onPress={handlePost}
                >
                  <Text style={styles.buttonText}>Post</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: "white",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 31,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 1, 1, 0.75)",
    justifyContent: "center",
    padding: 20,
  },
  modalWrapper: {
    width: "100%",
  },
  modalCard: {
    backgroundColor: "#0c0707",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#766b6b",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  previewImage: {
    width: "100%",
    height: 280,
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: "#222",
  },
  imagePlaceholder: {
    width: "100%",
    height: 280,
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
    fontSize: 16,
  },
  textInput: {
    minHeight: 100,
    maxHeight: 160,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 16,
    padding: 14,
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#333",
  },
  postButton: {
    backgroundColor: "#000",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
