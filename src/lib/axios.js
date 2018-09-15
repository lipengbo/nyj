import axios from 'axios';
import config from './config';
const instance =axios.create({
  baseURL:config.baseUrl
});
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
