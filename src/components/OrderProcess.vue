<template>
  <div class="order-process">
    <div class="state">
      <div class="stateList" v-for="(item,index) in stateList" :key="item.id">
        <img :src="item.orderState<=orderStatus?item.iconActive:item.icon" class="stateImg">
        <p :class="['stateName', {active: item.orderState<=orderStatus}]">{{item.label}} <span :class="['stateLine', {active: item.orderState<=orderStatus}]" v-if="index!=stateList.length-1">----------</span></p>
      </div>
    </div>
    <div class="content-box">
      <div v-if="orderStatus === 0 || orderStatus === 1" class="pay-container">
        <div class="left-panel">
          <p class="title">支付方式：</p>
          <el-button type="primary" v-for="(item, index) in btnList" :key="item.id" @click="bindBtn(index)">
            <div class="btn-box">
              <img :src="item.icon">
              <span>{{item.label}}</span>
            </div>
          </el-button>
        </div>
        <div class="right-panel" v-loading="orderStatus === 1 && this.payLoading" element-loading-text="等待确认中...">
          <div class="stay-pay-group">
            <p class="stay-price">待付金额： <span>{{payableAmount}}元</span></p>
            <div class="other-price">
              <span>应收金额：{{payableAmount}}元</span>
              <span>实收金额：{{amount}}元</span>
            </div>
            <p class="tips" v-if="orderStatus==0">等待支付~</p>
            <div class="pay-detail-box" v-else-if="orderStatus==1">
              <div class="pay-detail-item">
                <span>微信</span>
                <span>20元</span>
              </div>
              <div class="pay-detail-item">
                <span>微信</span>
                <span>20元</span>
              </div>
            </div>
          </div>
          <!-- <div v-if="showSuccessMask" class="pay-result-box">
            <ip-check-one theme="filled" size="48" fill="#67C23A" />
            <p>支付成功</p>
          </div>
          <div v-if="showFailMask" class="pay-result-box">
            <ip-caution theme="filled" size="48" fill="#F56C6C"/>
            <p>支付失败</p>
            <div>{{ payFailedMessage }}</div>
          </div>

          <number-keyboard placeholder="请输入收款金额" v-model="amountString">
            <el-button :disabled="amount <= 0" type="success" @click="pay()">支付</el-button>
          </number-keyboard> -->
        </div>
      </div>

      <div v-else-if="orderStatus === 2" class="pay-detail">
        <div style="font-size: 16px; font-weight: 500; margin-bottom: 5px;">支付动态：</div>
        <div class="flow-item" v-for="flow in flowList" :key="flow.id">
          <template v-if="flow.payType">
            <div>使用 <span>{{ flow.payType }}</span> 支付 <span>{{ flow.amount }}</span></div>
            <span class="flow-time">{{ flow.time }}</span>
          </template>
        </div>
        <div style="margin-top: 10px; text-align: center;">
          <el-button @click="print()">去打印小票</el-button>
        </div>
      </div>

      <div v-else class="iframe-container">
        <iframe src="/receipt.html" width="400" height="360" frameborder="0"></iframe>
      </div>
    </div>

    <ticket ref="mychild" :id="orderInfo.id"></ticket>
    <!-- 顾客扫我 -->
    <customer-scan-me :isVisible="btnIndex!==-1" :amountString="amountString" :amount="amount" :title="stateTitle"></customer-scan-me>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { FlowStatus, OrderStatus, PaymentMethod } from '@/utils/consts';
import { waitingDynamicId } from '@/utils/scan-code-gun';
// import NumberKeyboard from './number-keyboard';
import { stringToNumber } from '@/utils/money';
import { delay } from '@/utils/delay';
import ticket from './smallTicket'
import CustomerScanMe from '@/components/CustomerScanMe'

