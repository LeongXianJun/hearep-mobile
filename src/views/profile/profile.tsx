import React from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, 
  Dimensions, Image
} from 'react-native'
import {
  Text, Card, FAB, Title
} from 'react-native-paper'
import { Colors } from '../../styles'
import { UserC, User } from '../../connections'

const avatar = {
  M: () => require('../../resources/images/maleAvatar.png'),
  F: () => require('../../resources/images/femaleAvatar.png')
}

export default function ProfilePage({navigation}) {
  const currentUser = UserC.currentUser

  return (
    <React.Fragment>
      <StatusBar barStyle='default'/>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.content}>
          <Text style={styles.title}>{'Profile'}</Text>
          <View style={{flex: 1}}>
            { BasicInformation(currentUser) }
            { ContactInformation(currentUser) }
          </View>
        </ScrollView>
      </SafeAreaView>
      { FloatingButtons() }
    </React.Fragment>
  )

  function BasicInformation(info: User) {
    return (
      <Card style={{marginTop: 60, marginBottom: 10}}>
        <View style={{position: 'absolute', top: -50, width: '100%', alignItems: 'center'}}>
          <Image source={avatar[currentUser.gender]()} style={{width: 100, height: 100, borderRadius: 50}}/>
        </View>
        <Card.Title title={''}/>
        <Card.Content>
          <View style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
            <View style={{flex: 2}}>
              <Text style={styles.text}>{ 'Fullname' }</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={styles.text}>{ currentUser.fullname }</Text>                          
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
            <View style={{flex: 2}}>
              <Text style={styles.text}>{ 'Gender' }</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={styles.text}>{ currentUser.gender }</Text>                          
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
            <View style={{flex: 2}}>
              <Text style={styles.text}>{ 'Age' }</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={styles.text}>{ (new Date()).getFullYear() - currentUser.dob.getFullYear() }</Text>                          
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
            <View style={{flex: 2}}>
              <Text style={styles.text}>{'Occupation'}</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={[styles.text, {textTransform: 'capitalize'}]}>{ info.occupation }</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    )
  }

  function ContactInformation(info: User) {
    return (
      <Card style={{marginVertical: 10}}>
        <Card.Title title={'Contact Information'} titleStyle={{color: 'black'}}/>
        <Card.Content>
          {
            info.contacts?.map(({type, value}, index) => 
              <View key={'contact-' + index} style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
                <View style={{flex: 2}}>
                  <Text style={[styles.text, {textTransform: 'capitalize'}]}>{ type }</Text>
                </View>
                <View style={{flex: 3}}>
                  <Text style={styles.text}>{ value }</Text>
                </View>
              </View>
            )
          }
        </Card.Content>
      </Card>
    )
  }

  function FloatingButtons() {
    return (
      <View style={styles.fabs}>
        <FAB
          style={[styles.fab, {backgroundColor: '#43A047'}]}
          icon="account-edit"
          color={Colors.secondary}
          onPress={() => navigation.navigate('Profile/Update')}
        />
        <FAB
          style={[styles.fab, {backgroundColor: '#00897B'}]}
          icon="account-plus"
          color={Colors.secondary}
          onPress={() => navigation.navigate('Profile/PermitUsers')}
        />
      </View>
    ) 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: Colors.background 
  },
  content: {
    minHeight: Dimensions.get('window').height - StatusBar.currentHeight - 60,
    marginHorizontal: '10%'
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