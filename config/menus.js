module.exports = {
  "prediction": [{
    title: "作物生长适应程度",
    path: "prediction0",
    children: [{
      title: "粮油作物",
      name: "grainoilcrop",
      path: "/prediction/grainoilcrop",
    }, {
      title: "特色作物",
      name: "commercialcrop",
      path: "/prediction/commercialcrop",
    }]
  },
    {
      title: "发育监测预测",
      path: "prediction1",

      children: [{
        title: "农事活动适宜度",
        name: "fasuitable",
        path: "/prediction/fasuitable",
      }]
    },
    {
      title: "病虫害发生发展适宜度",
      path: "prediction2",
      children: [{
        title: "病害",
        name: "diseasesuitable",
        path: "/prediction/diseasesuitable",
      },
        {
          title: "虫害",
          name: "pestsuitable",
          path: "/prediction/pestsuitable",
        }
      ]
    }
  ],
  "disaster": [{
    title: "农气灾害",
    path: "disaster",

    children: [{
      title: "灾害监测预警",
      name: "am",
      path: "/disaster/am",
    }]
  }],
  "monitor": [{
    title: "农情调查",
    name: "nqdc",
    path: "/monitor/nqdc",
  }, {
    title: "要素监测",
    name: "ele",
    path: "/monitor/ele",
  },
    {
      title: "实景监测",
      name: "sjjc",
      path: "/monitor/sjjc",
    },
    {
      title: "视频监测",
      name: "spjc",
      path: "/monitor/spjc",
    },
    {
      title: "病虫害监测",
      name: "bchjc",
      path: "/monitor/bchjc",
    },
  ],
  "stat": [{
    title: "气象要素分布图",
    path: "stat0",
    children: [{
      title: "逐日",
      name: "statday",
      path: "/stat/statday",
    }]
  },
    {
      title: "气象要素统计",
      path: "stat1",
      children: [{
        title: "任意时段逐年统计",
        name: "statyear",
        path: "/stat/statyear",
      }, {
        title: "任意时段资料统计",
        name: "statmoreperiod",
        path: "/stat/statmoreperiod",
      }]
    }
  ]
}
