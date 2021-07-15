<template>
  <div class="refMode">
    <!-- {{orderTableDatas}} -->
    <div class="ref-mode">选择退款方式</div>
    <!-- {{orderTableDatas}} -->
    <div
      class="ref-conte"
      v-for="(item, i) in orderTableDatas[1]"
      :key="i"
      :ref="item + i"
      :class="!item.switchs ? 'active' : ''"
    >
      <span style="margin-right: 20px">{{ item.payType }}</span>
      <span>实付: ￥{{ item.amount }}</span>
      <span v-show="!item.switchs">退款:</span>
      <el-input v-model="refunValue"  label="描述文字"></el-input>
      <span @click="refunTap(item, i)">{{
        item.switchs? "选择" : "取消"
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
      items: [],
      tabp: [],
      refundata:[],
      refunValue:1
    };
  },
  mounted() {
    this.orderTableDatas[1].forEach((v) => {
      this.$set(v, "switchs", true);
    });
  },
  watch: {
    "$parent.tid"(newValue, oldValue) {
      this.$router.go(0);
      if (newValue) {
        this.orderTableDatas[1].forEach((v) => {
          this.$set(v, "switchs", true);
        });
      }
    },
  },

  methods: {
    uncertain() {
      this.$parent.refundModes = false;
    },
    refunTap(item, i) {
      if (item.switchs) {
        if(!this.refundata.length == 0){
          this.refundata.forEach(v=>{
          if(v.ptype == item.payType){
            console.log('jjjj');
            v.price += this.orderTableDatas[0].price
          }else{
            console.log('kkk');
            this.refundata.push({
              ptype:item.payType,
              price:this.orderTableDatas[0].price
            })
          }
          })
        }else{
          if(this.refundata.indexOf(item.payType) == -1){
            this.refundata.push({
              ptype:item.payType,
              price:this.orderTableDatas[0].price
            })
          }
          
        }
        
          
          

        console.log(this.refundata);
        // item.ptype = this.orderTableDatas[0].ptype;

        // if (this.orderTableDatas[0].ptype) {
        //   if (this.orderTableDatas[0].ptype == item.payType) {
        //   } else {
        //     this.orderTableDatas[0].ptypes = item.payType;
        //   }
        // } else {
        //   this.orderTableDatas[0].ptype = item.payType;
        // }
        // if (!this.items.length == 0) {
        // } else {
        //   if (this.items.indexOf(item) == -1) {
        //     this.items.push(item);
        //   }
        // }
      } else {
        this.items.splice(i, 1);
      }
      item.switchs = !item.switchs;
    },
    chexSn() {
      this.orderTableDatas.push(this.items);
      this.orderTableDatas.push(this.refundata);
      this.orderTableDatas[1].forEach((v) => {
        if (!v.switchs) {
          this.$emit("products", this.orderTableDatas);
          this.orderTableDatas[1].forEach((v) => {
            v.switchs = true;
          });
          this.$parent.refundModes = false;
        } else {
          this.$message.error("请选择退款方式");
        }
      });
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
    margin-top: 35px;
    text-align: center;
  }
  .active {
    border: 1px solid #435dec !important;
  }
}
</style>