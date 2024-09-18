import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

import React from 'react'

const home = () => {
  return (
    <SafeAreaView className="h-full bg-primary">
      <View className="w-full min-h-[80vh] items-center justify-center">
        <Text className="text-3xl mt-5 text-title font-chewy">
            Home
        </Text>
      </View>
      <StatusBar backgroundColor='#161622' style='light'></StatusBar>
    </SafeAreaView>
  )
}

export default home