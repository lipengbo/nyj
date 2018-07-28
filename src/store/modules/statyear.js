const objectAssign = require('object-assign');
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = "";
import qs from 'qs';
var numArr = [];
for (var i = -9999; i < 9999; i++) {
    numArr.push(i);
}

var currentYear = new Date().getFullYear();
var syears = [],
    eyears = [];
for (var i = currentYear - 11; i > 1995; i--) {
    syears.push(i);
}
for (var i = currentYear - 1; i > 1995; i--) {
    eyears.push(i);
}

var conditions = [
    { data: [0, 10, 30], selectedCondition: "30" },
    { data: [35], selectedCondition: "35" },
    { data: numArr, selectedCondition: "-9999" },
    { data: [0.1, 10, 25, 38, 50], selectedCondition: "0.1" },
    { data: [17.2], selectedCondition: "17.2" },
    { data: [40], selectedCondition: "40" },
    { data: [1000], selectedCondition: "1000" },
    { data: [90], selectedCondition: "90" },
    { data: [5], selectedCondition: "5" },
    { data: [9999], selectedCondition: "9999" },
    { data: [2], selectedCondition: "2" },
    { data: [10], selectedCondition: "10" }
];



var eles = [{ "text": "平均气温", value: "T" }, { "text": "最高气温", value: "T_MAX" }, { "text": "最低气温", value: "T_MIN" },
    { "text": "日照时数", value: "S" }, { "text": "20时日雨量", value: "R" }, { "text": "08时日雨量", value: "R08" },
    { "text": "极大风速", value: "FJS" }, { "text": "最大风速", value: "FZS" }, { "text": "平均地温", value: "D" },
    { "text": "最高地温", value: "D_MAX" }, { "text": "最低气压", value: "P_MIN" }, { "text": "平均气压", value: "P" },
    { "text": "平均能见度", value: "V" }, { "text": "最低能见度", value: "V_MIN" }, { "text": "对湿度", value: "U" },
];

