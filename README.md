# 农业综合平台
## 目录解析
1. views 页面
2. service 提供一些服务方法
3. lib/config.js 配置信息,主要修改对接接口的地址
4. lib/axios.js 以后拦截器等功能都在这里，对接接口时导入这个文件(另目前axios已经作为变量了，具体代码参考main.js)
## 注
1. 日期格式化工具引入了dayjs
2. openlayer使用3.20.1版本(全局的方式引入)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
