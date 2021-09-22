<template>
  <!-- 支付弹窗 -->
  <el-dialog
    :visible.sync="isShowPay"
    :show-close="false"
    :close-on-click-modal="false"
    width="860px"
    custom-class="pay-dialog"
    destroy-on-close
  >
    <div class="pay-dialog-group">
      <div class="pay-left">
        <div class="nav-title">
          <div class="back-title" @click="backCart">
            <img
              src="../assets/images/return01.png"
              style="width: 17px; height: 17px"
              alt=""
            />
            <p style="font-size: 14px; color: #000; margin-left: 13px">
              返回点单
            </p>
          </div>
          <div class="center-title" v-if="!isShowLogin">
            <h2>
              还需支付 <span>¥ {{ waitingPaidAmount }}</span>
            </h2>
            <p>
              <span>应收：{{ payableAmount | money }}元</span
              ><span>已收：{{ paidAmount | money }}元</span>
            </p>
          </div>
          <div class="center-title" v-else>
            <h2>还需支付</h2>
            <p class="money">¥ {{ waitingPaidAmount }}</p>
          </div>
          <div class="dian">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="order-process">
          <div class="order-left">
            <div class="payment-list">
              <div class="payment-item">
                <p class="content">
                  <span>¥{{ waitingPaidAmount }}</span>
                  <b>
                    <i>></i>
                  </b>
                </p>
                <p class="tips">{{ payTypeItem.label }}</p>
                <!-- <span class="line"></span> -->
              </div>
              <!-- <div
                class="payment-item"
                v-for="(item, index) in flowList"
                :key="item.id"
              >
                <p class="content">
                  <span>¥{{ item.price }}</span>
                  <b :class="{ active: index != flowList.length - 1 }">
                    <i>></i>
                  </b>
                </p>
                <p class="tips">{{ item.label }}</p>
                <span
                  class="line"
                  v-show="index != flowList.length - 1"
                ></span>
              </div> -->
            </div>
          </div>
          <div class="order-right">
            <div class="btn-group">
              <el-button
                type="primary"
                v-for="(item, index) in btnList"
                :key="item.id"
                @click="bindPayTypeBtn(item, index)"
              >
                <div class="btn-box">
                  <img :src="item.icon" />
                  <span>{{ item.label }}</span>
                </div>
                <i v-show="index == btnIndex"></i>
              </el-button>
            </div>
            <confirm-dialog
              :isShow="isShowConfirmDialog"
              @cancle="bindCancleCutPay"
              @change="changePayType"
              :title="'是否切换支付方式'"
              :tips="'如顾客已在支付中，切换前请提示顾客先取消'"
            ></confirm-dialog>
            <div style="width: 100%; position: relative" v-if="!isShowLogin">
              <div
                class="right-panel"
                v-loading="payLoading"
                element-loading-text="等待确认中..."
                :style="payLoading ? 'z-index:1' : 'z-index:-2'"
              >
                <div v-if="showSuccessMask" class="pay-result-box">
                  <ip-check-one theme="filled" size="48" fill="#67C23A" />
                  <p>支付成功</p>
                </div>
                <div v-if="showFailMask" class="pay-result-box">
                  <ip-caution theme="filled" size="48" fill="#F56C6C" />
                  <p>支付失败</p>
                  <div>{{ payFailedMessage }}</div>
                </div>
              </div>
              <!-- 现金支付 -->
              <div v-if="payTypeItem.nameSign == 'moneypay'">
                <number-keyboard v-model="amountString" v-if="!qrcodeAlipay">
                  <div slot="money-btn" class="moneypay-btn">
                    <span>¥{{Math.ceil(amountString)}}</span>
                    <span>¥{{Math.ceil(amountString)}}</span>
                    <span>¥{{Math.ceil(amountString)}}</span>
                  </div>
                  <img
                    src="../assets/images/keyword-qrcode.png"
                    alt=""
                    @click="pay"
                  />
                </number-keyboard>
                <scancode-pay
                  :name="
                    payTypeItem.nameSign == 'alipay'
                      ? '支付宝'
                      : payTypeItem.nameSign == 'wechatpay'
                      ? '微信'
                      : '其他'
                  "
                  v-else
                ></scancode-pay>
              </div>
              <!-- 支付宝 微信支付 -->
              <div
                v-if="
                  payTypeItem.nameSign == 'alipay' ||
                  payTypeItem.nameSign == 'wechatpay'
                "
              >
                <number-keyboard v-model="amountString" v-if="!qrcodeAlipay">
                  <img
                    src="../assets/images/keyword-qrcode.png"
                    alt=""
                    @click="bindQrcodePay"
                  />
                </number-keyboard>
                <scancode-pay
                  :name="
                    payTypeItem.nameSign == 'alipay'
                      ? '支付宝'
                      : payTypeItem.nameSign == 'wechatpay'
                      ? '微信'
                      : '其他'
                  "
                  v-else
                ></scancode-pay>
              </div>
              <!-- 扫码支付 -->
              <div
                class="keyboard-box"
                v-else-if="payTypeItem.nameSign == 'qrcodpay'"
              >
                <number-keyboard v-model="amountString">
                  <img src="../assets/images/keyword-scan.png" @click="pay" />
                </number-keyboard>
              </div>
            </div>
          </div>
          <ticket ref="mychild" :id="orderInfo.id"></ticket>
        </div>
      </div>
      <div class="pay-right">
        <div class="bind-content-group" v-if="isShowLogin">
          <div class="bind-type-list">
            <p
              :class="['bind-type-item', { active: memberTypeIdx == index }]"
              v-for="(item, index) in bindTypeList"
              :key="item.id"
              @click="bindMemberType(index)"
            >
              {{ item.label }}
            </p>
          </div>
          <div v-if="memberTypeIdx == 0">00</div>
          <div v-else-if="memberTypeIdx == 1">
            <iphone-keyword @typing="changeIphone"></iphone-keyword>
          </div>
          <div v-else class="bind-type-content">
            <p class="tips">请顾客用微信扫码</p>
            <img src="../assets/images/QRcode.png" alt="" class="qrcode-img" />
          </div>
        </div>
        <div class="bind-member-group">
          <template v-if="type == 1">
            <img :src="userObj.head" class="img" />
            <h3 class="bind-account">{{ userObj.name }}</h3>
            <p class="tips">{{ userObj.phone }}</p>
            <img class="grade-img" src="../assets/images/vip_puka.png" alt="" />
          </template>
          <template v-else>
            <img
              src="../assets/images/no-member.png"
              class="img"
              v-if="!isShowLogin"
              @click="bindAccount"
            />
            <img
              src="../assets/images/headImg-del.png"
              class="img"
              v-else
              @click="bindCloseAccount"
            />
            <h3 class="bind-account">绑定账户</h3>
            <p class="tips">查看账户信息</p>
          </template>
          <div class="usable-price active">- <span>可用余额</span> -</div>
          <p class="money active">¥ 0</p>
          <div class="usable-price">- <span>可用积分</span> -</div>s
          <p class="money">{{ userObj.integral }}</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { FlowStatus, OrderStatus, PaymentMethod } from "@/utils/consts";
