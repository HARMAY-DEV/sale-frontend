<template>
  <div class="order-container">
    <div class="order-list">
      <el-input class="order-search-input" type="search" clearable v-model="searchId">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>

      <order-card @get-data="getData($event)" v-for="order in orderList" :key="order.orderId" v-bind="order"></order-card>
    </div>
    <order-detail></order-detail>
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
      searchId: null,
      currentOrderId: '',
    };
  },
  computed: {
    ...mapState('order', ['orderList']),
  },
  created() {
    this.getOrderList();
  },
  methods: {
    ...mapActions('order', ['getOrderList', 'getOrderDetail']),
    ...mapActions('flow', ['']),

    async getData(id) {
      console.log(this.currentOrderId);
      this.getOrderDetail(id);
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