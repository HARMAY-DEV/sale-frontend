<template>
  <div class="order-container">
    <div class="order-list">
      <el-input class="order-search-input" type="search" clearable v-model="searchId">
        <el-button @click="updateOrderId(searchId)" slot="append" icon="el-icon-search"></el-button>
      </el-input>

      <order-card @update-order-id="updateOrderId($event)" v-for="order in orderList" :key="order.orderId" v-bind="order"></order-card>
    </div>
    <order-detail :id="orderId"></order-detail>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
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
      searchId: '',
      orderId: '',
    };
  },
  computed: {
    ...mapState('order', ['orderList']),
  },
  watch: {
    orderList(value) {
      if (value.length > 0) {
        this.orderId = this.orderList[0].id;
      }
    },
  },
  created() {
    this.getOrderList();
  },
  methods: {
    ...mapActions('order', ['getOrderList']),

    updateOrderId(id) {
      this.orderId = id;
    }
  }
}
</script>

<style lang="scss" scoped>
.order-container {
  display: flex;
}

.order-list {
  flex: 0 1 40%;
  margin-right: 10px;
  overflow-y: auto;

  .order-search-input {
    position: sticky;
    top: 0;
  }
}
</style>