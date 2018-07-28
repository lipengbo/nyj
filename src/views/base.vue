<template>
  <el-main style="width:100%">
    <div class="m-stat-header">
      <div class="u-bar u-white f-bb1 " style="height:60px;line-height:60px;">
        <ul v-if="eles" class="m-eles">
          <label for="m-element" class="u-label">要素 ：</label>
          <li v-for="item in eles" :data-value="item.value" :class="selectedEle==item.value?'f-active':''"
              @click="changeEle">{{item.text}}
          </li>
        </ul>
      </div>
      <div class="u-bar u-white f-bb1 ">
        <label for="m-element" class="u-label">日期 ：</label>
        <ul>

          <li style="margin-right:0;">
            <el-date-picker format="yyyy-MM-dd" size="mini" v-model="sdate" type="date" placeholder="选择日期">
            </el-date-picker>
            -
            <el-date-picker format="yyyy-MM-dd" size="mini" v-model="edate" type="date" placeholder="选择日期">
            </el-date-picker>
          </li>
        </ul>
      </div>
      <div class="u-bar u-white">
        <label for="m-element" class="u-label">统计值：</label>
        <ul v-if="statistics" style="padding:10px;">
          <li style="margin-right:5px;" v-for="item in statistics" :data-value="item.value"
              :class="selectedStatistic==item.value?'f-active':(item.disabled?'disabled':'')"
              @click="handlerselectedStatistic">{{item.text}}
          </li>

        </ul>

      </div>

    </div>
  </el-main>
</template>

<script>
  //极端天气
  import {mapActions, mapState} from 'vuex';

  export default {
    name: "statday",

    computed: {
      ...mapState([
        'orgInfo',
      ]),
      ...mapState('statday', [ //记住命名空间
        "eles",
        "selectedEle",
        "statistics",
        "selectedStatistic",
      ]),
      'sdate': {
        set(value) {
          var that = this;
          that.changeOptions({
            sdate: value
          })
        },
        get() {
          return this.$store.state.stathour.sdate;
        }
      },
      'edate': {
        set(value) {
          var that = this;
          if (new Date(value).getTime() < new Date(this.sdate).getTime()) {
            alert("结束时间必须大于开始时间哦！");
          } else {
            that.changeOptions({
              edate: value
            })
          }
        },
        get() {
          return this.$store.state.stathour.edate;
        }
      },
    },
    data() {
      return {};
    },
    created() {
      this.getOptions(this.$store.state.orgInfo);
    },
    methods: {
      ...mapActions('statday', [ // 找命名空间为test的add方法
        'getOptions',
        'changeOptions'
      ]),
      changeEle: function (e) {
        var params = {
          selectedEle: e.target.dataset.value
        }
        this.getStat(params);
      },
      handlerselectedStatistic(e) {
        var value = e.target.dataset.value;
        this.changeOptions({
          selectedStatistic: value
        });
      }
    }
  }
</script>

<style lang="css" scoped>
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 150px;
  }

  .m-stat-header {
    background: #fff;
  }

  .m-stat-header .u-bar {
    display: table;
  }

  .m-stat-header .u-bar .u-label,
  .m-stat-header .u-bar ul {
    display: inline-block;
    float: left;
  }

  .m-eles li {
    display: inline;
    float: left;
    margin-right: 8px;
    white-space: nowrap;
    line-height: 20px;
    margin-top: 10px;
  }

  .u-label {
    padding: 10px;
  }

  .m-list {
    max-height: 660px;
    margin-top: 10px;
    padding: 10px
  }
</style>
