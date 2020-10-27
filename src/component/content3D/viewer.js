import React from 'react';
import "../css/index.css"
export default class viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: null
    }
  }

  componentDidMount() {
    let viewer = new Cesium.Viewer(this.props.url);
    let scene = viewer.scene;
    let widget = viewer.cesiumWidget;
    scene.globe.enableLighting = true;
    let credit = viewer.scene.frameState.creditDisplay;
    credit.container.remove(credit._imageContainer);
    try {
      let promises = [];
      let _promise = scene.open(this.props.url + "/realspace");
      promises.push(_promise);
      Cesium.when.all(
        promises,
        function (layers) {
        },
        function (e) {
          var title = "加载SCP失败，请检查网络连接状态或者url地址是否正确？";
          widget.showErrorPanel(title, undefined, e);
        }
      );
    } catch (e) {
      if (widget._showRenderLoopErrors) {
        var title = "渲染时发生错误，已停止渲染。";
        widget.showErrorPanel(title, undefined, e);
      }
    }
    this.setState({
      view: viewer
    })
  }

  componentWillReceiveProps(nextProps) {
    let viewer = new Cesium.Viewer(nextProps.url);
    let scene = viewer.scene;
    let widget = viewer.cesiumWidget;
    scene.globe.enableLighting = true;
    let credit = viewer.scene.frameState.creditDisplay;
    credit.container.remove(credit._imageContainer);
    try {
      let promises = [];
      let _promise = scene.open(nextProps.url + "/realspace");
      promises.push(_promise);
      Cesium.when.all(
        promises,
        function (layers) {
        },
        function (e) {
          var title = "加载SCP失败，请检查网络连接状态或者url地址是否正确？";
          widget.showErrorPanel(title, undefined, e);
        }
      );
    } catch (e) {
      if (widget._showRenderLoopErrors) {
        var title = "渲染时发生错误，已停止渲染。";
        widget.showErrorPanel(title, undefined, e);
      }
    }
    this.setState({
      view: viewer
    })
  }


  render() {
    return (
      <div>
        <div id={this.props.url}>
        </div>
      </div>
    )
  }
}