var stats = [{ "text": "平均值 ", value: "AVE", disabled: false }, { "text": "最大值 ", value: "MAX", disabled: true },
    { "text": "最小值 ", value: "MIN", disabled: false }, { "text": "累计值 ", value: "SUM", disabled: false }
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
    namespaced: true, //命名空间
    namespace: 'statyear/',
    state: {
        eles: null,
        sdate: new Date(new Date().getTime() - 11 * 24 * 3600 * 1000).Format("MM-dd"),
        edate: new Date(new Date().getTime() - 1 * 24 * 3600 * 1000).Format("MM-dd"),
        syear: new Date().getFullYear() - 11,
        eyear: new Date().getFullYear() - 1,
        syears: syears,
        eyears: eyears,
        selectedEle: null,
        statistics: null,
        downs: null,
        ups: null,
        selectedCqFlag: false,
        selectedStatistic: null,
        cqtypes: [{ value: "days", text: "日数" }, { value: "ele", text: "要素" }],
        selectedCqType: "ele",
        statype: "1", //默认国家站
        tableColumns: null,
        climateStatisticsVo: null,
        stationTypeInfo: null,
        surfstation: null,
        stationList: null
    },
    mutations: {
        changeOptions: function(state, params) {
            state = objectAssign(state, params);
        }
    },
    actions: {

        getOptions({ dispatch, commit, state }) {
            var params = state;

            var selectedEle = "T";
            params.eles = eles;
            params.selectedEle = selectedEle;
            dispatch("getStat", params);
        },
        getStat({ dispatch, commit, state }, params) {


            if (params.selectedEle == "T" || params.selectedEle == "P" || params.selectedEle == "V" || params.selectedEle == "U" || params.selectedEle == "D") {
                params.statistics = changeStat("SUM");
                params.selectedStatistic = "AVE";

            }

            if (params.selectedEle == "T_MAX" || params.selectedEle == "D_MAX") {
                params.statistics = changeStat("SUM")
                params.selectedStatistic = "MAX";

            }


            if (params.selectedEle == "T_MIN" || params.selectedEle == "P_MIN" || params.selectedEle == "V_MIN") {
                if (params.selectedEle == "T_MIN") {
                    params.statistics = changeStat("SUM")
                } else {
                    params.statistics = changeStat("SUM,MAX")
                }

                params.selectedStatistic = "MIN";
            }



            if (params.selectedEle == "S" || params.selectedEle == "R" || params.selectedEle == "R08") {
                params.statistics = changeStat("MIN")
                params.selectedStatistic = "SUM";
            }




            if (params.selectedEle == "FJS" || params.selectedEle == "FZS") {
                params.statistics = changeStat("MIN,SUM")
                params.selectedStatistic = "MAX";
            }








            // console.log(params)
            dispatch("changeUps", params);

        },

        changeUps({ dispatch, commit, state }, params) {
            if (params.selectedEle == "T") {
                params.ups = conditions[0].data;
                params.selectedUp = conditions[0].selectedCondition;
            }

            if (params.selectedEle == "T_MAX") {
                params.ups = conditions[1].data;
                params.selectedUp = conditions[1].selectedCondition;
            }


            if (params.selectedEle == "T_MIN" || params.selectedEle == "S" || params.selectedEle == "V_MIN" || params.selectedEle == "V") {
                params.ups = conditions[2].data;
                params.selectedUp = conditions[2].selectedCondition;
            }
            if (params.selectedEle == "R" || params.selectedEle == "08") {
                params.ups = conditions[3].data;
                params.selectedUp = conditions[3].selectedCondition;
            }
            if (params.selectedEle == "FJS" || params.selectedEle == "FZS") {
                params.ups = conditions[4].data;
                params.selectedUp = conditions[4].selectedCondition;
            }

            if (params.selectedEle == "D" || params.selectedEle == "D_MAX") {
                params.ups = conditions[5].data;
                params.selectedUp = conditions[5].selectedCondition;
            }

            if (params.selectedEle == "P" || params.selectedEle == "P_MIN") {
                params.ups = conditions[6].data;
                params.selectedUp = conditions[6].selectedCondition;
            }

            if (params.selectedEle == "U") {
                params.ups = conditions[7].data;
                params.selectedUp = conditions[7].selectedCondition;
            }
            // console.log(params.selectedUp)
            dispatch("changeDowns", params);

        },

        changeDowns({ dispatch, commit, state }, params) {
            if (params.selectedEle == "T_MIN") {
                params.downs = conditions[8].data;
                params.selectedDown = conditions[8].selectedCondition;
            } else

            if (params.selectedEle == "S") {
                params.downs = conditions[10].data;
                params.selectedDown = conditions[10].selectedCondition;
            } else

            if (params.selectedEle == "V" || params.selectedEle == "V_MIN") {
                params.downs = conditions[11].data;
                params.selectedDown = conditions[11].selectedCondition;
            } else {
                params.downs = conditions[9].data;
                params.selectedDown = conditions[9].selectedCondition;
            }

            dispatch("changeOptions", params);
        },
        changeSurstation({ dispatch, commit, state }, params) {
            params.stationList = require("../../../static/01/surfstationAreaSelected.json");
            dispatch("changeOptions", params);
        },
        changeOptions({ dispatch, commit, state }, params) {
            // if (params.selectedStatistic == "AVE") {
            //     var tableColumns = [{ text: "站号", value: "stacode" }, { text: "站名", value: "staname" }, { text: "平均值", value: "elevalue" },
            //         { text: "常年平均值", value: "pervalue", width: "" }, { text: "距平", value: "departure" }, { text: "排名（大-小）", value: "rankdesc" }, { text: "排名（小-大）", value: "rankasc" },
            //         { text: "排名年份", value: "rankyears" }, { text: "最大值年", value: "maxvalueyear" }, { text: "最小值年", value: "minvalueyear" }
            //     ]
            // } else if (params.selectedStatistic == "SUM") {
            //     var tableColumns = [{ text: "站号", value: "stacode" }, { text: "站名", value: "staname" }, { text: "累计值", value: "elevalue" },
            //         { text: "常年平均值", value: "pervalue" }, { text: "距平", value: "departure" }, { text: "排名（大-小）", value: "rankdesc" }, { text: "排名（小-大）", value: "rankasc" },
            //         { text: "排名年份", value: "rankyears" }, { text: "最大值年", value: "maxvalueyear" }, { text: "最小值年", value: "minvalueyear" }
            //     ]

            // } else if (params.selectedStatistic == "MAX") {
            //     var tableColumns = [{ text: "站号", value: "stacode" }, { text: "站名", value: "staname" }, { text: "最大值", value: "elevalue" },
            //         { text: "出现日期", value: "eledate" }, { text: "历年极大或者某年极大", value: "pervalue" }, { text: "出现日期", value: "perdate" },
            //         { text: "距平", value: "departure" }, { text: "排名（大-小）", value: "rankdesc" }, { text: "排名（小-大）", value: "rankasc" },
            //         { text: "排名年份", value: "rankyears" }, { text: "最大值年", value: "maxvalueyear" }, { text: "最小值年", value: "minvalueyear" }
            //     ]
            // } else if (params.selectedStatistic == "MIN") {
            //     var tableColumns = [{ text: "站号", value: "stacode" }, { text: "站名", value: "staname" }, { text: "最小值", value: "elevalue" },
            //         { text: "出现日期", value: "eledate" }, { text: "历年极小或者某年极小", value: "pervalue" }, { text: "出现日期", value: "perdate" },
            //         { text: "距平", value: "departure" }, { text: "排名（大-小）", value: "rankdesc" }, { text: "排名（小-大）", value: "rankasc" },
            //         { text: "排名年份", value: "rankyears" }, { text: "最大值年", value: "maxvalueyear" }, { text: "最小值年", value: "minvalueyear" }
            //     ]
            // } else if (params.selectedCqType == "days") {
            //     var tableColumns = [{ text: "站号", value: "stacode" }, { text: "站名", value: "staname" }, { text: "条件日数", value: "elevalue" },
            //         { text: "常年日数或某年日数", value: "pervalue" }, { text: "距平", value: "departure" }, { text: "排名（大-小）", value: "rankdesc" }, { text: "排名（小-大）", value: "rankasc" },
            //         { text: "排名年份", value: "rankyears" }, { text: "最大值年", value: "maxvalueyear" }, { text: "最小值年", value: "minvalueyear" }
            //     ]
            // }
            var climateStatisticsVo = require("../../../static/02/ClimateYearsStatisticsVo.json");
            var tableColumns = [{ text: "站号", value: "stacode" }, { text: "站名", value: "staname" }];
            var temp = [];
            for (var j = 0; j < climateStatisticsVo.climateList.length; j++) {
                var obj = {};
                for (var p in climateStatisticsVo.climateList[j]) {
                    if (p != "values") {
                        obj[p] = climateStatisticsVo.climateList[j][p]
                    } else {
                        for (var i = 0; i < climateStatisticsVo.climateList[j].values.length; i++) {
                            if (climateStatisticsVo.climateList[j].values[i].text == "最大值") {
                                obj.Max = climateStatisticsVo.climateList[j].values[i].value;
                            } else if (climateStatisticsVo.climateList[j].values[i].text == "最小值") {
                                obj.Min = climateStatisticsVo.climateList[j].values[i].value;
                            } else if (climateStatisticsVo.climateList[j].values[i].text == "平均值") {
                                obj.Per = climateStatisticsVo.climateList[j].values[i].value;
                            } else {
                                obj[climateStatisticsVo.climateList[j].values[i].text] = climateStatisticsVo.climateList[j].values[i].value;
                            }


                            if (j == 0) {
                                if (climateStatisticsVo.climateList[j].values[i].text == "最大值" || climateStatisticsVo.climateList[j].values[i].text == "最小值" || climateStatisticsVo.climateList[j].values[i].text == "平均值") {
                                    tableColumns.push({ "text": climateStatisticsVo.climateList[j].values[i].text, "value": (climateStatisticsVo.climateList[j].values[i].text == "最大值") ? "Max" : (climateStatisticsVo.climateList[j].values[i].text == "最小值" ? "Min" : "Per") });
                                } else {
                                    tableColumns.push({ "text": climateStatisticsVo.climateList[j].values[i].text, "value": climateStatisticsVo.climateList[j].values[i].text });
                                }
                            }
                        }
                    }
                }

                temp.push(obj);
            }
            params.tableColumns = tableColumns;
            //此处得重新处理
            params.climateStatisticsVo = { "climateList": temp };
            //  console.log(params.climateStatisticsVo)
            var stationTypeInfo = require("../../../static/01/stationTypeInfo.json");
            params.stationTypeInfo = stationTypeInfo;
            var surfstation = require("../../../static/01/surfstation.json");
            // params.surfstation = surfstation;

            if (params.statype == 1) { //国家站
                var stationList = surfstation;
            } else if (params.statype == 2) {
                var stationList = require("../../../static/01/awsstation.json");
            }
            params.stationList = stationList;


            commit('changeOptions', params);
        },
    }
}