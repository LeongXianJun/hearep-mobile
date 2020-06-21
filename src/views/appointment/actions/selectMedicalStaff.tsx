import React, { useState, FC, useEffect } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions, TouchableOpacity
} from 'react-native'
import {
  Text, Searchbar
} from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Colors } from '../../../styles'
import { UserStore, MedicalStaff, AppointmentStore } from '../../../stores'

const barColor = '#e982f6'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const SelectMedicalStaffPage: FC<PageProp> = ({ navigation }) => {
  navigation.setOptions({
    title: 'Select Medical Staff',
    headerStyle: {
      backgroundColor: barColor,
    },
    headerTintColor: '#ffffff'
  })
  const medicalStaff = UserStore.getMedicalStaff()

  const [ filter, setFilter ] = useState('')

  useEffect(() => {
    if (medicalStaff.length === 0)
      UserStore.fetchAllMedicalStaff()
  }, [ medicalStaff ])

  const onPress = (m: MedicalStaff) => () => {
    const workingTime = m.workingTime
    // undefined mean the working time is byNumber
    if (workingTime) {
      AppointmentStore.setNewAppDetail({ medicalStaffId: m.id, address: m.medicalInstituition.address, type: 'byTime' })
      navigation.navigate('Appointment/SelectTimeslot')
    } else {
      AppointmentStore.setNewAppDetail({ medicalStaffId: m.id, address: m.medicalInstituition.address, type: 'byNumber' })
      navigation.navigate('Appointment/GetNumber')
    }
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={ barColor } />
      <SafeAreaView style={ styles.container }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
          <View style={ styles.firstView }>
            <Text style={ [ styles.title, { marginBottom: 10 } ] }>{ 'Select a medical staff' }</Text>
            <Searchbar
              placeholder="Search"
              iconColor={ Colors.primaryVariant }
              onChangeText={ val => setFilter(val) }
              style={ { elevation: 0, borderColor: Colors.primaryVariant, borderWidth: 2 } }
              inputStyle={ { color: Colors.primaryVariant } }
              value={ filter }
            />
          </View>
          <View style={ styles.lastView }>
            {
              medicalStaff.filter(u => u.username.toLowerCase().includes(filter.toLowerCase()))
                .map((m, index) =>
                  <TouchableOpacity key={ 'ms-' + index } onPress={ onPress(m) } activeOpacity={ 0.8 }>
                    <View style={ { flexDirection: 'row', padding: 10, justifyContent: 'center', backgroundColor: Colors.surface } }>
                      <View style={ { flex: 1, justifyContent: 'center' } }>
                        <Text style={ { fontSize: 20, color: Colors.primaryVariant } }>{ m.username }</Text>
                      </View>
                      <MaterialCommunityIcons name='chevron-right' color={ Colors.primaryVariant } size={ 36 } />
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

export default withResubAutoSubscriptions(SelectMedicalStaffPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    minHeight: Dimensions.get('window').height - (StatusBar.currentHeight ?? 0) - 60,
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