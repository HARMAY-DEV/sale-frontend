<template>
  <!-- 微信 or 支付宝 扫码支付 -->
  <div class="scancode-pay-container">
    <div class="pay-content-group">
      <p class="alipay-tips">请顾客用{{name}}扫码</p>
      <div class="img-box">
        <img src="../assets/images/QRcode.png" alt="" class="alipay-img" />
        <div class="fail-box" v-show="failMask">
          <img src="../assets/images/red_del.png" class="fail-img">
          <p class="fail-tips">支付失败</p>
          <p class="reset-btn" @click="bindResetBtn">点击重试</p>
        </div>
      </div>
      <p class="alipay-sign">翻转屏幕展示客显屏</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: '支付宝'
    }
  },
  data() {
    return {
      payState: false,
      failMask: true
    };
  },
  mounted() {
    this.payStateName = this.name
  },
  methods: {
    getPayState() {
      this.payState = false
    },
    bindResetBtn() {
      this.failMask = false
    }
  },
};
</script>
<style lang="scss" scoped>
.scancode-pay-container {
  .pay-content-group {
    min-width: 470px;
    text-align: center;
    .alipay-tips {
      width: 174px;
      height: 51px;
      line-height: 51px;
      font-size: 16px;
      color: #000;
      background: #f8f8f8;
      border-radius: 26px;
      margin: 35px auto 30px;
      font-weight: bold;
    }
    .img-box {
      width: 310px;
      height: 310px;
      margin: 0 auto;
      position: relative;
      border-radius: 22px;
      overflow: hidden;
    }
    .fail-box {
      background: rgba(0, 0, 0, 0.8);
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
      .fail-img {
        width: 71px;
        height: 71px;
        margin-top: 35px;
      }
      .fail-tips {
        font-size: 18px;
        color: #fff;
        font-size: 18px;
      }
      .reset-btn {
        width: 141px;
        height: 45px;
        line-height: 45px;
        color: #fff;
        border: 1px solid #fff;
        border-radius: 10px;
        margin: 53px auto;
        font-size: 18px;
      }
    }
    .alipay-img {
      width: 100%;
      height: 100%;
    }
    .alipay-sign {
      margin-top: 30px;
      color: #000;
      font-size: 14px;
    }
  }
}
</style>