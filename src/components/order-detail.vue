<template>
  <div style="position: relative;height: 100%;">
    <div class="order-detail" @touchmove.stop>
      <!--    <p>订单编号 {{goodsTableData}}</p>-->
      <div class="order-header">
        <span style="margin-right: auto;font-weight: 600;">订单号：{{ id }}</span>
        <span style="margin-right: 5px;font-size: 18px;">{{ orderStatus }}</span>
        <ip-check-one v-if="orderStatus === '支付成功' || orderStatus === '退款成功'" theme="two-tone" size="24" :fill="['#ffffff' ,'#34c758']" />
        <i v-else style="color: #F56C6C;" class="el-icon-warning"></i>
      </div>
      <div style="display: flex;align-items: center;margin: 10px 29px 0 24px;">
        <p style="font-size: 16px;color: #7F7F7F;flex: 1;">支付时间：{{ orderTableData[0].time }}  </p>
        <p style="font-size: 18px;color: #000;font-weight: 600;">¥ {{ orderTableData[0].paidAmount }}</p>
      </div>
      <!--    客户信息-->
      <div>
        <p style="font-size: 18px;color: #000;font-weight: 600;margin-left: 24px;margin-top: 24px;">客户信息</p>
        <div style="display: flex;align-items: center;margin: 12px 0 0 24px;">
          <p style="font-size: 16px;color: #333333;">昵称：爱设计的徽因</p>
          <p style="font-size: 16px;color: #333333;margin-left: 80px; ">会员等级：HARMAY  BLACK </p>
        </div>
      </div>
      <div class="order-content">
        <!--      <h3>订单详情</h3>-->
        <!--      <el-table :data="orderTableData">-->
        <!--        <el-table-column prop="payStatus" width="100" label="订单状态"></el-table-column>-->
        <!--        <el-table-column prop="payType" width="100" label="支付方式"></el-table-column>-->
        <!--        <el-table-column prop="time" label="下单时间" width="180"></el-table-column>-->
        <!--        <el-table-column prop="payableAmount" label="应付金额"></el-table-column>-->
        <!--        <el-table-column prop="paidAmount" label="实付金额"></el-table-column>-->
        <!--      </el-table>-->

        <p style="font-size: 18px;color: #000;font-weight: 600;margin-top: 24px;margin-left: 24px;">商品信息</p>
        <div style="margin: 12px 15px 0 24px;">
          <div v-for="(item,idx) in goodsTableData" class="list">
            <p class="listName">{{ item.name }}</p>
            <div style="margin-left: 30px;font-size: 16px;color: #313131;line-height: 22px;">
              <p>{{ item.spec }}</p>
              <!--            <p style="margin-top: 10px;">5片</p>-->
            </div>
            <div style="flex: 1;text-align: right;font-size: 12px;color: #313131;line-height: 17px;">
              <p>实付：¥{{ item.amount/100}}</p>
              <p style="margin-top: 6px;">【优惠】员工8折优惠券   - ¥6.8</p>
              <p style="margin-top: 6px;">【优惠】临时优惠   - ¥10.0</p>
            </div>
            <div style="margin-left: 48px;text-align: right;font-size: 18px;color: #000;font-weight: 600;">
              <p>¥ {{ item.price }} X {{ item.quantity }}</p>
<!--              <p style="margin-top: 6px;">【退2】</p>-->
            </div>
          </div>
        </div>
        <!--      <el-table :data="goodsTableData">-->
        <!--        <el-table-column prop="status" label="状态"></el-table-column>-->
        <!--        <el-table-column prop="picture" label="图片"></el-table-column>-->
        <!--        <el-table-column prop="name" label="名称"></el-table-column>-->
        <!--        <el-table-column prop="spec" label="规格" width="120"></el-table-column>-->
        <!--        <el-table-column prop="quantity" width="50" label="数量"></el-table-column>-->
        <!--        <el-table-column prop="price" width="50" label="单价"></el-table-column>-->
        <!--        <el-table-column prop="paid" label="实付金额"></el-table-column>-->
        <!--      </el-table>-->

        <!--      <h3>流水详情</h3>-->
        <!--      <el-table :data="flowTableData">-->
        <!--        <el-table-column prop="status" label="状态"></el-table-column>-->
        <!--        <el-table-column prop="payType" label="方式"></el-table-column>-->
        <!--        <el-table-column prop="time" width="200" label="支付时间"></el-table-column>-->
        <!--        <el-table-column prop="amount" label="支付金额"></el-table-column>-->
        <!--      </el-table>-->
        <div class="total-footer-group">
          <p>应付： <span>¥ 397.00</span></p>
          <p>优惠： <span>¥ 37.00</span></p>
          <p>微信： <span>¥ 7.00</span></p>
        </div>
      </div>

    </div>
    <div class="order-footer">
      <el-button style="width: 140px;height: 66px;border: 1px solid #000;font-size: 20px;text-align: center;font-weight: 500;margin-left: 24px;border-radius: 10px;" @click="print()">重打小票</el-button>
      <div style="flex: 1"></div>
