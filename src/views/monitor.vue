<template>
        <el-main style="width:100%">
                <div class="m-list u-white" style="padding:5px;">
                        <div class="m-image-tab" style="text-align:center" >
                               正在开发中。。。。
                        </div>
                </div>
        </el-main>
</template>

<script>
        import {
                mapState,
                mapActions
        } from 'vuex';
        const Qs = require('query-string');
        var config = require('../lib/config.js');
        var baseUrl = config.baseUrl;
        import tool from '../lib/tool.js';
        import MPDF from '../components/public/MPDF.vue';
        export default {
                name: "monitor",
                components: {
                        MPDF
                },
        
                data() {
                        return {
                               
                        };
                },
                watch: {
                        $route(to, from) {
                             
        
                        }
                },
                computed: {
                        ...mapState([
                                'menus'
                        ])
                },
                created() {
                       
                },
                methods: {
                       
                       
                }
        }
</script>

<style lang="css" scoped>
        .m-image-tab {
                width: 100%;
                height: 950px;
                overflow: hidden;
        }
        
        .m-image-tab .m-left {
                display: inline-block;
                width: 700px;
        }
        
        .m-image-tab .m-right {
                display: inline-block;
                float: right;
                width: 240px;
                border-left: 10px solid #F2F5F5;
                height: 100%;
                overflow: hidden;
        }
        
        .m-image-tab .m-right ul li {
                padding: 5px;
        }
        
        .m-image-tab .m-right ul {
                height: calc(100vh - 40px);
                overflow-y: auto;
        }
         .m-right li {
                padding: 5px;
                font-size:14px;
        }
        
        .m-right li:hover {
                background: #ccc;
                opacity: .7;
        }
</style>