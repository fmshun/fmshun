<template>
  <div :class="{ android: isAndroid, iphoneX: isIphoneX }" id="aip-home">
    <div id="header-area">
      <span @click="goback" class="back-img"></span>
      <span class="header-title">定投专区</span>
    </div>
    <div id="wrapper">
      <div id="scroller">
        <div id="content">
          <!--顶部名言-->
          <div :class="[topCls]" id="top-word"></div>

          <template v-for="(item, inx) in resultData">
            <!--顶部banner区域-->
            <div :key="inx" v-if="item.moduleType == '01001'" id="banner-area">
              <div id="swiper1">
                <div class="swiper-container">
                  <div class="swiper-wrapper">
                    <div
                      @click="entryClk(item)"
                      :key="inx"
                      v-for="(item,inx) in item.picList"
                      class="swiper-slide"
                    >
                      <div
                        :class="{'part1':inx==0,'part2':inx==1,'part3':inx==2,'part4':inx>2,'new':item.state=='1'}"
                        class="part"
                      >
                        <img :src="item.pic" />
                        <div class="name">{{item.name}}</div>
                        <div class="special-img"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="item.picList.length>4" @click="slideEnd" class="arrow"></div>
              </div>
            </div>
            <div :key="inx" v-if="item.moduleType == '01004'" id="swiper2">
              <div class="swiper-container">
                <div @click="picClk($event)" class="swiper-wrapper">
                  <div :key="inx" v-for="(item,inx) in item.picList" class="swiper-slide">
                    <div
                      :style="{'background':'url('+item.pic+') no-repeat left top','backgroundSize':'100% 100%'}"
                      class="slide-content"
                    ></div>
                  </div>
                </div>
                <div v-if="item.picList.length>1" class="swiper-pagination"></div>
              </div>
            </div>

            <!--定投好基汇-->
            <div :key="inx" v-else-if="item.moduleType == '02002'" id="nice-fund">
              <div @click="goNiceFund(item)" class="title-area">
                <!--<div :class="{'hasmore':item.hasMore=='1'}" class="name">定投好基汇</div>-->
                <div class="name">定投好基汇</div>
              </div>
              <div class="swiper-container">
                <div @click="bigCardDetail($event)" class="swiper-wrapper">
                  <div :key="inx" v-for="(item,inx) in item.bigCardList" class="swiper-slide">
                    <div :class="{'special':!item.name}" class="slide-content">
                      <template v-if="item.name">
                        <div class="swiper-top">
                          <div class="title-left">
                            <span class="tag1">{{item.title}}</span>
                          </div>
                          <div class="title-right">
                            <span class="tag2">{{item.subtitle}}</span>
                          </div>
                          <div class="prdt-name">{{item.name}}</div>
                          <div class="yield-area">
                            <span :class="{special:afterZero(item.rate)}" class="yield">
                              {{item.rate?item.rate:'--'}}
                              <span
                                :class="{special:afterZero(item.rate)}"
                                class="unit"
                              >％</span>
                            </span>
                          </div>
                          <div class="yield-desc">{{item.rateType}}</div>
                          <div class="start-aip">
                            <span>{{item.buttonText}}</span>
                          </div>
                        </div>
                        <div class="swiper-bottom"></div>
                      </template>
                      <template v-else>
                        <div
                          @click="startDayAip(item.link)"
                          :style="{'background':'url('+item.pic+') no-repeat left top','backgroundSize':'100% 100%'}"
                          class="swiper-top"
                        ></div>
                        <div class="swiper-bottom"></div>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="swiper-pagination"></div>
              </div>
            </div>

            <!--人气定投-->
            <div :key="inx" v-else-if="item.moduleType == '03001'" id="hot-aip">
              <div @click="goPopularAip" class="title-area">
                <span class="name">{{ item.moduleName }}</span>
              </div>
              <div class="top">
                <span>{{ item.desc }}</span>
              </div>
              <ul class="prdt-list">
                <li
                  @click="goFundDetail(item,1)"
                  :key="inx"
                  v-for="(item, inx) in item.smallCardList"
                >
                  <div class="name-area">
                    <div class="prdt-name">{{ item.title }}</div>
                    <div class="prdt-code">{{ item.subtitle }}</div>
                  </div>
                  <div class="content-div">
                    <div class="left">
                      <div class="yield-area">
                        <span
                          :class="{special:afterZero(item.rate)}"
                          class="yield"
                        >{{ item.rate?item.rate:'--' }}</span>
                        <span :class="{special:afterZero(item.rate)}" class="unit">%</span>
                      </div>
                      <div class="yield-desc">{{ item.rateType }}</div>
                    </div>
                    <div class="right">
                      <div class="count-area">
                        <span class="count">{{ item.ext1 }}</span>
                        <span class="unit2">次</span>
                      </div>
                      <div class="count-desc">乐友累计定投</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <!--基智定投-->
            <div :key="inx" v-else-if="item.moduleType == '80001'" id="jz-aip">
              <div class="title-area">
                <span class="name">基智定投</span>
              </div>
              <div class="tabs">
                <div @click="jzTabClk(1)" :class="{ active: jzTab == 1 }" class="tab">
                  <span class="text">目标止盈</span>
                </div>
                <div @click="jzTabClk(2)" :class="{ active: jzTab == 2 }" class="tab">
                  <span class="text">定投行业</span>
                </div>
                <div @click="jzTabClk(3)" :class="{ active: jzTab == 3 }" class="tab">
                  <span class="text">策略定投</span>
                </div>
              </div>
              <div class="bottom-area">
                <template v-for="(item, inx) in item.moduleList">
                  <!--目标止盈-->
                  <template v-if="item.moduleType == '90001'">
                    <div :key="inx" v-show="jzTab == 1" class id="mbzy">
                      <div class="content">
                        <div class="titlea">想赚多少自己定！</div>
                        <div class="detail">设置定投目标，自动止盈无须操心</div>
                        <!--默认10%,步长2%-->
                        <div class="yield">10.0%</div>
                        <div class="box">
                          <div class="shadow"></div>
                          <div class="pointer"></div>
                          <div
                            @touchstart.stop.prevent="touchstart"
                            @touchmove.stop.prevent="touchmove"
                            @touchend.stop.prevent="touchend"
                            class="touch-area"
                          ></div>
                          <div class="bar-wrapper">
                            <div class="bar-wrapper2">
                              <div class="bar">
                                <div
                                  class="scales ignore"
                                  :class="{
                                big: i % 10 == 0,
                                mid: i % 10 != 0 && i % 5 == 0,
                                special: i == 0,
                              }"
                                  :key="i"
                                  v-for="(item, i) in 961"
                                >
                                  <span
                                    :class="{ special: i == 0 }"
                                    v-if="i % 20 == 0"
                                    class="scale-v"
                                  >{{ 4 + (i / 20) * 2 }}.0%</span>
                                </div>
                              </div>
                            </div>
                            <div class="bg-div"></div>
                          </div>
                        </div>
                        <div @click="startAip(1)" class="prdt-area">
                          <span class="prdt-name">{{item.prdtName}}</span>
                        </div>
                        <div @click="startAip(2)" class="st-aip">
                          <span>开启目标止盈定投</span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="item.moduleType == '03001'">
                    <!--定投行业-->
                    <div :key="inx" v-show="jzTab == 2" id="dthy">
                      <div class="content">
                        <div class="titlea">热门定投行业</div>
                        <div class="detail">根据市场环境，为您推荐热门定投行业</div>
                        <ul class="hy-list">
                          <li
                            @click="goIndustry(item)"
                            :key="inx"
                            v-for="(item,inx) in item.smallCardList"
                          >
                            <div class="main">
                              <div class="left">
                                <div class="yield-area">
                                  <span class="yield">{{item.rate}}</span>
                                  <span class="unit">%</span>
                                </div>
                                <div class="yield-desc">近1年收益率</div>
                              </div>
                              <div class="right">
                                <div class="hy-name">{{item.name}}</div>
                                <div class="hy-detail">{{item.desc}}</div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="item.moduleType == '01001'">
                    <!--策略定投-->
                    <div :key="inx" v-show="jzTab == 3" id="cldt">
                      <div
                        :style="{'background':'url('+item.picList[0].pic+') no-repeat left top','backgroundSize':'100% 100%'}"
                        @click="cldtClk(item)"
                        class="content"
                      ></div>
                    </div>
                  </template>
                </template>
              </div>
            </div>

            <!--指数定投-->
            <div :key="inx" v-else-if="item.moduleType == '90004'" id="index-aip">
              <div class="top-area">
                <div class="titlea">{{ item.moduleName }}</div>
                <div @click="goIndex" class="go-index">
                  <span>寻找最便宜的指数</span>
                </div>
              </div>
              <div @click="goIndexDetail(item)" class="content">
                <div class="index-name">{{ item.title }}</div>
                <div class="detail">
                  <span>
                    当前市盈率{{ item.pe }}，处于近五年{{
                    peObj[item.peLocation]
                    }}位区
                  </span>
                </div>
                <div v-if="item.peLocation == '1'" class="zd-buy"></div>
                <div class="total">
                  <div class="sec section1">
                    <span :class="{ curr: item.peLocation == '1' }" class="g-name">低估</span>
                    <span :style="{ width: getWidth0(item.peLocation) }" class="pro progress1"></span>
                  </div>
                  <div class="sec section2">
                    <span
                      :class="{ curr: ['2', '3'].indexOf(item.peLocation) != -1 }"
                      class="g-name"
                    >正常</span>
                    <span :style="{ width: getWidth(item.peLocation) }" class="pro progress2"></span>
                  </div>
                  <div class="sec section3">
                    <span :class="{ curr: parseInt(item.peLocation) > 3 }" class="g-name">高估</span>
                    <span
                      :class="{ all: item.peLocation == '5' }"
                      :style="{ width: getWidth2(item.peLocation) }"
                      class="pro progress3"
                    ></span>
                  </div>
                </div>
                <ul class="prdt-list">
                  <li
                    @click.stop="goFundDetail(item,2)"
                    :key="inx"
                    v-for="(item, inx) in item.prdtList"
                  >
                    <span class="prdt-name">{{ item.name }}</span>
                    <div class="dingtou">
                      <span>{{ item.amount }}元定投</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!--梦想计划-->
            <div :key="inx" v-else-if="item.moduleType == '01003'" id="mxjh">
              <div class="title-area">
                <span class="name">{{ item.moduleName }}</span>
              </div>
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  <div :key="inx" v-for="(item, inx) in item.picList" class="swiper-slide">
                    <div
                      :style="{
                    background: 'url(' + item.pic + ') no-repeat center',
                    backgroundSize: '100% 100%',
                  }"
                      class="slide-content"
                      @click="mxjhClk(item,inx)"
                    ></div>
                  </div>
                </div>
                <div class="swiper-pagination"></div>
              </div>
            </div>

            <!--智能计算器-->
            <div :key="inx" v-else-if="item.moduleType == '90003'" id="intel-calc">
              <div class="title-area">
                <span class="name">{{ item.moduleName }}</span>
              </div>
              <div class="content">
                <div @click="goCounter(item,item.prdtName)" class="name-area">
                  <span class="prdt-name">{{ item.prdtName }}</span>
                  <span v-if="item.isHot=='1'" class="hot"></span>
                </div>
                <ul class="item-list">
                  <li @click="goCounter(item,'定投金额')">
                    <span class="item-name">定投金额</span>
                    <span class="value">1000</span>
                  </li>
                  <li @click="goCounter(item,'起投时间')">
                    <span class="item-name">起投时间</span>
                    <span class="value">{{ item.startDate }}</span>
                  </li>
                  <li @click="goCounter(item,'结束时间')">
                    <span class="item-name">结束时间</span>
                    <span class="value">{{ item.endDate }}</span>
                  </li>
                </ul>
                <div @click="goCounter(item,'一键计算')" class="calc-btn">
                  <span>一键计算</span>
                </div>
              </div>
            </div>
          </template>

          <!--底部声明-->
          <div id="footer">
            <div class="announce">免责声明：收益率数据仅供参考，过往业绩不预示未来表现，不构成投资建议。投资者据此操作，风险自担。</div>
            <div class="tip">
              <span class="left"></span>
              <span class="risk">市场有风险，投资需谨慎</span>
              <span class="right"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--目标盈选择产品-->
    <div v-if="showPrdtChoose" id="prdt-choose">
      <div class="dialog">
        <div class="header">
          <span @click="showPrdtChoose=false" class="cancel">取消</span>
          <span class="titlec">选择定投产品</span>
          <span class="btn">确认</span>
        </div>
        <ul>
          <li>
            <div class="circle choosed"></div>
            <div class="prdt-name">南方天天利货币E</div>
            <div class="yield-area">
              <span class="yield-desc">近三年收益率</span>
              <span class="yield">2.3739%</span>
            </div>
            <div class="detail">详情</div>
          </li>
          <li>
            <div class="circle"></div>
            <div class="prdt-name">光大保德信信用债券A</div>
            <div class="yield-area">
              <span class="yield-desc">近三年收益率</span>
              <span class="yield">10.373%</span>
            </div>
            <div class="detail">详情</div>
          </li>
          <li>
            <div class="circle"></div>
            <div class="prdt-name">华泰紫金零钱宝货币</div>
            <div class="yield-area">
              <span class="yield-desc">近三年收益率</span>
              <span class="yield">2.3739%</span>
            </div>
            <div class="detail">详情</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import base from 'base'
