<template>
        <div>
                <el-container>
                        <el-aside width="100px;">
                                <fieldset>
                                        <legend>站点类型</legend>
                                        <el-radio v-model="statype" label="0" border>
                                                国家站</el-radio>
                                        <el-radio v-model="statype" label="1" border>区域站</el-radio>
                                </fieldset>
                        </el-aside>
                        <el-main class="m-statype">
                                <fieldset>
                                        <legend>筛选条件</legend>
                                        <ul v-if="stationTypeInfo">
                                                <el-checkbox-group v-model="areaType" size="small" @change="changeAreaType">
                                                        <li v-for="(item,index) in stationTypeInfo.areaList">
                                                                <el-checkbox :label="item.text"></el-checkbox>
                                                        </li>
                                                </el-checkbox-group>
                                        </ul>
                                        <ul v-if="stationTypeInfo">
                                                <el-checkbox-group v-model="regionType" size="small" @change="changeRegionType">
                                                        <li v-for="(item,index) in stationTypeInfo.regionList">
                                                                <el-checkbox :label="item.text" :checked="item.checked"> </el-checkbox>
                                                        </li>
                                                </el-checkbox-group>
                                        </ul>
                                        <ul v-if="stationTypeInfo">
                                                <el-checkbox-group v-model="cityType" size="small" @change="changeCityType">
                                                        <li v-for="(item,index) in stationTypeInfo.cityList">
                                                                <el-checkbox :label="item.text"></el-checkbox>
                                                        </li>
                                                </el-checkbox-group>
                                        </ul>
                                </fieldset>
                        </el-main>
                </el-container>
                <section class="m-action">
                        <div class="m-action-btn">
                                <el-button size="mini" type="primary" @click="handleCheckedAll">全选</el-button>
                                <el-button size="mini" type="primary" @click="handleClear">清空</el-button>
                                <el-button size="mini" type="primary" @click="handleCheckedReverse">反选</el-button>
                                <el-button size="mini" type="primary" style="margin-left:20px;" @click="doQuery">确定</el-button>
                                <el-button size="mini" type="primary" @click="checkedCancel">取消</el-button>
                        </div>
                </section>
                <el-container class="m-station-list">
                        <fieldset>
                                <legend>站点列表</legend>
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="handleCheckAllChange">全选</el-checkbox>
                                <el-checkbox-group v-model="selectedStation" @change="handleCheckedChange">
                                        <el-checkbox v-for="item in stationList" :label="item.stacode" :key="item.stacode">{{item.staname}}</el-checkbox>
                                </el-checkbox-group>
                        </fieldset>
                </el-container>
        </div>
</template>

