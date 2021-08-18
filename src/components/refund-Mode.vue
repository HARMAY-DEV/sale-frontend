<template>
  <div class="refMode">

    <div class="ref-mode">选择退款方式</div>
 <!-- {{$parent.items}} -->
<!-- {{orderTableDatas}} -->
    <div
      class="ref-conte"
      v-for="(item, i) in orderTableDatas[1]"
      :key="i"
      :ref="item + i"
      :class="!item.commodity ? 'active' : ''"
    >
      <span style="margin-right: 20px">{{ item.payType }}</span>
      <span>实付: ￥{{ item.amount }}</span>
      <span v-show="!item.commodity">退款: <el-input-number v-model="refunValue[i].price"  @change="refuchang"  :min="0" :max="feMaxs(item)" label="描述文字"></el-input-number></span>
      <span @click="refunTap(item, i)">{{
        item.commodity? "选择" : "取消"
      }}</span>
      
    </div>
    <div class="reMod_butn">
      <el-button type="info" @click="uncertain">取消</el-button>
      <el-button
        style="background: #000; color: #fff; margin-left: 20px"
        @click="chexSn"
        >确定</el-button
      >
    </div>
  </div>
</template>
<script>
export default {
  props: {
    orderTableDatas: Array,
  },
  data() {
    return {
      amount: "",
      items: [],//退款信息
      tabp: [],
      refundata:[],

      refunValue:[
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
      ], //退款金额
      feMax:0,
      
    };
  },
  mounted() {
    console.log('this.orderTableDatas',this.orderTableDatas);
    // this.orderTableDatas2=this.orderTableDatas
    this.orderTableDatas[1].forEach((v) => {
      this.$set(v, "commodity", true);
    });
    this.orderTableDatas[1].forEach(v=>{
        v.amounts = v.amount
    })
    // this.feMax =  this.orderTableDatas[0].price * this.orderTableDatas[0].quantity && 
  },
  watch: {
    "$parent.tid"(newValue, oldValue) {
      this.$router.go(0);
      if (newValue) {
        this.orderTableDatas[1].forEach((v) => {
          this.$set(v, "commodity", true);
        });
      }
    },
    '$parent.refundModes'(newVal,oldValue){
          this.refunValue.forEach(v=>{
            v.price = ""
          })
    }
  },

  methods: {
    uncertain() {
      this.$parent.refundModes = false;
    },
    refunTap(item, i) {
      
      
      item.commodity = !item.commodity;
    },
    refuchang(){
    },
    feMaxs(item){
      let pro = this.orderTableDatas[0].price * this.orderTableDatas[0].quantity
      return pro > item.amount?item.amount:pro;
    },
    chexSn() {

      let reValue = 0
      
      this.refunValue.forEach((v,i)=>{
        console.log(this.orderTableDatas[1][i]);
        if( this.orderTableDatas[1][i]) {
          if(v.price > this.orderTableDatas[1][i].amount - this.$parent.items[i].price){
            this.$message.error(`超出${v.ptype}退款金额`);
            return;
          }
          if(!v.price || v.price == null || v.price == undefined){
            v.price = 0
          }
          // 计算总计
          reValue = Number(reValue) + Number(v.price)
        }
      })
      // 判断总计是否超出或小于
      if(reValue > this.orderTableDatas[0].price * this.orderTableDatas[0].quantity){
        this.$message.error("超出退款金额");
        return
      }
      if(reValue < this.orderTableDatas[0].price * this.orderTableDatas[0].quantity){
        this.$message.error("小于退款金额");
        return
      }
      
      this.orderTableDatas.push(JSON.parse(JSON.stringify(this.refunValue)))
      // console.log('确定');
      // console.log(this.orderTableDatas[1]);
      this.orderTableDatas[1].forEach((v) => {
        if (!v.commodity) {
          v.commodity = true;
          if(this.orderTableDatas[0].list.length == 0){
            this.orderTableDatas[0].list.push(this.refunValue)
          }else{
            this.orderTableDatas[0].list[0].forEach((v,i)=>{
              v.price =  Number(v.price) + Number(this.refunValue[i].price)
            })  
          }
        }
      });
      this.$emit("products", this.orderTableDatas);
      this.$parent.refundModes = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.refMode {
  .ref-mode {
    margin: 30px 0;
    font-size: 18px;
    font-weight: 600;
    width: 100%;
    text-align: center;
    span {
      margin-left: 40px;
    }
  }
  .ref-conte {
    width: 80%;
    margin: auto;
    margin-top: 17px;
    padding: 10px 10px;
    border: 1px solid #f5f5f5;
    border-radius: 10px;
    font-size: 15px;
  }
  .reMod_butn {
    margin: 35px 0;
    text-align: center;
  }
  .active {
    border: 1px solid #435dec !important;
  }
}
</style>