/**
 * Created by rajatmareclbeck on 26/06/18.
 */
import {Platform, PermissionsAndroid, Linking, NativeModules, DeviceEventEmitter} from "react-native";

const config = {
    timeout: 1000,
    enableHighAccuracy: true
};

export function initialPermissionCheck() {

    if (Platform.OS === "ios") {
        navigator.geolocation.requestAuthorization();
        return checkIosPermission();
    } else {
        NativeModules.OpenSettings._startListen();
        return checkAndroidPermissions();
    }
}

export function checkPermission() {

    if (Platform.OS === "ios") {
        return checkIosPermission();
    } else {
        return checkAndroidPermissions();
    }

}

export function registerGPSListener(success, failure) {

    if (Platform.OS === 'android') {
        DeviceEventEmitter.addListener('locationProviderStatusChange', (locationStatus) => {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                .then(permissionStatus => {
                    if (permissionStatus && locationStatus.enabled) {
                        success()
                    } else {
                        failure()
                    }
                })
                .catch((error) => failure())
        })
    }
}

export function askPermission() {

    if (Platform.OS === "android") {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then((permissionStatus) => {
            //added check so that both the location and dialogs are opened
                NativeModules.OpenSettings.isLocationEnabled(
                        () => {
                            if(!permissionStatus){
                                NativeModules.OpenSettins.openAppLocationSetting();
                            }
                        },
                        () => {
                            if(permissionStatus) {
                                NativeModules.OpenSettings.openGpsSettings();
                            }else{
                                NativeModules.OpenSettings.openAppLocationSetting();
                                NativeModules.OpenSettings.openGpsSettings();
                            }
                        })

            })
    } else {
        Linking.openURL('app-settings:');
    }

}


function checkAndroidPermissions() {
    return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(status => {
            return new Promise(function (resolve, reject) {
                NativeModules.OpenSettings.isLocationEnabled(
                    () => {
                        resolve(!!status);
                    },
                    () => {
                        resolve(false);
                    }
                )
            }).catch(error => {
                return new Promise(function (resolve, reject) {
                    reject(error)
                })
            })


        })
}

function checkIosPermission() {

    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(
            () => {
                resolve(true);
            },
            () => {
                resolve(false);
            }, config
        )
    })
}




