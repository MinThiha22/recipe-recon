import { View, Text } from 'react-native'
import { useState }from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import { logout } from '../../lib/firebase'

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
        <CustomButton 
            title = "Log Out"
            handlePress={logOut}
            containerSyles={"mt-7"}
            isLoading={isSumbitting}
          />
      </View>
    </SafeAreaView>
  )
}

export default Profile