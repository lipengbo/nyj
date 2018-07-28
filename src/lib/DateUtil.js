/**
 * Created by wxl on 2016/10/18.
 */
//var now = new Date();                   //当前日期
function getParam(now){
  var nowDayOfWeek = now.getDay();         //今天本周的第几天
  var nowDay = now.getDate();              //当前日
  var nowMonth = now.getMonth();           //当前月
  var nowYear = now.getYear();             //当前年
  nowYear += (nowYear < 2000) ? 1900 : 0;  //

  var lastMonthDate = new Date();  //上月日期
  lastMonthDate.setDate(1);
  lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
  var lastYear = lastMonthDate.getYear();
  var lastMonth = lastMonthDate.getMonth();

  return {nowDayOfWeek:nowDayOfWeek,nowDay:nowDay,nowMonth:nowMonth,nowYear:nowYear,
    lastMonthDate:lastMonthDate,lastMonthDate:lastMonthDate,lastYear:lastYear,lastMonth:lastMonth};
}

//格式化日期：yyyy-MM-dd
function formatDate(date) {
  var myyear = date.getFullYear();
  var mymonth = date.getMonth()+1;
  var myweekday = date.getDate();

  if(mymonth < 10){
    mymonth = "0" + mymonth;
  }
  if(myweekday < 10){
    myweekday = "0" + myweekday;
  }
  return (myyear+"."+mymonth + "." + myweekday);
}

//获得某月的天数
function getMonthDays(nowYear,myMonth){
  var monthStartDate = new Date(nowYear, myMonth, 1);
  var monthEndDate = new Date(nowYear, myMonth + 1, 1);
  var   days   =   (monthEndDate   -   monthStartDate)/(1000   *   60   *   60   *   24);
  return   days;
}

//获得本季度的开始月份
function getQuarterStartMonth(){
  var quarterStartMonth = 0;
  if(nowMonth<3){
    quarterStartMonth = 0;
  }
  if(2<6){
    quarterStartMonth = 3;
  }
  if(5<9){
    quarterStartMonth = 6;
  }
  if(nowMonth>8){
    quarterStartMonth = 9;
  }
  return quarterStartMonth;
}

//今天
var getCurrentDate = function(date=new Date()){
  var params=getParam(date);
  return  formatDate(new Date(param.nowYear, param.nowMonth, param.nowDay));
}

//昨天
var getYesterdayDate =function(date=new Date()){
  var params=getParam(date);
  return formatDate(new Date(params.nowYear, params.nowMonth, params.nowDay - 1));
}

//获得本周的开始日期
var getWeekStartDate =function(date=new Date()) {
  var params = getParam(date);
  return  formatDate(new Date(params.nowYear, params.nowMonth, params.nowDay - params.nowDayOfWeek));
}
//获得本周的结束日期
var getWeekEndDate = function(date=new Date()){
  var params = getParam(date);
  return formatDate(new Date(params.nowYear, params.nowMonth, params.nowDay + (6 - params.nowDayOfWeek)));
};

//获得上周的开始日期
var getUpWeekStartDate = function(date=new Date()) {
  var params = getParam(date);
  return
  formatDate(new Date(params.nowYear, params.nowMonth, params.nowDay - params.nowDayOfWeek - 7));
}


//获得上周的结束日期
var getUpWeekEndDate = function(date=new Date()) {
  var params = getParam(date);
  return
  formatDate(new Date(params.nowYear, params.nowMonth, params.nowDay + (6 - params.nowDayOfWeek - 7)));
}



//获得本月的开始日期
var getMonthStartDate =function(date=new Date()) {
  var params = getParam(date);
  return
  formatDate( new Date(params.nowYear, params.nowMonth, 1));
}


//获得本月的结束日期
var getMonthEndDate = function(date=new Date()) {
  var params = getParam(date);
  return
  formatDate(new Date(params.nowYear, params.nowMonth, getMonthDays(params.nowYear,params.nowMonth)));
}


//获得上月开始时间
var getLastMonthStartDate =function(date=new Date()) {
  var params = getParam(date);
  return
  formatDate(new Date(params.nowYear, params.lastMonth, 1));
}
//获得上月结束时间
var getLastMonthEndDate =function(date=new Date()) {
  var params = getParam(date);
  return
  formatDate(new Date(params.nowYear, params.lastMonth, getMonthDays(params.nowYear,params.lastMonth)));
}


module.exports={
   "getCurrentDate":getCurrentDate,
   "getYesterdayDate":getYesterdayDate,
   "getWeekStartDate":getWeekStartDate,
   "getWeekEndDate":getWeekEndDate,
   "getUpWeekEndDate":getUpWeekEndDate,
   "getUpWeekStartDate":getUpWeekStartDate,
   "getMonthStartDate":getMonthStartDate,
   "getMonthEndDate":getMonthEndDate,
   "getLastMonthEndDate":getLastMonthEndDate,
   "getLastMonthStartDate":getLastMonthStartDate
}
