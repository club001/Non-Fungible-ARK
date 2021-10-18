import React from "react";
import "../../view/style/home.less";
import "../../view/style/common.less";
import "../../view/style/hover.less";
import development from "../../assets/images/development.png";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    let params = this.props.location.search.split("/");
    let address = params[params.length - 1];
    localStorage.setItem("address", address);
  }

  componentDidMount() {}

  render() {
    return (
      <div className="home">
        <div className="section1">
          {/* <img src={require("../../assets/images/1.png")} alt="" /> */}
          <div className="content">
            <p className="welcome">Welcome to</p>
            <p className="title">Non Fungible ARK</p>
            <p className="txt">
              Committed to becoming a unique and interesting game Metaverse
              Here, no matter who you are, you can realize your own value
            </p>
            <div className="btns">
              <div className="hvr-grow pointer">
                <a
                  href="https://twitter.com/NonFungibleARK?t=xrvtdWi3NSd3NZX0PyZevw&s=09"
                  target="_blank"
                >
                  Twitter
                </a>
              </div>
              <div className="hvr-grow pointer">
                <a
                  href="https://t.me/joinchat/Rgf0m6QqCf1iZDI9"
                  target="_blank"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient">
          <div className="bg-img">
            {/* section2 */}
            <div className="section2">
              <p className="sec-title">Our Metaverse</p>
              <div className="card-box">
                <div className="card hvr-bounce-in">
                  <div className="icon">
                    <img
                      src={require("../../assets/images/card-1.png")}
                      alt=""
                    />
                  </div>
                  <p className="card-title">Play</p>
                  <p className="card-desc">
                    We will continue to launch new games, continue to empower
                    the ecology, and let "play" run through the Metaverse
                  </p>
                </div>
                <div className="card hvr-bounce-in">
                  <div className="icon">
                    <img
                      src={require("../../assets/images/card-2.png")}
                      alt=""
                    />
                  </div>
                  <p className="card-title">Earn</p>
                  <p className="card-desc">
                    While you participate in the development of our Metaverse,
                    you can earn corresponding benefits. We will continue to
                    improve the incentive measures to ensure that participating
                    users can earn corresponding benefits as much as possible
                  </p>
                </div>
                <div className="card hvr-bounce-in">
                  <div className="icon">
                    <img
                      src={require("../../assets/images/card-3.png")}
                      alt=""
                    />
                  </div>
                  <p className="card-title">Labs</p>
                  <p className="card-desc">
                    We want to incorporate more games, become a well-equipped
                    incubator, and enrich the form of play
                  </p>
                </div>
              </div>
            </div>

            {/* section3 */}
            <div className="section3">
              <p className="sec-title">Our token-NFA</p>
              <div className="card">
                <div className="top">
                  <div className="left">Total:100,000</div>
                  <div className="right">NFA Uniquemechanism</div>
                </div>
                <div className="main">
                  <div className="left">
                    <img src={require("../../assets/images/pie.png")} alt="" />
                  </div>
                  <div className="right">
                    <div className="flex hvr-float">
                      <div className="icon hvr-grow">
                        <img
                          src={require("../../assets/images/card2-1.png")}
                          alt=""
                        />
                      </div>
                      <p className="">
                        We have adopted a unique destruction mechanism and will
                        never be able to issue additional tokens to guarantee
                        the value of NFA tokens. The total amount of tokens will
                        eventually be maintained to 10,000 coins.
                      </p>
                    </div>
                    <div className="flex hvr-float">
                      <div className="icon hvr-grow">
                        <img
                          src={require("../../assets/images/card2-2.png")}
                          alt=""
                        />
                      </div>
                      <p>
                        We have given NFA tokens many functions, such as
                        liquidity mining, minting NFT, participating in
                        community governance, holding currency dividends...
                      </p>
                    </div>
                    <div className="flex hvr-float">
                      <div className="icon hvr-grow">
                        <img
                          src={require("../../assets/images/card2-3.png")}
                          alt=""
                        />
                      </div>
                      <p>
                        The unique token mechanism, multiple token exchange
                        functions and ecological landing will make tokens more
                        and more valuable.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* section4 */}
            <div className="section4 card-box">
              <div className="card hvr-bob">
                <div className="icon">
                  <img
                    src={require("../../assets/images/card3-1.png")}
                    alt=""
                  />
                </div>
                <p>3% burn per transaction combustion mechanism.</p>
              </div>
              <div className="card hvr-bob">
                <div className="icon">
                  <img
                    src={require("../../assets/images/card3-2.png")}
                    alt=""
                  />
                </div>
                <p>
                  3% dividend for transaction <br />
                  Dividend mechanism
                </p>
              </div>
              <div className="card hvr-bob">
                <div className="icon">
                  <img
                    src={require("../../assets/images/card3-3.png")}
                    alt=""
                  />
                </div>
                <p>
                  Special mechanism,Prices will inevitably continue to rise
                  <br />
                  Price bottom line
                </p>
              </div>
            </div>

            <div className="section5">
              <p className="sec-title">Development Path</p>
              <div className="section_img">
                <img src={development} alt="" />
              </div>
            </div>

            {/* bottom */}
            <p className="sec-title bottom hvr-float">Non Fungible ARK</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
