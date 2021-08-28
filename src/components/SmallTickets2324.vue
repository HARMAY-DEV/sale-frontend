<template>
  <div class="small-ticket-container" ref="smallticket">
    <div class="font-Rotunda-regular color-1 font12 nav-title">
      <span>2012.06.20 SUN.</span>
      <span class="center">SHOPPING LIST</span>
      <span class="right">ALEX</span>
    </div>
    <div class="font12 font-Rotunda-light group-1 o-h" style="margin-top:5px;">
      <div class="color-1 font12 fl">
        <p >PLEASE CHECK THE ORDER DETAILS</p>
        <p>AND KEEP THIS RETURN SLIP FOR REFUND OR EXCHANGES</p>
        <p>请仔细核对您购买的商品明细，并保留此清单作为退换货的凭证。</p>
      </div>
      <div class="font12 fr">
        <span class="color-2 font32" style="line-height:1;">2</span>
        <span>/2</span>
      </div>
    </div>
    <div class="color-1 font12" style="margin-top:8px;">
      <p>BEIJING SANLITUN</p>
      <p>2 WORKERS' SPORTS COMPLEX N RD, CHAOYANG DISTRICT, BEIJING</p>
      <p>BUSINESS HOUR: 10:00-22:00</p>
      <p>CONTACT: 15210678315</p>
    </div>
    <div class="font12 group-3 o-h">
      <div class="color-2 fl" style="padding-top:3px;">
        <p>北京三里屯店：朝阳区工体北路首北兆龙饭店一层</p>
        <p>营业时间：10:00-22:00</p>
        <p>电话：15210678315</p>
      </div>
      <div class="fr">
        <p class="color-1 right">MD1571576228</p>
        <img src="@/assets/images/code01.png" style="width:181px;height:34px;margin-top:3px;">
      </div>
    </div>
    <div style="margin-top:20px;" class="font12 color-1 font-Rotunda-light group-4">
      <ul class="o-h">
        <li style="margin-top:15px;">
          <div class="fl">
            <div style="width: 200px;" class="fl">我是品牌</div>
            <div class=" fl">
              <p>我是商品</p>
              <p>我是详情</p>
            </div>
          </div>
          <div class="width200 fr" style="margin-left:30px;">
            <div class="fl">
              <p>
                CNY 345.00
                <span style="display:inline-block;padding:0 3px;border:1px solid #1A1311;margin-left:3px;">优惠</span>
              </p>
              <p class="color-2">CNY 345.00</p>
            </div>
            <div class="fr">1</div>
          </div>
        </li>
      </ul>
    </div>
    <div style="margin-top:20px;padding-bottom:5px;border-bottom:1px solid #1A1311;" class="flex-center-between font18 font-Rotunda-regular">
      <p>TOTAL</p>
      <div class="width200 o-h">
        <p class="fl">CNY 32023.00</p>
        <p class="fr">45</p>
      </div>
    </div>
    <div class="font-Rotunda-light font12 group-5 o-h">
      <div class="fl">
        <img src="@/assets/images/code3.png" style="width:80px;height:80px;" />
        <p class="font12" style="margin-top:5px;">扫码开具发票</p>
      </div>
      <ul class="total-result-box width200 fr">
        <li>
          <span>应 付</span>
          <span>35950.00</span>
        </li>
        <li>
          <span>优 惠</span>
          <span>CNY 35950.00</span>
        </li>
        <li>
          <span>話 梅</span>
          <span>17000颗</span>
        </li>
        <li>
          <span>微 信</span>
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
    <footer>
      <div class="center" style="padding-bottom:10px;margin-top:15px;">
        <img src="@/assets/images/code02.png"/>
      </div>
    </footer>
    <!-- <footer>
      <div style="margin-top:25px;" class="font12">
        <p class="color-1">"颗"IS HARMAY’S CREDIT UNIT, 100颗POINTS = CNY 1.00</p>
        <p class="color-1">FOR PRODUCTS HYGIENE AND SAFETY CONSIDERATIONS,</p>
        <p class="color-1">NO REFUNDS OR RETURNS AFTER PRODUCTS LEAVE THE STORE,</p>
        <p class="color-1">THANK YOU FOR YOUR UNDERSTANDING.</p>
        <p class="color-2" style="margin-top:5px;">"颗"为話梅积分单位，100颗話梅 = CNY 1.00</p>
        <p class="color-2">出于商品卫生安全考虑，商品离店后非质量问题不支持退换，请你谅解。</p>
      </div>
      <div class="center" style="padding-bottom:10px;margin-top:15px;">
        <img src="@/assets/images/code02.png"/>
      </div>
    </footer> -->
  </div>
</template>
<script>
import html2canvas from "html2canvas"
export default {
  data() {
    return {
      imgUrl: ''
    }
  },
  methods: {
    print() {
      html2canvas(this.$refs.smallticket).then(canvas => {
        console.log(canvas);
        console.log(canvas.width);
        console.log(canvas.height);
        canvas.width = '790'
        canvas.height = '1020'
        console.log(canvas.width);
        console.log(canvas.height);
        return
        let dataURL = canvas.toDataURL("image/png");
        this.imgUrl = dataURL;
        console.log(this.imgUrl);
        // if (this.imgUrl !== "") {
        //   this.dialogTableVisible = true;
        // }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
body, p, ul, li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.width200 {
  width: 200px;
}
.color-1 {
  color: #1A1311;
}
.color-2 {
  color: #5F5E5E;
}
.font-Rotunda-regular {
  font-family: "Rotunda regular";
}
.font-Rotunda-light {
  font-family: "Rotunda light";
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
.left {
  text-align: left;
}
.flex-1 {
  flex: 1;
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
  border: 1px solid #1A1311;
  position: relative;
  width: 790px;
  height: 704px;
}
.nav-title {
  padding-bottom:5px;
  border-bottom:1px solid #1A1311;
  overflow: hidden;
}
.nav-title span {
  display: block;
  width: 33%;
  float: left;
}
.o-h {
  overflow: hidden;
}
.group-5 {
  margin-top:10px;
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