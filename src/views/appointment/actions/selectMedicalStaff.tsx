import React, { useState, FC, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { withResubAutoSubscriptions } from 'resub'
import { Text, Searchbar } from 'react-native-paper'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Colors } from '../../../styles'
import { UserStore, MedicalStaff, AppointmentStore } from '../../../stores'
import { AppContainer } from '../../common'

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
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    UserStore.fetchAllMedicalStaff()
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false))
  }, [])

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
    <AppContainer isLoading={ isLoading }>
      {
        medicalStaff.length > 0
          ? <View style={ styles.firstView }>
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
          : null
      }
      <View style={ styles.lastView }>
        {
          medicalStaff.length > 0
            ? medicalStaff.filter(u => u.username.toLowerCase().includes(filter.toLowerCase()))
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
            : <View style={ { height: '100%', alignItems: 'center', justifyContent: 'center' } }>
              <Text style={ { textAlignVertical: 'center' } }>{ `No medical staff in the system yet.` }</Text>
            </View>
        }
      </View>
    </AppContainer>
  )
}

export default withResubAutoSubscriptions(SelectMedicalStaffPage)

const styles = StyleSheet.create({
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