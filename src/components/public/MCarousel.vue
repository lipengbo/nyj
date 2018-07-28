<template>
<div class="m-carousel-box">
  <el-carousel :interval="5000" arrow="always" height="800px" autoplay="false" indicator-position="none">
    <el-carousel-item v-for="item in data" :key="item.imageUrl">
    <img :src="item.imageUrl"/>
    </el-carousel-item>
  </el-carousel>
  
  </div>

</template>
<script>
//播放给件
export default {
  name: "MCarousel",
   props: {
                        data: Array,
                        interval:Number,//播放速率
                        defaultActive:Number//默认第几个
                },
  data () {
    return {
    };
  }
}
</script>
<style lang="css" >
.m-carousel-box{
   width:960px;
   height:800px;
}

.m-carousel-box img{
        width: 100%;
        height:100%;
}

.m-carousel-box .el-carousel__arrow{
        display:none;
}
</style>