<template>
  <div class="order-card" @click="$emit('update-order-id', id)">
    <div class="left-panel">
      <div class="order-number">订单号: {{ id }}</div>
      <div class="order-time-pay-mode">
        <span>下单时间: {{ time }}</span>
        <span>{{ paymentMethod }}</span>
      </div>
    </div>
    <div class="right-panel">
      <span class="order-price">￥ {{ paidAmount }}</span>
      <ip-check-one v-if="status.value === 'paySuccess'" theme="two-tone" size="24" :fill="['#ffffff' ,'#34c758']" />
      <ip-time v-else-if="status.value === 'waitPay'" theme="two-tone" size="24" :fill="['#ffffff' ,'#e4c741']" />
      <ip-close-one v-else-if="status.value === 'payFail'" theme="two-tone" size="24" :fill="['#ffffff' ,'#e92139']" />
      <ip-abnormal v-else theme="filled" size="24" fill="#F56C6C" />
      
    </div>
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
  },
}
</script>

<style lang="scss" scoped>
.order-card {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border: 1px solid #ebeef5;
  border-radius: 2px;
}

.left-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  line-height: 20px;

  .order-number {
    font-size: 14px;
    font-weight: 600;
    color: #121212;
  }

  .order-time-pay-mode {
    font-size: 12px;
    color: #6a6a99;

    span:first-child {
      margin-right: 20px;
    }
  }
}

.right-panel {
  display: flex;
  justify-content: center;
  align-items: center;

  .order-price {
    font-size: 18px;
    font-weight: 700;
    color: #121212;
    padding: 10px;
  }
}
</style>