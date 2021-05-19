<template>
  <div class="order-detail">
    <div class="order-header">
      <span>订单号：3124124</span>
      <span>支付成功</span>
      <ip-check-one theme="two-tone" size="24" :fill="['#ffffff' ,'#34c758']" />
    </div>
    <div class="order-content">
      <h3>订单详情</h3>
    </div>
    <div class="order-footer">
      <el-button>重打小票</el-button>
      <el-button>整单退货</el-button>
      <el-button>退货</el-button>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.order-detail {
  flex: auto;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border: 1px solid #ebeef5;
  border-radius: 2px;
}
</style>