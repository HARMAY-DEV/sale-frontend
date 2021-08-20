<template>
  <div class="order-process">
    <div class="order-left">
      <div class="payment-list">
        <div class="payment-item">
          <p class="content">
            <span>¥340</span>
            <b class="active">
              <i>></i>
            </b>
          </p>
          <p class="tips">支付宝</p>
          <span class="line"></span>
        </div>
        <div class="payment-item">
          <p class="content">
            <span>¥340</span>
            <b>
              <i>></i>
            </b>
          </p>
          <p class="tips">支付宝</p>
          <span class="line"></span>
        </div>
      </div>
    </div>
    <div class="order-right">
      <div class="btn-group">
        <el-button
          type="primary"
          v-for="(item, index) in btnList"
          :key="item.id"
          @click="bindBtn(index)"
        >
          <div class="btn-box">
            <img :src="item.icon" />
            <span>{{ item.label }}</span>
          </div>
          <i></i>
        </el-button>
      </div>
      <div class="pay-content-group">
        <p class="alipay-tips">请顾客用支付宝扫码</p>
        <img src="../assets/images/QRcode.png" alt="" class="qrcode-img" />
      </div>
      <div class="keyboard-box">
        <number-keyboard placeholder="请输入收款金额" v-model="amountString">
          <el-button
            type="primary"
            @click="pay"
            class="pay-btn"
            :disabled="amount <= 0"
            :loading="payLoading"
            >确认</el-button
          >
        </number-keyboard>
      </div>
    </div>

    <ticket ref="mychild" :id="orderInfo.id"></ticket>
    <!-- 顾客扫我 -->
    <el-dialog
      :visible="btnIndex !== -1 && (!showSuccessMask || !showFailMask)"
      :show-close="false"
      :close-on-click-modal="false"
      width="860px"
      append-to-body
      class="my-dialog"
    >
      <div
        class="nav-title"
        style="margin-top: -50px; margin-left: 0"
        @click="back"
      >
        <img
          src="../assets/images/return01.png"
          style="width: 17px; height: 17px"
          alt=""
        />
        <p style="font-size: 14px; color: #000; margin-left: 13px">
          切换其他支付方式
        </p>
      </div>
      <div class="content-box">
        <h2>{{ stateTitle }}</h2>
        <div class="price">
          <span>已收：0元</span>
          <span>未收：{{ amountString }}元</span>
        </div>
        <div class="state-list">
          <div
            class="state-item"
            v-for="(item, index) in stateList1"
            :key="item.id"
          >
            <img
              :src="
                item.orderState <= orderStatus ? item.iconActive : item.icon
              "
              class="stateImg"
            />
            <p
              :class="['stateName', { active: item.orderState <= orderStatus }]"
            >
              {{ item.label }}
              <span
                :class="[
                  'stateLine',
                  { active: item.orderState <= orderStatus },
                ]"
                v-if="index != stateList1.length - 1"
                >----------</span
              >
            </p>
          </div>
        </div>
        <div v-loading="orderStatus == 1 && payLoading">
          <number-keyboard placeholder="请输入收款金额" v-model="amountString">
            <el-button
              type="primary"
              @click="pay"
              class="pay-btn"
              :disabled="amount <= 0"
              :loading="payLoading"
              >确认</el-button
            >
          </number-keyboard>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { FlowStatus, OrderStatus, PaymentMethod } from "@/utils/consts";
import { waitingDynamicId } from "@/utils/scan-code-gun";
import NumberKeyboard from "./NumberKeyboard";
import { stringToNumber } from "@/utils/money";
import { delay } from "@/utils/delay";
import ticket from "./smallTicket";