import '@/libs/swiper4.5.css'
import '@/libs/swiper4.5.min.js'
import loadScripts from '@/utils/loadScripts.js'
export default {
  name: 'aip-home',
  components: {},
  data() {
    return {
      lastX: 0,
      tempI: -1,
      //刻度间距(对应的scale的间距样式要改下)
      dis: 3,
      //是否是android手机
      isAndroid: false,
      //是否是iphoneX手机
      isIphoneX: false,
      //基智定投当前选中的tab
      jzTab: 1,
      //后台返回的数据
      resultData: [],
      peObj: {
        '1': '低',
        '2': '中低',
        '3': '中',
        '4': '中高',
        '5': '高',
      },
      //是否展示目标盈选择产品弹窗
      showPrdtChoose: false,
      //目标盈选择的产品和收益率
      choosePrdt: {},
      //顶部宣导文案展示的样式(第几张图)
      topCls: '',
      //顶部名言图个数
      topBgCount: 7,
      //顶部快捷入口swiper
      swiper1: null,
      bannerPicList: [],
      //定投好基汇大卡列表
      bigCardList: [],
      myScroll: null,
      //是否可点击的标志
      flag: true,
      //swiper在滑动时禁止click事件触发
      isMoving: false,
    }
  },
  beforeCreate() {
    loadScripts(['/common/scripts/file.js']).then(() => {
      //查询本地头部宣导文案索引
      this.queryTopInx()
    })
    //白头要显示wifi和电量图表
    base.href('http://action:10066?isShowDarkStatusBar=1')
  },
  beforeMount() {
    //获取页面数据
    this.getData()
  },
  mounted() {
    let that = this
    if (base.isAndroid()) {
      this.isAndroid = true
    } else if (base.isIphoneX()) {
      this.isIphoneX = true
    }
    this.$nextTick(() => {
      var h = $('#header-area').height()
      $('#wrapper')
        .height(window.innerHeight - h)
        .css({ top: h + 'px' })
    })
    $('#app').css('padding-top', '0px')

    this.myScroll = new window.iScroll('wrapper', {
      useTransition: false,
      hScroll: false,
      hScrollbar: false,
      vScrollbar: false,
      useTransform: false,
      checkDOMChanges: false,
      hideScrollbar: true,
      HWCompositing: true,
      bounce: false,
      onScrollMove: function() {
        that.isMoving = true
      },
      onScrollEnd: function() {
        that.isMoving = false
      },
    })
  },
  methods: {
    //跳转到指数详情页
    goIndexDetail(item) {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      //页面滚动时不触发点击
      if (this.isMoving) {
        this.isMoving = false
        return
      }

      base.href(
        'http://action:10061/?fullscreen=1&&topcolor=FF7C00&&secondtype=99&&secondtext=%E8%AF%B4%E6%98%8E&&secondjsfuncname=description()&&url=/licai/stock-index/details.htm?code=' +
          item.indexCode +
          '&count=' +
          item.prdtAmount +
          '&name=' +
          item.title
      )
    },
    cldtClk(item) {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      //页面滚动时不触发点击
      if (this.isMoving) {
        this.isMoving = false
        return
      }

      window.TalkingData.onHTSCEvent(
        'click',
        'leaf677',
        '1.0',
        '理财_基金定投|定投专区页面|基智定投区|行动按钮',
        'move_button={开启智能定投}|tab_name={策略定投}'
      )
      base.href(item.picList[0].link)
    },
    //跳转到定投行业落地页
    goIndustry(item) {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      //页面滚动时不触发点击
      if (this.isMoving) {
        this.isMoving = false
        return
      }

      base.href(
        'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/aip-industry.html?id=' +
          item.themeId +
          '&name=' +
          encodeURIComponent(item.name)
      )
    },
    //开启日定投
    startDayAip(link) {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      if (this.isMoving) {
        this.isMoving = false
        return
      }
      base.href(link)
    },
    //跳转到基金详情页
    goFundDetail(item, inx) {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      //页面滚动时不触发点击
      if (this.isMoving) {
        this.isMoving = false
        return
      }

      if (inx == 1) {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf677',
          '1.0',
          '理财_基金定投|定投专区页面|人气定投区|产品按钮',
          'fund_code={' + item.subtitle + '}|fund_name={' + item.title + '}'
        )
      } else if (inx == 2) {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf677',
          '1.0',
          '理财_基金定投|定投专区页面|指数定投区|产品按钮',
          'fund_code={' + item.prdtCode + '}|fund_name={' + item.name + '}'
        )
      }
      base.href(
        'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/licai/detail/fund-v2/detail.htm?productCode=' +
          (item.subtitle || item.prdtCode)
      )
    },
    //大卡跳到产品详情页
    bigCardDetail(event) {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      if (this.isMoving) {
        this.isMoving = false
        return
      }

      var target = $(event.currentTarget),
        inx = target
          .find('.swiper-slide-active')
          .attr('data-swiper-slide-index'),
        item = this.bigCardList[parseInt(inx)]
      if (item.name) {
        if (
          $(event.target).is('.start-aip') ||
          $(event.target)
            .parent()
            .is('.start-aip')
        ) {
          window.TalkingData.onHTSCEvent(
            'click',
            'leaf677',
            '1.0',
            '理财_基金定投|定投专区页面|定投好基汇区|开启日定投按钮',
            ''
          )
        } else {
          window.TalkingData.onHTSCEvent(
            'click',
            'leaf677',
            '1.0',
            '理财_基金定投|定投专区页面|定投好基汇区|产品按钮',
            'fund_code={' + item.prdtCode + '}|fund_name={' + item.name + '}'
          )
        }
        base.href(
          'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/licai/detail/fund-v2/detail.htm?productCode=' +
            item.prdtCode
        )
      }
    },
    afterZero(num) {
      return parseFloat(num) < 0 ? true : false
    },
    //跳到智能计算器设置页
    goCounter(item, txt) {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      //页面滚动时不触发点击
      if (this.isMoving) {
        this.isMoving = false
        return
      }
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf677',
        '1.0',
        '理财_基金定投|定投专区页面|智能计算器区|入口',
        'enter_calculator={' + txt + '}'
      )
      base.href(
        'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/financing-counter.html?prdtId=' +
          item.prdtId
      )
    },
    //开启目标盈定投
    startAip(inx) {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      //页面滚动时不触发点击
      if (this.isMoving) {
        this.isMoving = false
        return
      }
      if (inx == 2) {
        window.TalkingData.onHTSCEvent(
          'click',
          'leaf677',
          '1.0',
          '理财_基金定投|定投专区页面|基智定投区|行动按钮',
          'move_button={开启目标止盈定投}|tab_name={目标止盈}'
        )
      }
      let obj = this.choosePrdt
      let str =
        '?code=' +
        obj.prdtCode +
        '&name=' +
        encodeURIComponent(obj.prdtName) +
        '&prdtId=' +
        obj.prdtId +
        '&yield=' +
        obj.yield
      base.href(
        'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/target.html' +
          str
      )
    },
    //跳转到指数掘基首页
    goIndex() {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      //页面滚动时不触发点击
      if (this.isMoving) {
        this.isMoving = false
        return
      }
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf677',
        '1.0',
        '理财_基金定投|定投专区页面|指数定投区|查看总入口按钮',
        ''
      )
      base.href(
        'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/licai/stock-index/index.htm'
      )
    },
    //快捷入口点击
    entryClk(item) {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      if (this.isMoving) {
        this.isMoving = false
        return
      }
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf677',
        '1.0',
        '理财_基金定投|定投专区页面|顶部|当前主入口按钮',
        'enter={' + item.name + '}'
      )
      base.href(item.link)
    },
    //左右滑动图片点击(因为有循环滑动所以要单独处理)
    picClk(event) {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      if (this.isMoving) {
        this.isMoving = false
        return
      }
      var target = $(event.currentTarget),
        inx = target
          .find('.swiper-slide-active')
          .attr('data-swiper-slide-index')
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf677',
        '1.0',
        '理财_基金定投|定投专区页面|图片区|广告图',
        'pos={' +
          (parseInt(inx) + 1) +
          '}| picname={}|picid={}|pic={' +
          this.bannerPicList[parseInt(inx)].pic +
          '}|pic_ref={' +
          this.bannerPicList[parseInt(inx)].link +
          '}'
      )
      base.href(this.bannerPicList[parseInt(inx)].link)
    },
    //跳到定投好基汇页面(业务去掉了)
    goNiceFund(item) {
      // if (this.flag) {
      //   this.flag = false
      //   setTimeout(() => {
      //     this.flag = true
      //   }, 300)
      // } else {
      //   return
      // }
      // if (item.hasMore == '1') {
      //   base.href(
      //     'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/nice-fund.html'
      //   )
      // }
    },
    //跳到人气定投页面
    goPopularAip() {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      //页面滚动时不触发点击
      if (this.isMoving) {
        this.isMoving = false
        return
      }
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf677',
        '1.0',
        '理财_基金定投|定投专区页面|人气定投区|查看总入口按钮',
        ''
      )
      base.href(
        'http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/popular-aip.html'
      )
    },
    //查询本地头部宣导文案索引
    queryTopInx() {
      let fileName = 'financing-aip-home.js',
        that = this
      window.file.readByKey(fileName, 'topInfo', function(data) {
        //之前存过索引
        if (data) {
          //日期不一致
          if (data.date != that.formateDate()) {
            let topInx = parseInt(data.topInx)
            //到最后一个了重置索引
            if (topInx == that.topBgCount - 1) {
              topInx = 0
            } else {
              ++topInx
            }
            that.topCls = 'pic' + topInx
            window.file.insert(fileName, {
              topInfo: { topInx: topInx, date: that.formateDate() },
            })
          } else {
            //日期一致
            that.topCls = 'pic' + data.topInx
          }
        } //之前未存过
        else {
          that.topCls = 'pic0'
          window.file.insert(fileName, {
            topInfo: { topInx: 0, date: that.formateDate() },
          })
        }
      })
    },
    //格式化日期
    formateDate() {
      let date = new Date()
      return (
        date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate()
      )
    },
    //获取页面数据
    getData() {
      var url = '/reqxml?action=27401&path=/time_invest/entry',
        that = this
      window.ajax.run('/reqlocal?jyloginflag=', '', function(res2) {
        if (parseInt(res2.JYLOGINFLAG) > 1) {
          url += '&clientNo=($account)'
        }
        window.ajax.run(
          url,
          '',
          function(res) {
            $('.loader-wrapper').hide()
            res = JSON.parse(res.BINDATA)
            if (res.code == '0') {
              that.resultData = res.resultData
              let obj = {}
              for (let i = 0; i < res.resultData.length; i++) {
                var temp = res.resultData[i]
                if (temp.moduleType == '80001') {
                  var list = temp.moduleList
                  for (let j = 0; j < list.length; j++) {
                    var temp2 = list[j]
                    if (temp2.moduleType == '90001') {
                      obj.prdtName = temp2.prdtName
                      obj.prdtCode = temp2.prdtCode
                      obj.prdtId = temp2.prdtId
                      //10表示10%，是目标盈默认收益率
                      obj.yield = 10
                    } //定投行业最多显示2条记录
                    else if (temp2.moduleType == '03001') {
                      var _list = temp2.smallCardList
                      _list = _list.slice(0, 2)
                      temp2.smallCardList = _list
                    }
                  }
                } else if (temp.moduleType == '01004') {
                  that.bannerPicList = temp.picList
                } else if (temp.moduleType == '02002') {
                  that.bigCardList = temp.bigCardList
                  if (!temp.bigCardList || temp.bigCardList.length == 0) {
                    res.resultData[i] = {}
                  }
                }
              }
              that.choosePrdt = obj
              that.$nextTick(() => {
                that.initSth()
                that.myScroll.refresh()
              })
            } else {
              alert(res.msg)
            }
          },
          function() {
            $('.loader-wrapper').hide()
            alert('网络连接失败!')
          }
        )
      })
    },
    initSth() {
      let that = this
      let arr = [
        {
          selector: '#swiper1 .swiper-container',
          options: {
            autoplay: false,
            loop: false,
            slidesPerView: 4,
            threshold: 3,
            preventClicksPropagation: true,
            on: {
              touchMove: function() {
                that.isMoving = true
              },
              touchEnd: function() {
                setTimeout(() => {
                  that.isMoving = false
                }, 300)
              },
            },
          },
        },
        {
          selector: '#swiper2 .swiper-container',
          options: {
            autoplay: {
              delay: 8000,
              disableOnInteraction: false,
            },
            loop: true,
            threshold: 3,
            slidesPerView: 1,
            preventClicksPropagation: true,
            pagination: {
              el: '#swiper2 .swiper-pagination',
            },
            on: {
              touchMove: function() {
                that.isMoving = true
              },
              touchEnd: function() {
                setTimeout(() => {
                  that.isMoving = false
                }, 300)
              },
            },
          },
        },
        {
          selector: '#nice-fund .swiper-container',
          options: {
            autoplay: false,
            loop: true,
            slidesPerView: 1,
            threshold: 3,
            preventClicksPropagation: true,
            pagination: {
              el: '#nice-fund .swiper-pagination',
            },
            on: {
              touchMove: function() {
                that.isMoving = true
              },
              touchEnd: function() {
                setTimeout(() => {
                  that.isMoving = false
                }, 300)
              },
            },
          },
        },
        {
          selector: '#mxjh .swiper-container',
          options: {
            autoplay: false,
            loop: false,
            freeMode: true,
            preventClicksPropagation: true,
            threshold: 3,
            slidesPerView: 'auto',
            on: {
              touchMove: function() {
                that.isMoving = true
              },
              touchEnd: function() {
                setTimeout(() => {
                  that.isMoving = false
                }, 300)
              },
            },
          },
        },
      ]

      //创建swiper
      arr.forEach((item, inx) => {
        let swiper = this.createSwiper(item.selector, item.options)
        if (inx == 0) {
          this.swiper1 = swiper
        }
      })

      //设置目标止盈刻度初始left值
      var dom = $('#mbzy .bar')
      //(4%挪到10%)60个区间,61条竖线,注意竖线宽度1px并没有转成vw，所以要单独计算
      dom.css({ left: -(61 + this.dis * 60) + 'px' })

      //顶部闹钟当日有定投的,2s后动一下,然后每隔10s动一下
      var inx = -1,
        gif = ''
      for (var i = 0; i < this.resultData.length; i++) {
        var temp = this.resultData[i]
        if (temp.moduleType == '01001') {
          var list = temp.picList
          list.forEach((item, index) => {
            if (item.isGif == '1') {
              inx = index
              gif = item.gif
            }
          })
          break
        }
      }
      if (inx != -1) {
        var domObj = $('#swiper1 .part').eq(inx)
        setTimeout(() => {
          this.handleObj(domObj, gif)
          setInterval(() => {
            this.handleObj(domObj, gif)
          }, 10000)
        }, 2000)
      }

      //人气定投样式修改
      this.changeStyle()
    },
    //添加动态效果
    handleObj(domObj, gif) {
      domObj
        .find('img')
        .css('visibility', 'hidden')
        .end()
        .find('.special-img')
        .css({
          background:
            'url(' + gif + '?t=' + Date.now() + ') no-repeat left top',
          'background-size': '100% 100%',
        })
        .show()
      setTimeout(() => {
        domObj
          .find('img')
          .css('visibility', 'visible')
          .end()
          .find('.special-img')
          .css({
            background: 'none',
          })
          .hide()
      }, 1500)
    },
    changeStyle() {
      var dom = $('#hot-aip .prdt-code')
      dom.each(function() {
        var _w = $(this)
          .prev('.prdt-name')
          .innerWidth()
        $(this).css({ left: _w + 5 + 'px' })
      })
    },
    changeStyle2() {
      var dom2 = $('.hy-list .unit')
      dom2.each(function() {
        var _w = $(this).width()
        $(this).css({ right: -_w + 'px' })
      })

      var dom = $('.hy-list .yield'),
        v = dom
          .text()
          .trim()
          .split('.')[0]
      if (v.length >= 3) {
        //26-2=24
        dom.css('font-size', '6.4vw')
      }
    },
    createSwiper(selector, options) {
      return new window.Swiper(selector, options)
    },
    slideEnd() {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      //页面滚动时不触发点击
      if (this.isMoving) {
        this.isMoving = false
        return
      }
      this.swiper1.slideNext(0)
    },
    jzTabClk(inx) {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      //页面滚动时不触发点击
      if (this.isMoving) {
        this.isMoving = false
        return
      }
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf677',
        '1.0',
        '理财_基金定投|定投专区页面|基智定投区|目标止盈',
        'tab_name={' +
          (inx == 1 ? '目标止盈' : inx == 2 ? '定投行业' : '策略定投') +
          '}'
      )
      this.jzTab = inx
      this.$nextTick(() => {
        if (inx == 2) {
          this.changeStyle2()
        }
      })
    },
    touchstart(event) {
      this.lastX = event.touches[0].clientX
    },
    touchmove(event) {
      var x = event.touches[0].clientX
      var dom = $('#mbzy .bar'),
        left = parseFloat(dom.css('left')),
        newLeft = left + (x - this.lastX),
        //最大移动距离
        max = -(961 + 960 * this.dis)

      if (newLeft >= 0) {
        newLeft = 0
      } //4%-100%,96%对应960个区间:961+4*960
      else if (newLeft <= max) {
        newLeft = max
      }

      var absLeft = Math.abs(newLeft)

      //循环查找是否位于某个区间或者在刻度线上(一共960个区间)
      var tempI = this.getI(absLeft)
      this.tempI = tempI
      $('#mbzy .yield').html((4 + tempI * 0.1).toFixed(1) + '%')

      dom.css({ left: newLeft + 'px' })
      this.lastX = x
    },
    touchend(event) {
      //没有触发touchmove不计算
      if (this.tempI == -1) {
        return
      }
      var dom = $('#mbzy .bar'),
        left = parseFloat(dom.css('left')),
        absLeft = Math.abs(left)

      var newLeft = this.tempI * this.dis + this.tempI + 1
      //校正一下第一个区间的左边值
      if (this.tempI == 0) {
        newLeft = 0
      }
      dom.css({ left: -newLeft + 'px' })

      //滑动结束时设置目标盈收益率
      var _yield = parseFloat($('#mbzy .yield').html())
      this.choosePrdt.yield = _yield
    },
    //循环查找是否位于某个区间或者在刻度线上(一共960个区间)
    getI(absLeft) {
      var tempI = 0
      for (var i = 0; i < 960; i++) {
        var pix = this.dis * i + i + 1
        var pix2 = this.dis * (i + 1) + (i + 1) + 1
        if (absLeft == pix) {
          tempI = i
          break
        } else if (absLeft == pix2) {
          tempI = i + 1
          break
        } else if (pix < absLeft && absLeft < pix2) {
          if (pix2 - absLeft >= absLeft - pix) {
            tempI = i
          } else {
            tempI = i + 1
          }
          break
        }
      }
      return tempI
    },
    //梦想计划图片点击跳转
    mxjhClk(item, inx) {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      if (this.isMoving) {
        this.isMoving = false
        return
      }
      window.TalkingData.onHTSCEvent(
        'click',
        'leaf677',
        '1.0',
        '理财_基金定投|定投专区页面|梦想计划区|定投',
        'picid={}|picname={}|picurl={' + item.pic + '}|pos={' + (inx + 1) + '}'
      )
      base.href(item.link)
    },
    getWidth0(pe) {
      let w = 0
      if (pe == '1') {
        w = '70%'
      } else {
        w = '100%'
      }
      return w
    },
    getWidth(pe) {
      let w = 0
      if (pe == '1') {
        w = 0
      } else if (pe == '2') {
        w = '30%'
      } else if (pe == '3') {
        w = '80%'
      } else if (pe == '4' || pe == '5') {
        w = '100%'
      }
      return w
    },
    getWidth2(pe) {
      let w = 0
      if (['1', '2', '3'].indexOf(pe) != -1) {
        w = 0
      } else if (pe == '4') {
        w = '43%'
      } else if (pe == '5') {
        w = '100%'
      }
      return w
    },
    goback() {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.flag = true
        }, 300)
      } else {
        return
      }
      base.href('http://action:10002')
    },
  },
}
</script>

