/**
 * Created by yly on 19/7/22
 * 走势图V2版本
 * 此JS在profit-rate.js和monthly-bills.js中调用
 */

// (function (exports) {
    "use strict";
    var pageSize = 31;
    var chartObj = null;
    var numLengthWidth = 30;
    //首次进入页面标识符
    // var initFlag = true;
    var tempDateChart = {};
    var runChartExtend = {
        init: function (data,upd,secondColor,textTitle,decimals,hasPercent,type) {
            this.getPageData(data,upd,secondColor,textTitle,decimals,hasPercent,type);
        },
        /**
         * 获取曲线数据分页数据并画曲线
         */
        getPageData: function (data,upd,secondColor,textTitle,decimals,hasPercent,type) {
            var chartData = data; 
            var pt = chartData.pt;
            var date = chartData.date;
            var m300 = chartData.m300;
            var mine = chartData.mine;
            tempDateChart = chartData.ptYield;
            var len = upd; //$("#topinfo .compare").find(".sel").length;
            var maxAndMix = this.getMinMaxData(pt.concat(m300).concat(mine));
            if (len == 1) {
                 //沪深300                       
                 this.ydChart({
                    ratioData: pt,
                    date: date,
                    benchmarkRatioData: m300,
                    maxAndMix: maxAndMix,
                    secondColor: secondColor,
                    textTitle:textTitle,
                    decimals:decimals,
                    hasPercent:hasPercent,
                    type:type
                });
            }else if (len == 2) {
                //我的
                this.ydChart({
                    ratioData: pt,
                    date: date,
                    benchmarkRatioData: mine,
                    maxAndMix: maxAndMix,
                    secondColor:secondColor,
                    textTitle:textTitle,
                    decimals:decimals,
                    hasPercent:hasPercent,
                    type:type
                });
            }else{
                //只有资产配置
                this.ydChart({
                    ratioData: pt,
                    date: date,
                    maxAndMix: maxAndMix,
                    secondColor:secondColor,
                    textTitle:textTitle,
                    decimals:decimals,
                    hasPercent:hasPercent,
                    type:type
                });
            }
        },
        /**
         * 获取多个数组中最大最小值
         */
        getMinMaxData: function (arr) {
            var max = this.getMax(arr);
            var min = this.getMin(arr);
            if(max == 0 && min == 0){
                max = 5;
                min = -5; 
            }
            return {
                min: min,
                max: max
            };
        },
        /*
         * 获取数组最大值
         * @param {} arr 数组
         */
        getMax: function (arr) {
            var temp = [];
            for (var i = 0; i < arr.length; i++) {
                /* 6.5 增加data里对象复杂度 [
                    value:1,
                    style:{
                        fillStyle:'#ff0000'
                    }
                ]*/
                var temNumber;
                if (typeof arr[i] == "object") {
                    //对象 则去对象的value值
                    temNumber = arr[i].value;
                } else {
                    temNumber = arr[i];
                }
                temNumber = Number(temNumber);
                if (!isNaN(temNumber)) {
                    temp.push(temNumber);
                }
            }
            return Math.max.apply(null, temp);
        },
        /*
         * 获取数组最小值值
         * @param {} arr 数组参数
         */
        getMin: function (arr) {
            var temp = [];
            for (var i = 0; i < arr.length; i++) {
                var temNumber;
                if (typeof arr[i] == "object") {
                    //对象 则去对象的value值
                    temNumber = arr[i].value;
                } else {
                    temNumber = arr[i];
                }
                temNumber = Number(temNumber);
                if (!isNaN(temNumber)) {
                    temp.push(temNumber);
                }
            }
            //获取数组最小            
            return Math.min.apply(null, temp);
        },

        /*
         * 收益率曲线图画图方法
         * @param {Object} option 曲线图画图参数
         */
        ydChart: function (option) {
            //传入需带入最大最小值 接口或者自己计算
            //判断是否有市场基准收益率
            var data = [],
                that = this;
            //我的账户收益率
            data[0] = {
                type: 'line',
                drawType: 0, //画图方式 
                data: option.ratioData,
                lineStyle: {
                    strokeStyle: 'rgb(246,72,67)',
                    fillStyle: ['rgba(255,183,154,.15)', 'rgba(255,255,255,0.50)'],
                    font: "11px PingFangSC-Regular",
                    lineWidth:1
                },
                //最后一个点处理
                node: {
                    //类型目前为元
                    type: 'circle',
                    drawIndex: [option.ratioData.length - 1], //需要画的索引号                                
                    size: 3,
                    drawCustomGraph: function (ctx, x, y) {//, i
                        if(option.ratioData.length == 1){
                            x = 0;
                        }
                        //自己画图形
                        ctx.beginPath();
                        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                        ctx.strokeStyle = 'rgba(246,72,67,0.27)';
                        ctx.fillStyle = "rgb(246,72,67)";
                        ctx.lineWidth = 6;
                        ctx.stroke();
                        ctx.fill();
                        //画文字
                        // ctx.textAlign = 'right';
                        // ctx.fillText(option.ratioData[option.ratioData.length - 1] + '%', x + 10, y - 20);
                        

                        //画文字
                        var html = [];
                        //本策略收益具体单点
                        var single = option.ratioData[option.ratioData.length - 1];
                        //市场基准利率
                        //检查var co = option.secondColor != '255,86,86' ? "orange" : ""; 
                        //检查var text = co ? "我的账户" : "沪深300";
                        html.push('<p>' + option.date[option.ratioData.length - 1] + '</p>');
                        // if(!single){
                        //     single = '--';
                        // }
                        html.push('<p ><span>'+option.textTitle+'</span><em>' + 
                        (single >= '0' ? '+' + single : single) + '</em>%</p>');
                        // var rx = x  - $(".chart-last-data").width() - 30;
                        // if(option.ratioData.length == 1){
                        //     rx = 60;
                        //     y = 93;
                        // }
                        // $(".chart-last-data").css({
                        //     left: rx,
                        //     bottom: Math.abs(y - 30)
                        // }).html(html.join("")).show();
                        // $("#chart-line-last").css({
                        //     left: x+30
                        // }).show();
                    }
                }
            };
            if (option.benchmarkRatioData) {
                data[0] = {
                    type: 'line',
                    drawType: 0, //画图方式 
                    data: option.benchmarkRatioData,
                    lineStyle: {
                        strokeStyle: 'rgba('+option.secondColor+',1)',
                        // fillStyle: ['rgba(255,86,86,.3)', 'rgba(255,86,86,0)'],
                        font: "11px PingFangSC-Regular"
                    },
                    //最后一个点处理
                    node: {
                        //类型目前为元
                        type: 'circle',
                        drawIndex: [option.benchmarkRatioData.length - 1], //需要画的索引号                                
                        size: 3,
                        drawCustomGraph: function (ctx, x, y) {
                            //自己画图形
                            if(option.benchmarkRatioData.length == 1){
                                x = 0;
                            }
                            ctx.beginPath();
                            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                            ctx.strokeStyle = 'rgba('+option.secondColor+',0.27)';
                            ctx.fillStyle = 'rgba('+option.secondColor+',1)';
                            ctx.lineWidth = 6;
                            ctx.stroke();
                            ctx.fill();
                            //画文字
                            //ctx.textAlign = 'right';
                            //ctx.fillText(option.ratioData[option.ratioData.length - 1] + '%', x + 10, y - 20);

                            // $("#chart-orangecircle-last").css({
                            //     left: x + 28,
                            //     bottom: Math.abs(y - 17)
                            // }).show(); 
                        }
                    }
                };
                data[1] = {
                    type: 'line',
                    drawType: 0, //画图方式 
                    data: option.ratioData,
                    lineStyle: {
                        strokeStyle: 'rgb(87,136,255)',
                        fillStyle: ['rgba(196,224,255,.4)', 'rgba(246,250,255,0.4)'],
                        font: "11px PingFangSC-Regular",
                        lineWidth:1
                    },
                    //最后一个点处理
                    node: {
                        //类型目前为元
                        type: 'circle',
                        drawIndex: [option.ratioData.length - 1], //需要画的索引号                                
                        size: 20,
                        drawCustomGraph: function (ctx, x, y) {
                            if(option.ratioData.length == 1){
                                x = 0;
                            }
                            //自己画图形
                            ctx.beginPath();
                            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                            ctx.strokeStyle = 'rgba(87,136,255,0.27)';
                            ctx.fillStyle = "rgb(87,136,255)";
                            ctx.lineWidth = 6;
                            ctx.stroke();
                            ctx.fill();
                            //画文字
                            var html = [];
                            //本策略收益具体单点
                            var single = option.ratioData[option.ratioData.length - 1];
                            //市场基准利率
                            var tempText = option.benchmarkRatioData;
                            var orangeSingle = tempText && tempText[option.ratioData.length - 1];
                            var co = option.secondColor != '255,86,86' ? "orange" : ""; 
                            var text = co ? "我的账户" : "沪深300";
                            html.push('<p>' + option.date[option.ratioData.length - 1] + '</p>');
                            if(!single){
                                single = '--';
                            }
                            html.push('<p ><span>'+option.textTitle+'</span><em>' + 
                            (single >= 0 ? '+' + single : single) + '</em>%</p>');
                            if (orangeSingle != null && orangeSingle != undefined) {
                                html.push('<p class='+co+'><span>'+text+'</span><em>' +
                                    (orangeSingle >= 0 ? '+' + orangeSingle : orangeSingle) + '</em>%</p>');
                             
                            }
                            // var rx = x  - $(".chart-last-data").width() - 30;
                            // if(option.ratioData.length == 1){
                            //     rx = 60;
                            //     y = 93;
                            // }
                            // $(".chart-last-data").css({
                            //     left: rx,
                            //     bottom: Math.abs(y - 30)
                            // }).html(html.join("")).show();
                            // $("#chart-line-last").css({
                            //     left: x+30
                            // }).show();
                        }
                    }
                };


            }
            //日期显示
            var showDate = [];
            if (option.date.length <= 1) {
                showDate = ["20"+option.date[0].replace(/\//g,"-")];//.substr(3)
            } else {
                showDate = ["20"+option.date[0].replace(/\//g,"-"), "20"+option.date[option.date.length - 1].replace(/\//g,"-")];//.substr(3)
            }


            //组合曲线图参数数据
            pageSize = data[0].data.length;
            var numLength = option.maxAndMix.min.toString().length
            if(option.maxAndMix.min.toString().length< option.maxAndMix.max.toString().length){
                numLength = option.maxAndMix.max.toString().length
            }
            numLengthWidth=(8 * numLength) < 38 ? 38 : 8 * numLength//30
            var chartParam = {
                dom: ".chart",
                scale: 1.2,
                drawType: 0,
                touchIndex: 0,
                defaultDataSize: pageSize,
                max: option.maxAndMix && option.maxAndMix.max,
                min: option.maxAndMix && option.maxAndMix.min,
                // saveImg:true,
                series: data,
                flexible: {
                    left: numLengthWidth,
                    top: 4,
                    right: 12,
                    bottom: 20
                },
                events: {
                    touchstart: function () {
                        // operate.chartTouchInfo(option, op);
                        //$(".chart div").hide();

                    },
                    touchmove: function (op) {
                        that.chartTouchInfo(option, op);
                    },
                    longpress: function (op) {
                        that.chartTouchInfo(option, op);
                    },
                    touchend: function () {
                      $(".aip-d-charts-info").removeClass("none")
                      $(".aip-d-charts-info-move").addClass("none")
                      $(".chart div").hide();
                    }
                },
                xAxis: {
                    dataBind: "bottom", // x轴文字 位置 top 顶轴 middle 中轴 bottom 底轴
                    margin: [17, 0, 0, 0],
                    data: showDate,
                    drawCustomText: function (ctx, op) {
                        /**
                         * 计算宽 计算比例
                         */
                        var aw = $(op.dom).width() - op.flexible.left - op.flexible.right;
                        var dataLength = op.series[0].data.length;
                        var avgratio = aw / op.defaultDataSize;
                        var mg = op.xAxis.margin;
                        ctx.save();
                        /**
                         * 画第一个日期
                         */
                        ctx.fillStyle = op.xAxis.textStyle.fillStyle;
                        ctx.fillText(showDate[0], 0, mg[0]);
                        /**
                         * 第二个日期
                         */
                        if (showDate[1]) {
                            ctx.textAlign = "center";
                            ctx.fillText(showDate[1], avgratio * dataLength - 23, mg[0]);
                        }
                        ctx.restore();
                    },
                    lineStyle: {
                        lineWidth: 1,
                        strokeStyle: 'rgba(255,255,255,0)'
                    },
                    show: true,
                    textStyle: {
                        font: '11px PingFangSC-Light',
                        fillStyle: '#c1c1c1'
                    },
                },
                yAxis: {
                    show: true,
                    avgNum: 3,
                    labelAlign: 'outside',
                    margin: [0, 0, 0, numLengthWidth],
                    basisPoint: true,
                    lineStyle: {
                        lineWidth: 1,
                        strokeStyle: 'rgba(0,0,0,0)',
                    },
                    textStyle: {
                        font: '10px PingFangSC-Regular',
                        fillStyle: '#c1c1c1',
                        textAlign: 'left'
                    },
                    formatter: function (value) {
                      if(option.hasPercent){
                        return value.toFixed(option.decimals) + '%';
                      }else{
                        return value.toFixed(option.decimals);
                      }
                    }
                },
                //网格线
                grid: {
                    showXgridLine: true,
                    drawXCustomGraph: function (ctx) {//jiancha , option
                        //x轴辅助线
                        var height = $(".chart").height();
                        var width = $(".chart").width();
                        //距离上下左右距离
                        var lineNum = 3; //辅助线数量
                        var space = [0, 10, 20, numLengthWidth];
                        var pc = parseInt((width - space[3]- 11) / lineNum);//-11吧最右侧的虚线放到最后一个点的位置
                        // for (var s = 0; s < lineNum; s++) {
                        //     that.drawDashedLine(ctx, space[3] + pc * s + 0.5, 0.5,
                        //         space[3] + pc * s + 0.5, height - space[2] + 0.5, 'rgba(244,244,244,0.6)');
                        // }
                        // //第三条
                        // that.drawDashedLine(ctx, width - 0.5 - 11, 0.5, width - 0.5 - 11,
                        //     height - space[2] + 0.5, 'rgba(244,244,244,0.6)');
                    },
                    showYgridLine: true,
                    drawYCustomGraph: function (ctx) {//jiancha , option
                        var height = $(".chart").height();
                        var width = $(".chart").width();
                        //距离上下左右距离
                        var space = [10, 10, 20, 40];
                        var pc = (height - space[1]) / 3;
                        //第一条
                        ctx.beginPath();
                        ctx.moveTo(0.5, 0.5);
                        ctx.lineTo(width + space[3] - 53, 0.5);
                        ctx.strokeStyle = "#f4f4f4";
                        ctx.stroke();
                        //第二条
                        ctx.beginPath();
                        ctx.moveTo(numLengthWidth, space[2] + pc - 17.5);
                        ctx.lineTo(width + space[3] - 53, space[2] + pc - 17.5);
                        ctx.strokeStyle = "#f4f4f4";
                        ctx.stroke();
                        //disanti
                        ctx.beginPath();
                        ctx.moveTo(numLengthWidth, space[2] + pc * 2 - 24.5);
                        ctx.lineTo(width + space[3] - 53, space[2] + pc * 2 - 24.5);
                        ctx.strokeStyle = "#f4f4f4";
                        ctx.stroke();

                        //横坐标
                        ctx.beginPath();
                        ctx.moveTo(0.5, height - space[2] + 0.5);
                        ctx.lineTo(width - 0.5  - 11, height - space[2] + 0.5);
                        ctx.strokeStyle = "#EDEDED";
                        ctx.stroke();

                    }
                }
            };
            //存在则更新曲线图 不存在则创建曲线图                
            // if (chartObj) {
            //     chartObj.update(chartParam);
            // } else {
                chartObj = new window.Chart(chartParam);
            // }
            $(".profit-chart canvas").css("visibility", "hidden");
            $(".profit-chart canvas").css("visibility", "inherit");
        },
        /**
         * 画虚线
         */
        drawDashedLine: function (ctx, startX, startY, endX, endY, lineWidth, color, dashLen) {
            var _cacuDis = function (startX, startY, endX, endY) {
                return Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            };
            var len = _cacuDis(startX, startY, endX, endY),
                slineWidth = lineWidth || 1, //虚线宽度
                sdashLen = dashLen || 5, //虚线默认间隔
                num = ~~(len / sdashLen); //虚线数量
            ctx.beginPath();
            for (var i = 0; i < num; i++) {
                var x = startX + (endX - startX) / num * i,
                    y = startY + (endY - startY) / num * i;
                ctx[i & 1 ? "lineTo" : "moveTo"](x, y);
            }
            ctx.closePath();
            ctx.lineWidth = slineWidth; //配置线条宽度
            ctx.strokeStyle = color; //配置线条颜色
            ctx.stroke(); //闭合线
        },
        /**
         * 长按展示功能
         */
        chartTouchInfo: function (option, op) {
            //存在数据则隐藏 解决长按div就消失问题
            if (option.ratioData[op.index]) {
                $(".chart div").hide();
            }
            //获取曲线宽度
            var width = $(".chart").width();
            //获取x坐标
            var x = op.value;
            //高度比例用来计算y坐标
            var ratio = $(".chart").attr("data-ratio");
            //数据展示div
            var divWidth = $("#chart-linedata").width();
            //最小值
            var min = $(".chart").attr("data-min");
            //数据展示框单独处理
            if(isNaN(x)) x = numLengthWidth-10;
            if (x >= width / 2) {
                x = x - divWidth - 35;
            } else {
                x = x + 10;
            }
            //本策略收益具体单点
            var single = option.ratioData[op.index];
            //市场基准利率
            var orangeSingle = option.benchmarkRatioData && option.benchmarkRatioData[op.index];
            var orangeY;
            var orangeTop;
            //本策略y值
            var y = -(single - min) * ratio;
            //本策略距离顶部距离
            var top = $(".chart").height() - 0 + y - 22;
            //如果有基准利率则计算
            if (orangeSingle != null && orangeSingle != undefined) {
                orangeY = -(orangeSingle - min) * ratio;
                orangeTop = $(".chart").height() - 0 + orangeY - 22;
            }
            //展示曲线信息
            var html = [];
            var co = option.secondColor != '255,86,86' ? "orange" : ""; 
            var text = co ? "我的账户" : "沪深300";
            var idRound = co ? "#chart-orangecircle-last" : "#chart-orangecircle";
            html.push('<p>' + option.date[op.index] + '</p>'); 
            // if(!single){
            //     single = '--';
            // }
            html.push('<p><span>'+option.textTitle+'</span><em>' + (single >= 0 ? '+' + single : single) + '</em>%</p>');
            if (orangeSingle != null && orangeSingle != undefined) {
                html.push('<p class='+co+'><span>'+ text +'</span><em>' +
                    (orangeSingle >= 0 ? '+' + orangeSingle : orangeSingle) + '</em>%</p>');
                if(option.ratioData.length == 1){
                    $(idRound).css({
                        left: x-3,
                        top: orangeTop - 1
                    }).show();
                }else{
                    $(idRound).css({
                        left: op.value - 2,
                        top: orangeTop
                    }).show();
                }
               
            }
            if (single != null && single != undefined) {
                //展示线
                if(option.ratioData.length == 1){
                    $("#chart-line").css({
                        left: x
                    }).show();
                    $("#chart-linedata").css({
                        left: x,
                        top: 40
                    }).html(html.join("")).show();
                    $("#chart-bluecircle").css({
                        left: x - 2,
                        top: top
                    }).show();
                }else{
                    $("#chart-line").css({
                        left: op.value
                    }).show();
                    $("#chart-linedata").css({
                        left: x,
                        top: 40
                    }).html(html.join("")).show();
                    $("#chart-bluecircle").css({
                        left: op.value - 2,
                        top: top - 1
                    }).show();
                }
               
                // $("#chart-line-last").hide();
                $("#chart-last-data").hide();
            }
            if($(".profit-rate-rate").length >0){
                $(".profit-rate-rate span").html(single >= 0 ? '+' + single : single);
                $(".profit-rate-info").html(option.textTitle+"账户收益金额："+ tempDateChart[op.index] +"元");
            }
            var color = ''
            if(single < '0'){
                color='color: #5e9f3b'
            }else if(single >= '0'){
                color='color: #F64843'
            }
            $(".aip-d-charts-info").addClass("none")
            if(option.type=='2'){
                $(".aip-d-charts-info-move").removeClass("none").html('<div class="aip-d-charts-info-date"><div class=" fl">20'+option.date[op.index].replace(/\//g,"-")+'</div><div class="fr">定投收益率：<em style="'+color+'">'+(single >= '0' ? '+' + single : single)+'%</em></div></div>')
            }else if(option.type=='4'){
                $(".aip-d-charts-info-move").removeClass("none").html('<div class="aip-d-charts-info-date"><div class=" fl">20'+option.date[op.index].replace(/\//g,"-")+'</div><div class="fr">定投金额：<em style="'+color+'">'+single+'元</em></div></div>')
            }else if(option.type=='3'){
                $(".aip-d-charts-info-move").removeClass("none").html('<div class="aip-d-charts-info-date"><div class=" fl">20'+option.date[op.index].replace(/\//g,"-")+'</div><div class="fr">成本单价：<em style="'+color+'">'+single+'</em></div></div>')
            }
            
        }

    };

    // exports.runChartExtendObj = runChartExtend;
    export default runChartExtend

    /**
     * 兼容AMD和非AMD规范
     */
//     if (typeof define === "function" && define.amd) {
//         define([], function () {
//             return runChartExtendObj;
//         });
//     }
// })(window);