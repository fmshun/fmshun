<template>
  <div class="financing-counter">
    <!--<div class="loading" v-if="loading"></div>-->
    <topHeader rightOp="常见问题" ref="header"></topHeader>
    <div class="main-content">
      <div class="content-title"></div>
      <div class="little-title">一键测算收益，让你的投资更加理性</div>
      <!--基金框-->
      <div class="related-funds">
        <div class="line-title"></div>
        <!--<div-->
        <!--class="line-title"-->
        <!--&gt;-->
        <!--<div class="vertical-line"></div>-->
        <!--<div class="right-word">选择基金</div>-->
        <!--</div>-->
        <div class="fund-name-select" @click="GoFinanceSearch">
          <div class="fund-name">
            <span class="name-word">{{ productInfo.prdtName }}</span>
            <span
              class="fund-type"
              style="height: 17px; font-size: 10px; line-height: 17px"
              v-show="productInfo.isHot"
            >
              热门
            </span>
          </div>
          <div class="go-select"></div>
        </div>
      </div>
      <!--计算器选择框-->
      <div class="counter-condition">
        <div class="condition-item">
          <div class="condition-label">定投金额</div>
          <div class="period-money" @click="clickMoneyInput">
            <div class="money-number">
              <span
                style="color: #abafb7; letter-spacing: 0; opacity: 0.7"
                v-show="moneyCount.length === 0"
              >
                1.00～1,000,000.00元
              </span>
              {{ moneyCount }}
            </div>
            <img
              v-show="showNumBox"
              class="cursor"
              src="../assets/cursor.png"
            />
          </div>
        </div>
        <div class="condition-item">
          <div class="condition-label">定投周期</div>
          <div class="period-btn-box">
            <div class="btn-eve active"><span>每日</span></div>
            <div class="btn-eve"><span>每周</span></div>
            <div class="btn-eve"><span>每两周</span></div>
            <div class="btn-eve"><span>每月</span></div>
          </div>
        </div>
        <div class="condition-item">
          <div class="condition-label">定投日期</div>
          <div class="period-word-btn" @click="showCycleBox()">
            <div class="period-word" v-if="cycle.periodName === '每月'">
              每月{{ cycle.rate + 1 }}号
            </div>
            <div class="period-word" v-else>
              {{ cycle.periodName === "每日" ? "" : cycle.periodName
              }}{{ cycle.rateName }}
            </div>
            <div class="select-btn"></div>
          </div>
        </div>
        <div class="condition-item">
          <div class="condition-label">起投时间</div>
          <div class="period-word-btn" @click="selectBoxShow(1)">
            <div class="period-word">
              {{
                startTime.year.name
                  ? startTime.year.name +
                    "-" +
                    startTime.month.name +
                    "-" +
                    startTime.day.name
                  : ""
              }}
            </div>
            <div class="select-btn"></div>
          </div>
        </div>
        <div class="condition-item">
          <div class="condition-label">结束时间</div>
          <div class="period-word-btn" @click="selectBoxShow(2)">
            <div class="period-word">
              {{
                endTime.year.name
                  ? endTime.year.name +
                    "-" +
                    endTime.month.name +
                    "-" +
                    endTime.day.name
                  : ""
              }}
            </div>
            <div class="select-btn"></div>
          </div>
        </div>
      </div>
      <!--分红方式描述-->
      <div class="share-des">
        <span class="front-flower">*</span>
        <span class="des-word">
          分红方式默认为红利再投资，费率默认为当前买入费率
        </span>
      </div>
      <!--温馨提示-->
      <div class="kind-remind">
        温馨提示：该功能为对基金定投历史回测，供投资者参考，不构成投资建议，您应自主作出投资决策并独立承担投资风险。基金的过往业绩并不预示其未来表现，基金管理人管理的其他基金业绩不构成基金业绩表现的保证。请您认真阅读《基金合同》等法律文件，结合自身风险承受能力选择适合的产品。市场有风险，投资须谨慎。
      </div>
    </div>

    <!--一键算收益-->
    <div class="count-profit" @click="goCalculate">一键算收益</div>

    <!--定投周期选择控件-->
    <Cycle
      v-if="cycleBox"
      ref="cycle"
      :period="cycle.period"
      :rate="cycle.rate"
      @cycleClose="cycleClose"
      @click-cycle-confirm="getSelectData"
      titleName="请输入每次定投时间"
    ></Cycle>
    <!--定投时间选择控件-->
    <selectBox
      v-if="timeBox"
      ref="selectBox"
      :dateMaxMin="dateMaxMin"
      :dateRange="titleIndex === 1 ? dateInfos : endDateInfos"
      :titleName="
        titleIndex === 1 ? '请输入开始定投时间' : '请输入结束定投时间'
      "
      :period="titleIndex === 1 ? startTime.year.index : endTime.year.index"
      :rate="titleIndex === 1 ? startTime.month.index : endTime.month.index"
      :day="titleIndex === 1 ? startTime.day.index : endTime.day.index"
      @timeBoxClose="timeBoxClose"
      @click-cycle-confirm="getTimeSelected"
    ></selectBox>

    <!--自定义键盘部分-->
    <div id="keyboard">
      <div class="board_top" v-show="Number(moneyCount) > 1000000">
        <div class="icon-warn"></div>
        <div class="warn-word">已超出最大计算数值100万元</div>
      </div>
      <ul class="board-ul">
        <li>
          <span>1</span>
          <span>2</span>
          <span>3</span>
        </li>
        <li>
          <span>4</span>
          <span>5</span>
          <span>6</span>
        </li>
        <li>
          <span>7</span>
          <span>8</span>
          <span>9</span>
        </li>
        <li>
          <span>00</span>
          <span>0</span>
          <span class="radix-point">.</span>
        </li>
        <div class="delete"></div>
        <div
          class="confirm"
          :class="Number(moneyCount) > 1000000 ? 'disabled' : ''"
        >
          <span>确认</span>
        </div>
      </ul>
    </div>

    <!--定投金额不能为空-->
    <div class="no-empty-tooltip tooltip">定投金额不能为空</div>
    <!--起投时间不能大于结束时间-->
    <div class="time-tooltip tooltip">起投时间不能大于结束时间</div>
  </div>
