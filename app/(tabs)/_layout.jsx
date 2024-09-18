import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { icons } from '../../constants'

const TabIcon = ({ icon, color, name, focused }) => {
  return (
      <View className="items-center justify-center gap-2">
          <Image 
            source={icon} 
            resizeMode="center"
            tintColor={color}
            className="w-6 h-6"
          
          />

          <Text className={`${focused ? 'font-poppinsBold' : 'font-poppingsRegular'} text-xs`} style={{ color: color}}>

          </Text>
      </View>
  )
}

const TabLayout = () => {
  return (
    <>
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFA726',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: {
            backgroundColor: '#405D72',
            borderTopWidth: 1,
            borderTopColor: '#CDCDE0',
            height: 84,

        }
    }}>
        <Tabs.Screen 
          name = "home"
          options={{
            title: 'Home',
            headerShown: false,
            /*tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                  icon={icons.home}
                  color={color}
                  name="Home"
                  focused={focused}
              />
          )*/
          }}
        />
        <Tabs.Screen 
          name = "recipes-list"
          options={{
            title: 'Recipes List',
            headerShown: false
          }}
        />
         <Tabs.Screen 
          name = "shopping-list"
          options={{
            title: 'Shopping List',
            headerShown: false
          }}
        />
        <Tabs.Screen 
          name = "profile"
          options={{
            title: 'Profile',
            headerShown: false
          }}
        />
      </Tabs>
    </>
  )
}

export default TabLayout