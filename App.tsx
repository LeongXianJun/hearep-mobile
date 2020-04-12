import React, { useState, ComponentType, useEffect } from 'react'
import 'react-native-gesture-handler'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import UC from './src/connections/UserConnection'

import { LoginScreen, OTPScreen, RegisterScreen, HomeScreen } from './src/views'
import { Colors } from './src/styles'

const Stack = createStackNavigator()

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    ...Colors,
    accent: Colors.secondary
  },
}

export default function App() {
  const currentRoute = 'Login'
  // const [ isLogin, setLogin ] = useState(false)
  // const navigation = useNavigation()

  // useEffect(() => {
  //   navigation.addListener('state', () => {
  //     setLogin(UC.isLogin())
  //   })
  //   return navigation.removeListener('state', () => {})
  // }, [navigation])

  const paths: Path[] = [
    ...[
      { title: 'Home', component: HomeScreen },
      { title: 'Login', component: LoginScreen },
      { title: 'OTP', component: OTPScreen },
      { title: 'Register', component: RegisterScreen }
    ].map(p  => ({
      ...p, 
      options: {
        headerShown: false
      }
    }))
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

interface Path {
  title: string
  component: ComponentType<any>
  options?: any
}