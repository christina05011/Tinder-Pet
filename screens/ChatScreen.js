import React from 'react';
import { SafeAreaView } from 'react-native';
import ChatList from '../components/ChatList';
import Header from '../components/Header';
import tw from 'tailwind-react-native-classnames';

const ChatScreen = () => {
	return (
		<SafeAreaView style={tw`flex-1 bg-yellow-400`}>
			<Header
				title="Chat"
			/>
			<ChatList />
		</SafeAreaView>
	);
};

export default ChatScreen;
