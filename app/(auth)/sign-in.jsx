import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
const SignIn = () => {
  return (
    <SafeAreaView className="h-full bg-primary">
      <View className="flex-1 items-center justify-center">
      <Text className="text-3xl text-red">Sign In Page!</Text>
      <Link href="/sign-up" className="text-title underline text-lg font-chewy pt-4">Go to Sign Up</Link>
      
      </View>
    </SafeAreaView>
  )
}

export default SignIn