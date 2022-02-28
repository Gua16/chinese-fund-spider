/**
 * 天天基金/基金排行榜，爬虫
 * 灵感来源：https://www.toutiao.com/i7042941358768062983
 * 批量修改数组：https://segmentfault.com/q/1010000005269362
 */


// 思路：找到数据源 -> 找到数据源的url -> 请求 url -> 获得 html 或者 json -> 解析清晰导出
const https = require('https');
const fs = require('fs');
const moment=require('moment');
const xlsx=require('node-xlsx');

// 数据搜索参数调整
var currentTime=moment(Date.now()).format('YYYY-MM-DD')
const startDate=currentTime // 开始时间，格式YYYY-MM-DD。根据自己需要修改。
var endDate=startDate // 结束时间，格式YYYY-MM-DD。根据自己需要修改。
const pageNumber=10000

//数据文件保存路径
const jsonPath='output/fund.json'
const xlsxPath=`output/fund-${currentTime}.xlsx`

// 设置目标，以及反制反爬虫（伪装）
var header_option={
    hostname:'fund.eastmoney.com',
    path:`/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=6yzf&st=desc&sd=${startDate}&ed=${endDate}&qdii=&tabSubtype=,,,,,&pi=1&pn=${pageNumber}&dx=1&v=`+Math.random(),
    headers:
    {
        // 反爬虫：不从 fund.eastmoney.com 这个域名的请求就会被404
        'Referer': 'https://fund.eastmoney.com/data/fundranking.html'
    }
}

/**
 * 将对象数组写入.xlsx文件
 * @param {*} array 
 */
function array2xlsx(array){

    try {
        var excelData=[]
        {
            var addInfo={}
            addInfo.name='基金排名'
            addInfo.data=[
                ["基金代码","基金名称","基金简写","净值日期","单位净值","累计净值","日增长","周增长","月增长","近3月增长","近6月增长","近1年增长","近2年增长","近3年增长","今年来增长","成立来增长","成立时间","不知道","不知道","原始费率","实际费率","不知道","不知道","不知道","不知道"]
            ]
            array.forEach(element => {
                addInfo.data.push(element)
            });
            excelData.push(addInfo)
        }

        var buffer=xlsx.build(excelData)

        fs.writeFile(xlsxPath,buffer,(err)=>{
            if(!err){
                console.log('xlsx 文件写入完毕');
            }
        })

    } catch (error) {
        console.log('xlsx 写入异常，错误是：'+error.stack)
    }

}

// Main
https.get(header_option,function(res){

    // 分段返回的 自己拼接
    let html = '';
    // 有数据产生的时候 拼接
    res.on('data',function(chunk){
        html += chunk;
    })
    // 拼接完成

    res.on('end',function(){

        // 切割返回数据的头尾
        var str=html.slice(15,-1)
        // JSON字符串转对象，JSON.parse用不了，因为数据不标准
        var rankData=eval("("+str+")")
        // 取返回的JSON中的datas字符串数组（理解这里需要分析返回值）
        var datas=rankData.datas
        //字符串元素切割为数组，使用map批量转换（理解这里需要分析返回值）
        datas=datas.map((e)=>{
            return e.slice(0,-1).split(",")
        })

        array2xlsx(datas)

        // 把数组写入json里面
        fs.writeFile(jsonPath,JSON.stringify(rankData),function(err){
            if(!err){
                console.log('json文件写入完毕');
            }
        })
        console.log(`程序执行完成：请前往 output 文件夹下查看`)
    })
})