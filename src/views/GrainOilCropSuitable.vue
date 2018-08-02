<template>
  <div style="width:100%">
    <div class="m-stat-header">
      <div class="u-bar u-white f-bb1 " style="height:60px;line-height:60px;">
        <ul v-if="eles" class="m-eles">
          <label for="m-element" class="u-label">粮油作物 ：</label>
          <li v-for="(item,index) in eles" :data-index="index" :data-value="item.value"
              :class="selectedEle==item.value?'f-active':''" @click="changeEle">{{item.text}}
          </li>
        </ul>
      </div>
      <div class="u-bar u-white f-bb1 ">
        <label for="m-element" class="u-label">日期 ：</label>
        <ul>

          <li style="margin-right:0;">
            <el-date-picker format="yyyy-MM-dd" size="mini" v-model="sDate" type="date" placeholder="选择日期"
                            @change="sDateChange">
            </el-date-picker>
            -
            <el-date-picker format="yyyy-MM-dd" size="mini" v-model="eDate" type="date" placeholder="选择日期"
                            @change="eDateChange">
            </el-date-picker>
          </li>
          <label for="m-element" class="u-label">站点：</label>
          <li v-for="item in stationtypeData" :class="item.value==selectedStationType?'f-active':''"
              :data-value="item.value" @click="changeStationType">
            {{item.text}}
          </li>
          <label for="m-element" class="u-label">间隔：</label>
          <li>
            <el-select v-model="selectedInterval" placeholder="请选择" size="mini" v-if="intervals">
              <el-option v-for="item in  intervals" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </li>
          <li>
            <el-button type="primary" size="mini" @click="changePlayState">{{!isPlay?"播放":"暂停"}}</el-button>
            <el-button type="success" size="mini" @click="showDialogTable">数据</el-button>
          </li>
        </ul>


      </div>
    </div>
    <div class="m-list u-white" style="padding:5px;">
      <div class="m-image-tab" v-show="imageVo!=null&&imageVo.length>0">
        <div class="m-left">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="分布图" name="first">
              <swiper :options="swiperOptionTop" class="gallery-top swiper-main" ref="swiperTop">
                <swiper-slide v-for="item in imageVo">
                  <div>
                    <div>
                      <img class="imageVoItem" :src="item.original"/>
                    </div>
                    <p>{{item.desc}}</p>
                  </div>
                </swiper-slide>
                <div class="swiper-button-next" slot="button-next"></div>
                <div class="swiper-button-prev" slot="button-prev"></div>
              </swiper>
              <!-- thumbs desc-->
              <!-- <swiper :options="swiperOptionDesc" class="gallery-desc" ref="swiperDesc">
                       <swiper-slide v-for="item in imageVo">

                       </swiper-slide>
               </swiper>-->
              <!-- swiper2 Thumbs -->
              <swiper :options="swiperOptionThumbs" class="gallery-thumbs" ref="swiperThumbs">
                <swiper-slide v-for="item in imageVo">
                  <img :src="item.thumbnail"/>
                </swiper-slide>
              </swiper>

            </el-tab-pane>
            <el-tab-pane label="矢量图" name="second">配置管理</el-tab-pane>
          </el-tabs>
        </div>
        <div class="m-right">
          <div class="m-title">图片产品目录 <span class="m-download" @click="downImages">下载</span></div>
          <div style="height:calc(100% - 40px)" v-bar>
            <ul>
              <li v-for="(item,index) in imageVo" @click="changeImageIndex(index)" :data-index="index">{{item.text}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div v-show="imageVo==null||imageVo.length==0" class="m-image-tab" style="text-align:center">暂无数据</div>
    </div>
    <el-dialog title="数据统计" :visible.sync="dialogTableVisible" width="80%">
      <el-table :data="tableList" style="width: 100%;" border max-height="500">
        <el-table-column :prop="item.value" :label="item.text" v-for="item in tableColumns" width="86">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import config from '../lib/config.js';
  import dayjs from 'dayjs';
  import Timer from '@/service/Timer';
  import commonService from '@/service/commonService';

  var baseUrl = config.baseUrl;
  export default {
    name: "grainoilcropsuitable", //粮油作物
    data() {
      return {
        eles: null,
        selectedEle: null,
        statisticsVo: null,
        imageVo: [],
        dialogTableVisible: false,
        tableList: [],
        tableColumns: [],
        sDate: null,
        eDate: null,
        activeName: "first",
        stationtypeData: [{
          text: "国家站",
          value: 1
        }, {
          text: "区域站",
          value: 2
        }, {
          text: "格点",
          value: 3
        }],
        selectedStationType: 1,
        intervals: [{
          text: "0.5秒",
          value: 500
        },
          {
            text: "1秒",
            value: 1000
          },
          {
            text: "2秒",
            value: 2000
          },
          {
            text: "3秒",
            value: 3000
          },
          {
            text: "4秒",
            value: 4000
          },
          {
            text: "5秒",
            value: 5000
          },
        ],
        selectedInterval: 500,
        timer:new Timer({interval:this.selectedInterval}),
        isPlay: false,
        swiperOptionTop: {
          spaceBetween: 10,
          height: 500,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        },
        swiperOptionDesc: {
          spaceBetween: 10,
          touchRatio: 0.2,
          height: 30
        },
        swiperOptionThumbs: {
          spaceBetween: 10,
          centeredSlides: true,
          slidesPerView: 'auto',
          touchRatio: 0.2,
          slideToClickedSlide: true,
          height: 130
        }
      };
    },
    computed: {
      ...mapState([
        'orgInfo',
      ]),
    },
    created() {
      this.getOptions();
    },
    watch:{
      selectedInterval:function(val){
        this.timer&&(this.timer.interval=val);
      }
    },
    mounted() {
      this.$nextTick(() => {
        //swiper之间的绑定
        const swiperTop = this.$refs.swiperTop.swiper;
        const swiperThumbs = this.$refs.swiperThumbs.swiper;
        swiperTop.controller.control = swiperThumbs;
        swiperThumbs.controller.control = swiperTop;
        this.timer.on((index)=>{
          if(swiperTop.activeIndex>=swiperTop.slides.length-1){
            swiperTop.slideTo(0);
          }else{
            swiperTop.slideNext();
          }

        })
      });
    },
    methods: {
      getOptions() {
        var _this = this;
        this.$axios.get(baseUrl + "/getAgrForecastEleVoListByType.do?type=GrainOilCropSuitable").then(res => {
          _this.eles = res.data;
          res.data.forEach(function (e) {
            if (e.defaultflag) {
              _this.selectedEle = e.value;
              _this.sDate = e.defaultstartdate;
              _this.eDate = e.defaultenddate;
            }
          });
          _this.doQuery();
        });
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      sDateChange(value) {
        this.sDate = value;
        var _this = this;
        this.$nextTick(() => {
          _this.doQuery()
        });
      },
      eDateChange(value) {
        this.eDate = value;
        var _this = this;
        this.$nextTick(() => {
          _this.doQuery()
        });
      },
      changeImageIndex(index) {
        //跳转到哪张图
        var index = index;
        this.$refs.swiperTop.swiper.slideTo(index, 1000, false);
      },
      changeEle(e) {
        var index = e.target.dataset.index;
        var obj = this.eles[index];
        this.selectedEle = obj.value;
        this.sDate = obj.defaultstartdate;
        this.eDate = obj.defaultenddate;
        var _this = this;
        this.$nextTick(() => {


          _this.doQuery()
        });
      },
      changeStationType(e) {
        var value = e.target.dataset.value;
        this.selectedStationType = value;
        var _this = this;
        this.$nextTick(() => {
          _this.doQuery()
        });
      },
      changePlayState() {
        var _this = this;
        _this.isPlay = !_this.isPlay;
        if (_this.isPlay && _this.$refs.swiperTop) {
          this.timer.start();
          //_this.$refs.swiperTop.swiper.autoplay.start();
          //_this.$refs.swiperThumb.swiper.autoplay.start();
          //_this.$refs.swiperDesc.swiper.autoplay.start();
        } else {
          this.timer.stop();
          //_this.$refs.swiperTop.swiper.autoplay.stop();
          //_this.$refs.swiperThumb.swiper.autoplay.stop();
          //_this.$refs.swiperDesc.swiper.autoplay.stop();
        }

      },
      getAgrForecastImageVosByQueryVo() {
        var axios = this.$axios,
          _this = this;
        _this.sDate = dayjs(_this.sDate).format("YYYY-MM-DD");
        _this.eDate = dayjs(_this.eDate).format("YYYY-MM-DD");
        var url = baseUrl + "getAgrForecastImageVosByQueryVo.do?queryVo.eletype=" + _this.selectedEle + "&queryVo.enddate=" + _this.eDate +
          "&queryVo.orgcode=" + _this.orgInfo.code + "&queryVo.startdate=" + _this.sDate + "&queryVo.stationtype=" + _this.selectedStationType + "&queryVo.type=GrainOilCropSuitable";
        axios.get(url).then(res => {
          _this.imageVo = res.data;
          _this.imageVo.forEach(function (e) {
            e.original = "/static/images/" + e.url;
            e.thumbnail = "/static/images/" + e.thumbnailurl;
            e.desc = e.mark;
          });

        });
      },
      getAgrForecastInfoStatisticsVoByQueryVo() {
        var axios = this.$axios,
          _this = this;
        _this.sDate = dayjs(_this.sDate).format("YYYY-MM-DD");
        _this.eDate = dayjs(_this.eDate).format("YYYY-MM-DD");
        var url = baseUrl + "/getAgrForecastInfoStatisticsVoByQueryVo.do?queryVo.eletype=" + _this.selectedEle + "&queryVo.enddate=" + _this.eDate +
          "&queryVo.orgcode=" + _this.orgInfo.code + "&queryVo.startdate=" + _this.sDate + "&queryVo.stationtype=" + _this.selectedStationType + "&queryVo.type=GrainOilCropSuitable";
        var tableList = [],
          tableColumns = [{
            value: "stacode",
            text: "站点"
          }, {
            value: "staname",
            text: "站名"
          }];
        axios.get(url).then(res => {
          _this.statisticsVo = res.data;
          _this.statisticsVo.infoList.forEach(function (e, index) {
            var obj = {
              stacode: e.stacode,
              staname: e.staname
            };
            e.values.forEach(function (v) {
              obj[v.date] = v.value;
              if (index == 0) {
                tableColumns.push({
                  value: v.date,
                  text: v.date
                });
              }
            });
            tableList.push(obj);
            if (index == 0) {
              _this.tableColumns = tableColumns;
            }
          });


          _this.statisticsVo.statisticsList.forEach(function (e, index) {
            var obj = {
              stacode: e.stacode,
              staname: e.staname
            };
            e.values.forEach(function (v) {
              obj[v.date] = v.value;

            });
            tableList.push(obj);

          });
          _this.tableList = tableList;
        });
      },
      showDialogTable() {
        this.dialogTableVisible = true;
        this.tableList=[];
        this.getAgrForecastInfoStatisticsVoByQueryVo();
      },
      hideDialogTable() {
        this.dialogTableVisible = false;
      },
      doQuery() {
        var _this = this;
        _this.getAgrForecastImageVosByQueryVo();
        _this.getAgrForecastInfoStatisticsVoByQueryVo();
      },
      downImages(){
        var _this=this;
        _this.sDate = dayjs(_this.sDate).format("YYYY-MM-DD");
        _this.eDate = dayjs(_this.eDate).format("YYYY-MM-DD");
        var url = baseUrl + "AgrForecastInfoQueryVo.do?eletype=" + _this.selectedEle + "&enddate=" + _this.eDate +
          "&orgcode=" + _this.orgInfo.code + "&startdate=" + _this.sDate + "&stationtype=" + _this.selectedStationType + "&type=gocrops";
        commonService.download({url:url});
      }
    }
  }
</script>
<style lang="css" scoped>
  .imageVoItem {
    width: 100%;
    min-height: 430px;
  }

  .el-select {
    width: 100px;
  }

  .m-right li {
    cursor: pointer;
  }

  .m-right li:hover {
    background: #ececec;
  }

  .m-image-tab {
    width: 100%;
    min-height: 650px;
    position:relative;
  }
  .m-image-tab p{
    font-weight:700;
    font-size:12px;
    padding:5px 0;
  }
  .m-image-tab .m-left {
    display: inline-block;
    width: 700px;
  }

  .m-image-tab .m-right {
    display: block;
    float: right;
    width: 230px;
    border-left: 10px solid #F2F5F5;
    height: 100%;
    overflow: hidden;
    position:absolute;
    top:0;
    right:0;
  }

  .m-image-tab .m-right ul li {
    padding: 5px;
  }
  .m-title {
    height: 38px;
    line-height: 38px;
  }

  .m-title::before {
    top: 13px;
  }
</style>
