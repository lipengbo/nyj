import config from '@/lib/config';
import axios from '@/lib/axios';
class LayerDataService{
  constructor(orgcode,type){
    this.cityLayerData=null;
    this.riverLayerData=null;
    this.cityLabelLayerData=null;
    this.layers=[];
    this.getMMapCgLayerinfo(orgcode,type)
  }
  async getMMapcityLayerData (item){
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
  };
  async getMMapCgLayerinfo(orgcode,type){
    var _self=this;
    if(!orgcode)orgcode='440000';
    var url=config.baseUrl+"getCgLayerinfo.do?orgcode="+orgcode+"&type="+type;//Mulele;
    var res=await axios.get(url);
    var data=res.data;
    this.layers=data;
    var all=[];
    data.forEach(function(e,index){
      if(e.layerename=="cityLayer"){
        all.push(_self.getMMapcityLayerData(e));
      }
      if(e.layerename=="riverLayer"){
        all.push(_self.getMMapriverLayerData(e));
      }
      if(e.layerename=="cityLabelLayer"){
        all.push(_self.getMMapcityLabelLayerData(e));
      }
    });
    return await Promise.all(all);
  }
}
export default LayerDataService;
