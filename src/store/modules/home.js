const objectAssign = require('object-assign');
var config = require('../../lib/config.js');
import axios from 'axios';
var baseUrl = config.baseUrl;
import qs from 'qs';
import dayjs from 'dayjs';
export default {
    namespaced: true, //命名空间
    namespace: 'home/',
    state: {
        weekStartDate: dayjs().startOf('week').format('YYYY-MM-DD'),
        weekEndDate: dayjs().startOf('week').format('YYYY-MM-DD'),
        muleteJson: null,
        cropperiodJson: null,
        cgsuitableJson: null,
        fasuitableJson: null,
        amdisasterJson: null,
        soilmoistureJson: null

    },
    mutations: {
        changeOptions: function(state, params) {
            state = objectAssign(state, params); //合并
        }
    },
    actions: {
        getOptions({ dispatch, commit, state }, orgInfo) {
            var currentDate = new Date();
            var params = { weekStartDate: this.weekStartDate, weekEndDate:this.weekEndDate};
            function getMuleleJson() {
                return axios.get(baseUrl + 'qhzxsp/getAgroImageVoByType.do?code=' + orgInfo.code + '&type=Mulele');
            }

            function getCropPeriodJson() {
                return axios.get(baseUrl + 'qhzxsp/getAgroImageVoByType.do?code=' + orgInfo.code + '&type=CropPeriod');
            }

            function getCgsuitableJson() {
                return axios.get(baseUrl + 'qhzxsp/getAgroImageVoByType.do?code=' + orgInfo.code + '&type=Cgsuitable');
            }

            function getFasuitableJson() {
                return axios.get(baseUrl + 'qhzxsp/getAgroImageVoByType.do?code=' + orgInfo.code + '&type=Fasuitable');
            }

            function getAmdisasterJson() {
                return axios.get(baseUrl + 'qhzxsp/getAgroImageVoByType.do?code=' + orgInfo.code + '&type=Amdisaster');
            }

            function getSoilmoistureJson() {
                return axios.get(baseUrl + 'qhzxsp/getAgroImageVoByType.do?code=' + orgInfo.code + '&type=Soilmoisture');
            }


            axios.all([getMuleleJson(), getCropPeriodJson(), getCgsuitableJson(), getFasuitableJson(), getAmdisasterJson(), getSoilmoistureJson()])
                .then(axios.spread(function(muleteJson, cropperiodJson, cgsuitableJson, fasuitableJson, amdisasterJson, soilmoistureJson) {
                    params.muleteJson = muleteJson.data;
                    params.cropperiodJson = cropperiodJson.data;
                    params.cgsuitableJson = cgsuitableJson.data;
                    params.fasuitableJson = fasuitableJson.data;
                    params.amdisasterJson = amdisasterJson.data;
                    params.soilmoistureJson = soilmoistureJson.data;
                    commit('changeOptions', params);
                }))



        },

        changeOptions({ commit, state }, params) {
            commit('changeOptions', params);
        },
    }
}
