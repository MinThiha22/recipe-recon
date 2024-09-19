import { ScrollView, Text, View, Image } from 'react-native'
import { Redirect, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../components/CustomButton'
import { useGlobalContext } from '../context/GlobalProvider'
import images from '../constants/images'

const Index = () => {
  const {isLoading, isLoggedIn } = useGlobalContext();

  if(!isLoading && isLoggedIn) return <Redirect href="/home"/>
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%'}}>
        <View className="w-full h-full px-4 items-center justify-center">
          <View className="flex-col items-center mt-2">
            <Image source={images.cooking} resizeMode='contain' className="w-[240px] h-[180px]"></Image>
            <View className="justify-center items-center flex-row gap-1">
              <Image source={images.whiteLogo} resizeMode='contain' className="w-[75px] h-[75px]" />
              <Text className="pt-3 text-5xl font-chewy text-title">RecipeRecon</Text>
            </View>

            <Text className="text-lg font-poppinsBlack text-center text-secondary">Your Ingredients, Endless Possibilities</Text>
            <View className="w-[80%] mx-auto">
              <Text className="mt-5 font-poppingsRegular text-center text-secondary">Discover new and exciting meals from the ingredients you already have!</Text>
              <Text className="mt-2 font-poppingsRegular text-center text-secondary"> Simply scan what's in your fridge or pantry, and <Text className="font-bold text-title font-chewy">RecipeRecon</Text> will create delicious recipes just for you!</Text>
            </View>
          </View>

          <CustomButton
            title="Get Started"
            handlePress={()=>{
              router.push('/home')
            }}
            containerStyles="w-[80%] mt-7"
          >

          </CustomButton>

        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light'></StatusBar>
    </SafeAreaView>
  )
}

export default Index
