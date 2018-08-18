<template>
  <div style="width:100%">
    <div class="m-stat-header">
      <div class="u-bar u-white f-bb1 ">
        <label class="u-label">日期 ：</label>
        <ul>

          <li style="margin-right:0;">
            <el-date-picker format="yyyy-MM-dd" size="mini" v-model="sdate" type="date" placeholder="选择日期">
            </el-date-picker>

          </li>

          <label class="u-label">站点：</label>

          <li v-for="item in stationtypeData" :class="item.value==selectedStationType?'f-active':''"
              :data-value="item.value" @click="changeStationType">
            {{item.text}}
          </li>
          <label class="u-label">区域：</label>
          <li>
            <el-select v-model="selectedRegion" placeholder="请选择" size="mini" v-if="regionInfo" style="width:120px;">
              <el-option v-for="item in  regionInfo" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </li>
          <li>
            <el-button type="success" size="mini" @click="doQuery">数据</el-button>
          </li>
        </ul>
      </div>

    </div>

    <ul class="m-list-img" v-if="voImages">
      <li v-for="item in voImages">
        <img :src="resourceUrl+'images/'+item.url"/>
        <div class="m-list-img-shadow">
          <div class="m-btn">
            <el-button size="mini" type="primary" @click="showDraw(item)">绘图</el-button>
            <el-button size="mini" type="primary" @click="download(item)">下载</el-button>
          </div>
        </div>
      </li>
    </ul>
    <div class="m-list u-white" style="padding:5px;" v-if="voData&&voData.length>0">
      <el-table v-if="voData" :data="voData" style="width: 100%" border max-height="500">
        <el-table-column :prop="item.value" :label="item.text" v-for="item in tableColumns">
        </el-table-column>
      </el-table>
    </div>
    <div class="m-no-data" v-else>暂无数据</div>
    <el-dialog title="绘图窗口" :visible.sync="isLayerShow" width="90%" :close-on-click-modal="true" top="25px">
      <clayer2 style="height:80vh" :query="clayerQuery"></clayer2>
    </el-dialog>
  </div>
</template>

