<template>
  <div>
    <div v-show="showColorBar" @blur="showColorBar=0">
      <div>{{type==0?"冷色 / 暖色":"暖色 / 冷色"}}</div>
      <div>
        <ul v-if="scsymbols" class="colorBars">
          <li v-for="(item,index) in scsymbols" :style="'background:'+item" @click="current=index"></li>
        </ul>
      </div>
    </div>
    <ul v-if="scsymbols" class="colors" @click="showColorBar=1">
      <li v-for="item in scsymbols" :style="'background:'+item"></li>
    </ul>
  </div>
</template>
<script>
  const colorBars = ["#bb012d", "#e70000", "#f74f14", "#fa9200", "#fcc865", "#fde37d", "#f9fad5", "#9ee3d4", "#6eb0d4", "#3a91db", "#4d66d2", "#5440b6", "#330d80"];
  export default {
    name: "colorbar",
    props: ["interval", "min", "max",'colors'],
    data(){
      return {
        type:0,//0：冷色/暖色  1：暖色/冷色,
        colorBars:colorBars,
        showColorBar:0
      }
    },
    created(){
      this.init();
    },
    methods: {
      init() {
        var value = Number(interval);
        var datas={
          maxvalue:this.min,
          minvalue:this.max
        };
        if(length>(symbolJson.length+index)){
          var stopPosition=index+this.colorBars.length;
          var newArr=[];
          for(var i=index;i<stopPosition;i++){
            newArr.push(colorBars[i]);
          }
        }else{
          var newArr=[];
          for(var i=index;i<length;i++){
            newArr.push(colorBars[i]);
          }
          for(var j=0;j<(colorBars.length-(length-index));j++){
            newArr.push(colorBars[j])
          }
        }
        this.colors=newArr;
        this.showColorBar=false;
      },
      changeType:function(){
        if(this.type==0){
          this.type=1;
        }
        else {
          this.type=0;
        }
        this.colorBars.reverse();
        this.init();
      },
    }
  }
</script>

<style scoped>
  .colors:after{
    content:"";
    clear:both;
  }
  .colors li{
    width:20px;
    height:20px;
    float:left;
  }
</style>
