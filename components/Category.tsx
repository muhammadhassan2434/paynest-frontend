import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { Image } from 'expo-image';

interface CategoryProps {
    name: string;
    icon: any;
    onPress: () => void;
}

const Category: React.FC<CategoryProps> = ({ name, icon , onPress }) => {
    const { dark } = useTheme();

    const displayName = name.length > 9 ? `${name.slice(0, 9)}...` : name;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onPress}
                style={[styles.iconContainer]}>
                <Image
                    source={icon}
                    contentFit='contain'
                    style={[styles.icon]}
                />
            </TouchableOpacity>
            <Text style={[styles.name, {
                color: dark ? COLORS.white : COLORS.greyscale900
            }]}>{displayName}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 12,
        width: (SIZES.width - 32) / 4,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        // backgroundColor:'#246BFD'
    },
    icon: {
        height: 35,
        width: 40,
        color: ''
    },
    name: {
        fontSize: 14,
        fontFamily: "semiBold",
        color: COLORS.black,
    },
});

export default Category;