<template>
  <div class="small-ticket-container" ref="smallticket">
    <div class="font-Rotunda-regular color-1 flex-center-center font12 group-1">
      <span>2012.06.20 SUN.</span>
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
        <span class="color-2 font32" style="line-height:1;">{{currentPage}}</span>
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
        <p class="color-1 right">{{orderTableData[0].id}}</p>
        <img
          src="@/assets/images/code01.png"
          style="width:181px;height:34px;margin-top:3px;"
        />
      </div>
    </div>
    <div style="margin-top:20px;" class="font12 color-1 font-Rotunda-light" ref="goodlist">
      <ul>
        <li class="flex-start-between" style="margin-top:15px;" v-for="(item,index) in goodsTableData" :key="item.id" :ref="'index'+index">
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
    </div>
    <div
      style="margin-top:20px;padding-bottom:5px;border-bottom:1px solid #1A1311;"
      class="flex-center-between font18 font-Rotunda-regular"
    >
      <p>TOTAL</p>
      <div class="width200 flex-center-between">
        <p>CNY {{orderTableData[0].payableAmount | formatPrice}}</p>
        <p></p>
      </div>
    </div>
    <div
      class="flex-start-between font-Rotunda-light font12"
      style="margin-top:10px;"
    >
      <div>
        <img src="@/assets/images/code3.png" style="width:80px;height:80px;" />
        <p class="font12" style="margin-top:5px;">扫码开具发票</p>
      </div>
      <ul class="total-result-box width200">
        <li>
          <span class="letter12">应付</span>
          <span>{{orderTableData[0].payableAmount | formatPrice}}</span>
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
          <span class="letter12">微信</span>
          <span>CNY 5000.00</span>
        </li>
        <li>
          <span>支付宝</span>
          <span>CNY 3999.00</span>
        </li>
        <li>
          <span>天目里</span>
          <span>7000积分</span>
        </li>
      </ul>
    </div>
    <footer v-if="currentPage==1">
      <div class="center" style="padding-bottom:10px;margin-top:15px;">
        <img src="@/assets/images/code02.png"/>
      </div>
    </footer>
    <footer v-else>
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
        <img src="@/assets/images/code02.png" />
      </div>
    </footer>
  </div>
</template>
<script>
import html2canvas from "html2canvas";
import { setPrint } from "@/api/index";

export default {
  props: {
    goodsTableData: Array,
    orderTableData: Array
  },
  data() {
    return {
      goodlistHeight: 470,
      currentPage: 1,
      page: 1
    };
  },
  // watch: {
  //   goodsTableData: {
  //     deep: true,
  //     handler(val, oldVal) {
  //     }
  //   }
  // },
  filters: {
    formatPrice(val) {
      return Number(val).toFixed(2)
    }
  },
  mounted() {
    this.goodsTableData = [
      {
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },
      {
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },
      {
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },
      {
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },
      {
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },

      {
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },
      {
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },
      {
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },
      {
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },
      {
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },
      {
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },
      {
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },
      {
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },{
        amount: 4100,
        id: "11006957",
        name: "牙膏",
        price: 41,
        quantity: "1"
      },
    ]
    this.getGoodsListOffset()
  },
  activated() {
    this.getGoodsListOffset()
  },
  methods: {
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
      html2canvas(this.$refs.smallticket).then((canvas) => {
        console.log(canvas);
        let dataURL = canvas.toDataURL("image/png");
        this.imgUrl = dataURL;
        console.log(this.imgUrl);
        let file = this.dataURLtoFile(dataURL);
        var params = this.setFormData({
          file: file,
          printName: [
            "EPSON M2110 NO.1",
            "EPSON M2110 NO.1",
            "EPSON M2110 NO.1",
          ],
          uid: 1,
        });
        setPrint(params).then((res) => {
          console.log(res);
        });
      });
    },
    getGoodsListOffset() {
      // 元素距离顶部的距离
      console.log(this.$refs.goodlist.getBoundingClientRect().top);
      // 元素的高度
      this.$nextTick(()=> {
        if(this.$refs.goodlist.offsetHeight > this.goodlistHeight) {
          for(let i = 0; i < this.goodsTableData; i++) {
            console.log(this.$refs.index[i]);
          }
        }
        console.log(this.$refs.goodlist.offsetHeight/this.goodlistHeight);
      })
    }
  },
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
}
.small-ticket-container {
  padding: 19.8px;
  width: 790px;
  height: 1020px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999999;
  background: #fff;
}
.group-1 {
  padding-bottom: 8px;
  border-bottom: 1px solid #1a1311;
}
.group-2 {
  margin-top: 8px;
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
  padding: 0 19.5px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 19.5px;
}
</style>
