import axios from 'axios';
import config from './config';
const instance =axios.create({
  baseURL:config.baseUrl
});
instance.interceptors.request.use(
  config => {
    console.log(config);
    var tests=[
      /.+(disasterLoss\/\S+)\.do/g,
      /.+(statisticalmanac\/\S+)\.do/g,
      /.+(qhzxsp\/getServicesproductinfoTypes)/g,
      /.+(qhzxsp\/getKdKnowledgebaseinfoVoTypes)/g,
    ];
    for(var i=0;i<tests.length;i++){
      var ex=tests[i].exec(config.url);
      if(ex){
        config.baseURL="/";
        config.url="/static/json/"+ex[1]+".json";
        break;
      }
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
)
instance.interceptors.response.use(
  response => {
    // 对响应数据进行操作
    return response;
  },
  error => {
    // 对响应错误进行操作
    if(error.response.status==403){
      //window.location.href=config.baseUrl+'/tologin'
    }
    return Promise.reject(error);
  }
);
// instance.defaults.headers.post['Content-Type']='application/json;charse=UTF-8'
// instance.defaults.headers.get['Content-Type']='application/json;charse=UTF-8'
export default instance;
