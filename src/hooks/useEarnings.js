import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from '../pot/useWallet'

import { getEarned } from '../pot/utils'

const useEarnings = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { tronWeb, account, master, block} = useWallet()

  const fetchBalance = useCallback(async () => {
    const balance = await getEarned(tronWeb, master, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, master])

  useEffect(() => {
    if (account && master) {
      fetchBalance()
    }
  }, [account, block, master, setBalance])

  return balance
}

export default useEarnings
