import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, SafeAreaView, ScrollView, Image } from 'react-native';
import CreatePost from '../../components/Create-post';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Comments from '../../components/Comments';

const CommunityPage = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const [commentsVisible, setCommentsVisible] = useState(null);

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

    const toggleCommentsVisibility = (postId) => {
        setCommentsVisible((prev) => prev === postId ? null : postId);
    };

    const displayPosts = ({ item }) => (    
        <View>
            <View className="m-2 p-4 bg-white rounded-lg shadow">
                <Text className="font-bold text-lg">{item.title}</Text>
                {item.imageUrl && (<Image className='w-60 h-60' source={{ uri: item.imageUrl }}></Image>)}
                <Text className="text-gray-600">{item.body}</Text>
                <View className="flex-row items-center mt-2">
                    <Image className="w-5 h-5 mr-1 rounded-full border-black border-1" source={{ uri: item.profilePicture }} />
                    <Text className="text-gray-400 text-sm">{item.name}</Text>
                </View>
                <View>
                    <TouchableOpacity className="bg-primary p-3 rounded-full mt-4" onPress={() => toggleCommentsVisibility(item.id)}>
                        <Text className="text-white font-bold text-center">View Comments</Text>
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
                        <TouchableOpacity className="bg-primary p-3 rounded-full mt-4" onPress={() => setCommentsVisible(null)}>
                            <Text className="text-white font-bold text-center">Hide Comments</Text>
                        </TouchableOpacity>
                        <Comments postId={item.postId} />
                    </View>
                </View>
            </Modal>
        </View >
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
            <TouchableOpacity className="bg-blue-500 p-3 rounded-full absolute bottom-1 right-5 w-15 h-15" onPress={() => setModalVisible(true)}>
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
