import { useNavigation, useRoute } from '@react-navigation/core';
import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native';
import tw from "tailwind-react-native-classnames";

const MatchedScreen = () => {
    const navigation = useNavigation();
    const { params } = useRoute();

    const { loggedInProfile, userSwiped } = params;

    return (
        <View style={[tw`h-full bg-yellow-400 pt-20`, { opacity: 0.89 }]}>
            <View style={tw`justify-center px-10 pt-20`}>
                <Text style={tw`font-bold text-white text-center text-4xl`}>
                    ¡Es un Pet Match!
                </Text>
            </View>

            <Text style={tw`text-white text-center mt-5`}>
                Tú y {userSwiped.displayName} han hecho Match el uno con el otro.
            </Text>

            <View style={tw`flex-row justify-evenly mt-5`}>
                <Image
                    style={tw`h-32 w-32 rounded-full`}
                    source={
                        loggedInProfile.photoURL
                        ? { uri: loggedInProfile.photoURL }
                        : require('../images/empty.png')
                    }
                />
                <Image
                    style={tw`h-32 w-32 rounded-full`}
                    source={
                        userSwiped.photoURL
                        ? { uri: userSwiped.photoURL }
                        : require('../images/empty.png')
                    }
                />
            </View>

            <TouchableOpacity
                style={tw`bg-white m-5 px-10 py-8 rounded-full mt-20`}
                onPress={() => {
                    navigation.goBack();
                    navigation.navigate("Chat");
                }}
            >
                <Text style={tw`text-center`}>Envía un Mensaje</Text>
            </TouchableOpacity>
        </View>
    );
};

export default MatchedScreen
