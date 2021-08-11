<template>
  <div class="cart-container" style="background: #F8F8F8;">
    <div class="input-container">
      <div class="input-group">
        <el-input style="width: 80%;height: 40px;" ref="searchInput" type="search" @keyup.enter.native="search()" clearable v-model="searchGoodsNo" placeholder="条码、名称、商家编码">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <!-- <el-button slot="append" icon="el-icon-search" @click="search()"></el-button> -->
        </el-input>
      </div>
      <div class="member-group">
        <div class="img-box">
          <img src="../assets/images/head_photo.png" alt="">
        </div>
        <p class="tips">未登录会员</p>
      </div>
    </div>
    <div v-if="goodsList.length" class="goods-list">
      <goods-card v-for="goods in goodsList" :key="goods.id" v-bind="goods"></goods-card>
    </div>
    <div v-else class="goods-list" @touchmove.stop>
      <h2 class="empty-goods">空空如也~</h2>
    </div>
    <div class="footer">
      <el-button @click="discountBtn()" :class="['btn add-btn', {active: goodsList&&goodsList.length>0}]">添加临时优惠</el-button>
      <el-button @click="discountBtn2()" :class="['btn choose-btn', {active: goodsList&&goodsList.length>0}]">选择优惠</el-button>
<!--      <el-button :disabled="!goodsList.length" type="danger" @click="clearSn()">移除一物一码</el-button>-->
      <p @click="clearCart()" style="font-size: 16px;margin-left: 45px;flex: 1;">清空购物车</p>
      <div class="goods-summary">
        <p class="list-len-box">
          以选商品 <span>{{totalCount}} </span>件
        </p>
        <p class="total-box">
          合计： <span>{{totalAmount}}</span>
        </p>
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
        <div @click="closeDrawer" style="width: 100%;height: 96px;text-align: center;line-height: 96px;background: #F8F8F8;font-size: 18px;color: #000;position: absolute;bottom: 0;left:0;right:0;font-weight:bold;">取消</div>
      </div>
      <p v-else>找不到该商品，请核实</p>
    </el-drawer>

    <el-dialog :visible.sync="payDialogVisible" :show-close="false" :close-on-click-modal="false" width="674px">
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
<!--    会员优惠券-->
    <div v-if="discountState == 1">
      <div @click="discountClose()" style="background: rgba(0, 0, 0, 0.5);width: 100%;height: 100%;position: fixed;z-index: 1;top: 0;left: 0;"></div>
      <div class="discount">
        <div style="position: relative;width: 100%;height: 100%;">
          <div style="display: flex;">
            <div class="discount-left">
              <div class="discountTop">
                <div class="discountTop-line"></div>
                <p class="discountTop-name">会员优惠</p>
              </div>
              <div class="discountList">
                <div class="discountList-left">
                  <p style="font-size: 32px;color: #B51F29;font-weight: bold">¥20</p>
                  <p style="font-size: 10px;color: #969696;margin-top: 3px;">满100元使用</p>
                </div>
                <div class="discountList-right">
                  <p style="font-size: 14px;color: #000;line-height: 20px;">纯露化妆水无门槛20元券</p>
                  <p style="font-size: 11px;color: #969696;line-height: 16px;margin-top: 8px;">范围：单品优惠</p>
                  <p style="font-size: 11px;color: #969696;line-height: 16px;margin-top: 3px;">期限：2021.01.08-2021.10.08</p>
                </div>
              </div>
              <div class="discountList">
                <div class="discountList-left">
                  <p style="font-size: 32px;color: #B51F29;font-weight: bold">8折</p>
                  <p style="font-size: 10px;color: #969696;margin-top: 3px;">满100元使用</p>
                </div>
                <div class="discountList-right">
                  <p style="font-size: 14px;color: #000;line-height: 20px;">纯露化妆水无门槛20元券</p>
                  <p style="font-size: 11px;color: #969696;line-height: 16px;margin-top: 8px;">范围：单品优惠</p>
                  <p style="font-size: 11px;color: #969696;line-height: 16px;margin-top: 3px;">期限：2021.01.08-2021.10.08</p>
                </div>
              </div>
              <div class="discountTop" style="margin-top: 32px;">
                <div class="discountTop-line"></div>
                <p class="discountTop-name">不可用</p>
              </div>
              <div class="discountList2">
                <div class="discountList-left">
                  <p style="font-size: 32px;color: #C0C0C0;font-weight: bold">¥20</p>
                  <p style="font-size: 10px;color: #C0C0C0;margin-top: 3px;">满100元使用</p>
                </div>
                <div class="discountList-right">
                  <p style="font-size: 14px;color: #C0C0C0;line-height: 20px;">纯露化妆水无门槛20元券</p>
                  <p style="font-size: 11px;color: #C0C0C0;line-height: 16px;margin-top: 8px;">范围：单品优惠</p>
                  <p style="font-size: 11px;color: #C0C0C0;line-height: 16px;margin-top: 3px;">期限：2021.01.08-2021.10.08</p>
                </div>
              </div>
            </div>
            <div class="discount-left" style="margin-left: 82px;">
              <div class="discountTop">
                <div class="discountTop-line"></div>
                <p class="discountTop-name">门店优惠</p>
              </div>
              <div class="discountList">
                <div class="discountList-left">
                  <p style="font-size: 32px;color: #B51F29;font-weight: bold">¥20</p>
                  <p style="font-size: 10px;color: #969696;margin-top: 3px;">满100元使用</p>
                </div>
                <div class="discountList-right">
                  <p style="font-size: 14px;color: #000;line-height: 20px;">纯露化妆水无门槛20元券</p>
                  <p style="font-size: 11px;color: #969696;line-height: 16px;margin-top: 8px;">范围：单品优惠</p>
                  <p style="font-size: 11px;color: #969696;line-height: 16px;margin-top: 3px;">期限：2021.01.08-2021.10.08</p>
                </div>
              </div>
            </div>
          </div>
          <div class="discountFooter">
            <p style="font-size: 24px;color: #000;margin-left: 30px;font-weight: bold;">¥279</p>
            <p style="font-size: 16px;color: #969696;margin-left: 16px;flex: 1;margin-top: 4px;text-decoration: line-through;">¥350</p>
            <el-button style="width: 114px;height: 54px;border-radius: 10px;background:#000;font-size: 18px;color: #fff;margin-right: 30px;">确定</el-button>
          </div>
        </div>
      </div>
    </div>
