import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
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
  GET_ALL_SPLIT_BILL,
  GET_TRANSFERED_SPLIT_BILL,
} from "@/utils/mutations/splitbill";

type SplitBill = {
  id: string;
  title: string;
  total_amount: string;
  created_at: string;
  status: string;
};

const tabs = ["All", "Transferred"];

const SplitBillScreen = () => {
  const { colors, dark } = useTheme();
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const navigation = useNavigation();
  const { userId, token } = useAuth();

  const { data: apiResponse = {}, refetch: refetchAllSplitBill } =
    useFetchServices(["all_split_bill"], () =>
      GET_ALL_SPLIT_BILL(userId, token)
    );

  const allSplitBill = apiResponse?.data || [];

  const {
    data: responsetransferredSplitBill = [],
    refetch: refetchTransferredSplitBill,
  } = useFetchServices(["transferred_split_bill"], () =>
    GET_TRANSFERED_SPLIT_BILL(userId, token)
  );
  const transferredSplitBill = responsetransferredSplitBill?.data || [];

  useFocusEffect(
    useCallback(() => {
      refetchAllSplitBill();
      refetchTransferredSplitBill();
    }, [refetchAllSplitBill, refetchTransferredSplitBill])
  );

  const renderSplitBill: ListRenderItem<SplitBill> = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.reminderCard,
        {
          backgroundColor: dark ? COLORS.dark2 : "#F0F0F0",
          borderLeftWidth: 5,
          borderLeftColor:
            item.status === "pending" ? COLORS.warning : COLORS.success,
        },
      ]}
      onPress={() =>
        navigation.navigate("splitbilldetail", { splitBill: item })
      }
    >
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text
            style={[
              styles.billName,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.billDate,
              { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
            ]}
          >
            Status: <Text style={{ fontWeight: "bold" }}>{item.status}</Text>
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Text
            style={[
              styles.createdAtText,
              { color: dark ? COLORS.greyscale400 : COLORS.greyscale700 },
            ]}
          >
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredSplitBills =
    selectedTab === "All" ? allSplitBill : transferredSplitBill;

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Header title="Split Bill" />
        <Text
          style={[
            styles.title,
            { color: dark ? COLORS.white : COLORS.greyscale900 },
          ]}
        >
          Split Bill
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: dark ? COLORS.greyscale300 : COLORS.greyScale800 },
          ]}
        >
          Never forget to settle up. Set reminders for shared expenses with
          friends.
        </Text>

        <Button
          title="Split Bill"
          onPress={() => navigation.navigate("createsplitbill")}
          style={{ marginBottom: 20 }}
        />

        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                {
                  backgroundColor:
                    selectedTab === tab
                      ? COLORS.primary
                      : dark
                      ? COLORS.dark2
                      : COLORS.grayscale200,
                },
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  { color: selectedTab === tab ? COLORS.white : COLORS.black },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredSplitBills.length === 0 ? (
          <Text
            style={{
              color: dark ? COLORS.greyscale500 : COLORS.greyscale600,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            No split bills found.
          </Text>
        ) : (
          <FlatList
            data={filteredSplitBills}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderSplitBill}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1 },
  container: { flex: 1, padding: 16 },
  viewContainer: { flex: 1 },
  reminderInfo: { flex: 1 },
  billName: { fontSize: 16, fontFamily: "bold" },
  billDate: { fontSize: 14, fontFamily: "regular", marginTop: 4 },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "regular",
    textAlign: "center",
    marginBottom: 8,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tabButtonText: {
    fontSize: 14,
    fontFamily: "bold",
  },
  reminderCard: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    marginLeft: 12,
    alignItems: "flex-end",
  },
  //
  createdAtText: {
    fontSize: 13,
    fontStyle: "italic",
  },
});

export default SplitBillScreen;