<!--      :disabled="!canRefund"-->
      <el-button :disabled="!canRefund" style="width: 140px;height: 66px;background: #000;color: #fff;border-radius: 10px;font-size: 20px;" @click="refundOrder('whole')">整单退货</el-button>
<!--      :disabled="orderStatus == '未付款' || orderStatus == '退款成功'"-->
      <el-button style="width: 140px;height: 66px;background: #000;color: #fff;border-radius: 10px;font-size: 20px;margin-right: 24px;" @click="refundOrder('part')">退货</el-button>
    </div>
    <ticket ref="mychild" :id="id"></ticket>
<!--    整单退弹框-->
    <div v-if="refundState == 1">
      <div @click="refundCancle()" style="background: rgba(0, 0, 0, 0.5);width: 100%;height: 100%;position: fixed;z-index: 1;top: 0;left: 0;"></div>
      <div class="refund">
        <img src="../assets/images/close01.png" style="width: 20px;height: 20px;margin: 20px 0 0 360px;" alt="">
        <p style="font-size: 18px;color: #000;font-weight: 600;line-height: 25px;margin: 2px 0 0 25px;">确认整单退货吗？</p>
        <p style="font-size: 14px;color: #999999;line-height: 20px;margin: 6px 0 0 25px;">如确认整单退货，会在1个工作日内返回支付钱款。</p>
        <div style="display: flex;align-items: center;margin-top: 44px;justify-content: center;">
          <p @click="refundCancle()" style="width: 124px;height: 44px;line-height: 44px;text-align: center;border: 1px solid #000000;border-radius: 10px;font-size: 16px;color: #000;">取消</p>
          <p @click="refundBtn()" style="width: 124px;height: 44px;line-height: 44px;text-align: center;border: 1px solid #000000;border-radius: 10px;font-size: 16px;color: #fff;background: #000;margin-left: 36px;">确定</p>
        </div>
      </div>
    </div>

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
      canRefund: false,
      refundState:0
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
        // try {
        //   await this.$confirm('如确认整单退货,会在一个工作日内返回支付欠款。', '确认要整单退货吗？', {
        //     showClose: false,
        //     type: 'error',
        //     closeOnClickModal: false,
        //   });
        //
        //   await this.refundWholeOrder(this.id);
        //   this.$message.success('退货成功！');
        //   this.getOrderList();
        // } catch { }
        this.refundState = 1
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
    },
    print(){
      this.$refs.mychild.print();
    },
    refundCancle(){
      this.refundState = 0
    },
    refundBtn(){
      this.refundWholeOrder(this.id);
      this.$message.success('退货成功！');
      this.refundState = 0
      this.getOrderList();
    }
  },
}
</script>

<style lang="scss" scoped>
p{
  padding: 0;
  margin: 0;
}
.order-detail {
  flex: auto;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border: 1px solid #ebeef5;
  border-radius: 2px;
  //padding: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  margin-right: 12px;
}

.order-header {
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  padding-top: 20px;margin-left: 24px;margin-right: 19px;
  //border-bottom: 1px solid #ebeef5;
}

.order-content {
  flex: 1 1 100%;
  overflow-y: auto;
}

.order-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 120px;
  background: #fff;
  display: flex;
  align-items: center;
}
//商品信息
.list{
  display: flex;
  padding: 20px 0;
  .listName{
    font-size: 16px;
    width: 94px;
    color: #333333;margin-left: 20px;
  }
}
//整单退
.refund{
  width: 400px;
  height: 230px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -115px;
  margin-left: -200px;
  background: #fff;
  border-radius: 7px;
  z-index: 10;
}
.total-footer-group {
  border-top: 1px solid #EEEEEE;
  padding: 20px 30px 5px 30px;
  text-align: right;
  p {
    color: #000;
    font-size: 16px;
    span {
      display: inline-block;
      width: 120px;
    }
    & + p {
      margin-top: 12px;
    }
  }
}


</style>