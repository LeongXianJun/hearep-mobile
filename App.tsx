import React, { useState, ComponentType, useEffect } from 'react'
import 'react-native-gesture-handler'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { UserC } from './src/connections'

import { LoginScreen, OTPScreen, RegisterScreen, HomeScreen, HealthRecordPage, 
  AnalysisPage, ProfilePage, HealthPrescriptionPage, LabTestResultPage } from './src/views'
import { Colors } from './src/styles'

const Stack = createStackNavigator()
const MTab = createMaterialBottomTabNavigator()

const theme = {
  ...DefaultTheme,
  roundness: 3,
  colors: {
    ...DefaultTheme.colors,
    ...Colors,
    accent: Colors.secondary
  },
}

export default function App() {
  const currentRoute = 'Home'
  // const [ isLogin, setLogin ] = useState(false)
  // const navigation = useNavigation()

  // useEffect(() => {
  //   navigation.addListener('state', () => {
  //     setLogin(UserC.isLogin())
  //   })
  //   return navigation.removeListener('state', () => {})
  // }, [navigation])

  const paths: Path[] = [
    ...[
      { title: 'Home', component: PageAtBottomNav },
      { title: 'Login', component: LoginScreen },
      { title: 'OTP', component: OTPScreen },
      { title: 'Register', component: RegisterScreen }
    ].map(p  => ({
      ...p, 
      options: {
        headerShown: false
      }
    })),
    ...[
      { title: 'HealthRecord/HealthPrescription', component: HealthPrescriptionPage },
      { title: 'HealthRecord/LabTestResult', component: LabTestResultPage },
    ]
  ]

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={currentRoute ?? 'Login'}>
          { paths.map(({title, component, options}) => <Stack.Screen key={title} name={title} component={component} options={options}/>) }
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}

function PageAtBottomNav() {
  const currentRoute = 'Home'
  const paths: Path[] = [
    ...[
      { title: 'Home', icon: 'home', color: '#4cb5f5', component: HomeScreen },
      { title: 'HealthRecord', icon: 'file-document', color: '#34675c', component: HealthRecordPage },
      { title: 'Analysis', icon: 'google-analytics', color: '#b3c100', component: AnalysisPage },
      { title: 'Profile', icon: 'account', color: '#b7b8b6', component: ProfilePage }
    ].map(p  => ({
      ...p, 
      options: {
        headerShown: false,
        tabBarColor: p.color,
        tabBarIcon: () => 
          <MaterialCommunityIcons name={p.icon} color={Colors.surface} size={26}/>
      }
    }))
  ]

  return (
    <MTab.Navigator initialRouteName={currentRoute ?? 'Home'}>
      { paths.map(({title, component, options}) => <MTab.Screen key={title} name={title} component={component} options={options}/>) }
    </MTab.Navigator>
  )
}

interface Path {
  title: string
  component: ComponentType<any>
  options?: any
}