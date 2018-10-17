<template>
  <el-container>
    <el-main style="padding:10px;position:relative;">
      <!--<img :src="scimgUrl" v-if="scimgUrl" style="height:750px;width:100%;" />-->
      <div id="cmap" style="height:100%;width:100%;"></div>
      <maplegend name="图例" :data="legendData" v-show="legendShow"></maplegend>
    </el-main>
    <el-aside width="250px" class="m-layer-aside">
      <div class="m-title" style="border-color:transparent;">绘图设置</div>
      <div style="margin-bottom:10px;">
        <el-select v-model="selectedYear" placeholder="请选择" size="small">
          <el-option v-for="item in years" :key="item.code" :value="item.code" :label="item.name">
          </el-option>
        </el-select>
      </div>
      <div style="margin-bottom:10px;">
        <el-select v-model="orgcode" placeholder="请选择" size="small">
          <el-option key="440000" value="440000" label="广东省"></el-option>
          <el-option v-for="city in citys" :key="city.code" :value="city.code" :label="city.name">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-select v-model="selectedInterpolation" placeholder="请选择" size="small" v-if="scinterpolation">
          <el-option v-for="item in scinterpolation" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </div>
      <el-input type="text" placeholder="标题" v-model="sctitle" size="small"
                style="margin:10px 10px 10px 0;width:200px;">
      </el-input>
      <div class="m-title" style="border-color:transparent;">图层设置</div>
      <!-- <el-checkbox v-for="item in layerData" style="width:50%;margin-left:0;"  @change="changeLayerShow(item)" true-label="1" false-label="0" v-model="item.flag" :checked="item.flag=='1'">
        {{item.layername}}
      </el-checkbox> -->
      <ul class="layers">
        <li v-for="item in layerData">
          <el-checkbox true-label="1" false-label="0" :checked="item.flag=='1'" v-model="item.flag"
                       @change="changeLayerFlag">{{item.layername}}
          </el-checkbox>
        </li>
      </ul>
      <div class="m-title" style="border-color:transparent;">色标设置</div>
      <div>
        最大值:
        <el-input v-model="scmaxvalue" readonly size="mini" style="width:28%"></el-input>
        最小值:
        <el-input v-model="scminvalue" readonly size="mini" style="width:28%"></el-input>
        阀&nbsp;&nbsp;值 :
        <el-input v-model="scinterval" size="mini" style="width:30%;margin-top:10px;"></el-input>

      </div>
      <div class="m-symbols-color" style="padding-top:8px;"><!--v-if="showColor"-->
        色&nbsp;&nbsp;标 :
        <!-- <colorramp style="display:inline-block;margin-left:10px;line-height:18px;"></colorramp> -->
      </div>
      <div>
        <colorbar ref="colorbar" :min="scminvalue" :max="scmaxvalue" :interval="scinterval" :inputcolors="sccolors"></colorbar>
      </div>
      <br/>
      <el-button type="primary" size="small" @click="getSuferChart" style="width:61px"><span class="el-icon-loading" v-show="isDrawing"></span><span v-show="!isDrawing">绘图</span></el-button>
      <el-button type="success" size="small">下载</el-button>
    </el-aside>
  </el-container>
</template>

