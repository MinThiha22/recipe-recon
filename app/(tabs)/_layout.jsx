import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const TabLayout = () => {
  return (
    <>
      <Tabs>
        <Tabs.Screen 
          name = "home"
          options={{
            title: 'Home'
          }}
        />
        <Tabs.Screen 
          name = "recipes-list"
          options={{
            title: 'recipes-list'
          }}
        />
         <Tabs.Screen 
          name = "profile"
          options={{
            title: 'profile'
          }}
        />
      </Tabs>
    </>
  )
}

export default TabLayout