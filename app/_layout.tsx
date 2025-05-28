import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { FONTS } from "@/constants/fonts";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { LogBox, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/utils/hooks/AuthContext";
import Toast from "react-native-toast-message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
LogBox.ignoreAllLogs();

export default function RootLayout() {
  const [loaded] = useFonts(FONTS);
  const [navigationDone, setNavigationDone] = useState(false);
  const queryClient = new QueryClient();
  const router = useRouter();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const alreadyLaunched = await AsyncStorage.getItem("alreadyLaunched");
        if (alreadyLaunched === null) {
          await AsyncStorage.setItem("alreadyLaunched", "true");
          router.replace("/index"); // First time user
        } else {
          router.replace("/login"); // Returning user
        }
      } catch (error) {
        console.error("Error checking first launch:", error);
        router.replace("/login"); // Default fallback
      } finally {
        setNavigationDone(true);
      }
    };

    if (loaded) {
      SplashScreen.hideAsync();
      checkFirstLaunch();
    }
  }, [loaded]);

  // Show splash/loading screen until fonts and navigation are ready
  if (!loaded || !navigationDone) {
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="forgotpasswordmethods" />
            <Stack.Screen name="forgotpasswordphonenumber" />
            <Stack.Screen name="forgotpasswordemail" />
            <Stack.Screen name="otpverification" />
            <Stack.Screen name="verifymobileotp" />
            <Stack.Screen name="createnewpin" />
            <Stack.Screen name="fillyourprofile" />
            {/* paynest transfer routes  */}
            <Stack.Screen name="paynesttransferid" />
            <Stack.Screen name="paynesttransferamountform" />
            <Stack.Screen name="paynesttransfersummary" />
            <Stack.Screen name="paynesttransfersuccess" />
            {/* end */}
            {/* bill reminder routes */}
            <Stack.Screen name="billreminderlistscreen" />
            <Stack.Screen name="addbillreminder" />
            <Stack.Screen name="billreminderdetail" />
            <Stack.Screen name="editbillreminder" />
            {/* end */}

            {/* shedulepayment routes */}
            <Stack.Screen name="schedulepaymentlistscreen" />
            <Stack.Screen name="addschedulepayment" />
            <Stack.Screen name="scheduledetail" />
            {/* end */}

            {/* electricity bill routes */}
            <Stack.Screen name="electricitybilllist" />
            <Stack.Screen name="paybillselectricitycustomerid" />
            <Stack.Screen name="paybillselectricityreviewsummary" />
            {/* end */}

            {/* gas bill routes */}
            <Stack.Screen name="gasbilllist" />
            <Stack.Screen name="paybillgascustomerid" />
            <Stack.Screen name="paybillsgasreviewsummary" />
            {/* end */}

            {/* split bil routes */}
            <Stack.Screen name="splitbillscreen" />
            <Stack.Screen name="createsplitbill" />
            <Stack.Screen name="splitbilldetail" />
            <Stack.Screen name="splitbillrequest" />

            <Stack.Screen name="editprofile" />
            <Stack.Screen name="settingshelpcenter" />
            <Stack.Screen name="settingsprivacypolicy" />
            <Stack.Screen name="changepassword" />
            <Stack.Screen name="customerservice" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
        <Toast />
      </QueryClientProvider>
    </AuthProvider>
  );
}
