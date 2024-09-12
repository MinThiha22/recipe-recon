import { View, ScrollView, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar';


const SignUp = () => {
  return (
    <SafeAreaView className="h-full bg-primary">
        <View className="flex-1 items-center justify-center">
          <Text className="text-3xl text-red">Sign Up Page!</Text>
          <Link href="/sign-in" className="text-title underline text-lg font-chewy pt-4">Go to Sign In</Link>
        </View>
      <StatusBar backgroundColor='#161622' style='light'></StatusBar>
    </SafeAreaView>
    
  )
}

export default SignUp