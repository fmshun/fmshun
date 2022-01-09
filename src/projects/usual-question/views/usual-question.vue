<template>
  <div class="usual-question">
    <div class="question-item" v-for="(item, k) in questionLists" :key="k">
      <div class="question-title">
        {{ item.question }}
      </div>
      <div class="answer-content">
        {{ modifyColor(item.answer, k) }}
      </div>
    </div>
  </div>
</template>

<script>
import base from 'base'
import { getAnswer } from '../request/api'
export default {
  name: 'usual-question',
  components: {},
  data() {
    return {
      questionLists: [],
    }
  },
  methods: {
    //修改字体颜色
    modifyColor(data, k) {
      if (data.indexOf('持仓成本=总投入/总分额') === 29) {
        this.$nextTick(() => {
          let arr = data.split('持仓成本=总投入/总分额')
          $('.answer-content')
            .eq(k)
            .html(
              arr[0] +
                '<span style="color: #4473ED;">持仓成本=总投入/总份额</span>' +
                arr[1]
            )
        })
      } else {
        return data
      }
    },
  },
  mounted() {
    //获取问题列表
    getAnswer().then((data) => {
      $('.loader-wrapper').hide() //关闭加载动画
      let result = data.BINDATA ? JSON.parse(data.BINDATA) : {}
      let code = result.code
      let msg = result.msg
      if (code === '0') {
        this.questionLists = result.resultData
      } else {
        alert('对不起，计算器开了个小差～')
      }
    })
  },
}
</script>

<style lang="less" scoped>
/* loading动画 */
.loading {
  position: absolute;
  z-index: 1002;
  width: 100%;
  height: 100%;
  background: #fff url('../assets/loading.gif') no-repeat center;
  background-size: 28px 28px;
}

.question-item {
  position: relative;
  padding: 29px 0 29px 9px;
  margin: 0 20px 0 21px;
}

.question-item + .question-item::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  pointer-events: none;
  content: '';
  background-color: #e8e8e8;
  transform: scale(1, 0.5);
}
.question-title {
  position: relative;
  font-family: PingFangSC-Medium, sans-serif;
  font-size: 17px;
  font-weight: bold;
  line-height: 24px;
  color: #2f2f2f;
  text-align: left;

  /* font-weight: bold; */
  &::before {
    position: absolute;
    top: 10px;
    bottom: 0;
    left: -9px;
    z-index: 1;
    width: 4px;
    height: 4px;
    content: '';
    background: #2a64ff;
    border-radius: 50%;
  }
}
.answer-content {
  margin-top: 16px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 14px;
  line-height: 24px;
  color: #666666;
  letter-spacing: 0;
}
</style>
