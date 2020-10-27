import React from 'react';
import "./css/index.css"
import { PlusCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
export default class Initial extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        visible: false,
        confirmLoading: false,
    }
  }
  render() {
    return (
      <div className="main">
           <Modal
          title="添加服务"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>aaaaa</p>
        </Modal>
          <div onClick={this.changeModal} className="addServer">
            <PlusCircleOutlined className="addIcon"/>
            <span className='main-font'>添加新的iserver服务</span>
          </div>
      </div>
    )
  }

  changeModal=()=>{
    this.setState({
        visible:true
    })
  }

  handleOk=()=>{
    this.setState({
        visible: false
    });
  }

  handleCancel=()=>{
    this.setState({
        visible: false,
      });
  }
}