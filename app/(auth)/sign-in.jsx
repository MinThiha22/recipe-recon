import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React, {useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router'

import { images } from '../../constants';

import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton'

//import { getCurrentUser, signIn } from '../../lib/appwrite';

const SignIn = () => {
  const [form, setform] = useState({
    email:'',
    password:''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)



  const submit = async () => {
    if(!form.email === "" || !form.password === "") {
      Alert.alert('Error', 'Please fill in all the fields')
    }

    setIsSubmitting(true);
    
    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image 
            className="w-[115px] h-[35px]"
            style={{ width: 115, height: 35}}
          />
          <Text className="text-2xl text-title text-psemibold font-chewy " style={{marginTop: 40, fontSize: 23}}>
            Log in to RecipeRecon
          </Text>

          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setform({ ...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setform({ ...form, password: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <CustomButton 
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            />

            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-white font-pregular" style={{marginTop: 10}}>
                Don't have an acount?
              </Text>
              <Link href="sign-up" className="text-secondary-200 font-psemibold " style={{marginTop: 10}}> Sign Up!</Link>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
