
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { React,useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import {images} from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider';
import { signIn } from '../../lib/firebase'

// sign in to the app when sign-in button is pressed

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [isSubmitting, setIsSumbitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    if(!form.email || !form.password){
      Alert.alert('Error','Please fill in all the fields');
    }
    setIsSumbitting(true);

    try {
      const user = await signIn(form.email,form.password)
      setUser(user);
      setIsLoggedIn(true);
      // reroute to home after sign-in
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
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.whiteLogo} resizeMode='contain' className="w-[120px] h-[120px]" />
          <Text className="text-3xl mt-5 text-title font-chewy">
            Log in to RecipeRecon
          </Text>

          <FormField 
            title="Email"
            value={form.email}
            placeholder= "example@gmail.com" 
            handleChangeText={(e) => setForm({ ...form, email: e})}
            otherStyles="mt-3"
            keyboardType="email-address"
          />

          <FormField 
            title="Password"
            value={form.password}
            placeholder="*********"
            handleChangeText={(e) => setForm({ ...form, password: e})}
            otherStyles="mt-3"
            keyboardType="email-address"
          />

          <CustomButton 
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            />

            <View className="justify-center flex-row gap-2">
              <Text className="text-secondary font-poppinsBlack pt-5">
                Don't have an acount?
              </Text>
              <Link href="sign-up" className="text-title underline text-lg font-chewy pt-4"> Sign Up!</Link>
            </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light'></StatusBar>
    </SafeAreaView>
  );
};

export default SignIn;
