/**
* hnLayer, oceanLayer, provinceLayer,分别为华南其他省份图层，海域图层，省界图层，瓦片类型
* surferLayer, cityLayer, riverLayer,countLayer, cityLabelLayer,countyLabelLayer, stationLayer, titleLayer;
* 插值分布图，市界，水系，区县界，地市标注，区县标注，站点标注，标题
* 这11个图层，必须按上述顺序加载到map对象中，否则会因为图层叠加覆盖，导致数据被遮挡等
* 因此 暂时不动态创建图层，全部在初始化时预先创建对应的对象，根据图层可见与否的属性控制Visible
*
* 其中hnLayer, oceanLayer, provinceLayer, 为不会变化的图层，不需要动态加载数据，只是控制可见与否
* cityLayer, riverLayer,cityLabelLayer 当用户为省级用户时，加载地市、水系等矢量数据，也是不变的数据，只是控制可见与否
* countLayer,countyLabelLayer 当用户为市级用户时，加载区县等矢量数据，也是不变的数据，只是控制可见与否
*
* surferLayer，stationLayer, titleLayer 需要更加用户的组织机构代码，加载相应的时候，是动态数据，在加载数据前需要清空原有数据。
*
* 图层的信息 由后台返回
*
* 数据图层的查询，从相应的solr 数据集中查询， 查询id = 组织机构代码 + 日期 + 要素 + 站点类型 例如例子中的 44000020161120T1代表广东省20161120平均气温国家站
*
* 图例窗口，则是从solr查询所得的symboljson，并将其按颜色值，绘制在面板上
*
*/

import config from '@/lib/config';
import axios from '@/lib/axios';
import commonService from "@/service/commonService"
var format = new ol.format.GeoJSON();
class LayerEntity{
  constructor(opt){
    opt=opt||{};
    this.id=opt.id;
    this.name=opt.name;
    this.layer= new ol.layer.Vector({
      id:this.id,
      name:this.name,
      source: new ol.source.Vector(),
      style:opt.style,
      visible:opt.visible!==false,
      zIndex:opt.index
    });
    this.render=opt.render;//渲染函数
  }
}
function createLayers(){
  var layers= {
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
      render:function(res,plLayerItem){
        if(res.docs[0].pljson=='' || res.docs[0].pljson==null){

        }else{
          this.layer.getSource().clear();
          var pls = format.readFeatures(res.docs[0].pljson);
          var plStyle = null;
          pls.forEach(function (pl) {
            plStyle = new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: (plLayerItem.linecolor ? plLayerItem.linecolor : '#696969'),//
                width: (plLayerItem.linewidth ? plLayerItem.linewidth : 0.2)
              }),
              text: new ol.style.Text({
                text: pl.getProperties().CONTOUR + "",
                offsetY: -10,
                offsetX: 15,
                fill: new ol.style.Fill({
                  color: plLayerItem.pgcolor ? publishItem.pgcolor : '#000000'
                })
              })
            });

            pl.setStyle(plStyle);
            this.layer.getSource().addFeature(pl);

          });
        }
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
        });
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
              text: stationPoint.staname + "",
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
    for(let k in this.layers){
      this.map.addLayer(this.layers[k].layer)
    }
  }
  async getLayerData(layerItem){
    var url=config.solorUrl+layerItem.corename+"/select?q="+layerItem.querycondition+"&wt=json&indent=true";
    var res=await axios.get(url);
    return res.data.response;
  }
  async getMMapCgLayerinfo(orgcode,type){
    orgcode=orgcode||"440000";
    type=type||"Mulele";
    if(!orgcode)orgcode='440000';
    var url=config.baseUrl+"getCgLayerinfo.do?orgcode="+orgcode+"&type="+type;//Mulele;
    var res=await axios.get(url);
    var data=res.data;
    var layers={};
    data.forEach(function(item){
      layers[item.layerename]=item;
    });
    return layers;
  }
  async get2Render(type){
    var clientInfo=await commonService.getClientOrgInfo();
    var layerItems=await this.getMMapCgLayerinfo(clientInfo.code,type);
    this.layers["cityLayer"].render(await this.getLayerData(layerItems["cityLayer"]),layerItems["cityLayer"]);
    this.layers["riverLayer"].render(await this.getLayerData(layerItems["riverLayer"]),layerItems["riverLayer"]);
    this.layers["cityLabelLayer"].render(await this.getLayerData(layerItems["cityLabelLayer"]),layerItems["cityLabelLayer"]);
    this.layers["plLayer"].render(await this.getLayerData(layerItems["plLayer"]),layerItems["plLayer"]);
  }
}
export default LayerService;
