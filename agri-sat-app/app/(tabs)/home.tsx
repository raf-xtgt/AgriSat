import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { Pressable } from 'react-native-gesture-handler';
import { getUserData, UserData } from '../../services/user-profile-service';


export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  const handleProfilePress = () => {
    if (userData) {
      Alert.alert(
        'User Profile',
        `Username: ${userData.username}\nUser ID: ${userData.userId}`
      );
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>Agriculture Monitoring</Text>
      <Pressable onPress={handleProfilePress} style={styles.profileButton}>
        <Entypo name="user" size={24} color="black" />
      </Pressable>
    </View>
    
    <View style={styles.content}>
      <Text style={styles.welcomeText}>
        {userData 
          ? `Welcome, ${userData.username}!` 
          : 'Loading user data...'}
      </Text>
      <Text style={styles.subtitle}>
        This is the home screen connected to the bottom navigation
      </Text>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
});