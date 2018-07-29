<template>
  <div class="m-doc">
    <div class="m-map-title">
      <b>本周关注({{weekStartDate}}~{{weekEndDate}})</b>
      <span class="f-fr u-date-tips" style="font-size:12px;"><b>{{currentDate}} 【农历{{solarDay2}}】  {{weekDay}}</b></span>
    </div>
    <div class="m-map">
      <homemap :start="weekStartDate" :end="weekEndDate" @change="changeDate"></homemap>
    </div>
    <div class="m-home-list" style="background:white;">
      <div class="m-home-list-title">农业气候条件概况</div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="m-home-list-item" v-if="muleteJson">
            <MTab :data="muleteJson"></MTab>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="m-home-list-item" v-if="cropperiodJson">
            <MTab :data="cropperiodJson"></MTab>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="m-home-list-item" v-if="cgsuitableJson">
            <MTab :data="cgsuitableJson"></MTab>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <div class="m-home-list-item" v-if="fasuitableJson">
            <MTab :data="fasuitableJson"></MTab>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="m-home-list-item" v-if="amdisasterJson">
            <MTab :data="amdisasterJson"></MTab>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="m-home-list-item" v-if="soilmoistureJson">
            <MTab :data="soilmoistureJson"></MTab>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import MTab from '@/components/public/MTab.vue';
  import homemap from '@/components/homemap';
  import Axios from 'axios';
  import dayjs from 'dayjs'
  import Tool from '../lib/tool.js'
  var config = require('../lib/config.js');
  var baseUrl = config.baseUrl;
  export default {
    name: "home", //数值预报
    components: {
      MTab,
      homemap
    },
    computed: {
      ...mapState([
        'orgInfo',
      ])
    },
    created() {
      this.getOptions(this.$store.state.orgInfo);
    },
    data() {
      return {
        currentDate: Tool.CurrentTime(),
        solarDay2: Tool.solarDay2(),
        weekDay: Tool.weekday(),
        dialogVisible: false,
        weekStartDate: dayjs().startOf('week').format('YYYY.MM.DD'),
        weekEndDate: dayjs().endOf('week').format('YYYY.MM.DD'),
        muleteJson: null,
        cropperiodJson: null,
        cgsuitableJson: null,
        fasuitableJson: null,
        amdisasterJson: null,
        soilmoistureJson: null
      };
    },
    methods: {
      changeDate:function(opt){
        this.weekStartDate=dayjs(opt.startDate).format('YYYY.MM.DD');
        this.weekEndDate=dayjs(opt.endDate).format('YYYY.MM.DD');
      },
      getOptions(orgInfo) {
        //var currentDate = new Date();
        var _this = this;
        var params = {
          weekStartDate: this.weekStartDate,
          weekEndDate: this.weekEndDate
        };
        function getMuleleJson() {
          return axios.get(baseUrl + '/getAgroImageVoByType.do?code=' + orgInfo.code + '&type=Mulele');
        }
        function getCropPeriodJson() {
          return axios.get(baseUrl + '/getAgroImageVoByType.do?code=' + orgInfo.code + '&type=CropPeriod');
        }
        function getCgsuitableJson() {
          return axios.get(baseUrl + '/getAgroImageVoByType.do?code=' + orgInfo.code + '&type=Cgsuitable');
        }
        function getFasuitableJson() {
          return axios.get(baseUrl + '/getAgroImageVoByType.do?code=' + orgInfo.code + '&type=Fasuitable');
        }
        function getAmdisasterJson() {
          return axios.get(baseUrl + '/getAgroImageVoByType.do?code=' + orgInfo.code + '&type=Amdisaster');
        }

        function getSoilmoistureJson() {
          return axios.get(baseUrl + '/getAgroImageVoByType.do?code=' + orgInfo.code + '&type=Soilmoisture');
        }

        Axios.all([getMuleleJson(), getCropPeriodJson(), getCgsuitableJson(), getFasuitableJson(), getAmdisasterJson(), getSoilmoistureJson()])
          .then(Axios.spread(function (muleteJson, cropperiodJson, cgsuitableJson, fasuitableJson, amdisasterJson, soilmoistureJson) {
            params.muleteJson = muleteJson.data;
            params.cropperiodJson = cropperiodJson.data;
            params.cgsuitableJson = cgsuitableJson.data;
            params.fasuitableJson = fasuitableJson.data;
            params.amdisasterJson = amdisasterJson.data;
            params.soilmoistureJson = soilmoistureJson.data;
            _this.changeOptions(params);
          }))

      },
      changeOptions(params) {
        for (var p in params) {
          this[p] = params[p];
        }
      }
    }
  }
</script>

<style lang="css" scoped>
  .m-doc {
    width: 1200px;
    margin: 10px auto;
  }

  .m-map-title {
    font-size: 18px;
    height: 40px;
    line-height: 40px;
    background: #f5f9f7;
    color: #186da3;
  }

  .m-map {
    width: 100%;
    height: 630px;
  }
  .m-home-list-title{
    height: 40px;
    margin-top: 10px;
    color: #0E6BAE;
    font-weight: bold;
    border-bottom: 1px solid #dddddd;
    padding: 8px;
    width: 100%;
    font-size: 14px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin-bottom:5px;
  }
</style>
