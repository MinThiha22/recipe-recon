import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { React,useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router'

import {images} from '../../constants';

import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton'



const SignIn = () => {
  const [form, setform] = useState({
    email:'',
    password:''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)



  const submit = async () => {
  
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.main} resizeMode='contain' className="w-[100px] h-[100px]" />
          <Text className="text-3xl text-title font-chewy mt-3">
            Log in to RecipeRecon
          </Text>

          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setform({ ...form, email: e})}
            otherStyles="mt-3"
            keyboardType="email-address"
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setform({ ...form, password: e})}
            otherStyles="mt-3"
            keyboardType="email-address"
          />

          <CustomButton 
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            />

            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-secondary font-poppinsBlack">
                Don't have an acount?
              </Text>
              <Link href="sign-up" className="text-title underline text-lg font-chewy"> Sign Up!</Link>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
