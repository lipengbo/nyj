<template>
  <div style="width:100%;height:100%;position:relative;">
    <div class="homemap_select">
      <cityselect style="width:80px;height:40px;" @change="bj"></cityselect>
      <div class="opt">
        <span class="lf" title="上一周" @click="preWeek"><i class="el-icon-arrow-left"></i></span>
        <span class="rt" title="下一周" @click="nextWeek"><i class="el-icon-arrow-right"></i></span>
        <span class="down" style="width:45px;" title="下载" @click="download"><i class="el-icon-download"></i></span>
      </div>
    </div>
    <div id="homemap" style="width:1200px;height:630px;"></div>
  </div>
</template>

<script>
  import HomeMapService from '@/service/HomeMap';
  import cityselect from './cityselect';
  import dayjs from 'dayjs';
  import areaService from '@/service/areaService'
  export default {
    name: "homemap",
    props:['start','end'],
    data() {
      return {
        mapService: null,
        startDate: this.start||dayjs().startOf('week').format('YYYY-MM-DD'),
        endDate: this.end||dayjs().endOf('week').format('YYYY-MM-DD')
      }
    },
    components: {
      cityselect
    },
    mounted() {
      this.mapService = new HomeMapService('homemap');
      this.mapService.getHomeMapSolor({startDate:this.startDate,endDate:this.endDate});
    },
    methods:{
      nextWeek:function(){
        this.startDate=dayjs(this.startDate).add('1','week').format('YYYY-MM-DD');
        this.endDate=dayjs(this.endDate).add('1','week').format('YYYY-MM-DD');
        this.mapService.getHomeMapSolor({startDate:this.startDate,endDate:this.endDate});
        this.$emit('change',{startDate:this.startDate,endDate:this.endDate});
      },
      preWeek:function(){
        this.startDate=dayjs(this.startDate).subtract('1','week').format('YYYY-MM-DD');
        this.endDate=dayjs(this.endDate).subtract('1','week').format('YYYY-MM-DD');
        this.mapService.getHomeMapSolor({startDate:this.startDate,endDate:this.endDate});
        this.$emit('change',{startDate:this.startDate,endDate:this.endDate});
      },
      download:function(){
        this.mapService.download(dayjs(this.startDate).format('YYYY.MM.DD')+"-"+dayjs(this.startDate).format('YYYY.MM.DD'));
      },
      bj:function(area){
        this.mapService.bjLayer.getSource().clear();
        areaService.getBj(area).then(data=>{
          this.mapService.drawArea(data[0].pgjson);
        })
      }
    }
  }
</script>

<style scoped>
  .homemap_select {
    height: 40px;
    z-index: 2;
    position: absolute;
    right: 0;
    top: 0;
  }

  .opt {
    float: left;
  }

  .opt > span {
    width: 56px;
    height: 40px;
    line-height: 40px;
    display: block;
    float: left;
    background: rgba(0, 0, 0, .5);
    color: white;
    font-weight: 700;
    font-size: 20px;
    text-align: center;
    cursor: pointer;
  }

  .opt > span:hover {
    background: rgba(0, 0, 0, .8);
  }
</style>
