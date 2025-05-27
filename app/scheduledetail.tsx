import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeProvider";
import { COLORS } from "@/constants";
import Header from "@/components/Header";
import { useAuth } from "@/utils/hooks/AuthContext";
import {
  REFUND_BACK_SCHEDULE_PAYMENT,
  REFUND_SCHEDULE_PAYMENT,
} from "@/utils/mutations/schedulepayment";
import Toast from "react-native-toast-message";

// Define the route params type
type Schedule = {
  id: string;
  scheduled_for: string;
  purpose: string;
  type?: string;
  amount?: number;
  consumer_number?: string;
  receiver_name?: string;
  receiver_account_no?: string;
  receiver_bank?: string;
  note?: string;
  status?: string;
  created_at?: string;
  is_funded?: number;
};

type RouteParams = {
  Schedule: Schedule;
};

const ScheduleDetail = () => {
  const { colors, dark } = useTheme();
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { Schedule } = route.params;
  const { account, userId, token, getUserInfo } = useAuth();
  const [loading, setLoading] = React.useState(false);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Schedule Detail" />

        <Text
          style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}
        >
          {Schedule.scheduled_for}
        </Text>

        <View style={styles.detailBox}>
          <Text
            style={[
              styles.label,
              { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 },
            ]}
          >
            Purpose:
          </Text>
          <Text
            style={[
              styles.value,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            {Schedule.purpose}
          </Text>
        </View>
        <View style={styles.detailBox}>
          <Text
            style={[
              styles.label,
              { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 },
            ]}
          >
            Type:
          </Text>
          <Text
            style={[
              styles.value,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            {Schedule.type}
          </Text>
        </View>

        {Schedule.amount && (
          <View style={styles.detailBox}>
            <Text
              style={[
                styles.label,
                { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 },
              ]}
            >
              Amount:
            </Text>
            <Text
              style={[
                styles.value,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {Schedule.amount}
            </Text>
          </View>
        )}
        {Schedule.status && (
          <View style={styles.detailBox}>
            <Text
              style={[
                styles.label,
                { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 },
              ]}
            >
              Status:
            </Text>
            <Text
              style={[
                styles.value,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {Schedule.status}
            </Text>
          </View>
        )}

        {Schedule.consumer_number && (
          <View style={styles.detailBox}>
            <Text
              style={[
                styles.label,
                { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 },
              ]}
            >
              Consumer Number:
            </Text>
            <Text
              style={[
                styles.value,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {Schedule.consumer_number}
            </Text>
          </View>
        )}
        {Schedule.receiver_name && (
          <View style={styles.detailBox}>
            <Text
              style={[
                styles.label,
                { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 },
              ]}
            >
              Receiver Name:
            </Text>
            <Text
              style={[
                styles.value,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {Schedule.receiver_name}
            </Text>
          </View>
        )}
        {Schedule.receiver_account_no && (
          <View style={styles.detailBox}>
            <Text
              style={[
                styles.label,
                { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 },
              ]}
            >
              Receiver Account Number:
            </Text>
            <Text
              style={[
                styles.value,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {Schedule.receiver_account_no}
            </Text>
          </View>
        )}
        {Schedule.receiver_bank && (
          <View style={styles.detailBox}>
            <Text
              style={[
                styles.label,
                { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 },
              ]}
            >
              Receiver Bank:
            </Text>
            <Text
              style={[
                styles.value,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {Schedule.receiver_bank}
            </Text>
          </View>
        )}
        {Schedule.note && (
          <View style={styles.detailBox}>
            <Text
              style={[
                styles.label,
                { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 },
              ]}
            >
              Note:
            </Text>
            <Text
              style={[
                styles.value,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {Schedule.note}
            </Text>
          </View>
        )}
        {Schedule.created_at && (
          <View style={styles.detailBox}>
            <Text
              style={[
                styles.label,
                { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 },
              ]}
            >
              Created At:
            </Text>
            <Text
              style={[
                styles.value,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {new Date(Schedule.created_at).toISOString().slice(0, 10)}
            </Text>
          </View>
        )}
        {Schedule.status === "scheduled" && Schedule.is_funded === 1 && (
          <TouchableOpacity
            style={{
              backgroundColor: loading ? COLORS.grayscale400 : COLORS.primary,
              padding: 12,
              borderRadius: 8,
              marginTop: 24,
              alignItems: "center",
            }}
            onPress={async () => {
              if (loading) return;
              try {
                setLoading(true);
                const response = await REFUND_SCHEDULE_PAYMENT(
                  Schedule.id,
                  token
                );
                console.log("Refund Success:", response);
                Toast.show({
                  type: "success",
                  text1: "Refund Success!",
                });
                // Optionally show success toast/alert here
              } catch (error) {
                console.error("Refund Error:", error);
                Toast.show({
                  type: "error",
                  text1: "Refund Error",
                  text2: "Please try again.",
                });
                // Optionally show error toast/alert here
              } finally {
                setLoading(false);
              }
            }}
          >
            <Text
              style={{ color: COLORS.white, fontFamily: "bold", fontSize: 16 }}
            >
              {loading ? "Processing..." : "Refund"}
            </Text>
          </TouchableOpacity>
        )}
        {Schedule.status === "scheduled" && Schedule.is_funded === 0 && (
          <TouchableOpacity
            style={{
              backgroundColor: loading ? COLORS.grayscale400 : COLORS.primary,
              padding: 12,
              borderRadius: 8,
              marginTop: 24,
              alignItems: "center",
            }}
            onPress={async () => {
              if (loading) return;
              try {
                setLoading(true);
                const response = await REFUND_BACK_SCHEDULE_PAYMENT(
                  Schedule.id,
                  token
                );
                console.log("Refund Success:", response);
                Toast.show({
                  type: "success",
                  text1: "Refund back Success!",
                });
                // Optionally show success toast/alert here
              } catch (error) {
                console.error("Refund Error:", error);
                Toast.show({
                  type: "error",
                  text1: "Refund back Error",
                  text2: "Please try again.",
                });
                // Optionally show error toast/alert here
              } finally {
                setLoading(false);
              }
            }}
          >
            <Text
              style={{ color: COLORS.white, fontFamily: "bold", fontSize: 16 }}
            >
              {loading ? "Processing..." : "Refund Back"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1 },
  container: { flexGrow: 1, padding: 16 },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  detailBox: { marginBottom: 16 },
  label: { fontSize: 16, fontFamily: "medium" },
  value: { fontSize: 18, fontFamily: "regular", marginTop: 4 },
});

export default ScheduleDetail;
