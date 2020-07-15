import React, { FC, useState, useEffect } from 'react'
import {
  StatusBar, SafeAreaView, KeyboardAvoidingView, ScrollView, View,
  StyleSheet, Dimensions, Platform, ViewStyle, StyleProp, RefreshControl,
} from 'react-native'
import { ActivityIndicator, Snackbar } from 'react-native-paper'

import { Colors } from '../../styles'

interface ComponentProp {
  isLoading?: boolean
  children?: React.ReactNode
  snackMessage?: string
  isKeyboardAvoidingView?: boolean
  FAB?: React.ReactNode
  ATB?: React.ReactNode
  ContentStyle?: StyleProp<ViewStyle>
  hasNoBar?: boolean
  onRefresh?: () => void
}

const AppContainer: FC<ComponentProp> = ({ isLoading = false, children, snackMessage, isKeyboardAvoidingView = false, FAB, ATB, ContentStyle, hasNoBar, onRefresh }) => {
  const [ loading, setLoading ] = useState(isLoading)
  const [ snackVisible, setSnackVisible ] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(isLoading)
    }, 300)
    return () => {
      clearTimeout(timeout)
    }
  }, [ isLoading ])

  useEffect(() => {
    if (snackMessage && snackMessage !== '')
      setSnackVisible(true)
  }, [ snackMessage ])

  const AreaView = isKeyboardAvoidingView ? KeyboardAvoidingView : SafeAreaView
  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={ Colors.primaryVariant } />
      <AreaView style={ styles.container } behavior={ Platform.OS == "ios" ? "padding" : "height" }>
        <ScrollView
          style={ { flex: 1 } }
          contentContainerStyle={ [ styles.content, ContentStyle, hasNoBar && { minHeight: Dimensions.get('window').height - (StatusBar.currentHeight ?? 0) } ] }
          refreshControl={
            onRefresh ? <RefreshControl refreshing={ isLoading } onRefresh={ onRefresh } /> : <></>
          }
        >
          {
            loading
              ? <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
                <ActivityIndicator size='large' style={ styles.indicator } />
              </View>
              : <>
                { children }
              </>
          }
        </ScrollView>
      </AreaView>
      {
        loading
          ? null
          : <>
            { FAB }
            { ATB }
            <Snackbar
              visible={ snackVisible }
              duration={ Snackbar.DURATION_MEDIUM }
              onDismiss={ () => setSnackVisible(false) }
            >
              { snackMessage }
            </Snackbar>
          </>
      }
    </React.Fragment>
  )
}

export default AppContainer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    minHeight: Dimensions.get('window').height - (StatusBar.currentHeight ?? 0) - 60,
    marginHorizontal: '10%'
  },
  indicator: {
    marginVertical: 50
  }
})