<style>
::-webkit-scrollbar {
  display: none;
}

#swiper2 .swiper-container-horizontal > .swiper-pagination-bullets {
  bottom: 6px;
  font-size: 0;
}
#swiper2
  .swiper-container-horizontal
  > .swiper-pagination-bullets
  .swiper-pagination-bullet {
  margin-right: 3px;
  margin-left: 0;
}
#swiper2 .swiper-pagination-bullet {
  width: 3px;
  height: 3px;
  background: #5176e1;
  border-radius: 1.5px;
  opacity: 0.25;
}
#swiper2 .swiper-pagination-bullet-active {
  width: 5px;
  opacity: 1;
}

#nice-fund .swiper-container-horizontal > .swiper-pagination-bullets {
  bottom: 20px;
  font-size: 0;
}
#nice-fund .swiper-pagination-bullet {
  width: 4px;
  height: 4px;
  background: #d8d8d8;
  border-radius: 2.5px;
  opacity: 1;
}
#nice-fund .swiper-pagination-bullet-active {
  width: 9px;
  background: #5176e1;
  opacity: 0.8;
}
#nice-fund
  .swiper-container-horizontal
  > .swiper-pagination-bullets
  .swiper-pagination-bullet {
  margin-right: 4px;
  margin-left: 0;
}
</style>
<style scoped>
* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  -webkit-user-select: none;
  -webkit-text-size-adjust: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}
