import React from 'react';
import { View, Text, Image } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Base64 } from 'js-base64';

const ReceiverMessage = ({ message }) => {
	const decode = function (week) {
		return Base64.decode(week);
	};
	return (
		<View
			style={[
				tw`bg-yellow-400 rounded-lg rounded-tl-none px-5 py-3 mx-3 my-2 ml-14`,
				{ alignSelf: 'flex-start' },
			]}
		>
			<Image
				style={tw`h-12 w-12 rounded-full absolute top-0 -left-14`}
				source={
					message.photoURL
					? {uri: message.photoURL}
					: require('../images/empty.png')
				}
			/>

			<Text style={tw`text-white`}>{decode(message.messageEncrypted)}</Text>
		</View>
	);
};

export default ReceiverMessage;
