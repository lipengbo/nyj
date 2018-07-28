<template>
        <el-main style="width:100%">
                <div class="m-stat-header">
                        <div class="u-bar u-white f-bb1 ">
                                <label for="m-element" class="u-label">日期 ：</label>
                                <ul>

                                        <li style="margin-right:0;">
                                                <el-date-picker format="yyyy-MM-dd" size="mini" v-model="sdate" type="date" placeholder="选择日期">
                                                </el-date-picker>

                                        </li>
                                        <label class="u-label">站点：</label>

                                        <li v-for="item in stationtypeData" :class="item.value==selectedStationType?'f-active':''" :data-value="item.value" @click="changeStationType">
                                                {{item.text}}
                                        </li>
                                        <label for="m-element" class="u-label">区域：</label>
                                        <li>
                                                <el-select v-model="selectedRegion" placeholder="请选择" size="mini" v-if="regionInfo" style="width:120px;">
                                                        <el-option v-for="item in  regionInfo" :key="item.code" :label="item.name" :value="item.code">
                                                        </el-option>
                                                </el-select>
                                        </li>
                                        <li>
                                                <el-button type="success" size="mini" @click="doQuery">数据</el-button>
                                        </li>
                                </ul>
                        </div>

                </div>

                <ul class="m-list-img" v-if="voImages">
                        <li v-for="item in voImages">
                                <img :src="'../../static/images/'+item.url" />
                                <div class="m-btn">
                                        <el-button size="mini" type="primary">绘图</el-button>
                                        <el-button size="mini" type="primary">下载</el-button>
                                </div>
                        </li>
                </ul>
                <div class="m-list u-white" style="padding:5px;" v-if="voData">
                        <el-table v-if="voData" :data="voData" style="width: 100%" border>
                                <el-table-column :prop="item.value" :label="item.text" v-for="item in tableColumns">
                                </el-table-column>
                        </el-table>
                </div>
                <div class="m-no-data" v-else>暂无数据</div>
        </el-main>
</template>

<script>
        //极端天气
        import {
                mapState,
                mapActions
        } from 'vuex';
        const Qs = require('query-string');
        var config = require('../lib/config.js');
        var baseUrl = config.baseUrl;
        import tool from '../lib/tool.js';
        export default {
                name: "statday",

                computed: {
                        ...mapState([
                                'orgInfo',
                        ])
                },
                data() {
                        return {
                                sdate: new Date().Format("yyyy-MM-dd"),
                                stationtypeData: [{
                                        text: "国家站",
                                        value: 1
                                }, {
                                        text: "区域站",
                                        value: 2
                                }],
                                selectedStationType: 1,
                                regionInfo: null,
                                selectedRegion: null,
                                voData: null,
                                voImages: null
                        };
                },
                created() {
                        this.getOptions(this.$store.state.orgInfo);
                },
                methods: {
                        getOptions(orgInfo) {
                                var _this = this;
                                this.$axios.get(baseUrl + "/getRegioninfo.do?orgcode=" + orgInfo.code).then(res => {
                                        _this.regionInfo = res.data;
                                        _this.selectedRegion = res.data[0].code;
                                        _this.doQuery();
                                });;
                        },
                        changeStationType(e) {
                                var value = e.target.dataset.value;
                                this.selectedStationType = value;
                        },
                        doQuery() {
                                this.sdate = new Date(this.sdate).Format("yyyy-MM-dd");
                                this.getVoData();
                                this.getVoImages();

                        },
                        getVoData() {
                                var _this = this;
                                var query = {
                                        "meteEleMulDayQueryVo.ddate": this.sdate,
                                        "meteEleMulDayQueryVo.stationtype": this.selectedStationType,
                                        "meteEleMulDayQueryVo.regioncode": this.selectedRegion
                                }
                                // http: //192.168.31.20:8080/agros/qhzxsp/getMeteEleMulDayVosByQueryVo.do?meteEleMulDayQueryVo.ddate=2018-03-21&meteEleMulDayQueryVo.regioncode=440000&meteEleMulDayQueryVo.stationtype=1
                                var url = baseUrl + "getMeteEleMulDayVosByQueryVo.do";
                                url = url + "?" + Qs.stringify(query);

                                var tableColumns = [{
                                                text: "站号",
                                                value: "stacode"
                                        }, {
                                                text: "站名",
                                                value: "staname"
                                        }, {
                                                text: "平均值",
                                                value: "t"
                                        },
                                        {
                                                text: "最大值",
                                                value: "tmax"
                                        },
                                        {
                                                text: "降水量",
                                                value: "r"
                                        },
                                        {
                                                text: "日照时间",
                                                value: "s"
                                        },
                                        {
                                                text: "最大风速",
                                                value: "fzs"
                                        }
                                ]
                                _this.$axios.get(url).then(res => {
                                        _this.voData = res.data;
                                        _this.tableColumns = tableColumns;
                                });
                        },
                        getVoImages() {
                                var _this = this;
                                var query = {
                                        "meteEleMulDayQueryVo.ddate": _this.sdate,
                                        "meteEleMulDayQueryVo.stationtype": _this.selectedStationType,
                                        "meteEleMulDayQueryVo.regioncode": _this.selectedRegion
                                };

                                var url = baseUrl + "getMeteEleMulDayImageVosByQueryVo.do";
                                url = url + "?" + Qs.stringify(query);
                                _this.$axios.get(url).then(res => {
                                        _this.voImages = res.data;
                                });

                        }
                }
        }
</script>

<style lang="css" scoped>
        .m-no-data {
                text-align: center;
                height: 900px;
                background: #fff;
                padding: 10px;
        }

        .m-list-img {
                padding-top: 10px;
                width: 100%;
        }

        .m-list-img li {
                height: 218px;
                width: calc((100% - 20px)/3);
                float: left;
                margin-right: 10px;
                position: relative;
                margin-bottom: 10px;
        }

        .m-list-img li:nth-child(3n) {
                margin-right: 0;
        }

        .m-list-img li .m-btn {
                visibility: hidden;
                position: absolute;
                right: 10px;
                bottom: 10px;
        }

        .m-list-img li:hover .m-btn {
                visibility: visible;
        }

        .m-list-img li img {
                width: 100%;
                height: 100%;
        }
</style>
