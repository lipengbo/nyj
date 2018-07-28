<template>
  <el-main>

  </el-main>
  <div class="m-panel" v-if="showPanel">
    <div class="m-title"></div>
  </div>
</template>

<script>
  import config from '../lib/config.js';
  import tool from '../lib/tool.js'

  var solorUrl = config.solorUrl;
  export default {
    name: "agriculturesurvey", //农情调查
    data() {
      return {
        data: {},
        showPanel: false
      };
    },
    created() {
      this.getOptions();
    },
    methods: {
      getOptions() {
        this.getData();
      },
      changePanel() {
        this.showPanel = !this.showPanel;
      },
      getData() {
        var _this = this;
        var currentdate = new Date(temp);
        var date = currentdate.getDate();
        var periods = tool.formatTime(currentdate, "yyyyMM");
        if (date > 20) {
          periods += "C";
        } else if (date < 11) {
          periods += "A"
        } else {
          periods += "B";
        }


        var query = {
          "q": "periods:" + periods,
          wt: "json",
          "index": true
        };
        var url = tool.solorUrl + "cmcropconditioninfo/select";
        url = url + "?" + Qs.stringify(query) + "&start=0&rows=26";
        this.$axios.get(url).then(function (res) {
          _this.data = res.data.data;
        });
      }
    }
  }
</script>

<style lang="css" scoped>
  .m-panel {
    position: absolute;
    width: 240 px；
    right: 0;
    top: 0;
    background: rgba(255, 255, 255, .3);
    color: #333;
  }
</style>
