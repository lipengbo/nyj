<template>
  <div class="cityselect" @blur="isOpen=false">
    <div style="position:relative;width:100%;height:100%;">
      <div class="cityselect_header" @click="isOpen=!isOpen"><div class="cityselect_title" :title="current.name">{{current.name}}</div><div class="icon"><i class="el-icon-arrow-down" :class="{'open':isOpen}"></i></div></div>
      <div class="cityselect_menus" :class="{'close':!isOpen}">
        <ul class="cityselect_citys">
          <li @click="selectArea(province)" :class="{'active':current==province}"><b>{{province.name}}:</b></li>
          <li v-for="item in citys" @click="selectArea(item)" :class="{'active':current==item}">{{item.name}}</li>
        </ul>
        <ul class="cityselect_areas">
          <li v-for="item in areas" @click="selectArea(item)" :class="{'active':current==item}">{{item.name}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import areaService from '@/service/areaService';
    export default {
        name: "cityselect",
        data(){
          return {
            province:{},
            citys:[],
            areas:[],
            current:{},
            isOpen:false,
          }
        },
        watch:{
          current(val){
            var codeResult=areaService.normalCode(val&&val.code);
            if(!codeResult||!codeResult.level){
              this.areas=null;
            }else if(codeResult.level==1){//省
              this.areas=null;
            }else if(codeResult.level==2){//市
              areaService.get(codeResult[2]).then(data=>{
                var arr=[];
                for(var k in data.children){
                  arr.push(data.children[k]);
                }
                this.areas=arr;
              });
            }else if(codeResult.level==3){//区

            }
            this.$emit('change',val);
          }
        },
        async created(){
          this.province=await areaService.get('440000');
          this.current=this.province;
          for(var k in this.province.children){
            this.citys.push(this.province.children[k]);
          }
        },
        methods:{
          selectArea(val){
            this.current=val;
          }
        }
    }
</script>
<style scoped>
  .cityselect{
    float:left;
    background:white;
    color:#409EFF;
    font-size:12px;
  }
  .cityselect_citys ,.cityselect_areas{
    margin-top:10px;
  }
  .cityselect_citys:after,.cityselect_areas:after{
    content:'';
    display:block;
    clear:both;
  }
  .cityselect_citys li,.cityselect_areas li{
    float:left;
    padding:5px 5px;
    margin:0;
    border-radius: 2px;
    cursor: pointer;
  }
  .cityselect_citys li:hover,.cityselect_areas li:hover{
    background:#ececec
  }
  .cityselect_citys li.active,.cityselect_areas li.active{
    background:#ececec
  }
  .cityselect_menus{
    position:absolute;
    top:100%;
    margin-top:5px;
    background:white;
    padding:5px;
    width:208px;
    box-shadow: 2px 2px 2px 1px rgba(0,0,0,.2);
  }
  .cityselect_menus.close{
    display:none;
  }
  .cityselect_header{
    width:100%;
    cursor:pointer;
  }
  .icon{
    width:20px;
    height:100%;
    line-height:40px;
    font-size:12px;
    float:right;
  }
  .cityselect_title{
    width:calc(100% - 20px);
    float:left;
    font-size:14px;
    text-align: center;
    line-height:40px;
    white-space: nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    font-weight: 700;
  }
  .el-icon-arrow-down.open{
    -webkit-transform: rotateZ(180deg);
    -moz-transform: rotateZ(180deg);
    -ms-transform: rotateZ(180deg);
    -o-transform: rotateZ(180deg);
    transform: rotateZ(180deg);
  }
</style>
