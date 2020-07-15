import React, { FC, useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { withResubAutoSubscriptions } from 'resub'
import { Text, Card, FAB } from 'react-native-paper'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../styles'
import { HealthAnalysisStore } from '../../stores'
import { LineGraph, AppContainer } from '../common'

const barColor = '#34675c'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const AnalysisPage: FC<PageProp> = ({ navigation }) => {
  const healthConditions = HealthAnalysisStore.getHealthCondition()

  const [ isLoading, setIsLoading ] = useState(true)

  const onLoad = () => {
    HealthAnalysisStore.fetchHealthAnalysis()
      .finally(() => setIsLoading(false))
  }

  useEffect(onLoad, [])

  const FloatingButtons = () =>
    <FAB
      style={ styles.fab }
      icon="plus"
      color={ Colors.secondary }
      onPress={ () => navigation.navigate('HealthCondition/Update') }
    />

  return (
    <AppContainer isLoading={ isLoading } FAB={ FloatingButtons() } ContentStyle={ { paddingBottom: 50 } } onRefresh={ onLoad }>
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
            <Card style={ { flex: 1, backgroundColor: barColor } }>
              <Card.Title title={ title } />
              <Card.Content style={ { backgroundColor: Colors.surface } }>
                <ScrollView horizontal centerContent style={ { overflow: 'visible' } } showsHorizontalScrollIndicator={ false }>
                  { graph }
                </ScrollView>
              </Card.Content>
              <Card.Content style={ styles.cardEnd }>{ }</Card.Content>
            </Card>
          </View>
        )
      }
    </AppContainer>
  )
}

export default withResubAutoSubscriptions(AnalysisPage)

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginTop: 25,
    fontSize: 35
  },
  lastView: {
    marginTop: 10,
    marginBottom: 25,
  },
  cardEnd: {
    backgroundColor: barColor,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5
  },
  fab: {
    backgroundColor: '#5f27d8',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  }
})