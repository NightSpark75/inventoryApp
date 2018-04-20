'use strict'
import React, { Component } from 'react'
import Realm from 'realm'
import { itemsRealm, pickingRealm } from '../../realm/schema'
import { withNavigation } from 'react-navigation'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, BackHandler } from 'react-native'
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
  Icon,
  Item,
  Input,
  Label,
} from 'native-base'
import {
  toast,
  getAllItems,
  removePicking,
  picked,
  checkFinished,
  confirm,
  navigationReset,
  navigationGo,
} from '../../lib'
import { checkFinished, saveInventory } from '../../api'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'

const ScanModule = NativeModules.ScanModule
const msgOption = ['儲位', '料號', '批號']
const scanColumn = ['locn', 'litm', 'lotn']

const styles = StyleSheet.create({
  content: {
    padding: 10
  },
  scanInfo: {
    fontSize: 20,
    fontWeight: '400',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#f0ad4e',
    borderRadius: 1,
    padding: 5,
    marginTop: 2,
    marginBottom: 3,
  },
  scanInfoSuccess: {
    fontSize: 20,
    fontWeight: '400',
    borderStyle: 'solid',
    borderWidth: 4,
    borderColor: '#36D025',
    borderRadius: 1,
    padding: 5,
    marginTop: 2,
    marginBottom: 3,
  },
  pickingInfo: {
    fontSize: 20,
    fontWeight: '400',
    padding: 5,
    marginTop: 2,
    marginBottom: 3,
  },
  message: {
    fontSize: 20,
    color: '#f0ad4e',
    marginTop: 20,
    marginBottom: 20,
  }
})

class InventoryItems extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: null,
      scanIndex: 0,
    }
    this.cancelInventory = this.cancelInventory.bind(this)
    this.amountChange = this.amountChange.bind(this)
    this.save = this.save.bind(this)
    this.goBackInventory = this.goBackInventory.bind(this)
  }

  componentDidMount() {
    let items = getAllItems()
    this.setState({ items: items }, () => {
      this.checkFinished()
      BackHandler.addEventListener('hardwareBackPress', () => this.cancelInventory())
      DeviceEventEmitter.addListener('onScanBarcode', this.onScanBarcode.bind(this))
      DeviceEventEmitter.addListener('onRefreshMessage', (msg) => toast(msg))
      ScanModule.enabledScan()
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress')
    DeviceEventEmitter.removeListener('onScanBarcode')
    DeviceEventEmitter.removeListener('onRefreshMessage')
    ScanModule.disabledScan()
  }

  onScanBarcode(code) {
    let index = scanIndex%3
    this.setState({scanIndex: index++})
    // const { scanIndex, item } = this.state
    // const index = scanIndex%3
    // if (code === item[scanColumn[index]]) {
    //   this.setState({scanIndex: index++})
    // } else {
    //   this.setState({ message: msgOption[index] + '錯誤(' + code + ')' })
    // }
  }

  amountChange(e) {
    const amount = e.target.value
    let item = this.state.item
    item.amount = amount
    ths.state({item: item})
  }

  cancelInventory() {
    const title = '中斷盤點'
    const msg = '您確定要中斷盤點？'
    confirm(title, msg, this.goBackInventory, () => { })
    return true
  }

  goBackInventory() {
    navigationReset(this, 'InventoryList')
  }

  save() {
    const { item } = this.state
    const { cyno } = this.props.navigation.state.params
    const success = (res) => {
      if (res.data !== null) {
        this.setState({item: res.data})
      } else {
        const params = {
          cyno: cyno,
        }
        navigationGo(this, 'inventoryEnd', params)
      }
    }
    const error = (err) => {
      alert(err.response.data.msg)
    }
    saveInventory(item)
  }

  checkFinished() {
    const { cyno } = this.props.navigation.state.params
    const success = (res) => {
      if (res.data) {
        const params = {
          cyno: cyno,
        }
        navigationGo(this, 'inventoryEnd', params)
      }
    }
    const error = (err) => {
      alert(err.response.data.msg)
    }
    checkFinished(cyno, success, error)
  }

  render() {
    const { item, scanIndex, message } = this.state
    return (
      <StyleProvider style={getTheme(material)} >
        {pickValue.length === 0 ?
          <Container>
            <Header>
              <Left>
                {/*
                <Button transparent onPress={this.cancelPicking.bind(this)} style={{ width: 50 }}>
                  <Icon name='md-close' />
                </Button>
                */}
              </Left>
              <Body>
                <Title style={{ width: 100 }}>盤點作業</Title>
              </Body>
            </Header>
            <Content style={styles.content}>
              <Text style={styles.InventoryInfo}>資料處理中...</Text>
            </Content>
          </Container>
          :
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={this.cancelInventory} style={{ width: 50 }}>
                  <Icon name='md-close' />
                </Button>
              </Left>
              <Body>
                <Title style={{ width: 100 }}>揀貨作業</Title>
              </Body>
            </Header>
            <Content style={styles.content}>
              <Text style={scanIndex === 0 ? styles.scanInfoSuccess : styles.scanInfo}>{'儲位: ' + item.locn.trim()}</Text>
              <Text style={scanIndex === 1 ? styles.scanInfoSuccess : styles.scanInfo}>{'料號: ' + item.litm.trim()}</Text>
              <Text style={scanIndex === 2 ? styles.scanInfoSuccess : styles.scanInfo}>{'批號: ' + item.lotn.trim()}</Text>
              <Text style={styles.InventoryInfo}>{'盤點數量: ' + item.tqoh + ' ' + item.uom1.trim()}</Text>
              {style.content === 2 &&
                <Item floatingLabel>
                  <Label>輸入盤點數量</Label>
                  <Input
                    keyboardType="numeric"
                    onChange={this.amountChange}
                    autoFocus={true}
                    value={item.amount}
                  />
                </Item>
              }
              {message !== '' &&
                <Text style={styles.message}>{message}</Text>
              }
              {style.content === 2 &&
                <Button block primary large onPress={this.save}>
                  <Text>確認</Text>
                </Button>
              }
            </Content>
          </Container>
        }
      </StyleProvider>
    )
  }
}

export default withNavigation(InventoryItems)
AppRegistry.registerComponent('InventoryItems', () => InventoryItems)