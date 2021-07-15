<template>
  <div class="refund">
    <div class="refund_hed">
      <span @click="previous"
        ><i class="el-icon-arrow-left" style="font-weight: 600"></i
        >返回订单管理</span
      >
      <div>订单号:{{ tid }}</div>
    </div>
    <div>
      <el-input ref="searchInput" type="search" v-model="searchGoodsNo">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="search()"
        ></el-button>
      </el-input>
    </div>
    <div class="refund_cont">
      <div class="cont_shp" style="position: relative">
        <span>可退商品列表</span>
        <ul>
          <li
            v-for="(item, i) in goodsTableData"
            :key="i"
            @click="refundMode(item, i)"
          >
            <div class="refou_list">
              <div style="margin-right: 10px">
                <img src="../images/5.png" alt="" style="width: 60px" />
              </div>
              <div>
                <div class="refou_list_top">
                  <p>{{ item.name }}</p>
                  <span>{{ item.spec }}</span>
                </div>
              </div>
            </div>
            <div class="refou_list_top" style="width: 32%; text-align: right">
              <span>￥{{ item.price }}</span>
              <div v-if="!item.sn">
                <el-button style="but" @click.stop="submit('Addition', i)"
                  >-</el-button
                >
                <span style="display: inline-block; margin: 0 5px">{{
                  item.quantity
                }}</span>
                <el-button style="but" @click.stop="submit('subtraction', i)"
                  >+</el-button
                >
              </div>
              <div v-else>
                <span>编码:{{ item.sn }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="cont_shp" style="border-left: 1px solid #bbbbbb">
        <span>退货商品列表</span>
        <ul>
            
          <li
            v-for="(item, i) in goodsTableDatas"
            :key="i"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
            @mouseout="hid = false"
            @mouseover="hid = true"
            style="position: relative; padding: 0 7px; margin-bottom: 10px"
          >
            <div class="refou_list">
              <div style="margin-right: 10px">
                <img src="../images/5.png" alt="" style="width: 60px" />
              </div>
              <div>
                <div class="refou_list_top">
                  <p>{{ item.name }}</p>
                  <span>{{ item.spec }}</span>
                </div>
              </div>
            </div>
            <div class="refou_list_top">
              <span>￥{{ item.price }}</span>
              <div>
                <span v-if="!item.sn">x{{ item.quantity }}</span>
                <span v-else>编码:{{ item.sn }}</span>
              </div>
            </div>
            <div
              style="
                background: #000;
                width: 50px;
                text-align: center;
                line-height: 45px;
              "
              @click="cancel(i)"
              v-show="hid"
            >
              <p style="color: #fff; font-size: 12px; height: 10px">取</p>

              <p style="color: #fff; font-size: 12px; height: 10px">消</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    {{items}}
    <div class="fun_btom">
      <div>退款信息：</div>
      <div>
        
        <span
          style="margin-right: 15px"
          v-for="(item, i) in items"
          :key="i"
          >{{ item.ptype }}:
          <i
            >￥{{
              item.price
            }}</i
          ></span
        >
      </div>
      <div>
        总计: <i>￥{{ orderTableData[0].paidAmount }}</i>
      </div>
      <div class="refun_confirm" @click="firmrefund">确认退货</div>
    </div>

    <div class="Refund_me" v-show="refundMe">
      <div class="Refund_me-cont">
        <refunMe
          name="refunMe"
          :refundMe="[orderTableDatas, refundMe, refundSn]"
          @amounts="amounts"
        ></refunMe>
      </div>
    </div>
    <div class="Refund_mode" v-show="refundModes">
      <div class="Refund_me-cont">
        
        <refundMode
          :orderTableDatas="[orderTableDatas, flowTableData]"
          @products="products"
        ></refundMode>
      </div>
    </div>
  </div>
</template>
<script>
import { FlowService, OrderService } from "@/services";
import { mapActions } from "vuex";
import { partRefund } from "@/api/index";
import refunMe from "../components/refunMe.vue";
import refundMode from "../components/refund-Mode.vue";

const statusMap = {
  unpaid: "未付款",
  wait_pay: "等待支付",
  partial_pay: "部分付款",
  pay_success: "支付成功",
  pay_fail: "支付失败",
  refund_success: "退款成功",
  refund_fail: "退款失败",
};

const payTypeMap = {
  wechat: "微信",
  alipay: "支付宝",
  combined: "组合支付",
  card: "银行卡",
  cash: "现金",
};

export default {
  data() {
    return {
      tid: "",
      goodsTableDat: [],
      goodsTableDatas: [],
      hid: false,
      canRefund: "",
      orderStatus: "",
      orderTableData: [],
      goodsTableData: [],
      flowTableData: [],
      Refundable: "",
      Refundables: "",
      commoditysn: [],
      searchGoodsNo: "",
      refundMe: false,
      refundMod: "",
      refundSn: "",
      refundModes: false,
      orderTableDatas: {},
      amount: "",
      flowTableDatas:[],
      items:[],
      tabp:[],
      tabps:[]
    };
  },
  components: {
    refunMe,
    refundMode,
  },
  created() {
    this.tid = this.$route.query.id;
  },
  mounted() {},
  watch: {
    tid(value) {
      if (value) {
        this.getOrderInfo(value);
      } else {
        this.orderTableData = [];
        this.goodsTableData = [];
        this.flowTableData = [];
        this.orderStatus = "";
      }
    },
    $route(to, from) {
      if (this.$route.query) {
        this.tid = to.query.id;
      }
      this.goodsTableDatas = [];
      this.goodsTableDat = [];
      this.flowTableDatas = []
    },
    goodsTableDatas(newValue, oldValue) {
      
      if (newValue.length == 0) {
         this.flowTableDatas = []
        
      } else { 
      }
    },
    flowTableData(newValue,oldValue){
      
    },
  },
  methods: {
    ...mapActions("order", ["refundWholeOrder"]),
    async getOrderInfo(i) {
      const [{ orderInfo, goodsList }, flowList] = await Promise.all([
        OrderService.getOrderDetail(i),
        FlowService.getFlowListByOrderId(i),
      ]);
      this.canRefund =
        (orderInfo.payStatus === "pay_success" ||
          orderInfo.payStatus === "partial_pay") &&
        orderInfo.refundAmount < orderInfo.paidAmount;
      orderInfo.payStatus = statusMap[orderInfo.payStatus] || "未知状态";
      orderInfo.payType = payTypeMap[orderInfo.payType] || "未知方式";
      this.orderStatus = orderInfo.payStatus;
      this.orderTableData = [orderInfo];
      this.goodsTableData = goodsList;
      // this.orderTableData[0].snGroup.forEach((v, i) => {
      //   this.goodsTableData[i].sn = v.sn;
      // });
      this.goodsTableData.forEach((v, i) => {
        if (v.sn) {
          this.goodsTableData.push(v);
          this.goodsTableData.splice(i, 1);
        }
      });
      this.flowTableData = flowList.map((flow) => ({
        ...flow,
        status: statusMap[flow.status] || "未知状态",
        commodity: false,
      }));
    },
    previous() {
      this.$router.go(-1);
    },
    //
    getQueryString(query) {
      // var query = url.search.substring('?');
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == "sn") {
          return pair[1];
        }
      }
      return false;
    },
    search() {
      var query = this.searchGoodsNo.split("?")[1];
      var snCode = this.getQueryString(query);
      this.goodsTableData.forEach((v, i) => {
        if (v.sn == snCode) {
          if (this.goodsTableDatas.indexOf(v) == -1) {
            // this.goodsTableDat.push(v);
            this.goodsTableDatas.push(v);
          }
        }
      });
    },
    submit(value, num) {
      switch (value) {
        case "Addition":
          this.goodsTableData[num].quantity <= 1
            ? this.$message.error("只剩一件商品了！")
            : this.goodsTableData[num].quantity--;

          break;
        case "subtraction":
          this.goodsTableData[num].quantity >= this.goodsTableData[num].quantity
            ? this.$message.error("只购买了这些商品！")
            : this.goodsTableData[num].quantity++;

          break;
      }
    },
    cancel(i) {
      this.flowTableDatas[0].price =  this.flowTableDatas[0].price - this.goodsTableDatas[i].price
      this.goodsTableDatas.splice(i,1);
       
    },
    firmrefund() {
      let goodsList = [];
      this.goodsTableDatas.map((v, i) => {
        goodsList.push({
          num: v.quantity,
          oid: v.id,
        });
      });
      if (!goodsList.length == 0) {
        partRefund({
          refund_mode: "part",
          original_tid: this.tid,
          goods_list: goodsList,
        }).then((res) => {
          if (res.status == 200) {
            this.$alert("退款成功", {});
          }
        });
      } else {
        this.$message.error("请选择退款商品");
      }
    },
    refundMode(item, index) {
      if(this.goodsTableDatas.indexOf(item) == -1){
        
          
        
          if (item.sn) {
          this.refundMe = true;
          this.refundSn = item.sn;
          this.orderTableDatas = item;
        } else {
          this.orderTableDatas = item;
          this.refundModes = true;
        
        }   
      }else{
        this.$message.error("已放入退款商品中")
      }
      
    },
    products(data) {
      console.log(data);
      this.items = data[3]
      if (this.goodsTableDatas.indexOf(data[0]) == -1) {
        this.goodsTableDatas.push(data[0]);
         let datas = []
            datas.push({
              ptype:data[0].ptype,
              price:data[0].price
            })

      this.tabp =  datas.filter((v)=>{
         return v.ptype == data[0].ptype
       })
       let pty = []
       pty.push(this.tabp[0])
       var ats = ''
       if(pty.length > 1){
         pty.forEach(v=>{
            ats = Number(ats) +Number(v.price)
           return ats
         })
         pty[0].price = ats
       }
         pty.splice(1)
         
         let tabps = {
           ptype:pty[0].ptype,
           price:pty[0].price
         }
         
         if(!this.flowTableDatas.length == 0){
                  this.flowTableDatas.forEach((v,i)=>{
                      if(v.ptype == tabps.ptype){
                        v.price = v.price + tabps.price
                        this.flowTableDatas.splice(i,1,v)
                      }else{
                        this.flowTableDatas.push(tabps)
                      }
                    })
         }else{
           this.flowTableDatas.push(tabps)
         }
      
      }
      
      
      
    },
    amounts(data) {
      this.amount = data;
    },
    
    //退款方式选择取消
    

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
      // 往左滑了一定距离，显示删除按钮
      if (this.startX - this.endX >= 10) {
        this.endX = this.startX - 120;
      } else {
        // 往左滑的距离太短或是向右滑，不显示删除按钮
        this.startX = 0;
        this.endX = 0;
      }
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
};
</script>
<style lang="scss" scoped>
.refund {
  position: relative;
  .fun_btom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px 20px;
    i {
      color: rgb(255, 75, 75);
    }
    div {
      margin-bottom: 10px;
    }
    .refun_confirm {
      padding: 20px 60px;
      background: #000000;
      color: #fff;
      position: absolute;
      top: 15%;
      right: 15%;
    }
  }
  .Refund_me {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(16, 16, 16, 0.7);
    .Refund_me-cont {
      width: 400px;
      min-height: 300px;
      position: absolute;
      top: 50%;
      left: 50%;
      background: #fff;
      margin-left: -200px;
      margin-top: -150px;
    }
  }
  .Refund_mode {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.7);
    .Refund_me-cont {
      width: 400px;
      min-height: 300px;
      position: absolute;
      top: 50%;
      left: 50%;
      background: #fff;
      margin-left: -200px;
      margin-top: -150px;
    }
  }
  .refund_hed {
    display: flex;
    margin: 20px 0;
    div {
      margin-left: 20%;
    }
  }
  .refund_cont {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
    .cont_shp {
      width: 50%;
      min-height: 300px;
      padding: 0 30px;

      .refun_typ {
        padding: 5px;
        border: 1px solid #bbb;
        border-radius: 5px;

        margin-bottom: 10px;
      }
      
      span {
        font-size: 16px;
        color: rgba(16, 16, 16, 100);
        margin-bottom: 10px;
        display: inline-block;
      }
      .refou_list {
        display: flex;
        align-items: center;
      }
    }
  }
}
.el-button {
  width: 30px;
  height: 30px;
  padding: 8px;
  font-size: 14px;
}
p {
  margin: 0;
  margin-bottom: 8px;
  font-size: 14px;
  color: rgba(16, 16, 16, 100);
}
ul {
  padding: 0;
}
li {
  width: auto;
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>