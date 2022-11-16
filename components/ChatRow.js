import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import tw from "tailwind-react-native-classnames";
import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
import { auth, db } from "../firebase";

const ChatRow = ({ matchDetails }) => {
    const navigation = useNavigation();
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState('');
    const user = auth.currentUser;

    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid))
    }, [matchDetails, user]);

    useEffect(
        () => 
            onSnapshot(
                query(
                    collection(db, "matches", matchDetails.id, "messages"),
                    orderBy("timestamp", "desc")
                ), snapshot => setLastMessage(snapshot.docs[0]?.data()?.message)
            ),
        [matchDetails, db]
    );

    const {photoUrl} = useState(user.photoURL)

    return (
        <TouchableOpacity
            onPress={() => 
                navigation.navigate("Message", {
                    matchDetails,
                })
            }
            style={[
                tw`flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg`,
                styles.cardShadow,
            ]}            
        >
        
           <Image style={tw`rounded-full h-14 w-14 mr-4`}
                source={
                    photoUrl
					? {uri: photoUrl}
					: require('../images/empty.png')
                }
           />

           <View>
               <Text style={tw`text-lg font-semibold`}>
               {matchedUserInfo?.displayName
                ? matchedUserInfo?.displayName
                : "Anónimo"
               }
               </Text>
               <Text>{lastMessage || "Saluda ☺"}</Text>
           </View>
        </TouchableOpacity>
    )
}

export default ChatRow

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
});