<template>
    <div class="bulletin-board" v-show="listBoard.length" :style="setStyle">
        <div class="bulletin-board-horn"></div>
        <div class="swiper-container" id="mySwiper" v-if="listBoard.length > 1">
            <div class="swiper-wrapper">
                <div class="swiper-slide bulletin-board-item"
                    v-for="(board, index) in listBoard" :key="index"
                    :data-index="index">
                    <span>{{board.title}}</span>
                    <img src="./images/aip-detail7.png" alt="" v-if="board.next" class="next" />
                    <img src="./images/cancel.png" alt="" v-if="board.close"  class="cancel bulletin-board-close" />
                </div>
            </div>
        </div>
        <div class="swiper-container" v-if="listBoard.length === 1" @click="nextTo">
            <div class="swiper-slide bulletin-board-item" v-for="(item, index) in listBoard" :key="index">
                <span>{{item.title}}</span>
                <img src="./images/aip-detail7.png" alt="" v-if="item.next" class="next" />
                <img src="./images/cancel.png" alt="" v-if="item.close"  class="cancel" @click.stop="cancel" />
            </div>
        </div>
  </div>
</template>

<script>
import base from 'base';
import loadScripts from '@/utils/loadScripts';

export default {
  name: 'bulletinBoard',
  data() {
      return {
        timer: null,
        listBoard: [],
        swiper: null,
        boardHeight: -1,
      }
  },
  mounted() {
    this.$nextTick(() => {
      if (base.isAndroid()) {
        $('.bulletin-board').addClass("android");
      }
    })    
  },
  methods: {
    swiperInit(listBoard) {
        this.listBoard  = listBoard;
        const _list = JSON.parse(JSON.stringify(listBoard));
        const th = this;
        let len = this.listBoard.length;
        if (th.swiper && th.swiper.destroy) {
          th.swiper.destroy(true);
        }
        if (len < 2) return;

        loadScripts([
          '/common/vendor/swiper-5.4/swiper.min.js',
          '/common/scripts/file.js',
        ]).then(() => {
         
          th.swiper = new window.Swiper('#mySwiper', {
            direction: 'vertical',
            loop: true,
            speed:1000,
            autoplay: {
              delay: 3000,
              disableOnInteraction: false,
            },
            on: {
              touchStart(e) {
                this.autoplay.stop();
              },
              touchEnd(e) {
                this.autoplay.start()
              },
              tap(e) {
                // 关闭
                const className = e.target.className;
                if (className.indexOf('bulletin-board-close') > 0) {
                    this.removeSlide(this.realIndex)
                    _list.splice(this.realIndex , 1)
                    if (_list.length === 1) {
                      th.swiper.destroy(true);
                      th.listBoard = _list;
                      console.log(th.listBoard)
                      return;
                    }
                    this.updateSlides();
                    len --;
                    if (len > 1) {
                        this.autoplay.start();
                    }
                    if (len === 0) {
                        th.boardHeight = 0;
                    } 
                    return
                }
                // 跳转
                const isParent = className.indexOf('bulletin-board-item') > 0;
                const {index} = isParent ? e.target.dataset : e.target.parentElement.dataset;
                th.$emit('bulletinBoardTap', index)
              }
            }
          })
        })
    },
    cancel() {
      this.boardHeight = 0
    },
    nextTo(url) {
      this.$emit('bulletinBoardTap', 0)
    },
  },
  computed: {
    setStyle() {
      if (this.boardHeight == 0) {
        return  {
          height: '0px'
        }
      }
      return  {};
    }
  }
}
</script>

<style lang="less" scoped>
.bulletin-board {
  width: 375px;
  height: 36px;
  padding-left: 18px;
  overflow: hidden;
  background-color: #fef8eb;
  transition: height 0.3s;

  .bulletin-board-horn {
    float: left;
    width: 18px;
    height: 18px;
    background: url('./images/warning.png') no-repeat center;
    background-size: 100% 100%;
    margin-top: 10px;
  }

  .swiper-container {
    float: left;
  }
}
</style>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

#mySwiper {
  width: 332px;
  height: 36px;
  overflow: hidden;
}

.android.bulletin-board {
  .bulletin-board-item {
    span {
      padding-top:14px;
      line-height: 14px;
      padding-bottom: 11px;
    }
    .next {
      margin-top: 14px;
    }

    .cancel {
      margin-top: 14px;
    }
  }
}

.bulletin-board-item {
  width: 332px;
  height: 36px !important;
  span {
    float: left;
    font-family: PingFangSC-Regular;
    color: #4A4A4A;
    max-width: 293px;
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 36px;
    line-height: 36px;
    margin-left: 7px;
    padding-top: 2px;
  }

  .next {
    width: 6px;
    height: 10px;
    margin-top: 14px;
    margin-left: 5px;
    float: left;
  }

  .cancel {
    width: 10px;
    height: 10px;
    margin-top: 14px;
    margin-left: 10px;
    float: left;
  }
}
</style>