<!--    临时优惠-->
    <div v-if="temporaryState == 1">
      <div @click="discountClose()" style="background: rgba(0, 0, 0, 0.5);width: 100%;height: 100%;position: fixed;z-index: 1;top: 0;left: 0;"></div>
      <div class="temporary">
        <p class="temporaryTitle">临时优惠</p>
        <div class="temporaryNav">
          <p @click="temporaryChange(0)" style="margin-left: 10px;" class="temporaryNav-name">折扣</p>
          <p @click="temporaryChange(1)" class="temporaryNav-name2">减价</p>
        </div>
        <div v-if="temporaryType == 0" class="temporaryDetail">
          <input style="margin-left: 135px;width: 140px;background: none;font-size: 16px;padding: 0;border: none;outline: none" v-model="discountNum" placeholder="请输入折扣数字"></input>
          <p style="font-size: 20px;color: #282828;margin-left: 20px">%</p>
        </div>
        <div v-if="temporaryType == 1" class="temporaryDetail2">
          <input style="margin-left: 135px;width: 140px;background: none;font-size: 16px;padding: 0;border: none;outline: none" v-model="discountNum" placeholder="请输入优惠价格"></input>
          <p style="font-size: 20px;color: #282828;margin-left: 20px">元</p>
        </div>
        <p class="temporaryTitle" style="padding-top: 44px;">临时优惠</p>
        <el-input style="width: 345px;margin-top: 20px;margin-left: 30px;" v-model="input" placeholder="请输入订单备注"></el-input>
        <div class="discountFooter">
          <p style="font-size: 24px;color: #000;margin-left: 30px;font-weight: bold;">¥279</p>
          <p style="font-size: 16px;color: #969696;margin-left: 16px;flex: 1;margin-top: 4px;text-decoration: line-through;">¥350</p>
          <el-button style="width: 114px;height: 54px;border-radius: 10px;background:#000;font-size: 18px;color: #fff;margin-right: 30px;">确定</el-button>
        </div>
      </div>
    </div>
