<template>
  <div>
    <div class="m-stat-header">
      <div class="u-bar u-white f-bb1 " style="height:60px;line-height:60px;">
        <ul v-if="eles" class="m-eles">
          <label class="u-label">要素 ：</label>
          <li v-for="item in eles" :data-value="item.value" :class="selectedEle==item.value?'f-active':''"
              @click="changeEle(item.value)">{{item.text}}
          </li>
        </ul>
      </div>
      <div class="u-bar u-white f-bb1 ">
        <label class="u-label">年份 ：</label>
        <ul>
          <li>
            <el-select v-model="syear" placeholder="请选择" size="mini" style="width:90px;">
              <el-option v-for="item in syears" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
            -
            <el-select v-model="eyear" placeholder="请选择" size="mini" style="width:90px;">
              <el-option v-for="item in eyears" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </li>
          <li style="margin-right:0;">
            <label  class="u-label" style="float:none;margin:0;padding:0;">日期 ：</label>
            <el-date-picker format="MM-dd" size="mini" v-model="sdate" type="date" placeholder="选择日期">
            </el-date-picker>
            -
            <el-date-picker format="MM-dd" size="mini" v-model="edate" type="date" placeholder="选择日期">
            </el-date-picker>
          </li>
          <li>
          </li>
        </ul>
      </div>
      <div class="u-bar u-white ">
        <label class="u-label">统计值：</label>
        <ul v-if="statistics">
          <li style="margin-right:5px;" v-for="item in statistics" :data-value="item.value"
              :class="selectedStatistic==item.value?'f-active':(item.disabled?'disabled':'')"
              @click="handlerselectedStatistic">{{item.text}}
          </li>
          <li style="margin-left:0px;margin-right:0;">
            <el-checkbox v-model="selectedCqFlag">条件查询：</el-checkbox>
            <el-select v-if="ups" :disabled="!selectedCqFlag" v-model="selectedUp" placeholder="请选择" size="mini"
                       style="width:90px;">
              <el-option v-for="item in ups" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
            -
            <el-select :disabled="!selectedCqFlag" v-model="selectedDown" placeholder="请选择" size="mini"
                       style="width:90px;" v-if="downs">
              <el-option v-for="item in downs" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </li>
          <li style="margin-left:-6px;margin-right:0;">
            <label class="u-label" style="float:none">日数：</label>
            <el-select v-model="selectedCqType" placeholder="请选择" size="mini" style="width:90px;" v-if="downs">
              <el-option v-for="item in  cqtypes" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="showDialogTable">站点</el-button>
            <el-button type="primary" size="mini" @click="changeOptions">数据</el-button>
            <el-button type="primary" size="mini" @click="showDzx">等值线图</el-button>
          </li>
        </ul>
      </div>
    </div>
    <div class="m-list u-white" v-if="climateStatisticsVo">
      <el-table :data="climateStatisticsVo.climateList" style="width: 100%" border>
        <el-table-column :prop="item.value" :label="item.text" v-for="item in tableColumns">
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="站点选择" :visible.sync="dialogTableVisible">
      <cstacodeselect @hide="hideDialogTable" @changeStacodes="changeStacodes"></cstacodeselect>
    </el-dialog>
  </div>
</template>

<script>
  import ccalendar from '@/components/public/CCalendar.vue'
  import cstacodeselect from '@/components/public/CStacodeSelect.vue'
  //极端天气
  const Qs = require('query-string');
  var config = require('../lib/config.js');
  var baseUrl = config.baseUrl;