*::before,
*::after {
  box-sizing: border-box;
}
.none {
  display: none !important;
}

#wrapper {
  position: absolute;
  z-index: 1;
  top: 64px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: auto;
}

#scroller {
  position: absolute;
  z-index: 1;
  /*  -webkit-touch-callout:none;*/
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  width: 100%;
  padding: 0;
}
#nice-fund .title-left {
  width: 117px;
  height: 36px;
  position: absolute;
  left: 0;
  top: 0;
}
#nice-fund .title-right {
  width: 218px;
  height: 36px;
  position: absolute;
  left: 117px;
  top: 0;
}

#swiper1 {
  position: relative;
}
#swiper1 .part {
  position: relative;
}
#swiper1 .arrow {
  position: absolute;
  top: 32px;
  right: 0;
  width: 27px;
  height: 33px;
  background: url(../assets/arrow.png) no-repeat center;
  background-size: 7px 11px;
}
#swiper1 .swiper-container {
  padding-top: 29px;
  margin-right: 20px;
  margin-left: 23px;
}
#swiper1 .swiper-slide {
  width: auto !important;
  margin-left: 25px;
}
#swiper1 .swiper-slide:nth-child(4) {
  margin-left: 26px;
}
#swiper1 .swiper-slide:nth-child(1) {
  margin-left: 0;
}
#swiper1 .swiper-slide:nth-child(3) {
  margin-left: 26px;
}
#swiper1 .special-img {
  position: absolute;
  width: 38px;
  height: 38px;
  top: -6px;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  display: none;
}
#prdt-choose {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}
#prdt-choose .detail {
  position: absolute;
  top: 22px;
  right: 0;
  width: 26px;
  height: 18px;
  font-family: PingFangSC-Light;
  font-size: 13px;
  line-height: 18px;
  color: #969eb6;
}
#prdt-choose li {
  position: relative;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 5px;
}
#prdt-choose li:not(:last-child)::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  content: '';
  background-color: #f2f2f2;
  -webkit-transform: scale(1, 0.5);
  transform: scale(1, 0.5);
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
}
#prdt-choose .circle {
  position: absolute;
  top: 32px;
  left: 5px;
  width: 20px;
  height: 20px;
  background: url(../assets/unchoose.png) no-repeat center;
  background-size: 100% 100%;
}
#prdt-choose .circle.choosed {
  background: url(../assets/choose.png) no-repeat center;
  background-size: 100% 100%;
}
#prdt-choose li:last-child {
  padding-bottom: 44px;
}
#prdt-choose .prdt-name {
  padding-left: 40px;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  line-height: 22px;
  color: #323232;
}
#prdt-choose .yield-area {
  padding-left: 40px;
  margin-top: 7px;
  font-size: 0;
}
#prdt-choose .yield-desc {
  display: inline-block;
  font-family: PingFangSC-Light;
  font-size: 13px;
  line-height: 18px;
  color: #999999;
}
#prdt-choose .yield {
  display: inline-block;
  margin-left: 10px;
  font-family: Helvetica;
  font-size: 15px;
  line-height: 20px;
  color: #fc3438;
  letter-spacing: 0;
}
#prdt-choose ul {
  margin: 0 20px;
}
#prdt-choose .header {
  position: relative;
  text-align: center;
  background-color: #f8f9fd;
}
#prdt-choose .titlec {
  display: inline-block;
  padding: 18px 0;
  font-family: PingFangSC-Regular;
  font-size: 17px;
  line-height: 24px;
  color: #323232;
}
#prdt-choose .btn {
  position: absolute;
  top: 50%;
  right: 20px;
  height: 20px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  line-height: 20px;
  color: #323232;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
}
#prdt-choose .cancel {
  position: absolute;
  top: 50%;
  left: 20px;
  height: 20px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  line-height: 20px;
  color: #999999;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
}
#prdt-choose .dialog {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
}

