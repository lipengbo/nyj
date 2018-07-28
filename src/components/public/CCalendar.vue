<template>
        <div class="m-calendar" :style="'width:'+width">
                <span class="el-input__prefix"><i class="el-input__icon el-icon-date" style="margin-top:5px;"></i></span>
                <input class="m-calendar-input" type="text" @click="openByDialog" :value="display" readonly>
                <div v-if="showDialog" class="m-calendar-dialog" @click="closeByDialog">
                        <calendar :display="display" :lunar="lunar" :value="value" :weeks="weeks" :months="months" @select="dateSelected" @clik.stop="openByDialog"></calendar>
                </div>
        </div>
</template>

<script>
        import calendar from './calendar.vue'
        export default {
                name: "ccalendar",
                props: ['lunar', 'date', 'width', 'event'],
                components: {
                        calendar
                },
                data() {
                        return {
                                showDialog: false,
                                begin: "",
                                end: "",
                                events: {},
                                range: this.range || false,
                                zero: this.zero || true,
                                value: this.date.split("-"),
                                display: this.date.toString().replace(/,/gi, "-"),
                                weeks: ['日', '一', '二', '三', '四', '五', '六'],
                                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                        };
                },
                methods: {
                        openByDialog() {
                                this.showDialog = true
                        },
                        closeByDialog() {
                                console.log("what")
        
                                this.showDialog = false
                        },
                        dateSelected(value) {
                                this.showDialog = false;
                                this.value = value;
                                this.display = value.toString().replace(/,/gi, "-");
                                // this.select(this.display);
                                this.$emit("select", this.display);
                        }
                }
        }
</script>

<style lang="css" scoped>
        .m-calendar {
                position: relative;
                display: inline-block;
        }
        
        .m-calendar .m-calendar-input {
                box-sizing: border-box;
                width: 100%;
                margin-top: 10px;
                border-radius: 2px;
                border: 1px solid #dedede;
                padding: 5px;
                font-size: 12px;
                padding-left: 30px;
                color: #666;
        }
        
        .m-calendar-dialog {
                position: absolute;
                left: 0;
                top: 0px;
                z-index: 9999;
                background: transparent;
                padding-top: 50px;
        }
        
        .m-calendar-dialog .calendar {
                color: #5a5e66;
                border: 1px solid #dfe4ed;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                padding-top: 10px;
                border-radius: 3px;
        }
</style>