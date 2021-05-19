<template>
  <div class="order-card">
    <div class="left-panel">
      <div class="order-number">订单号: {{ orderId }}</div>
      <div class="order-time-pay-mode">
        <span>下单时间: {{ time }}</span>
        <span>{{ payMode }}</span>
      </div>
    </div>
    <div class="right-panel">
      <span class="order-price">￥ {{ price }}</span>
      <ip-check-one theme="two-tone" size="24" :fill="['#ffffff' ,'#34c758']" />
      <!-- <ip-watch theme="two-tone" size="24" :fill="['#ffffff' ,'#e4c741']" /> -->
      <!-- <ip-close-one theme="two-tone" size="24" :fill="['#ffffff' ,'#e92139']" /> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderCard',
  props: {
    orderId: Number,
    time: Number | String,
    payMode: String,
    price: Number,
    status: String,
  }
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