export default {
  name: 'OrderProcess',
  components: { ticket, CustomerScanMe },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      PaymentMethod,
      paymentMethod: PaymentMethod.B_SCAN_C,
      amountString: '',
      payFailedMessage: '',
      showSuccessMask: false,
      showFailMask: false,
      payLoading: false,
      flowList: [],
      stateList: [
        {id: 1, label: '待支付', icon: require('../assets/images/payIcon02.png'), iconActive: require('../assets/images/payIcon02.png'), orderState: 0},
        {id: 2, label: '支付中', icon: require('../assets/images/payIcon04.png'), iconActive: require('../assets/images/payIcon12.png'), orderState: 1},
        {id: 3, label: '支付完成', icon: require('../assets/images/payIcon03.png'), iconActive: require('../assets/images/payIcon11.png'), orderState: 2},
        {id: 4, label: '打印小票', icon: require('../assets/images/payIcon01.png'), iconActive: require('../assets/images/payIcon08.png'), orderState: 3}
      ],
      btnList: [
        {id: 1, icon: require('../assets/images/paybtn01.png'), label: '我扫顾客'},
        {id: 2, icon: require('../assets/images/paybtn02.png'), label: '顾客扫我'},
        {id: 3, icon: require('../assets/images/paybtn03.png'), label: '刷卡支付'},
        {id: 4, icon: require('../assets/images/paybtn04.png'), label: '现金支付'}
      ],
      btnIndex: -1,
      stateTitle: ''
    };
  },
  mounted() {
    console.log(this.orderStatus);
  },
  computed: {
    ...mapState('order', ['orderStatus', 'orderInfo']),
    ...mapGetters('flow', ['currentFlowStatus']),
    amount() {
      return stringToNumber(this.amountString);
    },
    payableAmount() {
      return this.orderInfo.payableAmount;
    },
    paidAmount() {
      return this.orderInfo.paidAmount;
    },
    waitingPaidAmount() {
      const value = this.payableAmount - this.paidAmount;
      if (value % 1 === 0) return value;
      return value.toFixed(2);
    }
  },
  filters: {
    money(value) {
      const num = Number(value);

      if (num % 1 === 0) return num;
      return num.toFixed(2);
    }
  },
  watch: {
    currentFlowStatus(status) {
      if (status === FlowStatus.SUCCEED) {
        this.showSuccessMask = true;
        this.cancelLoopFlowDetail();
        setTimeout(() => {
          if (this.waitingPaidAmount > 0) {
            this.showSuccessMask = false;
          }
        }, 3000);
      }

      if (status === FlowStatus.FAILED) {
        this.showFailMask = true;
        this.cancelLoopFlowDetail();
        setTimeout(() => {
          this.showFailMask = false;
          this.payFailedMessage = '';
        }, 5000);
      }
    },

    waitingPaidAmount: {
      handler(value) {
        this.amountString = value.toString();
      },
      immediate: true,
    },

    amount(value) {
      if (value > this.waitingPaidAmount) {
        this.amountString = this.waitingPaidAmount.toString();
      }
    },
    async orderStatus(status) {
      if (status === OrderStatus.PAID) {
        this.flowList = await this.getFlowList();
      }

      if (status !== OrderStatus.PAYING) {
        this.payLoading = false;
        this.showSuccessMask = false;
        this.showFailMask = false;
        this.cancelLoopFlowDetail();
      }
    }
  },
  methods: {
    ...mapActions('flow', ['createFlow', 'payFlow', 'getFlowList', 'cancelLoopFlowDetail']),
    ...mapMutations('order', ['updateOrderStatus']),
    ...mapActions('order', ['getOrderDetail']),
    ...mapMutations('cart', ['clearCart']),
    bindBtn(index) {
      this.btnIndex = index
      this.stateTitle = this.btnList[index].label
    },
    selectPaymentMethod(method) {
      this.paymentMethod = method;
    },

    async waitAndQueryOrderStatus() {
      await delay(500);
      const { payableAmount, paidAmount, status } = await this.getOrderDetail();

      if (paidAmount >= payableAmount || status === 'completed') {
        this.updateOrderStatus(OrderStatus.PAID);
        this.clearCart();
      }
    },

    async pay() {
      if (this.payLoading) {
        return;
      }

      this.payLoading = true;
      try {
        await this.createFlow({ paymentMethod: this.paymentMethod, amount: this.amount });

        if (this.paymentMethod === PaymentMethod.B_SCAN_C) {
          const dynamicId = await waitingDynamicId();
          await this.payFlow(dynamicId);
        }

        await this.waitAndQueryOrderStatus();
        this.amountString = this.waitingPaidAmount.toString();
        this.$refs.mychild.detail()
      } catch (error) {
        this.payFailedMessage = error.message;
      } finally {
        this.payLoading = false;
      }
    },
     
    print() {
      // this.updateOrderStatus(OrderStatus.PRINT);
      this.$refs.mychild.print();
    }
  },
}
</script>

