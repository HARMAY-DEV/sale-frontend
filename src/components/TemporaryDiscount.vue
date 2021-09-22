<template>
  <div class="choose-discount">
    <div @click="discountClose" style="background: rgba(0, 0, 0, 0.5);width: 100%;height: 100%;position: fixed;z-index: 1;top: 0;left: 0;"></div>
    <div class="temporary">
      <p class="temporaryTitle">临时优惠</p>
        <div class="temporaryNav">
          <p v-for="item in titleList" :key="item.id"  @click="changeDiscount(item.id)" :class="{active:item.id==temporaryType}">{{item.label}}</p>
        </div>
      <div v-if="temporaryType == 0" class="temporaryDetail">
        <input style="margin-left: 135px;width: 140px;background: none;font-size: 16px;padding: 0;border: none;outline: none" v-model="discountNum" placeholder="请输入折扣数字"/>
        <p style="font-size: 20px;color: #282828;margin-left: 20px">%</p>
      </div>
      <div v-if="temporaryType == 1" class="temporaryDetail2">
        <input style="margin-left: 135px;width: 140px;background: none;font-size: 16px;padding: 0;border: none;outline: none" v-model="discountNum" placeholder="请输入优惠价格"/>
        <p style="font-size: 20px;color: #282828;margin-left: 20px">元</p>
      </div>
      <p class="temporaryTitle">优惠备注</p>
      <el-input style="width: 345px;margin-left: 30px;" v-model="input" placeholder="请输入订单备注"></el-input>
      <div class="discountFooter">
        <p style="font-size: 24px;color: #000;margin-left: 30px;font-weight: bold;">¥279</p>
        <p style="font-size: 16px;color: #969696;margin-left: 16px;flex: 1;text-decoration: line-through;">¥350</p>
        <el-button @click="close" style="width: 114px;height: 54px;border-radius: 10px;background:#000;font-size: 18px;color: #fff;margin-right: 30px;">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      titleList: [
        {id: 0, label: '折扣'},
        {id: 1, label: '减价'}
      ],
      temporaryType: 0,
      discountNum: '',
      input:''
    }
  },
  methods: {
    discountClose() {
      this.$emit('discountClose')
    },
    close(){
 this.$emit('discountClose')
    },
    changeDiscount(id) {
      this.temporaryType = id
    },
  }
}
</script>

<style lang="scss" scoped>
.choose-discount {
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
      padding-top: 20px;
      margin-left: 30px;
    }
    .temporaryNav{
      display: flex;
      align-items: center;
      margin: 20px 0 0 30px;
      p {
        font-size: 16px;
        color: #282828;
        & + p {
          margin-left: 30px;
        }
        &.active {
          font-weight: bold;
          color: #160000;
        }
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
}
</style>