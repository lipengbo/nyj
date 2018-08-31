import dayjs from 'dayjs';
import config from '@/lib/config';
import Qs from 'query-string';
import html2canvas from 'html2canvas';
import mapService from './mapService'
class HomeMap {
  constructor(elm) {
    this.map = null;
    this.drawOverlay = new ol.layer.Vector({
        source: new ol.source.Vector()
      }
    );
    this.init(elm);
  }
  init(elm) {
    this.map=mapService.createMap({target:elm});
    // 设置标绘符号显示的默认样式
    var stroke = new ol.style.Stroke({color: '#FF0000', width: 2});
    var fill = new ol.style.Fill({color: 'rgba(0,255,0,0.4)'});
    var drawStyle = new ol.style.Style({fill: fill, stroke: stroke});
    // 绘制好的标绘符号，添加到FeatureOverlay显示。
    var drawOverlay = this.drawOverlay;
    drawOverlay.setStyle(drawStyle);
    this.bjLayer=new ol.layer.Vector({
        source: new ol.source.Vector()
      }
    );
    this.bjLayer.setStyle( new ol.style.Style({stroke:new ol.style.Stroke({color: '#409EFF', width: 3})}));
    this.map.addLayer(this.bjLayer);
    this.map.addLayer(drawOverlay);
  }
  _drawOverlay(solorJson) {
    var drawOverlay = this.drawOverlay;
    var parent = this;
    if (solorJson.toString() != "" &&solorJson.numFound != 0) {
      solorJson.docs.forEach(function (item, index) {
        var geojson = item.pg;
        var geoObject = JSON.parse(geojson);
        var feature = (new ol.format.GeoJSON()).readFeatures(geoObject);
        // var geometry = feature[0].getGeometry().transform('EPSG:4326', 'EPSG:3857');
        //  feature[0].setGeometry(geometry);
        drawOverlay.getSource().addFeatures(feature);
        parent._updateSelection(item.label, index);
      })
    } else {
      drawOverlay.getSource().clear();
      this.map.getOverlays().clear()
    }
  }
  _updateSelection(label,indexP) {
    var _self=this;
    var map=this.map;
    var extent = map.getView().calculateExtent(map.getSize());
    this.drawOverlay.getSource().getFeaturesInExtent(extent).map(function(feature,index){
      if(indexP==index){
        var geometry = feature.getGeometry(); //获取对象的几何图形
        var geometryExtent = geometry.getExtent();
        var x = (geometryExtent[0] + geometryExtent[2]) * 0.5;
        var y = geometryExtent[3];
        var anchor=_self.createOverlay({x:x,y:y,index:index,label:label});
        // 然后添加到map上
        map.addOverlay(anchor);
      }
    });
  }
  createOverlay(opt){
    var elm=document.createElement('div');
    elm.id="popup"+opt.index;
    elm.className="ol-popup";
    elm.innerHTML=opt.label;
    //this.map.getViewport().appendChild(elm);
    var anchor = new ol.Overlay({
      element: elm
    });
    anchor.setPosition([opt.x,opt.y]);
    return anchor;
  }
  getHomeMapSolor(params){
    var query={"q":"operateDate:["+dayjs(params.startDate).format('YYYYMMDD')+" TO " +dayjs(params.endDate).format('YYYYMMDD')+"]",wt:"json","index":true};
    var url=config.solorUrl+"attention/select";
    url= url+"?"+Qs.stringify(query);
    return axios.get(url).then(res=>{
      this._drawOverlay(res.data.response);
    });
  };
  download(name){
    html2canvas(this.map.getViewport(), {
        useCORS:true,
        allowTaint: true,
        taintTest: false
      }
    ).then(function(canvas){
      canvas.id = "mycanvas";
      var dataUrl = canvas.toDataURL();
      var a=document.getElementById('canvastomap');
      if(!a){
        a=document.createElement('a');
        a.href=dataUrl;
        a.setAttribute('download', name+'.png');
        document.body.appendChild(a);
      }
      a.click();
      a.remove();
    })
  }

  drawArea(pgjson){
    //this.bjLayer.getSource().clear();
    var geojson =pgjson;
    var geoObject = JSON.parse(geojson);
    var features  = (new ol.format.GeoJSON()).readFeatures(geoObject);
    var geometry = features[0].getGeometry();//.transform('EPSG:4326', 'EPSG:3857');
    this.map.getView().fit(geometry.getExtent(), this.map.getSize());
    this.bjLayer.getSource().addFeatures(features);
    return features;
  }
}

export default HomeMap;
