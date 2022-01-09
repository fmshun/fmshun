<template>
  <div class="fund-card">
    <!--<div class="loading"></div>-->
      <div id="header">
          <input
                  class="title"
                  placeholder="请输入标题（可选）"
                  type="text"
                  maxlength="30"
                  v-model.trim="titleContent"
                  @input="handleInput"
          />
      </div>
    <div class="main-content post-detail">
      <div class="post-title">
        <input
          class="title"
          placeholder="请输入标题（可选）"
          type="text"
          maxlength="30"
          v-model.trim="titleContent"
          @input="handleInput"
        />
      </div>
      <div class="font-num">
        <span class="num">{{ titleContent.length }}</span
        >/30
      </div>
      <div class="post-content">
        <textarea
          v-model.trim="postContent"
          class="content"
          type="text"
          placeholder="请输入正文"
        ></textarea>
      </div>
        <button @click="addDiv()">测试</button>
        <div class="test-div" @click="test1()">1964新开容器</div>
        <div class="test-div" @click="test2()">1964关闭当前页面，不新开容器</div>
        <div class="test-div" @click="test3()">1964测试能否改变原生top</div>
        <div class="test-div" v-for="(item,key) in testDiv" :key="key">{{item}}</div>
    </div>
      <div class="fixed-div">
          <input
                  class="title"
                  placeholder="请输入标题（可选）"
                  type="text"
                  maxlength="30"
                  v-model.trim="titleContent"
                  @input="handleInput"
          />
      </div>
  </div>
</template>

<script>
import base from 'base'
import ajax from 'ajax'
import file from 'file'

export default {
  name: 'send-post',
  components: {},
  data() {
    return {
      titleContent: '',
      postContent: '',
      testDiv: [],
    }
  },
  watch: {
    titleContent(v) {
      if (v.length >= 30) {
        this.titleContent = v.substr(0, 30)
        this.$Toast('标题最多输入30个字哦~')
      }
    },
  },
  methods: {
    test1(){
      // *1964 关闭当前页面，新开容器
      let url='http://action:10061/?fullscreen=1&&shownavigationbar=0&&url=/web_cft/financing-aip/financing-counter.html'
      base.href('http://action:1964/?url='+encodeURIComponent(url))
    },
    test2(){
      //同一容器内H5页面跳转()
      base.href('http://action:1964/?url=/web_cft/financing-aip/financing-counter.html')
    },
    test3(){
      base.href('http://action:1964/?fullscreen=1&&shownavigationbar=0&&isShowDarkStatusBar=1&&url=/web_cft/financing-aip/financing-counter.html')
    },
    addDiv(){
        this.testDiv.push('哈哈哈哈哈哈哈哈哈')
    },
    handleInput() {},
    /*发帖
     *request=post
     *@params uid
     *@params wtoken
     *@params postContent 发帖内容
     *@params postTitle 传空
     *@params topicId 主题编号
     *@params topicType 0电话会议 1股吧 2资讯直播 3投资组合 4涨乐fm 5智能投资
     */
    postTopic: function() {
      let self = this
      this.postContent = this.postContent.trim()
      if (!this.postContent) {
        self.$Toast('请输入正文')
        return
      }
      let topicId = base.getUrlParameter('topicId') || ''
      let topicType = base.getUrlParameter('topicType') || ''
      let url =
        '/reqxml?action=27006&path=/social/post?request=post&uid=($weakaccount)&wtoken=($weaktoken)' +
        '&postContent=' +
        this.postContent +
        '&postTitle=' +
        this.titleContent +
        '&topicId=' +
        topicId +
        '&topicType=' +
        topicType
      ajax.runWeak(
        url,
        '',
        function(xml) {
          let flag = $(xml.BINDATA).find('flag')
          if (
            flag.attr('code') === '0' ||
            flag.attr('code') === '-5' ||
            flag.attr('msg').includes('审核') ||
            flag.attr('msg').includes('展示')
          ) {
            //发帖成功保存成功信息
            file.insert('post-success.js', { isPost: 1 }, function(data) {
              base.href('http://action:3413')
            })
          } else {
            self.$Toast(flag.attr('msg') || '发送失败')
          }
        },
        function() {
          self.$Toast('网络连接不通，请稍后再试')
        }
      )
    },
  },
  mounted() {
    let self = this
    window.submitTopic = function() {
      self.postTopic()
    }
  },
}
</script>

<style lang="less">
/* loading动画 */
.loading {
  position: absolute;
  z-index: 1002;
  width: 100%;
  height: 100%;
  background: #fff url('../assets/loading.gif') no-repeat center;
  background-size: 28px 28px;
}

textarea::-webkit-input-placeholder,
input::-webkit-input-placeholder {
  color: #666666;
  opacity: 0.7;
}

#header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    background-color: #fff;
    height: 64px;
    padding: 0 15px;
}
.fund-card {
    height: 100%;
}
.main-content{
    position: absolute;
    top: 64px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.test-div{
    height: 50px;
    line-height: 50px;
    border: 1px solid #e6e9ed;
}
.fixed-div{
    position: fixed;
    bottom: 0;
    height: 60px;
    z-index: 10000;
    width: 100%;
    padding: 0 15px;
    background: white;
}

.post-title {
  box-sizing: border-box;
  width: 100%;
  height: 56px;
  padding: 17px 16px;
  overflow: hidden;
  background: #fff;
}
input.title {
  width: 100%;
  height: 100%;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 16px;
  color: #323232;
  border: none;
}
.font-num {
  height: 26px;
  padding-right: 12px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 11px;
  line-height: 26px;
  color: #d2d2d2;
  text-align: right;
  background: #f6f6f9;
}
.post-content {
  height: 225px;
  padding: 0 16px;
  padding-top: 15px;
  font-family: PingFangSC-Regular, sans-serif;
  font-size: 16px;
  color: #bcbcbc;
  text-align: left;
  letter-spacing: 0;
}
textarea.content {
  width: 100%;
  height: 100%;
  line-height: 20px;
  resize: none;
  border: none;
}

.toast {
  top: 30% !important;
  min-width: auto !important;
  padding: 22px 20px !important;
  font-size: 13px !important;
  line-height: 18px !important;
  background-color: rgba(0, 0, 0, 0.65) !important;
}
</style>
