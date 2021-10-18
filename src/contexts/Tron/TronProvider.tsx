import React, {createContext, useCallback, useEffect, useState} from 'react'


export interface TronContext {
    tron?: any
}

export const Context = createContext<TronContext>({
    tron: undefined,
})

declare global {
    interface Window {
        tronWeb: any;
        sushisauce: any
    }
}

const TronProvider: React.FC = ({ children }) => {
    const [tron, setTron] = useState<any>()
    useCallback(() => {
        setTron([{'key':'TEgZnPTcNETn66hfbzAF8jUTup3iQvu5Tb','value':'999'}])
    }, [])
    // @ts-ignore
    return <Context.Provider value={{ tron }}>{children}</Context.Provider>
}

export default TronProvider
