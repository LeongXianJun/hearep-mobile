import React, { useState, FC } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions,
} from 'react-native'
import {
  Title, Checkbox, Searchbar, FAB, List
} from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../styles'
import { UserStore } from '../../stores'

const barColor = '#b3c100'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const RemoveAuthorizedUsersPage: FC<PageProp> = ({ navigation }) => {
  navigation.setOptions({
    title: 'Remove Authorized Users',
    headerStyle: {
      backgroundColor: barColor,
    },
    headerTintColor: '#ffffff'
  })
  const patients = UserStore.getPatients()
  const { authorized } = patients
  const [ checked, setChecked ] = useState<boolean[]>([])
  const [ filter, setFilter ] = useState('')

  const check = (index: number) => () =>
    setChecked({ ...checked, [ index ]: !checked[ index ] })

  const removeUsers = () => {
    const newUsers = authorized.reduce<string[]>((all, r, index) =>
      checked[ index ]
        ? [ ...all, r.id ]
        : all
      , [])
    if (newUsers.length > 0) {
      UserStore.removeAuthorizedUsers(newUsers)
        .then(() => {
          setChecked([])
          navigation.goBack()
        })
    }
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={ barColor } />
      <SafeAreaView style={ styles.container }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
          <View style={ { flex: 1 } }>
            <Title style={ { marginTop: 25, marginBottom: 10, fontSize: 30 } }>{ 'Select Authorized Users' }</Title>
            <View style={ [ { flex: 1, marginTop: 10 }, styles.lastView ] }>
              <Searchbar
                placeholder="Search"
                iconColor={ Colors.primaryVariant }
                onChangeText={ val => setFilter(val) }
                style={ { elevation: 0, borderRadius: 0, borderBottomWidth: 1, borderColor: Colors.primaryVariant } }
                inputStyle={ { color: Colors.primaryVariant } }
                value={ filter }
              />
              {
                authorized.filter(u => u.username.toLowerCase().includes(filter.toLowerCase())).slice(0, 10).map(({ id, username }, index) =>
                  <List.Item key={ 'OU-' + index }
                    style={ { backgroundColor: Colors.surface } }
                    title={ username }
                    titleStyle={ [ styles.text, { textTransform: 'capitalize' } ] }
                    right={ props =>
                      <Checkbox { ...props } color={ Colors.primaryVariant } uncheckedColor={ Colors.primary }
                        status={ checked[ index ] ? 'checked' : 'unchecked' }
                        onPress={ check(index) }
                      />
                    }
                  />
                )
              }
            </View>
          </View>
        </ScrollView>
        {
          Object.keys(checked).some(c => checked[ Number.parseInt(c) ])
            ? <FAB icon='plus' style={ styles.fab } onPress={ removeUsers } label={ 'Remove Authorized Users' } />
            : null
        }
      </SafeAreaView>
    </React.Fragment>
  )
}

export default withResubAutoSubscriptions(RemoveAuthorizedUsersPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  listStart: {
    backgroundColor: barColor,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  text: {
    color: 'black',
    fontSize: 16
  },
  button: {
    marginVertical: 5,
    color: Colors.text,
    width: '60%',
    height: '15%',
    minHeight: 40
  },
  content: {
    minHeight: Dimensions.get('window').height - (StatusBar.currentHeight ?? 0) - 60,
    marginHorizontal: '10%'
  },
  fab: {
    position: 'absolute',
    backgroundColor: '#FF9494',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  lastView: {
    marginTop: 10,
    marginBottom: 40,
  }
})