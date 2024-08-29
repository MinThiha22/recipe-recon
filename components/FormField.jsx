import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'



const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
    const [showPassword, setshowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-secondary font-chewy">{title}</Text>

      <View className="border-2 border-black-100 w-full h-16 px-4 bg-black-100 rounded-2xl 
      focus:border-secondary-200 items-center flex-row">
        <TextInput 
            className="flex-1 text-secondary font-chewy text-base"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#F7E7DC"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
        />

       

      </View>
    </View>
  )
}

export default FormField