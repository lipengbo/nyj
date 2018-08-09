import config from '@/lib/config';
import axios from '@/lib/axios';
class LayerDataService{
  constructor(orgcode,type){
    this.layerData={};
    this.layers={};
    this.getMMapCgLayerinfo(orgcode,type);
  }
/*  async getMMapcityLayerData (item){
    var url=config.solorUrl+item.corename+"/select?q="+item.querycondition+"&wt=json&indent=true";
    var res=await axios.get(url);
    var data=res.data;
    return this.cityLayerData=data.response;
  };
  async getMMapriverLayerData(item){
    var url=config.solorUrl+item.corename+"/select?q="+item.querycondition+"&wt=json&indent=true";
    var res=await axios.get(url);
    var data=res.data;
    return this.riverLayerData=data.response;
  };
  async getMMapcityLabelLayerData(item){
    var url=config.solorUrl+item.corename+"/select?q="+item.querycondition+"&wt=json&indent=true";
    var res=await axios.get(url);
    return this.cityLabelLayerData=res.data.response;
  };*/
  async getLayerData(layerItem){
    if(this.layerData[layerItem.layerename]){
      return this.layerData[layerItem.layerename];
    }
    var url=config.solorUrl+item.corename+"/select?q="+item.querycondition+"&wt=json&indent=true";
    var res=await axios.get(url);
    return this.layerData[layerItem.layerename]=res.data.response;
  }
  async getMMapCgLayerinfo(orgcode,type){
    var _self=this;
    if(!orgcode)orgcode='440000';
    var url=config.baseUrl+"getCgLayerinfo.do?orgcode="+orgcode+"&type="+type;//Mulele;
    var res=await axios.get(url);
    var data=res.data;
    data.forEach(function(item){
      _self.layers[item.layerename]=item;
    });
    return _self.layers;
  }
}
export default LayerDataService;
