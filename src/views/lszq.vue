<template>
  <div style="width:100%" class="nq">
    <div class="m-stat-header">
      <div class="u-bar u-white f-bb1 " style="padding:15px 0;">
        <ul class="m-eles">
          <label class="u-label">灾害种类：</label>
          <el-checkbox-group v-model="query.selectTypes" style="display: inline-block">
            <li v-for="item in types">
                <el-checkbox :label="item.code">{{item.name}}</el-checkbox>
            </li>
          </el-checkbox-group>
        </ul>
      </div>
      <div class="u-bar u-white f-bb1 ">
        <label class="u-label">日期 ：</label>
        <ul>
          <li style="margin-right:0;">
            <el-date-picker format="yyyy-MM-dd" size="mini" v-model="sDate" type="date" placeholder="选择日期"></el-date-picker>
            -
            <el-date-picker format="yyyy-MM-dd" size="mini" v-model="eDate" type="date" placeholder="选择日期"></el-date-picker>
          </li>
          <li>
            <el-button type="primary" size="small">灾损查询</el-button>
            <el-button type="primary" size="small">按种类统计</el-button>
            <el-button type="primary" size="small">按年统计</el-button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import config from '../lib/config.js';
  import dayjs from 'dayjs';
  var baseUrl = config.baseUrl;
  export default {
    name: "lszq",
    components: {
    },
    data() {
      return {
        types:[],
        query:{
          selectTypes:[],//选中的type的值
          sDate
        }
      }
    },
    computed: {
      ...mapState([
        'orgInfo',
      ]),
    },
    created() {
      axios.get(baseUrl+"disasterLoss/queryType.do").then((res)=>{
        this.types=res.data;
      })
    },
    watch: {

    },
    mounted() {

    },
    methods: {

    }
  }
</script>
<style lang="css" scoped>
  .m-download:hover{
    color:#409EFF;
    cursor:pointer;
  }
</style>
<style>
  .nq .el-tabs__header {
    margin-bottom: 0;
  }
</style>
