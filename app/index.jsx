import { ScrollView, Text, View } from 'react-native'
import { Redirect, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../components/CustomButton'


const index = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%'}}>
        <View className="w-full h-full px-4 items-center justify-center">
            
          <View className="relative mt-2">
            <Text className="text-5xl font-chewy text-center text-title_color">RecipeRecon</Text>
            <Text className="text-lg font-poppingsRegular text-center text-secondary">Your Ingredients, Endless Possibilities</Text>
          </View>

          <CustomButton
            title="Get Started"
            handlePress={()=>{
              router.push('/sign-in')
            }}
            containerStyles="w-[80%] mt-7"
          >

          </CustomButton>

        </View>
      </ScrollView>
      <StatusBar backgroundColor='#F7E7DC' style='light'></StatusBar>
    </SafeAreaView>
  )
}

export default index
