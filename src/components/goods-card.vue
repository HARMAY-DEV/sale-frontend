<template>
  <div class="goods-container" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <div class="goods-picture">
      <img v-if="picture != '' && picture != null" :src="picture" style="width: 100%; height: 100%;">
      <img v-else src="require('')" style="width: 100%; height: 100%;">
    </div>
    <div class="goods-detail">
      <div class="goods-name">{{ name }}</div>
      <div class="goods-specs">规格: {{ spec.name }}</div>
      <!-- 库存只做展示用，先默认 999+ -->
      <div class="goods-stock">库存: {{ stock === Infinity ? '999+' : stock }}</div>
    </div>
    <div v-if="sn == '' || sn == null" class="goods-price">￥ {{ price }}</div>
    <div v-else style="background: #fff;position: relative;z-index: 999;width: 120px;padding: 0;text-align: right;margin-right: -18px;" class="goods-price">￥ {{ price }}</div>

    <div v-if="!fromSearch" class="actions" :style="{marginRight: marginRight + 'px'}">
        <div v-if="sn == '' || sn == null">
          <el-button type="primary" size="mini" icon="el-icon-minus" @click="removeFromCart({ goodsId: id ,sn:sn})" round></el-button>
          <span class="goods-quantity">{{ quantity }}</span>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="addToCart({ goodsId: id, price: price ,sn:sn})" round :disabled="stock <= 0"></el-button>
        </div>
    </div>

    <div v-if="fromSearch" class="actions">
      <el-button type="primary" @click="addGoodsToCart()">加入购物车</el-button>
    </div>

    <el-button v-if="!fromSearch" class="remove-btn" type="danger" @click="removeFromCart({ goodsId: id, quantity: quantity,sn:sn})">删除</el-button>
  </div>
</template>
 
<script>
import { mapActions } from 'vuex';

export default {
  name: "GoodsCard",
  data() {
    return {
      startX: 0,
      endX: 0,
    };
  },
  props: {
    id: String,
    picture: String,
    name: String,
    price: Number,
    stock: Number,
    spec: Object,
    quantity: Number,
    sn: String,
    fromSearch: {
      type: Boolean,
      'default': false,
    },
  },
  computed: {
    // 实时库存
    realtimeStock() {
      if (this.fromSearch) return this.stock;
      return this.stock - this.quantity;
    },

    marginRight() {
      if(this.sn != '' && this.sn != null){
        if (this.endX === 0) return 0;

        const value = this.startX - this.endX;

        if (value >= 120) return 120;
        else if (value <= 0) return 0;
        else return value;
      }else {
        if (this.endX === 0) return 0;

        const value = this.startX - this.endX;

        if (value >= 120) return 120;
        else if (value <= 0) return 0;
        else return value;
      }

    },
  },
  methods: {
    ...mapActions('cart', ['addToCart', 'removeFromCart']),

    async addGoodsToCart() {
      console.log(this)
      await this.addToCart({ goodsId: this.id, price: this.price, sn: this.sn});
      this.$emit('close-panel');
    },

    touchStart({ touches }) {
      if (!touches || touches.length > 1) {
        return;
      }

      this.startX = touches[0].screenX;
    },

    touchMove({ touches }) {
      if (!touches || touches.length > 1) {
        return;
      }

      this.endX = touches[0].screenX;
    },

    touchEnd() {
      // endX 等于0 证明没有滑动
      if (this.endX === 0) {
        return;
      }
      if (this.startX - this.endX >= 10) {
        this.endX = this.startX - 120;
      } else {
        // 往左滑的距离太短或是向右滑，不显示删除按钮
        this.startX = 0;
        this.endX = 0;
      }

    },
  }
};
</script>
 
<style lang="scss" scoped>
.actions .el-button {
  padding: 7px 12px;
}
</style>
<style lang="scss" scoped>
.goods-container {
  position: relative;
  margin-bottom: 12px;
  margin-top: 0;
  font-size: 12px;
  display: flex;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border: 1px solid #ebeef5;
  border-radius: 2px;
  overflow: hidden;
  
  .remove-btn {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
    width: 120px;
  }
}

.goods-picture {
  box-sizing: border-box;
  width: 60px;
  height: 60px;
  border-radius: 2px;
  border: 1px solid #eaeaea;
  margin: 10px;
  margin-right: 20px;
  overflow: hidden;
}

.goods-detail {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: auto;
  color: #6a6a99;

  .goods-name {
    font-size: 14px;
    color: #121212;
    font-weight: 600;
  }
}

.goods-price {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  font-size: 18px;
  font-weight: 600;
}

.actions {
  padding: 10px;
  display: flex;
  align-items: center;
  background-color: #fff;
  z-index: 1;
  transition: all ease 0.2s;

  .goods-quantity {
    display: inline-block;
    margin: auto 10px;
    font-size: 16px;
    width: 30px;
    text-align: center;
  }
}
</style>