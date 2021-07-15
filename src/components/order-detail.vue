<template>
  <div class="order-detail" @touchmove.stop>
    <div class="order-header">
      <span style="margin-right: auto;">订单号：{{ id }}</span>
      <span style="margin-right: 5px;">{{ orderStatus }}</span>
      <ip-check-one v-if="orderStatus === '支付成功' || orderStatus === '退款成功'" theme="two-tone" size="24" :fill="['#ffffff' ,'#34c758']" />
      <i v-else style="color: #F56C6C;" class="el-icon-warning"></i>
    </div>
    <div class="order-content">
      <h3>订单详情</h3>
      <el-table :data="orderTableData">
        <el-table-column prop="payStatus" width="100" label="订单状态"></el-table-column>
        <el-table-column prop="payType" width="100" label="支付方式"></el-table-column>
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
        <el-table-column prop="time" width="200" label="支付时间"></el-table-column>
        <el-table-column prop="amount" label="支付金额"></el-table-column>
      </el-table>

    </div>
    <div class="order-footer">
      <el-button style="margin-right: auto;" @click="print()">重打小票</el-button>
      
      <el-button :disabled="!canRefund" @click="refundOrder('whole')">整单退货</el-button>
      <el-button @click="refundOrder('part')" :disabled="orderStatus == '未付款' || orderStatus == '退款成功'">退货</el-button>
    </div>
    <ticket ref="mychild" :id="id"></ticket>
  </div>
</template>

<script>
import { FlowService, OrderService } from '@/services';
import { mapActions } from 'vuex';
import ticket from './smallTicket'

const statusMap = {
  unpaid: '未付款',
  wait_pay: '等待支付',
  partial_pay: '部分付款',
  pay_success: '支付成功',
  pay_fail: '支付失败',
  refund_success: '退款成功',
  refund_fail: '退款失败'
}

const payTypeMap = {
  wechat: '微信',
  alipay: '支付宝',
  combined: '组合支付',
  card: '银行卡',
  cash: '现金',
}

export default {
  name: 'OrderDetail',
  components:{
    ticket
  },
  data() {
    return {
      orderTableData: [],
      goodsTableData: [],
      flowTableData: [],
      orderStatus: '',
      canRefund: false
    };
  },
  props: {
    id: String,
  },
  watch: {
    id(value) {
      if (value) {
        this.getOrderInfo(value);
      } else {
        this.orderTableData = [];
        this.goodsTableData = [];
        this.flowTableData = [];
        this.orderStatus = '';
      }
    }
  },
  methods: {
    ...mapActions('order', ['refundWholeOrder', 'getOrderList']),

    async refundOrder(type) {
      if (!this.id) return;
      if (type === 'whole') {
        try {
          await this.$confirm('如确认整单退货,会在一个工作日内返回支付欠款。', '确认要整单退货吗？', {
            showClose: false,
            type: 'error',
            closeOnClickModal: false,
          });

          await this.refundWholeOrder(this.id);
          this.$message.success('退货成功！');
          this.getOrderList();
        } catch { }
      }

      if (type === 'part') {
          let refund = {
            orderTableData:this.orderTableData,//订单详情
            goodsTableData:this.goodsTableData,//商品信息
            flowTableData:this.flowTableData//订单详情
          }
          this.$router.push({path:'Refund',query:{id:this.id}})
      }
    },

    async getOrderInfo(id) {
      const [{ orderInfo, goodsList }, flowList] = await Promise.all([OrderService.getOrderDetail(id), FlowService.getFlowListByOrderId(id)]);
      this.canRefund = (orderInfo.payStatus === 'pay_success' || orderInfo.payStatus === 'partial_pay' ) && orderInfo.refundAmount < orderInfo.paidAmount;
      orderInfo.payStatus = statusMap[orderInfo.payStatus] || '未知状态';
      orderInfo.payType = payTypeMap[orderInfo.payType] || '未知方式';
      this.orderStatus = orderInfo.payStatus;
      this.orderTableData = [orderInfo];
      this.goodsTableData = goodsList;
      this.flowTableData = flowList.map(flow => ({...flow, status: statusMap[flow.status] || '未知状态'}));
      console.log(orderInfo,goodsList);
    },
    print(){
      this.$refs.mychild.print();
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