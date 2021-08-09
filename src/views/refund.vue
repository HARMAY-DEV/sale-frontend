<template>
 <div style="background: #F8F8F8;padding: 0;position: relative;">
   <div style="display: none;" class="refund">
     <div class="refund_hed">
      <span @click="previous"
      ><i class="el-icon-arrow-left" style="font-weight: 600"></i
      >返回订单管理</span
      >
       <div>订单号:{{ tid }}</div>
       {{goodsTableDatas}}
     </div>
     <div class="refund_cont">
       <div class="cont_shp" style="position: relative">
         <span>可退商品列表</span>
         <ul>
           <li
               @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"
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
             <div class="refou_list_top" style="width: 32%; text-align: center;">
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
               <div v-else style="position: absolute;right:20px;">
                 <span>编码:{{ item.sn.substr(0,5)+'******' }}</span>
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
               style="position: relative; margin-bottom: 10px"
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
             <div class="refou_list_top2" :style="{marginRight: marginRight + 'px'}">
               <span>￥{{ item.price }}</span>
               <div>
                 <span v-if="!item.sn">x{{ item.quantity }}</span>
                 <span v-else>编码:{{ item.sn.substr(0,7)+'******' }}</span>
               </div>
             </div>
             <!--            <div-->
             <!--              style="-->
             <!--                background: #000;-->
             <!--                width: 50px;-->
             <!--                text-align: center;-->
             <!--                line-height: 45px;-->
             <!--              "-->
             <!--              @click="cancel(i,item)"-->
             <!--              v-show="hid"-->
             <!--            >-->
             <!--              <p style="color: #fff; font-size: 12px; height: 10px">取</p>-->

             <!--              <p style="color: #fff; font-size: 12px; height: 10px">消</p>-->
             <!--            </div>-->
             <div
                 style="
                    background: #000;
                    width: 50px;
                    text-align: center;
                    line-height: 45px;
                    position: absolute;
                    right: 0;
                    height: 70px;
                  "
                 @click="cancel(i,item)"
             >
               <p style="color: #fff; font-size: 12px; height: 10px">取</p>

               <p style="color: #fff; font-size: 12px; height: 10px">消</p>
             </div>

           </li>
         </ul>
       </div>
     </div>
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
         总计: <i>￥{{ funBt }}</i>
       </div>
       <div class="refun_confirm" @click="firmrefund">确认退货</div>
     </div>
     <div class="refund_prop" v-if="prop">
       <div class="prop">
         <img src="../images/6.png" alt="" style="width: 60px" />
         <div style="margin:20px 0;">退款成功</div>
         <div style="color:rgba(142, 142, 142, 100);">已完成退款(2秒后自动关闭)</div>
       </div>
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
   <div >
     <div @click="previous" class="top">
       <i class="el-icon-arrow-left" style="font-weight: 600;font-size: 24px;position: absolute;left: 0;"></i>
       <p style="font-size: 19px;color: #282828;line-height: 25px;font-weight: 600;position: absolute;left: 24px;">可退商品列表</p>
       <p style="font-size: 19px;color: #282828;line-height: 25px;font-weight: 600;text-align: center;">订单号：1000001</p>
     </div>
     <div class="list">
       <img src="" class="listImg" alt="">
       <div class="listRight">
        <div style="display: flex;align-items: center;">
          <p style="font-size: 20px;color: #000000;line-height: 28px;flex: 1;">WIS 净透理肤套装 水乳套盒正品补水控油化妆品清爽保湿水乳官网</p>
          <p style="font-size: 20px;color: #000000;font-weight: 600;">¥ 530.5</p>
        </div>
         <p style="font-size: 18px;color: #7C8285;text-align: right;line-height: 25px;margin-top: 15px;margin-right: 6px;">X1</p>
         <div style="display: flex;align-items: center;">
           <span style="background: #F8F8F8;border-radius: 3px;font-size: 18px;color: #7C8285;line-height: 36px;padding: 0 14px 0 5px;">【补水焕肤 提亮肤色】4件套   50ml</span>
           <p style="flex: 1;text-align: right;font-size: 18px;color: #7C8285;margin-right: 6px;">条码：4571193601221</p>
         </div>
       </div>
     </div>
     <div class="footer">
        <div class="footerLeft">
          <p style="font-size: 18px;line-height: 25px;">退款信息：</p>
          <div style="display: flex;align-items: center;margin-top: 18px;">
            <p style="font-size: 16px;line-height: 22px;margin-right: 48px;">支付宝：<span style="color: #B51F29;">¥ 0</span></p>
            <p style="font-size: 16px;line-height: 22px;margin-right: 48px;">微信：<span style="color: #B51F29;">¥ 0</span></p>
          </div>
          <p style="font-size: 16px;margin-top: 9px;line-height: 22px;">总计：<span style="color: #B51F29;">¥ 0</span></p>
        </div>
        <el-button style="width: 134px;height: 66px;background: #000;color: #fff;border-radius: 10px;margin-right: 24px;font-size: 20px;">确认退款</el-button>
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
      prop:false,
      items:[
        {
          ptype:'现金',
          price:0
        },{
          ptype:'微信',
          price:0
        },{
          ptype:'支付宝',
          price:0
        }
      ],
      tabp:[],
      tabps:[],
      historyList:[],
      funBt:'',
      startX: 0,
      endX: 0,
    };
  },
  components: {
    refunMe,
    refundMode,
  },
  created() {
    this.tid = this.$route.query.id;
  },
  mounted() {

  },
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
    prop(newValue,oldValue){
        if(newValue){
          setTimeout(()=>{
            this.prop = false
            this.$router.go(-1)
          },2000)
        }
    },

      
      
  },
  methods: {
    ...mapActions("order", ["refundWholeOrder"]),
    async getOrderInfo(i) {
      const [{ orderInfo, goodsList }, flowList] = await Promise.all([
        OrderService.getOrderDetail(i),
        FlowService.getFlowListByOrderId(i),
      ]);
      // const orderInfo = {
      //     id: "863031505729881088",
      //     paidAmount: 472,
      //     payStatus: "pay_success",
      //     payType: "combined",
      //     payableAmount: 472,
      //     refundAmount: 0,
      //     status: "completed",
      //     time: "2021-07-09 12:19:05",
      // }
      // const goodsList = [{
      //   amount: 47200,
      //   id: "111",
      //   name: "韦博士灵芝焕能好底子饱水凝霜",
      //   price: 100,
      //   quantity: "5",
      //   sn:'',
      //   spec: "50ml"
      // },{
      //   amount: 47210,
      //   id: "110074332",
      //   name: "阿萨德好看大石街道 ",
      //   price: 100,
      //   quantity: "2",
      //   sn:'z1622883648894',
      //   spec: "50ml"
      // }]
      // const flowList = [
      //   {
      //     amount: 200,
      //     id: "863031530035873792",
      //     payType: "现金",
      //     status: "pay_success",
      //     time: "2021-07-09 12:19:11",
      //   },{
      //     amount: 200,
      //     id: "863031544392976384",
      //     payType: "微信",
      //     status: "pay_success",
      //     time: "2021-07-09 12:19:14",
      //   },
      //   {
      //     amount: 300,
      //     id: "863031544392976384",
      //     payType: "支付宝",
      //     status: "pay_success",
      //     time: "2021-07-09 12:19:14",
      //   },
      // ]
      this.historyList =JSON.parse(JSON.stringify(goodsList))
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
        commodity: true,
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
      if(this.searchGoodsNo.indexOf('https') ==-1){
        this.goodsTableData.forEach((v,i)=>{
          if(this.searchGoodsNo == v.sn ){
            this.refundMode(v,i)
          }
        })
      }else {
        for(var i =0 ;i <this.goodsTableData.length;i++){
          if(this.goodsTableData[i].sn == '' || this.goodsTableData[i].sn == null || this.goodsTableData[i].sn == undefined){
            if(Number(this.searchGoodsNo) == Number(this.goodsTableData[i].id)){
              this.refundMode(this.goodsTableData[i],i)
            }
          }
        }
      }
      // var query = this.searchGoodsNo.split("?")[1];
      // var snCode = this.getQueryString(query);
      // console.log()
      // this.goodsTableData.forEach((v, i) => {
      //   if (v.sn == snCode) {
      //     if (this.goodsTableDatas.indexOf(v) == -1) {
      //       // this.goodsTableDat.push(v);
      //       this.goodsTableDatas.push(v);
      //     }
      //   }
      // });
    },
    submit(value, num) {
      
      switch (value) {
        case "Addition":
          this.goodsTableData[num].quantity <= 1
            ? this.$message.error("只剩一件商品了！")
            : this.goodsTableData[num].quantity--;

          break;
        case "subtraction":
          if (this.goodsTableDatas.length==0 && Number(this.goodsTableData[num].quantity) < Number(this.historyList[num].quantity)){
            this.goodsTableData[num].quantity++;
            return;
          }
          if(this.goodsTableData[num].quantity >= this.historyList[num].quantity ||
              Number(this.goodsTableData[num].quantity) + Number(this.goodsTableDatas[num].quantity) >= Number(this.historyList[num].quantity)){
                this.$message.error("只购买了这些商品！")
          }else{
            this.goodsTableData[num].quantity++;
          }
          break;
      }
    },
    cancel(i,item) {
      this.funBt = ''
      this.goodsTableData[i].quantity = this.historyList[i].quantity
      // this.flowTableDatas[0].price =  this.flowTableDatas[0].price - this.goodsTableDatas[i].price
      for(var e = 0;e<item.list[0].length;e++){
          this.items[e].price = this.items[e].price - item.list[0][e].price
      }
      for(var v =0;v<this.items.length;v++){
        console.log('金额')
        console.log(this.items[v].price)
        
        this.funBt = Number(this.funBt)+ Number(this.items[v].price)
      }
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
          console.log(res);
          if (res.status == 200) {
            this.prop = true
          }
        });
      } else {
        this.$message.error("请选择退款商品");
      }
    },
    refundMode(item, index) {
      if(item.quantity == 0){
        return this.$message.error("已放入退款商品中")
      }
      if(this.goodsTableDatas.indexOf(item) == -1){
          if (item.sn) {
          this.refundMe = true;
          this.refundSn = item.sn;
          this.orderTableDatas = item;
        } else {
          this.orderTableDatas = item;
          this.refundModes = true;
        
        }
        if(this.orderTableDatas.list){
            return
        }
        this.orderTableDatas.list = []   
      }
      
    },
    products(data) {
      this.funBt = ''
      let data2 = data[2]
      console.log(data);
        for(var i=0;i<data2.length;i++){
          
         this.items[i].price += data2[i].price
        }  
      for(var e =0;e<this.items.length;e++){
        
        this.funBt = Number(this.funBt)+ Number(this.items[e].price)
      }
      if(!this.goodsTableDatas.length == 0){
        this.goodsTableDatas.forEach((v,i)=>{
              if (v.id == data[0].id && !data[0].sn && data[0].sn !=null && data[0].sn != undefined) {
                  
                  v.quantity +=data[0].quantity
                  // v.list = data[0].list
                  v.list[0].forEach((item,index)=>{
                      item.price = data[0].list[0][index].price
                  })
                
              }else{
                this.goodsTableDatas.push(JSON.parse(JSON.stringify(data[0])));
              }
              
                  
      })
      }else{
        this.goodsTableDatas.push(JSON.parse(JSON.stringify(data[0])));
       
      }
      //  this.goodsTableDatas.push(JSON.parse(JSON.stringify(data[0])));
       this.goodsTableData.forEach((v,i)=>{
                      if(!v.sn && v.id == this.goodsTableDatas[i].id){
                        v.quantity = this.historyList[i].quantity - this.goodsTableDatas[i].quantity
                      }
                })

      console.log('打印打印')
      console.log(this.goodsTableDatas)
      
      
      
      
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
      if (this.startX - this.endX >= 10) {
        this.endX = this.startX - 120;
      } else {
        // 往左滑的距离太短或是向右滑，不显示删除按钮
        this.startX = 0;
        this.endX = 0;
      }

    }
  },
  computed: {
    marginRight() {
      if (this.endX === 0) return 0;

      const value = this.startX - this.endX;

      if (value >= 50) return 50;
      else if (value <= 0) return 0;
      else return value;
    },
  }
};
</script>
<style lang="scss" scoped>
.refund {
  position: relative;
  .refund_prop{
    width: 100%;
      height: 100%;
      background: rgba($color: #000000, $alpha: 0.7);
      position: absolute;
      left: 0;
      top: 0;
      .prop{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 375px;
        height: 186px;
        margin-left: -177px;
        margin-top: -93px;
        padding: 30px 0;
        background: #fff;
        line-height: 20px;
        text-align: center;
      }
  }
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
  padding: 0;
  margin: 0;
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
.refou_list_top2{
  background: #fff;
  position: relative;
  z-index: 999;
  height: 70px;
  min-width: 50px;
}

//改版UI
.top{
  position: relative;
  width: 98%;
  padding-top: 30px;
  margin: 0 auto 22px auto;
}
.list{
  width: 97%;
  margin: 12px auto 0 auto;
  background: #fff;
  border-radius: 2px;
  height: 144px;
  display: flex;
  align-items: center;
  .listImg{
    width: 100px;
    height: 100px;
    background: #eee;
    margin-left: 28px;
  }
  .listRight{
    margin-left: 20px;
    flex: 1;
    margin-right: 36px;
  }
}
.footer{
  width: 100%;
  height: 140px;
  background: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  .footerLeft{
    margin-left: 24px;
    color: #fff;
    flex: 1;
  }
}


</style>