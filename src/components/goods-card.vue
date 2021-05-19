<template>
  <div class="goods-container" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <div class="goods-picture"></div>
    <div class="goods-detail">
      <div class="goods-name">{{ name }}</div>
      <div class="goods-specs">规格: {{ specs }}</div>
      <div class="goods-stock">库存: {{ realtimeStock }}</div>
    </div>
    <div class="goods-price">￥ {{ price }}</div>
    <div v-if="!fromSearch" class="actions" :style="{marginRight: marginRight + 'px'}">
      <el-button type="primary" size="mini" icon="el-icon-minus" @click="minus()" round></el-button>
      <span class="goods-quantity">{{ quantity }}</span>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="plus()" round :disabled="quantity >= stock"></el-button>
    </div>
    <div v-if="fromSearch" class="actions">
      <el-button type="primary">加入购物车</el-button>
    </div>
    <el-button v-if="!fromSearch" class="remove-btn" type="danger" @lick="remove()">删除</el-button>
  </div>
</template>
 
<script>
export default {
  name: "Goods",
  data() {
    return {
      startX: 0,
      endX: 0,
      quantity: 1,
    };
  },
  props: {
    id: String,
    picture: String,
    name: String,
    price: Number,
    stock: Number,
    specs: String | Number,
    fromSearch: {
      type: Boolean,
      'default': false,
    },
  },
  computed: {
    // 实时库存
    realtimeStock() {
      return this.stock - this.quantity;
    },
    marginRight() {
      const value = this.startX - this.endX;
      
      if (value >= 120) return 120;
      else if (value <= 0) return 0;
      else return value;
    }
  },
  methods: {
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
      // 往左滑了一定距离，显示删除按钮
      if (this.startX - this.endX >= 10) {
        this.endX = this.startX - 120;
      } else {
      // 往左滑的距离太短或是向右滑，不显示删除按钮
        this.startX = 0;
        this.endX = 0;
      }
    },
    minus() {
      if (this.quantity > 0) {
        this.quantity = this.quantity - 1;
      } else {
        this.remove();
      }
    },
    plus() {
      this.quantity = this.quantity + 1;
    },
    remove() {
      
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