import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const SignIn = () => {
  return (
    <SafeAreaView className="h-full bg-primary">
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl text-red">Home!</Text>
      
      </View>
    </SafeAreaView>
  )
}

export default SignIn