</template>

<script>
import base from "base";
import topHeader from "../components/top-header";
import Cycle from "../components/Cycle.vue";
import selectBox from "../components/select-box";
import { getProductInfo } from "../request/api";
import ajax from "ajax";
import file from "file";
import { setTimeout } from "timers";

export default {
  name: "Main",
  components: { topHeader, selectBox, Cycle },
  data() {
    return {
      tipWord: "定投金额不能为空",
      loading: false,
      productInfo: {},
      titleIndex: 1,
      cycleBox: false,
      timeBox: false,
      showNumBox: false, //定投金额选择框控制
      moneyCount: "", //定投金额
      cycle: {
        period: 0,
        rate: 0,
        periodName: "",
        rateName: "",
      },
      dateMaxMin: {
        min: "",
        max: "",
      },
      dateInfos: {},
      endDateInfos: {},
      startTime: {
        year: {
          index: null,
          name: "",
        },
        month: {
          index: null,
          name: "",
        },
        day: {
          index: null,
          name: "",
        },
      },
      endTime: {
        year: {
          index: null,
          name: "",
        },
        month: {
          index: null,
          name: "",
        },
        day: {
          index: null,
          name: "",
        },
      },
    };
  },
  methods: {
    //日期处理
    dateHandle(start, end, dateRange, objTime, flag) {
      //最小日期和最大日期范围内
      this.dateMaxMin = {
        min: start,
        max: end,
      };
      //基金成立日范围,最长不能超出5年
      let startY = Number(start.substring(0, 4)),
        startM = Number(start.substring(4, 6)),
        startD = Number(start.substring(6, 8));
      let endY = Number(end.substring(0, 4)),
        endM = Number(end.substring(4, 6)),
        endD = Number(end.substring(6, 8));

      for (let k = startY; k <= endY; k++) {
        dateRange.years.push(k.toString());

        let monthArr = [],
          acceptArr = [];
        //年份限制
        for (
          let i = k === startY ? startM : 1;
          i <= (k === endY ? endM : 12);
          i++
        ) {
          monthArr.push(i < 10 ? "0" + i : i.toString());
          let dayArr = [];
          //月份日限制
          if (k % 4 === 0 && i === 2) {
            //能整除4的2月份29天
            for (
              let o = k === startY && i === startM ? startD : 1;
              o <= (k === endY && i === endM ? endD : 29);
              o++
            ) {
              dayArr.push(o < 10 ? "0" + o : o.toString());
            }
            acceptArr.push(dayArr);
          } else if (i === 2) {
            //否则2月份28天
            for (
              let o = k === startY && i === startM ? startD : 1;
              o <= (k === endY && i === endM ? endD : 28);
              o++
            ) {
              dayArr.push(o < 10 ? "0" + o : o.toString());
            }
            acceptArr.push(dayArr);
          } else if (i === 4 || i === 6 || i === 9 || i === 11) {
            //4,6,9,11月份30天
            for (
              let o = k === startY && i === startM ? startD : 1;
              o <= (k === endY && i === endM ? endD : 30);
              o++
            ) {
              dayArr.push(o < 10 ? "0" + o : o.toString());
            }
            acceptArr.push(dayArr);
          } else {
            //1,3,5,7,8,10,12月份31天
            for (
              let o = k === startY && i === startM ? startD : 1;
              o <= (k === endY && i === endM ? endD : 31);
              o++
            ) {
              dayArr.push(o < 10 ? "0" + o : o.toString());
            }
            acceptArr.push(dayArr);
          }
        }
        dateRange.months.push(monthArr);
        dateRange.days.push(acceptArr);
      }

      //赋值索引,索引一直在变
      objTime.year.index = dateRange.years.indexOf(objTime.year.name);
      objTime.month.index = dateRange.months[objTime.year.index].indexOf(
        objTime.month.name
      );
      objTime.day.index = dateRange.days[objTime.year.index][
        objTime.month.index
      ].indexOf(objTime.day.name);

      //展示时间选择控件
      this.timeBox = true;
    },
    //获取产品详情
    getProductInfo(data) {
      let param = {};
      if (data) {
        param = {
          prdtId: data,
        };
      } else {
        param = {
          prdtId: base.getUrlParameter("prdtId") || "",
        };
      }

      getProductInfo(param).then((data) => {
        $(".loader-wrapper").hide(); //关闭加载动画
        let result = data.BINDATA ? JSON.parse(data.BINDATA) : {};
        let code = result.code;
        let msg = result.msg;
        base.log(result);
        if (code === "0") {
          this.productInfo = result.resultData;

          //设置默认选项
          this.showNumBox = false;
          this.moneyCount = "1000.00";
          this.cycle = {
            period: 1,
            rate: 0,
            periodName: "每周",
            rateName: "周一",
          };
          $(".btn-eve")
            .eq(this.cycle.period)
            .addClass("active")
            .siblings()
            .removeClass("active");

          //起投时间取接口默认值
          this.startTime.year.name = this.productInfo.startDate.substring(0, 4);
          this.startTime.month.name = this.productInfo.startDate.substring(
            4,
            6
          );
          this.startTime.day.name = this.productInfo.startDate.substring(6, 8);

          //结束时间设置默认值
          this.endTime.year.name = this.productInfo.endDate.substring(0, 4);
          this.endTime.month.name = this.productInfo.endDate.substring(4, 6);
          this.endTime.day.name = this.productInfo.endDate.substring(6, 8);
        } else {
          alert("对不起，计算器开了个小差～");
        }
      });
    },
    //去基金搜索页面
    GoFinanceSearch() {
      let url =
        "http://action:10061/?fullscreen=1&&shownavigationbar=0&&isShowDarkStatusBar=1&&url=/web_cft/financing-aip/financing-search.html";
      file.deleteAll("prdtId.js", () => {
        base.href(url);
      });
    },
    //定投金额输入
    clickMoneyInput() {
      this.showNumBox = true;
      $("#keyboard").slideDown(260);
    },
    moneyInputClose() {
      this.confirm();
    },
    confirm() {
      this.showNumBox = false;
      $("#keyboard").slideUp(260);
      window.TalkingData.onHTSCEvent(
        "click",
        "leaf1254",
        "1.0",
        "理财_基金定投|定投计算器主页|底部|当前主入口按钮",
        "enter_main={确认}"
      );
      //最大不能超过一百万
      if (Number(this.moneyCount) > 1000000) {
        this.moneyCount = "1000000";
      }
      //最小为1.00
      if (Number(this.moneyCount) < 1) {
        this.moneyCount = "1.00";
      }

      //去除前面的0,和小数点补填
      this.moneyCount = Number(this.moneyCount).toString();
      let arr = this.moneyCount.split(".");
      if (arr[1] && arr[1].length === 1) {
        this.moneyCount = this.moneyCount + "0";
      }
      if (!arr[1]) {
        this.moneyCount = this.moneyCount + ".00";
      }
    },

    /**
     * 选择定投日期
     */
    showCycleBox() {
      //判断定投金额键盘
      if (this.showNumBox) {
        return;
      }

      this.cycleBox = true;
    },
    cycleClose() {
      this.cycleBox = false;
    },
    /**
     * 获取定投日期所选数字
     */
    getSelectData(period, rate) {
      // console.log(period, rate );
      if (
        period.index !== this.cycle.period ||
        rate.index !== this.cycle.rate
      ) {
        //起投时间取接口默认值,重置
        this.startTime.year.name = this.productInfo.startDate.substring(0, 4);
        this.startTime.month.name = this.productInfo.startDate.substring(4, 6);
        this.startTime.day.name = this.productInfo.startDate.substring(6, 8);

        //结束时间默认值
        this.endTime.year.name = this.productInfo.endDate.substring(0, 4);
        this.endTime.month.name = this.productInfo.endDate.substring(4, 6);
        this.endTime.day.name = this.productInfo.endDate.substring(6, 8);
      }

      $(".btn-eve")
        .eq(period.index)
        .addClass("active")
        .siblings()
        .removeClass("active");
      this.cycle.period = period.index;
      this.cycle.rate = rate.index;
      this.cycle.periodName = period.name;
      this.cycle.rateName = rate.name;
      this.cycleBox = false;
    },
    //日期转换
    switchDateForm(date) {
      let y = date.getFullYear();
      let m = date.getMonth() + 1; //获取当前月份的日子
      let d = date.getDate();
      if (m < 10) {
        m = "0" + m;
      }
      if (d < 10) {
        d = "0" + d;
      }
      return `${y}${m}${d}`;
    },
    /*定投时间选择*/
    selectBoxShow(index) {
      //判断定投金额键盘
      if (this.showNumBox) {
        return;
      }

      this.titleIndex = index;

      //以服务器当天时间为准
      let currentT = new Date(
        this.productInfo.endDate.substring(0, 4) +
          "-" +
          this.productInfo.endDate.substring(4, 6) +
          "-" +
          this.productInfo.endDate.substring(6, 8)
      );
      //确定起投时间和结束时间的区间
      if (index === 1) {
        this.dateInfos = {
          years: [],
          months: [],
          days: [],
        };
        //定投周期判断
        if (this.cycle.period === 0) {
          //周期为每日,上一个交易日作为起投时间的最大值
          let url5825 = `/reqxml?action=27401&path=/forward?funcId=020157&next=-1&day=${this.productInfo.endDate}`;
          ajax.run(url5825, "", (xml) => {
            let data = xml.BINDATA;
            let code = $(data).find("code").text();
            let msg = $(data).find("msg").text();
            if (code === "0") {
              base.log($(data).find("transDay").text());
              this.dateHandle(
                this.productInfo.openDate,
                $(data).find("transDay").text(),
                this.dateInfos,
                this.startTime,
                true
              );
            } else {
              alert("对不起，计算器开了个小差～");
            }
          });
        } else if (this.cycle.period === 1) {
          //周期为每周
          let gapD,
            investD,
            date2,
            nextDay,
            maxDate = "",
            gap = 0;
          if (this.cycle.rate + 1 < currentT.getDay()) {
            //周期对应日期小于当天
            gapD = currentT.getDay() - (this.cycle.rate + 1);
            investD = this.switchDateForm(
              new Date(currentT.getTime() - gapD * 24 * 3600 * 1000)
            ); //周期对应的日期20200914格式
            date2 = new Date(
              investD.substring(0, 4) +
                "-" +
                investD.substring(4, 6) +
                "-" +
                investD.substring(6, 8)
            ); //2020-09-14格式
            nextDay = this.switchDateForm(
              new Date(
                currentT.getTime() - gapD * 24 * 3600 * 1000 + 24 * 3600 * 1000
              )
            ); //周期对应的日期 加一天
          } else {
            //周期对应日期大于等于当天
            gapD = this.cycle.rate + 1 - currentT.getDay();
            investD = this.switchDateForm(
              new Date(currentT.getTime() + (gapD - 7) * 24 * 3600 * 1000)
            ); //最近的一个定投日期
            date2 = new Date(
              investD.substring(0, 4) +
                "-" +
                investD.substring(4, 6) +
                "-" +
                investD.substring(6, 8)
            ); //2020-09-14格式
            nextDay = this.switchDateForm(
              new Date(currentT.getTime() + (gapD - 7 + 1) * 24 * 3600 * 1000)
            ); //周期对应的日期 加一天
          }

          //判断对应的日期是否是交易日,只能调用上一个交易日的接口
          const judgeTradeDay = (judgedate, currentP) => {
            let url5825 = `/reqxml?action=27401&path=/forward?funcId=020157&next=-1&day=${judgedate}`;
            ajax.run(url5825, "", (xml) => {
              let data = xml.BINDATA;
              let code = $(data).find("code").text();
              let msg = $(data).find("msg").text();
              if (code === "0") {
                if ($(data).find("transDay").text() == currentP) {
                  maxDate = $(data).find("transDay").text();
                  base.log(maxDate);
                  this.dateHandle(
                    this.productInfo.openDate,
                    maxDate,
                    this.dateInfos,
                    this.startTime,
                    true
                  );
                } else {
                  gap = gap + 7;
                  let lastP = this.switchDateForm(
                    new Date(date2.getTime() - gap * 24 * 3600 * 1000)
                  ); //上一个周期对应的日期
                  let nextlastP = this.switchDateForm(
                    new Date(
                      date2.getTime() -
                        gap * 24 * 3600 * 1000 +
                        24 * 3600 * 1000
                    )
                  ); //上一个周期对应的日期 加一天
                  judgeTradeDay(nextlastP, lastP);
                }
              } else {
                alert("对不起，计算器开了个小差～");
              }
            });
          };
          judgeTradeDay(nextDay, investD);
        } else if (this.cycle.period === 2) {
          //定投周期为每两周
          let gapD,
            investD,
            date2,
            nextDay,
            maxDate = "",
            gap = 0;
          if (this.cycle.rate + 1 < currentT.getDay()) {
            //周期对应日期小于当天
            gapD = currentT.getDay() - (this.cycle.rate + 1);
            investD = this.switchDateForm(
              new Date(currentT.getTime() - gapD * 24 * 3600 * 1000)
            ); //周期对应的日期20200914格式
            date2 = new Date(
              investD.substring(0, 4) +
                "-" +
                investD.substring(4, 6) +
                "-" +
                investD.substring(6, 8)
            ); //2020-09-14格式
            nextDay = this.switchDateForm(
              new Date(
                currentT.getTime() - gapD * 24 * 3600 * 1000 + 24 * 3600 * 1000
              )
            ); //周期对应的日期 加一天
          } else {
            //周期对应日期大于等于当天
            gapD = this.cycle.rate + 1 - currentT.getDay();
            investD = this.switchDateForm(
              new Date(currentT.getTime() + (gapD - 14) * 24 * 3600 * 1000)
            ); //最近的一个定投日期
            date2 = new Date(
              investD.substring(0, 4) +
                "-" +
                investD.substring(4, 6) +
                "-" +
                investD.substring(6, 8)
            ); //2020-09-14格式
            nextDay = this.switchDateForm(
              new Date(currentT.getTime() + (gapD - 14 + 1) * 24 * 3600 * 1000)
            ); //周期对应的日期 加一天
          }

          //判断对应的日期是否是交易日,只能调用上一个交易日的接口
          const judgeTradeDay = (judgedate, currentP) => {
            let url5825 = `/reqxml?action=27401&path=/forward?funcId=020157&next=-1&day=${judgedate}`;
            ajax.run(url5825, "", (xml) => {
              let data = xml.BINDATA;
              let code = $(data).find("code").text();
              let msg = $(data).find("msg").text();
              if (code === "0") {
                if ($(data).find("transDay").text() == currentP) {
                  maxDate = $(data).find("transDay").text();
                  base.log(maxDate);
                  this.dateHandle(
                    this.productInfo.openDate,
                    maxDate,
                    this.dateInfos,
                    this.startTime,
                    true
                  );
                } else {
                  gap = gap + 14;
                  let lastP = this.switchDateForm(
                    new Date(date2.getTime() - gap * 24 * 3600 * 1000)
                  ); //上一个周期对应的日期
                  let nextlastP = this.switchDateForm(
                    new Date(
                      date2.getTime() -
                        gap * 24 * 3600 * 1000 +
                        24 * 3600 * 1000
                    )
                  ); //上一个周期对应的日期 加一天
                  judgeTradeDay(nextlastP, lastP);
                }
              } else {
                alert("对不起，计算器开了个小差～");
              }
            });
          };
          judgeTradeDay(nextDay, investD);
        } else if (this.cycle.period === 3) {
          //定投周期为每月
          let gapD,
            investD,
            date2,
            nextDay,
            maxDate = "";
          if (this.cycle.rate + 1 < currentT.getDate()) {
            //周期对应日期小于当天
            gapD = currentT.getDate() - (this.cycle.rate + 1);
            investD = this.switchDateForm(
              new Date(currentT.getTime() - gapD * 24 * 3600 * 1000)
            ); //周期对应的日期20200914格式
            date2 = new Date(
              investD.substring(0, 4) +
                "-" +
                investD.substring(4, 6) +
                "-" +
                investD.substring(6, 8)
            ); //2020-09-14格式
            nextDay = this.switchDateForm(
              new Date(
                currentT.getTime() - gapD * 24 * 3600 * 1000 + 24 * 3600 * 1000
              )
            ); //周期对应的日期 加一天
          } else {
            //周期对应日期大于等于当天
            let currentY = currentT.getFullYear(),
              currentM = currentT.getMonth() + 1;
            let m = currentM - 1 < 10 ? "0" + (currentM - 1) : currentM - 1;
            let d =
              this.cycle.rate + 1 < 10
                ? "0" + (this.cycle.rate + 1)
                : this.cycle.rate + 1;
            if (currentM - 1 === 0) {
              investD = `${currentY - 1}12${d}`;
            } else {
              investD = `${currentY}${m}${d}`; //最近的一个定投日期
            }
            date2 = new Date(
              investD.substring(0, 4) +
                "-" +
                investD.substring(4, 6) +
                "-" +
                investD.substring(6, 8)
            ); //2020-09-14格式
            nextDay = this.switchDateForm(
              new Date(date2.getTime() + 24 * 3600 * 1000)
            ); //周期对应的日期 加一天
          }

          //判断对应的日期是否是交易日,只能调用上一个交易日的接口
          const judgeTradeDay = (judgedate, currentP) => {
            let url5825 = `/reqxml?action=27401&path=/forward?funcId=020157&next=-1&day=${judgedate}`;
            ajax.run(url5825, "", (xml) => {
              let data = xml.BINDATA;
              let code = $(data).find("code").text();
              let msg = $(data).find("msg").text();
              if (code === "0") {
                if ($(data).find("transDay").text() == currentP) {
                  maxDate = $(data).find("transDay").text();
                  base.log(maxDate);
                  this.dateHandle(
                    this.productInfo.openDate,
                    maxDate,
                    this.dateInfos,
                    this.startTime,
                    true
                  );
                } else {
                  //再往上推一个月
                  let y2 = date2.getFullYear(),
                    m2 = date2.getMonth() + 1;
                  let m = m2 - 1 < 10 ? "0" + (m2 - 1) : m2 - 1;
                  let d =
                    this.cycle.rate + 1 < 10
                      ? "0" + (this.cycle.rate + 1)
                      : this.cycle.rate + 1;
                  if (m2 - 1 === 0) {
                    investD = `${y2 - 1}12${d}`;
                  } else {
                    investD = `${y2}${m}${d}`; //最近的一个定投日期
                  }
                  date2 = new Date(
                    investD.substring(0, 4) +
                      "-" +
                      investD.substring(4, 6) +
                      "-" +
                      investD.substring(6, 8)
                  ); //2020-09-14格式
                  nextDay = this.switchDateForm(
                    new Date(date2.getTime() + 24 * 3600 * 1000)
                  ); //周期对应的日期 加一天
                  judgeTradeDay(nextDay, investD);
                }
              } else {
                alert("对不起，计算器开了个小差～");
              }
            });
          };
          judgeTradeDay(nextDay, investD);
        }
      } else {
        this.endDateInfos = {
          years: [],
          months: [],
          days: [],
        };
        let startR = `${this.startTime.year.name}${this.startTime.month.name}${this.startTime.day.name}`;
        this.dateHandle(
          startR,
          this.productInfo.endDate,
          this.endDateInfos,
          this.endTime
        );
      }
    },
    timeBoxClose() {
      this.timeBox = false;
    },
    /*获取定投时间所选结果*/
    getTimeSelected(year, month, day) {
      // console.log(year,month,day)
      if (this.titleIndex === 1) {
        //如果起始时间改变,并且大于结束时间,结束时间重置
        if (
          this.startTime.year.index !== year.index ||
          this.startTime.month.index !== month.index ||
          this.startTime.day.index !== day.index
        ) {
          let s = `${year.name}-${month.name}-${day.name}`;
          let e = `${this.endTime.year.name}-${this.endTime.month.name}-${this.endTime.day.name}`;
          if (s > e) {
            //结束时间重置默认值
            this.endTime.year.name = this.productInfo.endDate.substring(0, 4);
            this.endTime.month.name = this.productInfo.endDate.substring(4, 6);
            this.endTime.day.name = this.productInfo.endDate.substring(6, 8);
          }
        }
        this.startTime.year = year;
        this.startTime.month = month;
        this.startTime.day = day;
      } else {
        this.endTime.year = year;
        this.endTime.month = month;
        this.endTime.day = day;
      }
      this.timeBox = false;
    },
    /**
     * 一键算收益
     * @params prdtId startDate endDate periodType amount
     */
    goCalculate() {
      window.TalkingData.onHTSCEvent(
        "click",
        "leaf1254",
        "1.0",
        "理财_基金定投|定投计算器主页|底部|当前主入口按钮",
        "enter_main={一键算收益}"
      );
      //定投金额不能为空
      if (!this.moneyCount) {
        $(".no-empty-tooltip").fadeIn();
        setTimeout(() => {
          $(".no-empty-tooltip").fadeOut();
        }, 2000);
        return;
      }
      let self = this;
      let param = {
        prdtId: this.productInfo.prdtId,
        startDate: `${this.startTime.year.name}${this.startTime.month.name}${this.startTime.day.name}`,
        endDate: `${this.endTime.year.name}${this.endTime.month.name}${this.endTime.day.name}`,
        periodType: (function () {
          if (self.cycle.period === 0) {
            return "";
          } else if (self.cycle.period === 1) {
            return "W";
          } else if (self.cycle.period === 2) {
            return "D";
          } else if (self.cycle.period === 3) {
            return "M";
          }
        })(),
        amount: this.moneyCount,
        aipDay: this.cycle.period === 0 ? "" : (this.cycle.rate + 1).toString(),
      };
      //起投时间不能大于结束时间
      if (param.startDate > param.endDate) {
        $(".time-tooltip").fadeIn();
        setTimeout(() => {
          $(".time-tooltip").fadeOut();
        }, 2000);
        return;
      }
      file.deleteAll("prdtId.js", () => {
        //去计算器计算结果页
        base.href(
          `http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/calculate-result.html?prdtId=${param.prdtId}&aipDay=${param.aipDay}&periodType=${param.periodType}&amount=${param.amount}&startDate=${param.startDate}&endDate=${param.endDate}`
        );
      });
    },
  },
  mounted() {
    let self = this;
    this.$nextTick(() => {
      self.getProductInfo();
      //定投金额键盘点击事件
      $(".board-ul").click(function (e) {
        if ($(e.target).text() === "确认") {
          if ($(".confirm").hasClass("disabled")) {
            return;
          }
          self.confirm();
        } else if (!$(e.target).text()) {
          //清除
          self.moneyCount = self.moneyCount.substring(
            0,
            self.moneyCount.length - 1
          );
        } else {
          //---防止小数点重复
          if (self.moneyCount.indexOf(".") > -1 && $(e.target).text() === ".") {
            return;
          }
          //只能选填到小数点后两位
          if (
            self.moneyCount.indexOf(".") > -1 &&
            self.moneyCount.substr(self.moneyCount.indexOf(".") + 1).length ===
              2
          ) {
            return;
          }

          //最大不能超过100万
          if (Number(self.moneyCount) > 1000000) {
            return;
          }

          self.moneyCount = self.moneyCount + $(e.target).text();
        }
      });

      //定投周期选择
      $(".btn-eve").click(function (e) {
        if (self.cycle.period !== $(this).index()) {
          //起投时间取接口默认值,必须重置
          self.startTime.year.name = self.productInfo.startDate.substring(0, 4);
          self.startTime.month.name = self.productInfo.startDate.substring(
            4,
            6
          );
          self.startTime.day.name = self.productInfo.startDate.substring(6, 8);
          //结束时间默认值
          self.endTime.year.name = self.productInfo.endDate.substring(0, 4);
          self.endTime.month.name = self.productInfo.endDate.substring(4, 6);
          self.endTime.day.name = self.productInfo.endDate.substring(6, 8);

          self.cycle.period = $(this).index();
          self.cycle.rate = 0;
          if (self.cycle.period === 0) {
            self.cycle.periodName = "每日";
            self.cycle.rateName = "每个交易日";
          } else if (self.cycle.period === 1) {
            self.cycle.periodName = "每周";
            self.cycle.rateName = "周一";
          } else if (self.cycle.period === 2) {
            self.cycle.periodName = "每两周";
            self.cycle.rateName = "周一";
          } else if (self.cycle.period === 3) {
            self.cycle.periodName = "每月";
            self.cycle.rateName = "01";
          }

          $(this).addClass("active").siblings().removeClass("active");
        }
      });
    });

    //页面返回事件
    window.GoBackOnLoad = function () {
      file.getFileData("prdtId.js", (res) => {
        if (res && res.prdtId) {
          $(".loader-wrapper").show(); //加载动画
          self.getProductInfo(res.prdtId);
        }
      });
    };
    setTimeout(function () {
      window.TalkingData.onHTSCEvent(
        "page",
        "leaf1254",
        "1.0",
        "理财_基金定投|定投计算器主页|0|0",
        ""
      );
    }, 1000);
  },
};
</script>

