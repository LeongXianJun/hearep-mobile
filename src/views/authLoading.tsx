import React, { FC, useEffect } from 'react'
import { View } from 'react-native'
import { withResubAutoSubscriptions } from 'resub'
import { ActivityIndicator } from 'react-native-paper'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { UserStore } from '../stores'
import { AppContainer } from './common'
import { Logo } from '../resources/logo'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const AuthLoadingScreen: FC<PageProp> = ({ navigation }) => {
  const isReady = UserStore.ready()

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.reset({ index: 0, routes: [ { name: 'Login' } ] })
    }, 5000);

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (isReady) {
      navigation.reset({
        index: 0,
        routes: [ { name: UserStore.getUser() ? 'Home' : 'Login' } ]
      })
    }

    return UserStore.unsubscribeOnAuthStateChanged
  }, [ isReady, navigation ])

  return (
    <AppContainer>
      <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
        <Logo width={ 150 } height={ 130 } />
        <ActivityIndicator size='large' style={ { marginVertical: 50 } } />
      </View>
    </AppContainer>
  )
}

export default withResubAutoSubscriptions(AuthLoadingScreen)