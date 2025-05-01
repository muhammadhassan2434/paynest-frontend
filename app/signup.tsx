import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, icons, images } from "../constants";
import Header from "../components/Header";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";
import Input from "../components/Input";
import Checkbox from "expo-checkbox";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Register_Account } from "../utils/mutations/accountCreationMutation"; // adjust path

interface InputValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface InputValidities {
  first_name: boolean | undefined;
  last_name: boolean | undefined;
  email: boolean | undefined;
  password: boolean | undefined;
}

interface FormState {
  inputValues: InputValues;
  inputValidities: InputValidities;
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  },
  inputValidities: {
    first_name: false,
    last_name: false,
    email: false,
    password: false,
  },
  formIsValid: false,
};

type Nav = {
  navigate: (value: string, params?: any) => void;
};

const Signup = () => {
  const { navigate } = useNavigation<Nav>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const { colors, dark } = useTheme();

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

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error);
    }
  }, [error]);

  const { mutate, isPending } = useMutation({
    mutationFn: Register_Account,
    onSuccess: (data) => {
      console.log("Registration Success:", data);
      navigate("otpverification", { user_id: data.user_id });
    },
    onError: (error: any) => {
      Alert.alert(
        "Registration Failed",
        error.message || "Something went wrong."
      );
    },
  });

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={images.paylogo1}
              contentFit="contain"
              style={styles.logo}
            />
          </View>
          <Text
            style={[
              styles.title,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Create Your Account
          </Text>
          <Input
            id="first_name"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["first_name"]}
            placeholder="First Name"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.user}
          />
          <Input
            id="last_name"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["last_name"]}
            placeholder="Last Name"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.user}
          />
          <Input
            id="email"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["email"]}
            placeholder="Email"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
          />
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["password"]}
            autoCapitalize="none"
            id="password"
            placeholder="Password"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
          />
          <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: "row" }}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                color={
                  isChecked ? COLORS.primary : dark ? COLORS.primary : "gray"
                }
                onValueChange={setChecked}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.privacy,
                    {
                      color: dark ? COLORS.white : COLORS.black,
                    },
                  ]}
                >
                  By continuing you accept our Privacy Policy
                </Text>
              </View>
            </View>
          </View>
          <Button
            title={isPending ? "Please wait..." : "Sign Up"}
            filled
            onPress={() => {
              const { first_name, last_name, email, password } =
                formState.inputValues;

              if (!formState.formIsValid || !isChecked) {
                Alert.alert(
                  "Invalid Input",
                  "Please fill all fields and accept the policy."
                );
                return;
              }

              const payload = {
                first_name,
                last_name,
                email,
                password,
              };

              mutate(payload);
            }}
            style={styles.button}
          />

          <View></View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <Text
            style={[
              styles.bottomLeft,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Already have an account ?
          </Text>
          <TouchableOpacity onPress={() => navigate("login")}>
            <Text style={styles.bottomRight}> Sign In</Text>
          </TouchableOpacity>
        </View>
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
  logo: {
    width: 100,
    height: 100,
    // tintColor: COLORS.primary
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 12,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 18,
  },
  checkbox: {
    marginRight: 8,
    height: 16,
    width: 16,
    borderRadius: 4,
    borderColor: COLORS.primary,
    borderWidth: 2,
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
    marginVertical: 26,
  },
  socialBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
    position: "absolute",
    bottom: 12,
    right: 0,
    left: 0,
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: "regular",
    color: "black",
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
  },
});

export default Signup;
