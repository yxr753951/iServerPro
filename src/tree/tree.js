import React from 'react';
import { Tree } from 'antd';
import "./tree.css"
import 'antd/dist/antd.css';
import { DownOutlined } from '@ant-design/icons';
import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
const { ipcRenderer } = require('electron')

export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      node: {theme:null},
    }
  }
  render() {
    return (
      <div className="tree">
        <MenuProvider id="menu_id" className="menuTree" style={{display: 'inline-block' }}>
          <Tree
            switcherIcon={<DownOutlined />}
            onSelect={this.onSelect}
            treeData={this.props.treedata}
            onRightClick={this.onRightClick}
          />
        </MenuProvider>
        <Menu id='menu_id'>
          {this.state.node.theme ? (<Item onClick={this.onClick}>删除</Item>) : (<Item disabled>删除</Item>)}
        </Menu>
      </div>
    )
  }
  onClick = () => {
    this.props.treedata.forEach((tree,index) => {
      if(tree.key == this.state.node.key){
        this.props.treedata.splice(index,1);
        this.props.changeTree(this.props.treedata);
        ipcRenderer.send('db-delete', this.state.node.url);
      }
    });
    this.setState({
      menuState:"none"
    })
  }

  onSelect = (selectedKeys, info) => {
    if (info.node.url) {
      this.props.transmitURL(info.node.url, info.node.title, info.node.type);
    }
  }

  onRightClick = ({event, node}) => {
    console.log(node)
    this.setState({
      node: node,
    })
  }
}