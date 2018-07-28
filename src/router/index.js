import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Layer from '@/views/Layer'
import StatMorePeriod from '@/views/StatMorePeriod'
import StatDay from '@/views/StatDay'
import StatYear from '@/views/StatYear'
import CommercialCropSuitable from '@/views/CommercialCropSuitable'
import GrainOilCropSuitable from '@/views/GrainOilCropSuitable'
import Fasuitable from '@/views/Fasuitable'
import AmDisaster from '@/views/AmDisaster'
import Service from '@/views/service'
import Knowledge from '@/views/Knowledge'
import DiseaseSuitable from '@/views/DiseaseSuitable'
import PestSuitable from '@/views/PestSuitable'
import Monitor from '@/views/Monitor'
import Weather from '@/views/Weather'
Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
      {path:'/',redirect: '/home'},
      {
            path: '/home',
            name: 'home',
            meta: {
                title: "城市气候服务平台"
            },
            component: Home
        },
        {
            path: '/weather',
            name: 'weather',
            meta: {
                title: "气候资源"
            },
            component: Weather
        },
        {
            path: '/service',
            redirect: '/service/everyType',
            name: 'service',
            meta: {
                title: "服务产品"
            },
            component: Layer,
            children: [{
                path: "/service/:type",
                name: "service",
                meta: {
                    title: "服务产品"
                },
                component: Service
            }]
        },
        {
            path: '/knowledge',
            redirect: '/knowledge/everyType',
            name: 'knowledge',
            meta: {
                title: "知识服务"
            },
            component: Layer,
            children: [{
                path: "/knowledge/:type",
                name: "knowledge",
                meta: {
                    title: "知识服务"
                },
                component: Knowledge
            }]
        },
        {
            path: '/monitor',
            name: 'monitor',
            meta: {
                title: "农情监测"
            },
            component: Layer,
            redirect: "/monitor/nqdc",
            children: [{
              path: "/monitor/nqdc",
              name: "nqdc",
              meta: {
                title: "农情调查"
              },
              component: Monitor
            },{
                path: "/monitor/ele",
                name: "ele",
                meta: {
                    title: "要素监测"
                },
                component: Monitor
            },
              {
                path: "/monitor/sjjc",
                name: "sjjc",
                meta: {
                  title: "实景监测"
                },
                component: Monitor
              },
              {
                path: "/monitor/spjc",
                name: "spjc",
                meta: {
                  title: "视频监测"
                },
                component: Monitor
              },
              {
                path: "/monitor/bchjc",
                name: "bchjc",
                meta: {
                  title: "病虫害监测"
                },
                component: Monitor
              }]
        },
        {
            path: '/prediction',
            name: 'prediction',
            component: Layer,
            redirect: "/prediction/grainoilcrop",
            meta: {
                title: "作物生长适应程度"
            },
            children: [{
                    path: "/prediction/grainoilcrop",
                    name: "grainoilcrop",
                    meta: {
                        title: "粮油作物"
                    },
                    component: GrainOilCropSuitable
                },
                {
                    path: "/prediction/commercialcrop",
                    name: "commercialcrop",
                    meta: {
                        title: "特色作物"
                    },
                    component: CommercialCropSuitable
                },
                {
                    path: "/prediction/fasuitable",
                    name: "fasuitable",
                    meta: {
                        title: "农事活动适宜度"
                    },
                    component: Fasuitable
                },
                {
                    path: "/prediction/diseasesuitable",
                    name: "diseasesuitable",
                    meta: {
                        title: "病害"
                    },
                    component: DiseaseSuitable
                },
                {
                    path: "/prediction/pestsuitable",
                    name: "pestsuitable",
                    meta: {
                        title: "虫害"
                    },
                    component: PestSuitable
                }
            ]
        },

        {
            path: '/disaster',
            name: 'disaster',
            component: Layer,
            redirect: "/disaster/am",
            meta: {
                title: "农气灾害"
            },
            children: [{
                path: "/disaster/am",
                name: "am",
                meta: {
                    title: "灾害监测预警"
                },
                component: AmDisaster
            }]
        },
        {
            path: '/stat',
            name: 'stat',
            redirect: "/stat/statyear",
            meta: {
                title: "气候资料"
            },
            component: Layer,
            children: [{
                    path: "statday",
                    name: "statday",
                    meta: {
                        title: "逐日资料统计"
                    },
                    component: StatDay
                },
                {
                    path: "statmoreperiod",
                    name: "statmoreperiod",
                    meta: {
                        title: "任意时段查询"
                    },
                    component: StatMorePeriod
                },
                {
                    path: "statyear",
                    name: "statyear",
                    meta: {
                        title: "任意时段逐年查询"
                    },
                    component: StatYear
                }
            ]
        }
    ]
})
