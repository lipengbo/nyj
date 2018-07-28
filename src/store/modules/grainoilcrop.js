//粮油作物
const objectAssign = require('object-assign');
var config = require('../../lib/config.js');
import axios from 'axios';
var baseUrl = config.baseUrl;
import qs from 'qs';
import DateUtil from '../../lib/DateUtil.js'
export default {
    namespaced: true, //命名空间
    namespace: 'home/',
    state: {
        timeSlot: null,
        elesVo: null,
        selectedEle: null,
        stationTypes: null,
        selectedStationType: 1,
        imageVo: null

    },
    mutations: {
        changeOptions: function(state, params) {
            state = objectAssign(state, params); //合并
        }
    },
    actions: {
        getOptions({ dispatch, commit, state }, orgInfo) {
            var yesterday = new Date(new Date() - 24 * 60 * 60 * 1000);
            var today = new Date();
            var stationTypes = [{ text: "国家站", value: 1 }, { text: "区域站", value: 2 }, { text: "格点", value: 3 }];
            var sliderIntervals = [{
                "text": "0.5秒",
                "value": "500"
            }, {
                "text": "1秒",
                "value": "1000"
            }, {
                "text": "2秒",
                "value": "2000"
            }, {
                "text": "3秒",
                "value": "3000"
            }, {
                "text": "4秒",
                "value": "4000"
            }, {
                "text": "5秒",
                "value": "5000"
            }]

            var timeSlot = [yesterday.Format("yyyy-MM-dd hh:mm:ss"), today.Format("yyyy-MM-dd hh:mm:ss")]
                ///http://192.168.1.102:8080/agros/qhzxsp/getAgrForecastEleVoListByType.do?type=GrainOilCropSuitable
            function getElesVo() {
                return axios.get(baseUrl + '/getAgrForecastEleVoListByType.do?type=GrainOilCropSuitable');
            }
            var params = state;

            axios.all([getElesVo()])
                .then(axios.spread(function(elesVo) {
                    var data = elesVo.data;
                    params.elesVo = data;
                    data.some(function(e) {
                        if (e.defaultflag == 1) {
                            params.selectedEle = e.value;
                        }
                    });
                    params.timeSlot = timeSlot;
                    params.stationTypes = stationTypes;
                    var imageVo = require("../../../static/04/agrForecastImageVo.json");
                    imageVo.forEach(e => {
                        e.imageUrl = "../../static/images/" + e.url;
                    });
                    params.imageVo = imageVo;
                    commit('changeOptions', params);
                }))
        },
        queryVoList({ commit, state }, params) {
            // var query = ObjectAssign(state, params);
            // var str = "queryVo.eletype=" + query.selectedEle + "&queryVo.startDate&queryVo.endDate=&orgCode=" + query.orgCode + "&&queryVo.stationtype=" + query.selectedStationType + "&queryVo.type=GrainOilCropSuitable"
            // axios.get(baseUrl + "/");
            var imageVo = require("../../../static/04/agrForecastImageVo.json");

        },
        changeOptions({ commit, state }, params) {
            //http://192.168.1.102:8080/agros/qhzxsp/getAgrForecastInfoStatisticsVoByQueryVo.do?queryVo.eletype=er&queryVo.enddate=2017-07-12&queryVo.orgcode=440000&queryVo.startdate=2017-07-03&queryVo.stationtype=1&queryVo.type=GrainOilCropSuitable
            commit('changeOptions', params);
        },
    }
}