import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { getFormatedDate } from "react-native-modern-datepicker";
import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";

import Button from "@/components/Button";
import Header from "@/components/Header";
import DatePickerModal from "@/components/DatePickerModal";
import { useTheme } from "@/theme/ThemeProvider";
import { useEffect } from "react";
import { COLORS, FONTS, icons, SIZES } from "@/constants";
import { useAuth } from "@/utils/hooks/AuthContext";
import { STORE_SCHEDULE_PAYMENT } from "@/utils/mutations/schedulepayment";
import RNPickerSelect from "react-native-picker-select";
import useFetchServices from "@/hooks/services";
import {
  ALL_PROVIDER_FOR_BILLPAYMENT,
  VALIDATE_CONSUMER_NUMBER,
} from "@/utils/mutations/billpayment";

const AddSchedulePayment: React.FC = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const { account, userId, token } = useAuth();

  const today = new Date();
  const formattedTomorrow = getFormatedDate(
    new Date(today.setDate(today.getDate() + 1)),
    "YYYY/MM/DD"
  );

  const [amount, setAmount] = useState("");
  const [scheduledFor, setScheduledFor] = useState(formattedTomorrow);
  const [purpose, setPurpose] = useState("");
  const [type, setType] = useState("");
  const [CumsomerNo, setCumsomerNo] = useState("");
  const [service_provider_id, setservice_provider_id] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverAccountNo, setReceiverAccountNo] = useState("");
  const [receiverBank, setReceiverBank] = useState("");
  const [note, setNote] = useState("");
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const {
    data: Providers = [],
    isLoading: ProvidersLoading,
    isError: ProvidersError,
    refetch,
  } = useFetchServices(["all_providers_billpayment"], () =>
    ALL_PROVIDER_FOR_BILLPAYMENT(token)
  );

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (CumsomerNo && service_provider_id) {
      validateConsumerNumber();
    }
  }, 800); // add delay to avoid API calls on every keystroke

  return () => clearTimeout(delayDebounce); // cleanup debounce
}, [CumsomerNo]);


  const typeOptions = [
    { label: "Transfer", value: "transfer" },
    { label: "Bill", value: "bill" },
  ];
  const handleTypeChange = (value: any) => {
    setType(value);
  };

  const inputStyle = {
    backgroundColor: dark ? COLORS.dark2 : "#fff",
    color: dark ? COLORS.white : COLORS.black,
    borderWidth: 1,
    borderColor: dark ? COLORS.greyscale900 : COLORS.grayscale200,
    ...styles.input,
  };

  const renderError = (field: string) =>
    errors[field] ? (
      <Text style={styles.errorText}>{errors[field][0]}</Text>
    ) : null;

  const validateConsumerNumber = async () => {
    if (!CumsomerNo || !service_provider_id) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please enter consumer number and select a provider.",
      });
      return;
    }

    try {
      const payload = {
        consumer_number: CumsomerNo,
        service_provider_id: service_provider_id,
      };

      const response = await VALIDATE_CONSUMER_NUMBER(payload, token);
      if (response?.status === true) {
        // Set values from validation response
        setCumsomerNo(response.consumer_number);
        setAmount(response.amount);
        

        Toast.show({
          type: "success",
          text1: "Validated",
          text2: "Consumer number validated successfully.",
        });

        return {
          bill_provider: service_provider_id,
          consumer_number: response.CumsomerNo,
          customer_name: response.customer_name,
          amount: response.amount,
          due_date: response.due_date,
        };
      } else {
        // Show all validation errors
        if (response?.errors && typeof response.errors === "object") {
          Object.values(response.errors).forEach((messages: any) => {
            if (Array.isArray(messages)) {
              Toast.show({
                type: "error",
                text1: "Validation Failed",
                text2: messages[0],
              });
            }
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Validation Failed",
            text2: response?.message || "Invalid input.",
          });
        }
      }
    } catch (error) {
      console.error("Validation Error", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter correct consumer id.",
      });
    }
  };

  const storePaymentSchedule = useMutation({
    mutationFn: (data: any) => {
    console.log("Payload being sent:", data); // Move log here
    return STORE_SCHEDULE_PAYMENT(data, token);
  },
    onSuccess: (data) => {
      if (data?.status) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Payment scheduled successfully",
        });
        navigation.goBack();
      } else {
        if (data?.message) {
          setErrors(data.message);
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Something went wrong",
          });
        }
      }
    },
    onError: (error) => {
      console.log(error.message);
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: error.message,
      });
    },
  });

  const handleSubmit = () => {
    Keyboard.dismiss();
    setErrors({});
    storePaymentSchedule.mutate({
      account_id: account?.[0]?.id,
      scheduled_for: scheduledFor,
      amount,
      purpose,
      type,
      service_provider_id: type === "bill" ? service_provider_id : "",
      consumer_number: type === "bill" ? CumsomerNo : "",
      receiver_name: type === "transfer" ? receiverName : "",
      receiver_account_no: type === "transfer" ? receiverAccountNo : "",
      receiver_bank: type === "transfer" ? receiverBank : "",
      note,
    });
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Header title="Schedule Payment" />

        <View style={styles.content}>
          <Image
            source={icons.security}
            style={styles.icon}
            resizeMode="contain"
          />

          <Text style={[styles.title, { color: colors.text }]}>
            Schedule a Payment
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
            ]}
          >
            Fill in the payment details to schedule a future transaction.
          </Text>
          <View style={inputStyle}>
            <RNPickerSelect
              placeholder={{ label: "Select Type", value: "" }}
              items={typeOptions}
              onValueChange={(value) => handleTypeChange(value)}
              value={type}
              style={{
                inputIOS: {
                  fontSize: 16,
                  paddingHorizontal: 10,
                  borderRadius: 4,
                  color: COLORS.greyscale600,
                  paddingRight: 30,
                  height: 52,
                  width: SIZES.width - 32,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: dark ? COLORS.greyscale900 : COLORS.grayscale200,
                },
                inputAndroid: {
                  fontSize: 16,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                  color: COLORS.greyscale600,
                  paddingRight: 30,
                  height: 52,
                  width: SIZES.width - 32,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: dark ? COLORS.greyscale900 : COLORS.grayscale200,
                },
              }}
            />
          </View>

          <TextInput
            placeholder="Purpose"
            placeholderTextColor={
              dark ? COLORS.greyscale500 : COLORS.greyscale600
            }
            value={purpose}
            onChangeText={setPurpose}
            style={inputStyle}
          />
          {renderError("purpose")}

          <TouchableOpacity
            style={[inputStyle, { flexDirection: "row", alignItems: "center" }]}
            onPress={() => setOpenDatePicker(true)}
          >
            <Feather name="calendar" size={24} color={COLORS.grayscale400} />
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.grayscale400,
                marginLeft: 8,
              }}
            >
              {scheduledFor}
            </Text>
          </TouchableOpacity>
          {renderError("scheduled_for")}

          {openDatePicker && (
            <DatePickerModal
              open={openDatePicker}
              startDate={formattedTomorrow}
              selectedDate={scheduledFor}
              onClose={() => setOpenDatePicker(false)}
              onChangeStartDate={setScheduledFor}
            />
          )}

          {type === "bill" && (
            <>
              <View style={inputStyle}>
                <RNPickerSelect
                  placeholder={{ label: "Select Service ", value: "" }}
                  items={
                    Providers?.serviceProviders?.map((provider: any) => ({
                      label: provider.name,
                      value: provider.id,
                      key: provider.id,
                    })) || []
                  }
                  onValueChange={(value) => setservice_provider_id(value)}
                  value={service_provider_id}
                  style={{
                    inputIOS: {
                      fontSize: 16,
                      paddingHorizontal: 10,
                      borderRadius: 4,
                      color: COLORS.greyscale600,
                      paddingRight: 30,
                      height: 52,
                      width: SIZES.width - 32,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: dark
                        ? COLORS.greyscale900
                        : COLORS.grayscale200,
                    },
                    inputAndroid: {
                      fontSize: 16,
                      paddingHorizontal: 10,
                      borderRadius: 12,
                      color: COLORS.greyscale600,
                      paddingRight: 30,
                      height: 52,
                      width: SIZES.width - 32,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: dark
                        ? COLORS.greyscale900
                        : COLORS.grayscale200,
                    },
                  }}
                />
                {renderError("service_provider_id")}
              </View>

              <TextInput
                placeholder="Consumer No"
                placeholderTextColor={
                  dark ? COLORS.greyscale500 : COLORS.greyscale600
                }
                value={CumsomerNo}
                onChangeText={setCumsomerNo}
                style={inputStyle}
              />
              {renderError("consumer_number")}
            </>
          )}

          {type === "transfer" && (
            <>
              <TextInput
                placeholder="Receiver Name"
                placeholderTextColor={
                  dark ? COLORS.greyscale500 : COLORS.greyscale600
                }
                value={receiverName}
                onChangeText={setReceiverName}
                style={inputStyle}
              />
              {renderError("receiver_name")}

              <TextInput
                placeholder="Receiver Account No"
                placeholderTextColor={
                  dark ? COLORS.greyscale500 : COLORS.greyscale600
                }
                value={receiverAccountNo}
                onChangeText={setReceiverAccountNo}
                style={inputStyle}
              />
              {renderError("receiver_account_no")}

              <TextInput
                placeholder="Receiver Bank"
                placeholderTextColor={
                  dark ? COLORS.greyscale500 : COLORS.greyscale600
                }
                value={receiverBank}
                onChangeText={setReceiverBank}
                style={inputStyle}
              />
              {renderError("receiver_bank")}
              <TextInput
                placeholder="Amount"
                placeholderTextColor={
                  dark ? COLORS.greyscale500 : COLORS.greyscale600
                }
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={inputStyle}
              />
              {renderError("amount")}
            </>
          )}

          <TextInput
            placeholder="Note"
            placeholderTextColor={
              dark ? COLORS.greyscale500 : COLORS.greyscale600
            }
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            style={[inputStyle, { height: 80, textAlignVertical: "top" }]}
          />
          {renderError("note")}

          <Button
            title="Schedule Payment"
            onPress={handleSubmit}
            filled
            style={styles.button}
            loading={storePaymentSchedule.isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  content: {
    alignItems: "center",
    paddingTop: 24,
  },
  icon: {
    height: 100,
    width: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "regular",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  input: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: "regular",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
});

export default AddSchedulePayment;
