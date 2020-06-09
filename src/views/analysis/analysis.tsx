import React, { FC } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions,
} from 'react-native'
import {
  Text, Card, FAB
} from 'react-native-paper'
import { Colors } from '../../styles'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

const AmountGraph = require('../../resources/images/AmountGraph.png')

const barColor = '#34675c'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const AnalysisPage: FC<PageProp> = ({ navigation }) => {

  return (
    <React.Fragment>
      <StatusBar barStyle='default' />
      <SafeAreaView style={ styles.container }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
          <Text style={ styles.title }>{ 'Health Analysis' }</Text>
          {
            [
              { title: 'Blood Sugar Level', graph: <Card.Cover style={ styles.img } source={ AmountGraph } /> },
              { title: 'Blood Pressure', graph: <Card.Cover style={ styles.img } source={ AmountGraph } /> },
              { title: 'BMI', graph: <Card.Cover style={ styles.img } source={ AmountGraph } /> }
            ].map(({ title, graph }, index, arr) =>
              <View key={ 'graph-' + index } style={ [ { marginVertical: 10 }, index === arr.length - 1 ? styles.lastView : undefined ] }>
                <Card style={ { backgroundColor: barColor } }>
                  <Card.Title title={ title } />
                  { graph }
                  <Card.Content>{ }</Card.Content>
                </Card>
              </View>
            )
          }
        </ScrollView>
      </SafeAreaView>
      <FAB
        style={ styles.fab }
        icon="plus"
        color={ Colors.secondary }
        onPress={ () => navigation.navigate('HealthCondition/Update') }
      />
    </React.Fragment>
  )
}

export default AnalysisPage

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
    marginTop: 25,
    fontSize: 35
  },
  img: {
    margin: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  lastView: {
    marginTop: 10,
    marginBottom: 25,
  },
  fab: {
    backgroundColor: '#5f27d8',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  }
})