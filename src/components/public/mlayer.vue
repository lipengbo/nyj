<template>
  <div class="mlayer">
    <div id="mmap"></div>
  </div>
</template>

<script>
    import mapService from "@/service/mapService";
    export default {
        name: "mlayer",
        data(){
          return {
            map:null
          }
        },
        mounted:function(){
          this.map=mapService.createMap({target:"mmap"});
        }
    }
</script>

<style scoped>
  .mlayer{
    width:100%;
    height:100%;
  }
  #mmap{
    width:100%;
    height:100%;
  }
</style>
