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
export default instance;
