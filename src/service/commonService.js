import qs from "query-string";
import axios from '@/lib/axios'
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
  }
}
