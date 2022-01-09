<template>
  <div class="confirm-info">
    <section class="section-xgxx">
      <!--内容区域-->
      <div class="content">
        <!--省市区街道-->
        <div class="list-line">
          <div class="line-left">经常居住地</div>
          <div class="line-right" @click="isShowAddrSelect = true">
            <span class="myselect selecter">{{ addr }}</span>
          </div>
        </div>
        <!--详细地址-->
        <div class="list-line">
          <div class="line-left">居住地址</div>
          <div class="line-right">
            <input type="text" class="address" />
          </div>
        </div>
        <!--邮编-->
        <div class="list-line">
          <div class="line-left">邮编</div>
          <div class="line-right"><input type="text" class="zip" /></div>
        </div>
        <!--邮箱-->
        <div class="list-line">
          <div class="line-left">邮箱</div>
          <div class="line-right"><input type="text" class="email" /></div>
        </div>
        <!--学历-->
        <div class="list-line">
          <div class="line-left">学历</div>
          <div class="line-right" @click="isShowDialogSelect = true">
            <!--                        <select class="myselect" id="edu">-->
            <!--                            <option value="">请选择</option>-->
            <!--                            <option value="1001">博士</option>-->
            <!--                            <option value="1002">硕士</option>-->
            <!--                            <option value="1003">学士</option>-->
            <!--                        </select>-->
            <span class="myselect selecter">{{ edu }}</span>
          </div>
        </div>
        <!--职业-->
        <div class="list-line">
          <div class="line-left">职业</div>
          <div class="line-right" @click="isShowJobSelect = true">
            <span class="myselect selecter">{{ job }}</span>
          </div>
        </div>
      </div>
      <div class="section-xgxx-btn btns1" @click="clickNext">下一步</div>
    </section>
    <PopupSelect
      :isShow="isShowJobSelect"
      title="请选择职业"
      :list="jobList"
      :levels="2"
      @on-select="onSelectJob"
      @on-click-close="isShowJobSelect = false"
    ></PopupSelect>
    <PopupSelect
      :isShow="isShowAddrSelect"
      title="请选择经常居住地"
      :list="addrList"
      :levels="4"
      @on-select="onSelectAddr"
      @on-click-close="isShowAddrSelect = false"
    ></PopupSelect>
    <DialogSelect
      :isShow="isShowDialogSelect"
      :list="eduList"
      @on-close="isShowDialogSelect = false"
      @on-select="onSelectEdu"
    ></DialogSelect>
  </div>
</template>

<script>
import PopupSelect from '../components/PopupSelect/PopupSelect'
import DialogSelect from '../components/DialogSelect/DialogSelect'
import addr from '../assets/addr'
export default {
  name: 'ConfirmInfo',
  components: { DialogSelect, PopupSelect },

  data() {
    return {
      isShowJobSelect: false,
      isShowAddrSelect: false,
      isShowDialogSelect: false,
      jobList: [
        { code: 'A01', name: '自由职业者' },
        {
          code: 'A02',
          name: '离/退休',
          child: [
            { code: 'A0201', name: '公职 离/退休' },
            { code: 'A0202', name: '非公职 离/退休' },
          ],
        },
        { code: 'A03', name: '个体' },
        { code: 'A04', name: '农、林、牧、渔业生产人员及辅助人员' },
        { code: 'A05', name: '无业' },
      ],
      eduList: [
        { code: 'A00', name: '请选择', checked: true },
        { code: 'A02', name: '博士' },
        { code: 'A03', name: '硕士' },
        { code: 'A04', name: '学士' },
        { code: 'A05', name: '大专' },
        { code: 'A06', name: '中专' },
        { code: 'A07', name: '高中' },
        { code: 'A08', name: '初中及以下' },
      ],
      addrList: addr,
      selectJob: {},
      selectAddr: [],
      clickTime: 0,
    }
  },
  computed: {
    edu() {
      return this.eduList.filter((item) => {
        return item.checked
      })[0].name
    },
    job() {
      return this.selectJob.name || ''
    },
    addr() {
      let addrName = this.selectAddr.map((addr) => addr.name)
      return addrName.join('')
    },
  },
  methods: {
    onSelectEdu(updateList) {
      this.eduList = updateList.slice()
    },
    onSelectJob(checkedList) {
      this.selectJob = checkedList[checkedList.length - 1] || {}
    },
    onSelectAddr(checkedList) {
      this.selectAddr = checkedList
    },
    clickNext() {
      if (this.clickTime === 0) {
        this.$Dialog({
          title: '温馨提示',
          message: '您填写的经常居住地址与联系电话归属地不一致，请确认',
          btns: 2,
          cancelButtonText: '重新填写',
          confirmButtonText: '我已确认',
          submitCallback: () => {
            this.clickTime++
          },
        })
      } else {
        this.$router.push('/verify')
      }
    },
  },
}
</script>

<style>
.section-xgxx {
  padding-top: 18px;
}
.content {
  width: 100%;
  font-family: PingFangSC-Regular, serif;
  letter-spacing: 0;
  background-color: #fff;
}
.list-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  padding: 0 14px;
  clear: both;
  font-size: 14px !important;
  line-height: 50px;
  border-bottom: 1px solid #f0f0f0;
}
.line-left {
  float: left;
  width: 75px;
  margin-right: 16px;
  text-align: start;
  border: 0;
}
.line-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: calc(100% - 80px);
  height: 35px;
}
.line-right input {
  line-height: 24px;
  outline: none;
}
.address {
  display: inline-block;
  width: 100%;
  line-height: 24px;
  word-break: break-all;
  vertical-align: middle;
  resize: none;
  -webkit-user-select: text;

  /* word-wrap: break-word; */
  border: 0;
  outline: none;
}
.space {
  clear: both;
}
.section-xgxx-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 15px 0;
  font-size: 18px;
  color: #9f7624;
  text-align: center;
  background: #fff;
  border-top: 1px solid #ddd;
}
.myselect {
  -webkit-appearance: none;
  background: url(../assets/directionbottom.png) no-repeat right center;
  background-size: 10px;

  /* padding-right: 5%; */
}
.selecter {
  display: inline-block;
  width: 100%;
  height: 35px;
  overflow: hidden;
  line-height: 35px;
  color: #555;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.load {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
}

.load img {
  position: absolute;
  top: 280px;
  left: -15px;
  width: 30px;
  margin-left: 50%;
}
.public-ab-xSelect-zdy {
  margin-bottom: 0;
}
.popup.center .content {
  padding: 0 15px;
}
</style>
