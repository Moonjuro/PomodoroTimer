import React from 'react';
import { Component, useState } from 'react';
import { Vibration, StyleSheet, Text, View, TouchableOpacity, Pressable, Modal, TextInput } from 'react-native';

/** COLOR PALETTE:-
 * Indigo dye: #0B4F6C
 * Process Cyan: #01BAEF
 * Ghost White: #FBFBFF
 * Rich Black: #040F16
 * Bittersweet shimmer: #BC4B51
 * warm coral:rgb(188, 86, 73)
 */

export default class App extends React.Component {

  vibrate = () => { Vibration.vibrate([500, 500, 500]); console.log('VIBRATING...'); }
  lightVibrate = () => { Vibration.vibrate(90); console.log('VIBRATING...'); }

  constructor(props) {
    super(props); // Calls the parent class constructor

    // Initialize state
    this.state = {
      time: 25 * 60,  // Initial time (25 minutes in seconds) = 1500 seconds
      isRunning: false, // Timer is not running initially
      intervalId: null, // No interval set initially
      isModalVisible: false, // Modal pops up onPress
      selectedTimer: 'focus', // Default selected timer is 'focus'
      inputTime: '', // The time the user inputs
      focusTime: 25 * 60, // Default focus time
      breakTime: 5 * 60, // Default break time
      longBreakTime: 15 * 60, // Default long break time
      isStartDisabled: false, // Start is initially active
      isPauseDisabled: true, // Pause is initially disabled
      isResetDisabled: true, // Reset is initially disabled
      isSelectDisabled: false, // Select buttons are initially active
      cycles: 0, // if cycles reaches 4, start a longBreak instead a break and reset back to 0
    };
  }

  /* Functions **/

  // Handles timer clicks
  handleTimerPress = (timerType) => {
    this.setState({
      isModalVisible: true, // Show Modal
      selectedTimer: timerType, // Know which timer was clicked
      inputTime: this.state[timerType + 'Time'] / 60, // Set the input time to the current timer's time (in minutes)
    });
  };

  // Handles modal OK button press (sets new time)
  handleSubmitTime = () => {
    const { selectedTimer, inputTime } = this.state;
    const newTimeInSeconds = parseInt(inputTime, 10) * 60;

    if (selectedTimer === 'focus') {
      this.setState({ focusTime: newTimeInSeconds, time: newTimeInSeconds });
    } else if (selectedTimer === 'break') {
      this.setState({ breakTime: newTimeInSeconds, time: newTimeInSeconds });
    } else {
      this.setState({ longBreakTime: newTimeInSeconds, time: newTimeInSeconds });
    }

    // Light vibration to indicate success
    this.lightVibrate();

    // Hide the modal after submission and reset input time
    this.setState({ isModalVisible: false, inputTime: '' });
  };

  // Helper function to format seconds to mm:ss and display to user
  formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    let formattedMinutes = minutes;
    let formattedSeconds = remainingSeconds;
  
    if (minutes < 10) {
      formattedMinutes = '0' + minutes;
    }
  
    if (remainingSeconds < 10) {
      formattedSeconds = '0' + remainingSeconds;
    }
  
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  

  // Helper function to cycle timers
  switchToNextTimer = (nextTimer) => {
    this.setState(
      (prevState) => {
        let newCycles = prevState.cycles;
  
        if (prevState.selectedTimer === 'focus') {
          // Only increment cycles when a focus session ends
          newCycles++;
        }
  
        if (nextTimer === 'longBreak') {
          newCycles = 0; // After long break, reset cycles
        }
  
        return {
          selectedTimer: nextTimer,
          cycles: newCycles,
        };
      },
      () => {
        // Reset timer AFTER switching timer and cycles
        let newTime;
        if (this.state.selectedTimer === 'focus') 
        {
          newTime = this.state.focusTime;
        } 
        else if (this.state.selectedTimer === 'break') 
        {
          newTime = this.state.breakTime;
        } 
        else 
        {
          newTime = this.state.longBreakTime;
        }
  
        this.setState(
          {
            time: newTime,
            isRunning: false,
            intervalId: null,
            isStartDisabled: false,
            isPauseDisabled: true,
            isResetDisabled: true,
          },
          () => {
            this.start();
          }
        );
      }
    );
  };
  
  // Starts the timer if it is paused
  start = () => {
    if (!this.state.isRunning) 
    {
      const intervalId = setInterval(() => {
        if (this.state.time > 0) 
        {
          this.setState(prevState => ({ time: prevState.time - 1 }));
        } 
        else 
        {
          clearInterval(this.state.intervalId);
          this.vibrate();
          
          // Cycle through the timers
          // If selected timer is focus and its on the fourth cycle, start a longBreak and reset cycles
          if (this.state.selectedTimer === 'focus' && this.state.cycles === 4)
          {
            this.switchToNextTimer('longBreak');
          }
          else if (this.state.selectedTimer === 'focus') // Else if it is focus but cycles < 4 start a break and increment cycles
          {
            this.switchToNextTimer('break');
          }
          else if (this.state.selectedTimer === 'break' || this.state.selectedTimer === 'longBreak')
          {
            this.switchToNextTimer('focus')
          }
        }
      }, 1000);
      this.setState({ isRunning: true, intervalId, isStartDisabled: true, isPauseDisabled: false, isResetDisabled: true }); // Update States
    }
  };

