import React from 'react';
import "../css/index.css"
import ReactJson from 'react-json-view'
export default class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        jsonData:[]
    }
  }
  render() {
    return (
        <div  className="JsonContent">
          <ReactJson name="节点数据" src={this.props.jsonData}></ReactJson>
        </div>
    )
  }
}