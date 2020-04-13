import React from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions, 
} from 'react-native'
import {
  Text, Button
} from 'react-native-paper'
import { Colors } from '../../styles'

export default function HomePage({navigation}) {

  return (
    <React.Fragment>
      <StatusBar barStyle='default'/>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.content}>
          <View style={{flex: 5, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{'Home'}</Text>
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
    minHeight: Dimensions.get('window').height - StatusBar.currentHeight,
    marginHorizontal: '10%'
  }
})