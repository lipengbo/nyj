/**
 * Created by wxl on 2016/09/12.
 */
'use strict'

// require('es6-promise').polyfill();
// // var Promise = require('es6-promise').Promise;
// // if (!window.Promise) {
// //   window.Promise = Promise;
// // }
// require('isomorphic-fetstch');
// //require('whatwg-fetch');
const axios = require("axios");
//var serverURL="http://localhost";
const objectAssign = require('object-assign');
const Qs = require('query-string');
Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function isContains(str, substr) {
    return new RegExp(substr).test(str);
}


Array.prototype.remove = function(dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i]
        }
    }
    this.length -= 1
}

var format = function(time, format) {
    var t = new Date(time);
    var tf = function(i) { return (i < 10 ? '0' : '') + i };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}

var lunarInfo = new Array(
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0)
var Animals = new Array("鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪");
var Gan = new Array("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸");
var Zhi = new Array("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥");
var now = new Date();
var SY = now.getFullYear();
var SM = now.getMonth();
var SD = now.getDate();

function cyclical(num) { return (Gan[num % 10] + Zhi[num % 12]) } //==== 传入 offset 传回干支, 0=甲子
//==== 传回农历 y年的总天数
function lYearDays(y) {
    var i, sum = 348
    for (i = 0x8000; i > 0x8; i >>= 1) sum += (lunarInfo[y - 1900] & i) ? 1 : 0
    return (sum + leapDays(y))
}

//==== 传回农历 y年闰月的天数
function leapDays(y) {
    if (leapMonth(y)) return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29)
    else return (0)
}

//==== 传回农历 y年闰哪个月 1-12 , 没闰传回 0
function leapMonth(y) { return (lunarInfo[y - 1900] & 0xf) }

//====================================== 传回农历 y年m月的总天数
function monthDays(y, m) { return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29) }

//==== 算出农历, 传入日期物件, 传回农历日期物件
//     该物件属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
function Lunar(objDate) {
    var i, leap = 0,
        temp = 0
    var baseDate = new Date(1900, 0, 31)
    var offset = (objDate - baseDate) / 86400000

    this.dayCyl = offset + 40
    this.monCyl = 14

    for (i = 1900; i < 2050 && offset > 0; i++) {
        temp = lYearDays(i)
        offset -= temp
        this.monCyl += 12
    }
    if (offset < 0) {
        offset += temp;
        i--;
        this.monCyl -= 12
    }

    this.year = i
    this.yearCyl = i - 1864

    leap = leapMonth(i) //闰哪个月
    this.isLeap = false

    for (i = 1; i < 13 && offset > 0; i++) {
        //闰月
        if (leap > 0 && i == (leap + 1) && this.isLeap == false) {
            --i;
            this.isLeap = true;
            temp = leapDays(this.year);
        } else { temp = monthDays(this.year, i); }

        //解除闰月
        if (this.isLeap == true && i == (leap + 1)) this.isLeap = false

        offset -= temp
        if (this.isLeap == false) this.monCyl++
    }

    if (offset == 0 && leap > 0 && i == leap + 1)
        if (this.isLeap) { this.isLeap = false; } else { this.isLeap = true;--i;--this.monCyl; }

    if (offset < 0) { offset += temp;--i;--this.monCyl; }

    this.month = i
    this.day = offset + 1
}

function YYMMDD() {
    return (SY + '年' + (SM + 1) + '月');
}

function weekday() {
    var day = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");

    return (day[now.getDay()]);
}
//==== 中文日期
function cDay(m, d) {
    var nStr1 = new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
    var nStr2 = new Array('初', '十', '廿', '卅', '　');
    var s;
    if (m > 10) { s = '十' + nStr1[m - 10] } else { s = nStr1[m] }
    s += '月'
    switch (d) {
        case 10:
            s += '初十';
            break;
        case 20:
            s += '二十';
            break;
        case 30:
            s += '三十';
            break;
        default:
            s += nStr2[Math.floor(d / 10)];
            s += nStr1[d % 10];
    }
    return (s);
}

function solarDay1() {
    var sDObj = new Date(SY, SM, SD);
    var lDObj = new Lunar(sDObj);
    var cl = '';
    var tt = '【' + Animals[(SY - 4) % 12] + '】' + cyclical(lDObj.monCyl) + '月 ' + cyclical(lDObj.dayCyl++) + '日';
    return (cl + tt);
}

function solarDay2() {
    var sDObj = new Date(SY, SM, SD);
    var lDObj = new Lunar(sDObj);
    //农历BB'+(cld[d].isLeap?'闰 ':' ')+cld[d].lMonth+' 月 '+cld[d].lDay+' 日
    //var tt = cyclical(SY-1900+36)+'年 '+cDay(lDObj.month,lDObj.day); 农历丙申年 九月十七
    var tt = cDay(lDObj.month, lDObj.day);
    return (tt);
}

//显示当前时间
function CurentTime() {
    var now = new Date();
    var clock = format(now.getTime(), "yyyy-MM-dd");
    return (clock);
}

function isdate(intYear, intMonth, intDay) {

    if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay)) return false;

    if (intMonth > 12 || intMonth < 1) return false;

    if (intDay < 1 || intDay > 31) return false;

    if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11) && (intDay > 30)) return false;

    if (intMonth == 2) {

        if (intDay > 29) return false;

        if ((((intYear % 100 == 0) && (intYear % 400 != 0)) || (intYear % 4 != 0)) && (intDay > 28)) return false;

    }

    return true;
}





function jsonEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}



exports.formatTime = format;
exports.isContains = isContains;
exports.CurrentTime = CurentTime;
exports.weekday = weekday;
//exports.solarDay3=solarDay3;
exports.solarDay1 = solarDay1;
exports.solarDay2 = solarDay2;
exports.isdate = isdate;
exports.jsonEqual = jsonEqual;
