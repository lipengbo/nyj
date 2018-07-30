<template>
  <div style="width:100%" class="monitor">
      <div id="mapf" style="height:100%;width:100%;"></div>
    <div class="monitor_panel" v-show="isPanelShow">
      <div class="panel_title">{{panelData.name}}</div>
      <div class="panel_content">
        <h3>气候条件概述</h3>
        <p>{{panelData.climatesurvey}}</p>
        <br/>
        <h3>作物生长概述</h3>
        <p>{{panelData.cropsurvey}}</p>
        <br/>
        <h3>农事活动建议</h3>
        <p>{{panelData.farmingsurvey}}</p>
        <br/>
        <h3>附件</h3>
        <p>
          <img v-for="item in panelData.attachment" :src="item"/>
        </p>
      </div>
      <div class="opt">
        <i class="btn el-icon-arrow-left" @click="pre(panelData.id)"></i>
        <i class="btn el-icon-arrow-right" @click="next(panelData.id)"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import mapService from '@/service/mapService'
  var config = require('../lib/config.js');
  var getData = async (params) => {
    var query={"q":"*",wt:"json","index":true};
    var url=config.solorUrl+"cmcropconditioninfo/select";
    var res = await axios.get(url,{params:query});
    return res.data.response.docs;
  };
  export default {
    name: "monitor",
    data() {
      return {
        isPanelShow:false,
        panelData:{}
      };
    },
    created() {

    },
    mounted(){
      this.map=mapService.createMap({target:'mapf'});
      getData().then((data)=>{
        this.renderData(data);
      });
    },
    methods: {
      renderData(datas){
        var _self=this;
        if(!_self.overlays){
          _self.overlays=new mapService.OverlayCollection({
            map:_self.map,
            render:function(data){
              return '<img src="'+data.attachment[data.attachment.length-1]+'"/>';
            },
            click:function(overlay){
              _self.showPanel(overlay);
            }
          })
        }else{
          _self.overlays.removeAll();
        }
        datas.forEach(function(data){
          _self.overlays.add(data);
        })
      },
      showPanel(overlay){
        if(overlay){
          this.panelData=overlay.get("clients")||{};
        }
        this.isPanelShow=true;
      },
      next(id){
        var arr=this.overlays.getArray();
        var index=this.overlays.getIndexById(id);
        if(index<arr.length-1){
          this.panelData =  arr[index+1].get("clients");
          this.map.getView().setCenter(arr[index+1].getPosition());
        }
      },
      pre(id){
        var arr=this.overlays.getArray();
        var index=this.overlays.getIndexById(id);
        if(index>0){
          this.panelData =  arr[index-1].get("clients");
          this.map.getView().setCenter(arr[index-1].getPosition())
        }
      }
    }
  }
</script>

<style lang="css" scoped>
  .monitor{
    padding:5px;
    background:white;
    height:600px;
    position:relative;
  }
  .monitor_panel{
    width:240px;
    height:100%;
    right:0;
    top:0;
    z-index:3;
    position:absolute;
    background:rgba(255,255,255,0.78)
  }
  .panel_title{
    background:#186da3;
    color:white;
    height:48px;
    line-height:48px;
    font-size:16px;
    font-weight:700;
    padding-left:10px;
  }
  .panel_content{
    padding:20px 10px;
    height:calc(100% - 48px - 60px);
    overflow:auto;
  }
  .panel_content h3{
    font-size:15px;
    font-weight:700;
    color:#333;
    margin-bottom:8px;
  }
  .panel_content p{
    font-size:13px;
  }
  .panel_content img{
    width:98px;
    margin:0 6px;
  }
  .opt{
    bottom:0;
    text-align: center;
    padding-bottom: 10px;
    color:#606266;
    font-size:22px;
    position:absolute;
    width:100%;
    font-weight:700;
    user-select: none;
  }
  .btn{
    padding:8px 15px;
    cursor:pointer;
    margin:10px;
  }
  .btn:hover{
    color:#409EFF;
  }
</style>
<style>
  .monitor .ol-popup{
    min-width:90px;
    min-height:74px;
    border-radius: 5px;
  }
  .monitor .ol-popup img{
    width:98px;
    border:solid 1px #dcdcdc;
  }

</style>
