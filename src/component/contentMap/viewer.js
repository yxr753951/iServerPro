import React from 'react';
import "../css/index.css"
import Map from 'ol/Map';
import { Tile } from "ol/layer"
import View from "ol/View";
import "ol/ol.css";
import "@supermap/iclient-ol/dist/iclient-openlayers.css";
import { Logo, TileSuperMapRest } from '@supermap/iclient-ol';

export default class viewer extends React.Component {
  constructor(props) {
    super(props);
    const id = props.url
    this.state = {
      view: null,
      id: id
    }
  }

  componentDidMount() {
    let map = new Map({
      target: this.props.url,
      view: new View({
        center: [this.props.center.center.x, this.props.center.center.y],
        extent: [this.props.center.bounds.left, this.props.center.bounds.bottom, this.props.center.bounds.right, this.props.center.bounds.top],
        zoom: 2,
      })
    });
    let layer = new Tile({
      source: new TileSuperMapRest({
        url: this.props.url,
        extent: [this.props.center.bounds.left, this.props.center.bounds.bottom, this.props.center.bounds.right, this.props.center.bounds.top],
      }),
    });
    map.addLayer(layer);
    this.setState({
      view: map
    })
  }

  componentWillReceiveProps(nextProps) {
    //   let html = document.getElementById(this.state.id).innerHTML='';
    //   this.setState({
    //     id:nextProps.url
    //   })
    //   let map = new Map({
    //     target: nextProps.url,
    //     view: new View({
    //         center: [113, 23],
    //         extent:[nextProps.center.bounds.left,nextProps.center.bounds.bottom,nextProps.center.bounds.right,nextProps.center.bounds.top],
    //         zoom: 7,
    //     })
    // });
    // let layer = new Tile({
    //     source: new TileSuperMapRest({
    //         url: nextProps.url,
    //         extent:[nextProps.center.bounds.left,nextProps.center.bounds.bottom,nextProps.center.bounds.right,nextProps.center.bounds.top],
    //     }),
    // });
    // map.addLayer(layer);
    // this.setState({
    //   view:[...map],
    // })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { url, center } = nextProps;
    if (prevState.view) {
      const layers=prevState.view.getLayers().array_
      layers.forEach(layer => {
        prevState.view.removeLayer(layer);
      });
      let layer = new Tile({
        source: new TileSuperMapRest({
          url: url,
          extent: [center.bounds.left, center.bounds.bottom, center.bounds.right, center.bounds.top],
        }),
      });
        let view = new View({
            center: [center.center.x, center.center.y],
            extent:[center.bounds.left,center.bounds.bottom,center.bounds.right,center.bounds.top],
            zoom: 2,
        })
        prevState.view.setView(view)
      prevState.view.addLayer(layer);
      return {
        view: prevState.view
      };
    }
    return null;
  }



  render() {
    const id = this.state.id
    return (
      <div>
        <div id={id}>
        </div>
      </div>
    )
  }
}