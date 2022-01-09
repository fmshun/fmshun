/*
    6.5
    1.更新曲线图data数据复杂度支持data为对象的画图方法
    2.更新最大最小值计算方式
    3.外层drawType仅对x轴坐标展示起效果,data内drawType用来画图
    4.增加自定义画辅助线方法,自定义画节点元素方法
    6.6
    1.修正曲线图未传最大最小值时最大最小值计算错误问题
    6.8
    1.update曲线图更新方法修正
    2.曲线图自定义辅助线画法 放到画图之外解决update方法辅助线层级过高问题
    迁移git 代码更改 全部合并为一个js
    目前只包含线图 如果需要别的可以继续合并 合并后注意:静态检查需要通过
    1.规范用户名驼峰写法
    2.末尾;
    3.变量声明问题
    4.其他静态检查问题
    */
    /*默认模板开始*/
    var theme = {
        //默认填充色
        // bgColor:"#fff",
        // 提示框
        /**
         * [tooltip 弹出层]
         * @type {Object}
         */
        tooltip: {

        },
        /**
         * [grid 辅助线设置]
         * @description 辅助线设置
         */
        grid: {
            lineWidth: 1, //线条宽度
            strokeStyle: "#ccc", //线条颜色
        },
        //k线图默认样式
        k: {
            //k线柱形宽度
            columnWidth: '80%', //
            columnMinHeight: 1, //最低高 默认为1 防止消失
            defaultDataSize: 0, //默认展示数据长度 默认为0 认为是series传的长度 如果传值则按值算 解决数据过少展示全屏的问题 可以大于数据长度 不能小于数据长度
            //涨的颜色
            lineStyle: {
                fillStyle: '#EC0000',
                strokeStyle: '#EC0000',
                lineWidth: 1
            },
            //跌的颜色
            negativeLineStyle: {
                fillStyle: '#5E9F3B', //[]
                strokeStyle: '#5E9F3B',
                lineWidth: 1
            },
            //比例 默认为1  放大解决文字超出问题
            scale: 1,
            //k线中间线的宽度 默认为1
            kLineWidth: 1,
            //是否是实心 默认是实心
            solid: true
        },
        // line 线颜色
        line: {
            //正值
            lineStyle: {
                // fillStyle: '#EC0000',
                strokeStyle: '#EC0000',
                lineWidth: 1
            },
            node: {
                show: false,
                //节点类型 目前支持原
                nodeType: 'circle',
                //size  圆表示半径 后期支持别的 可能会是数组
                size: 3,
                //节点样式
                lineStyle: {

                },
                nodeText: {
                    //展示节点文字
                    show: false,
                    // formatter: function() {

                    // },
                    //节点文字样式
                    textStyle: {

                    },
                    //边距
                    margin: 10
                }
            }
            // //负值
            // negativeStyle: {
            //     fillStyle: '#5E9F3B', //[]
            //     strokeStyle: '#5E9F3B',
            //     lineWidth: 1
            // },
        },
        //雷达图
        radar: {
            //中心圆是否展示
            circle: {
                show: false,
                lineStyle: {
                    stockStyle: '',
                    lineWidth: 1,
                    fillStyle: ''
                },
                //圆半径 具体数值或者按照百分比 100%表示沾满canvas
                radius: 10 //或者90%                
            },
            //辅助图形
            auxiliaryGraph: {
                num: 3,
                lineStyle: [{
                    fillStyle: '',
                    lineWidth: 1,
                    strokeStyle: ''
                }],
                //对角线 默认不展示
                diagonal: {
                    show: false,
                    lineStyle: {
                        stockStyle: '',
                        lineWidth: 1,
                        fillStyle: ''
                    }
                }
            },
            //节点
            node: {
                type: 'circle',
                size: 10,
                lineStyle: {

                }
            }
        },
        //饼图
        pie: {
            clockwise: false,
            startAngle: 0,
            radius: 0,
            solid: false,
            inSideCircleRadius: 0,
            lineStyle: {
                strokeStyle: "#fff",
                lineWidth: 1
            },
            node: {
                show: false,
                nodeText: {
                    textStyle: {
                        font: '10px PingFangSC-Regular',
                        lineWidth: 1,
                        lineType: 'dash' //solid 实线  dash 虚线
                    },
                    formatter: function (value) {
                        return value + "%";
                    }
                }
            }
        },
        //柱状图
        column: {

        },
        //分时图
        timeLine: {

        },
        //y坐标
        yAxis: {
            lineStyle: {
                lineWidth: 1,
                strokeStyle: '#D6D6D6'
            },
            textStyle: {
                fillStyle: '#c5c5c5',
                font: '10px PingFangSC-Regular'
            }

        },
        //x坐标
        xAxis: {
            lineStyle: {
                lineWidth: 1,
                strokeStyle: '#D6D6D6'
            },
            textStyle: {
                fillStyle: '#c5c5c5',
                font: '10px PingFangSC-Regular'
            }
        }

    };
    /*util工具开始*/
    var util = {
        //jquery 深度拷贝
        deepCopy: function () {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;

                // Skip the boolean and the target
                target = arguments[i] || {};
                i++;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && typeof target !== "function") {
                target = {};
            }

            // Extend jQuery itself if only one argument is passed
            if (i === length) {
                target = this;
                i--;
            }

            for (; i < length; i++) {

                // Only deal with non-null/undefined values
                if ((options = arguments[i]) != null) {

                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (util.isPlainObject(copy) ||
                            (copyIsArray = Array.isArray(copy)))) {

                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && Array.isArray(src) ? src : [];

                            } else {
                                clone = src && util.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = util.deepCopy(deep, clone, copy);

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        },
        isPlainObject: function (obj) {
            if (typeof obj === 'object' && obj.constructor == Object) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * 除法
         */
        accDiv: function (arg1, arg2) {
            var s1 = arg1.toString();
            var s2 = arg2.toString();
            var m = 0;
            try {
                m = s2.split('.')[1].length;
            } catch (e) { }
            try {
                m -= s1.split('.')[1].length;
            } catch (e) { }

            return (s1.replace('.', '') - 0) / (s2.replace('.', '') - 0) * Math.pow(10, m);
        },
        /**
         * 乘法
         */
        accMul: function (arg1, arg2) {
            var s1 = arg1.toString();
            var s2 = arg2.toString();
            var m = 0;
            try {
                m += s1.split('.')[1].length;
            } catch (e) { }
            try {
                m += s2.split('.')[1].length;
            } catch (e) { }

            return (s1.replace('.', '') - 0) * (s2.replace('.', '') - 0) / Math.pow(10, m);
        },
        /**
         * 加法
         */
        accAdd: function (arg1, arg2) {
            var r1 = 0;
            var r2 = 0;
            try {
                r1 = arg1.toString().split('.')[1].length;
            } catch (e) { }
            try {
                r2 = arg2.toString().split('.')[1].length;
            } catch (e) { }

            var m = Math.pow(10, Math.max(r1, r2));
            return (Math.round(arg1 * m) + Math.round(arg2 * m)) / m;
        },
        /**
         * 减法
         */
        addSub: function (arg1, arg2) {
            return accAdd(arg1, -arg2);
        },
        /**
         * [getRatio 画图坐标比例]
         * @param  {[type]} height [description]
         * @param  {[type]} max    [description]
         * @param  {[type]} min    [description]
         * @return {[type]}        [description]
         */
        getRatio: function (height, max, min) {
            if((max - min) == 0){
                return height;
            }else{
                return height / (max - min);
            }
        },
        /**
         * [getCoordinate 获取单个坐标点]
         * @param  {[type]} point  [对应数据值]
         * @param  {[type]} height [可画高度]
         * @param  {[type]} max    [坐标最大值]
         * @param  {[type]} min    [坐标最小值]
         * @return {[type]}        [description]
         */
        getCoordinate: function (point, height, max, min) {
            var ratio = this.getRatio(height, max, min);
            return -(point - min) * ratio;
        },
        /**
         * [convertToPoints 返回页面画图y轴坐标点]
         * @param  {[type]} dataArray [实际y轴数据]
         * @param  {[type]} height    [可画高度]
         * @param  {[type]} max       [坐标最大值]
         * @param  {[type]} min       [坐标最小值]
         * @return {[type]}           [description]
         */
        convertToCoordinatePoints: function (dataArray, height, max, min) {
            var coordinateY = [],
                ratio = this.getRatio(height, max, min);
                
            dataArray.forEach(function (e, i) {
                coordinateY.push(-(e - min) * ratio);
            });
            return coordinateY;
        },
        /**
         * [calculationXpoints 计算数据在x轴坐标起始画点]
         * @param  {[type]} range       [x轴宽]
         * @param  {[type]} len         [数量]
         * @param  {[type]} percentWidth [单位]
         * @return {[type]}            画图起始点 中心点 和柱形宽度
         */
        calculationXpoints: function (range, len, percentWidth, type) {
            var averageWidth = range / len; //平分宽度
            var designsWidth = this.getColumnWidth(range, len, percentWidth); //返回柱形宽度
            var obj = {
                coordinates: [], //画图起始点
                centerPoints: [], //坐标中心点
                width: designsWidth //矩形宽度
            };
            var coordinatePoints = this.getXCoordinatePoints(range, len, type);
            var i = 0;
            //返回x轴中心点
            obj.centerPoints = coordinatePoints.coordinatesX;

            for (i = 0; i < len; i++) {
                obj.coordinates.push(obj.centerPoints[i] - designsWidth / 2);
            }
            return obj;
        },
        /**
         * [getColumnWidth 获取柱形宽度]
         * @param  {[type]} range        [description]
         * @param  {[type]} len          [description]
         * @param  {[type]} percentWidth [description]
         * @return {[type]}              [description]
         */
        getColumnWidth: function (range, len, percentWidth) {
            return range / len * percentWidth / 100;
        },
        /**
         * [getXCoordinatePoints 获取数据X坐标位置点]
         * @param  {[type]} nArray [返回数组数据]
         * @param  {[type]} len    [分段数据]
         * @param  {[type]} type   [起始位置类型 0 从0点开始计算坐标 1每个坐标分段后的中心点计算坐标]
         * @return {[type]}        [description]
         */
        getXCoordinatePoints: function (range, len, type) {
            var i = 0;
            var coordinatesX = []; //中心点坐标
            var fingerArray = []; //点击区域
            switch (type) {
                case 0:
                    //起始点从0点开始每段长为x坐标 @示例 |____|____|____|   适合起始位置点的折线
                    for (i = 0; i < len + 1; i++) {
                        // K0101217 加保护，否则第一个点len为0，值为NaN
                        if(len == 0){
                            len = 1
                        }
                        coordinatesX.push(i * range / len);
                        fingerArray.push((i * 2 + 1) * (range / len / 2));
                    }
                    break;
                case 1:
                    //起始点 平均每段 取中点坐为x轴坐标@示例  _|__|__|__|_  适合非起始位置的柱状图
                    for (i = 0; i < len; i++) {
                        coordinatesX.push((i + 0.5) * range / len);
                        fingerArray.push(range / len * (i + 1));
                    }
                    break;
                case 2:
                    //起始点平均每段 末段算x轴坐标@示例  __|__|__|__|__
                    for (i = 0; i < len; i++) {
                        coordinatesX.push((i + 1) * range / (len + 1));
                        fingerArray.push((i * 2 + 3) * range / (len + 1) / 2);
                    }
                    break;
                default:
                    //起始点 平均每段 取中点坐为x轴坐标@示例  _|__|__|__|_  适合非起始位置的柱状图
                    for (i = 0; i < len; i++) {
                        coordinatesX.push((i + 0.5) * range / len);
                        fingerArray.push(range / len * (i + 1));
                    }
                    break;
            }

            return {
                coordinatesX: coordinatesX,
                fingerArray: fingerArray
            };
        },
        /**
         * [getCenterPoint 获取中心点坐标]
         * @param  {[type]} range [范围宽度]
         * @param  {[type]} len   [数量]
         * @param  {[type]} x     [当前x轴]
         * @param  {[type]} type  [画图类型]
         * @return {[type]}       [description]
         */
        getCenterPoint: function (range, len, x, type) {
            var i = 0;
            var obj = {
                centerPoints: [],
                pointsArray: []
            };

            var coordinatePoints = this.getXCoordinatePoints(range, len, type);
            //x超出边界 x值为最大边界值            
            x = x > range ? range : x;
            obj.centerPoints = coordinatePoints.coordinatesX;
            // for (i = 0; i < len; i++) {
            //     obj.pointsArray.push(range / len * (i + 1));
            // }

            return {
                value: obj.centerPoints[this.getPointPosition(coordinatePoints.fingerArray, x)], //具体值
                index: this.getPointPosition(coordinatePoints.fingerArray, x) //索引
            };
        },
        /**
         * [getLocationArray 获取位置]
         * @param  {[type]} pointsArray [description]
         * @param  {[type]} x           [description]
         * @return {[type]}             [description]
         */
        getPointPosition: function (pointsArray, x) {

            for (var i = 0; i < pointsArray.length; i++) {
                if (x <= pointsArray[i]) {
                    return i;
                }
            }
        },
        /**
         * [dataSegment 数据分段]
         * @param  {[type]} max         [最大值]
         * @param  {[type]} min         [最小值]
         * @param  {[type]} len         [分段数量]
         * @param  {[type]} basePoint   [基准点是否包含0点]
         */
        dataSegment: function (max, min, len, basePoint) {
            var range = 0; //区间值
            var rangeArray = []; //区间数组
            var i = 0;
            var direct = (max <= 0) ? -1 : (min < 0 ? 0 : 1); //-1 全负，0 有正有负，1 全正
            switch (direct) {
                case 1: //全正 
                    /* 
                        if (basePoint) {
                            range = max; //0 到最大值区间
                            for (i = 0; i <= len; i++) {
                                rangeArray.push(i * range / len);
                            }
                        } else {
                            range = max - min; //最大值到最小值区间
                            for (i = 0; i <= len; i++) {
                                rangeArray.push(i * range / len + min);
                            }
                        }
                    */
                    range = basePoint ? max : max - min;
                    for (i = 0; i <= len; i++) {
                        rangeArray.push(i * range / len + (basePoint ? 0 : min));
                    }

                    break;
                case 0: //有正有负
                    range = max - min; //最大值 最小值区间    
                    if (basePoint) {
                        var actualAbsMax = Math.abs((max + min) >= 0 ? max : min); //绝对值最大值
                        var actualAbsMin = Math.abs((max + min) >= 0 ? min : max); //绝对值最小值
                        var segmentLen = actualAbsMax / actualAbsMin + 1; //分成段位
                        var ratio = (actualAbsMax / actualAbsMin) / segmentLen; //比例                
                        var bigSegmentLen = Math.ceil(ratio * len); //最大分段数量
                        var unitMaxSegmentVal = (actualAbsMax * 1 / bigSegmentLen); //数据范围大的分段平均值
                        var unitMinSegmentVal = (actualAbsMin * 1 / (len - bigSegmentLen)); //数据范围小的分段平均值
                        var unitSegmentVal; //采用平均值比较大的
                        if (unitMaxSegmentVal > unitMinSegmentVal) {
                            unitSegmentVal = unitMaxSegmentVal;
                        } else {
                            unitSegmentVal = unitMinSegmentVal;
                        }

                        //重新计算平均值
                        if ((bigSegmentLen - 1) * unitSegmentVal >= actualAbsMax) {
                            bigSegmentLen = Math.floor(ratio * len); //最大分段数量
                            unitMaxSegmentVal = (actualAbsMax * 1 / bigSegmentLen); //数据范围大的分段平均值
                            unitMinSegmentVal = (actualAbsMin * 1 / (len - bigSegmentLen)); //数据范围小的分段平均值
                            unitSegmentVal = unitMaxSegmentVal > unitMinSegmentVal ?
                                unitMaxSegmentVal : unitMinSegmentVal; //采用平均值比较大的    
                        }
                        //正数占的范围大
                        if (max > Math.abs(min)) {
                            //负数部分数据 包含 0位
                            for (i = len - bigSegmentLen; i >= 0; i--) {
                                rangeArray.push(-unitSegmentVal * i);
                            }

                            //正数部分数据
                            for (i = 1; i <= bigSegmentLen; i++) {
                                rangeArray.push(unitSegmentVal * i);
                            }
                        } else {
                            //负数部分数据 包含 0位
                            for (i = bigSegmentLen; i >= 0; i--) {
                                rangeArray.push(-unitSegmentVal * i);
                            }

                            //正数部分数据
                            for (i = 1; i <= len - bigSegmentLen; i++) {
                                rangeArray.push(unitSegmentVal * i);
                            }
                        }
                    } else {
                        for (i = 0; i <= len; i++) {
                            rangeArray.push(i * range / len + min);
                        }
                    }
                    break;
                case -1: //全负
                    /*                    
                        if (basePoint) {
                            range = min; //0到最小值区间
                            for (i = 0; i <= len; i++) {
                                rangeArray.push(i * range / len);
                            }
                        } else {
                            range = min - max; //最大值到最小值区间
                            for (i = 0; i <= len; i++) {
                                rangeArray.push(i * range / len + max);
                            }
                        }
                    */
                    range = basePoint ? min : min - max;
                    for (i = 0; i <= len; i++) {
                        rangeArray.push(i * range / len + (basePoint ? 0 : max));
                    }
                    rangeArray.reverse();
                    break;
                default:
            }
            return rangeArray;
        },
        /**
         * 获取数组最大值
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
        /**
         * 获取数组最小值值
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
        /**
         * [getTextStyle 数据样式处理]
         * @param  {[type]} style [description]
         * @return {[type]}       [description]
         */
        getTextStyle: function (ctx, style) {
            var arr = ['strokeStyle', 'font', 'textAlign', 'textBaseline', 'fillStyle'];
            var method;
            for (method in style) {
                ctx[method] = style[method];
            }
        },
        /**
         * [getIndexFromMostArray 返回数据索引]
         * @param  {[type]} style [description]
         * @return {[type]}       [description]
         */
        getIndexFromMostArray: function (list, key) {
            for (var i = 0; i < list.length; i++) {
                if (list[i][0] == key) {
                    return i;
                }
            }
        },
        /**
         * [getMinPointDate 获取最小范围日期点]
         * @param  {[type]} listArray  [description]
         * @param  {[type]} key        [description]
         * @return {[type]}            [description]
         */
        getMinPointDate: function (listArray, key, containEquail) {

            var dateArray = [];
            var startDate = "";
            listArray.forEach(function (e, i) {
                dateArray.push(e[0]);
            });
            dateArray = dateArray.sort(function (a, b) {
                return a - b; //从小到大
            });

            for (var i = 0; i < dateArray.length; i++) {
                if (containEquail && Number(dateArray[i]) == key) {
                    startDate = dateArray[i];
                    break;
                }

                if (Number(dateArray[i]) > key) {
                    startDate = dateArray[i];
                    break;
                }
            }
            return startDate;
        },
        /**
         * [getMaxPointDate 获取最大范围日期点]
         * @param  {[type]} listArray  [description]
         * @param  {[type]} key        [description]
         * @return {[type]}            [description]
         */
        getMaxPointDate: function (listArray, key) {
            var dateArray = [];
            listArray.forEach(function (e, i) {
                dateArray.push(e[0]);
            });
            dateArray = dateArray.sort(function (a, b) {
                return b - a;
            });

            for (var i = 0; i < dateArray.length; i++) {
                if (Number(dateArray[i]) <= key) {
                    return dateArray[i];
                }
            }
        },
        /**
         * [segmentsIntr 计算线段相交点]
         * @param  {[type]} a [{x:,y:}}]
         * @param  {[type]} b [{x:,y:}]
         * @param  {[type]} c [{x:,y:}]
         * @param  {[type]} d [{x:,y:}]
         * @return {[type]}   [{x:,y:}]
         */
        segmentsIntr: function (a, b, c, d) {
            // 三角形abc 面积的2倍 
            var areaabc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
            // 三角形abd 面积的2倍 
            var areaabd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);
            // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理); 
            if (areaabc * areaabd >= 0) {
                return false;
            }
            // 三角形cda 面积的2倍 
            var areacda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
            // 三角形cdb 面积的2倍 
            // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出. 
            var areacdb = areacda + areaabc - areaabd;
            if (areacda * areacdb >= 0) {
                return false;
            }
            //计算交点坐标 
            var t = areacda / (areaabd - areaabc);
            var dx = t * (b.x - a.x),
                dy = t * (b.y - a.y);
            return { x: a.x + dx, y: a.y + dy };
        },
        /**
         * [subPixelOptimize 亚像素优化]
         * @param  {[type]} position  [description]
         * @param  {[type]} lineWidth [description]
         * @return {[type]}           [description]
         */
        subPixelOptimize: function (position, lineWidth) {
            if (lineWidth % 2 === 1) {
                //position += position === Math.ceil(position) ? 0.5 : 0;
                position = Math.floor(position) + 0.5;
            } else {
                position = Math.round(position);
            }
            return position;
        },
        /**
         * [windowTocanvas 获取canvas位置]
         * @param  {[type]} canvas [description]
         * @param  {[type]} x      [description]
         * @param  {[type]} y      [description]
         * @return {[type]}        [description]
         */
        windowTocanvas: function (canvas, x, y) {
            var canvasDom = canvas.getBoundingClientRect();
            return {
                x: x - canvasDom.left * (canvas.width / canvasDom.width),
                y: y - canvasDom.top * (canvas.height / canvasDom.height)
            };
        },
        pixelRatio: function () {
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d'),
                backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
            return (window.devicePixelRatio || 1) / backingStore;
        },
        saveImgData: function (canvas, ctx, width, height) {
            canvas.style.display = "none";            
            var dataURL = canvas.toDataURL();
            var parentNode = canvas.parentNode;
            var cImg = parentNode.querySelector("#"+canvas.id+"-img");           
            if (cImg) {
                cImg.src = dataURL;
            } else {
                var imgNode = document.createElement('img');
                imgNode.id = canvas.id + "-img";
                //imgNode.width = width;
                //imgNode.height = height;
                imgNode.src = dataURL;
                parentNode.appendChild(imgNode);
            }

        }
    };
    //公共函数文件
    var tool = {
        initDrawCanvas: function (canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
        },
        /**
         * [drawLine 绘制线条]
         * @param  {[type]} ctx       [description]
         * @param  {[type]} startX    [description]
         * @param  {[type]} startY    [description]
         * @param  {[type]} endX      [description]
         * @param  {[type]} endY      [description]
         * @param  {[type]} lineWidth [description]
         * @param  {[type]} color     [description]
         * @param  {[type]} lineType  [description]
         * @return {[type]}           [description]
         */
    drawLine: function (ctx, startX, startY, endX, endY, lineWidth, color, lineType, dashLen, points) {
            switch (lineType) {
                case "solid":
                this.drawSolidLine(ctx, startX, startY, endX, endY, lineWidth, color, points);
                    break;
                case "dashed":
                    this.drawDashedLine(ctx, startX, startY, endX, endY, lineWidth, color, dashLen);
                    break;
                default:
                this.drawSolidLine(ctx, startX, startY, endX, endY, lineWidth, color, points);

            }
        },
        /**
         * [drawSolidLine 绘制实线]
         * @param  {[type]} ctx       [description]
         * @param  {[type]} startX    [description]
         * @param  {[type]} startY    [description]
         * @param  {[type]} endX      [description]
         * @param  {[type]} endY      [description]
         * @param  {[type]} lineWidth [description]
         * @param  {[type]} color     [description]
         * @return {[type]}           [description]
         */
    drawSolidLine: function (ctx, startX, startY, endX, endY, lineWidth, color, points) {
            ctx.save();
        /*  var x1 = drawInfo.centerPoints[i - 1],
                y1 = yCoordinates[i - 1],
                x2 = drawInfo.centerPoints[i],
                y2 = yCoordinates[i];*/
        // add 线条渐变色
        if (Array.isArray(color) && color.length > 0) {
            // lineGradient
            var lineStyle = ctx.createLinearGradient(points.drawInfo.centerPoints[0], points.yCoordinates[0], points.drawInfo.centerPoints[points.drawInfo.centerPoints.length - 1], points.yCoordinates[points.yCoordinates.length - 1]),
                space = 1 / (color.length - 1)
            color.forEach(function (item, index) {
                lineStyle.addColorStop(index * space, item)
            })
            ctx.strokeStyle = lineStyle
        } else {
            ctx.strokeStyle = color;
        }
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
        ctx.setLineDash([5, 0])
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.restore();
        },
        /**
         * [drawDashedLine 绘制虚线]
         * @param  {[type]} ctx       [description]
         * @param  {[type]} startX    [description]
         * @param  {[type]} startY    [description]
         * @param  {[type]} endX      [description]
         * @param  {[type]} endY      [description]
         * @param  {[type]} lineWidth [description]
         * @param  {[type]} color     [description]
         * @return {[type]}           [description]
         */
        drawDashedLine: function (ctx, startX, startY, endX, endY, lineWidth, color, dashLen) {
            var _cacuDis = function (startX, startY, endX, endY) {
                return Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            };
            var len = _cacuDis(startX, startY, endX, endY),
                slineWidth = lineWidth, //虚线宽度
                sdashLen = dashLen, //虚线默认间隔
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
         * [drawDashedLine 绘制虚线]
         * @param  {[type]} ctx         [description]
         * @param  {[type]} startX      [description]
         * @param  {[type]} startY      [description]
         * @param  {[type]} endX        [description]
         * @param  {[type]} endY        [description]
         * @param  {[type]} setLineDash [点划线间距]
         * @param  {[type]} lineWidth   [description]
         * @param  {[type]} color       [description]
         * @return {[type]}             [description]
         */
        drawDashedLine1: function (ctx, startX, startY, endX, endY, setLineDash, lineWidth, color) {
            ctx.save();
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.setLineDash(setLineDash);
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        },
        /**
         * [drawDottedLine 绘制圆点线]
         * @param  {[type]} startX   [线段起点x轴坐标]
         * @param  {[type]} startY   [description]
         * @param  {[type]} endX     [线段终点x轴坐标]
         * @param  {[type]} endY     [description]
         * @param  {[type]} radius   [圆点半径]
         * @param  {[type]} interval [间隔]
         * @param  {[type]} color    [线段颜色]
         * @return {[type]}          [description]
         */
        drawDottedLine: function (ctx, startX, startY, endX, endY, radius, interval, color) {
            if (!interval) {
                interval = 5;
            }
            var isHorizontal = true;
            if (startX == endX) {
                isHorizontal = false;
            }

            var len = isHorizontal ? endX - startX : endY - startY;

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.moveTo(startX, startY);
            var progress = 0;
            while (len > progress) {
                progress += interval;

                if (progress > len) {
                    progress = len;
                }

                if (isHorizontal) {
                    ctx.moveTo(startX + progress, startY);
                    ctx.arc(startX + progress, startY, radius, 0, Math.PI * 2, true);
                    ctx.fill();
                } else {
                    ctx.moveTo(startX, endX + progress);
                    ctx.arc(startX, startY + progress, radius, 0, Math.PI * 2, true);
                    ctx.fill();
                }
            }
        },
        /**
         * [drawRect 绘制直角矩形]
         * @param  {[type]}  ctx     [description]
         * @param  {[type]}  x       [description]
         * @param  {[type]}  y       [description]
         * @param  {[type]}  width   [description]
         * @param  {[type]}  height  [description]
         * @param  {Boolean} isClear [是否绘制清除画布的矩形区域； true则是绘制一个清除画布矩形区域, false就是绘制其他两种矩形]
         * @param  {Boolean} isFill  [是否填充；true绘制填充矩形， false绘制边框矩形]
         * @param  {[type]}  color   [矩形颜色]
         * @return {[type]}          [description]
         */
        drawRect: function (ctx, x, y, width, height, isClear, isFill, color) {
            // 为true表示绘制清除画布的矩形区域，那么传入的isFill，color值可以为任意值
            if (isClear) {
                ctx.clearRect(x, y, width, height);
            } else {
                if (isFill) {
                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, width, height);
                } else {
                    ctx.strokeStyle = color;
                    ctx.strokeRect(x, y, width, height);
                }
            }
        },
        drawDashedRect: function (ctx, x, y, w, h, color, dashLen) {
            var x1 = x,
                y1 = y,
                x2 = x,
                y2 = y + h,
                x3 = x + w,
                y3 = y + h,
                x4 = x + w,
                y4 = y;
            this.drawDashedLine(ctx, x1, y1, x2, y2, 0.5, color, dashLen);
            this.drawDashedLine(ctx, x2, y2, x3, y3, 0.5, color, dashLen);
            this.drawDashedLine(ctx, x3, y3, x4, y4, 0.5, color, dashLen);
        },
        /**
         * [drawRoundedRect 绘制圆角矩形]
         * @param  {[type]}  x      [description]
         * @param  {[type]}  y      [description]
         * @param  {[type]}  width  [description]
         * @param  {[type]}  height [description]
         * @param  {[type]}  radius [description]
         * @param  {Boolean} isFill [是否绘制填充，true填充，false边框]
         * @param  {[type]}  color  [矩形的颜色]
         * @return {[type]}         [description]
         */
        drawRoundedRect: function (ctx, x, y, width, height, radius, isFill, color) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + radius, radius);
            ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
            ctx.arcTo(x, y + height, x, y + height - radius, radius);
            ctx.arcTo(x, y, x + radius, y, radius);
            ctx.closePath();

            if (isFill) {
                ctx.fillStyle = color;
                ctx.fill();
            } else {
                ctx.strokeStyle = color;
                ctx.stroke();
            }
            ctx.restore();
        },
        /**
         * [getAngle 将角度转换为弧度]
         * @param  {[type]} deg [description]
         * @return {[type]}     [description]
         */
        getAngle: function (deg) {
            return Math.PI * deg / 180;
        },
        /**
         * [drawArc 绘制圆弧或圆 填充圆弧和边框圆弧]
         * @param  {[type]}  ctx           [description]
         * @param  {[type]}  x             [圆心x轴坐标]
         * @param  {[type]}  y             [圆心y轴坐标]
         * @param  {[type]}  radius        [圆弧的半径]
         * @param  {[type]}  startAngle    [开始的弧度（开始角度），只接受弧度单位，需要将deg先转换为rad： rad = Math.PI * deg / 180]
         * @param  {[type]}  endAngle      [结束的弧度（结束的角度）]
         * @param  {[type]}  anticlockwise [旋转方向；true为逆时针，false为顺时针]
         * @param  {Boolean} isOnlyArc     [是否填充；true为填充，false为边框]
         * @param  {Boolean} isFill        [是否仅绘制弧边，如果使用closePath()终点和起点会连接到一起，否则不会。true时不连接，false连接]
         * @param  {[type]}  color         [圆弧的颜色]
         * @return {[type]}                [description]
         */
        drawArc: function (ctx, x, y, radius, startAngle, endAngle, anticlockwise,
        isOnlyArc, isFill, color, lineWidth, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY) {
            if (isFill) {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, radius, this.getAngle(startAngle), this.getAngle(endAngle), anticlockwise);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = color;
            shadowBlur && (ctx.shadowBlur = shadowBlur)
            shadowColor && (ctx.shadowColor = shadowColor)
            shadowOffsetX && (ctx.shadowOffsetX = shadowOffsetX)
            shadowOffsetY && (ctx.shadowOffsetY = shadowOffsetY)
                ctx.beginPath();
                ctx.arc(x, y, radius, this.getAngle(startAngle), this.getAngle(endAngle), anticlockwise);
                if (isOnlyArc) { } else {
                    ctx.closePath();
                }
                ctx.stroke();
            }
        },
        /**
         * [drawSector 绘制扇形]
         * @param  {[type]}  ctx           [description]
         * @param  {[type]}  x             [圆心x轴坐标]
         * @param  {[type]}  y             [圆心y轴坐标]
         * @param  {[type]}  radius        [圆半径]
         * @param  {[type]}  startAngle    [开始弧度]
         * @param  {[type]}  endAngle      [结束弧度]
         * @param  {[type]}  anticlockwise [旋转方向， true逆时针，false顺时针]
         * @param  {Boolean} isFill        [true为填充，false为边框]
         * @param  {[type]}  color         [扇形的颜色]
         * @return {[type]}                [description]
         */
        drawSector: function (ctx, x, y, radius, startAngle, endAngle, anticlockwise, isFill, color) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, radius, this.getAngle(startAngle), this.getAngle(endAngle), false);
            ctx.closePath();
            if (isFill) {
                ctx.fillStyle = color;
                ctx.fill();
            } else {
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        },
        /**
         * [drawStarPolygons 绘制正多边形]
         * @param  {[type]}  xCenter    [中心坐标X点]
         * @param  {[type]}  yCenter    [中心坐标Y点]
         * @param  {[type]}  radius     [外圆半径]
         * @param  {[type]}  sides      [多边形边数]
         * @param  {[type]}  sideIndent [description]
         * @param  {[type]}  alpha      [alpha 角度 默认270度]
         * @param  {Boolean} isFill     [isFill true填充，false边框]
         * @param  {[type]}  color      [description]
         * @return {[type]}             [description]
         */
        drawStarPolygons: function (ctx, xCenter, yCenter, radius, sides, sideIndent, alpha, isFill, color) {
            var sideIndentRadius = radius * (sideIndent || 0.38);
            var radAngle = alpha ? alpha * Math.PI / 180 : -Math.PI / 2;
            var radAlpha = Math.PI * 2 / sides / 2;

            ctx.save();
            ctx.beginPath();

            var xPos = xCenter + Math.cos(radAngle) * radius;
            var yPos = yCenter + Math.sin(radAngle) * radius;

            ctx.moveTo(xPos, yPos);

            for (var i = 1; i <= sides * 2; i++) {
                var rad = radAlpha * i + radAngle;
                var len = (i % 2) ? sideIndentRadius : radius;
                xPos = xCenter + Math.cos(rad) * len;
                yPos = yCenter + Math.sin(rad) * len;
                ctx.lineTo(xPos, yPos);
            }
            ctx.closePath();
            if (isFill) {
                ctx.fillStyle = color;
                ctx.fill();
            } else {
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        },
        /**
         * [drawHead description]
         * @param  {[type]} x0    [description]
         * @param  {[type]} y0    [description]
         * @param  {[type]} x1    [description]
         * @param  {[type]} y1    [description]
         * @param  {[type]} x2    [description]
         * @param  {[type]} y2    [description]
         * @param  {[type]} style [description]
         * @param  {[type]} color [description]
         * @param  {[type]} width [description]
         * @return {[type]}       [description]
         */
        drawHead: function (ctx, x0, y0, x1, y1, x2, y2, style, color, width) {
            if (typeof (x0) == 'string') {
                x0 = parseInt(x0);
            }
            if (typeof (y0) == 'string') {
                y0 = parseInt(y0);
            }
            if (typeof (x1) == 'string') {
                x1 = parseInt(x1);
            }
            if (typeof (y1) == 'string') {
                y1 = parseInt(y1);
            }
            if (typeof (x2) == 'string') {
                x2 = parseInt(x2);
            }
            if (typeof (y2) == 'string') {
                y2 = parseInt(y2);
            }

            var radius = 3,
                twoPI = 2 * Math.PI;

            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = width;
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            var backdist;
            switch (style) {
                case 0:
                    backdist = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
                    ctx.arcTo(x1, y1, x0, y0, 0.55 * backdist);
                    ctx.fill();
                    break;
                case 1:
                    ctx.beginPath();
                    ctx.moveTo(x0, y0);
                    ctx.lineTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.lineTo(x0, y0);
                    ctx.fill();
                    break;
                case 2:
                    ctx.stroke();
                    break;
                case 3:
                    var cpx = (x0 + x1 + x2) / 3;
                    var cpy = (y0 + y1 + y2) / 3;
                    ctx.quadraticCurveTo(cpx, cpy, x0, y0);
                    ctx.fill();
                    break;
                case 4:
                    var cp1x, cp1y, cp2x, cp2y;
                    var shiftamt = 5;
                    if (x2 == x0) {
                        backdist = y2 - y0;
                        cp1x = (x1 + x0) / 2;
                        cp2x = (x1 + x0) / 2;
                        cp1y = y1 + backdist / shiftamt;
                        cp2y = y1 - backdist / shiftamt;
                    } else {
                        backdist = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
                        var xback = (x0 + x2) / 2;
                        var yback = (y0 + y2) / 2;
                        var xmid = (xback + x1) / 2;
                        var ymid = (yback + y1) / 2;
                        var m = (y2 - y0) / (x2 - x0);
                        var dx = (backdist / (2 * Math.sqrt(m * m + 1))) / shiftamt;
                        var dy = m * dx;
                        cp1x = xmid - dx;
                        cp1y = ymid - dy;
                        cp2x = xmid + dx;
                        cp2y = ymid + dy;
                    }
                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x0, y0);
                    ctx.fill();
                    break;
            }
            ctx.restore();
        },
        /**
         * [drawArrow 画箭头]
         * @param  {[type]} x1    [description]
         * @param  {[type]} y1    [description]
         * @param  {[type]} x2    [description]
         * @param  {[type]} y2    [description]
         * @param  {[type]} style [description]
         * @param  {[type]} which [description]
         * @param  {[type]} angle [description]
         * @param  {[type]} d     [description]
         * @param  {[type]} color [description]
         * @param  {[type]} width [description]
         * @return {[type]}       [description]
         */
        drawArrow: function (ctx, x1, y1, x2, y2, style, which, angle, d, color, width) {
            if (typeof (x1) == 'string') {
                x1 = parseInt(x1);
            }
            if (typeof (y1) == 'string') {
                y1 = parseInt(y1);
            }
            if (typeof (x2) == 'string') {
                x2 = parseInt(x2);
            }
            if (typeof (y2) == 'string') {
                y2 = parseInt(y2);
            }
            style = typeof (style) != 'undefined' ? style : 3;
            which = typeof (which) != 'undefined' ? which : 1;
            angle = typeof (angle) != 'undefined' ? angle : Math.PI / 9;
            d = typeof (d) != 'undefined' ? d : 10;
            color = typeof (color) != 'undefined' ? color : '#000';
            width = typeof (width) != 'undefined' ? width : 1;
            var toDrawHead = typeof (style) != 'function' ? this.drawHead : style;
            var dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            var ratio = (dist - d / 3) / dist;
            var tox, toy, fromx, fromy;
            if (which & 1) {
                tox = Math.round(x1 + (x2 - x1) * ratio);
                toy = Math.round(y1 + (y2 - y1) * ratio);
            } else {
                tox = x2;
                toy = y2;
            }

            if (which & 2) {
                fromx = x1 + (x2 - x1) * (1 - ratio);
                fromy = y1 + (y2 - y1) * (1 - ratio);
            } else {
                fromx = x1;
                fromy = y1;
            }

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.moveTo(fromx, fromy);
            ctx.lineTo(tox, toy);
            ctx.stroke();

            var lineangle = Math.atan2(y2 - y1, x2 - x1);
            var h = Math.abs(d / Math.cos(angle));
            var angle1, topx, topy, angle2, botx, boty;
            if (which & 1) {
                angle1 = lineangle + Math.PI + angle;
                topx = x2 + Math.cos(angle1) * h;
                topy = y2 + Math.sin(angle1) * h;
                angle2 = lineangle + Math.PI - angle;
                botx = x2 + Math.cos(angle2) * h;
                boty = y2 + Math.sin(angle2) * h;
                toDrawHead(ctx, topx, topy, x2, y2, botx, boty, style, color, width);
            }

            if (which & 2) {
                angle1 = lineangle + angle;
                topx = x1 + Math.cos(angle1) * h;
                topy = y1 + Math.sin(angle1) * h;
                angle2 = lineangle - angle;
                botx = x1 + Math.cos(angle2) * h;
                boty = y1 + Math.sin(angle2) * h;
                toDrawHead(ctx, topx, topy, x1, y1, botx, boty, style, color, width);
            }
        },
        /**
         * [drawArcedArrow 画弧形箭头]
         * @param  {[type]} x             [description]
         * @param  {[type]} y             [description]
         * @param  {[type]} r             [description]
         * @param  {[type]} startangle    [description]
         * @param  {[type]} endangle      [description]
         * @param  {[type]} anticlockwise [description]
         * @param  {[type]} style         [description]
         * @param  {[type]} which         [description]
         * @param  {[type]} angle         [description]
         * @param  {[type]} d             [description]
         * @param  {[type]} color         [description]
         * @param  {[type]} width         [description]
         * @return {[type]}               [description]
         */
        drawArcedArrow: function (ctx, x, y, r, startangle, endangle, anticlockwise,
            style, which, angle, d, color, width) {
            style = typeof (style) != 'undefined' ? style : 3;
            which = typeof (which) != 'undefined' ? which : 1;
            angle = typeof (angle) != 'undefined' ? angle : Math.PI / 8;
            d = typeof (d) != 'undefined' ? d : 10;
            color = typeof (color) != 'undefined' ? color : '#000';
            width = typeof (width) != 'undefined' ? width : 1;

            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = width;
            ctx.strokeStyle = color;
            ctx.arc(x, y, r, startangle, endangle, anticlockwise);
            ctx.stroke();
            var sx, sy, lineangle, destx, desty;
            ctx.strokeStyle = 'rgba(0,0,0,0)';
            if (which & 1) {
                sx = Math.cos(startangle) * r + x;
                sy = Math.sin(startangle) * r + y;
                lineangle = Math.atan2(x - sx, sy - y);
                if (anticlockwise) {
                    destx = sx + 10 * Math.cos(lineangle);
                    desty = sy + 10 * Math.sin(lineangle);
                } else {
                    destx = sx - 10 * Math.cos(lineangle);
                    desty = sy - 10 * Math.sin(lineangle);
                }
                this.drawArrow(sx, sy, destx, desty, style, 2, angle, d, color, width);
            }

            if (which & 2) {
                sx = Math.cos(endangle) * r + x;
                sy = Math.sin(endangle) * r + y;
                lineangle = Math.atan2(x - sx, sy - y);
                if (anticlockwise) {
                    destx = sx - 10 * Math.cos(lineangle);
                    desty = sy - 10 * Math.sin(lineangle);
                } else {
                    destx = sx + 10 * Math.cos(lineangle);
                    desty = sy + 10 * Math.sin(lineangle);
                }
                this.drawArrow(sx, sy, destx, desty, style, 2, angle, d, color, width);
            }
            ctx.restore();
        }
    };
    /*默认配置参数*/
    var config = {
        dom: "",
        //数据结构
        series: [],
        defaultDataSize: 0,
        //放大缩放比例
        scale: 1,
        //上下左右预留空间
        flexible: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        },
        //提示框
        tooltip: {
            show: false
        },
        //网格线
        grid: {
            //默认不展示x轴辅助线
            showXgridLine: false,
            showYgridLine: true,

            //默认样式
            // style: {
            //     lineWidth: 0.5, //线条宽度
            //     strokeStyle: "#cccc", //线条颜色
            // },
            //xy轴单独设置
            xLineStyle: {
                lineWidth: 1,
                strokeStyle: '#ededed'
            },
            //x辅助线数据 数组的数量表示 辅助线的数量 
            //顺序 x轴为从左到右 
            //y轴为从上到下 值为true则画 否则不画
            //画图规则 [true]一条为中间  [true,true]2条 上下  [false,true,false]3条 上中下 4条以上均分
            xGridLine: [],
            yLineStyle: {
                lineWidth: 1,
                strokeStyle: '#ededed'
            },
            yGridLine: []
        },
        //y坐标
        yAxis: {
            //展示y轴
            show: true,
            data: [],
            avgNum: 1,
            // formatter: function() {

            // },
            //可选
            // lineStyle: {
            //     fontSize: 11,
            //     fontFamily: '',
            //     strokeStyle: '#ccc'
            // },
            // textStyle:{
            // 
            // }
            margin: 10,
            basisPoint: false, //基点位置 是否已0点为基点
            labelAlign: 'outside',
            position: 'left' // left right
        },
        //x坐标
        xAxis: {
            data: [], //{label: '',textStyle: {},}
            show: true,
            //可选
            // lineStyle: {
            //     fontSize: 11,
            //     fontFamily: '',
            //     fillStyle: '#ff0000',
            //     lineWidth:1
            // },
            // textStyle:{
            //     textAlign:'center'
            // },
            //距离坐标轴距离
            margin: 10, //可以为数组[上下,左右] [上,左右,下][上,右,下,左]
            position: 'bottom' //top bottom
        }
        //回调函数
        // callback: function() {
        //     return { x: x, y: y }
        // },
        //无数据展示
        // noDataLoadingOption: {
        //     label: '暂无数据',
        //     // left right center bottom
        //     xAlign: 'center',
        //     yAlign: 'center',
        //     style: {
        //         fontFamily: 'Arial, Verdana, sans...',
        //         fontSize: 12,
        //         fontStyle: 'normal',
        //         fontWeight: 'normal'
        //     }

        // }
    };
    config = util.deepCopy(true, {}, theme);
    /*组件开始*/
    var component = {
        /**
         * [createGridLine 绘制辅助线]
         * @param  {[type]} ctx       [description]
         * @param  {[type]} width     [description]
         * @param  {[type]} height    [description]
         * @param  {[type]} type      [类型 x轴 y轴]
         * @param  {[type]} number    [分段几份]
         * @param  {[type]} lineWidth [description]
         * @param  {[type]} lineColor [description]
         * @param  {[type]} lineType  [线的类型]
         * @return {[type]}           [description]
         */
        createGridLine: function (ctx, width, height, type, number, lineWidth,
            lineColor, lineType, dashLen, zeroIndex) {
            var i = 0;
            if (!type) {
                type = 'y';
            }
            if (!number) {
                number = 3;
            }
            if (!lineWidth) {
                lineWidth = 0.5;
            }
            if (!lineColor) {
                lineColor = '#eee';
            }
            if (type === "x") {
                for (i = 0; i <= number; i++) {
                    tool.drawLine(ctx, width / number * i, 0, width / number * i, -height,
                        lineWidth, lineColor, lineType, dashLen);
                }
            }
            if (type === "y") {
                for (i = 0; i <= number; i++) {
                    if (zeroIndex != i) {
                        tool.drawLine(ctx, 0, -height / number * i, width, -height / number * i,
                            lineWidth, lineColor, lineType, dashLen);
                    }
                }
            }
        },
        /**
         * [createXAxis 绘制x轴坐标]
         * @return {[type]} [description]
         */
        createXAxis: function () {

        },
        /**
         * [createYAxis 绘制y轴坐标]
         * @return {[type]} [description]
         */
        createYAxis: function () {

        },
        /**
         * [createXAxisText 绘制x轴文字]
         * @return {[type]} [description]
         */
        createXAxisText: function () {

        },
        /**
         * [createYAxisText 绘制y轴文字]
         * @return {[type]} [description]
         */
        createYAxisText: function () {

        },
        /**
         * [createBusinessFlag 创建买卖标志]
         * @param  {[type]} ctx       [description]
         * @param  {[type]} centerX   [中心坐标]
         * @param  {[type]} lowerY    [最低点]
         * @param  {[type]} maxY      [最高点]
         * @param  {[type]} flag      [0买 1卖]
         * @return {[type]}           [description]
         */
        createBusinessFlag: function (ctx, centerX, lowerY, maxY, flag) {
            var range = (flag ? -1 : 1) * 2;
            if (flag) {
                maxY = maxY + range;
                tool.drawHead(ctx, centerX, maxY, centerX + 3, maxY - 6, centerX - 3, maxY - 6, 1, '#4a90e2', 1);
            } else {
                lowerY = lowerY + range;
                tool.drawHead(ctx, centerX, lowerY, centerX + 3, lowerY + 6, centerX - 3, lowerY + 6, 1, '#ff8400', 1);
            }
        },
        /**
         * [createNodeText 绘制节点文字]
         * 6.5修改 data数据为数组对象时 文字输出展示问题
         * @param  {[type]} ctx       [description]
         * @param  {[type]} xArray    [对应一组数据x轴数组]
         * @param  {[type]} yArray    [对应一组数据y轴数组]
         * @param  {[type]} textArray [数组数据 可能为对象]
         * @param  {[type]} marign    [距离文字距离]
         * @param  {[type]} style     [样式数组0 正 1负]
         * @return {[type]} emptyStatus  [空数据样式]         
         * @return {[type]}           [description]
         */
        createNodeText: function (ctx, xArray, yArray, textArray, actualArray, marign, style, emptyStatus) {
            ctx.save();
            ctx.textAlign = "center";
            ctx.beginPath();
            textArray.forEach(function (e, i) {
                //5.18 增加数据为空判断 防止出现undefined
                if (!e) { return; }
                var lowHeight = 0;
                var txt, txtStyle;
                if (emptyStatus && parseFloat(actualArray[i]) === 0) {
                    if (actualArray[i].toString().indexOf("-") != -1) {
                        lowHeight = 10;
                    } else {
                        lowHeight = -10;
                    }
                }
                if (typeof e == "object") {
                    txt = e.value;
                } else {
                    txt = e;
                }
                if (txt.toString().indexOf("-") != -1) {
                    //负数
                    txtStyle = $.extend({}, style[1], e.style);
                    util.getTextStyle(ctx, txtStyle);
                    ctx.fillText(txt, xArray[i], lowHeight + yArray[i] + marign);
                } else {
                    //正数
                    txtStyle = $.extend({}, style[0], e.style);
                    util.getTextStyle(ctx, txtStyle);
                    ctx.fillText(txt, xArray[i], lowHeight + yArray[i] - marign);
                }

            });
            ctx.closePath();
            ctx.restore();
        },
        //单个文字
        createSingleNodeText: function (ctx, x, y, text, actual, marign, style, emptyStatus) {
            ctx.save();
            ctx.textAlign = "center";                    
            //5.18 增加数据为空判断 防止出现undefined
            if (!text) { return; }
            var lowHeight = 0;
            var txt, txtStyle;
            if (emptyStatus && parseFloat(actual) === 0) {
                if (actual.toString().indexOf("-") != -1) {
                    lowHeight = 10;
                } else {
                    lowHeight = -10;
                }
            }
            txt=text;
            if (txt.toString().indexOf("-") != -1) {
                //负数
                txtStyle = style[1];
                util.getTextStyle(ctx, txtStyle);
                ctx.fillText(txt, x, lowHeight + y + marign);
            } else {
                //正数
                txtStyle = style[0];
                util.getTextStyle(ctx, txtStyle);
                ctx.fillText(txt, x, lowHeight + y - marign);
            }            
            ctx.restore();
        }
    };
    /*画线图*/
    var ChartLine = function (obj, value) {
        this.global = (function (obj, value) {
            var
                flexible = obj.getRealDrawSpace(),
                coordinateInfo = {
                    //可画宽度
                    width: obj.width - flexible.left - flexible.right,
                    //可画高度
                    height: obj.height - flexible.top - flexible.bottom
                },
                option = util.deepCopy(true, {}, obj.option.line, value); //数据结构混合
            //设置比例            
            var tr = util.getRatio(coordinateInfo.height,obj.max, obj.min);
            document.querySelector(obj.option.dom).setAttribute("data-ratio", tr);
            document.querySelector(obj.option.dom).setAttribute("data-max", obj.max);
            document.querySelector(obj.option.dom).setAttribute("data-min", obj.min);
            //增加对特殊数据的处理 data是对象数据 {value,style:{}}
            var singleData = [];

            value.data.forEach(function (item, i) {
                //数据是对象则赋值
                if (typeof item == 'object') {
                    singleData.push(item.value);
                } else {
                    singleData.push(item);
                }
            });            
            var defaultSize = obj.option.defaultDataSize ? obj.option.defaultDataSize : value.data.length;
            
            return {
                obj: obj,
                value: value,
                defaultDataSize:defaultSize,
                //预留空间
                flexible: flexible,
                //计算后的最大值
                max: obj.max,
                //计算后的最小值
                min: obj.min,
                //合并后的图表信息
                option: option,
                //是否显示0位置
                basisPoint: obj.option.yAxis.basisPoint,
                //分段数量
                sectionNumber: obj.option.yAxis.avgNum,
                //canvas 可画区域起始坐标
                coordinateStart: {
                    x: flexible.left,
                    y: obj.height - flexible.bottom
                },
                style: {
                    lineType: option.lineType || "solid",
                    dashLen: option.dashLen || 5
                },
                //canvas 可画区域宽高信息
                coordinateInfo: coordinateInfo,
                //返回画图基础数据 coordinates画图起始点 centerPoints 坐标中心点 width矩形宽度
                drawInfo: util.calculationXpoints(coordinateInfo.width, option.drawType ?
                    defaultSize : defaultSize - 1, 0, option.drawType),
                //返回y轴数据
                yAxisArray: util.dataSegment(obj.max, obj.min, obj.option.yAxis.avgNum,
                    obj.option.yAxis.basisPoint),
                //返回数据y轴坐标
                yCoordinates: util.convertToCoordinatePoints(singleData, 
                    coordinateInfo.height,
                    obj.max, obj.min),
                //获取基点位置
                basic: util.getCoordinate(obj.option.yAxis.basisPoint ? 0 : (obj.max <= 0 ? obj.max : obj.min),
                    coordinateInfo.height, obj.max, obj.min)
            };

        }(obj, value));
        //初始化
        this.init();
    };

    ChartLine.prototype = {
        init: function (index) {
            this.index = index;
            this
                .setConfig() //全局配制
                .setGuide() //画辅助线
                .setAxis() //画xy轴
                .vertexLine() //从顶点画参考线                
                .drawLine() //画折线
                .drawArea() //画阴影面积                
                .setNode() //画节点 
                .setNodeCircle() //画节点圆圈
                .setEvents() //事件回调
                .setEnd(); //结束绘图
        },
        /**
         * [setConfig 配置画图基础]
         */
        setConfig: function (index) {
            var ctx = this.global.obj.ctx;
            ctx.save();
            //定位到可画底部位置
            //console.log(this.global.coordinateStart);
            ctx.translate(this.global.coordinateStart.x, this.global.coordinateStart.y);
            return this;
        },
        setEnd: function () {
            var ctx = this.global.obj.ctx;
            ctx.restore();
            return this;
        },
        setEvents: function () {
            var obj = this.global.obj;
            var touchCanvas = obj.option.touchCanvas;
            if (touchCanvas) {
                touchCanvas(this.global);
            }
            return this;
        },
        /**
         * [getZeroIndex 获取0点索引]
         * @return {[type]} [description]
         */
        getZeroIndex: function () {
            var obj = this.global.obj;
            //获取0点y值
            var zeroY = util.convertToCoordinatePoints([0], this.global.coordinateInfo.height,
                this.global.max, this.global.min)[0];
            var height = this.global.coordinateInfo.height;
            var number = obj.option.yAxis.avgNum;
            var index = 0;
            for (var i = 0; i <= number; i++) {
                if (Math.abs(Math.abs(zeroY) - Math.abs(-height / number * i)) < 1) {
                    index = i;
                    break;
                }
            }
            return index;
        },
        /**
         * [setGuide 配制网格线]
         */
        setGuide: function () {
            var obj = this.global.obj;
            var ctx = this.global.obj.ctx;
            var xLineType = obj.option.grid.xLineType || "solid"; //x轴网格线类型 solid 实线 dashed 虚线
            var yLineType = obj.option.grid.yLineType || "solid"; //y轴网格线类型
            var dashLen = obj.option.grid.dashLen || 5;
            //画y轴辅助线
            if (obj.option.grid.showYgridLine) {
                if (obj.option.grid.drawYCustomGraph) {
                    //obj.option.grid.drawYCustomGraph(ctx, obj.option);
                } else {
                    component.createGridLine(
                        ctx,
                        this.global.coordinateInfo.width,
                        this.global.coordinateInfo.height,
                        'y',
                        obj.option.yAxis.avgNum,
                        obj.option.grid.yLineStyle.lineWidth,
                        obj.option.grid.yLineStyle.strokeStyle,
                        xLineType,
                        dashLen,
                        this.getZeroIndex()
                    );
                }
            }

            //画x轴辅助线
            if (obj.option.grid.showXgridLine) {
                if (obj.option.grid.drawXCustomGraph) {
                    //obj.option.grid.drawXCustomGraph(ctx, obj.option);
                } else {
                    component.createGridLine(
                        ctx,
                        this.global.coordinateInfo.width,
                        this.global.coordinateInfo.height,
                        'x',
                        obj.option.yAxis.avgNum,
                        obj.option.grid.xLineStyle.lineWidth,
                        obj.option.grid.xLineStyle.strokeStyle,
                        yLineType,
                        dashLen
                    );
                }
            }

            return this;
        },
        /**
         * [setAxis 配制坐标轴]
         */
        setAxis: function () {
            var obj = this.global.obj;
            var ctx = this.global.obj.ctx;

            if (obj.option.xAxis.show) {
                obj.drawXline();
            }
            //画y轴
            if (obj.option.yAxis.show) {
                obj.drawYline();
            }

            return this;
        },
        /**
         * [setNode 结点信息]
         */
        setNode: function () {
            var that=this;
            var obj = this.global.obj;
            var ctx = this.global.obj.ctx;
            var option = this.global.option;
            var drawInfo = this.global.drawInfo;
            var value = this.global.value;
            var zeroY = this.global.basic;
            var basisPoint = obj.option.yAxis.basisPoint;
            var yCoordinates = this.global.yCoordinates;
            var emptyStatus = option.emptyState || false; //是否有为0空样式
            if (option.node && option.node.nodeText && option.node.nodeText.show) {
                //获取结点格式化函数
                var formatter = option.node.nodeText.formatter;
                //格式化页面显示数据
                var showData = value.data;                
                showData.forEach(function (e, i) {
                    if (typeof formatter == "function") {
                        if (typeof e == 'object') {
                            showData[i].value = formatter(e.value, i);
                        } else {
                            showData[i] = formatter(e, i);
                        }
                    }
                    //判断展示第一个和最后一个样式 第一个左对齐 最后一个右对齐                   
                    if(i==0){
                        option.node.nodeText.lineStyle.textAlign="left";
                        option.node.nodeText.negativeLineStyle.textAlign="left";                       
                    }else if(i==that.global.defaultDataSize-1){
                        option.node.nodeText.lineStyle.textAlign="right";
                        option.node.nodeText.negativeLineStyle.textAlign="right";
                    }else{
                        option.node.nodeText.lineStyle.textAlign="center";
                        option.node.nodeText.negativeLineStyle.textAlign="center";
                    }
                    component.createSingleNodeText(ctx, drawInfo.centerPoints[i], yCoordinates[i], 
                        showData[i], option.data[i],option.node.nodeText.margin,
                        [option.node.nodeText.lineStyle,option.node.nodeText.negativeLineStyle], emptyStatus);
                    
                });
                // component.createSingleNodeText(ctx, drawInfo.centerPoints, yCoordinates, showData, option.data,
                //     option.node.nodeText.margin, [option.node.nodeText.lineStyle,
                //     option.node.nodeText.negativeLineStyle], emptyStatus);
            }

            return this;
        },
        /**
         * [setNodeCircle 节点圆圈]
         * @return {[type]} [description]
         */
        setNodeCircle: function () {
            var ctx = this.global.obj.ctx;
            var drawInfo = this.global.drawInfo;
            var yCoordinates = this.global.yCoordinates;
            var value = this.global.value;
            var fillColor = null;
            var strokeColor = null;
            var lineWidth = 0.5; //默认是0.5px
            var option = this.global.option;
        var shadowBlur = '';
        var shadowColor = '';
        var shadowOffsetX = '';
        var shadowOffsetY = '';
            //如果需要画节点
            if (option.node.drawIndex && option.node.drawIndex.length) {
                var r = option.node.size || 3;
                drawInfo.centerPoints.forEach(function (e, i) {
                    //5.18 首先判断是否自定义画图函数 如果没有 则默认画图
                    if (option.node.drawCustomGraph && typeof option.node.drawCustomGraph == "function") {
                        //传入必须的画图参数                        
                        if (option.node.drawIndex.indexOf(i) != -1) {
                            option.node.drawCustomGraph(ctx, e, yCoordinates[i], i);
                        }
                    } else {
                        //默认画图方法
                        //判断数据正负值
                        if (Number(option.data[i]) < 0) {
                            strokeColor = option.node.negativeLineStyle.strokeStyle;
                            fillColor = option.node.negativeLineStyle.fillStyle;
                            lineWidth = option.node.negativeLineStyle.lineWidth;
                            shadowBlur = option.node.negativeLineStyle.shadowBlur || '';
                            shadowColor = option.node.negativeLineStyle.shadowColor || '';
                            shadowOffsetX = option.node.negativeLineStyle.shadowOffsetX || '';
                            shadowOffsetY = option.node.negativeLineStyle.shadowOffsetY || '';
                        } else {
                            strokeColor = option.node.lineStyle.strokeStyle;
                            fillColor = option.node.lineStyle.fillStyle;
                            lineWidth = option.node.lineStyle.lineWidth;
                            shadowBlur = option.node.negativeLineStyle.shadowBlur || '';
                            shadowColor = option.node.negativeLineStyle.shadowColor || '';
                            shadowOffsetX = option.node.negativeLineStyle.shadowOffsetX || '';
                            shadowOffsetY = option.node.negativeLineStyle.shadowOffsetY || '';
                        }
                        if (option.node.drawIndex.indexOf(i) != -1) {
                            tool.drawArc(ctx, e, yCoordinates[i], r, 0, 360, true, false, false,
                            strokeColor, lineWidth, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY);
                        tool.drawArc(ctx, e, yCoordinates[i], r, 0, 360, true, false, true, fillColor, lineWidth, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY);
                        }
                    }

                });
            }
            return this;
        },
        /**
         * [vertexLine 最高点到坐标轴参考线]
         * @return {[type]} [description]
         */
        vertexLine: function () {
            var ctx = this.global.obj.ctx;
            var drawInfo = this.global.drawInfo;
            var yCoordinates = this.global.yCoordinates;
            var option = this.global.option;
            var zeroY = this.global.basic;
            var vertexLineConfig = option.node.vertexLine || {}; //默认是对象
            if (vertexLineConfig.show) {
                var lineWidth = vertexLineConfig.lineStyle.lineWidth || 1; //默认线宽
                var strokeStyle = vertexLineConfig.lineStyle.strokeStyle || 'rgba(204,204,204,.8)'; //默认颜色
                var lineType = vertexLineConfig.lineType || "solid"; //默认是实线
                var dashLen = vertexLineConfig.dashLen || 40; //虚线有                 
                drawInfo.centerPoints.forEach(function (e, i) {
                    tool.drawLine(ctx, e, yCoordinates[i], e, zeroY, lineWidth, strokeStyle, lineType, dashLen);
                });
            }

            return this;
        },
        /**
         * [drawLine 画折线]
         * @return {[type]} [description]
         */
        drawLine: function () {
            var option = this.global.option;
            if (option.negativeLineStyle) {
                this.drawLineB();
            } else {
                this.drawLineA();
            }
            return this;
        },
        /**
         * [drawLineA 绘制折线统一颜色]
         * @return {[type]} [description]
         */
        drawLineA: function () {
            var that = this;
            var obj = this.global.obj;
            var ctx = this.global.obj.ctx;
            var drawInfo = this.global.drawInfo;
            var value = this.global.value;
            var option = this.global.option;
            var yCoordinates = this.global.yCoordinates;
            var zeroY = this.global.basic;
            var basisPoint = obj.option.yAxis.basisPoint;
            var lineType = this.global.style.lineType;
            var dashLen = this.global.style.dashLen;
            var lineWidth = 1;
            if (value.lineStyle) {
                lineWidth = value.lineStyle.lineWidth ? value.lineStyle.lineWidth : 1;
            }

        var _this = this

            drawInfo.centerPoints.forEach(function (e, i) {
                var showStyle = option.lineStyle.strokeStyle;
                var x1 = drawInfo.centerPoints[i - 1],
                    y1 = yCoordinates[i - 1],
                    x2 = drawInfo.centerPoints[i],
                    y2 = yCoordinates[i];
                if (x1 != void (666) && y1 != void (666)) {
                    //console.log(x1, y1, x2, y2);
                    // webPoints.push({x:x2,y:y2});
                tool.drawLine(ctx, x1, y1, x2, y2, lineWidth, showStyle, lineType, dashLen, _this.global);
                }
            });
            // document.querySelector(obj.option.dom).setAttribute("data-points", JSON.stringify(webPoints));
        },
        /**
         * [drawLineB 绘制折线 正负部分不同颜色]
         * @return {[type]} [description]
         */
        drawLineB: function () {
            var ctx = this.global.obj.ctx;
            var option = this.global.option;
            var zeroY = this.global.basic;
            var lineType = this.global.style.lineType;
            var dashLen = this.global.style.dashLen;
            var dataSegmentLine = this.getDataSegment();
            //遍例线段
            dataSegmentLine.forEach(function (e, i) {
                var showStyle; //显示颜色变量       
                if (e.y1 < e.y2) {
                    //下降趋势
                    if (e.y2 <= zeroY) {
                        showStyle = option.lineStyle.strokeStyle;
                        //负
                    } else {
                        //正
                        showStyle = option.negativeLineStyle.strokeStyle;
                    }
                } else {
                    //上升趋势
                    if (e.y2 >= zeroY) {
                        showStyle = option.negativeLineStyle.strokeStyle;
                        //负
                    } else {
                        showStyle = option.lineStyle.strokeStyle;
                        //正
                    }
                }
                tool.drawLine(ctx, e.x1, e.y1, e.x2, e.y2, 1, showStyle, lineType, dashLen);
            });
        },
        /**
         * [drawArea 绘制区域渐变色]
         * @return {[type]} [description]
         */
        drawArea: function () {
            var zeroY = this.global.basic;
            var option = this.global.option;
            var ctx = this.global.obj.ctx;
            var dataSegment = this.getDataSegment();
            var areaSegment = []; //保存面积区间
            var areaSegmentData = [];
            var count = 0;
            areaSegment[count] = [];
            //绘制逻辑  首先判断填充色 如果只有一种填充色没有负值填充色 则认为是一般的区域图填充 如果有negativeLineStyle负值填充则需计算区域
            var _this = this;
            if (option.lineStyle && option.lineStyle.fillStyle) {
                //有负值填充色
                if (option.negativeLineStyle && option.negativeLineStyle.fillStyle) {
                    //分割数组区域
                    dataSegment.forEach(function (e, i) {
                        if (e.y2 == zeroY) {
                            areaSegment[count].push(e);
                            count++;
                            areaSegment[count] = [];
                        } else {
                            areaSegment[count].push(e);
                        }
                    });
                    //组合区域所有点
                    areaSegment.forEach(function (data, i) {
                        areaSegmentData[i] = [];
                        data.forEach(function (e, j) {
                            if (j == 0) {
                                areaSegmentData[i].push([e.x1, e.y1], [e.x2, e.y2]);
                            } else {
                                areaSegmentData[i].push([e.x2, e.y2]);
                            }
                            if (data.length - 1 === j) {
                                if (areaSegmentData[i][0][1] != e.y2) {
                                    if (e.y2 > zeroY) {
                                        areaSegmentData[i].push([e.x2, zeroY]);
                                        areaSegmentData[i].push([areaSegmentData[i][0][0], zeroY]);
                                    } else if (e.y2 < zeroY) {
                                        areaSegmentData[i].push([e.x2, zeroY]);
                                        areaSegmentData[i].push([areaSegmentData[i][0][0], zeroY]);
                                    } else if (e.y2 == zeroY) {
                                        areaSegmentData[i].push([areaSegmentData[i][0][0], e.y2]);
                                        areaSegmentData[i].push([areaSegmentData[i][0][0], areaSegmentData[i][0][1]]);
                                    }

                                } else {
                                    areaSegmentData[i].push([e.x2, zeroY]);
                                    areaSegmentData[i].push([areaSegmentData[i][0][0], zeroY]);
                                }
                            }
                        });
                    });
                    //绘制渐变色
                    areaSegmentData.forEach(function (data, i) {
                        ctx.beginPath();
                        var max = _this.getMaxAbsPoint(data);
                        var color1, color2;
                        if (max < zeroY) {
                            color1 = option.lineStyle.fillStyle[0];
                            color2 = option.lineStyle.fillStyle[1];
                        } else {
                            color1 = option.negativeLineStyle.fillStyle[0];
                            color2 = option.negativeLineStyle.fillStyle[1];
                        }
                        ctx.fillStyle = _this.createGradient(ctx, max, color1, color2);
                        //指定位置开始填充渐变色
                        data.forEach(function (e, i) {
                            if (i == 0) {
                                ctx.moveTo(e[0], e[1]);
                            } else {
                                ctx.lineTo(e[0], e[1]);
                            }
                        });
                        ctx.fill();
                        ctx.closePath();
                    });
                } else {
                    //没有 则认为是正常区域图填充
                    //可画坐标宽高信息
                    var coordinateInfo = this.global.coordinateInfo;
                    var coordinateXArray = this.global.drawInfo.centerPoints;
                    var coordinateYArray = this.global.yCoordinates;
                    var value = this.global.value;

                    ctx.beginPath();
                    coordinateXArray.forEach(function (e, i) {
                        //画图 先画曲线 判断是否需要填充 填充判断是否是渐变色 是否需要区分正负值填充
                        //再画节点 节点文字
                        var x = util.subPixelOptimize(e, option.lineStyle.lineWidth);
                        var y = util.subPixelOptimize(coordinateYArray[i], option.lineStyle.lineWidth);
                        if (i == 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                        //获取元素样式 首先判断元素是否有自带样式 没有则读取外层样式
                        //style data内有style情况暂时不考虑

                        ctx.strokeStyle = option.lineStyle.strokeStyle;
                        //6.23描边去掉
                        //ctx.stroke();
                        //注意此时最后一个点是根据实际数据最后一个位置计算
                        if (option.lineStyle.fillStyle && i == value.data.length - 1) {
                            //需要填充 则闭合曲线                
                            ctx.lineTo(x, 0);
                            // if (option.fillIndex) {
                            //     ctx.lineTo(util.subPixelOptimize(coordinateXArray[option.fillIndex],
                            //         option.lineStyle.lineWidth), 0);
                            // } else {
                            ctx.lineTo(0, 0);
                            ctx.closePath();
                        }
                    });
                    //判断是否需要填充渐变色
                    if (option.lineStyle.fillStyle && typeof option.lineStyle.fillStyle == 'object') {
                        //需要填充渐变色
                        var min = util.getMin(coordinateYArray);
                        var gradient = ctx.createLinearGradient(0, min, 0, 0); //曲线图填充渐变色
                        gradient.addColorStop(0, option.lineStyle.fillStyle[0]);
                        gradient.addColorStop(1, option.lineStyle.fillStyle[1]);
                        ctx.fillStyle = gradient;
                        ctx.fill();
                    } else if (option.lineStyle.fillStyle) {
                        ctx.fillStyle = option.lineStyle.fillStyle;
                        ctx.fill();
                    }
                }
            }
            return this;
        },
        /**
         * [createGradient 创建渐变色]
         * @param  {[type]} ctx    [description]
         * @param  {[type]} max    [description]
         * @param  {[type]} color1 [description]
         * @param  {[type]} color2 [description]
         * @return {[type]}        [description]
         */
        createGradient: function (ctx, max, color1, color2) {
            var gradient = ctx.createLinearGradient(0, max ? max : 10, 0, 0); //曲线图填充渐变色
            gradient.addColorStop(0, "rgba(0,0,0,0)");
            gradient.addColorStop(0.01, color1);
            gradient.addColorStop(0.99, color2);
            gradient.addColorStop(1, "rgba(0,0,0,0)");

            return gradient;
        },
        /**
         * [getMaxAbsPoint 获取渐变最高值]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        getMaxAbsPoint: function (data) {
            var i = 0;
            var pointArray = [];
            data.forEach(function (e) {
                pointArray.push(e[1]);
            });
            pointArray.sort(function (a, b) {
                return a - b;
            });

            return pointArray[0];
        },
        /**
         * [getDataSegment 正负值分段]
         * @return {[type]} [description]
         */
        getDataSegment: function () {
            var drawInfo = this.global.drawInfo;
            var yCoordinates = this.global.yCoordinates;
            var zeroY = this.global.basic;
            var dataSegmentLine = [];
            //正负段分割
            drawInfo.centerPoints.forEach(function (e, i) {
                var x1 = drawInfo.centerPoints[i - 1],
                    y1 = yCoordinates[i - 1],
                    x2 = drawInfo.centerPoints[i],
                    y2 = yCoordinates[i];
                if (x1 != void (666) && y1 != void (666) && !isNaN(x1) && !isNaN(x2) && !isNaN(y1) && !isNaN(y2)) {
                    if ((y1 > zeroY && y2 < zeroY) || (y2 > zeroY && y1 < zeroY)) {
                        var intersection = util.segmentsIntr({ x: 0, y: zeroY }, { x: 1000, y: zeroY },
                            { x: x1, y: y1 }, { x: x2, y: y2 });
                        dataSegmentLine.push({ x1: x1, y1: y1, x2: intersection.x, y2: intersection.y });
                        dataSegmentLine.push({ x1: intersection.x, y1: intersection.y, x2: x2, y2: y2 });
                    } else {
                        dataSegmentLine.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
                    }
                }
            });
            return dataSegmentLine;
        }
    };
    var line = {
        draw: function (obj, value) {
            return new ChartLine(obj, value);
        }
    };

    //获取设备像素比
    var pixelRatio = (function () {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;

        return (window.devicePixelRatio || 1) / backingStore;
    })();
    //v2改动  drawType 画图方式参数放在外层 方便事件读取. drawType画图方式在数据内部也可以定义.定义则是用于图表生成 和事件无关.

    //画图插件
    export const Chart = function (option) {
        var that = this;
        that.option = util.deepCopy(true, {}, config, option);
        //k线图 单独设置 开始索引
        that.dataIndex = 0;
        //k线图 单独设置 每个数据所占宽度
        that.percentWidth = ''; //
        //k线图 单独设置 数据源
        that.dataSource = [];
        that.ctx = {};

        that.init = function (option) {
            var dom = document.querySelector(that.option.dom);
            //元素存在
            if (dom) {
                var width = dom.offsetWidth;
                var height = dom.offsetHeight;
                var canvas = null;                
                //查看是否存在canvas
                var hasCanvas = dom.querySelector("canvas");
                that.canvasId='canvas' + new Date().getTime();
                if (hasCanvas && hasCanvas.length != 0) {
                    canvas = hasCanvas;
                    that.canvas = hasCanvas;
                    canvas = hasCanvas;
                } else {
                    canvas = document.createElement("canvas");
                    that.canvas = canvas;
                    canvas.setAttribute("id",that.canvasId);
                    dom.appendChild(canvas);
                }
                canvas.setAttribute("width", width * pixelRatio);
                canvas.setAttribute("height", height * pixelRatio);                
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
                //保存 宽高
                that.width = width;
                that.height = height;
                var ctx = canvas.getContext("2d");
                //清空画布
                // ctx.clearRect(0,0,width*pixelRatio,height*pixelRatio);
                //ctx.fillRect(0,0,width * pixelRatio,height * pixelRatio);
                ctx.scale(pixelRatio, pixelRatio);
                that.ctx = ctx;
                //平移
                var space = that.getRealDrawSpace();                
                //获取最大最小值
                var dt = that.getMinMaxData();                            
                //赋值方便调用
                //判断正负值情况
                if (dt.min < 0) {
                    that.min = util.accMul(dt.min, that.option.scale || 1);
                } else if (dt.min == 0) {
                    that.min = 0;
                } else {
                    that.min = util.accDiv(dt.min, that.option.scale || 1);
                }
                //最大值
                if (dt.max > 0) {
                    that.max = util.accMul(dt.max, that.option.scale || 1);
                } else if (dt.max == 0) {
                   that.max = 0;
                } else {
                    that.max = util.accDiv(dt.max, that.option.scale || 1);
                }

                // 单独处理最大最小值相等的特殊情况 2019.4.3
                if((that.max == that.min) && that.option.zero){
                    var avg = that.max/10 == 0? 0.5:that.max/10;
                    that.max = that.max + avg;
                    that.min = that.min - avg;
                }
                
                //获取y轴均分后坐标点,实际坐标点 并赋予变量 方便使用
                that.yAxisPoints = util.dataSegment(that.max, that.min,
                    that.option.yAxis.avgNum, that.option.yAxis.basisPoint);
                //可画高度                
                var aHeight = that.height - space.top - space.bottom;
                //重新赋值 5.2增加判断 that.yAxisPoints不可预知的值导致报错                    
                that.min = that.yAxisPoints[0] ? that.yAxisPoints[0] : that.min;
                that.max = that.yAxisPoints[that.yAxisPoints.length - 1] ?
                    that.yAxisPoints[that.yAxisPoints.length - 1] : that.max;
                //y轴均分后实际坐标点                
                that.yAxisRealPoints = util.convertToCoordinatePoints(that.yAxisPoints,
                    aHeight, that.yAxisPoints[that.yAxisPoints.length - 1], that.yAxisPoints[0]);


                //x轴辅助线
                if (typeof that.option.grid.drawYCustomGraph == "function") {
                    //console.log(1);
                    that.option.grid.drawYCustomGraph(ctx, that.option);
                }
                if (typeof that.option.grid.drawXCustomGraph == "function") {
                    that.option.grid.drawXCustomGraph(ctx, that.option);
                }                
                //y轴辅助线                
                //处理series 数组
                if (that.option.series && that.option.series.length >= 1) {
                    //获取图表类型
                    that.option.series.forEach(function (value, i) {
                        var tp = value.type.toLowerCase();
                        if(value.data.length==0){
                            return false;
                        }
                        switch (tp) {
                            //曲线图
                            case 'line':
                                var defaultSize = that.option.defaultDataSize ?
                                    that.option.defaultDataSize : value.data.length;

                                line.draw(that, value);
                                // that.events(defaultSize)
                                break;
                            //K线图                        
                            // case 'pie':
                            //     pie.draw(that, value);
                            //     break;
                            //     //柱状图
                            //自定义画图
                            case 'custom':
                                if (typeof value.drawCustomGraph == "function") {
                                    value.drawCustomGraph(ctx);
                                }
                                break;
                            //     //雷达图
                            // case 'radar':
                            //     radar.draw(that, value);
                            //     break;
                            //     //分时图
                            // case 'timeline':
                            //     break;
                            //默认
                            default:

                        }
                    });
                }

                if (option.saveImg) {
                    util.saveImgData(canvas, that.ctx, width, height);
                }

            }
        };
        that.init(option);
        //调用事件 6.6增加touchIndex 触摸索引 表示依据第几个曲线图来做事件处理

        if (that.option.touchIndex != undefined && typeof that.option.events.touchstart == "function") {
            that.events();
        }

    };
    Chart.prototype = {
        /**
         * 更新canvas
         */
        upDateCanvas: function (s, index) {
            this.dataIndex = index;
            k.draw(this, this.dataSource, s);
        },
        // 更新曲线图 参数传递和初始化一样.
        update: function (op) {
            var that = this;
            //参数初始化
            that.option = util.deepCopy(true, {}, config, op);
            that.init(op);
        },
        /**
         * 获取文字样式
         */
        // drawLine:line.draw,
        getTextStyle: function (style) {
            // ctx.font = "48px serif";
            // ctx.measureText("foo")
            var arr = ['strokeStyle', 'font', 'textAlign', 'textBaseline', 'fillStyle'];
            var method;
            for (method in style) {
                this.ctx[method] = style[method];
            }
        },
        /**
         * 获取线框样式
         */
        getLineStyle: function (style) {
            var arr = ['fillStyle', 'strokeStyle', 'lineWidth','lineType'];
            var method;
            for (method in style) {
                this.ctx[method] = style[method];
            }
        },
        isEmptyString:function(str){
            if(str==='' || str===null || typeof(str)==="undefined"){
                return true;
            }else{
                return false;
            }
        },
        /**
         * 获取最大最小值
         */
        getMinMaxData: function () {            
            var that = this;
            var min, max;
            //最外层有最大最小值
            min = this.option.min;
            max = this.option.max;            
            if ((!that.isEmptyString(min)) && (!that.isEmptyString(max))) {
                return { min: min, max: max };
            } else {
                //读取数据
                this.option.series.forEach(function (item, i) {
                    //数据存在最大最小值
                    if ((!that.isEmptyString(item.min)) && (!that.isEmptyString(item.max))) {
                        //判断之前是否有最大最小值
                        if ((!that.isEmptyString(min)) && (!that.isEmptyString(max))) {
                            min = min > item.min ? item.min : min;
                            max = max < item.max ? item.max : max;
                        } else {
                            min = item.min;
                            max = item.max;
                        }

                    } else {

                        //数据未带最大最小值 则读取数据获取最大最小值
                        var tm = util.getMax(item.data);                        
                        if (!that.isEmptyString(max)) {
                            max = tm > max ? tm : max;
                        } else {
                            max = tm;
                        }
                        var tn = util.getMin(item.data);
                        
                        if (!that.isEmptyString(min)) {
                            min = tn < min ? tn : min;
                        } else {
                            min = tn;
                        }                        
                    }
                });
                return { min: min, max: max };
            }
        },
        /**
         * 获取实际可画图空间
         */
        getRealDrawSpace: function () {
            return this.option.flexible ? this.option.flexible : { left: 0, right: 0, bottom: 0, top: 0 };
        },
        /**
         * [getWebPoint 获取坐标点的web位置]
         * @return {[type]} [description]
         */
        getWebPoint: function (x, y) {
            var space = this.getRealDrawSpace();
            var xp = x + space.left;
            return { x: xp, y: this.height + y - space.bottom };
        },
        /**
         * 
         */
        getCanvas: function () {
            var that = this;
            return document.querySelector(that.option.dom);
        },
        getMarginData: function (margin) {
            if (typeof margin == 'string' || typeof margin == 'number') {
                return [margin, margin, margin, margin];
            } else if (typeof margin == 'object') {
                if (margin.length == 2) {
                    return [margin[0], margin[1], margin[0], margin[1]];
                } else if (margin.length == 3) {
                    return [margin[0], margin[1], margin[2], margin[1]];
                } else {
                    return margin;
                }
            }
        },
        /**
         * 设置属性
         */
        setAttr: function (prop, value) {
            var c = document.querySelector(this.option.dom + " canvas");
            c.setAttribute(prop, value);
        },

        /**
         * 画x轴
         */
        drawXline: function () {
            var that = this;
            //读取配置文件 需要显示 则画
            if (that.option.xAxis.show) {
                //获取间距
                var space = that.getRealDrawSpace();
                //获取可用高度
                var aHeight = that.height - space.top - space.bottom;
                var x, y;
                //获取x轴起始点 坐标
                x = 0;
                //获取x轴基点位置 如果是0 则从0开始画
                if (that.option.yAxis.basisPoint) {
                    //获取0点y坐标                       
                    y = util.getCoordinate(0, aHeight, that.max, that.min);
                } else {
                    //判断数据最大值
                    if (that.max < 0) {
                        //默认最高点位置
                        //计算y轴坐标
                        y = util.getCoordinate(that.max, aHeight, that.max, that.min);
                    } else if (that.min > 0) {
                        //计算最低点位置
                        y = util.getCoordinate(that.min, aHeight, that.max, that.min);
                    } else {
                        y = util.getCoordinate(that.min, aHeight, that.max, that.min);
                    }

                }

                that.ctx.save();
                that.ctx.beginPath();
                x = util.subPixelOptimize(x, that.option.xAxis.lineStyle.lineWidth);
                y = util.subPixelOptimize(y, that.option.xAxis.lineStyle.lineWidth);
                that.ctx.moveTo(x, y);
                var ox = util.subPixelOptimize(that.width - space.left - x - space.right,
                    that.option.xAxis.lineStyle.lineWidth);
                var oy = util.subPixelOptimize(y, that.option.xAxis.lineStyle.lineWidth);
                // console.log(x,y,ox,oy)
                that.ctx.lineTo(ox, oy);
                that.getLineStyle(that.option.xAxis.lineStyle);
                that.ctx.stroke();
                that.ctx.restore();
            }
            //画x轴文字
            that.drawXtext();
        },

        drawXtext: function () {
            //获取x轴data数据 没有则不展示 顺序为从左到右
            var that = this;
            var data = that.option.xAxis.data;
            var alignment = that.option.xAxis.alignment;
            var space = that.getRealDrawSpace();
            //判断data数据是否和series里数据长度一致 一致则读取坐标
            var len = that.option.series[0].data.length;
            var margin = that.getMarginData(that.option.xAxis.margin);
            /*--------------------------------------------------------*/
            var position = {
                top: -(that.height - space.bottom - space.top), //上
                middle: -(that.height - space.bottom - space.top) / 2, //中,
                bottom: 0 //下
            };
            //we
            var text;
            var style;
            var pc;
            var x;
            var i = 0;
            var dataPosition = that.option.xAxis.dataBind && position[that.option.xAxis.dataBind] || position.bottom;
            /**
             * 增加x轴自定义画文字方法
             */
            if(that.option.xAxis.drawCustomText){
                that.option.xAxis.drawCustomText(that.ctx,that.option);
                return false;
            }
            /*--------------------------------------------------------*/
            //判断 data是否为空 为空直接返回
            if (!data) {
                return;
            }
            if (alignment === "justify") {
                if (data.length >= 2) {
                    pc = (that.width - space.left - space.right) / (data.length - 1);
                    for (i = 0; i < data.length; i++) {
                        x = i * pc;
                        //如果有设置 textStyle 则读取textStyle 否则读取默认设置
                        if (data[i].textStyle) {
                            style = util.deepCopy(true, {}, that.option.xAxis.textStyle, data[i].textStyle);
                        } else {
                            style = that.option.xAxis.textStyle;
                        }
                        that.getTextStyle(style);
                        if (i == 0) {
                            //第一个是否有设置 textAlign 没有则默认左对齐 left start center right end
                            if (!style.textAlign) {
                                that.ctx.textAlign = 'left';
                            }
                            x = margin[3];
                        } else if (i == data.length - 1) {
                            //最后一个未设置则默认右对齐
                            if (!style.textAlign) {
                                that.ctx.textAlign = 'right';
                            }
                            x = x - margin[1];
                        } else {
                            //其他情况居中
                            if (!style.textAlign) {
                                that.ctx.textAlign = 'center';
                            }
                        }


                        text = util.isPlainObject(data[i]) ? data[i].label : data[i];

                        that.ctx.fillText(text, x, margin[0] + dataPosition);
                    }
                }
            } else {
                /**
                 * 增加判断条件 数据大于1的时候
                 */
                if (len && len == data.length && data.length>1) {
                    //相等 则读取x坐标中心点
                    //首先获取画图类型
                    var drawType = that.option.drawType;
                    var pLen = len;
                    if (drawType == 0) {
                        pLen = pLen - 1;
                    }
                    var xPoints = util.getXCoordinatePoints(that.width - space.left - space.right, pLen, drawType);
                    xPoints.coordinatesX.forEach(function (item, i) {
                        x = item;
                        //如果有设置 textStyle 则读取textStyle 否则读取默认设置
                        if (data[i].textStyle) {
                            style = util.deepCopy(true, {}, that.option.xAxis.textStyle, data[i].textStyle);
                        } else {
                            style = that.option.xAxis.textStyle;
                        }
                        that.getTextStyle(style);
                        if (i == 0) {
                            //第一个是否有设置 textAlign 没有则默认左对齐 left start center right end
                            if (!style.textAlign) {
                                that.ctx.textAlign = 'left';
                            }
                            //x=margin[3];
                        } else if (i == data.length - 1) {
                            //最后一个未设置则默认右对齐
                            if (!style.textAlign) {
                                that.ctx.textAlign = 'right';
                            }
                            //x=x-margin[1];
                        } else {
                            //其他情况居中
                            if (!style.textAlign) {
                                that.ctx.textAlign = 'center';
                            }
                        }                        
                        text = util.isPlainObject(data[i]) ? data[i].label : data[i];
                        that.ctx.fillText(text, x, margin[0] + dataPosition);
                    });

                } else {
                    //不相等 则按自有逻辑处理 2个左右 3个左中右 4个均分.
                    //长度大于二                   
                    if (data.length >= 2) {
                        pc = (that.width - space.left - space.right) / (data.length - 1);
                        for (i = 0; i < data.length; i++) {
                            x = i * pc;
                            //如果有设置 textStyle 则读取textStyle 否则读取默认设置                            
                            if (data[i].textStyle) {
                                style = util.deepCopy(true, {}, that.option.xAxis.textStyle, data[i].textStyle);
                            } else {
                                style = that.option.xAxis.textStyle;
                            }
                            that.getTextStyle(style);
                            if (i == 0) {
                                //第一个是否有设置 textAlign 没有则默认左对齐 left start center right end
                                if (!style.textAlign) {
                                    that.ctx.textAlign = 'left';
                                }
                                x = margin[3];
                            } else if (i == data.length - 1) {
                                //最后一个未设置则默认右对齐
                                if (!style.textAlign) {
                                    that.ctx.textAlign = 'right';
                                }
                                x = x - margin[1];
                            } else {
                                //其他情况居中
                                if (!style.textAlign) {
                                    that.ctx.textAlign = 'center';
                                }
                            }
                            // var text;
                            if (util.isPlainObject(data[i])) {
                                text = data[i].label;
                            } else {
                                text = data[i];
                            }
                            that.ctx.fillText(text, x, margin[0] + dataPosition);
                        }
                    } else {
                        //为1的时候直接画左边
                        if (data[0].textStyle) {
                            style = util.deepCopy(true, {}, that.option.xAxis.textStyle, data[0].textStyle);
                        } else {
                            style = that.option.xAxis.textStyle;
                        }
                        that.getTextStyle(style);
                        if (util.isPlainObject(data[0])) {
                            text = data[0].label;
                        } else {
                            text = data[0];
                        }                        
                        that.ctx.fillText(text, margin[3], margin[0] + dataPosition);
                    }
                }
            }
        },
        /**
         * 画y轴
         */
        drawYline: function () {
            var that = this;
            var space = this.getRealDrawSpace();
            var margin = that.getMarginData(that.option.yAxis.margin);
            //读取配置文件 需要显示 则画
            if (this.option.yAxis.show) {
              if(that.option.yAxis.lineStyle.type==='dashed'){
                //获取可用高度
                var aHeight = this.height - space.top - space.bottom;
                //获取最大最小值
                // var m = this.getMinMaxData();
                var x, y;
                //获取y轴起始点 坐标
                //因为平移过 所以x为0 否则为space.left
                x = 0.5;
                //获取y轴最低点位置
                y = util.getCoordinate(that.min, aHeight, that.max, that.min);
                y = util.subPixelOptimize(y, that.option.yAxis.lineStyle.lineWidth);
                tool.drawLine(that.ctx, x, y, x, space.top + space.bottom - that.height,1, 'rgba(224, 226, 228, 0.6)', 'dashed',3);
              }else{
                //获取间距
                //获取可用高度
                var aHeight = this.height - space.top - space.bottom;
                //获取最大最小值
                // var m = this.getMinMaxData();
                var x, y;
                //获取y轴起始点 坐标
                //因为平移过 所以x为0 否则为space.left
                x = 0.5;
                //获取y轴最低点位置
                y = util.getCoordinate(that.min, aHeight, that.max, that.min);
                that.ctx.beginPath();
                y = util.subPixelOptimize(y, that.option.yAxis.lineStyle.lineWidth);
                var ry = util.subPixelOptimize(space.top + space.bottom - that.height,
                    that.option.yAxis.lineStyle.lineWidth);
                that.ctx.moveTo(x, y);
                that.ctx.lineTo(x, space.top + space.bottom - that.height);
                that.getLineStyle(that.option.yAxis.lineStyle);
                that.ctx.stroke();
              }
            }
            //画文字 在坐标轴里面
            var tx, ty;

            //循环均分坐标点位置     
            that.yAxisRealPoints.forEach(function (point, i) {
                //有单独处理函数 则处理函数
                var text = that.yAxisPoints[i];
                if (that.option.yAxis.formatter && typeof that.option.yAxis.formatter == 'function') {
                    text = that.option.yAxis.formatter(that.yAxisPoints[i]);
                }
                //设置文字样式
                that.getTextStyle(that.option.yAxis.textStyle);
                //画文字 第一个 和最后一个单独处理 移动一个文字的高度

                if (i == 0) {
                    if (!that.option.yAxis.textStyle.textBaseline) {
                        that.ctx.textBaseline = 'bottom';
                    }
                } else if (i == that.yAxisRealPoints.length - 1) {
                    if (!that.option.yAxis.textStyle.textBaseline) {
                        that.ctx.textBaseline = 'top';
                    }
                } else {
                    if (!that.option.yAxis.textStyle.textBaseline) {
                        that.ctx.textBaseline = 'middle';
                    }
                }

                var textw = that.ctx.measureText(text).width;
                //文字x坐标                              
                if (that.option.yAxis.labelAlign == 'inside') {
                    tx = margin[3];
                    if(that.option.yAxis.textStyle.textAlign){
                        that.ctx.textAlign=that.option.yAxis.textStyle.textAlign;
                    }else{
                        that.ctx.textAlign = 'left';
                    }
                    
                } else {
                    //在坐标轴外面
                    tx = -margin[3];
                    if(that.option.yAxis.textStyle.textAlign){
                        that.ctx.textAlign=that.option.yAxis.textStyle.textAlign;
                    }else{
                        that.ctx.textAlign = 'right';
                    }                    
                }                         
                that.ctx.fillText(text, tx, point);
            });
        },
        /*
        画辅助线 option{style:{},ctx:ctx,start:[],end:[]}
         */

        drawGridLine: function (option) {
            option.ctx.beginPath();
            var ox = util.subPixelOptimize(option.start[0], option.style.lineWidth);
            var oy = util.subPixelOptimize(option.start[1], option.style.lineWidth);
            option.ctx.moveTo(ox, oy);
            var ex = util.subPixelOptimize(option.end[0], option.style.lineWidth);
            var ey = util.subPixelOptimize(option.end[1], option.style.lineWidth);
            option.ctx.lineTo(ex, ey);
            option.ctx.strokeStyle = option.style.strokeStyle;
            option.ctx.lineWidth = option.style.lineWidth;
            option.ctx.stroke();
        },

        events: function (len) {
            var that = this;
            var space = that.getRealDrawSpace();
            //判断长按
            var timer = null;
            //
            var startPos = {
                x: 0,
                y: 0
            };
            var direction = -1;
            //是否出发长按
            var _switch;
            //console.log(that.dataIndex,'dataIndex')
            //移动个数
            var dragNum = 0;
            //移动开始位置
            var pos = 0;
            var handel = function (event) {
                var e = {
                    touchstart: function (event) {
                        var touch = event.targetTouches[0];
                        var x = touch.pageX;
                        var divMargin = document.querySelector(that.option.dom).getBoundingClientRect().left;
                        x = x - space.left - divMargin;
                        pos = x;

                        startPos.x = touch.pageX;
                        startPos.y = touch.pageY;
                        var defaultSize = that.option.defaultDataSize ?
                            that.option.defaultDataSize : that.option.series[that.option.touchIndex].data.length;
                        var drawType = that.option.series[that.option.touchIndex].drawType;
                        var ls = defaultSize;
                        if (drawType == 0) {
                            ls = ls - 1;
                        }
                        var realX = util.getCenterPoint(that.width - space.left - space.right,
                            ls, x, drawType);
                        realX.value = realX.value + space.left;
                        realX.curIndex = that.dataIndex;

                        if (that.option.events.longpress) {
                            timer = setTimeout(function () {
                                _switch = true;
                                that.option.events.longpress(realX, that);
                            }, 500);
                        } else {
                            that.option.events.touchstart(realX, that);
                        }
                    },
                    touchmove: function () {
                        var touch = event.targetTouches[0];
                        var x = touch.pageX;
                        var divMargin = document.querySelector(that.option.dom).getBoundingClientRect().left;
                        x = x - space.left - divMargin;

                        //判断方向
                        var ex = touch.pageX;
                        var ey = touch.pageY;

                        //500毫秒内如果滑动超过一定距离就取消长按时间
                        if (Math.abs(ex - startPos.x) > 2) {
                            clearTimeout(timer);
                        }

                        if (Math.abs(ex - startPos.x) >= 2 || Math.abs(ey - startPos.y) >= 2) {

                            if (direction == -1) {
                                direction = that.getDirection(startPos.x, startPos.y, ex, ey);
                            }
                            if (direction == 1 || direction == 2) {
                                //上下滑动
                                return false;
                            }

                            var defaultSize = that.option.defaultDataSize ?
                                that.option.defaultDataSize : that.option.series[that.option.touchIndex].data.length;
                            var drawType = that.option.series[that.option.touchIndex].drawType;
                            if (drawType == 0) {
                                defaultSize = defaultSize - 1;
                            }
                            var realX = util.getCenterPoint(that.width - space.left - space.right,
                                defaultSize, x, drawType);

                            realX.value = realX.value + space.left;
                            realX.curIndex = that.dataIndex;
                            //此处逻辑只针对k线 当需要拖动 并且长按未启动 则不执行回调
                            that.option.events.touchmove(realX, that);

                        }
                        that.getCanvas().addEventListener("touchend", that.touchend);
                        that.getCanvas().addEventListener("touchcancel", that.touchend);

                    },
                    touchend: function () {
                        //初始化状态
                        clearTimeout(timer);
                        _switch = null;
                        //移动距离清0
                        pos = 0;
                        startPos = { x: 0, y: 0 };
                        direction = -1;
                        that.option.events.touchend(that);
                        that.getCanvas().removeEventListener('touchstart', that.touchstart);
                        that.getCanvas().removeEventListener('touchmove', that.touchmove);
                        that.getCanvas().removeEventListener('touchend', that.touchend);
                        that.getCanvas().removeEventListener('touchcancel', that.touchend);
                    },
                    init: function (event) {
                        switch (event.type) {
                            case 'touchstart':
                                this.touchstart(event);
                                break;
                            case 'touchmove':
                                this.touchmove(event);
                                break;
                            case 'touchend':
                                this.touchend(event);
                                break;
                            case 'touchcancel':
                                this.touchend(event);
                                break;
                        }
                    }
                };
                e.init(event);
            };
            if (typeof that.option.events == 'object' && typeof that.option.events.touchstart == 'function') {
                //console.log(that.option);
                that.getCanvas().addEventListener("touchstart", handel, { passive: true });
            }
            if (typeof that.option.events == 'object' && typeof that.option.events.touchmove == 'function') {
                that.getCanvas().addEventListener("touchmove", handel, { passive: true });
            }
            if (typeof that.option.events == 'object' && typeof that.option.events.touchend == 'function') {
                that.getCanvas().addEventListener("touchend", handel, { passive: true });
                that.getCanvas().addEventListener("touchcancel", handel, { passive: true });
            }
        },
        getSlideAngle: function (dx, dy) {
            return Math.atan2(dy, dx) * 180 / Math.PI;
        },
        /**
         * 获取滑动方向 根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
         */
        getDirection: function (startX, startY, endX, endY) {
            var that = this;
            var dy = startY - endY;
            var dx = endX - startX;
            var result = 0;

            //如果滑动距离太短
            if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                return result;
            }

            var angle = that.getSlideAngle(dx, dy);
            if (angle >= -45 && angle < 45) {
                result = 4;
            } else if (angle >= 45 && angle < 135) {
                result = 1;
            } else if (angle >= -135 && angle < -45) {
                result = 2;
            } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                result = 3;
            }

            return result;
        },
        /**
         * 
         * 获取区间数据 source数据源 start 为索引 len为默认数据长度
         * 接口按默认长度截取 始终保持默认长度
         */
        getDataRange: function (source, start, len) {
            var sc = source;
            if (source.length <= len) {
                return source;
            } else {
                //截取后的数据小于 需要的长度 则截取len长度
                if (source.length - start <= len) {
                    return sc.slice(source.length - len);
                } else {
                    return sc.slice(start, start + len);
                }
            }
        },
        getKminMaxData: function (data) {
            var arr = [];
            for (var i = 0; i < data.length; i++) {
                for (var m = 0; m < data[i].length; m++) {
                    if (m != 0) {
                        arr.push(parseFloat(data[i][m]));
                    }
                }
            }
            return { min: util.getMin(arr), max: util.getMax(arr) };
        }

    };

    //触摸滑动插件
    export const linemove = function(charts,data) {
      this.charts=charts;
      this.global = charts[0];
      this.value = data;
      this.init();
    };
    linemove.prototype = {
      init: function() {
        var _this = this;
        var value = this.global.value;
        var canvas = document.createElement('canvas');
        var pixelRatio = util.pixelRatio();
        canvas.id = Date.now() + "-u";
        canvas.width = _this.global.obj.width * pixelRatio;
        canvas.height = _this.global.obj.height * pixelRatio;
        canvas.style.width = _this.global.obj.width + 'px';
        canvas.style.height = _this.global.obj.height + 'px';
        canvas.style.zIndex = 8;
        canvas.style.position = "absolute";
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        this.subCanvas = canvas;
        var ctx = this.subCtx = this.subCanvas.getContext("2d");
        this.subCtx.scale(pixelRatio, pixelRatio);
        document.querySelector(this.value.dom).appendChild(canvas);
        canvas.addEventListener("touchstart", this.handle.bind(this), { passive: false })
        canvas.addEventListener("touchmove", this.handle.bind(this), { passive: false })
        canvas.addEventListener("touchend", this.handle.bind(this), { passive: false })
        canvas.addEventListener("touchcancel", this.handle.bind(this), { passive: false })
      },
      draw: function(x,y) {
        var ctx = this.subCtx;
        var loc=util.windowTocanvas(this.subCanvas,x,y);
        ctx.save();
        ctx.clearRect(0, 0, this.global.obj.width, this.global.obj.height);
        ctx.translate(this.global.coordinateStart.x, this.global.coordinateStart.y);
        var index = util.getCenterPoint(this.global.coordinateInfo.width, this.value.maxRangeList.length, x - this.global.coordinateStart.x, 1).index
        if(index===undefined){
          index=this.value.maxRangeList.length-1
        }
        this.subIndex = index;
        this.setTouchCircle() //点击画圆
        if(this.global.option.data[index] != '--'){
          this.setTouchLine();
        }
        ctx.restore();
      },
      setTouchLine: function() {
        var ctx = this.subCtx;
        var drawInfo = this.global.drawInfo;
        var yCoordinates = this.global.yCoordinates;
        var _this = this;
        var index = this.subIndex || 0;
        var point = {
          x1: drawInfo.centerPoints[index],
          y1: -_this.global.coordinateInfo.height,
          x2: drawInfo.centerPoints[index],
          y2: 0
        }
        tool.drawLine(ctx, point.x1, point.y1, point.x2, point.y2, 1, 'rgba(152, 169, 203, 0.6)', 'dashed',2);
        return this;
      },
      setTouchCircle: function() {
        var ctx = this.subCtx;
        var index = this.subIndex || 0;
        for(let chart of this.charts){
          var circle = {
            0: {
              r: chart.option.node.lineStyle.lineWidth,
              color: chart.option.node.lineStyle.strokeStyle,
              negativeColor: chart.option.node.negativeLineStyle.strokeStyle
            },
            1: {
              r: chart.option.node.size,
              color: chart.option.node.lineStyle.fillStyle,
              negativeColor: chart.option.node.negativeLineStyle.fillStyle
            }
          };
          var drawInfo = chart.drawInfo;
          var yCoordinates = chart.yCoordinates;
          var value = chart.option;
          if(value.data[index] >= 0){
            tool.drawArc(ctx, drawInfo.centerPoints[index], yCoordinates[index], circle[0].r, 0, 360, true, false, true, circle[0].color, 0);
            tool.drawArc(ctx, drawInfo.centerPoints[index], yCoordinates[index], circle[1].r, 0, 360, true, false, true, circle[1].color, 0);
          }else{
            tool.drawArc(ctx, drawInfo.centerPoints[index], yCoordinates[index], circle[0].r, 0, 360, true, false, true, circle[0].negativeColor, 0);
            tool.drawArc(ctx, drawInfo.centerPoints[index], yCoordinates[index], circle[1].r, 0, 360, true, false, true, circle[1].negativeColor, 0);
          }
        }

        var x = this.global.drawInfo.centerPoints[index], y=27;
        $('.rangbudle-show').remove();
        let date= this.value.dayList[index];
        if(this.value.dom==='.cost-profit-canvas'){
          $('.cost .word-num').html(this.value.maxRangeList[index])
          $('.cost .word-num.two').html(this.value.sumRangeList[index])
        }else {
          $('.invest .word-num').html(this.value.maxRangeList[index]+'%')
          // if(this.value.maxRangeList[index]<0){
          //   $('.invest .word-num').css('color','#5E9F3B')
          // }else{
          //   $('.invest .word-num').css('color','#4b92fe')
          // }
          $('.invest .word-num.two').html(this.value.sumRangeList[index]+'%')
          // if(this.value.sumRangeList[index]<0){
          //   $('.invest .word-num.two').css('color','#5E9F3B')
          // }else{
          //   $('.invest .word-num.two').css('color','#ff8537')
          // }
        }
        var html = `<div class="rangbudle-show">${date.substring(0,4)}-${date.substring(4,6)}-${date.substring(6,8)}</div>`;
        $(this.value.dom).append(html);
        x=x+8
        $('.rangbudle-show').css('left',x+'px');
        $('.rangbudle-show').css('bottom',y+'px');
        $('.rangbudle-show').css({
          'position':'absolute',
          'z-index': 10000,
          'width':'65px',
          'height': '17px',
          'font-size': '10px',
          'color':' #787878',
          'background': '#fff',
          'text-align':'center',
          'line-height': '17px',
          'border-radius':'2px'
        });
      },
      handle: function(event) {
        var _this = this;
        // event.preventDefault()
        var touch = {
          touchstart: function() {
            var touch = event.targetTouches[0];
            var spaceLeft = touch.target.parentNode.offsetLeft;
            var x = touch.clientX-spaceLeft;
            var y = touch.clientY;
            _this.draw(x,y);
          },
          touchmove: function() {
            var touch = event.targetTouches[0];
            var spaceLeft = touch.target.parentNode.offsetLeft;
            var x = touch.clientX-spaceLeft;
            var y = touch.clientY;
            _this.draw(x,y);
          },
          touchend: function() {
            _this.subCtx.clearRect(0,0,_this.global.obj.width,_this.global.obj.height);
            $('.rangbudle-show').remove();
            //数据还原为最后一项
            if(_this.value.dom==='.cost-profit-canvas'){
              $('.cost .word-num').html(_this.value.maxRangeList[_this.value.maxRangeList.length-1])
              $('.cost .word-num.two').html(_this.value.sumRangeList[_this.value.sumRangeList.length-1])
            }else {
              $('.invest .word-num').html(_this.value.maxRangeList[_this.value.maxRangeList.length-1]+'%')
              // if(_this.value.maxRangeList[_this.value.maxRangeList.length-1]<0){
              //   $('.invest .word-num').css('color','#5E9F3B')
              // }else{
              //   $('.invest .word-num').css('color','#4b92fe')
              // }
              $('.invest .word-num.two').html(_this.value.sumRangeList[_this.value.sumRangeList.length-1]+'%')
              // if(_this.value.sumRangeList[_this.value.sumRangeList.length-1]<0){
              //   $('.invest .word-num.two').css('color','#5E9F3B')
              // }else{
              //   $('.invest .word-num.two').css('color','#ff8537')
              // }
            }
          },
          touchcancel: function() {}
        };
        switch (event.type) {
          case 'touchstart':
            touch.touchstart(event);
            break;
          case 'touchmove':
            touch.touchmove(event);
            break;
          case 'touchend':
            touch.touchend(event);
            break;
          case 'touchcancel':
            touch.touchend(event);
            break;
        }
      }
    };