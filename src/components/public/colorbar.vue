<template>
  <div style="position:relative">
    <div v-show="showColorBar" @blur="showColorBar=0" class="showColorBar">
      <div @click="changeType()">{{type==0?"冷色 / 暖色":"暖色 / 冷色"}}</div>
      <div>
        <ul class="colorBars colors">
          <li v-for="(item,index) in colorBars" :style="'background:'+item" @click="selectColor(index)"></li>
        </ul>
      </div>
    </div>
    <ul class="colors" @click="showColorBar=1">
      <li v-for="item in colors" :style="'background:'+item"></li>
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
    watch:{
      colors(val){
        console.log(val);
      }
    },
    created(){
      console.log(this.colors);
    },
    methods: {
      createColors(index) {
        var interval = Number(this.interval);
        var min=Number(this.min);
        var max=Number(this.max);
        var length=Math.ceil((max-min)/interval);
        this.colors=[];
        for(var i=0;i<length;i++){
          var num=i+index;
          if(num>this.colorBars.length-1){
            num=num-this.colorBars.length;
          }
          this.colors.push(this.colorBars[num])
        }
      },
      changeType:function(){
        if(!this.type){
          this.type=1;
        }else {
          this.type=0;
        }
        this.colorBars.reverse();
      },
      selectColor:function(index){
        this.createColors(index);
        this.showColorBar=0;
      }
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
  .showColorBar{
    position:absolute;
    bottom:100%;
    left:0;
    width:150px;
    padding:5px;
    background:rgba(0,0,0,.5);
    color:white;
    font-size:16px;
    cursor:pointer;
  }
</style>
