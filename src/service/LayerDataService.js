import config from '@/lib/config';
import axios from '@/lib/axios';
class LayerDataService{
  constructor(orgcode,type){
    this.orgcode=orgcode;
    this.type=type;
    this.layerData={};
    this.layers=null;
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
}
export default LayerDataService;
