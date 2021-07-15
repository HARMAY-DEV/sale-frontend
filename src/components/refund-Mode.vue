<template>
  <div class="refMode">
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
      <span v-show="!item.switchs">退款: ￥{{ orderTableDatas[0].price }}</span>
      <span @click="refunTap(item, i)">{{
        item.switchs ? "选择" : "取消"
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
      tabp:[]
    };
  },
  mounted() {
    this.orderTableDatas[1].forEach((v) => {
      this.$set(v, "switchs", true);
    });
  },
  watch: {
    "$parent.tid"(newValue, oldValue) {
      if (newValue) {
        this.orderTableDatas[1].forEach((v) => {
          this.$set(v, "switchs", true);
        });
      }
    },
  },
  methods: {
    uncertain() {
      //  this.orderTableDatas[1].forEach(v=>{
      //      v.switchs = true
      //  })
      //  console.log(this.orderTableDatas[1]);
      this.$parent.refundModes = false;
    },
    refunTap(item, i) {
      if (item.switchs) {
    //       var objDeepCopy = function (source) {
    //     var sourceCopy = source instanceof Array ? [] : {};
    //     for (var item in source) {
    //       sourceCopy[item] =
    //         typeof source[item] === "object"
    //           ? objDeepCopy(source[item])
    //           : source[item];
    //     }
    //     return sourceCopy;
    //   };
        // console.log(item);
        // item.amounts =
        //   item.amount - this.orderTableDatas[0].price < 0
        //     ? item.amounts
        //     : this.orderTableDatas[0].price;
        
        item.ptype = this.orderTableDatas[0].ptype
        // this.tabp.push(this.orderTableDatas[0])
        // console.log(this.tabp,"指定不变的值深拷贝");
        // console.log(item.amounts);
        // console.log(this.orderTableDatas,'点击的时候的值');
        if (this.orderTableDatas[0].ptype) {
          if (this.orderTableDatas[0].ptype == item.payType) {
          } else {
            this.orderTableDatas[0].ptypes = item.payType;
          }
        } else {
          this.orderTableDatas[0].ptype = item.payType;
        }

        if (!this.items.length == 0) {
        //   if (item.payType == this.items[i].payType) {
        //     // this.items[i].amounts += this.orderTableDatas[0].price
        //     console.log(this.orderTableDatas[0].price, "15418515515");
        //   }
        // console.log(this.items,this.tabp);
        // this.items.forEach((value,index)=>{
            
        //     this.tabp.forEach((v,i)=>{
        //         if(v.payType == value.payType){
        //             if(this.tabp.length >1){
        //                 value.amounts = v.amounts + this.tabp
        //             }
                    
        //         }
        //     })
        // })
        
        } else {
          if (this.items.indexOf(item) == -1) {
            this.items.push(item);
            
          }
        //   console.log(this.items, "12");
        }
      } else {
        this.items.splice(i, 1);
        // console.log(this.items, "退款信息");
      }
      item.switchs = !item.switchs;
      // if(!item.switchs){
      //     // this.$refs[item+i][0].$el.style.display = 'none'

      // }
    },
    chexSn() {
      this.orderTableDatas.push(this.items);
    //   console.log(this.orderTableDatas, "确定点击值");
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
    deepclone(obj) {
      let objClone = Array.isArray(obj) ? [] : {};
      if (obj && typeof obj === "object") {
        for (let key in obj) {
          if (obj[key] && typeof obj[key] === "object") {
            objClone[key] = deepClone(obj[key]);
          } else {
            objClone[key] = obj[key];
          }
        }
      }
      return objClone;
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