import React from 'react';
import "./css/index.css"
import { Input,Row, Col ,Button,Modal  } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import axios from "axios"
const { ipcRenderer } = require('electron')
export default class Initial extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        showElem:'none',
    }
  }
  render() {
    return (
        <div>
      <div className="main">
          <div onClick={this.changeModal} className="addServer">
            <PlusCircleOutlined className="addIcon"/>
            <span className='main-font'>添加新的iserver服务</span>
          </div>
      </div>
      <div style={{display:this.state.showElem}} className="modal">
          <div className="modal-content">
            <div className="addIserverTitle"></div>
              <Row className="rowMargin"><Col span={8}><span style={{float:"right"}}>iserver服务地址：</span></Col><Col  span={14}><Input ref="address"  type="text" placeholder="iserver服务地址" /></Col></Row>
              <Row className="rowMargin"><Col span={8}><span style={{float:"right"}}>用户名：</span></Col><Col  span={14}><Input  ref="user"  type="text" placeholder="用户名" /></Col></Row>
              <Row className="rowMargin"><Col span={8}><span style={{float:"right"}}>密码：</span></Col><Col  span={14}><Input  ref="password"  type="password" placeholder="密码" /></Col></Row>
              <Row className="rowMargin"><Col offset={6} span={6}><Button onClick={this.addIserver} type="primary">添加</Button></Col><Col  span={6}><Button onClick={this.close} style={{float:"right"}} type="primary">退出</Button></Col></Row>
          </div>
      </div>
      </div>
    )
  }

  close=()=>{
    this.setState({
      showElem:"none"
    })
  }



  changeModal=()=>{
    this.setState({
        showElem:'block'
    })
  }

  errorInfo=()=> {
    Modal.error({
      title: '输入的信息有误！！！',
      // content: 'some messages...some messages...',
    });
  }

  addIserver=()=>{
    let param={
      username:this.refs.user.state.value,
      password:this.refs.password.state.value,
      rememberme:false
    }
    axios.post(this.refs.address.state.value+"/services/security/login.rjson",param
      ).then(data => {
        console.log(data)
        if(data.data.succeed){
          alert("添加成功");
        const TransmitData = {
          url:this.refs.address.state.value,
          user:this.refs.user.state.value,
          password:this.refs.password.state.value
        }
        ipcRenderer.send('addiserverInfo',TransmitData);
        this.setState({
          showElem:"none"
        })
        this.refs.address.state.value=''
        this.refs.user.state.value=''
        this.refs.password.state.value=''
        }else{
          this.errorInfo();
        }
    }).catch( (error)=> {
      this.errorInfo();
    });
  }
}