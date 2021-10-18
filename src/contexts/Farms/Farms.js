import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from '../../pot/useWallet'

import { bnToDec } from '../../utils'
import { getFarms, getEarned } from '../../pot/utils'

import Context from './context'
import { Farm } from './types'

const Farms: React.FC = ({ children }) => {
  const [unharvested, setUnharvested] = useState(0)

  const { account, pools } = useWallet()

  const farms = getFarms(pools)

  return (
    <Context.Provider
      value={{
        farms,
        unharvested,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Farms
