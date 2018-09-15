<template>
<iframe height="1035" width="100%" :src="'/static/generic/web/viewer.html?file='+filePath"></iframe>
</template>
<script>
//用于显示pdf图
import config from '@/lib/config';
import path from 'path';
export default {
  name: "mpdf",
  props:["file"],
  components:{
  },
  data () {
    return {
    };
  },
  computed:{
    filePath:function(){
      return config.resourceUrl+"images/"+this.file
    }
  }
}
</script>
<style lang="css" scoped>
</style>
