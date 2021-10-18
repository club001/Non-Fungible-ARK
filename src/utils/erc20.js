import BigNumber from 'bignumber.js'
import { utils } from "ethers";
export const getAllowance = async (
  tronWeb,
  lpContract,
  masterChefContract,
  account,
) => {
  try {
    const a = tronWeb.address.toHex(account)
    const b = tronWeb.address.toHex(masterChefContract.address)
    const c = tronWeb.address.toHex(lpContract.address)
    const params = [{type:'address', value:a}, {type:'address', value:b}]
    const resp = await tronWeb.transactionBuilder.triggerConstantContract(c, "allowance(address,address)", {}, params, a)
    const coder = new utils.AbiCoder()
    const res = coder.decode(["uint256"], Buffer.from(resp.constant_result?.[0], 'hex'))
    return res[0]?.toString()
  } catch (e) {
    return '0'
  }
}

export const getBalance = async (
  tronWeb,
  lpContract,
  userAddress,
)=> {
  // try {
  //   const balance = await lpContract.methods
  //     .balanceOf(userAddress)
  //     .call()
  //   if (balance instanceof BigNumber) {
  //     return balance.toString()
  //   }
  //   if (balance.balance) {
  //     return balance.balance.toString()
  //   }
  //   return balance
  // } catch (e) {
  //   return '0'
  // }
  const a = tronWeb.address.toHex(userAddress)
  const c = tronWeb.address.toHex(lpContract.address)
  const params = [{type:'address', value:a}]
  const resp = await tronWeb.transactionBuilder.triggerConstantContract(c, "balanceOf(address)", {}, params, a)
  const coder = new utils.AbiCoder()
  const res = coder.decode(["uint256"], Buffer.from(resp.constant_result?.[0], 'hex'))
  return res[0]?.toString()
}
