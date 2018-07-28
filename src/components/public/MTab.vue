<template>
  <div class="u-mtab" v-if="data">
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="data&&data.length>0">
      <el-tab-pane :label="item.text" :name="item.value" v-for="item in data" class="m-tab-pane">
        <el-carousel v-if="item.url&&item.url.length>0" height="221px" trigger="click" :initial-index="item.defaultIndex" :autoplay="false"
                     indicator-position="none">
          <el-carousel-item class="u-mtab-item" v-for="itemImg in item.url" :key="itemImg">
            <img :src="'resourceUrl/'+itemImg"/>
          </el-carousel-item>
        </el-carousel>
        <div v-else class="u-mtab-no" style="height:221px;">暂无数据</div>
      </el-tab-pane>
    </el-tabs>
    <div v-else class="u-mtab-no">
      暂无数据
    </div>
  </div>
</template>

<script>
  import config from '@/lib/config';
  export default {
    name: "MTab",
    props: {
      data: Array,
    },
    data() {
      return {
        activeName: "",
        resourceUrl:config.resourceUrl,
      };
    },
    created: function () {
      if (this.data[0])
        this.activeName = this.data[0].value
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  }
</script>

<style lang="css" scoped>
  .u-mtab {
    width: 100%;
    height: 100%;
    background: #fff;
    margin-bottom: 10px;
  }

  .u-mtab .el-tabs {
    height: 266px;
    width: 100%;
  }

  .u-mtab-no {
    height: 266px;
    align-items: center;
    justify-content: center;
    display: flex;
    color: #fff;
    background: #ddd;
  }
</style>
<style>
  .u-mtab .el-tabs__header{
    margin-bottom:5px;
  }
</style>
