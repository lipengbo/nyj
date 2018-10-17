import axios from 'axios';
import config from './config';
const baseUrl=config.baseUrl
const instance =axios.create({
  baseURL:config.baseUrl
});
instance.interceptors.request.use(
  config => {
    var tests=[
      /.+(disasterLoss\/\S+)\.do/g,
      /.+(statisticalmanac\/\S+)\.do/g,
      /.+(qhzxsp\/getServicesproductinfoTypes)/g,
      /.+(qhzxsp\/getKdKnowledgebaseinfoVoTypes)/g,
      /.+(qhzxsp\/getClientOrgInfo)/g
    ];
    for(var i=0;i<tests.length;i++){
      var ex=tests[i].exec(config.url);
      if(ex){
        var mockurl="https://www.easy-mock.com/mock/5bc1a324f45a0b3ed270f369/nyj/";
        config.baseURL=mockurl;
        config.url=config.url.replace(baseUrl,mockurl);
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
