<template>
  <el-container style="margin-top:10px;">
    <el-aside width="230px">
      <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" :router="true" @open="handleOpen" @close="handleClose" :default-openeds="openeds">
        <template v-for="(item,index) in menus[parentKey]">
          <el-submenu v-if="item.children" :index="item.path">
            <template slot="title">
              <!--<i :class="'iconfont '+item.icon"></i>-->
              <span>{{item.title}} </span>
            </template>
            <el-menu-item :index="itemc.path" :route="itemc.path" v-for="(itemc,indexc) in item.children">
              {{itemc.title}}
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-if="!item.children" :index="item.path" :route="item.path">
            {{item.title}}
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <el-main>
      <div class="m-ct-header">
        <el-breadcrumb separator="/" style="float:left;">
          <el-breadcrumb-item v-for="item in breadcrumb">{{item.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <span class="f-fr u-date-tips" style="font-size:12px;"><b>{{currentDate}}    【农历{{solarDay2}}】  {{weekDay}}</b></span>
      </div>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
  import {mapState} from 'vuex';
  import Tool from '../lib/tool.js'

  export default {
    name: "layer", //气候分析
    data() {
      return {
        //menus: menus,
        defaultActive: '',
        parentKey: "",
        currentDate: Tool.CurrentTime(),
        solarDay2: Tool.solarDay2(),
        weekDay: Tool.weekday(),
        openeds:[]
      };
    },
    computed: {
      ...mapState([
        'menus',
      ]),
      breadcrumb: function () {
        return this.$route.matched;
      }
    },
    created() {
      this.defaultActive = this.$route.path;
      this.parentKey = this.defaultActive.split("/")[1];
      this.menus[this.parentKey].forEach((item)=>{
        this.openeds.push(item.path);
      })
    },
    watch: {
      $route(to, from) {
        if (to.path != from.path) {
          this.defaultActive = to.path;
          this.parentKey = this.defaultActive.split("/")[1];
          this.menus[this.parentKey].forEach((item)=>{
            this.openeds.push(item.path);
          })
        }

      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log("open:", key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log("close:", key, keyPath);
      }
    }
  }
</script>

<style lang="css" scoped>
  .el-menu-item-group a {
    text-decoration: none;
  }

  .m-ct-header {
    font-size: 12px;
    height: 20px;
    line-height: 20px;
  }

  .el-main {
    padding: 10px;
  }
</style>
