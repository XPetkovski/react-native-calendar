import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../../services/AuthService';
import UserService from '../../services/UserService';
import { styles } from './HeaderAvatar.styles';

export const HeaderAvatar = () => {
  const [initials, setInitials] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const fallbackInitial = currentUser.email
      ? currentUser.email.charAt(0).toUpperCase()
      : '?';

    const unsubscribe = UserService.subscribeToUserProfile(
      currentUser.uid,
      profile => {
        if (profile && profile.firstName && profile.lastName) {
          const first = profile.firstName.charAt(0).toUpperCase();
          const last = profile.lastName.charAt(0).toUpperCase();
          setInitials(`${first}${last}`);
        } else {
          setInitials(fallbackInitial);
        }
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <TouchableOpacity
      style={styles.avatarButton}
      onPress={() => navigation.navigate('Profile')}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.avatarText}>{initials}</Text>
      )}
    </TouchableOpacity>
  );
};