<!--    商品优惠-->
    <div v-if="temporaryState == 2">
      <div @click="discountClose()" style="background: rgba(0, 0, 0, 0.5);width: 100%;height: 100%;position: fixed;z-index: 1;top: 0;left: 0;"></div>
      <div class="goosdDiscount">
        <p class="goosdDiscount-title">WIS 净透理肤套装 水乳套盒正品补水控油化妆品清爽保湿水乳官网</p>
        <div style="display: flex;margin-top: 40px;">
          <div>
            <div class="discountTop" style="margin-left: 30px;">
              <div class="discountTop-line"></div>
              <p class="discountTop-name">会员优惠</p>
            </div>
            <div class="temporaryNav">
              <p @click="temporaryChange(0)" style="margin-left: 11px;" class="temporaryNav-name">折扣</p>
              <p @click="temporaryChange(1)" class="temporaryNav-name2">减价</p>
            </div>
            <div v-if="temporaryType == 0" class="temporaryDetail">
              <input style="margin-left: 135px;width: 140px;background: none;font-size: 16px;padding: 0;border: none;outline: none" v-model="discountNum" placeholder="请输入折扣数字"/>
              <p style="font-size: 20px;color: #282828;margin-left: 20px">%</p>
            </div>
            <div v-if="temporaryType == 1" class="temporaryDetail2">
              <input style="margin-left: 135px;width: 140px;background: none;font-size: 16px;padding: 0;border: none;outline: none" v-model="discountNum" placeholder="请输入优惠价格"/>
              <p style="font-size: 20px;color: #282828;margin-left: 20px">元</p>
            </div>
          </div>
          <div style="margin-left: 82px">
            <div class="discountTop">
              <div class="discountTop-line"></div>
              <p class="discountTop-name">可用会员优惠券</p>
            </div>
            <div class="discountList">
              <div class="discountList-left">
                <p style="font-size: 32px;color: #B51F29;font-weight: bold">¥20</p>
                <p style="font-size: 10px;color: #969696;margin-top: 3px;">满100元使用</p>
              </div>
              <div class="discountList-right">
                <p style="font-size: 14px;color: #000;line-height: 20px;">纯露化妆水无门槛20元券</p>
                <p style="font-size: 11px;color: #969696;line-height: 16px;margin-top: 8px;">范围：单品优惠</p>
                <p style="font-size: 11px;color: #969696;line-height: 16px;margin-top: 3px;">期限：2021.01.08-2021.10.08</p>
              </div>
            </div>
            <div class="discountList">
              <div class="discountList-left">
                <p style="font-size: 32px;color: #B51F29;font-weight: bold">8折</p>
                <p style="font-size: 10px;color: #969696;margin-top: 3px;">满100元使用</p>
              </div>
              <div class="discountList-right">
                <p style="font-size: 14px;color: #000;line-height: 20px;">纯露化妆水无门槛20元券</p>
                <p style="font-size: 11px;color: #969696;line-height: 16px;margin-top: 8px;">范围：单品优惠</p>
                <p style="font-size: 11px;color: #969696;line-height: 16px;margin-top: 3px;">期限：2021.01.08-2021.10.08</p>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-group">
          <div class="footer-lf">
            <p class="price">¥279</p>
            <p class="del-price">¥350</p>
          </div>
          <div class="footer-rg">
            <el-input-number v-model="num" :min="1" :max="10" label="描述文字"></el-input-number>
            <el-button class="sure-btn">确定</el-button>
          </div>
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
      discountState:0,
      discountNum:'',
      temporaryState:0,
      temporaryType:0,
      num:1
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
    },
    // 添加门店优惠/添加会员优惠
    discountBtn(){
      this.discountState = 1
    },
    discountClose(){
      this.discountState = 0
      this.temporaryState = 0
    },
    // 选择临时优惠类型
    temporaryChange(type){
      this.temporaryType = type
    },
    discountBtn2(){
      this.temporaryState = 1
    },
    goodsDiscountBtn(){
      this.temporaryState = 2
    }
  }
}
</script>

