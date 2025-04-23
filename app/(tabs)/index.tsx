import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES, icons, images } from '@/constants';
import { Image } from 'expo-image';
import { NavigationProp } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from 'expo-router';
import SubHeaderItem from '@/components/SubHeaderItem';
import { services } from '@/data';
import Category from '@/components/Category';
import { useAuth } from '@/utils/hooks/AuthContext';
import useAuthMiddleware from '@/utils/hooks/useAuthMiddleware';

type Nav = {
  navigate: (value: string) => void
}
const capitalizeFirstLetter = (str?: string) => {
  if (!str) return '';
  return str[0].toUpperCase() + str.slice(1);
};


const HomeScreen = () => {
  useAuthMiddleware();
  const { account, token, logout, getUserInfo } = useAuth();
  // console.log(account)
  const { dark, colors } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const { navigate } = useNavigation<Nav>();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true); // State to toggle balance visibility

  useFocusEffect(
    useCallback(() => {
      const fetchUserInfo = async () => {
        if (token && account && account.length > 0) { // Ensure token and account are available
          await getUserInfo(); // Refresh user data when screen is focused
        }
      };
    
      fetchUserInfo();
    }, [token, account?.[0]?.id]) // Trigger when token or account changes
  );

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(prevState => !prevState); // Toggle the visibility
  };
  /**
  * Render header
  */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.viewLeft}>
          <Image
            source={images.paylogo}
            contentFit='contain'
            style={styles.userIcon}
          />
          <View style={styles.viewNameContainer}>
            <Text style={styles.greeeting}>Good Morning👋</Text>
            <Text style={[styles.title, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}> {capitalizeFirstLetter(account?.[0]?.user?.first_name)}</Text>
          </View>
        </View>
        <View style={styles.viewRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate("")}>
            <Image
              source={icons.notificationBell2}
              contentFit='contain'
              style={[styles.bellIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  /**
   * Render card
   */
  const renderCard = () => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.topCardContainer}>
          <View>
            <Text style={styles.username}>{capitalizeFirstLetter(account?.[0]?.user.first_name)} {capitalizeFirstLetter(account?.[0]?.user.last_name)}</Text>
            <Text style={styles.cardNum}>{account?.[0]?.phone}</Text>
          </View>
          {/*  */}
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Your balance</Text>
          <TouchableOpacity onPress={toggleBalanceVisibility}>
        <Text style={styles.balanceAmount}>
          {isBalanceVisible ? `Rs ${account?.[0]?.balance}` : '****'}
        </Text>
      </TouchableOpacity>
        </View>
        <View style={styles.bottomCardContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("paynesttransferid")}
            style={styles.categoryContainer}>
            <View style={styles.categoryIconContainer}>
              <Image
                source={icons.send}
                contentFit='contain'
                style={styles.categoryIcon}
              />
            </View>
            <Text style={styles.categoryText}>Transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("paynesttransferid")}
            style={styles.categoryContainer}>
            <View style={styles.categoryIconContainer}>
              <Image
                source={icons.sendMoney}
                contentFit='contain'
                style={styles.categoryIcon}
              />
            </View>
            <Text style={styles.categoryText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("")}
            style={styles.categoryContainer}>
            <View style={styles.categoryIconContainer}>
              <Image
                source={icons.arrowDownSquare}
                contentFit='contain'
                style={styles.categoryIcon}
              />
            </View>
            <Text style={styles.categoryText}>Request</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("")}
            style={styles.categoryContainer}>
            <View style={styles.categoryIconContainer}>
              <Image
                source={icons.swapUpDown}
                contentFit='contain'
                style={styles.categoryIcon}
              />
            </View>
            <Text style={styles.categoryText}>In & Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  /**
   * render category
   */
  const renderCategories = () => {
    return (
      <View>
        <SubHeaderItem
          title="Services"
          navTitle="See all"
          onPress={() => navigate("allservices")}
        />
        <FlatList
          data={services.slice(0, 8)}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          numColumns={4} // Render two items per row
          style={{ marginTop: 0 }}
          renderItem={({ item, index }) => (
            <Category
              name={item.name}
              icon={item.icon}
              iconColor={item.iconColor}
              backgroundColor={item.backgroundColor}
              onPress={() => {
                if (item.onPress !== "") {
                  navigation.navigate(item.onPress);
                }
              }}
            />
          )}
        />
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderCard()}
          {renderCategories()}
        </ScrollView>
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
    width: SIZES.width - 32,
    justifyContent: "space-between",
    alignItems: "center"
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 32
  },
  viewLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  greeeting: {
    fontSize: 12,
    fontFamily: "regular",
    color: "gray",
    marginBottom: 4
  },
  title: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900
  },
  viewNameContainer: {
    marginLeft: 12
  },
  viewRight: {
    flexDirection: "row",
    alignItems: "center"
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 8
  },
  bookmarkIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black
  },
  cardContainer: {
    width: SIZES.width - 32,
    height: 340,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    marginTop: 16,
    paddingHorizontal: 22,
  },
  topCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16
  },
  username: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.white,
    marginBottom: 8
  },
  cardNum: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.white
  },
  cardIcon: {
    height: 45,
    width: 72,
  },
  balanceContainer: {
    marginVertical: 32
  },
  balanceText: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.white,
    marginBottom: 8
  },
  balanceAmount: {
    fontSize: 28,
    fontFamily: "extraBold",
    color: COLORS.white
  },
  bottomCardContainer: {
    width: "100%",
    height: 90,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12
  },
  categoryContainer: {
    alignItems: "center",
  },
  categoryIconContainer: {
    height: 52,
    width: 52,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.tansparentPrimary,
    marginBottom: 4
  },
  categoryIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "semiBold",
    color: COLORS.primary
  }
})

export default HomeScreen