import React from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import Demo from "./tree/tree"
import "./css/index.css"
import TabMenu from "./tab/Tab"
import axios from "axios"
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';
import { debug } from 'webpack';
const { ipcRenderer } = require('electron')
const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treedata: [],
      title:null,
      type:null,
      url:null
    }

  }

  componentDidMount() {
    ipcRenderer.send('db-process', 'select * from iserverinfo');
    ipcRenderer.on('return-iserver-info', (event, arg) => {
      console.log(arg);
      let captureValue = arg.url.lastIndexOf('/');  // 截取'/'出现的最后一次位置索引
      let parentLevelId = arg.url.substr(0, captureValue);
      captureValue = parentLevelId.lastIndexOf('/') + 1;
      parentLevelId = parentLevelId.substr(captureValue);
      const index = this.state.treedata.length;
      axios.get(arg.url + "/services.rjson").then(data => {
        let IserverTree = {
          title: parentLevelId,
          key: index,
          url:null,
          children: [
            {
              title: '二维服务',
              key: index + "-0",
              url:null,
              children: [],
            },
            {
              title: '三维服务',
              key: index + "-1",
              url:null,
              children: [],
            },
          ],
        }
        data.data.forEach((server, i) => {
          let position = server["name"].indexOf('-');
          if (position != -1) {
            let text = server["name"].substr(0, position);
            if (text == "map") {
              let data = {
                title: server["name"],
                key: index + "-0-" + i,
                url: server["url"],
                type:text
              }
              IserverTree.children[0].children.push(data)
            } else if (text == "3D") {
              let data = {
                title: server["name"],
                key: index + "-1-" + i,
                url: server["url"],
                type:text
              }
              IserverTree.children[1].children.push(data);
            }
          }
        });
        this.state.treedata.push(IserverTree);
        this.setState({
          treedata: [...this.state.treedata]
        })
      });
      
    })
    ipcRenderer.on('iserver-info', (event, arg) => {
      let listdata = []
      //http://supermapiportal:8190/iportal/web/services.rjson
      arg.forEach((title, index) => {
        let captureValue = title.url.lastIndexOf('/');  // 截取'/'出现的最后一次位置索引
        let parentLevelId = title.url.substr(0, captureValue);
        captureValue = parentLevelId.lastIndexOf('/') + 1;
        parentLevelId = parentLevelId.substr(captureValue);
          
        axios.get(title.url + "/services.rjson").then(data => {
          let tree = {
            title: parentLevelId,
            key: index,
            theme:"server",
            url:title.url,
            children: [
              {
                title: '二维服务',
                key: index + "-0",
                url:null,
                children: [],
              },
              {
                title: '三维服务',
                key: index + "-1",
                url:null,
                children: [],
              },
            ],
          }
          data.data.forEach((server, i) => {
            let position = server["name"].indexOf('-');
            if (position != -1) {
              let text = server["name"].substr(0, position);
              if (text == "map") {
                let data = {
                  title: server["name"],
                  key: index + "-0-" + i,
                  url: server["url"],
                  type:text
                }
                tree.children[0].children.push(data)
              } else if (text == "3D") {
                let data = {
                  title: server["name"],
                  key: index + "-1-" + i,
                  url: server["url"],
                  type:text
                }
                tree.children[1].children.push(data);
              }
            }
          });
          listdata.push(tree);
          this.setState({
            treedata: [...listdata]
          })
        });
        
      });
    })
  }

  transmitURL=(iserverURL,Tabtitle,type)=>{
    this.setState({
      url:iserverURL,
      title:Tabtitle,
      type:type
    })
  }

  changeTree=(tree)=>{
    this.setState({
      treedata:[...tree]
    })
  }

  render() {
    return (
      <>
        <Layout style={{ height: '100%', overflow: 'hidden' }}>
          <Sider
            breakpoint="lg"
            style={{ minWidth: "400px"}}
            collapsedWidth="0"
            onBreakpoint={broken => {
            }}
            onCollapse={(collapsed, type) => {
            }}
          >
            <Demo treedata={this.state.treedata} changeTree={this.changeTree} transmitURL={this.transmitURL}/>
          </Sider>
          <Layout>
            {/* <Header className="site-layout-sub-header-background" style={{ padding: 0 }} /> */}
            <Content style={{ margin: '24px 16px 0' }}>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360, height: 'calc(100% - 24px)' }}>
                <TabMenu tabtitle={this.state.title} tabType={this.state.type} url={this.state.url}/>
              </div>
            </Content>
          </Layout>
        </Layout>
      </>
    )
  }
}

export default App;
