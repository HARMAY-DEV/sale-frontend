<template>
  <div class="order-container">
    <div class="order-list">
      <el-input type="search" clearable v-model="searchId">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>

      <order-card v-for="order in orderList" :key="order.orderId" v-bind="order"></order-card>
    </div>
    <order-detail></order-detail>
  </div>
</template>

<script>
import OrderCard from '@/components/order-card.vue';
import OrderDetail from '@/components/order-detail.vue';

export default {
  name: 'Order',
  components: {
    OrderCard,
    OrderDetail,
  },
  data() {
    return {
      searchId: null,
      orderList: [
        {
          orderId: 13214213,
          time: '2021-01-23 12:43',
          payMode: '组合支付',
          price: 998,
          status: 'FINISHED',
        }
      ]
    };
  },
}
</script>

<style lang="scss" scoped>
.order-container {
  display: flex;
}

.order-list {
  flex: 0 1 40%;
  margin-right: 10px;
}
</style>