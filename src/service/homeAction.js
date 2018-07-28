
var config=require("../lib/config");
var dateUtil=require("../lib/DateUtil");
var dayjs=require('dayjs');
const Qs = require('query-string');
// Mulele CropPeriod Cgsuitable Fasuitable Amdisaster Soilmoisture
export const getMulele = data => ({ type: 'HOMEMULELEIMAGE', datas: data });
export const getCropPeriod = data => ({ type: 'HOMECROPPERIODIMAGE', datas: data });
export const getCgsuitable=data=>({type:"HOMECGSUITABLEIMAGE",datas:data});
export const getFasuitable=data=>({type:"HOMEFASUITABLEIMAGE",datas:data});
export const getAmdisaster=data=>({type:"HOMEAMDISASTERIMAGE",datas:data});
export const getSoilmoisture=data=>({type:"HOMESOILMOISTRUEIMAGE",datas:data});
export const getImages = (params) => {
  var url=config.baseUrl+"getAgroImageVoByType.do";
  url= url+"?"+Qs.stringify(params);
  return dispatch => {
    axios.get(url)
      .then(res => res.json())
      .then(json =>{
          if(params.type=="Mulele"){
            dispatch(getMulele(json));
          }else
          if(params.type=="CropPeriod"){
            dispatch(getCropPeriod(json));
          }else

          if(params.type=="Cgsuitable"){
            dispatch(getCgsuitable(json));
          }else

          if(params.type=="Fasuitable"){
            dispatch(getFasuitable(json));
          }
          else
          if(params.type=="Amdisaster"){
            dispatch(getAmdisaster(json));
          }else

          if(params.type=="Soilmoisture"){
            dispatch(getSoilmoisture(json));
          }

        }
      );
  };
};
export const homeCurrentDate=data=>({type:"HOMECURRENTDATE",currentDate:data});
export const getCurrentDate=(tempdate)=>{
 return dispatch => {
    dispatch(homeCurrentDate(tempdate));
    dispatch( getHomeMapSolor({"currentDate":tempdate}));
  }
}

export const homeMapSolor=data=>({type:"HOMEMAPSOLOR",datas:data});
export const getHomeMapSolor=(params)=>{
  var query={"q":"operateDate:["+moment(params.startDate,'YYYYMMDD')+" TO " +moment(params.endDate,'YYYYMMDD')+"]",wt:"json","index":true};
  var url=config.solorUrl+"attention/select";
  url= url+"?"+Qs.stringify(query);
  return axios.get(url)
      .then(res => res.json())
      .then(json =>homeMapSolor(json.response)
      );
};


export const homeMapPanelPData=data=>({type:"HOMEMAPPANELPDATA",datas:data});
export const getHomeMapPanelPData=(params)=>{
  var query={"q":"level:[1 TO 2]","start":0,"rows":50,"sort":"code asc","fl":"id,name,code",wt:"json","index":true}
  var url=config.solorUrl+"border/select";
  url= url+"?"+Qs.stringify(query);
  return dispatch => {
    axios.get(url)
      .then(res => res.json())
      .then(json =>dispatch(homeMapPanelPData(json.response))
      );
  };
}
export const homeMapPanelCData=data=>({type:"HOMEMAPPANELCDATA",datas:data});
export const getHomeMapPanelCData=(code)=>{
  var query={"q":"upercode:"+code+" AND level:3","start":0,"rows":50,"sort":"code asc","fl":"id,name,code",wt:"json","index":true}
  var url=config.solorUrl+"border/select";
  url= url+"?"+Qs.stringify(query);
  return dispatch => {
    axios.get(url)
      .then(res => res.json())
      .then(json =>dispatch(homeMapPanelCData(json.response))
      );
  };
}









