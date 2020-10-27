import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Tabs } from 'antd';
import Initial from "../component/Initial"
import Tab3D from "../component/Tab3D"
import TabMap from "../component/TabMap"

const { TabPane } = Tabs;

const initialPanes = [
  { title: '首页', content: <Initial/>, key: '1' },
];

export default class TabMenu extends React.Component {
  newTabIndex = 0;

  state = {
    activeKey: initialPanes[0].key,
    panes: initialPanes,
  };

  onChange = activeKey => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    const newPanes = [...panes];
    newPanes.push({ title: "首页", content: <Initial/>, key: activeKey,url:null });
    this.setState({
      panes: newPanes,
      activeKey,
    });
  };

  componentWillReceiveProps(nextProps){
    let flag = true;
    this.state.panes.forEach(element => {
      if(element.title==nextProps.tabtitle && element.url==nextProps.url){
        flag = false;
      }
    });
    if(nextProps.tabtitle  && flag){
      this.addIserverTabs(nextProps.url,nextProps.tabtitle,nextProps.tabType);
    }
  }


  addIserverTabs=(url,tabTitle,tabType)=>{
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    const newPanes = [...panes];
    if(tabType=="map"){
      newPanes.push({ title: tabTitle, content: <TabMap url={url}></TabMap>, key: activeKey,url:url  });
    }
    if(tabType=="3D"){
      newPanes.push({ title: tabTitle, content: <Tab3D url={url}></Tab3D>, key: activeKey,url:url  });
    }
    this.setState({
      panes: newPanes,
      activeKey,
    });
  }
  remove = targetKey => {
    const { panes, activeKey } = this.state;
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    this.setState({
      panes: newPanes,
      activeKey: newActiveKey,
    });
  };

  render() {
    const { panes, activeKey } = this.state;
    return (
      <Tabs
        type="editable-card"
        activeKey={activeKey}
        onChange={this.onChange}
        onEdit={this.onEdit}
      >
        {panes.map(pane => (
          <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
            {pane.content}
          </TabPane>
        ))}
      </Tabs>
    );
  }
}
