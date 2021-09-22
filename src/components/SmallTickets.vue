<template>
  <div>
    <div v-for="i in page" :key="i" :ref="'smallticket'+i" class="small-ticket-container">
      <div class="ticket-top">
        <div class="font-Rotunda-regular color-1 flex-center-center font12 group-1">
          <span>{{date}} SUN.</span>
          <span>SHOPPING LIST</span>
          <span>ALEX</span>
        </div>
        <div class="flex-start-between font12 font-Rotunda-light group-2">
          <div class="color-1 font12">
            <p>PLEASE CHECK THE ORDER DETAILS</p>
            <p>AND KEEP THIS RETURN SLIP FOR REFUND OR EXCHANGES</p>
            <p>请仔细核对您购买的商品明细，并保留此清单作为退换货的凭证。</p>
          </div>
          <div class="flex-start-center font12">
            <span class="color-2 font32" style="line-height:1;">{{i}}</span>
            <span>/{{page}}</span>
          </div>
        </div>
        <div class="color-1 font12" style="margin-top:8px;">
          <p>BEIJING SANLITUN</p>
          <p>2 WORKERS' SPORTS COMPLEX N RD, CHAOYANG DISTRICT, BEIJING</p>
          <p>BUSINESS HOUR: 10:00-22:00</p>
          <p>CONTACT: 15210678315</p>
        </div>
        <div class="flex-end-between font12">
          <div class="color-2" style="padding-top:3px;">
            <p>北京三里屯店：朝阳区工体北路首北兆龙饭店一层</p>
            <p>营业时间：10:00-22:00</p>
            <p>电话：15210678315</p>
          </div>
          <div>
            <p class="color-1 right" style="margin-right:5px;" v-if="orderTableData.length>0">{{orderTableData[0].id}}</p>
            <img
               id="barcode"
              style="width:181px;height:34px;margin-top:3px;"
            />
          </div>
        </div>
      </div>
      <div class="font12 color-1 font-Rotunda-light content" ref="content">
        <ul class="good-list" ref="goodlist">
          <li class="flex-start-between" :class="i==1?(index>=pageIndexArr[i]?'hidden_none':'hidden_block'):(index>=pageIndexArr[i-1] && index<=pageIndexArr[i]?'hidden_block':'hidden_none')" style="margin-top:15px;" v-for="(item,index) in goodsTableData" :key="item.id" :ref="'index'+index">
            <div class="flex-start-between">
              <div style="width: 200px;">{{item.name}}</div>
              <div class="flex-1">
                <p>{{item.name}}</p>
                <p>{{item.spec}}</p>
              </div>
            </div>
            <div class="width200 flex-start-between" style="margin-left:30px;">
              <div>
                <p>
                  CNY  {{item.price | formatPrice}}
                  <span
                    style="display:inline-block;padding:0 3px;border:1px solid #1A1311;margin-left:3px;height:14px;line-height:16px;"
                    >优惠</span
                  >
                </p>
                <p class="color-2">CNY  {{item.price | formatPrice}}</p>
              </div>
              <div>{{item.quantity}}</div>
            </div>
          </li> 
        </ul>
        <div
          style="margin-top:20px;padding-bottom:5px;border-bottom:1px solid #1A1311;"
          :style="i==page?'opacity:1':'opacity:0'"
          ref="totalline"
          class="flex-center-between font18 font-Rotunda-regular"
        >
          <p>TOTAL</p>
          <div class="width200 flex-center-between">
            <p v-if="orderTableData.length>0">CNY {{orderTableData[0].payableAmount | formatPrice}}</p>
            <!-- <p>CNY 1241.00</p> -->
          </div>
        </div>
        <div
          class="flex-start-between font-Rotunda-light font12"
          style="margin-top:10px;"
          :style="i==page?'opacity:1':'opacity:0'"
          ref="result"
        >
          <div>
            <img src="@/assets/images/code3.png" style="width:80px;height:80px;" />
            <p class="font12" style="margin-top:5px;">扫码开具发票</p>
          </div>
          <ul class="total-result-box width200" v-if="orderTableData.length>0">
            <li>
              <span class="letter12">应付</span>
              <span>{{orderTableData[0].payableAmount | formatPrice}}</span>
              <!-- <span>1241.00</span> -->
            </li>
            <li>
              <span class="letter12">优惠</span>
              <span>CNY {{orderTableData[0].refundAmount | formatPrice}}</span>
            </li>
            <li>
              <span class="letter12">話梅</span>
              <span>17000颗</span>
            </li>
            <li>
              <span class="letter12">{{orderTableData[0].payType}}</span>
              <span>CNY {{orderTableData[0].payableAmount | formatPrice}}</span>
            </li>
            <li>
              <span>天目里</span>
              <span>7000积分</span>
            </li>
          </ul>
        </div>
      </div>
      <footer>
        <div class="center" style="padding: 15px 0 10px 0;" :class="[{'mt55': page>1&&i<page}]">
          <img src="@/assets/images/code02.png"/>
        </div>
      </footer>
      <footer v-if="i==page&&isShowFooter">
        <div style="margin-top:25px;" class="font12">
          <p class="color-1">
            "颗"IS HARMAY’S CREDIT UNIT, 100颗POINTS = CNY 1.00
          </p>
          <p class="color-1">FOR PRODUCTS HYGIENE AND SAFETY CONSIDERATIONS,</p>
          <p class="color-1">
            NO REFUNDS OR RETURNS AFTER PRODUCTS LEAVE THE STORE,
          </p>
          <p class="color-1">THANK YOU FOR YOUR UNDERSTANDING.</p>
          <p class="color-2" style="margin-top:5px;">
            "颗"为話梅积分单位，100颗話梅 = CNY 1.00
          </p>
          <p class="color-2">
            出于商品卫生安全考虑，商品离店后非质量问题不支持退换，请你谅解。
          </p>
        </div>
        <div class="center" style="padding-bottom:10px;margin-top:15px;">
          <img src="@/assets/images/code02.png"/>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
