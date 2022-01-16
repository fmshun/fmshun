<template>
  <div class="financing-search">
    <!--<div class="loading" v-if="loading"></div>-->
    <div id="header">
      <div class="nav-top"></div>
      <div class="search-box">
        <div class="top-area">
          <span
            class="placeholder"
            v-show="inputNum.length === 0 && !showInput"
          >
            输入基金代码、名称或简称
          </span>
          <span v-show="!showInput" class="num-area">
            {{ inputNum.replace(/\s/g, "&nbsp;") }}
          </span>
          <img class="cursor" src="../assets/cursor.png" />
          <input
            class="actual-input"
            type="text"
            placeholder="输入基金代码、名称或简称"
            v-model="inputNum"
            @focus="inputFocus"
            @blur="inputBlur"
          />
          <div
            class="clears"
            v-show="inputNum.length > 0"
            @click="emptyInput"
          ></div>
        </div>
        <div class="cancel-search" @click="goBack">取消</div>
      </div>
    </div>

    <div class="content-result">
      <!--搜索首页显示的界面-->
      <div class="content" v-show="!inputNum">
        <!--历史搜索-->
        <div class="history-search" v-if="!isTarget && historyData.length > 0">
          <div class="history-title">
            <div>历史搜索</div>
            <div class="del-icon" @click="deleteHistory"></div>
          </div>
          <div class="history-items">
            <div
              class="item-search-out"
              v-for="(item, key) in historyData"
              :key="key"
            >
              <div class="item-search" @click="addSearch(item)">{{ item }}</div>
            </div>
            <div class="more-expand" @click="expandAllRecord"></div>
          </div>
        </div>

        <!--股票基金排行情况,区分计算器和目标盈-->
        <div class="tab-type" v-if="isTarget">
          <div class="tab-item active">定投排行</div>
          <div class="tab-item" style="margin-left: 6px">人气定投</div>
          <div class="active-bar"></div>
        </div>
        <div class="tab-type" v-else>
          <div class="tab-item active">人气定投</div>
          <div class="tab-item collect">持仓/收藏</div>
          <div class="tab-item">我的足迹</div>
          <div class="active-bar"></div>
        </div>
        <div class="fund-table">
          <!--加载动画-->
          <div class="load-animation none">
            <div class="load-icon">
              <img
                style="width: 100%; height: 100%"
                src="../assets/tab-loading.gif"
                alt
              />
            </div>
            <div class="load-word">正在加载中</div>
          </div>
          <!--后面两项未登录时-->
          <div class="no-login none">
            <div class="no-login-icon">
              <img
                style="width: 100%; height: 100%"
                src="../assets/empty@2x.png"
                alt
              />
            </div>
            <div class="no-login-word">登录查看我的自选</div>
            <div class="login-btn" @click="goLogin">立即登录</div>
          </div>
          <!--表格部分-->
          <div class="finance-table">
            <!--表格头部-->
            <div class="table-head">
              <div class="tab-head-item">基金名称(代码)</div>
              <div class="tab-head-item">
                {{
                  (tabIndex === 1 && isTarget) || (tabIndex === 0 && !isTarget)
                    ? "乐友累计定投(次)"
                    : "近1年定投收益率"
                }}
              </div>
              <div class="tab-head-item">
                <span>操作</span>
              </div>
            </div>
            <!--定投排行基金表格-->
            <div class="table-body" v-show="tabIndex === 0 && isTarget">
              <div
                v-show="sortedInvestLists.length > 0"
                class="table-tr"
                v-for="(i, k) in sortedInvestLists"
                :key="k"
                @click="enterDetail(i)"
              >
                <div class="table-td">
                  <div class="td-order" :class="k <= 2 ? 'three' : ''">
                    {{ k + 1 }}.
                  </div>
                  <div class="fund-name">
                    <div class="name-word">{{ i.name }}</div>
                    <div>{{ i.prdtCode }}</div>
                  </div>
                </div>
                <div
                  class="table-td"
                  :style="{
                    color:
                      i.rate && i.rate.indexOf('-') !== -1
                        ? '#5E9F3B'
                        : '#fc3438',
                  }"
                >
                  <!--收益率不存在时,--%红色展示-->
                  {{ i.rate ? i.rate : "--%" }}
                </div>
                <div class="table-td">
                  <!--定投排行需要区分货币基金-->
                  <div
                    :class="
                      i.isCurrency === '0'
                        ? 'select-btn'
                        : 'select-btn disabled'
                    "
                    @click.stop="selectFinance(i)"
                  >
                    选择
                  </div>
                </div>
              </div>
              <div v-show="sortedInvestLists.length === 0" class="no-data">
                暂无数据
              </div>
              <div
                class="pull-up-word"
                v-show="sortedInvestLists.length >= pageSize"
              >
                上拉加载更多
              </div>
            </div>
            <!--人气定投-->
            <div
              class="table-body"
              v-show="
                (tabIndex === 1 && isTarget) || (tabIndex === 0 && !isTarget)
              "
            >
              <div
                v-show="hotInvestLists.length > 0"
                class="table-tr"
                v-for="(i, k) in hotInvestLists"
                :key="k"
                @click="enterDetail(i)"
              >
                <div class="table-td">
                  <div class="td-order" :class="k <= 2 ? 'three' : ''">
                    {{ k + 1 }}.
                  </div>
                  <div class="fund-name">
                    <div class="name-word">{{ i.name }}</div>
                    <div
                      style="
                        display: inline-block;
                        float: left;
                        width: auto;
                        height: 18px;
                        font-size: 13px;
                        line-height: 18px;
                      "
                    >
                      <span>近1年定投收益率</span>
                      <span
                        style="margin-left: 3px; text-align: left"
                        :style="{
                          color:
                            i.rate && i.rate.indexOf('-') !== -1
                              ? '#5E9F3B'
                              : '#fc3438',
                        }"
                      >
                        {{ i.rate ? i.rate : "--%" }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="table-td" style="color: #4a4a4a">{{ i.num }}</div>
                <div class="table-td">
                  <div
                    :class="
                      i.isCurrency === '0'
                        ? 'select-btn'
                        : 'select-btn disabled'
                    "
                    @click.stop="selectFinance(i)"
                  >
                    选择
                  </div>
                </div>
              </div>
              <div v-show="hotInvestLists.length === 0" class="no-data">
                暂无数据
              </div>
              <div
                class="pull-up-hot-word"
                v-show="hotInvestLists.length >= pageSize"
              >
                上拉加载更多
              </div>
            </div>
            <!--持仓/收藏基金-->
            <div class="table-body" v-if="!isTarget" v-show="tabIndex === 1">
              <div
                v-show="possessInvests.length > 0"
                class="table-tr"
                v-for="(i, k) in possessInvests"
                :key="k"
                @click="enterDetail(i)"
              >
                <div class="table-td">
                  <div class="fund-name">
                    <div class="name-word">{{ i.prdtName }}</div>
                    <div>
                      <span>{{ i.prdtCode }}</span>
                      <span v-if="i.isHold" class="host-fund-sign">持仓</span>
                    </div>
                  </div>
                </div>
                <div
                  class="table-td"
                  :style="{
                    color:
                      i.yieldRate && i.yieldRate.indexOf('-') !== -1
                        ? '#5E9F3B'
                        : '#fc3438',
                  }"
                >
                  {{ i.yieldRate ? i.yieldRate : "--%" }}
                </div>
                <div class="table-td">
                  <div
                    :class="
                      i.isCurrency === '0'
                        ? 'select-btn'
                        : 'select-btn disabled'
                    "
                    @click.stop="selectFinance(i)"
                  >
                    选择
                  </div>
                </div>
              </div>
              <div v-show="possessInvests.length === 0" class="no-data">
                暂无数据
              </div>
            </div>
            <!--我的足迹基金-->
            <div class="table-body" v-if="!isTarget" v-show="tabIndex === 2">
              <div
                v-show="recordInvests.length > 0"
                class="table-tr"
                v-for="(i, k) in recordInvests"
                :key="k"
                @click="enterDetail(i)"
              >
                <div class="table-td">
                  <div class="fund-name">
                    <div class="name-word">{{ i.prdtName }}</div>
                    <div>{{ i.prdtCode }}</div>
                  </div>
                </div>
                <div
                  class="table-td"
                  :style="{
                    color:
                      i.rate && i.rate.indexOf('-') !== -1
                        ? '#5E9F3B'
                        : '#fc3438',
                  }"
                >
                  {{ i.rate ? i.rate : "--%" }}
                </div>
                <div class="table-td">
                  <div
                    :class="
                      i.isCurrency === '0'
                        ? 'select-btn'
                        : 'select-btn disabled'
                    "
                    @click.stop="selectFinance(i)"
                  >
                    选择
                  </div>
                </div>
              </div>
              <div v-show="recordInvests.length === 0" class="no-data">
                暂无数据
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--搜索结果页-->
      <div class="search-result" v-show="inputNum">
        <div
          v-show="resultData.length > 0"
          v-for="(i, k) in resultData"
          :key="k"
          class="item-box"
          @click="enterDetail(i)"
        >
          <!--支持计算器计算的基金选择按钮需置灰,否则不需-->
          <div class="result-item">
            <div class="search-icon"></div>
            <div class="data-word1">{{ i.prdtCode }}</div>
            <div class="data-word2">{{ i.prdtName }}</div>
            <div class="data-select">
              <div
                :class="
                  i.isCurrency === '0' ? 'select-btn' : 'select-btn disabled'
                "
                @click.stop="selectFinance(i, true)"
              >
                选择
              </div>
            </div>
          </div>
        </div>
        <div class="no-result-data">暂无匹配结果</div>
      </div>
    </div>

    <!--自定义键盘部分-->
    <div id="keyboard">
      <ul class="board-ul">
        <li>
          <span>940</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
        </li>
        <li>
          <span>94</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
        </li>
        <li>
          <span>空格</span>
          <span>7</span>
          <span>8</span>
          <span>9</span>
        </li>
        <li>
          <span id="change">中文</span>
          <span>000</span>
          <span>00</span>
          <span>0</span>
        </li>
        <div class="delete"></div>
        <div class="key-search">
          <span>搜索</span>
        </div>
      </ul>
    </div>

    <!--清空历史确认弹窗-->
    <div class="clear-dialog none">
      <div class="center">
        <div class="titlec">确定清空搜索历史？</div>
        <div class="left">取消</div>
        <div class="right">确定</div>
      </div>
    </div>

    <!--该产品暂不支持定投计算-->
    <div class="no-support-tooltip">
      该产品暂不支持{{ isTarget ? "目标止盈" : "定投计算" }}
    </div>
  </div>
