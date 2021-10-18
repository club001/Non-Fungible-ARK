import React, { createContext, useContext, useEffect, useState } from 'react'
//import { contractAddresses, supportedPools } from './constant'
import tokenABI from './abi/token.json'


let _resizeThrottled = false;



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

   
    const interval = setInterval(async () => {
      if (!tronWeb) {
        return
      }
      const latestBlockNumber = (await tronWeb.trx.getCurrentBlock())?.block_header?.raw_data?.number
      if (latestBlockNumber && block !== latestBlockNumber) {
        setBlock(latestBlockNumber)
      }
    }, 2000)
    return () => clearInterval(interval)

  }, [tronWeb,setIsMobile])
  const connect = () => {

    if (window.tronWeb?.defaultAddress?.base58) {
      setTronWeb(window.tronWeb)
      setAccount(window.tronWeb.defaultAddress.base58)

      //setToken(window.tronWeb.contract(tokenABI, contractAddresses.token))

    }
  }
  const reset = () => {
    setTronWeb(undefined)
    setAccount(undefined)
    setMaster(undefined)
    setToken(undefined)
    setPools([])
  }

  return (
    <UseWalletContext.Provider value={{tronWeb, account, master, token, pools, block, connect, reset,isMobile}}>
      {children}
    </UseWalletContext.Provider>
  )
}

export const useWallet = () => {
  const ctx = useContext(UseWalletContext)
  return ctx
}