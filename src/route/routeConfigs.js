import Scan from '../containers/scan'
import Update from '../containers/update'
import Login from '../containers/login'
import Sample from '../containers/sample'
import SampleDetail from '../containers/sample/detail'
import InventoryList from '../containers/inventory/index'
import InventoryItems from '../containers/inventory/items'
import InventoryStart from '../containers/inventory/start'
import InventoryEnd from '../containers/inventory/end'

export default {
  Scan: {
    screen: Scan,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  Update: {
    screen: Update,
    natigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  Login: {
    screen: Login,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  Sample: {
    screen: Sample,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  SampleDetail: {
    screen: SampleDetail,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  InventoryList: {
    screen: InventoryList,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    })
  },
  InventoryItems: {
    screen: InventoryItems,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    })
  },
  InventoryStart: {
    screen: InventoryStart,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    })
  },
  InventoryEnd: {
    screen: InventoryEnd,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    })
  },
}