import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';

import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';

import { COLORS, SIZES } from '../constants';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import { EDIT_PROFILE } from '@/utils/mutations/profile';
import useFetchServices from '@/hooks/services';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '@/utils/hooks/AuthContext';
import Toast from 'react-native-toast-message';

const initialState = {
  inputValues: {
    first_name: '',
    last_name: '',
    address: '',
  },
  inputValidities: {
    first_name: false,
    last_name: false,
    address: false,
  },
  formIsValid: false,
};

const EditProfile = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { dark } = useTheme();
  const { userId, token } = useAuth();

  const [error, setError] = useState<string | undefined>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [selectedGender, setSelectedGender] = useState('');
  const [loading, setLoading] = useState(false);

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  const {
    data: editProfile,
    isLoading: editProfileLoading,
    isError: editProfileError,
    refetch: refetcheditProfile,
  } = useFetchServices(['edit_profile'], () => EDIT_PROFILE(userId, token));

  // Sync API data to form
  useEffect(() => {
    if (editProfile) {
      const { first_name, last_name, address, gender } = editProfile;

      dispatchFormState({
        inputId: 'first_name',
        inputValue: first_name || '',
        validationResult: validateInput('first_name', first_name || ''),
      });

      dispatchFormState({
        inputId: 'last_name',
        inputValue: last_name || '',
        validationResult: validateInput('last_name', last_name || ''),
      });


      dispatchFormState({
        inputId: 'address',
        inputValue: address || '',
        validationResult: validateInput('address', address || ''),
      });

      setSelectedGender(gender || '');
    }
  }, [editProfile]);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  const updateProfileHandler = async () => {
    if (!formState.formIsValid) {
      Alert.alert('Invalid Input', 'Please check your input fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `https://paynest.coinxness.com/api/update/profile/${userId}`,
        {
          first_name: formState.inputValues.first_name,
          last_name: formState.inputValues.last_name,
          address: formState.inputValues.address,
          gender: selectedGender,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      Toast.show({
                type: "success",
                text2: "Profile updated successfully",
              });
      navigation.goBack();
    } catch (err: any) {
      console.error(err);
      Toast.show({
          type: "success",
          text1: "Cancel",
          text2: "Failed to update profile.",
        });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error);
    }
  }, [error]);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
        <Header title="Personal Profile" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Input
              id="first_name"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['first_name']}
              placeholder="First Name"
              value={formState.inputValues.first_name}
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            />
            <Input
              id="last_name"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['last_name']}
              placeholder="Last Name"
              value={formState.inputValues.last_name}
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            />
            <View style={styles.genderContainer}>
              <RNPickerSelect
                placeholder={{ label: 'Select Gender', value: '' }}
                items={genderOptions}
                onValueChange={setSelectedGender}
                value={selectedGender}
                style={{
                  inputIOS: styles.picker,
                  inputAndroid: styles.picker,
                }}
              />
            </View>
            <Input
              id="address"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['address']}
              placeholder="Address"
              value={formState.inputValues.address}
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          title={loading ? 'Updating...' : 'Update'}
          filled
          style={styles.continueButton}
          onPress={updateProfileHandler}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  genderContainer: {
    flexDirection: 'row',
    borderColor: COLORS.greyscale500,
    borderWidth: 0.4,
    borderRadius: 6,
    height: 58,
    width: SIZES.width - 32,
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: COLORS.greyscale500,
  },
  picker: {
    fontSize: 16,
    paddingHorizontal: 10,
    borderRadius: 4,
    color: COLORS.greyscale600,
    paddingRight: 30,
    height: 52,
    width: SIZES.width - 32,
    backgroundColor: COLORS.greyscale500,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    left: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SIZES.width - 32,
    alignItems: 'center',
  },
  continueButton: {
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});

export default EditProfile;
