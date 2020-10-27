import React from 'react';
import "./css/index.css"
import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import Viewer from "./content3D/viewer"
import Content from "./content3D/content"
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
export default class Tab3D extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      infoState: null,
      node:null,
      url: null,
      type:null,
      jsonData: [],
      copied: false,
      treedata: [
        {
          title: "scenes",
          key: '0',
          type: "scene",
          url: this.props.url,
          children: [
          ],
        },
        {
          title: "datas",
          key: '1',
          type: "content",
          content: [],
          children: [
          ],
        },
      ]
    }
  }


  componentDidMount() {
    //scenes
    axios.get(this.props.url + "/realspace/scenes.rjson").then(data => {
      data.data.forEach((element, i) => {
        axios.get(this.props.url + "/realspace/scenes/" + element.name + ".rjson").then(scenedata => {
          let tree = {
            title: element.name,
            key: "0-" + i,
            type: "content",
            children: [],
            content: [{
              "三维场景的名称": scenedata.data.name,
              "三维场景中雾的可见高度": scenedata.data.fogVisibleAltitude,
              "比例尺是否可见": scenedata.data.scaleLegendVisible,
              "场景相机的最大距离": scenedata.data.maxCameraDistance,
              "场景相机的最小距离": scenedata.data.minCameraDistance,
              "地形夸大的比例": scenedata.data.terrainExaggeration
            }]
          }
          scenedata.data.layers.forEach((layerInfoData, index) => {
            let layersTree = {
              title: layerInfoData.name,
              key: "0-" + i + "-" + index,
              type: "content",
              content: [{
                "图层名称": layerInfoData.name,
                "图层类型": layerInfoData.layer3DType,
                "图层标题": layerInfoData.caption,
                "最大可见高度": layerInfoData.maxVisibleAltitude,
                "最小可见高度": layerInfoData.minVisibleAltitude,
                "三维图层中对象的可见距离": layerInfoData.visibleDistance,
                "图层是否始终渲染": layerInfoData.alwaysRender,
                "图层中的对象是否可以查询": layerInfoData.queryable,
                "三维切片缓存是否保存在本地": layerInfoData.hasLocalCache,
                "图层是否可被编辑": layerInfoData.editable,
                "三维图层所使用的数据的路径": layerInfoData.dataConfigPath,
                "图层的描述信息": layerInfoData.description
              }],
              children: [],
            }
            tree.children.push(layersTree);
          });

          this.state.treedata[0].children.push(tree);
          this.setState({
            treedata: [...this.state.treedata]
          })
        })
      });
    });


    //datas
    let datasTreeContent = [];
    axios.get(this.props.url + "/realspace/datas.rjson").then(data => {
      data.data.forEach((datas, index) => {
        axios.get(datas.path + ".rjson").then(dataData => {
          let datasTree = {
            "资源的名称": datas.name,
            "资源的访问路径": datas.path,
            "三维数据集": dataData.data.dataName,
            "三维数据的类型": dataData.data.dataType
          }
          datasTreeContent.push(datasTree)
          axios.get(datas.path + "/config").then(dataConfig => {
            let datatree = {
              title: datas.name,
              key: "1-" + index,
              type: "content",
              content: dataConfig.data
            }
            this.state.treedata[1].children.push(datatree);
            this.setState({
              treedata: [...this.state.treedata]
            })
          });
        });
        this.state.treedata[1].content = datasTreeContent
        this.setState({
          treedata: [...this.state.treedata]
        })
      })
    })
  }

  onSelect = (selectedKeys, info) => {
    if (info.node.type == "scene") {
      this.setState({
        infoState: "viewer",
        url: info.node.url
      })
    }
    if (info.node.type == "content") {
      this.setState({
        jsonData: info.node.content
      })
    }
  }

  onRightClick = ({event, node}) => {
    console.log(node)
    this.setState({
      node: node,
      type:node.type
    })
  }

  onClick = ()=>{
   this.setState({copied: true})
  }

  render() {
    return (
      <div className="data">
        <div className="leftDiv">
          <MenuProvider id={this.state.treedata[0].url} className="menuTree" style={{ display: 'inline-block' }}>
            <Tree className="sceneTree"
              switcherIcon={<DownOutlined />}
              onSelect={this.onSelect}
              onRightClick={this.onRightClick}
              treeData={this.state.treedata}></Tree>
          </MenuProvider>
          <Menu id={this.state.treedata[0].url} >
            {this.state.type == 'scene' ? (<Item onClick={this.onClick}><CopyToClipboard text={this.state.node.url}><span>复制路径</span></CopyToClipboard></Item>) :(<Item disabled>复制路径</Item>)}
          </Menu>
          <Content className="JsonContent" jsonData={this.state.jsonData}></Content>
        </div>
        <div className="rightDiv">
          {this.state.infoState == "viewer" ? (<Viewer url={this.state.url}></Viewer>) : (null)}
        </div>
      </div>
    )
  }
}