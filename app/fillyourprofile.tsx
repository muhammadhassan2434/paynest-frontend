import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import React, { useCallback, useReducer, useState } from "react";
import { COLORS, icons, illustrations, SIZES } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";
import Input from "../components/Input";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { launchImagePicker } from "@/utils/ImagePickerHelper";
import { Image } from "expo-image";
import { useMutation } from "@tanstack/react-query";
import { ACCOUNT_REGISTER } from "@/utils/mutations/accountCreationMutation";

const initialState = {
  inputValues: {
    paynest_id: "",
    phone: "",
    address: "",
  },
  inputValidities: {
    paynest_id: false,
    phone: false,
    address: false,
  },
  formIsValid: false,
};

type Nav = {
  navigate: (value: string, params?: any) => void;
};

const FillYourProfile = () => {
  const { navigate } = useNavigation<Nav>();
  const { user_id } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [gender, setGender] = useState<string | null>(null);
  const { colors } = useTheme();

  const { mutate: registerAccount, isLoading } = useMutation({
    mutationFn: ACCOUNT_REGISTER,
    onSuccess: (data) => {
      // Alert.alert("Success", "Profile updated successfully!");
      setModalVisible(true);  // Show the modal on success
  
    },
    onError: (error) => {
      Alert.alert("Error", "Something went wrong!");
    },
  });
  

  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;
      setImage({ uri: tempUri });
    } catch (error) {}
  };

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

  const renderModal = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContainer]}>
            <View
              style={[styles.modalSubContainer, { backgroundColor: colors.background }]}
            >
              <Image
                source={illustrations.passwordSuccess}
                resizeMode="contain"
                style={styles.modalIllustration}
              />
              <Text style={styles.modalTitle}>Congratulations!</Text>
              <Text
                style={[
                  styles.modalSubtitle,
                  { color: colors.text },
                ]}
              >
                Your account is ready to use. You will be redirected to the Home page in a few seconds..
              </Text>
              <Button
                title="Continue"
                filled
                onPress={() => {
                  setModalVisible(false);
                  navigate("login");
                }}
                style={{ width: "100%", marginTop: 12 }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Fill Your Profile" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              <Image
                source={image === null ? icons.userDefault2 : image}
                contentFit="cover"
                style={styles.avatar}
              />
              <TouchableOpacity onPress={pickImage} style={styles.pickImage}>
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </View> */}
          <Input
            id="paynest_id"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["paynest_id"]}
            placeholder="Enter Paynest ID"
            placeholderTextColor={COLORS.gray}
          />
          <Input
            id="phone"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["phone"]}
            placeholder="Enter Your Phone Number"
            placeholderTextColor={COLORS.gray}
          />
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
          <Input
            id="address"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["address"]}
            placeholder="Enter Your Address"
            placeholderTextColor={COLORS.gray}
          />
          <Button
            title={isLoading ? "Submitting..." : "Continue"}
            filled
            style={styles.continueButton}
            onPress={() => {
              if (!formState.formIsValid || !gender || !user_id) {
                Alert.alert("Incomplete Form", "Please fill all fields.");
                return;
              }

              const payload = {
                user_id,
                paynest_id: formState.inputValues.paynest_id,
                phone: formState.inputValues.phone,
                address: formState.inputValues.address,
                gender,
                imageUri: image?.uri,
              };

              registerAccount(payload);
            }}
          />
        </ScrollView>
      </View>

      {renderModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  avatarContainer: {
    marginVertical: 12,
    alignItems: "center",
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  avatar: {
    height: 130,
    width: 130,
    borderRadius: 65,
  },
  pickImage: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  continueButton: {
    width: SIZES.width - 32,
    borderRadius: 32,
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginVertical: 12
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.greyscale600,
    textAlign: "center",
    marginVertical: 12
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  modalSubContainer: {
    height: 494,
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  modalIllustration: {
    height: 180,
    width: 180,
    marginVertical: 22
  }
});

export default FillYourProfile;