/*
  var numArr = [-9999,];
  for (var i = -9999; i < 9999; i++) {
    numArr.push(i);
  }
*/

  var currentYear = new Date().getFullYear();
  var syears = [],
    eyears = [];
  for (var i = currentYear - 11+1; i > 1995; i--) {
    syears.push(i);
  }
  for (var i = currentYear - 1+1; i > 1995; i--) {
    eyears.push(i);
  }

  var conditions = [{
    data: [0, 10, 30],
    selectedCondition: "0"
  },
    {
      data: [35],
      selectedCondition: "35"
    },
    {
      data: [-9999],
      selectedCondition: "-9999"
    },
    {
      data: [0.1, 10, 25, 38, 50],
      selectedCondition: "0.1"
    },
    {
      data: [17.2],
      selectedCondition: "17.2"
    },
    {
      data: [40],
      selectedCondition: "40"
    },
    {
      data: [1000],
      selectedCondition: "1000"
    },
    {
      data: [90],
      selectedCondition: "90"
    },
    {
      data: [5],
      selectedCondition: "5"
    },
    {
      data: [9999],
      selectedCondition: "9999"
    },
    {
      data: [2],
      selectedCondition: "2"
    },
    {
      data: [10],
      selectedCondition: "10"
    }
  ];


  var eles = [{
    "text": "平均气温",
    value: "T"
  }, {
    "text": "最高气温",
    value: "T_MAX"
  }, {
    "text": "最低气温",
    value: "T_MIN"
  },
    {
      "text": "日照时数",
      value: "S"
    }, {
      "text": "20时日雨量",
      value: "R"
    }, {
      "text": "08时日雨量",
      value: "R08"
    },
    {
      "text": "极大风速",
      value: "FJS"
    }, {
      "text": "最大风速",
      value: "FZS"
    }, {
      "text": "平均地温",
      value: "D"
    },
    {
      "text": "最高地温",
      value: "D_MAX"
    }, {
      "text": "最低气压",
      value: "P_MIN"
    }, {
      "text": "平均气压",
      value: "P"
    },
    {
      "text": "平均能见度",
      value: "V"
    }, {
      "text": "最低能见度",
      value: "V_MIN"
    }, {
      "text": "对湿度",
      value: "U"
    },
  ];

  var stats = [{
    "text": "平均值 ",
    value: "AVE",
    disabled: false
  }, {
    "text": "最大值 ",
    value: "MAX",
    disabled: true
  },
    {
      "text": "最小值 ",
      value: "MIN",
      disabled: false
    }, {
      "text": "累计值 ",
      value: "SUM",
      disabled: false
    }
  ];


  function changeStat(value) {
    for (var i = 0; i < stats.length; i++) {
      if (value.indexOf(stats[i].value) != -1)
        stats[i].disabled = true;
      else
        stats[i].disabled = false;
    }

    return stats;
  }

  export default {
    name: "statyear",
    components: {
      ccalendar,
      cstacodeselect
    },
    data() {
      return {
        eles: null,
        sdate: new Date(new Date().getTime() - 10 * 24 * 3600 * 1000).Format("MM-dd"),
        edate: new Date(new Date().getTime()).Format("MM-dd"),
        syear: new Date().getFullYear() - 10,
        eyear: new Date().getFullYear(),
        syears: syears,
        eyears: eyears,
        selectedEle: null,
        statistics: null,
        downs: null,
        selectedDown: null,
        ups: null,
        selectedUp: null,
        selectedCqFlag: false,
        selectedStatistic: null,
        cqtypes: [{
          value: "days",
          text: "日数"
        }, {
          value: "ele",
          text: "要素"
        }],
        selectedCqType: "ele",
        statype: "1", //默认国家站
        tableColumns: null,
        climateStatisticsVo: null,
        stationTypeInfo: null,
        surfstation: null,
        stationList: null,
        dialogTableVisible: false,
        stacodes: ""
      };
    },
    created() {
      this.getOptions();
    },
    mounted() {
      this.changeOptions();
    },
    methods: {
      getStat() {
        var _this = this;

        if (this.selectedEle == "T" || this.selectedEle == "P" || this.selectedEle == "V" || this.selectedEle == "U" || this.selectedEle == "D") {
          this.statistics = changeStat("SUM");
          this.selectedStatistic = "AVE";

        }

        if (this.selectedEle == "T_MAX" || this.selectedEle == "D_MAX") {
          this.statistics = changeStat("SUM")
          this.selectedStatistic = "MAX";

        }

        if (this.selectedEle == "T_MIN" || this.selectedEle == "P_MIN" || this.selectedEle == "V_MIN") {
          if (this.selectedEle == "T_MIN") {
            this.statistics = changeStat("SUM")
          } else {
            this.statistics = changeStat("SUM,MAX")
          }

          this.selectedStatistic = "MIN";
        }

        if (this.selectedEle == "S" || this.selectedEle == "R" || this.selectedEle == "R08") {
          this.statistics = changeStat("MIN")
          this.selectedStatistic = "SUM";
        }

        if (this.selectedEle == "FJS" || this.selectedEle == "FZS") {
          this.statistics = changeStat("MIN,SUM")
          this.selectedStatistic = "MAX";
        }
        _this.changeUps();

      },

      changeUps() {
        if (this.selectedEle == "T") {
          this.ups = conditions[0].data;
          this.selectedUp = conditions[0].selectedCondition;
        }

        if (this.selectedEle == "T_MAX") {
          this.ups = conditions[1].data;
          this.selectedUp = conditions[1].selectedCondition;
        }


        if (this.selectedEle == "T_MIN" || this.selectedEle == "S" || this.selectedEle == "V_MIN" || this.selectedEle == "V") {
          this.ups = conditions[2].data;
          this.selectedUp = conditions[2].selectedCondition;
        }
        if (this.selectedEle == "R" || this.selectedEle == "08") {
          this.ups = conditions[3].data;
          this.selectedUp = conditions[3].selectedCondition;
        }
        if (this.selectedEle == "FJS" || this.selectedEle == "FZS") {
          this.ups = conditions[4].data;
          this.selectedUp = conditions[4].selectedCondition;
        }

        if (this.selectedEle == "D" || this.selectedEle == "D_MAX") {
          this.ups = conditions[5].data;
          this.selectedUp = conditions[5].selectedCondition;
        }

        if (this.selectedEle == "P" || this.selectedEle == "P_MIN") {
          this.ups = conditions[6].data;
          this.selectedUp = conditions[6].selectedCondition;
        }

        if (this.selectedEle == "U") {
          this.ups = conditions[7].data;
          this.selectedUp = conditions[7].selectedCondition;
        }
        this.changeDowns();

      },

      changeDowns() {
        if (this.selectedEle == "T_MIN") {
          this.downs = conditions[8].data;
          this.selectedDown = conditions[8].selectedCondition;
        } else if (this.selectedEle == "S") {
          this.downs = conditions[10].data;
          this.selectedDown = conditions[10].selectedCondition;
        } else if (this.selectedEle == "V" || this.selectedEle == "V_MIN") {
          this.downs = conditions[11].data;
          this.selectedDown = conditions[11].selectedCondition;
        } else {
          this.downs = conditions[9].data;
          this.selectedDown = conditions[9].selectedCondition;
        }
      },
      changeEle: function (val) {
        this.selectedEle =val;
        this.getStat();
      },
      changeSelectedDataType: function (e) {
        var value = e.target.dataset.value;
        this.selectedDataType = value

      },
      showDialogTable() {
        this.dialogTableVisible = true;
      },
      hideDialogTable() {
        this.dialogTableVisible = false;
      },
      showDzx(){

      },
      handlerselectedStatistic(e) {
        if(e.target.dataset.disabled)return;
        var value = e.target.dataset.value;
        this.selectedStatistic = value;
      },
      changeStacodes(e) {
        this.statype = e.statype;
        this.stacodes = e.stacodes.join(",");
        this.hideDialogTable();
      },
      getOptions() {
        var selectedEle = "T";
        this.eles = eles;
        this.selectedEle = selectedEle;
        this.getStat();
      },
      changeOptions() {
        var _this = this;
        var tableColumns = [{
          text: "站号",
          value: "stacode"
        }, {
          text: "站名",
          value: "staname"
        }];

        var len = this.eyear - this.syear;
        for (var i = 0; i <= len; i++) {
          var dateBefore = this.syear + i;
          tableColumns.push({
            "text": dateBefore + "年",
            "value": dateBefore + ""
          });
        }

        tableColumns.push({
          "value": "avg",
          "text": "平均值"
        }, {
          "value": "max",
          "text": "最大值"
        }, {
          "value": "min",
          "text": "最小值"
        });

        _this.getStatYearList(function (climateStatisticsVo) {
          var tempc = [],
            temps = [];
          for (var j = 0; j < climateStatisticsVo.climateList.length; j++) {
            var obj = {};
            for (var p in climateStatisticsVo.climateList[j]) {
              if (p != "values") {
                obj[p] = climateStatisticsVo.climateList[j][p]
              } else {
                for (var i = 0; i < climateStatisticsVo.climateList[j].values.length; i++) {
                  if (climateStatisticsVo.climateList[j].values[i].text == "最大值") {
                    obj.max = climateStatisticsVo.climateList[j].values[i].value;
                  } else if (climateStatisticsVo.climateList[j].values[i].text == "最小值") {
                    obj.min = climateStatisticsVo.climateList[j].values[i].value;
                  } else if (climateStatisticsVo.climateList[j].values[i].text == "平均值") {
                    obj.avg = climateStatisticsVo.climateList[j].values[i].value;
                  } else {
                    obj[climateStatisticsVo.climateList[j].values[i].text] = climateStatisticsVo.climateList[j].values[i].value;
                  }
                }
              }
            }

            tempc.push(obj);
          }


          for (var j = 0; j < climateStatisticsVo.statisticsList.length; j++) {
            var obj = {};
            for (var p in climateStatisticsVo.statisticsList[j]) {
              if (p != "values") {
                obj[p] = climateStatisticsVo.statisticsList[j][p]
              } else {
                for (var i = 0; i < climateStatisticsVo.statisticsList[j].values.length; i++) {
                  if (climateStatisticsVo.statisticsList[j].values[i].text == "最大值") {
                    obj.max = climateStatisticsVo.statisticsList[j].values[i].value;
                  } else if (climateStatisticsVo.statisticsList[j].values[i].text == "最小值") {
                    obj.min = climateStatisticsVo.statisticsList[j].values[i].value;
                  } else if (climateStatisticsVo.statisticsList[j].values[i].text == "平均值") {
                    obj.avg = climateStatisticsVo.statisticsList[j].values[i].value;
                  } else {
                    obj[climateStatisticsVo.statisticsList[j].values[i].text.replace("年", "")] = climateStatisticsVo.statisticsList[j].values[i].value;
                  }
                }
              }
            }

            tempc.push(obj);
          }

          _this.tableColumns = tableColumns;
          //此处得重新处理
          _this.climateStatisticsVo = {
            "climateList": tempc
          };


        });

      },
      getStatYearList(cb) {
        var _this = this;
        var queryStr = "climateYearsQueryVo.cqflag=" + _this.selectedCqFlag + "&climateYearsQueryVo.cqmax=" + _this.selectedDown +
          "&climateYearsQueryVo.cqmin=" + _this.selectedUp + "&climateYearsQueryVo.cqtype=" + _this.selectedCqType +
          "&climateYearsQueryVo.edate=" + _this.edate + "&climateYearsQueryVo.ele=" + _this.selectedEle +
          "&climateYearsQueryVo.eyear=" + _this.eyear + "&climateYearsQueryVo.sdate=" + _this.sdate +
          "&climateYearsQueryVo.stacodes=" + _this.stacodes + "&climateYearsQueryVo.statistic=" + _this.selectedStatistic +
          "&climateYearsQueryVo.statype=" + _this.statype + "&climateYearsQueryVo.syear=" + _this.syear;

        // console.log(query);
        var url = baseUrl + "getClimateYearsStatisticsVoJson.do?";
        url = url + queryStr;
        var _this = this;
        // console.log("statyear list:" + url);
        this.$axios.get(url).then(res => {
          cb(res.data)
        });
      }
    }
  }
</script>

<style lang="css" scoped>
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 150px;
  }

  .m-stat-header {
    background: #fff;
  }

  .m-stat-header .u-bar {
    display: table;
  }

  .m-stat-header .u-bar .u-label,
  .m-stat-header .u-bar ul {
    display: inline-block;
    float: left;
  }

  .m-eles li {
    display: inline;
    float: left;
    margin-right: 8px;
    white-space: nowrap;
    line-height: 20px;
    margin-top: 10px;
  }

  .u-label {
    padding: 10px;
  }

  .m-list {
    max-height: 660px;
    margin-top: 10px;
    padding: 10px
  }
</style>
