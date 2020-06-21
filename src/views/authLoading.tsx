import React, { FC, useEffect } from 'react'
import {
  StatusBar, StyleSheet, View, Dimensions
} from 'react-native'
import {
  ActivityIndicator
} from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../styles'
import { UserStore } from '../stores'
import { Logo } from '../resources/logo'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const AuthLoadingScreen: FC<PageProp> = ({ navigation }) => {
  const isReady = UserStore.ready()

  useEffect(() => {
    if (isReady) {
      navigation.reset({
        index: 0,
        routes: [ { name: UserStore.getUser() ? 'Home' : 'Login' } ]
      })
    }

    return UserStore.unsubscribe
  }, [ isReady, navigation ])

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={ Colors.primaryVariant } />
      <View style={ styles.container }>
        <View style={ styles.content }>
          <Logo width={ 150 } height={ 130 } />
          <ActivityIndicator size='large' style={ styles.indicator } />
        </View>
      </View>
    </React.Fragment>
  )
}

export default withResubAutoSubscriptions(AuthLoadingScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    minHeight: Dimensions.get('window').height - (StatusBar.currentHeight ?? 0),
    marginHorizontal: '10%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  indicator: {
    marginVertical: 50
  }
})