#mbzy .box {
  position: relative;
  /* 39+47=86 */
  height: 86px;
}
#mbzy .bar-wrapper {
  position: relative;
  height: 100%;
  margin-right: 9px;
  margin-left: 9px;
  overflow-x: hidden;
}
#mbzy .touch-area {
  position: absolute;
  bottom: 0;
  left: -1px;
  z-index: 3;
  width: 100.5%;
  height: 100%;
}
#mbzy .bg-div {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 47px;
  background: -webkit-linear-gradient(
    left,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.8)
  );
}
#mbzy .bar-wrapper2 {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
}
#mbzy .bar {
  position: absolute;

  /* 一开始定位到10%,4%到10%之间,每1%是10个格子,11个竖线 */

  /* 6%就是60个区间,61个竖线,60*3+61=241px */
  left: -241px;
  height: 46px;
  bottom: 0;
  white-space: nowrap;
}
#mbzy .scale-v {
  position: absolute;
  bottom: -18px;
  left: 50%;
  font-family: PingFangSC-Regular;
  font-size: 13px;
  line-height: 18px;
  color: #333333;
  letter-spacing: 0;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}
#mbzy .scale-v.special {
  margin-left: 5px;
}
#mbzy .scales.ignore {
  position: relative;
  display: inline-block;
  width: 1px;
  height: 8px;
  margin-left: 3px;
  vertical-align: top;
  background-color: #e0e0e0;
}
#mbzy .scales.special {
  margin-left: 0;
}
#mbzy .scales.big {
  height: 14px;
}
#mbzy .scales.mid {
  height: 12px;
}
#mbzy .prdt-area {
  position: relative;
  padding: 9px 0;
  margin: 0 15px;
  font-size: 0;
}
#mbzy .st-aip {
  width: 167px;
  height: 42px;
  margin: 17px auto 0 auto;
  line-height: 42px;
  text-align: center;
  background: #5176e1;
  border-radius: 21px;
  position: relative;
  z-index: 3;
  box-shadow: 0px 3px 11px rgba(81, 118, 225, 0.2);
}
#mbzy .st-aip > span {
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  line-height: 20px;
  color: #ffffff;
  letter-spacing: 0;
}
#mbzy .prdt-area::after {
  position: absolute;
  top: 50%;
  right: 9px;
  width: 6px;
  height: 8px;
  content: '';
  background: url(../assets/more.png) no-repeat center;
  background-size: 100% 100%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
}
#mbzy .prdt-area::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  content: '';
  border: 1px solid rgba(163, 163, 163, 0.24);
  border-radius: 8px;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
#mbzy .prdt-name {
  display: inline-block;
  height: 20px;
  padding-left: 10px;
  font-family: PingFangSC-Light;
  font-size: 14px;
  line-height: 20px;
  color: #666666;
  letter-spacing: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 94%;
}
#mbzy .pointer {
  position: absolute;
  top: 8px;
  left: 50%;
  z-index: 2;
  width: 6px;
  height: 39px;
  background: url(../assets/pointer2.png) no-repeat center;
  background-size: 100% 100%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}
#mbzy .box .shadow {
  position: absolute;
  top: -12px;
  left: 50%;
  width: 317px;
  height: 51px;
  background: url(../assets/shadow.png) no-repeat center;
  background-size: 100%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}

#footer {
  padding-top: 14px;
  padding-right: 20px;
  padding-bottom: 40px;
  padding-left: 20px;
}
#footer .announce {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  line-height: 17px;
  color: #bcbcbc;
  text-align: justify;
}
#footer .tip {
  margin-top: 38px;
  font-size: 0;
  text-align: center;
}
#footer .tip span {
  display: inline-block;
  vertical-align: middle;
}
#footer .left {
  width: 46px;
  height: 1px;
  background: url(../assets/left.png) no-repeat left top;
  background-size: 100% 100%;
}
#footer .right {
  width: 46px;
  height: 1px;
  background: url(../assets/right.png) no-repeat left top;
  background-size: 100% 100%;
}
#footer .risk {
  margin: 0 8.5px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  line-height: 17px;
  color: #bcbcbc;
}