export default {
  name: "OrderProcess",
  components: { ticket, NumberKeyboard },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      PaymentMethod,
      paymentMethod: PaymentMethod.B_SCAN_C,
      amountString: "",
      payFailedMessage: "",
      showSuccessMask: false,
      showFailMask: false,
      payLoading: false,
      flowList: [],
      stateList: [
        {
          id: 1,
          label: "待支付",
          icon: require("../assets/images/payIcon02.png"),
          iconActive: require("../assets/images/payIcon02.png"),
          orderState: 0,
        },
        {
          id: 2,
          label: "支付中",
          icon: require("../assets/images/payIcon04.png"),
          iconActive: require("../assets/images/payIcon12.png"),
          orderState: 1,
        },
        {
          id: 3,
          label: "支付完成",
          icon: require("../assets/images/payIcon03.png"),
          iconActive: require("../assets/images/payIcon11.png"),
          orderState: 2,
        },
        {
          id: 4,
          label: "打印小票",
          icon: require("../assets/images/payIcon01.png"),
          iconActive: require("../assets/images/payIcon08.png"),
          orderState: 3,
        },
      ],
      btnList: [
        {
          id: 1,
          icon: require("../assets/images/paybtn01.png"),
          label: "我扫顾客",
          nameSign: "",
        },
        {
          id: 2,
          icon: require("../assets/images/paybtn02.png"),
          label: "顾客扫我",
          nameSign: "",
        },
        {
          id: 3,
          icon: require("../assets/images/paybtn03.png"),
          label: "刷卡支付",
          nameSign: "",
        },
        {
          id: 4,
          icon: require("../assets/images/paybtn04.png"),
          label: "现金支付",
          nameSign: "",
        },
        {
          id: 5,
          icon: require("../assets/images/paybtn04.png"),
          label: "支付宝",
          nameSign: "alipay",
        },
        {
          id: 6,
          icon: require("../assets/images/paybtn04.png"),
          label: "微信支付",
          nameSign: "wechatpay",
        },
      ],
      btnIndex: -1,
      stateTitle: "",
      stateList1: [
        {
          id: 1,
          label: "确认金额",
          icon: require("../assets/images/payIcon02.png"),
          iconActive: require("../assets/images/payIcon02.png"),
          orderState: 0,
        },
        {
          id: 2,
          label: "付款中",
          icon: require("../assets/images/payIcon04.png"),
          iconActive: require("../assets/images/payIcon12.png"),
          orderState: 1,
        },
        {
          id: 3,
          label: "付款成功",
          icon: require("../assets/images/payIcon03.png"),
          iconActive: require("../assets/images/payIcon11.png"),
          orderState: 2,
        },
      ],
      isShow: false,
      payLoading: false,
      flowList: [],
      showSuccessMask: false,
      showFailMask: false,
    };
  },
  mounted() {
    console.log(this.orderStatus);
  },
  computed: {
    ...mapState("order", ["orderStatus", "orderInfo"]),
    ...mapGetters("flow", ["currentFlowStatus"]),
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
    },
  },
  filters: {
    money(value) {
      const num = Number(value);

      if (num % 1 === 0) return num;
      return num.toFixed(2);
    },
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
          this.payFailedMessage = "";
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
    },
  },
  methods: {
    ...mapActions("flow", [
      "createFlow",
      "payFlow",
      "getFlowList",
      "cancelLoopFlowDetail",
    ]),
    ...mapMutations("order", ["updateOrderStatus"]),
    ...mapActions("order", ["getOrderDetail"]),
    ...mapMutations("cart", ["clearCart"]),
    bindBtn(index) {
      this.btnIndex = index;
      this.stateTitle = this.btnList[index].label;
    },
    selectPaymentMethod(method) {
      this.paymentMethod = method;
    },

    async waitAndQueryOrderStatus() {
      await delay(500);
      const { payableAmount, paidAmount, status } = await this.getOrderDetail();

      if (paidAmount >= payableAmount || status === "completed") {
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
        await this.createFlow({
          paymentMethod: this.paymentMethod,
          amount: this.amount,
        });

        if (this.paymentMethod === PaymentMethod.B_SCAN_C) {
          const dynamicId = await waitingDynamicId();
          await this.payFlow(dynamicId);
        }

        await this.waitAndQueryOrderStatus();
        this.amountString = this.waitingPaidAmount.toString();
        this.$refs.mychild.detail();
      } catch (error) {
        this.payFailedMessage = error.message;
      } finally {
        this.payLoading = false;
      }
    },

    print() {
      // this.updateOrderStatus(OrderStatus.PRINT);
      this.$refs.mychild.print();
    },
    back() {
      this.btnIndex = -1;
    },
  },
};
</script>

<style lang="scss" scoped>
.order-process {
  display: flex;
  .order-left {
    width: 139px;
    padding: 20px 0;
    border-right: 1px solid #eeeeee;
    .payment-list {
      .payment-item {
        padding: 0 16px 0 30px;
        position: relative;
        & + .payment-item {
          margin-top: 32px;
        }
        .content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          span {
            color: #000000;
            font-size: 22px;
            font-weight: bold;
          }
          b {
            background: #000;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            &.active {
              background: rgba(0, 0, 0, 0.25);
            }
          }
        }
        .tips {
          color: rgba(0, 0, 0, 0.5);
        }
        .line {
          display: inline-block;
          width: 1px;
          height: 50px;
          background: rgba(0, 0, 0, 0.25);
          position: absolute;
          top: 30px;
          right: 25px;
        }
      }
    }
  }
  .order-right {
    padding: 23px 0 20px 23px;
    display: flex;
    .btn-group {
      display: flex;
      flex-direction: column;
      width: 35%;
      .el-button {
        width: 116px;
        border-radius: 2px;
        position: relative;
      }
      .el-button + .el-button {
        margin-left: 0;
        margin-top: 21px;
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
      i {
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-left: 6px solid #000;
        border-bottom: 6px solid transparent;
        font-size: 0;
        line-height: 0;
        position: absolute;
        right: -6px;
        top: 50%;
        margin-top: -8px;
      }
    }
    .pay-content-group {
      .alipay-tips {
          width: 174px;
          height: 51px;
          line-height: 51px;
          font-size: 16px;
          color: #000;
          background: #FFFFFF;
          border-radius: 26px;
          margin: 35px auto 64px;
          font-weight: bold;
        }
        .qrcode-img {
          width: 324px;
          height: 324px;
        }
    }
    .keyboard-box {
      margin-left: 63px;
    }
  }
}
.my-dialog {
  .content-box {
    height: 575px;
  }
}
</style>