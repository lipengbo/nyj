<template>
    <div>
      <div ref="colorramp"></div>
    </div>
</template>

<script>
    export default {
        name: "colorramp",
        mounted:function(){
          $(this.$refs.colorramp).colorramp();
        }
    }
</script>

<style scoped>

</style>
