<template>
  <div style="width:100%" class="nq">
    <div class="m-stat-header">
      <div class="u-bar u-white f-bb1 " style="padding:15px 0;">
        <ul class="m-eles">
          <label class="u-label">灾害种类：</label>
          <el-checkbox-group v-model="query.selectTypes" style="display: inline-block">
            <li v-for="item in types">
                <el-checkbox :label="item.code">{{item.name}}</el-checkbox>
            </li>
          </el-checkbox-group>
        </ul>
      </div>
      <div class="u-bar u-white f-bb1">
        <label class="u-label">日期 ：</label>
        <ul>
          <li style="margin-right:0;">
            <el-date-picker format="yyyy-MM" size="mini" v-model="query.sdate" type="date" placeholder="选择日期">
            </el-date-picker>
            -
            <el-date-picker format="yyyy-MM" size="mini" v-model="query.edate" type="date" placeholder="选择日期">
            </el-date-picker>
          </li>
          <li>
            <el-button type="primary" size="small" @click="toQuery(1)">灾损查询</el-button>
            <el-button type="primary" size="small" @click="toQuery(2)">按种类统计</el-button>
            <el-button type="primary" size="small" @click="toQuery(3)">按年统计</el-button>
          </li>
        </ul>
      </div>
    </div>
    <div class="m-list u-white">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="数据" name="first">
          <div>
            <div v-show="activeTable==1">
              <el-table style="width: 100%" border  :data="zscxData.rows">
                <el-table-column prop="className" label="灾害种类" width="90"></el-table-column>
                <el-table-column prop="title" label="灾害名称" width="110"></el-table-column>
                <el-table-column prop="time" label="时间" width="90">
                  <template slot-scope="scope">{{scope.row.year+'-'+scope.row.month}}</template>
                </el-table-column>
                <el-table-column prop="amount" label="受灾人口(万人次)" width="90"></el-table-column>
                <el-table-column prop="area" label="农业受灾面积(万公顷次)" width="90"></el-table-column>
                <el-table-column prop="collapseBulidings" label="倒塌房屋(万间)" width="90"></el-table-column>
                <el-table-column prop="death" label="死亡人数(人)" width="90"></el-table-column>
                <el-table-column prop="loss" label="直接经济损失(亿元)" width="90"></el-table-column>
                <el-table-column prop="isTypical" label="典型" width="60">
                  <template slot-scope="scope">{{scope.row.isTypical=="1"?'是':'否'}}</template>
                </el-table-column>
                <el-table-column prop="opt" label="更多详情">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="queryDetail(scope.row)">简况</el-button>
                    <el-button type="warning" size="mini" @click="queryImgs(scope.row)">图片</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block" style="text-align:center;">
                <el-pagination v-show="zscxData.total>0" layout="prev, pager, next" :total="zscxData.total" current-page.sync="zscxData.page" page-size="20" @current-change="changePage"></el-pagination>
              </div>
            </div>
            <div v-show="activeTable==2">
              <el-table style="width: 100%" border  :data="zltjData">
                <el-table-column prop="className" label="灾害种类"></el-table-column>
                <el-table-column prop="amount" label="受灾人口(万人次)"></el-table-column>
                <el-table-column prop="area" label="农业受灾面积(万公顷次)"></el-table-column>
                <el-table-column prop="collapseBulidings" label="倒塌房屋(万间)"></el-table-column>
                <el-table-column prop="death" label="死亡人数(人)"></el-table-column>
                <el-table-column prop="loss" label="直接经济损失(亿元)"></el-table-column>
              </el-table>
            </div>
            <div  v-show="activeTable==3">
              <el-table style="width: 100%" border :data="nftjData">
                <el-table-column prop="className" label="受灾年份"></el-table-column>
                <el-table-column prop="amount" label="受灾人口(万人次)"></el-table-column>
                <el-table-column prop="area" label="农业受灾面积(万公顷次)"></el-table-column>
                <el-table-column prop="collapseBulidings" label="倒塌房屋(万间)"></el-table-column>
                <el-table-column prop="death" label="死亡人数(人)"></el-table-column>
                <el-table-column prop="loss" label="直接经济损失(亿元)"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="图表" name="second">
          <div>

          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog  :visible.sync="isShowDetail" width="1200px">
      <div v-if="detailData">
        <div class="detailHeader">
          <h2 class="h1" style="text-align:center;font-size:24px;font-weight:700;margin-bottom:20px;">{{detailData.title}}</h2>
          <ul>
            <li class="detailItem"><label class="u-label">编码: </label><span>{{detailData.code}}</span></li>
            <li class="detailItem"><label class="u-label">灾情种类: </label><span>{{detailData.className}}</span></li>
            <li class="detailItem"><label class="u-label">年份: </label><span>{{detailData.year}}年</span></li>
            <li style="clear:left;"></li>
            <li class="detailItem"><label class="u-label">受灾人口: </label><span><b class="text-warning">{{detailData.amount}}</b>万人次</span></li>
            <li class="detailItem"><label class="u-label">农业受灾面积: </label><span><b class="text-warning">{{detailData.area}}</b>万公顷次</span></li>
            <li class="detailItem"><label class="u-label">倒塌房屋: </label><span><b class="text-warning">{{detailData.collapseBuildings}}</b>万间</span></li>
            <li class="detailItem"><label class="u-label">死亡人数: </label><span><b class="text-warning">{{detailData.death}}</b>人</span></li>
            <li class="detailItem"><label class="u-label">直接经济损失: </label><span><b class="text-warning">{{detailData.loss}}</b>亿元</span></li>
          </ul>
        </div>
        <div class="detailContent">
          <div v-html="detailData.detail" class="detailTxt"></div>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isShowImgs" width="1200px">
      <div v-if="imgsData">
        <h2 class="h1" style="text-align:center;font-size:24px;font-weight:700;margin-bottom:20px;">{{imgsData.title}}</h2>
        <div v-if="imgs">
          <swiper :options="swiperOpt" ref="swiper">
            <swiper-slide v-for="item in imgs">
                <div class="imgBox" style="width:100%;height:480px;">
                  <img class="imgItem" :src="item"/>
                </div>
            </swiper-slide>
            <div class="swiper-button-next" slot="button-next"></div>
            <div class="swiper-button-prev" slot="button-prev"></div>
          </swiper>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import config from '../lib/config.js';
  import dayjs from 'dayjs';
  var baseUrl = config.baseUrl;
  export default {
    name: "lszq",
    computed: {
      ...mapState([
        'orgInfo',
      ]),
      imgs:function () {
        if(!this.imgsData||!this.imgsData.detail) return [];
        let str=this.imgsData.detail;
        let results=str.match(/src=\s?"(.+\.((jpg)|(png)|(jpeg)|(bmp)))"/g);
        for(let i=0;i<results.length;i++){
          results[i]=results[i].replace(/src=\s?/,"").replace(/"/g,"");
        }
        return results;
      }
    },
    data() {
      return {
        activeName:"first",
        activeTable:1,
        isShowDetail:false,
        detailData:null,
        imgsData:null,
        isShowImgs:false,
        types:[],
        query:{
          selectTypes:[],//选中的type的值
          sdate:null,
          edate:null
        },
        zscxData:{
          page:1,
          total:0
        },
        zltjData:[],
        nftjData:[],
        swiperOpt:{
          height: 500,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
      }
      }
    },
    created() {
      axios.get(baseUrl+"disasterLoss/queryType.do").then((res)=>{
        this.types=res.data;
      })
    },
    watch: {

    },
    mounted() {

    },
    methods: {
      changePage:function(page){
        this.zscxQuery(page)
      },
      zscxQuery:function(page){
        var params={page:page||1,limit:20};
        var query=this.query;
        params.type=query.selectTypes.join(",");
        if(query.sdate){
          params.syear=dayjs(query.sdate).format("YYYY");
          params.smonth=dayjs(query.sdate).format("MM");
        }
        if(query.edate){
          params.eyear=dayjs(query.edate).format("YYYY");
          params.emonth=dayjs(query.edate).format("MM");
        }
        axios.get(baseUrl+"disasterLoss/query.do",{params:params}).then((res)=>{
          this.zscxData=res.data;
        })
      },
      queryDetail:function({id,disasterClassId}){
        this.detailData=null;
        this.isShowDetail=true;
        let params={
          id:id,
          disasterClassId:disasterClassId
        };
        axios.get(baseUrl+'disasterLoss/getdetail.do',{params:params}).then((res)=>{
          this.detailData=res.data;
        })
      },
      queryImgs:function({year}){
        this.imgsData=null;
        this.isShowImgs=true;
        let params={
          year:year
        };
        axios.get(baseUrl+'disasterLoss/getDisaterImg.do',{params:params}).then((res)=>{
          this.imgsData=res.data;
        })
      },
      zltjQuery:function(){
        var params={};
        var query=this.query;
        params.type=query.selectTypes.join(",");
        if(query.sdate){
          params.syear=dayjs(query.sdate).format("YYYY");
        }
        if(query.edate){
          params.eyear=dayjs(query.edate).format("YYYY");
        }
        axios.get(baseUrl+"disasterLoss/queryCount.do",{params:params}).then((res)=>{
          this.zltjData=res.data[0].data;
          this.zltjData=this.zltjData.concat(res.data[1].statistics);
        })
      },
      nftjQuery:function(){
        var params={groupByYear:true};
        var query=this.query;
        params.type=query.selectTypes.join(",");
        if(query.sdate){
          params.syear=dayjs(query.sdate).format("YYYY");
        }
        if(query.edate){
          params.eyear=dayjs(query.edate).format("YYYY");
        }
        axios.get(baseUrl+"disasterLoss/queryCount.do",{params:params}).then((res)=>{
          this.nftjData=res.data[0].data;
          this.nftjData=this.nftjData.concat(res.data[1].statistics);
        })
      },
      toQuery:function(type){
        type=type||1;
        this.activeTable=type;
        if(type==1){
          this.zscxQuery(1)
        }else if(type==2){
          this.zltjQuery()
        }else if(type==3){
          this.nftjQuery()
        }
      }
    }
  }
</script>
<style lang="css" scoped>
  .m-download:hover{
    color:#409EFF;
    cursor:pointer;
  }
  .el-table{
    font-size:12px;
  }
  .detailHeader{

  }
  .detailHeader ul{
  }
  .detailHeader ul .detailItem{
    float:left;
    width:215px;
    margin-bottom:8px;
  }
  .detailHeader ul:after{
    content:"";
    display:block;
    clear:both;
  }
  .detailContent{
    padding-top:10px;
    overflow:auto;
    height:500px;
    border-top:solid 1px #cccccc;
  }
  .detailTxt{
  }
</style>
<style>
  .nq .el-tabs__header {
    margin-bottom: 0;
  }

  .text-warning{
    color:#E6A23C;
    font-size:120%;
    font-weight: 500;
  }
</style>
