import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { COLORS, SIZES, illustrations } from '@/constants';
import Button from '@/components/Button';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

type Nav = {
  navigate: (value: string) => void;
};

const PaynestTransferSuccess = () => {
  const { navigate } = useNavigation<Nav>();
  const { dark, colors } = useTheme();

  const {
    reference,
    amount,
    reciever_name,
    reciever_lastname,
    reciever_number,
  } = useLocalSearchParams();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={dark ? illustrations.bankSuccessDark : illustrations.bankSuccess}
        contentFit='contain'
        style={styles.successImage}
      />

      <Text style={[styles.title, {
        color: dark ? COLORS.white : COLORS.greyscale900
      }]}>
        Your Rs{amount} is on its way
      </Text>

      <View style={styles.detailContainer}>
       
        <Text style={[styles.subtitle, {
          color: dark ? COLORS.white : COLORS.greyscale900,
          marginTop: 16
        }]}>
          You are transferring money to:
        </Text>

        <Text style={[styles.detailText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
          Name: {reciever_name} {reciever_lastname}
        </Text>

        <Text style={[styles.detailText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
          Account Number: {reciever_number}
        </Text>

        <Text style={[styles.detailText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
          Reference ID: {reference}
        </Text>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          title="OK"
          style={styles.sendBtn}
          onPress={() => navigate("(tabs)")}
          filled
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successImage: {
    width: 340,
    height: 242,
  },
  title: {
    fontSize: 28,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginVertical: 22,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "regular",
    textAlign: 'center',
    marginHorizontal: 64,
    marginBottom: 6,
  },
  detailContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 8,
  },
  detailText: {
    fontSize: 15,
    fontFamily: "regular",
    textAlign: 'center',
    marginVertical: 2,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 28,
    right: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  sendBtn: {
    width: SIZES.width - 32,
  },
});

export default PaynestTransferSuccess;