#intel-calc {
  padding-right: 19px;
  padding-bottom: 24px;
  padding-left: 19px;
  margin-top: 10px;
  background-color: #fff;
}
#intel-calc .content {
  padding-bottom: 32px;
  background: url(../assets/bg2.png) no-repeat center;
  background-size: 100% 100%;
}
#intel-calc .calc-btn {
  height: 45px;
  margin-right: 15px;
  margin-left: 15px;
  line-height: 45px;
  text-align: center;
  background: #5176e1;
  border-radius: 22.5px;
  box-shadow: 0px 3px 11px rgba(81, 118, 225, 0.2);
}
#intel-calc .calc-btn span {
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 17px;
  line-height: 14px;
  color: #ffffff;
}
#intel-calc .value {
  position: absolute;
  top: 50%;
  right: 0;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  line-height: 22px;
  color: #666666;
  letter-spacing: 0;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
}
#intel-calc .arrow {
  position: absolute;
  top: 50%;
  right: 0;
  width: 6px;
  height: 11px;
  background: url(../assets/arrow2.png) no-repeat center;
  background-size: 100% 100%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
}
#intel-calc .item-list {
  padding-bottom: 10px;
  margin-right: 16px;
  margin-left: 21px;
}
#intel-calc li {
  position: relative;
  padding: 18px 0;
}
#intel-calc li::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  content: '';
  background-color: rgba(223, 223, 223, 0.7);
  -webkit-transform: scale(1, 0.5);
  transform: scale(1, 0.5);
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
}
#intel-calc .item-name {
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 17px;
  line-height: 24px;
  color: #323232;
  letter-spacing: 0;
  padding-left: 1px;
}
#intel-calc .top-arrow {
  position: absolute;
  right: 16px;
  bottom: 25px;
  width: 6px;
  height: 11px;
  background: url(../assets/arrow2.png) no-repeat center;
  background-size: 100% 100%;
}
#intel-calc .hot {
  position: absolute;
  right: 16px;
  bottom: 21px;
  width: 37px;
  height: 19px;
  background: url(../assets/hot2.png) no-repeat center;
  background-size: 100% 100%;
}
#intel-calc .name-area {
  position: relative;
  padding-top: 24px;
  padding-bottom: 18px;
  font-size: 0;
}
#intel-calc .prdt-name {
  display: inline-block;
  padding-left: 22px;
  font-family: PingFangSC-Regular;
  font-size: 17px;
  line-height: 24px;
  color: #323232;
  letter-spacing: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 79%;
}
#intel-calc .title-area {
  padding-top: 24px;
  padding-bottom: 14px;
}
#intel-calc .title-area .name {
  display: inline-block;
  font-family: PingFangSC-Medium;
  font-size: 17px;
  line-height: 18px;
  color: #323232;
  letter-spacing: 0;
}

#mxjh {
  padding-bottom: 34px;
  margin-top: 10px;
  background-color: #fff;
}
#mxjh .titlec {
  position: absolute;
  bottom: 32px;
  left: 12px;
  font-family: PingFangSC-Medium;
  font-size: 20px;
  line-height: 31px;
  color: #ffffff;
  text-shadow: 3px 2px 5px rgba(65, 80, 85, 0.22);
  letter-spacing: 0.18px;
}
#mxjh .detail {
  position: absolute;
  bottom: 14px;
  left: 12px;
  font-family: PingFangSC-Light;
  font-size: 13px;
  line-height: 17px;
  color: #ffffff;
  text-align: justify;
  text-shadow: 2px 2px 3px rgba(141, 141, 141, 0.63);
}
#mxjh .swiper-container {
  margin-left: 20px;
}
#mxjh .swiper-slide {
  width: auto;
}
#mxjh .swiper-slide:not(:first-child) {
  margin-left: 10px;
}
#mxjh .slide-content {
  position: relative;
  width: 159px;
  height: 184px;
}
#mxjh .title-area {
  padding-top: 24px;
  padding-bottom: 14px;
  padding-left: 20px;
  font-size: 0;
}
#mxjh .title-area .name {
  display: inline-block;
  font-family: PingFangSC-Medium;
  font-size: 17px;
  line-height: 18px;
  color: #323232;
  letter-spacing: 0;
}

#index-aip {
  padding-bottom: 25px;
  margin-top: 10px;
  background-color: #fff;
}
#index-aip .dingtou {
  position: absolute;
  right: 0;
  bottom: 14px;
  width: 78px;
  height: 30px;
  text-align: center;
  background: #5176e1;
  border-radius: 14.5px;
  box-shadow: 2px 2px 4px 0 rgba(86, 151, 254, 0.23);
}
#index-aip .dingtou span {
  white-space: nowrap;
  font-size: 14px;
  line-height: 14px;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  font-family: PingFangSC-Light;
  color: #ffffff;
  letter-spacing: 0;
}
#index-aip .pro {
  position: absolute;
  top: 50%;
  left: 0;
  height: 8px;
  background: #5176e1;
  box-shadow: 2px 1px 4px 0 rgba(81, 118, 225, 0.19);
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
}
#index-aip .progress1 {
  border-radius: 100px 0 0 100px;
}
#index-aip .progress2 {
  width: 0;
}
#index-aip .progress3 {
  width: 0;
}
#index-aip .progress3.all {
  border-radius: 0 100px 100px 0;
}
#index-aip .prdt-list {
  padding-bottom: 11px;
  margin-top: 46px;
  margin-right: 21.5px;
  margin-left: 21.5px;
}
#index-aip .prdt-list li {
  position: relative;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 0;
}
#index-aip .prdt-list li:first-child {
  padding-top: 0;
}
#index-aip .prdt-list li:not(:last-child)::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  content: '';
  background: url(../assets/line.png) no-repeat center;
  background-size: 100% 100%;
}
#index-aip .prdt-list .prdt-name {
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  line-height: 18px;
  color: #4a4a4a;
  letter-spacing: 0;
}
#index-aip .total {
  position: relative;
  margin-top: 11px;
  margin-left: 19.5px;
  font-size: 0;
}
#index-aip .total .g-name {
  position: absolute;
  font-family: PingFangSC-Light;
  font-size: 12px;
  line-height: 17px;
  color: #9b9b9b;
  letter-spacing: 0;
}
#index-aip .section1 .g-name {
  top: 12px;
  left: 0;
}
#index-aip .section2 .g-name {
  top: 12px;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}
#index-aip .section3 .g-name {
  top: 12px;
  right: 0;
}
#index-aip .total .g-name.curr {
  font-family: PingFangSC-Regular;
  color: #5176e1;
}
#index-aip .total .sec {
  position: relative;
  display: inline-block;
  height: 6px;
  background: #e3e9ff;
}
#index-aip .total .section1 {
  width: 62px;
  border-radius: 2px 0 0 2px;
}
#index-aip .total .section2 {
  width: 124px;
  margin-left: 3px;
}
#index-aip .total .section3 {
  width: 103px;
  margin-left: 3px;
  border-radius: 0 2px 2px 0;
}
#index-aip .zd-buy {
  width: 53px;
  height: 16px;
  margin-top: 14px;
  margin-left: 36.5px;
  background: url(../assets/buy.png) no-repeat center;
  background-size: 100% 100%;
}
#index-aip .index-name {
  padding-left: 20.5px;
  font-family: PingFangSC-Medium;
  font-size: 18px;
  line-height: 25px;
  color: #3a3a3a;
  letter-spacing: 0;
}
.android #index-aip .index-name {
  font-weight: bold;
}
#index-aip .detail {
  padding-left: 19.5px;
  margin-top: 7px;
  font-size: 0;
}
#index-aip .detail span {
  padding-right: 10px;
  font-family: PingFangSC-Light;
  font-size: 14px;
  line-height: 20px;
  color: #999999;
  letter-spacing: 0;
  background: url(../assets/more.png) no-repeat right center;
  background-size: 6px 8px;
}
#index-aip .content {
  padding-top: 30px;
  margin-top: 14px;
  margin-right: 20px;
  margin-left: 20px;
  background: url(../assets/chart-bg.png) no-repeat left top;
  background-size: 100%;
}
#index-aip .titlea {
  padding-top: 24px;
  padding-left: 20px;
  font-family: PingFangSC-Medium;
  font-size: 17px;
  line-height: 18px;
  color: #323232;
  letter-spacing: 0;
}
#index-aip .top-area {
  position: relative;
}
#index-aip .go-index {
  position: absolute;
  top: 24px;
  right: 0;
  padding-right: 20px;
  font-size: 0;
}
#index-aip .go-index span {
  display: inline-block;
  padding-right: 13px;
  font-family: PingFangSC-Light;
  font-size: 13px;
  line-height: 18px;
  color: #a7a9b4;
  letter-spacing: 0;
  background: url(../assets/arrow.png) no-repeat right center;
  background-size: 7px 11px;
}