import { waitingDynamicId } from "@/utils/scan-code-gun";
import NumberKeyboard from "./NumberKeyboard";
import { stringToNumber } from "@/utils/money";
import { delay } from "@/utils/delay";
import ticket from "./smallTicket";
import ScancodePay from "./ScancodePay.vue";
import ConfirmDialog from "./ConfirmDialog.vue";
import IphoneKeyword from "./IphoneKeyword.vue";
export default {
  name: "OrderProcess",
  components: {
    ticket,
    NumberKeyboard,
    ScancodePay,
    ConfirmDialog,
    IphoneKeyword,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    payDialogVisible: {
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
          label: "扫码支付",
          nameSign: "qrcodpay",
        },
        {
          id: 4,
          icon: require("../assets/images/paybtn04.png"),
          label: "现金支付",
          nameSign: "moneypay",
        },
        {
          id: 5,
          icon: require("../assets/images/paybtn04.png"),
          label: "支付宝支付",
          nameSign: "alipay",
        },
        {
          id: 6,
          icon: require("../assets/images/paybtn04.png"),
          label: "微信支付",
          nameSign: "wechatpay",
        },
        {
          id: 6,
          icon: require("../assets/images/paybtn04.png"),
          label: "刷卡支付",
          nameSign: "swipinpay",
        },
      ],
      btnIndex: 0,
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
      flowList: [],
      showSuccessMask: false,
      showFailMask: false,
      payOptions: [
        { id: 1, label: "支付宝", price: "32" },
        { id: 2, label: "微信", price: "32" },
      ],
      payTypeItem: {},
      memberTypeIdx: 0,
      bindTypeList: [
        { id: 1, label: "扫描会员码" },
        { id: 2, label: "输入手机号" },
        { id: 3, label: "展示签到码" },
      ],
      isShowPay: false,
      qrcodeAlipay: false,
      isShowConfirmDialog: false,
      payTypeIdx: -1,
      payBtnItem: {},
      isShowLogin: false,
      // iphoneVal: "",
    };
  },
  mounted() {
    this.payTypeItem = this.btnList[0];
    console.log(this.userObj);
    console.log(this.type);
  },
  computed: {
    ...mapState("order", ["orderStatus", "orderInfo"]),
    ...mapGetters("flow", ["currentFlowStatus"]),
    ...mapState("h5", ["userObj", "type", "Image"]),
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
    payDialogVisible() {
      this.isShowPay = this.payDialogVisible;
      console.log(this.isShowPay);
    },
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
    ...mapActions("order", ["getOrderDetail", "refundWholeOrder"]),
    ...mapMutations("cart", ["clearCart"]),
    bindCloseAccount() {
      this.isShowLogin = false;
    },
    changeIphone(val) {
      this.iphoneVal = val
      console.log(val);
    },
    bindAccount() {
      this.isShowLogin = true;
      this.btnIndex == -1;
    },
    bindQrcodePay() {
      this.qrcodeAlipay = true;
    },
    initPayType() {
      this.qrcodeAlipay = false;
      this.isShowConfirmDialog = false;
      this.isShowLogin = false;
    },
    bindPayTypeBtn(item, index) {
      if (this.isShowLogin) return;
      this.isShowConfirmDialog = true;
      this.stateTitle = this.btnList[index].label;
      this.payTypeIdx = index;
      this.payBtnItem = item;
    },
    bindCancleCutPay() {
      this.isShowConfirmDialog = false;
    },
    changePayType() {
      this.btnIndex = this.payTypeIdx;
      this.payTypeItem = this.payBtnItem;
      this.initPayType();
    },
    selectPaymentMethod(method) {
      this.paymentMethod = method;
    },
    bindMemberType(index) {
      this.memberTypeIdx = index;
    },
    backCart() {
      if (this.orderStatus === OrderStatus.PAYING) {
        this.$confirm("已经支付金额将全部退回？", "取消订单", {
          showClose: true,
          closeOnClickModal: false,
          cancelButtonText: "清空购物车",
          confirmButtonText: "添加商品",
          distinguishCancelAndClose: true,
          type: "error",
        })
          .then(() => {
            return this.refundWholeOrder(this.orderId).then(() => {
              this.isShowPay = false;
              this.$emit("closePayDialog", false);
            });
          })
          .catch((action) => {
            if (action === "close") {
              return;
            }
            return this.refundWholeOrder(this.orderId).then(() => {
              this.clearCart();
              this.isShowPay = false;
              this.$emit("closePayDialog", false);
            });
          });
      } else {
        this.isShowPay = false;
        this.$emit("closePayDialog", false);
      }
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
      console.log(this.payloading);
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

<style lang="scss">
.pay-dialog {
  border-radius: 10px;
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
<style lang="scss" scoped>
.pay-dialog-group {
  display: flex;
  height: 700px;
  .pay-left {
    min-width: 316px;
    .nav-title {
      height: 81px;
      line-height: 81px;
      border-bottom: 1px solid #eeeeee;
      display: flex;
      align-items: center;
      padding: 0 30px;
      cursor: pointer;
      justify-content: space-between;
      .back-title {
        display: flex;
        align-items: center;
      }
      .center-title {
        line-height: 1;
        h2 {
          font-size: 18px;
          color: #000;
          span {
            display: inline-block;
            color: #b51f29;
            margin-left: 3px;
          }
        }
        p {
          margin-top: 8px;
          font-size: 14px;
          color: #969696;
          span + span {
            margin-left: 8px;
          }
        }
        .money {
          color: #b51f29;
          font-size: 18px;
          font-weight: bold;
        }
      }
      .dian {
        display: flex;
        flex-direction: column;
        span {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #000;
          & + span {
            margin-top: 2px;
          }
        }
      }
    }
  }
  .pay-right {
    flex: 1;
    background: #f8f8f8;
    text-align: center;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    .bind-content-group {
      flex: 1;
      .bind-type-list {
        display: flex;
        align-items: center;
        .bind-type-item {
          text-align: center;
          height: 78px;
          line-height: 78px;
          color: rgba(0, 0, 0, 0.7);
          font-size: 18px;
          border-bottom: 3px solid transparent;
          margin-left: 45px;
          &.active {
            color: #000;
            border-bottom: 3px solid #000;
            font-weight: bold;
          }
        }
      }
      .bind-type-content {
        .tips {
          width: 174px;
          height: 51px;
          line-height: 51px;
          font-size: 16px;
          color: #000;
          background: #ffffff;
          border-radius: 26px;
          margin: 35px auto 64px;
          font-weight: bold;
        }
        .qrcode-img {
          width: 324px;
          height: 324px;
        }
      }
    }
    .bind-member-group {
      padding: 20px 0;
      width: 106px;
      border-left: 1px solid #eee;
      .grade-img {
        width: 66px;
        margin-top: 7px;
      }
      .usable-integral {
      }
    }
    .img {
      width: 49px;
      height: 49px;
    }
    .bind-account {
      font-size: 16px;
      color: #000;
      margin-top: 5px;
    }
    .tips {
      color: rgba(0, 0, 0, 0.7);
      margin-top: 3px;
    }
    .usable-price {
      color: #282828;
      font-size: 14px;
      margin-top: 64px;
      &.active {
        color: rgba(40, 40, 40, 0.38);
      }
    }
    .money {
      color: #282828;
      font-size: 22px;
      margin-top: 11px;
      &.active {
        color: rgba(40, 40, 40, 0.38);
      }
    }
  }
}
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
    .right-panel {
      position: absolute;
      top: 0;
      left: 10px;
      right: 0;
      bottom: 0;
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
    .moneypay-btn {
      margin-top: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        display: inline-block;
        padding: 0 11px;
        height: 29px;
        line-height: 29px;
        background: #000;
        color: #fff;
        font-size: 18px;
        border-radius: 15px;
        & + span {
          margin-left: 9px;
        }
      }
    }
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
  }
}
.my-dialog {
  .content-box {
    height: 575px;
  }
}
</style>