<style lang="scss">
.search-panel {
  padding: 12px;
  border-radius: 30px 30px 0 0;
}
</style>

<style lang="scss" scoped>
p {
  padding: 0;
  margin: 0;
}
.el-input__inner{
  padding: 0 !important;
  background: none !important;
}
.input-container{
  display: flex;
  // height: 100%;
  justify-content: space-between;
  & > div {
    width: 49%;
    height: 100px;
    background: #fff;
    border-radius: 2px;
    display: flex;
    align-items: center;
  }
  .input-group {
    justify-content: center;
  }
  .member-group {
    .img-box {
      margin-left: 36px;
      cursor: pointer;
    }
    .tips {
      color: #282828;
      margin-left: 22px;
    }
  }
}
.el-input-group--append .el-input__inner, .el-input-group__prepend{
  height: 40px;
}
.el-input-number__decrease.is-disabled, .el-input-number__increase.is-disabled{
  //background: #EFEFEF !important;
}
.el-input-number__increase{
  background: #000 !important;
  color: #fff !important;
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
      color: #969696;
      font-size: 16px;
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
    .btn {
      width: 140px;
      height: 66px;
      border-radius: 10px;
      background: #F8F8F8;
      color: #B6B6B6;
      text-align: center;
      font-size: 16px;
      &.active {
        background: #000;
        color: #fff;
      }
    }
    .add-btn {
      margin-left: 24px;
    }
    .choose-btn {
      margin-left: 15px;
    }
    .goods-summary {
      margin-right: 12px;
      display: flex;
      flex: 1;
      text-align: right;
      .list-len-box {
        text-align: right;
        color: #282828;
        font-size: 16px;
        line-height: 33px;
        span {
          font-size: 24px;
          color: #E31A22;
          font-weight: bold;
        }
      }
      .total-box {
        text-align: right;
        color: #282828;
        font-size: 16px;
        line-height: 33px;
        margin-left: 20px;
        span {
          font-size: 24px;
          color: #E31A22;
          font-weight: bold;
        }
      }
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
//会员优惠券
.discount{
  width: 713px;
  height: 572px;
  background: #fff;
  border-radius: 8px;
  position: fixed;
  z-index: 10;
  top: 50%;
  left: 50%;
  margin-top: -286px;
  margin-left: -356px;
  .discount-left{
    margin-left: 30px;
    margin-top: 40px;
    .discountTop{
      display: flex;
      align-items: center;
      padding-bottom: 8px;
      .discountTop-line{
        width: 2px;
        height: 12px;
        background: #B51F29;
      }
      .discountTop-name{
        font-size: 16px;
        color: #000;
        line-height: 22px;
        margin-left: 8px;
      }
    }
    .discountList{
      width: 287px;
      height: 94px;
      background-image: url("../assets/images/discountBck.png");
      background-size: 100% auto;
      margin-top: 11px;
      display: flex;
      align-items: center;
      .discountList-left{
        margin-left: 10px;
        text-align: center;
      }
      .discountList-right{
        margin-left: 30px;
      }
    }
    .discountList2{
      width: 287px;
      height: 94px;
      background-image: url("../assets/images/discountBck2.png");
      background-size: 100% auto;
      margin-top: 11px;
      display: flex;
      align-items: center;
      .discountList-left{
        margin-left: 10px;
        text-align: center;
      }
      .discountList-right{
        margin-left: 30px;
      }
    }
  }
  .discountFooter{
    height: 99px;
    width: 100%;
    position: absolute;
    bottom: 0;
    border-top: 1px solid #EEEEEE;
    display: flex;
    align-items: center;
  }
}
//临时优惠
.temporary{
  width: 583px;
  height: 512px;
  background: #fff;
  border-radius: 8px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -256px;
  margin-left: -292px;
  z-index: 10;
  .temporaryTitle{
    font-size: 18px;
    color: #000000;
    padding-top: 40px;
    margin-left: 30px;
  }
  .temporaryNav{
    display: flex;
    align-items: center;
    margin: 38px 0 0 30px;
    .temporaryNav-name{
      font-size: 16px;
      color: #160000;
      line-height: 22px;
      font-weight: 600;
    }
    .temporaryNav-name2{
      font-size: 16px;
      color: #525252;
      line-height: 22px;
      font-weight: 400;
      margin-left: 30px;
    }
  }
  .temporaryDetail{
    width: 345px;
    height: 98px;
    background-image: url("../assets/images/discountBck3.png");
    background-size: 100% auto;
    display: flex;
    align-items: center;
    margin: 20px 0 0 30px;
  }
  .temporaryDetail2{
    width: 345px;
    height: 98px;
    background-image: url("../assets/images/discountBck4.png");
    background-size: 100% auto;
    display: flex;
    align-items: center;
    margin: 20px 0 0 30px;
  }
  .discountFooter{
    height: 99px;
    width: 100%;
    position: absolute;
    bottom: 0;
    border-top: 1px solid #EEEEEE;
    display: flex;
    align-items: center;
  }
}
//商品优惠
.goosdDiscount{
  width: 773px;
  height: 512px;
  background: #fff;
  border-radius: 8px;
  position: fixed;
  z-index: 10;
  top: 50%;
  left: 50%;
  margin-top: -256px;
  margin-left: -386px;
  .goosdDiscount-title{
    font-size: 18px;
    padding-top: 40px;
    margin-left: 30px;
  }
  .discountFooter{
    height: 99px;
    width: 100%;
    position: absolute;
    bottom: 0;
    border-top: 1px solid #EEEEEE;
    display: flex;
    align-items: center;
  }
  .temporaryNav{
    display: flex;
    align-items: center;
    margin: 20px 0 0 30px;
    .temporaryNav-name{
      font-size: 16px;
      color: #160000;
      line-height: 22px;
      font-weight: 600;
    }
    .temporaryNav-name2{
      font-size: 16px;
      color: #525252;
      line-height: 22px;
      font-weight: 400;
      margin-left: 30px;
    }
  }
  .temporaryDetail{
    width: 345px;
    height: 98px;
    background-image: url("../assets/images/discountBck3.png");
    background-size: 100% auto;
    display: flex;
    align-items: center;
    margin: 20px 0 0 30px;
  }
  .temporaryDetail2{
    width: 345px;
    height: 98px;
    background-image: url("../assets/images/discountBck4.png");
    background-size: 100% auto;
    display: flex;
    align-items: center;
    margin: 20px 0 0 30px;
  }
  .discountTop{
    display: flex;
    align-items: center;
    .discountTop-line{
      width: 2px;
      height: 12px;
      background: #B51F29;
    }
    .discountTop-name{
      font-size: 16px;
      color: #000;
      line-height: 22px;
      margin-left: 8px;
    }
  }
  .discountList{
    width: 287px;
    height: 94px;
    background-image: url("../assets/images/discountBck.png");
    background-size: 100% auto;
    margin-top: 11px;
    display: flex;
    align-items: center;
    .discountList-left{
      margin-left: 10px;
      text-align: center;
    }
    .discountList-right{
      margin-left: 30px;
    }
  }
  .footer-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 99px;
    width: 100%;
    position: absolute;
    bottom: 0;
    border-top: 1px solid #EEEEEE;
    .footer-lf {
      display: flex;
      align-items: center;
      margin-left: 30px;
      .price {
        font-size: 24px;
        color: #000;
        font-weight: bold;
      }
      .del-price {
        font-size: 16px;
        color: #969696;
        margin-left: 16px;
        margin-top: 4px;
        text-decoration: line-through;
      }
    }
    .footer-rg {
      display: flex;
      align-items: center;
      margin-right: 30px;
      .sure-btn {
        width: 114px;
        height: 54px;
        border-radius: 10px;
        background:#000;
        font-size: 18px;
        color: #fff;
        margin-left: 100px;
      }
    }
  }
}

</style>