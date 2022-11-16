import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native'
import tw from 'tailwind-react-native-classnames';
import { Entypo, Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from '@firebase/firestore';
import { auth, db } from '../firebase';
import generateId from '../lib/generateId';
import { Avatar } from 'react-native-elements'
import { updateProfile } from '../UploadImage';

const HomeScreen = () => {
  const navigation = useNavigation()
  const [profiles, setProfiles] = useState([]);
  const swipeRef = useRef(null);
  const user = auth.currentUser;

	useLayoutEffect(
		() =>
			onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
				if (!snapshot.exists()) {
					navigation.navigate('Modal');
				}
			}),
		[]
	);
  
	useEffect(() => {
		let unsub;

		const fetchCards = async () => {
			const nopes = await getDocs(
				collection(db, 'users', user.uid, 'nopes')
			).then((snapshot) => snapshot.docs.map((doc) => doc.id));

			const swipes = await getDocs(
				collection(db, 'users', user.uid, 'swipes')
			).then((snapshot) => snapshot.docs.map((doc) => doc.id));

			const nopedUserIds = nopes.length > 0 ? nopes : ['test'];
			const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

			unsub = onSnapshot(
				query(
					collection(db, 'users'),
					where('id', 'not-in', [...nopedUserIds, ...swipedUserIds])
				),
				(snapshot) => {
					setProfiles(
						snapshot.docs
							.filter((doc) => doc.id !== user.uid)
							.map((doc) => ({
								id: doc.id,
								...doc.data(),
							}))
					);
				}
			);
		};

		fetchCards();
		return unsub;
	}, [db]);

	const swipeLeft = (cardIndex) => {
		if (!profiles[cardIndex]) return;

		const userSwiped = profiles[cardIndex];
		console.log(`You swiped NOPE on ${userSwiped.displayName}`);

		setDoc(doc(db, 'users', user.uid, 'nopes', userSwiped.id), userSwiped);
	};

	const swipeRight = async (cardIndex) => {
		if (!profiles[cardIndex]) return;

		const userSwiped = profiles[cardIndex];

		const loggedInProfile = await (
			await getDoc(doc(db, 'users', user.uid))
		).data();

		// Check if the user swiped on you...

		getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid)).then(
			(documentSnapshot) => {
				if (documentSnapshot.exists()) {
					// user has matched with you before you matched with them...
					console.log(`Hooray, You MATCHED with ${userSwiped.displayName}`);

					setDoc(
						doc(db, 'users', user.uid, 'swipes', userSwiped.id),
						userSwiped
					);

					// Create a MATCH!
					setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
						users: {
							[user.uid]: loggedInProfile,
							[userSwiped.id]: userSwiped,
						},
						usersMatched: [user.uid, userSwiped.id],
						timestamp: serverTimestamp(),
					});

					navigation.navigate('Match', {
						loggedInProfile,
						userSwiped,
					});
				} else {
					// User has swiped as first interaction between the two or didn't get swiped on...
					console.log(`You swiped on ${userSwiped.displayName}`);
					setDoc(
						doc(db, 'users', user.uid, 'swipes', userSwiped.id),
						userSwiped
					);
				}
			}
		);
	};

	const {photoUrl} = useState(user.photoURL)

  return (
	<SafeAreaView style={tw`flex-1 bg-yellow-400`}>
		{/* Header */}
		<View style={tw`flex-row items-center justify-between px-5`}>
			<TouchableOpacity onPress={() => navigation.navigate('Modal')}> 
				<Avatar
					rounded
					size="medium"
					source={
						photoUrl
							? {uri: photoUrl}
							: require('../images/empty.png')
					}
				/>
			</TouchableOpacity>

				<Image
					style={tw`h-16 w-24`}
					source={require('../images/logo22.png')}
				/>

			<TouchableOpacity onPress={() => navigation.navigate('Chat')}>
				<Ionicons name="chatbubbles-sharp" size={30} color="#cd853f" />
			</TouchableOpacity>
		</View>
		{/* End of Header */}

		{/* Cards */}
		<View style={tw`flex-1 -mt-6`}>
			<Swiper
				ref={swipeRef}
				containerStyle={{ backgroundColor: 'transparent' }}
				cards={profiles}
				stackSize={5}
				cardIndex={0}
				animateCardOpacity
				verticalSwipe={false}
				onSwipedLeft={(cardIndex) => {
					console.log('Swipe NOPE');
					swipeLeft(cardIndex);
				}}
				onSwipedRight={(cardIndex) => {
					console.log('Swipe MATCH');
					swipeRight(cardIndex);
				}}
				backgroundColor={'#4FD0E9'}
				overlayLabels={{
					left: {
						title: 'NOPE',
						style: {
							label: {
								textAlign: 'right',
								color: 'red',
							},
						},
					},
					right: {
						title: 'MATCH',
						style: {
							label: {
								color: '#4DED30',
							},
						},
					},
				}}
				renderCard={(card) =>
					card ? (
						<View
							key={card.id}
							style={tw`relative bg-white h-3/4 rounded-xl`}
						>
							<Image
								style={tw`absolute top-0 h-full w-full rounded-xl`}
								source={ 
									card.photoURL
									? {uri: card.photoURL}
									: require('../images/empty.png')
								} 
							/>

							<View
								style={[
									tw`absolute bottom-0 bg-white w-full h-20 flex-row justify-between items-center px-6 py-2 rounded-b-xl`,
									styles.cardShadow,
								]}
							>
								<View>
									<Text style={tw`text-xl font-bold`}>
										{card.displayName}
									</Text>
									<Text>{card.cat} </Text>
									<Text>{card.aboutMe} </Text>
								</View>
								<Text style={tw`text-2xl font-bold`}>{card.age}</Text>
							</View>
						</View>
					) : (
						<View
							style={[
								tw`relative bg-white h-3/4 rounded-xl justify-center items-center`,
								styles.cardShadow,
							]}
						>
							<Text style={tw`font-bold pb-5`}>No hay más perfiles</Text>
							<Text>😢</Text>
						</View>
					)
				}
			/>
		</View>
		{/* Íconos de rechazo y aceptar. */}
		<View style={tw`flex flex-row justify-evenly`}>
			<TouchableOpacity
				onPress={() => swipeRef.current.swipeLeft()}
				style={tw
					`items-center justify-center rounded-full w-16 h-16 bg-red-300`
				}
			>
				<Entypo name="cross" size={24} color="red" />
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => swipeRef.current.swipeRight()}
				style={tw
					`items-center justify-center rounded-full w-16 h-16 bg-green-400`
				}
			>
				<Entypo name="check" size={24} color="green" />
			</TouchableOpacity>
		</View>
	</SafeAreaView>	
  );
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
   button: {
    backgroundColor: '#cd853f',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  cardShadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2,
	},
})

