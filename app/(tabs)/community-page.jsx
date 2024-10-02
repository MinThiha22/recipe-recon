import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, SafeAreaView, ScrollView, Image } from 'react-native';
import CreatePost from '../../components/Create-post';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const CommunityPage = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(newPosts);
        });

        return () => unsubscribe();
    }, []);

    const displayPosts = ({ item }) => (
        <View className="m-2 p-4 bg-white rounded-lg shadow">
            <Text className="font-bold text-lg">{item.title}</Text>
            <Text className="text-gray-600">{item.body}</Text>
            <Text className="text-gray-400 text-sm">{item.username}</Text>
            <Image className="w-60 h-60" source={{ uri: item.profilePicture }} />
        </View>
    );

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
                        keyExtractor={item => item.id}
                        className="w-full" 
                        showsVerticalScrollIndicator={false} 
                        ListHeaderComponent={displayHeader}
                    />
                <TouchableOpacity className="bg-blue-500 p-3 rounded-full absolute bottom-5 right-5 w-15 h-15" onPress={() => setModalVisible(true)}>
                    <Text className="text-white font-bold text-center">Create Post</Text>
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                <CreatePost  onClose={() => setModalVisible(false)}></CreatePost>
                </Modal>

        </SafeAreaView>
    );
};

export default CommunityPage;