<style lang="less" scoped>
/* loading动画 */
.loading {
  position: absolute;
  z-index: 200000;
  width: 100%;
  height: 100%;
  background: #fff url("../assets/loading.gif") no-repeat center;
  background-size: 28px 28px;
}

#keyboard {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: none;
  width: 100%;
  background-color: #fff;
}

#keyboard .board_top {
  display: flex;
  display: -webkit-flex;
  height: 36px;
  padding: 11px 0;
  background: #fff6f4;

  .icon-warn {
    width: 13px;
    height: 14px;
    margin-left: 89px;
    background: url("../assets/warning@2x.png") no-repeat;
    background-size: 100% 100%;
  }

  .warn-word {
    margin-left: 4px;
    font-family: PingFangSC-Regular, sans-serif;
    font-size: 14px;
    line-height: 14px;
    color: #ff4637;
  }
}

#keyboard .board-ul {
  position: relative;
  overflow: hidden;
}

#keyboard .board-ul::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 1px;
  content: "";
  background-color: #eeeeee;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}

#keyboard li {
  position: relative;
  float: left;
  overflow: hidden;
}

#keyboard li:not(:last-child)::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 1px;
  content: "";
  background-color: #eeeeee;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}

#keyboard li > span {
  position: relative;
  float: left;
  width: 94px;
  height: 67px;
  font-size: 22px;
  line-height: 67px;
  color: #030303;
  text-align: center;
}

