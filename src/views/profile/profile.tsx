import React, { FC, useEffect, useState } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { withResubAutoSubscriptions } from 'resub'
import { Text, Card, FAB, Button } from 'react-native-paper'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../styles'
import { AppContainer } from '../common'
import { isUndefined, AuthUtil } from '../../utils'
import { UserStore, Patient, NotificationStore } from '../../stores'

const avatar = {
  M: () => require('../../resources/images/maleAvatar.png'),
  F: () => require('../../resources/images/femaleAvatar.png')
}

const barColor = '#b3c100'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const ProfilePage: FC<PageProp> = ({ navigation }) => {
  const CurrentUser = UserStore.getUser()

  const [ isLoading, setIsLoading ] = useState(true)

  const onLoad = () => {
    UserStore.fetchUser()
      .catch(err => console.log('profile', err))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    onLoad()
    return UserStore.unsubscribeOnAuthStateChanged
  }, [])

  const logout = () =>
    NotificationStore.removeToken()
      .then(async () => {
        await AuthUtil.signOut()
      })
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [ { name: 'Login' } ]
        })
      })

  return (
    <AppContainer isLoading={ isLoading } FAB={ FloatingButtons() } onRefresh={ onLoad }>
      <Text style={ styles.title }>{ 'Profile' }</Text>
      <View style={ { flex: 1 } }>
        {
          CurrentUser ?
            <>
              { BasicInformation(CurrentUser) }
              { ContactInformation({ email: CurrentUser.email, phoneNumber: CurrentUser.phoneNumber }) }
            </>
            : null
        }
        <Button mode='text' onPress={ logout }>{ 'Logout' }</Button>
      </View>
    </AppContainer>
  )

  function BasicInformation(info: Patient) {
    return (
      <Card style={ { marginTop: 70, marginBottom: 10 } }>
        <View style={ { position: 'absolute', top: -60, zIndex: 1, width: '100%', alignItems: 'center' } }>
          <Image source={ avatar[ info.gender ]() } style={ { width: 100, height: 100, borderRadius: 50 } } />
        </View>
        <Card.Title title={ '' } style={ styles.cardStart } />
        <Card.Content>
          {
            [
              { field: 'Fullname', val: info.username },
              { field: 'Gender', val: info.gender === 'F' ? 'Female' : 'Male' },
              { field: 'Age', val: (new Date()).getFullYear() - info.dob.getFullYear() },
              { field: 'Occupation', val: info.occupation }
            ].map(({ field, val }, index) =>
              <View key={ 'bi-' + index } style={ { flex: 1, flexDirection: 'row', marginVertical: 10 } }>
                <View style={ { flex: 2 } }>
                  <Text style={ styles.text }>{ field }</Text>
                </View>
                <View style={ { flex: 3 } }>
                  <Text style={ [ styles.text, { textTransform: 'capitalize' } ] }>{ val }</Text>
                </View>
              </View>
            )
          }
        </Card.Content>
        <Card.Actions style={ styles.cardEnd }>{ }</Card.Actions>
      </Card>
    )
  }

  function ContactInformation({ email, phoneNumber }: { email: string, phoneNumber: string }) {
    return (
      <Card style={ { marginVertical: 10 } }>
        <Card.Title title={ 'Contact Information' } style={ styles.cardStart } />
        <Card.Content>
          {
            [
              { type: 'Email', value: email },
              { type: 'Phone Number', value: phoneNumber }
            ].filter(({ value }) => !isUndefined(value)).map(({ type, value }, index) =>
              <View key={ 'contact-' + index } style={ { flex: 1, flexDirection: 'row', marginVertical: 10 } }>
                <View style={ { flex: 2 } }>
                  <Text style={ [ styles.text, { textTransform: 'capitalize' } ] }>{ type }</Text>
                </View>
                <View style={ { flex: 3 } }>
                  <Text style={ styles.text }>{ value }</Text>
                </View>
              </View>
            )
          }
        </Card.Content>
        <Card.Actions style={ styles.cardEnd }>{ }</Card.Actions>
      </Card>
    )
  }

  function FloatingButtons() {
    return (
      <View style={ styles.fabs }>
        <FAB
          style={ [ styles.fab, { backgroundColor: '#43A047' } ] }
          icon="account-edit"
          color={ Colors.secondary }
          onPress={ () => navigation.navigate('Profile/Update') }
        />
        <FAB
          style={ [ styles.fab, { backgroundColor: '#00897B' } ] }
          icon="account-plus"
          color={ Colors.secondary }
          onPress={ () => navigation.navigate('Profile/PermitUsers') }
        />
      </View>
    )
  }
}

export default withResubAutoSubscriptions(ProfilePage)

const styles = StyleSheet.create({
  cardStart: {
    backgroundColor: barColor,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  cardEnd: {
    backgroundColor: barColor,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5
  },
  title: {
    fontWeight: 'bold',
    marginTop: 25,
    fontSize: 35
  },
  text: {
    color: 'black',
    fontSize: 16
  },
  fabs: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  fab: {
    marginVertical: 10
  },
  lastView: {
    marginTop: 10,
    marginBottom: 25,
  }
})