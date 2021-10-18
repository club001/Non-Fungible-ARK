import BigNumber from 'bignumber.js'

export const getBalanceNumber = (balance, decimals = 18) => {
  const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
  return displayBalance.toNumber()
}

export const getDisplayBalance = (balance, decimals = 18) => {
  const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
  if (displayBalance.lt(1)) {
    return displayBalance.toPrecision(4)
  } else {
    return displayBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

export const getFullDisplayBalance = (balance, decimals = 18) => {
  return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed()
}

export const getBalanceMul =  (balance, decimals = 18) => {
  return balance.multipliedBy(new BigNumber(10).pow(decimals)).toNumber()
}

export const getPlayerCode = (address) => {
  return address.substr(0,3).toLowerCase()+address.substr(address.length-3,address.length).toLowerCase();
}

export const getPlayerCode2 = (address) => {
  return address.substr(0,3)+'...'+address.substr(address.length-3,address.length);
}