</template>

<script>
import local from "local";
import base from "base";
import {
  getSortedInvest,
  getCollectHold,
  getCalcuSearch,
  getFootPrint,
} from "../request/api";
import ajax from "ajax";
import file from "file";
import common from "../request/common";

export default {
  name: "Main",
  components: {},
  data() {
    return {
      loading: false,
      loadTable: false,
      timer: null,
      //当前第几页
      pageNum: 1,
      hotPageNum: 1,
      pageSize: 10,
      investLoading: false,
      isBottom: false,
      hotLoading: false,
      isHotBottom: false,
      inputNum: "",
      showInput: false,
      historyData: [],
      tabIndex: 0,
      sortedInvestLists: [], //定投排行
      hotInvestLists: [], //人气定投
      possessInvests: [], //持仓
      recordInvests: [], //我的足迹
      resultData: [],
      // 是否来自目标盈
      isTarget: base.getUrlParameter("from") === "target" ? true : false,
      timeout: null,
    };
  },
  methods: {
    //获取定投排行,人气定投数据
    getFixedInvest() {
      getSortedInvest({
        pageNum: this.hotPageNum,
        pageSize: this.pageSize,
        sortName: "grandExectTimes",
        type: 1,
      }).then((data) => {
        $(".loader-wrapper").hide(); //关闭加载动画
        let result = data.BINDATA ? JSON.parse(data.BINDATA) : {};
        let code = result.code;
        let msg = result.msg;
        base.log(result);
        if (code === "0") {
          this.hotInvestLists = result.resultData;
        } else {
          alert("对不起，计算器开了个小差～");
        }
      }); ///

      //从目标盈页面跳过来的,第一列展示定投排行
      if (this.isTarget) {
        getSortedInvest({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          type: 1,
        }).then((data) => {
          $(".loader-wrapper").hide(); //关闭加载动画
          let result = data.BINDATA ? JSON.parse(data.BINDATA) : {};
          let code = result.code;
          let msg = result.msg;
          base.log(result);
          if (code === "0") {
            this.sortedInvestLists = result.resultData;
          } else {
            alert("对不起，计算器开了个小差～");
          }
        });
      }
    },
    //获取持仓/收藏列表数据
    getPossessInvest() {
      $(".no-login").hide();
      $(".finance-table").hide();
      $(".load-animation").show();
      getCollectHold({
        clientNo: "($account)",
        type: 1,
      }).then((data) => {
        $(".load-animation").hide();
        $(".finance-table").show();
        let result = data.BINDATA ? JSON.parse(data.BINDATA) : {};
        let code = result.code;
        let msg = result.msg;
        base.log(result);
        if (code === "0") {
          this.possessInvests = result.list;
        } else {
          alert("对不起，计算器开了个小差～");
        }
      });
    },
    //获取我的足迹列表数据
    getRecordInvest() {
      let self = this;
      $(".no-login").hide();
      $(".finance-table").hide();
      $(".load-animation").show();
      file.readAll("footprint_homeV4.js", function (readData) {
        ajax.run("/reqlocal?account=", "", function (user) {
          let accountNum = user.ACCOUNT; //对应的用户账号
          base.log(readData);
          if (typeof readData !== "undefined" && readData[accountNum]) {
            let bin = readData[accountNum];
            let records = [];
            //将所有日期的数据且prdtType=2(基金类型)的拿出来
            bin.forEach((v, k) => {
              v.prdtList.forEach((i, key) => {
                if (i.prdtType == 2) {
                  records.push(i);
                }
              });
            });

            //将定投和理财足迹进行可定投基金筛选
            if (records.length > 0) {
              self.recordInvests = [];
              getFootPrint({
                prdtCodeList: records.map((val) => val.prdtCode).join(),
              }).then((data) => {
                //关闭动画
                setTimeout(() => {
                  $(".load-animation").hide();
                  $(".finance-table").show();
                }, 600); //防止抖动
                let result = data.BINDATA ? JSON.parse(data.BINDATA) : {};
                let code = result.code;
                let msg = result.msg;
                base.log(result);
                if (code === "0") {
                  self.recordInvests = result.list;
                } else {
                  alert("对不起，计算器开了个小差～");
                }
              });
            }
          } else {
            //关闭动画
            setTimeout(() => {
              $(".load-animation").hide();
              $(".finance-table").show();
            }, 600); //防止抖动
          }
        });
      });
    },
    //页面取消搜索
    goBack(e) {
      base.href("http://action:3413");
    },
    //清空输入框
    emptyInput(e) {
      this.inputNum = "";
      $(".actual-input").focus();
      e.preventDefault();
    },
    //输入框集中焦点时
    inputFocus() {
      // if (this.timeout) {
      //   clearTimeout(this.timeout)
      // }
      // this.showInput = true
    },
    inputBlur() {
      //处理ios键盘中点击完成时导致失焦后,点击空白处又再次获取焦点
      // if (base.isIOS()) {
      //   this.timeout = setTimeout(() => {
      //     if (!this.isTarget) {
      //       this.showInput = false
      //     }
      //   }, 600)
      // }
    },
    //进入基金详情页
    enterDetail(item) {
      //计算器进入详情页时添加到我的足迹里面,不需要添加到历史记录
      let name = item.name || item.prdtName;
      if (!this.isTarget) {
        this.handleFootprint(
          item.prdtCode,
          name,
          item.rate || item.yieldRate,
          20,
          () => {
            base.href(
              `http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/licai/detail/fund-v2/detail.htm?productCode=${item.prdtCode}`
            );
          }
        );
      }
    },
    //基金选择
    selectFinance(item, flag) {
      //货币基金不支持选择
      if (item.isCurrency && item.isCurrency === "1") {
        $(".no-support-tooltip").fadeIn();
        setTimeout(() => {
          $(".no-support-tooltip").fadeOut();
        }, 2000);
        return;
      }

      // 如果来自目标盈,选择回到目标盈页面,并且不记录历史搜索和足迹
      if (this.isTarget) {
        local.saveObject(
          {
            financing_aip_choose_target_param: JSON.stringify({
              prdtCode: item.prdtCode,
              prdtId: item.prdtId,
              prdtName: encodeURIComponent(item.prdtName || item.name),
            }),
          },
          () => {
            base.href("http://action:3413");
          }
        );
      } else {
        //将选择的基金加入到历史记录中
        let name = item.name || item.prdtName;
        this.historyData.unshift(name);
        //数组去重
        let arr = [];
        for (let v of this.historyData) {
          if (arr.indexOf(v) === -1) {
            arr.push(v);
          }
        }
        this.historyData = arr;

        if (this.historyData.length > 20) {
          this.historyData.splice(this.historyData.length - 1, 1);
        }

        file.insert(
          "historyRecord.js",
          {
            historyRecord: this.historyData,
          },
          function () {
            base.log("success");
          }
        );

        //添加到我的足迹里面
        this.handleFootprint(
          item.prdtCode,
          name,
          item.rate || item.yieldRate,
          20,
          () => {
            //去计算器设置页面,利用返回
            file.insert("prdtId.js", { prdtId: item.prdtId }, function () {
              base.href("http://action:3413");
            });
          }
        );
        // base.href(
        //   'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/financing-counter.html?prdtId=' +
        //     item.prdtId
        // )
      }
    },
    //登录交易账户
    goLogin() {
      base.href("http://action:10090/?jsfuncname=loginLoad()");
    },
    //获取历史记录数据
    getHistory(callback) {
      file.getFileData(
        "historyRecord.js",
        (res) => {
          base.log(res);
          if (res && res.historyRecord) {
            this.historyData = res.historyRecord;
            if (callback) {
              callback();
            }
          }
        },
        () => {
          alert("获取历史数据失败");
        }
      );
    },
    //删除所有历史数据
    deleteHistory() {
      file.deleteAll(
        "historyRecord.js",
        () => {
          this.historyData = [];
        },
        () => {
          alert("记录删除失败");
        }
      );
    },
    //历史记录收起
    judgeParentH() {
      this.$nextTick(() => {
        $(".more-expand").removeClass("rotate");
        let overTwo = [],
          twoHr = [];
        //超出两行的隐藏
        $(".item-search-out").each((k, v) => {
          base.log(v.offsetTop);
          if (v.offsetTop >= $(".item-search-out").height() * 2) {
            overTwo.push(v);
          }
          //第二行特殊处理
          if (v.offsetTop == $(".item-search-out").height()) {
            twoHr.push(v);
          }
        });
        //超出两行的隐藏
        if (overTwo.length > 0) {
          $(".more-expand").show();
          overTwo.forEach((v) => {
            $(v).hide();
          });
        }
        //第二行元素加上展开符超出父元素宽,得隐藏第二行的最后一个元素
        if (twoHr.length > 1) {
          let w = 0;
          twoHr.forEach((v) => {
            w = w + $(v).width();
          });
          if (w + $(".more-expand").width() > $(".history-items").width()) {
            $(twoHr[twoHr.length - 1]).hide();
          }
        }
      });
    },
    //展开所有历史记录
    expandAllRecord() {
      if (!$(".more-expand").hasClass("rotate")) {
        $(".more-expand").addClass("rotate");
        $(".item-search-out").each((k, v) => {
          $(v).show();
        });
      } else {
        //处理ios收起时滑顶,防止内容被遮盖
        $(".content-result").animate({ scrollTop: 0 }, 1);
        if (base.isIOS()) {
          setTimeout(() => {
            this.judgeParentH();
          }, 260);
        } else {
          this.judgeParentH();
        }
      }
    },
    //点击历史搜索,快速查询
    addSearch(item) {
      this.inputNum = item;
    },
    /**
     * 获取搜索基金
     */
    getSearchData(v) {
      // clearTimeout(this.timer)
      if (!v) {
        $(".no-result-data").hide();
        this.resultData = [];
        return;
      }
      this.timer = setTimeout(() => {
        getCalcuSearch({
          keyword: v,
        }).then((data) => {
          let result = data.BINDATA ? JSON.parse(data.BINDATA) : {};
          let code = result.code;
          let msg = result.msg;
          base.log(result);
          if (code === "0") {
            this.resultData = result.resultData;
            if (result.resultData.length === 0) {
              $(".no-result-data").show();
            } else {
              $(".no-result-data").hide();
            }
          } else {
            alert("对不起，计算器开了个小差～");
          }
        });
      }, 300);
    },
    //上拉加载更多定投排行
    getMoreData() {
      let _this = this;
      _this.investLoading = true;
      _this.pageNum++;
      getSortedInvest({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        type: 1,
      }).then((data) => {
        let result = data.BINDATA ? JSON.parse(data.BINDATA) : {};
        let code = result.code;
        let msg = result.msg;
        base.log(result);
        if (code === "0") {
          _this.investLoading = false;
          _this.sortedInvestLists = _this.sortedInvestLists.concat(
            result.resultData
          );
          if (result.resultData.length < _this.pageSize) {
            _this.isBottom = true;
            $(".pull-up-word").text("暂无更多内容");
          } else {
            $(".pull-up-word").text("上拉加载更多");
          }
        } else {
          alert("对不起，计算器开了个小差～");
        }
      });
    },
    //上拉加载更多人气定投
    getMoreHotData() {
      let _this = this;
      _this.hotLoading = true;
      _this.hotPageNum++;
      getSortedInvest({
        pageNum: this.hotPageNum,
        pageSize: this.pageSize,
        sortName: "grandExectTimes",
        type: 1,
      }).then((data) => {
        let result = data.BINDATA ? JSON.parse(data.BINDATA) : {};
        let code = result.code;
        let msg = result.msg;
        base.log(result);
        if (code === "0") {
          _this.hotLoading = false;
          _this.hotInvestLists = _this.hotInvestLists.concat(result.resultData);
          if (result.resultData.length < _this.pageSize) {
            _this.isHotBottom = true;
            $(".pull-up-hot-word").text("暂无更多内容");
          } else {
            $(".pull-up-hot-word").text("上拉加载更多");
          }
        } else {
          alert("对不起，计算器开了个小差～");
        }
      });
    },
    /**
     * 足迹存储流量记录到本地
     * 最多存储二十条
     * 注：用到此函数要增加local.js,file.js
     */
    handleFootprint: function (prdtCode, prdtName, prdtRate, item, callback) {
      //足迹
      item = item || 15;
      let myDate = new Date(),
        currDateLocal = "",
        month =
          myDate.getMonth() + 1 > 9
            ? myDate.getMonth() + 1
            : "0" + (myDate.getMonth() + 1),
        day = myDate.getDate() > 9 ? myDate.getDate() : "0" + myDate.getDate();
      currDateLocal = myDate.getFullYear() + "" + month + "" + day;
      //footprintList获取所有日期的访问足迹,obj存放每天足迹的所有数据
      let obj = {},
        footprintList = [],
        accountObj = {},
        accountNum = "";
      file.readAll("footprint_homeV4.js", function (readData) {
        ajax.run("/reqlocal?account=", "", function (data) {
          accountNum = data.ACCOUNT; //data.ACCOUNT;
          let footprintObj = {}; //存放当前产品的信息
          footprintObj["prdtCode"] = prdtCode || "--";
          footprintObj["prdtName"] = prdtName || "--";
          footprintObj["prdtType"] = "2"; //产品类型 1\紫金 2、基金 3、OTC
          //obj存放一天存的数据
          obj["prdtList"] = [];
          obj["prdtList"][0] = footprintObj;
          obj["formatDate"] = currDateLocal;
          accountObj = $.extend({}, readData);
          if (typeof readData[accountNum] !== "undefined") {
            let teamArr = [];
            teamArr = teamArr.concat(readData[accountNum]);
            //添加新的数据或者更新数据信息
            for (let i = 0; i < readData[accountNum].length; i++) {
              if (readData[accountNum][i].formatDate == currDateLocal) {
                teamArr[i].prdtList.splice(0, 0, footprintObj);
                break;
              } else {
                teamArr.splice(0, 0, []);
                teamArr[0] = $.extend({}, obj);
                break;
              }
            }
            //数组去重
            let z = 0,
              footprintAll = 0;
            for (let i = 0; i < teamArr.length; i++) {
              for (let j = 0; j < teamArr[i].prdtList.length; j++) {
                footprintAll++;
                if (prdtCode == teamArr[i].prdtList[j].prdtCode) {
                  z++;
                  if (z > 1) {
                    teamArr[i].prdtList.splice(j, 1);
                    footprintAll--;
                  }
                }
                //控制在指定条数之内
                if (footprintAll > item) {
                  teamArr[i].prdtList.splice(j, 1);
                  footprintAll--;
                }
              }
              if (teamArr[i].prdtList.length == 0) {
                teamArr.splice(i, 1);
              }
            }
            footprintList = teamArr;
          } else {
            footprintList[0] = $.extend({}, obj);
          }
          accountObj[accountNum] = footprintList;
          file.insert("footprint_homeV4.js", accountObj, function (data) {
            //我的足迹记录成功后
            if (callback) {
              callback();
            }
          });
        });
      });
    },
  },
  watch: {
    inputNum(v, old) {
      this.getSearchData(v);

      if (!v && !this.isTarget) {
        //判断历史搜索的展开与收起
        this.$nextTick(() => {
          $(".item-search-out").each((k, v) => {
            $(v).show();
          });
          if (!$(".more-expand").hasClass("rotate")) {
            this.judgeParentH();
          }
        });
      }
    },
  },
  mounted() {
    let self = this;
    self.getHistory(() => {
      this.judgeParentH();
    }); //获取历史记录

    self.getFixedInvest(); //获取定投排行

    //页面返回事件
    window.GoBackOnLoad = function () {
      if (!self.inputNum && !self.isTarget) {
        $(".item-search-out").each((k, v) => {
          $(v).show();
        });
        if (!$(".more-expand").hasClass("rotate")) {
          self.judgeParentH();
        }
      }
    };

    window.loginLoad = function () {
      if (self.tabIndex === 1) {
        self.getPossessInvest();
      } else if (self.tabIndex === 2) {
        self.getRecordInvest();
      }
    };

    //系统判断
    if (base.isIphoneX()) {
      $(".nav-top").addClass("iphoneX");
      //自定义键盘兼容
      $("#keyboard").css("padding-bottom", "30px");
    } else if (base.isIPhone()) {
      $(".nav-top").addClass("iphone");
    }

    //主内容部分距离顶部距离
    this.$nextTick(() => {
      $(".content-result").css("top", $("#header").height() + "px");
      $(".actual-input").focus();
      //安卓手机只能使用系统键盘 目标盈的话展示系统键盘 =>全部使用系统键盘
      // if (base.isAndroid() || self.isTarget) {
      //   self.showInput = true
      //   $('.cursor').hide()
      //   $('#keyboard').hide()
      // }
      self.showInput = true;
      $(".cursor").hide();
      $("#keyboard").hide();

      //页面内容滑动隐藏键盘
      // $('.content-result')[0].addEventListener('touchmove', function(e) {
      //   $('.actual-input').blur()
      //   if (base.isIOS() && !self.isTarget) {
      //     $('#keyboard').slideUp(300) //自定义键盘收起
      //     $('.cursor').hide()
      //     self.showInput = false
      //     $('.actual-input').blur()
      //   }
      // })
      $(document)[0].addEventListener("touchstart", function (e) {
        let langTarget = $(".top-area");
        if (!langTarget.is(e.target) && langTarget.has(e.target).length === 0) {
          $(".actual-input").blur();
        } else {
          $(".actual-input").focus();
        }
      });
      //
      // $(document)[0].addEventListener('click', function(e) {
      //   e.preventDefault()
      //   // ios系统键盘,点击其他区域输入框不失焦
      //   if (self.showInput && base.isIOS() && !self.isTarget) {
      //     $('.actual-input').focus()
      //   } else {
      //     //安卓点击其他区域失去焦点
      //     let langTarget = $('.top-area')
      //     if (
      //       !langTarget.is(e.target) &&
      //       langTarget.has(e.target).length === 0
      //     ) {
      //       $('.actual-input').blur()
      //     }
      //   }
      // })
      // //输入框点击事件
      // $('.top-area').click(function(e) {
      //   if (!self.showInput) {
      //     $('.cursor').show()
      //     $('#keyboard').slideDown(300)
      //   }
      // })

      //上拉加载更多,滚动条滚底判断
      $(".content-result").scroll(function () {
        self.$nextTick(() => {
          let clientHeight = $(".content-result").height();
          let scrollHeight = $(".content-result")[0].scrollHeight;
          let scrollTop = $(".content-result").scrollTop();
          //定投排行上拉加载
          if (
            !self.inputNum &&
            self.tabIndex === 0 &&
            self.isTarget &&
            clientHeight + scrollTop + 10 >= scrollHeight && // 在底部位置时
            !self.investLoading && // 判断是否在加载中
            !self.isBottom //判断是否到底
          ) {
            $(".pull-up-word").text("加载中...");
            self.getMoreData();
          }
          //人气定投上拉加载
          if (
            !self.inputNum &&
            ((self.isTarget && self.tabIndex === 1) ||
              (!self.isTarget && self.tabIndex === 0)) &&
            clientHeight + scrollTop + 10 >= scrollHeight && // 在底部位置时
            !self.hotLoading && // 判断是否在加载中
            !self.isHotBottom //判断是否到底
          ) {
            $(".pull-up-hot-word").text("加载中...");
            self.getMoreHotData();
          }
        });
      });

      //键盘点击事件
      $("#keyboard").click(function (e) {
        if ($(e.target).text() === "搜索") {
          //开启搜索理财产品
          $("#keyboard").slideUp(300);
          $(".cursor").hide();
        } else {
          if ($(e.target).text() === "中文") {
            e.stopPropagation();
            //系统键盘切换
            self.showInput = true;
            self.$nextTick(() => {
              $(this).hide();
              $(".cursor").hide();

              $(".actual-input").focus();
            });
          } else if (!$(e.target).text()) {
            //清除
            self.inputNum = self.inputNum.substring(
              0,
              self.inputNum.length - 1
            );
          } else if (self.inputNum.length <= 20) {
            self.inputNum =
              $(e.target).text() === "空格"
                ? self.inputNum + " "
                : self.inputNum + $(e.target).text();
          }
        }
      });

      //基金表格tab切换
      $(".tab-item").click(function (e) {
        self.tabIndex = $(e.target).index();
        $(this).addClass("active").siblings().removeClass("active");
        let distance =
          $(e.target)[0].offsetLeft +
          ($(e.target).width() - $(".active-bar").width()) / 2;
        $(".active-bar").css({
          transform: "translateX(" + distance + "px)",
        });

        //持仓/收藏||我的足迹需要交易账户登录
        if (!self.isTarget && (self.tabIndex === 1 || self.tabIndex === 2)) {
          common.isLogin((loginFlag) => {
            if (!loginFlag.login) {
              //交易账户未登录
              $(".no-login").show();
            } else {
              if (self.tabIndex === 1) {
                self.getPossessInvest();
              } else if (self.tabIndex === 2) {
                self.getRecordInvest();
              }
            }
          });
        } else {
          $(".no-login").hide();
        }
      });
    });
  },
};
</script>

