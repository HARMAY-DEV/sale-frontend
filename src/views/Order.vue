<template>
  <div class="order-container" style="background: #F8F8F8;padding-right: 0;padding-bottom: 0;">
    <div class="order-list" @touchmove.stop>
      <div style="position: sticky;top: 0;background: #fff;padding-top: 20px;">
        <div>
          <template>
            <span style="font-size: 14px;color: #333333;margin-right: 10px;margin-left: 10px;">支付方式 </span>
            <el-select v-model="value" placeholder="请选择" @change="payType()" style="width: 74%;">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
        <div style="margin-top: 10px;">
          <template>
            <span style="font-size: 14px;color: #333333;margin-right: 10px;margin-left: 10px;">下单时间 </span>
            <el-date-picker
                style="width: 74%;"
                @change="dataChange()"
                v-model="value1"
                format="yyyy-MM-dd HH:hh:ss"
                type="datetimerange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['12:00:00', '24:00:00']">
            </el-date-picker>
          </template>
        </div>
        <el-input class="order-search-input" type="search" clearable v-model="searchId" style="width:92%;margin: 10px;" placeholder="请输入单号">
          <el-button @click="updateOrderId(searchId)" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>

      <div style="background: #fff;">
        <order-card v-if="changeType==0" :orderId="orderId" @update-order-id="updateOrderId($event)" v-for="order in orderList" :key="order.orderId" v-bind="order"></order-card>
        <order-card v-if="changeType==1" :orderId="orderId" @update-order-id="updateOrderId($event)" v-for="order in orderList2" :key="order.orderId" v-bind="order"></order-card>
      </div>
    </div>
    <div style="flex: 1;">
      <order-detail :id="orderId"></order-detail>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import OrderCard from '@/components/order-card.vue';
import OrderDetail from '@/components/order-detail.vue';

export default {
  name: 'Order',
  components: {
    OrderCard,
    OrderDetail
  },
  data() {
    return {
      searchId: '',
      orderId: '',
      first: true,
      options: [{
        value: 1,
        label: '微信'
      }],
      payStateList: [{
        value: 1,
        label: '全部'
      }, {
        value: 'pay_success',
        label: '支付成功'
      }, {
        value: 'refund_success',
        label: '退款成功'
      }, {
        value: 'partial_refund',
        label: '部分退款'
      },{
        value: 'unpaid',
        label: '未付款'
      }, {
        value: 'wait_pay',
        label: '等待支付'
      }, {
        value: 'partial_pay',
        label: '部分付款'
      },  {
        value: 'pay_fail',
        label: '支付失败'
      }],
      value: '',
      changeType:0,
      orderList2:[],
      value1: '',
      value2: ''
    };
  },
  computed: {
    ...mapState('order', ['orderList']),
  },
  watch: {
    orderList(value) {
      if (value.length > 0) {
        this.orderId = this.orderList[0].id;
      } else {
        this.orderId = '';
      }
    },
    '$route'(to) {
      if (to.path !== '/order' || this.first) {
        return;
      }
      this.getOrderList();
    }
  },
  created() {
    this.first = false;
    this.getOrderList();
  },
  methods: {
    ...mapActions('order', ['getOrderList']),

    updateOrderId(id) {
      const arr=this.orderList.filter(item=>item.id == id);
      // this.orderList = arr
      this.orderId = id;
    },
    payType(e){
      if(this.value === 1){
        this.changeType=0
        this.orderId = this.orderList[0].id;
        this.value1 = ''
      }else {
        this.changeType=1
        const arr=this.orderList.filter(item=>item.status.value == this.value);
        this.orderList2 = arr
        this.orderId = this.orderList2[0].id;
      }
    },
    dataChange(){
      this.value = ''
      if(this.value1 == '' || this.value1 == null){
        this.changeType=0
        this.orderId = this.orderList[0].id;
      }else {
        this.changeType=1
        // console.log(this.orderList)
        // console.log(Date.parse(this.orderList[0].time))
        var data1 = this.gettime(this.value1[0])
        var data2 = this.gettime(this.value1[1])
        var timeStamp1 = Date.parse(data1)
        var timeStamp2 = Date.parse(data2)
        var arr = []
        for(var i =0;i<this.orderList.length;i++){
          var time = Date.parse(this.orderList[i].time)
          if(time>=timeStamp1 && time<=timeStamp2){
            arr.push(this.orderList[i])
          }
        }
        this.orderList2 = arr
        this.orderId = this.orderList2[0].id;
        console.log(arr)
      }

    },
    gettime(data) {
      let value = data.getFullYear() + '-' +
          this.checkTime(data.getMonth() + 1) + '-' +
          this.checkTime(data.getDate()) + ' ' +
          this.checkTime(data.getHours()) + ':' +
          this.checkTime(data.getMinutes()) + ':' +
          this.checkTime(data.getSeconds());
      return value
    },
    checkTime(i) {
      if (i < 10) {
        i = "0" + i
      }
      return i;
    },
  }
}
</script>

<style lang="scss" scoped>
.order-container {
  display: flex;
}

.order-list {
  flex: 0 1 35%;
  margin-right: 10px;
  overflow-y: auto;
  background: #fff;
  .order-search-input {
    //position: sticky;top: 60px;
  }
}
</style>