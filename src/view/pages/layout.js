import React, { useState, useEffect, useCallback, useRef } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Modal, message, Drawer } from "antd";

import logo from "../../assets/logo.png";
import { UnorderedListOutlined } from "@ant-design/icons";
import "../../view/style/common.less";
import "../../view/style/header.less";
import Home from "../../view/pages/home";
import IDO from "../../view/pages/IDO";
import "../../view/style/hover.less";
import BigNumber from "bignumber.js";
import { useWalletAddress } from "../../hooks/useCommon";
import { nfa, play, ido } from "../../constants/tokenAddresses";
import { trongetContract } from "../../utils/trc20";
import { CopyToClipboard } from "react-copy-to-clipboard";
function Layout(props) {
  const address = useWalletAddress();
  const [myAccountShow, setMyaccountShow] = useState(false);
  const [connectShow, setConnectShow] = useState(false);
  const [active, setActive] = useState(1);
  const [balance, setBalance] = useState(0);
  const [code, setCode] = useState(0);
  // 是否显示Confirm binding按钮
  const [isBinding, setIsBinding] = useState(true);
  // 屏幕宽度 false pc / true 移动端
  const [width, setWidth] = useState(false);
  const [count, setCount] = useState(0);
  const [userNumber, setUserNumber] = useState(0);
  const [menu, setMenu] = useState(false);
  const sss = async () => {
    console.log("address", address);
    if (!address) return;
    let str1 = address ? address.substring(0, 4) : "";
    let str = address ? address.substring(address.length - 4) : "";
    let new_str = address ? str1 + "****" + str : "";
    setCode(new_str);

    //获取币数量
    if (window.tronWeb) {
      const nfaContract = await trongetContract(nfa);
      if (nfaContract) {
        const balance = await nfaContract.balanceOf(address).call();
        setBalance(
          new BigNumber(balance._hex).div(new BigNumber(10).pow(18)).toFixed(4)
        );
        //邀请数量
        const palyContract = await trongetContract(play);
        if (palyContract) {
          const nextAddressPlyr = await palyContract._plyr(address).call();
          setCount(new BigNumber(nextAddressPlyr.invitsIndex._hex).toFixed(0));
          console.log(
            "邀请数量",
            new BigNumber(nextAddressPlyr.invitsIndex._hex).toFixed(0)
          );
          nextAddressPlyr.lastUser ==
          "410000000000000000000000000000000000000000"
            ? setIsBinding(true)
            : setIsBinding(false);
        }
        //奖励数量userNumber
        const idoContract = await trongetContract(ido);
        if (idoContract) {
          const userNumber = await idoContract.userNumber(address).call();
          setUserNumber(
            new BigNumber(userNumber._hex)
              .div(new BigNumber(10).pow(18))
              .toFixed(4)
          );
        }
      }
    }
  };
  useEffect(() => {
    let offsetW = document.body.clientWidth;
    if (offsetW <= 980) {
      setWidth(true);
    } else {
      setWidth(false);
    }
    let path = window.location.pathname;
    if (path === "/") {
      setActive(1);
    } else if (path === "/IDO") {
      setActive(2);
    }
  }, []);
  useEffect(() => {
    sss();
  });
  const showMenu = () => {
    setMenu(true);
  };
  const al = () => {
    return message.warning(
      "Please log in to the tronlink plug-in wallet first"
    );
  };
  const onCloseMenu = () => {
    setMenu(false);
  };
  //字符串省略
  const decimal = (src) => {
    return (
      src.substring(0, 14) + "..." + src.substring(src.length - 4, src.length)
    );
  };
  const goLink = (val) => {
    setActive(val);
    window.location.reload();
  };
  // 复制链接
  // const copy = () => {
  //   const copyDOM = document.getElementById("copysrc");
  //   // console.log("copyDOM", copyDOM);
  //   const range = document.createRange();
  //   window.getSelection().removeAllRanges();
  //   range.selectNode(copyDOM);
  //   window.getSelection().addRange(range);
  //   const successful = document.execCommand("copy");
  //   console.log("successful", successful);
  //   if (successful) {
  //     message.success("Copy succeeded！");
  //   }
  //   window.getSelection().removeAllRanges();
  // };

  const confirmBinding = async () => {
    let nextAddress = localStorage.getItem("address");
    if (nextAddress) {
      const palyContract = await trongetContract(play);
      const nextAddressPlyr = await palyContract._plyr(nextAddress).call();
      const userAddress = await palyContract
        ._plyr(window.tronWeb.defaultAddress.base58)
        .call();
      let lastUser = userAddress.lastUser;
      if (nextAddress === window.tronWeb.defaultAddress.base58) {
        return message.warning("You can't invite yourself");
      }
      if (!nextAddress) {
        return message.warning("Invitee does not exist");
      }
      if (lastUser != "410000000000000000000000000000000000000000") {
        return message.warning("Superior already exists");
      }
      if (userAddress.isRegister) {
        return message.warning("The address has been invited");
      }
      if (
        window.tronWeb.address.fromHex(nextAddressPlyr.lastUser) ==
        window.tronWeb.defaultAddress.base58
      ) {
        return message.warning("Invitation cannot be repeated");
      }
      await palyContract
        .register(window.tronWeb.defaultAddress.base58, nextAddress)
        .send({ from: window.tronWeb.defaultAddress.base58, gas: 40000 });

      console.log(
        "操作",
        window.tronWeb.address.fromHex(nextAddressPlyr.lastUser)
      );
    } else {
      message.info("You have not bound the invitation relationship");
    }
  };
  return (
    <div className="app-root">
      <Router className="App">
        {/* 头部 */}
        {width ? (
          <div className="header">
            <div className="header_logo">
              <img src={logo} alt="" />
              <span> Non Fungible ARK</span>
            </div>
            <div className="header_menu" onClick={showMenu}>
              <UnorderedListOutlined />
            </div>
          </div>
        ) : (
          <div className="header">
            <ul className="left">
              <li className="avatar">
                <img src={logo} alt="" />
              </li>
              <li> Non Fungible ARK</li>
              <li
                className={active === 1 ? "active" : ""}
                onClick={() => setActive(1)}
              >
                <Link to="/">Home</Link>
              </li>
              <li
                className={active === 2 ? "active" : ""}
                onClick={() => setActive(2)}
              >
                <Link to="/IDO">IDO</Link>
              </li>
            </ul>
            <div className="right">
              {address ? (
                <div>{address}</div>
              ) : (
                <div onClick={al}>Connect a wallet</div>
              )}

              <div className="setting" onClick={() => setMyaccountShow(true)}>
                <img src={require("../../assets/qsz.png")} alt="" />
              </div>
            </div>
          </div>
        )}
        <Route exact path="/" component={Home} />
        <Route path="/IDO" component={IDO} />
        {width ? (
          <div className="footer">
            {address ? (
              <div>{address}</div>
            ) : (
              <div onClick={al}>Connect a wallet</div>
            )}

            <div className="setting" onClick={() => setMyaccountShow(true)}>
              <img src={require("../../assets/qsz.png")} alt="" />
            </div>
          </div>
        ) : (
          ""
        )}
      </Router>
      {/* 弹窗 */}
      {/* my-account */}
      <Modal
        visible={myAccountShow}
        footer={null}
        className={
          width
            ? "modal my-account mobile-account mobile-modal"
            : "modal my-account"
        }
        closable={false}
        width="40vw"
        maskClosable={true}
        onCancel={() => setMyaccountShow(false)}
      >
        <div className="flex-between top">
          <p className="title title_min">My account ({code})</p>
          <div
            className="icon-close pointer"
            onClick={() => setMyaccountShow(false)}
          >
            <img src={require("../../assets/images/close.png")} alt="" />
          </div>
        </div>
        <p className="flex-between my-nfa">
          <span className="title">My NFA</span>
          <span>{balance}</span>
        </p>
        <p className="invite-link title_min">My invite link</p>
        <p id="copy" className="address_copy">
          <span>{decimal(window.location.host + "?address/" + address)}</span>
          <CopyToClipboard
            text={window.location.host + "?address/" + address}
            onCopy={() => {
              message.success("Copy succeeded！");
            }}
          >
            <img
              className="icon-copy pointer"
              src={require("../../assets/images/icon-copy.png")}
              alt=""
            />
          </CopyToClipboard>
        </p>
        <div className="invitations">
          <div className="invitations-box">
            <div>Number of invitations</div>
            <div className="invitations-num">{count}</div>
          </div>
          <div className="invitations-box">
            <div>NFA obtained</div>
            <div className="invitations-num">{userNumber}</div>
          </div>
        </div>
        <div style={{ display: isBinding ? "block" : "none" }}>
          <div className="confirm_binding_btn">
            <span className="title_min">
              Click the button to complete the binding of the invitation
              relationship
            </span>
            <span className="confirm_binding" onClick={confirmBinding}>
              Confirm binding
            </span>
          </div>
        </div>
      </Modal>

      {/* connect wallet */}
      <Modal
        visible={connectShow}
        footer={null}
        className={
          width ? "modal connect mobile-connect mobile-modal" : "modal connect"
        }
        closable={false}
        width="28vw"
        maskClosable={true}
        onCancel={() => setConnectShow(false)}
      >
        <div className="flex-between top">
          <p className="title">Connect wallet</p>
          <div
            className="icon-close pointer"
            onClick={() => setConnectShow(false)}
          >
            <img src={require("../../assets/images/close.png")} alt="" />
          </div>
        </div>
        <div className="avatar hvr-grow">
          <img src={require("../../assets/images/avatar.png")} alt="" />
        </div>
        <p className="user-name align-center">metamask</p>
      </Modal>

      {/* 移动端菜单 */}
      <Drawer
        placement="right"
        onClose={onCloseMenu}
        visible={menu}
        closable={false}
        className="drawer_menu"
      >
        <Router>
          <ul className="link_menu">
            <li
              className={active === 1 ? "active" : ""}
              onClick={() => goLink(1)}
            >
              <Link to="/">Home</Link>
            </li>
            <li
              className={active === 2 ? "active" : ""}
              onClick={() => goLink(2)}
            >
              <Link to="/IDO">IDO</Link>
            </li>
          </ul>
        </Router>
      </Drawer>
    </div>
  );
}

export default Layout;
