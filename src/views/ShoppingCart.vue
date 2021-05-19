<template>
  <div class="shopping-cart">
    <div class="input-container">
      <el-input type="search" clearable v-model="text">
        <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
      </el-input>
    </div>
    <div class="goods-list">
      <goods-card v-for="goods in goodsList" :key="goods.id" v-bind="goods"></goods-card>
    </div>
    <div class="footer">
      <el-button type="danger">清除购物车</el-button>
      <div class="goods-summary">
        <div>{{ goodsCount }} 件</div>
        <div>￥ {{ goodsValue }}</div>
      </div>
      <el-button type="success">付款</el-button>
    </div>

    <el-drawer
      :visible.sync="searchPanelVisible"
      direction="btt"
      :modal-append-to-body="false"
      :show-close="false"
      size="70%"
      custom-class="search-panel"
    >
      <goods-card v-bind="searchGoods" from-search></goods-card>
    </el-drawer>

    <el-dialog :visible.sync="payDialogVisible">
      <span slot="title"><i class="el-icon-arrow-left"></i>返回点单</span>
    </el-dialog>
  </div>
</template>

<script>
import GoodsCard from '@/components/goods-card.vue';

const PAY_STATUS = new Map([
  ['WAITING', Symbol('WAITING')], // 等待支付
  ['PAYING', Symbol('PAYING')], // 支付中
  ['FINISHED', Symbol('FINISHED')], // 支付完成
  ['PRINT', Symbol('PRINT')], // 打印小票
]);

export default {
  name: 'ShoppingCart',
  components: { GoodsCard },
  data() {
    return {
      searchPanelVisible: false,
      payDialogVisible: false,
      text: '',
      goodsCount: 0,
      goodsValue: 0,
      searchGoods: {
        id: '123',
        name: '舒肤佳',
        price: 299,
        stock: 23,
        picture: '',
        specs: '200ml',
      },
      goodsList: [
        {
          id: '123',
          name: '舒肤佳',
          price: 299,
          stock: 23,
          picture: '',
          specs: '200ml',
        }
      ]
    };
  },
  methods: {
    search() {
      this.searchPanelVisible = true;
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
.shopping-cart {
  position: relative;
  display: flex;
  flex-direction: column;

  .goods-list {
    flex: auto;
    overflow-y: auto;
    margin: 12px 0;
  }

  .footer {
    display: flex;

    .goods-summary {
      margin-left: auto;
      margin-right: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: right;
    }
  }
}
</style>