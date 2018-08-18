import dayjs from 'dayjs';
// value 可选 new Date、时间戳、"2016-08-05 14:22:09" 时间格式
// fmt 可选 以下格式(以及位置调换)
// yyyy-MM-dd hh:mm:ss
// yyyy-MM-dd hh:mm:ss.S
// yyyy/MM/dd hh:mm:ss
// yyyy年MM月dd日 hh时mm分ss秒
// yyyyMMddhhmmss
function formatDate(value, fmt) {
    // let v = value.replace(/-/g, "/").substring(0, 19);
    let date = new Date(value)
    if (date === 'Invalid Date') {
        date = new Date(parseFloat(value))
    }
    if (!fmt) {
        fmt = 'yyyy-MM-dd hh:mm:ss'
    }
    let o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
}
function date(val,fmt){
  return dayjs(val).format(fmt);
}
function reverse(val){
  var arr=[];
  if(val&&val.length>0){
    for(var i=0;i<val.length;i++){
      arr.unshift(val[i])
    }
  }
  return arr;
}
function getMtHeaderTitle(defaultActive, menus) {
    var arr = defaultActive.split("/");
    var parent = arr[1];
    var children = arr[2];
    var str = "";
    menus[parent].some(function(e) {
        if (e.path.indexOf(parent) != -1) {
            e.children.some(function(c) {
                if (c.name == children) {
                    str = e.title + " / " + c.title
                    return true;
                }
            });
        }
    });
    return str;
}


export { getMtHeaderTitle, formatDate,date,reverse}
