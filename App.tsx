import React, { useState, FC } from 'react'
import 'react-native-gesture-handler'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import {
  AuthLoadingScreen, LoginScreen, OTPScreen, RegisterScreen, HomeScreen, HealthRecordPage,
  AnalysisPage, ProfilePage, HealthPrescriptionPage, LabTestResultPage,
  UpdateHealthRecordScreen, AuthenticationDialog, PermitUsersPage, UpdateProfilePage,
  AppointmentConfirmationPage, AppointmentHistoryPage, AppointmentPage,
  GetNumberPage, SelectMedicalStaffPage, SelectTimeslotPage, NotificationManager, RemoveAuthorizedUsersPage
} from './src/views'
import { Colors } from './src/styles'

const Stack = createStackNavigator()
const MTab = createMaterialBottomTabNavigator()

const theme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    ...Colors,
    accent: Colors.secondary
  },
}

const App: FC<{}> = () => {
  const [ ADVisible, setADVisible ] = useState(false)

  const paths: Path[] = [
    ...[
      { title: 'AuthLoading', component: AuthLoadingScreen },
      { title: 'Home', component: PageAtBottomNav },
      { title: 'Login', component: LoginScreen },
      { title: 'OTP', component: OTPScreen },
      { title: 'Register', component: RegisterScreen }
    ].map(p => ({
      ...p,
      options: {
        headerShown: false
      }
    })),
    ...[
      { title: 'HealthRecord/HealthPrescription', component: HealthPrescriptionPage },
      { title: 'HealthRecord/LabTestResult', component: LabTestResultPage },
      { title: 'HealthCondition/Update', component: UpdateHealthRecordScreen },
      { title: 'Profile/Update', component: UpdateProfilePage },
      { title: 'Profile/PermitUsers', component: PermitUsersPage },
      { title: 'Profile/RemoveUsers', component: RemoveAuthorizedUsersPage },
      { title: 'Appointment', component: AppointmentPage },
      { title: 'Appointment/History', component: AppointmentHistoryPage },
      { title: 'Appointment/SelectMedicalStaff', component: SelectMedicalStaffPage },
      { title: 'Appointment/SelectTimeslot', component: SelectTimeslotPage },
      { title: 'Appointment/GetNumber', component: GetNumberPage },
      { title: 'Appointment/Confirmation', component: AppointmentConfirmationPage },
    ]
  ]

  return (
    <PaperProvider theme={ theme }>
      <AuthenticationDialog visible={ ADVisible } onClose={ () => setADVisible(false) } />
      <NotificationManager />
      <NavigationContainer>
        <Stack.Navigator initialRouteName={ 'AuthLoading' }>
          { paths.map(({ title, component, options }) => <Stack.Screen key={ title } name={ title } component={ component } options={ options } />) }
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}

export default withResubAutoSubscriptions(App)

function PageAtBottomNav() {
  const currentRoute = 'Home'
  const paths: Path[] = [
    ...[
      { title: 'Home', icon: 'home', color: Colors.primaryVariant, component: HomeScreen },
      { title: 'HealthRecord', icon: 'file-document', color: '#4cb5f5', component: HealthRecordPage },
      { title: 'Analysis', icon: 'google-analytics', color: '#34675c', component: AnalysisPage },
      { title: 'Profile', icon: 'account', color: '#b3c100', component: ProfilePage }
    ].map(p => ({
      ...p,
      options: {
        headerShown: false,
        tabBarColor: p.color,
        tabBarIcon: () =>
          <MaterialCommunityIcons name={ p.icon } color={ Colors.surface } size={ 26 } />
      }
    }))
  ]

  return (
    <MTab.Navigator initialRouteName={ currentRoute ?? 'Home' }>
      { paths.map(({ title, component, options }) => <MTab.Screen key={ title } name={ title } component={ component } options={ options } />) }
    </MTab.Navigator>
  )
}

interface Path {
  title: string
  component: FC<any>
  options?: any
}