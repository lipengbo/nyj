<template>
  <div style="width:100%" class="nq">
    <div class="m-stat-header">
      <div class="u-bar u-white f-bb1 " style="height:60px;line-height:60px;">
        <ul v-if="eles" class="m-eles">
          <label class="u-label">粮油作物 ：</label>
          <li v-for="(item,index) in eles" :data-index="index" :data-value="item.value"
              :class="selectedEle==item.value?'f-active':''" @click="changeEle">{{item.text}}
          </li>
        </ul>
      </div>
      <div class="u-bar u-white f-bb1 ">
        <label class="u-label">日期 ：</label>
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
          <label class="u-label">站点：</label>
          <li v-for="item in stationtypeData" :class="item.value==selectedStationType?'f-active':''"
              :data-value="item.value" @click="changeStationType">
            {{item.text}}
          </li>
          <label class="u-label">间隔：</label>
          <li>
            <el-select v-model="selectedInterval" placeholder="请选择" size="mini" v-if="intervals">
              <el-option v-for="item in  intervals" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </li>
          <li>
            <el-button type="primary" size="mini" @click="changePlayState(isPlay=!isPlay)">{{!isPlay?"播放":"暂停"}}</el-button>
            <el-button type="success" size="mini" @click="showDialogTable">数据</el-button>
          </li>
        </ul>


      </div>
    </div>
    <div class="m-list u-white" style="padding:0">
      <div class="m-image-tab" v-show="imageVo!=null&&imageVo.length>0">
        <div class="m-left">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="分布图" name="first">
              <div style="heihgt:610px">
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
              </div>
            </el-tab-pane>
            <el-tab-pane label="矢量图" name="second">
              <div style="height:610px;position:relative;">
                <div id="gmap" style="width:100%;height:100%;"></div>
                <div class="gmap_opt">
                  <div @click="preIndex()"><i class="el-icon-arrow-left"></i></div>
                  <div @click="nextIndex()"><i class="el-icon-arrow-right"></i></div>
                  <div class="layerBox" :class="{'active':layerMenuShow}">
                    <span @click="changeMenusShow">图层</span>
                    <div class="layerMenus" :class="{'open':layerMenuShow}">
                      <ul>
                        <li v-for="item in layerData">
                          <el-checkbox true-label="1" false-label="0" :checked="item.flag=='1'" v-model="item.flag"
                                       @change="changeLayerFlag(item)">{{item.layername}}
                          </el-checkbox>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <maplegend name="适宜度" :data="legendData" v-show="legendShow"></maplegend>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="m-right">
          <div class="m-title">图片产品目录 <span class="m-download" @click="downImages">下载</span></div>
          <div style="height:calc(100% - 40px)" v-bar>
            <ul v-show="imageVo&&imageVo.length>0">
              <li v-for="(item,index) in imageVoReverse" @click="changeImageIndex(imageVoReverse.length-1-index)" :data-index="index">
                {{item.text}}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-show="imageVo==null||imageVo.length==0" class="m-image-tab" style="text-align:center">暂无数据</div>
    </div>
    <el-dialog title="数据统计" :visible.sync="dialogTableVisible" width="80%">
      <div style="height:500px">
        <el-table :data="tableList" style="width: 100%;" border max-height="500">
          <el-table-column :prop="item.value" :label="item.text" v-for="item in tableColumns" width="86">
          </el-table-column>
        </el-table>

      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import config from '../lib/config.js';
  import dayjs from 'dayjs';
  import Timer from '@/service/Timer';
  import commonService from '@/service/commonService';
  import mapService from '@/service/mapService';
  import LayerService from '@/service/LayerService';
  import maplegend from '@/components/public/maplegend';

  var baseUrl = config.baseUrl;
  var dataName = "GrainOilCropSuitable";
  const slideInterval = 0;
  export default {
    name: "grainoilcropsuitable", //粮油作物
    components: {
      maplegend
    },
    data() {
      var _this = this;
      return {
        eles: null,
        selectedEle: null,
        statisticsVo: null,
        imageVo: [],
        currentIndex: 0,
        layerData: [],
        dialogTableVisible: false,
        tableList: [],
        tableColumns: [],
        sDate: null,
        eDate: null,
        layerService: {},
        layerMenuShow: false,
        legendData: [],
        legendShow: false,
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
        timer: new Timer({interval: 500}),
        isPlay: false,
        swiperOptionTop: {
          speed:slideInterval,
          spaceBetween: 10,
          height: 500,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          on: {
            slideChangeTransitionEnd: function () {
              _this.currentIndex = this.activeIndex;
            }
          }
        },
        swiperOptionThumbs: {
          speed:slideInterval,
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
      imageVoReverse: function () {
        var val = this.imageVo;
        var arr = [];
        if (val && val.length > 0) {
          for (var i = 0; i < val.length; i++) {
            arr.unshift(val[i])
          }
        }
        return arr;
      }
    },
    created() {
      this.getOptions();
    },
    watch: {
      selectedInterval: function (val) {
        if (this.activeName === "first") {//如果是走马灯形式展示的话，就加上走马灯的过渡时间
          this.timer && (this.timer.interval = val + this.slideInterval);
        } else {
          this.timer && (this.timer.interval = val);
        }
      }
    },
    mounted() {
      this.$nextTick(async () => {
        //swiper之间的绑定
        const swiperTop = this.$refs.swiperTop.swiper;
        const swiperThumbs = this.$refs.swiperThumbs.swiper;
        swiperTop.controller.control = swiperThumbs;
        swiperThumbs.controller.control = swiperTop;
        this.timer.on((index) => {
          if (swiperTop.activeIndex >= swiperTop.slides.length - 1) {
            this.changeImageIndex(0)
          } else {
            this.changeImageIndex(swiperTop.activeIndex + 1)
          }
        });
        //矢量图层
        this.map = mapService.createMap({target: "gmap"});
        this.layerService = new LayerService({map: this.map});
        await this.layerService.get2Render();
        this.layerData = this.layerService.layerData;
        this.renderStationLayer(this.selectedStationType);
      });
    },
    methods: {
      getOptions() {
        var _this = this;
        axios.get(baseUrl + "/getAgrForecastEleVoListByType.do?type=" + dataName).then(res => {
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
      changeMenusShow(e) {
        this.layerMenuShow = !this.layerMenuShow;
        e.preventDefault();
      },
      handleClick(tab, event) {
        if (tab.name === "second") {
          this.$nextTick(() => {
            this.changeImageIndex(this.currentIndex);
            this.map.updateSize();
          })
        } else if (tab.name === 'first') {
          this.$nextTick(() => {
            this.changeImageIndex({index: this.currentIndex, interval: 0});
          })
        }
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
      /**
       *
       * @param optOrIndex {Object|number}
       */
      changeImageIndex(optOrIndex) {
        if (typeof optOrIndex === "number") {
          optOrIndex = {index: optOrIndex};
        }
        if (optOrIndex.interval === undefined) {
          optOrIndex.interval = slideInterval;
        }
        //跳转到哪张图
        var index = optOrIndex.index;
        this.currentIndex = optOrIndex.index;
        if (optOrIndex.isSwiper !== false) {
          this.$refs.swiperTop.swiper && this.$refs.swiperTop.swiper.slideTo(index, optOrIndex.interval, false);
        }
        this.renderMap(this.imageVo[index].ddate);
      },
      nextIndex(isSwiper) {
        var _this = this;
        if (_this.currentIndex >= _this.imageVo.length - 1) {
          return;
        }
        _this.currentIndex += 1;
        this.changeImageIndex({index: _this.currentIndex, isSwiper: isSwiper})
      },
      preIndex(isSwiper) {
        var _this = this;
        if (_this.currentIndex <= 0) {
          return;
        }
        _this.currentIndex -= 1;
        this.changeImageIndex({index: _this.currentIndex, isSwiper: isSwiper})
      },
      changeEle(e) {
        var index = e.target.dataset.index;
        var obj = this.eles[index];
        this.selectedEle = obj.value;
        this.sDate = obj.defaultstartdate;
        this.eDate = obj.defaultenddate;
        this.$nextTick(() => {
          this.doQuery()
        });
      },
      changeStationType(e) {
        var value = e.target.dataset.value;
        this.selectedStationType = value;
        var _this = this;
        this.$nextTick(() => {
          _this.doQuery();
          _this.renderStationLayer(this.selectedStationType);
        });
      },
      /**
       * 改变播放的状态
       * @param state {boolean} true是播放，false是停止
       */
      changePlayState(state) {
        var _this = this;

        _this.isPlay = state;
        if (_this.isPlay && _this.$refs.swiperTop) {
          if(_this.imageVo&&_this.imageVo.length>0){
            this.timer.start();
          }else{
            this.$message.warning("暂无数据,无法播放");
          }
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
        var _this = this;
        _this.sDate = dayjs(_this.sDate).format("YYYY-MM-DD");
        _this.eDate = dayjs(_this.eDate).format("YYYY-MM-DD");
        var url = baseUrl + "getAgrForecastImageVosByQueryVo.do?queryVo.eletype=" + _this.selectedEle + "&queryVo.enddate=" + _this.eDate +
          "&queryVo.orgcode=" + _this.orgInfo.code + "&queryVo.startdate=" + _this.sDate + "&queryVo.stationtype=" + _this.selectedStationType + "&queryVo.type=" + dataName;
        return axios.get(url).then(res => {
          _this.imageVo = res.data.reverse();
          _this.imageVo.forEach(function (e) {
            e.original = config.resourceUrl+"images/" + e.url;
            e.thumbnail = config.resourceUrl+"/images/" + e.thumbnailurl;
            e.desc = e.mark;
          });
          console.log(_this.imageVo)
        });
      },
      getAgrForecastInfoStatisticsVoByQueryVo() {
        var _this = this;
        _this.sDate = dayjs(_this.sDate).format("YYYY-MM-DD");
        _this.eDate = dayjs(_this.eDate).format("YYYY-MM-DD");
        var url = baseUrl + "/getAgrForecastInfoStatisticsVoByQueryVo.do?queryVo.eletype=" + _this.selectedEle + "&queryVo.enddate=" + _this.eDate +
          "&queryVo.orgcode=" + _this.orgInfo.code + "&queryVo.startdate=" + _this.sDate + "&queryVo.stationtype=" + _this.selectedStationType + "&queryVo.type=" + dataName;
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
        this.tableList = [];
        this.getAgrForecastInfoStatisticsVoByQueryVo();
      },
      hideDialogTable() {
        this.dialogTableVisible = false;
      },
      async doQuery() {
        this.changePlayState(false);
        var _this = this;
        await _this.getAgrForecastImageVosByQueryVo();
        _this.getAgrForecastInfoStatisticsVoByQueryVo();
        if (_this.imageVo && _this.imageVo.length > 0) {
          _this.currentIndex = _this.imageVo.length - 1;
          //_this.renderMap(_this.imageVo[_this.currentIndex].ddate);
          this.$nextTick(() => {
            _this.changeImageIndex({index: _this.currentIndex, interval: 0});
          })
        }
      },
      async renderMap(ddate) {
        var _this = this;
        if (_this.imageVo && _this.imageVo.length > 0) {
          var res = await _this.layerService.get2RenderMapData({
            table: "agmepg",
            id: ""+_this.orgInfo.code+ddate+dataName+_this.selectedEle+ _this.selectedStationType
          });
          if (!_this.legendData || _this.legendData.length == 0) {//只有首次加载的时候
            _this.legendData = res.docs[0].symboljson && JSON.parse(res.docs[0].symboljson);
          }
          _this.setSysflag();
        }
      },
      downImages() {
        var _this = this;
        _this.sDate = dayjs(_this.sDate).format("YYYY-MM-DD");
        _this.eDate = dayjs(_this.eDate).format("YYYY-MM-DD");
        var url = baseUrl + "AgrForecastInfoQueryVo.do?eletype=" + _this.selectedEle + "&enddate=" + _this.eDate +
          "&orgcode=" + _this.orgInfo.code + "&startdate=" + _this.sDate + "&stationtype=" + _this.selectedStationType + "&type=gocrops";
        commonService.download({url: url});
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
        this.layerService.layers.stationLayer.render(await this.layerService.getLayerData(stationLayerItem, {statype: stationType,rows:2500}), stationLayerItem)
      },
      changeLayerFlag(item) {
        this.setSysflag();
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
    position: relative;
  }

  .m-image-tab p {
    font-weight: 700;
    font-size: 12px;
    padding: 5px 0;
  }

  .m-image-tab .m-left {
    display: inline-block;
    width: 710px;
  }

  .m-image-tab .m-right {
    display: block;
    float: right;
    width: 230px;
    border-left: 10px solid #F2F5F5;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
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

  .gmap_opt {
    position: absolute;
    z-index: 9;
    right: 0;
    top: 0;
    background: rgba(0, 0, 0, .5);
    color: white;
  }

  .gmap_opt > div {
    float: left;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    padding: 0 10px;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
  }

  .gmap_opt > div:hover {
    background: rgba(0, 0, 0, .7);
  }

  .el-icon-arrow-left, .el-icon-arrow-right {
    font-size: 22px;
    margin-top: 8px;
  }

  .layerBox {
    position: relative;
    overflow: visible !important;
    padding: 0 !important;
  }

  .layerBox > span {
    display: block;
    height: 100%;
    padding: 0 10px;
  }

  .layerBox.active {
    background: rgba(0, 0, 0, .7)
  }

  .layerMenus {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, .2);
    padding-bottom: 10px;
    display: none;
  }

  .layerMenus.open {
    display: block;
  }

  .layerMenus li {
    width: 116px;
    text-align: left;
    height: 30px;
    padding-left: 20px;
  }
  .m-download:hover{
    color:#409EFF;
    cursor:pointer;
  }
</style>
<style>
  .nq .el-tabs__header {
    margin-bottom: 0;
  }
</style>
