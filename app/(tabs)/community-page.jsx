import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Image,
} from "react-native";
import CreatePost from "../../components/CreatePost";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Comments from "../../components/Comments";
import BookmarkButton from "../../components/BookmarkButton";
import { images } from "../../constants";

const CommunityPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState(null);

  //on launch get posts
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(newPosts);
    });

    return () => unsubscribe();
  }, []);

  //toggle comments visibility
  const toggleCommentsVisibility = (postId) => {
    setCommentsVisible((prev) => (prev === postId ? null : postId));
  };

  //function to render posts
  const displayPosts = ({ item }) => (
    <View>
      <View className="m-2 p-4 bg-white rounded-lg shadow">
        <View className="items-center">
          <Text className="font-bold font-chewy text-xl">{item.title}</Text>
          {item.imageUrl && (
            <Image
              className="w-80 h-80"
              source={{ uri: item.imageUrl }}
            ></Image>
          )}
        </View>
        <Text className="text-gray-600 mt-2">{item.body}</Text>
        <View className="flex-row items-center mt-2">
          {item.profilePicture ? (
            <Image
              className="w-5 h-5 mr-1 rounded-full border-black border-1"
              source={{ uri: item.profilePicture }}
            />
          ) : (
            <Image
              className="w-5 h-5 mr-1 rounded-full border-black border-1"
              source={images.profilePlaceHolder}
            />
          )}
          <Text className="text-gray-400 text-sm">{item.name}</Text>
        </View>
        <View>
          <BookmarkButton selectedPost={item}></BookmarkButton>
          <TouchableOpacity
            className="bg-primary p-3 rounded-full mt-4"
            onPress={() => toggleCommentsVisibility(item.id)}
          >
            <Text className="text-white font-bold text-center">
              View Comments
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentsVisible === item.postId}
        onRequestClose={() => setCommentsVisible(null)}
      >
        <View className="flex-1 m-2 justify-end">
          <View className="h-3/4 bg-white rounded-lg shadow pl-4 pr-4">
            <TouchableOpacity
              className="bg-primary p-3 rounded-full mt-4"
              onPress={() => setCommentsVisible(null)}
            >
              <Text className="text-white font-bold text-center">
                Hide Comments
              </Text>
            </TouchableOpacity>
            <Comments postId={item.postId} />
          </View>
        </View>
      </Modal>
    </View>
  );

  //function to display title
  const displayHeader = () => (
    <View className="w-full items-center">
      <Text className="text-3xl mt-5 text-title font-chewy">
        Community Posts
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        data={posts}
        renderItem={displayPosts}
        keyExtractor={(item) => item.id}
        className="w-full"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={displayHeader}
      />
      <TouchableOpacity
        className="bg-blue-500 p-3 rounded-full absolute bottom-1 right-5 w-15 h-15"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-bold text-center">Create Post</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <CreatePost onClose={() => setModalVisible(false)}></CreatePost>
      </Modal>
    </SafeAreaView>
  );
};

export default CommunityPage;
