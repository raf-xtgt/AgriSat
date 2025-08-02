// services/userService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export interface UserData {
  username: string;
  userId: string;
}

export const getUserData = async (): Promise<UserData> => {
  try {
    const storedData = await AsyncStorage.getItem('userData');
    
    if (storedData) {
      const userData: UserData = JSON.parse(storedData);
      console.log('Username:', userData.username);
      console.log('User ID:', userData.userId);
      return userData;
    } else {
      const newUserData: UserData = {
        username: `user_${Math.random().toString(36).substring(2, 10)}`,
        userId: uuidv4(),
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
      console.log('New Username:', newUserData.username);
      console.log('New User ID:', newUserData.userId);
      return newUserData;
    }
  } catch (error) {
    console.error('Error accessing local storage:', error);
    throw error;
  }
};