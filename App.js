/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Alert,
    NativeModules,
    DeviceEventEmitter,
    Platform,
    AppState,
    PermissionsAndroid,
    Linking
} from 'react-native';
import * as Locations from "./Locations";


const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        padding: 20,
    },
    text: {
        fontSize: 20,
    },
    textSuccess: {
        fontSize: 20,
        color: 'green',
    },
});

const APP_STATE_HANDLER_NAME = 'change';


type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            locationEnabled: false,
            gpsEnabled: false,
            appState: AppState.currentState

        };
    }


    componentDidMount() {
        AppState.addEventListener(APP_STATE_HANDLER_NAME, this._handleAppStateChange);
        Locations.initialPermissionCheck()
            .then(status => {
                    this.setState((state) => ({locationEnabled: status, gpsEnabled: status}));
                }
            ).catch((error) => {
        });

        Locations.registerGPSListener(() => {
            this.setState((state) => ({locationEnabled: true, gpsEnabled: true}));
        }, () => {
            this.setState((state) => ({locationEnabled: false, gpsEnabled: false}));
        })

    }

    componentWillUnmount() {
        AppState.removeEventListener(APP_STATE_HANDLER_NAME, this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            Locations.checkPermission()
                .then(status => {
                        this.setState((state) => ({locationEnabled: status, gpsEnabled: status}));
                    }
                ).catch((error) => {
            });

        }
        this.setState({appState: nextAppState});

    };


    requestLocationPermission = () => {
        if (!this.state.gpsEnabled && !this.state.locationEnabled) {
            Locations.askPermission();
         }

    };


    renderLocationStatus() {
        if (this.state.locationEnabled) {
            return <Text style={style.textSuccess}>Location enabled</Text>;
        }
        return <Text style={style.text}>Location disabled</Text>;
    }

    renderGPSStatus() {
        if (this.state.gpsEnabled) {
            return <Text style={style.textSuccess}>GPS enabled</Text>;
        }
        return <Text style={style.text}>GPS disabled</Text>;
    }

    render() {
        return (
            <View style={style.container}>
                <TouchableOpacity style={style.button} onPress={() => this.requestLocationPermission()}
                >
                    <Text style={style.text}>Enable location service</Text>
                </TouchableOpacity>
                {this.renderLocationStatus()}
                {this.renderGPSStatus()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
