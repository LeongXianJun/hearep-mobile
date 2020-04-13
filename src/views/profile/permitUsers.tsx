import React, { useState } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions, 
} from 'react-native'
import {
  Text, Card, Title, Button, IconButton, Checkbox, Searchbar, FAB
} from 'react-native-paper'
import { Colors } from '../../styles'
import { UserC } from '../../connections'

export default function PermitUsersPage({navigation}) {
  navigation.setOptions({
    title: 'Permit User for Emergency',
    headerStyle: {
      backgroundColor: '#b7b8b6',
    },
    headerTintColor: '#ffffff'
  })
  const [ remainingUsers, setRemainingUsers ] = useState(UserC.getRemainingUsers())
  const [ permittedUsers, setPermittedUsers ] = useState(UserC.permittedUsers)
  const [ checked, setChecked ] = useState({})
  const [ filter, setFilter ] = useState('')

  const refreshData = () => {
    setPermittedUsers(UserC.permittedUsers)
    setRemainingUsers(UserC.getRemainingUsers())
  }

  const permitNewUsers = () => {
    const newUsers = remainingUsers.filter(r => checked[r.id])
    UserC.permitNewUsers(newUsers)
    setChecked({})
    refreshData()
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default'/>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.content}>
          <View style={{flex: 1}}>
            <Title style={{marginTop: 25}}>{'Permit Users'}</Title>
            <View style={{flex: 1}}>
              { PermittedUsers() }
              { PermitNewUsers() }
            </View>
          </View>
        </ScrollView>
        {
          Object.keys(checked).some(c => checked[c])
          ? <FAB icon='plus' style={styles.fab} onPress={permitNewUsers} label={'Permit new Users'}/>
          : null
        }
      </SafeAreaView>
    </React.Fragment>
  )

  function PermittedUsers() {
    const removeUser = (id: number) => () => {
      UserC.removePermittedUser(id)
      refreshData()
    }

    return (
      <Card style={{marginVertical: 10}}>
        <Card.Title title={'Permitted Users'} titleStyle={{color: 'black'}}/>
        <Card.Content>
          {
            permittedUsers.map(({id, name}, index) => 
              <View key={'PU-' + index} style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
                <View style={{flex: 7, justifyContent: 'center'}}>
                  <Text style={[styles.text, {textTransform: 'capitalize'}]}>{ name }</Text>
                </View>
                <View style={{flex: 1}}>
                  <IconButton icon='delete' color={Colors.primary} onPress={removeUser(id)}/>
                </View>
              </View>
            )
          }
        </Card.Content>
      </Card>
    )
  }

  function PermitNewUsers() {
    const check = (id: number) => () => {
      setChecked({...checked, [id]: !checked[id]})
    }

    return (
      <Card style={[{marginVertical: 10}, styles.lastView]}>
        <Card.Title title={'Other Users'} titleStyle={{color: 'black'}}/>
        <Card.Content>
          <Searchbar
            placeholder="Search"
            iconColor={Colors.primary}
            onChangeText={val => setFilter(val)}
            inputStyle={{color: Colors.primaryVariant}}
            value={filter}
          />
          {
            remainingUsers.filter(u => u.name.toLowerCase().includes(filter.toLowerCase())).slice(0, 10).map(({id, name}, index) => 
              <View key={'OU-' + index} style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
                <View style={{flex: 7, justifyContent: 'center'}}>
                  <Text style={[styles.text, {textTransform: 'capitalize'}]}>{ name }</Text>
                </View>
                <View style={{flex: 1}}>
                  <Checkbox color={Colors.primaryVariant} uncheckedColor={Colors.primary}
                    status={checked[id]? 'checked' : 'unchecked'}
                    onPress={check(id)}
                  />
                </View>
              </View>
            )
          }
        </Card.Content>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: Colors.background 
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
    minHeight: Dimensions.get('window').height - StatusBar.currentHeight - 60,
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