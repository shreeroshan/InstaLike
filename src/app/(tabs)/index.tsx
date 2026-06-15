import { useAuth } from "@/context/AuthContext";
import usePosts, { Post } from "@/hooks/usePosts";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  FlatList,
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

interface PostCardProps {
  post: Post;
  currentUserId?: string;
}

const PostCard = ({ post, currentUserId }: PostCardProps) => {
  const postUser = post.profiles;

  return (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        {postUser?.profile_image ? (
          <Image
            source={{ uri: postUser.profile_image }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {postUser?.name?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
        )}

        <View>
          <Text style={styles.userName}>{postUser?.name || "User"}</Text>
          <Text style={styles.userHandle}>
            @{postUser?.username || "unknown"}
          </Text>
        </View>
      </View>

      {post.image_url ? (
        <Image source={{ uri: post.image_url }} style={styles.postImage} />
      ) : null}

      {post.description ? (
        <Text style={styles.postDescription}>{post.description}</Text>
      ) : null}

      <Text style={styles.timestamp}>
        {new Date(post.created_at).toLocaleString()}
      </Text>
    </View>
  );
};

export default function Index() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { createPost, posts } = usePosts();
  const { user } = useAuth();

  const showOptions = async () => {
    Alert.alert("Select Image", "Choose an option", [
      { text: "Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const pickImage = async () => {
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
        allowsEditing: false,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      if (!result.assets?.length) {
        Alert.alert("Error", "No image was selected. Please try again.");
        return;
      }

      setPreviewImage(result.assets[0].uri);
      setModalVisible(true);
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert(
        "Error",
        "Unable to open the image picker. Please try again.",
      );
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setDescription("");
  };

  const handlePost = async () => {
    if (!previewImage) return;
    setIsUploading(true);
    try {
      await createPost(previewImage, description);
      setPreviewImage(null);
      setDescription("");
      handleCloseModal();
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "failed to create post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const renderPost = ({ item }: { item: Post }) => {
    return <PostCard post={item} currentUserId={user?.id} />;
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "top"]}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

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
    alignItems: "stretch",
    justifyContent: "flex-start",
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
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 110,
  },
  postContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e6e6e6",
    elevation: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ddd",
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#bbb",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },
  userHandle: {
    fontSize: 12,
    color: "#666",
  },
  postImage: {
    width: "100%",
    height: 320,
    backgroundColor: "#f0f0f0",
  },
  postDescription: {
    fontSize: 14,
    color: "#333",
    padding: 12,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});
