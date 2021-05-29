<template>
  <div class="cart-container">
    <div class="input-container">
      <el-input ref="searchInput" type="search" @keyup.enter.native="search()" clearable v-model="searchGoodsNo">
        <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
      </el-input>
    </div>
    <div v-if="goodsList.length" class="goods-list">
      <goods-card v-for="goods in goodsList" :key="goods.id" v-bind="goods"></goods-card>
    </div>
    <div v-else class="goods-list" @touchmove.stop>
      <h2 class="empty-goods">暂无商品，扫码添加</h2>
    </div>
    <div class="footer">
      <el-button :disabled="!goodsList.length" style="margin-right: auto;" type="danger" @click="clearCart()">清除购物车</el-button>
      <div v-show="goodsList.length" class="goods-summary">
        <div>{{ totalCount }} 件</div>
        <div>￥ {{ totalAmount }}</div>
      </div>
      <!-- 这里的付款实际上为创建订单，付款弹窗的付款才为实际的付款 -->
      <el-button :disabled="!goodsList.length" type="success" @click="createNewOrder()">付款</el-button>
    </div>

    <el-drawer
      :visible.sync="searchPanelVisible"
      direction="btt"
      :modal-append-to-body="false"
      :show-close="false"
      size="70%"
      custom-class="search-panel"
    >
      <goods-card v-if="searchGoods" v-bind="searchGoods" from-search @close-panel="searchPanelVisible = false"></goods-card>
      <p v-else>找不到该商品，请核实</p>
    </el-drawer>

    <el-dialog :visible.sync="payDialogVisible" :show-close="false" :close-on-click-modal="false" width="60%">
      <span slot="title" @click="backCart()"><i class="el-icon-arrow-left"></i>返回点单</span>
      <order-process></order-process>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

import GoodsCard from '@/components/goods-card.vue';
import OrderProcess from '@/components/order-process.vue';
import { OrderStatus } from '@/utils/consts';

export default {
  name: 'Cart',
  components: { GoodsCard, OrderProcess },

  data() {
    return {
      searchPanelVisible: false,
      payDialogVisible: false,
      searchGoodsNo: '',
      keyboardNo: '',
    };
  },

  computed: {
    ...mapState('order', ['orderId', 'orderStatus']),
    ...mapState('cart', ['searchGoods', 'goodsList', 'totalAmount', 'totalCount']),
  },

  created() {
    this.getCartGoodsList();
  },

  mounted() {
    this.$refs.searchInput.focus();

    document.body.addEventListener('keydown', this.gunHandler);
  },

  beforeDestroy() {
    document.body.removeEventListener('keydown', this.gunHandler);
  },

  methods: {
    ...mapMutations('cart', ['clearCart']),
    ...mapActions('cart', ['getGoodsInfo', 'getCartGoodsList']),
    ...mapActions('order', ['createOrder', 'refundWholeOrder']),

    gunHandler(event) {
      if (this.$refs.searchInput.focused || this.payDialogVisible) {
        return;
      }

      if (event.key === 'Enter') {
        this.searchGoodsNo = this.keyboardNo;
        this.search();
      } else {
        this.keyboardNo += event.key;
      }
    },

    async search() {
      if (!this.searchGoodsNo) {
        this.$refs.searchInput.focus();
        return;
      }

      this.keyboardNo = '';

      try {
        await this.getGoodsInfo(this.searchGoodsNo);
        this.searchPanelVisible = true;
        this.searchGoodsNo = '';
      } catch (error) {
        this.$message.error(error.message);
      }
    },

    async createNewOrder() {
      await this.createOrder();
      this.payDialogVisible = true;
    },

    backCart() {
      if (this.orderStatus === OrderStatus.PAYING) {
        this.$confirm('已经支付金额将全部退回？', '取消订单', {
          showClose: true,
          closeOnClickModal: false,
          cancelButtonText: '清空购物车',
          confirmButtonText: '添加商品',
          distinguishCancelAndClose: true,
          type: 'error',
        }).then(() => {
          return this.refundWholeOrder(this.orderId).then(() => {
            this.payDialogVisible = false;
          });
        }).catch((action) => {
          if (action === 'close') {
            return;
          }

          return this.refundWholeOrder(this.orderId).then(() => {
            this.clearCart();
            this.payDialogVisible = false;
          });
        });
      } else {
        this.payDialogVisible = false;
      }
    }
  }
}
</script>

<style lang="scss">
.search-panel {
  padding: 12px;
}
</style>

<style lang="scss" scoped>
.cart-container {
  position: relative;
  display: flex;
  flex-direction: column;

  .goods-list {
    display: flex;
    flex-direction: column;
    flex: auto;
    overflow-y: auto;
    margin: 12px 0;

    .empty-goods {
      margin: auto;
      text-align: center;
    }
  }

  .footer {
    display: flex;

    .goods-summary {
      margin-right: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: right;
    }
  }
}
</style>