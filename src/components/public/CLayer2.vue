<template>
  <el-container>
    <el-main style="padding:10px;position:relative;">
      <!--<img :src="scimgUrl" v-if="scimgUrl" style="height:750px;width:100%;" />-->
      <div id="cmap" style="height:100%;width:100%;"></div>
      <maplegend name="图例" :data="legendData" v-show="legendShow"></maplegend>
    </el-main>
    <el-aside width="250px" class="m-layer-aside">
      <div class="m-title" style="border-color:transparent;">绘图设置</div>
      <el-select v-model="selectedInterpolation" placeholder="请选择" size="small" v-if="scinterpolation">
        <el-option v-for="item in scinterpolation" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
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

  const tableName = "muldaypg";
  export default {
    name: "clayer2",
    props: ['query', 'params'],
    components: {maplegend,colorbar},
    computed: {
      ...mapState([
        'orgInfo',
      ]),
    },
    created() {
      //获取绘图算法
      statService.getInterpolationVo().then((data) => {
        this.scinterpolation = data;
        this.selectedInterpolation = this.scinterpolation[0].code;
      })
    },
    watch: {
      /*query(val) {
        this.$nextTick(()=>{
          this.scmaxvalue = val.maxvalue;
          this.scminvalue = val.minvalue;
          this.scinterval = val.interval;
          this.scsymbols = [];
          this.query.symbollist.forEach((item) => {
            this.scsymbols.push(item.fillColor);
          });
          document.getElementById("cmap").innerHTML = "";
          this.init()
        });
      },*/
      legendData(val){
        if(val){
          var arr=[];
          val.forEach((item)=>{
            arr.push(item.fillColor);
          });
          this.sccolors=arr;
        }
      }
    },
    async mounted() {
      this.$nextTick(()=>{
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
      });
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
      };
    },
    methods: {
      async init() {
        var map = mapService.createMap({target: "cmap"});
        this.layerService = new LayerService({map: map});
        await this.layerService.get2Render(null, this.params.regioncode);
        this.layerData = this.layerService.layerData;//图层控制
        var data = await this.renderMap();
        this.sctitle = data.docs[0].title;
        this.renderStationLayer(this.params.stationtype);
      },
      async getSuferChart() {
       var queryStr =
          'muldaySurferVo.ddate=' + this.params.ddate + "&" +
          'muldaySurferVo.ele=' + this.query.value + "&" +
          'muldaySurferVo.interval=' + this.scinterval + "&" +
          'muldaySurferVo.layers=' + 'titleLayer' + "&" +
          'muldaySurferVo.layers=' + 'titleLayer' + "&" +
          'muldaySurferVo.layers=' + 'titleLayer' + "&" +
          'muldaySurferVo.layers=' + 'Overlays' + "&" +
          'muldaySurferVo.layers=' + 'cityLayer' + "&" +
          'muldaySurferVo.layers=' + 'surferLayer' + "&" +
          'muldaySurferVo.layers=' + 'provinceLayer' + "&" +
          'muldaySurferVo.layers=' + 'oceanLayer' + "&" +
          'muldaySurferVo.layers=' + 'hnLayer' + "&" +
          'muldaySurferVo.orgcode=' + this.params.regioncode + "&" +
          'muldaySurferVo.stationtype=' + this.params.stationtype + "&" +
          'muldaySurferVo.title=' + this.sctitle + "&" +
          'muldaySurferVo.type=' + 'Mulele';
        this.$refs.colorbar.colors.forEach((item) => {
          queryStr += "&" + 'muldaySurferVo.rgb=' + encodeURIComponent(item)
        });
       /*  var queryjson={
          'muldaySurferVo.ddate': this.params.ddate ,
          'muldaySurferVo.ele' : this.query.value ,
          'muldaySurferVo.interval': this.scinterval ,
          'muldaySurferVo.layers' : ['titleLayer', 'titleLayer','titleLayer','Overlays','cityLayer','surferLayer','provinceLayer','oceanLayer','hnLayer'],
          'muldaySurferVo.orgcode' : this.params.regioncode ,
          'muldaySurferVo.stationtype' : this.params.stationtype ,
          'muldaySurferVo.title' : this.sctitle,
          'muldaySurferVo.type' :'Mulele',
          "muldaySurferVo.rgb":this.sccolors
        }; */
        if(this.isDrawing){
          return;
        }
        this.isDrawing=true;
        try{
          var res = await axios.get(config.baseUrl + "qhzxsp/meteMuldaySurfer.do?"+queryStr);
          res = {docs: [res.data]};
          this.layerService.renderMapData(res);
          this.legendData=res.docs[0].symboljson && JSON.parse(res.docs[0].symboljson);
        }finally{
          this.isDrawing=false;
        }
        return res.data;
      },
      async renderMap() {//初始进来的时候调用这个方法
        var _this = this;
        var res = await _this.layerService.get2RenderMapData({
          table: tableName,
          id: "" + this.params.regioncode + this.params.ddate + this.query.value + this.params.stationtype
        });
        _this.legendData = res.docs[0].symboljson && JSON.parse(res.docs[0].symboljson);
        _this.setSysflag();
        return res;
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
