import { collection, onSnapshot, query, where } from '@firebase/firestore';
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import tw from "tailwind-react-native-classnames";
import { auth, db } from '../firebase';
import ChatRow from '../components/ChatRow';

const ChatList = () => {
    const [matches, setMatches] = useState([]);
    const user = auth.currentUser;

    useEffect(
        () =>
            onSnapshot(
                query(
                    collection(db, "matches"),
                    where("usersMatched", "array-contains", user.uid)
                ),
                (snapshot) =>
                    setMatches(snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    )
            ),
        [user]
    );

    return (
        matches.length > 0 ? (
            <FlatList
                style={tw`h-full`} 
                data={matches}
                keyExtractor={item => item.id}
                renderItem={({item}) => <ChatRow matchDetails={item} />}
            />  
        ) : (
            <View style={tw`p-5`}>
                <Text style={tw`text-center text-lg`}>No hay Matches hasta el momento 😢</Text>
            </View>
        )
      
    )
}

export default ChatList
