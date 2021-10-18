import BigNumber from 'bignumber.js'

export { default as formatAddress } from './formatAddress'

export const bnToDec = (bn) => {
  return bn.div('1000000000000000000').toNumber()
}

export const decToBn = (dec) => {
  return new BigNumber(dec).times('1000000000000000000')
}
