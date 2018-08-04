<template>
        <el-main style="width:100%">
                <div class="m-stat-header">
                        <div class="u-bar u-white f-bb1 " style="height:60px;line-height:60px;">
                                <ul v-if="eles" class="m-eles">
                                        <label for="m-element" class="u-label">要素 ：</label>
                                        <li v-for="item in eles" :data-value="item.value" :class="selectedEle==item.value?'f-active':''" @click="changeEle">{{item.text}}</li>
                                </ul>
                        </div>
                        <div class="u-bar u-white f-bb1 ">
                                <label for="m-element" class="u-label">日历 ：</label>
                                <ul v-if="datetypes">
                                        <li v-for="item in datetypes" :data-value="item.value" :class="selectedDataType==item.value?'f-active':''" @click="changeSelectedDataType">{{item.text}}</li>
                                        <li style="margin-right:0;"> <label for="m-element" class="u-label" style="float:none;margin:0;padding:0;">日期 ：</label></li>
                                        <li>
                                                </el-date-picker>
                                                <ccalendar width="120px" :date="sdate" :lunar="selectedDataType?true:false" @select="changeSDate"></ccalendar>
                                                -
                                                <ccalendar width="120px" :date="edate" :lunar="selectedDataType?true:false" @select="changeEDate"></ccalendar>
                                        </li>
                                </ul>
                        </div>
                        <div class="u-bar u-white  f-bb1">
                                <label for="m-element" class="u-label">统计值：</label>
                                <ul v-if="statistics">
                                        <li v-for="item in statistics" :data-value="item.value" :class="selectedStatistic==item.value?'f-active':(item.disabled?'disabled':'')" @click="handlerselectedStatistic">{{item.text}}</li>
                                        <li style="margin-left:20px;margin-right:0;">
                                                <el-checkbox v-model="selectedCqFlag">条件查询：</el-checkbox>
                                        </li>
                                        <li style="margin-left:5px;">
                                                <el-select v-if="ups" :disabled="!selectedCqFlag" v-model="selectedUp" placeholder="请选择" size="mini" style="width:90px;">
                                                        <el-option v-for="item in ups" :key="item" :label="item" :value="item">
                                                        </el-option>
                                                </el-select>
                                                &gt;=
                                                <el-select :disabled="!selectedCqFlag" v-model="selectedDown" placeholder="请选择" size="mini" style="width:90px;" v-if="downs">
                                                        <el-option v-for="item in downs" :key="item" :label="item" :value="item">
                                                        </el-option>
                                                </el-select>
                                        </li>
                                        <li style="margin-left:20px;margin-right:0;">
                                                <label for="m-element" class="u-label" style="float:none">日数：</label>
                                                <el-select v-model="selectedCqType" placeholder="请选择" size="mini" style="width:90px;" v-if="downs">
                                                        <el-option v-for="item in  cqtypes" :key="item.value" :label="item.text" :value="item.value">
                                                        </el-option>
                                                </el-select>
                                        </li>
                                </ul>
                        </div>
                        <div class="u-bar u-white ">
                                <label for="m-element" class="u-label">同期：</label>
                                <ul>
                                        <li>
                                                <el-select v-model="selectedPerType" placeholder="请选择" size="mini" style="width:90px;" v-if="pertypes">
                                                        <el-option v-for="item in pertypes" :key="item.value" :label="item.text" :value="item.value">
                                                        </el-option>
                                                </el-select>
                                                <el-select v-model="selectedYear" placeholder="请选择" size="mini" style="width:90px;margin-left:10px;" v-if="selectedPerType=='year'">
                                                        <el-option v-for="item in years" :key="item" :label="item" :value="item">
                                                        </el-option>
                                                </el-select>
                                        </li>
                                        <li>
                                                <label class="u-label" style="float:none">排名年份:</label>
                                                <el-select v-model="rsyear" placeholder="请选择" size="mini" style="width:90px;">
                                                        <el-option v-for="item in years" :key="item" :label="item" :value="item">
                                                        </el-option>
                                                </el-select>
                                                -
                                                <el-select v-model="reyear" placeholder="请选择" size="mini" style="width:90px;">
                                                        <el-option v-for="item in years" :key="item" :label="item" :value="item">
                                                        </el-option>
                                                </el-select>
                                        </li>
                                        <li>
                                                <el-button type="primary" size="mini" @click="showDialogTable">站点</el-button>
                                                <el-button type="primary" size="mini" @click="changeOptions">数据</el-button>
                                                <el-button type="primary" size="mini">等值线图</el-button>
                                        </li>
                                </ul>
                        </div>
                </div>
                <div class="m-list u-white">
                        <el-table v-if="climateStatisticsVo" :data="climateStatisticsVo.climateList" style="width: 100%" border>
                                <el-table-column :prop="item.value" :label="item.text" v-for="item in tableColumns">
                                </el-table-column>
                        </el-table>
                </div>
                <el-dialog title="站点选择" :visible.sync="dialogTableVisible">
                        <cstacodeselect @hide="hideDialogTable" @changeStacodes="changeStacodes"></cstacodeselect>
                </el-dialog>
        </el-main>