#cldt {
  padding-bottom: 25px;
}
#cldt .int-aip {
  width: 167px;
  height: 42px;
  margin: 1px auto 0 auto;
  line-height: 42px;
  text-align: center;
  background: #5176e1;
  border-radius: 21px;
}
#cldt .int-aip span {
  font-family: PingFangSC-Regular;
  font-size: 15px;
  line-height: 20px;
  color: #ffffff;
  letter-spacing: 0;
}
#cldt .chart {
  width: 288px;
  height: 128px;
  margin-top: 18px;
  margin-left: 29px;
  background: url(../assets/chart.png) no-repeat left top;
  background-size: 100% 100%;
}
#cldt .titlea {
  padding-left: 20.5px;
  font-family: PingFangSC-Medium;
  font-size: 18px;
  line-height: 20px;
  color: #4a4a4a;
  letter-spacing: 0;
}
#cldt .detail {
  padding-left: 20.5px;
  margin-top: 7px;
  font-family: PingFangSC-Light;
  font-size: 14px;
  line-height: 20px;
  color: #999999;
  letter-spacing: 0;
}
#cldt .content {
  position: relative;
  width: 335px;
  height: 285px;
}

#dthy {
  padding-bottom: 25px;
}
#dthy .left {
  position: absolute;
  left: 0;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
}
#dthy .right {
  padding-left: 105px;
  white-space: normal;
  text-align: justify;
}
#dthy .main {
  white-space: nowrap;
  position: relative;
}
#dthy li {
  position: relative;
  padding: 26px 25px;
}
#dthy li:first-child {
  padding-top: 30px;
}
#dthy li:not(:last-child)::after {
  position: absolute;
  bottom: 0;
  left: 25px;
  width: 285px;
  height: 1px;
  content: '';
  background-color: rgba(220, 220, 220, 0.55);
  -webkit-transform: scale(1, 0.5);
  transform: scale(1, 0.5);
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
}
#dthy .yield-area {
  font-size: 0;
  position: relative;
  display: inline-block;
}
#dthy .yield {
  font-family: PingFangSC-Medium;
  font-size: 26px;
  color: #ed5742;
  letter-spacing: 0;
  line-height: 20px;
  display: inline-block;
}
#dthy .unit {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  line-height: 14px;
  color: #ed5742;
  letter-spacing: 0;
  position: absolute;
  bottom: -1px;
  right: -14px;
}
#dthy .yield-desc {
  margin-top: 2px;
  font-family: PingFangSC-Light;
  font-size: 12px;
  line-height: 17px;
  color: #9b9b9b;
  text-align: left;
  letter-spacing: 0;
}
#dthy .hy-name {
  font-family: PingFangSC-Regular;
  font-size: 18px;
  line-height: 20px;
  color: #323232;
  letter-spacing: 0;
  word-break: break-all;
}
#dthy .hy-detail {
  margin-top: 10px;
  font-family: PingFangSC-Light;
  font-size: 13px;
  line-height: 18px;
  color: #9b9b9b;
  letter-spacing: 0;
  word-break: break-all;
}
#dthy .content {
  position: relative;
  padding-top: 26px;
  padding-bottom: 12px;
}
#dthy .content::before,
#cldt .content::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  content: '';
  border: 1px solid rgba(215, 222, 241, 0.6);
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgba(155, 155, 155, 0.18);
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
#dthy .titlea {
  padding-left: 20.5px;
  font-family: PingFangSC-Medium;
  font-size: 18px;
  line-height: 20px;
  color: #4a4a4a;
  letter-spacing: 0;
}
.android #dthy .titlea {
  font-weight: bold;
}
#dthy .detail {
  padding-left: 20.5px;
  margin-top: 7px;
  font-family: PingFangSC-Light;
  font-size: 14px;
  line-height: 20px;
  color: #999999;
  letter-spacing: 0;
}
#mbzy {
  position: relative;
  padding-bottom: 24px;
}
#mbzy .content {
  position: relative;
  padding-top: 26px;
  padding-bottom: 19px;
}
#mbzy .content::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  content: '';
  border: 1px solid rgba(215, 222, 241, 0.6);
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgba(155, 155, 155, 0.18);
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
#mbzy .yield {
  position: relative;
  z-index: 10;
  margin-top: 17px;
  font-family: PingFangSC-Semibold;
  font-size: 33px;
  line-height: 46px;
  color: #ed5742;
  text-align: center;
  letter-spacing: 0;
}
#mbzy .titlea {
  height: 20px;
  padding-left: 20px;
  font-family: PingFangSC-Medium;
  font-size: 18px;
  line-height: 20px;
  color: #4a4a4a;
  letter-spacing: 0;
}
.android #mbzy .titlea {
  font-weight: bold;
}
#mbzy .detail {
  height: 20px;
  padding-left: 20px;
  margin-top: 7px;
  font-family: PingFangSC-Light;
  font-size: 14px;
  line-height: 20px;
  color: #999999;
  letter-spacing: 0;
}
#jz-aip {
  margin-top: 10px;
  background-color: #fff;
}
#jz-aip .bottom-area {
  padding: 0 20px;
  margin-top: 19px;
}
#jz-aip .tabs {
  padding-left: 20px;
}
#jz-aip .tabs::after {
  display: block;
  width: 100%;
  height: 0;
  clear: both;
  content: '';
}
#jz-aip .tabs .tab {
  position: relative;
  float: left;
  width: 82px;
  height: 30px;
  margin-left: 10px;
  font-family: PingFangSC-Regular;
  font-size: 0;
  color: #6a6a6a;
  text-align: center;
  letter-spacing: 0;
}
#jz-aip .tab .text {
  white-space: nowrap;
  font-size: 14px;
  line-height: 14px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
#jz-aip .tabs .tab:first-child {
  margin-left: 0;
}
#jz-aip .tabs .tab.active {
  color: #ffffff;
  background: #5176e1;
  border-radius: 15px;
}
#jz-aip .tabs .tab::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  content: '';
  border: 1px solid #e4e4e4;
  border-radius: 30px;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
#jz-aip .tabs .tab.active::before {
  display: none;
}

