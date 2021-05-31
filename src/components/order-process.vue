<template>
  <div class="order-process">
    <el-steps :active="orderStatus" align-center>
      <el-step title="待支付"></el-step>
      <el-step title="支付中"></el-step>
      <el-step title="支付完成"></el-step>
      <el-step title="打印小票"></el-step>
    </el-steps>
    
    <div class="pay-info" v-if="orderStatus !== 3">
      <div>等待支付：{{ waitingPaidAmount }}元</div>
      <span>应收：{{ payableAmount }}元</span>
      <span>实收：{{ paidAmount }}元</span>
    </div>

    <div v-if="orderStatus === 0 || orderStatus === 1" class="pay-container">
      <div class="left-panel">
        <el-button @click="selectPaymentMethod(PaymentMethod.B_SCAN_C)">我扫顾客</el-button>
        <el-button @click="selectPaymentMethod(PaymentMethod.C_SCAN_B)" disabled>顾客扫我</el-button>
        <el-button @click="selectPaymentMethod(PaymentMethod.CARD)" disabled>刷卡支付</el-button>
        <el-button @click="selectPaymentMethod(PaymentMethod.CASH)" disabled>现金支付</el-button>
      </div>

      <div class="right-panel" v-loading="orderStatus === 1 && this.payLoading" element-loading-text="等待确认中...">
        <div v-if="showSuccessMask" class="pay-result-box">
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
        </number-keyboard>
      </div>
    </div>

    <div v-if="orderStatus === 2" class="pay-detail">
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
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { FlowStatus, OrderStatus, PaymentMethod } from '@/utils/consts';
import { waitingDynamicId } from '@/utils/scan-code-gun';
import NumberKeyboard from './number-keyboard';
import { stringToNumber } from '@/utils/money';
import { delay } from '@/utils/delay';

export default {
  name: 'OrderProcess',
  components: { NumberKeyboard },
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
    };
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
      return this.payableAmount - this.paidAmount;
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
        const dynamicId = await waitingDynamicId();
        await this.payFlow(dynamicId);
        await this.waitAndQueryOrderStatus();
        this.amountString = this.waitingPaidAmount.toString();
      } catch (error) {
        this.payFailedMessage = error.message;
      } finally {
        this.payLoading = false;
      }
    },
     
    print() {
      this.updateOrderStatus(OrderStatus.PRINT);
    }
  },
}
</script>

<style lang="scss">
.left-panel {
  .el-button + .el-button {
    margin-left: 0;
    margin-top: 40px;
  }
}
</style>

<style lang="scss" scoped>
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

.pay-container {
  display: flex;

  .left-panel {
    box-sizing: border-box;
    width: 40%;
    padding: 10px 10px 20px;
    margin-right: 10px;
    flex: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .right-panel {
    position: relative;
    flex: auto;
    margin: 10px 10px 20px;
    padding: 10px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 1px solid #ebeef5;
    border-radius: 2px;
    
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

</style>