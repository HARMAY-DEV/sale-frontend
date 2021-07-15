<template>
  <div class="order-container">
    <div class="order-list" @touchmove.stop>
      <div style="display: flex;align-items: center;margin-bottom: 20px;">
        <template>
          <p style="font-size: 14px;color: #333333;margin-right: 10px;">支付方式 </p>
          <el-select v-model="value" placeholder="请选择" @change="payType()">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </template>
        <template>
          <p style="font-size: 14px;color: #333333;margin-right: 10px;margin-left: 30px;">下单时间 </p>
          <el-date-picker
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
      <el-input class="order-search-input" type="search" clearable v-model="searchId">
        <el-button @click="updateOrderId(searchId)" slot="append" icon="el-icon-search"></el-button>
      </el-input>

      <order-card v-if="changeType==0" @update-order-id="updateOrderId($event)" v-for="order in orderList" :key="order.orderId" v-bind="order"></order-card>
      <order-card v-if="changeType==1" @update-order-id="updateOrderId($event)" v-for="order in orderList2" :key="order.orderId" v-bind="order"></order-card>
    </div>
    <order-detail :id="orderId"></order-detail>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import OrderCard from '@/components/order-card.vue';
import OrderDetail from '@/components/order-detail.vue';
import smallTicket from "../components/smallTicket";

export default {
  name: 'Order',
  components: {
    OrderCard,
    OrderDetail,
    // smallTicket
  },
  data() {
    return {
      searchId: '',
      orderId: '',
      first: true,
      options: [{
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
  flex: 0 1 44%;
  margin-right: 10px;
  overflow-y: auto;

  .order-search-input {
    position: sticky;
    top: 0;
  }
}
</style>