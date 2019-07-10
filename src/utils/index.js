/* eslint-disable no-unused-expressions */

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function removeRepeat (data) {
  const hash = {}
  const list = data.reduce((acc, val) => {
    hash[val] ? '' : hash[val] = true && acc.push(val)
    return acc
  }, [])
  return list
}

export function removeRepeatObject (data, itemName) {
  const hash = {}
  const list = data.reduce((acc, val) => {
    hash[val[itemName]] ? '' : hash[val[itemName]] = true && acc.push(val)
    return acc
  }, [])
  return list
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export default {
  formatNumber,
  formatTime,
  removeRepeat,
  removeRepeatObject
}
