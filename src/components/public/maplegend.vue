<template>
  <div class="map-symboljson-div" id="map-symboljson-div">
    <p>{{name}}</p>
    <p v-for="item in data"><i :style="{'background':item.fillColor}"></i>{{item.text}}</p>
  </div>
</template>
<script>
  export default {
    props:["name","data"],
    name: "maplegend"
  }
</script>

<style scoped>
  .map-symboljson-div{
    width:100px;
    min-height: 80px;
    background:#8FCCF0 ;
    position:absolute;
    right:10px;
    padding:3px;
    bottom:20px;
    z-index:99;
    font-size:12px;
  }
  .map-symboljson-div p:first-child{
    font-weight:bold;
  }
  .map-symboljson-div p{
    height:20px;
    line-height:20px;
    padding:2px;
  }
  .map-symboljson-div i{
    width: 45px;
    height: 20px;
    display: inline-block;
    margin-right:3px;
    float:left;
  }
</style>
