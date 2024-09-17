import { View, Text } from 'react-native'
import { useState }from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
<<<<<<< HEAD
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import { logout } from '../../lib/firebase'
import { StatusBar } from 'expo-status-bar'

=======
import { StatusBar } from 'expo-status-bar'
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import { logout } from '../../lib/firebase'
>>>>>>> login

const Profile = () => {
  const [isSumbitting, setIsSumbitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();
  
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
  return (
    <SafeAreaView className="h-full bg-primary">
      <View className="w-full min-h-[80vh] items-center justify-center">
        <Text className="text-3xl mt-5 text-title font-chewy">
            Profile
        </Text>
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