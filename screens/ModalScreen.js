import { doc, serverTimestamp, setDoc } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { auth, db } from '../firebase';
import {Avatar} from 'react-native-elements'
import { loadImageFromGallery, uploadImage, updateProfile } from '../UploadImage';

const ModalScreen = () => {
	const navigation = useNavigation();
	const [userName, setName] = useState(null);
	const [cat, setCat] = useState(null);
	const [age, setAge] = useState(null);
	const [aboutMe, setAboutMe] = useState(null);
	const user = auth.currentUser;	
	const incompleteForm = !cat || !age || !userName;

	const handleSignOut = () => {
		auth
		  .signOut()
		  .then(() => {
			navigation.replace("Login")
		  })
		  .catch(error => alert(error.message))
	}	

	const updateUserProfile = () => {
		setDoc(doc(db, 'users', user.uid), {
			id: user.uid,
			displayName: userName,
			userName: userName,
			photoURL: user.photoURL,
			cat: cat,
			age: age,
			aboutMe: aboutMe,
			timestamp: serverTimestamp(),
		})
			.then(() => {
				navigation.navigate('Home');
			})
			.catch((error) => {
				alert(error.message);
			});
	};
	const [photoUrl, setPhotoUrl] = useState(user.photoURL)

	const changePhoto = async() => {
		
		console.log(user.displayName)
		const result = await loadImageFromGallery([1,1])
		if(!result.status) {
			return
		}
		console.log("Todo bien hasta aquí")
		const resultUploadImage = await uploadImage(result.image, "avatars", user.uid)
		if(!resultUploadImage.statusResponse) {
			Alert.alert("Error al guardar foto de perfil.")
			return
		}
		const resultUpdateProfile = await updateProfile({photoURL: resultUploadImage.url})
		if(resultUpdateProfile.statusResponse) {
			setPhotoUrl(resultUploadImage.url)
		} else {
			Alert.alert("Error al actualizar foto de perfil.")
		}
	}

	//const name = user?.displayName;

	return (
		<View style={tw`flex-1 items-center pt-1 bg-yellow-400`}>
			<Avatar
				rounded
				size="large"
				onPress={changePhoto}
				source={
					photoUrl
						? {uri: photoUrl}
						: require('../images/empty.png')
				}
			/>

			<Text style={tw`text-xl text-white font-bold pb-8`}>
				Bienvenido pet 
				{/* {name} pet */}
			</Text>

			<Text style={tw`text-center p-4 font-bold text-yellow-600`}>
				Paso 1: Nombre de usuario
			</Text>
			<TextInput
				value={userName}
				onChangeText={setName}
				style={tw`text-center pb-1`}
				placeholder="Ingresa el nombre de usuario"   
			/>

			<Text style={tw`text-center p-4 font-bold text-yellow-600`}>
				Paso 2: Edad 
			</Text>
			<TextInput
				value={age}
				onChangeText={setAge}
				style={tw`text-center pb-1`}
				placeholder="Ingresa la edad en años"
				keyboardType="numeric"
				maxLength={3}
			/>

			<Text style={tw`text-center p-4 font-bold text-yellow-600`}>
				Paso 3: Categoría
			</Text>
			<TextInput
				value={cat}
				onChangeText={setCat}
				style={tw`text-center pb-1`}
				placeholder="Ingresa la categoría, ej.: gato, perro, etc."
			/>

			<Text style={tw`text-center p-4 font-bold text-yellow-600`}>
				Paso 4: Descríbete
			</Text>
			<TextInput
				value={aboutMe}
				onChangeText={setAboutMe}
				style={tw`text-center pb-14`}
				placeholder="Ingresa tu descripción."
			/>


			<TouchableOpacity
				disabled={incompleteForm}
				style={[
					tw`w-64 p-3 rounded-xl`,
					incompleteForm ? tw`bg-gray-100` : tw`bg-yellow-600`,
				]}
				onPress={updateUserProfile}
			>
				<Text style={tw`text-center text-white text-xl`}>Actualizar Perfil</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={ tw`w-64 p-3 rounded-xl bg-yellow-600` }
				onPress={() => navigation.navigate('Home')}
			>
				<Text style={tw`text-center text-white text-xl`}>Home</Text>
			</TouchableOpacity>

			<TouchableOpacity 
				onPress={handleSignOut}
				style={styles.button}
			>
			  <Text style={styles.buttonText}>Salir</Text>
			</TouchableOpacity>
		</View>
	);
};

export default ModalScreen;

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
  })