import { View, Text, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { COLORS, illustrations, SIZES } from '../constants';
import { OtpInput } from "react-native-otp-entry";
import Button from "../components/Button";
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from 'expo-router';

type Nav = {
  navigate: (value: string) => void
}

const verifyMobileOtp = () => {
  const { navigate } = useNavigation<Nav>();
  const [time, setTime] = useState(50);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors, dark } = useTheme();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [])

   const renderModal = () => {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}>
          <TouchableWithoutFeedback
            onPress={() => setModalVisible(false)}>
            <View style={[styles.modalContainer]}>
              <View style={[styles.modalSubContainer, {
                backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite
              }]}>
                <Image
                  source={illustrations.passwordSuccess}
                  resizeMode='contain'
                  style={styles.modalIllustration}
                />
                <Text style={styles.modalTitle}>Congratulations!</Text>
                <Text style={[styles.modalSubtitle, {
                  color: dark ? COLORS.greyscale300 : COLORS.greyscale600,
                }]}>Your account is ready to use. You will be redirected to the Home page in a few seconds..</Text>
                <Button
                  title="Continue"
                  filled
                  onPress={() => {
                    setModalVisible(false)
                    navigate("login")
                  }}
                  style={{
                    width: "100%",
                    marginTop: 12
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )
    }
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Forgot Password" />
        <ScrollView>
          <Text style={[styles.title, {
            color: dark ? COLORS.white : COLORS.black
          }]}>Code has been send to Mobile  +1 111 ******99</Text>
          <OtpInput
            numberOfDigits={4}
            onTextChange={(text) => console.log(text)}
            focusColor={COLORS.primary}
            focusStickBlinkingDuration={500}
            onFilled={(text) => console.log(`OTP is ${text}`)}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                borderColor: dark ? COLORS.gray : COLORS.secondaryWhite,
                borderWidth: .4,
                borderRadius: 10,
                height: 58,
                width: 58,
              },
              pinCodeTextStyle: {
                color: dark ? COLORS.white : COLORS.black,
              }
            }}
          />
          <View style={styles.codeContainer}>
            <Text style={[styles.code, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>Resend code in</Text>
            <Text style={styles.time}>{`  ${time} `}</Text>
            <Text style={[styles.code, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>s</Text>
          </View>
        </ScrollView>
        <Button
          title="Verify"
          filled
          style={styles.button}
          onPress={() => setModalVisible(true)}
        />
      </View>
      {/* render model */}
      {renderModal()}
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
  title: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 54
  },
  OTPStyle: {
    borderRadius: 8,
    height: 58,
    width: 58,
    backgroundColor: COLORS.white,
    borderBottomColor: "gray",
    borderBottomWidth: .4,
    borderWidth: .4,
    borderColor: "gray"
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    justifyContent: "center"
  },
  code: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    textAlign: "center"
  },
  time: {
    fontFamily: "medium",
    fontSize: 18,
    color: COLORS.primary
  },
  button: {
    borderRadius: 32
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
})

export default verifyMobileOtp