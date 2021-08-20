<template>
  <div :style="orderId == id?'background:#000':''" class="order-card" @click="$emit('update-order-id', id)">
<!--    <p>哈哈哈 {{orderId}}</p>-->
    <div class="orderDetail">
      <p :style="orderId == id?'color:#fff':''" class="order-number">订单号：{{ id }}</p>
      <img v-if="status.value === 'paySuccess'" src="../assets/images/orderIcon03.png" class="orderIcon" alt="">
      <img v-else-if="status.value === 'waitPay'" src="../assets/images/orderIcon01.png" class="orderIcon" alt="">
      <img v-else-if="status.value === 'payFail'" src="../assets/images/orderIcon02.png" class="orderIcon" alt="">
      <img v-else src="../assets/images/orderIcon02.png" class="orderIcon" alt="">
      <p style="flex: 1"></p>
      <p :style="orderId == id?'color:#fff':''" class="order-price">¥{{ paidAmount }}</p>
    </div>
    <p class="orderTime">下单时间： {{ time }} {{ paymentMethod }}</p>
<!--    <div class="left-panel">-->
<!--      <div class="order-number">订单号: {{ id }}</div>-->
<!--      <div class="order-time-pay-mode">-->
<!--        <span>下单时间: {{ time }}</span>-->
<!--        <span>{{ paymentMethod }}</span>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="right-panel">-->
<!--      <span class="order-price">￥ {{ paidAmount }}</span>-->
<!--      <ip-check-one v-if="status.value === 'paySuccess'" theme="two-tone" size="24" :fill="['#ffffff' ,'#34c758']" />-->
<!--      <ip-time v-else-if="status.value === 'waitPay'" theme="two-tone" size="24" :fill="['#ffffff' ,'#e4c741']" />-->
<!--      <ip-close-one v-else-if="status.value === 'payFail'" theme="two-tone" size="24" :fill="['#ffffff' ,'#e92139']" />-->
<!--      <ip-abnormal v-else theme="filled" size="24" fill="#F56C6C" />-->
<!--    </div>-->
  </div>
</template>

<script>
export default {
  name: 'OrderCard',
  props: {
    id: String,
    time: String,
    paymentMethod: String,
    paidAmount: Number,
    status: Object,
    orderId:String
  },
}
</script>

<style lang="scss" scoped>
p{
  padding: 0;
  margin: 0;
}
.order-card {
  width: 92%;
  height: 74px;
  border: 1px solid #EEEEEE;
  margin: 10px 0 0 3%;
  border-radius: 2px;
  .orderDetail{
    display: flex;
    align-items: center;
    margin: 15px 15px 5px 15px;
    .order-number{
      font-size: 16px;
      color: #000000;
    }
    .orderIcon{
      width: 13px;
      height: 13px;
      margin-left: 6px;
    }
    .order-price{
      font-size: 18px;
      color: #000;
      font-weight: 500;
    }
  }
  .orderTime{
    font-size: 12px;
    color: #BFBFBF;
    margin-left: 15px;
  }
}
</style>