<script>
  //极端天气
  import {
    mapState,
  } from 'vuex';
  import dayjs from 'dayjs';
  import config from '@/lib/config'
  var baseUrl = config.baseUrl;
  import commonService from '@/service/commonService'
  import Clayer2 from "../components/public/CLayer2";
  export default {
    name: "statday",
    components: {Clayer2},
    computed: {
      ...mapState([
        'orgInfo',
      ]),
      clayerQuery(){
        return {
          stationtype:this.selectedStationType,
          regioncode:this.selectedRegion,

        }
      }
    },
    data() {
      return {
        isLayerShow:false,
        resourceUrl: config.resourceUrl,
        sdate: dayjs().format("YYYY-MM-DD"),
        stationtypeData: [{
          text: "国家站",
          value: 1
        }, {
          text: "区域站",
          value: 2
        }],
        selectedStationType: 1,
        regionInfo: null,
        selectedRegion: null,
        voData: null,
        voImages: null
      };
    },
    created() {
      this.getOptions(this.$store.state.orgInfo);
    },
    methods: {
      getOptions(orgInfo) {
        var _this = this;
        axios.get(baseUrl + "/getRegioninfo.do?orgcode=" + orgInfo.code).then(res => {
          _this.regionInfo = res.data;
          _this.selectedRegion = res.data[0].code;
          _this.doQuery();
        });
      },
      changeStationType(e) {
        var value = e.target.dataset.value;
        this.selectedStationType = value;
      },
      doQuery() {
        this.sdate = dayjs(this.sdate).format("YYYY-MM-DD");
        this.getVoData();
        this.getVoImages();
      },
      download(item) {
        var _self = this;
        commonService.download({url: config.resourceUrl + item.url}).then(function () {

        }).catch(function () {
          _self.$message({
            message: "下载失败!",
            type: 'error',
            duration: 1000
          });
        })
      },
      showDraw(item) {
        this.isLayerShow=true;
      },
      getVoData() {
        var _this = this;
        var query = {
          "meteEleMulDayQueryVo.ddate": this.sdate,
          "meteEleMulDayQueryVo.stationtype": this.selectedStationType,
          "meteEleMulDayQueryVo.regioncode": this.selectedRegion
        };
        // http: //192.168.31.20:8080/agros/qhzxsp/getMeteEleMulDayVosByQueryVo.do?meteEleMulDayQueryVo.ddate=2018-03-21&meteEleMulDayQueryVo.regioncode=440000&meteEleMulDayQueryVo.stationtype=1
        var url = baseUrl + "getMeteEleMulDayVosByQueryVo.do";
        var tableColumns = [{
          text: "站号",
          value: "stacode"
        }, {
          text: "站名",
          value: "staname"
        }, {
          text: "平均值",
          value: "t"
        },
          {
            text: "最大值",
            value: "tmax"
          },
          {
            text: "降水量",
            value: "r"
          },
          {
            text: "日照时间",
            value: "s"
          },
          {
            text: "最大风速",
            value: "fzs"
          }
        ];
        axios.get(url, {params: query}).then(res => {
          _this.voData = res.data;
          _this.voData = [
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 15.3,
              "tmax": 17.8,
              "tmin": 13.4,
              "r": 21.5,
              "s": 0.0,
              "fzs": 12.3
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 17.7,
              "tmax": 22.8,
              "tmin": 16.1,
              "r": 24.7,
              "s": 0.0,
              "fzs": 5.4
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 17.7,
              "tmax": 24.3,
              "tmin": 16.2,
              "r": 35.9,
              "s": 0.0,
              "fzs": 6.0
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 14.1,
              "tmax": 16.6,
              "tmin": 12.3,
              "r": 6.1,
              "s": 0.0,
              "fzs": 3.6
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 14.8,
              "tmax": 17.5,
              "tmin": 12.5,
              "r": 12.6,
              "s": 0.0,
              "fzs": 5.1
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 16.2,
              "tmax": 21.8,
              "tmin": 13.7,
              "r": 11.9,
              "s": 1.1,
              "fzs": 3.9
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 16.4,
              "tmax": 20.6,
              "tmin": 13.5,
              "r": 23.6,
              "s": 0.0,
              "fzs": 3.1
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 16.1,
              "tmax": 21.2,
              "tmin": 14.1,
              "r": 28.0,
              "s": 0.0,
              "fzs": 9.3
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 17.0,
              "tmax": 24.6,
              "tmin": 15.0,
              "r": 27.7,
              "s": 0.0,
              "fzs": 6.2
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 20.7,
              "tmax": 24.6,
              "tmin": 18.6,
              "r": 0.2,
              "s": 0.0,
              "fzs": 5.3
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 19.4,
              "tmax": 26.5,
              "tmin": 17.7,
              "r": 2.0,
              "s": 0.0,
              "fzs": 4.8
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 18.6,
              "tmax": 25.2,
              "tmin": 17.3,
              "r": 17.2,
              "s": 0.0,
              "fzs": 3.6
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 20.9,
              "tmax": 25.4,
              "tmin": 18.2,
              "r": 5.1,
              "s": 0.0,
              "fzs": 6.2
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 20.6,
              "tmax": 24.8,
              "tmin": 18.1,
              "r": 0.1,
              "s": 0.0,
              "fzs": 2.7
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 21.3,
              "tmax": 24.7,
              "tmin": 19.2,
              "r": 0.4,
              "s": 0.0,
              "fzs": 6.1
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 19.8,
              "tmax": 24.3,
              "tmin": 17.5,
              "r": 0.3,
              "s": 0.0,
              "fzs": 3.9
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 21.0,
              "tmax": 25.1,
              "tmin": 17.9,
              "r": 0.0,
              "s": 0.0,
              "fzs": 3.0
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 20.2,
              "tmax": 26.8,
              "tmin": 17.6,
              "r": 0.0,
              "s": 0.0,
              "fzs": 5.7
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 22.2,
              "tmax": 27.0,
              "tmin": 19.5,
              "r": 0.1,
              "s": 0.8,
              "fzs": 4.9
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 22.1,
              "tmax": 25.0,
              "tmin": 19.7,
              "r": 0.0,
              "s": 0.0,
              "fzs": 5.0
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 23.7,
              "tmax": 29.4,
              "tmin": 21.4,
              "r": 0.0,
              "s": 2.4,
              "fzs": 4.5
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 22.5,
              "tmax": 25.9,
              "tmin": 19.9,
              "r": 0.0,
              "s": 0.5,
              "fzs": 4.9
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 19.7,
              "tmax": 26.3,
              "tmin": 18.0,
              "r": 37.1,
              "s": 0.0,
              "fzs": 8.2
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 20.1,
              "tmax": 27.4,
              "tmin": 18.6,
              "r": 8.8,
              "s": 0.0,
              "fzs": 5.7
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 21.5,
              "tmax": 27.1,
              "tmin": 19.5,
              "r": 13.9,
              "s": 0.0,
              "fzs": 5.9
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 19.9,
              "tmax": 26.4,
              "tmin": 18.2,
              "r": 6.3,
              "s": 0.0,
              "fzs": 3.9
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 21.9,
              "tmax": 26.2,
              "tmin": 20.3,
              "r": 5.8,
              "s": 0.0,
              "fzs": 2.8
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 22.4,
              "tmax": 24.5,
              "tmin": 20.1,
              "r": 0.5,
              "s": 0.0,
              "fzs": 3.9
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 24.8,
              "tmax": 27.5,
              "tmin": 22.4,
              "r": 0.2,
              "s": 1.4,
              "fzs": 5.2
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 23.2,
              "tmax": 26.4,
              "tmin": 20.6,
              "r": 0.0,
              "s": 2.6,
              "fzs": 5.9
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 21.7,
              "tmax": 26.7,
              "tmin": 20.1,
              "r": 3.4,
              "s": 0.0,
              "fzs": 6.7
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 23.3,
              "tmax": 27.1,
              "tmin": 20.2,
              "r": 0.0,
              "s": 4.3,
              "fzs": 4.8
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 22.6,
              "tmax": 24.8,
              "tmin": 21.0,
              "r": 0.2,
              "s": 0.0,
              "fzs": 4.3
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 23.6,
              "tmax": 28.1,
              "tmin": 21.1,
              "r": 0.0,
              "s": 5.1,
              "fzs": 5.8
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 23.7,
              "tmax": 25.9,
              "tmin": 21.3,
              "r": 0.0,
              "s": 4.8,
              "fzs": 6.0
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 25.9,
              "tmax": 29.6,
              "tmin": 23.9,
              "r": 0.0,
              "s": 3.1,
              "fzs": 5.5
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 22.2,
              "tmax": 25.0,
              "tmin": 20.2,
              "r": 0.0,
              "s": 0.0,
              "fzs": 4.7
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 22.6,
              "tmax": 27.4,
              "tmin": 20.0,
              "r": 0.0,
              "s": 1.5,
              "fzs": 4.9
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 24.2,
              "tmax": 28.2,
              "tmin": 22.5,
              "r": 0.0,
              "s": 4.2,
              "fzs": 7.0
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.2,
              "tmax": 30.7,
              "tmin": 23.9,
              "r": 0.0,
              "s": 5.3,
              "fzs": 2.7
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 25.3,
              "tmax": 30.9,
              "tmin": 22.4,
              "r": 0.0,
              "s": 8.7,
              "fzs": 4.8
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 22.8,
              "tmax": 26.7,
              "tmin": 19.5,
              "r": 0.0,
              "s": 0.0,
              "fzs": 5.2
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 22.5,
              "tmax": 28.2,
              "tmin": 20.0,
              "r": 0.0,
              "s": 8.1,
              "fzs": 4.2
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 24.4,
              "tmax": 31.6,
              "tmin": 21.6,
              "r": 0.0,
              "s": 8.3,
              "fzs": 5.7
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 24.9,
              "tmax": 31.4,
              "tmin": 22.2,
              "r": 0.0,
              "s": 6.7,
              "fzs": 7.1
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 25.6,
              "tmax": 32.3,
              "tmin": 22.3,
              "r": 1.4,
              "s": 5.6,
              "fzs": 3.4
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 25.1,
              "tmax": 30.5,
              "tmin": 22.8,
              "r": 0.0,
              "s": 7.6,
              "fzs": 7.0
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.3,
              "tmax": 32.4,
              "tmin": 22.7,
              "r": 0.0,
              "s": 7.7,
              "fzs": 5.1
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 25.6,
              "tmax": 32.1,
              "tmin": 22.4,
              "r": 1.0,
              "s": 5.2,
              "fzs": 5.3
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.5,
              "tmax": 30.6,
              "tmin": 24.9,
              "r": 0.0,
              "s": 7.3,
              "fzs": 3.6
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.3,
              "tmax": 31.7,
              "tmin": 23.3,
              "r": 0.0,
              "s": 7.9,
              "fzs": 4.1
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.5,
              "tmax": 30.9,
              "tmin": 25.1,
              "r": 0.0,
              "s": 6.5,
              "fzs": 3.6
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 25.1,
              "tmax": 29.4,
              "tmin": 23.6,
              "r": 0.0,
              "s": 8.5,
              "fzs": 5.9
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 25.1,
              "tmax": 29.7,
              "tmin": 22.2,
              "r": 0.0,
              "s": 7.8,
              "fzs": 6.0
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 23.7,
              "tmax": 29.4,
              "tmin": 21.6,
              "r": 16.0,
              "s": 3.7,
              "fzs": 4.0
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 24.6,
              "tmax": 27.6,
              "tmin": 21.7,
              "r": 0.0,
              "s": 0.1,
              "fzs": 4.7
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.6,
              "tmax": 31.0,
              "tmin": 24.2,
              "r": 0.0,
              "s": 5.5,
              "fzs": 4.4
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 24.7,
              "tmax": 28.1,
              "tmin": 22.7,
              "r": 0.0,
              "s": 1.1,
              "fzs": 6.0
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 23.1,
              "tmax": 26.1,
              "tmin": 21.4,
              "r": 0.0,
              "s": 0.0,
              "fzs": 4.7
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 23.8,
              "tmax": 26.7,
              "tmin": 21.7,
              "r": 0.0,
              "s": 3.4,
              "fzs": 4.5
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 24.8,
              "tmax": 29.4,
              "tmin": 23.0,
              "r": 0.0,
              "s": 3.4,
              "fzs": 3.6
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 25.4,
              "tmax": 28.2,
              "tmin": 23.2,
              "r": 0.0,
              "s": 4.4,
              "fzs": 7.2
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 25.1,
              "tmax": 30.4,
              "tmin": 22.6,
              "r": 0.0,
              "s": 4.3,
              "fzs": 4.7
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 25.4,
              "tmax": 30.2,
              "tmin": 23.3,
              "r": 0.0,
              "s": 2.6,
              "fzs": 5.1
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.2,
              "tmax": 29.4,
              "tmin": 23.8,
              "r": 0.0,
              "s": 2.6,
              "fzs": 5.1
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 25.8,
              "tmax": 29.4,
              "tmin": 23.9,
              "r": 0.0,
              "s": 3.4,
              "fzs": 2.4
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 25.9,
              "tmax": 30.0,
              "tmin": 23.0,
              "r": 0.0,
              "s": 4.6,
              "fzs": 3.7
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.0,
              "tmax": 30.2,
              "tmin": 23.6,
              "r": 0.0,
              "s": 5.2,
              "fzs": 5.1
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.6,
              "tmax": 30.2,
              "tmin": 24.4,
              "r": 0.4,
              "s": 7.9,
              "fzs": 3.8
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 25.1,
              "tmax": 30.8,
              "tmin": 22.0,
              "r": 0.0,
              "s": 4.2,
              "fzs": 4.4
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.8,
              "tmax": 30.7,
              "tmin": 23.9,
              "r": 0.0,
              "s": 4.4,
              "fzs": 3.5
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.4,
              "tmax": 32.5,
              "tmin": 23.6,
              "r": 36.8,
              "s": 8.8,
              "fzs": 4.3
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.2,
              "tmax": 30.9,
              "tmin": 24.0,
              "r": 0.0,
              "s": 7.9,
              "fzs": 5.1
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.1,
              "tmax": 31.3,
              "tmin": 22.8,
              "r": 0.0,
              "s": 7.7,
              "fzs": 4.6
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.4,
              "tmax": 31.5,
              "tmin": 24.0,
              "r": 0.0,
              "s": 10.4,
              "fzs": 5.4
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 25.5,
              "tmax": 31.5,
              "tmin": 22.3,
              "r": 0.0,
              "s": 5.0,
              "fzs": 2.2
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.2,
              "tmax": 31.1,
              "tmin": 23.6,
              "r": 0.0,
              "s": 7.3,
              "fzs": 5.2
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 27.2,
              "tmax": 30.7,
              "tmin": 24.6,
              "r": 0.0,
              "s": 8.5,
              "fzs": 3.6
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.3,
              "tmax": 29.1,
              "tmin": 24.2,
              "r": 0.0,
              "s": 9.6,
              "fzs": 5.1
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.5,
              "tmax": 29.7,
              "tmin": 24.6,
              "r": 0.0,
              "s": 9.5,
              "fzs": 6.4
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.3,
              "tmax": 31.1,
              "tmin": 23.0,
              "r": 0.0,
              "s": 7.0,
              "fzs": 4.1
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.2,
              "tmax": 30.2,
              "tmin": 23.6,
              "r": 0.0,
              "s": 6.1,
              "fzs": 4.8
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.5,
              "tmax": 30.0,
              "tmin": 23.9,
              "r": 0.0,
              "s": 8.1,
              "fzs": 5.1
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.2,
              "tmax": 28.8,
              "tmin": 23.9,
              "r": 0.0,
              "s": 8.2,
              "fzs": 6.0
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.2,
              "tmax": 29.5,
              "tmin": 24.3,
              "r": 0.0,
              "s": 8.7,
              "fzs": 5.7
            },
            {
              "stacode": "站号",
              "staname": "站名",
              "t": 26.5,
              "tmax": 30.4,
              "tmin": 23.8,
              "r": 0.0,
              "s": 10.3,
              "fzs": 4.6
            }
          ]

          _this.tableColumns = tableColumns;
        });
      },
      getVoImages() {
        var _this = this;
        var query = {
          "meteEleMulDayQueryVo.ddate": _this.sdate,
          "meteEleMulDayQueryVo.stationtype": _this.selectedStationType,
          "meteEleMulDayQueryVo.regioncode": _this.selectedRegion
        };

        var url = baseUrl + "getMeteEleMulDayImageVosByQueryVo.do";

        axios.get(url, {params: query}).then(res => {
          _this.voImages = res.data;
          _this.voImages = [{
            "text": "平均气温",
            "value": "t",
            "ddate": "2016-09-09",
            "url": "gis/mulele/tave/20160909/440000.png"
          }, {
            "text": "最高气温",
            "value": "tmax",
            "ddate": "2016-09-09",
            "url": "gis/mulele/tmax/20160909/440000.png"
          }, {
            "text": "最低气温",
            "value": "tmin",
            "ddate": "2016-09-09",
            "url": "gis/mulele/tmin/20160909/440000.png"
          }, {
            "text": "降水量",
            "value": "r",
            "ddate": "2016-09-09",
            "url": "gis/mulele/r/20160909/440000.png"
          }, {
            "text": "日照时数",
            "value": "s",
            "ddate": "2016-09-09",
            "url": "gis/mulele/s/20160909/440000.png"
          }, {"text": "日最大风速", "value": "fzs", "ddate": "2016-09-09", "url": "gis/mulele/fzs/20160909/440000.png"}]

        });

      }
    }
  }
</script>

<style lang="css" scoped>
  .m-no-data {
    text-align: center;
    height: 900px;
    background: #fff;
    padding: 10px;
  }

  .m-list-img {
    padding-top: 10px;
    width: 100%;
  }

  .m-list-img li {
    height: 218px;
    width: calc((100% - 20px) / 3);
    float: left;
    margin-right: 10px;
    position: relative;
    margin-bottom: 10px;
  }

  .m-list-img li:nth-child(3n) {
    margin-right: 0;
  }

  .m-list-img .m-list-img-shadow {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .1);
    opacity: 0;
    transition: opacity 0.5s;
  }

  .m-list-img li:hover .m-list-img-shadow {
    opacity: 1;
    display: block;
  }

  .m-list-img li .m-btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  .m-list-img li img {
    width: 100%;
    height: 100%;
  }
</style>
