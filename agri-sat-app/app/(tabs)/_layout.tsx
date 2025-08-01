/**
 * Layout specific for the tabs section in pages
 */
import { StyleSheet, Text, View } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React from 'react'
import { Tabs } from 'expo-router'

const TabsLayout = () => {
  return (
    <>
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: '#C67C4E'
      }}
    >
      {/* 
      * The name attribute inside the tabs screen 
      * should match the folder name of that component
      */}
      <Tabs.Screen 
        name='home'
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({color}) => (
            <Entypo name="home" size={24} color={color} />
          )
        }}
      />

      <Tabs.Screen 
        name='myFarm'
        options={{
          headerShown: false,
          title: 'My Farm',
          tabBarIcon: ({color}) => (
            <Entypo name="leaf" size={24} color={color} />
          )
        }}
      />

    </Tabs>
    </>
  )
}

export default TabsLayout
const styles = StyleSheet.create({})