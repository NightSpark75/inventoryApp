'use strict'
import React, { Component } from 'react'
import { withNavigation } from 'react-navigation'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, BackHandler, View } from 'react-native'
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
  confirm,
  navigationReset,
  navigationGo,
} from '../../lib'
import { checkFinished, saveInventory, getInventoryItem, inventoryPause } from '../../api'
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
      item: {},
      scanIndex: 0,
      saving: false,
    }
    this.getItem = this.getItem.bind(this)
    this.enabledScanModel = this.enabledScanModel.bind(this)
    this.disabledScanModel = this.disabledScanModel.bind(this)
    this.goInventoryEnd = this.goInventoryEnd.bind(this)
    this.onScanBarcode = this.onScanBarcode.bind(this)
    this.cancelInventory = this.cancelInventory.bind(this)
    this.amountChange = this.amountChange.bind(this)
    this.save = this.save.bind(this)
    this.goBackInventory = this.goBackInventory.bind(this)
  }

  componentDidMount() {
    this.getItem()
  }

  getItem() {
    const { cyno } = this.props.navigation.state.params
    const success = (res) => {
      this.setState({item: res.data}, () => this.enabledScanModel())
    }
    const error = (err) => {
      alert(err.response.data.message)
    }
    getInventoryItem(cyno, success, error)
  }

  enabledScanModel() {
    this.checkFinished()
    BackHandler.addEventListener('hardwareBackPress', () => this.cancelInventory())
    DeviceEventEmitter.addListener('onScanBarcode', (code) => this.onScanBarcode(code))
    DeviceEventEmitter.addListener('onRefreshMessage', (msg) => toast(msg))
    ScanModule.enabledScan()
  }

  disabledScanModel() {
    BackHandler.removeEventListener('hardwareBackPress')
    DeviceEventEmitter.removeListener('onScanBarcode')
    DeviceEventEmitter.removeListener('onRefreshMessage')
    ScanModule.disabledScan()
  }

  componentWillUnmount() {
    this.disabledScanModel()
  }

  onScanBarcode(code) {
    const { scanIndex, item } = this.state
    let index = scanIndex%4
    if (index >= 3) return
      if (code === item[scanColumn[index]]) {
      index++
        this.setState({
          scanIndex: index,
          message: '',
        })
    } else {
      this.setState({ message: msgOption[index] + '錯誤(' + code + ')' })
    }
  }

  amountChange(e) {
    const amount = e.nativeEvent.text
    let item = this.state.item
    item.amount = amount
    this.setState({item: item})
  }

  cancelInventory() {
    const title = '中斷盤點'
    const msg = '您確定要中斷盤點？'
    confirm(title, msg, this.goBackInventory, () => { })
    return true
  }

  goBackInventory() {
    const { cyno } = this.props.navigation.state.params
    const success = (res) => {
      navigationReset(this, 'InventoryList')
    }
    const error = (err) => {
      alert(err.response.data.message)
    }
    inventoryPause(cyno, success, error)
  }

  save() {
    const { item } = this.state
    const { cyno } = this.props.navigation.state.params
    this.setState({saving: true})
    const success = (res) => {
      if (Object.keys(res.data).length > 0) {
        this.setState({
          saving: false,
          scanIndex: 0,
          item: res.data
        })
      } else {
        this.goInventoryEnd()
      }
    }
    const error = (err) => {
      alert(err.response.data.message)
      this.setState({saving: false})
    }
    saveInventory(item, success, error)
  }

  checkFinished() {
    const { cyno } = this.props.navigation.state.params
    const success = (res) => {
      if (res.data) {
        this.goInventoryEnd()
      }
    }
    const error = (err) => {
      alert(err.response.data.message)
    }
    checkFinished(cyno, success, error)
  }

  goInventoryEnd() {
    const { cyno } = this.props.navigation.state.params
    this.disabledScanModel()
    const params = {
      cyno: cyno,
    }
    navigationGo(this, 'InventoryEnd', params)
  }

  render() {
    const { item, scanIndex, message, saving } = this.state
    return (
      <StyleProvider style={getTheme(material)} >
        {item === null ?
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={this.cancelPicking.bind(this)} style={{ width: 50 }}>
                  <Icon name='md-pause' />
                </Button>
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
                  <Icon name='md-pause' />
                </Button>
              </Left>
              <Body>
                <Title style={{ width: 100 }}>盤點作業</Title>
              </Body>
            </Header>
            <Content style={styles.content}>
              {Object.keys(item).length > 0 &&
                <View>
                  <Text style={scanIndex > 0 ? styles.scanInfoSuccess : styles.scanInfo}>{'儲位: ' + item.locn}</Text>
                  <Text style={scanIndex > 1 ? styles.scanInfoSuccess : styles.scanInfo}>{'料號: ' + item.litm}</Text>
                  <Text style={scanIndex > 2 ? styles.scanInfoSuccess : styles.scanInfo}>{'批號: ' + item.lotn}</Text>
                  <Text style={styles.InventoryInfo}>{'盤點數量: ' + (Number(item.tqoh) / 10000) + ' ' + item.uom1}</Text>
                  {shwoDetail(Number(item.tqoh) / 10000, item.tag1, item.tag2, item.tag3)}
                </View>
              }
              {scanIndex === 3 &&
                <Item floatingLabel>
                  <Label>輸入盤點數量</Label>
                  <Input
                    keyboardType="numeric"
                    onChange={this.amountChange}
                    value={item.amount}
                  />
                </Item>
              }
              {message !== '' &&
                <Text style={styles.message}>{message}</Text>
              }
              {scanIndex === 3 && !saving &&
                <Button block primary large onPress={this.save} style={{marginTop: 40}}>
                  <Text>確認</Text>
                </Button>
              }
              {scanIndex === 3 && saving &&
                <Button block primary large disabled={true}>
                  <Text>處理中...</Text>
                </Button>
              }
            </Content>
          </Container>
        }
      </StyleProvider>
    )
  }
}

function shwoDetail(tqoh, tag1, tag2, tag3) {
  tqoh = Number(tqoh)
  let t1 = Number(tag1)
  let t2 = Number(tag2) * t1
  let t3 = Number(tag3) * t2
  let b1, b2, b3, msg
  if (t3 > 0) {
    b3 = Math.floor(tqoh / t3) 
    tqoh = tqoh % t3
    b2 = Math.floor(tqoh / t2)
    tqoh = tqoh % t2
    b1 = Math.floor(tqoh / t1)
    msg = b3 + '箱' + b2 + '盒又' + b1
  } else if (t2 > 0) {
    b2 = Math.floor(tqoh / t2)
    tqoh = tqoh % t2
    b1 = Math.floor(tqoh / t1)
    msg = b2 + '盒又' + b1
  } else if (t1 > 0) {
    b1 = Math.floor(tqoh / t1)
    msg = b1 + '銷售包裝'
  } else {
    msg = '--'
  }
  return (
    <Text style={styles.InventoryInfo}>{'盤點數量: ' + msg}</Text>
  )
}

export default withNavigation(InventoryItems)
AppRegistry.registerComponent('InventoryItems', () => InventoryItems)