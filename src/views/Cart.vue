<template>
  <div class="cart-container">
    <div class="input-container">
      <el-input ref="searchInput" type="search" clearable v-model="searchGoodsNo">
        <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
      </el-input>
    </div>
    <div v-if="goodsList.length" class="goods-list">
      <goods-card v-for="goods in goodsList" :key="goods.id" v-bind="goods"></goods-card>
    </div>
    <div v-else class="goods-list">
      <h2 class="empty-goods">暂无商品，扫码添加</h2>
    </div>
    <div class="footer">
      <el-button :disabled="!goodsList.length" style="margin-right: auto;" type="danger" @click="clearCart()">清除购物车</el-button>
      <div v-show="goodsList.length" class="goods-summary">
        <div>{{ goodsCount }} 件</div>
        <div>￥ {{ goodsValue }}</div>
      </div>
      <el-button :disabled="!goodsList.length" type="success">付款</el-button>
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

    <el-dialog :visible.sync="payDialogVisible">
      <span slot="title"><i class="el-icon-arrow-left"></i>返回点单</span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

import GoodsCard from '@/components/goods-card.vue';

const PAY_STATUS = new Map([
  ['WAITING', Symbol('WAITING')], // 等待支付
  ['PAYING', Symbol('PAYING')], // 支付中
  ['FINISHED', Symbol('FINISHED')], // 支付完成
  ['PRINT', Symbol('PRINT')], // 打印小票
]);

export default {
  name: 'Cart',
  components: { GoodsCard },
  data() {
    return {
      searchPanelVisible: false,
      payDialogVisible: false,
      searchGoodsNo: '',
    };
  },
  computed: {
    ...mapState('cart', ['searchGoods', 'goodsList']),
    ...mapGetters('cart', ['goodsCount', 'goodsValue']),
  },
  created() {
    this.getCartGoodsList();
  },
  methods: {
    ...mapMutations('cart', ['clearCart']),
    ...mapActions('cart', ['getGoodsInfo', 'getCartGoodsList']),
    async search() {
      if (!this.searchGoodsNo) {
        this.$refs.searchInput.focus();
        return;
      }

      await this.getGoodsInfo(this.searchGoodsNo);
      this.searchPanelVisible = true;
      this.searchGoodsNo = '';
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