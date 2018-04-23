'use strict'
import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Alert, View, BackHandler } from 'react-native'
import { Container, Content, StyleProvider, Header, Left, Body, Button, Title, Text, Icon } from 'native-base'
import { confirm, navigationReset } from '../../lib'
import { withNavigation } from 'react-navigation'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'

class InventoryEnd extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.goBackInventory = this.goBackInventory.bind(this)
    this.inventoryEnd = this.inventoryEnd.bind(this)
    this.cancelInventory = this.cancelInventory.bind(this)
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => this.cancelInventory())
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress')
  }

  cancelInventory() {
    const title = '結束盤點'
    const msg = '您確定要結束盤點？'
    confirm(title, msg, this.goBackInventory(), () => {})
    return true
  }

  goBackInventory() {
    navigationReset(this, 'InventoryList')
  }

  inventoryEnd() {
    this.goBackInventory()
  }

  render() {
    const { cyno } = this.props.navigation.state.params
    return (
      <StyleProvider style={getTheme(material)} >
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.cancelInventory} style={{ width: 50 }}>
                <Icon name='md-close' />
              </Button>
            </Left>
            <Body>
              <Title>完成盤點</Title>
            </Body>
          </Header>
          <Content style={styles.content}>
            <View>
              <Text style={styles.inventoryInfo}>{'盤點單號:' + cyno}</Text>
              <Text style={styles.message}>
                所有品項已完成，按下按鈕完成盤點...
              </Text>
              <Button block primary large onPress={this.inventoryEnd} style={{ margin: 10 }}>
                <Text>完成盤點</Text>
              </Button>
            </View>
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
  message: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
  },
})

export default withNavigation(InventoryEnd)
AppRegistry.registerComponent('InventoryEnd', () => InventoryEnd)