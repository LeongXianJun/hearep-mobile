import React, { useState, FC, useLayoutEffect, useEffect } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions,
} from 'react-native'
import {
  Title, Checkbox, Searchbar, FAB, List, DefaultTheme, IconButton
} from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../styles'
import { UserStore } from '../../stores'

const barColor = '#b3c100'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const PermitUsersPage: FC<PageProp> = ({ navigation }) => {
  const patients = UserStore.getPatients()
  const { authorized, notAuthorized } = patients
  const [ checked, setChecked ] = useState<boolean[]>([])
  const [ filter, setFilter ] = useState('')
  const [ permittedVis, setPermittedVis ] = useState(true)
  const [ otherVis, setOtherVis ] = useState(true)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Permit User for Emergency',
      headerStyle: {
        backgroundColor: barColor,
      },
      headerTintColor: '#ffffff',
      headerRight: () =>
        <IconButton
          icon='account-edit'
          onPress={ () => navigation.navigate('Profile/RemoveUsers') }
        />
    })
  }, [ navigation ])

  useEffect(() => {
    if (authorized.length === 0 && notAuthorized.length === 0)
      UserStore.fetchAllPatients()
  }, [ authorized, notAuthorized ])

  const permitNewUsers = () => {
    const newUsers = notAuthorized.reduce<string[]>((all, r, index) =>
      checked[ index ]
        ? [ ...all, r.id ]
        : all
      , [])
    if (newUsers.length > 0) {
      UserStore.updateAuthorizedUsers(newUsers)
        .then(() => setChecked([]))
    }
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={ barColor } />
      <SafeAreaView style={ styles.container }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
          <View style={ { flex: 1 } }>
            <Title style={ { marginTop: 25, marginBottom: 10, fontSize: 30 } }>{ 'Permit Users' }</Title>
            <View style={ { flex: 1 } }>
              { PermittedUsers() }
              { PermitNewUsers() }
            </View>
          </View>
        </ScrollView>
        {
          Object.keys(checked).some(c => checked[ Number.parseInt(c) ])
            ? <FAB icon='plus' style={ styles.fab } onPress={ permitNewUsers } label={ 'Permit new Users' } />
            : null
        }
      </SafeAreaView>
    </React.Fragment>
  )

  function PermittedUsers() {
    return (
      <View style={ { marginTop: 10 } }>
        <List.Accordion
          title='Permitted Users'
          titleStyle={ { color: Colors.text, fontWeight: 'bold' } }
          theme={ DefaultTheme }
          expanded={ permittedVis }
          style={ styles.listStart }
          onPress={ () => setPermittedVis(!permittedVis) }
        >
          {
            authorized.map(({ id, username }, index) =>
              <List.Item key={ 'PU-' + index }
                style={ { backgroundColor: Colors.surface } }
                title={ username }
                titleStyle={ [ styles.text, { textTransform: 'capitalize' } ] }
              />
            )
          }
        </List.Accordion>
      </View>
    )
  }

  function PermitNewUsers() {
    const check = (index: number) => () => {
      setChecked({ ...checked, [ index ]: !checked[ index ] })
    }

    return (
      <View style={ [ { marginTop: 10 }, styles.lastView ] }>
        <List.Accordion
          title='Other Users'
          titleStyle={ { color: Colors.text, fontWeight: 'bold' } }
          theme={ DefaultTheme }
          expanded={ otherVis }
          style={ styles.listStart }
          onPress={ () => setOtherVis(!otherVis) }
        >
          <Searchbar
            placeholder="Search"
            iconColor={ Colors.primaryVariant }
            onChangeText={ val => setFilter(val) }
            style={ { elevation: 0, borderRadius: 0, borderBottomWidth: 1, borderColor: Colors.primaryVariant } }
            inputStyle={ { color: Colors.primaryVariant } }
            value={ filter }
          />
          {
            notAuthorized.filter(u => u.username.toLowerCase().includes(filter.toLowerCase())).slice(0, 10).map(({ id, username }, index) =>
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
        </List.Accordion>
      </View>
    )
  }
}

export default withResubAutoSubscriptions(PermitUsersPage)

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
    margin: 16,
    right: 0,
    bottom: 0,
  },
  lastView: {
    marginTop: 10,
    marginBottom: 40,
  }
})