import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { FONTS } from '@/constants/fonts';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/utils/hooks/AuthContext';
import Toast from 'react-native-toast-message';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

//Ignore all log notifications
LogBox.ignoreAllLogs();

// Define valid screen names
type ScreenName = 'index' | 'login';

export default function RootLayout() {
  const [loaded] = useFonts(FONTS);
  const [initialRoute, setInitialRoute] = useState<ScreenName | null>(null);
  const queryClient = new QueryClient();
  const router = useRouter();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');
        if (alreadyLaunched === null) {
          await AsyncStorage.setItem('alreadyLaunched', 'true');
          setInitialRoute('index'); 
        } else {
          setInitialRoute('login'); 
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      }
    };

    checkFirstLaunch();
  }, []);


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || initialRoute === null) {
    return null;
  }

  return (
    <AuthProvider>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding2" />
        <Stack.Screen name="onboarding3" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgotpasswordmethods" />
        <Stack.Screen name="forgotpasswordphonenumber" />
        <Stack.Screen name="forgotpasswordemail" />
        <Stack.Screen name="otpverification" />
        <Stack.Screen name="verifymobileotp" />
        <Stack.Screen name="createnewpin" />
        {/* <Stack.Screen name="reasonforusingallpay" /> */}
        {/* <Stack.Screen name="verifyyouridentity" /> */}
        {/* <Stack.Screen name="proofofresidency" /> */}
        {/* <Stack.Screen name="photoidcard" /> */}
        {/* <Stack.Screen name="selfiewithidcard" /> */}
        {/* <Stack.Screen name="facerecognitionwalkthrough" /> */}
        {/* <Stack.Screen name="facerecognitionscan" /> */}
        {/* <Stack.Screen name="scanqrcode" /> */}
        <Stack.Screen name="fillyourprofile" />
        {/* paynest transfer routes  */}
        <Stack.Screen name="paynesttransferid" />
        <Stack.Screen name="paynesttransferamountform" />
        <Stack.Screen name="paynesttransfersummary" />
        <Stack.Screen name="paynesttransfersuccess" />

        {/* bill reminder routes */}
        <Stack.Screen name="billreminderlistscreen" />
        <Stack.Screen name="addbillreminder" />



        <Stack.Screen name="notifications" />
        <Stack.Screen name="address" />
        <Stack.Screen name="addnewaddress" />
        <Stack.Screen name="editprofile" />
        <Stack.Screen name="settingshelpcenter" />
        <Stack.Screen name="settingssecurity" />
        <Stack.Screen name="settingslanguage" />
        <Stack.Screen name="settingsnotifications" />
        <Stack.Screen name="addnewcard" />
        <Stack.Screen name="changeemail" />
        <Stack.Screen name="changepassword" />
        <Stack.Screen name="changepin" />
        <Stack.Screen name="settingsprivacypolicy" />
        <Stack.Screen name="settingsinvitefriends" />
        <Stack.Screen name="customerservice" />
        <Stack.Screen name="allservices" />
        <Stack.Screen name="promoanddiscount" />
        <Stack.Screen name="paybillselectricitycustomerid" />
        <Stack.Screen name="paybillselectricityreviewsummary" />
        <Stack.Screen name="paybillsinternetcustomerid" />
        <Stack.Screen name="paybillsinternetreviewsummary" />
        <Stack.Screen name="paybillswatercustomerid" />
        <Stack.Screen name="paybillswaterreviewsummary" />
        <Stack.Screen name="paybillssuccessful" />
        <Stack.Screen name="requestmoney" />
        <Stack.Screen name="requestmoneyamount" />
        <Stack.Screen name="requestmoneysuccessful" />
        <Stack.Screen name="transfertobankamountform" />
        <Stack.Screen name="transfertobankselectbank" />
        <Stack.Screen name="transfertobankreviewsummary" />
        <Stack.Screen name="transfertobanksuccessful" />
        <Stack.Screen name="sendmoney" />
        <Stack.Screen name="sendmoneytypeamount" />
        <Stack.Screen name="sendmoneychoosepaymenttype" />
        <Stack.Screen name="sendmoneyreviewsummary" />
        <Stack.Screen name="sendmoneysuccessful" />
        <Stack.Screen name="inoutpaymenthistory" />
        <Stack.Screen name="inoutpaymentviewereceipt" />
        <Stack.Screen name="statisticsversion2" />
        <Stack.Screen name="statisticsversion3" />
        <Stack.Screen name="statisticsversion4" />
        <Stack.Screen name="userallpay" />
        <Stack.Screen name="ecarddetails" />
        <Stack.Screen name="ecardrefund" />
        <Stack.Screen name="ecardtopup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
    <Toast />
    </QueryClientProvider>
    </AuthProvider>
  );
}