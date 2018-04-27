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
import { inventoryStart } from '../../api'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'

class InventoryStart extends Component {
  constructor(props) {
    super(props);
    this.state = {}

    this.goBack = this.goBack.bind(this)
    this.goItems = this.goItems.bind(this)
    this.inventoryStart = this.inventoryStart.bind(this)
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

  inventoryStart() {
    const cyno = this.props.navigation.state.params.cyno
    this.setState({ isSubmiting: true })
    const success = () => {
      this.goItems()
    }
    const error = (err) => {
      alert(err.response.data.message)
      this.setState({ isSubmiting: false })
    }
    inventoryStart(cyno, success, error)
  }

  goItems() {
    const { cyno } = this.props.navigation.state.params
    this.props.navigation.state.params.unlock()
    const params = { cyno: cyno }
    navigationGo(this, 'InventoryItems', params)
  }

  render() {
    const { cyno } = this.props.navigation.state.params
    const { isSubmiting } = this.state
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
            {isSubmiting ?
              <Button block large disabled style={{ margin: 10 }}>
                <Text>處理中...</Text>
              </Button>
            :
              <Button block primary large onPress={this.inventoryStart} style={{ margin: 10 }}>
                <Text>開始盤點</Text>
              </Button>
            }
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

export default withNavigation(InventoryStart)
AppRegistry.registerComponent('InventoryStart', () => InventoryStart)