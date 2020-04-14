import React, { useState } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions, TouchableOpacity
} from 'react-native'
import {
  Text, Searchbar
} from 'react-native-paper'
import { Colors } from '../../../styles'
import { UserC, User, AppointmentC, MedicalStaff } from '../../../connections'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const barColor = '#e982f6'

export default function SelectMedicalStaffPage({navigation}) {
  navigation.setOptions({
    title: 'Select Medical Staff',
    headerStyle: {
      backgroundColor: barColor,
    },
    headerTintColor: '#ffffff'
  })
  const medicalStaffs = UserC.medicalStaffDB
  const [ filter, setFilter ] = useState('')
  
  const onPress = (m: MedicalStaff) => () => {
    const workingTime = AppointmentC.getWorkingTime(m.id)
    AppointmentC.setNewAppointmentDetail('medicalStaff', m.fullname)
    AppointmentC.setNewAppointmentDetail('address', m.medicalInstituition?.address ?? '')
    if(workingTime.type === 'byNumber') {
      AppointmentC.setNewAppointmentDetail('date', new Date())
      navigation.navigate('Appointment/GetNumber')

    } else {
      navigation.navigate('Appointment/SelectTimeslot')
    }
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={barColor}/>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.content}>
          <View style={styles.firstView}>
            <Text style={[styles.title, {marginBottom: 10}]}>{'Select a medical staff'}</Text>
            <Searchbar
              placeholder="Search"
              iconColor={Colors.primaryVariant}
              onChangeText={val => setFilter(val)}
              style={{ elevation: 0, borderColor: Colors.primaryVariant, borderWidth: 2 }}
              inputStyle={{color: Colors.primaryVariant}}
              value={filter}
            />
          </View>
          <View style={styles.lastView}>
            {
              medicalStaffs.filter(u => u.fullname.toLowerCase().includes(filter.toLowerCase())).map((m, index) => 
                <TouchableOpacity key={'ms-' + index} onPress={onPress(m)} activeOpacity={0.8}>
                  <View style={{flexDirection: 'row', padding: 10, justifyContent: 'center', backgroundColor: Colors.surface}}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                      <Text style={{fontSize: 20, color: Colors.primaryVariant}}>{m.fullname}</Text>
                    </View>
                    <MaterialCommunityIcons name='chevron-right' color={Colors.primaryVariant} size={36}/>
                  </View>
                </TouchableOpacity>
              )
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: Colors.background 
  },
  content: {
    minHeight: Dimensions.get('window').height - StatusBar.currentHeight - 60,
    marginHorizontal: '10%'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30
  },
  firstView: {
    marginTop: 25
  },
  lastView: {
    marginTop: 10,
    marginBottom: 25,
  }
})