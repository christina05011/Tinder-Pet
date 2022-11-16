import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'
import { auth, storage_ } from './firebase';

const user = auth.currentUser;

export const loadImageFromGallery = async(array) => {
    const response = { status: false, image: null }
    const resultPermissions = await Permissions.askAsync(Permissions.CAMERA)
    if(resultPermissions.status == "denied") {
        Alert.alert("Debes permitir el acceso a tu galería.")
        return response
    }
    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: array
    }) 
    if(result.cancelled) { 
        return response
    }
    response.status = true
    response.image = result.uri
    return response
}

export const fileToBlob = async(path) => {
    const file = await fetch(path)
    const blob = await file.blob()
    return blob
}

export const uploadImage = async(image, path, name) => {
    const result = {statusResponse: false, error: null, url: null}
    const ref = storage_.ref(path).child(name)
    const blob = await fileToBlob(image)
    try {
        await ref.put(blob)
        const url = await storage_.ref(`${path}/${name}`).getDownloadURL()
        result.statusResponse = true
        result.url = url
    } catch (error) {
        result.error = error
    }
    return result
}

export const updateProfile = async(data) => {
    const result = {statusResponse: true, error: null}
    try {
        await user.updateProfile(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}