<style lang="less" scoped>
/* loading动画 */
.loading {
  position: absolute;
  z-index: 20000;
  width: 100%;
  height: 100%;
  background: #fff url("../assets/loading.gif") no-repeat center;
  background-size: 28px 28px;
}

.none {
  display: none;
}

#header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  background-color: #fff;
}
#header::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1px;
  pointer-events: none;
  content: "";
  background-color: rgba(151, 151, 151, 0.17);
  -webkit-transform: scale(1, 0.5);
  transform: scale(1, 0.5);
}
.nav-top {
  height: 0;
}
.nav-top.iphone {
  height: 20px;
}
.nav-top.iphoneX {
  height: 40px;
}

/* 顶部输入框部分 */
#header .search-box {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  padding: 14.5px 0 12.5px;
  overflow: hidden;
  .top-area {
    position: relative;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    width: 297px;
    height: 37px;
    padding-left: 39.5px;
    margin-left: 15px;
    background: url("../assets/searchbox@2x.png") no-repeat;
    background-size: 100% 100%;
    border-radius: 19px;
  }
  .cancel-search {
    margin-left: 16px;
    font-family: PingFangSC-Regular, sans-serif;
    font-size: 16px;
    color: #323232;
    text-align: left;
    letter-spacing: 0;
  }
}
.top-area .placeholder {
  position: absolute;
  top: 0;
  left: 47px;
  height: 37px;
  font-family: PingFangSC-Light, sans-serif;
  font-size: 15px;
  line-height: 37px;
  color: #abafb7;
  letter-spacing: 0;
  opacity: 0.7;
}
.top-area .num-area {
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 15px;
  color: #4d4d4d;
}

