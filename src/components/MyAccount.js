import React from "react";

class MyAccount extends React.Component {
  constructor(props) {
    super(props); //固定写法
    this.state = {};
  }
  componentDidMount() {
    setTimeout(() => {
      console.log(11111111);
      this.setState(123);
    }, 3000);
  }
  render() {
    return <div className="my-account">喵喵喵</div>;
  }
}

export default MyAccount;
