const objectAssign = require('object-assign');
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = "";
import qs from 'qs';
var numArr = [];
for (var i = -9999; i < 9999; i++) {
    numArr.push(i);
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
    namespace: 'statmonth/',
    state: {
        eles: null,
        smonth: "2016-12",
        emonth: "2017-11",
        selectedEle: null,
        statistics: null,
        downs: null,
        ups: null,
        selectedCqFlag: false,
        selectedStatistic: null,
        stationTypeInfo: null,
        surfstation: null,
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
            commit('changeOptions', params);
        },
    }
}