import useInterval, {useIntervalLong} from "./useInterval";
import BigNumber from 'bignumber.js'
import {useCallback, useEffect, useRef, useState} from 'react'
import {trongetContract} from "../utils/trc20";


export const useWalletAddress = () => {
    const [wallet, setWallet] = useState("")
    const fetchLastTime = useCallback(async () => {
       try{
           // @ts-ignore
           setWallet(window.tronWeb.defaultAddress.base58);
       }catch (e) {

       }
    }, [])

    useInterval(fetchLastTime)
    return wallet
}


export const useTronTokenBalance = (tokenAddress,type) => {
    const [balance, setBalance] = useState(new BigNumber(0))
    const fetchBalance = useCallback(async () => {
        try{
            if(window.tronWeb){
                //usdt
                if(type == 1){
                    const lpContract = await trongetContract(tokenAddress)
                    const balance = await lpContract.balanceOf(window.tronWeb.defaultAddress.base58).call()
                    setBalance(new BigNumber(balance))
                }else if(type == 2){
                    //lp
                    var local_address = window.tronWeb.defaultAddress.base58
                    var trc20_address = tokenAddress
                    var parameter = [{type:'address',value:local_address}]
                    var t = window.tronWeb
                    // @ts-ignore
                    t.transactionBuilder.triggerConstantContract(t.address.toHex(trc20_address), "balanceOf(address)", {},parameter,t.address.toHex(local_address)).then(function(a){
                        var result = a.constant_result
                        var balance =  t.toDecimal('0x'+ result)
                        //balance = balance / Math.pow(10,decimals)
                        setBalance(new BigNumber(balance))
                    });
                }else{
                    //trx
                    var local_address = window.tronWeb.defaultAddress.base58
                    window.tronWeb.trx.getBalance(local_address).then(function (a) {
                        console.info('TRX余额为===>' + a);
                        setBalance(new BigNumber(a))
                    });
                }
            }
        }catch (e) {

        }
    }, [tokenAddress])

    useInterval(fetchBalance)
    return balance
}

