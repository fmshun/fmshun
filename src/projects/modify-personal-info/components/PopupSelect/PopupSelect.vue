<!--props: {isShow,title,list[{code:'A01',name:'自由职业'}]}-->
<!--事件：@on-click-close-->
<template>
  <div class="popup-select-mask" v-show="isShow">
    <div class="popup-select-body">
      <div class="popup-select-head">
        <div class="popup-select-title">{{ title }}</div>
        <div class="popup-select-close" @click="$emit('on-click-close')"></div>
      </div>
      <div class="popup-select-group">
        <div
          class="popup-select-item"
          v-for="n in activeLevel"
          :key="n"
          :style="{ width: 100 / levels + '%' }"
          @click="clickSelectItem(n)"
        >
          <span
            class="item-title"
            :class="{ 'popup-select-item-active': activeLevel == n }"
          >
            {{ getItemTitle(n) }}
          </span>
        </div>
      </div>
      <div class="popup-select-list">
        <div class="popup-select-scroller">
          <div
            class="list-item"
            v-for="item in scrollList[activeLevel - 1]"
            :key="item.code"
            @click="clickItem(item)"
          >
            <span class="list-item-span">{{ item.name }}</span>
            <span class="list-item-icon" v-show="isChecked(item)"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupSelect',
  props: {
    isShow: Boolean,
    title: {
      type: String,
      default: '请选择',
    },
    levels: {
      type: Number,
      default: 1,
    },
    list: Array,
  },
  data() {
    return {
      activeLevel: 1,
      checkedList: [],
      scrollList: [this.list],
    }
  },
  methods: {
    clickItem(item) {
      this.$set(this.checkedList, this.activeLevel - 1, item)
      if (item.child && item.child.length > 0) {
        // 跳到下一层
        this.activeLevel =
          this.activeLevel + 1 > this.levels
            ? this.levels
            : this.activeLevel + 1
        this.$set(this.scrollList, this.activeLevel - 1, item.child)
      } else {
        this.$emit('on-select', this.checkedList)
        this.$emit('on-click-close')
      }
    },
    clickSelectItem(n) {
      this.activeLevel = n
      this.checkedList = this.checkedList.slice(0, this.activeLevel)
    },
    getItemTitle(n) {
      if (this.checkedList[n - 1]) {
        return this.checkedList[n - 1].name || '请选择'
      }
      return '请选择'
    },
    isChecked(item) {
      let flag = false
      this.checkedList.forEach((checked) => {
        if (checked.code === item.code) {
          flag = true
        }
      })
      return flag
    },
  },
}
</script>

<style>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  font-family: 'PingFang-SC-Regular', 'Arial', '微软雅黑', '幼圆', serif;
  -webkit-tap-highlight-color: transparent;
}
.popup-select-mask {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}
.popup-select-body {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #fff;
}
.popup-select-head {
  height: 48px;

  /* display: box; */

  /* display: -webkit-box; */

  /* box-align: center; */

  /* -webkit-box-align: center; */

  /* box-orient: horizontal; */

  /* -webkit-box-orient: horizontal; */

  /* box-pack: justify; */

  /* -webkit-box-pack: justify; */
  padding: 0 15px 0 20px;
  background-color: #f8f8f8;
}
.popup-select-title {
  padding-top: 13.5px;
  margin: 0 auto;
  font-family: PingFangSC-Regular, serif;
  font-size: 16px;
  color: #323232;
  letter-spacing: 0;
}
.popup-select-close {
  position: absolute;
  top: 13.5px;
  right: 15px;
  width: 20px;
  height: 20px;
  background-image: url(close-select-icon.png);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 12px 12px;
}
.popup-select-group {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 44px;
  padding: 0 14px;
  font-family: PingFangSC-Regular, serif;
  font-size: 14px;
  color: #323232;
  letter-spacing: 0;
  border-bottom: 1px solid #e0e0e0;
}
.popup-select-item {
  display: block;

  /* float: left; */
  height: 100%;

  /* flex-grow: 1; */
}
.popup-select-item-active {
  color: #df3031;
  border-bottom: 1px solid #df3031;
}
.popup-select-item .item-title {
  display: block;
  float: left;
  max-width: 86%;
  height: 44px;
  overflow: hidden;
  line-height: 44px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.popup-select-list {
  height: 235.5px;
  padding: 0 14px;
  overflow: scroll;
}
.popup-select-scroller {
  padding-top: 16.5px;
}
.popup-select-scroller .list-item {
  margin-bottom: 20px;
  text-align: start;
}
.popup-select-scroller .list-item .list-item-span {
  font-family: PingFangSC-Regular, serif;
  font-size: 13px;
  line-height: 20px;
  color: #323232;
  letter-spacing: 0;
}
.popup-select-scroller .list-item .list-item-icon {
  display: inline-block;
  float: right;
  width: 26px;
  height: 20px;
  background-image: url('select-icon.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 70% 70%;
}
</style>
