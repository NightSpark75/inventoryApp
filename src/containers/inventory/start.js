'use strict'
import React, { Component } from 'react'
import { AppRegistry, StyleSheet, ListView, BackHandler } from 'react-native'
import { 
  Container, 
  Content, 
  StyleProvider, 
  Header, 
  Left, 
  Body, 
  Button, 
  Title, 
  Text, 
  Icon 
} from 'native-base'
import { withNavigation } from 'react-navigation'
import { navigationGo } from '../../lib'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'

class InventoryStart extends Component {
  constructor(props) {
    super(props);
    this.state = {}

    this.goBack = this.goBack.bind(this)
    this.goItems = this.goItems.bind(this)
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => this.goBack)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => {})
  }

  goBack() {
    this.props.navigation.state.params.unlock();
    this.props.navigation.goBack()
    return true
  }

  goItems() {
    const { cyno } = this.props.navigation.state.params
    this.props.navigation.state.params.unlock()
    const params = { cyno: cyno }
    navigationGo(this, 'inventoryItems', params)
  }

  render() {
    const { cyno } = this.props.navigation.state.params
    return (
      <StyleProvider style={getTheme(material)} >
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.goBack} style={{ width: 50 }}>
                <Icon name='ios-arrow-back-outline' />
              </Button>
            </Left>
            <Body>
              <Title>盤點單號確認</Title>
            </Body>
          </Header>
          <Content style={styles.content}>
            <Text style={styles.inventoryInfo}>{'盤點單號:' + cyno}</Text>
            <Button block primary large onPress={this.goItems} style={{ margin: 10 }}>
              <Text>開始盤點</Text>
            </Button>
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  inventoryInfo: {
    fontSize: 20,
    marginBottom: 50,
  },
})

export default withNavigation(PickingStart)
AppRegistry.registerComponent('PickingStart', () => PickingStart)