import React, { useState, useEffect } from "react";
import { Progress, Modal, message, Input, Statistic } from "antd";
import "antd/dist/antd.css";
import "../../view/style/ido.less";
import "../../view/style/common.less";
import "../../view/style/hover.less";

import { trongetContract } from "../../utils/trc20";
import { ido, USDT } from "../../constants/tokenAddresses";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
const { Countdown } = Statistic;
function IDO() {
  const [maxToken, setMaxTokenCount] = useState(0);
  const [hasTokenCount, setHasTokenCount] = useState(0);
  const [price, setPrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [calcTokenToUsdt, setCalcTokenToUsdt] = useState(0);
  const [receiveShow, setReceiveShow] = useState(false);
  const [active, setActive] = useState(1);
  const [mix, setMix] = useState(0);
  const [actual, setActual] = useState(0);
  const [max, setMax] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [allowance, setAllowance] = useState(0);
  const [consumed, setConsumed] = useState(0);
  // 倒计时是否结束
  const [isCountDown, setIsCountDown] = useState(false);

  // sssssichen 2021-10-11 15:06
  // 屏幕宽度 false pc / true 移动端
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    let offsetW = document.body.clientWidth;
    console.log("offsetW", offsetW);
    if (offsetW <= 980) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);
  // 输入框值
  const [inputNum, setInputNum] = useState(0);

  // 输入值
  const numChange = async ({ target: { value } }) => {
    setInputNum(value);
    //输入数量转为usdt币数量
    const lpContract = await trongetContract(ido);
    let num = new BigNumber(value).times(1e18).toFixed(0);
    const calcTokenToUsdt = await lpContract.calcTokenToUsdt(num).call();
    let usdtNum = new BigNumber(calcTokenToUsdt._hex).toFixed(0);
    console.log("usdt数量", usdtNum);
    setConsumed(
      new BigNumber(usdtNum).div(new BigNumber(10).pow(18)).toFixed(4)
    );
  };
  // 点击buy
  const buyClick = () => {
    setReceiveShow(true);
    console.log("点击buy的时候输入框的值：", inputNum);
  };

  const sss = async () => {
    //最大数量

    if (window.tronWeb) {
      const lpContract = await trongetContract(ido);
      if (lpContract) {
        const maxTokenCount = await lpContract.maxTokenCount().call();
        setMaxTokenCount(
          new BigNumber(maxTokenCount._hex)
            .div(new BigNumber(10).pow(18))
            .toFixed(0)
        );
        //价格
        const price = await lpContract.price().call();
        setPrice(
          new BigNumber(price._hex).div(new BigNumber(10).pow(18)).toFixed(0)
        );
        //进度
        const hasTokenCount = await lpContract.hasTokenCount().call();
        setHasTokenCount(
          new BigNumber(hasTokenCount._hex)
            .div(new BigNumber(10).pow(18))
            .toFixed(4)
        );
        //单价
        const calcTokenToUsdt = await lpContract
          .calcTokenToUsdt(new BigNumber(1).times(1e18).toFixed(0))
          .call();
        setCalcTokenToUsdt(
          new BigNumber(calcTokenToUsdt._hex)
            .div(new BigNumber(10).pow(18))
            .toFixed(0)
        );
        //最小值
        const minAmount = await lpContract.minAmount().call();
        setMix(
          new BigNumber(minAmount._hex)
            .div(new BigNumber(10).pow(18))
            .toFixed(0)
        );
        //最大值
        const maxAmount = await lpContract.maxAmount().call();
        setMax(
          new BigNumber(maxAmount._hex)
            .div(new BigNumber(10).pow(18))
            .toFixed(4)
        );
        //用户质押数量
        let _plyr = await lpContract
          ._plyr(window.tronWeb.defaultAddress.base58)
          .call();
        let amount = new BigNumber(_plyr.amount._hex).toFixed(0);
        let max = new BigNumber(maxAmount._hex).toFixed(0);
        amount = Number(max) - Number(amount);
        setActual(
          new BigNumber(amount).div(new BigNumber(10).pow(18)).toFixed(4)
        );
        //历史记录
        let getUserOrder = await lpContract
          .getUserOrder(window.tronWeb.defaultAddress.base58)
          .call();
        let data_orders = [];
        getUserOrder[0].map((item, i) => {
          let order_obj = {
            amount: new BigNumber(item._hex)
              .div(new BigNumber(10).pow(18))
              .toFixed(4),
            time: dayjs(
              Number(new BigNumber(getUserOrder[1][i]._hex).toFixed(0)) * 1000
            ).format("YYYY-MM-DD HH:mm"),
          };
          data_orders.unshift(order_obj);
        });
        setTableData(data_orders);
        console.log("购买记录", data_orders);
      }
      //usdt余额
      const usdtContract = await trongetContract(USDT);
      if (usdtContract) {
        const balance = await usdtContract
          .balanceOf(window.tronWeb.defaultAddress.base58)
          .call();

        setBalance(
          new BigNumber(balance._hex).div(new BigNumber(10).pow(18)).toFixed(4)
        );
        let allowance = await usdtContract
          .allowance(window.tronWeb.defaultAddress.base58, ido)
          .call();
        allowance = new BigNumber(allowance._hex)
          .div(new BigNumber(10).pow(18))
          .toFixed(0);
        setAllowance(Number(allowance));
      }
    }
  };
  const pay = async () => {
    let num = inputNum;
    num = new BigNumber(num).times(1e18).toFixed(0);
    const usdtContract = await trongetContract(USDT);
    if (usdtContract) {
      let allowance = await usdtContract
        .allowance(window.tronWeb.defaultAddress.base58, ido)
        .call();
      allowance = new BigNumber(allowance._hex)
        .div(new BigNumber(10).pow(18))
        .toFixed(0);
      console.log("allowance", num, allowance);
      if (Number(allowance) == 0 || Number(allowance) < Number(num)) {
        await usdtContract
          .approve(
            ido,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          )
          .send({ from: window.tronWeb.defaultAddress.base58, gas: 40000 });
      } else {
        if (Number(num) <= 0) {
          return message.warning("Please enter a valid number");
        }
        const lpContract = await trongetContract(ido);
        const hasTokenCount = await lpContract.hasTokenCount().call();
        const maxTokenCount = await lpContract.maxTokenCount().call();
        if (Number(hasTokenCount) >= Number(maxTokenCount)) {
          return message.warning("Pledge ended");
        }
        //最小数量
        const minAmount = await lpContract.minAmount().call();
        let min = new BigNumber(minAmount._hex).toFixed(0);
        if (Number(num) < Number(min)) {
          min = new BigNumber(min).div(new BigNumber(10).pow(18)).toFixed(0);
          return message.warning("Please enter a min < " + min);
        }
        //最大数
        const maxAmount = await lpContract.maxAmount().call();
        let max = new BigNumber(maxAmount._hex).toFixed(0);
        //用户质押数量
        let _plyr = await lpContract
          ._plyr(window.tronWeb.defaultAddress.base58)
          .call();
        let amount = new BigNumber(_plyr.amount._hex).toFixed(0);
        let less = Number(max) - Number(amount);
        if (Number(num) > less) {
          less = new BigNumber(less).div(new BigNumber(10).pow(18)).toFixed(4);
          return message.warning("Please enter a number less than " + less);
        }
        //输入数量转为usdt币数量
        const calcTokenToUsdt = await lpContract.calcTokenToUsdt(num).call();
        let usdtNum = new BigNumber(calcTokenToUsdt._hex).toFixed(0);
        console.log("用户质押数量", amount);
        console.log("usdt质押币数量", usdtNum);
        const Balance = await usdtContract
          .balanceOf(window.tronWeb.defaultAddress.base58)
          .call();
        const usdt = BigNumber(Balance._hex).toFixed(0);
        if (Number(usdt) < Number(usdtNum)) {
          return message.warning("Insufficient balance");
        }
        await lpContract
          .stake(usdtNum)
          .send({ from: window.tronWeb.defaultAddress.base58, gas: 40000 });
        //console.log()
      }
    }
  };
  useEffect(() => {
    sss();
  });
  const onFinishCountDown = () => {
    setIsCountDown(true);
  };
  return (
    <div className={isMobile ? "IDO mobile" : "IDO"}>
      <div className="main-box">
        <div className="tab">
          <span
            className={active === 1 ? "active pointer" : "pointer"}
            onClick={() => setActive(1)}
          >
            purchase
          </span>
          <span
            className={active === 2 ? "active pointer" : "pointer"}
            onClick={() => setActive(2)}
          >
            Your
          </span>
        </div>
        {active === 1 ? (
          //   purchase
          <div className="card purchase">
            <p className="investment">Investment</p>
            <div>
              <Progress
                percent={((hasTokenCount / maxToken) * 100).toFixed(2)}
                strokeWidth={10}
                strokeColor="#FCAC1B"
              />
            </div>
            <p className="price">
              Total amount: {maxToken} NFA
              <br />
              <div className="price-bal">
                <span>Price: {price} USDT/NFA</span>
                <span>wallet balance:{balance} USDT</span>
              </div>
            </p>
            {/* <div className="btn btn1">
              {Number(actual) < Number(mix) || Number(actual) === 0
                ? "You have no remaining available credit"
                : "more than " + mix + " and less than " + actual}
            </div> */}
            <div>
              <Input
                className="btn btn1"
                value={inputNum}
                onChange={numChange}
                placeholder={
                  Number(actual) < Number(mix) || Number(actual) === 0
                    ? "You have no remaining available credit"
                    : "more than " + mix + " and less than " + actual
                }
              />
            </div>
            <p>USDT consumed：{consumed}</p>
            {isCountDown ? (
              allowance === 0 ? (
                <div
                  className="btn buy pointer hvr-float"
                  onClick={() => pay()}
                >
                  Approve
                </div>
              ) : (
                <div className="btn buy pointer hvr-float" onClick={buyClick}>
                  Buy
                </div>
              )
            ) : (
              <div className="count_down_box">
                <span className="start_the">Start the countdown: </span>
                <Countdown
                  className="count_down"
                  value={1634698800000}
                  format="H : m : s"
                  onFinish={onFinishCountDown}
                />
              </div>
            )}
            {}
          </div>
        ) : (
          //   your
          <div className="your">
            <div className="card top">
              <p className="title">Your IDO Amount(NFA)</p>
              <div className="main">
                <div className="box">
                  <p className="num">{actual}</p>
                  <p className="desc">Available amount</p>
                </div>
                <div className="box">
                  <p className="num">{max}</p>
                  <p className="desc">Total amount</p>
                </div>
                <div className="box">
                  <p className="num">{(max - actual).toFixed(4)}</p>
                  <p className="desc">Used amount</p>
                </div>
              </div>
            </div>
            <p className="history">history</p>
            <div className="card bottom">
              <div className="">
                <div className="flex num">
                  <div className="left">Date</div>
                  <div className="right">Amount</div>
                </div>
                <ul className="desc">
                  {tableData.map((item, i) => {
                    return (
                      <li className="flex">
                        <div className="left">{item.time}</div>
                        <div className="right">{item.amount} NFA</div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 弹窗 */}

      {/* you will receive */}
      <Modal
        visible={receiveShow}
        footer={null}
        className={
          isMobile
            ? "modal receive mobile-receive mobile-modal"
            : "modal receive"
        }
        closable={false}
        width="40vw"
        maskClosable={true}
        onCancel={() => setReceiveShow(false)}
      >
        <p className="align-center title">You Will Receive</p>
        <p className="align-center amount">{inputNum} NFA</p>
        <p className="flex-between mobile-p">
          <span>USDT</span>
          <span>{inputNum * calcTokenToUsdt}</span>
        </p>
        <p className="flex-between">
          <span>Price</span>
          <span>1NFA={calcTokenToUsdt} USDT</span>
        </p>
        {window.tronWeb ? (
          <div className="btn" onClick={() => pay()}>
            Stake
          </div>
        ) : (
          <div className="btn">Please sign your name in the wallet</div>
        )}
      </Modal>
    </div>
  );
}

export default IDO;
