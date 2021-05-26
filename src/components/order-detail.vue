<template>
  <div class="order-detail">
    <div class="order-header">
      <span style="margin-right: auto;">订单号：3124124</span>
      <span style="margin-right: 5px;">支付成功</span>
      <ip-check-one theme="two-tone" size="24" :fill="['#ffffff' ,'#34c758']" />
    </div>
    <div class="order-content">
      <h3>订单详情</h3>
      <el-table :data="orderTableData">
        <el-table-column prop="payStatus" width="120" label="订单状态"></el-table-column>
        <el-table-column prop="payType" label="支付方式"></el-table-column>
        <el-table-column prop="time" label="下单时间" width="180"></el-table-column>
        <el-table-column prop="payableAmount" label="应付金额"></el-table-column>
        <el-table-column prop="paidAmount" label="实付金额"></el-table-column>
      </el-table>

      <h3>商品信息</h3>
      <el-table :data="goodsTableData">
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="picture" label="图片"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="spec" label="规格" width="120"></el-table-column>
        <el-table-column prop="quantity" width="50" label="数量"></el-table-column>
        <el-table-column prop="price" width="50" label="单价"></el-table-column>
        <el-table-column prop="paid" label="实付金额"></el-table-column>
      </el-table>

      <h3>流水详情</h3>
      <el-table :data="flowTableData">
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="payType" label="方式"></el-table-column>
        <el-table-column prop="time" width="180" label="支付时间"></el-table-column>
        <el-table-column prop="amount" label="支付金额"></el-table-column>
      </el-table>

    </div>
    <div class="order-footer">
      <el-button style="margin-right: auto;">重打小票</el-button>
      <el-button @click="refundOrder('whole')">整单退货</el-button>
      <el-button @click="refundOrder('part')" disabled>退货</el-button>
    </div>
  </div>
</template>

<script>
import { FlowService, OrderService } from '@/services';
import { mapActions } from 'vuex';

export default {
  name: 'OrderDetail',
  data() {
    return {
      orderTableData: [],
      goodsTableData: [],
      flowTableData: [],
    };
  },
  props: {
    id: String,
  },
  watch: {
    id(value) {
      if (value) {
        this.getOrderInfo(value);
      }
    }
  },
  methods: {
    ...mapActions('order', ['refundWholeOrder']),

    async refundOrder(type) {
      if (type === 'whole') {
        try {
          await this.$confirm('如确认整单退货,会在一个工作日内返回支付欠款。', '确认要整单退货吗？', {
            showClose: false,
            type: 'error',
            closeOnClickModal: false,
          });

          await this.refundWholeOrder('');
          this.$message.success('退货成功！');
        } catch { }
      }

      if (type === 'part') {
        
      }
    },

    async getOrderInfo(id) {
      const [{ orderInfo, goodsList }, flowList] = await Promise.all([OrderService.getOrderDetail(id), FlowService.getFlowListByOrderId(id)]);
      console.log(orderInfo, goodsList, flowList);
      this.orderTableData = [orderInfo];
      this.goodsTableData = goodsList;
      this.flowTableData = flowList;
    }
  },
}
</script>

<style lang="scss" scoped>
.order-detail {
  flex: auto;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border: 1px solid #ebeef5;
  border-radius: 2px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.order-header {
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  padding-bottom: 5px;
  border-bottom: 1px solid #ebeef5;
}

.order-content {
  flex: 1 1 100%;
  overflow-y: auto;
}

.order-footer {
  display: flex;
  justify-content: space-between;
}
</style>