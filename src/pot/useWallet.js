import React, { createContext, useContext, useEffect, useState } from 'react'
import { contractAddresses, supportedPools } from './constant'
import tokenABI from './abi/token.json'
import masterABI from './abi/master.json'
import ERC20ABI from './abi/ERC20.json'
import LPABI from './abi/LP.json'
//判断移动端方法
function checkIsMobile() {
  const clientWidth = window.innerWidth;
  return clientWidth <= 750;
}

let _resizeThrottled = false;
function resizeListener(handler){
  const delay = 250;
  if (!_resizeThrottled) {
      _resizeThrottled = true;
      const timer = setTimeout(() => {
          handler(checkIsMobile());
          _resizeThrottled = false;
          clearTimeout(timer);
      }, delay);
  }
}
function handleResize(handler) {
  window.addEventListener('resize', resizeListener.bind(null, handler));
}

export const UseWalletContext = createContext({
  tronWeb: null,
  account: null,
  master: null,
  token: null,
  pools: null,
  connect: null,
  reset: null,
  block: 0,
  isMobile:false,
})

export const UseWalletProvider = ({children}) => {

  const [tronWeb, setTronWeb] = useState(null)
  const [account, setAccount] = useState(null)
  const [master, setMaster] = useState(null)
  const [token, setToken] = useState(null)
  const [pools, setPools] = useState(null)
  const [block, setBlock] = useState(0)
  const [isMobile, setIsMobile] = useState(false)



  useEffect(() => {
    setIsMobile(checkIsMobile());
    handleResize((isMobile) => setIsMobile( isMobile ));
   
    const interval = setInterval(async () => {

      if (!tronWeb) {
        return
      }
      const latestBlockNumber = (await tronWeb.trx.getCurrentBlock())?.block_header?.raw_data?.number
      if (latestBlockNumber && block !== latestBlockNumber) {
        setBlock(latestBlockNumber)
      }
    }, 20000)
    return () => clearInterval(interval)

  }, [tronWeb,setIsMobile])
  // const connect = () => {
  //   console.log(1111111111111)
  //   if (window.tronWeb?.defaultAddress?.base58) {
  //     setTronWeb(window.tronWeb)
  //     setAccount(window.tronWeb.defaultAddress.base58)
  //     setMaster(window.tronWeb.contract(masterABI, contractAddresses.master))
  //     setToken(window.tronWeb.contract(tokenABI, contractAddresses.token))
  //     const ps = supportedPools.map(pool => {
  //       if (pool.LP) {
  //         return Object.assign(pool, {
  //           lpContract: window.tronWeb.contract(LPABI, pool.lpAddress)
  //         })
  //       }
  //       return Object.assign(pool, {
  //         lpContract: window.tronWeb.contract(ERC20ABI, pool.lpAddress)
  //       })
  //     })
  //     setPools(ps)
  //   }
  // }
  const reset = () => {
    setTronWeb(undefined)
    setAccount(undefined)
    setMaster(undefined)
    setToken(undefined)
    setPools([])
  }

  return (

    <UseWalletContext.Provider value={{tronWeb, account, master, token, pools, block, reset,isMobile}}>
      {children}
    </UseWalletContext.Provider>
  )
}

export const useWallet = () => {

  const ctx = useContext(UseWalletContext)
  return ctx
}