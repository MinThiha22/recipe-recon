import { Alert, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import { useEffect, useState }from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import { logout, getCurrentUserData, uploadProfilePicture, getProfilePicture, checkAuthState } from '../../lib/firebase'
import { StatusBar } from 'expo-status-bar'
import * as ImagePicker from 'expo-image-picker';
import { images, icons } from '../../constants'

const Profile = () => {
  const [isSumbitting, setIsSumbitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    profilePicture: null,
  })
  const [isLoading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const logOut = async () => {
    setIsSumbitting(true);
    try {
      await logout();
      setUser(null);
      setIsLoggedIn(false);
      router.replace('/sign-in')
      
    } catch (error) {
      Alert.alert('Error',error.message)
    } finally {
      setIsSumbitting(false);
    }
  }

  const getData = async () => {
    setLoading(true);
    try {
      const { username, email } = await getCurrentUserData();
      const profilePicture = await getProfilePicture();
      setUserData({ username, email, profilePicture });
    } catch (error) {
      Alert.alert('Error',error.message);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    getData();
  },[])

  const pickImage = async () => {
    Alert.alert(
      "Select Image Source",
      "Choose from where to get your picture:",
      [
        {
          text: "Camera",
          onPress: openCamera,
        },
        {
          text: "Gallery",
          onPress: openGallery,
        },
        {
          text: "Cancel",
        },
      ]
    );
  };

  // Function to open the camera and take a picture
  const openCamera = async () => {
    try {
      let result = await ImagePicker.requestCameraPermissionsAsync();
      if (result.status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera permissions to take a picture!');
        return;
      }
  
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
  
      if (!pickerResult.canceled) {
        await uploadImage(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'Something went wrong while trying to open the camera. Please try again.');
    }
  };

  // Function to open the gallery and select an image
  const openGallery = async () => {
    try {
      let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (result.status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need permission to select picture!');
        return;
      }
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!pickerResult.canceled) {
        uploadImage(pickerResult.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    try {
      
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const blob = await response.blob();
      console.log(blob);
      const user = await checkAuthState();
      if(!user) {
        throw new Error("User is not authenticated");
      }
      const userId = user.uid;
      const profilePictureUrl = await uploadProfilePicture(blob, userId);

      setUserData((prevData) => ({ ...prevData, profilePicture: profilePictureUrl }));

      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView>
        <View className="w-full min-h-[80vh] items-center">
          <Text className="text-3xl mt-5 text-title font-chewy">
              Your Profile
          </Text>
          <Text className="text-lg mt-3 text-secondary font-poppinsBold">Hello {userData.username}</Text>

          <View className="relative mt-3">
            
            {userData.profilePicture ? (
              <Image
                source={{ uri: userData.profilePicture }}
                resizeMode='contain' className="w-[120px] h-[120px] rounded-full border-black border-2"
              />
            ) : (
              <Image source={images.profilePlaceHolder} resizeMode='contain' className="w-[120px] h-[120px] rounded-full"></Image>
            )}
            
            {/* Add Image Icon */}
            <TouchableOpacity
              onPress={pickImage}
              className="absolute right-0 bottom-0 p-2 bg-secondary rounded-full"
            >
              <Image source={icons.addIcon}></Image>
            </TouchableOpacity>
          </View>
          <View className="flex-col items-center mt-5">
            <Text className="text-lg font-poppinsBold text-secondary">Personal Info</Text>
            <Text className="font-poppinsRegular text-secondary">Email: {userData.email}</Text>
          </View>
          <View className="my-4 border-t border-secondary w-[80%] max-w-md" />

          <View className="">
            <Text className="text-lg font-poppinsBold text-secondary">Favourite Recipes</Text>
          </View>
          <View className="flex-row">
            <CustomButton 
              title = "Edit Profile"
              handlePress=""
              containerStyles={"mt-7 mr-2 w-[30%]"}
              isLoading={isSumbitting}
            />
            <CustomButton 
              title = "Log Out"
              handlePress={logOut}
              containerStyles={"mt-7 w-[30%]"}
              isLoading={isSumbitting}
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light'></StatusBar>
    </SafeAreaView>
  )
}

export default Profile