#hot-aip {
  margin-top: 10px;
  background-color: #fff;
}
#hot-aip .count {
  font-family: PingFangSC-Regular;
  font-size: 19px;
  line-height: 20px;
  color: #4a4a4a;
  letter-spacing: 0;
}
#hot-aip .count-desc {
  font-family: PingFangSC-Light;
  font-size: 12px;
  line-height: 17px;
  color: #9b9b9b;
  letter-spacing: 0;
}
#hot-aip .unit2 {
  font-family: PingFangSC-Semibold;
  font-size: 12px;
  color: #4a4a4a;
  letter-spacing: 0;
  opacity: 0.95;
}
#hot-aip .yield-area {
  position: absolute;
  top: -28px;
  left: 0;
}
#hot-aip .yield-desc {
  font-family: PingFangSC-Light;
  font-size: 12px;
  line-height: 17px;
  color: #9b9b9b;
  letter-spacing: 0;
}
#hot-aip .yield {
  font-family: PingFangSC-Medium;
  font-size: 23px;
  line-height: 20px;
  color: #ed5742;
  letter-spacing: 0;
}
#hot-aip .yield.special,
#hot-aip .unit.special {
  color: #5e9f3b;
}
#hot-aip .unit {
  font-family: PingFangSC-Medium;
  font-size: 12px;
  line-height: 20px;
  color: #ed5742;
  letter-spacing: 0;
}
#hot-aip .content-div {
  padding-top: 20px;
  height: 65px;
  position: relative;
}
#hot-aip .content-div::before {
  content: '';
  width: 1px;
  height: 40px;
  background-color: #f2f2f2;
  position: absolute;
  left: 152px;
  top: 21px;
  -webkit-transform-origin: 50% 0;
  transform-origin: 50% 0;
  -webkit-transform: scale(0.5, 1);
  transform: scale(0.5, 1);
}
#hot-aip .content-div .left {
  position: absolute;
  left: 26px;
  bottom: 0;
}
#hot-aip .content-div .right {
  position: absolute;
  bottom: 0;
  right: 70px;
}
#hot-aip .count-area {
  position: absolute;
  top: -28px;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  white-space: nowrap;
}
#hot-aip li .prdt-name::before {
  content: '';
  width: 32px;
  height: 15px;
  box-shadow: 2px 1px 4px 0 rgba(246, 72, 67, 0.18);
  position: absolute;
  left: 0;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
}
#hot-aip li:nth-child(1) .prdt-name::before {
  background: url(../assets/r1.png) no-repeat center;
  background-size: 100% 100%;
}
#hot-aip li:nth-child(2) .prdt-name::before {
  background: url(../assets/r2.png) no-repeat center;
  background-size: 100% 100%;
}
#hot-aip li:nth-child(3) .prdt-name::before {
  background: url(../assets/r3.png) no-repeat center;
  background-size: 100% 100%;
}
#hot-aip .name-area {
  position: relative;
  font-size: 0;
}
#hot-aip .prdt-name {
  max-width: 258px;
  padding-left: 42px;
  overflow: hidden;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  line-height: 20px;
  color: #323232;
  text-overflow: ellipsis;
  letter-spacing: 0;
  white-space: nowrap;
  display: inline-block;
  position: relative;
}
#hot-aip .prdt-code {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  line-height: 14px;
  color: #c5c5c5;
  letter-spacing: 0;
  position: absolute;
  bottom: 0;
}
#hot-aip .prdt-list {
  padding-bottom: 20px;
  margin-top: 22px;
}
#hot-aip li {
  position: relative;
  padding-left: 33px;
}
#hot-aip li:not(:first-child) {
  padding-top: 22.5px;
}
#hot-aip li:not(:first-child)::before {
  position: absolute;
  top: 0;
  left: 33px;
  width: 309px;
  height: 1px;
  content: '';
  background-color: #f2f2f2;
  -webkit-transform: scale(1, 0.5);
  transform: scale(1, 0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
#hot-aip li:not(:last-child) {
  padding-bottom: 17.5px;
}
#hot-aip .top {
  height: 43px;
  margin: 0 20px;
  line-height: 43px;
  text-align: center;
  background: url(../assets/rect.png) no-repeat left top;
  background-size: 100% 100%;
}
#hot-aip .top span {
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  line-height: 20px;
  color: #323232;
  letter-spacing: 0;
}
#nice-fund .swiper-bottom {
  height: 36px;
}
#nice-fund .special .swiper-bottom {
  height: 37px;
}
#nice-fund .start-aip {
  width: 154px;
  height: 42px;
  margin: 20px auto 0 auto;
  line-height: 42px;
  text-align: center;
  background: #5176e1;
  border-radius: 21px;
  box-shadow: 0px 3px 11px rgba(81, 118, 225, 0.2);
}
#nice-fund .start-aip span {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0;
}
#nice-fund .yield-desc {
  padding-top: 11px;
  font-family: PingFangSC-Light;
  font-size: 12px;
  line-height: 10px;
  color: #9b9b9b;
  text-align: center;
  letter-spacing: 0;
}
#nice-fund .yield-area {
  padding-top: 18px;
  font-size: 0;
  text-align: center;
}
#nice-fund .yield {
  font-family: PingFangSC-Medium;
  font-size: 31px;
  line-height: 24px;
  color: #f64843;
  letter-spacing: 0;
  display: inline-block;
  position: relative;
}
#nice-fund .yield.special,
#nice-fund .unit.special {
  color: #5e9f3b;
}
#nice-fund .unit {
  font-family: PingFangSC-Medium;
  font-size: 19px;
  line-height: 19px;
  color: #f64843;
  letter-spacing: 0;
  position: absolute;
  bottom: 0;
  right: -19.2px;
}
#nice-fund .prdt-name {
  padding-top: 59px;
  padding-left: 10px;
  padding-right: 10px;
  font-family: PingFangSC-Regular;
  font-size: 19px;
  line-height: 26px;
  color: #323232;
  text-align: center;
  letter-spacing: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#nice-fund .slide-content {
  margin: 0 19px;
  padding-top: 15px;
}
#nice-fund .slide-content.special {
  margin: 0;
  padding-top: 16px;
}
#nice-fund .special .swiper-top {
  height: 230px;
}
#nice-fund .swiper-top {
  position: relative;
  height: 232px;
  background: url(../assets/nice-fund.png) no-repeat left top;
  background-size: 100% 100%;
}
#nice-fund .tag1 {
  position: absolute;
  top: 10px;
  left: 50%;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  line-height: 16px;
  color: #4a4a4a;
  letter-spacing: 0;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  white-space: nowrap;
}
#nice-fund .tag2 {
  position: absolute;
  top: 10px;
  left: 50%;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  line-height: 16px;
  color: #5176e1;
  text-align: center;
  letter-spacing: 0;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  white-space: nowrap;
}
#aip-home {
  text-align: left;
}
#header-area {
  position: relative;
  height: 64px;
  background-color: #fff;
}
.android #header-area {
  height: 44px;
}
.iphoneX #header-area {
  height: 88px;
}
#header-area .back-img {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 39px;
  height: 42px;
  background: url(../assets/back.png) no-repeat 14px 10px;
  background-size: 11px 19px;
}
#header-area .header-title {
  position: absolute;
  bottom: 13px;
  left: 50%;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  letter-spacing: 0.55px;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}
.android #header-area .header-title {
  bottom: 50%;
  -webkit-transform: translate(-50%, 50%);
  transform: translate(-50%, 50%);
}
#content {
  overflow-x: hidden;
  background-color: #f7f8fa;
}
#top-word {
  position: relative;
  height: 131px;
}
#top-word.pic0 {
  background: url(../assets/pic1.png) no-repeat left top;
  background-size: 100% 100%;
}
#top-word.pic1 {
  background: url(../assets/pic2.png) no-repeat left top;
  background-size: 100% 100%;
}
#top-word.pic2 {
  background: url(../assets/pic3.png) no-repeat left top;
  background-size: 100% 100%;
}
#top-word.pic3 {
  background: url(../assets/pic4.png) no-repeat left top;
  background-size: 100% 100%;
}
#top-word.pic4 {
  background: url(../assets/pic5.png) no-repeat left top;
  background-size: 100% 100%;
}
#top-word.pic5 {
  background: url(../assets/pic6.png) no-repeat left top;
  background-size: 100% 100%;
}
#top-word.pic6 {
  background: url(../assets/pic7.png) no-repeat left top;
  background-size: 100% 100%;
}
#banner-area {
  background-color: #fff;
}
#swiper1 img {
  display: block;
  margin: 0 auto;
}
#banner-area .part1 img {
  width: 31px;
  height: 26px;
}
#banner-area .part1 .name {
  margin-top: 9px;
}
#banner-area .part2 img {
  width: 25px;
  height: 27px;
}
#banner-area .part2 .name {
  margin-top: 8px;
}
#banner-area .part3 img {
  width: 25px;
  height: 25px;
}
#banner-area .part3 .name {
  margin-top: 10px;
}
#banner-area .part4 img {
  width: 28px;
  height: 27px;
}
#banner-area .part4 .name {
  margin-top: 8px;
}
#swiper1 .name {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  line-height: 20px;
}
#banner-area .new::before {
  position: absolute;
  top: -13px;
  right: -12px;
  width: 41px;
  height: 23px;
  content: '';
  background: url(../assets/new.png) no-repeat center;
  background-size: 100% 100%;
}
#swiper2 {
  padding-top: 26px;
  padding-bottom: 24px;
  background-color: #fff;
}
#swiper2 .swiper-container {
  height: 60px;
  background-color: #fff;
}
#swiper2 .slide-content {
  width: 335px;
  height: 100%;
  background: url(../assets/bg.png) no-repeat left top;
  background-size: 100% 100%;
  margin: 0 20px;
}
#nice-fund {
  margin-top: 10px;
  background-color: #fff;
}
#nice-fund .title-area,
#hot-aip .title-area,
#jz-aip .title-area {
  position: relative;
  padding-top: 24px;
  padding-bottom: 16px;
  padding-left: 20px;
  font-size: 0;
}
#nice-fund .title-area {
  padding-bottom: 0;
}
#nice-fund .title-area .arrow {
  position: absolute;
  right: 20px;
  bottom: 19px;
  width: 7px;
  height: 11px;
  content: '';
}
#hot-aip .title-area::after {
  position: absolute;
  right: 20px;
  bottom: 19px;
  width: 7px;
  height: 11px;
  content: '';
  background: url(../assets/arrow.png) no-repeat center;
  background-size: 100% 100%;
}
#nice-fund .title-area .name,
#hot-aip .title-area .name,
#jz-aip .title-area .name {
  display: inline-block;
  font-family: PingFangSC-Medium;
  font-size: 17px;
  line-height: 18px;
  color: #323232;
  letter-spacing: 0;
}
#nice-fund .title-area .name {
  display: block;
  margin-right: 20px;
}
#nice-fund .title-area .name.hasmore {
  background: url(../assets/arrow.png) no-repeat right center;
  background-size: 7px 11px;
}
</style>
