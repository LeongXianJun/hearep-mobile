import React, { FC, useEffect } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions,
} from 'react-native'
import {
  Text, Card, FAB, ActivityIndicator
} from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../styles'
import { LineGraph } from '../common'
import { HealthAnalysisStore } from '../../stores'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const AnalysisPage: FC<PageProp> = ({ navigation }) => {
  const isHCReady = HealthAnalysisStore.ready()
  const healthConditions = HealthAnalysisStore.getHealthCondition()

  useEffect(() => {
    HealthAnalysisStore.fetchHealthAnalysis()
  }, [])

  return (
    <React.Fragment>
      <StatusBar barStyle='default' />
      <SafeAreaView style={ styles.container }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ [ styles.content, { paddingBottom: 50 } ] }>
          {
            isHCReady
              ? <>
                <Text style={ styles.title }>{ 'Health Analysis' }</Text>
                {
                  [
                    {
                      title: 'Sickness Frequency',
                      graph: <LineGraph data={ healthConditions[ 'Sickness Frequency' ].map(a => ({ x: a.month, y: a.count })) } showSymbol yLabel='Count' showMonth />
                    },
                    {
                      title: 'Blood Sugar Level',
                      graph: <LineGraph data={ healthConditions[ 'Blood Sugar Level' ].map(a => ({ x: a.day, y: a.length > 0 ? a.count / a.length : 0 })) } showSymbol yLabel='Count' />
                    },
                    {
                      title: 'Blood Pressure',
                      graph: <LineGraph data={ healthConditions[ 'Blood Pressure Level' ].map(a => ({ x: a.day, y: a.length > 0 ? a.count / a.length : 0 })) } showSymbol yLabel='Count' />
                    },
                    {
                      title: 'BMI',
                      graph: <LineGraph data={ healthConditions[ 'BMI' ].map(a => ({ x: a.day, y: a.length > 0 ? a.count / a.length : 0 })) } showSymbol yLabel='Count' />
                    }
                  ].map(({ title, graph }, index, arr) =>
                    <View key={ 'graph-' + index } style={ [ { marginVertical: 10 }, index === arr.length - 1 ? styles.lastView : undefined ] }>
                      <Card style={ { flex: 1 } }>
                        <Card.Title title={ title } titleStyle={ { color: '#000000' } } />
                        { graph }
                        <Card.Content>{ }</Card.Content>
                      </Card>
                    </View>
                  )
                }
              </>
              : <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
                <ActivityIndicator size='large' style={ styles.indicator } />
              </View>
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

export default withResubAutoSubscriptions(AnalysisPage)

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
  },
  title: {
    fontWeight: 'bold',
    marginTop: 25,
    fontSize: 35
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