<template>
  <div style="width:100%" class="monitor">
      <div id="mapf" style="height:100%;width:100%;"></div>
    <div class="monitor_panel" :class="{'close':!isPanelShow}">
      <div style="position:relative;height:100%;">
        <div class="closeBtn" @click="isPanelShow=!isPanelShow"><i :class="{'el-icon-arrow-right':isPanelShow,'el-icon-arrow-left':!isPanelShow}"></i></div>
        <div class="panel_title">{{panelData.name}}</div>
        <div class="panel_content" v-bar>
          <div>
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
            <div>
              <swiper :options="swiperOption" ref="swiper">
                <swiper-slide v-for="(item,index) in panelData.attachmentthumb">
                  <img :src="resourceUrl+item" @mouseenter="imageEnter(index)" @mouseleave="imageLeave()"/>
                </swiper-slide>
                <div class="swiper-button-next swiper-button" slot="button-next"></div>
                <div class="swiper-button-prev swiper-button" slot="button-prev"></div>
              </swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="imageDetail" :class="{'active':currentImage}">
      <img :src="currentImage"/>
    </div>
  </div>
</template>

<script>
  import mapService from '@/service/mapService'
  var config = require('../lib/config.js');
  import dayjs from 'dayjs';
  import commonService from "@/service/commonService"
  var getData = async (params) => {
    var query={"q":"periods:"+commonService.formatMonthDate(dayjs().subtract(10, 'day').toDate()),wt:"json","index":true,start:0,rows:26};
    var url=config.solorUrl+"cmcropconditioninfo/select";
    var res = await axios.get(url,{params:query});
    return res.data.response.docs;
  };
  export default {
    name: "monitor",
    data() {
      return {
        swiperOption:{
          speed:600,
          slidesPerView :2,
          spaceBetween:3,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
        },
        resourceUrl:config.resourceUrl,
        isPanelShow:false,
        panelData:{},
        currentImage:null
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
        var resourceUrl=this.resourceUrl;
        if(!_self.overlays){
          _self.overlays=new mapService.OverlayCollection({
            map:_self.map,
            render:function(data){
              return '<img src="'+resourceUrl+data.attachment[data.attachmentthumb.length-1]+'"/>';//'<img src="'+resourceUrl+data.attachmentthumb[data.attachmentthumb.length-1]+'"/>';
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
        });
        if(_self.overlays.getArray()[0]){
          this.panelData=_self.overlays.getArray()[0].get("clients");
        }
      },
      showPanel(overlay){
        if(overlay){
          this.panelData=overlay.get("clients")||{};
        }
        this.isPanelShow=true;
      },
      imageEnter(index){
        this.currentImage=this.resourceUrl+this.panelData.attachment[index];
      },
      imageLeave(){
        this.currentImage=null;
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
    overflow:hidden;
  }
  .monitor_panel{
    width:240px;
    height:100%;
    right:0;
    top:0;
    z-index:3;
    position:absolute;
    background:rgba(255,255,255,0.78);
    transition:right 0.75s
  }
  .monitor_panel.close{
    right:-240px;
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
    line-height:150%;
  }
  .panel_content img{
    width:98px;
    height:60px;
    background:#ccc;
  }
  .opt{
    bottom:0;
    text-align: center;
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
    margin:2px 10px;
  }
  .btn:hover{
    color:#409EFF;
  }
  .closeBtn{
    position:absolute;
    right:100%;
    top:50%;
    height:40px;
    margin-top:-20px;
    background:white;
    text-align: center;
    line-height:40px;
    font-weight: 700;
    cursor: pointer;
  }
  .imageDetail{
    background:white;
    padding:3px;
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,.1);
    border-radius: 3px;
    width:600px;
    min-height:300px;
    right:240px;
    top:50%;
    transform:translateY(-50%);
    position:absolute;
    z-index:9999;
    display:none;
  }
  .imageDetail.active{
    display:block;
  }
  .imageDetail img{
    display:block;
    width:100%;
    height:auto;
  }
</style>
<style>
  .monitor .ol-popup{
    min-width:55px;
    min-height:40px;
    border-radius: 4px;
    padding:2px;
  }
  .monitor .ol-popup:after{
    border-width:6px;
  }
  .monitor .ol-popup img{
    width:53px;
    border:solid 1px #dcdcdc;
    display:block;
    height:auto;
  }
  .monitor .swiper-button{
    width:16px;
    height:25px;
    margin-top:-12.5px;
    background-size: 16px 30px;
  }
  .monitor .swiper-button-prev{
    left:0;
  }

</style>
