<template>
  <div style="width:100%">
    <div class="m-stat-header">
      <!--查询条件-->
      <div class="u-bar u-white f-bb1 ">
        <ul>
          <label class="u-label">日期 ：</label>
          <li style="margin-right:0;">
            <el-date-picker format="yyyy-MM-dd" size="mini" v-model="sdate" type="date" placeholder="选择日期">
            </el-date-picker>
          </li>
          <label class="u-label">区域：</label>
          <li>
            <el-select v-model="selectedRegion" placeholder="请选择" size="mini" v-if="regionInfo" style="width:120px;">
              <el-option v-for="item in  regionInfo" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </li>
        </ul>
      </div>
    </div>
    <div class="m-list u-white" style="padding:5px;">
      <!--结果列表-->
    </div>
  </div>
</template>
<script>
    export default {
        name: "dzzwtjzl"
    }
</script>

<style scoped>

</style>
