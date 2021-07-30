<template>
  <div class="cart-container" style="background: #F8F8F8;">
    <div class="input-container">
      <el-input style="width: 80%;margin: 20px auto 0 10%;height: 40px;" ref="searchInput" type="search" @keyup.enter.native="search()" clearable v-model="searchGoodsNo">
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
      <div :style="style1">添加门店优惠</div>
      <div :style="style2">添加会员优惠</div>
<!--      <el-button :disabled="!goodsList.length" type="danger" @click="clearSn()">移除一物一码</el-button>-->
      <p @click="clearCart()" style="font-size: 16px;margin-left: 45px;">清除购物车</p>
      <div v-show="goodsList.length" class="goods-summary">
        <p style="flex: 1;text-align: right;color: #282828;font-size: 16px;line-height: 33px;">以选商品 </p>
        <p style="font-size: 24px;color: #E31A22;line-height: 33px;"> {{ totalCount }} </p>
        <p style="text-align: right;color: #282828;font-size: 16px;line-height: 33px;">以选商品</p>
        <p style="text-align: right;color: #282828;font-size: 16px;line-height: 33px;margin-left: 20px;">合计：</p>
        <p style="font-size: 24px;color: #E31A22;line-height: 33px;margin-right: 10px;"> {{ totalAmount }} </p>
<!--        <div>{{ totalCount }} 件</div>-->
<!--        <div>￥ {{ totalAmount }}</div>-->
      </div>
      <!-- 这里的付款实际上为创建订单，付款弹窗的付款才为实际的付款 -->
      <el-button style="width: 134px;height: 66px;background: #000;color: #fff;margin-right: 24px;border-radius: 10px;" :disabled="!goodsList.length" type="success" @click="createNewOrder()">结算</el-button>
    </div>

    <el-drawer
      ref="addCartDrawer"
      :visible.sync="searchPanelVisible"
      direction="btt"
      :modal-append-to-body="false"
      :show-close="false"
      size="50%"
      custom-class="search-panel"
    >
      <div v-if="searchGoods">
        <goods-card v-bind="searchGoods" from-search @close-panel="searchPanelVisible = false"></goods-card>
        <div @click="closeDrawer" style="width: 100%;height: 96px;text-align: center;line-height: 96px;background: #F8F8F8;font-size: 18px;color: #000;position: absolute;bottom: 0;">取消</div>
      </div>
      <p v-else>找不到该商品，请核实</p>
    </el-drawer>

    <el-dialog :visible.sync="payDialogVisible" :show-close="false" :close-on-click-modal="false" width="60%">
<!--      <span slot="title" @click="backCart()"><i class="el-icon-arrow-left"></i>返回点单</span>-->
      <div class="snTitle" style="margin-top: -50px;margin-left: 0;" @click="backCart()">
        <img src="../assets/images/return01.png" style="width: 17px;height: 17px;" alt="">
        <p style="font-size: 14px;color: #000;margin-left: 13px;">返回点单</p>
      </div>
      <order-process></order-process>
    </el-dialog>
<!--    移除一物一码-->
    <div v-if="snState == 1">
      <div @click="snCancle()" style="width: 100%;height: 100%;position: fixed;z-index: 1000;top: 0;left: 0;background: #000;opacity: 0.6;"></div>
      <div class="sn">
        <div class="snTitle" @click="snCancle()">
          <img src="../assets/images/return01.png" style="width: 17px;height: 17px;" alt="">
          <p style="font-size: 14px;color: #000;margin-left: 13px;">取消移除</p>
        </div>
        <div class="snDetail">
          <p style="font-size: 16px;color: #000;line-height: 22px;margin-right: 14px;">商品编码</p>
          <el-input style="width: 254px;" ref="searchInput2" type="search" placeholder="单行输入" clearable v-model="searchGoodsNo2">
          </el-input>
        </div>
        <div style="margin-top: 60px;display: flex;justify-content: center">
          <p @click="snCancle()" style="width: 142px;height: 44px;border-radius: 10px;border: 1px solid #000000;line-height: 44px;text-align: center;font-size: 18px;color: #000;font-weight: 500;">取消</p>
<!--          <el-button type="info" style="" @click="snCancle()">取消</el-button>-->
<!--          <el-button type="primary" style="margin-right: 60px;" @click="search2()">确定</el-button>-->
          <p @click="search2()" style="width: 142px;height: 44px;border-radius: 10px;border: 1px solid #000000;line-height: 44px;text-align: center;font-size: 18px;color: #fff;font-weight: 500;background: #000;margin-left: 36px;">确定</p>
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
// import { websocketLink } from "../utils/websocket";
// import { getHeaderImage } from "@/api/user"
export default {
  name: 'Cart',
  components: { GoodsCard, OrderProcess },

  data() {
    const url = require("../assets/images/select01.png")
    const url2 = require("../assets/images/select02.png")

    return {
      searchPanelVisible: false,
      payDialogVisible: false,
      searchGoodsNo: '',
      searchGoodsNo2:'',
      keyboardNo: '',
      snState:0,
      style1: {
        backgroundImage: "url(" + url + ")",
        width:'149px',
        height:'60px',
        backgroundSize:'100% auto',
        color:'#E31A22',
        fontSize:'16px',
        textAlign:'center',
        lineHeight:'60px',
        marginLeft:'24px'
      },
      style2: {
        backgroundImage: "url(" + url2 + ")",
        width:'149px',
        height:'60px',
        backgroundSize:'100% auto',
        color:'#E31A22',
        fontSize:'16px',
        textAlign:'center',
        lineHeight:'60px',
      }
    };
  },

  computed: {
    ...mapState('order', ['orderId', 'orderStatus']),
    ...mapState('cart', ['searchGoods', 'goodsList', 'totalAmount', 'totalCount']),
    // ...mapState(["userObj", "type","Image"]),
  },

  created() {
    // this.getCartGoodsList();
    // console.log(this.searchGoods)
    // console.log('打印---')
    // console.log(this.type)
  },

  mounted() {
    // websocketLink();
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
    // ...mapActions(["getImages"]),
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
    },
    closeDrawer(){
      this.$refs.addCartDrawer.closeDrawer()
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
p {
  padding: 0;
  margin: 0;
}
.input-container{
  width: 46%;
  height: 8%;
  background: #fff;
  border-radius: 2px;
}
.el-input-group--append .el-input__inner, .el-input-group__prepend{
  height: 40px;
}

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
    width: 100%;
    height: 140px;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    align-items: center;
    .goods-summary {
      margin-right: 12px;
      display: flex;
      flex: 1;
      text-align: right;
    }
  }
  .sn{
    border-radius: 8px;
    width: 400px;
    height: 324px;
    background: #fff;
    border-radius: 6px;
    position: fixed;
    z-index: 1111;
    top: 50%;
    left: 50%;
    margin-top: -152px;
    margin-left: -200px;
    .snDetail{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 76px;
    }
  }
  .snTitle{
    padding-top: 23px;
    display: flex;
    align-items: center;
    margin-left: 20px;
    cursor: pointer;
  }
}

</style>