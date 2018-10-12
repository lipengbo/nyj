<template>
  <el-main style="width:100%;padding:0;">
    <div class="m-list u-white">
      <div class="m-image-tab" v-if="voData&&voData.length>0">
        <div class="m-left">
          <MPDF :file="voData[currentIndex].url"/>
        </div>
        <div class="m-right">
          <div class="m-title">{{name}}</div>
          <ul>
            <li class="mitem" :class="{'active':currentIndex==index}" v-for="(item,index) in voData" @click="changeFileIndex" :data-index="index">{{item.name}}</li>
          </ul>
        </div>
      </div>
      <div class="m-image-tab noDataTip" style="padding-top:50px;" v-if="!voData||voData.length===0">暂无数据</div>
    </div>
  </el-main>
</template>

<script>
  import {mapState} from 'vuex';
  import MPDF from '../components/public/MPDF.vue';

  const Qs = require('query-string');
  var config = require('../lib/config.js');
  var baseUrl = config.baseUrl;
  export default {
    name: "knowledge",
    components: {
      MPDF
    },

    data() {
      return {
        knowledgeType: this.$route.params.type,
        file: null,
        currentIndex: 0,
        voData: [],
        name: ""
      };
    },
    watch: {
      $route(to, from) {
        this.knowledgeType = to.params.type;
        if(this.knowledgeType==='everyType'){
          this.$router.replace(this.menus['knowledge'][0].children[0].path);
          return;
        }
        this.currentIndex = 0;
        this.voData = null;
        this.getName();
        this.doQuery();

      }
    },
    computed: {
      ...mapState([
        'menus'
      ])
    },
    beforeCreate(){

    },
    created() {
      var param=this.$route.params.type;//默认重定向到第一个菜单项的路由那里
      if(param==='everyType'){
        this.$router.replace(this.menus['knowledge'][0].children[0].path);
        return;
      }
      this.getName();
      this.doQuery();
    },
    methods: {
      getName() {
        var _this = this;
        var menus = this.menus;
        menus.knowledge[0].children.forEach(function (e) {
          if (e.name == _this.knowledgeType) {
            _this.name = e.title;
          }
        });
      },
      doQuery() {
        var _this = this;
        _this.$axios.get(baseUrl + "qhzxsp/getKdKnowledgebaseinfoVoByType.do?type=" + _this.knowledgeType).then(res => {
          _this.voData = res.data;
        });
      },
      changeFileIndex(e) {
        var index = e.target.dataset.index;
        this.currentIndex = index;
      }
    }
  }
</script>

<style lang="css" scoped>
  .m-image-tab {
    width: 100%;
    height: 950px;
    overflow: hidden;
  }

  .m-image-tab .m-left {
    display: inline-block;
    width: 700px;
  }

  .m-image-tab .m-right {
    display: inline-block;
    float: right;
    width: 240px;
    border-left: 10px solid #F2F5F5;
    height: 100%;
    overflow: hidden;
  }

  .m-image-tab .m-right ul li {
    padding: 5px;
  }

  .m-image-tab .m-right ul {
    height: calc(100vh - 40px);
    overflow-y: auto;
  }

  .m-right li {
    padding: 5px;
    font-size: 14px;
  }

  .m-right li:hover {
    background: #ccc;
    opacity: .7;
  }
  .mitem{
    cursor:pointer;
  }
  .mitem.active{
    color:#186da3
  }
</style>
