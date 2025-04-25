import React from 'react';
import { Vibration, StyleSheet, Text, View, Button, TouchableOpacity, Pressable } from 'react-native';

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

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.timerContainer}>
          <Text style={styles.label}>POMODORO TIMER</Text>

          <View style={styles.timePill}>
            <Text style={styles.time}>25:00</Text>
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
            <Pressable style={styles.timerBtn}>
              <Text style={styles.timerText}>Focus{'\n'}25{'\n'}min</Text>
            </Pressable>
          </View>

          <View style={styles.dividerVertical}></View>

          <View style={styles.timerBtnView}>
            <Pressable style={styles.timerBtn}>
              <Text style={styles.timerText}>Break{'\n'}5{'\n'}min</Text>
            </Pressable>
          </View>

          <View style={styles.dividerVertical}></View>

          <View style={styles.timerBtnView}>
            <Pressable style={styles.timerBtn}>
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
    color: '#F8DFC2',
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
});