<style lang="scss" scoped>
.snTitle{
  padding-top: 23px;
  display: flex;
  align-items: center;
  margin-left: 20px;
  cursor: pointer;
}
.pay-info {
  display: flex;
  margin: 10px;
  padding: 10px 0;
  height: 30px;
  align-items: center;
  border-bottom: 1px dashed #999;
  
  div {
    font-size: 18px; 
    font-weight: 600; 
    color: #333;
    margin-right: auto;
  }

  span {
    font-size: 16px;
    font-weight: 500;
    color: #999;
    margin-left: 12px;
  }
}

.content-box{
  width: 508px;
  height: 394px;
  background: #F8F8F8;
  margin: 20px auto 0;
  padding: 28px 20px;
  border-radius: 8px;
}
.pay-container {
  display: flex;
  .left-panel {
    box-sizing: border-box;
    width: 35%;
    padding: 10px 10px 20px;
    margin-right: 10px;
    flex: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      color: #000;
      font-weight: bold;
      font-size: 16px;
      padding-bottom: 12px;
    }
    .el-button {
      width: 116px;
      margin-top: 21px;
      margin-left: 0;
    }
    .btn-box {
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        display: inline-block;
        margin-left: 8px;
      }
    }
  }
  .right-panel {
    position: relative;
    flex: auto;
    border-radius: 2px;
    .stay-pay-group {
      .stay-price {
        font-size: 14px;
        color: #000;
        font-weight: bold;
        span {
          font-size: 22px;
        }
      }
      .other-price {
        margin-top: 14px;
        span {
          display: inline-block;
          color: #7C8285;
          font-size: 14px;
          & + span {
            margin-left: 22px;
          }
        }
      }
      .tips {
        text-align: center;
        margin-top: 100px;
        color: #969696;
      }
      .pay-detail-box {
        margin-top: 13px;
        .pay-detail-item {
          & + .pay-detail-item {
            margin-top: 8px;
          }
          border: 1px solid #E2E2E2;
          padding: 0 15px;
          height: 30px;
          line-height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
    .pay-result-box {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 99;
      display: flex;
      background-color: #fff;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      p {
        font-size: 20px;
        font-weight: 500;
      }
    }
  }
}

.pay-detail {
  padding: 10px;

  .flow-item {
    display: flex;
    justify-content: space-between;
    // padding: 5px 0;
    // border-bottom: 1px solid #ebeef5;

    .flow-time {
      flex-basis: 150px;
    }

    > div span {
      display: inline-block;
      color: #409eff;
      min-width: 44px;
      text-align: left;
    }
  }
}

.iframe-container {
  display: flex;
  justify-content: center;
}
//订单支付状态
.state{
  width: 394px;
  margin: 40px auto 0 auto;
  display: flex;
  justify-content: center;
  .stateList{
    align-items: center;
    .stateImg{
      display: block;
      width: 20px;
      height: 20px;
      margin-left: 13px;
    }
    .stateName{
      font-size: 14px;
      color: #969696;
      margin-top: 8px;
      white-space: nowrap;
      &.active {
        color: #000;
      }
    }
  }
  .stateLine{
    color: #969696;
    margin: 28px 7px 0 7px;
    &.active {
      color: #000;
    }
  }
}

</style>