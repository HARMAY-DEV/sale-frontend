<template>
  <div class="cart-container">
    <div class="input-container">
      <el-input ref="searchInput" type="search" @keyup.enter.native="search()" clearable v-model="searchGoodsNo">
        <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
      </el-input>
<!--      <el-input ref="searchInput" type="search" clearable v-model="searchGoodsNo" @keyup.enter.native="search()">-->
<!--        <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>-->
<!--      </el-input>-->
    </div>
    <div v-if="goodsList.length" class="goods-list">
      <goods-card v-for="goods in goodsList" :key="goods.id" v-bind="goods"></goods-card>
    </div>
    <div v-else class="goods-list" @touchmove.stop>
      <h2 class="empty-goods">暂无商品，扫码添加</h2>
    </div>
    <div class="footer">
      <el-button :disabled="!goodsList.length" style="margin-right: 10px;" type="danger" @click="clearCart()">清除购物车</el-button>
      <el-button :disabled="!goodsList.length" style="margin-right: auto;" type="danger" @click="clearSn()">移除一物一码</el-button>
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
<!--    移除一物一码-->
    <div v-if="snState == 1">
      <div style="width: 100%;height: 100%;position: fixed;z-index: 1000;top: 0;left: 0;background: #000;opacity: 0.6;"></div>
      <div class="sn">
        <p class="snTitle"> < 取消移除 </p>
        <div class="snDetail">
          <p>商品编码</p>
          <el-input style="width: 300px;margin-left: 10px;" ref="searchInput2" type="search" clearable v-model="searchGoodsNo2">
          </el-input>
        </div>
        <div style="margin-top: 60px;display: flex;justify-content: flex-end">
          <el-button type="info" @click="snCancle()">取消</el-button>
          <el-button type="primary" style="margin-right: 60px;" @click="search2()">确定</el-button>
        </div>
      </div>
    </div>
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
      searchGoodsNo2:'',
      keyboardNo: '',
      snState:0
    };
  },

  computed: {
    ...mapState('order', ['orderId', 'orderStatus']),
    ...mapState('cart', ['searchGoods', 'goodsList', 'totalAmount', 'totalCount']),
  },

  created() {
    this.getCartGoodsList();
    console.log(this.searchGoods)
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
    ...mapActions('cart', ['getGoodsInfo', 'getCartGoodsList','removeFromCart']),
    ...mapActions('order', ['createOrder', 'refundWholeOrder']),

    gunHandler(event) {
      if (this.$refs.searchInput.focused || this.payDialogVisible) {
        return;
      }

      if (event.key === 'Shift') {
        return;
      }

      if (event.key === 'Enter') {

        if(this.snState != 1){
          this.search();
          this.searchGoodsNo = this.keyboardNo;
        }

      } else {
        this.keyboardNo += event.key;
      }
    },

    async search() {
      // console.log('打印购物车')
      // console.log(this.goodsList)
      if (!this.searchGoodsNo) {
        this.$refs.searchInput.focus();
        return;
      }
      // console.log(this.searchGoodsNo)
      if(this.searchGoodsNo.indexOf('https') !=-1){
        console.log('有')
        var query = this.searchGoodsNo.split("?")[1]
        var snCode = this.getQueryString(query)
        this.keyboardNo = '';
        for(var i = 0;i<this.goodsList.length;i++){
          if(snCode == this.goodsList[i].sn){
            return
          }
        }
        try {
          await this.getGoodsInfo(snCode);
          this.searchPanelVisible = true;
          this.searchGoodsNo = '';
        } catch (error) {
          this.searchGoodsNo = '';
          this.$message.error(error.message);
        }
      }else {
        console.log('没有')
        try {
          await this.getGoodsInfo(this.searchGoodsNo);
          this.searchPanelVisible = true;
          this.searchGoodsNo = '';
        } catch (error) {
          this.searchGoodsNo = '';
          this.$message.error(error.message);
        }
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
    },
    getQueryString(query) {
      // var query = url.search.substring('?');
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == 'sn'){return pair[1];}
      }
      return(false);
    },
    // 移除一物一码
    clearSn(){
      this.snState = 1
    },
    snCancle(){
      this.snState = 0
    },
    async search2(){
      if (!this.searchGoodsNo2) {
        this.$refs.searchGoodsNo2.focus();
        return;
      }
      // console.log(this.searchGoodsNo)
      if(this.searchGoodsNo2.indexOf('https') !=-1){
        var query = this.searchGoodsNo2.split("?")[1]
        var snCode = this.getQueryString(query)
        this.keyboardNo = '';
        var type = 0
        for(var i = 0;i<this.goodsList.length;i++){
          if(snCode == this.goodsList[i].sn){
            type = 1
            try {
              await this.removeFromCart({ goodsId: this.goodsList[i].id, quantity: this.goodsList[i].quantity,sn:this.goodsList[i].sn});
              this.snState = 0
              this.searchGoodsNo2 =''
            } catch (error) {
              this.$message.error(error.message);
            }
          }
        }
        if(type = 0){
          this.$message.error('购物车没有此商品');
        }
      }else {
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
  .sn{
    width: 600px;
    height: 300px;
    background: #fff;
    border-radius: 6px;
    position: fixed;
    z-index: 1111;
    top: 50%;
    left: 50%;
    margin-top: -150px;
    margin-left: -300px;
    .snTitle{
      margin-left: 10px;
      cursor: pointer;
    }
    .snDetail{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 80px;
    }
  }
}
</style>