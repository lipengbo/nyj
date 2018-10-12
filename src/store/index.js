import Vue from 'vue'
import Vuex from 'vuex'
var config = require("../lib/config");
import axios from '../lib/axios.js';
Vue.use(Vuex);
const objectAssign = require('object-assign');
import menus from '../../config/menus.js';
import commonService from '@/service/commonService';

export default new Vuex.Store({
    state: {
        orgInfo: null,
        menus: menus,
        stationTypeInfo: null
    },
    mutations: {
        init: function(state, params) {
            state = objectAssign(state, params); //合并
        }
    },
    actions: {
        getCodeInfo:function({ dispatch, commit, state }) {
            var promise=commonService.getClientOrgInfo();
            promise.then((info)=>{
              var params = { orgInfo:info };
              commit('init', params);
            });
            return promise;
        },
      changeMenus({ dispatch, commit, state }) {
            var urlService = config.baseUrl + "qhzxsp/getServicesproductinfoTypes.do";
            var childrenService = [];
            var urlKnowledge = config.baseUrl + "qhzxsp/getKdKnowledgebaseinfoVoTypes.do";
            var childrenKnowledge = [];

            function getServicePath() {
                return axios.get(urlService);
            }

            function getKnowledgePath() {
                return axios.get(urlKnowledge);
            }

            var promise=Promise.all([getServicePath(), getKnowledgePath()]);
                promise.then(function(results) {
                    let serviceData=results[0];
                    let knowledgeData=results[1];
                    serviceData.data.forEach(function(e) {
                        childrenService.push({ title: e.text, name: e.code, path: "/service/" + e.code,meta:{title:e.text}});
                    });
                    knowledgeData.data.forEach(function(e) {
                        childrenKnowledge.push({ title: e.text, name: e.code, path: "/knowledge/" + e.code,meta:{title:e.text}});
                    });
                  childrenKnowledge.push({title:"专家决策库",name:'zjjck',path:"/knowledge/custom/zjjck",meta:{title:"专家决策库"}});
                    menus["service"] = [{ title: "服务产品", path: "service", icon: "", children: childrenService }];
                    menus["knowledge"] = [{ title: "知识服务", path: "knowledge", icon: "", children: childrenKnowledge }];
                    commit('init', { menus: menus });
                });
            return promise;

        },
        getStationTypeInfoVo({ dispatch, commit, state }) {
            var url = config.baseUrl + "qhzxsp/getStationTypeInfoVo.do";
            var promise=axios.get(url);
              promise.then(response => {
                var params = { stationTypeInfo: response.data };
                commit('init', params);
            });
            return promise;
        }

    },
    modules: {}

})