</template>

<script>
        import ccalendar from '@/components/public/CCalendar.vue'
        import cstacodeselect from '@/components/public/CStacodeSelect.vue'
        //极端天气
        import {
                mapState,
                mapActions
        } from 'vuex';
        const Qs = require('query-string');
        var config = require('../lib/config.js');
        var baseUrl = config.baseUrl;
        import tool from '../lib/tool.js';
        /*var numArr = [];
        for (var i = -9999; i < 9999; i++) {
                numArr.push(i);
        }*/

        var currentYear = new Date().getFullYear();
        var years = [];
        for (var i = currentYear; i > 1995; i--) {
                years.push(i);
        }
        var conditions = [{
                        data: [0, 10, 30],
                        selectedCondition: "30"
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
                name: "statmoreperiod",
                components: {
                        ccalendar,
                        cstacodeselect
                },
                data() {
                        return {
                                dialogTableVisible: false,
                                eles: null,
                                datetypes: [{
                                        value: 0,
                                        text: "阳历"
                                }, {
                                        value: 1,
                                        text: "农历"
                                }],
                                selectedDataType: 0,
                                sdate: new Date(new Date().getTime() - 10 * 24 * 3600 * 1000).Format("yyyy-MM-dd"),
                                edate: new Date(new Date().getTime() - 10 * 24 * 3600 * 1000).Format("yyyy-MM-dd"),
                                selectedEle: null,
                                statistics: null,
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
                                pertypes: [{
                                        value: "per",
                                        text: "常年"
                                }, {
                                        value: "year",
                                        text: "某年"
                                }],
                                selectedPerType: "per",
                                years: years,
                                statype: "1", //默认国家站
                                selectedYear: currentYear,
                                selectedUp: null,
                                selectedDown: null,
                                ups: null,
                                downs: null,
                                rsyear: currentYear,
                                reyear: currentYear,
                                tableColumns: null,
                                climateStatisticsVo: null,
                                stationTypeInfo: null,
                                surfstation: null,
                                stationList: null
                        };
                },
                created() {
                        this.getOptions();
                },
                mounted() {
                        this.changeOptions();
                },
                methods: {
                        getOptions() {
                                this.eles = eles;
                                this.selectedEle = "T";
                                this.getStat();
                        },
                        getStat() {


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

                                this.changeUps();


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
                                var _this = this;
                                if (this.selectedEle == "T_MIN") {
                                        this.downs = conditions[8].data;
                                        this.selectedDown = conditions[8].selectedCondition;
                                } else

                                if (this.selectedEle == "S") {
                                        this.downs = conditions[10].data;
                                        this.selectedDown = conditions[10].selectedCondition;
                                } else

                                if (this.selectedEle == "V" || this.selectedEle == "V_MIN") {
                                        this.downs = conditions[11].data;
                                        this.selectedDown = conditions[11].selectedCondition;
                                } else {
                                        this.downs = conditions[9].data;
                                        this.selectedDown = conditions[9].selectedCondition;
                                }
                        },
                        changeSurstation() {
                                // this.stationList = require("../../../static/01/surfstationAreaSelected.json");

                        },
                        changeOptions() {
                                var _this = this;
                                if (this.selectedStatistic == "AVE") {
                                        var tableColumns = [{
                                                        text: "站号",
                                                        value: "stacode"
                                                }, {
                                                        text: "站名",
                                                        value: "staname"
                                                }, {
                                                        text: "平均值",
                                                        value: "elevalue"
                                                },
                                                {
                                                        text: "常年平均值",
                                                        value: "pervalue",
                                                        width: ""
                                                }, {
                                                        text: "距平",
                                                        value: "departure"
                                                }, {
                                                        text: "排名（大-小）",
                                                        value: "rankdesc"
                                                }, {
                                                        text: "排名（小-大）",
                                                        value: "rankasc"
                                                },
                                                {
                                                        text: "排名年份",
                                                        value: "rankyears"
                                                }, {
                                                        text: "最大值年",
                                                        value: "maxvalueyear"
                                                }, {
                                                        text: "最小值年",
                                                        value: "minvalueyear"
                                                }
                                        ]
                                } else if (this.selectedStatistic == "SUM") {
                                        var tableColumns = [{
                                                        text: "站号",
                                                        value: "stacode"
                                                }, {
                                                        text: "站名",
                                                        value: "staname"
                                                }, {
                                                        text: "累计值",
                                                        value: "elevalue"
                                                },
                                                {
                                                        text: "常年平均值",
                                                        value: "pervalue"
                                                }, {
                                                        text: "距平",
                                                        value: "departure"
                                                }, {
                                                        text: "排名（大-小）",
                                                        value: "rankdesc"
                                                }, {
                                                        text: "排名（小-大）",
                                                        value: "rankasc"
                                                },
                                                {
                                                        text: "排名年份",
                                                        value: "rankyears"
                                                }, {
                                                        text: "最大值年",
                                                        value: "maxvalueyear"
                                                }, {
                                                        text: "最小值年",
                                                        value: "minvalueyear"
                                                }
                                        ]

                                } else if (this.selectedStatistic == "MAX") {
                                        var tableColumns = [{
                                                        text: "站号",
                                                        value: "stacode"
                                                }, {
                                                        text: "站名",
                                                        value: "staname"
                                                }, {
                                                        text: "最大值",
                                                        value: "elevalue"
                                                },
                                                {
                                                        text: "出现日期",
                                                        value: "eledate"
                                                }, {
                                                        text: "历年极大或者某年极大",
                                                        value: "pervalue"
                                                }, {
                                                        text: "出现日期",
                                                        value: "perdate"
                                                },
                                                {
                                                        text: "距平",
                                                        value: "departure"
                                                }, {
                                                        text: "排名（大-小）",
                                                        value: "rankdesc"
                                                }, {
                                                        text: "排名（小-大）",
                                                        value: "rankasc"
                                                },
                                                {
                                                        text: "排名年份",
                                                        value: "rankyears"
                                                }, {
                                                        text: "最大值年",
                                                        value: "maxvalueyear"
                                                }, {
                                                        text: "最小值年",
                                                        value: "minvalueyear"
                                                }
                                        ]
                                } else if (this.selectedStatistic == "MIN") {
                                        var tableColumns = [{
                                                        text: "站号",
                                                        value: "stacode"
                                                }, {
                                                        text: "站名",
                                                        value: "staname"
                                                }, {
                                                        text: "最小值",
                                                        value: "elevalue"
                                                },
                                                {
                                                        text: "出现日期",
                                                        value: "eledate"
                                                }, {
                                                        text: "历年极小或者某年极小",
                                                        value: "pervalue"
                                                }, {
                                                        text: "出现日期",
                                                        value: "perdate"
                                                },
                                                {
                                                        text: "距平",
                                                        value: "departure"
                                                }, {
                                                        text: "排名（大-小）",
                                                        value: "rankdesc"
                                                }, {
                                                        text: "排名（小-大）",
                                                        value: "rankasc"
                                                },
                                                {
                                                        text: "排名年份",
                                                        value: "rankyears"
                                                }, {
                                                        text: "最大值年",
                                                        value: "maxvalueyear"
                                                }, {
                                                        text: "最小值年",
                                                        value: "minvalueyear"
                                                }
                                        ]
                                } else if (this.selectedCqType == "days") {
                                        var tableColumns = [{
                                                        text: "站号",
                                                        value: "stacode"
                                                }, {
                                                        text: "站名",
                                                        value: "staname"
                                                }, {
                                                        text: "条件日数",
                                                        value: "elevalue"
                                                },
                                                {
                                                        text: "常年日数或某年日数",
                                                        value: "pervalue"
                                                }, {
                                                        text: "距平",
                                                        value: "departure"
                                                }, {
                                                        text: "排名（大-小）",
                                                        value: "rankdesc"
                                                }, {
                                                        text: "排名（小-大）",
                                                        value: "rankasc"
                                                },
                                                {
                                                        text: "排名年份",
                                                        value: "rankyears"
                                                }, {
                                                        text: "最大值年",
                                                        value: "maxvalueyear"
                                                }, {
                                                        text: "最小值年",
                                                        value: "minvalueyear"
                                                }
                                        ]
                                }



                                _this.getStatMorePeriodList(function(climateStatisticsVo) {
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
                        getStatMorePeriodList(cb) {
                                var _this = this;
                                var queryStr = "climateQueryVo.cqflag=" + _this.selectedCqFlag + "&climateQueryVo.cqmax=" + _this.selectedDown + "&climateQueryVo.cqmin=" + _this.selectedUp +
                                        "&climateQueryVo.cqtype=" + _this.selectedCqType + "&climateQueryVo.datetype=0&climateQueryVo.edate=" + _this.edate +
                                        "&climateQueryVo.ele=" + _this.selectedEle + "&climateQueryVo.pertype=" + _this.selectedPerType + "&climateQueryVo.peryear=" + _this.selectedYear + "&climateQueryVo.reyear=" + _this.reyear +
                                        "&climateQueryVo.rsyear=" + _this.rsyear + "&climateQueryVo.sdate=" + _this.sdate + "&climateQueryVo.stacodes" + _this.stacodes + "=&climateQueryVo.statistic=" + _this.selectedStatistic +
                                        "&climateQueryVo.statype=" + _this.statype;
                                // console.log(query);
                                var url = baseUrl + "getClimateStatisticsVoJson.do?";
                                url = url + queryStr;
                                this.$axios.get(url).then(res => {
                                        cb(res.data)
                                });
                        },
                        changeEle: function(e) {
                                this.selectedEle = e.target.dataset.value;
                                this.getStat();
                        },
                        changeSelectedDataType: function(e) {
                                var value = e.target.dataset.value;
                                this.selectedDataType = value;
                        },
                        changeSDate: function(value) {
                                this.sdate = value;
                        },
                        changeEDate: function(value) {

                                this.edate = value

                        },
                       changeStacodes(e) {
                                this.statype = e.statype;
                                this.stacodes = e.stacodes.join(",");
                                this.hideDialogTable();
                        },
                        showDialogTable() {
                                this.dialogTableVisible = true;
                        },
                        hideDialogTable() {
                                this.dialogTableVisible = false;
                        },
                        handlerselectedStatistic(e) {
                                if(e.target.dataset.disabled)return;
                                var value = e.target.dataset.value;
                                this.selectedStatistic = value;
                        },
                        getClimateStatisticsVo() {
                                /**
                                 * climateQueryVo
                                 *  private String ele;     //统计的气象要素
                                 private String sdate;   //开始日期
                                 private String edate;   //结束日期
                                 private String statistic; //统计量,枚举值  AVE，MAX，MIN，SUM
                                 private String cqflag;    //条件查询标记 1-是，0-否
                                 private double cqmin;     //条件查询最小值
                                 private double cqmax;     //条件查询最大值
                                 private String cqtype="ele";    //条件查询类型  days-日数，ele-要素
                                 private String pertype;   //同期值类型，per-常年，year-某年
                                 private int peryear;      //同期值为某年是，对应的年份
                                 private int rsyear;      //排名起始年份
                                 private int reyear;      //排名截止年份
                                 private String statype="1";   //站点类型 1-国家站，2-区域站
                                 private String stacodes="all";//全部站点是用all，其他情况用逗号隔开
                                 private String datetype="0"; //0-阳历,1-农历
                                 * @param data
                                 * @constructor
                                 */
                                var _this = this;
                                var queryString = "climateQueryVo.ele=" + this.selectedEle + "climateQueryVo.sdate=" + this.sdate + "climateQueryVo.edate=" + this.edate +
                                        "climateQueryVo.statistic=" + this.selectedStatistic + "climateQueryVo.cqflag=" + this.cqflag + "climateQueryVo.cqmin=" + this.cqmin +
                                        "climateQueryVo.cqmax=" + this.cqmax + "climateQueryVo.cqtype=" + this.selectedCqType + "climateQueryVo.pertype=" + this.selectedPerType +
                                        "climateQueryVo.rsyear=" + this.rsyear + "climateQueryVo.reyear=" + this.reyear + "climateQueryVo.statype=" + this.selctedStatype +
                                        "climateQueryVo.stacodes=" + this.stacodes + "climateQueryVo.datetype=" + this.datetype;
                                this.$axios(base + "getClimateStatisticsVoJson.do?" + queryString).then(res => {
                                        _this.climateStatisticsVo = res.data;

                                });
                        }
                }

        }
</script>

<style lang="css" scoped>
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
