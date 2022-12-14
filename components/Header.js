import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import tw from "tailwind-react-native-classnames";
import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/core';

const Header = ({ title }) => {
    const navigation = useNavigation();

    return (
        <View style={tw`p-2 flex-row items-center justify-between`}>
            <View style={tw`flex flex-row items-center`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
                    <Ionicons name="chevron-back-outline" size={34} color="white" />
                </TouchableOpacity>
                <Text style={tw`text-2xl font-bold pl-2`}>{title}</Text>
            </View>
        </View>
    );
};

export default Header