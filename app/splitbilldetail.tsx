import Header from '@/components/Header';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

type splitBill = {
  id: string;
  total_amount: string;
  collected_amount: string;
  receiver_account_no?: string;
  receiver_bank?: string;
  note?: string;
  status?: string;
  created_at?: string;
};
type RouteParams = {
  splitBill: splitBill;
};
const SplitBillDetail = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { splitBill } = route.params;

  return (
    <ScrollView style={styles.container}>
        <Header title="Split Bill Detail" />

      <View style={styles.detailCard}>
      <Text style={styles.header}>{splitBill.title}</Text>
        <DetailItem label="Total Amount" value={`Rs. ${splitBill.total_amount}`} />
        <DetailItem label="Collected Amount" value={`Rs. ${splitBill.collected_amount}`} />
        <DetailItem label="Receiver Account No" value={splitBill.receiver_account_no} />
        <DetailItem label="Receiver Bank" value={splitBill.receiver_bank} />
        <DetailItem label="Status" value={splitBill.status} status />
        {splitBill.note && <DetailItem label="Note" value={splitBill.note} />}
        <DetailItem label="Created At" value={new Date(splitBill.created_at).toLocaleString()} />
      </View>
    </ScrollView>
  );
};

const DetailItem = ({ label, value, status = false }) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <Text
      style={[
        styles.value,
        status && {
          color: value === 'pending' ? '#FFA500' : '#32CD32',
          fontWeight: 'bold',
        },
      ]}
    >
      {value}
    </Text>
  </View>
);

export default SplitBillDetail;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  detailCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    marginTop:20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  item: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#777',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
});