#keyboard li > span:active {
  background-color: #e3e3e3;
}

#keyboard li > span::after {
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 200%;
  content: "";
  background-color: #eeeeee;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}

#keyboard .radix-point {
  font-size: 25px;
  font-weight: 600;
  line-height: 200%;
}

#keyboard .delete {
  position: absolute;
  top: 0;
  right: 0;
  width: 93px;
  height: 50%;
  background: url(../assets/del.png) no-repeat center;
  background-size: 27px 20px;
}

#keyboard .delete:active {
  background-color: #e3e3e3;
}

#keyboard .confirm {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 93px;
  height: 50%;
  background: #007aff;
}

#keyboard .confirm.disabled {
  background: #dcdcdc;
}

#keyboard .confirm span {
  position: absolute;
  top: 50%;
  left: 50%;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 20px;
  color: #fff;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.main-content {
  padding-top: 62px;

  .content-title {
    height: 31px;
    margin-top: 4.5px;
    margin-left: 25px;
    letter-spacing: 0;
    background: url("../assets/calculator@2x.png") no-repeat 0;
    background-size: auto 100%;
  }

  .little-title {
    margin-top: 6px;
    margin-left: 25px;
    font-family: PingFangSC-Light, sans-serif;
    font-size: 13px;
    color: #ffffff;
    letter-spacing: 0.45px;
    opacity: 0.7;
  }

  .related-funds {
    box-sizing: border-box;
    height: 112px;
    margin: 20px 14px 0 16px;
    overflow: hidden;
    background: url("../assets/bg-box@2x.png") no-repeat;
    background-size: 100% auto;
    border-radius: 4px;

    .line-title {
      position: relative;
      height: 20px;
      margin-top: 23px;
      background: url("../assets/words@3x.png") 20px center no-repeat;
      background-size: auto 15px;
    }

    /* .line-title { */

    /* position: relative; */

    /* margin-top: 23px; */

    /* height: 20px; */

    /* line-height: 20px; */

    /* } */

    /* .vertical-line { */

    /* position: absolute; */

    /* left: 20px; */

    /* height: 12px; */

    /* width: 2px; */

    /* border-radius: 2px; */

    /* top: 0; */

    /* bottom: 0; */

    /* margin: auto; */

    /* background-color: #396efc; */

    /* } */

    .right-word {
      height: 20px;
      margin-left: 28px;
      font-family: PingFangSC-Regular, sans-serif;
      line-height: 20px;
      color: #999999;
      letter-spacing: 0.48px;
    }

    .fund-name-select {
      display: -webkit-flex;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 8px 20.5px 18.5px;

      .fund-name {
        display: flex;
        display: -webkit-flex;
        flex: 1;
        align-items: center;
        height: 25px;
        font-family: PingFangSC-Medium, sans-serif;
        font-size: 18px;
        line-height: 25px;
        color: #292929;
        letter-spacing: 0;

        .name-word {
          max-width: 255px;
          overflow: hidden;
          font-weight: bold;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .fund-type {
          flex: 0 32px;
          margin-left: 4px;
          font-family: PingFangSC-Regular, sans-serif;
          color: #f64843;
          text-align: center;
          letter-spacing: 0.34px;
          background: rgba(255, 67, 56, 0.08);
          border-radius: 2px;
        }
      }

      .go-select {
        width: 6px;
        height: 10px;
        background: url("../assets/more2@2x.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  /* 计算器条件 */

  .counter-condition {
    background-color: #fff;
  }

  .condition-item {
    position: relative;
    box-sizing: border-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 20px 0 17px;
    margin-right: 21.5px;
    margin-left: 25px;

    .condition-label {
      font-family: PingFangSC-Regular, sans-serif;
      font-size: 16px;
      line-height: 22px;
      color: #323232;
      letter-spacing: 0;
    }

    /* 定投金额 */
    @-webkit-keyframes cursora {
      0% {
        opacity: 1;
      }
      10% {
        opacity: 1;
      }
      20% {
        opacity: 0;
      }
      30% {
        opacity: 0;
      }
      40% {
        opacity: 0;
      }
      50% {
        opacity: 0;
      }
      60% {
        opacity: 0;
      }
      70% {
        opacity: 0;
      }
      80% {
        opacity: 0;
      }
      90% {
        opacity: 1;
      }
    }

    @keyframes cursora {
      0% {
        opacity: 1;
      }
      10% {
        opacity: 1;
      }
      20% {
        opacity: 0;
      }
      30% {
        opacity: 0;
      }
      40% {
        opacity: 0;
      }
      50% {
        opacity: 0;
      }
      60% {
        opacity: 0;
      }
      70% {
        opacity: 0;
      }
      80% {
        opacity: 0;
      }
      90% {
        opacity: 1;
      }
    }

    .period-money {
      position: relative;
      width: 230px;
      height: 22px;
      padding-right: 11px;
      overflow: hidden;
      font-family: PingFangSC-Regular, sans-serif;
      font-size: 16px;
      line-height: 22px;
      color: #666666;
      letter-spacing: 0;

      .money-number {
        position: absolute;
        top: 0;
        right: 11px;
        bottom: 0;
        z-index: 12;
        margin: auto;
        line-height: 22px;
        text-align: right;
      }

      .cursor {
        position: absolute;
        top: 0;
        right: 8px;
        bottom: 0;
        z-index: 10;
        width: 3px;
        height: 22px;
        margin: auto;
        -webkit-animation-name: cursora;
        animation-name: cursora;
        -webkit-animation-duration: 1.2s;
        animation-duration: 1.2s;
        -webkit-animation-timing-function: linear;
        animation-timing-function: linear;
        -webkit-animation-iteration-count: infinite;
        animation-iteration-count: infinite;
      }
    }

    /* 定投周期 */

    .period-btn-box {
      flex: 1;
      text-align: right;

      .btn-eve {
        position: relative;
        display: inline-block;
        padding-right: 7px;
        padding-left: 7px;
        margin-right: 7.3px;
        line-height: 24px;
        text-align: center;
        white-space: nowrap;
        border-radius: 2px;

        span {
          font-family: PingFangSC-Regular, sans-serif;
          font-size: 14px;
          color: #828282;
          letter-spacing: 0.66px;
          opacity: 0.86;
        }

        &::after {
          position: absolute;
          top: -1px;
          left: -1px;

          /* z-index: -1; */
          width: 200%;
          height: 200%;
          content: "";
          border: 1px solid rgba(150, 150, 150, 0.39);
          border-radius: 4px;
          -webkit-transform: scale(0.5, 0.5);
          transform: scale(0.5, 0.5);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
        }
      }

      .btn-eve.active {
        color: #ffffff;
        background: #3163ec;
        box-shadow: 1px 1px 4px 0 rgba(81, 118, 225, 0.26);

        span {
          color: #ffffff;
        }

        &::after {
          content: "";
          border: none;
        }
      }

      .btn-eve:nth-child(4) {
        margin-right: 4px;
      }
    }

    /* 定投日期 */

    .period-word-btn {
      display: flex;
      display: -webkit-flex;
      align-items: center;
      justify-content: flex-end;

      .period-word {
        min-width: 80px;
        margin-right: 5px;
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 16px;
        color: #666666;
        text-align: right;
        letter-spacing: 0;
      }

      .select-btn {
        width: 6px;
        height: 11px;
        background: url("../assets/more2@2x.png") no-repeat;
        background-size: 100% 100%;
      }
    }

    &::after {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 1px;
      pointer-events: none;
      content: "";
      background-color: rgba(151, 151, 151, 0.17);
      transform: scale(1, 0.5);
    }
  }

  .condition-item:first-child {
    padding: 24px 0 14px;
  }

  .share-des {
    position: relative;
    height: 17px;
    margin-top: 14.5px;
    margin-left: 19px;
    font-family: PingFangSC-Light, sans-serif;
    font-size: 12px;
    line-height: 17px;
    color: #666666;
    letter-spacing: 0;

    .front-flower {
      position: absolute;
      top: 2px;
      left: 0;
      width: 5px;
      height: 5px;
    }

    .des-word {
      margin-left: 8px;
    }
  }

  /* 温馨提示 */

  .kind-remind {
    padding: 0 20px 100px;
    margin-top: 30.5px;
    font-family: PingFangSC-Light, sans-serif;
    font-size: 12px;
    color: #999999;
    text-align: justify;
    letter-spacing: 0;
    opacity: 0.6;
  }
}

/* 一键算收益 */
.count-profit {
  position: fixed;
  right: 21px;
  bottom: 40px;
  left: 21px;
  z-index: 10;
  height: 55px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 17px;
  line-height: 46px;
  color: #ffffff;
  text-align: center;
  background: url("../assets/button@2x.png") no-repeat -2px -5px;
  background-size: 100% auto;
}

.tooltip {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20000;
  display: none;
  height: 44px;
  margin: auto;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 13px;
  line-height: 44px;
  color: #fff;
  text-align: center;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
}

.no-empty-tooltip {
  width: 156px;
}

.time-tooltip {
  width: 186px;
}
</style>
