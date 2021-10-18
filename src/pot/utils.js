import { ethers, utils } from "ethers"
import BigNumber from 'bignumber.js'
import { contractAddresses } from "./constant"
import { getBalance } from "../utils/erc20"

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const getEarned = async (tronWeb, master, pid, account) => {
  return master.methods.pendingPot(pid, account).call()
}


export const getFarms = (pools) => {
  return pools
    ? pools.map(
      ({
        pid,
        name,
        symbol,
        tokenSymbol,
        lpAddress,
        lpContract,
        png,
      }) => ({
        pid,
        id: symbol,
        name,
        lpToken: symbol,
        lpTokenAddress: lpAddress,
        lpContract,
        tokenSymbol,
        earnToken: 'pot',
        earnTokenAddress: contractAddresses.token,
        png,
      }),
    )
    : []
}


export const getTotalStaking = async (tronWeb, master, lpContract) => {
  let balance = await getBalance(tronWeb, lpContract, master.address)
  const a = tronWeb.address.toHex(master.address)
  const c = tronWeb.address.toHex(lpContract.address)
  const resp = await tronWeb.transactionBuilder.triggerConstantContract(c, "decimals()", {}, [], a)
  const coder = new utils.AbiCoder()
  const res = coder.decode(["uint8"], Buffer.from(resp.constant_result?.[0], 'hex'))
  const decimals = res[0]
  balance = new BigNumber(balance)
  return {tokenAmount: new BigNumber(balance).div(new BigNumber(10).pow(decimals))}
}

export const approve = async (lpContract, master, account) => {
  return lpContract.methods.approve(master.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const getSushiSupply = async (tronWeb, token) => {
  const c = tronWeb.address.toHex(token.address)
  const options = {
    feeLimit: 100000000,
    callValue: 0
  }
  const resp = await tronWeb.transactionBuilder.triggerConstantContract(c, "supply()", options, [], c)
  const coder = new utils.AbiCoder()
  const res = coder.decode(["uint256"], Buffer.from(resp.constant_result?.[0], 'hex'))
  return new BigNumber(res[0]?.toString())
  // return new BigNumber(await token.methods.supply().call())
}

export const stake = async (master, pid, amount, account) => {
  let decimals = 18
  if (pid === 2) {
    decimals = 8
  } else if (pid === 3 || pid === 5) {
    decimals = 6
  }
  return await master.methods.deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString())
    .send({ from: account })
}

export const unstake = async (master, pid, amount, account) => {
  let decimals = 18
  if (pid === 2) {
    decimals = 8
  } else if (pid === 3 || pid === 5) {
    decimals = 6
  }
  return master.methods.withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString())
    .send({ from: account })
}

export const redeem = async (master, account) => {
  return ""
}

export const harvest = async (master, pid, account) => {
  return master.methods.deposit(pid, '0').send({ from: account })
}

export const getStaked = async (master, pid, account) => {
  try {
    const {amount} = await master.methods.users(pid, account).call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const getTotalSupply = async (token) => {
  return await token.methods.totalSupply().call()
}