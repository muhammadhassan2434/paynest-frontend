import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "@/components/Header";
import { useTheme } from "@/theme/ThemeProvider";
import { COLORS } from "@/constants";
import Button from "@/components/Button";
import Toast from "react-native-toast-message";
import { useAuth } from "@/utils/hooks/AuthContext";
import useFetchServices from "@/hooks/services";
import {
  MY_SPLIT_BILL_REQUESTS,
  PAY_SPLIT_BILL,
} from "@/utils/mutations/splitbill";

type SplitBill = {
  user_id: number;
  split_bill_id: number;
  amount: string;
  title: string;
  status: string;
};

const SplitBillrequests = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const { userId, token } = useAuth();

  const { data: apiResponse = {}, refetch } = useFetchServices(
    ["my_split_requests"],
    () => MY_SPLIT_BILL_REQUESTS(userId, token)
  );
  // console.log(apiResponse)

  const splitBills: SplitBill[] = apiResponse?.data || [];

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handlePay = async (item) => {
    try {
      const payload = {
        user_id: userId,
        split_bill_id: item.split_bill_id,
      };

      const response = await PAY_SPLIT_BILL(payload, token);

      if (response.status) {
        Toast.show({
          type: "success",
          text1: "Payment successful",
        });
        refetch(); // Refresh list
      } else {
        Toast.show({
          type: "error",
          text1: "Payment failed",
          text2: response.message || "Please try again.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Something went wrong.",
      });
    }
  };

  const renderItem = ({ item }: { item: SplitBill }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: dark ? COLORS.dark2 : "#F0F0F0",
          borderLeftColor:
            item.status === "pending" ? COLORS.warning : COLORS.success,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.info}>
          <Text
            style={[
              styles.title,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            {item.title}
          </Text>
          <Text style={[styles.status, { color: COLORS.greyscale600 }]}>
            Status: <Text style={{ fontWeight: "bold" }}>{item.status}</Text>
          </Text>
          <Text style={[styles.status, { color: COLORS.greyscale600 }]}>
            Amount: {item.amount}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handlePay(item)}
          style={{
            backgroundColor: "white",
            borderColor: "grey",
            borderWidth: 2,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "grey", fontSize: 16, fontWeight: "bold" }}>
            Pay now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Header title="Split Bill Requests" />
        {splitBills.length === 0 ? (
          <Text
            style={{
              textAlign: "center",
              color: dark ? COLORS.greyscale500 : COLORS.greyscale600,
              marginTop: 20,
            }}
          >
            No split bill requests found.
          </Text>
        ) : (
          <FlatList
            data={splitBills}
            keyExtractor={(item) => item.split_bill_id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1 },
  container: { flex: 1, padding: 16 },
  card: {
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
    borderLeftWidth: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: "bold",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontFamily: "regular",
  },
});

export default SplitBillrequests;
