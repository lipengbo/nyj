<template>
  <el-container>
    <el-main style="padding:10px;position:relative;">
      <!--<img :src="scimgUrl" v-if="scimgUrl" style="height:750px;width:100%;" />-->
      <div id="cmap" style="height:100%;width:100%;"></div>
      <maplegend name="" :data="legendData" v-show="legendShow"></maplegend>
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
      <el-checkbox-group v-model="selectedLayers" @change="changeLayerShow">
        <el-checkbox v-for="item in sclayers" style="width:50%;margin-left:0;" :label="item.code" :checked="item.flag=='1'">
          {{item.layername}}
        </el-checkbox>
      </el-checkbox-group>
      <div class="m-title" style="border-color:transparent;">色标设置</div>
      <div>
        最大值:
        <el-input v-model="scmaxvalue" size="mini" style="width:28%"></el-input>
        最小值:
        <el-input v-model="scminvalue" size="mini" style="width:28%"></el-input>
        阀&nbsp;&nbsp;值 :
        <el-input v-model="scinterval" size="mini" style="width:30%;margin-top:10px;"></el-input>

      </div>
      <div class="m-symbols-color" style="padding-top:8px;"><!--v-if="showColor"-->
        <!--<ul v-if="rgbVo">
          <li v-for="(item,index) in rgbVo.rgb" :style="'background:#'+item" @click="changeSymbols"
              :data-index="index"></li>
        </ul>-->
        色&nbsp;&nbsp;标 :<colorramp style="display:inline-block;margin-left:10px;line-height:18px;"></colorramp>
      </div>
      <div class="m-symbols">
        <ul v-if="scsymbols">
          <li v-for="item in scsymbols" :style="'background:#'+item" @click="handlerShowColor"></li>
        </ul>
      </div>
      <br/>
      <el-button type="primary" size="small" @click="getSuferChart">绘图</el-button>
      <el-button type="success" size="small" @click="getDownload">下载</el-button>
    </el-aside>
  </el-container>
</template>

<script>
  import {mapState} from 'vuex';
  import config from '@/lib/config.js';
  import colorramp from '@/components/public/colorRamp'
  import LayerService from '@/service/LayerService'
  import mapService from '@/service/mapService'
  import statService from '@/service/statService'
  import maplegend from '@/components/public/maplegend';
  export default {
    name: "clayer2",
    props: ['query', 'keyTable'],
    components:{colorramp,maplegend},
    computed:{
      ...mapState([
        'orgInfo',
      ]),
    },
    created() {
      //获取绘图算法
      statService.getInterpolationVo().then((data)=>{
        this.scinterpolation=data;
      })
    },
    async mounted(){
      var map=mapService.createMap({target:"cmap"});
      this.layerService = new LayerService({map:map});
      this.layerService.getMMapCgLayerinfo(this.orgInfo.code).then((data)=>{
        this.sclayers=data;
      });
      await this.layerService.get2Render();
      this.layerData = this.layerService.layerData;
      this.renderStationLayer(this.query.selectedStationType);
    },
    data() {
      return {
        selectedInterpolation:null,
        isShowInterpolation:true,
        scinterpolation:[],
        sctitle:"",
        selectedLayers:[],
        sclayers:[],
        legendData:[],
        legendShow:false,
      };
    },
    methods: {
      //图层控制函数
      changeLayerShow(selectedLayers){
        console.log(selectedLayers);
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
      async renderStationLayer(stationType) {
        var stationLayerItem = this.layerService.getLayerItemByName("stationLayer");
        this.layerService.layers.stationLayer.render(await this.layerService.getLayerData(stationLayerItem, {statype: stationType}), stationLayerItem)
      },
    }
  }
</script>

<style lang="css" scoped>

</style>