<script>
        import {
                mapState,
                mapActions
        } from 'vuex';
        import qs from 'qs';
        var config = require('../../lib/config.js');
        var baseUrl = config.baseUrl;
        export default {
                name: "cstacodeselect",
                created() {
                        if (this.$store.state.stationTypeInfo == null) {
                                this.$store.dispatch("getStationTypeInfoVo", {});
                        }
                },
                computed: {
                        ...mapState([
                                'stationTypeInfo',
                                'orgInfo'
                        ])
                },
                watch: {
                        stationTypeInfo: function(cur, old) {
                                var _this = this;
                                var areaType = [];
                                cur.areaList.forEach(function(e) {
                                        areaType.push(e.value)
                                });
                                _this.areaType = areaType;
                                _this.getGrmcStationInfosByOrgcode();
                        }
                },
                data() {
                        return {
                                isIndeterminate: true,
                                statype: "0",
                                checkedAll: false,
                                stationList: [],
                                areaType: [],
                                regionType: [],
                                cityType: [],
                                type: "Area",
                                selectedStation: []
                        };
                },

                methods: {
                        checkedCancel() {
                                this.$emit("hide");
                        },
                        changeAreaType() {
                                this.regionType = [];
                                this.cityType = [];
                                this.type = "Area";
                                this.getGrmcStationInfosByTypeAndValues();
                        },
                        changeRegionType() {
                                this.cityType = [];
                                this.areaType = [];
                                this.type = "Region";
                                this.getGrmcStationInfosByTypeAndValues();
                        },
                        changeCityType() {
                                this.regionType = [];
                                this.areaType = [];
                                this.type = "City";
                                this.getGrmcStationInfosByTypeAndValues();
                        },
                        handleClear() {
                                this.areaType = [];
                                this.regionType = [];
                                this.cityType = [];
                                this.stationList = [];
                                this.selectedStation = [];
                        },
                        handleCheckedAll() {
                                if (this.type == "Area") {
                                        var areaType = [];
                                        this.stationTypeInfo.areaList.forEach(function(e) {
                                                areaType.push(e.value)
                                        });
                                        this.areaType = areaType;
                                } else


                                if (this.type == "Region") {
                                        var regionType = [];
                                        this.stationTypeInfo.regionList.forEach(function(e) {
                                                regionType.push(e.value)
                                        });
                                        this.regionType = regionType
                                } else

                                if (this.type == "City") {
                                        var cityType = [];
                                        this.stationTypeInfo.cityList.forEach(function(e) {
                                                cityType.push(e.value)
                                        });
                                        this.cityType = cityType
                                }
                                this.getGrmcStationInfosByTypeAndValues();

                        },
                        handleCheckedReverse() {
                                var that = this;
                                if (this.type == "Area") {
                                        var areaType = [];
                                        this.stationTypeInfo.areaList.forEach(function(e) {
                                                if (that.areaType.indexOf(e.value) == -1) {
                                                        areaType.push(e.value)
                                                }
                                        });
                                        this.areaType = areaType;
                                } else if (this.type == "Region") {
                                        var regionType = [];
                                        this.stationTypeInfo.regionList.forEach(function(e) {
                                                if (that.regionType.indexOf(e.value) == -1) {
                                                        regionType.push(e.value)
                                                }
                                        });
                                        this.regionType = regionType
                                } else

                                if (this.type == "City") {
                                        var cityType = [];
                                        this.stationTypeInfo.cityList.forEach(function(e) {
                                                if (that.cityType.indexOf(e.value) == -1) {
                                                        cityType.push(e.value)
                                                }
                                        });
                                        this.cityType = cityType
                                }

                                this.getGrmcStationInfosByTypeAndValues();
                        },
                        handleCheckAllChange() {
                                let _this = this,
                                        selectedStation = [];
                                _this.stationList.forEach(function(e) {
                                        selectedStation.push(e.stacode);
                                });
                                _this.selectedStation = selectedStation;

                        },
                        handleCheckedChange(value) {
                                let checkedCount = value.length;
                                this.checkAll = checkedCount === this.stationList.length;
                                this.isIndeterminate = checkedCount > 0 && checkedCount < this.stationList.length;
                        },
                        getGrmcStationInfosByTypeAndValues() {
                                var _this = this;
                                var values = "";

                                if (_this.type == "City") {
                                        _this.cityType.forEach(function(e) {
                                                values += "&values=" + e;
                                        });
                                } else if (_this.type == "Area") {
                                        _this.areaType.forEach(function(e) {
                                                values += "&values=" + e;
                                        });
                                } else {
                                        _this.regionType.forEach(function(e) {
                                                values += "&values=" + e;
                                        });
                                }
                                var queryStr = "statType=" + _this.statype + "&type=" + _this.type + "&values=" + values;
                                _this.$axios.get(baseUrl + "qhzxsp/getGrmcStationInfosByTypeAndValues.do?" + queryStr).then(res => {
                                        _this.stationList = res.data;
                                        var selectedStation = [];
                                        res.data.forEach(function(e) {
                                                selectedStation.push(e.stacode);
                                        });
                                        _this.selectedStation = selectedStation;
                                        _this.checkAll = true;
                                });
                        },
                        getGrmcStationInfosByOrgcode() {
                                //getGrmcStationInfosByOrgcode
                                var _this = this;
                                _this.$axios.get(baseUrl + "qhzxsp/getGrmcStationInfosByOrgcode.do?orgcode=" + _this.orgInfo.code).then(res => {
                                        _this.stationList = res.data;
                                        var selectedStation = [];
                                        res.data.forEach(function(e) {
                                                selectedStation.push(e.stacode);
                                        });
                                        _this.selectedStation = selectedStation;
                                        _this.checkAll = true;
                                });
                        },
                        doQuery() {
                                this.$emit('changeStacodes', {
                                        stacodes: this.selectedStation,
                                        statype: this.statype
                                });
                        }
                }
        }
</script>

<style lang="css" scoped>
        .m-statype ul {
                margin-top: 10px;
        }

        .m-statype li {
                display: inline-block;
                width: 80px;
        }

        .m-action {
                width: 100%;
                height: 30px;
        }

        .m-action .m-action-btn {
                width: 74%;
                margin-top: 10px;
                margin-bottom: 10px;
                height: 100%;
                float: right;
        }

        .m-action-btn button {
                float: left;
                width: 80px;
        }

        .m-station-list {
                width: 100%;
        }

        .m-station-list fieldset {
                width: 100%;
        }

        .m-station-list li {
                display: inline-block;
                min-width: 80px;
        }

        .el-radio.is-bordered {
                display: block;
                margin-top: 59px;
                border-color: transparent;
                width: 100px;
                margin-left: 0px!important;
        }

        .el-dialog .el-dialog__body {
                padding: 20px!important;
        }

        .el-checkbox+.el-checkbox {
                margin: 0;
                min-width: 80px;
                margin-right: 10px;
        }
</style>
