import Vue from 'vue'
import Router from 'vue-router'
import Layer from '@/views/Layer'
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
            component:(resolve)=>{require(['@/views/Home.vue'], resolve)}
        },
        {
            path: '/weather',
            name: 'weather',
            meta: {
                title: "气候资源"
            },
            component:(resolve)=>{require(['@/views/Weather.vue'], resolve)}
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
                component: (resolve)=>{require(['@/views/service.vue'], resolve)}
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
                component: (resolve)=>{require(['@/views/Knowledge.vue'], resolve)}
            },
              {
                path: "/knowledge/custom/zjjck",
                name: "zjjck",
                meta: {
                  title: "专家决策库"
                },
                component: (resolve)=>{require(['@/views/zjjck.vue'], resolve)}
              }
            ]
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
              component: (resolve)=>{require(['@/views/monitor.vue'], resolve)}
            },{
                path: "/monitor/ele",
                name: "ele",
                meta: {
                    title: "要素监测"
                },
                component: (resolve)=>{require(['@/views/monitor.vue'], resolve)}
            },
              {
                path: "/monitor/sjjc",
                name: "sjjc",
                meta: {
                  title: "实景监测"
                },
                component:(resolve)=>{require(['@/views/sjjc.vue'], resolve)}
              },
              {
                path: "/monitor/spjc",
                name: "spjc",
                meta: {
                  title: "视频监测"
                },
                component: (resolve)=>{require(['@/views/monitor.vue'], resolve)}
              },
              {
                path: "/monitor/bchjc",
                name: "bchjc",
                meta: {
                  title: "病虫害监测"
                },
                component: (resolve)=>{require(['@/views/monitor.vue'], resolve)}
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
                    component: (resolve)=>{require(['@/views/GrainOilCropSuitable.vue'], resolve)}
                },
                {
                    path: "/prediction/commercialcrop",
                    name: "commercialcrop",
                    meta: {
                        title: "特色作物"
                    },
                    component: (resolve)=>{require(['@/views/CommercialCropSuitable.vue'], resolve)}
                },
                {
                    path: "/prediction/fasuitable",
                    name: "fasuitable",
                    meta: {
                        title: "农事活动适宜度"
                    },
                    component: (resolve)=>{require(['@/views/FaSuitable.vue'], resolve)}
                },
                {
                    path: "/prediction/diseasesuitable",
                    name: "diseasesuitable",
                    meta: {
                        title: "病害"
                    },
                    component: (resolve)=>{require(['@/views/DiseaseSuitable.vue'], resolve)}
                },
                {
                    path: "/prediction/pestsuitable",
                    name: "pestsuitable",
                    meta: {
                        title: "虫害"
                    },
                    component: (resolve)=>{require(['@/views/PestSuitable.vue'], resolve)}
                },
                {
                  path: "/prediction/zgswpj",
                  name: "zgswpj",
                  meta: {
                    title: "周光水温评价"
                  },
                  component: (resolve)=>{require(['@/views/zgswpj.vue'], resolve)}
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
                component: (resolve)=>{require(['@/views/AmDisaster.vue'], resolve)}
            },
            {
              path: "/disaster/ghjc",
              name: "ghjc",
              meta: {
                title: "干旱监测"
              },
              component: (resolve)=>{require(['@/views/ghjc.vue'], resolve)}
            },
            {
              path: "/disaster/ghcx",
              name: "ghcx",
              meta: {
                title: "干旱查询"
              },
              component: (resolve)=>{require(['@/views/ghcx.vue'], resolve)}
            },
            {
              path: "/disaster/sdnyqx",
              name: "sdnyqx",
              meta: {
                title: "水稻农业气象灾害影响评估"
              },
              component: (resolve)=>{require(['@/views/sdnyqx.vue'], resolve)}
            },
            {
              path: "/disaster/nyqxzh",
              name: "nyqxzh",
              meta: {
                title: "农业气象灾害统计"
              },
              component: (resolve)=>{require(['@/views/nyqxzh.vue'], resolve)}
            },
            {
              path: "/disaster/lszq",
              name: "lszq",
              meta: {
                title: "历史灾情"
              },
              component: (resolve)=>{require(['@/views/lszq.vue'], resolve)}
            },
            ]
        },
        {
            path: '/stat',
            name: 'stat',
            redirect: "/stat/statday",
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
                    component: (resolve)=>{require(['@/views/Statday.vue'], resolve)}
                },
                {
                    path: "statmoreperiod",
                    name: "statmoreperiod",
                    meta: {
                        title: "任意时段查询"
                    },
                    component: (resolve)=>{require(['@/views/StatMorePeriod.vue'], resolve)}
                },
                {
                    path: "statyear",
                    name: "statyear",
                    meta: {
                        title: "任意时段逐年查询"
                    },
                    component: (resolve)=>{require(['@/views/StatYear.vue'], resolve)}
                }
            ]
        },
        {
          path: '/statyearbook',
          name: 'statyearbook',
          redirect: "/statyearbook/dzzwtjzl",
          meta: {
            title: "统计年鉴"
          },
          component: Layer,
          children: [{
            path: "/statyearbook/dzzwtjzl",
            name: "dzzwtjzl",
            meta: {
              title: "大宗作物统计资料"
            },
            component: (resolve)=>{require(['@/views/dzzwtjzl.vue'], resolve)}
          },
          ]
        }
    ]
})
