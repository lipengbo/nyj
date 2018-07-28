const objectAssign = require('object-assign');
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = "";
import qs from 'qs';

var eles = [{ "text": "平均气温", value: "T" }, { "text": "最高气温", value: "T_MAX" }, { "text": "最低气温", value: "T_MIN" },
    { "text": "日照时数", value: "S" }, { "text": "20时日雨量", value: "R" }, { "text": "08时日雨量", value: "R08" },
    { "text": "极大风速", value: "FJS" }, { "text": "最大风速", value: "FZS" }, { "text": "平均地温", value: "D" },
    { "text": "最高地温", value: "D_MAX" }, { "text": "最低气压", value: "P_MIN" }, { "text": "平均气压", value: "P" },
    { "text": "平均能见度", value: "V" }, { "text": "最低能见度", value: "V_MIN" }, { "text": "对湿度", value: "U" },
];

var stats = [{ "text": "平均值 ", value: "AVE", disabled: false }, { "text": "累计值 ", value: "SUM", disabled: false }];
var hours = [];
for (var i = 0; i < 24; i++) {
    hours.push(i);
}
//连续多时”和“多日单时
var hourTypies = [{ text: "连续多时", value: 0 }, { text: "多日单时", value: 1 }]
export default {
    namespaced: true, //命名空间
    namespace: 'stathour/',
    state: {
        eles: null,
        sdate: new Date(new Date().getTime() - 11 * 24 * 3600 * 1000).Format("yyyy-MM-dd"),
        edate: new Date(new Date().getTime() - 1 * 24 * 3600 * 1000).Format("yyyy-MM-dd"),
        hours: hours,
        shour: 0,
        ehour: 0,
        selectedEle: null,
        statistics: stats,
        selectedStatistic: "AVE",
        hourTypies: hourTypies,
        selectedHourType: 0
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
            dispatch("changeOptions", params);
        },
        changeOptions({ dispatch, commit, state }, params) {
            commit('changeOptions', params);
        },
    }
}