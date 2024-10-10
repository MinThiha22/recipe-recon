import { View, Text, ScrollView, Image, Alert} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Link, router } from 'expo-router'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import { createUser } from '../../lib/firebase'

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [isSumbitting, setIsSumbitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  // submit user information when sign up button is pressed
  const submit = async () => {
    if(!form.username || !form.email || !form.password){
      Alert.alert('Error','Please fill in all the fields');
      return
    }
    setIsSumbitting(true);
    try {
      const result = await createUser(form.username,form.email,form.password);
      setUser(result);
      setIsLoggedIn(true);

      // reroute to home after sign up
      router.replace('/home')
    } catch (error) {
      Alert.alert('Error',error.message)
    } finally {
      setIsSumbitting(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[80vh] px-4 my-6">
          <Image source={images.whiteLogo} resizeMode='contain' className="w-[120px] h-[120px]" testID='mainLogo'/>
          <Text className="text-3xl text-title mt-5 font-chewy"> Sign Up to Recipe Recon</Text>
          <FormField 
            title = "Username"
            value = {form.username}
            placeholder= "Your name"
            handleChangeText = {(e) => setForm({...form, username: e})}
            otherStyles = "mt-7"
          />
          <FormField 
            title = "Email"
            value = {form.email}
            placeholder= "example@gmail.com" 
            handleChangeText = {(e) => setForm({...form, email: e})}
            otherStyles = "mt-3"
            keyBoardType = "email.address"
          />
          <FormField 
            title = "Password"
            value = {form.password}
            placeholder="*********"
            handleChangeText = {(e) => setForm({...form, password: e})}
            otherStyles = "mt-3"
          />
          <CustomButton 
            title = "Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSumbitting}
          />
          <View className="justify-center flex-row gap-2">
            <Text className=" text-secondary font-poppinsBlack pt-5">Already have an account?</Text>
            <Link href="/sign-in" className="text-title underline text-lg font-chewy pt-4" testID='signInLink'>Sign In</Link>
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light'></StatusBar>
    </SafeAreaView>
  )
}

export default SignUp