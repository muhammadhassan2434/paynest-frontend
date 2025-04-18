import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import Checkbox from 'expo-checkbox';
import Button from '../components/Button';
import SocialButton from '../components/SocialButton';
import OrSeparator from '../components/OrSeparator';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from 'expo-router';
import { Image } from 'expo-image';
import { useAuth } from '@/utils/hooks/AuthContext';
import axios from 'axios';
import { USER_LOGIN } from '@/utils/mutations/accountCreationMutation';
import { useMutation } from '@tanstack/react-query';

interface InputValues {
  email: string
  password: string
}

interface InputValidities {
  email: boolean | undefined
  password: boolean | undefined
}

interface FormState {
  inputValues: InputValues
  inputValidities: InputValidities
  formIsValid: boolean
}

const initialState: FormState = {
  inputValues: {
    email: '',
    password: '',
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
}

type Nav = {
  navigate: (value: string) => void
}

const Login = () => {
  const { navigate } = useNavigation<Nav>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const { colors, dark } = useTheme();
  const { login } = useAuth()
  

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue)
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      })
    }, [dispatchFormState])

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error)
    }
  }, [error]);

  // Implementing apple authentication
  const {
  mutate: loginMutate,
  isPending,
  error: mutationError,
  data,
} = useMutation({
  mutationFn: USER_LOGIN,
  onSuccess: (response) => {
    console.log("Login Success Response:", response);
    const { token, user_id, account } = response;

    if (!token || !user_id || !account) {
      Alert.alert("Login Failed", "Invalid login data received.");
      return;
    }

    login(token, user_id, account);
    navigate("(tabs)");
  },
  onError: (error: any) => {
    const errorMessage =
      error?.response?.data?.message || error?.message || "Something went wrong.";

    Alert.alert("Login Failed", errorMessage);
    console.log("Login Failed", error.message);
  },
});

  const isLoading = isPending;
  
  const loginHandler = () => {
    loginMutate({
      email: formState.inputValues.email,
      password: formState.inputValues.password,
    });
  };
  
  

  return (
    <SafeAreaView style={[styles.area, {
      backgroundColor: colors.background
    }]}>
      <View style={[styles.container, {
        backgroundColor: colors.background
      }]}>
        <Header title="" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={images.paylogo}
              contentFit='contain'
              style={styles.logo}
            />
          </View>
          <Text style={[styles.title, {
            color: dark ? COLORS.white : COLORS.black
          }]}>Login to Your Account</Text>
          <Input
            id="email"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['email']}
            placeholder="Email"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
          />
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['password']}
            autoCapitalize="none"
            id="password"
            placeholder="Password"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
          />
          <Button
            title={isLoading ? "Logging in..." : "Login"}
            filled
            onPress={loginHandler}
            style={styles.button}
            disabled={isLoading}
          />
          {/* forget password */}
          {/* <TouchableOpacity
            onPress={() => navigate("forgotpasswordmethods")}>
            <Text style={styles.forgotPasswordBtnText}>Forgot the password?</Text>
            </TouchableOpacity> */}
            <View style={styles.bottomContainer}>
          <Text style={[styles.bottomLeft, {
            color: dark ? COLORS.white : COLORS.black
          }]}>Don't have an account ?</Text>
          <TouchableOpacity
            onPress={() => navigate("signup")}>
            <Text style={styles.bottomRight}>{"  "}Sign Up</Text>
          </TouchableOpacity>
              </View>
          
        </ScrollView>
          
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white
  },
  logo: {
    width: 120,
    height: 120,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32
  },
  title: {
    fontSize: 28,
    fontFamily: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 16
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
 
  privacy: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.black,
  },
  socialTitle: {
    fontSize: 19.25,
    fontFamily: "medium",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 26
  },
  socialBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
marginTop:20,
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: "regular",
    color: "black"
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.primary
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30
  },
  forgotPasswordBtnText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 12
  }
})

export default Login