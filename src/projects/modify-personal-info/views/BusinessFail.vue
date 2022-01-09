<template>
  <div class="business-fail">
    <section class="section-xgxx-error">
      <div class="_icon">
        <img src="../assets/icon_no.png" width="74px" height="74px" />
      </div>
      <p>信息修改失败</p>
      <p class="error"></p>
      <div class="section-xgxx-error-btn btns4" @click="clickBtn">确定</div>
    </section>
  </div>
</template>

<script>
import base from 'base'
export default {
  name: 'BusinessFail',
  methods: {
    clickBtn() {
      base.href('http://action:3413')
    },
  },
}
</script>

<style scoped>
/* html,body{ */

/*    width:100%; */

/*    padding:0 ; */

/*    margin: 0; */

/*    overflow: hidden; */

/* } */
.section-xgxx-error-btn {
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

.section-xgxx-error {
  padding-top: 70px;
}

/* .section-xgxx-error div._icon{ */

/*    margin-top: .70rem; */

/* } */

/* .section-xgxx-error div._icon img{ */

/*    margin-left: -.37rem; */

/* } */
.section-xgxx-error p {
  margin-top: 40px;
  font-size: 20px;
  text-align: center;
}
.section-xgxx-error p.error {
  width: 80%;
  margin: 23px auto;
  font-size: 12px;
  line-height: 22px;
  color: #5aa109;
  text-align: center;
}
</style>
