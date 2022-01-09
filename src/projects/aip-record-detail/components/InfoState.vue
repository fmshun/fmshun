<template>
  <div :class="['aip-record-detail-info-message', stateInfo.className || '' ]">
    <i class="icon"></i>
    <span>{{ stateInfo.stateMessage }}</span>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      required: true,
    },
  },
  data() {
    return {
      stateObjs: {
        1: {
          className: 'confirmation',
          stateMessage: '买入确认中',
        },
        2: {
          className: 'failed',
          stateMessage: '定投失败',
        },
        3: {
          className: 'waitting',
          stateMessage: '等待转入',
        },
        4: {
          className: 'failed',
          stateMessage: '卖出失败',
        },
        5: {
          className: 'confirmation',
          stateMessage: '卖出确认中',
        },
        6: {
          className: 'success',
          stateMessage: '卖出成功',
        },
        7: {
          className: 'success',
          stateMessage: '定投成功',
        },
        8: {
          className: 'confirmation',
          stateMessage: '卖出已撤单',
        },
      },
    }
  },
  computed: {
    stateInfo() {
      return this.stateObjs[this.status] || {}
    },
  },
}
</script>

<style lang="less" scoped>
.aip-record-detail-info-message {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  height: 22px;
  .icon {
    width: 14px;
    height: 14px;
    margin-right: 6px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
  }

  span {
    height: 22px;
    font-size: 16px;
    line-height: 22px;
    font-family: PingFangSC-Regular;
  }
}

.confirmation {
  .icon {
    background-image: url('../assets/confirm.png');
  }
  span {
    color: #ef7f1a;
  }
}

.failed {
  .icon {
    background-image: url('../assets/fail.png');
  }
  span {
    color: #ed5742;
  }
}

.waitting {
  .icon {
    background-image: url('../assets/wait.png');
  }
  span {
    color: #4a90e2;
  }
}

.success {
  .icon {
    background-image: url('../assets/success.png');
  }
  span {
    color: #4a4a4a;
  }
}
</style>
