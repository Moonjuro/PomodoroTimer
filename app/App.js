import React from 'react';
import { Component } from 'react';
import { Vibration, StyleSheet, Text, View, Button, TouchableOpacity, Pressable, Modal, TextInput } from 'react-native';

function vibrate() { Vibration.vibrate([500, 500, 500]); }
function lightVibrate() { Vibration.vibrate(300); }

/** COLOR PALETTE:-
 * Indigo dye: #0B4F6C
 * Process Cyan: #01BAEF
 * Ghost White: #FBFBFF
 * Rich Black: #040F16
 * Bittersweet shimmer: #BC4B51
 * warm coral:rgb(188, 86, 73)
 */

export default class App extends React.Component
{
  constructor(props)
  {
    super(props); // Calls the parent class constructor

    // Initialize state
    this.state = {
      time: 25 * 60,  // Initial time (25 minutes in seconds) = 1500 seconds
      isRunning: false, // Timer is not running initially
      intervalId: null, // No interval set initially
      isModalVisible: false, // Modal pops up onPress
      selectedTimer: '', // Which timer is selected: focus, break, or longBreak
      inputTime: '', // The time the user inputs
    };
  }

  /* Functions **/

  // Handles timer clicks
  handleTimerPress = (timerType) => {
    this.setState({
    isModalVisible: true, // Show Modal
    selectedTimer: timerType, // Know which timer was clicked
    });
  };

  // Handles modalOK
  handleSubmitTime = () => {
    const { selectedTimer, inputTime } = this.state;
    const newTimeInSeconds = parseInt(inputTime, 10) * 60;

    if (selectedTimer === 'focus')
    {
      this.setState({ focusTime: newTimeInSeconds, time: newTimeInSeconds, });
    }
    else if (selectedTimer === 'break') 
    {
      this.setState({ breakTime: newTimeInSeconds, time: newTimeInSeconds, });
    }
    else
    {
      this.setState({ longBreakTime: newTimeInSeconds, time: newTimeInSeconds, });
    }

    // Hide the modal after submission and reset input time
    this.setState({ isModalVisible: false, inputTime: '' });
  }

  // Helper function to format seconds to mm:ss and display to user
  formatTime = () => {
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = seconds % 60;

    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}`;
  }

  // Starts the timer if it is paused
  start = () => { // TODO
    // If timer is !running, use setInterval() to start countdown. This calls decrementTime every second
    // If timer is already running, make the button greyed out and unclickable
  }

  // Pauses the timer if it is running
  stop = () => { // TODO

  }
  
  // Vibrate helper functions
  vibrate = () => { Vibration.vibrate([500, 500, 500]); }
  lightVibrate = () => { Vibration.vibrate(300); }

  render() {
    return (
      <View style={styles.container}>

        <Modal
          transparent={true}
          visible={this.state.isModalVisible}
          animationType='fade'
          onRequestClose={() => this.setState({ isModalVisible: false, })}>

          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter new time for {this.state.selectedTimer}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder='Enter time in minutes'
                keyboardType='numeric'
                onChangeText={(text) => this.setState({ inputTime: text, })}
                value={this.state.inputTime}
              />

              <Pressable onPress={this.handleTimerPress}>
                <Text style={styles.modalOption}>OK</Text>
              </Pressable>

              <Pressable style={styles.modalOption} onPress={() => this.setState({ isModalVisible: false })}>
                <Text>CANCEL</Text>
              </Pressable>

            </View>
          </View>
        </Modal>

        <View style={styles.timerContainer}>
          <Text style={styles.label}>POMODORO TIMER</Text>

          <View style={styles.timePill}>
            <Text style={styles.time}>{this.formatTime(this.state.time)}</Text>
          </View>
          
          <View style={styles.btnView}>
          <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>START</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>PAUSE</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>RESET</Text></TouchableOpacity>
        </View>

        {/* Timers View */}
        <View style={styles.timersView}>
          {/* Each timerBtn a timer that can be changed and each View between them is a divider */}  
          <View style={styles.timerBtnView}>
            <Pressable style={styles.timerBtn} onPress={() => this.handleTimerPress('focus')}>
              <Text style={styles.timerText}>Focus{'\n'}25{'\n'}min</Text>
            </Pressable>
          </View>

          <View style={styles.dividerVertical}></View>

          <View style={styles.timerBtnView}>
            <Pressable style={styles.timerBtn} onPress={() => this.handleTimerPress('break')}>
              <Text style={styles.timerText}>Break{'\n'}5{'\n'}min</Text>
            </Pressable>
          </View>

          <View style={styles.dividerVertical}></View>

          <View style={styles.timerBtnView}>
            <Pressable style={styles.timerBtn} onPress={() => this.handleTimerPress('longBreak')}>
                <Text style={styles.timerText}>Long{'\n'}Break{'\n'}15{'\n'}min</Text>
            </Pressable>
          </View>
        </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create(
  {
  container: {
    flex: 1,
    backgroundColor: '#763A2D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    textAlign: 'center',
    fontSize: 45,
    color: '#F8DFC2', // Cream
    marginBottom: 10,
    marginTop: 30,
    fontWeight: 'bold',
  },

  timerContainer: {
    backgroundColor: '#A6543D',
    width: 300,
    height: 570,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#622C23',
    shadowOffset: { width: 15, height: 15 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 10,
  },

  timePill: {
    width: 250,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#8A432F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  time: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#F8DFC2',
  },

  btnView: {
    width: 330,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
    flexWrap: 'wrap',
  },

  button: {
    width: 140,
    height: 40, 
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 5,
  },

  buttonText: {
    color: 'rgb(192, 93, 79)',
    fontWeight: 'bold',
    fontSize: 23,
    textAlign: 'center',
    marginTop: 4,
  },

  timersView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    height: '25%',
    marginTop: 30,
    alignItems: 'center',
  },

  timerBtnView: {

  },

  timerBtn: {

  },

  timerText: {
    color: '#F8DFC2',
    fontWeight: 'bold',
    fontSize: 23,
    textAlign: 'center',
  },

  dividerVertical: {
    backgroundColor: 'black',
    width: 0.5,
    height: '100%',
    marginHorizontal: 8,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)' // semi-transparent background
  },

  modalContent: {
    backgroundColor: 'rgb(133, 55, 34)',
    padding: 20,
    borderRadius: 15,
    width: 300,
    alignItems: 'center',
  },

  modalTitle: {
    color: '#F8DFC2',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  modalInput: {
    width: '80%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1, 
    marginBottom: 20, 
    paddingHorizontal: 10,
    color: '#F8DFC2',
  }
});