import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from "../constants";

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, children, ...props}) => {
    const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-secondary font-poppinsBold">{title!=='Ingredient-input' ? title : ''}</Text>


      <View className="border-2 border-black-100 w-full h-16 px-4 bg-black-100 rounded-2xl 
      focus:border-secondary-200 items-center flex-row">
        <TextInput 
            className="flex-1 text-secondary font-poppingsLight text-base"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#a8a7af"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
        />
        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image 
              source ={!showPassword ? icons.eyeHide : icons.eyeHide} 
              className="w-7 h-7" 
              resizeMode='contain'/>
          </TouchableOpacity>
        )}
        {value.length !== 0 && children} 
      </View>
    </View>
  )
}

export default FormField