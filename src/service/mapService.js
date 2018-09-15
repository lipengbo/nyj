import $ from 'jquery'
import config from '../lib/config'

var urlTemplate = config.tileUrl+'arcgis/rest/services/gd/MapServer/tile/{z}/{y}/{x}';

class OverlayCollection {
  constructor(opt) {
    var _self=this;
    this.overlays = [];
    this.map = opt.map;
    this.renderFunc =opt.render||function (data) {
      return "";
    };
    this.clickCall=opt.click;
    var overlaycontainer = this.map.getViewport().getElementsByClassName('ol-overlaycontainer-stopevent')[0];
    $(overlaycontainer).on("click",".ol-popup",function(e){
      var id=this.getAttribute("data-id");
      _self.clickCall&&_self.clickCall(_self.getById(id));
    })
  }

  add(data) {
    var elm = document.createElement("div");
    elm.id = 'popup' + data.id;
    elm.setAttribute("data-id", data.id);
    elm.className = 'ol-popup';
    elm.innerHTML = this.renderFunc(data);
    var anchor = new ol.Overlay({
      id:data.id,
      element: elm
    });
    anchor.set("id",data.id);
    anchor.set("clients",data);
    //var pt = new ol.geom.Point([e.x, e.y]);
    //pt = pt.transform('EPSG:4326', 'EPSG:3857');
    anchor.setPosition([data.x, data.y]);
    // 然后添加到map上
    this.map.addOverlay(anchor);
    this.overlays.push(anchor);
  }
  getById(id){
    for(var i=0;i<this.overlays.length;i++){
      if(this.overlays[i].get("id")==id){
        return this.overlays[i];
      }
    }
  }
  getIndexById(id){
    for(var i=0;i<this.overlays.length;i++){
      if(this.overlays[i].get("id")==id){
        return i;
      }
    }
  }
  getArray(){
    return this.overlays;
  }
  removeAll(){
    for(var i=0;i<this.overlays.length;i++){
      this.map.removeOverlay(this.overlays[i]);
    }
  }
}
export default {
  createMap(opt) {
    opt = opt || {};
    var tilegrid = new ol.tilegrid.TileGrid({
      resolutions: [0.011897305029151397,0.010707574526236257, 0.0071383830174908385, 0.0035691915087454193, 0.0017845957543727096, 7.138383017490838E-4],
      origin: [-400.0, 400],
      extent: [105.309, 18.697, 122.822, 27.336]
    });
    var tilelayer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        tileGrid: tilegrid,
        maxZoom: 5,
        projection: ol.proj.get('EPSG:4326'),
        tileSize: 256,
        url: urlTemplate,
        wrapX: true
      })
    });
    return new ol.Map({
      target: opt.target || "map",
      layers: [
/*         new ol.layer.Tile({
          title: "天地图路网",
          source: new ol.source.XYZ({
            url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"
          })
        }),
        new ol.layer.Tile({
          title: "天地图文字标注",
          source: new ol.source.XYZ({
            url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
          })
        }) */
        tilelayer
      ],
      view: new ol.View({
        projection:ol.proj.get('EPSG:4326'),
        center: opt.center || [113.5, 23],
        zoom: opt.zoom ||7,
      })
    });
  },
  OverlayCollection:OverlayCollection
}




// new ol.View({
//   center: [113.5, 23],//[13247163, 2615172],
//   projection: projection,
//   resolution: 0.010707574526236257,
//   maxResolution: 0.010707574526236257
// })
