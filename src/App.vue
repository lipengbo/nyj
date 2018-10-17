<template>
  <div id="app" class="is-component">
    <el-container>
      <el-header class="m-header" height="95px;">
        <div class="m-header-ct">
          <img :src="logo" style="float:left" />
          <div class="m-header-link">
            <router-link to="/home">首页</router-link>
            <router-link to="/monitor">农情监测</router-link>
            <router-link to="/prediction">农用预报</router-link>
            <router-link to="/disaster">农气灾害</router-link>
            <router-link to="/stat">资料统计</router-link>
            <router-link to="/weather">气候资源</router-link>
            <router-link :to="{path:serviceDefaultPath?serviceDefaultPath:'/service'}">服务产品</router-link>
            <router-link to="/statyearbook/dzzwtjzl">统计年鉴</router-link>
            <router-link :to="{path:knowledgeDefaultPath?knowledgeDefaultPath:'/knowledge'}">知识产品</router-link>
          </div>
        </div>
      </el-header>
      <el-main class="homeMain">
        <router-view></router-view>
        <!--<router-view v-if="orgInfo&&menus"></router-view>-->
      </el-main>
      <el-footer class="homefooter">
        <center style="padding-top:8px;">
          <p style="margin-bottom:8px;">广东省气候中心  版权所有Copyright © 2016~2020   本站所刊登的信息、数据和各种专栏材料，未经授权禁止下载使用</p>
          <p>技术支持：广州乐在信息科技有限公司</p>
        </center>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import {
    mapState,
    mapActions
  } from 'vuex';
  export default {
    name: 'app',
    data() {
      return {
        logo: require("./assets/images/logo.png"),
        serviceDefaultPath: "",
        knowledgeDefaultPath:"",
      }
    },
    computed: {
      ...mapState([
        'orgInfo',
        'menus'
      ]),
    },
    watch: {
      menus: function(cur, old) {
        if (cur.service) {
          this.serviceDefaultPath = this.menus.service[0].children[0].path;
        }
        if (cur.knowledge) {
          this.knowledgeDefaultPath = this.menus.knowledge[0].children[0].path;
        }
      }
    },
    created:function() {
      /*if (this.$store.codeInfo == null) {
        this.$store.dispatch("getCodeInfo");
        this.$store.dispatch("changeMenus");
      }*/
    }

  }
</script>

<style>
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  #app.is-component {
    overflow-y: hidden;
    height: 100%;
  }

  .m-header {
    background: #fff;
    color: #333;
    box-shadow: 2px 2px 5px #888888;
  }

  .m-header-ct {
    width: 1292px;
    height: 95px;
    line-height: 95px;
    margin: 0 auto;
  }

  .m-header-title {
    margin-left: 10px;
  }

  .m-header-title p {
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    margin: 5px;
    height: 30px;
    line-height: 30px;
    font-size: 25px;
  }

  .m-header-title p:last-child {
    height: 20px;
    line-height: 10px;
    font-size: 12px;
  }

  .m-header-ct img {
    height: 66px;
    width: 352px;
    margin-top: 15px;
    vertical-align: middle;
  }

  .m-header-link {
    float: right;
    width:892px; /*800px;*/
    height: 70px;
  }

  .m-header-link a {
    text-align: center;
    text-decoration: none;
    color:#2d2f33;
    width: 100px;
    font-size: 16px;
    display: inline-block;
    font-weight: 700;
  }

  .m-header-link a:first-child {
    width: 60px;
  }

  .m-header-link a.router-link-active {
    color: #186dae;
  }

  .homeMain {
    margin: 0 auto;
    padding: 0;
    width: 1200px;
    overflow:hidden;
    margin-bottom:8px;
    display:block;
    flex:none;
    min-height:calc(100vh - 95px - 68px)
  }

  .homefooter {
    background: #fff;
    height:60px;
    font-size:12px;
  }
  .noDataTip{
    text-align:center;
    padding:10px;
    font-size:14px;
    color:#303133
  }
  .imgBox{
    overflow:hidden;
  }
  .imgBox img{
    display:block;
    width:100%;
    height:auto;
  }
</style>
