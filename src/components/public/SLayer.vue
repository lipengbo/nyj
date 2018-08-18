<template>
  <el-container>
    <el-main style="padding:10px;">
      <!--<img :src="scimgUrl" v-if="scimgUrl" style="height:750px;width:100%;" />-->
      <div id="smap" style="height:100%;width:100%;"></div>
    </el-main>
    <el-aside width="250px" class="m-layer-aside">
      <div class="m-title" style="border-color:transparent;">绘图设置</div>
      <el-select v-model="selectedInterpolation" placeholder="请选择" size="small" v-if="scinterpolation">
        <el-option v-for="item in scinterpolation.items" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
      <el-input type="text" placeholder="标题" v-model="sctitle" size="small"
                style="margin:10px 10px 10px 0;width:200px;">
      </el-input>
      <div class="m-title" style="border-color:transparent;">图层设置</div>
      <el-checkbox-group v-model="selectedLayers">
        <el-checkbox v-for="item in sclayers" style="width:50%;margin-left:0;" :key="item.code" :label="item.code">
          {{item.name}}
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
  import config from '@/lib/config.js';
  import colorramp from '@/components/public/colorRamp'
  import ClayerService from '@/service/ClayerService'
  export default {
    name: "slayer",
    props: ['query', 'keyTable'],
    components:{colorramp},
    created() {
      this.getOptions(this.surferChartVo);
    },
    mounted(){
      this.clayerService = new ClayerService("smap");
    },
    data() {
      return {
        showColor: false,
        sclayers: null,
        scsymbols: null,
        scinterpolation: null,
        scimgUrl: null,
        rgbVo: null,
        sctitle: null,
        scmaxvalue: null,
        scminvalue: null,
        selectedInterpolation: null,
        scinterval: null,
        selectedLayers: []

      };
    },
    methods: {
      getOptions(data) {
        var _this = this,
          keyTable = this.keyTable,
          queryStr = this.query,
          paramStr = this.query.split("&");
        let url = "/" + keyTable + "/get" + keyTable.firstUpperCase() + "SurferChartVo.do?" + queryStr;
        let rgbvoUrl = "/" + keyTable + "/getRgbVo.do";
        paramStr.forEach(function (e) {
          var arr = e.split("=");
          if (keyTable == "climateBackgroun" && arr[0] == "ele") {
            rgbvoUrl = rgbvoUrl + "?ele=" + arr[1]
          }
        });
        function getSurferChartVo() {
          return axios.get(config.baseUrl + url);
        }

        function getRgbVo() {
          return axios.get(config.baseUrl + rgbvoUrl);
        }

        axios.all([getSurferChartVo(), getRgbVo()])
          .then(axios.spread(function (surferChartVo, rgbVo) {
            var data = surferChartVo.data;
            _this.surferChartVo = data;
            _this.rgbVo = rgbVo.data;

            _this.sclayers = data.layers;
            var selectedLayers = [];

            _this.sclayers.forEach(element => {
              if (element.checked) {
                selectedLayers.push(element.code);
              }
            });
            _this.selectedLayers = selectedLayers;
            _this.scinterpolation = data.interpolation;
            _this.selectedInterpolation = data.interpolation.selectedCode;
            _this.scsymbols = data.symbols;
            _this.scinterval = data.interval;
            _this.scmaxvalue = data.maxValue;
            _this.scminvalue = data.minValue;
            _this.sctitle = data.title;
            _this.scimgUrl = data.imgUrl;
          }))
      },
      handlerShowColor() {
        this.showColor = !this.showColor;
      },
      getDownload() {
        var _this = this;
        var triggerDownload = $("<a>").attr("href", _this.scimgUrl).attr("download", new Date().Format("yyyy-MM-dd") + '.png').appendTo("body");
        triggerDownload[0].click();
        triggerDownload.remove();
      },
      changeSymbols(e) {
        var tempIndex = Number(e.target.dataset.index);
        var rgb = this.rgbVo.rgb;
        var rgbLength = this.rgbVo.rgb.length;
        var length = Math.ceil((this.scmaxvalue - this.scminvalue) / this.scinterval);
        //  console.log(tempIndex,rgbLength,length)
        if ((tempIndex + length) < rgbLength) {
          var symbols = rgb.slice(tempIndex, tempIndex + length);
          this.scsymbols = symbols
        } else {
          var tempFirst = rgb.slice(tempIndex, rgbLength);
          var tempSecond = rgb.slice(0, (length - (rgbLength - tempIndex)));
          var symbols = tempFirst.concat(tempSecond);
          this.scsymbols = symbols

        }
        this.showColor = false;
      },
      getSuferChart() {
        let _this = this,
          axios = this.$axios;
        let layers = _this.selectedLayers.join(",");
        let keyTable = _this.keyTable;
        let queryStr = _this.queryStr,
          str = '',
          paramsStr = _this.queryStr.split("&");
        paramsStr.forEach(function (e) {
          var arr = e.split("=");
          str += "chartInfoVo." + arr[0] + "=" + arr[1] + "&";
        });
        axios.get(config.baseUrl + "/" + keyTable + "/executeSuferChart.do?" + str + "chartInfoVo.interpolation=" + _this.selectedInterpolation +
          "&chartInfoVo.title=" + _this.sctitle + "chartInfoVo.layers=" + layers + "&chartInfoVo.maxValue=" + _this.scmaxvalue +
          "chartInfoVo.minValue=" + _this.scminvalue + "&chartInfoVo.interval=" + _this.scinterval + "&chartInfoVo.symbols=" + _this.scsymbols.join(",")).then((response) => {
          _this.scimgUrl = response.data.imgUrl;
        });
      }
    }
  }
</script>

<style lang="css" scoped>

</style>
