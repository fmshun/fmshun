<template>
  <div class="business-success">
    <section class="section-xgxx-success">
      <div class="icon">
        <img src="../assets/icon_yes.png" alt="成功" />
      </div>
      <p>信息修改成功</p>
      <div class="section-xgxx-success-btn btns3" @click="clickBtn">确定</div>
    </section>
  </div>
</template>

<script>
import base from 'base'
export default {
  name: 'BusinessSuccess',
  methods: {
    clickBtn() {
      base.href('http://action:3413')
    },
  },
}
</script>

<style scoped>
.business-success {
  width: 100%;
  height: 100%;
  color: #555;
  background-color: #fff;
}
.section-xgxx-success {
  padding-top: 62px;
}
.section-xgxx-success-btn {
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
.section-xgxx-success div.icon {
  /* margin-top: .62rem; */
  text-align: center;
}
.section-xgxx-success div.icon img {
  width: 56px;
  height: 56px;
}
.section-xgxx-success p {
  margin-top: 19px;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  text-align: center;
}
.section-xgxx-success p.error {
  width: 80%;
  margin: 23px auto;
  font-size: 12px;
  line-height: 22px;
  color: #5aa109;
  text-align: center;
}
</style>
