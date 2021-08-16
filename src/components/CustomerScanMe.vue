<!-- 顾客扫我 -->
<template>
  <el-dialog
    :visible.sync="isShow"
    :show-close="false"
    :close-on-click-modal="false"
    width="674px"
    append-to-body
  >
    <div
      class="nav-title"
      style="margin-top: -50px;margin-left: 0;"
      @click="back"
    >
      <img
        src="../assets/images/return01.png"
        style="width: 17px;height: 17px;"
        alt=""
      />
      <p style="font-size: 14px;color: #000;margin-left: 13px;">
        切换其他支付方式
      </p>
    </div>
    <div class="content-box">
      <h2>{{title}}</h2>
      <div class="price">
        <span>已收：80元</span>
        <span>未收：280元</span>
      </div>
      <div class="state-list">
        <div class="state-item" v-for="(item,index) in stateList" :key="item.id">
          <img :src="item.orderState<=orderStatus?item.iconActive:item.icon" class="stateImg">
          <p :class="['stateName', {active: item.orderState<=orderStatus}]">{{item.label}} <span :class="['stateLine', {active: item.orderState<=orderStatus}]" v-if="index!=stateList.length-1">----------</span></p>
        </div>
      </div>
      <number-keyboard placeholder="请输入收款金额" v-model="inputPrice">
        <el-button type="primary" @click="bindPay" class="pay-btn" :disabled="amount <= 0" :loading="payLoading">支付</el-button>
      </number-keyboard>
    </div>
  </el-dialog>
</template>

<script>
import NumberKeyboard from './NumberKeyboard';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'CustomerScanMe',
  components: {
    NumberKeyboard
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    amountString: String,
    amount: Number,
    title: String
  },
  watch: {
    isVisible() {
      this.isShow = this.isVisible
    },
    amount() {
      console.log(this.amount);
      this.inputPrice = this.amount
    }
  },
  computed: {
    ...mapState('order', ['orderStatus', 'orderInfo']),
  },
  mounted() {
  },
  data() {
    return {
      stateList: [
        {id: 1, label: '确认金额', icon: require('../assets/images/payIcon02.png'), iconActive: require('../assets/images/payIcon02.png'), orderState: 0},
        {id: 2, label: '付款中', icon: require('../assets/images/payIcon04.png'), iconActive: require('../assets/images/payIcon12.png'), orderState: 1},
        {id: 3, label: '付款成功', icon: require('../assets/images/payIcon03.png'), iconActive: require('../assets/images/payIcon11.png'), orderState: 2}
      ],
      inputPrice: '',
      orderStatus: 0,
      isShow: false,
      payLoading: false
    };
  },
  methods: {
    close() {
      this.isShow = false
      this.$parent.btnIndex = -1
    },
    back() {
      this.close()
    },
    bindPay() {
      console.log(1);
      if (this.payLoading) {
        return
      }
      this.payLoading = true
      this.orderStatus = 1
      // this.$emit('bindPay')
    }
  },
};
</script>

<style lang="scss" scoped>
.el-dialog__body {
  height: 575px;
}
.nav-title {
  padding-top: 23px;
  display: flex;
  align-items: center;
  margin-left: 20px;
  cursor: pointer;
}
.content-box {
  text-align: center;
  margin-top: 20px;
  h2 {
    font-size: 22px;
    color: #000;
  }
  .price {
    color: #969696;
    font-size: 14px;
    margin-top: 18px;
    span {
      display: inline-+block;
      & + span {
        margin-left: 33px;
      }
    }
  }
  .state-list {
    margin: 40px auto 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    .state-item {
      .stateLine{
        color: #969696;
        margin: 28px 7px 0 7px;
        &.active {
          color: #000;
        }
      }
      .stateImg{
        display: block;
        width: 20px;
        height: 20px;
        margin-left: 14px;
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
  }
}
.pay-btn {
  width: 100%;
  height: 100%;
  border-radius: 0;
}
</style>
