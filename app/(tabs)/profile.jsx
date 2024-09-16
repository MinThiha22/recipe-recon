import { Alert, View, Text, ScrollView } from 'react-native'
import { useEffect, useState }from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import { logout, getCurrentUserData } from '../../lib/firebase'
import { StatusBar } from 'expo-status-bar'

const Profile = () => {
  const [isSumbitting, setIsSumbitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
  })
  const [isLoading, setLoading] = useState(false);

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
      setUserData({ username, email });
    } catch (error) {
      Alert.alert('Error',error.message);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    getData();
  },[])
  
  return (
    <SafeAreaView className="h-full bg-primary">
      <View className="w-full min-h-[80vh] items-center">
        <Text className="text-3xl mt-5 text-title font-chewy">
            Your Profile
        </Text>
        <Text className="text-lg mt-3 text-secondary font-poppinsBold">Hello {userData.username}</Text>
        
        <CustomButton 
            title = "Log Out"
            handlePress={logOut}
            containerStyles={"mt-7 w-[40%]"}
            isLoading={isSumbitting}
          />
      </View>
      <StatusBar backgroundColor='#161622' style='light'></StatusBar>
    </SafeAreaView>
  )
}

export default Profile