import React from 'react';
import "./css/index.css"
import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import Viewer from "./contentMap/viewer"
import Content from "./contentMap/content"
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
export default class TabMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infoState: null,
      url: null,
      center: null,
      node:null,
      type:null,
      jsonData: [],
      copied:false,
      treedata: [
        {
          title: "maps",
          key: '0',
          type: "content",
          content: [],
          children: [
          ],
        }
      ]
    }
  }


  componentDidMount() {
    let datasTreeContent = [];
    axios.get(this.props.url + "/maps.rjson").then(data => {
      data.data.forEach((maps, index) => {
        let datasTree = {
          "地图名称": maps.name,
          "地图资源的访问路径": maps.path,
        }
        datasTreeContent.push(datasTree)
        axios.get(maps.path + ".rjson").then(mapData => {
          let tree = {
            title: maps.name,
            key: "0-" + index,
            type: "contentandscene",
            children: [],
            url: maps.path,
            center: mapData.data,
            content: [{
              "中心点": mapData.data.center,
              "比例尺": mapData.data.scale,
              "全幅范围": mapData.data.bounds,
              "坐标系信息": mapData.data.prjCoordSys.name,
              "目标坐标系": "EPSG:" + mapData.data.prjCoordSys.epsgCode,
            }]
          };
          this.state.treedata[0].children.push(tree);
          this.setState({
            treedata: [...this.state.treedata],
          })
        })
      });
      this.state.treedata[0].content = datasTreeContent
      this.setState({
        treedata: [...this.state.treedata]
      })
    })
  }

  onSelect = (selectedKeys, info) => {
    if (info.node.type == "content") {
      this.setState({
        jsonData: info.node.content
      })
    }
    if (info.node.type == "contentandscene") {
      console.log(info.node.content)
      this.setState({
        infoState: "viewer",
        url: info.node.url,
        jsonData: info.node.content,
        center: info.node.center
      })
    }
  }

  onRightClick = ({event, node}) => {
    this.setState({
      node: node,
      type:node.type
    })
  }

  onClick=()=>{
    this.setState({copied: true})
  }

  render() {
    return (
      <div className="data">
        <div className="leftDiv">
          <MenuProvider id={this.props.url} className="menuTree" style={{ display: 'inline-block' }}>
            <Tree className="sceneTree"
              switcherIcon={<DownOutlined />}
              onSelect={this.onSelect}
              onRightClick={this.onRightClick}
              treeData={this.state.treedata}></Tree>
          </MenuProvider>
          <Menu id={this.props.url} >
            {this.state.type == 'contentandscene'  ? (<Item onClick={this.onClick}><CopyToClipboard text={this.state.node.url}><span>复制路径</span></CopyToClipboard></Item>) :(<Item disabled>复制路径</Item>)}
          </Menu>
          <Content className="JsonContent" jsonData={this.state.jsonData}></Content>
        </div>
        <div className="rightDiv">
          {this.state.infoState == "viewer" ? (<Viewer url={this.state.url} center={this.state.center}></Viewer>) : (null)}
        </div>
      </div>
    )
  }
}