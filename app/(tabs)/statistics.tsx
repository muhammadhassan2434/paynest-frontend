import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '@/constants';
import { Image } from 'expo-image';
import { useTheme } from '@/theme/ThemeProvider';
import { useNavigation } from 'expo-router';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { AnalyticsMonthV1, AnalyticsQuarterV1, AnalyticsYearToYearV1, AnalyticsYearV1 } from '@/tabs';
import { useAuth } from '@/utils/hooks/AuthContext';

const renderScene = SceneMap({
  first: AnalyticsMonthV1,
  second: AnalyticsQuarterV1,
  third: AnalyticsYearV1,
});

type Nav = {
  navigate: (value: string) => void
}


const Statistics = () => {
  const { navigate } = useNavigation<Nav>();
  const { colors, dark } = useTheme();
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const {account, userId, token } = useAuth();
  const [routes] = React.useState([
    { key: 'first', title: 'Month' },
    { key: 'second', title: 'Quarter' },
    { key: 'third', title: 'Year' },
  ]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.primary,
      }}
      style={{
        backgroundColor: colors.background,
      }}
      renderLabel={({ route, focused }) => (
        <Text style={[{
          color: focused ? COLORS.primary : 'gray',
          fontSize: 16,
          fontFamily: "bold"
        }]}>
          {route.title}
        </Text>
      )}
    />
  );

  /**
   * Render header
   */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image
            source={images.paylogo1}
            contentFit='contain'
            style={styles.headerLogo}
          />
          <Text style={[styles.headerTitle, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>Analytics</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>
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
    backgroundColor: COLORS.white,
    padding: 16
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    marginBottom: 12
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  headerLogo: {
    height: 34,
    width: 34,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.black,
    marginLeft: 12
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center"
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },
  moreCircleIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
    marginLeft: 12
  },
})

export default Statistics