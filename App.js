/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo
} from 'react-native-twilio-video-webrtc'
 
import Button from 'react-native-button'


export default class App extends Component<{}> {
  state = {
    isAudioEnabled: true,
    isVideoEnabled: true,
    status: 'disconnected',
    participants: new Map(),
    videoTracks: new Map(),
    roomName: '5',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzViNGIxMzI1NDRmZDFiNjU5Mjk1MGQ1NTNjNWE2MDYxLTE1MTM4NDUwNzIiLCJpc3MiOiJTSzViNGIxMzI1NDRmZDFiNjU5Mjk1MGQ1NTNjNWE2MDYxIiwic3ViIjoiQUNhZWU4NDc4OTA4MmRhYjRhMzAxYWUyYzIxODY0ODU5MCIsImV4cCI6MTUxMzg0ODY3MiwiZ3JhbnRzIjp7ImlkZW50aXR5Ijo4ODY0MCwidmlkZW8iOnt9fX0.97bChSSxXwXEqBf8ayKeiDQGfmLmra9ZVk4Pa4V-HS4'
  }

  _onConnectButtonPress = () => {
    this.refs.twilioVideo.connect({ roomName: this.state.roomName, accessToken: this.state.token })
    this.setState({status: 'connecting'})
  }

  _onEndButtonPress = () => {
    this.refs.twilioVideo.disconnect()
  }

  _onMuteButtonPress = () => {
    this.refs.twilioVideo.setLocalAudioEnabled(!this.state.isAudioEnabled)
      .then(isEnabled => this.setState({isAudioEnabled: isEnabled}))
  }

  _onParticipantAddedVideoTrack = ({participant, track}) => {
    console.log("onParticipantAddedVideoTrack: ", participant, track)

    this.setState({videoTracks: { ...this.state.videoTracks, [track.trackId]: { ...participant, ...track }}})
  }

  _onParticipantRemovedVideoTrack = ({participant, track}) => {
    console.log("onParticipantRemovedVideoTrack: ", participant, track)

    const videoTracks = this.state.videoTracks
    videoTracks.delete(track.trackId)

    this.setState({videoTracks: { ...videoTracks }})
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.status === 'disconnected' &&
          <View>
            <Text style={styles.welcome}>
              React Native Twilio Video
            </Text>
            <TextInput
              style={styles.input}
              autoCapitalize='none'
              value={this.state.roomName}
              onChangeText={(text) => this.setState({roomName: text})}>
            </TextInput>
            <TextInput
              style={styles.input}
              autoCapitalize='none'
              value={this.state.token}
              onChangeText={(text) => this.setState({token: text})}>
            </TextInput>
            <Button
              title="Connect"
              style={styles.button}
              onPress={this._onConnectButtonPress}>
            </Button>
          </View>
        }

        {
          (this.state.status === 'connected' || this.state.status === 'connecting') &&
            <View style={styles.callContainer}>
            {
              this.state.status === 'connected' &&
              <View style={styles.remoteGrid}>
                {
                  Object.keys(this.state.videoTracks).map(trackId => {
                    return (
                      <TwilioVideoParticipantView
                        style={styles.remoteVideo}
                        key={trackId}
                        trackIdentifier={{
                          participantIdentity: this.state.videoTracks[trackId].identity,
                          videoTrackId: trackId
                        }}
                      />
                    )
                  })
                }
              </View>
            }
            <View
              style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={this._onEndButtonPress}>
                <Text style={{fontSize: 12}}>End</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={this._onMuteButtonPress}>
                <Text style={{fontSize: 12}}>{ this.state.isAudioEnabled ? "Mute" : "Unmute" }</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={this._onFlipButtonPress}>
                <Text style={{fontSize: 12}}>Flip</Text>
              </TouchableOpacity>
              <TwilioVideoLocalView
                enabled={true}
                style={styles.localVideo}
              />
            </View>
          </View>
        }

        <TwilioVideo
          ref="twilioVideo"
          onRoomDidConnect={ this._onRoomDidConnect }
          onRoomDidDisconnect={ this._onRoomDidDisconnect }
          onRoomDidFailToConnect= { this._onRoomDidFailToConnect }
          onParticipantAddedVideoTrack={ this._onParticipantAddedVideoTrack }
          onParticipantRemovedVideoTrack= { this.onParticipantRemovedVideoTrack }
        />
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
