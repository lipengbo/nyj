//获取区域的的
import config from '@/lib/config';
import axios from '@/lib/axios'
class AreaService{
  constructor(){
    this.data=/*(localStorage&&localStorage.getItem("areaData"))?JSON.parse(localStorage.getItem("areaData")):*/{code:null,id:null,name:'全国',children:null};
    this.get();
  }
  /**
   * 根据行政区划代码获取对应的详细数据
   * @param code
   * @returns {Promise<*>}
   */
  async get(code){
    var codeResult=this.normalCode(code);
    if(!codeResult||!codeResult.level){
      if(this.data.children){
        return await this.data;
      }
      var query={"q":"level:1","start":0,"rows":50,"sort":"code asc","fl":"id,name,code",wt:"json","index":true};//获取所有省份
      var res=await axios.get(config.solorUrl+"border/select",{params:query});
      var data=this.normalData(res.data.response.docs);
      this.data.children=data;
      setTimeout(()=>{localStorage.setItem("areaData",JSON.stringify(this.data));});
      return this.data;
    }else{
      var data=await this.get(codeResult[codeResult.length-2]);
      if(!data.children[codeResult[codeResult.length-1]].children){
        var query={"q":"upercode:"+codeResult[codeResult.length-1]+" AND level:"+(codeResult.level+1)+"","start":0,"rows":50,"sort":"code asc","fl":"id,name,code",wt:"json","index":true};
        var res=await axios.get(config.solorUrl+'border/select',{params:query});
        data.children[codeResult[codeResult.length-1]].children=this.normalData(res.data.response.docs);
        setTimeout(()=>{localStorage.setItem("areaData",JSON.stringify(this.data));});
      }
      return data.children[codeResult[codeResult.length-1]];
    }
  };

  normalData(datas){
    var result={};
    for(var i=0;i<datas.length;i++){
      result[datas[i].code]=datas[i];
    }
    return result;
  }
  /**
   * 对行政区划代码进行分析，判断属于哪个省哪个市
   * @param code
   */
  normalCode(code){
    var arr=(code+"000000").substring(0,5).match(/[0-9]{2}/g);
    if(!arr)return null;
    var result=[];
    if(!arr[0]||arr[0]==="00")return null;
    result[1]=arr[0]+"0000";
    result['level']=1;
    if(!arr[1]||arr[1]==="00") return result;
    result[2]=arr[0]+arr[1]+"00";
    result['level']=2;
    if(!arr[2]||arr[2]==="00") return result;
    result[3]=arr[0]+arr[1]+arr[3];
    result['level']=arr[3];
    return result;
  }

  /**
   * 获取边界
   * @param area
   */
  async getBj(area){
    var url=config.solorUrl+'border/select';
    var query={wt:'json', index:true, q:'code:'+area.code, table:'border', start:'0', rows:'50', sort:'code asc', fl:'pgjson,code,id,name'}
    var res=await axios.get(url,{params:query});
    return res.data.response.docs;
  }
}
export default new AreaService();
