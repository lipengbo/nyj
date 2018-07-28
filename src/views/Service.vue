<template>
  <el-main style="width:100%;padding:0">
    <div class="m-list u-white">
      <div class="m-image-tab">
        <div class="m-left">
          <MPDF :file="voData[currentIndex].url" v-if="voData&&voData.length>0"/>
          <div class="m-image-tab noDataTip" style="padding-top:50px;" v-if="!voData||voData.length===0">暂无数据</div>
        </div>
        <div class="m-right">
          <div class="m-title">农业气象旬报</div>
          <div class="u-bar u-white f-bb1 ">
            <label>
              单位：
              <el-select v-model="selectedOrg" placeholder="请选择" size="mini" v-if="orgInfos">
                <el-option v-for="item in  orgInfos" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </label>
          </div>

          <div class="u-bar u-white f-bb1 ">
            <label>
              年份：
              <el-select v-model="selectedYear" placeholder="请选择" size="mini" v-if="years">
                <el-option v-for="item in  years" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </label>
          </div>


          <div class="u-bar u-white f-bb1 ">
            <label>
              期数：
              <el-select v-model="selectedPeriod" placeholder="请选择" size="mini" v-if="periods">
                <el-option v-for="item in  periods" :key="item.value" :label="item.text+'期'" :value="item.value">
                </el-option>
              </el-select>
            </label>
          </div>
          <ul class="m-data">
            <li v-for="(item,index) in voData" @click="changeImageIndex" :data-index="index">{{item.name}}</li>
          </ul>
        </div>
      </div>

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
    name: "service",
    components: {
      MPDF
    },
    data() {
      return {
        serviceType:this.$route.params.type,
        years: null,
        selectedYear: null,
        orgInfos: null,
        selectedOrg: null,
        selectedPeriod: null,
        periods: null,
        file: null,
        currentIndex: 0,
        voData: null
      };
    },
    computed: {
      ...mapState([
        'orgInfo',
        'menus'
      ])
    },
    watch: {
      $route(to, from) {
        this.knowledgeType = to.params.type;
        if(this.knowledgeType==='everyType'){
          this.$router.replace(this.menus['service'][0].children[0].path);
          return;
        }
        this.currentIndex = 0;
        this.voData = null;
        this.getOptions();
      },
      selectedOrg: function (cur, old) {
        this.doQuery();
      },
      selectedYear: function (cur, old) {
        this.getServicesproductinfoPeriodsVoByTypeAndYear();
      },
      selectedPeriod: function (cur, old) {
        var voData = this.voData;
        var temp = null;
        if (voData != null && voData.length > 0 && voData.some(function (e, index) {
          if (e.code == cur) {
            temp = index;
            return true;
          }
        })) {
          this.currentIndex = temp;
        }

      }
    },
    created() {
      var param=this.$route.params.type;//默认重定向到第一个菜单项的路由那里
      if(param==='everyType'){
        this.$router.replace(this.menus['service'][0].children[0].path);
        return;
      }
      this.getOptions();
    },
    methods: {
      getOptions() {
        var _this = this;
        _this.getOrgInfo();
        var startYear = new Date("1950", "01", "01").getFullYear();
        var endYear = new Date().getFullYear();
        var years = [];
        var temp = endYear - 10;
        for (var i = endYear; i >= startYear; i--) {
          years.push(i);
        }
        this.years = years;
        this.selectedYear = endYear;
      },
      getOrgInfo() {
        var _this = this;
        this.$axios.get(baseUrl + "/getOrginfo.do?orgcode=" + this.orgInfo.code).then(res => {
          _this.orgInfos = res.data;
          _this.selectedOrg = res.data[0].code;
        });

      },
      getServicesproductinfoPeriodsVoByTypeAndYear() {
        var _this = this;
        _this.$axios.get(baseUrl + "/getServicesproductinfoPeriodsVoByTypeAndYear.do?type=" + _this.serviceType + "&year=" + _this.selectedYear + "&orgcode=" + _this.selectedOrg).then(res => {
          _this.periods = res.data;
          if (res.data.length > 0) {
            _this.selectedPeriod = res.data[0].value;
          } else {
            _this.selectedPeriod = null;
          }

          this.doQuery();
        });
      },
      doQuery() {
        var _this = this;
        _this.$axios.get(baseUrl + "/getServicesproductinfoVoByTypeAndYear.do?type=" + _this.serviceType + "&year=" + _this.selectedYear + "&orgcode=" + _this.selectedOrg).then(res => {
          _this.voData = res.data;
        });
      },
      changeImageIndex(e) {
        var _this = this,
          periods = this.periods;
        var currentIndex = e.target.dataset.index;
        _this.currentIndex = currentIndex;
        _this.selectedPeriod = periods[currentIndex].value;
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

  .el-select {
    width: 150px;
  }

  .m-right li {
    padding: 5px;
    font-size: 14px;
  }

  .m-right li:hover {
    background: #ccc;
    opacity: .7;
  }
</style>