import JsBarcode from 'jsbarcode'
import html2canvas from "html2canvas";
import { setPrint,pageDisplay } from "@/api/index";

export default {
  props: {
    goodsTableData:{
      type:Array,
      default:function(){
            return []
      }
    },
    orderTableData:{
      type:Array,
      default:function(){
            return []
      }
    },
  },
  data() {
    return {
      goodlistHeight: 470,
      currentPage: 1,
      page: 2,
      pageIndexArr: [1],
      date: '',
      isShowFooter: false,
      ConnectionStatus:[],
      // goodsTableData:this.goodsTableData,
      alg:2
    };
  },
  watch: {
    goodsTableData: {
      deep: true,
      handler(val, oldVal) {
      }
    }
  },
  filters: {
    formatPrice(val) {
      return Number(val).toFixed(2)
    }
  },
  mounted() {
    this.date = this.getDay()
    if(this.orderTableData.length>0){
       JsBarcode("#barcode", this.orderTableData[0].id, {
      displayValue: false //是否显示文字信息
    })
    }
   
    this.goodsTableData = [
      {
        amount: 0,
        id: "8000647676",
        name: "N°2 斯德哥尔摩的剪影：邂逅冲突 15ml ",
        price: 189,
        quantity: "1",
        spec: "15ml"
      },
      {
        amount: 0,
        id: "11002345",
        name: "臻白晶透精华水",
        price: 45,
        quantity: "1",
        spec: "50ml"
      },
      {
        amount: 0,
        id: "11002324",
        name: "护肤精华露",
        price:142,
        quantity: "1",
        spec: "30ml"
      },
      {
        amount: 0,
        id: "11006957",
        name: "新塑颜紧致换白霜",
        price: 65,
        quantity: "1",
        spec: "15ml"
      },
      {
        amount: 0,
        id: "11020370",
        name: "塑颜修护凝霜水",
        price: 45,
        quantity: "1",
        spec: "50ml"
      },
      {
        amount: 0,
        id: "11008405",
        name: "特润修护精华眼霜",
        price: 434,
        quantity: "1",
        spec: "15ml"
      },
      {
        amount: 1,
        id: "232936619425",
        name: "恋旅流浪者小猪包女士香水EDT",
        price: 546,
        quantity: "1",
        spec: "50ml"
      },
//       {
//         amount: 1200,
//         id: "11020360",
//         name: "fs23",
//         price: 12,
//         quantity: "1",
//         spec: "fsdfsdbsx"
//       },
// //       {
//         amount: 2500,
// id: "11005929",
// name: "新水份缘保湿舒缓啫喱",
// price: 25,
// quantity: "1",
// spec: "50ml"
//       },
//       {
//        amount: 47200,
// id: "11007433",
// name: "韦博士灵芝焕能好底子饱水凝霜",
// price: 472,
// quantity: "1",
// spec: "50ml"
//       },
      // {
      //   amount: 4100,
      //   id: "11",
      //   name: "牙膏",
      //   price: 41,
      //   quantity: "1"
      // },
      // {
      //   amount: 4100,
      //   id: "12",
      //   name: "牙膏",
      //   price: 41,
      //   quantity: "1"
      // },
      // {
      //   amount: 4100,
      //   id: "13",
      //   name: "牙膏",
      //   price: 41,
      //   quantity: "1"
      // },{
      //   amount: 4100,
      //   id: "14",
      //   name: "牙膏",
      //   price: 41,
      //   quantity: "1"
      // },{
      //   amount: 4100,
      //   id: "15",
      //   name: "牙膏",
      //   price: 41,
      //   quantity: "1"
      // },{
      //   amount: 4100,
      //   id: "16",
      //   name: "牙膏",
      //   price: 41,
      //   quantity: "1"
      // },{
      //   amount: 4100,
      //   id: "17",
      //   name: "牙膏",
      //   price: 41,
      //   quantity: "1"
      // },{
      //   amount: 4100,
      //   id: "18",
      //   name: "牙膏",
      //   price: 41,
      //   quantity: "1"
      // },{
      //   amount: 4100,
      //   id: "19",
      //   name: "牙膏",
      //   price: 41,
      //   quantity: "1"
      // },{
      //   amount: 4100,
      //   id: "20",
      //   name: "牙膏",
      //   price: 41,
      //   quantity: "1"
      // },{
      //   amount: 4100,
      //   id: "21",
      //   name: "牙膏",
      //   price: 41,
      //   quantity: "1"
      // }
    ]
    this.refresh()
  },
  activated() {
    this.refresh()
  },
  methods: {
    getDay() {
      let myDate = new Date();
      let year = myDate.getFullYear();
      let month = myDate.getMonth()+1;
      let day = myDate.getDate();
      if(month < 10) {
        month = '0' + month
      }
      if(day < 10) {
        day = '0' + day
      }
      return `${year}-${month}-${day}`
    },
    refresh() {
      this.$nextTick(()=> {
        let height =(this.$refs.content[0].offsetHeight-226)
        // let height = this.$refs.goodlist[0].offsetHeight + this.$refs.totalline[0].offsetHeight + this.$refs.result[0].offsetHeight
        this.page =  Math.ceil(height/this.goodlistHeight) - 1
        this.isShowFooter = 1020-(this.$refs.result[0].offsetHeight+this.$refs.result[0].offsetTop) > 150
      console.log(this.$refs.result[0].offsetHeight+this.$refs.result[0].offsetTop,'[]');
        this.getGoodsListOffset()
      })
    },
    dataURLtoFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, { type: mime });
    },
    setFormData(data) {
      var params = new FormData();
      if (data) {
        for (var name in data) {
          params.append(name, data[name]);
        }
      }
      return params;
    },
    print() {
      let printList = this.ConnectionStatus.map((item,index)=>{
        if(item.printState==1){
          return item.printName
        }
        
      })
      for(let i = 1; i < this.page+1; i++) {
        console.log('page',i);
        html2canvas(this.$refs['smallticket'+[i]][0]).then((canvas) => {
          console.log(canvas);
          let dataURL = canvas.toDataURL("image/png");
          this.imgUrl = dataURL;
          console.log(this.imgUrl);
          let file = this.dataURLtoFile(dataURL);
          var params = this.setFormData({
            file: file,
            printName: printList,
            uid: 2,
          });
          setPrint(params).then((res) => {
            console.log(res);
          });
        });
      }
    },
    getGoodsListOffset(fn) {
      // 元素的高度
      var totalHeight = 0
      var contentHeight = this.$refs.content[0].offsetHeight-226
      
      if(contentHeight > this.goodlistHeight) {
        for(let i = 0; i < this.goodsTableData.length; i++) {
          let itemHeight = this.$refs['index'+[i]][0].offsetHeight
          totalHeight += Number(itemHeight)
          if(totalHeight > this.goodlistHeight) {
            if(totalHeight - this.goodlistHeight < itemHeight ) {
              this.pageIndexArr[1] = i-1
              break
            }
          }
        }
      }
      this.forPage()
    },
    forPage() {
      console.log(this.page);
      for(let pageIdx = 1; pageIdx < this.page; pageIdx++) {
        var totalHeight = 0
        if(pageIdx < this.page) {
          for(let i = this.pageIndexArr[pageIdx]; i < this.goodsTableData.length; i++) {
            let itemHeight = this.$refs['index'+[i]][0].offsetHeight
            console.log(i);
            totalHeight += Number(itemHeight)
            console.log('totalHeight',totalHeight);
            console.log(i == this.goodsTableData.length-1);
            if(totalHeight > this.goodlistHeight || i == this.goodsTableData.length-1) {
              this.pageIndexArr[pageIdx+1] = i
            }
      console.log('this.pageIndexArr',this.pageIndexArr);

          }
        }
      }
    }
  },
  created(){
    pageDisplay(this.alg).then(res=>{
      console.log(res,'10');
      this.ConnectionStatus = res.data
    })
  }
};
</script>
<style lang="scss" scoped>
body,
p,
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
  line-height: 16px;
}
.width200 {
  width: 200px;
}
.mt55 {
  margin-top: 55px;
}
.color-1 {
  color: #1a1311;
}
.color-2 {
  color: #5f5e5e;
}
.font-Rotunda-regular {
  font-family: "Rotunda regular";
}
.font-Rotunda-light {
  font-family: "Rotunda light";
}
.font-Rotunda-light,
.font-Rotunda-regular {
  font-family: "Rotunda";
}
.font12 {
  font-size: 12px;
}
.font18 {
  font-size: 18px;
}
.font32 {
  font-size: 32px;
}
.center {
  text-align: center;
}
.right {
  text-align: right;
}
.flex-1 {
  flex: 1;
}
.letter12 {
  letter-spacing: 12px;
}
.hidden_block {
  display: flex!important;
}
.hidden_none {
  display: none!important;
}
.flex-center {
  display: flex;
  align-items: center;
}
.flex-center-center {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.flex-start-center {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.flex-start-between {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.flex-end-between {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.flex-center-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
.small-ticket-container {
  padding: 20px;
  width: 790px;
  height: 980px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -11;
  // z-index: 9999999;
  background: #fff;
}
.ticket-top {
  position: absolute;
  left: 20px;
  right: 20px;
}
.group-1 {
  padding-bottom: 8px;
  border-bottom: 1px solid #1a1311;
}
.group-2 {
  margin-top: 8px;
}
.content {
  padding-top: 226px;
  // position: absolute;
  // width: calc(100% - 40px);
  // top: 246px;
}
.total-result-box li {
  display: flex;
  align-items: center;
  margin-top: 3px;
}
.total-result-box > li > span:first-child {
  width: 60px;
  margin-right: 30px;
}
footer {
  padding: 0 20px 20px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
}
</style>
