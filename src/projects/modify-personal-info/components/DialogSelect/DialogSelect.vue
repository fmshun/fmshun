<template>
  <transition name="v-fade">
    <div class="visual-dialog">
      <transition name="v-mask">
        <div class="mask" v-if="isShow"></div>
      </transition>
      <transition name="v-dialog">
        <div class="dialog-content " v-if="isShow">
          <div
            class="item"
            v-for="(item, index) in list"
            :key="item.code"
            @click="clickItem(index)"
          >
            <span class="name">{{ item.name }}</span>
            <span
              class="redefine-radioInput"
              :class="{ checked: item.checked }"
            ></span>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DialogSelect',
  props: {
    isShow: Boolean,
    list: Array,
  },
  data() {
    return {
      // updateList: []
    }
  },
  methods: {
    clickItem(index) {
      let updateList = this.list.map((item, i) => {
        let itemChecked = false
        if (i === index) {
          itemChecked = true
        }
        let itemNew = {
          ...item,
          checked: itemChecked,
        }
        return itemNew
      })
      this.$emit('on-select', updateList)
      this.$emit('on-close')
    },
  },
}
</script>

<style>
@import 'transition.css';
.visual-dialog {
  position: relative;
}
.visual-dialog .dialog-content {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50002;
  display: table;
  width: 72%;
  max-width: 300px;
  margin: auto;
  overflow-y: scroll;
  text-align: center;
  background-color: #fff;
  border-radius: 4px;
}
.dialog-content .item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 10px;
  line-height: 40px;
  border-bottom: 1px solid #e0e0e0;
}
.visual-dialog .mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50001;
  background-color: rgba(0, 0, 0, 0.6);
}
.redefine-radioInput {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url('radio-off.png');

  /* background-size: 0.12rem 0.12rem; */
  background-repeat: no-repeat;
  background-position: center center;
}
.redefine-radioInput.checked {
  background-image: url('radio-active.png');

  /* background-size: 0.12rem 0.12rem; */
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
