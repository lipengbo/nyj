class LayerEntity{
  constructor(opt){
    opt=opt||{};
    this.id=opt.id;
    this.layer= new ol.layer.Vector({
      id:this.id,
      source: new ol.source.Vector(),
      style:opt.style,
      visible:opt.visible!==false,
      zIndex:opt.index||LayerEntity.index
    });
    this.render=opt.render;//渲染函数
  }
}
function createLayers(){
  const layers= {
    hnLayer:new LayerEntity({
      id:"hnLayer",
      visible:true,
      style:null,
      render:function(){

      }
    }),
    oceanLayer:new LayerEntity({
      id:"oceanLayer",
      visible:true,
      style:null,
      render:function(){

      }
    }),
    provinceLayer:new LayerEntity({
      id:"provinceLayer",
      visible:true,
      style:null,
      render:function(){

      }
    }),
    surferLayer:new LayerEntity({
      id:"surferLayer",
      visible:true,
      style:null,
      render:function(){

      }
    }),
    cityLayer:new LayerEntity({
      id:"cityLayer",
      visible:true,
      style:null,
      render:function(res,layerItem){
        if(res.numFound<=0)return;
        var geojson = res.docs[0].pgjson;
        var curFeatures = format.readFeatures(geojson);
        var stroke = new ol.style.Stroke({color: layerItem.linecolor, width: layerItem.linewidth});
        var fill;
        var cityStyle;
        if(layerItem.pgcolor==""){
          cityStyle = new ol.style.Style({stroke: stroke});
        }else{
          fill = new ol.style.Fill({color: layerItem.pgcolor});
          cityStyle = new ol.style.Style({stroke: stroke, fill: fill});
        }
        this.layer.setStyle(cityStyle);
        this.layer.getSource().addFeatures(curFeatures);
      }
    }),
    riverLayer:new LayerEntity({
      id:"riverLayer",
      visible:true,
      style:null,
      render:function(res,layerItem){
        var geojson = res.docs[0].pgjson;
        var curFeatures = format.readFeatures(geojson);
        var stroke = new ol.style.Stroke({color: layerItem.linecolor, width: layerItem.linewidth});
        var fill = new ol.style.Fill({color: layerItem.pgcolor});
        var riverStyle = new ol.style.Style({stroke: stroke, fill: fill});
        this.layer.setStyle(riverStyle);
        this.layer.getSource().addFeatures(curFeatures);
      }
    }),
    countLayer:new LayerEntity({
      id:"countLayer",
      visible:true,
      style:null,
      render:function(){

      }
    }),
    plLayer:new LayerEntity({
      id:"plLayer",
      visible:true,
      style:null,
      render:function(){

      }
    }),
    cityLabelLayer:new LayerEntity({
      id:"cityLabelLayer",
      visible:true,
      style:null,
      render:function(res,layerItem){
        var layer=this.layer;
        var geojson = res.docs[0].pgjson;
        var curFeatures = format.readFeatures(geojson);
        var cityLabelStyle = null;
        curFeatures.forEach(function (feature) {
          cityLabelStyle = new ol.style.Style({
            image: new ol.style.Circle({
              radius: layerItem.labelradius,
              stroke: new ol.style.Stroke({
                color: layerItem.linecolor
              }),
              fill: new ol.style.Fill({
                color: layerItem.pgcolor
              })
            }),
            text: new ol.style.Text({
              text: feature.getProperties().MC,
              font: layerItem.fontsize + " " + layerItem.font,
              offsetY: -15,
              offsetX: 0,
              fill: new ol.style.Fill({
                color: layerItem.fontcolor
              })
            })
          });
          feature.setStyle(cityLabelStyle);
          layer.getSource().addFeature(feature);
        })
      }
    }),
    countyLabelLayer:new LayerEntity({
      id:"countyLabelLayer",
      visible:true,
      style:null,
      render:function(){

      }
    }),
    stationLayer:new LayerEntity({
      id:"stationLayer",
      visible:true,
      style:null,
      render:function(res,layerItem){
        var layer=this.layer;
        var stationPoints = res.response.docs;
        var stationPointStyle = null;
        var stationPointFeature = null;
        var stationPt = null;
        stationPoints.forEach(function (stationPoint) {
          stationPt = new ol.geom.Point([stationPoint.longitude, stationPoint.latitude]);
          stationPointFeature = new ol.Feature({
            geometry: stationPt
          });
          stationPointStyle = new ol.style.Style({
            image: new ol.style.Circle({
              radius:  layerItem.labelradius,
              stroke: new ol.style.Stroke({
                color: layerItem.linecolor
              }),
              fill: new ol.style.Fill({
                color: layerItem.pgcolor
              })
            }),
            text: new ol.style.Text({
              text: stationPoint.staname + '',
              font: layerItem.fontsize + " " + layerItem.font,
              offsetY: -10,
              offsetX: 15,
              fill: new ol.style.Fill({
                color: layerItem.fontcolor
              })
            })
          });
          stationPointFeature.setStyle(stationPointStyle);
          layer.getSource().addFeature(stationPointFeature);
        });
      }
    }),
    dataLayer:new LayerEntity({
      id:"dataLayer",
      visible:true,
      style:null,
      render:function(){

      }
    }),
    titleLayer:new LayerEntity({
      id:"titleLayer",
      visible:true,
      style:null,
      render:function(){

      }
    })
  };
  return layers;
}
class LayerService{
  constructor(opt){
    this.map=opt.map;
    this.layers=createLayers();
  }
}
export default LayerService;
