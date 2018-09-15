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
};
/* module.exports = {
    baseUrl: "http://192.168.0.8:8080/agros/qhzxsp/",//"http://10.148.15.113:8080/agros/qhzxsp/",
    solorUrl: "http://192.168.0.8:8983/solr/",//10.148.15.114
    resourceUrl:'http://10.148.15.113:8000/',
    tileUrl:"http://10.148.15.99:8399/"
}; */
module.exports = {
    baseUrl: "http://10.148.15.113:8080/agros/qhzxsp/",
    solorUrl: "http://10.148.15.114:8983/solr/",
    resourceUrl:'http://10.148.15.113:8000/',
    tileUrl:"http://10.148.15.99:8399/"
};