  // Pauses the timer if it is running
  stop = () => {
    if (this.state.isRunning)
    {
      clearInterval(this.state.intervalId);
      this.setState({ isRunning: false, isPauseDisabled: true, isStartDisabled: false }); // Update fixed States

      // If the current time is less than the starting time, set this.state.isResetDisabled to false
      if (this.state.selectedTimer === 'focus' && this.state.time < this.state.focusTime)
      {
        this.setState({ isResetDisabled: false, });
      }
      else if (this.state.selectedTimer === 'break' && this.state.time < this.state.breakTime)
      {
        this.setState({ isResetDisabled: false, });
      }
      else if (this.state.selectedTimer === 'longBreak' && this.state.time < this.state.longBreakTime)
      {
        this.setState({ isResetDisabled: false, });
      }
      else
      {
        this.setState({ isResetDisabled: true, }); // Else Reset is disabled
      }
    }
  };

  // Reset the timer to the currently selected timer
  reset = () => {
    clearInterval(this.state.intervalId); // stop the current ticking
  
    let newTime;
    if (this.state.selectedTimer === 'focus') {
      newTime = this.state.focusTime;
    } else if (this.state.selectedTimer === 'break') {
      newTime = this.state.breakTime;
    } else {
      newTime = this.state.longBreakTime;
    }
  
    this.setState({
      time: newTime,
      isRunning: false,
      intervalId: null,
      isStartDisabled: false,
      isPauseDisabled: true,
      isResetDisabled: true,
    });
  };
  
  

  render() {
    return (
      <View style={styles.container}>

        <Modal
          transparent={true}
          visible={this.state.isModalVisible}
          animationType="fade"
          onRequestClose={() => this.setState({ isModalVisible: false })}>

          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter new time for {this.state.selectedTimer}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter time in minutes"
                keyboardType="numeric"
                onChangeText={(text) => this.setState({ inputTime: text })}
                value={this.state.inputTime}
              />
              <Pressable onPress={this.handleSubmitTime}>
                <Text style={styles.modalOption}>OK</Text>
              </Pressable>
              <Pressable style={styles.modalOption} onPress={() => this.setState({ isModalVisible: false })}>
                <Text>CANCEL</Text>
              </Pressable>
              <Pressable style={styles.modalOption}>
                <Text>DEFAULT</Text>
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
            <TouchableOpacity 
              style={[styles.button, this.state.isStartDisabled && styles.disabledButton]} 
              onPress={this.start}
              disabled={this.state.isStartDisabled}    
            >
                <Text style={[styles.buttonText, this.state.isStartDisabled && styles.disabledButtonText]}>START</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, this.state.isPauseDisabled && styles.disabledButton]} 
              onPress={this.stop}
              disabled={this.state.isPauseDisabled}
            >
                <Text style={[styles.buttonText, this.state.isPauseDisabled && styles.disabledButtonText]}>PAUSE</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, this.state.isResetDisabled && styles.disabledButton]} 
              onPress={this.reset}
              disabled={this.state.isResetDisabled}
            >
                <Text style={[styles.buttonText, this.state.isResetDisabled && styles.disabledButtonText]}>RESET</Text>
            </TouchableOpacity>
          </View>

          {/* Timers View */}
          <View style={styles.timersView}>
            <View style={styles.timerBtnView}>
              <Pressable style={styles.timerBtn} onPress={() => this.handleTimerPress('focus')}>
                <Text style={styles.timerText}>Focus{'\n'}{this.state.focusTime / 60}{'\n'}min</Text>
              </Pressable>
              <TouchableOpacity onPress={() => this.setState({ selectedTimer: 'focus', time: this.state.focusTime })}>
                <Text style={styles.buttonText}>Select</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerVertical}></View>

            <View style={styles.timerBtnView}>
              <Pressable style={styles.timerBtn} onPress={() => this.handleTimerPress('break')}>
                <Text style={styles.timerText}>Break{'\n'}{this.state.breakTime / 60}{'\n'}min</Text>
              </Pressable>
              <TouchableOpacity onPress={() => this.setState({ selectedTimer: 'break', time: this.state.breakTime })}>
                <Text style={styles.buttonText}>Select</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerVertical}></View>

            <View style={styles.timerBtnView}>
              <Pressable style={styles.timerBtn} onPress={() => this.handleTimerPress('longBreak')}>
                <Text style={styles.timerText}>Long{'\n'}Break{'\n'}{this.state.longBreakTime / 60}{'\n'}min</Text>
              </Pressable>
              <TouchableOpacity onPress={() => this.setState({ selectedTimer: 'longBreak', time: this.state.longBreakTime })}>
                <Text style={styles.buttonText}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    backgroundColor: 'white',
    width: 250,
    padding: 20,
    borderRadius: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
  },

  modalOption: {
    fontSize: 16,
    color: '#01BAEF',
    textAlign: 'center',
    marginTop: 10,
  },

  disabledButton: {
    backgroundColor: 'gray',
  },

  disabledButtonText: {
    color: 'black',
  },
});