/* 制作的光标 */
.top-area .cursor {
  /* margin-top: 9px; */
  width: 4px;
  height: 22px;
  margin-left: -1px;
  border-radius: 4px;
  -webkit-animation-name: cursora;
  animation-name: cursora;
  -webkit-animation-duration: 1.2s;
  animation-duration: 1.2s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}

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

.top-area .actual-input {
  box-sizing: border-box;
  width: 220px;
  height: 37px;
  padding: 9px 0;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 15px;
  color: #4d4d4d;
  background-color: rgba(171, 175, 183, 0);
  border: none;
  outline: none;
  caret-color: #396efc;
}
.top-area .actual-input::placeholder {
  padding-left: 7.5px;
  font-family: PingFangSC-Light, sans-serif;
  font-size: 15px;
  color: #abafb7;
  letter-spacing: 0;
  opacity: 0.7;
}
.top-area .clears {
  position: absolute;
  top: 0;
  right: 16px;
  bottom: 0;
  width: 16px;
  height: 16px;
  margin: auto;
  background: url(../assets/cancel@2x.png) no-repeat center;
  background-size: 100% 100%;
}

/* 主内容和搜索结果部分 */
.content-result {
  position: absolute;
  top: 64px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.content {
  position: relative;

  /* 历史搜索 */
  .history-search {
    padding: 20px 21px 25px 16px;
    margin-bottom: 10.5px;
    background-color: #fff;
    .history-title {
      display: -webkit-flex;
      display: flex;
      align-items: center;
      justify-content: space-between;
      div:nth-child(1) {
        font-family: PingFangSC-Medium, sans-serif;
        font-size: 15px;
        color: #323232;
        text-align: left;
        letter-spacing: 0;
      }
      .del-icon {
        width: 12.5px;
        height: 14px;
        background: url("../assets/delete@2x.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .history-items {
      position: relative;
      display: flex;
      display: -webkit-flex;
      flex-wrap: wrap;
      margin-top: 2px;
      overflow: hidden;
      .item-search {
        display: inline-block;
        height: 28px;
        padding: 0 14px;
        margin-top: 10px;
        margin-right: 10px;
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 14px;
        line-height: 28px;
        color: #666;
        letter-spacing: 0;
        white-space: nowrap;
        background: #f8f8f7;
        border-radius: 14px;
      }
      .more-expand {
        display: none;
        width: 28px;
        height: 28px;
        margin-top: 10px;
        background: url("../assets/more@2x.png") no-repeat;
        background-size: 100% 100%;
      }
      .more-expand.rotate {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
      }
    }
  }

  /* 股票tab切换样式 */
  .tab-type {
    position: relative;
    display: -webkit-flex;
    display: flex;
    width: 100%;
    height: 50px;
    padding-top: 8px;
    padding-left: 18px;
    background-color: #fff;
    .tab-item {
      margin-right: 34px;
      font-family: PingFangSC-Regular, sans-serif;
      font-size: 15px;
      line-height: 42px;
      color: #676969;
      text-align: center;
      letter-spacing: 0;
    }
    .tab-item.active {
      font-family: PingFangSC-Medium, sans-serif;
      font-size: 16px;
      color: #323232;
    }
    .tab-item.collect {
      letter-spacing: 1px;
    }
    .active-bar {
      position: absolute;
      bottom: 1px;
      left: 0;
      z-index: 1;
      width: 30px;
      height: 3px;
      list-style: none;
      background-color: #396efc;
      border-radius: 1.5px;
      transition: transform 0.3s ease-in-out;
      -webkit-transform: translateX(35px);
      transform: translateX(35px);
    }
    &::after {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      height: 1px;
      pointer-events: none;
      content: "";
      background-color: rgba(151, 151, 151, 0.3);
      transform: scale(1, 0.5);
    }
  }

  /* 基金表格 */
  .fund-table {
    position: relative;
    min-height: 333px;
  }

  /* 基金表格tab切换动画 */
  .load-animation {
    position: absolute;
    z-index: 15;
    width: 100%;
    height: 333px;
    background-color: #fff;
    .load-icon {
      width: 51px;
      height: 44px;
      margin: 66px auto 0;
    }
    .load-word {
      margin: 21px auto 0;
      font-family: PingFangSC-Light, sans-serif;
      font-size: 15px;
      line-height: 28px;
      color: #999;
      text-align: center;
      letter-spacing: 0;
    }
  }

  /* 基金表格未登陆时 */
  .no-login {
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 333px;
    background-color: #fff;
    .no-login-icon {
      width: 126.7px;
      height: 126.7px;
      margin: 48.6px auto 0;
    }
    .no-login-word {
      margin-top: 9.7px;
      font-family: PingFangSC-Light, sans-serif;
      font-size: 15px;
      line-height: 28px;
      color: #999;
      text-align: center;
      letter-spacing: 0;
    }
    .login-btn {
      width: 340px;
      height: 60px;
      margin: 33px auto 0;
      font-family: PingFangSC-Regular, sans-serif;
      font-size: 17px;
      line-height: 56px;
      color: #fff;
      text-align: center;
      background: url("../assets/button@2x.png") no-repeat;
      background-size: 100% auto;
    }
  }

  .table-head {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    padding-left: 14px;
    line-height: 30px;
    background: #f8f8f7;
    .tab-head-item {
      font-family: PingFangSC-Light, sans-serif;
      font-size: 12px;
      color: #919191;
      opacity: 0.89;
    }
    .tab-head-item:nth-child(1) {
      flex: 1;
      text-align: left;
    }
    .tab-head-item:nth-child(2) {
      /* width: 103px; */
      text-align: right;
    }
    .tab-head-item:nth-child(3) {
      width: 82px;
      text-align: right;
      span {
        display: inline-block;
        width: 45px;
        margin-right: 15px;
        text-align: center;
      }
    }
  }
  .table-body {
    padding: 2.5px 15px 5px;
    background-color: #fff;
    .table-tr {
      position: relative;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      padding: 14.5px 0 13.5px;
      .table-td:nth-child(1) {
        display: flex;
        display: -webkit-flex;
        flex: 1;
        align-items: flex-start;
        .td-order {
          min-width: 15px;
          font-family: ArialMT, sans-serif;
          font-size: 17px;
          font-weight: 500;
          line-height: 23px;
          color: #cccccc;
        }
        .td-order.three {
          font-family: Arial-BoldMT, sans-serif;
          font-size: 17px;
          color: #396efc;
        }
        .fund-name {
          width: 156px;
          margin-left: 6px;
          div:nth-child(1) {
            overflow: hidden;
            font-family: PingFangSC-Regular, sans-serif;
            font-size: 16px;
            line-height: 23px;
            color: #2e2e2e;
            text-overflow: ellipsis;
            letter-spacing: 0.2px;
            white-space: nowrap;
          }
          div:nth-child(2) {
            display: -webkit-flex;
            display: flex;
            align-items: center;
            height: 18px;
            font-family: PingFangSC-Light, sans-serif;
            font-size: 13px;
            color: #999;
            white-space: nowrap;
          }
          .host-fund-sign {
            width: 28px;
            height: 14px;
            margin-left: 6px;
            font-family: PingFangSC-Regular, sans-serif;
            font-size: 10px;
            line-height: 14px;
            color: #ff8612;
            text-align: center;
            background: rgba(255, 138, 27, 0.11);
            border-radius: 1px;
          }
          .year-rate {
            margin-left: 5px;
            font-family: PingFangSC-Medium, sans-serif;
            font-size: 13px;
            color: #f64843;
            text-align: left;
            letter-spacing: 0;
          }
        }
      }
      .table-td:nth-child(2) {
        width: 101px;
        height: 23px;
        overflow: hidden;
        font-family: ArialMT, sans-serif;
        font-size: 17px;
        line-height: 23px;
        color: #fc3438;
        text-align: right;
        text-overflow: ellipsis;
      }
      .table-td:nth-child(3) {
        width: 69px;
        text-align: right;
        .select-btn {
          position: relative;
          display: inline-block;
          width: 45px;
          height: 23px;
          font-family: PingFangSC-Regular, sans-serif;
          font-size: 12px;
          line-height: 23px;
          color: #396efc;
          text-align: center;
          background-color: #fff;
          border-radius: 12.5px;
          &::after {
            position: absolute;
            top: -1px;
            left: -1px;
            width: 200%;
            height: 200%;
            overflow: auto;
            content: "";
            background-color: #fff0;
            border: 1px solid rgba(57, 110, 252, 0.68);
            border-radius: 25px;
            -webkit-transform: scale(0.5, 0.5);
            transform: scale(0.5, 0.5);
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
          }
        }
        .select-btn.disabled {
          color: #9b9b9b;
          &::after {
            position: absolute;
            top: -1px;
            left: -1px;
            width: 200%;
            height: 200%;
            overflow: auto;
            content: "";
            background-color: #fff0;
            border: 1px solid rgba(155, 155, 155, 0.68);
            border-radius: 25px;
            -webkit-transform: scale(0.5, 0.5);
            transform: scale(0.5, 0.5);
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
          }
        }
      }
    }
    .table-tr + .table-tr::after {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: 1;
      height: 1px;
      pointer-events: none;
      content: "";
      background-color: rgba(223, 223, 223, 0.7);
      transform: scale(1, 0.5);
    }
  }
}
.no-data {
  padding-top: 23px;
  padding-bottom: 23px;
  font-size: 14px;
  color: #989898;
  text-align: center;
  background-color: #fff;
}
.pull-up-word {
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  text-align: center;
}
.pull-up-hot-word {
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  text-align: center;
}

/* 搜索结果 */
.search-result {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  background: #f7f7f7;
  .result-item {
    display: flex;
    display: -webkit-flex;
    align-items: center;

    /* height: 66px; */
    padding: 20px 15px 24px;
    background-color: #fff;
    .search-icon {
      width: 15px;
      height: 15px;
      margin-left: 12px;
      background: url("../assets/searchicon@3x.png") no-repeat;
      background-size: 100% 100%;
    }
    .data-word1 {
      margin-left: 13.5px;
      font-family: PingFangSC-Regular, sans-serif;
      font-size: 16px;
      line-height: 22px;
      color: #386cec;
    }
    .data-word2 {
      flex: 1;
      margin-left: 10px;
      font-family: PingFangSC-Regular, sans-serif;
      font-size: 16px;
      line-height: 22px;
      color: #000000;
    }
    .data-select {
      width: 50px;
      line-height: 23px;
      text-align: right;
      .select-btn {
        display: inline-block;
        width: 45px;
        height: 23px;
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 12px;
        line-height: 23px;
        color: #396efc;
        text-align: center;
        border: 1px solid rgba(57, 110, 252, 0.4);
        border-radius: 12.5px;
      }
      .select-btn.disabled {
        color: #9b9b9b;
        border: 1px solid rgba(155, 155, 155, 0.4);
      }
    }
  }
  .result-item-coin {
    padding: 19px 0;
    background-color: #fff;
    .item-coin {
      display: flex;
      display: -webkit-flex;
      align-items: center;
      height: 22px;
      padding: 0 15px;
      .search-icon {
        width: 15px;
        height: 15px;
        margin-left: 12px;
        background: url("../assets/searchicon@3x.png") no-repeat;
        background-size: 100% 100%;
      }
      .data-word1 {
        margin-left: 13.5px;
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 16px;
        line-height: 22px;
        color: #386cec;
      }
      .data-word2 {
        flex: 1;
        margin-left: 10px;
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 16px;
        line-height: 22px;
        color: #000000;
      }
    }
    .coin-no-support {
      padding: 0 34.4px 0 57.5px;
      margin-top: 14px;
      font-family: PingFangSC-Regular, sans-serif;
      font-size: 16px;
      color: #2f2f2f;
    }
  }

  .item-box {
    position: relative;
  }
  .item-box + .item-box::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1;
    height: 1px;
    pointer-events: none;
    content: "";
    background-color: rgba(223, 223, 223, 0.7);
    transform: scale(1, 0.5);
  }
}
.no-result-data {
  display: none;
  height: 70px;
  padding-top: 23px;
  font-size: 14px;
  color: #989898;
  text-align: center;
  background-color: #fff;
}

/* 自定义键盘 */
#keyboard {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  background-color: #fff;

  /* display: none; */
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
  background-color: #ededed;
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
  background-color: #ededed;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
#keyboard li > span {
  position: relative;
  float: left;

  /* 77.5 */
  width: 77.5px;

  /* 54 */
  height: 54px;
  font-size: 18px;

  /* 54 */
  line-height: 54px;
  color: #333;
  text-align: center;
}
#keyboard li > span:first-child {
  /* 66 */
  width: 66px;
  font-size: 17px;
}
#keyboard li > span::after {
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 200%;
  content: "";
  background-color: #ededed;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
#keyboard li > span:active {
  background-color: #e3e3e3;
}
#keyboard .delete {
  position: absolute;
  top: 0;
  right: 0;

  /* 77 */
  width: 77px;
  height: 50%;
  background: url(../assets/del.png) no-repeat center;
  background-size: 27px 20px;
}
#keyboard .delete:active {
  background-color: #e3e3e3;
}
#keyboard .key-search {
  position: absolute;
  right: 0;
  bottom: 0;

  /* 77 */
  width: 77px;
  height: 50%;
  background: #007aff;
}
#keyboard .key-search span {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 18px;
  color: #fff;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.no-support-tooltip {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20000;
  display: none;
  width: 216px;
  height: 44px;
  margin: auto;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 13px;
  line-height: 44px;
  color: #fff;
  text-align: center;
  background: #111111;
  border-radius: 5px;
  opacity: 0.9;
}
</style>
