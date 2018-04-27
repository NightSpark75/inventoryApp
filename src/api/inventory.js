import axios from 'axios'
import config from '../config'
import { loadToken } from '../lib'

export function getInventoryList(success, error) {
  let token = loadToken()
  const Auth = 'Bearer ' + token;
  axios.get(config.route.inventoryList + '/' + config.date, { headers: { Authorization: Auth } })
  .then((res) => {
    success(res)
  }).catch((err) => {
    error(err)
  })
}

export function getInventoryItem(cyno, success, error) {
  let token = loadToken()
  const Auth = 'Bearer ' + token
  axios.get(config.route.inventoryItem + cyno, { headers: { Authorization: Auth } })
  .then((res) => {
    success(res)
  }).catch((err) => {
    error(err)
  })
}

export function inventoryStart(cyno, success, error) {
  let token = loadToken()
  let formData = new FormData()
  formData.append('cyno', cyno)
  const Auth = 'Bearer ' + token
  axios.post(config.route.inventoryStart, formData, { headers: { Authorization: Auth } })
  .then((res) => {
    success(res)
  }).catch((err) => {
    error(err)
  }) 
}

export function inventoryPause(cyno, success, error) {
  let token = loadToken()
  let formData = new FormData()
  formData.append('cyno', cyno)
  const Auth = 'Bearer ' + token
  axios.post(config.route.inventoryPause, formData, { headers: { Authorization: Auth } })
  .then((res) => {
    success(res)
  }).catch((err) => {
    error(err)
  }) 
}

export function inventoryEnd(cyno, success, error) {
  let token = loadToken()
  let formData = new FormData()
  formData.append('cyno', cyno)
  const Auth = 'Bearer ' + token
  axios.post(config.route.inventoryEnd, formData, { headers: { Authorization: Auth } })
  .then((res) => {
    success(res)
  }).catch((err) => {
    error(err)
  }) 
}

export function checkFinished(cyno, success, error) {
  let token = loadToken()
  const Auth = 'Bearer ' + token
  axios.get(config.route.finished + cyno, { headers: { Authorization: Auth } })
  .then((res) => {
    success(res)
  }).catch((err) => {
    error(err)
  })
}

export function saveInventory(data, success, error) {
  let formData = new FormData()
  formData.append('cyno', data.cyno)
  formData.append('locn', data.locn)
  formData.append('litm', data.litm)
  formData.append('lotn', data.lotn)
  formData.append('amount', data.amount)
  let token = loadToken()
  const Auth = 'Bearer ' + token;
  axios.post(config.route.saveInventory, formData, { headers: { Authorization: Auth } })
  .then((res) => {
    success(res)
  }).catch((err) => {
    error(err)
  })
}
