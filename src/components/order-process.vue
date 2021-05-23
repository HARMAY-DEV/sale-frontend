<template>
  <div class="order-process">
    <el-steps :active="orderStatus" align-center>
      <el-step title="待支付"></el-step>
      <el-step title="支付中"></el-step>
      <el-step title="支付完成"></el-step>
      <el-step title="打印小票"></el-step>
    </el-steps>

    <div class="pay-container">
      <div class="left-panel">
        <el-button @click="preparePay(PaymentMethod.B_SCAN_C)">我扫顾客</el-button>
        <el-button @click="preparePay(PaymentMethod.C_SCAN_B)" disabled>顾客扫我</el-button>
        <el-button @click="preparePay(PaymentMethod.CARD)" disabled>刷卡支付</el-button>
        <el-button @click="preparePay(PaymentMethod.CASH)" disabled>现金支付</el-button>
      </div>
      <div class="right-panel">
        <div>等待支付：{{ 380 }}元</div>
        <div>
          <span>应收：{{ 380 }}元</span>
          <span>实收：{{ 0 }}元</span>
        </div>
        <div>
          支付动态
        </div>

        <div 
          class="pay-panel" 
          :style="{transform: payPanelVisible ? 'scaleX(1)' : 'scaleX(0)'}"
          v-loading="currentFlowStatus === 'pending'"
          element-loading-text="等待确认中..."
        >
          <el-input placeholder="请输入收款金额" v-model="amountString" readonly prefix-icon="el-icon-coin">
            <ip-delete-two slot="suffix" theme="outline" size="26" fill="#333" @touchstart.prevent.stop="handleInputNumber('x')" />
          </el-input>
          <div class="number-keyboard">
            <span @touchstart.prevent.stop="handleInputNumber(1)">1</span>
            <span @touchstart.prevent.stop="handleInputNumber(4)">4</span>
            <span @touchstart.prevent.stop="handleInputNumber(7)">7</span>
            <span @touchstart.prevent.stop="handleInputNumber('.')">.</span>
            <span @touchstart.prevent.stop="handleInputNumber(2)">2</span>
            <span @touchstart.prevent.stop="handleInputNumber(5)">5</span>
            <span @touchstart.prevent.stop="handleInputNumber(8)">8</span>
            <span @touchstart.prevent.stop="handleInputNumber(0)">0</span>
            <span @touchstart.prevent.stop="handleInputNumber(3)">3</span>
            <span @touchstart.prevent.stop="handleInputNumber(6)">6</span>  
            <span @touchstart.prevent.stop="handleInputNumber(9)">9</span>
            <el-button :disabled="amount <= 0" class="pay-btn" type="success" @click="createFlow({ paymentMethod, amount })">付款</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PaymentMethod } from '@/utils/consts';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'OrderProcess',
  data() {
    return {
      PaymentMethod,
      paymentMethod: PaymentMethod.B_SCAN_C,
      amountString: '',
      payPanelVisible: false,
    };
  },
  computed: {
    ...mapState('order', ['orderStatus']),

    ...mapGetters('flow', ['currentFlowStatus']),

    amount() {
      const value = Number.parseFloat(this.amountString);
      return Number.isNaN(value) ? 0 : value;
    },
  },
  methods: {
    ...mapActions('flow', ['createFlow']),

    handleInputNumber(value) {
      if (this.amountString === '' && (value === 0 || value === '.' || value === 'x')) {
        return;
      }

      if (value === 'x' && this.amountString.length > 0) {
        this.amountString = this.amountString.substring(0, this.amountString.length - 1);
      } else {
        if (this.amountString.includes('.') && value === '.') {
          return;
        }
      
        this.amountString += value;
      }
    },

    preparePay(method) {
      this.payPanelVisible = true;
      this.paymentMethod = method;
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

.pay-panel {
  .el-input__inner:focus {
    border-color: #DCDFE6;
  }

  .el-input__suffix, .el-input__suffix-inner {
    display: flex;
    align-items: center;
  }
}
</style>

<style lang="scss" scoped>
.pay-container {
  display: flex;

  .left-panel {
    box-sizing: border-box;
    width: 40%;
    padding: 30px 10px 20px;
    margin-right: 10px;
    flex: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .right-panel {
    position: relative;
    flex: auto;
    margin: 30px 10px 20px;
    user-select: none !important;
    -webkit-user-select: none !important;
    touch-callout: none !important;
    -webkit-touch-callout: none !important;

    .pay-panel {
      position: absolute;
      z-index: 10;
      top: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      width: 100%;
      padding: 10px;
      transition: all ease 0.3s;
      transform-origin: center right;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      border: 1px solid #ebeef5;
      border-radius: 2px;
    }
  }
}

.number-keyboard {
  flex: auto;
  margin-top: 10px;
  display: grid;
  grid-template-rows: repeat(3, minmax(33%, 1fr));
  grid-template-columns: repeat(4, 1fr);

  .pay-btn {
    border-radius: 10px;
    border: 1px solid #ebeef5;
  }

  > span {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    border: 1px solid #ebeef5;
    font-size: 16px;
    font-weight: 600;
    transition: all ease 0.1s;

    &:active &:hover {
      background-color: #ebeef5;
    }
  }
}
</style>