import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/utils/hooks/AuthContext";
import Header from "@/components/Header";
import {
  FETCH_GAS_PROVIDER,
} from "@/utils/mutations/billpayment";
import useFetchServices from "@/hooks/services";
import { useNavigation } from "expo-router";

type ServiceProvider = {
  id: number;
  service_id: number;
  name: string;
  logo: string;
};

type Nav = {
  navigate: (value: string) => void;
  providerId: number;
};

const GasBillList: React.FC = () => {
  const { token } = useAuth();
  const navigation = useNavigation<Nav>();
  const {
    data: services = [],
    isLoading: servicesLoading,
    isError: servicesError,
    refetch,
  } = useFetchServices(["gas_providers"], () => FETCH_GAS_PROVIDER(token));

  if (servicesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ marginTop: 10 }}>Loading Providers...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: ServiceProvider }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("paybillgascustomerid", { providerId: item.id })
      }
    >
      <Image
        source={{ uri: `https://paynest.coinxness.com/${item.logo}` }}
        style={styles.logo}
      />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Header title="Gas Bill Payment" />
        <FlatList
          data={services?.serviceProviders || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={{ paddingTop: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  container: {
    padding: 20,
    paddingTop: 40,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default GasBillList;
