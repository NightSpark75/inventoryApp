'use strict'
import React, { Component } from 'react'
import Realm from 'realm'
import { pickingRealm, itemsRealm } from '../../realm/schema'
import { AppRegistry, StyleSheet, RefreshControl, View, ListView, TouchableHighlight } from 'react-native'
import { Drawer, Container, Content, StyleProvider, Header, Left, Body } from 'native-base'
import { Button, Title, Icon, Text } from 'native-base'
import { withNavigation } from 'react-navigation'
import { navigationGo } from '../../lib'
import config from '../../config'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'
import Sidebar from '../sidebar'
import { getInventoryList } from '../../api'

let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
let doubleClick = false

class Inventory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuShow: false,
      refreshing: false,
      inventoryList: [],
      vs: ds.cloneWithRows([]),
    }
    this.onRefresh = this.onRefresh.bind(this)
  }

  componentDidMount() {
    this.setState({ refreshing: true }, () => this.onRefresh())
  }

  getInventoryList() {
    const success = (res) => {
      this.setState({
        inventoryList: res.data,
        refreshing: false,
        vs: ds.cloneWithRows(res.data)
      })
    }
    const error = (err) => {
      alert(err)
    }
    getInventoryList(success, error)
  }

  goInventoryStart(cyno) {
    if (!doubleClick) {
      doubleClick = true
      const params = {
        cyno: cyno,
        unlock: () => doubleClick = false
      }
      this.props.closeDrawer
      navigationGo(this, 'InventoryStart', params)
    }
  }

  closeDrawer = () => {
    this.drawer._root.close()
  }

  openDrawer = () => {
    this.drawer._root.open()
  }

  onRefresh() {
    this.setState({
      refreshing: true,
      inventoryList: [],
    }, () => this.getInventoryList())
  }

  render() {
    const { inventoryList, message } = this.state
    return (
      <StyleProvider style={getTheme(material)}>
        <Drawer
          ref={(ref) => { this.drawer = ref; }}
          content={<Sidebar navigator={this.navigator} />}
          onClose={() => this.closeDrawer()}
        >
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={this.openDrawer.bind(this)} style={{ width: 50 }}>
                  <Icon name='menu' />
                </Button>
              </Left>
              <Body>
                <Title>盤點單列表</Title>
              </Body>
            </Header>
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                  colors={['red', 'orange']}
                />
              }
            >
              {inventoryList.length === 0 && !this.state.refreshing &&
                <View>
                  <Text style={styles.inventoryInfo}>目前沒有盤點資料...</Text>
                </View>
              }
              <ListView
                enableEmptySections={true}
                style={styles.listView}
                dataSource={this.state.vs}
                renderRow={(rowData) => (
                  <TouchableHighlight
                    underlayColor='rgb(143, 186, 239)'
                    onPress={this.goInventoryStart.bind(this, rowData.cyno)}
                  >
                    <Text
                      style={styles.listItems}
                    >
                      {'盤點單號:' + rowData.cyno}
                    </Text>
                  </TouchableHighlight>
                )}
              />
            </Content>
          </Container>
        </Drawer>
      </StyleProvider>
    )
  }
}

const styles = StyleSheet.create({
  listView: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  listItems: {
    fontSize: 24,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 10
  },
  listItemsWar: {
    fontSize: 24,
    fontWeight: '600',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#000',
    color: '#F75000',
    padding: 10
  },
  inventoryInfo: {
    padding: 20,
    fontSize: 26,
  },
})

export default withNavigation(Inventory)
AppRegistry.registerComponent('Inventory', () => Inventory)