<script>
  import {mapState} from 'vuex';
  import config from '@/lib/config.js';
  import LayerService from '@/service/LayerService'
  import mapService from '@/service/mapService'
  import statService from '@/service/statService'
  import maplegend from '@/components/public/maplegend';
  import colorbar from '@/components/public/colorbar';
  import areaService from '@/service/areaService';
  import commService from '@/service/commonService'
  const tableName = "muldaypg";
  const surferElm = [
      {
        "name":"统计值",
        "code":"elevalue"},
      {
        "name":"常年值",
        "code":"pervalue"},
      {
        "name":"距平(百分率)",
        "code":"departure"}
		];
  export default {
    name: "clayer3",
    props: ['query', 'params'],
    components: {maplegend,colorbar},
    computed: {

    },

    watch: {
      legendData(val){
        if(val){
          var arr=[];
          val.forEach((item)=>{
            arr.push(item.fillColor);
          });
          this.sccolors=arr;
        }
      },
      selectedYear(val){
        if(!val){
          this.scminvalue=null;
          this.scmaxvalue=null;
        };
        var stData=this.query.periodData.statisticsList;
        var minData=null;
        var maxData=null;
        for(let i=0;i<stData.length;i++){
          if(stData[i].staname=="最小值"){
            minData=stData[i][val];
          }else if(stData[i].staname=='最大值'){
            maxData=stData[i][val];
          }
        }
        this.scminvalue=minData;
        this.scmaxvalue=maxData;
        axios.get("agros/qhzxsp/getSymbolJson.do",{params:{'jsonInitVo.ele':this.query.ele,'jsonInitVo.max':this.scmaxvalue,'jsonInitVo.min':this.scminvalue}}).then(res=>{
          var data=res.data;
          this.scinterval=data.interval;
          this.symbollist=data.symbollist;
          this.symbollist.forEach((item) => {
          this.scsymbols.push(item.fillColor);
          });
          this.legendData=this.symbollist;
        })
      }

    },
    created() {
      this.years=surferElm;

      this.selectedYear=this.years[0].code;
      //获取绘图算法
      statService.getInterpolationVo().then((data) => {
        this.scinterpolation = data;
        this.selectedInterpolation = this.scinterpolation[0].code;
        /* this.surferVo={
          ele:this.years[0],
          orgcode:"440000",
          title:"",
          interpolation:this.selectedInterpolation
        } */
      })
      commService.getClientOrgInfo().then(data=>{
        areaService.get(data.code).then(citys=>{
          console.log(citys)
          this.citys=citys.children;
          setTimeout(()=>{
            document.getElementById("cmap").innerHTML = "";
            this.init()
          })
        });
      })

    },
    async mounted() {
        var val=this.query;
        this.sctitle=val.title;
        this.scsymbols = [];


      /* this.$nextTick(()=>{
        var val=this.query;
        this.sctitle=val.title;
        this.scmaxvalue = val.maxvalue;
        this.scminvalue = val.minvalue;
        this.scinterval = val.interval;
        this.scsymbols = [];
        this.query.symbollist.forEach((item) => {
          this.scsymbols.push(item.fillColor);
        });
        document.getElementById("cmap").innerHTML = "";
        this.init()
      }); */
    },
    data() {
      return {
        selectedInterpolation: null,
        isShowInterpolation: true,
        isDrawing:false,
        scinterpolation: [],
        sctitle: "",
        scmaxvalue: null,
        scminvalue: null,
        scinterval: null,
        sccolors: [],
        selectedLayers: [],
        layerData: [],
        legendData: [],
        legendShow: false,
        citys:[],
        selectedYear:null,
        orgcode:"440000"
      };
    },
    methods: {
      async init() {
        var map = mapService.createMap({target: "cmap"});
        this.layerService = new LayerService({map: map});
        await this.layerService.get2Render(null, this.orgcode.regioncode);
        this.renderStationLayer(this.query.statype);
        this.layerData = this.layerService.layerData;//图层控制
        //var data = await this.renderMap();
        //this.sctitle = data.docs[0].title;
        this.setSysflag()
      },
      async getSuferChart() {
       var queryStr =
          'climateQueryVo.rsyear=' + this.query.rsyear + "&" +
          'climateQueryVo.reyear=' + this.query.reyear + "&" +
          'climateQueryVo.sdate=' + this.query.sdate + "&" +
          'climateQueryVo.edate=' + this.query.edate + "&" +
          'climateQueryVo.ele=' + this.query.ele + "&" +
          'climateQueryVo.datetype=' + this.query.datetype + "&" +
          'climateQueryVo.pertype=' + this.query.pertype + "&" +
          'climateQueryVo.peryear=' + this.query.peryear + "&" +
          'climateQueryVo.statistic=' + this.query.statistic + "&" +
          'climateQueryVo.cqmin=' + this.query.cqmin + "&" +
          'climateQueryVo.cqmax=' + this.query.cqmax + "&" +
          'climateQueryVo.cqflag=' + this.query.cqflag + "&" +
          'climateQueryVo.statype=' + this.query.statype + "&" +
          'cclimateQueryVo.stacodes=' + this.query.stacodes + "&" +
          'climateQueryVo.cqtype=' + this.query.cqtype+"&"+
          'climateQueryVo.isLoading='+'false'+'&'+

          'surferVo.stype='+'climate'+'&'+
          'surferVo.layers='+'titleLayer,titleLayer,titleLayer,Overlays,cityLayer,surferLayer,provinceLayer,oceanLayer,hnLayer'+'&'+
          'surferVo.orgcode='+this.orgcode+'&'+
          'surferVo.ele='+this.selectedYear+'&'+
          'surferVo.interpolation='+this.selectedInterpolation+'&'+
          'surferVo.interval='+this.scinterval+'&'+
          'surferVo.rgb='+encodeURIComponent(this.$refs.colorbar.colors.join(","))
        if(this.isDrawing){
          return;
        }
        this.isDrawing=true;
        try{
          var res = await axios.get(config.baseUrl + "qhzxsp/getSurferJson.do?"+queryStr);
          res = {docs: [res.data]};
          this.layerService.renderMapData(res);
          this.legendData=res.docs[0].symboljson && JSON.parse(res.docs[0].symboljson);
        }finally{
          this.isDrawing=false;
        }
        return res.data;
      },
      setSysflag() {
        var titleLayer = this.layerService.layers["titleLayer"];
        this.layerData.forEach((e) => {
          if (e.layerename != "Overlays") {
            if (e.layerename == "titleLayer") {
              var id = '';
              var feature = null;
              if (e.layername == '标题') {
                id = 'titlePt';
              } else if (e.layername == '发布日期') {
                id = 'datePt';
              } else if (e.layername == '发布单位') {
                id = 'subtitlePt';
              }
              var feature = titleLayer.layer.getSource().getFeatureById(id);
              if (e.flag == "1") {
                if (feature) {
                  var text = feature.get("text");
                  feature.getStyle().getText().setText(text);
                }
              } else {
                if (feature) {
                  feature.set("text", feature.getStyle().getText().getText());
                  feature.getStyle().getText().setText("");
                }
              }

            } else {
              if (this.layerService.layers[e.layerename]) {
                if (e.flag == "1") {
                  this.layerService.layers[e.layerename].layer.setVisible(true)
                } else {
                  this.layerService.layers[e.layerename].layer.setVisible(false)
                }
              }
            }
          } else {
            if (e.flag == "1") {
              this.legendShow = true;
            } else {
              this.legendShow = false;
            }
          }
        })
      },
      //图层控制函数
      changeLayerFlag() {
        this.setSysflag();
      },
      async renderStationLayer(stationType) {
        var stationLayerItem = this.layerService.getLayerItemByName("stationLayer");
        this.layerService.layers.stationLayer.render(await this.layerService.getLayerData(stationLayerItem, {statype: stationType}), stationLayerItem)
      }
    }
  }

</script>

<style lang="css" scoped>
  .layers li {
    float: left;
    width: 125px;
  }

  .layers:after {
    display: block;
    content: "";
    clear: both;
  }

  .m-symbols{

  }
  .m-symbols li{
    width:20px;
    height:20px;
    float:left;
  }
</style>
