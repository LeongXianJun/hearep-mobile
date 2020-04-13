import React from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions, 
} from 'react-native'
import {
  Text
} from 'react-native-paper'
import { Colors } from '../../styles'

export default function PermitUsersPage({navigation}) {
  navigation.setOptions({
    title: 'Permit User for Emergency',
    headerStyle: {
      backgroundColor: '#b7b8b6',
    },
    headerTintColor: '#ffffff'
  })

  return (
    <React.Fragment>
      <StatusBar barStyle='default'/>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.content}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{'Permit Users'}</Text>
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
  }
})