<template>
  <div class="bank-name" :class="{ small: isSmall }" :bankcode="bankCode">
    <img :src="imgUrl" />
    <span>{{ name }}({{ strBankNum || '--' }})</span>
  </div>
</template>

<script>
import bankdata from './bankdata'
export default {
  name: 'Bank',
  props: {
    bankCode: String,
    bankNum: String,
    isSmall: Boolean,
  },
  data() {
    return {
      logo: '',
      name: '',
      //   strBankNum: '',
    }
  },
  computed: {
    strBankNum: function() {
      if (this.bankNum) {
        return this.bankNum.substr(this.bankNum.length - 4)
      }
      return '--'
    },
    imgUrl: function() {
      if (this.logo) {
        return require('@/components/bank/' + this.logo)
      }
      return ''
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init: function() {
      let bankObj = bankdata.getDataByCode(this.bankCode)

      if (bankObj) {
        this.logo = bankObj.logo
        this.name = bankObj.name
      }

      //   if (this.bankNum) {
      //     this.strBankNum = this.bankNum.substr(this.bankNum.length - 4)
      //   } else {
      //     this.strBankNum = '--'
      //   }
    },
    // 暴露给父组件的方法，返回“招商银行(0011)”字符串
    getBankInfo: function() {
      return `${this.name}(${this.strBankNum})`
    },
  },
}
</script>

<style scoped>
img {
  height: 15px;
  margin-top: -5px;
  margin-right: 6px;
  vertical-align: middle;
}

span {
  font-size: 17px;
  color: #2f2f2f;
}

.small img {
  height: 14px;
  margin-top: -3px;
  margin-right: 3px;
}

.small span {
  font-size: 14px;
  color: #323232;
}
</style>
