import config from '@/lib/config';
class StatService{
  constructor(){

  }
  //获取绘制窗口的算法选项
  async getInterpolationVo(){
    var res=await axios.get(config.baseUrl+"getInterpolationVo.do");
    return res.data;
  }

}
export default new StatService();
