import qs from "query-string";
import axios from '@/lib/axios'
import config from "@/lib/config"
import dayjs from 'dayjs';
export default {
  download:async function(opt){
      var res=await axios({
        method: 'post',
        url: opt.url,
        data: opt.params,
        responseType: 'blob'
      });
      if(!res){return false}
      let url = window.URL.createObjectURL(new Blob([res]));
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href =url;
      if(opt.name){
        link.setAttribute('download',opt.name);
      }
      document.body.appendChild(link);
      link.click();
      setTimeout(()=>{
        link.remove();
      },50);
  },
  async getClientOrgInfo(){
    var info=sessionStorage.getItem("clientOrgInfo");
    if(info){
      console.log(info)
      return JSON.parse(info);
    }
    var url = config.baseUrl + "qhzxsp/getClientOrgInfo.do";
    var response=await  axios.get(url);
    if(response.data){
      sessionStorage.setItem("clientOrgInfo",JSON.stringify(response.data));
    }
    return response.data;
  },
  formatMonthDate(date){
    var day=dayjs(date);
    var xun=null;
    var ri=parseInt(day.format("D"));
    if(ri<=10){
      xun="A"
    }else if(ri<=20){
      xun="B"
    }else{
      xun="C"
    }
    return day.format("YYYYMM")+xun;
  }
}
