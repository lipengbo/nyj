<template>
  <div style="width:100%" class="nq">
    <div class="m-stat-header">
      <div class="u-bar u-white f-bb1 " style="padding:10px 0;">
        <ul class="m-eles">
          <label class="u-label">作物：</label>
            <li @click="selectZw=null" :class="{'f-active':!selectZw}">全部</li>
            <li v-for="item in zws" @click="selectZw=item.code" :class="{'f-active':selectZw===item.code}">{{item.name}}</li>
        </ul>
      </div>
      <div class="u-bar u-white f-bb1 " style="padding:10px 0;">
        <ul class="m-eles">
          <label class="u-label">发育期：</label>
          <li @click="selectFyq=null" :class="{'f-active':!selectFyq}">全部</li>
          <li v-for="item in fyqs" @click="selectFyq=item.code" :class="{'f-active':selectFyq===item.code}">{{item.name}}</li>
        </ul>
      </div>
      <div class="u-bar u-white f-bb1 " style="padding:10px 0;">
        <ul class="m-eles">
          <label class="u-label">气候：</label>
          <li @click="selectQh=null" :class="{'f-active':!selectQh}">全部</li>
          <li v-for="item in qhs" @click="selectQh=item.code" :class="{'f-active':selectQh===item.code}">{{item.name}}</li>
        </ul>
      </div>
      <div class="u-bar u-white f-bb1 " style="padding:15px 0;">
        <label class="u-label">灾害情况：</label>
        <el-input v-model="keyword" placeholder="请输入查询关键字" style="width:300px;height:25px;margin-right:40px;"></el-input><el-button icon="el-icon-search" type="primary" size="mini" @click="query(1)">查询</el-button>
      </div>
    </div>
    <div class="m-list" style="margin-top:10px;">
      <div style="max-height:575px;overflow-y:auto;">
        <div class="jcItem" v-for="item in data.rows">
          <div class="jcItem_title">
            <span style="color:#409EFF;font-weight:700" class="jcItem_title_item">{{item.cropname}}</span>
            <span class="jcItem_title_item"><label class="u-label">发育期:</label> {{item.periodname}}</span>
            <span class="jcItem_title_item"><label class="u-label">气候:</label> {{item.climatename}}</span>
            <span class="jcItem_title_item"><label class="u-label">灾害情况:</label> {{item.effect}}</span>
          </div>
          <div class="jcItem_content">
            专家建议:{{item.advise}}
          </div>
        </div>
      </div>
      <div class="block" style="text-align:center;">
        <el-pagination layout="prev, pager, next" :total="data.total" current-page.sync="data.page" :page-size="20" @current-change="changePage"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import config from "@/lib/config";
  export default {
    name: "zjjck",
    data(){
      return {
        zws:[],
        fyqs:[],
        qhs:[],
        selectZw:null,
        selectFyq:null,
        selectQh:null,
        data:{},
        keyword:"",
      }
    },
    watch:{
      selectZw:function(val){
        this.fyqs=[];
        this.selectFyq=null;
        if(val){
          this.getFyqs(val.code).then((data)=>{
            this.fyqs=data;
          })
        }
      }
    },
    created:async function(){
      this.zws=await this.getZws();
      this.qhs=await this.getQhs();
    },
    methods:{
      getZws:async function(){
        let res=await axios.get(config.baseUrl+"cdCropInfo/getCropItemVo.do");
        return res.data.items;
      },
      getFyqs:async function(periodTypeCode){
        let res=await axios.get(config.baseUrl+"cdSysdictionary/getPeriodsByPeriodTypeCode.do",{params:{periodTypeCode:periodTypeCode}});

        return res.data.items;
      },
      getQhs:async function(){
        let res=await axios.get(config.baseUrl+"kdKnowledgeDictionary/getClimateList.do");
        return res.data.items;
      },
      query:function(page){
        let params={
          cropcode:this.selectZw&&this.selectZw.code,
          periodcode:this.selectFyq&&this.selectFyq.code,
          climatecode:this.selectQh&&this.selectQh.code,
          effect:this.keyword||"",
          page:page||1,
          limit:20
        };
        axios.get(config.baseUrl+"kdExpertDecisionInfo/query.do",{params:params}).then((res)=>{
          this.data=res.data;
        })
      },
      changePage:function(page){
        this.query(page)
      }
    }
  }
</script>

<style scoped>
  .u-bar li{
    display:inline-block;
  }
  .jcItem{
    box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
    border: 1px solid #ebebeb;
    border-radius: 3px;
    padding:10px 20px;
    font-size:14px;
    background:white;
    margin-bottom:3px;
  }
  .jcItem_title{
    margin-bottom:10px;

  }
  .jcItem_title_item{
    margin-right:30px;
    display:inline-block;
    min-width:120px;
  }
  .jcItem_title_item:first-child{
    min-width:60px;
  }
  .jcItem_content{
    border:solid 1px #ebebeb;
    padding:10px;
    max-height:50px;
    overflow-y:auto;
  }
</style>
